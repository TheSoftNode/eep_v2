"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FolderPlus,
    CheckCircle,
    AlertTriangle,
    Save,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreateWorkspaceRequest } from "@/Redux/types/Workspace/workspace-dtos";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceMutation } from "@/Redux/apiSlices/workspaces/workspaceApi";
import { BasicWorkspaceSection } from "@/components/Admin/AdminDashboard/Workspace/CreateWorkspace/BasicWorkspaceSection";
import { TimelineSection } from "@/components/Admin/AdminDashboard/Workspace/CreateWorkspace/TimelineSection";
import { ConfigurationSection } from "@/components/Admin/AdminDashboard/Workspace/CreateWorkspace/ConfigurationSection";
import { WorkspacePreview } from "@/components/Admin/AdminDashboard/Workspace/CreateWorkspace/WorkspacePreview";



interface FormData {
    name: string;
    description: string;
    projectType: string;
    tags: string[];
    startDate: string;
    endDate: string;
    availableRoles: string[];
    visibility: 'public' | 'private' | 'organization';
    joinApproval: 'automatic' | 'admin_approval' | 'mentor_approval';
    allowLearnerInvites: boolean;
}

const CreateWorkspacePage: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        projectType: '',
        tags: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        availableRoles: ['frontend', 'backend', 'data_analyst', 'ui_designer', 'digital_marketing', 'mentor', 'admin'],
        visibility: 'private',
        joinApproval: 'admin_approval',
        allowLearnerInvites: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);

    const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Workspace name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Workspace name must be at least 3 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (formData.endDate && formData.startDate >= formData.endDate) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (formData.availableRoles.length === 0) {
            newErrors.availableRoles = 'At least one role must be available';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
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
            const workspaceData: CreateWorkspaceRequest = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                projectType: formData.projectType.trim() || undefined,
                tags: formData.tags,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
                availableRoles: formData.availableRoles,
                visibility: formData.visibility,
                joinApproval: formData.joinApproval,
                allowLearnerInvites: formData.allowLearnerInvites
            };

            const response = await createWorkspace(workspaceData).unwrap();

            toast({
                title: "Workspace Created Successfully",
                description: `${formData.name} has been created and is ready for collaboration.`,
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                projectType: '',
                tags: [],
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                availableRoles: ['frontend', 'backend', 'data_analyst', 'ui_designer', 'digital_marketing', 'mentor', 'admin'],
                visibility: 'private',
                joinApproval: 'admin_approval',
                allowLearnerInvites: false
            });
            setErrors({});
            setShowPreview(false);

            // Navigate to workspace list or the created workspace
            router.push('/admin/workspaces');

        } catch (error: any) {
            console.log(error)
            toast({
                title: "Failed to Create Workspace",
                description: error?.data?.message || "An error occurred while creating the workspace.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    const hasRequiredFields = formData.name.trim() && formData.description.trim();
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
                            Create New Workspace
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Set up a collaborative workspace for your team
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
                            <BasicWorkspaceSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />

                            <TimelineSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />

                            <ConfigurationSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />
                        </>
                    ) : (
                        <WorkspacePreview formData={formData} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Form Status */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FolderPlus className="h-5 w-5 text-indigo-600" />
                                    Workspace Status
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

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!hasRequiredFields || hasErrors || isLoading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Creating Workspace...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Create Workspace
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Section */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        Visibility Settings
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Choose visibility based on who should access this workspace.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        Available Roles
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Define roles that team members can be assigned in this workspace.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        Join Approval
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Control how users can join this workspace.
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

export default CreateWorkspacePage;