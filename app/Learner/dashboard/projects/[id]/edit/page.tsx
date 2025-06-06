"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Briefcase,
    CheckCircle,
    AlertTriangle,
    Save,
    RefreshCw,
    Eye,
    Settings,
    MessageSquare,
    Activity,
    Users,
    Layout,
    Link,
    Trash2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
    useGetProjectByIdQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetProjectMembersQuery,
    useGetProjectFeedbackQuery
} from "@/Redux/apiSlices/Projects/projectsApiSlice";
import { ProjectBasicInfoSection } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectBasicInfoSection";
import { ProjectConfigurationSection } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectConfigurationSection";
import { ProjectAreasSection } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectAreasSection";
import { ProjectResourcesSection } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectResourcesSection";
import { ProjectPreview } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectPreview";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useGetProjectAreasQuery } from "@/Redux/apiSlices/Projects/projectAreaApiSlice";
import { Label } from "@/components/ui/label";
import { convertFirebaseDateRobust, firebaseFormatDate } from "@/components/utils/dateUtils";

interface FormData {
    name: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    startDate: string;
    endDate: string;
    technologies: string[];
    learningObjectives: string[];
    repoUrl: string;
    demoUrl: string;
    completionCriteria: string[];
    visibility: 'public' | 'members' | 'mentors-only' | 'private';
    workspaceId: string;
    primaryMentorId: string;
    mentorIds: string[];
    status: 'active' | 'completed' | 'archived' | 'on-hold';
}

interface EditProjectPageProps {
    params: {
        id: string;
    };
}

