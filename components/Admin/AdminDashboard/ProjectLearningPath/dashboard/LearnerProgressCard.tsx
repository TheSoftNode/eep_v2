import React from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Clock,
    Target,
    Award,
    Calendar,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Play,
    Pause,
    Flag,
    Brain,
    Activity
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LearnerProgressCardProps {
    progress: {
        id: string;
        userId: string;
        userName: string;
        projectId: string;
        projectTitle: string;
        status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
        currentPhase: 'setup' | 'development' | 'completion' | 'review';
        overallProgress: number;
        tasksProgress: {
            total: number;
            completed: number;
            inProgress: number;
            percentage: number;
        };
        areasProgress: {
            total: number;
            completed: number;
            inProgress: number;
            percentage: number;
        };
        milestonesProgress: {
            total: number;
            completed: number;
            percentage: number;
        };
        skillsAcquired: Array<{
            skillId: string;
            skillName: string;
            acquiredAt: any;
            proficiencyLevel: 'basic' | 'intermediate' | 'advanced';
        }>;
        milestonesReached: Array<{
            milestoneId: string;
            title: string;
            completedAt: any;
            experienceGained?: number;
        }>;
        totalTimeSpent: number; // in minutes
        estimatedTimeRemaining: number;
        averageSessionTime: number;
        lastActivityAt: any;
        currentTaskId?: string;
        currentAreaId?: string;
        nextMilestoneId?: string;
        personalGoals: string[];
        startedAt: any;
        lastProgressUpdate: any;
        completedAt?: any;
    };
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'in-progress':
            return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'on-hold':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'not-started':
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getPhaseColor = (phase: string) => {
    switch (phase) {
        case 'setup':
            return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
        case 'development':
            return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'completion':
            return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400';
        case 'review':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getProficiencyColor = (level: string) => {
    switch (level) {
        case 'basic':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'intermediate':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'advanced':
            return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed': return CheckCircle;
        case 'in-progress': return Play;
        case 'on-hold': return Pause;
        case 'not-started': return Flag;
        default: return AlertCircle;
    }
};

const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
        if (date.seconds) {
            return new Date(date.seconds * 1000).toLocaleDateString();
        }
        return new Date(date).toLocaleDateString();
    } catch {
        return 'N/A';
    }
};

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const LearnerProgressCard: React.FC<LearnerProgressCardProps> = ({
    progress
}) => {
    const StatusIcon = getStatusIcon(progress.status);
    const isActive = progress.status === 'in-progress';
    const isCompleted = progress.status === 'completed';

    // Calculate days since start
    const daysSinceStart = progress.startedAt ?
        Math.floor((Date.now() - (progress.startedAt.seconds ? progress.startedAt.seconds * 1000 : new Date(progress.startedAt).getTime())) / (1000 * 60 * 60 * 24)) : 0;

    // Calculate estimated completion date
    const estimatedCompletionDays = progress.estimatedTimeRemaining ?
        Math.ceil(progress.estimatedTimeRemaining / (progress.averageSessionTime || 60)) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={cn(
                "border shadow-lg transition-all duration-200 hover:shadow-xl",
                isCompleted ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" :
                    isActive ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800" :
                        "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            )}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={`/api/avatars/${progress.userId}`} />
                                <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    {getInitials(progress.userName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-white">
                                    {progress.userName}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Started {daysSinceStart} days ago
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs", getStatusColor(progress.status))}>
                                {progress.status.replace('-', ' ')}
                            </Badge>
                            <Badge className={cn("text-xs", getPhaseColor(progress.currentPhase))}>
                                {progress.currentPhase}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Overall Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <BarChart3 className="h-4 w-4" />
                                Overall Progress
                            </span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {Math.round(progress.overallProgress)}%
                            </span>
                        </div>
                        <Progress value={progress.overallProgress} className="h-2" />
                    </div>

                    {/* Progress Breakdown */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                    {progress.tasksProgress.completed}/{progress.tasksProgress.total}
                                </p>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">Tasks</p>
                            <Progress value={progress.tasksProgress.percentage} className="h-1 mt-1" />
                        </div>

                        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Activity className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
                                    {progress.areasProgress.completed}/{progress.areasProgress.total}
                                </p>
                            </div>
                            <p className="text-xs text-purple-600 dark:text-purple-400">Areas</p>
                            <Progress value={progress.areasProgress.percentage} className="h-1 mt-1" />
                        </div>

                        <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Award className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                                    {progress.milestonesProgress.completed}/{progress.milestonesProgress.total}
                                </p>
                            </div>
                            <p className="text-xs text-amber-600 dark:text-amber-400">Milestones</p>
                            <Progress value={progress.milestonesProgress.percentage} className="h-1 mt-1" />
                        </div>
                    </div>

                    {/* Time and Activity Stats */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Time Spent
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {formatTimeSpent(progress.totalTimeSpent)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                Avg Session
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {formatTimeSpent(progress.averageSessionTime)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Last Active
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {formatDate(progress.lastActivityAt)}
                            </span>
                        </div>
                    </div>

                    {/* Skills Acquired */}
                    {progress.skillsAcquired.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <Brain className="h-4 w-4" />
                                Skills Acquired ({progress.skillsAcquired.length})
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {progress.skillsAcquired.slice(0, 4).map((skill, index) => (
                                    <Badge key={skill.skillId} className={cn("text-xs", getProficiencyColor(skill.proficiencyLevel))}>
                                        {skill.skillName}
                                    </Badge>
                                ))}
                                {progress.skillsAcquired.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{progress.skillsAcquired.length - 4} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recent Milestones */}
                    {progress.milestonesReached.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                Recent Milestones ({progress.milestonesReached.length})
                            </span>
                            <div className="space-y-1">
                                {progress.milestonesReached.slice(0, 2).map((milestone, index) => (
                                    <div key={milestone.milestoneId} className="text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {milestone.title}
                                            </span>
                                            <span className="text-slate-500 dark:text-slate-400">
                                                {formatDate(milestone.completedAt)}
                                            </span>
                                        </div>
                                        {milestone.experienceGained && (
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                +{milestone.experienceGained} XP
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {progress.milestonesReached.length > 2 && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                        +{progress.milestonesReached.length - 2} more milestones completed
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Personal Goals */}
                    {progress.personalGoals.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <Flag className="h-4 w-4" />
                                Personal Goals ({progress.personalGoals.length})
                            </span>
                            <div className="space-y-1">
                                {progress.personalGoals.slice(0, 2).map((goal, index) => (
                                    <div key={index} className="text-xs p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-200 dark:border-indigo-800">
                                        <span className="text-indigo-700 dark:text-indigo-300">
                                            {goal}
                                        </span>
                                    </div>
                                ))}
                                {progress.personalGoals.length > 2 && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                        +{progress.personalGoals.length - 2} more goals
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Estimated Completion */}
                    {!isCompleted && estimatedCompletionDays && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Estimated Completion
                                </span>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    ~{estimatedCompletionDays} days
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Based on current pace and {formatTimeSpent(progress.estimatedTimeRemaining)} remaining
                            </p>
                        </div>
                    )}

                    {/* Completion Badge */}
                    {isCompleted && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                                        Learning Path Completed!
                                    </p>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                        Finished on {formatDate(progress.completedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-1">
                            <StatusIcon className={cn(
                                "h-4 w-4",
                                isCompleted ? "text-emerald-500" :
                                    isActive ? "text-blue-500" :
                                        progress.status === 'on-hold' ? "text-yellow-500" :
                                            "text-slate-400"
                            )} />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {progress.status === 'in-progress' ? 'Actively Learning' :
                                    progress.status === 'completed' ? 'Completed Successfully' :
                                        progress.status === 'on-hold' ? 'On Hold' :
                                            'Not Started'}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            ID: {progress.id.slice(-8)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};