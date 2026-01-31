// app/api/quran/search/route.ts
/**
 * API Route for searching Quran content
 * Server-side implementation for @quranjs/api
 */

import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/quran/services';
import { Language } from '@quranjs/api';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || searchParams.get('query');
    const language = searchParams.get('language') as Language | null;
    const size = searchParams.get('size');
    const page = searchParams.get('page');
    try {

        if (!query || query.trim() === '') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Search query is required. Use "q" or "query" parameter.',
                },
                { status: 400 }
            );
        }


        const results = await SearchService.search(query, {
            language: language || undefined,
            size: size ? parseInt(size) : undefined,
            page: page ? parseInt(page) : undefined,
        });

        return NextResponse.json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error('API Error - Search:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Search failed',
            },
            { status: 500 }
        );
    }
}
