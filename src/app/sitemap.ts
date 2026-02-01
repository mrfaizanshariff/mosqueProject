// app/sitemap.ts

import { MetadataRoute } from 'next';
import { getAllCitySlugs } from '@/lib/prayer-times/cities';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://mosqueofindia.com';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/quran`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/quran-gpt`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ramadan`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    // Namaz timings pages for all cities
    const citySlugs = getAllCitySlugs();
    const namazPages: MetadataRoute.Sitemap = citySlugs.map((slug) => ({
        url: `${baseUrl}/namaz-timings/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [...staticPages, ...namazPages];
}
