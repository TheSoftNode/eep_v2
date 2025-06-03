"use client";

import React, { useState } from 'react';
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
    projectAreas?: ProjectArea[];
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
    projectAreas = [],
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

    const getCurrentProjectArea = () => {
        if (!task.projectAreaId || !projectAreas.length) return null;
        return projectAreas.find(area => area.id === task.projectAreaId);
    };

    const getStatusBadgeStyles = (status: UnifiedTask['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
            case 'blocked':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
            case 'in-progress':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
            case 'todo':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800';
            case 'upcoming':
                return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
            case 'submitted':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
            case 'overdue':
                return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
            default:
                return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800';
        }
    };

    const getPriorityBadgeStyles = (priority: UnifiedTask['priority']) => {
        switch (priority) {
            case 'low':
                return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
            case 'medium':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
            case 'high':
                return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
            case 'critical':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
            default:
                return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
        }
    };

    const formatStatusLabel = (status: string): string => {
        if (status === 'in-progress') return 'In Progress';
        if (status === 'todo') return 'To Do';
        return status.charAt(0).toUpperCase() + status.slice(1);
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

    const assigneeInfo = getAssigneeInfo(task.assigneeId);
    const remainingDays = getRemainingDays(firebaseFormatDate(task.dueDate));
    const taskOverdue = isOverdue(firebaseFormatDate(task.dueDate));
    const currentProjectArea = getCurrentProjectArea();

    return (
        <>
            <Card className="mt-6 border-indigo-100 dark:border-indigo-800 shadow-sm dark:bg-slate-800">
                <CardHeader className="pb-4 border-b border-indigo-100 dark:border-indigo-800">
                    <div className="flex justify-between items-start mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Tasks
                        </Button>

                        <div className="flex items-center gap-2">
                            {currentProjectArea && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                    <Layers className="h-3 w-3 mr-1" />
                                    {currentProjectArea.name}
                                </Badge>
                            )}
                            {task.week && (
                                <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                                    Week {task.week}
                                </Badge>
                            )}
                            <Badge
                                variant="outline"
                                className={cn(getStatusBadgeStyles(task.status))}
                            >
                                {formatStatusLabel(task.status)}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <CardTitle className="text-2xl text-indigo-900 dark:text-indigo-200 mb-3">{task.title}</CardTitle>
                        {task.description && (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{task.description}</p>
                        )}
                    </div>

                    {/* Task Type and Metadata */}
                    <div className="flex items-center gap-4 pt-4 text-sm text-gray-500 dark:text-gray-400">
                        {task.taskType && (
                            <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span className="capitalize">{task.taskType}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <History className="h-4 w-4" />
                            <span>Created {format(firebaseFormatDate(task.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            <span>Updated {format(firebaseFormatDate(task.updatedAt), 'MMM dd, yyyy')}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                    {/* Main Task Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Due Date */}
                        {task.dueDate && (
                            <div className={cn(
                                "p-4 rounded-lg border",
                                taskOverdue
                                    ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
                                    : "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                            )}>
                                <div className={cn(
                                    "flex items-center text-sm mb-1",
                                    taskOverdue
                                        ? "text-orange-600 dark:text-orange-400"
                                        : "text-indigo-600 dark:text-indigo-400"
                                )}>
                                    <CalendarCheck className="h-4 w-4 mr-1" />
                                    <span>Due Date</span>
                                </div>
                                <p className={cn(
                                    "font-medium",
                                    taskOverdue
                                        ? "text-orange-900 dark:text-orange-200"
                                        : "text-indigo-900 dark:text-indigo-200"
                                )}>
                                    {firebaseFormatDate(task.dueDate)}
                                </p>
                                <p className={cn(
                                    "text-sm mt-1",
                                    taskOverdue
                                        ? "text-orange-600 dark:text-orange-400"
                                        : remainingDays <= 3
                                            ? "text-orange-600 dark:text-orange-400"
                                            : "text-green-600 dark:text-green-400"
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
                            "p-4 rounded-lg border",
                            getPriorityBadgeStyles(task.priority)
                        )}>
                            <div className="flex items-center text-sm text-current mb-1">
                                <Flag className="h-4 w-4 mr-1" />
                                <span>Priority</span>
                            </div>
                            <p className="font-medium text-current capitalize">
                                {task.priority}
                            </p>
                        </div>

                        {/* Assignee */}
                        {task.assigneeId && (
                            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800">
                                <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 mb-1">
                                    <User className="h-4 w-4 mr-1" />
                                    <span>Assignee</span>
                                </div>
                                <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2">
                                        {assigneeInfo.avatar ? (
                                            <AvatarImage src={assigneeInfo.avatar} alt={assigneeInfo.name} />
                                        ) : (
                                            <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 text-xs">
                                                {assigneeInfo.initials}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-indigo-900 dark:text-indigo-200">{assigneeInfo.name}</p>
                                        {assigneeInfo.role && (
                                            <p className="text-xs text-indigo-600 dark:text-indigo-400 capitalize">{assigneeInfo.role}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress Section */}
                    {task.progress !== undefined && (
                        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    <span>Progress</span>
                                </div>
                                <span className="text-sm font-medium text-purple-900 dark:text-purple-200">{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                        </div>
                    )}

                    {/* Time Tracking & Additional Metrics */}
                    {(task.estimatedHours || task.actualHours || task.weight || task.maxGrade || task.startDate) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {task.estimatedHours && (
                                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>Estimated</span>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.estimatedHours} hours</p>
                                </div>
                            )}

                            {task.actualHours && (
                                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        <span>Actual</span>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.actualHours} hours</p>
                                </div>
                            )}

                            {task.weight && (
                                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <Star className="h-4 w-4 mr-1" />
                                        <span>Weight</span>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.weight}</p>
                                </div>
                            )}

                            {task.maxGrade && (
                                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <Award className="h-4 w-4 mr-1" />
                                        <span>Max Grade</span>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.maxGrade}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Skills */}
                    {task.skills && task.skills.length > 0 && (
                        <div>
                            <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 mb-3">
                                <Tag className="h-4 w-4 mr-1" />
                                <span>Skills ({task.skills.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {task.skills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Learning Objectives */}
                    {task.learningObjectives && task.learningObjectives.length > 0 && (
                        <div>
                            <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 mb-3">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                <span>Learning Objectives</span>
                            </div>
                            <ul className="space-y-2">
                                {task.learningObjectives.map((objective, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Resources */}
                    {task.resources && task.resources.length > 0 && (
                        <div>
                            <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 mb-3">
                                <BookOpen className="h-4 w-4 mr-1" />
                                <span>Resources ({task.resources.length})</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {task.resources.map((resource, index) => {
                                    const ResourceIcon = getResourceIcon(resource.type);
                                    const resourceId = resource.id || resource.title;
                                    const isLoading = isDownloadingResource === resourceId;

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 bg-white transition-colors dark:bg-gray-800/50 dark:border-gray-700 dark:hover:border-indigo-600"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                                                <ResourceIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate text-gray-900 dark:text-gray-100">{resource.title}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{resource.type}</p>
                                                {resource.description && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{resource.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                {resource.url && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30"
                                                        onClick={() => window.open(resource.url, '_blank')}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30"
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
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Collaborators */}
                    {task.collaboratorIds && task.collaboratorIds.length > 0 && (
                        <div>
                            <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 mb-3">
                                <Users className="h-4 w-4 mr-1" />
                                <span>Collaborators ({task.collaboratorIds.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {task.collaboratorIds.map((collaboratorId, index) => {
                                    const collaborator = getAssigneeInfo(collaboratorId);
                                    return (
                                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                                            <Avatar className="h-6 w-6">
                                                {collaborator.avatar ? (
                                                    <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                                                ) : (
                                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs">
                                                        {collaborator.initials}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{collaborator.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Grade & Feedback */}
                    {((task.grade !== undefined && task.grade !== null) || task.feedback || task.gradingNotes) && (
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                            <div className="flex items-center text-sm text-green-600 dark:text-green-400 mb-3">
                                <Award className="h-4 w-4 mr-1" />
                                <span>Assessment & Feedback</span>
                            </div>

                            {(task.grade !== undefined && task.grade !== null) && (
                                <div className="mb-3">
                                    <p className="text-sm text-green-600 dark:text-green-400">Grade Received</p>
                                    <p className="text-xl font-bold text-green-900 dark:text-green-200">
                                        {task.grade}{task.maxGrade ? `/${task.maxGrade}` : ''}
                                    </p>
                                </div>
                            )}

                            {task.feedback && (
                                <div className="mb-3">
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Feedback</p>
                                    <p className="text-sm text-green-800 bg-green-100 p-2 rounded border border-green-200 dark:text-green-200 dark:bg-green-900/30 dark:border-green-700">
                                        {task.feedback}
                                    </p>
                                </div>
                            )}

                            {task.gradingNotes && (
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Grading Notes</p>
                                    <p className="text-sm text-green-800 bg-green-100 p-2 rounded border border-green-200 dark:text-green-200 dark:bg-green-900/30 dark:border-green-700">
                                        {task.gradingNotes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Additional Metadata */}
                    {(task.visibility || task.taskType) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {task.visibility && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Visibility</span>
                                    <Badge variant="outline" className="capitalize">
                                        <Eye className="h-3 w-3 mr-1" />
                                        {task.visibility.replace('-', ' ')}
                                    </Badge>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Task ID</span>
                                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-900 dark:text-gray-100">
                                    {task.id.slice(-8)}
                                </code>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-2 pt-4 border-t border-indigo-100 dark:border-indigo-800">
                        {canManage && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleEditTask}
                                    className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/30 dark:text-indigo-300"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Task
                                </Button>
                                {task.status !== 'completed' && (
                                    <Button
                                        variant="outline"
                                        className="border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700 dark:border-green-700 dark:hover:border-green-600 dark:hover:bg-green-900/30 dark:text-green-300"
                                        onClick={handleMarkComplete}
                                        disabled={isCompletingTask}
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
                            </>
                        )}
                        <Button
                            onClick={onBack}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Tasks
                        </Button>
                    </div>
                </CardContent>
            </Card>

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



// "use client";

// import React, { useState } from 'react';
// import {
//     ArrowLeft,
//     CalendarCheck,
//     FileText,
//     Loader2,
//     Clock,
//     User,
//     Target,
//     Flag,
//     Zap,
//     CheckCircle2,
//     Play,
//     Pause,
//     Upload,
//     AlertCircle,
//     Calendar,
//     Star,
//     TrendingUp,
//     BookOpen,
//     Tag,
//     Eye,
//     Edit3,
//     Download,
//     ExternalLink,
//     GraduationCap,
//     Award,
//     MessageSquare,
//     Activity,
//     Users,
//     Layers,
//     Link as LinkIcon,
//     Video,
//     FileCode,
//     Globe,
//     History,
//     MapPin
// } from 'lucide-react';
// import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Progress } from '@/components/ui/progress';
// import { Separator } from '@/components/ui/separator';
// import { useToast } from '@/hooks/use-toast';
// import { cn } from '@/lib/utils';
// import { format, differenceInDays, isPast } from 'date-fns';
// import EditTaskModal from './EditTaskModal';
// import { UnifiedTask } from '@/Redux/types/Projects/task';
// import { ProjectMember, ProjectArea } from '@/Redux/types/Projects';
// import { firebaseFormatDate } from '@/components/utils/dateUtils';

// interface TaskDetailsProps {
//     task: UnifiedTask;
//     canManage: boolean;
//     members: ProjectMember[];
//     projectAreas?: ProjectArea[];
//     onStatusChange: (taskId: string, status: UnifiedTask['status']) => Promise<void>;
//     onBack: () => void;
//     onDownloadResource?: (resource: any) => void;
//     onSaveTask: (updatedTask: UnifiedTask) => Promise<void>;
//     showActivity?: boolean;
//     showComments?: boolean;
// }

// const TaskDetails: React.FC<TaskDetailsProps> = ({
//     task,
//     canManage,
//     members,
//     projectAreas = [],
//     onStatusChange,
//     onBack,
//     onDownloadResource = () => { },
//     onSaveTask,
//     showActivity = true,
//     showComments = true
// }) => {
//     const [isCompletingTask, setIsCompletingTask] = useState(false);
//     const [isDownloadingResource, setIsDownloadingResource] = useState<string | null>(null);
//     const [editingTask, setEditingTask] = useState<UnifiedTask | null>(null);
//     const { toast } = useToast();

//     const formatDate = (dateString?: string | Date | null): string => {
//         if (!dateString) return 'No due date';
//         const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
//         return format(date, 'MMMM dd, yyyy');
//     };

//     const getRemainingDays = (dateString?: string | Date | null): number => {
//         if (!dateString) return 0;
//         const dueDate = typeof dateString === 'string' ? new Date(dateString) : dateString;
//         return differenceInDays(dueDate, new Date());
//     };

//     const isOverdue = (dateString?: string | Date | null): boolean => {
//         if (!dateString || task.status === 'completed') return false;
//         const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
//         return isPast(date);
//     };

//     const getAssigneeInfo = (assigneeId?: string | null) => {
//         if (!assigneeId) return { name: 'Unassigned', initials: 'UN', avatar: null, role: null };
//         const member = members.find(m => m.id === assigneeId);
//         if (!member) return { name: 'Unknown', initials: 'UK', avatar: null, role: null };

//         const initials = member.initials || member.name.split(' ')
//             .map(n => n[0])
//             .join('')
//             .toUpperCase()
//             .substring(0, 2);

//         return {
//             name: member.name,
//             initials,
//             avatar: member.avatar,
//             role: member.role
//         };
//     };

//     const getCurrentProjectArea = () => {
//         if (!task.projectAreaId || !projectAreas.length) return null;
//         return projectAreas.find(area => area.id === task.projectAreaId);
//     };

//     const getStatusBadgeStyles = (status: UnifiedTask['status']) => {
//         switch (status) {
//             case 'completed':
//                 return 'bg-green-50 text-green-700 border-green-200';
//             case 'blocked':
//                 return 'bg-red-50 text-red-700 border-red-200';
//             case 'in-progress':
//                 return 'bg-blue-50 text-blue-700 border-blue-200';
//             case 'todo':
//                 return 'bg-indigo-50 text-indigo-700 border-indigo-200';
//             case 'upcoming':
//                 return 'bg-purple-50 text-purple-700 border-purple-200';
//             case 'submitted':
//                 return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//             case 'overdue':
//                 return 'bg-orange-50 text-orange-700 border-orange-200';
//             default:
//                 return 'bg-indigo-50 text-indigo-700 border-indigo-200';
//         }
//     };

//     const getPriorityBadgeStyles = (priority: UnifiedTask['priority']) => {
//         switch (priority) {
//             case 'low':
//                 return 'bg-green-50 text-green-700 border-green-200';
//             case 'medium':
//                 return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//             case 'high':
//                 return 'bg-orange-50 text-orange-700 border-orange-200';
//             case 'critical':
//                 return 'bg-red-50 text-red-700 border-red-200';
//             default:
//                 return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//         }
//     };

//     const formatStatusLabel = (status: string): string => {
//         if (status === 'in-progress') return 'In Progress';
//         if (status === 'todo') return 'To Do';
//         return status.charAt(0).toUpperCase() + status.slice(1);
//     };

//     const getResourceIcon = (type: string) => {
//         const icons = {
//             link: LinkIcon,
//             document: FileText,
//             video: Video,
//             code: FileCode,
//             guide: BookOpen,
//             template: Layers,
//             other: FileText
//         };
//         return icons[type as keyof typeof icons] || FileText;
//     };

//     const handleMarkComplete = async () => {
//         try {
//             setIsCompletingTask(true);
//             await onStatusChange(task.id, 'completed');
//             toast({
//                 title: "Task Completed",
//                 description: "Task has been marked as completed successfully.",
//             });
//         } catch (error) {
//             toast({
//                 title: "Failed to Update Task",
//                 description: "Could not mark task as completed. Please try again.",
//                 variant: "destructive",
//             });
//         } finally {
//             setIsCompletingTask(false);
//         }
//     };

//     const handleDownloadResource = async (resource: any) => {
//         try {
//             setIsDownloadingResource(resource.id || resource.title);
//             await onDownloadResource(resource);
//             toast({
//                 title: "Resource Downloaded",
//                 description: `${resource.title} has been downloaded successfully.`,
//             });
//         } catch (error) {
//             toast({
//                 title: "Download Failed",
//                 description: "Could not download resource. Please try again.",
//                 variant: "destructive",
//             });
//         } finally {
//             setTimeout(() => setIsDownloadingResource(null), 1000);
//         }
//     };

//     const handleEditTask = () => {
//         setEditingTask(task);
//     };

//     const handleSaveTask = async (updatedTask: UnifiedTask) => {
//         try {
//             await onSaveTask(updatedTask);
//             setEditingTask(null);
//             toast({
//                 title: "Task Updated",
//                 description: "Task has been updated successfully.",
//             });
//         } catch (error) {
//             console.error('Error updating task:', error);
//             toast({
//                 title: "Update Failed",
//                 description: "Could not update task. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const assigneeInfo = getAssigneeInfo(task.assigneeId);
//     const remainingDays = getRemainingDays(firebaseFormatDate(task.dueDate));
//     const taskOverdue = isOverdue(firebaseFormatDate(task.dueDate));
//     const currentProjectArea = getCurrentProjectArea();

//     return (
//         <>
//             <Card className="mt-6 border-indigo-100 shadow-sm">
//                 <CardHeader className="pb-4 border-b border-indigo-100">
//                     <div className="flex justify-between items-start mb-4">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={onBack}
//                             className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
//                         >
//                             <ArrowLeft className="h-4 w-4 mr-2" />
//                             Back to Tasks
//                         </Button>

//                         <div className="flex items-center gap-2">
//                             {currentProjectArea && (
//                                 <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                                     <Layers className="h-3 w-3 mr-1" />
//                                     {currentProjectArea.name}
//                                 </Badge>
//                             )}
//                             {task.week && (
//                                 <Badge className="bg-purple-100 text-purple-800 border-purple-200">
//                                     Week {task.week}
//                                 </Badge>
//                             )}
//                             <Badge
//                                 variant="outline"
//                                 className={cn(getStatusBadgeStyles(task.status))}
//                             >
//                                 {formatStatusLabel(task.status)}
//                             </Badge>
//                         </div>
//                     </div>

//                     <div>
//                         <CardTitle className="text-2xl text-indigo-900 mb-3">{task.title}</CardTitle>
//                         {task.description && (
//                             <p className="text-gray-600 leading-relaxed">{task.description}</p>
//                         )}
//                     </div>

//                     {/* Task Type and Metadata */}
//                     <div className="flex items-center gap-4 pt-4 text-sm text-gray-500">
//                         {task.taskType && (
//                             <div className="flex items-center gap-1">
//                                 <FileText className="h-4 w-4" />
//                                 <span className="capitalize">{task.taskType}</span>
//                             </div>
//                         )}
//                         <div className="flex items-center gap-1">
//                             <History className="h-4 w-4" />
//                             <span>Created {format(firebaseFormatDate(task.createdAt), 'MMM dd, yyyy')}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                             <Activity className="h-4 w-4" />
//                             <span>Updated {format(firebaseFormatDate(task.updatedAt), 'MMM dd, yyyy')}</span>
//                         </div>
//                     </div>
//                 </CardHeader>

//                 <CardContent className="space-y-6 p-6">
//                     {/* Main Task Info Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         {/* Due Date */}
//                         {task.dueDate && (
//                             <div className={cn(
//                                 "p-4 rounded-lg border",
//                                 taskOverdue
//                                     ? "bg-orange-50 border-orange-200"
//                                     : "bg-indigo-50 border-indigo-200"
//                             )}>
//                                 <div className={cn(
//                                     "flex items-center text-sm mb-1",
//                                     taskOverdue ? "text-orange-600" : "text-indigo-600"
//                                 )}>
//                                     <CalendarCheck className="h-4 w-4 mr-1" />
//                                     <span>Due Date</span>
//                                 </div>
//                                 <p className={cn(
//                                     "font-medium",
//                                     taskOverdue ? "text-orange-900" : "text-indigo-900"
//                                 )}>
//                                     {firebaseFormatDate(task.dueDate)}
//                                 </p>
//                                 <p className={cn(
//                                     "text-sm mt-1",
//                                     taskOverdue
//                                         ? "text-orange-600"
//                                         : remainingDays <= 3
//                                             ? "text-orange-600"
//                                             : "text-green-600"
//                                 )}>
//                                     {taskOverdue
//                                         ? `${Math.abs(remainingDays)} days overdue`
//                                         : remainingDays === 0
//                                             ? "Due today"
//                                             : `${remainingDays} days remaining`
//                                     }
//                                 </p>
//                             </div>
//                         )}

//                         {/* Priority */}
//                         <div className={cn(
//                             "p-4 rounded-lg border",
//                             getPriorityBadgeStyles(task.priority)
//                         )}>
//                             <div className="flex items-center text-sm text-current mb-1">
//                                 <Flag className="h-4 w-4 mr-1" />
//                                 <span>Priority</span>
//                             </div>
//                             <p className="font-medium text-current capitalize">
//                                 {task.priority}
//                             </p>
//                         </div>

//                         {/* Assignee */}
//                         {task.assigneeId && (
//                             <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
//                                 <div className="flex items-center text-sm text-indigo-600 mb-1">
//                                     <User className="h-4 w-4 mr-1" />
//                                     <span>Assignee</span>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <Avatar className="h-6 w-6 mr-2">
//                                         {assigneeInfo.avatar ? (
//                                             <AvatarImage src={assigneeInfo.avatar} alt={assigneeInfo.name} />
//                                         ) : (
//                                             <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
//                                                 {assigneeInfo.initials}
//                                             </AvatarFallback>
//                                         )}
//                                     </Avatar>
//                                     <div>
//                                         <p className="font-medium text-indigo-900">{assigneeInfo.name}</p>
//                                         {assigneeInfo.role && (
//                                             <p className="text-xs text-indigo-600 capitalize">{assigneeInfo.role}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Progress Section */}
//                     {task.progress !== undefined && (
//                         <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
//                             <div className="flex items-center justify-between mb-2">
//                                 <div className="flex items-center text-sm text-purple-600">
//                                     <TrendingUp className="h-4 w-4 mr-1" />
//                                     <span>Progress</span>
//                                 </div>
//                                 <span className="text-sm font-medium text-purple-900">{task.progress}%</span>
//                             </div>
//                             <Progress value={task.progress} className="h-2" />
//                         </div>
//                     )}

//                     {/* Time Tracking & Additional Metrics */}
//                     {(task.estimatedHours || task.actualHours || task.weight || task.maxGrade || task.startDate) && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                             {task.estimatedHours && (
//                                 <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
//                                     <div className="flex items-center text-sm text-gray-600 mb-1">
//                                         <Clock className="h-4 w-4 mr-1" />
//                                         <span>Estimated</span>
//                                     </div>
//                                     <p className="font-medium text-gray-900">{task.estimatedHours} hours</p>
//                                 </div>
//                             )}

//                             {task.actualHours && (
//                                 <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
//                                     <div className="flex items-center text-sm text-gray-600 mb-1">
//                                         <TrendingUp className="h-4 w-4 mr-1" />
//                                         <span>Actual</span>
//                                     </div>
//                                     <p className="font-medium text-gray-900">{task.actualHours} hours</p>
//                                 </div>
//                             )}

//                             {task.weight && (
//                                 <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
//                                     <div className="flex items-center text-sm text-gray-600 mb-1">
//                                         <Star className="h-4 w-4 mr-1" />
//                                         <span>Weight</span>
//                                     </div>
//                                     <p className="font-medium text-gray-900">{task.weight}</p>
//                                 </div>
//                             )}

//                             {task.maxGrade && (
//                                 <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
//                                     <div className="flex items-center text-sm text-gray-600 mb-1">
//                                         <Award className="h-4 w-4 mr-1" />
//                                         <span>Max Grade</span>
//                                     </div>
//                                     <p className="font-medium text-gray-900">{task.maxGrade}</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* Skills */}
//                     {task.skills && task.skills.length > 0 && (
//                         <div>
//                             <div className="flex items-center text-sm text-indigo-600 mb-3">
//                                 <Tag className="h-4 w-4 mr-1" />
//                                 <span>Skills ({task.skills.length})</span>
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                                 {task.skills.map((skill, index) => (
//                                     <Badge
//                                         key={index}
//                                         variant="secondary"
//                                         className="bg-purple-100 text-purple-700 border-purple-200"
//                                     >
//                                         {skill}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Learning Objectives */}
//                     {task.learningObjectives && task.learningObjectives.length > 0 && (
//                         <div>
//                             <div className="flex items-center text-sm text-indigo-600 mb-3">
//                                 <GraduationCap className="h-4 w-4 mr-1" />
//                                 <span>Learning Objectives</span>
//                             </div>
//                             <ul className="space-y-2">
//                                 {task.learningObjectives.map((objective, index) => (
//                                     <li key={index} className="flex items-start gap-2">
//                                         <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
//                                         <span className="text-gray-700">{objective}</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}

//                     {/* Resources */}
//                     {task.resources && task.resources.length > 0 && (
//                         <div>
//                             <div className="flex items-center text-sm text-indigo-600 mb-3">
//                                 <BookOpen className="h-4 w-4 mr-1" />
//                                 <span>Resources ({task.resources.length})</span>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {task.resources.map((resource, index) => {
//                                     const ResourceIcon = getResourceIcon(resource.type);
//                                     const resourceId = resource.id || resource.title;
//                                     const isLoading = isDownloadingResource === resourceId;

//                                     return (
//                                         <div
//                                             key={index}
//                                             className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 bg-white transition-colors"
//                                         >
//                                             <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
//                                                 <ResourceIcon className="h-5 w-5 text-indigo-600" />
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <h4 className="font-medium truncate text-gray-900">{resource.title}</h4>
//                                                 <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
//                                                 {resource.description && (
//                                                     <p className="text-xs text-gray-600 mt-1 line-clamp-1">{resource.description}</p>
//                                                 )}
//                                             </div>
//                                             <div className="flex gap-1">
//                                                 {resource.url && (
//                                                     <Button
//                                                         variant="ghost"
//                                                         size="sm"
//                                                         className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
//                                                         onClick={() => window.open(resource.url, '_blank')}
//                                                     >
//                                                         <ExternalLink className="h-4 w-4" />
//                                                     </Button>
//                                                 )}
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
//                                                     onClick={() => handleDownloadResource(resource)}
//                                                     disabled={isLoading}
//                                                 >
//                                                     {isLoading ? (
//                                                         <Loader2 className="h-4 w-4 animate-spin" />
//                                                     ) : (
//                                                         <Download className="h-4 w-4" />
//                                                     )}
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     )}

//                     {/* Collaborators */}
//                     {task.collaboratorIds && task.collaboratorIds.length > 0 && (
//                         <div>
//                             <div className="flex items-center text-sm text-indigo-600 mb-3">
//                                 <Users className="h-4 w-4 mr-1" />
//                                 <span>Collaborators ({task.collaboratorIds.length})</span>
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                                 {task.collaboratorIds.map((collaboratorId, index) => {
//                                     const collaborator = getAssigneeInfo(collaboratorId);
//                                     return (
//                                         <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
//                                             <Avatar className="h-6 w-6">
//                                                 {collaborator.avatar ? (
//                                                     <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
//                                                 ) : (
//                                                     <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
//                                                         {collaborator.initials}
//                                                     </AvatarFallback>
//                                                 )}
//                                             </Avatar>
//                                             <span className="text-sm font-medium text-gray-900">{collaborator.name}</span>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     )}

//                     {/* Grade & Feedback */}
//                     {((task.grade !== undefined && task.grade !== null) || task.feedback || task.gradingNotes) && (
//                         <div className="p-4 rounded-lg bg-green-50 border border-green-200">
//                             <div className="flex items-center text-sm text-green-600 mb-3">
//                                 <Award className="h-4 w-4 mr-1" />
//                                 <span>Assessment & Feedback</span>
//                             </div>

//                             {(task.grade !== undefined && task.grade !== null) && (
//                                 <div className="mb-3">
//                                     <p className="text-sm text-green-600">Grade Received</p>
//                                     <p className="text-xl font-bold text-green-900">
//                                         {task.grade}{task.maxGrade ? `/${task.maxGrade}` : ''}
//                                     </p>
//                                 </div>
//                             )}

//                             {task.feedback && (
//                                 <div className="mb-3">
//                                     <p className="text-sm font-medium text-green-700 mb-1">Feedback</p>
//                                     <p className="text-sm text-green-800 bg-green-100 p-2 rounded border border-green-200">
//                                         {task.feedback}
//                                     </p>
//                                 </div>
//                             )}

//                             {task.gradingNotes && (
//                                 <div>
//                                     <p className="text-sm font-medium text-green-700 mb-1">Grading Notes</p>
//                                     <p className="text-sm text-green-800 bg-green-100 p-2 rounded border border-green-200">
//                                         {task.gradingNotes}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* Additional Metadata */}
//                     {(task.visibility || task.taskType) && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
//                             {task.visibility && (
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-gray-600">Visibility</span>
//                                     <Badge variant="outline" className="capitalize">
//                                         <Eye className="h-3 w-3 mr-1" />
//                                         {task.visibility.replace('-', ' ')}
//                                     </Badge>
//                                 </div>
//                             )}
//                             <div className="flex items-center justify-between">
//                                 <span className="text-sm text-gray-600">Task ID</span>
//                                 <code className="px-2 py-1 bg-gray-100 rounded text-xs">
//                                     {task.id.slice(-8)}
//                                 </code>
//                             </div>
//                         </div>
//                     )}

//                     {/* Actions */}
//                     <div className="flex justify-end space-x-2 pt-4 border-t border-indigo-100">
//                         {canManage && (
//                             <>
//                                 <Button
//                                     variant="outline"
//                                     onClick={handleEditTask}
//                                     className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700"
//                                 >
//                                     <Edit3 className="h-4 w-4 mr-2" />
//                                     Edit Task
//                                 </Button>
//                                 {task.status !== 'completed' && (
//                                     <Button
//                                         variant="outline"
//                                         className="border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700"
//                                         onClick={handleMarkComplete}
//                                         disabled={isCompletingTask}
//                                     >
//                                         {isCompletingTask ? (
//                                             <>
//                                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                                 Updating...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <CheckCircle2 className="mr-2 h-4 w-4" />
//                                                 Mark Complete
//                                             </>
//                                         )}
//                                     </Button>
//                                 )}
//                             </>
//                         )}
//                         <Button
//                             onClick={onBack}
//                             className="bg-indigo-600 hover:bg-indigo-700 text-white"
//                         >
//                             <ArrowLeft className="mr-2 h-4 w-4" />
//                             Back to Tasks
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             {editingTask && (
//                 <EditTaskModal
//                     task={editingTask}
//                     open={!!editingTask}
//                     onClose={() => setEditingTask(null)}
//                     onSave={handleSaveTask}
//                     members={members}
//                     projectAreas={projectAreas.map(area => ({
//                         id: area.id,
//                         name: area.name,
//                         status: area.status
//                     }))}
//                 />
//             )}
//         </>
//     );
// };

// export default TaskDetails;




