import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    description?: string;
    color?: "indigo" | "emerald" | "purple" | "red" | "blue";
    isLoading?: boolean;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendValue,
    description,
    color = "indigo",
    isLoading = false,
    className
}) => {
    const colorClasses = {
        indigo: {
            gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
            icon: "text-white"
        },
        emerald: {
            gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
            icon: "text-white"
        },
        purple: {
            gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
            icon: "text-white"
        },
        red: {
            gradient: "bg-gradient-to-br from-red-500 to-red-600",
            icon: "text-white"
        },
        blue: {
            gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
            icon: "text-white"
        }
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-3 w-3" />;
            case 'down':
                return <TrendingDown className="h-3 w-3" />;
            default:
                return <Minus className="h-3 w-3" />;
        }
    };

    const getTrendColor = () => {
        switch (trend) {
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
            {/* Subtle gradient background */}
            <div className={cn(
                "absolute inset-0 opacity-5",
                colorClasses[color].gradient
            )}></div>

            {/* Content */}
            <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {title}
                    </h3>
                    <div className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-lg shadow-sm",
                        colorClasses[color].gradient,
                        colorClasses[color].icon
                    )}>
                        {icon}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>

                    {(description || (trend && trendValue)) && (
                        <div className="flex items-center justify-between">
                            {description && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {description}
                                </span>
                            )}

                            {trend && trendValue && (
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-medium",
                                    getTrendColor()
                                )}>
                                    {getTrendIcon()}
                                    <span>{trendValue}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};