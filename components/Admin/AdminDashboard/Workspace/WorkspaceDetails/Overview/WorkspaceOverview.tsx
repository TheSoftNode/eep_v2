"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Calendar,
    FileText,
    BookOpen,
    MessageSquare,
    CheckCircle,
    Edit,
    Trash2,
    RefreshCw,
    ChevronRight,
    AlertTriangle,
    Users,
    Loader2,
    Activity,
    Mail,
    Folder,
    Flag,
    CheckSquare,
    TrendingUp,
    Target,
    Timer,
    Brain,
    Sparkles,
    Globe,
    Lock,
    Building,
    Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Workspace } from '@/Redux/types/Workspace/workspace';
import { WorkspaceActivity, WorkspaceMilestone } from '@/Redux/types/Workspace/workspace';
import { ProjectSummary } from '@/Redux/types/Workspace/project-summary';
import { convertFirebaseDateRobust, firebaseFormatDate, formatDate } from '@/components/utils/dateUtils';
import { cn } from '@/lib/utils';
import { useClearAllWorkspaceActivitiesMutation, useDeleteWorkspaceActivityMutation, useGetWorkspaceActivitiesQuery, useGetWorkspaceTimelineQuery, useUpdateWorkspaceMilestoneMutation } from '@/Redux/apiSlices/workspaces/workspaceActivitiesApi';

interface WorkspaceOverviewProps {
    workspace: Workspace & {
        learners?: any[];
        mentors?: any[];
        projects?: ProjectSummary[];
        projectsData?: ProjectSummary[];
    };
    activeProjectId?: string | null;
}

interface ActivityParams {
    workspaceId: string;
    entityId?: string;
    limit: number;
    page: number;
}

