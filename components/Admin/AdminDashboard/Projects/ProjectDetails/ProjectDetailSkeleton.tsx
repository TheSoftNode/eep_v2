import React from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProjectDetailSkeletonProps {
    className?: string;
}

export default function ProjectDetailSkeleton({ className }: ProjectDetailSkeletonProps) {
    return (
        <div className={cn("space-y-6", className)}>
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="space-y-2">
                    <div className="h-8 sm:h-10 w-64 sm:w-80 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg animate-pulse" />
                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-20 bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-md animate-pulse" />
                    <div className="h-10 w-24 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-md animate-pulse" />
                    <div className="h-10 w-10 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-md animate-pulse" />
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <ProjectOverviewSkeleton />
                    <ProjectAreasSkeleton />
                    <ProjectTasksSkeleton />
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <ProjectStatsSkeleton />
                    <TeamMembersSkeleton />
                    <ProjectActivitySkeleton />
                    <ProjectResourcesSkeleton />
                </div>
            </div>
        </div>
    );
}

function ProjectOverviewSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-sm">
                {/* Gradient accent line */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg" />

                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="space-y-3">
                            <div className="h-7 w-56 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-lg animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-6 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full animate-pulse" />
                                <div className="h-6 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse" />
                                <div className="h-6 w-18 bg-purple-100 dark:bg-purple-900/30 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="h-8 w-24 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-full animate-pulse" />
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>

                    {/* Progress Section */}
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex justify-between items-center mb-3">
                            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                            <div className="h-5 w-12 bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded animate-pulse" />
                        </div>
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                    </div>

                    {/* Technologies */}
                    <div className="space-y-3">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="flex flex-wrap gap-2">
                            <div className="h-6 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-pulse" />
                            <div className="h-6 w-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-pulse" />
                            <div className="h-6 w-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-pulse" />
                            <div className="h-6 w-18 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            <div className="h-4 w-28 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ProjectAreasSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="h-6 w-32 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded animate-pulse" />
                        <div className="h-8 w-20 bg-purple-100 dark:bg-purple-900/30 rounded-md animate-pulse" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-3">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                                        <div className="h-5 w-40 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                                        <div className="h-5 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full animate-pulse" />
                                    </div>
                                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                    <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ProjectTasksSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="h-6 w-28 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-8 w-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-md animate-pulse" />
                            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="h-4 w-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-48 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                                    <div className="h-5 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse" />
                                </div>
                                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            </div>
                            <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ProjectStatsSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <div className="h-5 w-32 bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg">
                            <div className="h-10 w-10 bg-indigo-200 dark:bg-indigo-800 rounded-lg mx-auto mb-2 animate-pulse" />
                            <div className="h-6 w-8 bg-indigo-300 dark:bg-indigo-700 rounded mx-auto mb-1 animate-pulse" />
                            <div className="h-3 w-12 bg-indigo-200 dark:bg-indigo-800 rounded mx-auto animate-pulse" />
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-lg">
                            <div className="h-10 w-10 bg-emerald-200 dark:bg-emerald-800 rounded-lg mx-auto mb-2 animate-pulse" />
                            <div className="h-6 w-12 bg-emerald-300 dark:bg-emerald-700 rounded mx-auto mb-1 animate-pulse" />
                            <div className="h-3 w-16 bg-emerald-200 dark:bg-emerald-800 rounded mx-auto animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg">
                        <div className="h-10 w-10 bg-purple-200 dark:bg-purple-800 rounded-lg mx-auto mb-2 animate-pulse" />
                        <div className="h-6 w-12 bg-purple-300 dark:bg-purple-700 rounded mx-auto mb-1 animate-pulse" />
                        <div className="h-3 w-20 bg-purple-200 dark:bg-purple-800 rounded mx-auto animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function TeamMembersSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="h-5 w-28 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded animate-pulse" />
                        <div className="h-8 w-20 bg-purple-100 dark:bg-purple-900/30 rounded-md animate-pulse" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-full animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            </div>
                            <div className="h-6 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ProjectActivitySkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <div className="h-5 w-32 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="h-8 w-8 bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-full animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-full bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="border-t border-slate-200 dark:border-slate-700">
                    <div className="h-4 w-32 bg-blue-100 dark:bg-blue-900/30 rounded animate-pulse mx-auto" />
                </CardFooter>
            </Card>
        </motion.div>
    );
}

function ProjectResourcesSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <div className="h-5 w-28 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="h-8 w-8 bg-emerald-200 dark:bg-emerald-800 rounded-lg animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
                                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            </div>
                            <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}