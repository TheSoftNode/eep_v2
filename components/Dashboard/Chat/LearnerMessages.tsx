"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessagePageHeader } from './MessagePageHeader';
import { ConversationsSidebar } from './ConversationsSidebar';
import { ChatArea } from './ChatArea';
import { NewChatModal } from './NewChatModal'; // Import the extracted component
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/core/store';
import { Conversation } from '@/Redux/types/Chats/chat';
import { useCreateConversationMutation, useDeleteMessageMutation, useGetConversationQuery, useGetUnreadMessagesCountQuery, useGetUserChatsQuery, useMarkConversationAsReadMutation, useSendMessageMutation, useUpdateMessageMutation } from '@/Redux/apiSlices/chat/chatApi';


export default function ChatPage() {
    // State for the selected conversation
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // New chat modal state
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);

    // Fetch user's conversations
    const { data: conversations = [], isLoading: isLoadingConversations } = useGetUserChatsQuery({ limit: 50 });

    // Get unread notifications count
    const { data: unreadData } = useGetUnreadMessagesCountQuery();
    const unreadNotificationsCount = unreadData?.total || 0;

    // Fetch the current conversation if one is selected
    const { data: currentConversation, isLoading: isLoadingConversation } = useGetConversationQuery(
        { id: currentConversationId as string, limit: 50 },
        { skip: !currentConversationId }
    );

    // Mutations for actions
    const [sendMessage] = useSendMessageMutation();
    const [deleteMessage] = useDeleteMessageMutation();
    const [updateMessage] = useUpdateMessageMutation();
    const [markAsRead] = useMarkConversationAsReadMutation();
    const [createConversation] = useCreateConversationMutation();

    // Get auth state for socket connection
    const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);



    // Set the first conversation as current if none selected
    useEffect(() => {
        if (!currentConversationId && conversations.length > 0) {
            setCurrentConversationId(conversations[0].id);
        }
    }, [conversations, currentConversationId]);

    // Mark conversation as read when opened
    useEffect(() => {
        if (currentConversationId && currentConversation?.unreadCount && currentConversation.unreadCount > 0) {
            markAsRead(currentConversationId);
        }
    }, [currentConversationId, currentConversation, markAsRead]);

    // Handler for selecting a conversation
    const handleSelectConversation = (conversation: Conversation) => {
        setCurrentConversationId(conversation.id);
    };

    // Handler for sending a message
    const handleSendMessage = async (message: string, attachments: any[] = []) => {
        if (!currentConversationId) return;

        try {
            await sendMessage({
                conversationId: currentConversationId,
                content: message,
                attachments: attachments.map(att => ({
                    name: att.name,
                    type: att.type,
                    url: att.url,
                    size: att.size
                }))
            }).unwrap();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    // Handler for deleting a message
    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage(messageId).unwrap();
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    // Handler for editing a message
    const handleEditMessage = async (messageId: string, content: string) => {
        try {
            await updateMessage({ messageId, content }).unwrap();
        } catch (error) {
            console.error('Failed to update message:', error);
        }
    };

    // Handler for starting a new conversation
    const handleStartNewChat = () => {
        setNotificationsOpen(false);
        setIsNewChatModalOpen(true);
    };

    // Handler for creating a new conversation after selecting contacts
    const handleCreateChat = async (params: {
        participants: string[];
        title?: string;
        initialMessage?: string;
        type: 'direct' | 'group';
    }) => {
        setIsCreatingConversation(true);

        try {
            const result = await createConversation({
                participants: params.participants,
                title: params.title,
                type: params.type,
                initialMessage: params.initialMessage
            }).unwrap();

            // Close the modal
            setIsNewChatModalOpen(false);

            // Set the newly created conversation as current
            if (result.data?.id) {
                setCurrentConversationId(result.data.id);
            }
        } catch (error) {
            console.error('Failed to create a new conversation:', error);
        } finally {
            setIsCreatingConversation(false);
        }
    };



    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] transition-colors duration-300">
            {/* Background Effects */}
            <div className="fixed inset-0 dark:bg-grid-slate-900/[0.01] bg-grid-slate-700/[0.01] bg-[size:60px_60px] pointer-events-none opacity-20"></div>
            <div className="fixed top-0 right-0 w-full h-full z-0 opacity-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] right-[15%] w-[55%] h-[65%] rounded-full dark:bg-gradient-to-br dark:from-indigo-600/8 dark:via-pink-500/4 dark:to-violet-600/4 bg-gradient-to-br from-indigo-600/6 via-pink-500/3 to-violet-600/3 blur-3xl" />
            </div>

            <div className="container px-4 mx-auto py-6 max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <MessagePageHeader
                        notificationsOpen={notificationsOpen}
                        setNotificationsOpen={setNotificationsOpen}
                        unreadNotificationsCount={unreadNotificationsCount}
                        onStartNewChat={handleStartNewChat}
                    />
                </motion.div>

                {/* Loading State */}
                {isLoadingConversations && conversations.length === 0 && (
                    <div className="flex items-center justify-center py-20">
                        <div className="relative">
                            {/* Subtle glow effect behind loader */}
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                            <Loader2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin relative z-10" />
                        </div>
                        <span className="ml-4 text-xl text-slate-600 dark:text-slate-400">Loading conversations...</span>
                    </div>
                )}

                {/* Main Content */}
                {(!isLoadingConversations || conversations.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Conversations Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="md:col-span-1"
                        >
                            <ConversationsSidebar
                                conversations={conversations}
                                selectedConversationId={currentConversationId}
                                onSelectConversation={handleSelectConversation}
                            />
                        </motion.div>

                        {/* Chat Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="md:col-span-2 lg:col-span-3"
                        >
                            <ChatArea
                                currentConversation={currentConversation}
                                isLoading={isLoadingConversation}
                                onSendMessage={handleSendMessage}
                                onDeleteMessage={handleDeleteMessage}
                                onEditMessage={handleEditMessage}
                                onStartNewChat={handleStartNewChat}
                            />
                        </motion.div>
                    </div>
                )}

                {/* New Chat Modal */}
                <NewChatModal
                    isOpen={isNewChatModalOpen}
                    onClose={() => setIsNewChatModalOpen(false)}
                    onCreateChat={handleCreateChat}
                    isCreating={isCreatingConversation}
                />
            </div>
        </div>
    );
}
