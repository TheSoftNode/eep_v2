import React from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    Award,
    Target,
    AlertTriangle,
    CheckCircle,
    Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from "@/lib/utils";

interface AnalyticsSummaryCardProps {
    analytics: {
        totalLearners: number;
        activeLearners: number;
        completedLearners: number;
        averageProgress: number;
        completionRate: number;
        dropoffRate: number;
        averageCompletionTime: number;
        popularityScore?: number;
        commonStuckPoints?: Array<{
            nodeId: string;
            nodeTitle: string;
            nodeType: string;
            stuckCount: number;
            averageTimeStuck: number;
        }>;
        skillsMastery?: Array<{
            skillId: string;
            skillName: string;
            masterCount: number;
            averageTimeToMaster: number;
        }>;
    };
    period?: {
        start: any;
        end: any;
    };
}

export const AnalyticsSummaryCard: React.FC<AnalyticsSummaryCardProps> = ({
    analytics,
    period
}) => {
    // Mock progression data for the chart
    const progressionData = [
        { name: 'Week 1', learners: Math.floor(analytics.totalLearners * 0.1), completed: 0 },
        { name: 'Week 2', learners: Math.floor(analytics.totalLearners * 0.3), completed: Math.floor(analytics.completedLearners * 0.1) },
        { name: 'Week 3', learners: Math.floor(analytics.totalLearners * 0.6), completed: Math.floor(analytics.completedLearners * 0.3) },
        { name: 'Week 4', learners: Math.floor(analytics.totalLearners * 0.8), completed: Math.floor(analytics.completedLearners * 0.6) },
        { name: 'Week 5', learners: analytics.totalLearners, completed: analytics.completedLearners }
    ];

    // Progress distribution data
    const progressDistribution = [
        { name: 'Not Started', value: analytics.totalLearners - analytics.activeLearners - analytics.completedLearners, color: '#E5E7EB' },
        { name: 'In Progress', value: analytics.activeLearners, color: '#3B82F6' },
        { name: 'Completed', value: analytics.completedLearners, color: '#10B981' }
    ];

    const getTrendIcon = (value: number, threshold: number = 50) => {
        if (value >= threshold) {
            return <TrendingUp className="h-4 w-4 text-emerald-500" />;
        }
        return <TrendingDown className="h-4 w-4 text-red-500" />;
    };

    const getPerformanceColor = (rate: number) => {
        if (rate >= 80) return 'text-emerald-600 dark:text-emerald-400';
        if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getPerformanceStatus = (rate: number) => {
        if (rate >= 80) return { label: 'Excellent', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' };
        if (rate >= 60) return { label: 'Good', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' };
        return { label: 'Needs Improvement', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' };
    };

    const completionStatus = getPerformanceStatus(analytics.completionRate);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                            <BarChart3 className="h-4 w-4" />
                        </div>
                        Analytics Summary
                        <Badge className={cn("ml-auto", completionStatus.color)}>
                            {completionStatus.label}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</span>
                                {getTrendIcon(analytics.completionRate, 70)}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={cn("text-2xl font-bold", getPerformanceColor(analytics.completionRate))}>
                                    {Math.round(analytics.completionRate)}%
                                </span>
                            </div>
                            <Progress value={analytics.completionRate} className="h-2" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Avg Progress</span>
                                {getTrendIcon(analytics.averageProgress, 50)}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {Math.round(analytics.averageProgress)}%
                                </span>
                            </div>
                            <Progress value={analytics.averageProgress} className="h-2" />
                        </div>
                    </div>

                    {/* Learner Stats */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            Learner Statistics
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                    {analytics.totalLearners}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Total</p>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                                    {analytics.activeLearners}
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400">Active</p>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                                    {analytics.completedLearners}
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Distribution Chart */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">Progress Distribution</h4>
                        <div className="h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={progressDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={50}
                                        dataKey="value"
                                    >
                                        {progressDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [`${value} learners`, name]}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '12px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4">
                            {progressDistribution.map((item, index) => (
                                <div key={index} className="flex items-center gap-1">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Indicators */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="h-4 w-4 text-purple-600" />
                            Performance Indicators
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Average Completion Time</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                        {Math.round(analytics.averageCompletionTime)}h
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Drop-off Rate</span>
                                <div className="flex items-center gap-1">
                                    {analytics.dropoffRate > 30 ? (
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                    ) : (
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    )}
                                    <span className={cn(
                                        "text-sm font-medium",
                                        analytics.dropoffRate > 30 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                                    )}>
                                        {Math.round(analytics.dropoffRate)}%
                                    </span>
                                </div>
                            </div>
                            {analytics.popularityScore !== undefined && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Popularity Score</span>
                                    <div className="flex items-center gap-1">
                                        <Target className="h-4 w-4 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {analytics.popularityScore}/100
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progression Chart */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">Progression Trend</h4>
                        <div className="h-24">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={progressionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10 }}
                                        stroke="#64748b"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#64748b"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="learners"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        name="Active Learners"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Completed"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Common Issues */}
                    {analytics.commonStuckPoints && analytics.commonStuckPoints.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                Common Stuck Points
                            </h4>
                            <div className="space-y-2">
                                {analytics.commonStuckPoints.slice(0, 3).map((point, index) => (
                                    <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-red-900 dark:text-red-100">
                                                {point.nodeTitle}
                                            </span>
                                            <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                                                {point.stuckCount} stuck
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-red-700 dark:text-red-300">
                                            Avg stuck time: {Math.round(point.averageTimeStuck)}h
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills Mastery */}
                    {analytics.skillsMastery && analytics.skillsMastery.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                <Award className="h-4 w-4 text-amber-600" />
                                Top Skills Mastered
                            </h4>
                            <div className="space-y-2">
                                {analytics.skillsMastery.slice(0, 3).map((skill, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                                        <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                            {skill.skillName}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-amber-700 dark:text-amber-300">
                                                {skill.masterCount} masters
                                            </span>
                                            <span className="text-xs text-amber-600 dark:text-amber-400">
                                                ~{Math.round(skill.averageTimeToMaster)}h
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summary Status */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        {analytics.completionRate >= 70 ? (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                                        Learning Path Performing Well
                                    </p>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                        High completion rate and learner engagement
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                                        Room for Improvement
                                    </p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                        Consider reviewing learning path structure and difficulty
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};