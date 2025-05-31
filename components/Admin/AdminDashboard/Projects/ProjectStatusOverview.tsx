"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Briefcase,
    Clock,
    CheckCircle,
    AlertTriangle,
    Pause,
    Archive,
    Users,
    Calendar,
    TrendingUp,
    MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useGetProjectsQuery } from "@/Redux/apiSlices/Projects/projectsApiSlice";
import { convertFirebaseDateRobust, firebaseFormatDate } from "@/components/utils/dateUtils";

const ProjectStatusOverview: React.FC = () => {
    const router = useRouter();
    const { data: projectsData, isLoading, error } = useGetProjectsQuery({
        limit: 12,
        orderBy: 'updatedAt',
        order: 'desc'
    });

    const projects = projectsData?.data || [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Clock className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            case 'on-hold':
                return <Pause className="h-4 w-4" />;
            case 'archived':
                return <Archive className="h-4 w-4" />;
            default:
                return <AlertTriangle className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'on-hold':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'archived':
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
            default:
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'intermediate':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
            case 'advanced':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };



    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || projects.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                        <Briefcase className="h-8 w-8 mx-auto mb-2" />
                        <p>No projects available</p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate status summary
    const statusSummary = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Project Status Overview
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {projects.length} projects • {statusSummary.active || 0} active
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {Object.entries(statusSummary).map(([status, count]) => (
                        <Badge
                            key={status}
                            className={`text-xs ${getStatusColor(status)}`}
                        >
                            {count} {status}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                        onClick={() => router.push(`/admin/dashboard/projects/${project.id}`)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(project.status)}
                                <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </Badge>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="mb-3">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1">
                                {project.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {project.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <Badge className={`text-xs ${getLevelColor(project.level)}`}>
                                {project.level}
                            </Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {project.category}
                            </span>
                        </div>

                        <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {project.progress || 0}%
                                </span>
                            </div>
                            <Progress value={project.progress || 0} className="h-1.5" />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{project.memberIds?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{firebaseFormatDate(project.endDate ? convertFirebaseDateRobust(project.endDate) : project.updatedAt)}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {projects.length > 12 && (
                <div className="mt-6 text-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/dashboard/projects')}
                        className="text-sm"
                    >
                        View All Projects
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default ProjectStatusOverview;