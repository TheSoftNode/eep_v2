"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    CheckCircle,
    Edit,
    RefreshCw,
    Flag,
    Plus,
    Loader2,
    AlertTriangle,
    Trash2,
    Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { WorkspaceMilestone } from '@/Redux/types/Workspace/workspace';
import { convertFirebaseDateRobust, formatDate } from '@/components/utils/dateUtils';
import { cn } from '@/lib/utils';
import {
    useGetWorkspaceTimelineQuery,
    useCreateWorkspaceMilestoneMutation,
    useUpdateWorkspaceMilestoneMutation,
    useDeleteWorkspaceMilestoneMutation
} from '@/Redux/apiSlices/workspaces/workspaceActivitiesApi';

interface WorkspaceTimelineProps {
    workspaceId: string;
    activeProjectId?: string;
    className?: string;
}

export default function WorkspaceTimeline({
    workspaceId,
    activeProjectId,
    className
}: WorkspaceTimelineProps) {
    // State management
    const [editingMilestone, setEditingMilestone] = useState<WorkspaceMilestone | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingMilestone, setDeletingMilestone] = useState<WorkspaceMilestone | null>(null);
    const [isRefreshingTimeline, setIsRefreshingTimeline] = useState(false);

    // Form state
    const [milestoneTitle, setMilestoneTitle] = useState('');
    const [milestoneDescription, setMilestoneDescription] = useState('');
    const [milestoneDate, setMilestoneDate] = useState('');
    const [milestoneCompleted, setMilestoneCompleted] = useState(false);
    const [milestonePublic, setMilestonePublic] = useState(true);

    // API hooks
    const {
        data: timelineResponse,
        isLoading: isLoadingTimeline,
        refetch: refetchTimeline
    } = useGetWorkspaceTimelineQuery({ workspaceId });

    const [createMilestone, { isLoading: isCreatingMilestone }] = useCreateWorkspaceMilestoneMutation();
    const [updateMilestone, { isLoading: isUpdatingMilestone }] = useUpdateWorkspaceMilestoneMutation();
    const [deleteMilestone, { isLoading: isDeletingMilestone }] = useDeleteWorkspaceMilestoneMutation();

    // Reset form when dialogs close
    useEffect(() => {
        if (!isCreateDialogOpen && !isEditDialogOpen) {
            setMilestoneTitle('');
            setMilestoneDescription('');
            setMilestoneDate('');
            setMilestoneCompleted(false);
            setMilestonePublic(true);
        }
    }, [isCreateDialogOpen, isEditDialogOpen]);

    // Initialize edit form when milestone is selected
    useEffect(() => {
        if (editingMilestone) {
            setMilestoneTitle(editingMilestone.title);
            setMilestoneDescription(editingMilestone.description || '');
            const dateStr = editingMilestone.dueDate ?
                convertFirebaseDateRobust(editingMilestone.dueDate).toISOString().split('T')[0] :
                '';
            setMilestoneDate(dateStr);
            setMilestoneCompleted(editingMilestone.status === 'completed');
            setMilestonePublic(editingMilestone.isPublic);
        }
    }, [editingMilestone]);

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

    const handleCreateMilestone = async () => {
        if (!milestoneTitle || !milestoneDate) {
            toast({
                title: "Error",
                description: "Please fill in the title and due date",
                variant: "destructive",
            });
            return;
        }

        try {
            await createMilestone({
                workspaceId,
                title: milestoneTitle,
                description: milestoneDescription,
                dueDate: milestoneDate,
                isPublic: milestonePublic,
                associatedProjectIds: activeProjectId ? [activeProjectId] : []
            }).unwrap();

            toast({
                title: "Success",
                description: "Milestone created successfully",
                variant: "default",
            });

            setIsCreateDialogOpen(false);
        } catch (error) {
            console.error('Error creating milestone:', error);
            toast({
                title: "Error",
                description: "Failed to create milestone. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleUpdateMilestone = async () => {
        if (!editingMilestone) return;

        try {
            await updateMilestone({
                workspaceId,
                milestoneId: editingMilestone.id,
                title: milestoneTitle,
                description: milestoneDescription,
                dueDate: milestoneDate,
                status: milestoneCompleted ? 'completed' : 'upcoming',
                isPublic: milestonePublic,
                associatedProjectIds: activeProjectId ? [activeProjectId] : []
            }).unwrap();

            toast({
                title: "Success",
                description: "Milestone updated successfully",
                variant: "default",
            });

            setIsEditDialogOpen(false);
            setEditingMilestone(null);
        } catch (error) {
            console.error('Error updating milestone:', error);
            toast({
                title: "Error",
                description: "Failed to update milestone. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteMilestone = async () => {
        if (!deletingMilestone) return;

        try {
            await deleteMilestone({
                workspaceId,
                milestoneId: deletingMilestone.id
            }).unwrap();

            toast({
                title: "Success",
                description: "Milestone deleted successfully",
                variant: "default",
            });

            setIsDeleteDialogOpen(false);
            setDeletingMilestone(null);
        } catch (error) {
            console.error('Error deleting milestone:', error);
            toast({
                title: "Error",
                description: "Failed to delete milestone. Please try again.",
                variant: "destructive",
            });
        }
    };


    const openEditDialog = (milestone: WorkspaceMilestone) => {
        setEditingMilestone(milestone);
        setMilestoneTitle(milestone.title);
        setMilestoneDescription(milestone.description || '');
        const dateStr = milestone.dueDate ?
            convertFirebaseDateRobust(milestone.dueDate).toISOString().split('T')[0] :
            '';
        setMilestoneDate(dateStr);
        setMilestoneCompleted(milestone.status === 'completed');
        setMilestonePublic(milestone.isPublic);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (milestone: WorkspaceMilestone) => {
        setDeletingMilestone(milestone);
        setIsDeleteDialogOpen(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={className}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-lg"></div>
                    <CardHeader className="p-4 sm:p-6 pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center text-base font-semibold text-slate-900 dark:text-white">
                                <Flag className="h-4 w-4 mr-2 text-purple-500" />
                                {activeProjectId ? 'Project Timeline' : 'Workspace Timeline'}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-purple-500 hover:text-purple-600"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </Button>
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
                                    {activeProjectId
                                        ? "Create milestones to track this project's progress"
                                        : "Create milestones to track workspace progress"}
                                </p>
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Milestone
                                </Button>
                            </div>
                        ) : (
                            // <div className="space-y-4">
                            //     {timelineResponse.data.map((milestone, i) => (
                            //         <motion.div
                            //             key={milestone.id}
                            //             initial={{ opacity: 0, x: -20 }}
                            //             animate={{ opacity: 1, x: 0 }}
                            //             transition={{ delay: i * 0.1 }}
                            //             className="flex items-start gap-4"
                            //         >
                            //             <div className="flex flex-col items-center">
                            //                 <div className={cn(
                            //                     "h-8 w-8 rounded-full flex items-center justify-center shadow-sm",
                            //                     milestone.status === 'completed'
                            //                         ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                            //                         : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            //                 )}>
                            //                     {milestone.status === 'completed' ? (
                            //                         <CheckCircle className="h-4 w-4" />
                            //                     ) : (
                            //                         <span className="text-xs font-semibold">{i + 1}</span>
                            //                     )}
                            //                 </div>
                            //                 {i < ((timelineResponse.data?.length || 0) - 1) && (
                            //                     <div className={cn(
                            //                         "h-12 w-0.5 mt-2",
                            //                         milestone.status === 'completed'
                            //                             ? 'bg-gradient-to-b from-green-400 to-emerald-500'
                            //                             : 'bg-slate-200 dark:bg-slate-700'
                            //                     )} />
                            //                 )}
                            //             </div>
                            //             <div className="flex-1 min-w-0">
                            //                 <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                            //                     <div className="flex items-center justify-between mb-2">
                            //                         <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                            //                             {milestone.title}
                            //                         </h4>
                            //                         <div className="flex items-center gap-1">
                            //                             <TooltipProvider>
                            //                                 <Tooltip>
                            //                                     <TooltipTrigger asChild>
                            //                                         <Button
                            //                                             variant="ghost"
                            //                                             size="sm"
                            //                                             className="h-6 w-6 p-0 text-slate-400 hover:text-indigo-500"
                            //                                             onClick={() => openEditDialog(milestone)}
                            //                                         >
                            //                                             <Edit className="h-3.5 w-3.5" />
                            //                                         </Button>
                            //                                     </TooltipTrigger>
                            //                                     <TooltipContent>
                            //                                         Edit Milestone
                            //                                     </TooltipContent>
                            //                                 </Tooltip>
                            //                             </TooltipProvider>
                            //                             <TooltipProvider>
                            //                                 <Tooltip>
                            //                                     <TooltipTrigger asChild>
                            //                                         <Button
                            //                                             variant="ghost"
                            //                                             size="sm"
                            //                                             className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                            //                                             onClick={() => openDeleteDialog(milestone)}
                            //                                         >
                            //                                             <Trash2 className="h-3.5 w-3.5" />
                            //                                         </Button>
                            //                                     </TooltipTrigger>
                            //                                     <TooltipContent>
                            //                                         Delete Milestone
                            //                                     </TooltipContent>
                            //                                 </Tooltip>
                            //                             </TooltipProvider>
                            //                         </div>
                            //                     </div>
                            //                     {milestone.description && (
                            //                         <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                            //                             {milestone.description}
                            //                         </p>
                            //                     )}
                            //                     <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            //                         <Calendar className="h-3 w-3 mr-1" />
                            //                         <span>Due {milestone.dueDate ? formatDate(convertFirebaseDateRobust(milestone.dueDate)) : 'No due date'}</span>
                            //                         {milestone.status === 'completed' && milestone.completedDate && (
                            //                             <>
                            //                                 <span className="mx-2">•</span>
                            //                                 <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            //                                 <span>Completed {formatDate(convertFirebaseDateRobust(milestone.completedDate))}</span>
                            //                             </>
                            //                         )}
                            //                     </div>
                            //                 </div>
                            //             </div>
                            //         </motion.div>
                            //     ))}
                            // </div>
                            // Replace the milestone mapping section (lines ~260-320) with this:
                            <div className="space-y-3">
                                {timelineResponse.data.map((milestone, i) => (
                                    <motion.div
                                        key={milestone.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group"
                                    >
                                        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20">
                                            {/* Status Icon */}
                                            <div className={cn(
                                                "flex items-center justify-center h-10 w-10 rounded-full shadow-sm border-2",
                                                milestone.status === 'completed'
                                                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300'
                                                    : milestone.status === 'overdue'
                                                        ? 'bg-gradient-to-br from-red-400 to-red-500 text-white border-red-300'
                                                        : 'bg-gradient-to-br from-purple-400 to-pink-500 text-white border-purple-300'
                                            )}>
                                                {milestone.status === 'completed' ? (
                                                    <CheckCircle className="h-5 w-5" />
                                                ) : milestone.status === 'overdue' ? (
                                                    <AlertTriangle className="h-5 w-5" />
                                                ) : (
                                                    <Flag className="h-5 w-5" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                                                            {milestone.title}
                                                        </h4>
                                                        {milestone.description && (
                                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                                                {milestone.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                                                        onClick={() => openEditDialog(milestone)}
                                                                    >
                                                                        <Edit className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Edit Milestone</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                        onClick={() => openDeleteDialog(milestone)}
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Delete Milestone</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>

                                                {/* Metadata */}
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Due {milestone.dueDate ? formatDate(convertFirebaseDateRobust(milestone.dueDate)) : 'No due date'}</span>
                                                    </div>

                                                    {milestone.status === 'completed' && milestone.completedDate && (
                                                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                            <CheckCircle className="h-3 w-3" />
                                                            <span>Completed {formatDate(convertFirebaseDateRobust(milestone.completedDate))}</span>
                                                        </div>
                                                    )}

                                                    {/* Status Badge */}
                                                    <div className="ml-auto">
                                                        <span className={cn(
                                                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                            milestone.status === 'completed'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                                                : milestone.status === 'overdue'
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                                                    : milestone.status === 'in_progress'
                                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                                                        )}>
                                                            {milestone.status.replace('_', ' ')}
                                                        </span>
                                                    </div>

                                                    {/* Visibility Indicator */}
                                                    {!milestone.isPublic && (
                                                        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                            <Lock className="h-3 w-3" />
                                                            <span>Private</span>
                                                        </div>
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

            {/* Create Milestone Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-purple-500" />
                            Create Milestone
                        </DialogTitle>
                        <DialogDescription>
                            Add a new milestone to track progress
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="createTitle">Title</Label>
                            <Input
                                id="createTitle"
                                value={milestoneTitle}
                                onChange={(e) => setMilestoneTitle(e.target.value)}
                                placeholder="Enter milestone title"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="createDescription">Description</Label>
                            <Textarea
                                id="createDescription"
                                value={milestoneDescription}
                                onChange={(e) => setMilestoneDescription(e.target.value)}
                                placeholder="Add a description for this milestone..."
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="createDate">Due Date</Label>
                            <Input
                                id="createDate"
                                type="date"
                                value={milestoneDate}
                                onChange={(e) => setMilestoneDate(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="createPublic"
                                checked={milestonePublic}
                                onChange={(e) => setMilestonePublic(e.target.checked)}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                            />
                            <Label htmlFor="createPublic">Visible to all members</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateMilestone}
                            disabled={isCreatingMilestone}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                        >
                            {isCreatingMilestone ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Milestone
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Milestone Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
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
                            <Label htmlFor="editTitle">Title</Label>
                            <Input
                                id="editTitle"
                                value={milestoneTitle}
                                onChange={(e) => setMilestoneTitle(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="editDescription">Description</Label>
                            <Textarea
                                id="editDescription"
                                value={milestoneDescription}
                                onChange={(e) => setMilestoneDescription(e.target.value)}
                                placeholder="Add a description for this milestone..."
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="editDate">Due Date</Label>
                            <Input
                                id="editDate"
                                type="date"
                                value={milestoneDate}
                                onChange={(e) => setMilestoneDate(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="editCompleted"
                                checked={milestoneCompleted}
                                onChange={(e) => setMilestoneCompleted(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                            />
                            <Label htmlFor="editCompleted">Mark as completed</Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="editPublic"
                                checked={milestonePublic}
                                onChange={(e) => setMilestonePublic(e.target.checked)}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                            />
                            <Label htmlFor="editPublic">Visible to all members</Label>
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

            {/* Delete Milestone Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            Delete Milestone
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this milestone? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {deletingMilestone && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="text-sm font-medium text-red-600 dark:text-red-400">
                                    {deletingMilestone.title}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    Due: {deletingMilestone.dueDate ? formatDate(convertFirebaseDateRobust(deletingMilestone.dueDate)) : 'No due date'}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteMilestone}
                            disabled={isDeletingMilestone}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeletingMilestone ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Milestone
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Loading Skeleton
function TimelineLoadingSkeleton() {
    return (
        <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
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