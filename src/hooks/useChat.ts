// hooks/useChat.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { addMessage } from '@/lib/firebase/firestore';
import { Message, ChatRequest, ChatResponse } from '@/types/chat';

export const useChat = (conversationId: string | null, userId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    // Real-time listener for messages
    useEffect(() => {
        if (!conversationId || !userId) {
            setMessages([]);
            return;
        }

        const q = query(
            collection(db, 'users', userId, 'conversations', conversationId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const msgs = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        conversationId: conversationId,
                        role: data.role,
                        content: data.content,
                        timestamp: data.timestamp?.toMillis() || Date.now(),
                    };
                });
                setMessages(msgs);
            },
            (err) => {
                console.error('Error fetching messages:', err);
                setError(err.message);
            }
        );

        return () => unsubscribe();
    }, [conversationId, userId]);

    const sendMessage = useCallback(
        async (content: string): Promise<void> => {
            if (!conversationId || !userId || !content.trim()) {
                console.log('sendMessage blocked:', { conversationId, userId, hasContent: !!content.trim() });
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setIsStreaming(true);

                console.log('Sending message:', { conversationId, content });

                // Add user message to Firestore
                await addMessage(userId, conversationId, 'user', content);

                // Call AI API
                const chatRequest: ChatRequest = {
                    conversation_id: conversationId,
                    query: content,
                };

                console.log('Calling chat API:', chatRequest);

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(chatRequest),
                });

                console.log('API response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API error response:', errorText);
                    throw new Error(`API error: ${response.statusText}`);
                }

                const data: ChatResponse = await response.json();
                console.log('API response data:', data);

                // Add AI response to Firestore
                await addMessage(userId, conversationId, 'assistant', data.response);
            } catch (err) {
                console.error('Error sending message:', err);
                setError(err instanceof Error ? err.message : 'Failed to send message');
            } finally {
                setLoading(false);
                setIsStreaming(false);
            }
        },
        [conversationId, userId]
    );

    return {
        messages,
        loading,
        error,
        isStreaming,
        sendMessage,
    };
};
