import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Rocket,
    AlertTriangle,
    RefreshCw,
    Plus,
    Sparkles,
    FolderOpen,
    Search,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/Redux/types/Projects';
import ProjectSkeletons from './ProjectSkeletons';
import ProjectCard from './ProjectCard';

interface DaysStatus {
    text: string;
    isOverdue: boolean;
}

interface ProjectGridProps {
    projects: Project[];
    isLoading: boolean;
    isError?: boolean;
    error?: string;
    onProjectClick: (id: string) => void;
    onEditProject?: (id: string) => void;
    onViewAnalytics?: (id: string) => void;
    onCreateProject?: () => void;
    formatDate: (date: string | Date) => string;
    getDaysStatus: (date: string | Date) => DaysStatus;
    onRetry?: () => void;
    className?: string;
    showCreateButton?: boolean;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
    gridColumns?: 'auto' | '1' | '2' | '3' | '4';
    showStats?: boolean;
    totalCount?: number;
    loadingCount?: number;
}

// Animation variants for the grid
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24
        }
    }
};

const getGridColumns = (columns?: string) => {
    switch (columns) {
        case '1': return 'grid-cols-1';
        case '2': return 'grid-cols-1 lg:grid-cols-2';
        case '3': return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
        case '4': return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
        case 'auto':
        default: return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
    }
};

const ProjectGrid: React.FC<ProjectGridProps> = ({
    projects,
    isLoading,
    isError = false,
    error,
    onProjectClick,
    onEditProject,
    onViewAnalytics,
    onCreateProject,
    onRetry,
    className = "",
    showCreateButton = false,
    emptyStateTitle = "No projects found",
    emptyStateDescription = "Create your first project to get started with project management",
    gridColumns = 'auto',
    showStats = false,
    totalCount,
    loadingCount = 6
}) => {
    // Loading State
    if (isLoading) {
        return (
            <div className={cn("space-y-6", className)}>
                {showStats && (
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                            <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
                        </div>
                    </div>
                )}
                <ProjectSkeletons count={loadingCount} />
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className={cn("space-y-6", className)}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                >
                    <Alert className="max-w-md border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <AlertTitle className="text-red-800 dark:text-red-300 font-semibold">
                            Error loading projects
                        </AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-400 mt-2">
                            {error || "Failed to load projects. Please check your connection and try again."}
                        </AlertDescription>
                        {onRetry && (
                            <div className="mt-4 flex gap-2">
                                <Button
                                    onClick={onRetry}
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </Alert>
                </motion.div>
            </div>
        );
    }

    // Empty State
    if (projects.length === 0) {
        return (
            <div className={cn("space-y-6", className)}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-20"
                >
                    {/* Animated background decoration */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 blur-2xl opacity-60 animate-pulse" />
                        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25">
                            <FolderOpen className="h-12 w-12 text-white" />
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -top-2 -right-2"
                            >
                                <Sparkles className="h-6 w-6 text-yellow-400" />
                            </motion.div>
                        </div>
                    </div>

                    <div className="text-center space-y-4 max-w-md">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {emptyStateTitle}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {emptyStateDescription}
                        </p>

                        {showCreateButton && onCreateProject && (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="pt-4"
                            >
                                <Button
                                    onClick={onCreateProject}
                                    size="lg"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create Your First Project
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-indigo-300 dark:bg-indigo-600 animate-ping opacity-20" />
                    <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-purple-300 dark:bg-purple-600 animate-ping opacity-30 animation-delay-1000" />
                    <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-blue-300 dark:bg-blue-600 animate-ping opacity-25 animation-delay-2000" />
                </motion.div>
            </div>
        );
    }

    // Projects Grid
    return (
        <div className={cn("space-y-6", className)}>
            {/* Stats Header */}
            {showStats && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Rocket className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            Projects Dashboard
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {totalCount ? `Showing ${projects.length} of ${totalCount} projects` : `${projects.length} projects`}
                        </p>
                    </div>

                    {showCreateButton && onCreateProject && (
                        <Button
                            onClick={onCreateProject}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Project
                        </Button>
                    )}
                </motion.div>
            )}

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="projects-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                        "grid gap-6",
                        getGridColumns(gridColumns)
                    )}
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            layout
                            className="h-fit"
                        >
                            <ProjectCard
                                project={project}
                                onProjectClick={onProjectClick}
                                onEditProject={onEditProject}
                                onViewAnalytics={onViewAnalytics}
                                showActions={true}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Load More Button (if needed) */}
            {totalCount && projects.length < totalCount && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center pt-8"
                >
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Load More Projects
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default ProjectGrid;