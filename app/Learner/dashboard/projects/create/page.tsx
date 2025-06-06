"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Briefcase,
    CheckCircle,
    AlertTriangle,
    Save,
    RefreshCw,
    Eye,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCreateProjectMutation } from "@/Redux/apiSlices/Projects/projectsApiSlice";
import { ProjectBasicInfoSection } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectBasicInfoSection";
import { ProjectConfigurationSection } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectConfigurationSection";
import { ProjectAreasSection } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectAreasSection";
import { ProjectResourcesSection } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectResourcesSection";
import { ProjectPreview } from "@/components/Admin/AdminDashboard/Projects/CreateProjects/ProjectPreview";
import { useAuth } from "@/hooks/useAuth";


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
}

const CreateProjectPage: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [projectId, setProjectId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        category: '',
        level: 'beginner',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        technologies: [],
        learningObjectives: [],
        repoUrl: '',
        demoUrl: '',
        completionCriteria: [],
        visibility: 'public',
        workspaceId: '',
        primaryMentorId: '',
        mentorIds: []
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);

    const [createProject, { isLoading }] = useCreateProjectMutation();
    const { isAdmin } = useAuth()


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

        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
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
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
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
            const projectData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category,
                level: formData.level,
                startDate: formData.startDate,
                endDate: formData.endDate,
                technologies: formData.technologies,
                learningObjectives: formData.learningObjectives,
                repoUrl: formData.repoUrl.trim() || undefined,
                demoUrl: formData.demoUrl.trim() || undefined,
                completionCriteria: formData.completionCriteria,
                visibility: formData.visibility,
                workspaceId: formData.workspaceId || undefined,
                primaryMentorId: formData.primaryMentorId || undefined,
                mentorIds: formData.mentorIds
            };

            const response = await createProject(projectData).unwrap();
            setProjectId(response.data?.id || null);

            console.log(response)

            toast({
                title: "Project Created Successfully",
                description: `${formData.name} has been created. You can now add areas and resources.`,
            });

            // Don't reset form immediately - allow user to add areas and resources
            setErrors({});

            // Show success message with option to add areas and resources
            toast({
                title: "Add Areas & Resources",
                description: "You can now organize your project into areas and add learning resources.",
                action: (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            // Focus on areas section
                            const areasSection = document.getElementById('areas-section');
                            if (areasSection) {
                                areasSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        Add Areas
                    </Button>
                )
            });

            // Navigate to project details after a brief delay
            setTimeout(() => {
                if (response.data?.id) {
                    router.push(`${isAdmin() ? "/admin/dashboard/projects/${response.data.id}" : "/Learner/dashboard/projects/${response.data.id}"}`);
                }
            }, 3000);

        } catch (error: any) {
            console.log(error)
            toast({
                title: "Failed to Create Project",
                description: error?.data?.message || "An error occurred while creating the project.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Create New Project
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Set up a new project with areas and tasks for collaborative learning
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
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Sections */}
                <div className="lg:col-span-2 space-y-6">
                    {!showPreview ? (
                        <>
                            <ProjectBasicInfoSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
                            />

                            <ProjectConfigurationSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
                                onArrayChange={handleArrayChange}
                            />

                            <ProjectAreasSection
                                projectId={projectId || undefined}
                            />

                            <ProjectResourcesSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onArrayChange={handleArrayChange}
                                projectId={projectId || undefined}
                            />
                        </>
                    ) : (
                        <ProjectPreview formData={formData} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Form Status */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Briefcase className="h-5 w-5 text-indigo-600" />
                                    Project Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Required Fields</span>
                                    <div className="flex items-center gap-1">
                                        {hasRequiredFields ? (
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                        )}
                                        <span className={`text-sm font-medium ${hasRequiredFields ? 'text-emerald-600' : 'text-yellow-600'}`}>
                                            {hasRequiredFields ? 'Complete' : 'Incomplete'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Validation</span>
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

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                                    {!projectId ? (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={!hasRequiredFields || hasErrors || isLoading}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Creating Project...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Create Project
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                                <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                                                    Project Created Successfully!
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() => router.push(`/admin/projects/${projectId}`)}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Project
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    // Reset for new project
                                                    setProjectId(null);
                                                    setFormData({
                                                        name: '',
                                                        description: '',
                                                        category: '',
                                                        level: 'beginner',
                                                        startDate: new Date().toISOString().split('T')[0],
                                                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                                        technologies: [],
                                                        learningObjectives: [],
                                                        repoUrl: '',
                                                        demoUrl: '',
                                                        completionCriteria: [],
                                                        visibility: 'public',
                                                        workspaceId: '',
                                                        primaryMentorId: '',
                                                        mentorIds: []
                                                    });
                                                    setErrors({});
                                                    setShowPreview(false);
                                                }}
                                                className="w-full"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create Another Project
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Section */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Project Setup Guide</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        📋 Project Hierarchy
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Projects → Areas → Tasks. Create areas to organize work into logical sections.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        🎯 Learning Areas
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Divide learning into focused areas like Frontend, Backend, DevOps, etc.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        🎯 Learning Objectives
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Define clear learning goals to help participants understand what they'll achieve.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        👥 Mentorship
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Assign mentors to guide participants through specific project areas.
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

export default CreateProjectPage;