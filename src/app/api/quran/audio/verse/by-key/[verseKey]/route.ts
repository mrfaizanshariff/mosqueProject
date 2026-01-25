// app/api/quran/audio/verse/by-key/[verseKey]/route.ts
/**
 * API Route for fetching audio for a specific verse
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { AudioService } from '@/lib/quran/services';
import { VerseKey } from '@quranjs/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ verseKey: string }> }
) {
    try {
        const { verseKey: verseKeyParam } = await params;
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
        const reciterId = searchParams.get('reciterId') || '7';

        const audio = await AudioService.getVerseRecitationByKey(verseKey, reciterId);

        return NextResponse.json({
            success: true,
            data: audio,
        });
    } catch (error) {
        console.error('API Error - Get verse audio by key:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch verse audio',
            },
            { status: 500 }
        );
    }
}
