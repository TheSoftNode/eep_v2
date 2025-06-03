"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FolderOpen } from 'lucide-react';
import { useGetProjectsQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import WeeklyTasks from '@/components/Dashboard/CurrentTask/WeeklyTasks';

const TasksPage = () => {
    // Fetch latest active project using the correct API structure
    const { data: projectsData, isLoading: isLoadingProjects, error } = useGetProjectsQuery({
        status: 'active',
        orderBy: 'updatedAt',
        order: 'desc',
        limit: 1 // Get only the latest project
    });

    console.log(projectsData)

    // State to hold current project ID
    const [currentProjectId, setCurrentProjectId] = useState<string>('');

    // Set current project ID from API results
    useEffect(() => {
        if (projectsData?.data && projectsData.data.length > 0) {
            const project = projectsData.data[0];
            setCurrentProjectId(project.id);
        }
    }, [projectsData]);

    // Show loading state with elegant dark mode skeleton
    if (isLoadingProjects) {
        return (
            <div className="min-h-screen dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto py-6 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Skeleton className="h-12 w-64 mb-6 dark:bg-slate-700/40 bg-slate-200/70" />
                        <div className="space-y-6">
                            <Skeleton className="h-40 w-full dark:bg-slate-700/40 bg-slate-200/70" />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className="h-24 w-full dark:bg-slate-700/40 bg-slate-200/70" />
                                ))}
                            </div>
                            <Skeleton className="h-[500px] w-full dark:bg-slate-700/40 bg-slate-200/70" />
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Show error state with proper dark mode styling
    if (error) {
        return (
            <div className="min-h-screen dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center min-h-[60vh]"
                    >
                        <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl max-w-md w-full text-center">
                            <CardContent className="p-8">
                                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
                                    <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
                                </div>
                                <h2 className="text-xl font-semibold mb-4 dark:text-white text-slate-800">Error Loading Project</h2>
                                <p className="dark:text-slate-400 text-slate-600">Unable to load project data. Please try again later.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Show empty state if no projects found with enhanced styling
    if (!projectsData?.data || projectsData.data.length === 0) {
        return (
            <div className="min-h-screen dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center min-h-[60vh]"
                    >
                        <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl max-w-md w-full text-center">
                            <CardContent className="p-8">
                                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                                    <FolderOpen className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                                </div>
                                <h2 className="text-xl font-semibold mb-4 dark:text-white text-slate-800">No Active Projects</h2>
                                <p className="dark:text-slate-400 text-slate-600">You don't have any active projects at the moment. Create a new project to get started!</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Main tasks view with proper background
    return (
        <div className="min-h-screen dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto py-6">
                {currentProjectId ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <WeeklyTasks projectId={currentProjectId} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center min-h-[60vh]"
                    >
                        <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl max-w-md w-full text-center">
                            <CardContent className="p-8">
                                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/20 dark:to-slate-700/20 flex items-center justify-center">
                                    <FolderOpen className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                                </div>
                                <h2 className="text-xl font-semibold mb-4 dark:text-white text-slate-800">No Project Selected</h2>
                                <p className="dark:text-slate-400 text-slate-600">Please select a project to view tasks.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TasksPage;