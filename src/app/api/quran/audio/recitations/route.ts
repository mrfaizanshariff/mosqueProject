// app/api/quran/audio/recitations/route.ts
/**
 * API Route for fetching all chapter recitations for a reciter
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { AudioService } from '@/lib/quran/services';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const reciterId = searchParams.get('reciterId') || '7';
    try {

        const recitations = await AudioService.getAllChapterRecitations(reciterId);

        return NextResponse.json({
            success: true,
            data: recitations,
        });
    } catch (error) {
        console.error('API Error - Get all recitations:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch recitations',
            },
            { status: 500 }
        );
    }
}
