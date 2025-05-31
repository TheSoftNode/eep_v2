"use client"

import React from 'react';
import { notFound } from 'next/navigation';
import { useGetProjectByIdQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import LoadingState from '@/components/Dashboard/Progress/LoadingState';
import ProjectProgressDetail from '@/components/Dashboard/Progress/ProjectProgressDetail';

interface ProjectProgressPageProps {
    params: {
        id: string;
    };
}

export default function ProjectProgressPage({ params }: ProjectProgressPageProps) {
    const { id } = params;

    const projectId = id;

    // Fetch project data for this specific project
    const { data: projectData, isLoading, error } = useGetProjectByIdQuery(projectId);

    // Show loading state
    if (isLoading) {
        return <LoadingState />;
    }

    // Show 404 if project not found
    if (error || !projectData?.data) {
        return notFound();
    }

    return <ProjectProgressDetail />;
}