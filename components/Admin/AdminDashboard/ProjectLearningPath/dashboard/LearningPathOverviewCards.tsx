import React from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Target,
    Award,
    Users,
    Clock,
    BarChart3,
    TrendingUp,
    CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LearningPathOverviewCardsProps {
    learningPath: {
        id: string;
        projectTitle: string;
        totalTasks: number;
        totalAreas: number;
        totalMilestones: number;
        estimatedTotalHours: number;
        skillsToLearn: any[];
        learningObjectives: string[];
        difficulty: number;
        categories: string[];
        tags: string[];
    };
    analytics?: {
        totalLearners: number;
        activeLearners: number;
        completedLearners: number;
        averageProgress: number;
        completionRate: number;
        averageCompletionTime: number;
    };
}

const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
};

const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return 'Beginner';
    if (difficulty <= 6) return 'Intermediate';
    return 'Advanced';
};

export const LearningPathOverviewCards: React.FC<LearningPathOverviewCardsProps> = ({
    learningPath,
    analytics
}) => {
    const overviewCards = [
        {
            title: "Learning Objectives",
            value: learningPath.learningObjectives?.length || 0,
            icon: BookOpen,
            color: "blue",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            borderColor: "border-blue-200 dark:border-blue-800"
        },
        {
            title: "Skills to Learn",
            value: learningPath.skillsToLearn?.length || 0,
            icon: Target,
            color: "purple",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            iconColor: "text-purple-600 dark:text-purple-400",
            borderColor: "border-purple-200 dark:border-purple-800"
        },
        {
            title: "Milestones",
            value: learningPath.totalMilestones || 0,
            icon: Award,
            color: "amber",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            iconColor: "text-amber-600 dark:text-amber-400",
            borderColor: "border-amber-200 dark:border-amber-800"
        },
        {
            title: "Total Learners",
            value: analytics?.totalLearners || 0,
            icon: Users,
            color: "green",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            iconColor: "text-green-600 dark:text-green-400",
            borderColor: "border-green-200 dark:border-green-800"
        },
        {
            title: "Estimated Hours",
            value: `${learningPath.estimatedTotalHours || 0}h`,
            icon: Clock,
            color: "indigo",
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
            iconColor: "text-indigo-600 dark:text-indigo-400",
            borderColor: "border-indigo-200 dark:border-indigo-800"
        },
        {
            title: "Completion Rate",
            value: `${Math.round(analytics?.completionRate || 0)}%`,
            icon: BarChart3,
            color: "emerald",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            borderColor: "border-emerald-200 dark:border-emerald-800"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
        >
            {/* Main Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {overviewCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card className={cn(
                                "border shadow-lg transition-all duration-200 hover:shadow-xl",
                                card.bgColor,
                                card.borderColor
                            )}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg",
                                            card.color === "blue" && "bg-blue-100 dark:bg-blue-900/30",
                                            card.color === "purple" && "bg-purple-100 dark:bg-purple-900/30",
                                            card.color === "amber" && "bg-amber-100 dark:bg-amber-900/30",
                                            card.color === "green" && "bg-green-100 dark:bg-green-900/30",
                                            card.color === "indigo" && "bg-indigo-100 dark:bg-indigo-900/30",
                                            card.color === "emerald" && "bg-emerald-100 dark:bg-emerald-900/30"
                                        )}>
                                            <Icon className={cn("h-5 w-5", card.iconColor)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-2xl font-bold",
                                                card.color === "blue" && "text-blue-900 dark:text-blue-100",
                                                card.color === "purple" && "text-purple-900 dark:text-purple-100",
                                                card.color === "amber" && "text-amber-900 dark:text-amber-100",
                                                card.color === "green" && "text-green-900 dark:text-green-100",
                                                card.color === "indigo" && "text-indigo-900 dark:text-indigo-100",
                                                card.color === "emerald" && "text-emerald-900 dark:text-emerald-100"
                                            )}>
                                                {card.value}
                                            </p>
                                            <p className={cn(
                                                "text-xs font-medium",
                                                card.color === "blue" && "text-blue-600 dark:text-blue-400",
                                                card.color === "purple" && "text-purple-600 dark:text-purple-400",
                                                card.color === "amber" && "text-amber-600 dark:text-amber-400",
                                                card.color === "green" && "text-green-600 dark:text-green-400",
                                                card.color === "indigo" && "text-indigo-600 dark:text-indigo-400",
                                                card.color === "emerald" && "text-emerald-600 dark:text-emerald-400"
                                            )}>
                                                {card.title}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Learning Path Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            Learning Path Summary
                            <Badge className={cn("ml-auto", getDifficultyColor(learningPath.difficulty))}>
                                {getDifficultyLabel(learningPath.difficulty)} ({learningPath.difficulty}/10)
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                        {learningPath.totalTasks || 0}
                                    </p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Total Tasks</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                        {learningPath.totalAreas || 0}
                                    </p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Project Areas</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                        {analytics?.activeLearners || 0}
                                    </p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Active Learners</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                        {Math.round(analytics?.averageCompletionTime || 0)}h
                                    </p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Avg Completion</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {analytics && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                            Overall Progress
                                        </span>
                                        <span className="text-sm text-indigo-600 dark:text-indigo-400">
                                            {Math.round(analytics.averageProgress)}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={analytics.averageProgress}
                                        className="h-2"
                                    />
                                </div>
                            )}

                            {/* Categories and Tags */}
                            <div className="space-y-3">
                                {learningPath.categories && learningPath.categories.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                                            Categories ({learningPath.categories.length})
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {learningPath.categories.map((category, index) => (
                                                <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                    {category}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {learningPath.tags && learningPath.tags.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                                            Tags ({learningPath.tags.length})
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {learningPath.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs text-indigo-600 border-indigo-300 dark:text-indigo-400 dark:border-indigo-700">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Success Indicator */}
                            {analytics && analytics.completionRate > 70 && (
                                <div className="flex items-center gap-2 p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    <div>
                                        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                                            High Success Rate
                                        </p>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                            This learning path has a {Math.round(analytics.completionRate)}% completion rate
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};