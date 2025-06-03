"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    AlertCircle,
    Layout,
    CheckSquare,
    Target,
    BarChart3,
    Play,
    Eye,
    Building2,
    Github,
    ExternalLink,
    ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Project } from '@/Redux/types/Projects';

interface CurrentProjectProps {
    project?: Project | null;
    overallProgress?: number;
}

// Utility functions
const formatDate = (date: any) => {
    if (!date) return 'Not set';
    const dateObj = typeof date === 'string' ? new Date(date) :
        date._seconds ? new Date(date._seconds * 1000) : date;
    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const getDaysStatus = (endDate: any) => {
    if (!endDate) return { text: 'No deadline', isOverdue: false, daysLeft: 0 };

    const dateObj = typeof endDate === 'string' ? new Date(endDate) :
        endDate._seconds ? new Date(endDate._seconds * 1000) : endDate;
    const now = new Date();
    const diffTime = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true, daysLeft: diffDays };
    } else if (diffDays === 0) {
        return { text: 'Due today', isOverdue: false, daysLeft: 0 };
    } else {
        return { text: `${diffDays} days left`, isOverdue: false, daysLeft: diffDays };
    }
};

const getLevelBadgeColor = (level: string) => {
    switch (level) {
        case 'beginner':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
        case 'intermediate':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50';
        case 'advanced':
            return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
};

const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (progress >= 50) return 'text-blue-600 dark:text-blue-400';
    if (progress >= 25) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-slate-600 dark:text-slate-400';
};

const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return '[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600';
    if (progress >= 50) return '[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-600';
    if (progress >= 25) return '[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-yellow-600';
    return '[&>div]:bg-gradient-to-r [&>div]:from-slate-400 [&>div]:to-slate-500';
};

export default function CurrentProject({ project, overallProgress }: CurrentProjectProps) {
    if (!project) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm relative overflow-hidden">
                    {/* Gradient accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-500" />

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-slate-500/5 to-slate-600/5 blur-2xl -mr-16 -mt-16 pointer-events-none" />

                    <CardHeader className="pb-2 relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                                    Current Project
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
                                    No active project
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 text-xs">
                                Inactive
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 text-center py-6 relative">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 mx-auto mb-3 shadow-lg">
                            <AlertCircle className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-1">No Active Project</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            You are not currently assigned to any project. Join an existing project or create a new one to get started.
                        </p>
                    </CardContent>

                    <CardFooter className="grid grid-cols-2 gap-2 p-4 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 border-t border-slate-200/70 dark:border-slate-700/70">
                        <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-8">
                            <Link href="/dashboard/projects/join">
                                <Play className="h-3 w-3 mr-1" />
                                Join Project
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors h-8">
                            <Link href="/dashboard/projects">
                                <Eye className="h-3 w-3 mr-1" />
                                Browse Projects
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        );
    }

    const daysStatus = getDaysStatus(project.endDate);
    const progress = overallProgress ?? project.progress;
    const totalTasks = project.taskCount || 0;
    const completedTasks = project.completedTaskCount || 0;
    const totalAreas = project.areaCount || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="w-full"
        >
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-900/20 transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm relative overflow-hidden group">
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-80" />

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl -mr-16 -mt-16 pointer-events-none" />

                <CardHeader className="pb-2 relative">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                                Current Project
                            </CardTitle>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <Badge variant="outline" className="text-xs capitalize font-medium border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400">
                                    <Building2 className="h-3 w-3 mr-0.5" />
                                    {project.category?.replace('-', ' ')}
                                </Badge>
                                <Badge className={cn("text-xs font-medium border", getLevelBadgeColor(project.level))}>
                                    <Target className="h-3 w-3 mr-0.5" />
                                    {project.level}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 text-xs font-medium border">
                                <div className="w-1.5 h-1.5 rounded-full mr-1 bg-emerald-500"></div>
                                Active
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3 relative py-3">
                    {/* Project Name and Description */}
                    <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {project.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 4).map((tech, index) => (
                                <Badge key={index} variant="secondary" className="text-xs py-0.5 px-1.5 h-5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-0">
                                    {tech}
                                </Badge>
                            ))}
                            {project.technologies.length > 4 && (
                                <Badge variant="secondary" className="text-xs py-0.5 px-1.5 h-5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    +{project.technologies.length - 4} more
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Progress Section */}
                    <div className="space-y-2 p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <BarChart3 className="h-3 w-3 text-indigo-500" />
                                Overall Progress
                            </span>
                            <span className={cn("text-xs font-bold", getProgressColor(progress))}>
                                {progress}%
                            </span>
                        </div>
                        <Progress
                            value={progress}
                            className={cn("h-2 bg-slate-200 dark:bg-slate-700", getProgressBarColor(progress))}
                        />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
                                <Layout className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Areas</p>
                                <p className="text-base font-bold text-indigo-700 dark:text-indigo-300">{totalAreas}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                                <CheckSquare className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Tasks</p>
                                <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                                    {completedTasks}/{totalTasks}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="space-y-2 p-3 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-900/10 dark:to-blue-800/5 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-blue-700 dark:text-blue-300 flex items-center font-medium">
                                <Calendar className="h-3 w-3 mr-1" />
                                Timeline
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">Start Date</span>
                                <p className="text-slate-900 dark:text-white font-semibold">{formatDate(project.startDate)}</p>
                            </div>
                            <div>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">Due Date</span>
                                <p className="text-slate-900 dark:text-white font-semibold">{formatDate(project.endDate)}</p>
                            </div>
                        </div>

                        {/* Days Remaining */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-blue-200/50 dark:border-blue-800/30">
                            <span className="text-blue-600 dark:text-blue-400 flex items-center text-xs font-medium">
                                <Clock className="h-3 w-3 mr-1" />
                                Time Remaining
                            </span>
                            <span className={cn(
                                "text-xs font-bold",
                                daysStatus.isOverdue ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"
                            )}>
                                {daysStatus.text}
                            </span>
                        </div>
                    </div>

                    {/* Project Links */}
                    {(project.repoUrl || project.demoUrl) && (
                        <div className="flex items-center gap-1.5">
                            {project.repoUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 h-7"
                                    onClick={() => window.open(project.repoUrl!, '_blank')}
                                >
                                    <Github className="h-3 w-3 mr-1" />
                                    Repository
                                </Button>
                            )}
                            {project.demoUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 h-7"
                                    onClick={() => window.open(project.demoUrl!, '_blank')}
                                >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Live Demo
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="grid grid-cols-2 gap-2 p-4 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 border-t border-slate-200/70 dark:border-slate-700/70">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group h-8">
                        <Link href={"/Learner/dashboard/workspaces"} className="flex items-center">
                            <Play className="h-3 w-3 mr-1 group-hover:translate-x-0.5 transition-transform" />
                            Continue Working
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group h-8">
                        <Link href={`/Learner/dashboard/projects/${project?.id || 'current'}`} className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                            <ChevronRight className="h-3 w-3 ml-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

