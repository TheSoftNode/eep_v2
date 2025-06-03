import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Clock,
    ChevronRight,
    Layout,
    CheckSquare,
    Users,
    Github,
    ExternalLink,
    Target,
    BarChart3,
    AlertCircle,
    CheckCircle,
    Play,
    Pause,
    Archive,
    Star,
    Eye,
    Edit3,
    MoreVertical,
    TrendingUp,
    UserCheck,
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/Redux/types/Projects";
import { useGetProjectMembersQuery } from "@/Redux/apiSlices/Projects/projectsApiSlice";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProjectAreasQuery } from "@/Redux/apiSlices/Projects/projectAreaApiSlice";
import { useAuth } from "@/hooks/useAuth";

interface ProjectCardProps {
    project: Project;
    onProjectClick: (id: string) => void;
    onEditProject?: (id: string) => void;
    onViewAnalytics?: (id: string) => void;
    className?: string;
    showActions?: boolean;
    variant?: 'default' | 'compact' | 'detailed';
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

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'active':
            return {
                label: 'Active',
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
                icon: Play,
                dotColor: 'bg-emerald-500',
                gradient: 'from-emerald-500/20 to-emerald-600/10'
            };
        case 'completed':
            return {
                label: 'Completed',
                color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
                icon: CheckCircle,
                dotColor: 'bg-blue-500',
                gradient: 'from-blue-500/20 to-blue-600/10'
            };
        case 'on-hold':
            return {
                label: 'On Hold',
                color: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50',
                icon: Pause,
                dotColor: 'bg-yellow-500',
                gradient: 'from-yellow-500/20 to-yellow-600/10'
            };
        case 'archived':
            return {
                label: 'Archived',
                color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                icon: Archive,
                dotColor: 'bg-slate-500',
                gradient: 'from-slate-500/20 to-slate-600/10'
            };
        default:
            return {
                label: 'Unknown',
                color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                icon: AlertCircle,
                dotColor: 'bg-slate-500',
                gradient: 'from-slate-500/20 to-slate-600/10'
            };
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

const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onProjectClick,
    onEditProject,
    onViewAnalytics,
    className = "",
    showActions = true,
    variant = 'default'
}) => {
    // Fetch project areas using the correct API
    const { data: areasResponse, isLoading: areasLoading } = useGetProjectAreasQuery({
        projectId: project.id,
        limit: 3,
        sortBy: 'order',
        sortOrder: 'asc'
    });

    const { isAdmin, isMentor } = useAuth();

    const canManage = isAdmin() || isMentor();

    // Fetch project members using the correct API
    const { data: membersResponse, isLoading: membersLoading } = useGetProjectMembersQuery(project.id);

    const projectAreas = areasResponse?.data || [];
    const projectMembers = membersResponse?.data || [];

    const statusConfig = getStatusConfig(project.status);
    const daysStatus = getDaysStatus(project.endDate);
    const isCompletedOrArchived = project.status === 'completed' || project.status === 'archived';

    const hasAreas = projectAreas.length > 0;
    const totalTasks = project.taskCount || 0;
    const completedTasks = project.completedTaskCount || 0;
    const totalAreas = project.areaCount || projectAreas.length;

    // Display up to 3 members with avatars
    const displayMembers = projectMembers.slice(0, 3);
    const extraMembersCount = Math.max(0, projectMembers.length - 3);

    const handleCardClick = () => {
        onProjectClick(project.id);
    };

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={className}
        >
            <Card
                className="cursor-pointer transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xl dark:hover:shadow-indigo-900/20 group bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm relative overflow-hidden"
                onClick={handleCardClick}
            >
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity" />

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl -mr-16 -mt-16 pointer-events-none" />

                <CardHeader className="pb-4 relative">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white truncate mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {project.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs capitalize font-medium border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400">
                                    <Building2 className="h-3 w-3 mr-1" />
                                    {project.category?.replace('-', ' ')}
                                </Badge>
                                <Badge className={cn("text-xs font-medium border", getLevelBadgeColor(project.level))}>
                                    <Target className="h-3 w-3 mr-1" />
                                    {project.level}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs font-medium border", statusConfig.color)}>
                                <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", statusConfig.dotColor)}></div>
                                {statusConfig.label}
                            </Badge>

                            {showActions && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={(e) => handleActionClick(e, () => onProjectClick(project.id))}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>
                                        {canManage && onEditProject && (
                                            <DropdownMenuItem onClick={(e) => handleActionClick(e, () => onEditProject(project.id))}>
                                                <Edit3 className="h-4 w-4 mr-2" />
                                                Edit Project
                                            </DropdownMenuItem>
                                        )}
                                        {canManage && onViewAnalytics && (
                                            <DropdownMenuItem onClick={(e) => handleActionClick(e, () => onViewAnalytics(project.id))}>
                                                <TrendingUp className="h-4 w-4 mr-2" />
                                                View Analytics
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5 relative">
                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 4).map((tech, index) => (
                                <Badge key={index} variant="secondary" className="text-xs py-1 px-2 h-6 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-0">
                                    {tech}
                                </Badge>
                            ))}
                            {project.technologies.length > 4 && (
                                <Badge variant="secondary" className="text-xs py-1 px-2 h-6 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    +{project.technologies.length - 4} more
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Progress Section */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-indigo-500" />
                                Overall Progress
                            </span>
                            <span className={cn("text-sm font-bold", getProgressColor(project.progress))}>
                                {project.progress}%
                            </span>
                        </div>
                        <Progress
                            value={project.progress}
                            className={cn("h-2.5 bg-slate-200 dark:bg-slate-700", getProgressBarColor(project.progress))}
                        />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
                                <Layout className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Areas</p>
                                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{totalAreas}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                                <CheckSquare className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Tasks</p>
                                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                    {completedTasks}/{totalTasks}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Project Areas Preview */}
                    {hasAreas && !areasLoading && (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white/50 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100/80 dark:from-slate-800 dark:to-slate-700/80 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <Layout className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Project Areas
                                    </span>
                                </div>
                                <Badge variant="outline" className="text-xs font-medium">
                                    {projectAreas.length} total
                                </Badge>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {projectAreas.slice(0, 2).map((area) => (
                                    <div key={area.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                {area.name}
                                            </span>
                                            <Badge variant="secondary" className="text-xs ml-2 font-medium">
                                                {area.progress}%
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={area.progress}
                                            className={cn("h-2", getProgressBarColor(area.progress))}
                                        />
                                        {area.taskCount && area.taskCount > 0 && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <CheckSquare className="h-3 w-3 text-slate-400" />
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                    {area.taskCount} tasks
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {projectAreas.length > 2 && (
                                <div className="p-2 text-center bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                        View {projectAreas.length - 2} more areas →
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Team Members and Links */}
                    <div className="flex items-center justify-between">
                        {/* Team Members */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Team</span>
                            </div>

                            {!membersLoading && displayMembers.length > 0 ? (
                                <div className="flex -space-x-2">
                                    {displayMembers.map((member) => (
                                        <Avatar key={member.id} className="w-7 h-7 border-2 border-white dark:border-slate-900 shadow-sm">
                                            {member.avatar ? (
                                                <AvatarImage src={member.avatar} alt={member.name} />
                                            ) : (
                                                <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                                                    {getUserInitials(member.name)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                    ))}
                                    {extraMembersCount > 0 && (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-sm">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                +{extraMembersCount}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500">No members</span>
                            )}
                        </div>

                        {/* Project Links */}
                        <div className="flex items-center gap-1">
                            {project.repoUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                    onClick={(e) => handleActionClick(e, () => window.open(project.repoUrl!, '_blank'))}
                                >
                                    <Github className="h-4 w-4" />
                                </Button>
                            )}
                            {project.demoUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                    onClick={(e) => handleActionClick(e, () => window.open(project.demoUrl!, '_blank'))}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
                    {/* Timeline */}
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {formatDate(project.startDate)} → {formatDate(project.endDate)}
                        </span>
                    </div>

                    {/* Days Status */}
                    <div className="flex items-center gap-2">
                        {!isCompletedOrArchived && (
                            <>
                                <Clock className={cn(
                                    "h-4 w-4",
                                    daysStatus.isOverdue ? "text-red-500" : "text-indigo-500"
                                )} />
                                <span className={cn(
                                    "text-xs font-semibold",
                                    daysStatus.isOverdue ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400"
                                )}>
                                    {daysStatus.text}
                                </span>
                            </>
                        )}
                        <ChevronRight className="h-4 w-4 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ml-1" />
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default ProjectCard;