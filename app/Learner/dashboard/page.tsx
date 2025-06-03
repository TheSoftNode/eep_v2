"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Calendar,
    CheckCircle2,
    PlusCircle,
    Terminal,
    Users,
    Brain,
    Video
} from 'lucide-react';
import Link from 'next/link';


import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProjectFeedbackQuery, useGetProjectMembersQuery, useGetProjectResourcesQuery, useGetProjectsQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { Project, ProjectArea, ProjectFeedback, ProjectMember, ProjectResource, UnifiedTask } from '@/Redux/types/Projects';
import { useGetProjectAreasQuery } from '@/Redux/apiSlices/Projects/projectAreaApiSlice';
import { useAssignTaskMutation, useGetTasksQuery, useUpdateTaskPriorityMutation, useUpdateTaskStatusMutation } from '@/Redux/apiSlices/tasks/tasksApiSlice';
import WelcomeBanner from '@/components/Dashboard/Overview/WelcomeBanner';
import ProgressOverview from '@/components/Dashboard/Overview/ProgressOverview';
import CurrentProject from '@/components/Dashboard/Overview/CurrentProject';
import RecentTasks from '@/components/Dashboard/Overview/RecentTasks';
import QuickActions from '@/components/Dashboard/Overview/QuickActions';
import UpcomingSessions from '@/components/Dashboard/Overview/UpcomingSessions';
import LearningResources from '@/components/Dashboard/Overview/LearningResources';
import RecentFeedback from '@/components/Dashboard/Overview/RecentFeedback';
import AvailableMentorsPage from '@/components/Dashboard/Overview/AvailableMentors';



// Use the existing QuickActions component (no need to redefine it)

