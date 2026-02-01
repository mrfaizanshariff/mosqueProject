// types/chat.ts

export interface Message {
    id: string;
    conversationId: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    createdAt?: Date;
}

export interface Conversation {
    id: string;
    userId: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    lastMessage?: string;
}

export interface ChatResponse {
    response: string;
    conversation_id: string;
    timestamp?: number;
}

export interface ChatRequest {
    conversation_id: string;
    query: string;
}
