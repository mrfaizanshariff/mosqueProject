// src/app/api/sent-to-sheets/route.js
export const dynamic = 'force-dynamic';

import { google } from 'googleapis';

export async function POST(request) {
  try {
    const body = await request.json();
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
    } = body;
    
    const values = [
      [
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
