'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Heart, TrendingUp, BookMarked, Play, Speaker } from 'lucide-react';
import { useChapters } from '../hooks/useQuran';
import { useQuranProgressStore } from '../../store/quranProgressStore';
import SurahCard from '../../components/quran/SurahCard';
import AyahOfTheDay from '../../components/quran/AyahOfTheDay';
import ProgressStats from '../../components/quran/ProgressStats';
import Link from 'next/link';

// Most loved surahs (predefined)
const MOST_LOVED_SURAHS = [1, 2, 18, 36, 55, 67, 112, 113, 114];

export default function QuranLandingPage() {
  const router = useRouter();
  const { data: chapters, loading } = useChapters();
  const { lastRead, favorites, getOverallProgress } = useQuranProgressStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(21); // Initial load

  // Overall progress
  const overallProgress = getOverallProgress();

  // Filtered chapters based on search
  const filteredChapters = useMemo(() => {
    if (!chapters) return [];
    if (!searchQuery.trim()) return chapters;

    const query = searchQuery.toLowerCase();
    return chapters.filter(
      (chapter: any) =>
        chapter.nameSimple.toLowerCase().includes(query) ||
        chapter.nameArabic.includes(query) ||
        chapter.id.toString() === query
    );
  }, [chapters, searchQuery]);

  // Most loved surahs
  const mostLovedSurahs = useMemo(() => {
    if (!chapters) return [];
    return chapters.filter((ch: any) => MOST_LOVED_SURAHS.includes(ch.id));
  }, [chapters]);

  // Favorites
  const favoriteSurahs = useMemo(() => {
    if (!chapters) return [];
    return chapters.filter((ch: any) => favorites.includes(ch.id));
  }, [chapters, favorites]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500
      ) {
        setDisplayCount((prev) => Math.min(prev + 21, filteredChapters.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredChapters.length]);

  const handleContinueReading = () => {
    if (lastRead) {
      router.push(`/quran/${lastRead.surahId}`);
    }
  };

  const handleSurahClick = (surahId: number) => {
    router.push(`/quran/${surahId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading Quran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          {/* Main Heading */}
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Read the Holy Quran
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              114 Surahs • 6,236 Ayahs • Multiple Translations
            </p>
          </div>

          {/* Progress Stats */}
          <ProgressStats />



          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {lastRead && (
              <button
                onClick={handleContinueReading}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Continue Reading
                <span className="text-sm opacity-75">
                  (Surah {lastRead.surahId})
                </span>
              </button>
            )}
            <button
              onClick={() => handleSurahClick(1)}
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Start from Beginning
            </button>
            <button
              onClick={() => handleSurahClick(1)}
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition flex items-center justify-center gap-2"
            >
              <Link href="/quranPlayer">
                <span className="flex items-center gap-2">
                  <Speaker className="w-5 h-5" />
                  <span>
                    Listen to Quran
                  </span>
                </span>
              </Link>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Ayah of the Day */}
        <AyahOfTheDay />

        {/* Favorites Section */}
        {favoriteSurahs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-6 h-6 text-destructive fill-destructive" />
              <h2 className="text-2xl font-bold">Your Favorites</h2>
              <span className="text-sm text-muted-foreground">
                ({favoriteSurahs.length})
              </span>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-min">
                {favoriteSurahs.map((surah: any) => (
                  <div key={surah.id} className="w-80 flex-shrink-0">
                    <SurahCard
                      surah={surah}
                      onClick={() => handleSurahClick(surah.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Most Loved Surahs */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-bold">Most Loved Surahs</h2>
          </div>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-min">
              {mostLovedSurahs.map((surah: any) => (
                <div key={surah.id} className="w-80 flex-shrink-0">
                  <SurahCard
                    surah={surah}
                    onClick={() => handleSurahClick(surah.id)}
                    featured
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Surah name or number..."
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            />
          </div>
        </div>
        {/* All Surahs */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookMarked className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">All Surahs</h2>
            {searchQuery && (
              <span className="text-sm text-muted-foreground">
                ({filteredChapters.length} results)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChapters.slice(0, displayCount).map((surah: any) => (
              <SurahCard
                key={surah.id}
                surah={surah}
                onClick={() => handleSurahClick(surah.id)}
              />
            ))}
          </div>

          {/* Loading more indicator */}
          {displayCount < filteredChapters.length && (
            <div className="text-center mt-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading more...
              </p>
            </div>
          )}

          {filteredChapters.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No surahs found matching "{searchQuery}"
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}