const formatDate = (date: any) => {
    if (!date) return '';
    return firebaseFormatDate(date);
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'completed':
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'on-hold':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'archived':
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const EditProjectPage: React.FC<EditProjectPageProps> = ({ params }) => {
    const router = useRouter();
    const { toast } = useToast();
    const projectId = params.id;

    // API Hooks
    const { data: projectResponse, isLoading: isLoadingProject, error: projectError } = useGetProjectByIdQuery(projectId);
    const { data: areasResponse } = useGetProjectAreasQuery({ projectId, limit: 50 });
    const { data: membersResponse } = useGetProjectMembersQuery(projectId);
    const { data: feedbackResponse } = useGetProjectFeedbackQuery({ projectId, limit: 10 });
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

    const project = projectResponse?.data;
    const projectAreas = areasResponse?.data || [];
    const projectMembers = membersResponse?.data || [];
    const projectFeedback = feedbackResponse?.data || [];

    // Form state
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        category: '',
        level: 'beginner',
        startDate: '',
        endDate: '',
        technologies: [],
        learningObjectives: [],
        repoUrl: '',
        demoUrl: '',
        completionCriteria: [],
        visibility: 'public',
        workspaceId: '',
        primaryMentorId: '',
        mentorIds: [],
        status: 'active'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Initialize form data when project loads
    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                category: project.category || '',
                level: project.level || 'beginner',
                startDate: formatDate(project.startDate),
                endDate: formatDate(project.endDate),
                technologies: project.technologies || [],
                learningObjectives: project.learningObjectives || [],
                repoUrl: project.repoUrl || '',
                demoUrl: project.demoUrl || '',
                completionCriteria: project.completionCriteria || [],
                visibility: project.visibility || 'public',
                workspaceId: project.workspaceId || '',
                primaryMentorId: project.primaryMentorId || '',
                mentorIds: project.mentorIds || [],
                status: project.status || 'active'
            });
        }
    }, [project]);

    // Track unsaved changes
    useEffect(() => {
        if (project) {
            const hasChanges =
                formData.name !== project.name ||
                formData.description !== project.description ||
                formData.category !== project.category ||
                formData.level !== project.level ||
                formData.startDate !== formatDate(project.startDate) ||
                formData.endDate !== formatDate(project.endDate) ||
                JSON.stringify(formData.technologies) !== JSON.stringify(project.technologies || []) ||
                JSON.stringify(formData.learningObjectives) !== JSON.stringify(project.learningObjectives || []) ||
                formData.repoUrl !== (project.repoUrl || '') ||
                formData.demoUrl !== (project.demoUrl || '') ||
                JSON.stringify(formData.completionCriteria) !== JSON.stringify(project.completionCriteria || []) ||
                formData.visibility !== (project.visibility || 'public') ||
                formData.status !== project.status;

            setHasUnsavedChanges(hasChanges);
        }
    }, [formData, project]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Project name must be at least 3 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Project description is required';
        } else if (formData.description.trim().length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a project category';
        }

        if (new Date(convertFirebaseDateRobust(formData.startDate)) >= new Date(convertFirebaseDateRobust(formData.endDate))) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (formData.repoUrl && !formData.repoUrl.startsWith('http')) {
            newErrors.repoUrl = 'Repository URL must start with http:// or https://';
        }

        if (formData.demoUrl && !formData.demoUrl.startsWith('http')) {
            newErrors.demoUrl = 'Demo URL must start with http:// or https://';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleArrayChange = (name: string, values: string[]) => {
        setFormData(prev => ({ ...prev, [name]: values }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fix the errors before submitting.",
                variant: "destructive",
            });
            return;
        }

        try {
            const updateData = {
                id: projectId,
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category,
                level: formData.level,
                startDate: formData.startDate,
                endDate: formData.endDate,
                technologies: formData.technologies,
                learningObjectives: formData.learningObjectives,
                repoUrl: formData.repoUrl.trim() || null,
                demoUrl: formData.demoUrl.trim() || null,
                completionCriteria: formData.completionCriteria,
                visibility: formData.visibility,
                status: formData.status,
                workspaceId: formData.workspaceId || undefined,
                primaryMentorId: formData.primaryMentorId || undefined,
                mentorIds: formData.mentorIds
            };

            await updateProject(updateData).unwrap();

            toast({
                title: "Project Updated Successfully",
                description: `${formData.name} has been updated with your changes.`,
            });

            setErrors({});
            setHasUnsavedChanges(false);

        } catch (error: any) {
            toast({
                title: "Failed to Update Project",
                description: error?.data?.message || "An error occurred while updating the project.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProject(projectId).unwrap();

            toast({
                title: "Project Deleted",
                description: "The project has been permanently deleted.",
            });

            router.push('/admin/projects');
        } catch (error: any) {
            toast({
                title: "Failed to Delete Project",
                description: error?.data?.message || "An error occurred while deleting the project.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmed) return;
        }
        router.back();
    };

    if (isLoadingProject) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                    <p className="text-slate-600 dark:text-slate-400">Loading project...</p>
                </div>
            </div>
        );
    }

    if (projectError || !project) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Project Not Found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        The project you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                    <Button onClick={() => router.push('/admin/projects')} variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    const hasRequiredFields = formData.name.trim() && formData.description.trim() && formData.category;
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Edit Project
                            </h1>
                            <Badge className={cn("text-xs font-medium border", getStatusColor(project.status))}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                            {hasUnsavedChanges && (
                                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                                    Unsaved Changes
                                </Badge>
                            )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                            Update project settings, areas, and resources
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                        disabled={!hasRequiredFields}
                        className="border-slate-300 dark:border-slate-600"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        {showPreview ? 'Edit Form' : 'Preview'}
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{project.name}"? This action cannot be undone and will permanently remove all project data, areas, tasks, and resources.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isDeleting ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete Project'
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Sections */}
                <div className="lg:col-span-2">
                    {!showPreview ? (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-800">
                                <TabsTrigger value="basic" className="flex items-center gap-2 text-xs">
                                    <Briefcase className="h-4 w-4" />
                                    Basic
                                </TabsTrigger>
                                <TabsTrigger value="config" className="flex items-center gap-2 text-xs">
                                    <Settings className="h-4 w-4" />
                                    Config
                                </TabsTrigger>
                                <TabsTrigger value="areas" className="flex items-center gap-2 text-xs">
                                    <Layout className="h-4 w-4" />
                                    Areas
                                </TabsTrigger>
                                <TabsTrigger value="resources" className="flex items-center gap-2 text-xs">
                                    <Link className="h-4 w-4" />
                                    Resources
                                </TabsTrigger>
                                <TabsTrigger value="feedback" className="flex items-center gap-2 text-xs">
                                    <MessageSquare className="h-4 w-4" />
                                    Feedback
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-6">
                                <ProjectBasicInfoSection
                                    formData={formData}
                                    errors={errors}
                                    onInputChange={handleInputChange}
                                    onSelectChange={handleSelectChange}
                                />
                            </TabsContent>

                            <TabsContent value="config" className="space-y-6">
                                <ProjectConfigurationSection
                                    project={project}
                                    formData={formData}
                                    errors={errors}
                                    onInputChange={handleInputChange}
                                    onSelectChange={handleSelectChange}
                                    onArrayChange={handleArrayChange}
                                />
                            </TabsContent>

                            <TabsContent value="areas" className="space-y-6">
                                <ProjectAreasSection projectId={projectId} />
                            </TabsContent>

                            <TabsContent value="resources" className="space-y-6">
                                <ProjectResourcesSection
                                    project={project}
                                    formData={formData}
                                    errors={errors}
                                    onInputChange={handleInputChange}
                                    onArrayChange={handleArrayChange}
                                    projectId={projectId}
                                />
                            </TabsContent>

                            <TabsContent value="feedback" className="space-y-6">
                                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                                <MessageSquare className="h-4 w-4" />
                                            </div>
                                            Project Feedback
                                        </CardTitle>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Feedback and reviews from mentors and participants
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        {projectFeedback.length > 0 ? (
                                            <div className="space-y-4">
                                                {projectFeedback.map((feedback) => (
                                                    <div key={feedback.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {feedback.authorRole}
                                                                </Badge>
                                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                                    {feedback.authorName}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-slate-500">
                                                                {convertFirebaseDateRobust(feedback.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                                            {feedback.content}
                                                        </p>
                                                        {feedback.rating && (
                                                            <div className="flex items-center gap-1 mt-2">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <div key={i} className={cn(
                                                                        "w-3 h-3 rounded-full",
                                                                        i < feedback.rating! ? 'bg-yellow-400' : 'bg-slate-200 dark:bg-slate-600'
                                                                    )} />
                                                                ))}
                                                                <span className="text-xs text-slate-500 ml-1">
                                                                    {feedback.rating}/5
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                                    No Feedback Yet
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Feedback from mentors and participants will appear here
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <ProjectPreview formData={formData} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Project Stats */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Project Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                        <Layout className="h-5 w-5 mx-auto mb-1 text-indigo-600 dark:text-indigo-400" />
                                        <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                                            {projectAreas.length}
                                        </p>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400">Areas</p>
                                    </div>
                                    <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <Users className="h-5 w-5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                            {projectMembers.length}
                                        </p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Members</p>
                                    </div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <Activity className="h-5 w-5 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                        {project.progress}%
                                    </p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">Progress</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Status */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Briefcase className="h-5 w-5 text-indigo-600" />
                                    Update Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Form Validation</span>
                                    <div className="flex items-center gap-1">
                                        {!hasErrors ? (
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className={`text-sm font-medium ${!hasErrors ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {!hasErrors ? 'Valid' : 'Has Errors'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Changes</span>
                                    <div className="flex items-center gap-1">
                                        {hasUnsavedChanges ? (
                                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        )}
                                        <span className={`text-sm font-medium ${hasUnsavedChanges ? 'text-yellow-600' : 'text-emerald-600'}`}>
                                            {hasUnsavedChanges ? 'Unsaved' : 'Saved'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!hasRequiredFields || hasErrors || isUpdating || !hasUnsavedChanges}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Update Project
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => setActiveTab("areas")}
                                    >
                                        <Layout className="h-4 w-4 mr-2" />
                                        Manage Areas ({projectAreas.length})
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => setActiveTab("resources")}
                                    >
                                        <Link className="h-4 w-4 mr-2" />
                                        Manage Resources
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => router.push(`/admin/projects/${projectId}/members`)}
                                    >
                                        <Users className="h-4 w-4 mr-2" />
                                        Manage Members ({projectMembers.length})
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => router.push(`/admin/projects/${projectId}/analytics`)}
                                    >
                                        <Activity className="h-4 w-4 mr-2" />
                                        View Analytics
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Status */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Project Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Current Status</span>
                                        <Badge className={cn("text-xs font-medium border", getStatusColor(project.status))}>
                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Change Status
                                        </Label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleSelectChange('status', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="on-hold">On Hold</option>
                                            <option value="completed">Completed</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>

                                    <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
                                        <p>
                                            <strong>Created:</strong> {convertFirebaseDateRobust(project.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="mt-1">
                                            <strong>Last Updated:</strong> {convertFirebaseDateRobust(project.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Section */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Edit Guide</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        💡 Project Updates
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Changes to basic info and configuration are saved immediately. Areas and resources are managed separately.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        🎯 Project Areas
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Use the Areas tab to add, edit, or reorganize project areas. Each area can have its own tasks and timeline.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        📚 Resources
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Add learning materials, documentation, and tools in the Resources tab to help participants succeed.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        💬 Feedback
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Monitor feedback from mentors and participants to identify areas for improvement.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProjectPage;