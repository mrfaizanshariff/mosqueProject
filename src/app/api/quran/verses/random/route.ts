// app/api/quran/verses/random/route.ts
/**
 * API Route for fetching a random verse
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { VerseService } from '@/lib/quran/services';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const translations = searchParams.get('translations');

        const verse = await VerseService.getRandom({
            translations: translations ? translations.split(',').map(Number) : undefined,
        });

        return NextResponse.json({
            success: true,
            data: verse,
        });
    } catch (error) {
        console.error('API Error - Get random verse:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch random verse',
            },
            { status: 500 }
        );
    }
}
