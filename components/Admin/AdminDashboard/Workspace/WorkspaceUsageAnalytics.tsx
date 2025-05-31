"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FolderKanban,
    Users,
    Activity,
    HardDrive,
    Cpu,
    Wifi,
    TrendingUp,
    TrendingDown,
    Minus
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useGetAllWorkspacesQuery } from "@/Redux/apiSlices/workspaces/workspaceApi";

interface UsageMetric {
    title: string;
    value: string;
    change: number;
    changeLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

const WorkspaceUsageAnalytics: React.FC = () => {
    const { data: workspacesData, isLoading, error } = useGetAllWorkspacesQuery({
        limit: 50,
        includeMemberCount: true,
        includeProjects: true
    });

    const workspaces = workspacesData?.data || [];

    // Calculate usage metrics
    const totalWorkspaces = workspacesData?.totalCount || 0;
    const activeWorkspaces = workspaces.filter(w => w.status === 'active').length;
    const totalMembers = workspaces.reduce((sum, w) => sum + w.memberCount, 0);
    const averageMembers = workspaces.length > 0 ? Math.round(totalMembers / workspaces.length) : 0;

    // Mock resource usage data - in real implementation, this would come from monitoring APIs
    const usageMetrics: UsageMetric[] = [
        {
            title: "Active Workspaces",
            value: `${activeWorkspaces}/${totalWorkspaces}`,
            change: 12,
            changeLabel: "vs last month",
            icon: FolderKanban,
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            title: "Total Members",
            value: totalMembers.toString(),
            change: 8,
            changeLabel: "new this week",
            icon: Users,
            color: "text-emerald-600 dark:text-emerald-400"
        },
        {
            title: "Storage Usage",
            value: "2.4 TB",
            change: 15,
            changeLabel: "utilization",
            icon: HardDrive,
            color: "text-orange-600 dark:text-orange-400"
        },
        {
            title: "CPU Usage",
            value: "67%",
            change: -3,
            changeLabel: "vs yesterday",
            icon: Cpu,
            color: "text-violet-600 dark:text-violet-400"
        }
    ];

    // Workspace activity data for chart
    const activityData = workspaces.slice(0, 6).map(workspace => ({
        name: workspace.name.length > 10 ? workspace.name.substring(0, 10) + '...' : workspace.name,
        members: workspace.memberCount,
        projects: workspace.projectIds?.length || 0,
        activity: Math.floor(Math.random() * 100) + 20 // Mock activity score
    }));

    const getTrendIcon = (change: number) => {
        if (change > 0) return <TrendingUp className="h-3 w-3" />;
        if (change < 0) return <TrendingDown className="h-3 w-3" />;
        return <Minus className="h-3 w-3" />;
    };

    const getTrendColor = (change: number) => {
        if (change > 0) return "text-emerald-600 dark:text-emerald-400";
        if (change < 0) return "text-red-500 dark:text-red-400";
        return "text-slate-500 dark:text-slate-400";
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        {label}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.dataKey === 'members' ? 'Members' :
                                entry.dataKey === 'projects' ? 'Projects' : 'Activity'}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                        <FolderKanban className="h-8 w-8 mx-auto mb-2" />
                        <p>Failed to load workspace analytics</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <FolderKanban className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Workspace Usage Analytics
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Resource utilization and activity metrics
                    </p>
                </div>
            </div>

            {/* Usage Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {usageMetrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <metric.icon className={`h-5 w-5 ${metric.color}`} />
                            <div className={`flex items-center gap-1 text-xs ${getTrendColor(metric.change)}`}>
                                {getTrendIcon(metric.change)}
                                <span>{Math.abs(metric.change)}%</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {metric.value}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {metric.title}
                            </p>
                            <p className="text-xs text-slate-400">
                                {metric.changeLabel}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Activity Chart */}
            {activityData.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Workspace Activity
                        </h4>
                        <Badge className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                            Top 6 Workspaces
                        </Badge>
                    </div>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="name"
                                    className="text-xs"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    className="text-xs"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="members" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="projects" fill="#10B981" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="activity" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                            <span className="text-slate-600 dark:text-slate-400">Members</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                            <span className="text-slate-600 dark:text-slate-400">Projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-violet-500"></div>
                            <span className="text-slate-600 dark:text-slate-400">Activity Score</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default WorkspaceUsageAnalytics;