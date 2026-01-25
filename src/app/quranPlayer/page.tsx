
import { Metadata } from 'next';
import QuranPlayerClient from '../quranPlayer/client';

export const metadata: Metadata = {
    title: 'Quran Player - Listen to Top Reciters Online | MosqueProject',
    description: 'Listen to the Holy Quran with your favorite reciters. High quality audio, resume where you left off, and track your progress.',
};

export default function QuranPlayerPage() {
    return <QuranPlayerClient />;
}
