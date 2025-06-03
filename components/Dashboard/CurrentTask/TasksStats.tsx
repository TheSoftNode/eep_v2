"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    Info,
    Award,
    CalendarCheck,
    TrendingUp,
    AlertTriangle,
    Target,
    Zap
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, differenceInDays } from 'date-fns';
import { UnifiedTask, FirebaseDate } from '@/Redux/types/Projects';

export interface TasksStatsProps {
    progressPercentage: number;
    currentWeek: number;
    completedTasksCount: number;
    totalTasksCount: number;
    activeTask: UnifiedTask | null;
    isLoading: boolean;
}

export default function TasksStats({
    progressPercentage,
    currentWeek,
    completedTasksCount,
    totalTasksCount,
    activeTask,
    isLoading
}: TasksStatsProps) {
    // Helper function to format Firebase date
    const formatFirebaseDate = (date: FirebaseDate | string | undefined): string => {
        if (!date) return '';

        try {
            // Handle Firestore timestamp with _seconds
            if (typeof date === 'object' && '_seconds' in date) {
                return format(new Date(date._seconds * 1000), 'MMM d');
            }

            // Handle string date
            if (typeof date === 'string') {
                return format(parseISO(date), 'MMM d');
            }

            // Handle Date object
            if (date instanceof Date) {
                return format(date, 'MMM d');
            }

            return '';
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // Calculate days remaining until due date
    const getDaysRemaining = (dueDate: FirebaseDate | string | undefined): number => {
        if (!dueDate) return 0;

        try {
            let dueDateObj: Date;

            // Handle Firestore timestamp
            if (typeof dueDate === 'object' && '_seconds' in dueDate) {
                dueDateObj = new Date(dueDate._seconds * 1000);
            }
            // Handle string date
            else if (typeof dueDate === 'string') {
                dueDateObj = parseISO(dueDate);
            }
            // Handle Date object
            else if (dueDate instanceof Date) {
                dueDateObj = dueDate;
            }
            else {
                return 0;
            }

            return Math.max(0, differenceInDays(dueDateObj, new Date()));
        } catch (error) {
            console.error('Error calculating days remaining:', error);
            return 0;
        }
    };

    // Get progress color and theme based on percentage
    const getProgressTheme = (percentage: number) => {
        if (percentage < 25) return {
            color: 'bg-gradient-to-r from-blue-500 to-blue-600',
            bgColor: 'from-blue-50/70 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10',
            textColor: 'text-blue-900 dark:text-blue-100',
            accentColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'border-l-blue-500',
            badgeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/30'
        };
        if (percentage < 50) return {
            color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
            bgColor: 'from-indigo-50/70 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10',
            textColor: 'text-indigo-900 dark:text-indigo-100',
            accentColor: 'text-indigo-600 dark:text-indigo-400',
            borderColor: 'border-l-indigo-500',
            badgeColor: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30'
        };
        if (percentage < 75) return {
            color: 'bg-gradient-to-r from-purple-500 to-purple-600',
            bgColor: 'from-purple-50/70 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10',
            textColor: 'text-purple-900 dark:text-purple-100',
            accentColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-l-purple-500',
            badgeColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/30'
        };
        return {
            color: 'bg-gradient-to-r from-green-500 to-green-600',
            bgColor: 'from-green-50/70 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10',
            textColor: 'text-green-900 dark:text-green-100',
            accentColor: 'text-green-600 dark:text-green-400',
            borderColor: 'border-l-green-500',
            badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30'
        };
    };

    // Get status badge styling
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30';
            case 'in-progress':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/30';
            case 'submitted':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30';
            case 'overdue':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/30';
            default:
                return 'bg-slate-100 dark:bg-slate-800/30 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700/30';
        }
    };

    // Get urgency styling based on days remaining
    const getUrgencyTheme = (days: number) => {
        if (days <= 1) return {
            bgColor: 'bg-red-100 dark:bg-red-900/20',
            textColor: 'text-red-700 dark:text-red-300',
            iconColor: 'text-red-600 dark:text-red-400',
            message: days === 0 ? 'Due today!' : 'Due tomorrow'
        };
        if (days <= 3) return {
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
            textColor: 'text-orange-700 dark:text-orange-300',
            iconColor: 'text-orange-600 dark:text-orange-400',
            message: `${days} days left`
        };
        if (days <= 7) return {
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
            textColor: 'text-yellow-700 dark:text-yellow-300',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            message: `${days} days left`
        };
        return {
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
            textColor: 'text-purple-700 dark:text-purple-300',
            iconColor: 'text-purple-600 dark:text-purple-400',
            message: `${days} days left`
        };
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((index) => (
                    <Card key={index} className="backdrop-blur-sm dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 shadow-sm">
                        <CardHeader className="pb-3">
                            <Skeleton className="h-5 w-32 dark:bg-slate-700/40 bg-slate-200/70" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-3">
                                <Skeleton className="h-8 w-16 dark:bg-slate-700/40 bg-slate-200/70" />
                                <Skeleton className="h-6 w-24 dark:bg-slate-700/40 bg-slate-200/70" />
                            </div>
                            <Skeleton className="h-2 w-full dark:bg-slate-700/40 bg-slate-200/70" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const progressTheme = getProgressTheme(progressPercentage);
    const daysRemaining = activeTask ? getDaysRemaining(activeTask.dueDate) : 0;
    const urgencyTheme = getUrgencyTheme(daysRemaining);
    const completionRate = totalTasksCount > 0 ? ((completedTasksCount / totalTasksCount) * 100) : 0;

    const cards = [
        {
            id: 'progress',
            title: 'Overall Progress',
            icon: <Award className="h-5 w-5" />,
            content: (
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-3xl font-bold dark:text-white text-slate-800">{progressPercentage}%</span>
                        <Badge variant="outline" className={progressTheme.badgeColor}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Week {currentWeek}
                        </Badge>
                    </div>
                    <div className="relative">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${progressTheme.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <div className="flex justify-between text-xs dark:text-slate-400 text-slate-500 mt-1">
                            <span>Started</span>
                            <span>{progressPercentage >= 100 ? 'Complete!' : 'In Progress'}</span>
                        </div>
                    </div>
                </div>
            ),
            theme: progressTheme
        },
        {
            id: 'completed',
            title: 'Completed Tasks',
            icon: <CheckCircle2 className="h-5 w-5" />,
            content: (
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-3xl font-bold text-green-900 dark:text-green-100">{completedTasksCount}</span>
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {completionRate.toFixed(0)}%
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">Out of {totalTasksCount} total</span>
                        <div className="flex items-center">
                            <Target className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
                            <span className="text-green-700 dark:text-green-300 font-medium">
                                {totalTasksCount - completedTasksCount} remaining
                            </span>
                        </div>
                    </div>
                </div>
            ),
            theme: {
                bgColor: 'from-green-50/70 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10',
                borderColor: 'border-l-green-500',
                accentColor: 'text-green-600 dark:text-green-400'
            }
        },
        {
            id: 'current',
            title: 'Current Task',
            icon: <Zap className="h-5 w-5" />,
            content: (
                <div>
                    {activeTask ? (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/30">
                                    Week {activeTask.week || '?'}
                                </Badge>
                                <Badge variant="outline" className={getStatusBadge(activeTask.status)}>
                                    {activeTask.status.replace('-', ' ')}
                                </Badge>
                            </div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg mb-2 line-clamp-2">
                                {activeTask.title}
                            </h3>
                            {activeTask.priority && (
                                <div className="flex items-center">
                                    <span className="text-xs dark:text-slate-400 text-slate-500 mr-2">Priority:</span>
                                    <Badge
                                        variant="outline"
                                        className={
                                            activeTask.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/30' :
                                                activeTask.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/30' :
                                                    activeTask.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30' :
                                                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/30'
                                        }
                                    >
                                        {activeTask.priority}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <Info className="h-8 w-8 text-blue-400 dark:text-blue-500 mx-auto mb-2" />
                            <p className="text-blue-600 dark:text-blue-400 font-medium">No active task</p>
                            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">All caught up!</p>
                        </div>
                    )}
                </div>
            ),
            theme: {
                bgColor: 'from-blue-50/70 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10',
                borderColor: 'border-l-blue-500',
                accentColor: 'text-blue-600 dark:text-blue-400'
            }
        },
        {
            id: 'deadline',
            title: 'Next Deadline',
            icon: <CalendarCheck className="h-5 w-5" />,
            content: (
                <div>
                    {activeTask ? (
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {formatFirebaseDate(activeTask.dueDate) || 'No date'}
                                </span>
                                <div className={`p-2 rounded-full ${urgencyTheme.bgColor}`}>
                                    {daysRemaining <= 1 ?
                                        <AlertTriangle className={`h-5 w-5 ${urgencyTheme.iconColor}`} /> :
                                        <Clock className={`h-5 w-5 ${urgencyTheme.iconColor}`} />
                                    }
                                </div>
                            </div>
                            <div className={`flex items-center justify-between p-2 rounded-lg ${urgencyTheme.bgColor}`}>
                                <div className="flex items-center">
                                    <Clock className={`h-4 w-4 mr-2 ${urgencyTheme.iconColor}`} />
                                    <span className={`text-sm font-medium ${urgencyTheme.textColor}`}>
                                        {urgencyTheme.message}
                                    </span>
                                </div>
                                {daysRemaining <= 3 && (
                                    <Badge variant="outline" className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/30">
                                        Urgent
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <CalendarCheck className="h-8 w-8 text-purple-400 dark:text-purple-500 mx-auto mb-2" />
                            <p className="text-purple-600 dark:text-purple-400 font-medium">No upcoming deadline</p>
                            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">You're all set!</p>
                        </div>
                    )}
                </div>
            ),
            theme: {
                bgColor: 'from-purple-50/70 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10',
                borderColor: 'border-l-purple-500',
                accentColor: 'text-purple-600 dark:text-purple-400'
            }
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, index) => (
                <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card className={`backdrop-blur-sm dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 shadow-lg hover:shadow-xl transition-all border-l-4 ${card.theme.borderColor} overflow-hidden group`}>
                        <CardHeader className={`pb-3 bg-gradient-to-r ${card.theme.bgColor} backdrop-blur-sm group-hover:from-opacity-80`}>
                            <CardTitle className={`text-sm font-semibold flex items-center ${card.theme.accentColor}`}>
                                {card.icon}
                                <span className="ml-2">{card.title}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {card.content}
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}