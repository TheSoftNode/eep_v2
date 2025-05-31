import React from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Target,
    Users,
    Settings,
    Clock,
    BarChart3,
    Flag,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LearningPathInfoCardProps {
    learningPath: {
        id: string;
        projectTitle: string;
        totalTasks: number;
        totalAreas: number;
        totalMilestones: number;
        estimatedTotalHours: number;
        skillsToLearn: Array<{
            id: string;
            name: string;
            category: string;
            level: 'basic' | 'intermediate' | 'advanced';
            description?: string;
            verificationCriteria?: string[];
        }>;
        learningObjectives: string[];
        difficulty: number;
        categories: string[];
        tags: string[];
        prerequisites?: {
            skills?: string[];
            projects?: string[];
            courses?: string[];
        };
        createdAt: any;
        updatedAt: any;
        lastRecalculated?: any;
    };
}

const getLevelColor = (level: string) => {
    switch (level) {
        case 'basic':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'intermediate':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'advanced':
            return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

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

const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('frontend')) return Target;
    if (lowerCategory.includes('backend')) return Settings;
    if (lowerCategory.includes('fullstack') || lowerCategory.includes('full')) return BarChart3;
    if (lowerCategory.includes('design')) return Flag;
    if (lowerCategory.includes('data')) return BookOpen;
    return Target;
};

export const LearningPathInfoCard: React.FC<LearningPathInfoCardProps> = ({
    learningPath
}) => {
    const skillsByCategory = learningPath.skillsToLearn?.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, any[]>) || {};

    const totalPrerequisites =
        (learningPath.prerequisites?.skills?.length || 0) +
        (learningPath.prerequisites?.projects?.length || 0) +
        (learningPath.prerequisites?.courses?.length || 0);

    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        try {
            if (date.seconds) {
                return new Date(date.seconds * 1000).toLocaleDateString();
            }
            return new Date(date).toLocaleDateString();
        } catch {
            return 'N/A';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        Learning Path Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty Level</span>
                            <Badge className={cn("text-xs", getDifficultyColor(learningPath.difficulty))}>
                                {getDifficultyLabel(learningPath.difficulty)} ({learningPath.difficulty}/10)
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Duration</span>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-slate-500" />
                                <span className="text-sm text-slate-900 dark:text-white">
                                    {learningPath.estimatedTotalHours || 0} hours
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Prerequisites</span>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-slate-500" />
                                <span className="text-sm text-slate-900 dark:text-white">
                                    {totalPrerequisites} required
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Updated</span>
                            <span className="text-sm text-slate-900 dark:text-white">
                                {formatDate(learningPath.updatedAt)}
                            </span>
                        </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                Learning Objectives ({learningPath.learningObjectives?.length || 0})
                            </h4>
                        </div>
                        {learningPath.learningObjectives && learningPath.learningObjectives.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {learningPath.learningObjectives.map((objective, index) => (
                                    <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                                            {objective}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No learning objectives defined</p>
                        )}
                    </div>

                    {/* Skills Overview */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-purple-600" />
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                Skills Overview ({learningPath.skillsToLearn?.length || 0})
                            </h4>
                        </div>

                        {Object.keys(skillsByCategory).length > 0 ? (
                            <div className="space-y-3">
                                {Object.entries(skillsByCategory).map(([category, skills]) => {
                                    const CategoryIcon = getCategoryIcon(category);
                                    return (
                                        <div key={category} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CategoryIcon className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {category} ({skills.length})
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {skills.slice(0, 4).map((skill, index) => (
                                                    <Badge key={skill.id} className={cn("text-xs", getLevelColor(skill.level))}>
                                                        {skill.name}
                                                    </Badge>
                                                ))}
                                                {skills.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{skills.length - 4} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No skills defined</p>
                        )}
                    </div>

                    {/* Structure Overview */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-slate-600" />
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                Structure Overview
                            </h4>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {learningPath.totalTasks || 0}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Tasks</p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {learningPath.totalAreas || 0}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Areas</p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {learningPath.totalMilestones || 0}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Milestones</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Learning Path Status</span>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm text-emerald-600 dark:text-emerald-400">Active</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Configuration</span>
                            <div className="flex items-center gap-1">
                                {learningPath.skillsToLearn?.length > 0 && learningPath.learningObjectives?.length > 0 ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        <span className="text-sm text-emerald-600 dark:text-emerald-400">Complete</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm text-yellow-600 dark:text-yellow-400">Incomplete</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Info */}
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                            💡 Quick Info
                        </h4>
                        <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                            <li>• Learning path is automatically updated with project changes</li>
                            <li>• Progress tracking is enabled for all enrolled learners</li>
                            <li>• Milestones award skills and track competency development</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};