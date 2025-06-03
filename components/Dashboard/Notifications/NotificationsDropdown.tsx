"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Check,
    ChevronRight,
    XCircle,
    Briefcase,
    MessageSquare,
    Calendar,
    CheckSquare,
    Info,
    Eye
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

import {
    NotificationType
} from "@/Redux/types/Notifications/notification";
import { useDeleteNotificationMutation, useGetNotificationsQuery, useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation } from "@/Redux/apiSlices/notifications/notificationApi";
import { convertFirebaseDateRobust } from "@/components/utils/dateUtils";
import { useAuth } from "@/hooks/useAuth";

const NotificationsDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { isAdmin } = useAuth();

    // RTK Query hooks
    const { data: notificationsData, isLoading } = useGetNotificationsQuery({
        page: 1,
        limit: 8, // Reduced from 10 to 8 for better performance and compact feel
        unreadOnly: false
    });

    const [markAsReadMutation] = useMarkNotificationReadMutation();
    const [markAllAsReadMutation] = useMarkAllNotificationsReadMutation();
    const [deleteNotificationMutation] = useDeleteNotificationMutation();

    // Extract notifications and unread count
    const notifications = notificationsData?.data || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    // Mark notification as read
    const markAsRead = async (id: string) => {
        try {
            await markAsReadMutation(id).unwrap();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            await markAllAsReadMutation().unwrap();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Delete a notification
    const deleteNotification = async (id: string) => {
        try {
            await deleteNotificationMutation(id).unwrap();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Enhanced notification type categorization with sophisticated styling
    const getNotificationInfo = (type: NotificationType) => {
        // Project related
        if (type.startsWith('project_')) {
            return {
                icon: <Briefcase className="h-4 w-4" />,
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
                icon: <CheckSquare className="h-4 w-4" />,
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
                icon: <MessageSquare className="h-4 w-4" />,
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
                icon: <Calendar className="h-4 w-4" />,
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
            icon: <Info className="h-4 w-4" />,
            category: 'system',
            iconBg: "bg-slate-100/60 dark:bg-slate-800/60",
            iconColor: "text-slate-500 dark:text-slate-300",
            buttonColors: "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/20",
            gradientBorder: "from-slate-500 to-slate-600",
            label: "System"
        };
    };

    // Format time with more elegant styling
    const formatNotificationTime = (date: Date) => {
        const formatted = formatDistanceToNow(convertFirebaseDateRobust(date), { addSuffix: true });
        // Make it more elegant and concise
        return formatted
            .replace('less than a minute ago', 'just now')
            .replace('about ', '')
            .replace(' minutes ago', 'm ago')
            .replace(' minute ago', 'm ago')
            .replace(' hours ago', 'h ago')
            .replace(' hour ago', 'h ago')
            .replace(' days ago', 'd ago')
            .replace(' day ago', 'd ago');
    };


    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 rounded-full border border-indigo-100/50 dark:border-indigo-800/30 dark:bg-indigo-900/80 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-red-500 to-pink-500"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 md:w-96 max-h-[85vh] overflow-hidden p-0 rounded-xl border border-indigo-100/80 dark:border-indigo-800/30 shadow-lg"
                forceMount
            >
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 30 }}
                    className="overflow-hidden rounded-xl dark:bg-indigo-900/90"
                >
                    {/* Elegant header with gradient */}
                    <div className="relative overflow-hidden">
                        {/* Background gradient with subtle pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900/70 opacity-80">
                            <div className="absolute inset-0 bg-grid-indigo-100/40 dark:bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,50%,white)]"></div>
                        </div>

                        {/* Header content */}
                        <div className="relative flex items-center justify-between p-3 border-b border-indigo-100/70 dark:border-indigo-800/30">
                            <div className="flex items-center space-x-1">
                                <h3 className="font-medium text-indigo-900 dark:text-indigo-100 text-sm">
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <Badge className="ml-1.5 px-1.5 py-0 h-5 text-[10px] font-normal bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none" variant="default">
                                        {unreadCount} new
                                    </Badge>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="h-7 px-2 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
                                >
                                    <Check className="mr-1 h-3 w-3" />
                                    Mark all read
                                </Button>
                            )}
                        </div>
                    </div>
                    {/* Notification list with custom scrollbar */}
                    <div className="overflow-y-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
                        {isLoading ? (
                            <div className="py-8 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="h-5 w-5 border-2 border-indigo-500 border-r-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Loading notifications...</p>
                                </div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-10 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="relative h-14 w-14 mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full blur-md"></div>
                                        <div className="relative flex items-center justify-center h-full w-full bg-white/80 dark:bg-indigo-950/80 rounded-full border border-indigo-100 dark:border-indigo-800/40">
                                            <Bell className="h-6 w-6 text-indigo-400 dark:text-indigo-300" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">No notifications</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
                                        When you receive notifications, they'll appear here
                                    </p>
                                </div>
                            </div>
                        ) : (<div>
                            <AnimatePresence initial={false}>
                                {notifications.map((notification, index) => {
                                    const {
                                        icon,
                                        iconBg,
                                        iconColor,
                                        buttonColors,
                                        gradientBorder,
                                        label
                                    } = getNotificationInfo(notification.type);

                                    return (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.15, type: index % 2 ? "spring" : "tween" }}
                                            className={cn(
                                                "group relative border-b border-indigo-100/40 dark:border-indigo-800/30 transition-colors",
                                                !notification.read
                                                    ? "bg-gradient-to-r from-indigo-50/80 to-white dark:from-indigo-900/30 dark:to-transparent"
                                                    : "bg-white/80 dark:bg-indigo-950/20 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10"
                                            )}
                                        >
                                            <div className="p-3 flex gap-3 relative z-10">
                                                {/* Icon with glass effect background */}
                                                <div className="relative flex-shrink-0 mt-0.5">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-sm",
                                                        iconBg,
                                                        "border border-white/50 dark:border-white/5"
                                                    )}>
                                                        <div className={cn("h-4 w-4", iconColor)}>
                                                            {icon}
                                                        </div>
                                                    </div>

                                                    {/* Category indicator */}
                                                    <div className="absolute -bottom-1 -right-1 text-[8px] font-medium px-1 py-0 bg-white dark:bg-indigo-950 rounded-full border border-indigo-100 dark:border-indigo-800/40 shadow-sm">
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
                                                        </p>
                                                        <span className="text-[10px] text-slate-500/80 dark:text-slate-400/80 whitespace-nowrap ml-2 mt-0.5 font-medium">
                                                            {formatNotificationTime(notification.createdAt)}
                                                        </span>
                                                    </div>

                                                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {notification.description}
                                                    </p>

                                                    {/* Action buttons with refined styling */}
                                                    <div className="mt-2 flex flex-wrap gap-1.5">{notification.projectId && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className={cn(
                                                                "h-6 px-2 rounded-full text-[10px] border flex items-center gap-1",
                                                                buttonColors
                                                            )}
                                                            onClick={() => {
                                                                markAsRead(notification.id);
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
                                                                    "h-6 px-2 rounded-full text-[10px] border flex items-center gap-1",
                                                                    buttonColors
                                                                )}
                                                                onClick={() => {
                                                                    markAsRead(notification.id);
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
                                                                    "h-6 px-2 rounded-full text-[10px] border flex items-center gap-1",
                                                                    buttonColors
                                                                )}
                                                                onClick={() => {
                                                                    markAsRead(notification.id);
                                                                    window.location.href = `/dashboard/sessions/${notification.sessionId}`;
                                                                }}
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                View Session
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Action buttons with elegant hover effects */}
                                                <div className="flex-shrink-0 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    {!notification.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-full bg-indigo-100/80 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60"
                                                            onClick={() => markAsRead(notification.id)}
                                                            title="Mark as read"
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-full bg-red-100/80 text-red-500 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/40"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        title="Delete notification"
                                                    >
                                                        <XCircle className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Colored gradient border indicator for unread items */}
                                            {!notification.read && (
                                                <div className={cn(
                                                    "absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b",
                                                    gradientBorder
                                                )}></div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                        )}
                    </div>
                    {/* Footer with gradient */}
                    <div className="relative">
                        {/* Background gradient with subtle pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 dark:from-indigo-900/50 dark:to-purple-900/40">
                            <div className="absolute inset-0 bg-grid-indigo-100/40 dark:bg-grid-white/5 [mask-image:linear-gradient(to_top,transparent,50%,white)]"></div>
                        </div>

                        {/* Footer content */}
                        <div className="relative p-2 border-t border-indigo-100/70 dark:border-indigo-800/30">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-8 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/60 dark:hover:bg-indigo-800/30 rounded-lg"
                                onClick={() => window.location.href = `${isAdmin() ? "/admin/dashboard/notifications" : "/Learner/dashboard/notifications"}`}
                            >
                                View all notifications
                                <ChevronRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// Add utility classes for the grid background and scrollbar
<style jsx global>{`
  .bg-grid-indigo-100 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z' fill='rgba(99, 102, 241, 0.07)'/%3E%3C/svg%3E");
  }
  
  .bg-grid-white {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z' fill='rgba(255, 255, 255, 0.07)'/%3E%3C/svg%3E");
  }
  
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
    ;

export default NotificationsDropdown;

