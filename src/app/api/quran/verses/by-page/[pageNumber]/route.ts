// app/api/quran/verses/by-page/[pageNumber]/route.ts
/**
 * API Route for fetching verses by page number
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { VerseService } from '@/lib/quran/services';
import { PageNumber } from '@quranjs/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ pageNumber: string }> }
) {
    try {
        const { pageNumber: pageNumberStr } = await params;
        const parsedNumber = parseInt(pageNumberStr, 10);

        if (isNaN(parsedNumber) || parsedNumber < 1 || parsedNumber > 604) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid page number. Must be between 1 and 604.',
                },
                { status: 400 }
            );
        }

        const pageNumber = parsedNumber as PageNumber;

        const searchParams = request.nextUrl.searchParams;
        const translations = searchParams.get('translations');
        const words = searchParams.get('words');

        const verses = await VerseService.getByPage(pageNumber, {
            translations: translations ? translations.split(',').map(Number) : undefined,
            words: words !== null ? words === 'true' : undefined,
        });

        return NextResponse.json({
            success: true,
            data: verses,
        });
    } catch (error) {
        console.error('API Error - Get verses by page:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch verses',
            },
            { status: 500 }
        );
    }
}
