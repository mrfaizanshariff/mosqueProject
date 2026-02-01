// components/quran-gpt/HistorySidebar.tsx
'use client';

import React, { useState } from 'react';
import { Conversation } from '@/types/chat';
import { Plus, Trash2, MessageSquare, Menu, X } from 'lucide-react';

interface HistorySidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewChat: () => void;
    onDeleteConversation: (id: string) => void;
    loading?: boolean;
}

export default function HistorySidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewChat,
    onDeleteConversation,
    loading = false,
}: HistorySidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const sidebarContent = (
        <div className="h-full flex flex-col bg-muted/30 border-r border-border">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <button
                    onClick={onNewChat}
                    className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Chat
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                    <div className="text-center text-muted-foreground py-8">
                        Loading conversations...
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 px-4">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No conversations yet</p>
                        <p className="text-xs mt-1">Start a new chat to begin</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${activeConversationId === conversation.id
                                        ? 'bg-primary/10 border border-primary/20'
                                        : 'hover:bg-muted'
                                    }`}
                                onClick={() => onSelectConversation(conversation.id)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm truncate">
                                            {conversation.title}
                                        </h3>
                                        {conversation.lastMessage && (
                                            <p className="text-xs text-muted-foreground truncate mt-1">
                                                {conversation.lastMessage}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDate(conversation.updatedAt)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this conversation?')) {
                                                onDeleteConversation(conversation.id);
                                            }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                                        aria-label="Delete conversation"
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                    Quran GPT - Islamic AI Assistant
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-lg shadow-lg"
                aria-label="Toggle sidebar"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 h-full">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="lg:hidden fixed inset-y-0 left-0 w-80 z-50">
                        {sidebarContent}
                    </div>
                </>
            )}
        </>
    );
}
