// types/prayer-times.ts

export interface PrayerTimes {
    fajr: string;
    sunrise: string;
    zuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    date: string;
    hijriDate?: string;
}

export interface City {
    name: string;
    slug: string;
    latitude: number;
    longitude: number;
    timezone: string;
    state?: string;
}

export interface AladhanResponse {
    code: number;
    status: string;
    data: {
        timings: {
            Fajr: string;
            Sunrise: string;
            Dhuhr: string;
            Asr: string;
            Maghrib: string;
            Isha: string;
        };
        date: {
            readable: string;
            hijri: {
                date: string;
                month: {
                    en: string;
                    ar: string;
                };
                year: string;
            };
        };
        meta: {
            method: {
                name: string;
            };
        };
    };
}
