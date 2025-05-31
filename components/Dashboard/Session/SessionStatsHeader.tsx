import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react';
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

    const statCards = [
        {
            title: 'Pending',
            value: stats.pending,
            icon: Clock,
            gradient: 'from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50',
            textColor: 'text-amber-600 dark:text-amber-400',
            valueColor: 'text-amber-900 dark:text-amber-100',
            iconColor: 'text-amber-500'
        },
        {
            title: 'Confirmed',
            value: stats.accepted,
            icon: CheckCircle,
            gradient: 'from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50',
            textColor: 'text-green-600 dark:text-green-400',
            valueColor: 'text-green-900 dark:text-green-100',
            iconColor: 'text-green-500'
        },
        {
            title: 'Completed',
            value: stats.completed,
            icon: Calendar,
            gradient: 'from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50',
            textColor: 'text-blue-600 dark:text-blue-400',
            valueColor: 'text-blue-900 dark:text-blue-100',
            iconColor: 'text-blue-500'
        },
        {
            title: 'Cancelled',
            value: stats.cancelled,
            icon: XCircle,
            gradient: 'from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50',
            textColor: 'text-red-600 dark:text-red-400',
            valueColor: 'text-red-900 dark:text-red-100',
            iconColor: 'text-red-500'
        }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
        >
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={onRefresh}
                        variant="outline"
                        size="sm"
                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {userRole === 'learner' && onCreateSession && (
                    <Button
                        onClick={onCreateSession}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Request Session
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    >
                        <Card className={`border-0 bg-gradient-to-br ${stat.gradient} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</p>
                                        <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                                    </div>
                                    <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default SessionStatsHeader;