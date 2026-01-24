// lib/quran/services.ts
/**
 * Service Layer Pattern
 * Industry best practice: Separate business logic from API calls
 * Benefits:
 * - Single Responsibility Principle
 * - Easy to test and mock
 * - Centralized error handling
 * - Caching strategies
 * - Type-safe responses
 */

import { getQuranClient, updateQuranClientConfig } from './client';
import { ChapterId, JuzNumber, Language, PageNumber, VerseKey } from '@quranjs/api';

// ============================================================================
// CHAPTERS SERVICE
// ============================================================================

export class ChapterService {
  private static cache = new Map<string, any>();
  private static CACHE_TTL = 1000 * 60 * 60; // 1 hour (chapters rarely change)

  /**
   * Get all chapters with caching
   * Chapters are static data - perfect for aggressive caching
   */
  static async getAll(options?: { language?: Language }) {
    const cacheKey = `chapters:${options?.language || 'default'}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const client = getQuranClient();
      const chapters = await client.chapters.findAll(options);

      this.cache.set(cacheKey, {
        data: chapters,
        timestamp: Date.now(),
      });

      return chapters;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw new Error('Failed to fetch chapters');
    }
  }

  /**
   * Get chapter by ID
   */
  static async getById(id: ChapterId, options?: { language?: Language }) {
    const cacheKey = `chapter:${id}:${options?.language || 'default'}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const client = getQuranClient();
    //   const chapter = await client.verses.findByChapter(id, options);
      const chapter = await client.chapters.findById(id, options);

      this.cache.set(cacheKey, {
        data: chapter,
        timestamp: Date.now(),
      });

      return chapter;
    } catch (error) {
      console.error(`Error fetching chapter ${id}:`, error);
      throw new Error(`Failed to fetch chapter ${id}`);
    }
  }

  /**
   * Get chapter info (description)
   */
  static async getInfo(id: ChapterId, options?: { language?: Language }) {
    try {
      const client = getQuranClient();
      return await client.chapters.findInfoById(id, options);
    } catch (error) {
      console.error(`Error fetching chapter info ${id}:`, error);
      throw new Error(`Failed to fetch chapter info ${id}`);
    }
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  static clearCache() {
    this.cache.clear();
  }
}

// ============================================================================
// VERSES SERVICE
// ============================================================================

export class VerseService {
  /**
   * Get verses by chapter with pagination
   * Best practice: Always paginate large data sets
   */
  static async getByChapter(
    chapterId: ChapterId,
    options?: {
      page?: number;
      perPage?: number;
      translations?: number[];
      words?: boolean;
      wordFields?: {
        textUthmani?: boolean;
        textIndopak?: boolean;
        transliteration?: boolean;
        translation?: boolean;
        audio?: boolean;
      };
      fields?: {
        textUthmani?: boolean;
        textUthmaniTajweed?: boolean;
        pageNumber?: boolean;
        juzNumber?: boolean;
      };
    }
  ) {
    try {
      const client = getQuranClient();
      return await client.verses.findByChapter(chapterId, {
        page: options?.page || 1,
        perPage: options?.perPage || 500,
        translations: options?.translations || [131], // Default: Sahih International
        words: options?.words ?? true,
        wordFields: options?.wordFields || {
          textIndopak: true,
          transliteration: true,
          translation: true,
          audio: true,
        },
        fields: options?.fields,
      });
    } catch (error) {
      console.error(`Error fetching verses for chapter ${chapterId}:`, error);
      throw new Error(`Failed to fetch verses for chapter ${chapterId}`);
    }
  }

  /**
   * Get single verse by key (e.g., "2:255")
   */
  static async getByKey(
    verseKey: VerseKey,
    options?: {
      translations?: number[];
      words?: boolean;
      tafsirs?: number[];
    }
  ) {
    try {
      const client = getQuranClient();
      return await client.verses.findByKey(verseKey, {
        translations: options?.translations || [131],
        tafsirs: options?.tafsirs,
        words: options?.words ?? true,
        wordFields: {
         textUthmani: true,
        },
      });
    } catch (error) {
      console.error(`Error fetching verse ${verseKey}:`, error);
      throw new Error(`Failed to fetch verse ${verseKey}`);
    }
  }

  /**
   * Get verses by Juz
   */
  static async getByJuz(
    juzNumber: JuzNumber,
    options?: {
      page?: number;
      perPage?: number;
      translations?: number[];
    }
  ) {
    try {
      const client = getQuranClient();
      return await client.verses.findByJuz(juzNumber, {
        page: options?.page || 1,
        perPage: options?.perPage || 50,
        translations: options?.translations || [131],
      });
    } catch (error) {
      console.error(`Error fetching verses for Juz ${juzNumber}:`, error);
      throw new Error(`Failed to fetch verses for Juz ${juzNumber}`);
    }
  }

