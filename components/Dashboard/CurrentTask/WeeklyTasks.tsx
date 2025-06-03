"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TasksHeader from './TasksHeader';
import TasksStats from './TasksStats';
import CurrentTaskView from './CurrentTaskView';
import TaskDetailSidebar from './TaskDetailSidebar';
import { UnifiedTask, TaskResource } from '@/Redux/types/Projects';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useGetProjectByIdQuery, useGetProjectMembersQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { useAssignTaskMutation, useDeleteTaskMutation, useGetTasksQuery, useSubmitTaskMutation, useUpdateTaskPriorityMutation, useUpdateTaskStatusMutation } from '@/Redux/apiSlices/tasks/tasksApiSlice';
import TaskList from '../Tasks/TaskList';

// Helper function to convert Firebase date to JS Date
const convertToDate = (date: any): Date | null => {
    if (!date) return null;

    try {
        // Handle Firestore timestamp
        if (typeof date === 'object' && '_seconds' in date) {
            return new Date(date._seconds * 1000);
        }

        // Handle string date
        if (typeof date === 'string') {
            return new Date(date);
        }

        // Handle Date object
        if (date instanceof Date) {
            return date;
        }

        return null;
    } catch (error) {
        console.error('Error converting date:', error);
        return null;
    }
};

