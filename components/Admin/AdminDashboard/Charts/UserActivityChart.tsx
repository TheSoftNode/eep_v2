"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGetUserActivityQuery } from "@/Redux/apiSlices/users/adminApi";

const UserActivityChart: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');

    const { data: activityData, isLoading, error } = useGetUserActivityQuery({
        days: parseInt(timeRange)
    });


    const data = activityData?.data || [];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatDate(label)}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
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
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                        <div className="flex gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-8 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            ))}
                        </div>
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
                        <Activity className="h-8 w-8 mx-auto mb-2" />
                        <p>Failed to load activity data</p>
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
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            User Activity
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Daily active users and registrations
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {(['7', '30', '90'] as const).map((range) => (
                        <Button
                            key={range}
                            variant={timeRange === range ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setTimeRange(range)}
                            className={cn(
                                "text-xs",
                                timeRange === range
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "text-slate-600 dark:text-slate-400"
                            )}
                        >
                            {range}d
                        </Button>
                    ))}
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="activeUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="newUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
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
                        <Area
                            type="monotone"
                            dataKey="activeUsers"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#activeUsers)"
                            strokeWidth={2}
                            name="Active Users"
                        />
                        <Area
                            type="monotone"
                            dataKey="newUsers"
                            stroke="#10B981"
                            fillOpacity={1}
                            fill="url(#newUsers)"
                            strokeWidth={2}
                            name="New Users"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-slate-600 dark:text-slate-400">Active Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-600 dark:text-slate-400">New Users</span>
                    </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>
        </motion.div>
    );
};

export default UserActivityChart;