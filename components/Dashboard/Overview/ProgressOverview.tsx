"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronRight,
    Layout,
    AlertCircle,
    BarChart3,
    TrendingUp,
    Target,
    Clock,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProjectArea } from '@/Redux/types/Projects';

interface ProgressOverviewProps {
    overallProgress: number;
    projectAreas?: ProjectArea[];
    projectId?: string;
    className?: string;
}

// Utility functions
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

const getAreaStatusConfig = (status: string) => {
    switch (status) {
        case 'completed':
            return {
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
                icon: CheckCircle,
                dotColor: 'bg-emerald-500'
            };
        case 'in-progress':
            return {
                color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
                icon: Clock,
                dotColor: 'bg-blue-500'
            };
        case 'planned':
            return {
                color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
                icon: Target,
                dotColor: 'bg-slate-500'
            };
        case 'blocked':
            return {
                color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
                icon: AlertCircle,
                dotColor: 'bg-red-500'
            };
        default:
            return {
                color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
                icon: Target,
                dotColor: 'bg-slate-500'
            };
    }
};

export default function ProgressOverview({
    overallProgress,
    projectAreas = [],
    projectId,
    className = ""
}: ProgressOverviewProps) {
    // Calculate stats
    const completedAreas = projectAreas.filter(area => area.status === 'completed').length;
    const inProgressAreas = projectAreas.filter(area => area.status === 'in-progress').length;
    const averageProgress = projectAreas.length > 0
        ? Math.round(projectAreas.reduce((sum, area) => sum + area.progress, 0) / projectAreas.length)
        : 0;

    // If no project areas, display placeholder
    if (!projectAreas.length) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={className}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                    {/* Gradient accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-500" />

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-slate-500/5 to-slate-600/5 blur-2xl -mr-16 -mt-16 pointer-events-none" />

                    <CardHeader className="relative">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shadow-lg">
                                <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Project Progress
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                    No active projects to track
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="text-center py-12 relative">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 mx-auto mb-4 shadow-lg">
                            <AlertCircle className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
                            No Project Areas to Track
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            You don't have any active projects with defined areas to track progress.
                        </p>
                    </CardContent>

                    <CardFooter className="border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Link href="/dashboard/projects" className="flex items-center justify-center">
                                <Layout className="h-4 w-4 mr-2" />
                                Explore Projects
                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-80" />

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl -mr-16 -mt-16 pointer-events-none" />

                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Project Progress
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                    Track your journey through all project areas
                                </CardDescription>
                            </div>
                        </div>

                        <Badge variant="outline" className="border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400">
                            {projectAreas.length} areas
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 relative">
                    {/* Overall Progress Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Overall Completion
                                </span>
                            </div>
                            <span className={cn("text-lg font-bold", getProgressTextColor(overallProgress))}>
                                {overallProgress}%
                            </span>
                        </div>
                        <Progress
                            value={overallProgress}
                            className={cn("h-3", getProgressColor(overallProgress))}
                        />
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>{overallProgress}% complete</span>
                            <span>{100 - overallProgress}% remaining</span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">
                            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{completedAreas}</div>
                            <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Completed</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{inProgressAreas}</div>
                            <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">In Progress</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{averageProgress}%</div>
                            <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">Average</div>
                        </div>
                    </div>

                    {/* Project Areas Progress */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Layout className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                Project Areas Progress
                            </h4>
                            {projectAreas.length > 3 && (
                                <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400">
                                    Top 3 of {projectAreas.length}
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-2">
                            {projectAreas.slice(0, 3).map((area, index) => {
                                const statusConfig = getAreaStatusConfig(area.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={area.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50">
                                                    <StatusIcon className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                    {area.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={cn("text-xs", statusConfig.color)}>
                                                    <div className={cn("w-1.5 h-1.5 rounded-full mr-1", statusConfig.dotColor)}></div>
                                                    {area.status.replace('-', ' ')}
                                                </Badge>
                                                <span className={cn("text-sm font-bold", getProgressTextColor(area.progress))}>
                                                    {area.progress}%
                                                </span>
                                            </div>
                                        </div>
                                        <Progress
                                            value={area.progress}
                                            className={cn("h-2", getProgressColor(area.progress))}
                                        />
                                        {area.description && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                                                {area.description}
                                            </p>
                                        )}
                                        {(area.taskCount !== undefined && area.taskCount > 0) && (
                                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                <CheckCircle className="h-3 w-3" />
                                                <span>{area.completedTaskCount || 0}/{area.taskCount} tasks</span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}

                            {projectAreas.length > 3 && (
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-medium">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        {projectAreas.length - 3} more areas to explore
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
                    <Button
                        asChild
                        variant="ghost"
                        className="w-full group hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                        <Link
                            href={projectId ? `/Learner/dashboard/projects/${projectId}/progress` : "/dashboard/progress"}
                            className="flex items-center justify-center"
                        >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Detailed Progress
                            <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}