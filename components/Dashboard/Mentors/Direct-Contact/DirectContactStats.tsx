import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Circle, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageStats } from '@/Redux/types/Users/mentorMessage';

interface DirectContactStatsProps {
    stats: MessageStats | undefined;
    isLoading?: boolean;
}

const DirectContactStats: React.FC<DirectContactStatsProps> = ({ stats, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            title: 'Total Received',
            value: stats.totalReceived,
            icon: Inbox,
            gradient: 'from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50',
            textColor: 'text-blue-600 dark:text-blue-400',
            valueColor: 'text-blue-900 dark:text-blue-100',
            iconColor: 'text-blue-500'
        },
        {
            title: 'Unread',
            value: stats.unreadCount,
            icon: Circle,
            gradient: 'from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50',
            textColor: 'text-orange-600 dark:text-orange-400',
            valueColor: 'text-orange-900 dark:text-orange-100',
            iconColor: 'text-orange-500'
        },
        {
            title: 'Starred',
            value: stats.starredCount,
            icon: Star,
            gradient: 'from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50',
            textColor: 'text-amber-600 dark:text-amber-400',
            valueColor: 'text-amber-900 dark:text-amber-100',
            iconColor: 'text-amber-500'
        },
        {
            title: 'Active Threads',
            value: stats.activeThreads,
            icon: MessageSquare,
            gradient: 'from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50',
            textColor: 'text-green-600 dark:text-green-400',
            valueColor: 'text-green-900 dark:text-green-100',
            iconColor: 'text-green-500'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
            {statCards.map((stat, index) => (
                <Card key={stat.title} className={`border-0 bg-gradient-to-br ${stat.gradient}`}>
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
            ))}
        </motion.div>
    );
};

export default DirectContactStats;