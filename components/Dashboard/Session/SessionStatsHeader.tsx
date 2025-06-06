import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    RefreshCw,
    TrendingUp,
    Activity,
    BarChart3,
    Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SessionData } from '@/Redux/types/Users/mentor';

interface SessionStats {
    pending: number;
    accepted: number;
    completed: number;
    cancelled: number;
    total: number;
}

interface SessionStatsHeaderProps {
    sessions: SessionData[];
    isLoading?: boolean;
    onRefresh: () => void;
    onCreateSession?: () => void;
    userRole?: string;
}

const SessionStatsHeader: React.FC<SessionStatsHeaderProps> = ({
    sessions,
    isLoading,
    onRefresh,
    onCreateSession,
    userRole
}) => {
    // Calculate stats from sessions
    const stats: SessionStats = {
        pending: sessions.filter(s => s.status === 'pending').length,
        accepted: sessions.filter(s => s.status === 'accepted').length,
        completed: sessions.filter(s => s.status === 'completed').length,
        cancelled: sessions.filter(s => s.status === 'cancelled').length,
        total: sessions.length
    };

    // Calculate completion rate
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const activeSessionsCount = stats.pending + stats.accepted;

    const statCards = [
        {
            title: 'Active Sessions',
            value: activeSessionsCount,
            subtitle: `${stats.pending} pending, ${stats.accepted} confirmed`,
            icon: Activity,
            bgColor: 'bg-white/95 dark:bg-slate-900/95',
            borderColor: 'border-indigo-200/50 dark:border-indigo-800/30',
            iconBg: 'bg-indigo-500',
            textColor: 'text-slate-600 dark:text-slate-400',
            valueColor: 'text-slate-900 dark:text-white',
            accentColor: 'text-indigo-600 dark:text-indigo-400'
        },
        {
            title: 'Pending Review',
            value: stats.pending,
            subtitle: 'Awaiting response',
            icon: Clock,
            bgColor: 'bg-white/95 dark:bg-slate-900/95',
            borderColor: 'border-amber-200/50 dark:border-amber-800/30',
            iconBg: 'bg-amber-500',
            textColor: 'text-slate-600 dark:text-slate-400',
            valueColor: 'text-slate-900 dark:text-white',
            accentColor: 'text-amber-600 dark:text-amber-400'
        },
        {
            title: 'Completed',
            value: stats.completed,
            subtitle: `${completionRate}% completion rate`,
            icon: CheckCircle,
            bgColor: 'bg-white/95 dark:bg-slate-900/95',
            borderColor: 'border-emerald-200/50 dark:border-emerald-800/30',
            iconBg: 'bg-emerald-500',
            textColor: 'text-slate-600 dark:text-slate-400',
            valueColor: 'text-slate-900 dark:text-white',
            accentColor: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            title: 'Total Sessions',
            value: stats.total,
            subtitle: 'All time sessions',
            icon: BarChart3,
            bgColor: 'bg-white/95 dark:bg-slate-900/95',
            borderColor: 'border-slate-200/50 dark:border-slate-700/30',
            iconBg: 'bg-slate-600',
            textColor: 'text-slate-600 dark:text-slate-400',
            valueColor: 'text-slate-900 dark:text-white',
            accentColor: 'text-slate-600 dark:text-slate-400'
        }
    ];

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                {/* Action Buttons Skeleton */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                        <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
        >
            {/* Header Section with Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Session Overview
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Track your mentoring progress and manage upcoming sessions
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={onRefresh}
                        variant="outline"
                        size="sm"
                        className="border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm transition-all duration-200"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>

                    {userRole === 'learner' && onCreateSession && (
                        <Button
                            onClick={onCreateSession}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Request Session
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className="group"
                    >
                        <Card className={`
                            ${stat.bgColor} 
                            border ${stat.borderColor}
                            backdrop-blur-xl shadow-sm hover:shadow-lg 
                            transition-all duration-300 hover:-translate-y-1
                            rounded-xl overflow-hidden
                        `}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className={`
                                                w-10 h-10 rounded-lg ${stat.iconBg} 
                                                flex items-center justify-center shadow-sm
                                                group-hover:scale-110 transition-transform duration-200
                                            `}>
                                                <stat.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${stat.textColor}`}>
                                                    {stat.title}
                                                </p>
                                                <p className={`text-xs ${stat.accentColor}`}>
                                                    {stat.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-baseline space-x-2">
                                            <p className={`text-3xl font-bold ${stat.valueColor} leading-none`}>
                                                {stat.value}
                                            </p>
                                            {stat.title === 'Completed' && stats.total > 0 && (
                                                <div className="flex items-center space-x-1">
                                                    <TrendingUp className={`h-3 w-3 ${stat.accentColor}`} />
                                                    <span className={`text-xs font-medium ${stat.accentColor}`}>
                                                        {completionRate}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress indicator for specific cards */}
                                {stat.title === 'Completed' && stats.total > 0 && (
                                    <div className="mt-4">
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                            <div
                                                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${completionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {stat.title === 'Active Sessions' && activeSessionsCount > 0 && (
                                    <div className="mt-4 space-y-1">
                                        {stats.pending > 0 && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-amber-600 dark:text-amber-400">Pending</span>
                                                <span className="font-medium text-slate-600 dark:text-slate-400">{stats.pending}</span>
                                            </div>
                                        )}
                                        {stats.accepted > 0 && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-emerald-600 dark:text-emerald-400">Confirmed</span>
                                                <span className="font-medium text-slate-600 dark:text-slate-400">{stats.accepted}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Insights */}
            {stats.total > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Success Rate</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{completionRate}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Now</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{activeSessionsCount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Impact</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SessionStatsHeader;