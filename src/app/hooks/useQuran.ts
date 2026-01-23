// hooks/useQuran.ts
/**
 * Custom React Hooks for Quran data fetching
 * Industry pattern: Hooks layer for UI components
 * Benefits:
 * - React Query / SWR-like API
 * - Automatic loading/error states
 * - Caching and revalidation
 * - Type-safe
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ChapterService,
  VerseService,
  AudioService,
  SearchService,
} from '../../lib/quran/services';
import { Chapter, ChapterId, JuzNumber, Language, PageNumber, VerseKey } from '@quranjs/api';

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
export function useChapters(options?: { language?: Language }) {
  return useAsync(
    () => ChapterService.getAll(options),
    [options?.language]
  );
}

/**
 * Fetch single chapter by ID
 * Usage: const { data: chapter, loading } = useChapter('36');
 */
export function useChapter(id: ChapterId, options?: { language?: Language }) {
  return useAsync(
    () => ChapterService.getById(id, options),
    [id, options?.language]
  );
}

/**
 * Fetch chapter info/description
 */
export function useChapterInfo(id: ChapterId, options?: { language?: Language }) {
  return useAsync(
    () => ChapterService.getInfo(id, options),
    [id, options?.language]
  );
}

// ============================================================================
// VERSE HOOKS
// ============================================================================

/**
 * Fetch verses by chapter with pagination
 * Usage:
 * const { data, loading, error, refetch } = useVersesByChapter('36', {
 *   page: 1,
 *   perPage: 20,
 *   translations: [131, 20]
 * });
 */
export function useVersesByChapter(
  chapterId: ChapterId,
  options?: {
    page?: number;
    perPage?: number;
    translations?: number[];
    words?: boolean;
    textIndopak?: boolean;
  }
) {
  return useAsync(
    () => VerseService.getByChapter(chapterId, options),
    [chapterId, options?.page, options?.perPage, JSON.stringify(options?.translations)]
  );
}

/**
 * Fetch single verse by key
 * Usage: const { data: verse } = useVerse('2:255');
 */
export function useVerse(
  verseKey: VerseKey,
  options?: {
    translations?: number[];
    words?: boolean;
  }
) {
  return useAsync(
    () => VerseService.getByKey(verseKey, options),
    [verseKey, JSON.stringify(options?.translations), options?.words]
  );
}

/**
 * Fetch verses by Juz
 */
export function useVersesByJuz(
  juzNumber: JuzNumber,
  options?: {
    page?: number;
    perPage?: number;
    translations?: number[];
  }
) {
  return useAsync(
    () => VerseService.getByJuz(juzNumber, options),
    [juzNumber, options?.page, options?.perPage]
  );
}

/**
 * Fetch verses by page number
 */
export function useVersesByPage(
  pageNumber: PageNumber,
  options?: {
    translations?: number[];
    words?: boolean;
  }
) {
  return useAsync(
    () => VerseService.getByPage(pageNumber, options),
    [pageNumber, JSON.stringify(options?.translations)]
  );
}

/**
 * Fetch random verse (for daily verse feature)
 */
export function useRandomVerse(options?: { translations?: number[] }) {
  return useAsync(
    () => VerseService.getRandom(options),
    [] // No dependencies = fetch once on mount
  );
}

// ============================================================================
// AUDIO HOOKS
// ============================================================================

/**
 * Fetch chapter audio recitation
 * Usage:
 * const { data: audio, loading } = useChapterAudio('36', '7');
 */
export function useChapterAudio(chapterId: ChapterId, reciterId: string = '7',options={segments:true}) {
  return useAsync(
    () => AudioService.getChapterRecitation(chapterId, reciterId,options),
    [chapterId, reciterId]
  );
}

/**
 * Fetch all chapter recitations for a reciter
 */
export function useAllChapterRecitations(reciterId: string = '7') {
  return useAsync(
    () => AudioService.getAllChapterRecitations(reciterId),
    [reciterId]
  );
}

/**
 * Fetch verse-by-verse audio with word-level timing
 * Critical for word-by-word highlighting feature
 */
export function useVerseAudioByChapter(
  chapterId: ChapterId,
  reciterId: string = '7'
) {
  return useAsync(
    () => AudioService.getVerseRecitationsByChapter(chapterId, reciterId),
    [chapterId, reciterId]
  );
}

/**
 * Fetch audio for specific verse
 */
export function useVerseAudio(verseKey: VerseKey, reciterId: string = '7') {
  return useAsync(
    () => AudioService.getVerseRecitationByKey(verseKey, reciterId),
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
  language?: Language;
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
        const results = await SearchService.search(query, options);
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
 * 
 * Usage:
 * const {
 *   chapter,
 *   verses,
 *   audio,
 *   loading,
 *   error
 * } = useQuranReader('36', { reciterId: '7', translations: [131] });
 */
export function useQuranReader(
  chapterId: ChapterId,
  options?: {
    reciterId?: string;
    translations?: number[];
    page?: number;
    perPage?: number;
    text_script?: 'textUthmani' | 'textIndopak' | 'textImlaei' | 'textIndopakNastaleeq';
  }
) {
  const chapter = useChapter(chapterId);
  const verses = useVersesByChapter(chapterId, {
    textIndopak: true,
    // page: options?.page,
    // perPage: options?.perPage,
    // translations: options?.translations,
    words: true,
  });
  const audio = useChapterAudio(chapterId, options?.reciterId || '7');

  const loading = chapter.loading || verses.loading || audio.loading;
  const error = chapter.error || verses.error || audio.error;

  return {
    chapter: chapter.data,
    verses: verses.data,
    audio: audio.data,
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