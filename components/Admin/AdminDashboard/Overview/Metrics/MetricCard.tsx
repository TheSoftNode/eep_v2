"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        direction: 'up' | 'down' | 'neutral';
    };
    gradient: string;
    iconColor: string;
    isLoading?: boolean;
    className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    gradient,
    iconColor,
    isLoading = false,
    className
}) => {
    const getTrendIcon = () => {
        switch (trend?.direction) {
            case 'up':
                return <TrendingUp className="h-3 w-3" />;
            case 'down':
                return <TrendingDown className="h-3 w-3" />;
            default:
                return <Minus className="h-3 w-3" />;
        }
    };

    const getTrendColor = () => {
        switch (trend?.direction) {
            case 'up':
                return 'text-emerald-600 dark:text-emerald-400';
            case 'down':
                return 'text-red-500 dark:text-red-400';
            default:
                return 'text-slate-500 dark:text-slate-400';
        }
    };

    if (isLoading) {
        return (
            <div className={cn(
                "relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6",
                className
            )}>
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    </div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300",
                className
            )}
        >
            {/* Gradient background */}
            <div className={cn("absolute inset-0 opacity-5", gradient)}></div>

            {/* Content */}
            <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {title}
                    </h3>
                    <div className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-lg",
                        gradient,
                        "shadow-sm",
                        iconColor
                    )}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </div>

                    {(subtitle || trend) && (
                        <div className="flex items-center justify-between">
                            {subtitle && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                </span>
                            )}

                            {trend && (
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-medium",
                                    getTrendColor()
                                )}>
                                    {getTrendIcon()}
                                    <span>{trend.value}%</span>
                                    <span className="text-slate-400 dark:text-slate-500 ml-1">
                                        {trend.label}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MetricCard;