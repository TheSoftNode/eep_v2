"use client"

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Upload,
    Download,
    FileText,
    BookOpen,
    Flag,
    User,
    ExternalLink,
    Calendar as CalendarIcon,
    MessageCircle,
    Target,
    Zap,
    Award,
    Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format, parseISO, differenceInDays } from 'date-fns';
import { UnifiedTask, FirebaseDate, TaskResource } from '@/Redux/types/Projects';

// Define priority colors with dark mode support
const priorityColors = {
    low: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-orange-600 dark:text-orange-400',
    critical: 'text-red-600 dark:text-red-400'
};

// Status configuration with dark mode support
const statusConfig = {
    todo: {
        icon: <Clock className="h-4 w-4" />,
        bg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/30',
        text: 'text-indigo-800 dark:text-indigo-300',
        headerBg: 'border-indigo-200 dark:border-indigo-800/30 bg-gradient-to-r from-indigo-50/80 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10',
        progress: 'bg-indigo-600',
        color: 'indigo'
    },
    upcoming: {
        icon: <CalendarIcon className="h-4 w-4" />,
        bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30',
        text: 'text-purple-800 dark:text-purple-300',
        headerBg: 'border-purple-200 dark:border-purple-800/30 bg-gradient-to-r from-purple-50/80 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10',
        progress: 'bg-purple-600',
        color: 'purple'
    },
    'in-progress': {
        icon: <Play className="h-4 w-4" />,
        bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30',
        text: 'text-blue-800 dark:text-blue-300',
        headerBg: 'border-blue-200 dark:border-blue-800/30 bg-gradient-to-r from-blue-50/80 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10',
        progress: 'bg-blue-600',
        color: 'blue'
    },
    submitted: {
        icon: <Upload className="h-4 w-4" />,
        bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        headerBg: 'border-yellow-200 dark:border-yellow-800/30 bg-gradient-to-r from-yellow-50/80 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10',
        progress: 'bg-yellow-600',
        color: 'yellow'
    },
    completed: {
        icon: <CheckCircle className="h-4 w-4" />,
        bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30',
        text: 'text-green-800 dark:text-green-300',
        headerBg: 'border-green-200 dark:border-green-800/30 bg-gradient-to-r from-green-50/80 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10',
        progress: 'bg-green-600',
        color: 'green'
    },
    blocked: {
        icon: <XCircle className="h-4 w-4" />,
        bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30',
        text: 'text-red-800 dark:text-red-300',
        headerBg: 'border-red-200 dark:border-red-800/30 bg-gradient-to-r from-red-50/80 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10',
        progress: 'bg-red-600',
        color: 'red'
    },
    overdue: {
        icon: <AlertCircle className="h-4 w-4" />,
        bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/30',
        text: 'text-orange-800 dark:text-orange-300',
        headerBg: 'border-orange-200 dark:border-orange-800/30 bg-gradient-to-r from-orange-50/80 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10',
        progress: 'bg-orange-600',
        color: 'orange'
    }
};

interface TaskDetailSidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedTask: UnifiedTask | null;
    submissionComment: string;
    setSubmissionComment: (comment: string) => void;
    uploadedFiles: File[];
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFile: (index: number) => void;
    isSubmitting: boolean;
    handleSubmitTask: () => void;
    handleDownloadResource: (resource: TaskResource) => void;
}

