"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetProjectByIdQuery, useGetProjectMembersQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { useGetProjectAreasQuery } from '@/Redux/apiSlices/Projects/projectAreaApiSlice';
import { useGetTasksQuery } from '@/Redux/apiSlices/tasks/tasksApiSlice';
import { Project, ProjectArea, ProjectMember, ProjectTask } from '@/Redux/types/Projects';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import ProgressStats from './ProgressStats';
import ProgressHeader from './ProgressHeader';
import TeamProgressTab from './TeamProgressTab';
import TasksTab from './TasksTab';
import AreasTab from './AreasTab';

export default function ProjectProgressDetail() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
    const [selectedArea, setSelectedArea] = useState<string>('all');

    // Fetch all necessary data
    const { data: projectData, isLoading: isLoadingProject } = useGetProjectByIdQuery(projectId);
    const { data: areasData, isLoading: isLoadingAreas } = useGetProjectAreasQuery({ projectId });
    const { data: tasksData, isLoading: isLoadingTasks } = useGetTasksQuery({ projectId });
    const { data: membersData, isLoading: isLoadingMembers } = useGetProjectMembersQuery(projectId);

    const [project, setProject] = useState<Project | null>(null);
    const [projectAreas, setProjectAreas] = useState<ProjectArea[]>([]);
    const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);

    useEffect(() => {
        if (projectData?.data) setProject(projectData.data);
        if (areasData?.data) setProjectAreas(areasData.data);
        if (tasksData?.data) setProjectTasks(tasksData.data);
        if (membersData?.data) setProjectMembers(membersData.data);
    }, [projectData, areasData, tasksData, membersData]);

    if (isLoadingProject || isLoadingAreas || isLoadingTasks || isLoadingMembers) {
        return <LoadingState />;
    }

    if (!project) {
        return <ErrorState />;
    }

    return (
        <div className="space-y-6">
            <Button
                variant="outline"
                size="sm"
                className="mb-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
            </Button>

            <ProgressHeader
                project={project}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
            />

            <ProgressStats project={project} tasks={projectTasks} />

            <Tabs defaultValue="areas" className="w-full">
                <TabsList className="bg-indigo-50 border border-indigo-100 p-1">
                    <TabsTrigger value="areas">Project Areas</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="team">Team Progress</TabsTrigger>
                </TabsList>

                <TabsContent value="areas" className="mt-6">
                    <AreasTab
                        projectId={projectId}
                        projectAreas={projectAreas}
                        projectTasks={projectTasks}
                        selectedArea={selectedArea}
                        setSelectedArea={setSelectedArea}
                    />
                </TabsContent>

                <TabsContent value="tasks" className="mt-6">
                    <TasksTab
                        projectTasks={projectTasks}
                        projectMembers={projectMembers}
                    />
                </TabsContent>

                <TabsContent value="team" className="mt-6">
                    <TeamProgressTab
                        projectMembers={projectMembers}
                        projectTasks={projectTasks}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
