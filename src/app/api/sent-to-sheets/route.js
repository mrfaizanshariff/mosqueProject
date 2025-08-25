// src/app/api/sent-to-sheets/route.js
export const dynamic = 'force-dynamic';

import { google } from 'googleapis';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Reusable S3 client (one per module)
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g. 'ap-south-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});


function objectPublicUrl(key) {
  const bucket = process.env.S3_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  // Virtual-hosted-style URL
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`; 
}

function guessExt(file) {
  const name = typeof file.name === 'string' ? file.name : '';
  const dotIdx = name.lastIndexOf('.');
  if (dotIdx !== -1) return name.slice(dotIdx).toLowerCase();
  // fallback to MIME type
  const type = file.type || '';
  if (type === 'image/jpeg' || type === 'image/jpg') return '.jpg';
  if (type === 'image/png') return '.png';
  if (type === 'image/webp') return '.webp';
  if (type === 'image/gif') return '.gif';
  return '';
}

export async function POST(request) {
  try {
    // Parse multipart form data
    const contentType = request.headers.get('content-type') || '';
    let fields = {};
    let images = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      // Extract fields and images
      for (const [key, value] of formData.entries()) {
       if (key === 'images' && typeof value === 'object' && value && typeof value.arrayBuffer === 'function') {
  images.push(value);
} else {
          // Try to parse JSON fields (location, prayerTimes, facilities)
          if (['location', 'prayerTimes', 'facilities'].includes(key)) {
            try {
              fields[key] = JSON.parse(value);
            } catch {
              fields[key] = value;
            }
          } else {
            fields[key] = value;
          }
        }
      }
    } else {
      // fallback to JSON body
      fields = await request.json();
    }

    const {
      mosqueName,
      otherMosqueName,
      phone,
      email,
      website,
      location,
      prayerTimes,
      facilities,
      description,
      city
    } = fields;

      const uploadedImageUrls = [];
      const currentDate = new Date();
      // Format date as 'Aug-21-2025'
      const formattedDate = currentDate.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).replace(',', '').replace(' ', '-').replace(' ', '-');
  
      // Ensure S3 envs exist
if (!process.env.S3_BUCKET_NAME || !process.env.AWS_REGION) {
  throw new Error('S3_BUCKET_NAME or AWS_REGION is not configured');
}
const basePrefix = 'mosques'; // keep a folder-like prefix in S3

for (const img of images) {
  // Convert web File to Node Buffer
  const buffer = Buffer.from(await img.arrayBuffer());

  // Build a safe, structured key: mosques/{city}/{mosque}/{timestamp-rand}.{ext}
  const ext = guessExt(img);
  const safeCity = (city || 'unknown-city').toString().replace(/[^\w\-]+/g, '-');
  const safeMosque = (mosqueName || otherMosqueName || 'unknown-mosque')
    .toString()
    .replace(/[^\w\-]+/g, '-');
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const key = `${basePrefix}/${safeCity}/${safeMosque}/${unique}${ext}`;

  // Put the object to S3 with correct ContentType
  const put = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: img.type || 'application/octet-stream',
  });

  await s3.send(put);

  // If public: store a browsable URL; if private: store the key instead
  const urlOrKey = process.env.PUBLIC_S3 ? objectPublicUrl(key) : key;
  uploadedImageUrls.push(urlOrKey);
}
    
    const values = [
      [
        city || '',
        mosqueName || '',
        otherMosqueName || '',
        phone || '',
        email || '',
        website || '',
        location?.lat || 0,
        location?.lng || 0,
        prayerTimes?.Fajr || '00:00',
        prayerTimes?.Zuhar || '00:00',
        prayerTimes?.Asr || '00:00',
        prayerTimes?.Maghrib || '00:00',
        prayerTimes?.Isha || '00:00',
        prayerTimes?.Jummah || '00:00',
        facilities && Array.isArray(facilities) ? facilities.join(', ') : '',
        description || '',
        uploadedImageUrls.join(', '),  // Store image names (or URLs if uploaded elsewhere)
        formattedDate || '',
      ],
    ];

    // Parse credentials with detailed error handling
    let credentials;
    try {
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set');
      }
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      
      // Validate required fields
      if (!credentials.client_email || !credentials.private_key) {
        throw new Error('Missing required credentials fields');
      }
    } catch (parseError) {
      console.error('Credentials parsing error:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Google credentials configuration',
          detail: parseError.message 
        }),
        { status: 500 }
      );
    }

    // Clean and format the private key
    const privateKey = credentials.private_key.replace(/\\n/g, '\n');
    
    // Initialize Google Auth with the service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Append data to sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:A',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values
      },
    });

    return Response.json({ 
      success: true, 
      result: response.data,
      uploadedImages: uploadedImageUrls,
      message: 'Data successfully added to Google Sheets'
    });

  } catch (err) {
    console.error('Google Sheets API error:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
      details: err.errors,
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to write to Google Sheets', 
        detail: err.message, 
        code: err.code || 'UNKNOWN_ERROR'
      }),
      { status: 500 }
    );
  }
}
