"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    MailOpen,
    Trash2,
    CheckSquare,
    Calendar,
    MessageSquare,
    Briefcase,
    MoreHorizontal,
    Info,
    Eye,
    Clock,
    XCircle,
    Check,
    Star
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { FormattedNotification, NotificationType, NotificationPriority } from '@/Redux/types/Notifications/notification';

// Ensure NotificationPriority is defined as: 
// export type NotificationPriority = 'low' | 'normal' | 'high';

interface NotificationListProps {
    notifications: FormattedNotification[];
    isLoading: boolean;
    selectedNotifications: string[];
    toggleSelectNotification: (id: string) => void;
    allSelected: boolean;
    toggleSelectAll: () => void;
    handleMarkAsRead: (id: string) => void;
    handleDeleteNotification: (id: string) => void;
    unreadOnly: boolean;
}

export default function NotificationList({
    notifications,
    isLoading,
    selectedNotifications,
    toggleSelectNotification,
    allSelected,
    toggleSelectAll,
    handleMarkAsRead,
    handleDeleteNotification,
    unreadOnly
}: NotificationListProps) {
    const [hoveredNotification, setHoveredNotification] = useState<string | null>(null);

    // Get notification icon, color, and background based on type
    const getNotificationInfo = (type: NotificationType) => {
        // Project related
        if (type.startsWith('project_')) {
            return {
                icon: <Briefcase className="h-5 w-5" />,
                category: 'project',
                iconBg: "bg-blue-100/60 dark:bg-blue-900/30",
                iconColor: "text-blue-500 dark:text-blue-300",
                buttonColors: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                gradientBorder: "from-blue-500 to-indigo-500",
                label: "Project"
            };
        }

        // Task related
        if (type.startsWith('task_')) {
            return {
                icon: <CheckSquare className="h-5 w-5" />,
                category: 'task',
                iconBg: "bg-green-100/60 dark:bg-green-900/30",
                iconColor: "text-green-500 dark:text-green-300",
                buttonColors: "text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-900/20",
                gradientBorder: "from-green-500 to-emerald-500",
                label: "Task"
            };
        }

        // Message related
        if (
            type.startsWith('message_') ||
            type.includes('invitation') ||
            type.includes('join_request')
        ) {
            return {
                icon: <MessageSquare className="h-5 w-5" />,
                category: 'message',
                iconBg: "bg-indigo-100/60 dark:bg-indigo-900/30",
                iconColor: "text-indigo-500 dark:text-indigo-300",
                buttonColors: "text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                gradientBorder: "from-indigo-500 to-purple-500",
                label: "Message"
            };
        }

        // Session related
        if (type.startsWith('session_')) {
            return {
                icon: <Calendar className="h-5 w-5" />,
                category: 'session',
                iconBg: "bg-purple-100/60 dark:bg-purple-900/30",
                iconColor: "text-purple-500 dark:text-purple-300",
                buttonColors: "text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20",
                gradientBorder: "from-purple-500 to-pink-500",
                label: "Session"
            };
        }

        // Default/System
        return {
            icon: <Info className="h-5 w-5" />,
            category: 'system',
            iconBg: "bg-slate-100/60 dark:bg-slate-800/60",
            iconColor: "text-slate-500 dark:text-slate-300",
            buttonColors: "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/20",
            gradientBorder: "from-slate-500 to-slate-600",
            label: "System"
        };
    };

    // Get notification link based on type and IDs
    const getNotificationLink = (notification: FormattedNotification) => {
        if (notification.projectId) {
            return `/dashboard/projects/${notification.projectId}`;
        } else if (notification.taskId) {
            return `/dashboard/tasks/${notification.taskId}`;
        } else if (notification.workspaceId) {
            return `/dashboard/workspaces/${notification.workspaceId}`;
        } else if (notification.sessionId) {
            return `/dashboard/sessions/${notification.sessionId}`;
        } else {
            return '#';
        }
    };

    // Get priority badge based on priority level
    const getPriorityBadge = (priority: NotificationPriority) => {
        if (priority === 'high') {
            return (
                <Badge className="ml-1.5 px-1.5 py-0.5 text-xs font-normal bg-gradient-to-r from-red-500/90 to-rose-500/90 dark:from-red-600/90 dark:to-rose-600/90 text-white border-none shadow-sm shadow-red-500/10">
                    <Star className="h-3 w-3 mr-0.5 text-amber-200" />
                    Important
                </Badge>
            );
        } else if (priority === 'normal') {
            return (
                <Badge className="ml-1.5 px-1.5 py-0.5 text-xs font-normal bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30">
                    Normal
                </Badge>
            );
        } else if (priority === 'low') {
            return (
                <Badge className="ml-1.5 px-1.5 py-0.5 text-xs font-normal bg-slate-100 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/30">
                    Low
                </Badge>
            );
        }
        return null;
    };

    // Render loading skeleton
    const renderSkeleton = () => {
        return Array(5).fill(0).map((_, index) => (
            <div
                key={`skeleton-${index}`}
                className="flex items-start space-x-4 p-3 sm:p-4 md:p-5 border-b border-indigo-100/30 dark:border-indigo-800/30"
            >
                <Skeleton className="h-5 w-5 rounded-full bg-indigo-200/40 dark:bg-indigo-800/40" />
                <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-3/4 bg-indigo-200/40 dark:bg-indigo-800/40" />
                        <Skeleton className="h-4 w-16 bg-indigo-200/40 dark:bg-indigo-800/40" />
                    </div>
                    <Skeleton className="h-4 w-full bg-indigo-200/40 dark:bg-indigo-800/40" />
                    <Skeleton className="h-4 w-1/3 bg-indigo-200/40 dark:bg-indigo-800/40" />
                </div>
            </div>
        ));
    };

    // Render empty state
    const renderEmptyState = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="py-12 sm:py-16 text-center px-4"
        >
            <div className="relative mx-auto mb-6 sm:mb-8">
                {/* Background gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-100/70 to-purple-100/70 dark:from-indigo-900/30 dark:to-purple-900/30 blur-xl"></div>

                {/* Icon container */}
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-4 sm:p-5 inline-flex mx-auto border border-indigo-100/70 dark:border-indigo-800/40 shadow-md">
                    <Bell className="h-12 sm:h-14 w-12 sm:w-14 text-indigo-400 dark:text-indigo-500" />
                </div>
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">No notifications</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {unreadOnly
                    ? "You have no unread notifications. Switch to 'Show All' to see your read notifications."
                    : "You don't have any notifications yet. When you receive notifications, they'll appear here."}
            </p>
        </motion.div>
    );

    // If loading, show skeleton
    if (isLoading) {
        return (
            <div className="rounded-xl overflow-hidden border border-indigo-100/70 dark:border-indigo-800/40 shadow-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                {renderSkeleton()}
            </div>
        );
    }

    // If no notifications, show empty state
    if (notifications.length === 0) {
        return renderEmptyState();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl overflow-hidden border border-indigo-100/70 dark:border-indigo-800/40 shadow-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
        >
            <div className="py-3 px-3 sm:px-4 bg-indigo-50/80 dark:bg-indigo-900/30 border-b border-indigo-100/70 dark:border-indigo-800/40 flex items-center">
                <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                    className="mr-3 border-indigo-300 dark:border-indigo-700 data-[state=checked]:bg-indigo-600 dark:data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <label htmlFor="select-all" className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    Select all
                </label>
            </div>

            <AnimatePresence>
                {notifications.map((notification, index) => {
                    const {
                        icon,
                        iconBg,
                        iconColor,
                        buttonColors,
                        gradientBorder,
                        label
                    } = getNotificationInfo(notification.type);

                    const isHovered = hoveredNotification === notification.id;

                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={cn(
                                "group relative border-b border-indigo-100/40 dark:border-indigo-800/30 transition-colors",
                                !notification.read
                                    ? "bg-gradient-to-r from-indigo-50/80 to-white dark:from-indigo-900/30 dark:to-transparent"
                                    : "bg-white/80 dark:bg-slate-900/80 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10"
                            )}
                            onMouseEnter={() => setHoveredNotification(notification.id)}
                            onMouseLeave={() => setHoveredNotification(null)}
                        >
                            <div className="p-3 sm:p-4 md:p-5 flex gap-3 sm:gap-4 relative z-10">
                                <div className="flex-shrink-0 mt-0.5">
                                    <Checkbox
                                        id={`select-${notification.id}`}
                                        checked={selectedNotifications.includes(notification.id)}
                                        onCheckedChange={() => toggleSelectNotification(notification.id)}
                                        className="mt-0.5 mr-3 border-indigo-300 dark:border-indigo-700 data-[state=checked]:bg-indigo-600 dark:data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                </div>

                                {/* Icon with glass effect background */}
                                <div className="relative flex-shrink-0 mt-0.5">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-sm",
                                        iconBg,
                                        "border border-white/50 dark:border-white/5 shadow-sm"
                                    )}>
                                        <div className={cn("h-5 w-5", iconColor)}>
                                            {icon}
                                        </div>
                                    </div>

                                    {/* Category indicator */}
                                    <div className="absolute -bottom-1 -right-1 text-[8px] font-medium px-1 py-0 bg-white dark:bg-slate-900 rounded-full border border-indigo-100 dark:border-indigo-800/40 shadow-sm">
                                        {label}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <p className={cn(
                                            "text-sm font-medium line-clamp-1",
                                            !notification.read
                                                ? "text-indigo-900 dark:text-indigo-100"
                                                : "text-slate-700 dark:text-slate-300"
                                        )}>
                                            {notification.title}
                                            {notification.priority && getPriorityBadge(notification.priority)}
                                        </p>
                                        <span className="text-[10px] text-slate-500/80 dark:text-slate-400/80 whitespace-nowrap ml-2 mt-0.5 font-medium flex items-center">
                                            <Clock className="h-3 w-3 mr-1 text-slate-400 dark:text-slate-500" />
                                            {notification.time}
                                        </span>
                                    </div>

                                    <p className={cn(
                                        "mt-1 text-sm leading-relaxed",
                                        !notification.read
                                            ? "text-slate-700 dark:text-slate-300 line-clamp-2"
                                            : "text-slate-600 dark:text-slate-400 line-clamp-2"
                                    )}>
                                        {notification.description}
                                    </p>

                                    {/* Action buttons with refined styling */}
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {notification.projectId && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-7 px-2 rounded-full text-xs border flex items-center gap-1",
                                                    buttonColors
                                                )}
                                                onClick={() => {
                                                    handleMarkAsRead(notification.id);
                                                    window.location.href = `/dashboard/projects/${notification.projectId}`;
                                                }}
                                            >
                                                <Eye className="h-3 w-3" />
                                                View Project
                                            </Button>
                                        )}

                                        {notification.taskId && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-7 px-2 rounded-full text-xs border flex items-center gap-1",
                                                    buttonColors
                                                )}
                                                onClick={() => {
                                                    handleMarkAsRead(notification.id);
                                                    window.location.href = `/dashboard/tasks/${notification.taskId}`;
                                                }}
                                            >
                                                <Eye className="h-3 w-3" />
                                                View Task
                                            </Button>
                                        )}

                                        {notification.sessionId && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-7 px-2 rounded-full text-xs border flex items-center gap-1",
                                                    buttonColors
                                                )}
                                                onClick={() => {
                                                    handleMarkAsRead(notification.id);
                                                    window.location.href = `/dashboard/sessions/${notification.sessionId}`;
                                                }}
                                            >
                                                <Eye className="h-3 w-3" />
                                                View Session
                                            </Button>
                                        )}

                                        {notification.workspaceId && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-7 px-2 rounded-full text-xs border flex items-center gap-1",
                                                    buttonColors
                                                )}
                                                onClick={() => {
                                                    handleMarkAsRead(notification.id);
                                                    window.location.href = `/dashboard/workspaces/${notification.workspaceId}`;
                                                }}
                                            >
                                                <Eye className="h-3 w-3" />
                                                View Workspace
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Quick actions */}
                                <div className="flex-shrink-0 flex flex-col gap-1.5">
                                    <AnimatePresence>
                                        {isHovered ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex flex-col gap-1.5"
                                            >
                                                {!notification.read && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 rounded-full bg-indigo-100/80 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60 shadow-sm"
                                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="left">
                                                                <p className="text-xs">Mark as read</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-full bg-red-100/80 text-red-500 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/40 shadow-sm"
                                                                onClick={() => handleDeleteNotification(notification.id)}
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="left">
                                                            <p className="text-xs">Delete notification</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex justify-end"
                                            >
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 rounded-full"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-40 p-1.5 border-indigo-100/80 dark:border-indigo-800/30 shadow-lg rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm"
                                                    >
                                                        {!notification.read && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="flex items-center rounded-md cursor-pointer px-2 py-1.5 text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30"
                                                            >
                                                                <MailOpen className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                                                                Mark as read
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteNotification(notification.id)}
                                                            className="flex items-center rounded-md cursor-pointer px-2 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Colored gradient border indicator for unread items */}
                            {!notification.read && (
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b",
                                    gradientBorder
                                )}></div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Custom scrollbar styles */}
            <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thumb-indigo-200::-webkit-scrollbar-thumb {
          background-color: rgb(199, 210, 254, 0.5);
          border-radius: 4px;
        }
        
        .dark .scrollbar-thumb-indigo-700::-webkit-scrollbar-thumb {
          background-color: rgba(109, 40, 217, 0.4);
          border-radius: 4px;
        }
      `}</style>
        </motion.div>
    );
}