import '../app/globals.css';
import type { Metadata } from 'next';
import { Amiri, Noto_Sans } from 'next/font/google';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { CityProvider } from '../context/CityContext';
import { PrayerTimingsProvider } from '../context/PrayerTimingsContext';
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri'
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans'
});

export const metadata: Metadata = {
  title: 'Mosque of India | Prayer Times, Quran & More',
  description: 'Find prayer times, read and listen to the Holy Quran, and more.',
  applicationName: 'Mosque of India',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mosque of India',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#ffffff',
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <GoogleAnalytics gaId="G-KE3WBEBM1G" />
      </head>

      <body className={`${amiri.variable} ${notoSans.variable} font-sans`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <CityProvider>
                <PrayerTimingsProvider>
                  {children}<Analytics />
                </PrayerTimingsProvider>
              </CityProvider>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}