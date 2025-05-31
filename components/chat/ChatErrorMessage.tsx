import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ChatErrorMessageProps {
    errorMessage: string;
    onDismiss: () => void;
}

const ChatErrorMessage: React.FC<ChatErrorMessageProps> = ({
    errorMessage,
    onDismiss
}) => {
    return (
        <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
        >
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl shadow-md max-w-[85%]">
                <div className="flex items-start gap-3">
                    <div className="text-red-500 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-red-800 font-medium mb-1">Error</h3>
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDismiss}
                            className="mt-2 text-xs text-red-600 hover:bg-red-50 p-1 h-auto"
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatErrorMessage;