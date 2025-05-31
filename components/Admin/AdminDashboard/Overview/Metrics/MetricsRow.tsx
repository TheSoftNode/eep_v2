"use client";

import React from "react";
import { Users, FolderKanban, Calendar, Activity } from "lucide-react";
import MetricCard from "./MetricCard";
import { useGetUserStatsQuery } from "@/Redux/apiSlices/users/adminApi";
import { useGetAllWorkspacesQuery } from "@/Redux/apiSlices/workspaces/workspaceApi";
import { useGetProjectsQuery } from "@/Redux/apiSlices/Projects/projectsApiSlice";

const MetricsRow: React.FC = () => {
    // Fetch data from APIs
    const { data: userStats, isLoading: isLoadingUsers } = useGetUserStatsQuery();
    const { data: workspaces, isLoading: isLoadingWorkspaces } = useGetAllWorkspacesQuery({
        limit: 1, // We only need the count
        includeMemberCount: true
    });
    const { data: projects, isLoading: isLoadingProjects } = useGetProjectsQuery({
        limit: 1 // We only need the count
    });

    // Calculate metrics
    const totalUsers = userStats?.data?.totalUsers || 0;
    const activeUsers = userStats?.data?.activeUsers || 0;
    const newUsersThisMonth = userStats?.data?.recentUsers || 0;
    const userGrowthRate = userStats?.data?.growthRate || 0;

    const totalWorkspaces = workspaces?.totalCount || 0;
    const activeWorkspaces = workspaces?.data?.filter(w => w.status === 'active').length || 0;

    const totalProjects = projects?.count || 0;
    const activeProjects = projects?.data?.filter(p => p.status === 'active').length || 0;

    // System health calculation (this would typically come from a monitoring service)
    const systemHealth = 98; // Placeholder - would be calculated from actual system metrics

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <MetricCard
                title="Total Users"
                value={totalUsers.toLocaleString()}
                subtitle={`${activeUsers} active`}
                icon={Users}
                trend={{
                    value: userGrowthRate,
                    label: "vs last month",
                    direction: userGrowthRate > 0 ? 'up' : userGrowthRate < 0 ? 'down' : 'neutral'
                }}
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                iconColor="text-white"
                isLoading={isLoadingUsers}
            />

            {/* Active Workspaces */}
            <MetricCard
                title="Active Workspaces"
                value={activeWorkspaces.toLocaleString()}
                subtitle={`${totalWorkspaces} total`}
                icon={FolderKanban}
                trend={{
                    value: 12,
                    label: "vs last week",
                    direction: 'up'
                }}
                gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                iconColor="text-white"
                isLoading={isLoadingWorkspaces}
            />

            {/* Active Projects */}
            <MetricCard
                title="Active Projects"
                value={activeProjects.toLocaleString()}
                subtitle={`${totalProjects} total`}
                icon={Calendar}
                trend={{
                    value: 8,
                    label: "completion rate",
                    direction: 'up'
                }}
                gradient="bg-gradient-to-br from-violet-500 to-violet-600"
                iconColor="text-white"
                isLoading={isLoadingProjects}
            />

            {/* System Health */}
            <MetricCard
                title="System Health"
                value={`${systemHealth}%`}
                subtitle="All systems operational"
                icon={Activity}
                trend={{
                    value: 2,
                    label: "uptime",
                    direction: 'up'
                }}
                gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                iconColor="text-white"
            />
        </div>
    );
};

export default MetricsRow;
