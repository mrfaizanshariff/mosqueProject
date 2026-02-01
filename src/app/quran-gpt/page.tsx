// app/quran-gpt/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useChat } from '@/hooks/useChat';
import { useChatHistory } from '@/hooks/useChatHistory';
import HistorySidebar from '@/components/quran-gpt/HistorySidebar';
import MessageList from '@/components/quran-gpt/MessageList';
import ChatInput from '@/components/quran-gpt/ChatInput';
import { LogIn, Loader2 } from 'lucide-react';

export default function QuranGPTPage() {
    const { user, loading: authLoading, signInAnon, signInWithGoogle } = useFirebaseAuth();
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const pendingMessageRef = useRef<string | null>(null);

    const {
        conversations,
        loading: historyLoading,
        createNewConversation,
        deleteConversation,
    } = useChatHistory(user?.uid || null);

    const {
        messages,
        loading: chatLoading,
        isStreaming,
        sendMessage,
    } = useChat(activeConversationId, user?.uid || null);

    // Auto-select first conversation or create new one
    useEffect(() => {
        if (user && conversations.length > 0 && !activeConversationId) {
            setActiveConversationId(conversations[0].id);
        }
    }, [user, conversations, activeConversationId]);

    // Send pending message when conversation is created
    useEffect(() => {
        if (activeConversationId && pendingMessageRef.current) {
            const message = pendingMessageRef.current;
            pendingMessageRef.current = null;
            sendMessage(message);
        }
    }, [activeConversationId, sendMessage]);

    const handleNewChat = async () => {
        if (!user) return;

        const conversationId = await createNewConversation('New Chat');
        if (conversationId) {
            setActiveConversationId(conversationId);
        }
    };

    const handleSendMessage = async (content: string) => {
        if (!activeConversationId && user) {
            // Store message and create new conversation
            pendingMessageRef.current = content;
            const conversationId = await createNewConversation(content.substring(0, 50));
            if (conversationId) {
                setActiveConversationId(conversationId);
                // The useEffect above will send the message
            }
        } else {
            await sendMessage(content);
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
                            <span className="text-4xl">📖</span>
                        </div>
                        <h1 className="text-4xl font-bold">Quran GPT</h1>
                        <p className="text-xl text-muted-foreground">
                            Your AI companion for Islamic knowledge and guidance
                        </p>
                    </div>

                    <div className="space-y-4 pt-8">
                        <button
                            onClick={signInWithGoogle}
                            className="w-full bg-white text-gray-900 border border-gray-300 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={signInAnon}
                            className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            Continue as Guest
                        </button>
                    </div>

                    <p className="text-sm text-muted-foreground pt-4">
                        Sign in to save your conversation history across devices
                    </p>
                </div>
            </div>
        );
    }

    // Main chat interface
    return (
        <div className="h-screen flex bg-background">
            {/* Sidebar */}
            <HistorySidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={setActiveConversationId}
                onNewChat={handleNewChat}
                onDeleteConversation={deleteConversation}
                loading={historyLoading}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                <MessageList messages={messages} isStreaming={isStreaming} />
                <ChatInput
                    onSend={handleSendMessage}
                    disabled={chatLoading || isStreaming}
                />
            </div>
        </div>
    );
}
