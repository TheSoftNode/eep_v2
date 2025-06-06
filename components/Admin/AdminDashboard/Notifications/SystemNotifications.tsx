"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Bell,
    AlertTriangle,
    CheckCircle,
    Info,
    X,
    ExternalLink,
    UserCheck,
    Shield,
    Clock,
    User,
    Monitor,
    Smartphone,
    Activity,
    Database,
    Settings,
    Mail,
    Lock,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetNotificationsQuery, useMarkNotificationReadMutation, useDeleteNotificationMutation } from "@/Redux/apiSlices/notifications/notificationApi";
import { useToast } from "@/hooks/use-toast";
import { NotificationType } from "@/Redux/types/Notifications/notification";

const SystemNotifications: React.FC = () => {
    const { toast } = useToast();

    // Fetch system and admin-relevant notifications
    const { data: notificationsData, isLoading, error } = useGetNotificationsQuery({
        limit: 10,
        unreadOnly: false,
        type: 'system_announcement'
    });

    const [markAsRead] = useMarkNotificationReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    const notifications = notificationsData?.data || [];

    // Dynamic icon selection based on notification content and metadata
    const getIcon = (type: NotificationType, title: string, metadata?: any) => {
        // Check metadata for specific action types
        if (metadata?.action || metadata?.activityType) {
            const action = metadata.action || metadata.activityType;
            switch (action.toLowerCase()) {
                case 'login':
                case 'signin':
                case 'authentication':
                    return <UserCheck className="h-4 w-4" />;
                case 'logout':
                case 'signout':
                    return <Lock className="h-4 w-4" />;
                case 'data_access':
                case 'view':
                case 'read':
                    return <Eye className="h-4 w-4" />;
                case 'update':
                case 'modify':
                case 'edit':
                    return <Settings className="h-4 w-4" />;
                case 'delete':
                case 'remove':
                    return <X className="h-4 w-4" />;
                case 'create':
                case 'add':
                    return <CheckCircle className="h-4 w-4" />;
                case 'email':
                case 'notification':
                    return <Mail className="h-4 w-4" />;
                case 'security':
                case 'permission':
                    return <Shield className="h-4 w-4" />;
                case 'database':
                case 'backup':
                    return <Database className="h-4 w-4" />;
                default:
                    return <Activity className="h-4 w-4" />;
            }
        }

        // Fallback to title-based detection
        const titleLower = title.toLowerCase();
        if (titleLower.includes('login') || titleLower.includes('signin')) return <UserCheck className="h-4 w-4" />;
        if (titleLower.includes('security') || titleLower.includes('permission')) return <Shield className="h-4 w-4" />;
        if (titleLower.includes('error') || titleLower.includes('fail')) return <AlertTriangle className="h-4 w-4" />;
        if (titleLower.includes('success') || titleLower.includes('complete')) return <CheckCircle className="h-4 w-4" />;
        if (titleLower.includes('update') || titleLower.includes('change')) return <Settings className="h-4 w-4" />;

        // Type-based fallback
        if (type.includes('system')) return <Info className="h-4 w-4" />;
        return <Bell className="h-4 w-4" />;
    };

    // Dynamic color scheme based on content and priority
    const getTypeColor = (type: NotificationType, priority: string, title: string, metadata?: any) => {
        // High priority always gets red treatment
        if (priority === 'high') {
            return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        }

        // Check for specific action types in metadata
        if (metadata?.action || metadata?.activityType) {
            const action = (metadata.action || metadata.activityType).toLowerCase();
            switch (action) {
                case 'login':
                case 'signin':
                case 'success':
                case 'create':
                    return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
                case 'error':
                case 'fail':
                case 'delete':
                case 'security_breach':
                    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
                case 'warning':
                case 'caution':
                case 'permission':
                    return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
                default:
                    return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            }
        }

        // Fallback to title-based detection
        const titleLower = title.toLowerCase();
        if (titleLower.includes('success') || titleLower.includes('complete') || titleLower.includes('login')) {
            return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        }
        if (titleLower.includes('error') || titleLower.includes('fail') || titleLower.includes('breach')) {
            return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        }
        if (titleLower.includes('warning') || titleLower.includes('caution')) {
            return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        }

        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'normal':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    // Dynamic role/category color assignment
    const getCategoryColor = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'admin':
            case 'administrator':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
            case 'mentor':
            case 'instructor':
                return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400';
            case 'learner':
            case 'user':
            case 'student':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'security':
            case 'auth':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'system':
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    // Format timestamps dynamically
    const formatTimestamp = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
        } catch {
            return timestamp;
        }
    };

    // Render metadata fields dynamically
    const renderMetadata = (metadata: any) => {
        if (!metadata || typeof metadata !== 'object') return null;

        const relevantFields = [
            { key: 'userEmail', icon: User, label: 'User' },
            { key: 'loggedInUserEmail', icon: User, label: 'User' },
            { key: 'targetUser', icon: User, label: 'Target' },
            { key: 'timestamp', icon: Clock, label: 'Time', formatter: formatTimestamp },
            { key: 'loginTime', icon: Clock, label: 'Time', formatter: formatTimestamp },
            { key: 'activityTime', icon: Clock, label: 'Time', formatter: formatTimestamp },
            { key: 'ipAddress', icon: Monitor, label: 'IP' },
            { key: 'userAgent', icon: Smartphone, label: 'Device' },
            { key: 'location', icon: Monitor, label: 'Location' },
            { key: 'action', icon: Activity, label: 'Action' },
            { key: 'resource', icon: Database, label: 'Resource' },
            { key: 'method', icon: Settings, label: 'Method' },
            { key: 'endpoint', icon: Activity, label: 'Endpoint' }
        ];

        const displayFields = relevantFields.filter(field =>
            metadata[field.key] &&
            metadata[field.key] !== 'unknown' &&
            metadata[field.key] !== ''
        );

        if (displayFields.length === 0) return null;

        return (
            <div className="mb-3 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {displayFields.slice(0, 4).map(field => { // Limit to 4 fields for clean display
                        const IconComponent = field.icon;
                        const value = field.formatter ?
                            field.formatter(metadata[field.key]) :
                            metadata[field.key];

                        return (
                            <div key={field.key} className="flex items-center gap-2">
                                <IconComponent className="h-3 w-3 text-slate-400 flex-shrink-0" />
                                <span className="text-slate-500 dark:text-slate-400 min-w-0">
                                    {field.label}:
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                                    {value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsRead(notificationId).unwrap();
            toast({
                title: "Success",
                description: "Notification marked as read"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark notification as read",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (notificationId: string) => {
        try {
            await deleteNotification(notificationId).unwrap();
            toast({
                title: "Success",
                description: "Notification deleted"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete notification",
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="animate-pulse">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-center h-32 text-slate-400">
                    <div className="text-center">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                        <p>Failed to load system notifications</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <Bell className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            System Notifications
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            System activity and administrative alerts
                        </p>
                    </div>
                </div>

                {notificationsData?.unreadCount && notificationsData.unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white">
                        {notificationsData.unreadCount}
                    </Badge>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={cn(
                                "relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                                getTypeColor(notification.type, notification.priority, notification.title, notification.metadata),
                                !notification.read && "ring-2 ring-offset-2 ring-indigo-500/20"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {getIcon(notification.type, notification.title, notification.metadata)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {notification.title}
                                        </h4>

                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <Badge className={cn("text-xs", getPriorityColor(notification.priority))}>
                                                {notification.priority}
                                            </Badge>

                                            {/* Dynamic category badge */}
                                            {notification.metadata?.category && (
                                                <Badge className={cn("text-xs", getCategoryColor(notification.metadata.category))}>
                                                    {notification.metadata.category}
                                                </Badge>
                                            )}

                                            {/* Role badge for user-related notifications */}
                                            {(notification.metadata?.userRole || notification.metadata?.loggedInUserRole) && (
                                                <Badge className={cn("text-xs", getCategoryColor(notification.metadata.userRole || notification.metadata.loggedInUserRole))}>
                                                    {notification.metadata.userRole || notification.metadata.loggedInUserRole}
                                                </Badge>
                                            )}

                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                                        {notification.description}
                                    </p>

                                    {/* Dynamic metadata rendering */}
                                    {renderMetadata(notification.metadata)}

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {notification.time}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="text-xs h-6 px-2"
                                                >
                                                    Mark read
                                                </Button>
                                            )}

                                            {(notification.workspaceId || notification.projectId) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs h-6 px-2"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(notification.id)}
                                                className="text-xs h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No system notifications</p>
                        <p className="text-xs">All systems are running smoothly</p>
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        View all notifications
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default SystemNotifications;


// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { Bell, AlertTriangle, CheckCircle, Info, X, ExternalLink } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useGetNotificationsQuery, useMarkNotificationReadMutation, useDeleteNotificationMutation } from "@/Redux/apiSlices/notifications/notificationApi";
// import { useToast } from "@/hooks/use-toast";
// import { NotificationType } from "@/Redux/types/Notifications/notification";

// const SystemNotifications: React.FC = () => {
//     const { toast } = useToast();

//     // Fetch system and admin-relevant notifications
//     const { data: notificationsData, isLoading, error } = useGetNotificationsQuery({
//         limit: 5,
//         unreadOnly: false,
//         type: 'system_announcement'
//     });

//     console.log(notificationsData)

//     const [markAsRead] = useMarkNotificationReadMutation();
//     const [deleteNotification] = useDeleteNotificationMutation();

//     const notifications = notificationsData?.data || [];

//     const getIcon = (type: NotificationType) => {
//         if (type.includes('system')) return <Info className="h-4 w-4" />;
//         if (type.includes('error') || type.includes('fail')) return <AlertTriangle className="h-4 w-4" />;
//         if (type.includes('complete') || type.includes('success')) return <CheckCircle className="h-4 w-4" />;
//         return <Bell className="h-4 w-4" />;
//     };

//     const getTypeColor = (type: NotificationType, priority: string) => {
//         if (priority === 'high') {
//             return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
//         }
//         if (type.includes('complet') || type.includes('success')) {
//             return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
//         }
//         if (type.includes('warn')) {
//             return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
//         }
//         return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
//     };

//     const getPriorityColor = (priority: string) => {
//         switch (priority) {
//             case 'high':
//                 return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
//             case 'normal':
//                 return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
//             default:
//                 return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
//         }
//     };

//     const handleMarkAsRead = async (notificationId: string) => {
//         try {
//             await markAsRead(notificationId).unwrap();
//             toast({
//                 title: "Success",
//                 description: "Notification marked as read"
//             });
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to mark notification as read",
//                 variant: "destructive"
//             });
//         }
//     };

//     const handleDelete = async (notificationId: string) => {
//         try {
//             await deleteNotification(notificationId).unwrap();
//             toast({
//                 title: "Success",
//                 description: "Notification deleted"
//             });
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to delete notification",
//                 variant: "destructive"
//             });
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
//                 <div className="animate-pulse">
//                     <div className="flex items-center gap-3 mb-6">
//                         <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
//                         <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
//                     </div>
//                     <div className="space-y-4">
//                         {Array.from({ length: 3 }).map((_, i) => (
//                             <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
//                                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
//                                 <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
//                 <div className="flex items-center justify-center h-32 text-slate-400">
//                     <div className="text-center">
//                         <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
//                         <p>Failed to load system notifications</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
//         >
//             <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-3">
//                     <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
//                         <Bell className="h-5 w-5" />
//                     </div>
//                     <div>
//                         <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
//                             System Notifications
//                         </h3>
//                         <p className="text-sm text-slate-500 dark:text-slate-400">
//                             Critical alerts and updates
//                         </p>
//                     </div>
//                 </div>

//                 {notificationsData?.unreadCount && notificationsData.unreadCount > 0 && (
//                     <Badge className="bg-red-500 text-white">
//                         {notificationsData.unreadCount}
//                     </Badge>
//                 )}
//             </div>

//             <div className="space-y-4">
//                 {notifications.length > 0 ? (
//                     notifications.map((notification) => (
//                         <div
//                             key={notification.id}
//                             className={cn(
//                                 "relative p-4 rounded-lg border transition-all duration-200",
//                                 getTypeColor(notification.type, notification.priority),
//                                 !notification.read && "ring-2 ring-offset-2 ring-indigo-500/20"
//                             )}
//                         >
//                             <div className="flex items-start gap-3">
//                                 <div className="flex-shrink-0 mt-0.5">
//                                     {getIcon(notification.type)}
//                                 </div>

//                                 <div className="flex-1 min-w-0">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
//                                             {notification.title}
//                                         </h4>
//                                         <Badge className={cn("text-xs", getPriorityColor(notification.priority))}>
//                                             {notification.priority}
//                                         </Badge>
//                                         {!notification.read && (
//                                             <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
//                                         )}
//                                     </div>

//                                     <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
//                                         {notification.description}
//                                     </p>

//                                     <div className="flex items-center justify-between">
//                                         <span className="text-xs text-slate-500 dark:text-slate-400">
//                                             {notification.time}
//                                         </span>

//                                         <div className="flex items-center gap-1">
//                                             {!notification.read && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     onClick={() => handleMarkAsRead(notification.id)}
//                                                     className="text-xs h-6 px-2"
//                                                 >
//                                                     Mark read
//                                                 </Button>
//                                             )}

//                                             {notification.workspaceId && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     className="text-xs h-6 px-2"
//                                                 >
//                                                     <ExternalLink className="h-3 w-3" />
//                                                 </Button>
//                                             )}

//                                             <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={() => handleDelete(notification.id)}
//                                                 className="text-xs h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
//                                             >
//                                                 <X className="h-3 w-3" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="text-center py-8 text-slate-400">
//                         <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                         <p className="text-sm">No system notifications</p>
//                         <p className="text-xs">All systems are running smoothly</p>
//                     </div>
//                 )}
//             </div>

//             {notifications.length > 0 && (
//                 <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="w-full text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
//                     >
//                         View all notifications
//                     </Button>
//                 </div>
//             )}
//         </motion.div>
//     );
// };

// export default SystemNotifications;