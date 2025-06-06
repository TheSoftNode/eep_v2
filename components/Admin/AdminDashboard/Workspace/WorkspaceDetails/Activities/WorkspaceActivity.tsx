"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    RefreshCw,
    Clock,
    Calendar,
    User,
    Users,
    MessageSquare,
    Settings,
    FileText,
    Plus,
    CheckCircle,
    Eye,
    UserPlus,
    UserMinus,
    Mail,
    Folder,
    Flag,
    Crown,
    Shield,
    Globe,
    Building,
    Target
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { convertFirebaseDateRobust, firebaseFormatDate } from '@/components/utils/dateUtils';
import { useGetWorkspaceActivitiesQuery } from '@/Redux/apiSlices/workspaces/workspaceActivitiesApi';
import { WorkspaceActivityModal } from './WorkspaceActivityModal';

// Activity type configurations
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
        icon: Calendar,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Meeting Scheduled'
    },
    canceled_meeting: {
        icon: Calendar,
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

// Activity List Component
interface ActivityListProps {
    activities: any[];
    isLoading: boolean;
    error: any;
    refreshKey: number;
    onRefresh: () => void;
    emptyMessage: string;
    emptyDescription: string;
}

const ActivityList: React.FC<ActivityListProps> = ({
    activities,
    isLoading,
    error,
    refreshKey,
    onRefresh,
    emptyMessage,
    emptyDescription
}) => {
    if (isLoading) {
        return (
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
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Unable to Load Activity
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    There was an error loading the activity
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {emptyMessage}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {emptyDescription}
                </p>
            </div>
        );
    }

    return (
        <AnimatePresence>
            {activities.map((activity, index) => {
                const config = getWorkspaceActivityConfig(activity.action);
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
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
                                                {getUserInitials(activity.userName)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        {activity.userName || 'Team Member'}
                                    </span>
                                    <Badge variant="outline" className={cn("text-xs border", getRoleColor(activity.userRole))}>
                                        {getRoleIcon(activity.userRole)}
                                        <span className="ml-1 capitalize">{activity.userRole}</span>
                                    </Badge>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    {formatWorkspaceActivityDescription(activity.action, activity.details, activity.entityName)}
                                </p>

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
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </AnimatePresence>
    );
};

// Main Enhanced WorkspaceActivities Component
interface EnhancedWorkspaceActivitiesProps {
    workspaceId: string;
    projectId?: string;
    projectName?: string;
    onViewAllActivity?: () => void;
    className?: string;
}

export default function EnhancedWorkspaceActivities({
    workspaceId,
    projectId,
    projectName,
    onViewAllActivity,
    className
}: EnhancedWorkspaceActivitiesProps) {
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('workspace');

    // Workspace Activities Query
    const {
        data: workspaceActivityResponse,
        isLoading: isLoadingWorkspace,
        error: workspaceError,
        refetch: refetchWorkspace,
        isFetching: isFetchingWorkspace
    } = useGetWorkspaceActivitiesQuery({
        workspaceId,
        entityId: undefined, // Always undefined for workspace activities
        page: 1,
        limit: 3
    }, {
        skip: !workspaceId,
        pollingInterval: 30000,
    });

    // Project Activities Query (only when projectId exists)
    const {
        data: projectActivityResponse,
        isLoading: isLoadingProject,
        error: projectError,
        refetch: refetchProject,
        isFetching: isFetchingProject
    } = useGetWorkspaceActivitiesQuery({
        workspaceId,
        entityId: projectId, // Filter by projectId for project activities
        page: 1,
        limit: 3
    }, {
        skip: !workspaceId || !projectId,
        pollingInterval: 30000,
    });

    const workspaceActivities = workspaceActivityResponse?.data || [];
    const projectActivities = projectActivityResponse?.data || [];

    const isLoadingState = isManualRefreshing || (activeTab === 'workspace' ? isFetchingWorkspace : isFetchingProject);

    // Set initial tab when projectId becomes available for the first time
    useEffect(() => {
        if (projectId && activeTab === 'workspace') {
            setActiveTab('project');
        }
    }, [projectId]); // Remove activeTab from dependencies to prevent forced switching

    useEffect(() => {
        if (!isFetchingWorkspace && !isFetchingProject) {
            setIsManualRefreshing(false);
        }
    }, [isFetchingWorkspace, isFetchingProject]);

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

            if (activeTab === 'workspace') {
                await refetchWorkspace();
            } else {
                await refetchProject();
            }
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
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl -mr-12 -mt-12 pointer-events-none" />

                    <CardHeader className="pb-4 relative">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                                    <Activity className="h-4 w-4" />
                                </div>
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Activity Feed
                                </span>
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRefresh}
                                disabled={isLoadingState}
                                className="h-8 w-8 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            >
                                <RefreshCw className={cn("h-4 w-4 text-indigo-600", isLoadingState && "animate-spin")} />
                            </Button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Latest updates and team activity
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4 relative">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="workspace"
                                    className="flex items-center gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/20 dark:data-[state=active]:text-indigo-300"
                                >
                                    <Building className="h-4 w-4" />
                                    <span>Workspace</span>
                                    {workspaceActivities.length > 0 && (
                                        <Badge variant="secondary" className="text-xs h-5 px-1.5">
                                            {workspaceActivities.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="project"
                                    disabled={!projectId}
                                    className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-300 disabled:opacity-50"
                                >
                                    <Target className="h-4 w-4" />
                                    <span>Project</span>
                                    {projectActivities.length > 0 && (
                                        <Badge variant="secondary" className="text-xs h-5 px-1.5">
                                            {projectActivities.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="workspace" className="mt-4 space-y-3">
                                <ActivityList
                                    activities={workspaceActivities}
                                    isLoading={isLoadingWorkspace}
                                    error={workspaceError}
                                    refreshKey={refreshKey}
                                    onRefresh={handleRefresh}
                                    emptyMessage="No Workspace Activity Yet"
                                    emptyDescription="Workspace activity will appear here as team members collaborate"
                                />
                            </TabsContent>

                            <TabsContent value="project" className="mt-4 space-y-3">
                                {!projectId ? (
                                    <div className="text-center py-8">
                                        <Target className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                            No Project Selected
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Select a project to view project-specific activities
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {projectName && (
                                            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mb-3">
                                                <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                                                    {projectName}
                                                </span>
                                                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs">
                                                    Active Project
                                                </Badge>
                                            </div>
                                        )}
                                        <ActivityList
                                            activities={projectActivities}
                                            isLoading={isLoadingProject}
                                            error={projectError}
                                            refreshKey={refreshKey}
                                            onRefresh={handleRefresh}
                                            emptyMessage="No Project Activity Yet"
                                            emptyDescription="Project activity will appear here as team members work on this project"
                                        />
                                    </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>

                    {((activeTab === 'workspace' && workspaceActivities.length > 0) ||
                        (activeTab === 'project' && projectActivities.length > 0)) && (
                            <CardFooter className="border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 p-4">
                                <Button
                                    variant="ghost"
                                    onClick={handleViewAll}
                                    className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View All {activeTab === 'workspace' ? 'Workspace' : 'Project'} Activity
                                </Button>
                            </CardFooter>
                        )}
                </Card>
            </motion.div>

            {/* Activity Modal */}
            {showModal && (
                <WorkspaceActivityModal
                    workspaceId={workspaceId}
                    projectId={activeTab === 'project' ? projectId : undefined}
                    open={showModal}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
