"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserPlus,
    UserMinus,
    TrendingUp,
    BarChart3,
    Activity,
    Globe,
    Shield,
    UserCheck,
    AlertTriangle,
    Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetUserActivityQuery, useGetUserStatsQuery } from "@/Redux/apiSlices/users/adminApi";
import { StatCard } from "@/components/Admin/AdminDashboard/Users/UserStats/StatCard";
import { RoleDistributionCard } from "@/components/Admin/AdminDashboard/Users/UserStats/RoleDistributionCard";
import { ActivityMetricsCard } from "@/components/Admin/AdminDashboard/Users/UserStats/ActivityMetricsCard";
import { UserGrowthChart } from "@/components/Admin/AdminDashboard/Users/UserStats/UserGrowthChart";

const UserStatisticsPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState("30");

    // Fetch data using your existing APIs
    const { data: statsData, isLoading: isLoadingStats, error: statsError } = useGetUserStatsQuery();
    const { data: activityData, isLoading: isLoadingActivity, error: activityError } = useGetUserActivityQuery({ days: parseInt(timeRange) });

    const stats = statsData?.data || {
        totalUsers: 0,
        activeUsers: 0,
        recentUsers: 0,
        disabledUsers: 0,
        growthRate: 0,
        byRole: { admin: 0, mentor: 0, learner: 0, user: 0 }
    };

    const activityChartData = activityData?.data || [];

    if (isLoadingStats || isLoadingActivity) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Loading statistics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (statsError || activityError) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 dark:text-red-400 text-sm">Failed to load statistics</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        User Statistics
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Comprehensive analytics and insights about your user base
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users className="h-5 w-5" />}
                    trend="up"
                    trendValue={`+${stats.growthRate}%`}
                    description="vs last month"
                    color="indigo"
                />
                <StatCard
                    title="Active Users"
                    value={stats.activeUsers}
                    icon={<UserCheck className="h-5 w-5" />}
                    trend="up"
                    trendValue="+8.2%"
                    description="vs last month"
                    color="emerald"
                />
                <StatCard
                    title="New Users"
                    value={stats.recentUsers}
                    icon={<UserPlus className="h-5 w-5" />}
                    trend="up"
                    trendValue="+23.1%"
                    description="this month"
                    color="blue"
                />
                <StatCard
                    title="Disabled Users"
                    value={stats.disabledUsers}
                    icon={<UserMinus className="h-5 w-5" />}
                    trend="down"
                    trendValue="-5.3%"
                    description="vs last month"
                    color="red"
                />
            </motion.div>

            {/* Detailed Analytics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Tabs defaultValue="overview" className="space-y-6 ">
                    <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="growth" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Growth</span>
                        </TabsTrigger>
                        <TabsTrigger value="demographics" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="hidden sm:inline">Demographics</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Security</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RoleDistributionCard byRole={stats.byRole} totalUsers={stats.totalUsers} />
                            <ActivityMetricsCard />
                        </div>
                    </TabsContent>

                    <TabsContent value="growth" className="space-y-6">
                        <UserGrowthChart data={activityChartData} />
                    </TabsContent>

                    <TabsContent value="demographics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-indigo-600" />
                                        Geographic Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-48 flex items-center justify-center text-slate-400">
                                        <div className="text-center">
                                            <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Geographic data will be displayed here</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-purple-600" />
                                        User Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode Users</span>
                                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                68%
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Notifications</span>
                                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                84%
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mobile App Users</span>
                                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                45%
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-red-600" />
                                    Security Overview
                                </CardTitle>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    Account security metrics and compliance status
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">92%</div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Verified</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Users with verified email</p>
                                    </div>
                                    <div className="text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">67%</div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">2FA Enabled</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Two-factor authentication</p>
                                    </div>
                                    <div className="text-center p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">15</div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Security Incidents</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Past 30 days</p>
                                    </div>
                                </div>

                                {/* Additional Security Metrics */}
                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Recent Security Events</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-sm text-slate-700 dark:text-slate-300">Password reset requests</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-500">23 today</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                <span className="text-sm text-slate-700 dark:text-slate-300">Failed login attempts</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-500">127 today</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-sm text-slate-700 dark:text-slate-300">Blocked IP addresses</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-500">8 this week</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default UserStatisticsPage;