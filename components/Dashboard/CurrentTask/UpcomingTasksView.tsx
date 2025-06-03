"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
    CalendarCheck,
    Eye,
    Calendar,
    Clock,
    Target,
    Zap,
    ArrowRight,
    AlertCircle,
    Play,
    User
} from 'lucide-react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, differenceInDays } from 'date-fns';
import { UnifiedTask, FirebaseDate } from '@/Redux/types/Projects';

export interface UpcomingTasksViewProps {
    upcomingTasks: UnifiedTask[];
    isLoading: boolean;
}

export default function UpcomingTasksView({ upcomingTasks, isLoading }: UpcomingTasksViewProps) {
    // Helper function to format Firebase date
    const formatFirebaseDate = (date: FirebaseDate | string | undefined): string => {
        if (!date) return 'Unknown date';

        try {
            // Handle Firestore timestamp with _seconds
            if (typeof date === 'object' && '_seconds' in date) {
                return format(new Date(date._seconds * 1000), 'MMM d, yyyy');
            }

            // Handle string date
            if (typeof date === 'string') {
                return format(parseISO(date), 'MMM d, yyyy');
            }

            // Handle Date object
            if (date instanceof Date) {
                return format(date, 'MMM d, yyyy');
            }

            return 'Unknown date';
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown date';
        }
    };

    // Calculate days until due date
    const getDaysUntilDue = (dueDate: FirebaseDate | string | undefined): number => {
        if (!dueDate) return 0;

        try {
            let dueDateObj: Date;

            if (typeof dueDate === 'object' && '_seconds' in dueDate) {
                dueDateObj = new Date(dueDate._seconds * 1000);
            } else if (typeof dueDate === 'string') {
                dueDateObj = parseISO(dueDate);
            } else if (dueDate instanceof Date) {
                dueDateObj = dueDate;
            } else {
                return 0;
            }

            return Math.max(0, differenceInDays(dueDateObj, new Date()));
        } catch (error) {
            console.error('Error calculating days until due:', error);
            return 0;
        }
    };

    // Get user initials for avatar fallback
    const getUserInitials = (name: string): string => {
        if (!name) return '??';
        return name.split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Get assignee info
    const getAssigneeInfo = (task: UnifiedTask) => {
        if (task.assigneeDetails) {
            return {
                name: task.assigneeDetails.name || 'Unassigned',
                avatar: task.assigneeDetails.profilePicture || '',
                initials: getUserInitials(task.assigneeDetails.name || 'Unassigned'),
                role: task.assigneeDetails.role || 'Member'
            };
        }

        return {
            name: 'Unassigned',
            avatar: '',
            initials: 'UN',
            role: 'Member'
        };
    };

    // Get priority colors
    const getPriorityColors = (priority?: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/30';
        }
    };

    // Get urgency styling based on days remaining
    const getUrgencyInfo = (days: number) => {
        if (days <= 3) {
            return {
                color: 'text-red-600 dark:text-red-400',
                bgColor: 'bg-red-50 dark:bg-red-900/20',
                borderColor: 'border-red-200 dark:border-red-800/30',
                icon: <AlertCircle className="h-4 w-4" />,
                label: 'Urgent'
            };
        } else if (days <= 7) {
            return {
                color: 'text-orange-600 dark:text-orange-400',
                bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                borderColor: 'border-orange-200 dark:border-orange-800/30',
                icon: <Clock className="h-4 w-4" />,
                label: 'Soon'
            };
        } else {
            return {
                color: 'text-blue-600 dark:text-blue-400',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                borderColor: 'border-blue-200 dark:border-blue-800/30',
                icon: <Calendar className="h-4 w-4" />,
                label: 'Scheduled'
            };
        }
    };

    if (isLoading) {
        return (
            <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl">
                <CardHeader className="border-b dark:border-slate-700/30 border-slate-200/70">
                    <Skeleton className="h-5 w-48 mb-2 dark:bg-slate-700/40 bg-slate-200/70" />
                    <Skeleton className="h-4 w-full dark:bg-slate-700/40 bg-slate-200/70" />
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="border dark:border-slate-700/30 border-slate-200/70 rounded-lg p-4 dark:bg-slate-800/20 bg-slate-50/50">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <Skeleton className="h-6 w-20 mb-2 dark:bg-slate-700/40 bg-slate-200/70" />
                                        <Skeleton className="h-5 w-48 mb-1 dark:bg-slate-700/40 bg-slate-200/70" />
                                        <Skeleton className="h-4 w-full dark:bg-slate-700/40 bg-slate-200/70" />
                                    </div>
                                    <Skeleton className="h-6 w-24 dark:bg-slate-700/40 bg-slate-200/70" />
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    <Skeleton className="h-5 w-16 dark:bg-slate-700/40 bg-slate-200/70" />
                                    <Skeleton className="h-5 w-16 dark:bg-slate-700/40 bg-slate-200/70" />
                                    <Skeleton className="h-5 w-16 dark:bg-slate-700/40 bg-slate-200/70" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-32 dark:bg-slate-700/40 bg-slate-200/70" />
                                    <Skeleton className="h-8 w-28 dark:bg-slate-700/40 bg-slate-200/70" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (upcomingTasks.length === 0) {
        return (
            <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl text-center py-8">
                <CardContent className="p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center"
                    >
                        <Calendar className="h-10 w-10 text-green-500 dark:text-green-400" />
                    </motion.div>
                    <h3 className="font-semibold text-xl mb-3 dark:text-white text-slate-800">All Tasks Completed!</h3>
                    <p className="dark:text-slate-400 text-slate-600 max-w-md mx-auto">
                        Congratulations! You've completed all tasks in the program. Keep up the excellent work!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl overflow-hidden">
            <CardHeader className="border-b dark:border-slate-700/30 border-slate-200/70 dark:bg-gradient-to-r dark:from-[#0A0F2C]/80 dark:to-[#0A0E1F]/80 bg-gradient-to-r from-slate-50/80 to-white/80">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center dark:text-white text-slate-800">
                            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                            Upcoming Tasks
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400 text-slate-600">
                            You have {upcomingTasks.length} {upcomingTasks.length === 1 ? 'task' : 'tasks'} scheduled ahead
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30">
                        {upcomingTasks.length} Upcoming
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {upcomingTasks.map((task, index) => {
                        const skills = task.skills || [];
                        const learningObjectives = task.learningObjectives || [];
                        const dueDate = formatFirebaseDate(task.dueDate);
                        const daysUntilDue = getDaysUntilDue(task.dueDate);
                        const urgencyInfo = getUrgencyInfo(daysUntilDue);
                        const assignee = getAssigneeInfo(task);

                        return (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="border dark:border-slate-700/30 border-slate-200/70 rounded-xl overflow-hidden backdrop-blur-sm dark:bg-slate-800/20 bg-slate-50/50 hover:shadow-lg transition-all group"
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center flex-wrap gap-2 mb-3">
                                                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-sm">
                                                    Week {task.week || '?'}
                                                </Badge>
                                                {task.taskType && (
                                                    <Badge variant="outline" className="dark:bg-slate-800/50 bg-white/70 dark:text-slate-300 text-slate-600 capitalize">
                                                        {task.taskType}
                                                    </Badge>
                                                )}
                                                {task.priority && (
                                                    <Badge variant="outline" className={`${getPriorityColors(task.priority)} capitalize`}>
                                                        {task.priority}
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-lg dark:text-white text-slate-900 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {task.title}
                                            </h3>
                                            <p className="text-sm dark:text-slate-400 text-slate-600 line-clamp-2 leading-relaxed">
                                                {task.description || 'No description provided'}
                                            </p>
                                        </div>
                                        <div className={`ml-4 px-3 py-2 rounded-lg ${urgencyInfo.bgColor} ${urgencyInfo.borderColor} border`}>
                                            <div className="flex items-center">
                                                {urgencyInfo.icon}
                                                <span className={`ml-1.5 text-sm font-medium ${urgencyInfo.color}`}>
                                                    {urgencyInfo.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assignee info */}
                                    {task.assigneeDetails && (
                                        <div className="flex items-center mb-4 text-sm">
                                            <User className="h-4 w-4 mr-1.5 dark:text-slate-400 text-slate-500" />
                                            <span className="dark:text-slate-400 text-slate-500 mr-2">Assigned to:</span>
                                            <div className="flex items-center">
                                                <Avatar className="h-5 w-5 mr-2">
                                                    <AvatarImage src={assignee.avatar} />
                                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xs">
                                                        {assignee.initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="dark:text-slate-300 text-slate-700 font-medium">{assignee.name}</span>
                                                <Badge variant="outline" className="ml-2 text-xs dark:bg-slate-800/50 bg-white/70">
                                                    {assignee.role}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}

                                    {/* Skills and Learning Objectives */}
                                    {(skills.length > 0 || learningObjectives.length > 0) && (
                                        <div className="space-y-3 mb-4">
                                            {skills.length > 0 && (
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <Target className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                                                        <span className="text-xs dark:text-slate-400 text-slate-500 font-medium">Skills:</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {skills.slice(0, 4).map((skill, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                        {skills.length > 4 && (
                                                            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30">
                                                                +{skills.length - 4} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {learningObjectives.length > 0 && (
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <Zap className="h-4 w-4 mr-1.5 text-yellow-500 dark:text-yellow-400" />
                                                        <span className="text-xs dark:text-slate-400 text-slate-500 font-medium">Learning Objectives:</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {learningObjectives.slice(0, 3).map((objective, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30">
                                                                {objective}
                                                            </Badge>
                                                        ))}
                                                        {learningObjectives.length > 3 && (
                                                            <Badge variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30">
                                                                +{learningObjectives.length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t dark:border-slate-700/30 border-slate-200/70">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center dark:text-slate-400 text-slate-500">
                                                <CalendarCheck className="h-4 w-4 mr-1.5" />
                                                <span>Due: {dueDate}</span>
                                            </div>
                                            <div className={`flex items-center ${urgencyInfo.color}`}>
                                                <Clock className="h-4 w-4 mr-1.5" />
                                                <span className="font-medium">
                                                    {daysUntilDue === 0 ? 'Due today' :
                                                        daysUntilDue === 1 ? 'Due tomorrow' :
                                                            `${daysUntilDue} days left`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" asChild className="dark:hover:bg-slate-700/50 hover:bg-slate-100/70 dark:text-slate-300 text-slate-700">
                                                <Link href={`/dashboard/tasks/${task.id}`}>
                                                    <Eye className="h-4 w-4 mr-1.5" />
                                                    Preview
                                                </Link>
                                            </Button>
                                            <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm">
                                                <Link href={`/dashboard/tasks/${task.id}/start`}>
                                                    <Play className="h-4 w-4 mr-1.5" />
                                                    Start Task
                                                    <ArrowRight className="h-4 w-4 ml-1.5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}