export default function TaskDetailSidebar({
    open,
    setOpen,
    selectedTask,
    submissionComment,
    setSubmissionComment,
    uploadedFiles,
    handleFileUpload,
    handleRemoveFile,
    isSubmitting,
    handleSubmitTask,
    handleDownloadResource
}: TaskDetailSidebarProps) {
    if (!selectedTask) return null;

    // Helper function to format Firebase date
    const formatFirebaseDate = (date: FirebaseDate | string | undefined): string => {
        if (!date) return 'No due date';

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

            return String(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
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
        if (selectedTask.assigneeDetails) {
            return {
                name: selectedTask.assigneeDetails.name || 'Unassigned',
                avatar: selectedTask.assigneeDetails.profilePicture || '',
                initials: getUserInitials(selectedTask.assigneeDetails.name || 'Unassigned'),
                role: selectedTask.assigneeDetails.role || 'Member'
            };
        }

        return {
            name: 'Unassigned',
            avatar: '',
            initials: 'UN',
            role: 'Member'
        };
    };

    // Format submission files with proper typing
    const getSubmissionFiles = () => {
        if (!selectedTask.submission?.attachments) return [];

        return selectedTask.submission.attachments.map(file => ({
            id: file.id || `file-${Math.random().toString(36).substring(2, 9)}`,
            name: file.fileName || 'Untitled File',
            size: file.fileSize ? `${(file.fileSize / 1024).toFixed(1)} KB` : 'Unknown size',
            url: file.url || '#'
        }));
    };

    // Calculate task progress
    const getTaskProgress = (): number => {
        if (selectedTask.progress !== undefined) return selectedTask.progress;

        // Default progress based on status
        switch (selectedTask.status) {
            case 'completed': return 100;
            case 'submitted': return 90;
            case 'in-progress': return 50;
            case 'overdue': return 40;
            default: return 0;
        }
    };

    // Calculate days remaining until due date
    const getDaysRemaining = (dueDate: FirebaseDate | string | undefined): { days: number, isOverdue: boolean } => {
        if (!dueDate) return { days: 0, isOverdue: false };

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
                return { days: 0, isOverdue: false };
            }

            const diffDays = differenceInDays(dueDateObj, new Date());
            return {
                days: Math.abs(diffDays),
                isOverdue: diffDays < 0
            };
        } catch (error) {
            console.error('Error calculating days remaining:', error);
            return { days: 0, isOverdue: false };
        }
    };

    // Get resource icon based on type
    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return <FileText className="h-5 w-5 text-red-500 dark:text-red-400" />;
            case 'video':
                return <Play className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
            case 'article':
                return <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
            case 'code':
                return <FileText className="h-5 w-5 text-green-500 dark:text-green-400" />;
            default:
                return <ExternalLink className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
        }
    };

    // Get grade color based on score
    const getGradeColors = (grade: number) => {
        if (grade >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30';
        if (grade >= 80) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30';
        if (grade >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30';
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
    };

    const resources = selectedTask.resources || [];
    const submissionFiles = getSubmissionFiles();
    const skills = selectedTask.skills || [];
    const learningObjectives = selectedTask.learningObjectives || [];
    const assignee = getAssigneeInfo();
    const formattedDueDate = formatFirebaseDate(selectedTask.dueDate);
    const submissionDate = selectedTask.submissionDate ? formatFirebaseDate(selectedTask.submissionDate) : '';
    const taskProgress = getTaskProgress();
    const { days: daysRemaining, isOverdue } = getDaysRemaining(selectedTask.dueDate);

    // Get status configuration
    const getStatusConfig = (status: string) => {
        return statusConfig[status as keyof typeof statusConfig] || {
            icon: <Clock className="h-4 w-4" />,
            bg: 'bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700/30',
            text: 'text-slate-700 dark:text-slate-300',
            headerBg: 'border-slate-200 dark:border-slate-700/30 bg-gradient-to-r from-slate-50/80 to-slate-100/50 dark:from-slate-800/20 dark:to-slate-700/10',
            progress: 'bg-slate-600',
            color: 'slate'
        };
    };

    const currentStatus = getStatusConfig(selectedTask.status);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="sm:max-w-lg w-full p-0 backdrop-blur-sm dark:bg-[#060f38]/95 bg-white/95 dark:border-slate-800/50 border-slate-200/70 shadow-2xl">
                <div className="h-full flex flex-col">
                    <SheetHeader className={cn(
                        "px-6 py-5 border-b backdrop-blur-sm",
                        currentStatus.headerBg
                    )}>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    {selectedTask.week && (
                                        <Badge
                                            variant="outline"
                                            className="bg-white/70 dark:bg-slate-800/50 text-indigo-700 dark:text-indigo-300 text-xs border-indigo-200 dark:border-indigo-800/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm"
                                        >
                                            Week {selectedTask.week}
                                        </Badge>
                                    )}
                                    {selectedTask.taskType && (
                                        <Badge
                                            variant="outline"
                                            className="bg-white/70 dark:bg-slate-800/50 dark:text-slate-300 text-slate-600 text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm capitalize"
                                        >
                                            {selectedTask.taskType}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedTask.priority && (
                                        <Flag className={cn(
                                            "h-4 w-4 flex-shrink-0",
                                            priorityColors[selectedTask.priority as keyof typeof priorityColors] || "text-yellow-600 dark:text-yellow-400"
                                        )} />
                                    )}
                                    <Badge
                                        className={cn(
                                            "text-xs font-medium rounded-full px-3 py-1 flex items-center gap-1.5 backdrop-blur-sm",
                                            currentStatus.bg,
                                            currentStatus.text
                                        )}
                                    >
                                        {currentStatus.icon}
                                        <span className="capitalize">
                                            {selectedTask.status.replace('-', ' ')}
                                        </span>
                                    </Badge>
                                </div>
                            </div>

                            <SheetTitle className="text-xl font-semibold dark:text-white text-slate-800 mt-2 leading-tight">
                                {selectedTask.title}
                            </SheetTitle>

                            <SheetDescription className="dark:text-slate-400 text-slate-600 mt-2 leading-relaxed">
                                {selectedTask.status === 'completed'
                                    ? 'Task completed successfully'
                                    : selectedTask.status === 'submitted'
                                        ? 'Your submission is under review'
                                        : selectedTask.status === 'overdue'
                                            ? 'This task is past due date'
                                            : 'Complete and submit this task'}
                            </SheetDescription>

                            <div className="mt-4 relative">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="dark:text-slate-400 text-slate-600">Progress</span>
                                    <span className="font-medium dark:text-slate-300 text-slate-700">{taskProgress}%</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        className={cn("h-2 rounded-full", `bg-${currentStatus.color}-500`)}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${taskProgress}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </SheetHeader>

                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-6">
                            {/* Task Info Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="p-4 rounded-xl dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 shadow-sm hover:shadow-md transition-all backdrop-blur-sm">
                                    <div className="flex items-center text-sm dark:text-slate-400 text-slate-600 mb-2 font-medium">
                                        {currentStatus.icon}
                                        <span className="ml-2">Status</span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-sm rounded-full px-3 py-1 backdrop-blur-sm",
                                            currentStatus.bg,
                                            currentStatus.text
                                        )}
                                    >
                                        {selectedTask.status.replace('-', ' ')}
                                    </Badge>
                                </div>

                                <div className="p-4 rounded-xl dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 shadow-sm hover:shadow-md transition-all backdrop-blur-sm">
                                    <div className="flex items-center text-sm dark:text-slate-400 text-slate-600 mb-2 font-medium">
                                        <CalendarIcon className="h-4 w-4 mr-2" />
                                        <span>Due Date</span>
                                    </div>
                                    <p className="font-medium dark:text-white text-slate-900 text-sm">{formattedDueDate}</p>
                                    {daysRemaining > 0 && (
                                        <p className={cn(
                                            "text-xs mt-1 font-medium",
                                            isOverdue ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                                        )}>
                                            {isOverdue
                                                ? `${daysRemaining} days overdue`
                                                : `${daysRemaining} days remaining`}
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Assignee Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/10 border border-indigo-200/70 dark:border-indigo-800/30 shadow-sm hover:shadow-md transition-all backdrop-blur-sm"
                            >
                                <div className="flex items-center text-sm text-indigo-700 dark:text-indigo-300 mb-3 font-medium">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>Assigned To</span>
                                </div>
                                <div className="flex items-center">
                                    <Avatar className="h-12 w-12 mr-3 border-2 border-indigo-200 dark:border-indigo-800/50">
                                        <AvatarImage src={assignee.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium">{assignee.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold dark:text-white text-slate-900">{assignee.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs dark:bg-slate-800/50 bg-white/70">
                                                {assignee.role}
                                            </Badge>
                                            <p className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                                                <MessageCircle className="h-3 w-3 mr-1" />
                                                Available
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Task Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <h3 className="text-sm font-medium dark:text-slate-400 text-slate-500 mb-3 flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    DESCRIPTION
                                </h3>
                                <div className="p-4 rounded-xl dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 shadow-sm backdrop-blur-sm">
                                    <p className="dark:text-slate-300 text-slate-700 leading-relaxed">
                                        {selectedTask.description || "No description provided for this task."}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Skills and Learning Objectives */}
                            {(skills.length > 0 || learningObjectives.length > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                    className="space-y-4"
                                >
                                    {skills.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium dark:text-slate-400 text-slate-500 mb-3 flex items-center">
                                                <Target className="h-4 w-4 mr-2" />
                                                SKILLS ({skills.length})
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30 rounded-full px-3 py-1 backdrop-blur-sm"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {learningObjectives.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium dark:text-slate-400 text-slate-500 mb-3 flex items-center">
                                                <Zap className="h-4 w-4 mr-2" />
                                                LEARNING OBJECTIVES ({learningObjectives.length})
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {learningObjectives.map((objective, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30 rounded-full px-3 py-1 backdrop-blur-sm"
                                                    >
                                                        {objective}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Task Resources */}
                            {resources.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                >
                                    <h3 className="text-sm font-medium dark:text-slate-400 text-slate-500 mb-3 flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        RESOURCES ({resources.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {resources.map((resource, index) => (
                                            <motion.div
                                                key={resource.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="flex items-center p-3 rounded-xl border dark:border-slate-700/30 border-slate-200/70 dark:bg-slate-800/20 bg-white/70 hover:shadow-md transition-all shadow-sm backdrop-blur-sm group"
                                            >
                                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                                                    {getResourceIcon(resource.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium dark:text-white text-slate-900 truncate">{resource.title}</h4>
                                                    <p className="text-xs dark:text-slate-400 text-slate-500 capitalize flex items-center mt-1">
                                                        <span className="mr-1">{resource.type}</span>
                                                        {resource.description && (
                                                            <>
                                                                <span className="mx-1">•</span>
                                                                <span className="truncate">{resource.description}</span>
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-700/50 hover:bg-slate-200/70"
                                                    onClick={() => handleDownloadResource(resource)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Task Submission - Completed or Submitted State */}
                            {(selectedTask.status === 'completed' || selectedTask.status === 'submitted') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                >
                                    <h3 className="text-sm font-medium dark:text-slate-400 text-slate-500 mb-3 flex items-center">
                                        <Upload className="h-4 w-4 mr-2" />
                                        YOUR SUBMISSION
                                    </h3>
                                    <div className={cn(
                                        "p-5 rounded-xl border shadow-sm backdrop-blur-sm",
                                        selectedTask.status === 'completed'
                                            ? "border-green-200 dark:border-green-800/30 bg-gradient-to-br from-green-50/70 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10"
                                            : "border-yellow-200 dark:border-yellow-800/30 bg-gradient-to-br from-yellow-50/70 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10"
                                    )}>
                                        {submissionFiles.length > 0 ? (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium dark:text-white text-slate-800 mb-3">Submitted Files</h4>
                                                <div className="space-y-2">
                                                    {submissionFiles.map((file) => (
                                                        <div key={file.id} className="flex items-center p-3 rounded-lg dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 shadow-sm hover:shadow-md transition-all backdrop-blur-sm">
                                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20 flex items-center justify-center mr-3">
                                                                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-medium text-sm dark:text-white text-slate-900 truncate">{file.name}</h5>
                                                                <p className="text-xs dark:text-slate-400 text-slate-500">{file.size}</p>
                                                            </div>
                                                            <Button variant="ghost" size="sm" className="dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-700/50 hover:bg-slate-200/70">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-4">
                                                <p className="text-sm dark:text-slate-400 text-slate-600">No files were attached to this submission.</p>
                                            </div>
                                        )}

                                        {selectedTask.submission?.content ? (
                                            <div>
                                                <h4 className="text-sm font-medium dark:text-white text-slate-800 mb-2">Submission Notes</h4>
                                                <p className="text-sm dark:text-slate-300 text-slate-700 p-3 dark:bg-slate-800/30 bg-white/70 rounded-lg border dark:border-slate-700/30 border-slate-200/70 shadow-sm backdrop-blur-sm leading-relaxed">
                                                    {selectedTask.submission.content}
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <h4 className="text-sm font-medium dark:text-white text-slate-800 mb-2">Submission Notes</h4>
                                                <p className="text-sm dark:text-slate-400 text-slate-500 italic">No notes provided with this submission.</p>
                                            </div>
                                        )}

                                        <div className="text-sm dark:text-slate-400 text-slate-600 mt-4 flex items-center">
                                            <Clock className="h-4 w-4 mr-2" />
                                            Submitted on {submissionDate || 'Unknown date'}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Task Submission Form - In Progress or Overdue State */}
                            {(selectedTask.status === 'in-progress' || selectedTask.status === 'overdue') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                >
                                    <h3 className="text-sm font-medium dark:text-slate-400 text-slate-500 mb-3 flex items-center">
                                        <Upload className="h-4 w-4 mr-2" />
                                        SUBMIT YOUR WORK
                                    </h3>
                                    <div className="space-y-4 border border-indigo-200 dark:border-indigo-800/30 rounded-xl p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/5 shadow-sm backdrop-blur-sm">
                                        <div className="p-6 border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 rounded-xl text-center dark:bg-slate-800/20 bg-white/70 hover:border-indigo-400 dark:hover:border-indigo-600/70 transition-colors backdrop-blur-sm">
                                            <Input
                                                type="file"
                                                className="hidden"
                                                id="file-upload"
                                                multiple
                                                onChange={handleFileUpload}
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="cursor-pointer flex flex-col items-center justify-center"
                                            >
                                                <Upload className="h-12 w-12 text-indigo-400 dark:text-indigo-500 mb-3" />
                                                <p className="text-base font-medium text-indigo-700 dark:text-indigo-300">Upload Files</p>
                                                <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">Drag & drop files or click to browse</p>
                                            </label>
                                        </div>

                                        <AnimatePresence>
                                            {uploadedFiles.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-2"
                                                >
                                                    <h4 className="text-sm font-medium dark:text-white text-slate-800">Selected Files</h4>
                                                    {uploadedFiles.map((file, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 10 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex items-center p-3 rounded-lg dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-indigo-200/70 shadow-sm backdrop-blur-sm"
                                                        >
                                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20 flex items-center justify-center mr-3">
                                                                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-medium text-sm dark:text-white text-slate-900 truncate">{file.name}</h5>
                                                                <p className="text-xs dark:text-slate-400 text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                onClick={() => handleRemoveFile(index)}
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div>
                                            <Label htmlFor="submission-notes" className="text-sm font-medium block mb-2 dark:text-white text-slate-800">
                                                Submission Notes
                                            </Label>
                                            <Textarea
                                                id="submission-notes"
                                                className="resize-none border-indigo-200 dark:border-indigo-800/30 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-indigo-200 dark:focus:ring-indigo-800/30 rounded-lg shadow-sm dark:bg-slate-800/30 bg-white/70 backdrop-blur-sm"
                                                placeholder="Add any notes about your submission..."
                                                rows={4}
                                                value={submissionComment}
                                                onChange={(e) => setSubmissionComment(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Mentor Feedback */}
                            {selectedTask.status === 'completed' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.7 }}
                                >
                                    <h3 className="text-sm font-medium dark:text-slate-400 text-slate-500 mb-3 flex items-center">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        MENTOR FEEDBACK
                                    </h3>
                                    <div className="p-5 rounded-xl border border-green-200 dark:border-green-800/30 bg-gradient-to-br from-green-50/70 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 backdrop-blur-sm">
                                        <div className="flex items-start">
                                            <Avatar className="h-12 w-12 mr-4">
                                                <AvatarImage src={assignee.avatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-medium">{assignee.initials}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold dark:text-white text-slate-900">{assignee.name}</h4>
                                                    {selectedTask.grade !== undefined && selectedTask.grade !== null ? (
                                                        <Badge className={`${getGradeColors(selectedTask.grade)} font-semibold`}>
                                                            <Award className="h-3 w-3 mr-1" />
                                                            {selectedTask.grade}%
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Approved
                                                        </Badge>
                                                    )}
                                                </div>
                                                {selectedTask.feedback ? (
                                                    <div className="dark:bg-slate-800/30 bg-white/70 rounded-lg border dark:border-slate-700/30 border-green-200/70 p-4 backdrop-blur-sm">
                                                        <p className="dark:text-slate-300 text-slate-700 leading-relaxed">
                                                            {selectedTask.feedback}
                                                        </p>
                                                        {selectedTask.gradingNotes && (
                                                            <p className="text-xs dark:text-slate-400 text-slate-500 mt-3 italic">
                                                                {selectedTask.gradingNotes}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="dark:text-slate-400 text-slate-600 italic p-4 dark:bg-slate-800/30 bg-white/70 rounded-lg border dark:border-slate-700/30 border-green-200/70 backdrop-blur-sm">
                                                        Great job on completing this task! Keep up the excellent work.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </ScrollArea>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                        className="p-6 border-t dark:border-slate-700/30 border-slate-200/70 dark:bg-gradient-to-r dark:from-[#0A0F2C]/40 dark:to-[#0A0E1F]/40 bg-gradient-to-r from-slate-50/40 to-white/40 backdrop-blur-sm"
                    >
                        {selectedTask.status === 'in-progress' || selectedTask.status === 'overdue' ? (
                            <div className="flex justify-end gap-3">
                                <SheetClose asChild>
                                    <Button variant="outline" className="dark:border-slate-600 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700/50 hover:bg-slate-100/70">
                                        Cancel
                                    </Button>
                                </SheetClose>
                                <Button
                                    onClick={handleSubmitTask}
                                    disabled={isSubmitting || uploadedFiles.length === 0}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Submit Task
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : selectedTask.status === 'submitted' ? (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>Waiting for review</span>
                                </div>
                                <SheetClose asChild>
                                    <Button variant="outline" className="dark:border-slate-600 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700/50 hover:bg-slate-100/70">
                                        Close
                                    </Button>
                                </SheetClose>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                {selectedTask.status === 'completed' && (
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="dark:border-purple-600 border-purple-300 dark:text-purple-300 text-purple-700 dark:hover:bg-purple-700/20 hover:bg-purple-50"
                                    >
                                        <Link href={`/dashboard/tasks/${selectedTask.id}/reflection`}>
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            Add Reflection
                                        </Link>
                                    </Button>
                                )}
                                <SheetClose asChild>
                                    <Button variant="outline" className="dark:border-slate-600 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700/50 hover:bg-slate-100/70">
                                        Close
                                    </Button>
                                </SheetClose>
                            </div>
                        )}
                    </motion.div>
                </div>
            </SheetContent>
        </Sheet>
    );
}