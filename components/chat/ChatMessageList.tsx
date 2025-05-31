import React, { RefObject } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import ChatTypingIndicator from './ChatTypingIndicator';
import ChatLoadingIndicator from './ChatLoadingIndicator';
import ChatErrorMessage from './ChatErrorMessage';

interface ChatMessageListProps {
    messages: Message[];
    isTyping: boolean;
    isLoading: boolean;
    error: string | null;
    selectedMessage: number | null;
    showTooltip: boolean;
    // inputRef: RefObject<HTMLInputElement | null>;
    chatContainerRef: RefObject<HTMLDivElement>; // Changed: removed null type
    messagesEndRef: RefObject<HTMLDivElement>; // Changed: removed null type
    onMessageSelect: (index: number | null) => void;
    onCopyMessage: (messageId: string) => void;
    onEditMessage: (messageId: string) => void;
    onResendMessage: (messageId: string) => void;
    onDismissError: () => void;
    onSuggestionClick: (suggestion: string) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
    messages,
    isTyping,
    isLoading,
    error,
    selectedMessage,
    showTooltip,
    // inputRef,
    chatContainerRef,
    messagesEndRef,
    onMessageSelect,
    onCopyMessage,
    onEditMessage,
    onResendMessage,
    onDismissError,
    onSuggestionClick
}) => {
    // const suggestions = [
    //     "How do I apply to the EEP program?",
    //     "What technology training is available?",
    //     "Tell me about the mentor matching process"
    // ];

    const suggestions = [
        "How do I fix this JavaScript TypeError?",
        "Explain React component lifecycle",
        "What are the best practices for debugging Python code?"
    ];

    return (
        <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-white"
            style={{
                backgroundImage: "radial-gradient(circle at 50% 0%, rgba(245, 243, 255, 0.2) 0%, transparent 75%), radial-gradient(circle at 100% 100%, rgba(228, 240, 255, 0.2) 0%, transparent 70%)"
            }}
        >
            {/* Welcome message when no messages */}
            {messages.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center justify-center h-full text-center px-6 py-10 max-w-md mx-auto"
                >
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to EEP Assistant</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        I'm here to help you with programming, debugging, and technical concepts.
                        Ask me anything about code errors, development best practices, or learning new technologies.
                    </p>
                    <div className="grid grid-cols-1 gap-2 w-full">
                        {suggestions.map((suggestion, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                className="text-sm justify-start px-3 py-2 h-auto text-left border-gray-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
                                onClick={() => onSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Message List */}
            {messages.map((message, index) => (
                <ChatMessage
                    key={message.id || index}
                    message={message}
                    index={index}
                    selectedMessage={selectedMessage}
                    showTooltip={showTooltip}
                    onMessageSelect={onMessageSelect}
                    onCopy={onCopyMessage}
                    onEdit={onEditMessage}
                    onResend={onResendMessage}
                />
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
                {isTyping && <ChatTypingIndicator />}
            </AnimatePresence>

            {/* Loading indicator */}
            <AnimatePresence>
                {isLoading && !isTyping && <ChatLoadingIndicator />}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
                {error && <ChatErrorMessage errorMessage={error} onDismiss={onDismissError} />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessageList;