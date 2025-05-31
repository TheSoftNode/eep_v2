"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    PlusCircle,
    CalendarCheck,
    FileText,
    Search,
    MoreVertical,
    Grid3X3,
    List,
    SortAsc,
    Clock,
    AlertCircle,
    TrendingUp,

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
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

// Status configuration with elegant design
const statusTabs: {
    value: TaskStatus | 'all';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
    bgClass: string;
    borderClass: string;
}[] = [
        {
            value: 'all',
            label: 'All Tasks',
            icon: Grid3X3,
            colorClass: 'text-slate-700 dark:text-slate-300',
            bgClass: 'bg-slate-100 dark:bg-slate-800',
            borderClass: 'border-slate-200 dark:border-slate-700'
        },
        {
            value: 'todo',
            label: 'To Do',
            icon: List,
            colorClass: 'text-slate-600 dark:text-slate-400',
            bgClass: 'bg-slate-50 dark:bg-slate-800/50',
            borderClass: 'border-slate-200 dark:border-slate-700'
        },
        {
            value: 'upcoming',
            label: 'Upcoming',
            icon: Clock,
            colorClass: 'text-indigo-700 dark:text-indigo-400',
            bgClass: 'bg-indigo-50 dark:bg-indigo-900/20',
            borderClass: 'border-indigo-200 dark:border-indigo-800'
        },
        {
            value: 'in-progress',
            label: 'In Progress',
            icon: TrendingUp,
            colorClass: 'text-blue-700 dark:text-blue-400',
            bgClass: 'bg-blue-50 dark:bg-blue-900/20',
            borderClass: 'border-blue-200 dark:border-blue-800'
        },
        {
            value: 'submitted',
            label: 'Submitted',
            icon: FileText,
            colorClass: 'text-yellow-700 dark:text-yellow-400',
            bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
            borderClass: 'border-yellow-200 dark:border-yellow-800'
        },
        {
            value: 'completed',
            label: 'Completed',
            icon: CalendarCheck,
            colorClass: 'text-emerald-700 dark:text-emerald-400',
            bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
            borderClass: 'border-emerald-200 dark:border-emerald-800'
        },
        {
            value: 'blocked',
            label: 'Blocked',
            icon: AlertCircle,
            colorClass: 'text-red-700 dark:text-red-400',
            bgClass: 'bg-red-50 dark:bg-red-900/20',
            borderClass: 'border-red-200 dark:border-red-800'
        },
        {
            value: 'overdue',
            label: 'Overdue',
            icon: AlertCircle,
            colorClass: 'text-orange-700 dark:text-orange-400',
            bgClass: 'bg-orange-50 dark:bg-orange-900/20',
            borderClass: 'border-orange-200 dark:border-orange-800'
        },
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

    // State management
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<UnifiedTask | null>(null);
    const [selectedTask, setSelectedTask] = useState<UnifiedTask | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<string>('dueDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode] = useState<'compact' | 'detailed' | 'card'>('detailed');

    // API Query Parameters for tasks
    const queryParams: TaskQueryParams = useMemo(() => ({
        projectId: project.id,
        projectAreaId: projectArea?.id || null,
        status: activeTab !== 'all' ? (activeTab as TaskStatus) : undefined,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
        page: 1,
        limit: 100, // Get all tasks for better UX
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

    // Extract data from API responses
    const allTasks = tasksResponse?.data || [];
    const totalTasks = tasksResponse?.total || 0;
    const projectMembers = membersResponse?.data || [];
    const isLoading = isLoadingTasks || isLoadingMembers;

    // Group tasks by status for tab counts
    const tasksGroupedByStatus = useMemo(() => {
        const groups: Record<string, UnifiedTask[]> = {
            'all': allTasks
        };

        // Initialize empty arrays for each status
        statusTabs.forEach(tab => {
            if (tab.value !== 'all') {
                groups[tab.value] = [];
            }
        });

        // Group tasks by status
        allTasks.forEach(task => {
            if (task.status && groups[task.status]) {
                groups[task.status].push(task);
            }
        });

        return groups;
    }, [allTasks]);

    // Task statistics for the header
    const taskStats = useMemo(() => {
        const stats = {
            total: allTasks.length,
            completed: allTasks.filter(t => t.status === 'completed').length,
            inProgress: allTasks.filter(t => t.status === 'in-progress').length,
            overdue: allTasks.filter(t => t.status === 'overdue').length,
            blocked: allTasks.filter(t => t.status === 'blocked').length,
        };
        return {
            ...stats,
            completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
        };
    }, [allTasks]);

    // Event Handlers
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
                description: error?.data?.message || "Failed to update task status.",
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

            toast({
                title: "Task Updated",
                description: "Task priority has been updated successfully.",
            });
        } catch (error: any) {
            console.error('Error updating task priority:', error);
            toast({
                title: "Failed to Update Task",
                description: error?.data?.message || "Failed to update task priority.",
                variant: "destructive",
            });
        }
    };

    const handleAssigneeChange = async (taskId: string, assigneeId: string | null) => {
        try {
            await updateTask({
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
                description: error?.data?.message || "Failed to update task assignee.",
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
                description: error?.data?.message || "Failed to update task.",
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
                description: error?.data?.message || "Failed to delete task.",
                variant: "destructive",
            });
        }
    };

    const handleTaskCreated = () => {
        setIsAddTaskModalOpen(false);
        refetchTasks(); // Refresh task list
    };

    const handleTaskSelect = (task: UnifiedTask) => {
        setSelectedTask(task);
    };

    const handleDownloadResource = (resource: any) => {
        // Implement resource download functionality
        toast({
            title: "Downloading Resource",
            description: `Downloading ${resource.title}...`,
        });
    };

    const getContextTitle = () => {
        if (projectArea) {
            return `${projectArea.name} Tasks`;
        }
        return `${project.name} Tasks`;
    };

    const getContextSubtitle = () => {
        const taskCount = totalTasks;
        const areaContext = projectArea ? ` in ${projectArea.name}` : '';
        return `${taskCount} task${taskCount !== 1 ? 's' : ''}${areaContext}`;
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn("space-y-6", className)}
            >
                {/* Header Card with Stats */}
                <Card className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        {getContextTitle()}
                                        <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                                            {getContextSubtitle()}
                                        </p>
                                    </div>
                                </CardTitle>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {taskStats.completed} completed
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {taskStats.inProgress} in progress
                                        </span>
                                    </div>
                                    {taskStats.overdue > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span className="text-red-600 dark:text-red-400">
                                                {taskStats.overdue} overdue
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>

                                <div className="flex items-center gap-2">
                                    {canManage && (
                                        <Button
                                            onClick={() => setIsAddTaskModalOpen(true)}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                                        >
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add Task
                                        </Button>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>View Options</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => setViewMode('detailed')}>
                                                <List className="h-4 w-4 mr-2" />
                                                Detailed View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setViewMode('card')}>
                                                <Grid3X3 className="h-4 w-4 mr-2" />
                                                Card View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setViewMode('compact')}>
                                                <List className="h-4 w-4 mr-2" />
                                                Compact View
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => setSortBy('dueDate')}>
                                                <CalendarCheck className="h-4 w-4 mr-2" />
                                                Due Date
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy('priority')}>
                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                Priority
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy('title')}>
                                                <SortAsc className="h-4 w-4 mr-2" />
                                                Title
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search tasks by title, description, or assignee..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-36 border-slate-300 dark:border-slate-600">
                                        <SelectValue placeholder="Sort by..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dueDate">Due Date</SelectItem>
                                        <SelectItem value="priority">Priority</SelectItem>
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="createdAt">Created</SelectItem>
                                        <SelectItem value="updatedAt">Updated</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="border-slate-300 dark:border-slate-600"
                                >
                                    <SortAsc className={cn(
                                        "h-4 w-4 transition-transform",
                                        sortOrder === 'desc' && "rotate-180"
                                    )} />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Tasks Content */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                    <CardContent className="p-6">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            {/* Status Tabs */}
                            <div className="flex overflow-x-auto pb-4 mb-6">
                                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl flex gap-1 min-w-max shadow-inner">
                                    {statusTabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const count = tasksGroupedByStatus[tab.value]?.length || 0;

                                        return (
                                            <TabsTrigger
                                                key={tab.value}
                                                value={tab.value}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium",
                                                    "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900",
                                                    "data-[state=active]:shadow-sm data-[state=active]:border",
                                                    "hover:bg-white/50 dark:hover:bg-slate-900/50",
                                                    "text-slate-600 dark:text-slate-400",
                                                    "data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{tab.label}</span>
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "text-xs font-medium px-2 py-0.5 rounded-full",
                                                        "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
                                                        "data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700",
                                                        "dark:data-[state=active]:bg-indigo-900/50 dark:data-[state=active]:text-indigo-300"
                                                    )}
                                                >
                                                    {count}
                                                </Badge>
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>
                            </div>

                            {/* Tab Contents */}
                            {statusTabs.map((tab) => (
                                <TabsContent key={tab.value} value={tab.value} className="mt-0">
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
                                        viewMode={viewMode}
                                        emptyMessage={
                                            searchQuery
                                                ? `No tasks found matching "${searchQuery}"`
                                                : `No ${tab.label.toLowerCase()} found`
                                        }
                                    />
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>

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