export default function WorkspaceOverview({ workspace, activeProjectId = null }: WorkspaceOverviewProps) {
    // Find active project data if available
    const activeProject = activeProjectId
        ? (workspace.projectsData || workspace.projects)?.find(project => project.id === activeProjectId)
        : null;

    // State management
    const [editingMilestone, setEditingMilestone] = useState<WorkspaceMilestone | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [isConfirmClearDialogOpen, setIsConfirmClearDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<WorkspaceActivity | null>(null);
    const [milestoneTitle, setMilestoneTitle] = useState('');
    const [milestoneDescription, setMilestoneDescription] = useState('');
    const [milestoneDate, setMilestoneDate] = useState('');
    const [milestoneCompleted, setMilestoneCompleted] = useState(false);
    const [accumulatedActivities, setAccumulatedActivities] = useState<WorkspaceActivity[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isRefreshingTimeline, setIsRefreshingTimeline] = useState(false);

    // Activity parameters with project filtering
    const [activityParams, setActivityParams] = useState<ActivityParams>({
        workspaceId: workspace.id,
        entityId: activeProjectId || undefined,
        limit: 10,
        page: 1
    });

    // RTK Query hooks
    const {
        data: activitiesResponse,
        isLoading: isLoadingActivities,
        refetch: refetchActivities
    } = useGetWorkspaceActivitiesQuery(activityParams);

    const {
        data: timelineResponse,
        isLoading: isLoadingTimeline,
        refetch: refetchTimeline
    } = useGetWorkspaceTimelineQuery({ workspaceId: workspace.id });

    const [updateMilestone, { isLoading: isUpdatingMilestone }] = useUpdateWorkspaceMilestoneMutation();
    const [deleteActivity, { isLoading: isDeletingActivity }] = useDeleteWorkspaceActivityMutation();
    const [clearAllActivities, { isLoading: isClearingActivities }] = useClearAllWorkspaceActivitiesMutation();

    // Update activityParams when activeProjectId changes
    useEffect(() => {
        setActivityParams(prev => ({
            ...prev,
            entityId: activeProjectId || undefined,
            page: 1 // Reset to page 1 when project changes
        }));
    }, [activeProjectId]);

    // Calculate workspace stats
    const stats = activeProject ? {
        totalTasks: activeProject.taskCount || 0,
        completedTasks: activeProject.completedTaskCount || 0,
        upcomingDeadlines: 3,
        resources: activeProject.resourceCount || 0,
        hoursSpent: 42,
        progress: activeProject.progress || 0
    } : {
        totalTasks: workspace.projectIds?.length ? workspace.projectIds.length * 10 : 0,
        completedTasks: workspace.projectIds?.length ? Math.floor(workspace.projectIds.length * 7) : 0,
        upcomingDeadlines: 3,
        resources: 8,
        hoursSpent: 42,
        progress: 67
    };

    // Safely calculate completion percentage
    const completionPercentage = stats.totalTasks > 0
        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
        : stats.progress || 0;

    const isFirestoreTimestamp = (date: any): date is { toDate: () => Date } => {
        return date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function';
    };

    // Initialize milestone edit form
    useEffect(() => {
        if (editingMilestone) {
            setMilestoneTitle(editingMilestone.title);
            setMilestoneDescription(editingMilestone.description || '');
            // Handle both string dates and Firestore timestamps
            const dateStr = editingMilestone.dueDate ?
                convertFirebaseDateRobust(editingMilestone.dueDate).toISOString().split('T')[0] :
                '';
            setMilestoneDate(dateStr);
            setMilestoneCompleted(editingMilestone.status === 'completed');
        }
    }, [editingMilestone]);

    // Update accumulated activities
    useEffect(() => {
        if (activitiesResponse?.data && Array.isArray(activitiesResponse.data)) {
            const newActivities = activitiesResponse.data;
            if (activityParams.page === 1) {
                setAccumulatedActivities(newActivities);
            } else {
                setAccumulatedActivities(prev => [...prev, ...newActivities]);
            }
        }
    }, [activitiesResponse?.data, activityParams.page]);

    const getVisibilityIcon = () => {
        switch (workspace.visibility) {
            case 'public': return <Globe className="h-3 w-3" />;
            case 'private': return <Lock className="h-3 w-3" />;
            case 'organization': return <Building className="h-3 w-3" />;
            default: return <Lock className="h-3 w-3" />;
        }
    };

    const getVisibilityColor = () => {
        switch (workspace.visibility) {
            case 'public':
                return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'private':
                return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'organization':
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            default:
                return 'bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800';
        }
    };

    const getStatusColor = () => {
        switch (workspace.status) {
            case 'active':
                return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
            case 'completed':
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'paused':
                return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            case 'draft':
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
            case 'archived':
                return 'bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800';
            default:
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
        }
    };

    // Event handlers
    const handleLoadMoreActivities = async () => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            setActivityParams(prev => ({ ...prev, page: prev.page + 1 }));
        } catch (error) {
            console.error('Error loading more activities:', error);
            toast({
                title: "Error",
                description: "Failed to load more activities",
                variant: "destructive",
            });
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleRefreshActivities = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            setActivityParams({
                workspaceId: workspace.id,
                entityId: activeProjectId || undefined,
                limit: 10,
                page: 1
            });
            await refetchActivities();
            toast({
                title: "Success",
                description: "Activities refreshed successfully",
                variant: "default",
            });
        } catch (error) {
            console.error('Error refreshing activities:', error);
            toast({
                title: "Error",
                description: "Failed to refresh activities",
                variant: "destructive",
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleRefreshTimeline = async () => {
        if (isLoadingTimeline || isRefreshingTimeline) return;
        setIsRefreshingTimeline(true);
        try {
            await refetchTimeline();
            toast({
                title: "Success",
                description: "Timeline refreshed successfully",
                variant: "default",
            });
        } catch (error) {
            console.error('Error refreshing timeline:', error);
            toast({
                title: "Error",
                description: "Failed to refresh timeline",
                variant: "destructive",
            });
        } finally {
            setIsRefreshingTimeline(false);
        }
    };

    const handleUpdateMilestone = async () => {
        if (!editingMilestone) return;
        try {
            await updateMilestone({
                workspaceId: workspace.id,
                milestoneId: editingMilestone.id,
                title: milestoneTitle,
                description: milestoneDescription,
                dueDate: new Date(milestoneDate).toISOString(),
                status: milestoneCompleted ? 'completed' : 'upcoming'
            }).unwrap();

            toast({
                title: "Success",
                description: "Milestone updated successfully",
                variant: "default",
            });

            setIsEditDialogOpen(false);
            refetchTimeline();
        } catch (error) {
            console.error('Error updating milestone:', error);
            toast({
                title: "Error",
                description: "Failed to update milestone. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteActivity = async () => {
        if (!selectedActivity) return;
        try {
            await deleteActivity({
                workspaceId: workspace.id,
                activityId: selectedActivity.id
            }).unwrap();

            toast({
                title: "Success",
                description: "Activity deleted successfully",
                variant: "default",
            });

            setIsConfirmDeleteDialogOpen(false);
            setSelectedActivity(null);
            refetchActivities();
        } catch (error) {
            console.error('Error deleting activity:', error);
            toast({
                title: "Error",
                description: "Failed to delete activity. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleClearAllActivities = async () => {
        try {
            await clearAllActivities({ workspaceId: workspace.id }).unwrap();
            toast({
                title: "Success",
                description: "All activities cleared successfully",
                variant: "default",
            });
            setIsConfirmClearDialogOpen(false);
            refetchActivities();
        } catch (error) {
            console.error('Error clearing activities:', error);
            toast({
                title: "Error",
                description: "Failed to clear activities. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Get icon for activity based on action type
    const getActivityIcon = (action: string) => {
        const iconMap: Record<string, JSX.Element> = {
            created_workspace: <FileText className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />,
            updated_workspace: <FileText className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />,
            added_member: <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />,
            removed_member: <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />,
            sent_invitation: <Mail className="h-4 w-4 text-purple-500 dark:text-purple-400" />,
            invitation_accepted: <Mail className="h-4 w-4 text-purple-500 dark:text-purple-400" />,
            invitation_declined: <Mail className="h-4 w-4 text-purple-500 dark:text-purple-400" />,
            added_project: <Folder className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />,
            removed_project: <Folder className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />,
            created_task: <CheckSquare className="h-4 w-4 text-green-500 dark:text-green-400" />,
            completed_task: <CheckSquare className="h-4 w-4 text-green-500 dark:text-green-400" />,
            scheduled_meeting: <Calendar className="h-4 w-4 text-orange-500 dark:text-orange-400" />,
            canceled_meeting: <Calendar className="h-4 w-4 text-orange-500 dark:text-orange-400" />,
            completed_milestone: <Flag className="h-4 w-4 text-red-500 dark:text-red-400" />,
            created_comment: <MessageSquare className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        };
        return iconMap[action] || <Activity className="h-4 w-4 text-slate-500 dark:text-slate-400" />;
    };

    // Format activity description
    const formatActivityDescription = (activity: WorkspaceActivity) => {
        const actionMap: Record<string, string> = {
            created_workspace: 'created this workspace',
            updated_workspace: 'updated workspace details',
            added_member: `added ${activity.details?.memberName || 'a new member'} as ${activity.details?.memberRole || 'a member'}`,
            removed_member: `removed ${activity.details?.memberName || 'a member'} from the workspace`,
            sent_invitation: `sent an invitation to ${activity.details?.recipientEmail || 'a user'}`,
            invitation_accepted: 'accepted the workspace invitation',
            invitation_declined: 'declined the workspace invitation',
            added_project: `added project "${activity.details?.projectName || 'a project'}"`,
            removed_project: `removed project "${activity.details?.projectName || 'a project'}"`,
            created_task: `created task "${activity.details?.taskName || 'a task'}"`,
            completed_task: `completed task "${activity.details?.taskName || 'a task'}"`,
            scheduled_meeting: `scheduled a meeting: "${activity.details?.meetingTitle || 'untitled'}"`,
            canceled_meeting: `canceled meeting: "${activity.details?.meetingTitle || 'untitled'}"`,
            completed_milestone: `completed milestone: "${activity.details?.milestoneName || 'a milestone'}"`,
            created_comment: 'left a comment'
        };
        return actionMap[activity?.action] || activity?.action?.replace(/_/g, ' ');
    };

    const totalMembers = workspace.memberCount ||
        ((workspace.learners?.length || 0) + (workspace.mentors?.length || 0));

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-t-xl"></div>
                <div className="p-4 sm:p-6">
                    {activeProject ? (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {activeProject.name}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {activeProject.description || "Active project in this workspace"}
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                Active Project
                            </Badge>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {workspace.name}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {workspace.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={getStatusColor()}>
                                    {workspace.status}
                                </Badge>
                                <Badge variant="secondary" className={getVisibilityColor()}>
                                    {getVisibilityIcon()}
                                    <span className="ml-1 capitalize">{workspace.visibility}</span>
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {workspace.tags && workspace.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {workspace.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created {formatDate(workspace.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {formatDate(workspace.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {totalMembers} members
                        </span>
                        <span className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            {workspace.projectIds?.length || 0} projects
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-green-500 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Progress</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {completionPercentage}%
                        </div>
                        <Progress value={completionPercentage} className="h-2 mb-2" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {stats.completedTasks}/{stats.totalTasks} tasks
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-amber-500 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Deadlines</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.upcomingDeadlines}
                            </div>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Due this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-blue-500 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Timer className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Time</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.hoursSpent}h
                            </div>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Total logged
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-purple-500 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-purple-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Resources</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.resources}
                            </div>
                            <Brain className="h-4 w-4 text-purple-500" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Documents
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recent Activity Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg"></div>
                    <CardHeader className="p-4 sm:p-6 pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center text-base font-semibold text-slate-900 dark:text-white">
                                <Activity className="h-4 w-4 mr-2 text-indigo-500" />
                                {activeProject ? 'Project Activity' : 'Recent Activity'}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-slate-500 hover:text-indigo-600"
                                    onClick={handleRefreshActivities}
                                    disabled={isRefreshing || isLoadingActivities}
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing || isLoadingActivities ? 'animate-spin' : ''}`} />
                                </Button>
                                {activitiesResponse?.totalCount && activitiesResponse.totalCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-red-500 hover:text-red-600"
                                        onClick={() => setIsConfirmClearDialogOpen(true)}
                                        disabled={isRefreshing || isLoadingActivities || isLoadingMore}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        {isLoadingActivities && activityParams.page === 1 ? (
                            <ActivityLoadingSkeleton />
                        ) : !accumulatedActivities || accumulatedActivities.length === 0 ? (
                            <EmptyActivityState isProjectView={!!activeProject} />
                        ) : (
                            <div className="space-y-3">
                                {accumulatedActivities.map((activity) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow"
                                    >
                                        <div className="rounded-full bg-white dark:bg-slate-700 p-2 shadow-sm border border-slate-200 dark:border-slate-600">
                                            {getActivityIcon(activity.action)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm">
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {activity.userName}
                                                </span>{' '}
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {formatActivityDescription(activity)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {activity.createdAt ? firebaseFormatDate(convertFirebaseDateRobust(activity.createdAt)) : 'Recently'}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                                            onClick={() => {
                                                setSelectedActivity(activity);
                                                setIsConfirmDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </motion.div>
                                ))}

                                {/* Loading more indicator */}
                                {isLoadingMore && (
                                    <div className="flex justify-center py-3">
                                        <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            <span className="text-sm">Loading more...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Load more button */}
                                {activitiesResponse?.pagination?.hasMore && !isLoadingMore && (
                                    <Button
                                        variant="outline"
                                        className="w-full mt-3 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        onClick={handleLoadMoreActivities}
                                        disabled={isLoadingMore || isRefreshing}
                                    >
                                        View More Activities
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Timeline Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-lg"></div>
                    <CardHeader className="p-4 sm:p-6 pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center text-base font-semibold text-slate-900 dark:text-white">
                                <Flag className="h-4 w-4 mr-2 text-purple-500" />
                                {activeProject ? 'Project Timeline' : 'Workspace Timeline'}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-slate-500 hover:text-purple-600"
                                onClick={handleRefreshTimeline}
                                disabled={isLoadingTimeline || isRefreshingTimeline}
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingTimeline || isRefreshingTimeline ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        {isLoadingTimeline ? (
                            <TimelineLoadingSkeleton />
                        ) : !timelineResponse?.data || timelineResponse.data.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-3">
                                    <Calendar className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">No milestones yet</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    {activeProject
                                        ? "Create milestones to track this project's progress"
                                        : "Create milestones to track workspace progress"}
                                </p>
                                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Milestone
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {timelineResponse.data.map((milestone, i) => (
                                    <motion.div
                                        key={milestone.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "h-8 w-8 rounded-full flex items-center justify-center shadow-sm",
                                                milestone.status === 'completed'
                                                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                            )}>
                                                {milestone.status === 'completed' ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <span className="text-xs font-semibold">{i + 1}</span>
                                                )}
                                            </div>
                                            {i < ((timelineResponse.data?.length || 0) - 1) && (
                                                <div className={cn(
                                                    "h-12 w-0.5 mt-2",
                                                    milestone.status === 'completed'
                                                        ? 'bg-gradient-to-b from-green-400 to-emerald-500'
                                                        : 'bg-slate-200 dark:bg-slate-700'
                                                )} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {milestone.title}
                                                    </h4>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 w-6 p-0 text-slate-400 hover:text-indigo-500"
                                                                    onClick={() => {
                                                                        setEditingMilestone(milestone);
                                                                        setIsEditDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Edit className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Edit Milestone
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                {milestone.description && (
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                                        {milestone.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span>Due {milestone.dueDate ? formatDate(convertFirebaseDateRobust(milestone.dueDate)) : 'No due date'}</span>
                                                    {milestone.status === 'completed' && milestone.completedDate && (
                                                        <>
                                                            <span className="mx-2">•</span>
                                                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                                            <span>Completed {formatDate(convertFirebaseDateRobust(milestone.completedDate))}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Edit Milestone Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-indigo-500" />
                            Edit Milestone
                        </DialogTitle>
                        <DialogDescription>
                            Update the details of this milestone
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="milestoneTitle">Title</Label>
                            <Input
                                id="milestoneTitle"
                                value={milestoneTitle}
                                onChange={(e) => setMilestoneTitle(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="milestoneDescription">Description</Label>
                            <Textarea
                                id="milestoneDescription"
                                value={milestoneDescription}
                                onChange={(e) => setMilestoneDescription(e.target.value)}
                                placeholder="Add a description for this milestone..."
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="milestoneDate">Due Date</Label>
                            <Input
                                id="milestoneDate"
                                type="date"
                                value={milestoneDate}
                                onChange={(e) => setMilestoneDate(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="milestoneCompleted"
                                checked={milestoneCompleted}
                                onChange={(e) => setMilestoneCompleted(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                            />
                            <Label htmlFor="milestoneCompleted">Mark as completed</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateMilestone}
                            disabled={isUpdatingMilestone}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                        >
                            {isUpdatingMilestone ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Activity Dialog */}
            <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            Delete Activity
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this activity log? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {selectedActivity && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="text-sm font-medium text-red-600 dark:text-red-400">
                                    Activity by {selectedActivity.userName}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    {formatActivityDescription(selectedActivity)}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {firebaseFormatDate(selectedActivity.createdAt)}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteActivity}
                            disabled={isDeletingActivity}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeletingActivity ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Activity
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Clear All Activities Dialog */}
            <Dialog open={isConfirmClearDialogOpen} onOpenChange={setIsConfirmClearDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            Clear All Activities
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete all activity logs for this workspace? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium text-red-600 dark:text-red-400">Warning</div>
                                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    This will permanently delete all activity logs in this {activeProject ? 'project' : 'workspace'}. This operation is irreversible.
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmClearDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleClearAllActivities}
                            disabled={isClearingActivities}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isClearingActivities ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Clearing...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Clear All Activities
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Loading Skeletons
function ActivityLoadingSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function TimelineLoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        {i < 3 && <Skeleton className="h-12 w-0.5 mt-2" />}
                    </div>
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Empty States
function EmptyActivityState({ isProjectView = false }: { isProjectView?: boolean }) {
    return (
        <div className="text-center py-8">
            <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-3">
                <Activity className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">No activity yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                {isProjectView
                    ? "Activities will appear here as team members interact with this project"
                    : "Activities will appear here as team members interact with the workspace"
                }
            </p>
        </div>
    );
}