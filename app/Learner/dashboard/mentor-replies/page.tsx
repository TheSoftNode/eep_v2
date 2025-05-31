"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageData, MessageFilters } from '@/Redux/types/Users/mentorMessage';

// Using the real API hooks
import {
    useGetMentorRepliesQuery,
    useGetMentorReplyStatsQuery,
    useMarkMessageAsReadMutation,
    useToggleMessageStarMutation,
    useDeleteMessageMutation
} from '@/Redux/apiSlices/users/mentorMessagApi';
import MentorRepliesStats from '@/components/Dashboard/Mentors/Mentor-Replies/MentorRepliesStats';
import DirectContactFilters from '@/components/Dashboard/Mentors/Direct-Contact/DirectContactFilters';
import MentorReplyItem from '@/components/Dashboard/Mentors/Mentor-Replies/MentorReplyItem';
import MessageDetail from '@/components/Dashboard/Mentors/Direct-Contact/MessageDetail';
import DirectContactPagination from '@/components/Dashboard/Mentors/Direct-Contact/DirectContactPagination';


const MentorRepliesPage: React.FC = () => {
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

    // Real API hooks
    const { data: mentorRepliesData, isLoading, error, refetch } = useGetMentorRepliesQuery(messageFilters);
    const { data: statsData } = useGetMentorReplyStatsQuery();
    const [markAsRead] = useMarkMessageAsReadMutation();
    const [toggleStar] = useToggleMessageStarMutation();
    const [deleteMessage] = useDeleteMessageMutation();

    // Real data from API
    const messages = mentorRepliesData?.data || [];
    const totalCount = mentorRepliesData?.totalCount || 0;
    const totalPages = mentorRepliesData?.pagination?.totalPages || 1;
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

    // Real message actions using API
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
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-green-500/5 to-emerald-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
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
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    Mentor Replies
                                </h1>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">
                                Responses and guidance from your mentors
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <MentorRepliesStats stats={stats} isLoading={isLoading} />

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
                            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                                        <GraduationCap className="h-5 w-5 text-emerald-600" />
                                        <span>Mentor Replies ({filteredMessages.length})</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-[600px] overflow-y-auto">
                                        {filteredMessages.length > 0 ? (
                                            filteredMessages.map((message) => (
                                                <MentorReplyItem
                                                    key={message.id}
                                                    message={message}
                                                    isSelected={selectedMessage?.id === message.id}
                                                    onClick={() => {
                                                        handleSelectMessage(message);
                                                        if (!message.isRead) {
                                                            handleMarkAsRead(message.id!);
                                                        }
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center mx-auto mb-4">
                                                    <GraduationCap className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                    No mentor replies yet
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400">
                                                    When mentors respond to your messages, they'll appear here
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Message Detail */}
                        <div className="lg:col-span-2">
                            {selectedMessage ? (
                                <MessageDetail
                                    message={selectedMessage}
                                    onToggleStar={handleToggleStar}
                                    onDelete={handleDeleteMessage}
                                    onReply={() => { }} // Learners typically don't reply back to mentor replies
                                    isSendingReply={false}
                                />
                            ) : (
                                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                                    <CardContent className="p-12 text-center">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center mx-auto mb-6">
                                            <GraduationCap className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                            Select a mentor reply to read
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Choose a message from your mentors to view their guidance and advice.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
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

export default MentorRepliesPage;