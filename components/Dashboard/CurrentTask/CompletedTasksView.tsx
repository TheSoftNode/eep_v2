"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Eye, CheckCircle, Award, Clock, User } from 'lucide-react';
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
import { format, parseISO } from 'date-fns';
import { UnifiedTask, FirebaseDate } from '@/Redux/types/Projects';

// Updated interface with proper typing
export interface CompletedTasksViewProps {
    completedTasks: UnifiedTask[];
    handleTaskSelect: (task: UnifiedTask) => void;
    isLoading: boolean;
}

export default function CompletedTasksView({ completedTasks, handleTaskSelect, isLoading }: CompletedTasksViewProps) {
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

    // Get user initials for avatar fallback
    const getUserInitials = (name: string): string => {
        if (!name) return '??';
        return name.split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Get assignee info with proper typing
    const getAssigneeInfo = (task: UnifiedTask) => {
        if (task.assigneeDetails && task.assigneeDetails.name) {
            return {
                name: task.assigneeDetails.name,
                avatar: task.assigneeDetails.profilePicture || '',
                initials: getUserInitials(task.assigneeDetails.name),
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

    // Get priority color scheme
    const getPriorityColors = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
            case 'high':
                return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30';
            case 'low':
                return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        }
    };

    // Get grade color based on score
    const getGradeColors = (grade: number) => {
        if (grade >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30';
        if (grade >= 80) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30';
        if (grade >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30';
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
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
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-5 w-48 mb-2 dark:bg-slate-700/40 bg-slate-200/70" />
                                    <Skeleton className="h-6 w-24 dark:bg-slate-700/40 bg-slate-200/70" />
                                </div>
                                <div className="flex justify-between mt-4">
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

    if (completedTasks.length === 0) {
        return (
            <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl text-center py-8">
                <CardContent className="p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center"
                    >
                        <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2 dark:text-white text-slate-800">No Completed Tasks</h3>
                    <p className="dark:text-slate-400 text-slate-500">You haven't completed any tasks yet. Keep working on your current tasks!</p>
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
                            <Award className="h-5 w-5 mr-2 text-green-500" />
                            Completed Tasks
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400 text-slate-600">
                            You've completed {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'} in this project
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30">
                        {completedTasks.length} Completed
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {completedTasks.map((task, index) => {
                        const assignee = getAssigneeInfo(task);
                        const submissionDate = task.submissionDate ? formatFirebaseDate(task.submissionDate) : null;
                        const completedDate = task.completedAt ? formatFirebaseDate(task.completedAt) : null;
                        const displayDate = completedDate || submissionDate || 'Unknown date';

                        return (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="border border-green-200/70 dark:border-green-800/30 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/5 rounded-xl overflow-hidden backdrop-blur-sm"
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center flex-wrap gap-2 mb-2">
                                                <h3 className="font-semibold dark:text-white text-slate-900 text-lg">
                                                    {task.week ? `Week ${task.week}: ` : ''}{task.title}
                                                </h3>
                                                {task.taskType && (
                                                    <Badge variant="outline" className="text-xs dark:bg-slate-800/50 bg-white/70 dark:text-slate-300 text-slate-600">
                                                        {task.taskType}
                                                    </Badge>
                                                )}
                                            </div>
                                            {task.description && (
                                                <p className="text-sm dark:text-slate-400 text-slate-600 line-clamp-2 mb-3">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            {task.grade !== undefined && task.grade !== null && (
                                                <Badge className={`${getGradeColors(task.grade)} font-semibold`}>
                                                    <Award className="h-3 w-3 mr-1" />
                                                    {task.grade}%
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className="bg-green-50/70 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Completed
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Task metadata */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center dark:text-slate-400 text-slate-500">
                                                <CalendarCheck className="h-4 w-4 mr-1.5" />
                                                <span>Completed: {displayDate}</span>
                                            </div>
                                            {task.actualHours && (
                                                <div className="flex items-center dark:text-slate-400 text-slate-500">
                                                    <Clock className="h-4 w-4 mr-1.5" />
                                                    <span>{task.actualHours}h spent</span>
                                                </div>
                                            )}
                                            {task.priority && (
                                                <Badge variant="outline" className={`text-xs ${getPriorityColors(task.priority)}`}>
                                                    {task.priority}
                                                </Badge>
                                            )}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleTaskSelect(task)}
                                            className="dark:hover:bg-slate-700/50 hover:bg-slate-100/70 dark:text-slate-300 text-slate-700"
                                        >
                                            <Eye className="h-4 w-4 mr-1.5" />
                                            View Details
                                        </Button>
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

                                    {/* Feedback section */}
                                    {task.feedback && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-4 p-4 dark:bg-slate-800/30 bg-white/70 rounded-lg border dark:border-slate-700/30 border-slate-200/70 backdrop-blur-sm"
                                        >
                                            <div className="flex items-start">
                                                <div className="mr-3 mt-0.5">
                                                    <Avatar className="h-7 w-7">
                                                        <AvatarImage src={assignee.avatar} />
                                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs">
                                                            {assignee.initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center mb-1">
                                                        <p className="text-xs dark:text-slate-400 text-slate-500">
                                                            Feedback from {assignee.name}
                                                        </p>
                                                        {task.grade !== undefined && task.maxGrade && (
                                                            <Badge variant="outline" className="ml-2 text-xs">
                                                                {task.grade}/{task.maxGrade}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed">
                                                        {task.feedback}
                                                    </p>
                                                    {task.gradingNotes && (
                                                        <p className="text-xs dark:text-slate-400 text-slate-500 mt-2 italic">
                                                            {task.gradingNotes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Skills and learning objectives */}
                                    {(task.skills?.length || task.learningObjectives?.length) && (
                                        <div className="mt-4 space-y-2">
                                            {task.skills && task.skills.length > 0 && (
                                                <div>
                                                    <p className="text-xs dark:text-slate-400 text-slate-500 mb-1">Skills:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {task.skills.map((skill, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs dark:bg-blue-900/20 bg-blue-50 dark:text-blue-400 text-blue-600 dark:border-blue-800/30 border-blue-200">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {task.learningObjectives && task.learningObjectives.length > 0 && (
                                                <div>
                                                    <p className="text-xs dark:text-slate-400 text-slate-500 mb-1">Learning Objectives:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {task.learningObjectives.map((objective, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs dark:bg-purple-900/20 bg-purple-50 dark:text-purple-400 text-purple-600 dark:border-purple-800/30 border-purple-200">
                                                                {objective}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}