// lib/firebase/firestore.ts
'use client';

import {
    collection,
    addDoc,
    getDocs,
    doc,
    query,
    orderBy,
    limit,
    deleteDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Message, Conversation } from '@/types/chat';

// Conversation operations
export const createConversation = async (userId: string, title: string): Promise<string> => {
    try {
        console.log('createConversation called:', { userId, title });

        const conversationRef = await addDoc(
            collection(db, 'users', userId, 'conversations'),
            {
                title,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }
        );
        console.log('Conversation created with ID:', conversationRef.id);
        return conversationRef.id;
    } catch (error) {
        console.error('Error in createConversation:', error);
        throw error;
    }
};

export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
    try {
        console.log('getUserConversations called:', { userId });

        const q = query(
            collection(db, 'users', userId, 'conversations'),
            orderBy('updatedAt', 'desc'),
            limit(50)
        );

        const snapshot = await getDocs(q);
        const conversations = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: userId,
                title: data.title,
                createdAt: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
                updatedAt: (data.updatedAt as Timestamp)?.toMillis() || Date.now(),
                lastMessage: data.lastMessage,
            };
        });

        console.log('Found conversations:', conversations.length);
        return conversations;
    } catch (error) {
        console.error('Error in getUserConversations:', error);
        throw error;
    }
};

export const deleteConversation = async (userId: string, conversationId: string): Promise<void> => {
    try {
        console.log('deleteConversation called:', { userId, conversationId });

        // Delete all messages in the conversation first
        const messagesSnapshot = await getDocs(
            collection(db, 'users', userId, 'conversations', conversationId, 'messages')
        );
        const deleteMessagePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteMessagePromises);

        // Delete the conversation document
        await deleteDoc(doc(db, 'users', userId, 'conversations', conversationId));

        console.log('Conversation deleted successfully');
    } catch (error) {
        console.error('Error in deleteConversation:', error);
        throw error;
    }
};

// Message operations
export const addMessage = async (
    userId: string,
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
): Promise<string> => {
    try {
        console.log('addMessage called:', { userId, conversationId, role, content: content.substring(0, 50) });

        // Check if db is initialized
        if (!db) {
            throw new Error('Firestore database not initialized');
        }

        console.log('Adding message to Firestore...');
        const messageRef = await addDoc(
            collection(db, 'users', userId, 'conversations', conversationId, 'messages'),
            {
                role,
                content,
                timestamp: serverTimestamp(),
            }
        );
        console.log('Message added with ID:', messageRef.id);

        // Update conversation's lastMessage and updatedAt
        console.log('Updating conversation...');
        await updateDoc(
            doc(db, 'users', userId, 'conversations', conversationId),
            {
                lastMessage: content.substring(0, 100),
                updatedAt: serverTimestamp(),
            }
        );
        console.log('Conversation updated successfully');

        return messageRef.id;
    } catch (error) {
        console.error('Error in addMessage:', error);
        throw error;
    }
};

export const getConversationMessages = async (
    userId: string,
    conversationId: string
): Promise<Message[]> => {
    try {
        console.log('getConversationMessages called:', { userId, conversationId });

        const q = query(
            collection(db, 'users', userId, 'conversations', conversationId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const snapshot = await getDocs(q);
        const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                conversationId: conversationId,
                role: data.role,
                content: data.content,
                timestamp: (data.timestamp as Timestamp)?.toMillis() || Date.now(),
            };
        });

        console.log('Found messages:', messages.length);
        return messages;
    } catch (error) {
        console.error('Error in getConversationMessages:', error);
        throw error;
    }
};
