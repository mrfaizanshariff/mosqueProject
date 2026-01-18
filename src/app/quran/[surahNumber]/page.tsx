// In your Next.js app/quran/[surahNumber]/page.js
'use client';
import { useParams } from 'next/navigation';
import QuranReaderPage from '../../../components/features/quran-reader-section';

export default function QuranPage() {
  const params = useParams();
  // Modify the component to accept surahNumber as prop
//   return <QuranReaderPage surahNumber={parseInt(params.surahNumber)} />;
  return <QuranReaderPage />;
}