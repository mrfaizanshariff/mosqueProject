// hooks/useChatHistory.ts
'use client';

import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import {
    createConversation,
    deleteConversation as deleteConversationDb,
} from '@/lib/firebase/firestore';
import { Conversation } from '@/types/chat';

export const useChatHistory = (userId: string | null) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setConversations([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, 'users', userId, 'conversations'),
            orderBy('updatedAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const convos = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        userId: userId,
                        title: data.title,
                        createdAt: data.createdAt?.toMillis() || Date.now(),
                        updatedAt: data.updatedAt?.toMillis() || Date.now(),
                        lastMessage: data.lastMessage,
                    };
                });
                setConversations(convos);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error fetching conversations:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    const createNewConversation = async (title: string = 'New Chat'): Promise<string | null> => {
        if (!userId) return null;

        try {
            const conversationId = await createConversation(userId, title);
            return conversationId;
        } catch (err) {
            console.error('Error creating conversation:', err);
            setError(err instanceof Error ? err.message : 'Failed to create conversation');
            return null;
        }
    };

    const deleteConversation = async (conversationId: string): Promise<void> => {
        if (!userId) return;

        try {
            await deleteConversationDb(userId, conversationId);
        } catch (err) {
            console.error('Error deleting conversation:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete conversation');
        }
    };

    return {
        conversations,
        loading,
        error,
        createNewConversation,
        deleteConversation,
    };
};
