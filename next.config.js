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
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://apis.google.com https://www.gstatic.com https://*.firebaseapp.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' data: https: https://*.googleusercontent.com;",
              "font-src 'self' https://fonts.gstatic.com https://verses.quran.foundation https://static-cdn.tarteel.ai;",
              "connect-src 'self' https://www.google-analytics.com https://api.aladhan.com https://*.firebaseio.com https://*.googleapis.com https://va.vercel-scripts.com https://*.firebaseapp.com;",
              "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com;",
              "media-src 'self' https://download.quranicaudio.com https://*.quranicaudio.com;",
            ].join(' '),
          }
        ],
      }
    ]
  }
};

// module.exports = withPWA(nextConfig);
module.exports = nextConfig
