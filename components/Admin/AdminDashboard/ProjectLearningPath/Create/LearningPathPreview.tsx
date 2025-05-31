import React from "react";
import { motion } from "framer-motion";
import {
    Eye,
    Target,
    Award,
    Users,
    Settings,
    BookOpen,
    Clock,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LearningPathFormData {
    projectId: string;
    projectTitle: string;
    skillsToLearn: Array<{
        id: string;
        name: string;
        category: string;
        level: 'basic' | 'intermediate' | 'advanced';
        description?: string;
        verificationCriteria?: string[];
    }>;
    learningObjectives: string[];
    customMilestones: Array<{
        id?: string;
        title: string;
        description: string;
        type: 'project-start' | 'area-complete' | 'skill-mastery' | 'project-complete' | 'custom';
        requiredTaskIds?: string[];
        requiredAreaIds?: string[];
        skillsAwarded: string[];
        estimatedHours?: number;
        difficulty?: number;
        isOptional?: boolean;
        customCriteria?: string[];
    }>;
    prerequisites: {
        skills?: string[];
        projects?: string[];
        courses?: string[];
    };
    difficulty: number;
    categories: string[];
    tags: string[];
    estimatedTotalHours: number;
}

interface LearningPathPreviewProps {
    formData: LearningPathFormData;
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

const getMilestoneTypeIcon = (type: string) => {
    switch (type) {
        case 'project-start': return '🚀';
        case 'area-complete': return '✅';
        case 'skill-mastery': return '🎯';
        case 'project-complete': return '🏆';
        case 'custom': return '⚙️';
        default: return '📍';
    }
};

const getCompletionScore = (formData: LearningPathFormData) => {
    let score = 0;
    let maxScore = 6;

    // Project selected
    if (formData.projectId) score += 1;

    // Learning objectives
    if (formData.learningObjectives.length > 0) score += 1;

    // Skills
    if (formData.skillsToLearn.length > 0) score += 1;

    // Milestones
    if (formData.customMilestones.length > 0) score += 1;

    // Configuration
    if (formData.difficulty > 0 && formData.estimatedTotalHours > 0) score += 1;

    // Categories/Tags
    if (formData.categories.length > 0 || formData.tags.length > 0) score += 1;

    return Math.round((score / maxScore) * 100);
};

export const LearningPathPreview: React.FC<LearningPathPreviewProps> = ({ formData }) => {
    const completionScore = getCompletionScore(formData);
    const skillsByCategory = formData.skillsToLearn.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, any[]>);

    const totalPrerequisites =
        (formData.prerequisites.skills?.length || 0) +
        (formData.prerequisites.projects?.length || 0) +
        (formData.prerequisites.courses?.length || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Header */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <Eye className="h-4 w-4" />
                        </div>
                        Learning Path Preview
                        <Badge className={cn("ml-auto", completionScore >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700')}>
                            {completionScore}% Complete
                        </Badge>
                    </CardTitle>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {formData.projectTitle || 'No project selected'}
                        </p>
                        <Progress value={completionScore} className="w-32" />
                    </div>
                </CardHeader>
            </Card>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {formData.learningObjectives.length}
                                </p>
                                <p className="text-sm text-blue-600 dark:text-blue-400">Objectives</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            <div>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {formData.skillsToLearn.length}
                                </p>
                                <p className="text-sm text-purple-600 dark:text-purple-400">Skills</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                    {formData.customMilestones.length}
                                </p>
                                <p className="text-sm text-amber-600 dark:text-amber-400">Milestones</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                            <div>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    {formData.estimatedTotalHours || 0}h
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400">Duration</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Learning Objectives */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                Learning Objectives
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formData.learningObjectives.length > 0 ? (
                                <div className="space-y-2">
                                    {formData.learningObjectives.map((objective, index) => (
                                        <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                {objective}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No learning objectives defined</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Target className="h-5 w-5 text-purple-600" />
                                Skills to Learn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formData.skillsToLearn.length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                                        <div key={category} className="space-y-2">
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                                {category} ({skills.length})
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {skills.map((skill, index) => (
                                                    <div key={skill.id} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                                        <span className="text-sm text-purple-700 dark:text-purple-300">
                                                            {skill.name}
                                                        </span>
                                                        <Badge className={cn("text-xs", getLevelColor(skill.level))}>
                                                            {skill.level}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No skills defined</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Milestones */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Award className="h-5 w-5 text-amber-600" />
                                Milestones
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formData.customMilestones.length > 0 ? (
                                <div className="space-y-3">
                                    {formData.customMilestones.map((milestone, index) => (
                                        <div key={milestone.id || index} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                            <div className="flex items-start gap-3">
                                                <span className="text-lg">{getMilestoneTypeIcon(milestone.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                                            {milestone.title}
                                                        </h4>
                                                        {milestone.isOptional && (
                                                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                                                                Optional
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
                                                        {milestone.description}
                                                    </p>
                                                    {milestone.skillsAwarded.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {milestone.skillsAwarded.map((skill, skillIndex) => (
                                                                <Badge key={skillIndex} variant="secondary" className="text-xs">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No milestones defined</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Prerequisites */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-green-600" />
                                Prerequisites
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {totalPrerequisites > 0 ? (
                                <div className="space-y-3">
                                    {formData.prerequisites.skills && formData.prerequisites.skills.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                                Required Skills ({formData.prerequisites.skills.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {formData.prerequisites.skills.map((skill, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {formData.prerequisites.courses && formData.prerequisites.courses.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                                Required Courses ({formData.prerequisites.courses.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {formData.prerequisites.courses.map((course, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {course}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {formData.prerequisites.projects && formData.prerequisites.projects.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                                Required Projects ({formData.prerequisites.projects.length})
                                            </h4>
                                            <div className="space-y-1">
                                                {formData.prerequisites.projects.map((projectId, index) => (
                                                    <div key={index} className="text-xs text-slate-600 dark:text-slate-400">
                                                        Project ID: {projectId}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No prerequisites required</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Settings className="h-5 w-5 text-slate-600" />
                                Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Difficulty Level</span>
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn("text-xs", getDifficultyColor(formData.difficulty))}>
                                            {getDifficultyLabel(formData.difficulty)}
                                        </Badge>
                                        <span className="text-sm text-slate-900 dark:text-white">
                                            {formData.difficulty}/10
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Estimated Duration</span>
                                    <span className="text-sm text-slate-900 dark:text-white">
                                        {formData.estimatedTotalHours || 0} hours
                                    </span>
                                </div>

                                {formData.categories.length > 0 && (
                                    <div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                                            Categories ({formData.categories.length})
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {formData.categories.map((category, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {category}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.tags.length > 0 && (
                                    <div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                                            Tags ({formData.tags.length})
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {formData.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Readiness Assessment */}
            <Card className={cn(
                "border-2",
                completionScore >= 80
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                    : completionScore >= 60
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            )}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {completionScore >= 80 ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                        )}
                        Learning Path Readiness
                        <Badge className={cn(
                            "ml-auto",
                            completionScore >= 80
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : completionScore >= 60
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                    : "bg-red-100 text-red-700 border-red-200"
                        )}>
                            {completionScore >= 80 ? 'Ready' : completionScore >= 60 ? 'Almost Ready' : 'Needs Work'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Completion</span>
                            <div className="flex items-center gap-2">
                                <Progress value={completionScore} className="w-32" />
                                <span className="text-sm font-medium">{completionScore}%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">✅ Completed</h4>
                                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                    {formData.projectId && <div>• Project selected</div>}
                                    {formData.learningObjectives.length > 0 && <div>• Learning objectives defined ({formData.learningObjectives.length})</div>}
                                    {formData.skillsToLearn.length > 0 && <div>• Skills specified ({formData.skillsToLearn.length})</div>}
                                    {formData.customMilestones.length > 0 && <div>• Milestones created ({formData.customMilestones.length})</div>}
                                    {formData.difficulty > 0 && <div>• Difficulty level set ({formData.difficulty}/10)</div>}
                                    {(formData.categories.length > 0 || formData.tags.length > 0) && <div>• Metadata added</div>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">⚠️ Recommendations</h4>
                                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                    {!formData.projectId && <div>• Select a project to create learning path for</div>}
                                    {formData.learningObjectives.length === 0 && <div>• Add learning objectives to define goals</div>}
                                    {formData.skillsToLearn.length === 0 && <div>• Define skills learners will acquire</div>}
                                    {formData.customMilestones.length === 0 && <div>• Create milestones to track progress</div>}
                                    {formData.estimatedTotalHours === 0 && <div>• Set realistic time estimate</div>}
                                    {formData.categories.length === 0 && formData.tags.length === 0 && <div>• Add categories or tags for discoverability</div>}
                                </div>
                            </div>
                        </div>

                        {completionScore >= 80 ? (
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                    🎉 <strong>Great work!</strong> Your learning path is well-structured and ready to be generated.
                                    Learners will have clear objectives, defined skills to acquire, and measurable milestones.
                                </p>
                            </div>
                        ) : completionScore >= 60 ? (
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    📝 <strong>Almost there!</strong> Your learning path has good foundation.
                                    Consider addressing the recommendations above to create a more comprehensive learning experience.
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <p className="text-sm text-red-800 dark:text-red-200">
                                    🚧 <strong>More work needed.</strong> Your learning path needs several key components.
                                    Please complete the essential sections before generating the learning path.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};