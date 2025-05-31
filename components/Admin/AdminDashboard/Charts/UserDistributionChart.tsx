"use client";

import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, Crown, GraduationCap, BookOpen } from "lucide-react";
import { useGetUserStatsQuery } from "@/Redux/apiSlices/users/adminApi";

const UserDistributionChart: React.FC = () => {
    const { data: userStats, isLoading, error } = useGetUserStatsQuery();

    const roleData = userStats?.data?.byRole || {};

    // Transform data for the chart
    const chartData = [
        {
            name: 'Learners',
            value: roleData.learner || 0,
            color: '#10B981',
            icon: BookOpen
        },
        {
            name: 'Mentors',
            value: roleData.mentor || 0,
            color: '#3B82F6',
            icon: GraduationCap
        },
        {
            name: 'Admins',
            value: roleData.admin || 0,
            color: '#EF4444',
            icon: Crown
        },
        {
            name: 'Users',
            value: roleData.user || 0,
            color: '#8B5CF6',
            icon: Users
        }
    ].filter(item => item.value > 0);

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';

            return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {data.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Count: {data.value}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Percentage: {percentage}%
                    </p>
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
                    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error || total === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2" />
                        <p>No user data available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <Users className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        User Distribution
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        By role breakdown
                    </p>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                {chartData.map((item, index) => {
                    const Icon = item.icon;
                    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                        >
                            <div
                                className="flex items-center justify-center h-8 w-8 rounded-lg text-white"
                                style={{ backgroundColor: item.color }}
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {item.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {item.value} ({percentage}%)
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default UserDistributionChart;
