"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    FileText,
    MessageCircle,
    Mail,
    Activity,
    Download
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetCommunicationsStatsQuery, useGetCommunicationsTimeSeriesQuery } from "@/Redux/apiSlices/communication/communicationApi";

const CommunicationsStatsPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');

    const { data: statsData, isLoading: statsLoading, error: statsError } = useGetCommunicationsStatsQuery();
    const { data: timeSeriesData, isLoading: timeSeriesLoading, error: timeSeriesError } = useGetCommunicationsTimeSeriesQuery({
        days: parseInt(timeRange)
    });

    const stats = statsData?.data;
    const timeSeriesChartData = timeSeriesData?.data || [];

    const applicationStatusData = stats ? [
        { name: 'Pending', value: stats.applications.pending, color: '#F59E0B' },
        { name: 'Approved', value: stats.applications.approved, color: '#10B981' },
        { name: 'Rejected', value: stats.applications.rejected, color: '#EF4444' }
    ] : [];

    const contactStatusData = stats ? [
        { name: 'New', value: stats.contacts.new, color: '#3B82F6' },
        { name: 'In Progress', value: stats.contacts.inProgress, color: '#F59E0B' },
        { name: 'Resolved', value: stats.contacts.resolved, color: '#10B981' }
    ] : [];

    const newsletterStatusData = stats ? [
        { name: 'Active', value: stats.newsletter.active, color: '#10B981' },
        { name: 'Unsubscribed', value: stats.newsletter.unsubscribed, color: '#EF4444' }
    ] : [];

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

    const PieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {data.name}: {data.value}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (statsLoading || timeSeriesLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (statsError || timeSeriesError || !stats) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                        <p>Failed to load statistics</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Communications Statistics</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Comprehensive analytics and insights
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </motion.div>

            {/* Overview Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {/* Total Communications */}
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                    Total Communications
                                </p>
                                <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                                    {stats.overview.totalCommunications}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                        +{stats.overview.monthlyActivity} this month
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-500 text-white">
                                <Activity className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Applications */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    Applications
                                </p>
                                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                    {stats.applications.total}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs">
                                        {stats.applications.pending} pending
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500 text-white">
                                <FileText className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contacts */}
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    Contact Inquiries
                                </p>
                                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                                    {stats.contacts.total}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                                        {stats.contacts.new} new
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500 text-white">
                                <MessageCircle className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                    Newsletter Subscribers
                                </p>
                                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                    {stats.newsletter.total}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                                        {stats.newsletter.active} active
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500 text-white">
                                <Mail className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Activity Timeline
                            </CardTitle>
                            <CardDescription>
                                Daily communications activity over the last {timeRange} days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={timeSeriesChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="applications" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="contacts" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="subscriptions" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
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
                                            dataKey="applications"
                                            stroke="#3B82F6"
                                            fillOpacity={1}
                                            fill="url(#applications)"
                                            strokeWidth={2}
                                            name="Applications"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="contacts"
                                            stroke="#10B981"
                                            fillOpacity={1}
                                            fill="url(#contacts)"
                                            strokeWidth={2}
                                            name="Contacts"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="subscriptions"
                                            stroke="#8B5CF6"
                                            fillOpacity={1}
                                            fill="url(#subscriptions)"
                                            strokeWidth={2}
                                            name="Subscriptions"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Application Status Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Application Status Distribution
                            </CardTitle>
                            <CardDescription>
                                Breakdown of application statuses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={applicationStatusData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            {applicationStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<PieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Status Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Contact Status Distribution
                            </CardTitle>
                            <CardDescription>
                                Breakdown of contact inquiry statuses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={contactStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                            {contactStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Newsletter Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Newsletter Subscription Status
                            </CardTitle>
                            <CardDescription>
                                Active vs unsubscribed newsletter users
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={newsletterStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {newsletterStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<PieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default CommunicationsStatsPage;