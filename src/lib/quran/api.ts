// lib/quran/api.ts
/**
 * Client-side API utility for making calls to Quran API routes
 * Use this instead of services.ts for client-side components
 */

// Base URL for API calls
const API_BASE = '/api/quran';

// Generic response type
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Helper function for API calls
async function fetchApi<T = any>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(endpoint, window.location.origin);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });
    }

    const response = await fetch(url.toString());
    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
        throw new Error(result.error || 'API request failed');
    }

    return result.data as T;
}

// ============================================================================
// CHAPTERS API
// ============================================================================

export const ChaptersApi = {
    /**
     * Get all chapters
     */
    getAll: async (options?: { language?: string }) => {
        return fetchApi(`${API_BASE}/chapters`, {
            language: options?.language,
        });
    },

    /**
     * Get chapter by ID
     */
    getById: async (id: number, options?: { language?: string }) => {
        return fetchApi(`${API_BASE}/chapters/${id}`, {
            language: options?.language,
        });
    },

    /**
     * Get chapter info
     */
    getInfo: async (id: number, options?: { language?: string }) => {
        return fetchApi(`${API_BASE}/chapters/${id}/info`, {
            language: options?.language,
        });
    },
};

// ============================================================================
// VERSES API
// ============================================================================

export const VersesApi = {
    /**
     * Get verses by chapter
     */
    getByChapter: async (
        chapterId: number,
        options?: {
            page?: number;
            perPage?: number;
            translations?: number[];
            words?: boolean;
        }
    ) => {
        return fetchApi(`${API_BASE}/verses/by-chapter/${chapterId}`, {
            page: options?.page,
            perPage: options?.perPage,
            translations: options?.translations?.join(','),
            words: options?.words,
            word_fields: 'text_indopak',
        });
    },

    /**
     * Get verse by key (e.g., "2:255")
     */
    getByKey: async (
        verseKey: string,
        options?: {
            translations?: number[];
            tafsirs?: number[];
            words?: boolean;
            fields?: string;
        }
    ) => {
        return fetchApi(`${API_BASE}/verses/by-key/${encodeURIComponent(verseKey)}`, {
            translations: options?.translations?.join(','),
            tafsirs: options?.tafsirs?.join(','),
            words: options?.words,
            fields: options?.fields,
            word_fields: 'text_indopak',
        });
    },

    /**
     * Get verses by Juz
     */
    getByJuz: async (
        juzNumber: number,
        options?: {
            page?: number;
            perPage?: number;
            translations?: number[];
        }
    ) => {
        return fetchApi(`${API_BASE}/verses/by-juz/${juzNumber}`, {
            page: options?.page,
            perPage: options?.perPage,
            translations: options?.translations?.join(','),
        });
    },

    /**
     * Get verses by page number
     */
    getByPage: async (
        pageNumber: number,
        options?: {
            translations?: number[];
            words?: boolean;
        }
    ) => {
        return fetchApi(`${API_BASE}/verses/by-page/${pageNumber}`, {
            translations: options?.translations?.join(','),
            words: options?.words,
        });
    },

    /**
     * Get random verse
     */
    getRandom: async (options?: { translations?: number[] }) => {
        return fetchApi(`${API_BASE}/verses/random`, {
            translations: options?.translations?.join(','),
        });
    },
};

// ============================================================================
// AUDIO API
// ============================================================================

export const AudioApi = {
    /**
     * Get chapter audio recitation
     */
    getChapterRecitation: async (
        chapterId: number,
        options?: {
            reciterId?: string;
            segments?: boolean;
        }
    ) => {
        return fetchApi(`${API_BASE}/audio/chapter/${chapterId}`, {
            reciterId: options?.reciterId,
            segments: options?.segments,
        });
    },

    /**
     * Get all chapter recitations for a reciter
     */
    getAllRecitations: async (reciterId?: string) => {
        return fetchApi(`${API_BASE}/audio/recitations`, {
            reciterId,
        });
    },

    /**
     * Get verse-by-verse audio for a chapter
     */
    getVerseRecitationsByChapter: async (
        chapterId: number,
        reciterId?: string
    ) => {
        return fetchApi(`${API_BASE}/audio/verse/by-chapter/${chapterId}`, {
            reciterId,
        });
    },

    /**
     * Get audio for a specific verse
     */
    getVerseRecitationByKey: async (
        verseKey: string,
        reciterId?: string
    ) => {
        return fetchApi(`${API_BASE}/audio/verse/by-key/${encodeURIComponent(verseKey)}`, {
            reciterId,
        });
    },
};

// ============================================================================
// SEARCH API
// ============================================================================

export const SearchApi = {
    /**
     * Search Quran content
     */
    search: async (
        query: string,
        options?: {
            language?: string;
            size?: number;
            page?: number;
        }
    ) => {
        return fetchApi(`${API_BASE}/search`, {
            q: query,
            language: options?.language,
            size: options?.size,
            page: options?.page,
        });
    },
};

// ============================================================================
// COMBINED EXPORT
// ============================================================================

export const QuranApi = {
    chapters: ChaptersApi,
    verses: VersesApi,
    audio: AudioApi,
    search: SearchApi,
};

export default QuranApi;
