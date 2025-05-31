"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    RefreshCw,
    Clock,
    Trash2,
    AlertTriangle,
    Search,
    User,
    GitCommit,
    MessageSquare,
    Settings,
    Play,
    CheckCircle,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
    useGetProjectActivityQuery,
    useDeleteProjectActivityMutation,
    useClearAllProjectActivitiesMutation
} from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { cn } from '@/lib/utils';
import { convertToDate, formatDate } from '@/components/utils/dateUtils';

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


interface ActivityViewModalProps {
    projectId: string;
    open: boolean;
    onClose: () => void;
}

export function ActivityViewModal({
    projectId,
    open,
    onClose
}: ActivityViewModalProps) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activityScope, setActivityScope] = useState("all");
    const [sortDirection, setSortDirection] = useState("desc");
    const [allActivities, setAllActivities] = useState<any[]>([]);
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);
    const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
    const [showClearAllDialog, setShowClearAllDialog] = useState(false);

    const lastActivitiesRef = useRef<any[]>([]);
    const { toast } = useToast();

    const handleClose = () => {
        setPage(1);
        setSearchTerm('');
        setActivityScope("all");
        onClose();
    };


    // API hooks
    const {
        data: activityResponse,
        isLoading,
        isError,
        refetch,
        isFetching
    } = useGetProjectActivityQuery({
        id: projectId,
        page,
        limit: 20,
        scope: activityScope === 'all' ? undefined : activityScope,
        sortBy: 'createdAt',
        sortDirection: sortDirection as 'asc' | 'desc'
    }, {
        skip: !open || !projectId,
    });

    const [deleteActivity, { isLoading: isDeleting }] = useDeleteProjectActivityMutation();
    const [clearAllActivities, { isLoading: isClearing }] = useClearAllProjectActivitiesMutation();

    // Update activities when data changes
    useEffect(() => {
        if (activityResponse?.data) {
            if (page === 1) {
                setAllActivities(activityResponse.data);
                lastActivitiesRef.current = activityResponse.data;
            } else {
                const newActivities = [...allActivities, ...activityResponse.data];
                setAllActivities(newActivities);
                lastActivitiesRef.current = newActivities;
            }
        }
    }, [activityResponse?.data, page]);

    // Reset when modal opens
    useEffect(() => {
        if (open) {
            setPage(1);
            setSearchTerm('');
            setActivityScope("all");
            setAllActivities([]);
            setIsManualRefreshing(false);
        }
    }, [open]);

    // Handle loading states
    useEffect(() => {
        if (!isFetching) setIsManualRefreshing(false);
    }, [isFetching]);

    const handleRefresh = async () => {
        try {
            setIsManualRefreshing(true);
            setPage(1);
            await refetch();
        } catch (error) {
            setIsManualRefreshing(false);
        }
    };

    const handleDeleteActivity = async (activityId: string) => {
        try {
            await deleteActivity({ projectId, activityId }).unwrap();
            setAllActivities(prev => prev.filter(a => a.id !== activityId));
            setDeleteActivityId(null);
            toast({
                title: "Activity Deleted",
                description: "The activity has been removed successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Failed to Delete Activity",
                description: error?.data?.message || "An error occurred while deleting the activity.",
                variant: "destructive",
            });
        }
    };

    const handleClearAllActivities = async () => {
        try {
            await clearAllActivities({ id: projectId }).unwrap();
            setAllActivities([]);
            setShowClearAllDialog(false);
            toast({
                title: "Activities Cleared",
                description: "All project activities have been cleared successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Failed to Clear Activities",
                description: error?.data?.message || "An error occurred while clearing activities.",
                variant: "destructive",
            });
        }
    };

    const handleLoadMore = () => {
        if (activityResponse?.pagination?.hasMore) {
            setPage(prev => prev + 1);
        }
    };

    // Filter activities by search term
    const filteredActivities = allActivities.filter(activity => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            activity.userName?.toLowerCase().includes(searchLower) ||
            activity.action?.toLowerCase().includes(searchLower) ||
            formatActivityDescription(activity.action, activity.details).toLowerCase().includes(searchLower)
        );
    });

    const isLoadingContent = isLoading || isManualRefreshing;
    const canDelete = activityResponse?.canDelete || false;
    const canClearAll = activityResponse?.canClearAll || false;

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                    {/* <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    > */}
                    <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                                <Clock className="h-5 w-5" />
                            </div>
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Project Activity Log
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-slate-400">
                            Complete history of all actions and updates on this project
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-4">
                        {/* Filters and Search */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search activities..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Select value={activityScope} onValueChange={setActivityScope}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="project">Project</SelectItem>
                                        <SelectItem value="area">Areas</SelectItem>
                                        <SelectItem value="task">Tasks</SelectItem>
                                        <SelectItem value="member">Members</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sortDirection} onValueChange={setSortDirection}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">Newest First</SelectItem>
                                        <SelectItem value="asc">Oldest First</SelectItem>
                                    </SelectContent>
                                </Select>

                                {canClearAll && allActivities.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowClearAllDialog(true)}
                                        className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear All
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={isLoadingContent}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                                >
                                    <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingContent && "animate-spin")} />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {/* Activity List */}
                        <div className="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                            {isLoadingContent && page === 1 ? (
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                                                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                                                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : isError ? (
                                <div className="flex flex-col items-center justify-center p-12 text-red-500">
                                    <AlertCircle className="h-12 w-12 mb-4" />
                                    <p className="text-lg font-medium mb-2">Failed to Load Activities</p>
                                    <p className="text-sm text-slate-500 mb-4">There was an error loading the project activities</p>
                                    <Button
                                        variant="outline"
                                        onClick={handleRefresh}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Try Again
                                    </Button>
                                </div>
                            ) : filteredActivities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12">
                                    <Activity className="h-12 w-12 mb-4 text-slate-400" />
                                    <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                        {searchTerm ? 'No matching activities' : 'No activities found'}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {searchTerm ? 'Try adjusting your search terms' : 'Project activity will appear here as work progresses'}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 space-y-3">
                                    <AnimatePresence>
                                        {filteredActivities.map((activity, index) => {
                                            const config = getActivityConfig(activity.action);
                                            const IconComponent = config.icon;

                                            return (
                                                <motion.div
                                                    key={activity.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="group"
                                                >
                                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <div className={cn(
                                                            "flex items-center justify-center h-10 w-10 rounded-full shadow-sm",
                                                            config.bg
                                                        )}>
                                                            <IconComponent className={cn("h-5 w-5", config.color)} />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Avatar className="h-7 w-7 border border-white dark:border-slate-800">
                                                                    {activity.userAvatar ? (
                                                                        <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                                                                    ) : (
                                                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-medium">
                                                                            {getUserInitials(activity.userName)}
                                                                        </AvatarFallback>
                                                                    )}
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                            {activity.userName || 'Team Member'}
                                                                        </span>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {config.label}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                        {formatActivityDescription(activity.action, activity.details)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-2">
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

                                                                {canDelete && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => setDeleteActivityId(activity.id)}
                                                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {/* Load More Button */}
                                    {activityResponse?.pagination?.hasMore && (
                                        <div className="flex justify-center pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <Button
                                                variant="outline"
                                                onClick={handleLoadMore}
                                                disabled={isLoading}
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                                            >
                                                {isLoading && page > 1 ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Load More Activities
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Summary Stats */}
                        {allActivities.length > 0 && (
                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 px-2">
                                <span>
                                    Showing {filteredActivities.length} of {allActivities.length} activities
                                </span>
                                {searchTerm && (
                                    <span>
                                        Filtered by: "{searchTerm}"
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {/* </motion.div> */}
                </DialogContent>
            </Dialog>

            {/* Delete Activity Confirmation Dialog */}
            <AlertDialog open={!!deleteActivityId} onOpenChange={() => setDeleteActivityId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete Activity
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this activity? This action cannot be undone and will permanently remove this entry from the project history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteActivityId && handleDeleteActivity(deleteActivityId)}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Activity
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Clear All Activities Confirmation Dialog */}
            <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Clear All Activities
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to clear the entire activity history? This will permanently remove all {allActivities.length} activities and cannot be undone. This action is irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleClearAllActivities}
                            disabled={isClearing}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isClearing ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Clearing All...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All Activities
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
