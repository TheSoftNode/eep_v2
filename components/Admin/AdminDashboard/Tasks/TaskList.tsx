"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    Flag,
    User,
    Trash2,
    Pencil,
    MoreVertical,
    ExternalLink,
    Calendar,
    Clock,
    Target,
    BookOpen,
    Tag,
    CheckCircle2,

    Eye,
    Star,
    TrendingUp,
    Activity,
    FileText,
    Layers,
    GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UnifiedTask } from '@/Redux/types/Projects/task';
import { ProjectMember } from '@/Redux/types/Projects';
import { priorityConfig, statusConfig } from './utils';
import { firebaseFormatDate } from '@/components/utils/dateUtils';


interface TaskListProps {
    tasks: UnifiedTask[];
    members: ProjectMember[];
    onStatusChange: (taskId: string, newStatus: UnifiedTask['status']) => void;
    onPriorityChange?: (taskId: string, newPriority: UnifiedTask['priority']) => void;
    onAssigneeChange?: (taskId: string, assigneeId: string | null) => void;
    onEditTask?: (task: UnifiedTask) => void;
    onDeleteTask?: (taskId: string) => void;
    onTaskSelect?: (task: UnifiedTask) => void;
    canUpdate: boolean;
    isLoading?: boolean;
    emptyMessage?: string;
    viewMode?: 'compact' | 'detailed' | 'card';
    showProgress?: boolean;
    showMetrics?: boolean;
    groupBy?: 'none' | 'status' | 'priority' | 'assignee';
}


const taskTypeIcons = {
    assignment: <FileText className="h-3 w-3" />,
    quiz: <Target className="h-3 w-3" />,
    project: <Layers className="h-3 w-3" />,
    research: <BookOpen className="h-3 w-3" />,
    coding: <FileText className="h-3 w-3" />,
    reading: <BookOpen className="h-3 w-3" />,
    other: <Target className="h-3 w-3" />
};