export default function DashboardOverview() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    // Fetch latest active projects
    const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery({
        status: 'active',
        orderBy: 'updatedAt',
        order: 'desc',
        limit: 1 // Get only the latest project
    });

    // State to hold current project
    const [currentActiveProject, setCurrentActiveProject] = useState<Project | null>(null);
    const [projectAreas, setProjectAreas] = useState<ProjectArea[]>([]);
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
    const [userProjectRole, setUserProjectRole] = useState<string>("Team Member");

    // Fetch project areas separately
    const { data: areasData, isLoading: isLoadingAreas } = useGetProjectAreasQuery(
        { projectId: currentActiveProject?.id || '' },
        { skip: !currentActiveProject?.id }
    );

    // Fetch project members separately (normalized)
    const { data: membersData, isLoading: isLoadingMembers } = useGetProjectMembersQuery(
        currentActiveProject?.id || '',
        { skip: !currentActiveProject?.id }
    );

    // Fetch tasks for the current project
    const { data: tasksData, isLoading: isLoadingTasks } = useGetTasksQuery(
        { projectId: currentActiveProject?.id || '' },
        { skip: !currentActiveProject }
    );

    // Fetch project resources
    const { data: resourcesData, isLoading: isLoadingResources } = useGetProjectResourcesQuery(
        { projectId: currentActiveProject?.id || '' },
        { skip: !currentActiveProject?.id }
    );

    // Fetch project feedback
    const { data: feedbackData, isLoading: isLoadingFeedback } = useGetProjectFeedbackQuery(
        { projectId: currentActiveProject?.id || '' },
        { skip: !currentActiveProject?.id }
    );

    // API Mutations for task management
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    const [assignTask] = useAssignTaskMutation();
    const [updateTaskPriority] = useUpdateTaskPriorityMutation();

    // Set current project from API results and extract user's role
    useEffect(() => {
        if (projectsData?.data && projectsData.data.length > 0) {
            const project = projectsData.data[0];
            setCurrentActiveProject(project);

            // Find the current user's role in the project
            if (user?.id && project.memberIds) {
                const currentMember = projectMembers.find(member => member.userId === user.id);
                if (currentMember) {
                    setUserProjectRole(currentMember.role);
                } else if (project.createdBy === user.id) {
                    setUserProjectRole("Project Manager");
                }
            }
        }
    }, [projectsData, user?.id, projectMembers]);

    useEffect(() => {
        if (areasData?.data) {
            setProjectAreas(areasData.data);
        }
    }, [areasData]);

    useEffect(() => {
        if (membersData?.data) {
            setProjectMembers(membersData.data);
        }
    }, [membersData]);

    // Calculate project stats
    const overallProgress = currentActiveProject?.progress || 45;

    // Calculate current sprint/week
    const startDate = currentActiveProject ? new Date(currentActiveProject.startDate as any) : new Date();
    const currentDate = new Date();
    const weekDiff = Math.floor(((currentDate.getTime() - (startDate?.getTime() || 0)) / (7 * 24 * 60 * 60 * 1000)));
    const currentWeek = Math.max(1, Math.min(weekDiff + 1, 12));

    // Count completed tasks
    const projectTasks = tasksData?.data || [];
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    const totalTasks = projectTasks.length;

    // Calculate next deadline from project end date
    const nextDeadlineDate = currentActiveProject ? new Date(currentActiveProject.endDate as any) : new Date("2025-03-25T23:59:59");

    // Calculate time remaining until next deadline
    const now = new Date();
    const diffTime = (nextDeadlineDate?.getTime() || 0) - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    // Get current time of day for greeting
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';

    // Progress stats for welcome banner
    const progressStats = [
        {
            icon: <Calendar className="h-5 w-5" />,
            label: "Current Sprint",
            value: currentActiveProject ? `Sprint ${currentWeek} of 12` : "No active sprint",
            color: 'blue' as const,
            trend: 'neutral' as const
        },
        {
            icon: <CheckCircle2 className="h-5 w-5" />,
            label: "Completed Tasks",
            value: currentActiveProject ? `${completedTasks} of ${totalTasks}` : "No tasks",
            color: 'green' as const,
            trend: 'up' as const,
            trendValue: completedTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%'
        },
        {
            icon: <Clock className="h-5 w-5" />,
            label: "Next Deadline",
            value: currentActiveProject
                ? (diffDays > 0 ? `${diffDays}d ${diffHours}h remaining` : "Due now")
                : "No deadline",
            color: diffDays < 3 ? 'red' as const : diffDays < 7 ? 'yellow' as const : 'blue' as const
        }
    ];

    // Find tasks assigned to the current user
    const userAssignedTasks = projectTasks.filter(task =>
        task.assigneeId === user?.id
    );

    // Get all upcoming or due tasks (to-do and in-progress) sorted by priority and due date
    const activeTasks = projectTasks
        .filter(task => ['todo', 'in-progress'].includes(task.status))
        .sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            const priorityDiff = (priorityOrder[a.priority || 'medium'] || 2) - (priorityOrder[b.priority || 'medium'] || 2);

            if (priorityDiff !== 0) return priorityDiff;

            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate as any).getTime() - new Date(b.dueDate as any).getTime();
            }

            if (a.dueDate && !b.dueDate) return -1;
            if (!a.dueDate && b.dueDate) return 1;

            return 0;
        });

    // Task handlers
    const handleStatusChange = async (taskId: string, newStatus: UnifiedTask['status']) => {
        try {
            if (!currentActiveProject?.id) return;

            await updateTaskStatus({
                id: taskId,
                projectId: currentActiveProject.id,
                status: newStatus
            }).unwrap();

            toast({
                title: "Task updated",
                description: "Task status has been updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task status.",
                variant: "destructive",
            });
        }
    };

    const handlePriorityChange = async (taskId: string, newPriority: UnifiedTask['priority']) => {
        try {
            if (!currentActiveProject?.id) return;

            await updateTaskPriority({
                id: taskId,
                projectId: currentActiveProject.id,
                priority: newPriority
            }).unwrap();

            toast({
                title: "Task updated",
                description: "Task priority has been updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task priority.",
                variant: "destructive",
            });
        }
    };

    const handleAssigneeChange = async (taskId: string, assigneeId: string | null) => {
        try {
            if (!currentActiveProject?.id) return;

            await assignTask({
                id: taskId,
                projectId: currentActiveProject.id,
                assigneeId
            }).unwrap();

            toast({
                title: "Task updated",
                description: assigneeId
                    ? "Task has been assigned successfully."
                    : "Task has been unassigned.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task assignee.",
                variant: "destructive",
            });
        }
    };

    const handleTaskCreated = () => {
        setIsAddTaskModalOpen(false);
    };

    // Get project resources and feedback
    const projectResources: ProjectResource[] = resourcesData?.data || [];
    const projectFeedback: ProjectFeedback[] = feedbackData?.data || [];

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <WelcomeBanner
                    userName={user?.fullName || 'Learner'}
                    userAvatar={user?.profilePicture}
                    currentProject={currentActiveProject}
                    overallProgress={overallProgress}
                    stats={progressStats}
                    recentTasks={activeTasks.slice(0, 3)}
                    isLoading={isLoadingProjects}
                    timeOfDay={timeOfDay}
                />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progress Overview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <ProgressOverview
                        overallProgress={overallProgress}
                        projectAreas={projectAreas}
                        projectId={currentActiveProject?.id}
                    />
                </motion.div>

                {/* Current Project Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <CurrentProject
                        project={currentActiveProject}
                        overallProgress={overallProgress}
                    />
                </motion.div>
            </div>

            {/* Tasks Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="border border-indigo-100 shadow-sm rounded-lg">
                    <CardHeader className="pb-2 bg-indigo-50 border-b border-indigo-100">
                        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-lg font-semibold text-indigo-900">My Tasks</CardTitle>
                                <CardDescription>Your assigned and upcoming tasks</CardDescription>
                            </div>
                            <div className="flex gap-2 w-full xs:w-auto">
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/dashboard/tasks">View All</Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        {!isLoadingTasks && (
                            <RecentTasks
                                tasks={userAssignedTasks.length > 0 ? userAssignedTasks.slice(0, 3) : activeTasks.slice(0, 3)}
                                members={projectMembers}
                                isLoading={isLoadingTasks}
                                showProgress={true}
                                limit={3}
                            />
                        )}
                        {isLoadingTasks && (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Loading tasks...</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions & Upcoming Sessions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="h-full"
                >
                    <QuickActions className="h-full" />
                </motion.div>

            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="h-full"
            >
                {/* Use the existing UpcomingSessions component */}
                <div className="h-full">
                    <UpcomingSessions />
                </div>
            </motion.div>

            {/* Learning Resources */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <LearningResources
                    resources={projectResources}
                    projectId={currentActiveProject?.id}
                    canManage={false}
                />
            </motion.div>

            {/* Recent Feedback */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >
                <RecentFeedback
                    feedback={projectFeedback}
                    projectId={currentActiveProject?.id}
                />
            </motion.div>

            {/* Available Mentors */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                {/* Use the existing AvailableMentorsPage component */}
                <div className="">
                    <AvailableMentorsPage />
                </div>
            </motion.div>
        </div>
    );
}