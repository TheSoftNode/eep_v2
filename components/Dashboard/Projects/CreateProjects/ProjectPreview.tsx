import React from "react";
import { motion } from "framer-motion";
import {
    Briefcase,
    Calendar,
    Users,
    Target,
    CheckCircle,
    BarChart3,
    Globe,
    Github,
    Eye,
    EyeOff,
    Code,
    Clock,
    FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface FormPreviewProps {
    formData: {
        name: string;
        description: string;
        category: string;
        level: 'beginner' | 'intermediate' | 'advanced';
        startDate: string;
        endDate: string;
        technologies: string[];
        learningObjectives: string[];
        completionCriteria: string[];
        visibility: 'public' | 'members' | 'mentors-only' | 'private';
        repoUrl: string;
        demoUrl: string;
        workspaceId: string;
        primaryMentorId: string;
        mentorIds: string[];
    };
}

const getLevelBadgeStyles = (level: string) => {
    switch (level) {
        case 'beginner':
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-300";
        case 'intermediate':
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300 border-yellow-300";
        case 'advanced':
            return "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 border-red-300";
        default:
            return "bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-300 border-slate-300";
    }
};

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'web-development':
            return Code;
        case 'mobile-development':
            return Code;
        case 'data-science':
            return BarChart3;
        case 'machine-learning':
            return BarChart3;
        case 'ui-ux-design':
            return FileText;
        default:
            return Briefcase;
    }
};

const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
        case 'public':
            return Eye;
        case 'private':
            return EyeOff;
        default:
            return Users;
    }
};

const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
        case 'public':
            return 'text-emerald-600 dark:text-emerald-400';
        case 'members':
            return 'text-blue-600 dark:text-blue-400';
        case 'mentors-only':
            return 'text-purple-600 dark:text-purple-400';
        case 'private':
            return 'text-slate-600 dark:text-slate-400';
        default:
            return 'text-slate-600 dark:text-slate-400';
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
};

