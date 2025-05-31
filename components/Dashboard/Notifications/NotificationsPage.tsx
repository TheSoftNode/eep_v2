"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Import enhanced components
import NotificationFilter from './NotificationFilter';
import NotificationHeader from './NotificationHeader';
import NotificationTabs from './NotificationTabs';
import NotificationList from './NotificationList';
import NotificationPagination from './NotificationPagination';

// Import API hooks
import {
    useClearAllNotificationsMutation,
    useDeleteNotificationMutation,
    useGetNotificationsQuery,
    useMarkAllNotificationsReadMutation,
    useMarkNotificationReadMutation
} from '@/Redux/apiSlices/notifications/notificationApi';

export default function NotificationsPage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
    const [allSelected, setAllSelected] = useState(false);

    // RTK Query hooks
    const { data, isLoading, error } = useGetNotificationsQuery({
        page: currentPage,
        limit: 10,
        unreadOnly,
        type: activeTab === 'all' ? undefined : activeTab as any
    });

    const [markAsRead] = useMarkNotificationReadMutation();
    const [markAllAsRead] = useMarkAllNotificationsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [clearAllNotifications] = useClearAllNotificationsMutation();

    // Extract data from query response
    const notifications = data?.data || [];
    const categories = data?.categories || {
        projects: 0,
        tasks: 0,
        messages: 0,
        sessions: 0,
        system: 0
    };
    const totalPages = data?.totalPages || 1;

    // Reset page when changing filters
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, unreadOnly]);

    // Reset selection when data changes
    useEffect(() => {
        setSelectedNotifications([]);
        setAllSelected(false);
    }, [data]);

    // Handle selection
    const toggleSelectNotification = (id: string) => {
        if (selectedNotifications.includes(id)) {
            setSelectedNotifications(selectedNotifications.filter(notifId => notifId !== id));
        } else {
            setSelectedNotifications([...selectedNotifications, id]);
        }
    };

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(notifications.map(notification => notification.id));
        }
        setAllSelected(!allSelected);
    };

    const clearSelection = () => {
        setSelectedNotifications([]);
        setAllSelected(false);
    };

    // Handle actions
    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id).unwrap();
            toast({
                title: "Notification marked as read",
                variant: "default",
                description: "The notification has been marked as read."
            });
        } catch (error) {
            toast({
                title: "Failed to mark notification as read",
                variant: "destructive",
                description: "Please try again later."
            });
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead().unwrap();
            toast({
                title: "All notifications marked as read",
                variant: "default",
                description: "All your notifications have been marked as read."
            });
        } catch (error) {
            toast({
                title: "Failed to mark all notifications as read",
                variant: "destructive",
                description: "Please try again later."
            });
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await deleteNotification(id).unwrap();
            setSelectedNotifications(selectedNotifications.filter(notifId => notifId !== id));
            toast({
                title: "Notification deleted",
                variant: "default",
                description: "The notification has been deleted."
            });
        } catch (error) {
            toast({
                title: "Failed to delete notification",
                variant: "destructive",
                description: "Please try again later."
            });
        }
    };

    const handleDeleteSelected = async () => {
        try {
            // Delete each selected notification
            // In a real implementation, you might want to create a batch delete endpoint
            const promises = selectedNotifications.map(id => deleteNotification(id).unwrap());
            await Promise.all(promises);

            clearSelection();
            toast({
                title: `${selectedNotifications.length} notifications deleted`,
                variant: "default",
                description: "The selected notifications have been deleted."
            });
        } catch (error) {
            toast({
                title: "Failed to delete selected notifications",
                variant: "destructive",
                description: "Please try again later."
            });
        }
    };

    const handleClearAll = async () => {
        try {
            await clearAllNotifications().unwrap();
            clearSelection();
            toast({
                title: "All notifications cleared",
                variant: "default",
                description: "All your notifications have been deleted."
            });
        } catch (error) {
            toast({
                title: "Failed to clear notifications",
                variant: "destructive",
                description: "Please try again later."
            });
        }
    };

    // Handle API errors
    useEffect(() => {
        if (error) {
            toast({
                title: "Failed to load notifications",
                description: "Please try again later",
                variant: "destructive"
            });
        }
    }, [error, toast]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/30 pt-8 pb-16 px-4 sm:px-6">
            {/* Subtle background pattern */}
            <div className="fixed inset-0 bg-grid-indigo-100/40 dark:bg-grid-white/5 -z-10"></div>

            {/* Subtle gradient blobs */}
            <div className="fixed top-0 right-0 w-2/3 h-2/3 dark:bg-gradient-to-br dark:from-indigo-500/5 dark:via-purple-500/3 dark:to-pink-500/5 bg-gradient-to-br from-indigo-500/5 via-purple-500/3 to-pink-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4 -z-10 opacity-60"></div>
            <div className="fixed bottom-0 left-0 w-2/3 h-2/3 dark:bg-gradient-to-tr dark:from-blue-500/5 dark:via-indigo-500/3 dark:to-purple-500/5 bg-gradient-to-tr from-blue-500/5 via-indigo-500/3 to-purple-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 -z-10 opacity-60"></div>

            <div className="container mx-auto max-w-5xl space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <NotificationFilter
                        unreadOnly={unreadOnly}
                        setUnreadOnly={setUnreadOnly}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="shadow-lg border-indigo-100/70 dark:border-indigo-800/30 overflow-hidden px-4 sm:px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl">
                        <NotificationHeader
                            selectedNotifications={selectedNotifications}
                            clearSelection={clearSelection}
                            handleDeleteSelected={handleDeleteSelected}
                            handleMarkAllAsRead={handleMarkAllAsRead}
                            handleClearAll={handleClearAll}
                        />

                        <NotificationTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            categories={categories}
                        >
                            <CardContent className="p-0 sm:p-0">
                                {['all', 'project', 'task', 'message', 'session'].map((tab) => (
                                    <TabsContent key={tab} value={tab} className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                                        <NotificationList
                                            notifications={notifications}
                                            isLoading={isLoading}
                                            selectedNotifications={selectedNotifications}
                                            toggleSelectNotification={toggleSelectNotification}
                                            allSelected={allSelected}
                                            toggleSelectAll={toggleSelectAll}
                                            handleMarkAsRead={handleMarkAsRead}
                                            handleDeleteNotification={handleDeleteNotification}
                                            unreadOnly={unreadOnly}
                                        />
                                    </TabsContent>
                                ))}
                            </CardContent>
                        </NotificationTabs>

                        <NotificationPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </Card>
                </motion.div>
            </div>

            {/* Custom grid background styles */}
            <style jsx global>{`
        .bg-grid-indigo-100 {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z' fill='rgba(99, 102, 241, 0.07)'/%3E%3C/svg%3E");
        }
        
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z' fill='rgba(255, 255, 255, 0.07)'/%3E%3C/svg%3E");
        }
      `}</style>
        </div>
    );
}