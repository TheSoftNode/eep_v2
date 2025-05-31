"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    useGetInboxMessagesQuery,
    useMarkMessageAsReadMutation,
    useToggleMessageStarMutation,
    useDeleteMessageMutation,
    useGetMessageStatsQuery,
    useReplyToMessageMutation
} from '@/Redux/apiSlices/users/mentorMessagApi';
import { MessageData, MessageFilters, SendMessageRequest } from '@/Redux/types/Users/mentorMessage';
import DirectContactStats from '@/components/Dashboard/Mentors/Direct-Contact/DirectContactStats';
import DirectContactFilters from '@/components/Dashboard/Mentors/Direct-Contact/DirectContactFilters';
import MessagesList from '@/components/Dashboard/Mentors/Direct-Contact/MessagesList';
import MessageDetail from '@/components/Dashboard/Mentors/Direct-Contact/MessageDetail';
import DirectContactPagination from '@/components/Dashboard/Mentors/Direct-Contact/DirectContactPagination';



const DirectContactPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'starred'>('all');
    const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'normal' | 'high' | 'urgent'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);

    // Build filters for API
    const messageFilters: MessageFilters = {
        page: currentPage,
        limit: 10,
        ...(filterStatus === 'unread' && { isRead: false }),
        ...(filterStatus === 'starred' && { isStarred: true }),
        ...(filterPriority !== 'all' && { priority: filterPriority as any }),
    };

    // API hooks
    const { data: messagesData, isLoading, error, refetch } = useGetInboxMessagesQuery(messageFilters);
    const { data: statsData } = useGetMessageStatsQuery();
    const [markAsRead] = useMarkMessageAsReadMutation();
    const [toggleStar] = useToggleMessageStarMutation();
    const [deleteMessage] = useDeleteMessageMutation();
    const [sendReply, { isLoading: isSendingReply }] = useReplyToMessageMutation();

    const messages = messagesData?.data || [];
    const totalCount = messagesData?.totalCount || 0;
    const totalPages = messagesData?.pagination?.totalPages || 1;
    const stats = statsData?.data;

    // Filter messages by search term (client-side)
    const filteredMessages = messages.filter(message => {
        if (!searchTerm) return true;
        return (
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Message actions
    const handleMarkAsRead = async (messageId: string) => {
        try {
            await markAsRead(messageId).unwrap();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleToggleStar = async (messageId: string) => {
        try {
            await toggleStar(messageId).unwrap();
        } catch (error) {
            console.error('Failed to toggle star:', error);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage(messageId).unwrap();
            if (selectedMessage?.id === messageId) {
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const handleReply = async (replyData: SendMessageRequest) => {
        try {
            if (!selectedMessage) return;

            const replyPayload = {
                originalMessageId: selectedMessage.id!,
                content: replyData.content,
                priority: replyData.priority || 'normal'
            };

            await sendReply(replyPayload).unwrap();
        } catch (error) {
            console.error('Failed to send reply:', error);
        }
    };
    const handleSelectMessage = (message: MessageData) => {
        setSelectedMessage(message);
    };

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading && !messages.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                            </div>
                            <div className="lg:col-span-2">
                                <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
            </div>

            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                Direct Contact
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Messages sent directly to you from administrators and learners
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <DirectContactStats stats={stats} isLoading={isLoading} />

                    {/* Filters */}
                    <DirectContactFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        filterPriority={filterPriority}
                        setFilterPriority={setFilterPriority}
                        onRefresh={handleRefresh}
                    />

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Messages List */}
                        <div className="lg:col-span-1">
                            <MessagesList
                                messages={filteredMessages}
                                selectedMessage={selectedMessage}
                                onSelectMessage={handleSelectMessage}
                                onMarkAsRead={handleMarkAsRead}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Message Detail */}
                        <div className="lg:col-span-2">
                            <MessageDetail
                                message={selectedMessage}
                                onToggleStar={handleToggleStar}
                                onDelete={handleDeleteMessage}
                                onReply={handleReply}
                                isSendingReply={isSendingReply}
                            />
                        </div>
                    </motion.div>

                    {/* Pagination */}
                    <DirectContactPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default DirectContactPage;