import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, Calendar, Users, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FirebaseDate } from "@/Redux/types/Projects";
import { firebaseFormatDate } from "@/components/utils/dateUtils";

interface Project {
    id: string;
    name: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    status: 'active' | 'completed' | 'archived' | 'on-hold';
    technologies: string[];
    memberIds: string[];
    startDate: FirebaseDate;
    endDate: FirebaseDate;
    createdBy: string;
    createdAt: FirebaseDate;
}

interface ProjectSelectionSectionProps {
    selectedProjectId: string;
    selectedProjectTitle: string;
    onProjectSelect: (projectId: string, projectTitle: string) => void;
    projects: Project[];
    isLoading: boolean;
    error?: string;
    isEditMode?: boolean;
}

const getLevelBadgeColor = (level: string) => {
    switch (level) {
        case 'beginner':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'intermediate':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'advanced':
            return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'completed':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'on-hold':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'archived':
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

export const ProjectSelectionSection: React.FC<ProjectSelectionSectionProps> = ({
    selectedProjectId,
    selectedProjectTitle,
    onProjectSelect,
    projects,
    isLoading,
    error,
    isEditMode = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');

    // Filter projects
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || project.level === selectedLevel;

        return matchesSearch && matchesCategory && matchesLevel;
    });

    // Get unique categories and levels for filters
    const categories = [...new Set(projects.map(p => p.category))];
    const levels = ['beginner', 'intermediate', 'advanced'];

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                            <Search className="h-4 w-4" />
                        </div>
                        Select Project
                        {isEditMode && <Badge variant="outline" className="text-blue-600 border-blue-300">Edit Mode</Badge>}
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {isEditMode
                            ? "You're editing an existing learning path. Project selection is locked."
                            : "Choose the project you want to create a learning path for"
                        }
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Selected Project Display (Edit Mode) */}
                    {isEditMode && selectedProject && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-blue-900 dark:text-blue-100">
                                        {selectedProject.name}
                                    </h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                        {selectedProject.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={cn("text-xs", getLevelBadgeColor(selectedProject.level))}>
                                            {selectedProject.level}
                                        </Badge>
                                        <Badge className={cn("text-xs", getStatusBadgeColor(selectedProject.status))}>
                                            {selectedProject.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search and Filters (Create Mode) */}
                    {!isEditMode && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="project-search">Search Projects</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="project-search"
                                        placeholder="Search by project name or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Level</Label>
                                    <select
                                        value={selectedLevel}
                                        onChange={(e) => setSelectedLevel(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Levels</option>
                                        {levels.map(level => (
                                            <option key={level} value={level}>
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Projects List */}
                    {!isEditMode && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                                    Available Projects ({filteredProjects.length})
                                </h3>
                                {selectedProjectId && (
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle className="h-4 w-4" />
                                        Project Selected
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                </div>
                            )}

                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                    <span className="ml-3 text-slate-600 dark:text-slate-400">Loading projects...</span>
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                        No Projects Found
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                                        {searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all'
                                            ? 'Try adjusting your search criteria or filters.'
                                            : 'No projects are available. Create a project first before setting up a learning path.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                                    {filteredProjects.map((project) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "group p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md",
                                                selectedProjectId === project.id
                                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400"
                                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
                                            )}
                                            onClick={() => onProjectSelect(project.id, project.name)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className={cn(
                                                        "p-2 rounded-lg",
                                                        selectedProjectId === project.id
                                                            ? "bg-indigo-100 dark:bg-indigo-900/30"
                                                            : "bg-slate-100 dark:bg-slate-700"
                                                    )}>
                                                        <Briefcase className={cn(
                                                            "h-5 w-5",
                                                            selectedProjectId === project.id
                                                                ? "text-indigo-600 dark:text-indigo-400"
                                                                : "text-slate-600 dark:text-slate-400"
                                                        )} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium text-slate-900 dark:text-white">
                                                                {project.name}
                                                            </h4>
                                                            {selectedProjectId === project.id && (
                                                                <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                                            {project.description}
                                                        </p>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge className={cn("text-xs", getLevelBadgeColor(project.level))}>
                                                                {project.level}
                                                            </Badge>
                                                            <Badge className={cn("text-xs", getStatusBadgeColor(project.status))}>
                                                                {project.status}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {project.category.replace('-', ' ')}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <Users className="h-3 w-3" />
                                                                {project.memberIds?.length || 0} members
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {firebaseFormatDate(project.startDate)}
                                                            </span>
                                                        </div>
                                                        {project.technologies && project.technologies.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {project.technologies.slice(0, 3).map((tech, index) => (
                                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                                        {tech}
                                                                    </Badge>
                                                                ))}
                                                                {project.technologies.length > 3 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        +{project.technologies.length - 3} more
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Selection Summary */}
                    {selectedProjectId && !isEditMode && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                                        Project Selected: {selectedProjectTitle}
                                    </h4>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                                        Ready to configure the learning path structure. Continue to the next step to define learning objectives.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};