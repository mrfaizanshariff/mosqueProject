'use client';

import { useEffect } from 'react';

// Increment this version string whenever you deploy changes that require
// the service-worker caches to be purged (e.g. CSP updates, new external
// domains, major asset changes).  The component compares the stored version
// with this constant and, on mismatch, wipes every Cache Storage entry and
// re-registers the service worker so the browser fetches fresh resources.
const SW_CACHE_VERSION = '2';

export default function SWCacheClear() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('caches' in window)) return;

        const STORAGE_KEY = 'sw-cache-version';
        const storedVersion = localStorage.getItem(STORAGE_KEY);

        if (storedVersion === SW_CACHE_VERSION) return; // already up-to-date

        // Version mismatch → purge all caches and re-register the SW
        (async () => {
            try {
                // 1. Delete every cache in Cache Storage
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map((name) => caches.delete(name)));

                // 2. Unregister existing service workers so the new SW is fetched
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(registrations.map((r) => r.unregister()));
                }

                // 3. Persist the new version so we don't purge again
                localStorage.setItem(STORAGE_KEY, SW_CACHE_VERSION);

                // 4. Reload the page so the browser re-registers the SW with fresh caches
                window.location.reload();
            } catch (err) {
                console.error('[SWCacheClear] Failed to clear caches:', err);
            }
        })();
    }, []);

    return null;
}
