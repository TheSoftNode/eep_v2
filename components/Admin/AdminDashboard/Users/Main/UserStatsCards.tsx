import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserX, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { UserStats } from '@/Redux/types/Users/user';
import { cn } from '@/lib/utils';

interface UserStatsCardsProps {
    stats: UserStats;
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
    const statsCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
            iconColor: 'text-white',
            trend: { value: 12, direction: 'up' as const, label: 'vs last month' }
        },
        {
            title: 'New Users',
            subtitle: 'Last 30 days',
            value: stats.recentUsers,
            icon: UserPlus,
            gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
            iconColor: 'text-white',
            trend: { value: 23, direction: 'up' as const, label: 'vs last month' }
        },
        {
            title: 'Disabled Users',
            value: stats.disabledUsers,
            icon: UserX,
            gradient: 'bg-gradient-to-br from-red-500 to-pink-600',
            iconColor: 'text-white',
            trend: { value: 8, direction: 'down' as const, label: 'vs last month' }
        },
        {
            title: 'Admin Users',
            value: stats.byRole.admin || 0,
            icon: Shield,
            gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
            iconColor: 'text-white',
            trend: { value: 0, direction: 'neutral' as const, label: 'no change' }
        }
    ];

    const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
        switch (direction) {
            case 'up':
                return <TrendingUp className="h-3 w-3" />;
            case 'down':
                return <TrendingDown className="h-3 w-3" />;
            default:
                return <Minus className="h-3 w-3" />;
        }
    };

    const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
        switch (direction) {
            case 'up':
                return 'text-emerald-600 dark:text-emerald-400';
            case 'down':
                return 'text-red-500 dark:text-red-400';
            default:
                return 'text-slate-500 dark:text-slate-400';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
                >
                    {/* Subtle gradient background */}
                    <div className={cn("absolute inset-0 opacity-5", card.gradient)}></div>

                    {/* Content */}
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {card.title}
                            </h3>
                            <div className={cn(
                                "flex items-center justify-center h-10 w-10 rounded-lg shadow-sm",
                                card.gradient,
                                card.iconColor
                            )}>
                                <card.icon className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {card.value.toLocaleString()}
                            </div>

                            <div className="flex items-center justify-between">
                                {card.subtitle && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {card.subtitle}
                                    </span>
                                )}

                                {card.trend && (
                                    <div className={cn(
                                        "flex items-center gap-1 text-xs font-medium",
                                        getTrendColor(card.trend.direction)
                                    )}>
                                        {getTrendIcon(card.trend.direction)}
                                        <span>{card.trend.value}%</span>
                                        <span className="text-slate-400 dark:text-slate-500 ml-1">
                                            {card.trend.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default UserStatsCards;
