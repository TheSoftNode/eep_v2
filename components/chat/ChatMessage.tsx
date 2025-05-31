import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/chat';
import ChatMessageActions from './ChatMessageActions';
import CodeBlock from './CodeBlock';
import { formatAIResponse } from '@/components/services/chatService';

interface ChatMessageProps {
    message: Message;
    index: number;
    selectedMessage: number | null;
    showTooltip: boolean;
    onMessageSelect: (index: number | null) => void;
    onCopy: (messageId: string) => void;
    onEdit?: (messageId: string) => void;
    onResend?: (messageId: string) => void;
}

// Animation variants for the message bubble
const chatBubbleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    index,
    selectedMessage,
    showTooltip,
    onMessageSelect,
    onCopy,
    onEdit,
    onResend
}) => {
    const isUser = message.role === 'user';

    return (
        <motion.div
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} group mt-4`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={chatBubbleVariants}
            layout
        >
            <div
                className="flex flex-col"
                onMouseEnter={() => onMessageSelect(index)}
                onMouseLeave={() => onMessageSelect(null)}
            >
                {/* Message Container */}
                <div
                    className={`
                        relative rounded-2xl shadow-sm 
                        ${isUser
                            ? 'bg-blue-50 border border-blue-200 text-indigo-800 pb-2 mr-2 max-w-[90%]'
                            : 'bg-white border border-gray-100 shadow-lg text-gray-800 ml-2 max-w-[85%] pb-2'
                        }
                    `}
                >
                    {/* Message Actions (appear on hover) */}
                    {selectedMessage === index && (
                        <ChatMessageActions
                            role={message.role}
                            messageId={message.id || ''}
                            showTooltip={showTooltip}
                            onCopy={onCopy}
                            onEdit={onEdit}
                            onResend={onResend}
                        />
                    )}

                    {/* Message Content */}
                    <div className={`
                        p-4 
                        ${isUser
                            ? 'bg-white/10 rounded-2xl'
                            : 'bg-gradient-to-b from-gray-50/50 to-transparent rounded-2xl'
                        }
                    `}>
                        {isUser ? (
                            <div className="whitespace-pre-wrap font-medium">
                                {message.content}
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none
                                prose-headings:font-bold prose-headings:text-gray-800
                                prose-p:text-gray-600 prose-p:leading-relaxed
                                prose-li:text-gray-600
                                prose-strong:text-gray-800 prose-strong:font-semibold
                                prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                                prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                                prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                                prose-h1:mt-3 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-gray-100
                                prose-h2:mt-3 prose-h2:mb-3
                                prose-h3:mt-2 prose-h3:mb-2">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ children }) => (
                                            <h1 className="flex items-center gap-2 text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({ children }) => (
                                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mt-4 mb-2">
                                                {children}
                                            </h2>
                                        ),
                                        h3: ({ children }) => (
                                            <h3 className="text-base font-semibold text-gray-800 mt-3 mb-1">
                                                {children}
                                            </h3>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="space-y-1 list-disc marker:text-indigo-500 pl-5 my-3">
                                                {children}
                                            </ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="space-y-1 list-decimal marker:text-indigo-500 marker:font-medium pl-5 my-3">
                                                {children}
                                            </ol>
                                        ),
                                        li: ({ children }) => (
                                            <li className="pl-2 mb-1.5">
                                                {children}
                                            </li>
                                        ),
                                        code: ({ node, inline, className, children, ...props }: any) => {
                                            const match = /language-(\w+)/.exec(className || '');

                                            return !inline && match ? (
                                                <CodeBlock
                                                    language={match[1]}
                                                    value={String(children).replace(/\n$/, '')}
                                                />
                                            ) : (
                                                <code className="font-mono text-sm bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        p: ({ children }) => (
                                            <p className="text-gray-600 mb-3 leading-relaxed">
                                                {children}
                                            </p>
                                        ),
                                        a: ({ children, href }) => (
                                            <a href={href} className="text-indigo-600 hover:text-indigo-700 hover:underline">
                                                {children}
                                            </a>
                                        ),
                                        blockquote: ({ children }) => (
                                            <blockquote className="pl-4 border-l-4 border-indigo-200 italic text-gray-600 my-3">
                                                {children}
                                            </blockquote>
                                        ),
                                        strong: ({ children }) => (
                                            <strong className="font-semibold text-gray-800">
                                                {children}
                                            </strong>
                                        ),
                                        em: ({ children }) => (
                                            <em className="italic text-gray-700">
                                                {children}
                                            </em>
                                        ),
                                        hr: () => (
                                            <hr className="my-4 border-gray-200" />
                                        ),
                                    }}
                                >
                                    {formatAIResponse(message.content)}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Time indicator with visual improvements */}
                    <div className={`
                        text-xs ${isUser ? 'text-gray-900' : 'text-gray-950'} mt-1 px-3 flex items-center
                        ${isUser ? 'justify-end' : 'justify-start'} 
                    `}>
                        {message.timestamp || ''}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;