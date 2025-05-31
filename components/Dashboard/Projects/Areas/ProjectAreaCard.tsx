import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Card,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Plus,
    ChevronDown,
    ChevronRight,
    CheckSquare,
    List,
    Target,
    Settings,
    User,
    Calendar,
    Zap,
    RefreshCw,
    FileText,
    Eye,
    Edit,
    Trash2,
    Square,
    Play,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

import { firebaseFormatDate, getDaysStatus } from '@/components/utils/dateUtils';
import { useGetTasksQuery } from '@/Redux/apiSlices/tasks/tasksApiSlice';
import ProjectTasks from '../../Tasks/ProjectTasks';
import { ProjectArea } from '@/Redux/types/Projects/area';
import { Project, ProjectMember } from '@/Redux/types/Projects';

interface ProjectAreaCardProps {
    area: ProjectArea;
    project: Project;
    projectMembers: ProjectMember[];
    projectAreas: ProjectArea[];
    isExpanded: boolean;
    isTasksExpanded: boolean;
    onToggleExpanded: () => void;
    onToggleTasks: () => void;
    onUpdateProgress: () => void;
    onRecalculateProgress: () => void;
    onAddTask: () => void;
    onEditArea: () => void;
    onDeleteArea: () => void;
    canManage: boolean;
    isRecalculating: boolean;
    index: number;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'planned':
            return {
                label: 'Planned',
                color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                icon: Square,
                dotColor: 'bg-slate-500'
            };
        case 'in-progress':
            return {
                label: 'In Progress',
                color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
                icon: Play,
                dotColor: 'bg-blue-500'
            };
        case 'completed':
            return {
                label: 'Completed',
                color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
                icon: CheckCircle,
                dotColor: 'bg-emerald-500'
            };
        case 'blocked':
            return {
                label: 'Blocked',
                color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50',
                icon: AlertCircle,
                dotColor: 'bg-red-500'
            };
        default:
            return {
                label: 'Unknown',
                color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
                icon: Square,
                dotColor: 'bg-slate-500'
            };
    }
};


const getProgressColor = (progress: number) => {
    if (progress >= 80) return '[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600';
    if (progress >= 60) return '[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-600';
    if (progress >= 40) return '[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-yellow-600';
    if (progress >= 20) return '[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-orange-600';
    return '[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600';
};

const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (progress >= 60) return 'text-blue-600 dark:text-blue-400';
    if (progress >= 40) return 'text-yellow-600 dark:text-yellow-400';
    if (progress >= 20) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
};

