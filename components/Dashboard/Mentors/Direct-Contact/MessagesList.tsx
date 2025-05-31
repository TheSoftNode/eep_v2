import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageData } from '@/Redux/types/Users/mentorMessage';
import MessageListItem from './MessageListItem';

interface MessagesListProps {
    messages: MessageData[];
    selectedMessage: MessageData | null;
    onSelectMessage: (message: MessageData) => void;
    onMarkAsRead: (messageId: string) => void;
    isLoading?: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({
    messages,
    selectedMessage,
    onSelectMessage,
    onMarkAsRead,
    isLoading
}) => {
    const handleMessageClick = (message: MessageData) => {
        onSelectMessage(message);
        if (!message.isRead) {
            onMarkAsRead(message.id);
        }
    };

    if (isLoading) {
        return (
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Messages ({messages.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageListItem
                                key={message.id}
                                message={message}
                                isSelected={selectedMessage?.id === message.id}
                                onClick={() => handleMessageClick(message)}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400">No messages found</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MessagesList;