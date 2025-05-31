import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

interface ProjectSkeletonsProps {
    count?: number;
    variant?: 'default' | 'compact' | 'detailed';
    className?: string;
    showStats?: boolean;
}

interface AnimatedSkeletonProps extends React.ComponentProps<typeof Skeleton> {
    className?: string;
}

const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({ className: skeletonClassName, ...props }) => (
    <Skeleton
        className={cn(
            "relative overflow-hidden bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800",
            "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
            skeletonClassName
        )}
        {...props}
    />
);

const ProjectSkeletons: React.FC<ProjectSkeletonsProps> = ({
    count = 6,
    variant = 'default',
    className = "",
    showStats = false
}) => {
    // Animation variants for staggered loading
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Stats Header Skeleton */}
            {showStats && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div className="space-y-2">
                        <AnimatedSkeleton className="h-6 w-48 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30" />
                        <AnimatedSkeleton className="h-4 w-64 bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <AnimatedSkeleton className="h-10 w-32 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30" />
                </motion.div>
            )}

            {/* Grid Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
                {Array.from({ length: count }).map((_, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="h-fit"
                    >
                        <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm">
                            {/* Gradient accent line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800/50 dark:to-purple-800/50 animate-pulse" />

                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl -mr-16 -mt-16 pointer-events-none" />

                            <CardHeader className="pb-4 relative">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0 space-y-3">
                                        <AnimatedSkeleton className="h-6 w-3/4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                                        <div className="flex items-center gap-2">
                                            <AnimatedSkeleton className="h-5 w-20 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30" />
                                            <AnimatedSkeleton className="h-5 w-16 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AnimatedSkeleton className="h-6 w-16 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30" />
                                        <AnimatedSkeleton className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5 relative">
                                {/* Description */}
                                <div className="space-y-2">
                                    <AnimatedSkeleton className="h-4 w-full bg-slate-200 dark:bg-slate-700" />
                                    <AnimatedSkeleton className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700" />
                                </div>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-2">
                                    <AnimatedSkeleton className="h-6 w-16 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30" />
                                    <AnimatedSkeleton className="h-6 w-20 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30" />
                                    <AnimatedSkeleton className="h-6 w-14 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30" />
                                    <AnimatedSkeleton className="h-6 w-18 rounded-full bg-slate-200 dark:bg-slate-700" />
                                </div>

                                {/* Progress Section */}
                                <div className="space-y-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="flex justify-between items-center">
                                        <AnimatedSkeleton className="h-4 w-32 bg-slate-300 dark:bg-slate-600" />
                                        <AnimatedSkeleton className="h-4 w-12 bg-gradient-to-r from-indigo-200 to-indigo-300 dark:from-indigo-700 dark:to-indigo-600" />
                                    </div>
                                    <AnimatedSkeleton className="h-3 w-full rounded-full bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500" />
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30">
                                        <AnimatedSkeleton className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-200 to-indigo-300 dark:from-indigo-700 dark:to-indigo-600" />
                                        <div className="space-y-2">
                                            <AnimatedSkeleton className="h-3 w-12 bg-indigo-200 dark:bg-indigo-700" />
                                            <AnimatedSkeleton className="h-5 w-8 bg-indigo-300 dark:bg-indigo-600" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">
                                        <AnimatedSkeleton className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-700 dark:to-emerald-600" />
                                        <div className="space-y-2">
                                            <AnimatedSkeleton className="h-3 w-12 bg-emerald-200 dark:bg-emerald-700" />
                                            <AnimatedSkeleton className="h-5 w-10 bg-emerald-300 dark:bg-emerald-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Project Areas Preview */}
                                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white/50 dark:bg-slate-800/50">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100/80 dark:from-slate-800 dark:to-slate-700/80 border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <AnimatedSkeleton className="h-4 w-4 rounded bg-indigo-200 dark:bg-indigo-700" />
                                            <AnimatedSkeleton className="h-4 w-24 bg-slate-300 dark:bg-slate-600" />
                                        </div>
                                        <AnimatedSkeleton className="h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    </div>

                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {[1, 2].map((area) => (
                                            <div key={area} className="p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <AnimatedSkeleton className="h-4 w-32 bg-slate-300 dark:bg-slate-600" />
                                                    <AnimatedSkeleton className="h-4 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                                                </div>
                                                <AnimatedSkeleton className="h-2 w-full rounded-full bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500" />
                                                <div className="flex items-center gap-1">
                                                    <AnimatedSkeleton className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700" />
                                                    <AnimatedSkeleton className="h-3 w-16 bg-slate-200 dark:bg-slate-700" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Team Members and Links */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <AnimatedSkeleton className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
                                            <AnimatedSkeleton className="h-3 w-10 bg-slate-200 dark:bg-slate-700" />
                                        </div>
                                        <div className="flex -space-x-2">
                                            <AnimatedSkeleton className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-700 dark:to-purple-700 border-2 border-white dark:border-slate-900" />
                                            <AnimatedSkeleton className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-200 to-blue-200 dark:from-emerald-700 dark:to-blue-700 border-2 border-white dark:border-slate-900" />
                                            <AnimatedSkeleton className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-200 to-red-200 dark:from-yellow-700 dark:to-red-700 border-2 border-white dark:border-slate-900" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <AnimatedSkeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                                        <AnimatedSkeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
                                <div className="flex items-center gap-2">
                                    <AnimatedSkeleton className="h-4 w-4 rounded bg-indigo-200 dark:bg-indigo-700" />
                                    <AnimatedSkeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-700" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <AnimatedSkeleton className="h-4 w-4 rounded bg-indigo-200 dark:bg-indigo-700" />
                                    <AnimatedSkeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-700" />
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
};

export default ProjectSkeletons;