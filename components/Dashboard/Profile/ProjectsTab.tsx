import React from 'react';
import { Code, ArrowRight, Plus, Clock, CheckCircle, AlertTriangle, Tag } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmptyState from './EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ProjectSummary } from '@/Redux/types/Users/profile';

interface ProjectsTabProps {
    projects?: string[];
    projectDetails?: ProjectSummary[];
    isLoading?: boolean;
    className?: string;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
    projects,
    projectDetails,
    isLoading = false,
    className
}) => {
    const { user } = useAuth();
    const isAdminOrMentor = user?.role === 'admin' || user?.role === 'mentor';
    const router = useRouter();

    // Format relative date with more precise options
    const formatDate = (dateValue?: any): string => {
        if (!dateValue) return "";

        let date: Date;

        // Check if we're dealing with a Firestore timestamp object
        if (dateValue && typeof dateValue === 'object' && '_seconds' in dateValue) {
            // Convert Firestore timestamp to JavaScript Date
            date = new Date(dateValue._seconds * 1000);
        } else {
            // Handle regular string dates
            date = new Date(dateValue);
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return "Unknown date";
        }

        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 5) {
            return "Just now";
        } else if (diffMinutes < 60) {
            return `${diffMinutes} min ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        } else if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 30) {
            return `${diffDays} days ago`;
        } else {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
        }
    };

    // Get appropriate status badge with icon
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return (
                    <Badge className="bg-green-100 text-green-800 border-0 dark:bg-green-900/40 dark:text-green-300 dark:border dark:border-green-800/50 flex items-center gap-1 py-0.5">
                        <CheckCircle className="h-3 w-3" />
                        <span>Active</span>
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge variant="outline" className="text-blue-800 border-blue-200 dark:text-blue-300 dark:border-blue-800/50 flex items-center gap-1 py-0.5">
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed</span>
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-amber-100 text-amber-800 border-0 dark:bg-amber-900/40 dark:text-amber-300 dark:border dark:border-amber-800/50 flex items-center gap-1 py-0.5">
                        <Clock className="h-3 w-3" />
                        <span>Pending</span>
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-gray-600 border-gray-200 dark:text-gray-300 dark:border-gray-700 flex items-center gap-1 py-0.5">
                        <Tag className="h-3 w-3" />
                        <span>{status}</span>
                    </Badge>
                );
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn("", className)}
        >
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 shadow-lg border-0 overflow-hidden relative">
                {/* Decorative top gradient */}
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 relative overflow-hidden">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                </div>

                <CardHeader className="pb-2 pt-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl text-gray-800 dark:text-gray-100 flex items-center">
                                <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 mr-2">
                                    <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                My Projects
                            </CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400 mt-1 ml-9">
                                Projects you're a part of
                            </CardDescription>
                        </div>
                        {isAdminOrMentor && (
                            <Button
                                onClick={() => router.push("/learners-dashboard/projects/create")}
                                size="sm"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm border-0 hover:shadow transition-all duration-200"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                <span>New Project</span>
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="px-6">
                    {isLoading ? (
                        <div className="py-8 flex justify-center">
                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading projects...</p>
                            </div>
                        </div>
                    ) : !projects || projects.length === 0 ? (
                        <EmptyState
                            icon={<Code className="h-6 w-6" />}
                            title="No projects yet"
                            description="Create a new project or join an existing one."
                            actionLabel={isAdminOrMentor ? "Create Your First Project" : "Browse Available Projects"}
                            variant="indigo"
                        />
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-3"
                        >
                            <AnimatePresence>
                                {projectDetails ? (
                                    // Display project details if available
                                    projectDetails.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            variants={itemVariants}
                                            exit={{ opacity: 0, y: -10 }}
                                            whileHover={{ translateX: 4, transition: { duration: 0.1 } }}
                                            className={cn(
                                                "flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800",
                                                "rounded-xl hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all duration-200 group",
                                                "backdrop-blur-sm hover:shadow-sm"
                                            )}
                                            onClick={() => router.push(`/learners-dashboard/projects/${project.id}`)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                                                    <Code className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                                                        {project.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 mr-1.5"></span>
                                                        Updated {formatDate(project.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(project.status)}
                                                <div className="h-7 w-7 rounded-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800/30 transition-colors">
                                                    <ArrowRight className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    // Fallback if only project IDs are available - with skeleton info
                                    projects.map((projectId, index) => (
                                        <motion.div
                                            key={projectId}
                                            variants={itemVariants}
                                            exit={{ opacity: 0, y: -10 }}
                                            whileHover={{ translateX: 4, transition: { duration: 0.1 } }}
                                            className={cn(
                                                "flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800",
                                                "rounded-xl hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all duration-200 group",
                                                "backdrop-blur-sm hover:shadow-sm"
                                            )}
                                            onClick={() => router.push(`/learners-dashboard/projects/${projectId}`)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                                                    <Code className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                                                        Project {projectId.substring(0, 6)}...
                                                    </h3>
                                                    <div className="flex items-center mt-0.5">
                                                        <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 px-1.5 py-0">
                                                            ID: {projectId.substring(0, 8)}...
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-7 w-7 rounded-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800/30 transition-colors">
                                                <ArrowRight className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-2">
                    <Button
                        onClick={() => router.push("/learners-dashboard/projects")}
                        variant="outline"
                        className="w-full border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200"
                    >
                        View All Projects
                    </Button>
                </CardFooter>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 w-12 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-xl -mr-6 rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 blur-xl -ml-6 -mb-6 rounded-full pointer-events-none"></div>
            </Card>
        </motion.div>
    );
};

export default ProjectsTab;