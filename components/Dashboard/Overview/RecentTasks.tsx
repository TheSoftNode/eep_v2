"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calendar,
    FileText,
    ChevronRight,
    Clock,
    AlertCircle,
    Target,
    BookOpen,
    Layers,
    Flag,
    CheckCircle2,
    Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { UnifiedTask, ProjectMember } from '@/Redux/types/Projects';
import { cn } from '@/lib/utils';
import { firebaseFormatDate } from '@/components/utils/dateUtils';

// Status and priority configurations
const statusConfig = {
    'todo': {
        label: 'To Do',
        color: 'text-slate-600',
        bgColor: 'bg-slate-50 dark:bg-slate-800',
        borderColor: 'border-slate-200 dark:border-slate-700',
        icon: <Target className="h-4 w-4" />
    },
    'upcoming': {
        label: 'Upcoming',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
        icon: <Clock className="h-4 w-4" />
    },
    'in-progress': {
        label: 'In Progress',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 dark:bg-amber-900/30',
        borderColor: 'border-amber-200 dark:border-amber-800',
        icon: <Clock className="h-4 w-4" />
    },
    'submitted': {
        label: 'Submitted',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
        icon: <FileText className="h-4 w-4" />
    },
    'completed': {
        label: 'Completed',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        icon: <CheckCircle2 className="h-4 w-4" />
    },
    'blocked': {
        label: 'Blocked',
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: <AlertCircle className="h-4 w-4" />
    },
    'overdue': {
        label: 'Overdue',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/30',
        borderColor: 'border-orange-200 dark:border-orange-800',
        icon: <AlertCircle className="h-4 w-4" />
    }
};

const priorityConfig = {
    'low': {
        label: 'Low',
        color: 'text-slate-600',
        bgColor: 'bg-slate-50 dark:bg-slate-800',
        borderColor: 'border-slate-200 dark:border-slate-700',
        icon: <Flag className="h-3 w-3" />
    },
    'medium': {
        label: 'Medium',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
        icon: <Flag className="h-3 w-3" />
    },
    'high': {
        label: 'High',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 dark:bg-amber-900/30',
        borderColor: 'border-amber-200 dark:border-amber-800',
        icon: <Flag className="h-3 w-3" />
    },
    'critical': {
        label: 'Critical',
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: <Flag className="h-3 w-3" />
    }
};

const taskTypeIcons = {
    assignment: <FileText className="h-3 w-3" />,
    quiz: <Target className="h-3 w-3" />,
    project: <Layers className="h-3 w-3" />,
    research: <BookOpen className="h-3 w-3" />,
    coding: <FileText className="h-3 w-3" />,
    reading: <BookOpen className="h-3 w-3" />,
    other: <Target className="h-3 w-3" />
};

interface RecentTasksProps {
    tasks: UnifiedTask[];
    members?: ProjectMember[];
    isLoading?: boolean;
    showProgress?: boolean;
    limit?: number;
}

