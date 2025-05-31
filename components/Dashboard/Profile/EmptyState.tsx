import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    actionLabel: string;
    onAction?: () => void;
    className?: string;
    variant?: 'default' | 'indigo' | 'purple' | 'green' | 'blue' | 'yellow' | 'red';
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
    variant = 'default'
}) => {
    // Color variants based on brand colors
    const colorVariants = {
        default: {
            outerBg: "from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30",
            innerBg: "from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700",
            buttonBg: "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
            ring: "ring-indigo-200/50 dark:ring-indigo-700/30"
        },
        indigo: {
            outerBg: "from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20",
            innerBg: "from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700",
            buttonBg: "from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800",
            ring: "ring-indigo-200/50 dark:ring-indigo-700/30"
        },
        purple: {
            outerBg: "from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20",
            innerBg: "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
            buttonBg: "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
            ring: "ring-purple-200/50 dark:ring-purple-700/30"
        },
        green: {
            outerBg: "from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20",
            innerBg: "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
            buttonBg: "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
            ring: "ring-green-200/50 dark:ring-green-700/30"
        },
        blue: {
            outerBg: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
            innerBg: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
            buttonBg: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
            ring: "ring-blue-200/50 dark:ring-blue-700/30"
        },
        yellow: {
            outerBg: "from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20",
            innerBg: "from-yellow-500 to-amber-500 dark:from-yellow-600 dark:to-amber-600",
            buttonBg: "from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600",
            ring: "ring-yellow-200/50 dark:ring-yellow-700/30"
        },
        red: {
            outerBg: "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20",
            innerBg: "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
            buttonBg: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
            ring: "ring-red-200/50 dark:ring-red-700/30"
        }
    };

    const colors = colorVariants[variant];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("text-center py-10 px-4", className)}
        >
            <div className={cn(
                "bg-gradient-to-br rounded-full p-4 inline-flex mb-4 shadow-sm",
                colors.outerBg,
                "backdrop-blur-xl ring-1",
                colors.ring
            )}>
                <div className={cn(
                    "bg-gradient-to-r rounded-full p-3 text-white shadow-md",
                    colors.innerBg
                )}>
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-2">
                {title}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm">
                {description}
            </p>
            {actionLabel && (
                <Button
                    onClick={onAction}
                    className={cn(
                        "mt-6 bg-gradient-to-r text-white shadow-md transition-all duration-200",
                        "hover:shadow-lg hover:translate-y-[-2px]",
                        colors.buttonBg
                    )}
                >
                    {actionLabel}
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyState;