import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Edit, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageRole } from '@/types/chat';

interface ChatMessageActionsProps {
    role: MessageRole;
    messageId: string;
    showTooltip: boolean;
    onCopy: (messageId: string) => void;
    onEdit?: (messageId: string) => void;
    onResend?: (messageId: string) => void;
}

const ChatMessageActions: React.FC<ChatMessageActionsProps> = ({
    role,
    messageId,
    showTooltip,
    onCopy,
    onEdit,
    onResend,
}) => {
    return (
        <motion.div
            className="absolute -top-8 right-0 bg-white rounded-full shadow-md border border-gray-100 flex p-1 items-center space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
        >
            {role === 'user' && onEdit && onResend && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(messageId)}
                        className="h-6 w-6 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                        title="Edit message"
                    >
                        <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onResend(messageId)}
                        className="h-6 w-6 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                        title="Resend message"
                    >
                        <RotateCcw className="h-3 w-3" />
                    </Button>
                </>
            )}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onCopy(messageId)}
                className="h-6 w-6 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                title="Copy message"
            >
                <Copy className="h-3 w-3" />
                {showTooltip && (
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
                        Copied!
                    </span>
                )}
            </Button>
        </motion.div>
    );
};

export default ChatMessageActions;