export default function RecentTasks({
    tasks,
    members = [],
    isLoading = false,
    showProgress = true,
    limit = 5
}: RecentTasksProps) {
    const displayTasks = tasks.slice(0, limit);

    const isOverdue = (dateString?: string | Date | null, status?: string): boolean => {
        if (!dateString || status === 'completed') return false;
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date < new Date();
    };

    const getAssigneeInfo = (assigneeId?: string | null) => {
        if (!assigneeId) return { name: 'Unassigned', initials: 'UN', avatar: null };
        const member = members.find(m => m.userId === assigneeId);
        if (!member) return { name: 'You', initials: 'ME', avatar: null };

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

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="text-lg">Recent Tasks</CardTitle>
                        <CardDescription>Your recent project assignments and submissions</CardDescription>
                    </div>
                    <Skeleton className="h-8 w-20" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center p-3 rounded-lg">
                                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-3 w-full" />
                                </div>
                                <Skeleton className="h-8 w-8 ml-2" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Recent Tasks
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                        Your recent project assignments and submissions
                    </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="text-xs">
                    <Link href="/dashboard/tasks">
                        View All
                        <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {displayTasks.map((task, index) => {
                        const statusConf = statusConfig[task.status];
                        const priorityConf = priorityConfig[task.priority];
                        const assigneeInfo = getAssigneeInfo(task.assigneeId);
                        const isTaskOverdue = isOverdue(firebaseFormatDate(task.dueDate), task.status);

                        return (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="group"
                            >
                                <div className={cn(
                                    "flex items-start p-3 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer",
                                    statusConf.borderColor,
                                    statusConf.bgColor,
                                    "hover:border-indigo-300 dark:hover:border-indigo-600",
                                    isTaskOverdue && "border-orange-300 dark:border-orange-700"
                                )}>
                                    {/* Status Icon */}
                                    <div className="mr-3 flex-shrink-0">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                                            statusConf.borderColor,
                                            statusConf.bgColor,
                                            "group-hover:scale-105"
                                        )}>
                                            <div className={statusConf.color}>
                                                {statusConf.icon}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Task Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Header with badges */}
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate text-sm">
                                                    {task.title}
                                                </h4>
                                                {task.week && (
                                                    <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-xs px-1.5 py-0.5">
                                                        Week {task.week}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs px-1.5 py-0.5",
                                                        statusConf.bgColor,
                                                        statusConf.color,
                                                        statusConf.borderColor
                                                    )}
                                                >
                                                    {statusConf.label}
                                                </Badge>
                                                <div className={cn(
                                                    "flex items-center gap-1 px-1.5 py-0.5 rounded border",
                                                    priorityConf.bgColor,
                                                    priorityConf.borderColor
                                                )}>
                                                    <div className={priorityConf.color}>
                                                        {priorityConf.icon}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {task.description && (
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
                                                {task.description}
                                            </p>
                                        )}

                                        {/* Progress bar */}
                                        {showProgress && task.progress !== undefined && (
                                            <div className="mb-2">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-slate-500">Progress</span>
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                        {task.progress}%
                                                    </span>
                                                </div>
                                                <Progress value={task.progress} className="h-1.5" />
                                            </div>
                                        )}

                                        {/* Task Type and Skills */}
                                        {(task.taskType || (task.skills && task.skills.length > 0)) && (
                                            <div className="flex items-center gap-2 mb-2">
                                                {task.taskType && (
                                                    <Badge variant="secondary" className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                        <div className="flex items-center gap-1">
                                                            {taskTypeIcons[task.taskType]}
                                                            <span className="capitalize">{task.taskType}</span>
                                                        </div>
                                                    </Badge>
                                                )}
                                                {task.skills && task.skills.length > 0 && (
                                                    <Badge variant="secondary" className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                                        {task.skills[0]}
                                                        {task.skills.length > 1 && ` +${task.skills.length - 1}`}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        {/* Footer with metadata */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
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
                                                    <>
                                                        <span className="mx-2">•</span>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{task.estimatedHours}h</span>
                                                        </div>
                                                    </>
                                                )}
                                                {task.weight && (
                                                    <>
                                                        <span className="mx-2">•</span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3" />
                                                            <span>Weight: {task.weight}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Assignee */}
                                            <div className="flex items-center gap-1">
                                                <Avatar className="h-5 w-5 border border-white dark:border-slate-800 shadow-sm">
                                                    {assigneeInfo.avatar ? (
                                                        <AvatarImage src={assigneeInfo.avatar} alt={assigneeInfo.name} />
                                                    ) : (
                                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
                                                            {assigneeInfo.initials}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                                    {assigneeInfo.name}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Grade Display */}
                                        {task.grade !== undefined && task.grade !== null && (
                                            <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                        Grade
                                                    </span>
                                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                                        {task.grade}{task.maxGrade ? `/${task.maxGrade}` : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                    >
                                        <Link href={`/dashboard/tasks/${task.id}?projectId=${task.projectId}`}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}

                    {displayTasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 text-center"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-3 mx-auto">
                                <FileText className="h-6 w-6" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                                No recent tasks
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs">
                                Your completed and in-progress tasks will appear here
                            </p>
                        </motion.div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}