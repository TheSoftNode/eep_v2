"use client"

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Briefcase, Plus, ArrowRight } from 'lucide-react';
import { useGetProjectsQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { useAuth } from '@/hooks/useAuth';

export default function ProgressPage() {
    // Fetch active projects
    const { data: projectsData, isLoading } = useGetProjectsQuery({
        status: 'active',
        limit: 10
    });

    const { isAdmin } = useAuth();

    // If there are active projects, redirect to the first one's progress page
    const hasProjects = projectsData?.data && projectsData.data.length > 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-bold text-indigo-900">Progress Tracking</h1>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                    <Link href="/Learner/dashboard/projects">
                        <Briefcase className="h-4 w-4 mr-2" />
                        View Projects
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-700">Loading projects...</p>
                </div>
            ) : hasProjects ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {projectsData.data?.map(project => {
                        // Determine progress color based on completion percentage
                        let progressColor = "bg-blue-600";
                        if (project.progress < 25) {
                            progressColor = "bg-yellow-500";
                        } else if (project.progress < 50) {
                            progressColor = "bg-blue-600";
                        } else if (project.progress < 75) {
                            progressColor = "bg-indigo-600";
                        } else {
                            progressColor = "bg-green-600";
                        }

                        return (
                            <Card key={project.id} className="border-indigo-100 hover:shadow-md transition-all">
                                <CardHeader className="pb-2 bg-indigo-50/50">
                                    <CardTitle className="text-base sm:text-lg text-indigo-900 line-clamp-1">{project.name}</CardTitle>
                                    <CardDescription className="text-indigo-700 text-xs sm:text-sm line-clamp-2">{project.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-4">
                                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                                        <span className="text-xs sm:text-sm text-gray-500">Progress</span>
                                        <span className="font-medium text-xs sm:text-sm text-indigo-700">{project.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${progressColor} rounded-full`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                    <div className="mt-3 sm:mt-4">
                                        <Button asChild className="w-full text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700">
                                            <Link href={`/Learner/dashboard/projects/${project.id}/progress`}>
                                                <BarChart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                View Progress
                                                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {isAdmin() && (
                        <Card className="border-dashed border-2 border-indigo-200 flex items-center justify-center p-4 sm:p-6">
                            <Button asChild variant="outline" className="h-auto py-3 sm:py-4 flex flex-col gap-2">
                                <Link href="/learners-dashboard/projects/create">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                                    </div>
                                    <span className="text-indigo-700 text-sm sm:text-base font-medium">Create New Project</span>
                                </Link>
                            </Button>
                        </Card>
                    )}
                </div>
            ) : (
                <Card className="border-dashed border-2 border-indigo-200 bg-indigo-50/30">
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                        <BarChart className="h-12 w-12 sm:h-16 sm:w-16 text-indigo-400 mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-indigo-900 mb-2">No Active Projects</h3>
                        <p className="text-sm text-gray-600 max-w-md mb-4 sm:mb-6 px-4">
                            You don't have any active projects to track progress. Create a new project to get started.
                        </p>
                        {isAdmin() && (
                            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                                <Link href="/learners-dashboard/projects/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New Project
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}