const getProjectInitials = (name: string) => {
    if (!name) return 'P';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export const ProjectPreview: React.FC<FormPreviewProps> = ({ formData }) => {
    const hasBasicInfo = formData.name && formData.description && formData.category;
    const hasTimeline = formData.startDate && formData.endDate;
    const hasLinks = formData.repoUrl || formData.demoUrl;
    const projectDuration = calculateDuration(formData.startDate, formData.endDate);
    const CategoryIcon = getCategoryIcon(formData.category);
    const VisibilityIcon = getVisibilityIcon(formData.visibility);

    const completionPercentage = Math.round(
        ((formData.name ? 1 : 0) +
            (formData.description ? 1 : 0) +
            (formData.category ? 1 : 0) +
            (formData.startDate ? 1 : 0) +
            (formData.endDate ? 1 : 0) +
            (formData.technologies.length > 0 ? 1 : 0) +
            (formData.learningObjectives.length > 0 ? 1 : 0) +
            (formData.repoUrl ? 1 : 0)) / 8 * 100
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
        >
            {/* Preview Header */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-indigo-600" />
                        Project Preview
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Preview how the project will appear once created
                    </p>
                </CardHeader>
            </Card>

            {/* Main Project Card */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 shadow-lg border-0 overflow-hidden">
                {/* Gradient Header */}
                <div className="h-20 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTguMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE3Ljl6TTIxIDZjMS4yIDAgMi4xLjkgMi4xIDIuMXY0LjJjMCAxLjItLjkgMi4xLTIuMSAyLjFoLTIuMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWOC4xYzAtMS4yLjktMi4xIDIuMS0yLjFIMjF6bTI0IDI0YzEuMiAwIDIuMS45IDIuMSAyLjF2NGMwIDEuMi0uOSAyLjEtMi4xIDIuMWgtNGMtMS4yIDAtMi4xLS45LTIuMS0yLjF2LTRjMC0xLjIuOS0yLjEgMi4xLTIuMWg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                    <div className="absolute top-4 right-4">
                        <div className={cn("flex items-center gap-1.5", getVisibilityColor(formData.visibility))}>
                            <VisibilityIcon className="h-4 w-4" />
                            <span className="text-xs font-medium capitalize text-white/90">
                                {formData.visibility.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                </div>

                <CardHeader className="pb-0 pt-0 px-6 flex justify-start items-start flex-col relative">
                    {/* Project Icon and Title */}
                    <div className="relative -mt-10 mb-4 flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-800 shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold">
                                {getProjectInitials(formData.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-2xl mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                {formData.name || 'Project Name'}
                            </CardTitle>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={cn("rounded-full px-3 py-1 text-xs font-medium border", getLevelBadgeStyles(formData.level))}>
                                    {formData.level.charAt(0).toUpperCase() + formData.level.slice(1)}
                                </Badge>
                                {formData.category && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <CategoryIcon className="h-3 w-3" />
                                        {formData.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-4 px-6 space-y-6">
                    {/* Description */}
                    {formData.description && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {formData.description}
                            </p>
                        </div>
                    )}

                    {/* Project Timeline */}
                    {hasTimeline && (
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Timeline</p>
                                <div className="flex items-center gap-4 mt-1">
                                    <div>
                                        <span className="text-sm text-slate-800 dark:text-slate-200">
                                            {formatDate(formData.startDate)}
                                        </span>
                                        <span className="text-xs text-slate-500 mx-2">to</span>
                                        <span className="text-sm text-slate-800 dark:text-slate-200">
                                            {formatDate(formData.endDate)}
                                        </span>
                                    </div>
                                    {projectDuration > 0 && (
                                        <Badge variant="outline" className="text-xs">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {projectDuration} days
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Technologies */}
                    {formData.technologies.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Technologies</p>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {formData.technologies.map((tech, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Learning Objectives */}
                    {formData.learningObjectives.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Learning Objectives</p>
                                <div className="space-y-1 mt-1">
                                    {formData.learningObjectives.slice(0, 3).map((objective, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{objective}</span>
                                        </div>
                                    ))}
                                    {formData.learningObjectives.length > 3 && (
                                        <p className="text-xs text-slate-500 pl-3">
                                            +{formData.learningObjectives.length - 3} more objectives
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Completion Criteria */}
                    {formData.completionCriteria.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completion Criteria</p>
                                <div className="space-y-1 mt-1">
                                    {formData.completionCriteria.slice(0, 3).map((criteria, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{criteria}</span>
                                        </div>
                                    ))}
                                    {formData.completionCriteria.length > 3 && (
                                        <p className="text-xs text-slate-500 pl-5">
                                            +{formData.completionCriteria.length - 3} more criteria
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Project Links */}
                    {hasLinks && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-medium text-sm mb-3 text-indigo-600 dark:text-indigo-400">
                                Project Links
                            </h3>
                            <div className="space-y-3">
                                {formData.repoUrl && (
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                            <Github className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Repository</p>
                                            <span className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors">
                                                {formData.repoUrl.replace(/^https?:\/\//, '')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {formData.demoUrl && (
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                            <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live Demo</p>
                                            <span className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors">
                                                {formData.demoUrl.replace(/^https?:\/\//, '')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!hasBasicInfo && (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm">Fill out the form to see your project preview</p>
                        </div>
                    )}
                </CardContent>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20"></div>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 blur-xl -ml-8 -mb-8 pointer-events-none"></div>
            </Card>

            {/* Project Summary Card */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        Project Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Project Type
                            </p>
                            <div className="flex items-center gap-2">
                                <CategoryIcon className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {formData.level.charAt(0).toUpperCase() + formData.level.slice(1)} Level Project
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Setup Progress
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completionPercentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    />
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {completionPercentage}%
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {completionPercentage < 50 ? 'Keep adding details to complete setup' :
                                    completionPercentage < 100 ? 'Almost ready to create!' : 'Ready to create project!'}
                            </p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    {completionPercentage < 100 && (
                        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                                💡 Next Steps
                            </h4>
                            <ul className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                                {!formData.technologies.length && <li>• Add technologies and tools</li>}
                                {!formData.learningObjectives.length && <li>• Define learning objectives</li>}
                                {!formData.repoUrl && <li>• Add repository URL (optional)</li>}
                                {!formData.completionCriteria.length && <li>• Set completion criteria</li>}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};