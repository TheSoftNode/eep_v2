"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    UserPlus,
    CheckCircle,
    AlertTriangle,
    Save,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCreateUserMutation } from "@/Redux/apiSlices/users/adminApi";
import { UserRole } from "@/Redux/types/Users/user";
import { useRouter } from "next/navigation";
import { BasicInformationSection } from "@/components/Admin/AdminDashboard/Users/AddUser/BasicInformationSection";
import { ProfessionalInformationSection } from "@/components/Admin/AdminDashboard/Users/AddUser/ProfessionalInformationSection";
import { AdditionalInformationSection } from "@/components/Admin/AdminDashboard/Users/AddUser/AdditionalInformationSection";
import { FormPreview } from "@/components/Admin/AdminDashboard/Users/AddUser/FormPreview";



interface FormData {
    fullName: string;
    email: string;
    role: UserRole;
    bio: string;
    company: string;
    website: string;
    github: string;
}

const AddUserPage: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        role: 'user',
        bio: '',
        company: '',
        website: '',
        github: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);

    const [createUser, { isLoading }] = useCreateUserMutation();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (formData.website && !formData.website.startsWith('http')) {
            newErrors.website = 'Website URL must start with http:// or https://';
        }

        if (formData.github && formData.github.includes('@')) {
            newErrors.github = 'GitHub username should not include @ symbol';
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

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value as UserRole }));
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
            const userData = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                role: formData.role,
                bio: formData.bio.trim() || undefined,
                company: formData.company.trim() || undefined,
                website: formData.website.trim() || undefined,
                github: formData.github.trim() || undefined
            };

            await createUser(userData).unwrap();

            toast({
                title: "User Created Successfully",
                description: `${formData.fullName} has been added to the platform.`,
            });

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                role: 'user',
                bio: '',
                company: '',
                website: '',
                github: ''
            });
            setErrors({});
            setShowPreview(false);

        } catch (error: any) {
            toast({
                title: "Failed to Create User",
                description: error?.data?.message || "An error occurred while creating the user.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    const hasRequiredFields = formData.fullName.trim() && formData.email.trim();
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
                            Add New User
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Create a new user account for the platform
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
                            <BasicInformationSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onRoleChange={handleRoleChange}
                            />

                            <ProfessionalInformationSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />

                            <AdditionalInformationSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />
                        </>
                    ) : (
                        <FormPreview formData={formData} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Form Status */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserPlus className="h-5 w-5 text-indigo-600" />
                                    Form Status
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
                                                Creating User...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Create User
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Section */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        User Roles
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Choose the appropriate role based on the user's responsibilities and access requirements.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        Professional Info
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Optional fields that help build a complete user profile for better networking.
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

export default AddUserPage;