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
    MessageSquare,
    Settings,
    FileText,
    Plus,
    CheckCircle,
    UserPlus,
    UserMinus,
    Mail,
    Folder,
    Flag,
    Crown,
    Shield,
    Globe
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
    useGetWorkspaceActivitiesQuery,
    useDeleteWorkspaceActivityMutation,
    useClearAllWorkspaceActivitiesMutation
} from '@/Redux/apiSlices/workspaces/workspaceActivitiesApi';
import { cn } from '@/lib/utils';
import { convertFirebaseDateRobust, firebaseFormatDate } from '@/components/utils/dateUtils';

// Activity type configurations (same as parent component)
const WORKSPACE_ACTIVITY_CONFIGS = {
    // Workspace actions
    created_workspace: {
        icon: FileText,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        label: 'Workspace Created'
    },
    updated_workspace: {
        icon: Settings,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Workspace Updated'
    },

    // Member actions
    added_member: {
        icon: UserPlus,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        label: 'Member Added'
    },
    removed_member: {
        icon: UserMinus,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Member Removed'
    },
    role_changed: {
        icon: Crown,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        label: 'Role Changed'
    },

    // Invitation actions
    sent_invitation: {
        icon: Mail,
        color: 'text-orange-600',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        label: 'Invitation Sent'
    },
    invitation_accepted: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30',
        label: 'Invitation Accepted'
    },
    invitation_declined: {
        icon: UserMinus,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Invitation Declined'
    },

    // Project actions
    added_project: {
        icon: Folder,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        label: 'Project Added'
    },
    removed_project: {
        icon: Folder,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Project Removed'
    },

    // Task actions
    created_task: {
        icon: Plus,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        label: 'Task Created'
    },
    completed_task: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30',
        label: 'Task Completed'
    },

    // Meeting actions
    scheduled_meeting: {
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Meeting Scheduled'
    },
    canceled_meeting: {
        icon: Clock,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Meeting Canceled'
    },

    // Milestone actions
    completed_milestone: {
        icon: Flag,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        label: 'Milestone Completed'
    },

    // Communication actions
    created_comment: {
        icon: MessageSquare,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Comment Added'
    },

    default: {
        icon: Activity,
        color: 'text-slate-600',
        bg: 'bg-slate-100 dark:bg-slate-800',
        label: 'Activity'
    }
};

const getWorkspaceActivityConfig = (action: string) => {
    return WORKSPACE_ACTIVITY_CONFIGS[action as keyof typeof WORKSPACE_ACTIVITY_CONFIGS] || WORKSPACE_ACTIVITY_CONFIGS.default;
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
        const date = convertFirebaseDateRobust(timestamp);
        if (!date) return 'recently';

        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

        return firebaseFormatDate(timestamp);
    } catch {
        return 'recently';
    }
};

const formatWorkspaceActivityDescription = (action: string, details: any, entityName?: string) => {
    if (!details && !entityName) return action.replace(/_/g, ' ');

    switch (action) {
        case 'created_workspace':
            return 'created this workspace';
        case 'updated_workspace':
            return 'updated workspace settings';
        case 'added_member':
            return `added ${details?.memberName || 'a member'} as ${details?.memberRole || 'team member'}`;
        case 'removed_member':
            return `removed ${details?.memberName || 'a member'} from the workspace`;
        case 'role_changed':
            return `changed ${details?.memberName || 'a member'}'s role to ${details?.newRole || 'team member'}`;
        case 'sent_invitation':
            return `sent an invitation to ${details?.recipientEmail || 'a user'}`;
        case 'invitation_accepted':
            return 'accepted the workspace invitation';
        case 'invitation_declined':
            return 'declined the workspace invitation';
        case 'added_project':
            return `added project "${details?.projectName || entityName || 'a project'}"`;
        case 'removed_project':
            return `removed project "${details?.projectName || entityName || 'a project'}"`;
        case 'created_task':
            return `created task "${details?.taskName || entityName || 'a task'}"`;
        case 'completed_task':
            return `completed task "${details?.taskName || entityName || 'a task'}"`;
        case 'scheduled_meeting':
            return `scheduled a meeting: "${details?.meetingTitle || entityName || 'untitled'}"`;
        case 'canceled_meeting':
            return `canceled meeting: "${details?.meetingTitle || entityName || 'untitled'}"`;
        case 'completed_milestone':
            return `completed milestone: "${details?.milestoneName || entityName || 'a milestone'}"`;
        case 'created_comment':
            return `commented on ${details?.entityType || 'an item'}`;
        default:
            return action?.replace(/_/g, ' ');
    }
};

const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
        case 'admin':
            return <Crown className="h-3 w-3 text-purple-500" />;
        case 'mentor':
            return <Shield className="h-3 w-3 text-blue-500" />;
        case 'learner':
            return <User className="h-3 w-3 text-green-500" />;
        case 'observer':
            return <Globe className="h-3 w-3 text-slate-500" />;
        default:
            return <User className="h-3 w-3 text-slate-500" />;
    }
};

const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
        case 'admin':
            return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
        case 'mentor':
            return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        case 'learner':
            return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        case 'observer':
            return 'text-slate-600 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800';
        default:
            return 'text-slate-600 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800';
    }
};

