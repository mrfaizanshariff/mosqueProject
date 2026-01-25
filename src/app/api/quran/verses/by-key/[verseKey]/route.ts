// app/api/quran/verses/by-key/[verseKey]/route.ts
/**
 * API Route for fetching a verse by key (e.g., "2:255")
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { VerseService } from '@/lib/quran/services';
import { VerseKey } from '@quranjs/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ verseKey: string }> }
) {
    try {
        const { verseKey: verseKeyParam } = await params;
        // Decode the verse key (e.g., "2:255" might be URL encoded)
        const verseKey = decodeURIComponent(verseKeyParam) as VerseKey;

        // Validate verse key format
        const keyPattern = /^\d{1,3}:\d{1,3}$/;
        if (!keyPattern.test(verseKey)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid verse key format. Expected format: "chapter:verse" (e.g., "2:255")',
                },
                { status: 400 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const translations = searchParams.get('translations');
        const tafsirs = searchParams.get('tafsirs');
        const words = searchParams.get('words');

        const verse = await VerseService.getByKey(verseKey, {
            translations: translations ? translations.split(',').map(Number) : undefined,
            tafsirs: tafsirs ? tafsirs.split(',').map(Number) : undefined,
            words: words !== null ? words === 'true' : undefined,
        });

        return NextResponse.json({
            success: true,
            data: verse,
        });
    } catch (error) {
        console.error('API Error - Get verse by key:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch verse',
            },
            { status: 500 }
        );
    }
}
