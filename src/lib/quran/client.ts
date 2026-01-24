// lib/quran/client.ts
/**
 * Singleton QuranClient instance
 * Industry-level pattern: Single source of truth for API configuration
 */

import { QuranClient, Language } from '@quranjs/api';

let quranClientInstance: QuranClient | null = null;

/**
 * Get or create QuranClient singleton instance
 * Benefits:
 * - Single authenticated connection
 * - Cached token management
 * - Consistent configuration across app
 * - Lazy initialization
 */
export function getQuranClient(): QuranClient {
  if (quranClientInstance) {
    return quranClientInstance;
  }

  // Validate environment variables
  const clientId = process.env.NEXT_PUBLIC_QURAN_CLIENT_ID || "6ce99855-56fd-4016-a6ce-ab01cf15a83b";
  const clientSecret = process.env.NEXT_PUBLIC_QURAN_CLIENT_SECRET || "UbFA.TdPNhAZLPI14~IyUHT_jk";

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Quran API credentials. Please set NEXT_PUBLIC_QURAN_CLIENT_ID and NEXT_PUBLIC_QURAN_CLIENT_SECRET in your .env file'
    );
  }

  quranClientInstance = new QuranClient({
    clientId,
    clientSecret,
    defaults: {
      language: Language.ENGLISH,
    },
  });

  return quranClientInstance;
}

/**
 * Reset the client instance (useful for testing or re-authentication)
 */
export function resetQuranClient(): void {
  if (quranClientInstance) {
    quranClientInstance.clearCachedToken();
    quranClientInstance = null;
  }
}

/**
 * Get current client configuration
 */
export function getQuranClientConfig() {
  const client = getQuranClient();
  return client.getConfig();
}

/**
 * Update client configuration at runtime
 */
export function updateQuranClientConfig(config: {
  defaults?: { language?: Language };
}) {
  const client = getQuranClient();
  client.updateConfig(config);
}