export default function TaskList({
    tasks,
    members,
    onStatusChange,
    onPriorityChange,
    onAssigneeChange,
    onEditTask,
    onDeleteTask,
    onTaskSelect,
    canUpdate,
    isLoading = false,
    emptyMessage = 'No tasks found in this category',
    viewMode = 'detailed',
    showProgress = true,
    showMetrics = true,
    groupBy = 'none'
}: TaskListProps) {
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());


    const isOverdue = (dateString?: string | Date | null, status?: string): boolean => {
        if (!dateString || status === 'completed') return false;
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date < new Date();
    };

    const getAssigneeInfo = (assigneeId?: string | null) => {
        if (!assigneeId) return { name: 'Unassigned', initials: 'UN', avatar: null };
        const member = members.find(m => m.id === assigneeId);
        if (!member) return { name: 'Unknown', initials: 'UK', avatar: null };

        const initials = member.initials || member.name.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        return {
            name: member.name,
            initials,
            avatar: member.avatar,
            role: member.role
        };
    };

    const toggleTaskExpansion = (taskId: string) => {
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-6 w-6 rounded" />
                                        <Skeleton className="h-5 w-48" />
                                    </div>
                                    <Skeleton className="h-4 w-full max-w-md" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Empty state
    if (tasks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
            >
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-12">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 mx-auto shadow-lg">
                            <Target className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            No Tasks Found
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                            {emptyMessage}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    const groupTasks = () => {
        if (groupBy === 'none') return { 'All Tasks': tasks };

        const grouped: Record<string, UnifiedTask[]> = {};

        tasks.forEach(task => {
            let groupKey = '';

            switch (groupBy) {
                case 'status':
                    groupKey = statusConfig[task.status]?.label || task.status;
                    break;
                case 'priority':
                    groupKey = priorityConfig[task.priority]?.label || task.priority;
                    break;
                case 'assignee':
                    const assigneeInfo = getAssigneeInfo(task.assigneeId);
                    groupKey = assigneeInfo.name;
                    break;
                default:
                    groupKey = 'All Tasks';
            }

            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(task);
        });

        return grouped;
    };

    const groupedTasks = groupTasks();

    const renderTaskCard = (task: UnifiedTask, index: number) => {
        const statusConf = statusConfig[task.status];
        const priorityConf = priorityConfig[task.priority];
        const assigneeInfo = getAssigneeInfo(task.assigneeId);
        const isTaskOverdue = isOverdue(firebaseFormatDate(task.dueDate), task.status);
        const isExpanded = expandedTasks.has(task.id);

        // Return different layouts based on viewMode
        if (viewMode === 'compact') {
            return (
                <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="group"
                >
                    <div className={cn(
                        "flex items-center justify-between p-3 border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer",
                        statusConf.borderColor,
                        statusConf.bgColor,
                        "hover:border-indigo-300"
                    )} onClick={() => onTaskSelect?.(task)}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={cn("flex items-center justify-center w-6 h-6 rounded-full border", statusConf.borderColor, statusConf.bgColor)}>
                                <div className={statusConf.color}>
                                    {statusConf.icon}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{task.title}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    {task.dueDate && (
                                        <span className={isTaskOverdue ? 'text-orange-600' : ''}>
                                            {firebaseFormatDate(task.dueDate)}
                                        </span>
                                    )}
                                    <span>•</span>
                                    <span>{assigneeInfo.name}</span>
                                </div>
                            </div>
                        </div>

                        {canUpdate && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                        const statusCycle = ['todo', 'in-progress', 'completed'] as const;
                                        const currentIndex = statusCycle.indexOf(task.status as any);
                                        const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
                                        onStatusChange(task.id, nextStatus);
                                    }}
                                >
                                    <CheckCircle2 className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            );
        }

        if (viewMode === 'card') {
            return (
                <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                >
                    <Card className={cn(
                        "bg-white dark:bg-slate-900 border-2 transition-all duration-200 hover:shadow-xl cursor-pointer h-full",
                        statusConf.borderColor,
                        task.status === 'completed' && "opacity-75"
                    )}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg border",
                                    statusConf.bgColor,
                                    statusConf.borderColor
                                )}>
                                    <div className={statusConf.color}>
                                        {statusConf.icon}
                                    </div>
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-full border text-xs",
                                    priorityConf.bgColor,
                                    priorityConf.borderColor,
                                    priorityConf.color
                                )}>
                                    {priorityConf.icon}
                                    <span>{priorityConf.label}</span>
                                </div>
                            </div>

                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 min-h-[2.5rem]">
                                {task.title}
                            </h3>

                            {task.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 min-h-[2.5rem]">
                                    {task.description}
                                </p>
                            )}

                            {showProgress && task.progress !== undefined && (
                                <div className="mb-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-slate-500">Progress</span>
                                        <span className="text-xs font-medium">{task.progress}%</span>
                                    </div>
                                    <Progress value={task.progress} className="h-1.5" />
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5">
                                        {assigneeInfo.avatar ? (
                                            <AvatarImage src={assigneeInfo.avatar} alt={assigneeInfo.name} />
                                        ) : (
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                                                {assigneeInfo.initials}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                        {assigneeInfo.name}
                                    </span>
                                </div>

                                {task.dueDate && (
                                    <span className={cn(
                                        "text-xs",
                                        isTaskOverdue ? "text-orange-600 font-medium" : "text-slate-500"
                                    )}>
                                        {firebaseFormatDate(task.dueDate)}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            );
        }

        // Default detailed view (existing implementation)
        return (
            <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="group"
            >
                <Card className={cn(
                    "bg-white dark:bg-slate-900 border-2 transition-all duration-200 hover:shadow-lg cursor-pointer",
                    statusConf.borderColor,
                    task.status === 'completed' && "opacity-75",
                    isTaskOverdue && "border-orange-300 dark:border-orange-700"
                )}>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            {/* Status Icon */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all",
                                            statusConf.bgColor,
                                            statusConf.borderColor,
                                            "group-hover:scale-105"
                                        )}>
                                            <div className={statusConf.color}>
                                                {statusConf.icon}
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>{statusConf.label}</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0" onClick={() => onTaskSelect?.(task)}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {task.week && (
                                            <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                                                Week {task.week}
                                            </Badge>
                                        )}
                                        {task.taskType && (
                                            <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                <div className="flex items-center gap-1">
                                                    {taskTypeIcons[task.taskType]}
                                                    <span className="capitalize">{task.taskType}</span>
                                                </div>
                                            </Badge>
                                        )}
                                        <div className={cn(
                                            "flex items-center gap-1 px-2 py-1 rounded-full border",
                                            priorityConf.bgColor,
                                            priorityConf.borderColor
                                        )}>
                                            <div className={priorityConf.color}>
                                                {priorityConf.icon}
                                            </div>
                                            <span className={cn("text-xs font-medium", priorityConf.color)}>
                                                {priorityConf.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions Menu */}
                                    <div onClick={(e) => e.stopPropagation()}>
                                        {(onEditTask || onDeleteTask) && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {onTaskSelect && (
                                                        <DropdownMenuItem onClick={() => onTaskSelect(task)} className="gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                    )}
                                                    {onEditTask && (
                                                        <DropdownMenuItem onClick={() => onEditTask(task)} className="gap-2">
                                                            <Pencil className="h-4 w-4" />
                                                            Edit Task
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => toggleTaskExpansion(task.id)}
                                                        className="gap-2"
                                                    >
                                                        <Activity className="h-4 w-4" />
                                                        {isExpanded ? 'Collapse' : 'Expand'} Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {onDeleteTask && (
                                                        <DropdownMenuItem
                                                            onClick={() => onDeleteTask(task.id)}
                                                            className="gap-2 text-red-600 dark:text-red-400"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete Task
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1">
                                    {task.title}
                                </h3>

                                {/* Description */}
                                {task.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                        {task.description}
                                    </p>
                                )}

                                {/* Progress Bar */}
                                {showProgress && task.progress !== undefined && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                Progress
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {task.progress}%
                                            </span>
                                        </div>
                                        <Progress value={task.progress} className="h-2" />
                                    </div>
                                )}

                                {/* Metrics Row */}
                                {showMetrics && (
                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                        {task.dueDate && (
                                            <div className={cn(
                                                "flex items-center gap-1",
                                                isTaskOverdue && "text-orange-600 dark:text-orange-400 font-medium"
                                            )}>
                                                <Calendar className="h-3 w-3" />
                                                <span>Due {firebaseFormatDate(task.dueDate)}</span>
                                                {isTaskOverdue && <AlertCircle className="h-3 w-3" />}
                                            </div>
                                        )}
                                        {task.estimatedHours && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{task.estimatedHours}h estimated</span>
                                            </div>
                                        )}
                                        {task.actualHours && (
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" />
                                                <span>{task.actualHours}h actual</span>
                                            </div>
                                        )}
                                        {task.weight && (
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3" />
                                                <span>Weight: {task.weight}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Skills Tags */}
                                {task.skills && task.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {task.skills.slice(0, 3).map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                            >
                                                <Tag className="h-2 w-2 mr-1" />
                                                {skill}
                                            </Badge>
                                        ))}
                                        {task.skills.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{task.skills.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden border-t border-slate-200 dark:border-slate-700 pt-4 mt-4"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                {task.learningObjectives && task.learningObjectives.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                                                            <GraduationCap className="h-3 w-3" />
                                                            Learning Objectives
                                                        </h4>
                                                        <ul className="space-y-1">
                                                            {task.learningObjectives.map((objective, index) => (
                                                                <li key={index} className="flex items-start gap-1">
                                                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-slate-600 dark:text-slate-400">{objective}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {task.resources && task.resources.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                                                            <BookOpen className="h-3 w-3" />
                                                            Resources ({task.resources.length})
                                                        </h4>
                                                        <div className="space-y-1">
                                                            {task.resources.slice(0, 3).map((resource, index) => (
                                                                <div key={index} className="flex items-center gap-1">
                                                                    <ExternalLink className="h-3 w-3 text-indigo-600" />
                                                                    <span className="text-slate-600 dark:text-slate-400 truncate">
                                                                        {resource.title}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {task.resources.length > 3 && (
                                                                <span className="text-slate-500">+{task.resources.length - 3} more resources</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Bottom Row */}
                                <div className="flex items-center justify-between">
                                    {/* Assignee */}
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6 border-2 border-white dark:border-slate-800 shadow-sm">
                                            {assigneeInfo.avatar ? (
                                                <AvatarImage src={assigneeInfo.avatar} alt={assigneeInfo.name} />
                                            ) : (
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
                                                    {assigneeInfo.initials}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div>
                                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                {assigneeInfo.name}
                                            </p>
                                            {assigneeInfo.role && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                                    {assigneeInfo.role}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status and Priority Controls */}
                                    {canUpdate && (
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                {/* Status Dropdown */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn(
                                                        "h-7 px-2 text-xs border transition-all",
                                                        statusConf.borderColor,
                                                        statusConf.bgColor
                                                    )}
                                                    onClick={() => {
                                                        // Cycle through common statuses for quick change
                                                        const statusCycle = ['todo', 'in-progress', 'completed'] as const;
                                                        const currentIndex = statusCycle.indexOf(task.status as any);
                                                        const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
                                                        onStatusChange(task.id, nextStatus);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <div className={statusConf.color}>
                                                            {statusConf.icon}
                                                        </div>
                                                        <span className={statusConf.color}>
                                                            {statusConf.label}
                                                        </span>
                                                    </div>
                                                </Button>

                                                {/* Priority Dropdown */}
                                                {onPriorityChange && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className={cn(
                                                            "h-7 px-2 text-xs border transition-all",
                                                            priorityConf.borderColor,
                                                            priorityConf.bgColor
                                                        )}
                                                        onClick={() => {
                                                            // Cycle through priorities for quick change
                                                            const priorityCycle = ['low', 'medium', 'high', 'critical'] as const;
                                                            const currentIndex = priorityCycle.indexOf(task.priority);
                                                            const nextPriority = priorityCycle[(currentIndex + 1) % priorityCycle.length];
                                                            onPriorityChange(task.id, nextPriority);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <div className={priorityConf.color}>
                                                                {priorityConf.icon}
                                                            </div>
                                                            <span className={priorityConf.color}>
                                                                {priorityConf.label}
                                                            </span>
                                                        </div>
                                                    </Button>
                                                )}

                                                {/* Assignee Change */}
                                                {onAssigneeChange && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs"
                                                        onClick={() => {
                                                            // Cycle through assignees or unassign
                                                            if (!task.assigneeId && members.length > 0) {
                                                                onAssigneeChange(task.id, members[0].id);
                                                            } else {
                                                                onAssigneeChange(task.id, null);
                                                            }
                                                        }}
                                                    >
                                                        <User className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Grade Display */}
                                {task.grade !== undefined && task.grade !== null && (
                                    <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                Grade Received
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3 text-emerald-600" />
                                                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                                    {task.grade}{task.maxGrade ? `/${task.maxGrade}` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
                <div key={groupName}>
                    {groupBy !== 'none' && (
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {groupName}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                                {groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'}
                            </Badge>
                        </div>
                    )}

                    <div className={cn(
                        "gap-4",
                        viewMode === 'card' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"
                    )}>
                        <AnimatePresence>
                            {groupTasks.map((task, index) => renderTaskCard(task, index))}
                        </AnimatePresence>
                    </div>
                </div>
            ))}
        </div>
    );
}