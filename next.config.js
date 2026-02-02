const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';", // Fallback: Only allow same-origin by default
              "style-src 'self' https://fonts.googleapis.com;", // Allow Google Fonts CSS
              "font-src 'self' https://fonts.gstatic.com;", // Allow font files
              "script-src 'self' https://www.googletagmanager.com;", // Allow GTM JS
              "connect-src 'self' https://www.google-analytics.com https://api.aladhan.com;", // Allow Analytics beacons and Aladhan API
              // Add more if needed (e.g., img-src for GTM debug: img-src 'self' data: https://ssl.gstatic.com;)
              // If you use nonces for inline scripts/styles: "script-src 'self' 'nonce-{RANDOM_NONCE}' 'strict-dynamic';"
            ].join(' '),
          }
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';", // Fallback: Only allow same-origin by default
              "style-src 'self' https://fonts.googleapis.com;", // Allow Google Fonts CSS
              "font-src 'self' https://fonts.gstatic.com;", // Allow font files
              "script-src 'self' https://www.googletagmanager.com;", // Allow GTM JS
              "connect-src 'self' https://www.google-analytics.com https://api.aladhan.com;", // Allow Analytics beacons and Aladhan API
              // Add more if needed (e.g., img-src for GTM debug: img-src 'self' data: https://ssl.gstatic.com;)
              // If you use nonces for inline scripts/styles: "script-src 'self' 'nonce-{RANDOM_NONCE}' 'strict-dynamic';"
            ].join(' '),
          },
        ],
      },
    ]
  }
};

module.exports = withPWA(nextConfig);