interface WorkspaceActivityModalProps {
    workspaceId: string;
    projectId?: string;
    open: boolean;
    onClose: () => void;
}

export function WorkspaceActivityModal({
    workspaceId,
    projectId,
    open,
    onClose
}: WorkspaceActivityModalProps) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [entityType, setEntityType] = useState("all");
    const [importance, setImportance] = useState("all");
    const [allActivities, setAllActivities] = useState<any[]>([]);
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);
    const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
    const [showClearAllDialog, setShowClearAllDialog] = useState(false);

    const lastActivitiesRef = useRef<any[]>([]);
    const { toast } = useToast();

    const handleClose = () => {
        setPage(1);
        setSearchTerm('');
        setEntityType("all");
        setImportance("all");
        onClose();
    };

    // API hooks
    const {
        data: activityResponse,
        isLoading,
        isError,
        refetch,
        isFetching
    } = useGetWorkspaceActivitiesQuery({
        workspaceId,
        entityId: projectId,
        page,
        limit: 20,
        entityType: entityType === 'all' ? undefined : entityType,
        importance: importance === 'all' ? undefined : importance as 'low' | 'medium' | 'high'
    }, {
        skip: !open || !workspaceId,
    });

    const [deleteActivity, { isLoading: isDeleting }] = useDeleteWorkspaceActivityMutation();
    const [clearAllActivities, { isLoading: isClearing }] = useClearAllWorkspaceActivitiesMutation();

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
            setEntityType("all");
            setImportance("all");
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
            await deleteActivity({ workspaceId, activityId }).unwrap();
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
            await clearAllActivities({ workspaceId }).unwrap();
            setAllActivities([]);
            setShowClearAllDialog(false);
            toast({
                title: "Activities Cleared",
                description: "All workspace activities have been cleared successfully.",
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
            activity.entityName?.toLowerCase().includes(searchLower) ||
            formatWorkspaceActivityDescription(activity.action, activity.details, activity.entityName).toLowerCase().includes(searchLower)
        );
    });

    const isLoadingContent = isLoading || isManualRefreshing;
    const canDelete = true; // Assuming workspace activities can be deleted
    const canClearAll = true; // Assuming workspace activities can be cleared

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                                <Activity className="h-5 w-5" />
                            </div>
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {projectId ? 'Project Activity Log' : 'Workspace Activity Log'}
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-slate-400">
                            {projectId
                                ? 'Complete history of all actions and updates on this project'
                                : 'Complete history of all actions and updates in this workspace'
                            }
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

                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <Select value={entityType} onValueChange={setEntityType}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="workspace">Workspace</SelectItem>
                                        <SelectItem value="project">Projects</SelectItem>
                                        <SelectItem value="task">Tasks</SelectItem>
                                        <SelectItem value="member">Members</SelectItem>
                                        <SelectItem value="milestone">Milestones</SelectItem>
                                        <SelectItem value="meeting">Meetings</SelectItem>
                                        <SelectItem value="comment">Comments</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={importance} onValueChange={setImportance}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priority</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
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
                                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
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
                                    <p className="text-sm text-slate-500 mb-4">There was an error loading the workspace activities</p>
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
                                        {searchTerm
                                            ? 'Try adjusting your search terms'
                                            : projectId
                                                ? 'Project activity will appear here as work progresses'
                                                : 'Workspace activity will appear here as team members collaborate'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 space-y-3">
                                    <AnimatePresence>
                                        {filteredActivities.map((activity, index) => {
                                            const config = getWorkspaceActivityConfig(activity.action);
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
                                                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
                                                                            {getUserInitials(activity.userName)}
                                                                        </AvatarFallback>
                                                                    )}
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                            {activity.userName || 'Team Member'}
                                                                        </span>
                                                                        <Badge variant="outline" className={cn("text-xs border", getRoleColor(activity.userRole))}>
                                                                            {getRoleIcon(activity.userRole)}
                                                                            <span className="ml-1 capitalize">{activity.userRole}</span>
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                        {formatWorkspaceActivityDescription(activity.action, activity.details, activity.entityName)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-2">
                                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{formatActivityTime(activity.createdAt)}</span>
                                                                    {activity.entityType && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <Badge variant="secondary" className="text-xs py-0 h-4 capitalize">
                                                                                {activity.entityType.replace('_', ' ')}
                                                                            </Badge>
                                                                        </>
                                                                    )}
                                                                    {activity.importance && activity.importance !== 'medium' && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className={cn(
                                                                                    "text-xs py-0 h-4",
                                                                                    activity.importance === 'high' && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                                                                                    activity.importance === 'low' && "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                                                                                )}
                                                                            >
                                                                                {activity.importance}
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
                                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
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
                </DialogContent>
            </Dialog>

            {/* Delete Activity Confirmation Dialog */}
            <AlertDialog open={!!deleteActivityId} onOpenChange={() => setDeleteActivityId(null)}>
                <AlertDialogContent className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete Activity
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this activity? This action cannot be undone and will permanently remove this entry from the workspace history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                            disabled={isDeleting}>Cancel</AlertDialogCancel>
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
            <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog} >
                <AlertDialogContent className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'>
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
                        <AlertDialogCancel
                            className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                            disabled={isClearing}>Cancel</AlertDialogCancel>
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