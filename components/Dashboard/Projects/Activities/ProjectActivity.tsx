"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    RefreshCw,
    Clock,
    User,
    GitCommit,
    MessageSquare,
    Settings,
    Play,
    CheckCircle,
    X,
    Plus,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from '@/components/ui/badge';
import {
    useGetProjectActivityQuery,
} from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { cn } from '@/lib/utils';
import { convertToDate, formatDate } from '@/components/utils/dateUtils';
import { ActivityViewModal } from './ActivityViewModal';

// Activity type configurations
const ACTIVITY_CONFIGS = {
    task_created: {
        icon: Plus,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        label: 'Task Created'
    },
    task_updated: {
        icon: Settings,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Task Updated'
    },
    task_completed: {
        icon: CheckCircle,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        label: 'Task Completed'
    },
    member_joined: {
        icon: User,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        label: 'Member Joined'
    },
    member_left: {
        icon: User,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Member Left'
    },
    project_updated: {
        icon: GitCommit,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        label: 'Project Updated'
    },
    comment_added: {
        icon: MessageSquare,
        color: 'text-orange-600',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        label: 'Comment Added'
    },
    status_changed: {
        icon: Play,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        label: 'Status Changed'
    },
    default: {
        icon: Activity,
        color: 'text-slate-600',
        bg: 'bg-slate-100 dark:bg-slate-800',
        label: 'Activity'
    }
};

const getActivityConfig = (action: string) => {
    return ACTIVITY_CONFIGS[action as keyof typeof ACTIVITY_CONFIGS] || ACTIVITY_CONFIGS.default;
};

const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const formatActivityTime = (timestamp: any) => {
    if (!timestamp) return 'recently';

    try {
        const date = convertToDate(timestamp);
        if (!date) return 'recently';

        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

        return formatDate(timestamp);
    } catch {
        return 'recently';
    }
};

const formatActivityDescription = (action: string, details: any) => {
    if (!details) return '';

    switch (action) {
        case 'task_created':
            return `created task "${details.taskTitle || 'Untitled'}"`;
        case 'task_updated':
            return `updated task "${details.taskTitle || 'Untitled'}"`;
        case 'task_completed':
            return `completed task "${details.taskTitle || 'Untitled'}"`;
        case 'member_joined':
            return `joined the project`;
        case 'member_left':
            return `left the project`;
        case 'project_updated':
            return `updated project settings`;
        case 'comment_added':
            return `added a comment`;
        case 'status_changed':
            return `changed status ${details.from ? `from ${details.from}` : ''} to ${details.to || 'unknown'}`;
        default:
            return action.replace(/_/g, ' ');
    }
};

// Main ProjectActivity Component
interface ProjectActivityProps {
    projectId: string;
    onViewAllActivity?: () => void;
    className?: string;
}

export default function ProjectActivity({
    projectId,
    onViewAllActivity,
    className
}: ProjectActivityProps) {
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const {
        data: activityResponse,
        isLoading,
        error,
        refetch,
        isFetching
    } = useGetProjectActivityQuery({
        id: projectId,
        page: 1,
        limit: 3,
        sortBy: 'createdAt',
        sortDirection: 'desc'
    }, {
        skip: !projectId,
        pollingInterval: 30000, // Poll every 30 seconds
    });

    const activities = activityResponse?.data || [];
    const isLoadingState = isLoading || isManualRefreshing;

    useEffect(() => {
        if (!isFetching) setIsManualRefreshing(false);
    }, [isFetching]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isManualRefreshing) {
            timeout = setTimeout(() => setIsManualRefreshing(false), 5000);
        }
        return () => timeout && clearTimeout(timeout);
    }, [isManualRefreshing]);

    const handleRefresh = async () => {
        try {
            setIsManualRefreshing(true);
            setRefreshKey(prev => prev + 1);
            await refetch();
        } catch (error) {
            setIsManualRefreshing(false);
        }
    };

    const handleViewAll = () => {
        if (onViewAllActivity) {
            onViewAllActivity();
        } else {
            setShowModal(true);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={className}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-sm relative overflow-hidden">
                    {/* Gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-2xl -mr-12 -mt-12 pointer-events-none" />

                    <CardHeader className="pb-4 relative">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                                    <Activity className="h-4 w-4" />
                                </div>
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Recent Activity
                                </span>
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRefresh}
                                disabled={isLoadingState}
                                className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                <RefreshCw className={cn("h-4 w-4 text-blue-600", isLoadingState && "animate-spin")} />
                            </Button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Latest project updates and changes
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-3 relative">
                        {isLoadingState ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
                                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                                            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                    Unable to Load Activity
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    There was an error loading the project activity
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="text-center py-8">
                                <Activity className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                    No Activity Yet
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Project activity will appear here as team members work
                                </p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {activities.map((activity, index) => {
                                    const config = getActivityConfig(activity.action);
                                    const IconComponent = config.icon;

                                    return (
                                        <motion.div
                                            key={`${activity.id}-${refreshKey}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group"
                                        >
                                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/50 dark:hover:to-transparent transition-all duration-200">
                                                <div className={cn(
                                                    "flex items-center justify-center h-10 w-10 rounded-full shadow-sm",
                                                    config.bg
                                                )}>
                                                    <IconComponent className={cn("h-5 w-5", config.color)} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Avatar className="h-6 w-6 border border-white dark:border-slate-800">
                                                            {activity.userAvatar ? (
                                                                <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                                                            ) : (
                                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-medium">
                                                                    {getUserInitials(activity.userName)}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                            {activity.userName || 'Team Member'}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {config.label}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                                        {formatActivityDescription(activity.action, activity.details)}
                                                    </p>

                                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{formatActivityTime(activity.createdAt)}</span>
                                                        {activity.scope && (
                                                            <>
                                                                <span>•</span>
                                                                <Badge variant="secondary" className="text-xs py-0 h-4">
                                                                    {activity.scope}
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </CardContent>

                    {activities.length > 0 && (
                        <CardFooter className="border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 p-4">
                            <Button
                                variant="ghost"
                                onClick={handleViewAll}
                                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View All Activity
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </motion.div>

            {/* Activity Modal */}
            {showModal && (
                <ActivityViewModal
                    projectId={projectId}
                    open={showModal}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}