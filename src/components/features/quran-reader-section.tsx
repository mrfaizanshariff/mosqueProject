// app/quran/[surahNumber]/page.tsx
/**
 * Quran Reader Page - Refactored with @quranjs/api
 * Industry pattern: Clean separation of concerns
 * Uses QuranApi via hooks for client-side data fetching
 */

'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Play, Pause, SkipBack, SkipForward, Check } from 'lucide-react';
import { useQuranReader, RECITER_IDS, TRANSLATION_IDS } from '../../app/hooks/useQuran';
import { useQuranProgressStore } from '../../store/quranProgressStore';

// ============================================================================
// MEMOIZED VERSE ITEM COMPONENT
// This prevents all verses from re-rendering when audio time updates
// ============================================================================
interface VerseItemProps {
  verse: any;
  isActive: boolean;
  activeWordPosition: number | null;
  setVerseRef: (key: string, el: HTMLDivElement | null) => void;
}

const VerseItem = React.memo(({ verse, isActive, activeWordPosition, setVerseRef }: VerseItemProps) => {
  return (
    <div
      ref={(el) => setVerseRef(verse.verseKey, el)}
      className={`p-6 rounded-lg border transition-all duration-300 ${isActive
        ? 'bg-primary/10 border-primary shadow-md'
        : 'bg-card border-border'
        }`}
    >
      {/* Verse Number */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm">
          {verse.verseNumber}
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {verse.verseKey}
        </span>
      </div>

      {/* Arabic Text with Word Highlighting */}
      <div className="text-right mb-6 leading-[2.5] text-3xl font-arabic" dir="rtl">
        {verse.words?.map((word: any) => {
          const isCurrentWord = isActive && word.position === activeWordPosition;
          return (
            <span
              key={word.id}
              className={`quran-text inline-block mx-1.5 transition-all duration-200 rounded px-1 ${isCurrentWord
                ? 'text-primary font-bold bg-primary/10 scale-110 shadow-sm'
                : 'hover:text-primary/80'
                }`}
            >
              {word.textIndopak}
            </span>
          );
        })}
      </div>

      {/* Transliteration */}
      <div className="mb-4 text-muted-foreground italic text-lg leading-relaxed">
        {verse.words
          ?.filter((word: any) => word.charTypeName === 'word')
          ?.map((word: any) => (
            <span key={word.id} className="mr-2">
              {word.transliteration?.text}
            </span>
          ))}
      </div>

      {/* Translation */}
      <div className="mb-2 text-foreground/80 leading-relaxed text-lg">
        {verse.words
          ?.filter((word: any) => word.charTypeName === 'word')
          ?.map((word: any) => (
            <span key={word.id} className="mr-2">
              {word.translation?.text}
            </span>
          ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to really minimize re-renders
  // Re-render if activation status changes
  if (prevProps.isActive !== nextProps.isActive) return false;

  // If active, re-render only if word position changes
  if (nextProps.isActive && prevProps.activeWordPosition !== nextProps.activeWordPosition) return false;

  // Re-render if verse content somehow changes (unlikely in this context but safe to keep)
  if (prevProps.verse.id !== nextProps.verse.id) return false;

  return true;
});

VerseItem.displayName = 'VerseItem';


// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function QuranReaderPage() {
  const params = useParams();
  const surahNumber = parseInt(params.surahNumber as string, 10);

  // Fetch all data with custom hook (uses QuranApi client-side)
  const {
    chapter,
    verses,
    audio,
    loading,
    error,
  } = useQuranReader(surahNumber, {
    reciterId: RECITER_IDS.MISHARI_AL_AFASY,
    translations: [TRANSLATION_IDS.SAHIH_INTERNATIONAL],

  });

  const { updateProgress, markSurahCompleted, getProgress } = useQuranProgressStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVerseKey, setCurrentVerseKey] = useState<string | null>(null);
  const [currentWordPosition, setCurrentWordPosition] = useState<number | null>(null);
  const [showMarkComplete, setShowMarkComplete] = useState(false);

  // Use state instead of ref so we can react to DOM node creation/destruction
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Cache for random access to timestamps to optimize find operation O(1) vs O(N)
  // Maps timestamp (approx) to verse info? No, ranges are better. 
  // Sticking to current find logic is okay for < 300 elements, but we wrap logic in effect nicely.

  const progress = getProgress(parseInt(String(surahNumber)));
  const totalVerses = chapter?.versesCount || 0;

  // Restore scroll position
  useEffect(() => {
    if (progress?.scrollPosition && containerRef.current) {
      setTimeout(() => {
        window.scrollTo(0, progress.scrollPosition || 0);
      }, 600);
    }
  }, [progress, loading]); // Added loading dependency to ensure we scroll after content loads

  // Track scroll and update progress
  useEffect(() => {
    // skip if loading
    if (loading || !verses?.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Find which verse is currently in view
      // Optimized finding logic: check closest center
      const viewportMiddle = window.innerHeight / 2;
      let currentVerseNumber = -1;

      // We convert verseRefs to array to iterate faster or just loop
      // verseRefs is a plain object, Object.entries is fine
      for (const [key, ref] of Object.entries(verseRefs.current)) {
        if (!ref) continue;
        const rect = ref.getBoundingClientRect();
        // Check intersection with middle
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          currentVerseNumber = parseInt(key.split(':')[1]);
          break; // Stop once we find the middle one
        }
      }

      // Update progress if we found a verse
      if (currentVerseNumber > 0) {
        if (Number(progress?.lastAyahRead) < Number(currentVerseNumber)) {
          updateProgress(
            parseInt(String(surahNumber)),
            currentVerseNumber,
            totalVerses,
            scrollPosition
          );
        }
      }

      // Show mark complete button near bottom
      const scrollPercentage =
        (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercentage > 95 && !showMarkComplete) setShowMarkComplete(true);
      else if (scrollPercentage < 90 && showMarkComplete) setShowMarkComplete(false);
    };

    const debounce = setTimeout(handleScroll, 500); // Initial check

    // Throttle scroll handler slightly
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      clearTimeout(debounce);
      window.removeEventListener('scroll', onScroll);
    };
  }, [surahNumber, totalVerses, updateProgress, loading, verses, showMarkComplete]);

  // Handle Verse Refs
  const setVerseRef = useCallback((key: string, el: HTMLDivElement | null) => {
    verseRefs.current[key] = el;
  }, []);

  // Audio event handlers
  // Audio event handlers
  useEffect(() => {
    // We depend on audioElement (state), not a ref. 
    // This ensures this effect runs EXACTLY when the <audio> tag is mounted/created with the new key.
    const audioEl = audioElement;
    if (!audioEl) return;

    // Robust duration update
    const updateDuration = () => {
      if (audioEl.duration && !isNaN(audioEl.duration) && audioEl.duration !== Infinity) {
        setDuration(audioEl.duration);
      }
    };

    const updateTime = () => {
      setCurrentTime(audioEl.currentTime * 1000);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentVerseKey(null);
      setCurrentWordPosition(null);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Reset state when audio source changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentVerseKey(null);

    // Explicitly load the new source to ensure events fire
    audioEl.load();

    audioEl.addEventListener('timeupdate', updateTime);
    audioEl.addEventListener('durationchange', updateDuration);
    audioEl.addEventListener('loadedmetadata', updateDuration);
    audioEl.addEventListener('ended', handleEnded);
    audioEl.addEventListener('play', handlePlay);
    audioEl.addEventListener('pause', handlePause);

    // Initial check in case metadata already loaded
    if (audioEl.readyState >= 1) {
      updateDuration();
    }

    return () => {
      audioEl.removeEventListener('timeupdate', updateTime);
      audioEl.removeEventListener('durationchange', updateDuration);
      audioEl.removeEventListener('loadedmetadata', updateDuration);
      audioEl.removeEventListener('ended', handleEnded);
      audioEl.removeEventListener('play', handlePlay);
      audioEl.removeEventListener('pause', handlePause);
    };
  }, [audioElement, audio?.audioUrl]); // Dependency on audioElement is key!

  // Core Highlight Logic - Synchronize Audio Time with Verse/Word
  useEffect(() => {
    // Skip highlighting logic if not playing or no valid audio data
    if (!audio?.timestamps || (!isPlaying && currentTime === 0)) return;

    // Optimization: Only search if time moved significantly or we are lost
    // Current simple linear search is fine for <300 items, but could be binary search

    // 1. Find Verse
    // Helper function to check if time is within range
    const isTimeInSegment = (start: number, end: number) => currentTime >= start && currentTime <= end;

    const currentVerseFn = (timing: any) => isTimeInSegment(timing.timestampFrom, timing.timestampTo);

    // Small optimization: check current cached verse first to avoid array traverse
    let currentVerse = audio.timestamps.find((t: any) => t.verseKey === currentVerseKey);
    const inRange = currentVerse && currentVerseFn(currentVerse);

    // If we migrated out of current verse, find new one
    if (!inRange) {
      currentVerse = audio.timestamps.find(currentVerseFn);
    }

    if (currentVerse) {
      // Update Verse Key State
      if (currentVerseKey !== currentVerse.verseKey) {
        setCurrentVerseKey(currentVerse.verseKey);
        setCurrentWordPosition(null);

        // Auto-scroll to verse with smooth behavior
        // We use requestAnimationFrame to prevent layout thrashing
        requestAnimationFrame(() => {
          const el = verseRefs.current[currentVerse.verseKey];
          if (el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        });
      }

      // 2. Find Word
      let foundWordPosition: number | null = null; // Default to null if not found
      let bestMatchEnd = -1;

      // Only run word search if we have segments and current time is valid
      if (currentVerse.segments && currentVerse.segments.length > 0) {
        for (const segment of currentVerse.segments) {
          // Safety check for malformed segments [wordPos, start, duration]
          if (!Array.isArray(segment) || segment.length < 3) continue;

          const [pos, start, dur] = segment;
          const end = start + dur;

          if (currentTime >= start && currentTime < end) {
            // The best match is usually the specific word inside a larger phrase?
            // QuranJS API usually gives non-overlapping word-level segments for word-by-word
            // Logic: just take the one or the latest ending one if overlapping
            if (end > bestMatchEnd) {
              bestMatchEnd = end;
              foundWordPosition = pos;
            }
          }
        }
      }

      // Only update if changed
      if (foundWordPosition !== currentWordPosition) {
        setCurrentWordPosition(foundWordPosition);
      }
    } else {
      // Between verses or silence
      // Don't necessarily clear highlighted verse immediately to avoid flickering
      // But clear if we are definitely out of range
      // For now, let's keep highlighting current verse until new one starts or audio ends
    }

  }, [currentTime, audio, isPlaying]); // Removed redundant dependencies to reduce re-runs

  // Audio controls
  const togglePlay = () => {
    const audioEl = audioElement;
    if (!audioEl) return;

    if (isPlaying) {
      audioEl.pause();
    } else {
      audioEl.play().catch(e => console.error("Playback failed", e));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audioEl = audioElement;
    if (!audioEl || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audioEl.currentTime = percent * duration;
  };

  const skipTime = (seconds: number) => {
    const audioEl = audioElement;
    if (!audioEl) return;
    audioEl.currentTime = Math.max(
      0,
      Math.min(audioEl.duration, audioEl.currentTime + seconds)
    );
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMarkComplete = () => {
    markSurahCompleted(parseInt(String(surahNumber)), totalVerses);
    setShowMarkComplete(false);
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
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4 shadow-md sticky top-0 z-20">
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

      {/* Verses List */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {verses?.map((verse: any) => (
          <VerseItem
            key={verse.id}
            verse={verse}
            isActive={currentVerseKey === verse.verseKey}
            activeWordPosition={currentVerseKey === verse.verseKey ? currentWordPosition : null}
            setVerseRef={setVerseRef}
          />
        ))}
      </div>

      {/* Sticky Bottom Player */}
      {audio && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <audio
              key={audio.audioUrl} // Force re-creation when source changes
              ref={setAudioElement}
              src={audio.audioUrl}
              preload="metadata"
              className="hidden"
            />

            {/* Progress Bar Container */}
            <div
              className="group w-full h-2 bg-muted rounded-full cursor-pointer mb-6 relative hover:h-3 transition-all duration-200"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary rounded-full relative"
                style={{
                  width: `${duration ? (currentTime / 1000 / duration) * 100 : 0}%`,
                }}
              >
                {/* Thumb */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-background rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground w-16 tabular-nums">
                {formatTime(currentTime / 1000)}
              </span>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => skipTime(-5)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                  aria-label="Rewind 5s"
                >
                  <SkipBack className="w-6 h-6" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-4 bg-primary text-primary-foreground rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/25"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={() => skipTime(5)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                  aria-label="Skip 5s"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              <span className="text-sm font-medium text-muted-foreground w-16 text-right tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            {/* Conditionally render Mark Complete outside or inside based on space */}
            {showMarkComplete && progress?.status !== 'completed' && (
              <button
                onClick={handleMarkComplete}
                className="absolute -top-16 right-4 sm:static sm:ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full shadow-lg transition-colors flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4"
              >
                <Check className="w-4 h-4" />
                Mark Complete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}