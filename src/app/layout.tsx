import '../app/globals.css';
import type { Metadata } from 'next';
import { Amiri, Noto_Sans } from 'next/font/google';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { CityProvider } from '../context/CityContext';
import { PrayerTimingsProvider } from '../context/PrayerTimingsContext';
import { Analytics } from "@vercel/analytics/next"
import Script from 'next/script';
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

      <body className={`${amiri.variable} ${notoSans.variable} font-sans`}>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KE3WBEBM1G"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KE3WBEBM1G');
          `}
        </Script>

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