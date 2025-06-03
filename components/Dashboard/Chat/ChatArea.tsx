import React from 'react';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { EmptyChat } from './EmptyChat';
import { Loader2 } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';

interface ChatAreaProps {
    currentConversation: any;
    isLoading: boolean;
    onSendMessage: (message: string, attachments?: any[]) => Promise<void>;
    onDeleteMessage?: (messageId: string) => Promise<void>;
    onEditMessage?: (messageId: string, content: string) => Promise<void>;
    onStartNewChat?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
    currentConversation,
    isLoading,
    onSendMessage,
    onDeleteMessage,
    onEditMessage,
    onStartNewChat
}) => {
    // Extract the actual conversation data from the nested structure if needed
    const conversationData = currentConversation?.data || currentConversation;

    if (isLoading) {
        return (
            <Card className="h-[calc(80vh-2rem)] flex flex-col items-center justify-center dark:bg-slate-800/50 dark:border-slate-700/50 backdrop-blur-sm shadow-lg transition-all duration-300">
                <div className="relative">
                    {/* Subtle glow effect behind loader */}
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                    <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin relative z-10" />
                </div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading conversation...</p>
            </Card>
        );
    }

    return (
        <Card className="h-[calc(80vh-2rem)] flex flex-col border-indigo-100 dark:border-slate-700/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg transition-all duration-300 overflow-hidden">
            {/* Subtle background gradient for brand consistency */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-500/5 dark:to-indigo-500/10 pointer-events-none" />

            <div className="relative z-10 h-full flex flex-col">
                {conversationData ? (
                    <>
                        <ChatHeader conversation={conversationData} />
                        <MessageList
                            conversation={conversationData}
                            onDeleteMessage={onDeleteMessage}
                            onEditMessage={onEditMessage}
                        />
                        {conversationData.id && <TypingIndicator conversationId={conversationData.id} />}
                        <MessageInput
                            conversationId={conversationData.id}
                            onSendMessage={onSendMessage}
                        />
                    </>
                ) : (
                    <EmptyChat onStartNewChat={onStartNewChat} />
                )}
            </div>
        </Card>
    );
};
