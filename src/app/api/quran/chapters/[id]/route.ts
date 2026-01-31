// app/api/quran/chapters/[id]/route.ts
/**
 * API Route for fetching a specific chapter by ID
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { ChapterService } from '@/lib/quran/services';
import { ChapterId, Language } from '@quranjs/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') as Language | null;
    try {
        const { id } = await params;
        const parsedId = parseInt(id, 10);

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


        const chapter = await ChapterService.getById(chapterId, {
            language: language || undefined,
            fields: 'text_indopak'
        });

        return NextResponse.json({
            success: true,
            data: chapter,
        });
    } catch (error) {
        console.error('API Error - Get chapter by ID:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch chapter',
            },
            { status: 500 }
        );
    }
}