export default function ProjectAreaCard({
    area,
    project,
    projectMembers,
    projectAreas,
    isExpanded,
    isTasksExpanded,
    onToggleExpanded,
    onToggleTasks,
    onUpdateProgress,
    onRecalculateProgress,
    onAddTask,
    onEditArea,
    onDeleteArea,
    canManage,
    isRecalculating,
    index
}: ProjectAreaCardProps) {
    const statusConfig = getStatusConfig(area.status);
    const StatusIcon = statusConfig.icon;
    const daysStatus = getDaysStatus(area.endDate);

    // Fetch tasks for this area for summary (when expanded)
    const { data: tasksResponse, isLoading: isLoadingTasks } = useGetTasksQuery({
        projectId: project.id,
        projectAreaId: area.id,
        limit: 50
    }, {
        skip: !isExpanded
    });

    const tasks = tasksResponse?.data || [];
    const completedTasks = tasks.filter(task => task.status === 'completed').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <Card className="border border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200 overflow-hidden">
                {/* Area Header */}
                <div
                    className="p-4 cursor-pointer hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/50 dark:hover:to-transparent transition-all duration-200"
                    onClick={onToggleExpanded}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-slate-500 transition-transform" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-slate-500 transition-transform" />
                                )}
                                <div className={cn(
                                    "flex items-center justify-center h-8 w-8 rounded-lg shadow-sm",
                                    statusConfig.color.includes('bg-slate') ? 'bg-slate-100 dark:bg-slate-800' :
                                        statusConfig.color.includes('bg-blue') ? 'bg-blue-100 dark:bg-blue-900/30' :
                                            statusConfig.color.includes('bg-emerald') ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                                'bg-red-100 dark:bg-red-900/30'
                                )}>
                                    <StatusIcon className={cn("h-4 w-4",
                                        statusConfig.color.includes('text-slate') ? 'text-slate-600 dark:text-slate-400' :
                                            statusConfig.color.includes('text-blue') ? 'text-blue-600 dark:text-blue-400' :
                                                statusConfig.color.includes('text-emerald') ? 'text-emerald-600 dark:text-emerald-400' :
                                                    'text-red-600 dark:text-red-400'
                                    )} />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                                        {area.name}
                                    </h4>
                                    <Badge className={cn("text-xs font-medium border", statusConfig.color)}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", statusConfig.dotColor)}></div>
                                        {statusConfig.label}
                                    </Badge>
                                </div>

                                {area.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                        {area.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                            {/* Progress Badge */}
                            <div className="text-right">
                                <div className={cn("text-lg font-bold", getProgressTextColor(area.progress))}>
                                    {area.progress}%
                                </div>
                                {area.taskCount !== undefined && area.taskCount > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                        <CheckSquare className="h-3 w-3" />
                                        <span>{area.completedTaskCount || 0}/{area.taskCount}</span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            {canManage && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRecalculateProgress();
                                        }}
                                        disabled={isRecalculating}
                                        className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    >
                                        <RefreshCw className={cn("h-4 w-4 text-blue-600", isRecalculating && "animate-spin")} />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateProgress();
                                        }}
                                        className="h-8 w-8 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                    >
                                        <Settings className="h-4 w-4 text-purple-600" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                        <Progress
                            value={area.progress}
                            className={cn("h-2", getProgressColor(area.progress))}
                        />
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 dark:to-transparent">
                                <div className="pt-4 space-y-4">
                                    {/* Area Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Left Column */}
                                        <div className="space-y-3">
                                            {area.learningFocus && area.learningFocus.length > 0 && (
                                                <div>
                                                    <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                                                        <Target className="h-3 w-3" />
                                                        Learning Focus
                                                    </h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {area.learningFocus.map((focus, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs py-0 h-5 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                                                {focus}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {area.technologies && area.technologies.length > 0 && (
                                                <div>
                                                    <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                                                        <Zap className="h-3 w-3" />
                                                        Technologies
                                                    </h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {area.technologies.map((tech, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs py-0 h-5 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                                                {tech}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-3">
                                            {(area.startDate || area.endDate) && (
                                                <div>
                                                    <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Timeline
                                                    </h5>
                                                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                                        {area.startDate && (
                                                            <div>Start: {firebaseFormatDate(area.startDate)}</div>
                                                        )}
                                                        {area.endDate && (
                                                            <div className="flex items-center gap-2">
                                                                <span>End: {firebaseFormatDate(area.endDate)}</span>
                                                                {!daysStatus.isOverdue && area.status !== 'completed' && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {daysStatus.text}
                                                                    </Badge>
                                                                )}
                                                                {daysStatus.isOverdue && area.status !== 'completed' && (
                                                                    <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                                                                        {daysStatus.text}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {area.assignedMentorId && (
                                                <div>
                                                    <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        Assigned Mentor
                                                    </h5>
                                                    <Badge variant="outline" className="text-xs">
                                                        Mentor Assigned
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tasks Summary */}
                                    {isLoadingTasks ? (
                                        <div className="flex items-center justify-center py-4">
                                            <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
                                        </div>
                                    ) : tasks.length > 0 ? (
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <List className="h-4 w-4 text-purple-600" />
                                                    Tasks in this Area
                                                </h5>
                                                <Badge variant="outline" className="text-xs">
                                                    {completedTasks}/{tasks.length} completed
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                {tasks.slice(0, 3).map((task) => (
                                                    <div key={task.id} className="flex items-center gap-2 text-sm">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            task.status === 'completed' ? 'bg-emerald-500' :
                                                                task.status === 'in-progress' ? 'bg-blue-500' :
                                                                    task.status === 'blocked' ? 'bg-red-500' :
                                                                        'bg-slate-400'
                                                        )} />
                                                        <span className={cn(
                                                            "flex-1 truncate",
                                                            task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'
                                                        )}>
                                                            {task.title}
                                                        </span>
                                                        <Badge variant="secondary" className="text-xs py-0 h-4">
                                                            {task.status.replace('-', ' ')}
                                                        </Badge>
                                                    </div>
                                                ))}

                                                {tasks.length > 3 && (
                                                    <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200 dark:border-slate-700">
                                                        +{tasks.length - 3} more tasks
                                                    </div>
                                                )}
                                            </div>

                                            {/* View All Tasks Button */}
                                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onToggleTasks();
                                                    }}
                                                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    {isTasksExpanded ? 'Hide Tasks' : 'View All Tasks'}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                            <CheckSquare className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                No tasks in this area yet
                                            </p>
                                            {canManage && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAddTask();
                                                    }}
                                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add First Task
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {canManage && (
                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddTask();
                                                }}
                                                className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Task
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditArea();
                                                }}
                                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Area
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteArea();
                                                }}
                                                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    )}

                                    {/* Full Task List - Using the Unified ProjectTasks Component */}
                                    <AnimatePresence>
                                        {isTasksExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-indigo-600" />
                                                            {area.name} Tasks
                                                        </h5>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onToggleTasks();
                                                            }}
                                                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Use the Unified ProjectTasks Component */}
                                                    <ProjectTasks
                                                        project={project}
                                                        projectArea={area}
                                                        projectAreas={projectAreas}
                                                        canManage={canManage}
                                                        className="bg-transparent"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}