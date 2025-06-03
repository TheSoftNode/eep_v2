"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    CalendarCheck,
    MessageCircle,
    Terminal,
    Code,
    Download,
    Upload,
    FileText,
    Video,
    FileCode,
    BookOpen,
    Clock,
    User,
    Target,
    Zap,
    ArrowRight,
    Play,
    AlertCircle
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, differenceInDays } from 'date-fns';
import { UnifiedTask, FirebaseDate, TaskResource } from '@/Redux/types/Projects';

// Updated interface with proper typing
export interface CurrentTaskViewProps {
    activeTask: UnifiedTask | null;
    upcomingTasks: UnifiedTask[];
    handleTaskSelect: (task: UnifiedTask) => void;
    handleDownloadResource: (resource: TaskResource) => void;
    isLoading: boolean;
}

export default function CurrentTaskView({
    activeTask,
    upcomingTasks,
    handleTaskSelect,
    handleDownloadResource,
    isLoading
}: CurrentTaskViewProps) {
    // Helper function to format Firebase date
    const formatFirebaseDate = (date: FirebaseDate | string | undefined, formatStr: string = 'MMM d, yyyy'): string => {
        if (!date) return '';

        try {
            // Handle Firestore timestamp with _seconds
            if (typeof date === 'object' && '_seconds' in date) {
                return format(new Date(date._seconds * 1000), formatStr);
            }

            // Handle string date
            if (typeof date === 'string') {
                return format(parseISO(date), formatStr);
            }

            // Handle Date object
            if (date instanceof Date) {
                return format(date, formatStr);
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
    const getAssigneeInfo = () => {
        if (!activeTask) return { name: 'Unassigned', avatar: '', initials: 'UN', role: 'Member' };

        if (activeTask.assigneeDetails) {
            return {
                name: activeTask.assigneeDetails.name || 'Unassigned',
                avatar: activeTask.assigneeDetails.profilePicture || '',
                initials: getUserInitials(activeTask.assigneeDetails.name || 'Unassigned'),
                role: activeTask.assigneeDetails.role || 'Member'
            };
        }

        return { name: 'Unassigned', avatar: '', initials: 'UN', role: 'Member' };
    };

    // Get priority colors
    const getPriorityColors = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'from-red-500 to-red-600 text-white';
            case 'high':
                return 'from-orange-500 to-orange-600 text-white';
            case 'medium':
                return 'from-yellow-500 to-yellow-600 text-white';
            case 'low':
                return 'from-blue-500 to-blue-600 text-white';
            default:
                return 'from-slate-500 to-slate-600 text-white';
        }
    };

    // Get urgency info based on days remaining
    const getUrgencyInfo = (daysRemaining: number) => {
        if (daysRemaining === 0) {
            return { text: 'Due today!', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-red-200 dark:border-red-800/30' };
        } else if (daysRemaining === 1) {
            return { text: 'Due tomorrow', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800/30' };
        } else if (daysRemaining <= 3) {
            return { text: `${daysRemaining} days left`, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', borderColor: 'border-yellow-200 dark:border-yellow-800/30' };
        } else {
            return { text: `${daysRemaining} days left`, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-800/30' };
        }
    };

    // Get resource icon based on type
    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return <FileText className="h-5 w-5 text-red-500 dark:text-red-400" />;
            case 'video':
                return <Video className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
            case 'article':
                return <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
            case 'code':
                return <FileCode className="h-5 w-5 text-green-500 dark:text-green-400" />;
            default:
                return <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
        }
    };

    if (isLoading) {
        return (
            <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl border-t-4 border-t-indigo-500 dark:border-t-indigo-400">
                <CardHeader className="border-b dark:border-slate-700/30 border-slate-200/70 dark:bg-gradient-to-r dark:from-[#0A0F2C]/80 dark:to-[#0A0E1F]/80 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 pb-6">
                    <Skeleton className="h-5 w-24 mb-2 dark:bg-slate-700/40 bg-slate-200/70" />
                    <Skeleton className="h-8 w-64 mb-2 dark:bg-slate-700/40 bg-slate-200/70" />
                    <Skeleton className="h-4 w-full dark:bg-slate-700/40 bg-slate-200/70" />
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="p-4 rounded-lg dark:bg-slate-800/20 bg-slate-50/50 border dark:border-slate-700/30 border-slate-200/70">
                                <Skeleton className="h-4 w-24 mb-2 dark:bg-slate-700/40 bg-slate-200/70" />
                                <Skeleton className="h-5 w-36 mb-1 dark:bg-slate-700/40 bg-slate-200/70" />
                                <Skeleton className="h-4 w-20 dark:bg-slate-700/40 bg-slate-200/70" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!activeTask) {
        return (
            <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl text-center py-8 border-t-4 border-t-indigo-500 dark:border-t-indigo-400">
                <CardContent className="p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center"
                    >
                        <FileText className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
                    </motion.div>
                    <h3 className="font-semibold text-xl mb-3 dark:text-white text-slate-800">No Active Task</h3>
                    <p className="dark:text-slate-400 text-slate-600 mb-6 max-w-md mx-auto">
                        You don't have any tasks currently in progress. Ready to start your next challenge?
                    </p>
                    {upcomingTasks.length > 0 && (
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg" asChild>
                            <Link href={`/dashboard/tasks/${upcomingTasks[0]?.id}`}>
                                <Play className="h-4 w-4 mr-2" />
                                Start Next Task
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    const assignee = getAssigneeInfo();
    const resources = activeTask.resources || [];
    const skills = activeTask.skills || [];
    const learningObjectives = activeTask.learningObjectives || [];
    const formattedDueDate = formatFirebaseDate(activeTask.dueDate, 'MMMM d, yyyy');
    const daysRemaining = getDaysRemaining(activeTask.dueDate);
    const urgencyInfo = getUrgencyInfo(daysRemaining);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl overflow-hidden border-t-4 border-t-indigo-500 dark:border-t-indigo-400">
                <CardHeader className="dark:bg-gradient-to-r dark:from-[#0A0F2C]/80 dark:to-[#0A0E1F]/80 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 pb-6 border-b dark:border-slate-700/30 border-slate-200/70">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                                <Badge className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-none shadow-sm">
                                    Week {activeTask.week || '?'}
                                </Badge>
                                {activeTask.taskType && (
                                    <Badge variant="outline" className="dark:bg-slate-800/50 bg-white/70 dark:text-slate-300 text-slate-600 capitalize">
                                        {activeTask.taskType}
                                    </Badge>
                                )}
                                {activeTask.priority && (
                                    <Badge className={`bg-gradient-to-r ${getPriorityColors(activeTask.priority)} border-none shadow-sm capitalize`}>
                                        {activeTask.priority}
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-2xl dark:text-white text-slate-800 mb-2">{activeTask.title}</CardTitle>
                            <CardDescription className="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
                                {activeTask.description}
                            </CardDescription>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-2">
                            <div className={`${urgencyInfo.bgColor} ${urgencyInfo.borderColor} border px-3 py-2 rounded-lg backdrop-blur-sm`}>
                                <div className="flex items-center">
                                    {daysRemaining <= 1 && <AlertCircle className="h-4 w-4 mr-1.5 text-red-500" />}
                                    <span className={`text-sm font-medium ${urgencyInfo.color}`}>
                                        {urgencyInfo.text}
                                    </span>
                                </div>
                            </div>
                            {activeTask.progress !== undefined && (
                                <div className="text-right">
                                    <div className="text-xs dark:text-slate-400 text-slate-500 mb-1">Progress</div>
                                    <div className="flex items-center">
                                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mr-2">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                                style={{ width: `${activeTask.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium dark:text-slate-300 text-slate-700">
                                            {activeTask.progress}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Due Date Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/70 dark:border-blue-800/30 transition-all backdrop-blur-sm"
                        >
                            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">
                                <CalendarCheck className="h-4 w-4 mr-2" />
                                <span>Due Date</span>
                            </div>
                            <p className="font-semibold text-blue-900 dark:text-blue-100 text-lg">{formattedDueDate}</p>
                            <div className="flex items-center mt-2">
                                <Clock className="h-3 w-3 mr-1.5 text-blue-500 dark:text-blue-400" />
                                <span className={`text-sm font-medium ${urgencyInfo.color}`}>
                                    {urgencyInfo.text}
                                </span>
                            </div>
                        </motion.div>

                        {/* Assignee Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/70 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/70 dark:border-purple-800/30 transition-all backdrop-blur-sm"
                        >
                            <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 mb-2 font-medium">
                                <User className="h-4 w-4 mr-2" />
                                <span>Assigned To</span>
                            </div>
                            <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3 ring-2 ring-purple-200 dark:ring-purple-800/50">
                                    <AvatarImage src={assignee.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-sm">
                                        {assignee.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-purple-900 dark:text-purple-100">{assignee.name}</p>
                                    <p className="text-sm text-purple-600 dark:text-purple-400">{assignee.role}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Skills Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/70 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/70 dark:border-green-800/30 transition-all backdrop-blur-sm"
                        >
                            <div className="flex items-center text-sm text-green-600 dark:text-green-400 mb-2 font-medium">
                                <Target className="h-4 w-4 mr-2" />
                                <span>Skills ({skills.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.slice(0, 3).map((skill, index) => (
                                    <Badge key={index} variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50 text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                                {skills.length > 3 && (
                                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50 text-xs">
                                        +{skills.length - 3}
                                    </Badge>
                                )}
                                {skills.length === 0 && (
                                    <span className="text-sm text-green-600/70 dark:text-green-400/70">No skills specified</span>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Learning Objectives */}
                    {learningObjectives.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="dark:bg-slate-800/20 bg-slate-50/50 p-5 rounded-xl border dark:border-slate-700/30 border-slate-200/70 backdrop-blur-sm"
                        >
                            <h3 className="font-semibold dark:text-white text-slate-800 mb-3 flex items-center">
                                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                                Learning Objectives
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {learningObjectives.map((objective, index) => (
                                    <Badge key={index} variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30">
                                        {objective}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Task Resources */}
                    {resources.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="dark:bg-slate-800/20 bg-slate-50/50 p-5 rounded-xl border dark:border-slate-700/30 border-slate-200/70 backdrop-blur-sm"
                        >
                            <h3 className="font-semibold dark:text-white text-slate-800 mb-4 flex items-center">
                                <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                                Learning Resources ({resources.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {resources.map((resource, index) => (
                                    <motion.div
                                        key={resource.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center p-3 rounded-lg border dark:border-slate-700/30 border-slate-200/70 dark:hover:border-slate-600/50 hover:border-slate-300/70 dark:hover:bg-slate-700/20 hover:bg-slate-100/70 transition-all shadow-sm backdrop-blur-sm group"
                                    >
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                                            {getResourceIcon(resource.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium dark:text-white text-slate-900 truncate">{resource.title}</h4>
                                            <p className="text-xs dark:text-slate-400 text-slate-500 capitalize flex items-center mt-1">
                                                {getResourceIcon(resource.type)}
                                                <span className="ml-1">{resource.type}</span>
                                            </p>
                                            {resource.description && (
                                                <p className="text-xs dark:text-slate-400 text-slate-500 truncate mt-1">
                                                    {resource.description}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-600/50 hover:bg-slate-200/70"
                                            onClick={() => handleDownloadResource(resource)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </CardContent>

                {/* Task Actions */}
                <CardFooter className="flex flex-wrap justify-end gap-3 pt-6 pb-6 border-t dark:border-slate-700/30 border-slate-200/70 dark:bg-gradient-to-r dark:from-[#0A0F2C]/40 dark:to-[#0A0E1F]/40 bg-gradient-to-r from-slate-50/40 to-white/40">
                    <Button
                        variant="outline"
                        className="dark:border-slate-600 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700/50 hover:bg-slate-100/70 dark:hover:text-white hover:text-slate-900"
                        asChild
                    >
                        <Link href="/dashboard/mentors">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Ask Mentor
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="dark:border-slate-600 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700/50 hover:bg-slate-100/70 dark:hover:text-white hover:text-slate-900"
                        asChild
                    >
                        <Link href="/dashboard/terminal">
                            <Terminal className="h-4 w-4 mr-2" />
                            Terminal
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="dark:border-slate-600 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700/50 hover:bg-slate-100/70 dark:hover:text-white hover:text-slate-900"
                        asChild
                    >
                        <Link href="/dashboard/workspaces">
                            <Code className="h-4 w-4 mr-2" />
                            Workspace
                        </Link>
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                        onClick={() => handleTaskSelect(activeTask)}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Task
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}