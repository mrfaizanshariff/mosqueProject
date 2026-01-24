// store/quranProgressStore.ts
/**
 * Quran Reading Progress Store
 * Tracks user's reading progress, favorites, and last position
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SurahProgress {
  surahId: number;
  status: 'not-started' | 'in-progress' | 'completed';
  lastAyahRead: number;
  totalAyahs: number;
  lastReadAt: string; // ISO timestamp
  scrollPosition?: number; // For resuming exact position
}

export interface ReadingSession {
  surahId: number;
  date: string;
  ayahsRead: number;
}

interface QuranProgressState {
  // Last read position
  lastRead: {
    surahId: number;
    ayahNumber: number;
    scrollPosition?: number;
  } | null;

  // Progress per surah
  surahProgress: Record<number, SurahProgress>;

  // Favorites
  favorites: number[];

  // Stats
  totalAyahsRead: number;
  completedSurahs: number;

  // Reading sessions (for stats)
  readingSessions: ReadingSession[];

  // Actions
  updateProgress: (
    surahId: number,
    ayahNumber: number,
    totalAyahs: number,
    scrollPosition?: number
  ) => void;
  markSurahCompleted: (surahId: number, totalAyahs: number) => void;
  toggleFavorite: (surahId: number) => void;
  getProgress: (surahId: number) => SurahProgress | null;
  getOverallProgress: () => number;
  reset: () => void;
  
  // Integration with Ramadan goals
  syncWithRamadanGoals: () => void;
}

const TOTAL_QURAN_AYAHS = 6236;

export const useQuranProgressStore = create<QuranProgressState>()(
  persist(
    (set, get) => ({
      lastRead: null,
      surahProgress: {},
      favorites: [],
      totalAyahsRead: 0,
      completedSurahs: 0,
      readingSessions: [],

      updateProgress: (surahId, ayahNumber, totalAyahs, scrollPosition) => {
        set((state) => {
          const currentProgress = state.surahProgress[surahId];
          const now = new Date().toISOString();

          // Calculate new status
          let status: 'not-started' | 'in-progress' | 'completed' = 'in-progress';
          if (ayahNumber >= totalAyahs) {
            status = 'completed';
          } else if (ayahNumber === 0) {
            status = 'not-started';
          }

          // Update progress
          const newProgress: SurahProgress = {
            surahId,
            status,
            lastAyahRead: ayahNumber,
            totalAyahs,
            lastReadAt: now,
            scrollPosition,
          };

          // Calculate total ayahs read (avoid double counting)
          let totalRead = state.totalAyahsRead;
          if (currentProgress) {
            // Remove old count and add new
            totalRead = totalRead - currentProgress.lastAyahRead + ayahNumber;
          } else {
            totalRead += ayahNumber;
          }

          // Count completed surahs
          const completedCount = Object.values({
            ...state.surahProgress,
            [surahId]: newProgress,
          }).filter((p) => p.status === 'completed').length;

          return {
            lastRead: {
              surahId,
              ayahNumber,
              scrollPosition,
            },
            surahProgress: {
              ...state.surahProgress,
              [surahId]: newProgress,
            },
            totalAyahsRead: totalRead,
            completedSurahs: completedCount,
          };
        });
      },

      markSurahCompleted: (surahId, totalAyahs) => {
        get().updateProgress(surahId, totalAyahs, totalAyahs);
      },

      toggleFavorite: (surahId) => {
        set((state) => {
          const favorites = state.favorites.includes(surahId)
            ? state.favorites.filter((id) => id !== surahId)
            : [...state.favorites, surahId];

          return { favorites };
        });
      },

      getProgress: (surahId) => {
        return get().surahProgress[surahId] || null;
      },

      getOverallProgress: () => {
        const { totalAyahsRead } = get();
        return Math.round((totalAyahsRead / TOTAL_QURAN_AYAHS) * 100);
      },

      syncWithRamadanGoals: () => {
        // This will sync with Ramadan companion goals
        // TODO: Implement when integrating with Ramadan store
        console.log('Syncing with Ramadan goals...');
      },

      reset: () => {
        set({
          lastRead: null,
          surahProgress: {},
          favorites: [],
          totalAyahsRead: 0,
          completedSurahs: 0,
          readingSessions: [],
        });
      },
    }),
    {
      name: 'quran-progress-storage',
    }
  )
);