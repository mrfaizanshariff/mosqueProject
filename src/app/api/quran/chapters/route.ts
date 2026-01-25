// app/api/quran/chapters/route.ts
/**
 * API Route for fetching all Quran chapters
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { ChapterService } from '@/lib/quran/services';
import { Language } from '@quranjs/api';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const language = searchParams.get('language') as Language | null;

        const chapters = await ChapterService.getAll({
            language: language || undefined,
        });

        return NextResponse.json({
            success: true,
            data: chapters,
        });
    } catch (error) {
        console.error('API Error - Get all chapters:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch chapters',
            },
            { status: 500 }
        );
    }
}
