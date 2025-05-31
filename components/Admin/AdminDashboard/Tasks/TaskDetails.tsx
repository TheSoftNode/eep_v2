"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    CalendarCheck,
    FileText,
    Loader2,
    Clock,
    User,
    Target,
    Flag,
    Zap,
    CheckCircle2,
    Play,
    Pause,
    Upload,
    AlertCircle,
    Calendar,
    Star,
    TrendingUp,
    BookOpen,
    Tag,
    Eye,
    Edit3,
    Save,
    Download,
    ExternalLink,
    GraduationCap,
    Award,
    MessageSquare,
    Activity,
    Users,
    Layers,
    Link as LinkIcon,
    Video,
    FileCode,
    Globe,
    History,
    MapPin
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, differenceInDays, isPast } from 'date-fns';
import EditTaskModal from './EditTaskModal';
import { UnifiedTask } from '@/Redux/types/Projects/task';
import { ProjectMember, ProjectArea } from '@/Redux/types/Projects';
import { firebaseFormatDate } from '@/components/utils/dateUtils';

interface TaskDetailsProps {
    task: UnifiedTask;
    canManage: boolean;
    members: ProjectMember[];
    projectAreas?: ProjectArea[]; // Add project areas
    onStatusChange: (taskId: string, status: UnifiedTask['status']) => Promise<void>;
    onBack: () => void;
    onDownloadResource?: (resource: any) => void;
    onSaveTask: (updatedTask: UnifiedTask) => Promise<void>;
    showActivity?: boolean;
    showComments?: boolean;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
    task,
    canManage,
    members,
    projectAreas = [], // Default to empty array
    onStatusChange,
    onBack,
    onDownloadResource = () => { },
    onSaveTask,
    showActivity = true,
    showComments = true
}) => {
    const [isCompletingTask, setIsCompletingTask] = useState(false);
    const [isDownloadingResource, setIsDownloadingResource] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<UnifiedTask | null>(null);
    const { toast } = useToast();

    const formatDate = (dateString?: string | Date | null): string => {
        if (!dateString) return 'No due date';
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return format(date, 'MMMM dd, yyyy');
    };

    const getRemainingDays = (dateString?: string | Date | null): number => {
        if (!dateString) return 0;
        const dueDate = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return differenceInDays(dueDate, new Date());
    };

    const isOverdue = (dateString?: string | Date | null): boolean => {
        if (!dateString || task.status === 'completed') return false;
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return isPast(date);
    };

    const getAssigneeInfo = (assigneeId?: string | null) => {
        if (!assigneeId) return { name: 'Unassigned', initials: 'UN', avatar: null, role: null };
        const member = members.find(m => m.id === assigneeId);
        if (!member) return { name: 'Unknown', initials: 'UK', avatar: null, role: null };

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

    // Get current project area info
    const getCurrentProjectArea = () => {
        if (!task.projectAreaId || !projectAreas.length) return null;
        return projectAreas.find(area => area.id === task.projectAreaId);
    };

    const getStatusConfig = (status: UnifiedTask['status']) => {
        const configs = {
            todo: { label: 'To Do', icon: Target, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
            upcoming: { label: 'Upcoming', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' },
            'in-progress': { label: 'In Progress', icon: Play, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
            submitted: { label: 'Submitted', icon: Upload, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
            completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
            blocked: { label: 'Blocked', icon: Pause, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
            overdue: { label: 'Overdue', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' }
        };
        return configs[status] || configs.todo;
    };

    const getPriorityConfig = (priority: UnifiedTask['priority']) => {
        const configs = {
            low: { label: 'Low', icon: Flag, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
            medium: { label: 'Medium', icon: Flag, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
            high: { label: 'High', icon: Flag, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
            critical: { label: 'Critical', icon: Zap, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' }
        };
        return configs[priority] || configs.medium;
    };

    const getResourceIcon = (type: string) => {
        const icons = {
            link: LinkIcon,
            document: FileText,
            video: Video,
            code: FileCode,
            guide: BookOpen,
            template: Layers,
            other: FileText
        };
        return icons[type as keyof typeof icons] || FileText;
    };

    const handleMarkComplete = async () => {
        try {
            setIsCompletingTask(true);
            await onStatusChange(task.id, 'completed');
            toast({
                title: "Task Completed",
                description: "Task has been marked as completed successfully.",
            });
        } catch (error) {
            toast({
                title: "Failed to Update Task",
                description: "Could not mark task as completed. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsCompletingTask(false);
        }
    };

    const handleDownloadResource = async (resource: any) => {
        try {
            setIsDownloadingResource(resource.id || resource.title);
            await onDownloadResource(resource);
            toast({
                title: "Resource Downloaded",
                description: `${resource.title} has been downloaded successfully.`,
            });
        } catch (error) {
            toast({
                title: "Download Failed",
                description: "Could not download resource. Please try again.",
                variant: "destructive",
            });
        } finally {
            setTimeout(() => setIsDownloadingResource(null), 1000);
        }
    };

    const handleEditTask = () => {
        setEditingTask(task);
    };

    const handleSaveTask = async (updatedTask: UnifiedTask) => {
        try {
            await onSaveTask(updatedTask);
            setEditingTask(null);
            toast({
                title: "Task Updated",
                description: "Task has been updated successfully.",
            });
        } catch (error) {
            console.error('Error updating task:', error);
            toast({
                title: "Update Failed",
                description: "Could not update task. Please try again.",
                variant: "destructive",
            });
        }
    };

    const statusConf = getStatusConfig(task.status);
    const priorityConf = getPriorityConfig(task.priority);
    const assigneeInfo = getAssigneeInfo(task.assigneeId);
    const remainingDays = getRemainingDays(firebaseFormatDate(task.dueDate));
    const taskOverdue = isOverdue(firebaseFormatDate(task.dueDate));
    const currentProjectArea = getCurrentProjectArea();

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {/* Header Card */}
                <Card className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                    <CardHeader className="pb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4 mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onBack}
                                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Tasks
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Project Area Badge */}
                                {currentProjectArea && (
                                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                        <Layers className="h-3 w-3 mr-1" />
                                        {currentProjectArea.name}
                                    </Badge>
                                )}

                                {task.week && (
                                    <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                                        Week {task.week}
                                    </Badge>
                                )}
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "border-2 font-medium",
                                        statusConf.bg,
                                        statusConf.color,
                                        statusConf.border
                                    )}
                                >
                                    <statusConf.icon className="h-3 w-3 mr-1" />
                                    {statusConf.label}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                                {task.title}
                            </CardTitle>
                            {task.description && (
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
                                    {task.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                                <History className="h-4 w-4" />
                                <span>Created {format(firebaseFormatDate(task.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Activity className="h-4 w-4" />
                                <span>Updated {format(firebaseFormatDate(task.updatedAt), 'MMM dd, yyyy')}</span>
                            </div>
                            {/* Show project context */}
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    {currentProjectArea
                                        ? `In ${currentProjectArea.name}`
                                        : 'Direct project task'
                                    }
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Task Metrics */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                    Task Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Due Date */}
                                    {task.dueDate && (
                                        <div className={cn(
                                            "p-4 rounded-lg border-2 transition-all",
                                            taskOverdue
                                                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                                                : "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                                        )}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <CalendarCheck className={cn(
                                                    "h-4 w-4",
                                                    taskOverdue ? "text-orange-600 dark:text-orange-400" : "text-indigo-600 dark:text-indigo-400"
                                                )} />
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    taskOverdue ? "text-orange-700 dark:text-orange-300" : "text-indigo-700 dark:text-indigo-300"
                                                )}>
                                                    Due Date
                                                </span>
                                            </div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                {firebaseFormatDate(task.dueDate)}
                                            </p>
                                            <p className={cn(
                                                "text-sm mt-1 font-medium",
                                                taskOverdue
                                                    ? "text-orange-600 dark:text-orange-400"
                                                    : remainingDays <= 3
                                                        ? "text-orange-600 dark:text-orange-400"
                                                        : "text-emerald-600 dark:text-emerald-400"
                                            )}>
                                                {taskOverdue
                                                    ? `${Math.abs(remainingDays)} days overdue`
                                                    : remainingDays === 0
                                                        ? "Due today"
                                                        : `${remainingDays} days remaining`
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {/* Priority */}
                                    <div className={cn(
                                        "p-4 rounded-lg border-2",
                                        priorityConf.bg,
                                        priorityConf.border
                                    )}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <priorityConf.icon className={cn("h-4 w-4", priorityConf.color)} />
                                            <span className={cn("text-sm font-medium", priorityConf.color)}>
                                                Priority
                                            </span>
                                        </div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                                            {priorityConf.label}
                                        </p>
                                    </div>

                                    {/* Progress */}
                                    {task.progress !== undefined && (
                                        <div className="p-4 rounded-lg border-2 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                                    Progress
                                                </span>
                                            </div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                                {task.progress}% Complete
                                            </p>
                                            <Progress value={task.progress} className="h-2" />
                                        </div>
                                    )}
                                </div>

                                {/* Time Tracking */}
                                {(task.estimatedHours || task.actualHours) && (
                                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Time Tracking
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {task.estimatedHours && (
                                                <div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Estimated</p>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {task.estimatedHours} hours
                                                    </p>
                                                </div>
                                            )}
                                            {task.actualHours && (
                                                <div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Actual</p>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {task.actualHours} hours
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Learning Objectives & Skills */}
                        {(task.learningObjectives?.length || task.skills?.length) && (
                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                            <GraduationCap className="h-4 w-4" />
                                        </div>
                                        Learning & Skills
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {task.learningObjectives && task.learningObjectives.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                                <Target className="h-4 w-4 text-purple-600" />
                                                Learning Objectives
                                            </h4>
                                            <ul className="space-y-2">
                                                {task.learningObjectives.map((objective, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-slate-700 dark:text-slate-300">{objective}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {task.skills && task.skills.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-purple-600" />
                                                Skills ({task.skills.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {task.skills.map((skill, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                                    >
                                                        <Tag className="h-3 w-3 mr-1" />
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Resources */}
                        {task.resources && task.resources.length > 0 && (
                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        Learning Resources ({task.resources.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {task.resources.map((resource, index) => {
                                            const ResourceIcon = getResourceIcon(resource.type);
                                            const resourceId = resource.id || resource.title;
                                            const isLoading = isDownloadingResource === resourceId;

                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: index * 0.1 }}
                                                    className="group p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-800 group-hover:scale-105 transition-transform">
                                                            <ResourceIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-green-700 dark:group-hover:text-green-300">
                                                                {resource.title}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">
                                                                {resource.type} Resource
                                                            </p>
                                                            {resource.description && (
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                                                    {resource.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {resource.url && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={() => window.open(resource.url, '_blank')}
                                                                >
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => handleDownloadResource(resource)}
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Download className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Grading & Feedback */}
                        {((task.grade !== undefined && task.grade !== null) || task.feedback || task.gradingNotes) && (
                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                                            <Award className="h-4 w-4" />
                                        </div>
                                        Assessment & Feedback
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {(task.grade !== undefined && task.grade !== null) && (
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Grade Received</p>
                                                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                                                        {task.grade}{task.maxGrade ? `/${task.maxGrade}` : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-800">
                                                    <Star className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {task.feedback && (
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4" />
                                                Feedback
                                            </h4>
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                                <p className="text-slate-700 dark:text-slate-300">{task.feedback}</p>
                                            </div>
                                        </div>
                                    )}

                                    {task.gradingNotes && (
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Grading Notes
                                            </h4>
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                                <p className="text-slate-700 dark:text-slate-300">{task.gradingNotes}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Assignee Card */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-indigo-600" />
                                    Assignment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-lg">
                                        {assigneeInfo.avatar ? (
                                            <AvatarImage src={assigneeInfo.avatar} alt={assigneeInfo.name} />
                                        ) : (
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                                                {assigneeInfo.initials}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                                            {assigneeInfo.name}
                                        </p>
                                        {assigneeInfo.role && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                                                {assigneeInfo.role}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Collaborators */}
                                {task.collaboratorIds && task.collaboratorIds.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Collaborators ({task.collaboratorIds.length})
                                        </p>
                                        <div className="flex -space-x-2">
                                            {task.collaboratorIds.slice(0, 3).map((collaboratorId, index) => {
                                                const collaborator = getAssigneeInfo(collaboratorId);
                                                return (
                                                    <Avatar key={index} className="h-8 w-8 border-2 border-white dark:border-slate-800">
                                                        {collaborator.avatar ? (
                                                            <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                                                        ) : (
                                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                                                                {collaborator.initials}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                );
                                            })}
                                            {task.collaboratorIds.length > 3 && (
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                                                    +{task.collaboratorIds.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Task Metadata */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                    Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {task.taskType && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Type</span>
                                        <Badge variant="outline" className="capitalize">
                                            {task.taskType}
                                        </Badge>
                                    </div>
                                )}

                                {task.weight && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Weight</span>
                                        <span className="font-medium text-slate-900 dark:text-slate-100">
                                            {task.weight}
                                        </span>
                                    </div>
                                )}

                                {task.visibility && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Visibility</span>
                                        <Badge variant="outline" className="capitalize">
                                            <Eye className="h-3 w-3 mr-1" />
                                            {task.visibility.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                )}

                                {/* Project Area Info */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Location</span>
                                    <Badge variant="outline" className="capitalize">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {currentProjectArea ? currentProjectArea.name : 'Direct Project'}
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center justify-between">
                                        <span>Task ID</span>
                                        <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                            {task.id.slice(-8)}
                                        </code>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Created</span>
                                        <span>{format(firebaseFormatDate(task.createdAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Updated</span>
                                        <span>{format(firebaseFormatDate(task.updatedAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions Card */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Activity className="h-5 w-5 text-indigo-600" />
                                    Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {canManage && (
                                    <div className="space-y-2">
                                        <Button
                                            onClick={handleEditTask}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                        >
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            Edit Task
                                        </Button>

                                        {task.status !== 'completed' && (
                                            <Button
                                                onClick={handleMarkComplete}
                                                disabled={isCompletingTask}
                                                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white"
                                            >
                                                {isCompletingTask ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Mark Complete
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}

                                <Separator />

                                <Button
                                    variant="outline"
                                    onClick={onBack}
                                    className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Tasks
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>

            {/* Edit Task Modal */}
            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    open={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleSaveTask}
                    members={members}
                    projectAreas={projectAreas.map(area => ({
                        id: area.id,
                        name: area.name,
                        status: area.status
                    }))}
                />
            )}
        </>
    );
};

export default TaskDetails;