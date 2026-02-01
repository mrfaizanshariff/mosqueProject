// components/quran-gpt/MessageList.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
    messages: Message[];
    isStreaming: boolean;
}

export default function MessageList({ messages, isStreaming }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isStreaming]);

    if (messages.length === 0 && !isStreaming) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-3xl">📖</span>
                    </div>
                    <h2 className="text-2xl font-bold">Welcome to Quran GPT</h2>
                    <p className="text-muted-foreground">
                        Ask me anything about the Quran, Islamic teachings, or seek guidance on your spiritual journey.
                    </p>
                    <div className="grid gap-2 text-sm">
                        <div className="p-3 bg-muted/50 rounded-lg text-left">
                            💡 "What does the Quran say about patience?"
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-left">
                            💡 "Explain the concept of Tawheed"
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-left">
                            💡 "What are the pillars of Islam?"
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}

                {isStreaming && (
                    <div className="flex gap-4 p-6 bg-muted/30">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                        <div className="flex-1">
                            <span className="font-semibold text-sm">Quran GPT</span>
                            <p className="text-muted-foreground text-sm mt-1">Thinking...</p>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
