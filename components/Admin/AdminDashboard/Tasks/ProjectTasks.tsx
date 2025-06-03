

"use client";

import React, { useState, useMemo } from 'react';
import {
    PlusCircle,
    Search,
    SortAsc,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Import types
import { UnifiedTask, TaskStatus, TaskPriority } from '@/Redux/types/Projects/task';
import { Project, ProjectArea } from '@/Redux/types/Projects';

// Import APIs
import {
    TaskQueryParams,
    useAssignTaskMutation,
    useDeleteTaskMutation,
    useGetTasksQuery,
    useUpdateTaskMutation,
    useUpdateTaskStatusMutation
} from '@/Redux/apiSlices/tasks/tasksApiSlice';

// Import components
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskDetails from './TaskDetails';
import { firebaseFormatDate } from '@/components/utils/dateUtils';
import { useGetProjectMembersQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';

// Simple status configuration like the old design but with dark mode
const statusTabs: {
    value: TaskStatus | 'all';
    label: string;
    colorClass: string;
}[] = [
        { value: 'all', label: 'All', colorClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
        { value: 'todo', label: 'To Do', colorClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
        { value: 'upcoming', label: 'Upcoming', colorClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
        { value: 'in-progress', label: 'In Progress', colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        { value: 'submitted', label: 'Submitted', colorClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
        { value: 'completed', label: 'Completed', colorClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
        { value: 'blocked', label: 'Blocked', colorClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
        { value: 'overdue', label: 'Overdue', colorClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    ];

interface ProjectTasksProps {
    project: Project;
    projectArea?: ProjectArea;
    projectAreas?: ProjectArea[];
    canManage: boolean;
    className?: string;
}

export default function ProjectTasks({
    project,
    projectArea,
    projectAreas = [],
    canManage,
    className = "",
}: ProjectTasksProps) {
    const { toast } = useToast();

    // State management - keep it simple like the old version
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<UnifiedTask | null>(null);
    const [selectedTask, setSelectedTask] = useState<UnifiedTask | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<string>('dueDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // API Query Parameters for tasks
    const queryParams: TaskQueryParams = useMemo(() => ({
        projectId: project.id,
        projectAreaId: projectArea?.id || null,
        status: activeTab !== 'all' ? (activeTab as TaskStatus) : undefined,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
        page: 1,
        limit: 100,
    }), [project.id, projectArea?.id, activeTab, searchQuery, sortBy, sortOrder]);

    // Fetch tasks using the unified API
    const {
        data: tasksResponse,
        isLoading: isLoadingTasks,
        error: tasksError,
        refetch: refetchTasks
    } = useGetTasksQuery(queryParams);

    // Fetch project members using the normalized API
    const {
        data: membersResponse,
        isLoading: isLoadingMembers,
        error: membersError
    } = useGetProjectMembersQuery(project.id);

    // API Mutations
    const [updateTask] = useUpdateTaskMutation();
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [assignTask] = useAssignTaskMutation();

    // Extract data from API responses
    const allTasks = tasksResponse?.data || [];
    const totalTasks = tasksResponse?.total || 0;
    const projectMembers = membersResponse?.data || [];
    const isLoading = isLoadingTasks || isLoadingMembers;

    // Group tasks by status for tab counts - simple like old version
    const groupTasksByStatus = () => {
        const result: Record<string, UnifiedTask[]> = {
            'all': allTasks
        };

        // Initialize empty arrays for each status
        statusTabs.forEach(tab => {
            if (tab.value !== 'all') {
                result[tab.value] = [];
            }
        });

        // Populate with tasks
        allTasks.forEach(task => {
            if (task.status && result[task.status]) {
                result[task.status].push(task);
            }
        });

        return result;
    };

    const tasksGroupedByStatus = groupTasksByStatus();

    // Event Handlers - keep the enhanced functionality but simpler error handling
    const handleStatusChange = async (taskId: string, newStatus: TaskStatus): Promise<void> => {
        try {
            await updateTaskStatus({
                id: taskId,
                projectId: project.id,
                status: newStatus
            }).unwrap();

            toast({
                title: "Task Updated",
                description: "Task status has been updated successfully.",
            });
        } catch (error: any) {
            console.error('Error updating task status:', error);
            toast({
                title: "Failed to Update Task",
                description: "Failed to update task status.",
                variant: "destructive",
            });
            throw error;
        }
    };

    const handlePriorityChange = async (taskId: string, newPriority: TaskPriority) => {
        try {
            await updateTask({
                id: taskId,
                projectId: project.id,
                priority: newPriority
            }).unwrap();

            console.log(newPriority)

            toast({
                title: "Task Updated",
                description: "Task priority has been updated successfully.",
            });
        } catch (error: any) {
            console.error('Error updating task priority:', error);
            toast({
                title: "Failed to Update Task",
                description: "Failed to update task priority.",
                variant: "destructive",
            });
        }
    };

    const handleAssigneeChange = async (taskId: string, assigneeId: string | null) => {
        try {

            console.log(assigneeId)

            await assignTask({
                id: taskId,
                projectId: project.id,
                assigneeId
            }).unwrap();


            toast({
                title: "Task Updated",
                description: assigneeId
                    ? "Task has been assigned successfully."
                    : "Task has been unassigned.",
            });
        } catch (error: any) {
            console.error('Error updating task assignee:', error);
            toast({
                title: "Failed to Update Task",
                description: "Failed to update task assignee.",
                variant: "destructive",
            });
        }
    };

    const handleEditTask = (task: UnifiedTask) => {
        setEditingTask(task);
    };

    const handleUpdateTask = async (updatedTask: UnifiedTask): Promise<void> => {
        try {
            await updateTask({
                id: updatedTask.id,
                projectId: project.id,
                title: updatedTask.title,
                description: updatedTask.description,
                projectAreaId: updatedTask.projectAreaId,
                status: updatedTask.status,
                priority: updatedTask.priority,
                dueDate: firebaseFormatDate(updatedTask.dueDate),
                startDate: firebaseFormatDate(updatedTask.startDate),
                estimatedHours: updatedTask.estimatedHours,
                assigneeId: updatedTask.assigneeId,
                collaboratorIds: updatedTask.collaboratorIds,
                week: updatedTask.week,
                weight: updatedTask.weight,
                maxGrade: updatedTask.maxGrade,
                skills: updatedTask.skills,
                learningObjectives: updatedTask.learningObjectives,
                visibility: updatedTask.visibility,
                resources: updatedTask.resources,
                taskType: updatedTask.taskType,
            }).unwrap();

            toast({
                title: "Task Updated",
                description: "Task has been updated successfully.",
            });

            setEditingTask(null);
        } catch (error: any) {
            console.error('Error updating task:', error);
            toast({
                title: "Failed to Update Task",
                description: "Failed to update task.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask({
                id: taskId,
                projectId: project.id,
                projectAreaId: projectArea?.id
            }).unwrap();

            toast({
                title: "Task Deleted",
                description: "Task has been deleted successfully.",
            });
        } catch (error: any) {
            console.error('Error deleting task:', error);
            toast({
                title: "Failed to Delete Task",
                description: "Failed to delete task.",
                variant: "destructive",
            });
        }
    };

    const handleTaskCreated = () => {
        setIsAddTaskModalOpen(false);
        refetchTasks();
    };

    const handleTaskSelect = (task: UnifiedTask) => {
        setSelectedTask(task);
    };

    const handleDownloadResource = (resource: any) => {
        toast({
            title: "Downloading Resource",
            description: `Downloading ${resource.title}...`,
        });
    };

    const getContextTitle = () => {
        if (projectArea) {
            return `${projectArea.name} Tasks`;
        }
        return "Tasks";
    };

    // If a task is selected, show its details
    if (selectedTask) {
        return (
            <TaskDetails
                task={selectedTask}
                canManage={canManage}
                members={projectMembers}
                projectAreas={projectAreas}
                onStatusChange={handleStatusChange}
                onBack={() => setSelectedTask(null)}
                onDownloadResource={handleDownloadResource}
                onSaveTask={handleUpdateTask}
            />
        );
    }

    return (
        <>
            {/* Use old design but with dark mode support */}
            <Card className={cn("border border-indigo-100 dark:border-indigo-800 shadow-sm rounded-lg dark:bg-slate-800", className)}>
                <CardHeader className="pb-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800">
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                        <CardTitle className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">
                            {getContextTitle()}
                            <p className="text-sm font-normal text-indigo-600 dark:text-indigo-400 mt-1">
                                {totalTasks} task{totalTasks !== 1 ? 's' : ''} {projectArea ? `in ${projectArea.name}` : ''}
                            </p>
                        </CardTitle>
                        {canManage && (
                            <Button
                                size="sm"
                                onClick={() => setIsAddTaskModalOpen(true)}
                                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white shadow-sm w-full xs:w-auto"
                                aria-label="Add new task"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Task
                            </Button>
                        )}
                    </div>

                    {/* Simple search like old version but with enhanced functionality */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-slate-700 dark:text-slate-200"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-36 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
                                    <SelectValue placeholder="Sort by..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dueDate">Due Date</SelectItem>
                                    <SelectItem value="priority">Priority</SelectItem>
                                    <SelectItem value="title">Title</SelectItem>
                                    <SelectItem value="createdAt">Created</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                                <SortAsc className={cn(
                                    "h-4 w-4 transition-transform",
                                    sortOrder === 'desc' && "rotate-180"
                                )} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 dark:bg-slate-800">
                    <Tabs
                        defaultValue="all"
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value)}
                        className='h-full'
                    >
                        {/* Keep the old tab design but with dark mode */}
                        <div className="inline-flex flex-wrap min-w-full mb-2 overflow-x-auto">
                            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 flex flex-wrap justify-start gap-2 w-auto h-full">
                                {statusTabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className={cn(
                                            "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600",
                                            "data-[state=active]:shadow-sm text-gray-600 dark:text-gray-400 min-w-[100px] px-3 text-center whitespace-nowrap"
                                        )}
                                    >
                                        {tab.label}
                                        <span className={cn(
                                            "ml-1 text-xs rounded-full px-1.5 py-0.5",
                                            tab.value === 'all'
                                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                : tab.colorClass
                                        )}>
                                            {tab.value === 'all'
                                                ? allTasks.length
                                                : (tasksGroupedByStatus[tab.value]?.length || 0)}
                                        </span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* Tab contents with proper task list */}
                        {statusTabs.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className="mt-4">
                                <TaskList
                                    tasks={tasksGroupedByStatus[tab.value] || []}
                                    members={projectMembers}
                                    onStatusChange={handleStatusChange}
                                    onPriorityChange={canManage ? handlePriorityChange : undefined}
                                    onAssigneeChange={canManage ? handleAssigneeChange : undefined}
                                    onEditTask={canManage ? handleEditTask : undefined}
                                    onDeleteTask={canManage ? handleDeleteTask : undefined}
                                    onTaskSelect={handleTaskSelect}
                                    canUpdate={canManage}
                                    isLoading={isLoading}
                                    viewMode="detailed"
                                    emptyMessage={
                                        searchQuery
                                            ? `No tasks found matching "${searchQuery}"`
                                            : `No ${tab.label.toLowerCase()} tasks`
                                    }
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            {/* Modals */}
            <AddTaskModal
                projectId={project.id}
                projectAreaId={projectArea?.id}
                open={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                onSuccess={handleTaskCreated}
                members={projectMembers}
                projectAreas={projectAreas}
            />

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    open={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleUpdateTask}
                    members={projectMembers}
                    projectAreas={projectAreas}
                />
            )}
        </>
    );
}