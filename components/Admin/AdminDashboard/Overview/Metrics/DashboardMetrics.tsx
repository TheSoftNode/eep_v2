"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, FolderKanban, Briefcase, Activity, AlertTriangle } from "lucide-react";
import MetricCard from "./MetricCard";
import SystemHealthCard from "./SystemHealthCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDashboardMetrics } from "@/hooks/dashboard/useDashboardMetrics";

const DashboardMetrics: React.FC = () => {
    const { metrics, isLoading, error } = useDashboardMetrics();

    if (error) {
        return (
            <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    Failed to load dashboard metrics. Please try refreshing the page.
                </AlertDescription>
            </Alert>
        );
    }

    if (isLoading || !metrics) {
        return (
            <div className="space-y-6 mb-8">
                {/* Loading state for metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <MetricCard
                            key={index}
                            title=""
                            value=""
                            icon={Users}
                            gradient="bg-gradient-to-br from-slate-200 to-slate-300"
                            iconColor="text-white"
                            isLoading={true}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 mb-8"
        >
            {/* Main Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <MetricCard
                    title="Total Users"
                    value={metrics.users.total.toLocaleString()}
                    subtitle={`${metrics.users.active} active`}
                    icon={Users}
                    trend={{
                        value: Math.abs(metrics.users.growthRate),
                        label: "vs last month",
                        direction: metrics.users.growthRate > 0 ? 'up' :
                            metrics.users.growthRate < 0 ? 'down' : 'neutral'
                    }}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                    iconColor="text-white"
                />

                {/* Active Workspaces */}
                <MetricCard
                    title="Active Workspaces"
                    value={metrics.workspaces.active.toLocaleString()}
                    subtitle={`${metrics.workspaces.total} total`}
                    icon={FolderKanban}
                    trend={{
                        value: Math.round((metrics.workspaces.active / Math.max(metrics.workspaces.total, 1)) * 100),
                        label: "utilization",
                        direction: 'up'
                    }}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    iconColor="text-white"
                />

                {/* Active Projects */}
                <MetricCard
                    title="Active Projects"
                    value={metrics.projects.active.toLocaleString()}
                    subtitle={`${metrics.projects.completionRate}% completion rate`}
                    icon={Briefcase}
                    trend={{
                        value: metrics.projects.completionRate,
                        label: "success rate",
                        direction: metrics.projects.completionRate >= 70 ? 'up' :
                            metrics.projects.completionRate >= 50 ? 'neutral' : 'down'
                    }}
                    gradient="bg-gradient-to-br from-violet-500 to-violet-600"
                    iconColor="text-white"
                />

                {/* System Health */}
                <MetricCard
                    title="System Health"
                    value={`${metrics.systemHealth.overall}%`}
                    subtitle="All systems operational"
                    icon={Activity}
                    trend={{
                        value: 2.1,
                        label: "uptime improvement",
                        direction: 'up'
                    }}
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                    iconColor="text-white"
                />
            </div>

            {/* Detailed System Health Card (Optional - can be placed in second row) */}
            <div className="lg:hidden">
                <SystemHealthCard />
            </div>
        </motion.div>
    );
};

export default DashboardMetrics;