// hooks/useQuran.ts
/**
 * Custom React Hooks for Quran data fetching
 * Industry pattern: Hooks layer for UI components
 * Benefits:
 * - React Query / SWR-like API
 * - Automatic loading/error states
 * - Caching and revalidation
 * - Type-safe
 * 
 * Uses QuranApi (client-side) which calls Next.js API routes
 * The API routes then use the @quranjs/api library server-side
 */

import { useState, useEffect, useCallback } from 'react';
import { QuranApi } from '@/lib/quran/api';

// ============================================================================
// GENERIC ASYNC HOOK
// ============================================================================

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): UseAsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// ============================================================================
// CHAPTER HOOKS
// ============================================================================

/**
 * Fetch all chapters
 * Usage: const { data: chapters, loading, error } = useChapters();
 */
export function useChapters(options?: { language?: string }) {
  return useAsync(
    () => QuranApi.chapters.getAll(options),
    [options?.language]
  );
}

/**
 * Fetch single chapter by ID
 * Usage: const { data: chapter, loading } = useChapter(36);
 */
export function useChapter(id: number, options?: { language?: string }) {
  return useAsync(
    () => QuranApi.chapters.getById(id, options),
    [id, options?.language]
  );
}

/**
 * Fetch chapter info/description
 */
export function useChapterInfo(id: number, options?: { language?: string }) {
  return useAsync(
    () => QuranApi.chapters.getInfo(id, options),
    [id, options?.language]
  );
}

// ============================================================================
// VERSE HOOKS
// ============================================================================

/**
 * Fetch verses by chapter with pagination
 * Usage:
 * const { data, loading, error, refetch } = useVersesByChapter(36, {
 *   page: 1,
 *   perPage: 20,
 *   translations: [131, 20]
 * });
 */
export function useVersesByChapter(
  chapterId: number,
  options?: {
    page?: number;
    perPage?: number;
    translations?: number[];
    words?: boolean;
  }
) {
  return useAsync(
    () => QuranApi.verses.getByChapter(chapterId, options),
    [chapterId, options?.page, options?.perPage, JSON.stringify(options?.translations)]
  );
}

/**
 * Fetch single verse by key
 * Usage: const { data: verse } = useVerse('2:255');
 */
export function useVerse(
  verseKey: string,
  options?: {
    translations?: number[];
    words?: boolean;
    fields?: string;
  }
) {
  return useAsync(
    () => QuranApi.verses.getByKey(verseKey, options),
    [verseKey, JSON.stringify(options?.translations), options?.words, options?.fields]
  );
}

/**
 * Fetch verses by Juz
 */
export function useVersesByJuz(
  juzNumber: number,
  options?: {
    page?: number;
    perPage?: number;
    translations?: number[];
  }
) {
  return useAsync(
    () => QuranApi.verses.getByJuz(juzNumber, options),
    [juzNumber, options?.page, options?.perPage]
  );
}

/**
 * Fetch verses by page number
 */
export function useVersesByPage(
  pageNumber: number,
  options?: {
    translations?: number[];
    words?: boolean;
  }
) {
  return useAsync(
    () => QuranApi.verses.getByPage(pageNumber, options),
    [pageNumber, JSON.stringify(options?.translations)]
  );
}

/**
 * Fetch random verse (for daily verse feature)
 */
export function useRandomVerse(options?: any) {
  return useAsync(
    () => QuranApi.verses.getRandom(options),
    [] // No dependencies = fetch once on mount
  );
}

// ============================================================================
// AUDIO HOOKS
// ============================================================================

/**
 * Fetch chapter audio recitation
 * Usage:
 * const { data: audio, loading } = useChapterAudio(36, '7');
 */
export function useChapterAudio(
  chapterId: number,
  reciterId: string = '7',
  options?: { segments?: boolean }
) {
  return useAsync(
    () => QuranApi.audio.getChapterRecitation(chapterId, {
      reciterId,
      segments: options?.segments ?? true,
    }),
    [chapterId, reciterId, options?.segments]
  );
}

/**
 * Fetch all chapter recitations for a reciter
 */
export function useAllChapterRecitations(reciterId: string = '7') {
  return useAsync(
    () => QuranApi.audio.getAllRecitations(reciterId),
    [reciterId]
  );
}

/**
 * Fetch verse-by-verse audio with word-level timing
 * Critical for word-by-word highlighting feature
 */
export function useVerseAudioByChapter(
  chapterId: number,
  reciterId: string = '7'
) {
  return useAsync(
    () => QuranApi.audio.getVerseRecitationsByChapter(chapterId, reciterId),
    [chapterId, reciterId]
  );
}

/**
 * Fetch audio for specific verse
 */
export function useVerseAudio(verseKey: string, reciterId: string = '7') {
  return useAsync(
    () => QuranApi.audio.getVerseRecitationByKey(verseKey, reciterId),
    [verseKey, reciterId]
  );
}

// ============================================================================
// SEARCH HOOK
// ============================================================================

/**
 * Search hook with manual trigger
 * Usage:
 * const { data, loading, search } = useQuranSearch();
 * 
 * // Later in component:
 * <button onClick={() => search('light')}>Search</button>
 */
export function useQuranSearch(options?: {
  language?: string;
  size?: number;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await QuranApi.search.search(query, options);
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'));
      } finally {
        setLoading(false);
      }
    },
    [options?.language, options?.size]
  );

  return { data, loading, error, search };
}

// ============================================================================
// COMBINED HOOK FOR QURAN READER PAGE
// ============================================================================

/**
 * All-in-one hook for Quran reader page
 * Fetches chapter data, verses, and audio in one hook
 * Uses QuranApi to make server-side API calls
 * 
 * Usage:
 * const {
 *   chapter,
 *   verses,
 *   audio,
 *   loading,
 *   error
 * } = useQuranReader(36, { reciterId: '7', translations: [131] });
 */
export function useQuranReader(
  chapterId: number,
  options?: {
    reciterId?: string;
    translations?: number[];
    page?: number;
    perPage?: number;
  }
) {
  const chapter = useChapter(chapterId);
  const verses = useVersesByChapter(chapterId, {
    page: options?.page,
    perPage: options?.perPage,
    translations: options?.translations,
    words: true,
  });
  const audio = useChapterAudio(chapterId, options?.reciterId || '7', { segments: true });

  const loading = chapter.loading || verses.loading || audio.loading;
  const error = chapter.error || verses.error || audio.error;

  return {
    chapter: chapter.data as any,
    verses: verses.data as any,
    audio: audio.data as any,
    loading,
    error,
    refetch: async () => {
      await Promise.all([
        chapter.refetch(),
        verses.refetch(),
        audio.refetch(),
      ]);
    },
  };
}

// ============================================================================
// RECITER IDs REFERENCE
// ============================================================================

export const RECITER_IDS = {
  MISHARI_AL_AFASY: '7',
  ABDULBASIT_ABDULSAMAD: '2',
  ABU_BAKR_AL_SHATRI: '5',
  SAAD_AL_GHAMDI: '3',
  ABDUL_RAHMAN_AL_SUDAIS: '1',
  // Add more reciters as needed
} as const;

// ============================================================================
// TRANSLATION IDs REFERENCE
// ============================================================================

export const TRANSLATION_IDS = {
  // English
  SAHIH_INTERNATIONAL: 131,
  CLEAR_QURAN: 20,
  MUSTAFA_KHATTAB: 95,

  // Urdu
  ABUL_ALA_MAUDUDI: 97,

  // Arabic
  TAFSIR_JALALAYN: 74,

  // Add more as needed
} as const;