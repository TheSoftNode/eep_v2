"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Box, Briefcase, CheckSquare, MessageSquare, Calendar, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationCategoryCount } from '@/Redux/types/Notifications/notification';

interface NotificationTabsProps {
    activeTab: string;
    setActiveTab: (value: string) => void;
    categories: NotificationCategoryCount;
    children: React.ReactNode;
}

export default function NotificationTabs({
    activeTab,
    setActiveTab,
    categories,
    children
}: NotificationTabsProps) {
    const totalNotifications =
        categories.projects +
        categories.tasks +
        categories.messages +
        categories.sessions +
        categories.system;

    // Get icon for each tab
    const getTabIcon = (tabValue: string) => {
        switch (tabValue) {
            case 'all':
                return <Box className="h-4 w-4 mr-2" />;
            case 'project':
                return <Briefcase className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />;
            case 'task':
                return <CheckSquare className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />;
            case 'message':
                return <MessageSquare className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />;
            case 'session':
                return <Calendar className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />;
            default:
                return <Bell className="h-4 w-4 mr-2 text-slate-700 dark:text-slate-400" />;
        }
    };

    // Get tab gradient based on tab value
    const getTabGradient = (tabValue: string) => {
        switch (tabValue) {
            case 'project':
                return "from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500";
            case 'task':
                return "from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500";
            case 'message':
                return "from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500";
            case 'session':
                return "from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500";
            default:
                return "from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500";
        }
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-3">
                <TabsList className="w-full h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-900/20 backdrop-blur-sm border border-indigo-100/60 dark:border-indigo-800/30 shadow-sm">
                    {[
                        { value: 'all', label: 'All', count: totalNotifications },
                        { value: 'project', label: 'Projects', count: categories.projects },
                        { value: 'task', label: 'Tasks', count: categories.tasks },
                        { value: 'message', label: 'Messages', count: categories.messages },
                        { value: 'session', label: 'Sessions', count: categories.sessions }
                    ].map((tab) => (
                        <motion.div
                            key={tab.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full"
                        >
                            <TabsTrigger
                                value={tab.value}
                                className={cn(
                                    "w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 transition-all text-xs sm:text-sm rounded-lg",
                                    "data-[state=active]:shadow-md",
                                    "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900",
                                    tab.value === 'project' && "data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400",
                                    tab.value === 'task' && "data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400",
                                    tab.value === 'message' && "data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400",
                                    tab.value === 'session' && "data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400",
                                    (tab.value === 'all' || tab.value === 'system') && "data-[state=active]:text-slate-800 dark:data-[state=active]:text-slate-200",
                                    "data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-white/60 dark:data-[state=inactive]:hover:bg-slate-800/40",
                                    "group relative overflow-hidden"
                                )}
                            >
                                {/* Subtle gradient background for active tab */}
                                {activeTab === tab.value && (
                                    <div className="absolute inset-0 opacity-10 dark:opacity-15 bg-gradient-to-r rounded-lg" style={{
                                        backgroundImage: `linear-gradient(to right, var(--${tab.value === 'project' ? 'blue' : tab.value === 'task' ? 'green' : tab.value === 'message' ? 'indigo' : tab.value === 'session' ? 'purple' : 'slate'}-500), var(--${tab.value === 'project' ? 'indigo' : tab.value === 'task' ? 'emerald' : tab.value === 'message' ? 'purple' : tab.value === 'session' ? 'pink' : 'indigo'}-500))`,
                                    }}></div>
                                )}

                                <span className={cn(
                                    "flex items-center",
                                    "group-data-[state=active]:font-medium"
                                )}>
                                    {getTabIcon(tab.value)}
                                    {tab.label}
                                </span>

                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        "ml-0.5 sm:ml-1.5 transition-colors text-xs px-1.5 py-0 min-w-[1.25rem] flex items-center justify-center",
                                        tab.value === 'project' && "group-data-[state=active]:bg-blue-100 group-data-[state=active]:text-blue-800 dark:group-data-[state=active]:bg-blue-900/30 dark:group-data-[state=active]:text-blue-300",
                                        tab.value === 'task' && "group-data-[state=active]:bg-green-100 group-data-[state=active]:text-green-800 dark:group-data-[state=active]:bg-green-900/30 dark:group-data-[state=active]:text-green-300",
                                        tab.value === 'message' && "group-data-[state=active]:bg-indigo-100 group-data-[state=active]:text-indigo-800 dark:group-data-[state=active]:bg-indigo-900/30 dark:group-data-[state=active]:text-indigo-300",
                                        tab.value === 'session' && "group-data-[state=active]:bg-purple-100 group-data-[state=active]:text-purple-800 dark:group-data-[state=active]:bg-purple-900/30 dark:group-data-[state=active]:text-purple-300",
                                        (tab.value === 'all' || tab.value === 'system') && "group-data-[state=active]:bg-slate-200 group-data-[state=active]:text-slate-800 dark:group-data-[state=active]:bg-slate-800 dark:group-data-[state=active]:text-slate-200",
                                        "group-data-[state=inactive]:bg-slate-200/70 dark:group-data-[state=inactive]:bg-slate-700/30 group-data-[state=inactive]:text-slate-600 dark:group-data-[state=inactive]:text-slate-400"
                                    )}
                                >
                                    {tab.count}
                                </Badge>

                                {/* Gradient indicator line for active tab */}
                                <div className={cn(
                                    "absolute -bottom-1.5 left-3 right-3 h-0.5 scale-x-0 transition-transform duration-300",
                                    tab.value === 'project' && "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500",
                                    tab.value === 'task' && "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500",
                                    tab.value === 'message' && "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500",
                                    tab.value === 'session' && "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500",
                                    (tab.value === 'all' || tab.value === 'system') && "bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-400 dark:to-slate-500",
                                    "group-data-[state=active]:scale-x-100"
                                )} />
                            </TabsTrigger>
                        </motion.div>
                    ))}
                </TabsList>
            </div>

            {children}
        </Tabs>
    );
}