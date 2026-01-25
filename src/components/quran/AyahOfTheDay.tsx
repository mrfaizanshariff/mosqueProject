'use client';

import React, { useEffect, useState } from 'react';
import { useVerse, useRandomVerse } from '../../app/hooks/useQuran';
import { TRANSLATION_IDS } from '../../lib/quran/services';
import { Sparkles } from 'lucide-react';
import { VerseKey } from '@quranjs/api';

// List of beautiful/popular verses for rotation
const FEATURED_VERSES = [
  '2:255', // Ayatul Kursi
  '1:1',   // Al-Fatiha
  '36:1',  // Ya-Sin opening
  '55:13', // Rahman - Which blessings
  '94:5',  // With hardship comes ease
  '13:28', // Hearts find rest
  '2:286', // Allah does not burden
  '3:159', // Rely on Allah
  '16:90', // Allah commands justice
  '29:69', // Those who strive
];

function getDailyVerseKey(): VerseKey {
  // Get today's date and use it to select a verse
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  const index = dayOfYear % FEATURED_VERSES.length;
  return FEATURED_VERSES[index] as VerseKey;
}

export default function AyahOfTheDay() {
  const [verseKey] = useState<VerseKey>(getDailyVerseKey());

  const { data: verse, loading } = useRandomVerse({
    translations: [TRANSLATION_IDS.SAHIH_INTERNATIONAL],
  });

  if (loading || !verse) {
    return (
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 rounded-lg p-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-4" />
        <div className="h-20 bg-muted rounded mb-4" />
        <div className="h-16 bg-muted rounded" />
      </div>
    );
  }

  // Filter only actual words
  const actualWords = verse.words?.filter(
    (w: any) => w.charTypeName === 'word'
  ) || [];

  return (
    <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 rounded-lg p-8 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Ayah of the Day</h2>
        </div>

        {/* Arabic Text */}
        <div className="mb-6 text-right" dir="rtl">
          <p className="text-3xl md:text-4xl leading-loose text-foreground font-arabic">
            {actualWords.map((word: any) => (
              <span key={word.id} className="mx-1">
                {word.text || word.textIndopak}
              </span>
            ))}
          </p>
        </div>

        {/* Transliteration */}
        <div className="mb-4 text-muted-foreground italic text-lg">
          {actualWords.map((word: any, index: number) => (
            <span key={word.id}>
              {word.transliteration?.text}
              {index < actualWords.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>

        {/* Translation */}
        {verse.translations?.[0] && (
          <div className="mb-6">
            <p className="text-xl leading-relaxed text-foreground">
              "{verse.translations?.text}"
            </p>
          </div>
        )}

        {/* Reference */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {verse.verseNumber}
            </div>
            <span className="text-sm text-muted-foreground">
              Surah {verse.verseKey?.split(':')[0]} - Ayah {verse.verseNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}