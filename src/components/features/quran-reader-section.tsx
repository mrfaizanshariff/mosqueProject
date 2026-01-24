// app/quran/[surahNumber]/page.tsx
/**
 * Quran Reader Page - Refactored with @quranjs/api
 * Industry pattern: Clean separation of concerns
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useQuranReader, RECITER_IDS, useChapterAudio } from '../../app/hooks/useQuran';
import { TRANSLATION_IDS } from '../../lib/quran/services';
import { ChapterId } from '@quranjs/api';
import QuranDebugPanel from '../QuranDebuPanels';

export default function QuranReaderPage() {
  const params = useParams();
  const surahNumber = params.surahNumber as ChapterId;

  // Fetch all data with custom hook
  const {
    chapter,
    verses,
    // audio,
    loading,
    error,
  } = useQuranReader(surahNumber, {
    reciterId: RECITER_IDS.MISHARI_AL_AFASY,
    translations: [TRANSLATION_IDS.SAHIH_INTERNATIONAL],
    text_script: 'textIndopak',
  });
  const {data:audio}= useChapterAudio(surahNumber, RECITER_IDS.MISHARI_AL_AFASY,{segments:true});

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVerseKey, setCurrentVerseKey] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [currentVerseData, setCurrentVerseData] = useState<any>(null);
const [currentWordPosition, setCurrentWordPosition] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Audio event handlers
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const updateTime = () => setCurrentTime(audioEl.currentTime * 1000);
    const updateDuration = () => setDuration(audioEl.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audioEl.addEventListener('timeupdate', updateTime);
    audioEl.addEventListener('loadedmetadata', updateDuration);
    audioEl.addEventListener('ended', handleEnded);

    return () => {
      audioEl.removeEventListener('timeupdate', updateTime);
      audioEl.removeEventListener('loadedmetadata', updateDuration);
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, [audio,surahNumber]);

//   Track current verse and word based on audio time
   useEffect(() => {
    if (!audio?.audioFile?.timestamps) return;

    const currentVerse = audio?.audioFile.timestamps.find(
      (timing: any) =>
        currentTime >= timing.timestampFrom &&
        currentTime <= timing.timestampTo
    );

    if (currentVerse) {
      // Update current verse key
      if (currentVerseKey !== currentVerse.verseKey) {
        setCurrentVerseKey(currentVerse.verseKey);
         setCurrentWordPosition(null); 
        // Find and cache the corresponding verse data
        const verseData = verses?.find(
          (v: any) => v.verseKey === currentVerse.verseKey
        );
        setCurrentVerseData(verseData);
        
        // Reset word index when verse changes
        setCurrentWordIndex(null);
        setCurrentWordPosition(null);
      }

     // Find current word from segments
    let foundWordPosition: number | null = null;
let bestMatchEnd = -Infinity;

for (const segment of currentVerse.segments) {
  if (!segment || segment.length < 3) continue;

  const [wordPosition, start, duration] = segment;
  const end = start + duration;

  if (currentTime >= start && currentTime < end) {
    // If multiple segments overlap, prefer the one that ends latest
    if (end > bestMatchEnd) {
      bestMatchEnd = end;
      foundWordPosition = wordPosition;
    }
  }
}

if (foundWordPosition !== currentWordPosition) {
  setCurrentWordPosition(foundWordPosition);
}

      // Auto-scroll to current verse
      if (verseRefs.current[currentVerse.verseKey]) {
        verseRefs.current[currentVerse.verseKey]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    } else {
      // No verse is currently playing - reset highlights
      if (currentVerseKey !== null) {
        setCurrentVerseKey(null);
        setCurrentWordIndex(null);
         setCurrentWordPosition(null);
        setCurrentVerseData(null);
      }
    }
  }, [currentTime, audio, currentVerseKey, currentWordPosition,verses]);

  // Audio controls
  const togglePlay = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (isPlaying) {
      audioEl.pause();
    } else {
      audioEl.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = percent * audioEl.duration;
  };

  const skipTime = (seconds: number) => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.currentTime = Math.max(
      0,
      Math.min(audioEl.duration, audioEl.currentTime + seconds)
    );
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading Surah...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">Error Loading Surah</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">
            {chapter?.nameSimple || `Surah ${surahNumber}`}
          </h1>
          <p className="text-lg opacity-90" dir="rtl">
            {chapter?.nameArabic}
          </p>
          {chapter && (
            <p className="text-sm opacity-75 mt-2">
              {chapter.versesCount} Ayahs • {chapter.revelationPlace}
            </p>
          )}
        </div>
      </div>

      {/* Verses */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {verses?.map((verse: any) => 
        (
          <div
            key={verse.id}
            ref={(el) => (verseRefs.current[verse.verseKey] = el)}
            className={`p-6 rounded-lg border transition-all ${
              currentVerseKey === verse.verseKey
                ? 'bg-primary/10 border-primary shadow-md'
                : 'bg-card border-border'
            }`}
          >
            {/* Verse Number */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {verse.verseNumber}
              </div>
              <span className="text-sm text-muted-foreground">
                {verse.verseKey}
              </span>
            </div>

            {/* Arabic Text with Word Highlighting */}
            <div className="text-right mb-6 leading-loose text-3xl" dir="rtl">
              {verse.words
                // ?.filter((word: any) => word.charTypeName === 'word') // Only actual words, not end markers
                ?.map((word: any, index: number) =>
                {
                    const isCurrentWord =
                    currentVerseKey === verse.verseKey &&
                    word.position === currentWordPosition;
                    return (
                  <span
                    key={word.id}
                    className={`quran-text inline-block mx-1 transition-all duration-200 ${
                        isCurrentWord
                        ? 'text-primary font-bold scale-110 px-2 py-1 rounded'
                        : ''
                    }`}
                  >
                    {word.textIndopak}
                  </span>
                )
                }
                )}
            </div>

            {/* Transliteration */}
            <div className="mb-4 text-muted-foreground italic">
              {verse.words
                ?.filter((word: any) => word.charTypeName === 'word')
                ?.map((word: any) => (
                  <span key={word.id} className="mr-2">
                    {word.transliteration?.text}
                  </span>
                ))}
            </div>

            {/* Translation */}
             <div className="mb-4 text-muted-foreground ">
              {verse.words
                ?.filter((word: any) => word.charTypeName === 'word')
                ?.map((word: any) => (
                  <span key={word.id} className="mr-2">
                    {word.translation?.text}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
        {/* Audio Player */}
      {audio && (
        <div className="sticky bottom-0 left-0 z-10 bg-card border-b border-border shadow-lg">
          <div className="max-w-4xl mx-auto p-4">
            <audio ref={audioRef} src={audio.audioFile.audioUrl} preload="metadata" />

            {/* Progress Bar */}
            <div
              className="w-full h-2 bg-muted rounded-full cursor-pointer mb-4"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${duration ? (currentTime / 1000 / duration) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {formatTime(currentTime / 1000)}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => skipTime(-10)}
                  className="p-2 hover:bg-muted rounded-full transition"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-4 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={() => skipTime(10)}
                  className="p-2 hover:bg-muted rounded-full transition"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <span className="text-sm text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* <QuranDebugPanel
  currentTime={currentTime}
  currentVerseKey={currentVerseKey}
  currentWordIndex={currentWordPosition}
  audio={audio}
  verses={verses}
  currentVerseData={currentVerseData}
/> */}
    </div>

    
  );
}