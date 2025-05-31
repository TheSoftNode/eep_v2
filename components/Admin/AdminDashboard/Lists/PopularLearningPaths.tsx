"use client";

import React from "react";
import { motion } from "framer-motion";
import { Book, Users, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetProjectsQuery } from "@/Redux/apiSlices/Projects/projectsApiSlice";

const PopularLearningPaths: React.FC = () => {
    const { data: projectsData, isLoading, error } = useGetProjectsQuery({
        limit: 10,
        orderBy: 'progress',
        order: 'desc'
    });

    const projects = projectsData?.data || [];

    // Mock learning path data - in real implementation, this would come from learning paths API
    const learningPaths = projects.slice(0, 5).map((project, index) => ({
        id: project.id,
        title: project.name,
        category: project.category,
        level: project.level,
        enrolledCount: Math.floor(Math.random() * 100) + 20,
        completionRate: Math.floor(Math.random() * 40) + 60,
        avgTimeToComplete: Math.floor(Math.random() * 20) + 10,
        trending: index < 2
    }));

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'advanced':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || learningPaths.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                        <Book className="h-8 w-8 mx-auto mb-2" />
                        <p>No learning paths available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                    <Book className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Popular Learning Paths
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Most enrolled projects
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {learningPaths.map((path, index) => (
                    <motion.div
                        key={path.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {path.title}
                                    </h4>
                                    {path.trending && (
                                        <Badge className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            Trending
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className={`text-xs ${getLevelColor(path.level)}`}>
                                        {path.level}
                                    </Badge>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {path.category}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    #{index + 1}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-xs">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                <Users className="h-3 w-3" />
                                <span>{path.enrolledCount} enrolled</span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                <BarChart3 className="h-3 w-3" />
                                <span>{path.completionRate}% completion</span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                <Clock className="h-3 w-3" />
                                <span>{path.avgTimeToComplete}w avg</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default PopularLearningPaths;