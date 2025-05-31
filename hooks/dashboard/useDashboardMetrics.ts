"use client";

import { useMemo } from "react";
import { useGetUserStatsQuery } from "@/Redux/apiSlices/users/adminApi";
import { useGetAllWorkspacesQuery } from "@/Redux/apiSlices/workspaces/workspaceApi";
import { useGetProjectsQuery } from "@/Redux/apiSlices/Projects/projectsApiSlice";

export interface DashboardMetrics {
    users: {
        total: number;
        active: number;
        newThisMonth: number;
        growthRate: number;
        byRole: Record<string, number>;
    };
    workspaces: {
        total: number;
        active: number;
        byStatus: Record<string, number>;
        averageMembers: number;
    };
    projects: {
        total: number;
        active: number;
        completed: number;
        completionRate: number;
        byStatus: Record<string, number>;
        averageProgress: number; // Add this for better project insights
    };
    systemHealth: {
        overall: number;
        services: Array<{
            name: string;
            status: 'healthy' | 'warning' | 'error';
            uptime: number;
            responseTime?: number;
        }>;
    };
}

export const useDashboardMetrics = () => {
    // Fetch data from APIs - removed task query since tasks are project-specific
    const { data: userStats, isLoading: isLoadingUsers, error: userError } = useGetUserStatsQuery();

    const { data: workspacesData, isLoading: isLoadingWorkspaces, error: workspaceError } = useGetAllWorkspacesQuery({
        limit: 100, // Get more for accurate stats
        includeMemberCount: true,
        includeProjects: false
    });

    const { data: projectsData, isLoading: isLoadingProjects, error: projectError } = useGetProjectsQuery({
        limit: 100, // Get more for accurate stats
    });


    // Calculate comprehensive metrics
    const metrics: DashboardMetrics | null = useMemo(() => {
        if (!userStats?.data && !workspacesData && !projectsData) {
            return null;
        }

        // User metrics
        const users = {
            total: userStats?.data?.totalUsers || 0,
            active: userStats?.data?.activeUsers || 0,
            newThisMonth: userStats?.data?.recentUsers || 0,
            growthRate: userStats?.data?.growthRate || 0,
            byRole: userStats?.data?.byRole || {}
        };

        // Workspace metrics
        const workspaces = workspacesData?.data || [];
        const workspaceMetrics = {
            total: workspacesData?.totalCount || 0,
            active: workspaces.filter(w => w.status === 'active').length,
            byStatus: workspaces.reduce((acc, w) => {
                acc[w.status] = (acc[w.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            averageMembers: workspaces.length > 0
                ? Math.round(workspaces.reduce((acc, w) => acc + w.memberCount, 0) / workspaces.length)
                : 0
        };

        // Project metrics - enhanced with progress information
        const projects = projectsData?.data || [];
        const projectMetrics = {
            total: projectsData?.count || 0,
            active: projects.filter(p => p.status === 'active').length,
            completed: projects.filter(p => p.status === 'completed').length,
            completionRate: projects.length > 0
                ? Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100)
                : 0,
            byStatus: projects.reduce((acc, p) => {
                acc[p.status] = (acc[p.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            averageProgress: projects.length > 0
                ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)
                : 0
        };

        // System health (this would typically come from monitoring services)
        const systemHealth = {
            overall: 98.5,
            services: [
                { name: 'API Server', status: 'healthy' as const, uptime: 99.9, responseTime: 120 },
                { name: 'Database', status: 'healthy' as const, uptime: 99.8, responseTime: 45 },
                { name: 'File Storage', status: 'warning' as const, uptime: 98.5, responseTime: 230 },
                { name: 'CDN', status: 'healthy' as const, uptime: 99.9, responseTime: 80 }
            ]
        };

        return {
            users,
            workspaces: workspaceMetrics,
            projects: projectMetrics,
            systemHealth
        };
    }, [userStats, workspacesData, projectsData]);

    const isLoading = isLoadingUsers || isLoadingWorkspaces || isLoadingProjects;
    const error = userError || workspaceError || projectError;

    return {
        metrics,
        isLoading,
        error,
        refetch: () => {
            // Could add refetch logic here if needed
        }
    };
};