  /**
   * Get verses by page number
   */
  static async getByPage(
    pageNumber: PageNumber,
    options?: {
      translations?: number[];
      words?: boolean;
    }
  ) {
    try {
      const client = getQuranClient();
      return await client.verses.findByPage(pageNumber, {
        translations: options?.translations || [131],
        words: options?.words ?? true,
      });
    } catch (error) {
      console.error(`Error fetching verses for page ${pageNumber}:`, error);
      throw new Error(`Failed to fetch verses for page ${pageNumber}`);
    }
  }

  /**
   * Get random verse (for daily verse feature)
   */
  static async getRandom(options?: { translations?: number[] }) {
    try {
      const client = getQuranClient();
      return await client.verses.findRandom({
        translations: options?.translations || [131],
        words: true,
      });
    } catch (error) {
      console.error('Error fetching random verse:', error);
      throw new Error('Failed to fetch random verse');
    }
  }
}

// ============================================================================
// AUDIO SERVICE
// ============================================================================
const QURAN_API_BASE = 'https://apis.quran.foundation/content/api/v4';

export class AudioService {
  /**
   * Get chapter audio recitations
   * @param chapterId - Chapter ID (1-114)
   * @param reciterId - Reciter ID (default: 7 = Mishari Al-Afasy)
   */
  static async getChapterRecitation(
    chapterId: ChapterId,
    reciterId: string = '7',
    options: {
        segments?: boolean; // Word-by-word timing
    }
  ) {
    try {
      const client = getQuranClient();
       // Save current config
      const currentConfig = client.getConfig();
    //   client.updateConfig({ defaults: { language: undefined } });
    //   const audio = client.audio.findAllChapterRecitations(reciterId);;
    // const audio = await client.fetcher.fetch(`/content/api/v4/chapter_recitations/${reciterId}/${chapterId}`, options);
      const audio = await client.audio.findChapterRecitationById(reciterId,chapterId,options);
        
      // Restore original config
    //   client.updateConfig(currentConfig);
      return audio as any;

    //  const url = `${QURAN_API_BASE}/chapter_recitations/${reciterId}/${chapterId}?${options.segments ? 'segments=true' : ''}`;
    
    // const response = await fetch(url, {
    //   headers: { 'Accept': 'application/json',
    //      'x-auth-token': , 
    //      'x-client-id': '6ce99855-56fd-4016-a6ce-ab01cf15a83b'
    //    }
    // });
    
    // const data = await response.json();
    
    // return {
    //   audioUrl: data.audio_file?.audio_url,
    //   duration: data.audio_file?.duration,
    //   verseTimings: data.audio_file?.verse_timings
    //   // ... normalized structure
    // };
    } catch (error) {
      console.error(
        `Error fetching audio for chapter ${chapterId}:`,
        error
      );
      throw new Error(`Failed to fetch audio for chapter ${chapterId}`);
    }
  }

  /**
   * Get all chapter recitations for a reciter
   */
  static async getAllChapterRecitations(reciterId: string = '7') {
    try {
      const client = getQuranClient();
      return await client.audio.findAllChapterRecitations(reciterId);
    } catch (error) {
      console.error('Error fetching chapter recitations:', error);
      throw new Error('Failed to fetch chapter recitations');
    }
  }

  /**
   * Get verse-by-verse audio with timestamps
   * Critical for word-by-word highlighting
   */
  static async getVerseRecitationsByChapter(
    chapterId: ChapterId,
    reciterId: string = '7'
  ) {
    try {
      const client = getQuranClient();
      return await client.audio.findVerseRecitationsByChapter(
        chapterId,
        reciterId,
        {
          fields: {
            // url: true,
            // duration: true,
            segments: true, // Word-by-word timing
            format: true,
          },
        }
      );
    } catch (error) {
      console.error(
        `Error fetching verse audio for chapter ${chapterId}:`,
        error
      );
      throw new Error(`Failed to fetch verse audio for chapter ${chapterId}`);
    }
  }

  /**
   * Get audio for specific verse
   */
  static async getVerseRecitationByKey(
    verseKey: VerseKey,
    reciterId: string = '7'
  ) {
    try {
      const client = getQuranClient();
      return await client.audio.findVerseRecitationsByKey(verseKey, reciterId);
    } catch (error) {
      console.error(`Error fetching audio for verse ${verseKey}:`, error);
      throw new Error(`Failed to fetch audio for verse ${verseKey}`);
    }
  }
}

// ============================================================================
// SEARCH SERVICE
// ============================================================================

export class SearchService {
  /**
   * Search Quran content
   */
  static async search(
    query: string,
    options?: {
      language?: Language;
      size?: number;
      page?: number;
    }
  ) {
    try {
      const client = getQuranClient();
      return await client.search.search(query, {
        language: options?.language || Language.ENGLISH,
        size: options?.size || 20,
        page: options?.page || 1,
      });
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
      throw new Error(`Search failed for "${query}"`);
    }
  }
}

// ============================================================================
// UTILITY: Translation IDs Reference
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