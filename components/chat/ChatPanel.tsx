"use client"

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Message, ViewMode } from '@/types/chat';

// Component imports
import ChatToggleButton from './ChatToggleButton';
import ChatHeader from './ChatHeader';
import ChatMinimizedView from './ChatMinimizedView';
import ChatMessageList from './ChatMessageList';
import ChatInputArea from './ChatInputArea';
import { generateId, getCurrentTime, sendMessage } from '@/components/services/chatService';

// Updated props interface
interface ChatPanelProps {
    initialViewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    initialViewMode = 'closed',
    onViewModeChange
}) => {
    // State management
    const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    // Update the internal viewMode and call the onViewModeChange callback
    const updateViewMode = (mode: ViewMode) => {
        setViewMode(mode);
        if (onViewModeChange) {
            onViewModeChange(mode);
        }
    };

    // Update internal state when initialViewMode changes
    useEffect(() => {
        setViewMode(initialViewMode);
    }, [initialViewMode]);

    // Update the handleKeyDown function to properly handle Shift+Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    // Scroll to bottom function
    const scrollToBottom = (delay = 0) => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, delay);
    };

    // Effects
    useEffect(() => {
        // Scroll when messages change
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Scroll when chat opens with a delay to ensure content is rendered
        if (viewMode !== 'closed' && viewMode !== 'minimized') {
            scrollToBottom(100); // 100ms delay when opening
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [viewMode]);

    // Focus input when opening chat
    useEffect(() => {
        if (viewMode === 'normal' || viewMode === 'maximized' || viewMode === 'fullscreen') {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 300);
        }
    }, [viewMode]);

    // Event handlers
    const handleSendMessage = async (messageToSend = input, isResend = false) => {
        if (!messageToSend.trim()) return;
        setError(null);

        // If we're editing a message, remove all messages after it
        if (editingMessageId && !isResend) {
            const editIndex = messages.findIndex(m => m.id === editingMessageId);
            if (editIndex >= 0) {
                setMessages(messages.slice(0, editIndex));
            }
            setEditingMessageId(null);
        }

        const newMessage: Message = {
            role: 'user',
            content: messageToSend,
            timestamp: getCurrentTime(),
            id: generateId()
        };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);

        // Simulated typing indicator
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000 + Math.random() * 2000);

        try {
            // Send message to API
            const response = await sendMessage(messageToSend);

            // Add response to messages
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response,
                timestamp: getCurrentTime(),
                id: generateId()
            }]);
        } catch (error) {
            console.error('Error:', error);
            setError('Sorry, I encountered an error. Please try again.');
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleEditMessage = (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            setEditingMessageId(messageId);
            setInput(message.content);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleResendMessage = (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            handleSendMessage(message.content, true);
        }
    };

    const handleCopyMessage = (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            navigator.clipboard.writeText(message.content);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setInput('');
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const getPanelStyles = () => {
        // Get viewport width
        const vw = typeof window !== 'undefined' ? window.innerWidth : 0;

        // Calculate responsive widths
        const normalWidth = vw < 640 ? '100%' : // Mobile
            vw < 1024 ? '450px' : // Tablet
                '500px';              // Desktop

        switch (viewMode) {
            case 'minimized':
                return {
                    height: '60px',
                    width: vw < 640 ? '100%' : '320px',
                };
            case 'normal':
                return {
                    height: '600px',
                    width: normalWidth,
                };
            case 'maximized':
                return {
                    height: '100vh',
                    width: normalWidth,
                };
            case 'fullscreen':
                return {
                    height: '100vh',
                    width: '100vw',
                };
            default:
                return {
                    height: '90vh',
                    width: normalWidth,
                };
        }
    };

    return (
        <>
            {/* Chat Toggle Button - Only show when closed */}
            {viewMode === 'closed' && (
                <ChatToggleButton onClick={() => updateViewMode('normal')} />
            )}

            {/* Chat Panel */}
            <AnimatePresence>
                {viewMode !== 'closed' && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            ...getPanelStyles(),
                        }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                        className="fixed right-0 bottom-0 flex flex-col overflow-hidden rounded-t-xl border border-gray-200 shadow-2xl"
                        style={{
                            zIndex: 1001,
                            backgroundColor: 'rgba(255, 255, 255, 0.97)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)'
                        }}
                    >
                        {/* Header */}
                        <ChatHeader
                            viewMode={viewMode}
                            onMinimize={() => updateViewMode('minimized')}
                            onMaximize={() => updateViewMode('maximized')}
                            onNormal={() => updateViewMode('normal')}
                            onFullscreen={() => updateViewMode('fullscreen')}
                            onClose={() => updateViewMode('closed')}
                            onClearChat={handleClearChat}
                        />

                        {/* Minimized View */}
                        {viewMode === 'minimized' && (
                            <ChatMinimizedView
                                messageCount={messages.length}
                                onOpen={() => updateViewMode('normal')}
                            />
                        )}

                        {/* Messages Container - Only show when not minimized */}
                        {viewMode !== 'minimized' && (
                            <ChatMessageList
                                messages={messages}
                                isTyping={isTyping}
                                isLoading={isLoading}
                                error={error}
                                selectedMessage={selectedMessage}
                                showTooltip={showTooltip}
                                chatContainerRef={chatContainerRef}
                                messagesEndRef={messagesEndRef}
                                onMessageSelect={setSelectedMessage}
                                onCopyMessage={handleCopyMessage}
                                onEditMessage={handleEditMessage}
                                onResendMessage={handleResendMessage}
                                onDismissError={() => setError(null)}
                                onSuggestionClick={handleSuggestionClick}
                            />
                        )}

                        {/* Input area with enhanced styling */}
                        {viewMode !== 'minimized' && (
                            <ChatInputArea
                                input={input}
                                editingMessageId={editingMessageId}
                                isLoading={isLoading}
                                inputRef={inputRef}
                                onChange={setInput}
                                onSend={() => handleSendMessage()}
                                onCancelEdit={handleCancelEdit}
                                onKeyDown={handleKeyDown}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatPanel;



// "use client"

// import React, { useEffect, useRef, useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Message, ViewMode } from '@/types/chat';

// // Component imports
// import ChatToggleButton from './ChatToggleButton';
// import ChatHeader from './ChatHeader';
// import ChatMinimizedView from './ChatMinimizedView';
// import ChatMessageList from './ChatMessageList';
// import ChatInputArea from './ChatInputArea';
// import { generateId, getCurrentTime, sendMessage } from '@/components/services/chatService';

// const ChatPanel: React.FC = () => {
//     // State management
//     const [viewMode, setViewMode] = useState<ViewMode>('closed');
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [showTooltip, setShowTooltip] = useState(false);
//     const [isTyping, setIsTyping] = useState(false);
//     const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
//     const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

//     // Refs
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const chatContainerRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLTextAreaElement | null>(null);

//     // Update the handleKeyDown function to properly handle Shift+Enter
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     const handleClearChat = () => {
//         setMessages([]);
//     };


//     // Scroll to bottom function
//     const scrollToBottom = (delay = 0) => {
//         setTimeout(() => {
//             if (chatContainerRef.current) {
//                 chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//             }
//         }, delay);
//     };

//     // Effects
//     useEffect(() => {
//         // Scroll when messages change
//         scrollToBottom();
//     }, [messages]);

//     useEffect(() => {
//         // Scroll when chat opens with a delay to ensure content is rendered
//         if (viewMode !== 'closed' && viewMode !== 'minimized') {
//             scrollToBottom(100); // 100ms delay when opening
//             if (inputRef.current) {
//                 inputRef.current.focus();
//             }
//         }
//     }, [viewMode]);

//     // Focus input when opening chat
//     useEffect(() => {
//         if (viewMode === 'normal' || viewMode === 'maximized' || viewMode === 'fullscreen') {
//             setTimeout(() => {
//                 if (inputRef.current) {
//                     inputRef.current.focus();
//                 }
//             }, 300);
//         }
//     }, [viewMode]);

//     // Event handlers
//     const handleSendMessage = async (messageToSend = input, isResend = false) => {
//         if (!messageToSend.trim()) return;
//         setError(null);

//         // If we're editing a message, remove all messages after it
//         if (editingMessageId && !isResend) {
//             const editIndex = messages.findIndex(m => m.id === editingMessageId);
//             if (editIndex >= 0) {
//                 setMessages(messages.slice(0, editIndex));
//             }
//             setEditingMessageId(null);
//         }

//         const newMessage: Message = {
//             role: 'user',
//             content: messageToSend,
//             timestamp: getCurrentTime(),
//             id: generateId()
//         };
//         setMessages(prev => [...prev, newMessage]);
//         setInput('');
//         setIsLoading(true);

//         // Simulated typing indicator
//         setIsTyping(true);
//         setTimeout(() => setIsTyping(false), 1000 + Math.random() * 2000);

//         try {
//             // Send message to API
//             const response = await sendMessage(messageToSend);

//             // Add response to messages
//             setMessages(prev => [...prev, {
//                 role: 'assistant',
//                 content: response,
//                 timestamp: getCurrentTime(),
//                 id: generateId()
//             }]);
//         } catch (error) {
//             console.error('Error:', error);
//             setError('Sorry, I encountered an error. Please try again.');
//         } finally {
//             setIsLoading(false);
//             setIsTyping(false);
//         }
//     };

//     const handleEditMessage = (messageId: string) => {
//         const message = messages.find(m => m.id === messageId);
//         if (message) {
//             setEditingMessageId(messageId);
//             setInput(message.content);
//             if (inputRef.current) {
//                 inputRef.current.focus();
//             }
//         }
//     };

//     const handleResendMessage = (messageId: string) => {
//         const message = messages.find(m => m.id === messageId);
//         if (message) {
//             handleSendMessage(message.content, true);
//         }
//     };

//     const handleCopyMessage = (messageId: string) => {
//         const message = messages.find(m => m.id === messageId);
//         if (message) {
//             navigator.clipboard.writeText(message.content);
//             setShowTooltip(true);
//             setTimeout(() => setShowTooltip(false), 2000);
//         }
//     };

//     // const handleKeyDown = (e: React.KeyboardEvent) => {
//     //     if (e.key === 'Enter' && !e.shiftKey) {
//     //         e.preventDefault();
//     //         handleSendMessage();
//     //     }
//     // };

//     const handleCancelEdit = () => {
//         setEditingMessageId(null);
//         setInput('');
//     };

//     const handleSuggestionClick = (suggestion: string) => {
//         setInput(suggestion);
//         if (inputRef.current) {
//             inputRef.current.focus();
//         }
//     };

//     const getPanelStyles = () => {
//         // Get viewport width
//         const vw = typeof window !== 'undefined' ? window.innerWidth : 0;

//         // Calculate responsive widths
//         const normalWidth = vw < 640 ? '100%' : // Mobile
//             vw < 1024 ? '450px' : // Tablet
//                 '500px';              // Desktop

//         switch (viewMode) {
//             case 'minimized':
//                 return {
//                     height: '60px',
//                     width: vw < 640 ? '100%' : '320px',
//                 };
//             case 'normal':
//                 return {
//                     height: '600px',
//                     width: normalWidth,
//                 };
//             case 'maximized':
//                 return {
//                     height: '100vh',
//                     width: normalWidth,
//                 };
//             case 'fullscreen':
//                 return {
//                     height: '100vh',
//                     width: '100vw',
//                 };
//             default:
//                 return {
//                     height: '90vh',
//                     width: normalWidth,
//                 };
//         }
//     };

//     return (
//         <>
//             {/* Chat Toggle Button - Only show when closed */}
//             {viewMode === 'closed' && (
//                 <ChatToggleButton onClick={() => setViewMode('normal')} />
//             )}

//             {/* Chat Panel */}
//             <AnimatePresence>
//                 {viewMode !== 'closed' && (
//                     <motion.div
//                         initial={{ x: '100%', opacity: 0 }}
//                         animate={{
//                             x: 0,
//                             opacity: 1,
//                             ...getPanelStyles(),
//                         }}
//                         exit={{ x: '100%', opacity: 0 }}
//                         transition={{ type: 'spring', damping: 25, stiffness: 120 }}
//                         className="fixed right-0 bottom-0 flex flex-col overflow-hidden rounded-t-xl border border-gray-200 shadow-2xl"
//                         style={{
//                             zIndex: 1001,
//                             backgroundColor: 'rgba(255, 255, 255, 0.97)',
//                             backdropFilter: 'blur(12px)',
//                             WebkitBackdropFilter: 'blur(12px)'
//                         }}
//                     >
//                         {/* Header */}
//                         <ChatHeader
//                             viewMode={viewMode}
//                             onMinimize={() => setViewMode('minimized')}
//                             onMaximize={() => setViewMode('maximized')}
//                             onNormal={() => setViewMode('normal')}
//                             onFullscreen={() => setViewMode('fullscreen')}
//                             onClose={() => setViewMode('closed')}
//                             onClearChat={handleClearChat}
//                         />

//                         {/* Minimized View */}
//                         {viewMode === 'minimized' && (
//                             <ChatMinimizedView
//                                 messageCount={messages.length}
//                                 onOpen={() => setViewMode('normal')}
//                             />
//                         )}

//                         {/* Messages Container - Only show when not minimized */}
//                         {viewMode !== 'minimized' && (
//                             <ChatMessageList
//                                 messages={messages}
//                                 isTyping={isTyping}
//                                 isLoading={isLoading}
//                                 error={error}
//                                 selectedMessage={selectedMessage}
//                                 showTooltip={showTooltip}
//                                 chatContainerRef={chatContainerRef}
//                                 messagesEndRef={messagesEndRef}
//                                 onMessageSelect={setSelectedMessage}
//                                 onCopyMessage={handleCopyMessage}
//                                 onEditMessage={handleEditMessage}
//                                 onResendMessage={handleResendMessage}
//                                 onDismissError={() => setError(null)}
//                                 onSuggestionClick={handleSuggestionClick}
//                             />
//                         )}

//                         {/* Input area with enhanced styling */}
//                         {viewMode !== 'minimized' && (
//                             <ChatInputArea
//                                 input={input}
//                                 editingMessageId={editingMessageId}
//                                 isLoading={isLoading}
//                                 inputRef={inputRef}
//                                 onChange={setInput}
//                                 onSend={() => handleSendMessage()}
//                                 onCancelEdit={handleCancelEdit}
//                                 onKeyDown={handleKeyDown}
//                             />
//                         )}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// };

// export default ChatPanel;