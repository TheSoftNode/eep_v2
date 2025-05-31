import { Calendar, Clock, Github, Link as LinkIcon, Layout, Target, Users, BarChart3, ExternalLink, Star, Zap, BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Project, ProjectArea } from '@/Redux/types/Projects';
import { useToast } from '@/hooks/use-toast';
import { firebaseFormatDate, getDaysStatus } from '@/components/utils/dateUtils';
import { cn } from '@/lib/utils';
import ProjectStatusBadge from './ProjectStatusBadge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ProjectAreaSection from '../Areas/ProjectAreaSection';
import { useGetProjectAreasQuery, useUpdateProjectAreaMutation } from '@/Redux/apiSlices/Projects/projectAreaApiSlice';
import { getProgressColor } from '@/components/utils/projectUtils';

interface ProjectOverviewProps {
    project: Project;
    className?: string;
    canManage?: boolean;
}

export default function ProjectOverview({
    project,
    className = "",
    canManage = true
}: ProjectOverviewProps) {
    const { toast } = useToast();
    const daysStatus = getDaysStatus(project.endDate);
    const isCompletedOrArchived = project.status === 'completed' || project.status === 'archived';
    const hasLinks = project.repoUrl || project.demoUrl;
    const hasTechnologies = project.technologies?.length > 0;
    const hasLearningObjectives = project.learningObjectives?.length > 0;

    // Fetch project areas using the normalized API
    const {
        data: areasResponse,
        isLoading: isLoadingAreas,
        error: areasError
    } = useGetProjectAreasQuery({ projectId: project.id });

    const projectAreas = areasResponse?.data || [];
    const [updateArea] = useUpdateProjectAreaMutation();

    // Handle area progress update
    const handleUpdateAreaProgress = async (area: ProjectArea, newProgress: number) => {
        try {
            await updateArea({
                projectId: project.id,
                areaId: area.id,
                progress: newProgress
            }).unwrap();

            toast({
                title: "Progress Updated",
                description: `${area.name} progress updated to ${newProgress}%`,
            });

            return Promise.resolve();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to update area progress. Please try again.",
                variant: "destructive",
            });

            return Promise.reject(error);
        }
    };

    // Calculate project stats
    const projectStats = {
        totalAreas: projectAreas.length,
        completedAreas: projectAreas.filter(area => area.status === 'completed').length,
        totalTasks: projectAreas.reduce((sum, area) => sum + (area.taskCount || 0), 0),
        completedTasks: projectAreas.reduce((sum, area) => sum + (area.completedTaskCount || 0), 0),
        estimatedHours: project.totalEstimatedHours || 0,
        actualHours: project.actualHours || 0
    };

    // Calculate efficiency percentage
    const efficiencyRate = projectStats.estimatedHours > 0
        ? Math.round((projectStats.actualHours / projectStats.estimatedHours) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className={cn(
                "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm relative overflow-hidden",
                className
            )}>
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/5 to-pink-500/5 blur-2xl -ml-12 -mb-12 pointer-events-none" />

                <CardHeader className="bg-gradient-to-br from-slate-50/80 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200/70 dark:border-slate-700/50 p-6 relative backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                                    <Layout className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                        {project.name}
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">
                                        {project.category} {project.level && (
                                            <>• <span className="capitalize">{project.level} Level</span></>
                                        )}
                                    </CardDescription>
                                </div>
                            </div>

                            {project.description && (
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                                    {project.description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                            <ProjectStatusBadge status={project.status} size="lg" />

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 lg:min-w-[200px]">
                                <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{project.progress}%</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Progress</div>
                                </div>
                                <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{projectStats.totalAreas}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Areas</div>
                                </div>
                                <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{projectStats.completedTasks}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Done</div>
                                </div>
                                <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{projectStats.totalTasks}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Tasks</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-8 relative">
                    {/* Enhanced Progress Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-600" />
                                Project Progress
                            </h3>
                            {project.status === 'completed' && (
                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-none shadow-sm">
                                    <Award className="h-3 w-3 mr-1" />
                                    Completed
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Overall Progress
                                </span>
                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                    {project.progress}%
                                </span>
                            </div>
                            <Progress
                                value={project.progress}
                                className={cn("h-3 shadow-inner", getProgressColor(project.progress))}
                            />
                            {project.status !== 'completed' && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {100 - project.progress}% remaining to completion
                                </p>
                            )}
                        </div>

                        {/* Detailed Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{projectStats.completedAreas}</div>
                                <div className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Areas Complete</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">of {projectStats.totalAreas}</div>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{projectStats.completedTasks}</div>
                                <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">Tasks Done</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">of {projectStats.totalTasks}</div>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{projectStats.estimatedHours}h</div>
                                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Estimated</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">time needed</div>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{projectStats.actualHours}h</div>
                                <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Actual</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">time spent</div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Enhanced Timeline Section */}
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                        <Calendar className="h-4 w-4" />
                                        Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800/50 mr-3">
                                            <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium">Start: {firebaseFormatDate(project.startDate)}</div>
                                            <div className="font-medium">End: {firebaseFormatDate(project.endDate)}</div>
                                        </div>
                                    </div>
                                    {!isCompletedOrArchived && (
                                        <div className="flex items-center text-sm pt-2 border-t border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-800/50 mr-3">
                                                <Clock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className={cn(
                                                "font-medium",
                                                daysStatus.isOverdue ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                                            )}>
                                                {daysStatus.text}
                                            </span>
                                            {daysStatus.isOverdue && (
                                                <Badge variant="outline" className="ml-2 text-xs text-red-600 border-red-300 dark:text-red-400 dark:border-red-800">
                                                    Overdue
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Enhanced Technologies Section */}
                            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                                        <Zap className="h-4 w-4" />
                                        Technologies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {hasTechnologies ? (
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, i) => (
                                                <Tooltip key={`${tech}-${i}`}>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700 transition-colors cursor-pointer shadow-sm"
                                                        >
                                                            <Zap className="h-3 w-3 mr-1" />
                                                            {tech}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="bg-emerald-600 text-white border-none">
                                                        <p>{tech}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <Zap className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                            <p className="text-sm text-slate-500 dark:text-slate-400">No technologies specified</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Learning Objectives Section */}
                            {hasLearningObjectives && (
                                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2 text-amber-900 dark:text-amber-100">
                                            <Target className="h-4 w-4" />
                                            Learning Objectives
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {project.learningObjectives.slice(0, 3).map((objective, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                                    <span className="text-slate-700 dark:text-slate-300">{objective}</span>
                                                </div>
                                            ))}
                                            {project.learningObjectives.length > 3 && (
                                                <div className="text-xs text-amber-700 dark:text-amber-300 font-medium pt-1">
                                                    +{project.learningObjectives.length - 3} more objectives
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>

                        {/* Right Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Enhanced Links Section */}
                            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800/50 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2 text-purple-900 dark:text-purple-100">
                                        <ExternalLink className="h-4 w-4" />
                                        Project Links
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {project.repoUrl && (
                                            <a
                                                href={project.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 hover:shadow-md group"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 mr-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                                    <Github className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        View Repository
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                        {new URL(project.repoUrl).hostname}
                                                    </div>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-md group"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 mr-3 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                                                    <LinkIcon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                        View Live Demo
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                        {new URL(project.demoUrl).hostname}
                                                    </div>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                                            </a>
                                        )}
                                        {!hasLinks && (
                                            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                                <LinkIcon className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                                <p className="text-sm text-slate-500 dark:text-slate-400">No links available</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Project Metrics */}
                            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
                                        <BarChart3 className="h-4 w-4" />
                                        Project Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-indigo-600" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Team Size</span>
                                            </div>
                                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                                {project.memberIds?.length || 0} members
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Layout className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Areas</span>
                                            </div>
                                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                                {projectStats.completedAreas}/{projectStats.totalAreas}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-amber-600" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Efficiency</span>
                                            </div>
                                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                                {efficiencyRate}%
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Completion Criteria */}
                            {project.completionCriteria && project.completionCriteria.length > 0 && (
                                <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800/50 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2 text-rose-900 dark:text-rose-100">
                                            <Target className="h-4 w-4" />
                                            Completion Criteria
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {project.completionCriteria.slice(0, 3).map((criterion, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                                                    <span className="text-slate-700 dark:text-slate-300">{criterion}</span>
                                                </div>
                                            ))}
                                            {project.completionCriteria.length > 3 && (
                                                <div className="text-xs text-rose-700 dark:text-rose-300 font-medium pt-1">
                                                    +{project.completionCriteria.length - 3} more criteria
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </div>

                    {/* Project Areas Section */}
                    {projectAreas.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <ProjectAreaSection
                                project={project}
                                projectAreas={projectAreas}
                                canManage={canManage}
                            />
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