export default function WeeklyTasks({ projectId }: { projectId: string }) {
    const { user } = useAuth();
    const { toast } = useToast();

    // State
    const [selectedTask, setSelectedTask] = useState<UnifiedTask | null>(null);
    const [submissionComment, setSubmissionComment] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all-tasks');

    // Fetch project details
    const {
        data: projectResponse,
        isLoading: isLoadingProject
    } = useGetProjectByIdQuery(projectId, { skip: !projectId });

    console.log("projects: ", projectResponse);

    // Fetch project members separately
    const {
        data: membersResponse,
        isLoading: isLoadingMembers
    } = useGetProjectMembersQuery(projectId, { skip: !projectId });

    console.log("members: ", membersResponse)

    // Fetch tasks with sorting and filtering using correct API structure
    const {
        data: tasksResponse,
        isLoading: isLoadingTasks,
        refetch: refetchTasks
    } = useGetTasksQuery({
        projectId,
        sortBy: 'week',
        sortOrder: 'asc',
        includeCompleted: true
    }, { skip: !projectId });

    console.log("tasks: ", tasksResponse)

    // Task mutations using new API structure
    const [submitTask] = useSubmitTaskMutation();
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    const [assignTask] = useAssignTaskMutation();
    const [updateTaskPriority] = useUpdateTaskPriorityMutation();
    const [deleteTask] = useDeleteTaskMutation();

    const isLoading = isLoadingProject || isLoadingTasks || isLoadingMembers;
    const project = projectResponse?.data;
    const tasks = tasksResponse?.data || [];
    const projectMembers = membersResponse?.data || [];

    // Get user role in project using proper members data
    const userRole = (() => {
        if (!user?.id || !project) return 'member';

        if (project.createdBy === user.id) return 'Project Manager';

        // Check in project members array
        const userMember = projectMembers.find(member => member.userId === user.id);
        return userMember?.role || 'member';
    })();

    // Check if user can manage tasks
    const canManage = userRole === 'Project Manager' ||
        userRole === 'owner' ||
        userRole === 'contributor' ||
        userRole === 'mentor' ||
        userRole === 'reviewer';

    // Prepare task data for different categories
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const activeTask = tasks.find(task => task.status === 'in-progress') || null;
    const upcomingTasks = tasks.filter(task => task.status === 'upcoming' || task.status === 'todo');
    const overdueSubmissions = tasks.filter(task => task.status === 'overdue');

    // Calculate the current week from active tasks
    const currentWeek = (() => {
        const activeTasks = tasks.filter(task =>
            task.status === 'in-progress' ||
            task.status === 'todo' ||
            task.status === 'upcoming'
        );

        if (activeTasks.length === 0) return 1;

        const weeks = activeTasks
            .filter(task => task.week !== undefined)
            .map(task => task.week as number);

        return weeks.length > 0 ? Math.max(...weeks) : 1;
    })();

    // Calculate overall progress from completed tasks percentage
    const progressPercentage = tasks.length > 0
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0;

    // Sort tasks by week and due date
    const sortedTasks = [...tasks].sort((a, b) => {
        // Sort by week first
        const weekA = a.week !== undefined ? a.week : 999;
        const weekB = b.week !== undefined ? b.week : 999;
        const weekDiff = weekA - weekB;

        if (weekDiff !== 0) return weekDiff;

        // If same week, sort by due date
        if (a.dueDate && b.dueDate) {
            const dateA = convertToDate(a.dueDate);
            const dateB = convertToDate(b.dueDate);
            if (dateA && dateB) {
                return dateA.getTime() - dateB.getTime();
            }
        }

        // Tasks with due dates come before tasks without
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;

        return 0;
    });

    // Handle task selection
    const handleTaskSelect = (task: UnifiedTask) => {
        setSelectedTask(task);
        setSidebarOpen(true);
    };

    // Handle file uploads
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles(Array.from(e.target.files));
        }
    };

    // Remove a file from the upload list
    const handleRemoveFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    };

    // Handle task status change using correct API structure
    const handleStatusChange = async (taskId: string, newStatus: UnifiedTask['status']) => {
        try {
            await updateTaskStatus({
                id: taskId,
                projectId,
                status: newStatus
            }).unwrap();

            refetchTasks();

            toast({
                title: "Task updated",
                description: "Task status has been updated successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error('Failed to update task status:', error);
            toast({
                title: "Error",
                description: "Failed to update task status.",
                variant: "destructive",
            });
        }
    };

    // Handle task priority change
    const handlePriorityChange = async (taskId: string, newPriority: UnifiedTask['priority']) => {
        try {
            await updateTaskPriority({
                id: taskId,
                projectId,
                priority: newPriority
            }).unwrap();

            refetchTasks();

            toast({
                title: "Task updated",
                description: "Task priority has been updated successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error('Failed to update task priority:', error);
            toast({
                title: "Error",
                description: "Failed to update task priority.",
                variant: "destructive",
            });
        }
    };

    // Handle task assignee change using correct API structure
    const handleAssigneeChange = async (taskId: string, assigneeId: string | null) => {
        try {
            await assignTask({
                id: taskId,
                projectId,
                assigneeId
            }).unwrap();

            refetchTasks();

            toast({
                title: "Task updated",
                description: assigneeId
                    ? "Task has been assigned successfully."
                    : "Task has been unassigned.",
                variant: "default",
            });
        } catch (error) {
            console.error('Failed to update task assignee:', error);
            toast({
                title: "Error",
                description: "Failed to update task assignee.",
                variant: "destructive",
            });
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask({
                id: taskId,
                projectId
            }).unwrap();

            refetchTasks();
            setSidebarOpen(false);

            toast({
                title: "Task deleted",
                description: "Task has been deleted successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error('Failed to delete task:', error);
            toast({
                title: "Error",
                description: "Failed to delete task.",
                variant: "destructive",
            });
        }
    };

    // Handle task submission using correct API structure  
    const handleSubmitTask = async () => {
        if (!selectedTask) return;

        setIsSubmitting(true);

        try {
            // Process file uploads - in a real implementation you would upload the files to storage
            const processedAttachments = uploadedFiles.map((file, index) => ({
                id: `attachment_${Date.now()}_${index}`,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                url: URL.createObjectURL(file) // In a real app, this would be a cloud storage URL
            }));

            // Submit the task using the correct API structure
            await submitTask({
                id: selectedTask.id,
                projectId,
                content: submissionComment,
                attachments: processedAttachments
            }).unwrap();

            // Refetch tasks to update the UI
            refetchTasks();

            // Reset the state
            setIsSubmitting(false);
            setSidebarOpen(false);
            setSubmissionComment('');
            setUploadedFiles([]);

            toast({
                title: "Success",
                description: "Task submitted successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error('Failed to submit task:', error);

            toast({
                title: "Error",
                description: "Failed to submit task. Please try again.",
                variant: "destructive",
            });

            setIsSubmitting(false);
        }
    };

    // Download resource - handles TaskResource type
    const handleDownloadResource = (resource: TaskResource) => {
        if (resource.url) {
            window.open(resource.url, '_blank');
        }
    };


    return (
        <div className="space-y-6 min-h-screen dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header and Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Tasks Header with Export and Calendar features */}
                <TasksHeader
                    projectName={project?.name || "Project Tasks"}
                    tasks={tasks}
                    isLoading={isLoading}
                />

                {/* Stats Cards */}
                <TasksStats
                    progressPercentage={progressPercentage}
                    currentWeek={currentWeek}
                    completedTasksCount={completedTasks.length}
                    totalTasksCount={tasks.length}
                    activeTask={activeTask}
                    isLoading={isLoading}
                />
            </motion.div>

            {/* Tabs with different task views */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Tabs defaultValue="all-tasks" className="space-y-6" onValueChange={setActiveTab}>
                    <TabsList className="backdrop-blur-sm dark:bg-slate-800/50 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 shadow-lg">
                        <TabsTrigger
                            value="all-tasks"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white dark:text-slate-300 text-slate-700"
                        >
                            All Tasks
                        </TabsTrigger>
                        <TabsTrigger
                            value="current-task"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white dark:text-slate-300 text-slate-700"
                        >
                            Current Task
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white dark:text-slate-300 text-slate-700"
                        >
                            Completed
                        </TabsTrigger>
                        <TabsTrigger
                            value="upcoming"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white dark:text-slate-300 text-slate-700"
                        >
                            Upcoming
                        </TabsTrigger>
                    </TabsList>

                    {/* All Tasks View */}
                    <TabsContent value="all-tasks" className="space-y-4">
                        <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl overflow-hidden">
                            <CardHeader className="border-b dark:border-slate-700/30 border-slate-200/70 dark:bg-gradient-to-r dark:from-[#0A0F2C]/80 dark:to-[#0A0E1F]/80 bg-gradient-to-r from-slate-50/80 to-white/80">
                                <CardTitle className="dark:text-white text-slate-800">Project Development Roadmap</CardTitle>
                                <CardDescription className="dark:text-slate-400 text-slate-600">
                                    Your development tasks are organized by week to help you track progress effectively
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <TaskList
                                    tasks={sortedTasks}
                                    members={projectMembers}
                                    onStatusChange={handleStatusChange}
                                    onPriorityChange={canManage ? handlePriorityChange : undefined}
                                    onAssigneeChange={canManage ? handleAssigneeChange : undefined}
                                    onDeleteTask={canManage ? handleDeleteTask : undefined}
                                    onTaskSelect={handleTaskSelect}
                                    canUpdate={true}
                                    isLoading={isLoading}
                                    emptyMessage="No tasks found for this project yet."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Current Task View */}
                    <TabsContent value="current-task">
                        <CurrentTaskView
                            activeTask={activeTask}
                            upcomingTasks={upcomingTasks}
                            handleTaskSelect={handleTaskSelect}
                            handleDownloadResource={handleDownloadResource}
                            isLoading={isLoading}
                        />
                    </TabsContent>

                    {/* Completed Tasks View */}
                    <TabsContent value="completed">
                        <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl overflow-hidden">
                            <CardHeader className="border-b dark:border-slate-700/30 border-slate-200/70 dark:bg-gradient-to-r dark:from-[#0A0F2C]/80 dark:to-[#0A0E1F]/80 bg-gradient-to-r from-slate-50/80 to-white/80">
                                <CardTitle className="dark:text-white text-slate-800">Completed Tasks</CardTitle>
                                <CardDescription className="dark:text-slate-400 text-slate-600">
                                    You've completed {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'} in this project
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <TaskList
                                    tasks={completedTasks}
                                    members={projectMembers}
                                    onStatusChange={handleStatusChange}
                                    onTaskSelect={handleTaskSelect}
                                    canUpdate={true}
                                    isLoading={isLoading}
                                    emptyMessage="No completed tasks yet. Keep up the good work!"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Upcoming Tasks View */}
                    <TabsContent value="upcoming">
                        <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl overflow-hidden">
                            <CardHeader className="border-b dark:border-slate-700/30 border-slate-200/70 dark:bg-gradient-to-r dark:from-[#0A0F2C]/80 dark:to-[#0A0E1F]/80 bg-gradient-to-r from-slate-50/80 to-white/80">
                                <CardTitle className="dark:text-white text-slate-800">Upcoming Tasks</CardTitle>
                                <CardDescription className="dark:text-slate-400 text-slate-600">
                                    You have {upcomingTasks.length} {upcomingTasks.length === 1 ? 'task' : 'tasks'} scheduled ahead
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <TaskList
                                    tasks={upcomingTasks}
                                    members={projectMembers}
                                    onStatusChange={handleStatusChange}
                                    onPriorityChange={canManage ? handlePriorityChange : undefined}
                                    onAssigneeChange={canManage ? handleAssigneeChange : undefined}
                                    onTaskSelect={handleTaskSelect}
                                    canUpdate={true}
                                    isLoading={isLoading}
                                    emptyMessage="No upcoming tasks. You're all caught up!"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Task Detail Sidebar */}
            <TaskDetailSidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                selectedTask={selectedTask}
                submissionComment={submissionComment}
                setSubmissionComment={setSubmissionComment}
                uploadedFiles={uploadedFiles}
                handleFileUpload={handleFileUpload}
                handleRemoveFile={handleRemoveFile}
                isSubmitting={isSubmitting}
                handleSubmitTask={handleSubmitTask}
                handleDownloadResource={handleDownloadResource}
            />
        </div>
    );
}