import React from 'react';
import { Button } from '@/components/ui/button';

interface ChatMinimizedViewProps {
    messageCount: number;
    onOpen: () => void;
}

const ChatMinimizedView: React.FC<ChatMinimizedViewProps> = ({
    messageCount,
    onOpen
}) => {
    return (
        <div className="flex items-center justify-between px-4 py-2">
            <p className="text-sm text-gray-600 truncate">
                {messageCount > 0
                    ? `${messageCount} messages`
                    : "Ask about the EEP program..."}
            </p>
            <Button
                variant="ghost"
                size="sm"
                onClick={onOpen}
                className="text-indigo-600 text-xs"
            >
                Open
            </Button>
        </div>
    );
};

export default ChatMinimizedView;