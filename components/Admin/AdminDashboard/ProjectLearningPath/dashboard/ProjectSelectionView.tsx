import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Briefcase,
    Calendar,
    Users,
    BarChart3,
    Book,
    Target,
    Award,
    ArrowRight,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetProjectsQuery } from "@/Redux/apiSlices/Projects/projectsApiSlice";

interface ProjectSelectionViewProps {
    onProjectSelect: (projectId: string) => void;
}

interface Project {
    id: string;
    name: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    status: 'active' | 'completed' | 'archived' | 'on-hold';
    technologies: string[];
    memberIds: string[];
    startDate: any;
    endDate: any;
    createdBy: string;
    createdAt: any;
}

const getLevelColor = (level: string) => {
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

const getStatusColor = (status: string) => {
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

const getCategoryLabel = (category: string) => {
    return category.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

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

export const ProjectSelectionView: React.FC<ProjectSelectionViewProps> = ({
    onProjectSelect
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Fetch projects
    const { data: projectsResponse, isLoading: isLoadingProjects, error } = useGetProjectsQuery({});
    const projects = projectsResponse?.data || [];

    // Filter projects
    const filteredProjects = projects.filter((project: Project) => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || project.level === selectedLevel;
        const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });

    // Get unique categories
    const categories = [...new Set(projects.map((p: Project) => p.category))];
    const levels = ['beginner', 'intermediate', 'advanced'];
    const statuses = ['active', 'completed', 'on-hold', 'archived'];

    if (isLoadingProjects) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        Error Loading Projects
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Failed to load projects. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <Book className="h-8 w-8" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Learning Path Dashboard
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Select a project to view its learning path dashboard, track learner progress, and analyze performance metrics.
                </p>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {projects.length}
                                </p>
                                <p className="text-sm text-blue-600 dark:text-blue-400">Total Projects</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                                    {projects.filter((p: Project) => p.status === 'active').length}
                                </p>
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">Active Projects</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            <div>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {projects.filter((p: Project) => p.status === 'completed').length}
                                </p>
                                <p className="text-sm text-purple-600 dark:text-purple-400">Completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                    {categories.length}
                                </p>
                                <p className="text-sm text-amber-600 dark:text-amber-400">Categories</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-indigo-600" />
                            Find Learning Path
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search projects by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {getCategoryLabel(category)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {levels.map(level => (
                                        <SelectItem key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    {statuses.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Projects Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {filteredProjects.length === 0 ? (
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <CardContent className="text-center py-12">
                            <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                No Projects Found
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
                                {searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedStatus !== 'all'
                                    ? 'Try adjusting your search criteria or filters to find projects.'
                                    : 'No projects are available. Create a project first to set up learning paths.'
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project: Project, index: number) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
                                    <CardContent className="p-6" onClick={() => onProjectSelect(project.id)}>
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                        <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                            {project.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                                            {project.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100" />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge className={cn("text-xs", getLevelColor(project.level))}>
                                                    {project.level}
                                                </Badge>
                                                <Badge className={cn("text-xs", getStatusColor(project.status))}>
                                                    {project.status.replace('-', ' ')}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {getCategoryLabel(project.category)}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {project.memberIds?.length || 0} members
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(project.startDate)}
                                                </div>
                                            </div>

                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                                        <Badge key={techIndex} variant="secondary" className="text-xs">
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
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};