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
            <Card className="h-[calc(80vh-2rem)] flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                <p className="mt-4 text-sm text-gray-500">Loading conversation...</p>
            </Card>
        );
    }

    return (
        <Card className="h-[calc(80vh-2rem)] flex flex-col border-purple-100">
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
        </Card>
    );
};