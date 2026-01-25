// app/api/quran/verses/by-chapter/[chapterId]/route.ts
/**
 * API Route for fetching verses by chapter
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { VerseService } from '@/lib/quran/services';
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
        const page = searchParams.get('page');
        const perPage = searchParams.get('perPage');
        const translations = searchParams.get('translations');
        const words = searchParams.get('words');

        // Parse word fields from query params
        const wordFields = {
            textUthmani: searchParams.get('wordFields.textUthmani') === 'true',
            textIndopak: searchParams.get('wordFields.textIndopak') === 'true',
            transliteration: searchParams.get('wordFields.transliteration') === 'true',
            translation: searchParams.get('wordFields.translation') === 'true',
            audio: searchParams.get('wordFields.audio') === 'true',
        };

        // Parse fields from query params
        const fields = {
            textUthmani: searchParams.get('fields.textUthmani') === 'true',
            textUthmaniTajweed: searchParams.get('fields.textUthmaniTajweed') === 'true',
            pageNumber: searchParams.get('fields.pageNumber') === 'true',
            juzNumber: searchParams.get('fields.juzNumber') === 'true',
        };

        const verses = await VerseService.getByChapter(chapterId, {
            page: page ? parseInt(page) : undefined,
            perPage: perPage ? parseInt(perPage) : undefined,
            translations: translations ? translations.split(',').map(Number) : undefined,
            words: words !== null ? words === 'true' : undefined,
            wordFields: Object.values(wordFields).some(Boolean) ? wordFields : undefined,
            fields: Object.values(fields).some(Boolean) ? fields : undefined,
        });

        return NextResponse.json({
            success: true,
            data: verses,
        });
    } catch (error) {
        console.error('API Error - Get verses by chapter:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch verses',
            },
            { status: 500 }
        );
    }
}
