// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '@/types/chat';

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'https://mosque-of-india-chatbot.onrender.com';

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();

        const { conversation_id, query } = body;

        if (!query || !conversation_id) {
            return NextResponse.json(
                { error: 'Missing required fields: query and conversation_id' },
                { status: 400 }
            );
        }

        // Call the Mosque of India chatbot API
        const response = await fetch(`${CHATBOT_API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversation_id,
                query,
            }),
        });

        if (!response.ok) {
            throw new Error(`Chatbot API error: ${response.statusText}`);
        }

        const data = await response.json();

        const chatResponse: ChatResponse = {
            response: data.response || data.answer || 'I apologize, but I could not generate a response.',
            conversation_id,
            timestamp: Date.now(),
        };

        return NextResponse.json(chatResponse);
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to process chat request',
            },
            { status: 500 }
        );
    }
}
