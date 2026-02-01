// lib/prayer-times/aladhan.ts

import { PrayerTimes, AladhanResponse, City } from '@/types/prayer-times';

const ALADHAN_API_URL = process.env.NEXT_PUBLIC_ALADHAN_API_URL || 'https://api.aladhan.com/v1';

// Method 1 = University of Islamic Sciences, Karachi (commonly used in India)
// Method 3 = Muslim World League (alternative)
const CALCULATION_METHOD = 1;

// Delay function for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry with exponential backoff
async function fetchWithRetry(url: string, retries = 3, delayMs = 1000): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                next: { revalidate: 3600 }, // Revalidate every hour
            });

            if (response.status === 429) {
                // Rate limited - wait and retry
                const waitTime = delayMs * Math.pow(2, i); // Exponential backoff
                console.log(`Rate limited. Waiting ${waitTime}ms before retry ${i + 1}/${retries}`);
                await delay(waitTime);
                continue;
            }

            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await delay(delayMs * Math.pow(2, i));
        }
    }
    throw new Error('Max retries reached');
}

export async function getPrayerTimesByCity(city: City, date?: Date): Promise<PrayerTimes> {
    const targetDate = date || new Date();
    const timestamp = Math.floor(targetDate.getTime() / 1000);

    try {
        const url = `${ALADHAN_API_URL}/timings/${timestamp}?latitude=${city.latitude}&longitude=${city.longitude}&method=${CALCULATION_METHOD}&school=1`;

        // Add a small delay to avoid hitting rate limits during build
        if (process.env.NODE_ENV === 'production') {
            await delay(500);
        }

        const response = await fetchWithRetry(url);

        if (!response.ok) {
            throw new Error(`Aladhan API error: ${response.statusText}`);
        }

        const data: AladhanResponse = await response.json();

        if (data.code !== 200) {
            throw new Error('Failed to fetch prayer times');
        }

        const prayerTimes: PrayerTimes = {
            fajr: data.data.timings.Fajr,
            sunrise: data.data.timings.Sunrise,
            zuhr: data.data.timings.Dhuhr,
            asr: data.data.timings.Asr,
            maghrib: data.data.timings.Maghrib,
            isha: data.data.timings.Isha,
            date: data.data.date.readable,
            hijriDate: `${data.data.date.hijri.date} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`,
        };

        return prayerTimes;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        throw error;
    }
}

export function formatPrayerTime(time: string): string {
    // Remove timezone info (e.g., "05:30 (IST)" -> "05:30")
    return time.split(' ')[0];
}
