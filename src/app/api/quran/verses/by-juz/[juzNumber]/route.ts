// app/api/quran/verses/by-juz/[juzNumber]/route.ts
/**
 * API Route for fetching verses by Juz number
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { VerseService } from '@/lib/quran/services';
import { JuzNumber } from '@quranjs/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ juzNumber: string }> }
) {
    try {
        const { juzNumber: juzNumberStr } = await params;
        const parsedNumber = parseInt(juzNumberStr, 10);

        if (isNaN(parsedNumber) || parsedNumber < 1 || parsedNumber > 30) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid Juz number. Must be between 1 and 30.',
                },
                { status: 400 }
            );
        }

        const juzNumber = parsedNumber as JuzNumber;

        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page');
        const perPage = searchParams.get('perPage');
        const translations = searchParams.get('translations');

        const verses = await VerseService.getByJuz(juzNumber, {
            page: page ? parseInt(page) : undefined,
            perPage: perPage ? parseInt(perPage) : undefined,
            translations: translations ? translations.split(',').map(Number) : undefined,
        });

        return NextResponse.json({
            success: true,
            data: verses,
        });
    } catch (error) {
        console.error('API Error - Get verses by Juz:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch verses',
            },
            { status: 500 }
        );
    }
}
