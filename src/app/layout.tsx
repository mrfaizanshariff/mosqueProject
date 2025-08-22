import '../app/globals.css';
import type { Metadata } from 'next';
import { Amiri, Noto_Sans } from 'next/font/google';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { CityProvider } from '../context/CityContext';
import { PrayerTimingsProvider } from '../context/PrayerTimingsContext';
import { Analytics } from "@vercel/analytics/next"
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
  title: 'Mosque Finder | Prayer Times Directory',
  description: 'Find prayer times for mosques in your city',
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
              {children}<Analytics/>
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