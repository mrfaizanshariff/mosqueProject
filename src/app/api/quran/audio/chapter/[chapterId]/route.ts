// app/api/quran/audio/chapter/[chapterId]/route.ts
/**
 * API Route for fetching chapter audio recitation
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { AudioService } from '@/lib/quran/services';
import { ChapterId } from '@quranjs/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ chapterId: string }> }
) {
    try {
        const { chapterId: chapterIdStr } = await params;
        const parsedId = parseInt(chapterIdStr, 10);

        if (isNaN(parsedId) || parsedId < 1 || parsedId > 114) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid chapter ID. Must be between 1 and 114.',
                },
                { status: 400 }
            );
        }

        const chapterId = parsedId as ChapterId;

        const searchParams = request.nextUrl.searchParams;
        const reciterId = searchParams.get('reciterId') || '7';
        const segments = searchParams.get('segments') === 'true';

        const audio = await AudioService.getChapterRecitation(chapterId, reciterId, {
            segments,
        });

        return NextResponse.json({
            success: true,
            data: audio,
        });
    } catch (error) {
        console.error('API Error - Get chapter audio:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch chapter audio',
            },
            { status: 500 }
        );
    }
}
