"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, User, Mail, Building2, Globe, Github, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateUserMutation } from "@/Redux/apiSlices/users/adminApi";
import { cn } from "@/lib/utils";
import { CondensedMentorSection } from "./CondensedMentorSection";

const InputField = ({
    id,
    label,
    icon: Icon,
    required = false,
    type = "text",
    placeholder,
    errors,
    ...props
}: {
    id: string;
    label: string;
    icon: any;
    required?: boolean;
    type?: string;
    placeholder: string;
    errors: Record<string, string>;
} & any) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                className={cn(
                    "pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors",
                    errors[id] && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                {...props}
            />
        </div>
        {errors[id] && (
            <p className="text-sm text-red-500">{errors[id]}</p>
        )}
    </div>
);

export const CreateUserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}> = ({ isOpen, onClose, onUserCreated }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'user' as 'user' | 'admin' | 'mentor' | 'learner',
        bio: '',
        company: '',
        website: '',
        github: '',
        expertise: [] as string[],
        skills: [] as string[],
        languages: ['English'],
        experience: 0,
        timezone: 'UTC+00:00',
        isAvailable: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [createUser, { isLoading }] = useCreateUserMutation();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (formData.role === 'mentor') {
            if (!formData.expertise || formData.expertise.length === 0) {
                newErrors.expertise = 'At least one area of expertise is required for mentors';
            }

            if (formData.experience < 0 || formData.experience > 50) {
                newErrors.experience = 'Experience must be between 0 and 50 years';
            }
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
        setFormData(prev => ({ ...prev, role: value as typeof formData.role }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const userData = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            role: formData.role,
            bio: formData.bio.trim() || undefined,
            company: formData.company.trim() || undefined,
            website: formData.website.trim() || undefined,
            github: formData.github.trim() || undefined,
            ...(formData.role === 'mentor' && {
                metadata: {
                    expertise: formData.expertise,
                    skills: [],
                    languages: formData.languages,
                    experience: formData.experience,
                    timezone: formData.timezone,
                    isAvailable: true
                }
            })
        };

        try {
            await createUser(userData).unwrap();
            setFormData({
                fullName: '',
                email: '',
                role: 'user',
                bio: '',
                company: '',
                website: '',
                github: '',
                expertise: [],
                skills: [],
                languages: ['English'],
                experience: 0,
                timezone: 'UTC+00:00',
                isAvailable: true
            });
            onUserCreated();
            onClose();
            toast({
                title: "User Created",
                description: "New user has been created successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to create user.",
                variant: "destructive",
            });
        }
    };

    const handleClose = () => {
        setFormData({
            fullName: '',
            email: '',
            role: 'user',
            bio: '',
            company: '',
            website: '',
            github: '',
            expertise: [],
            skills: [],
            languages: ['English'],
            experience: 0,
            timezone: 'UTC+00:00',
            isAvailable: true
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl bg-white max-h-[95vh] overflow-auto dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <DialogHeader className="pb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Create New User
                                </DialogTitle>
                                <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                                    Add a new user to the platform. They will receive a welcome email.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    id="fullName"
                                    name="fullName"
                                    label="Full Name"
                                    icon={User}
                                    required
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    errors={errors}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    icon={Mail}
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    errors={errors}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Role
                                </Label>
                                <Select value={formData.role} onValueChange={handleRoleChange}>
                                    <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="mentor">Mentor</SelectItem>
                                        <SelectItem value="learner">Learner</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                Professional Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    id="company"
                                    name="company"
                                    label="Company"
                                    icon={Building2}
                                    placeholder="Acme Corp"
                                    value={formData.company}
                                    errors={errors}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    id="website"
                                    name="website"
                                    label="Website"
                                    icon={Globe}
                                    placeholder="https://example.com"
                                    value={formData.website}
                                    errors={errors}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <InputField
                                id="github"
                                name="github"
                                label="GitHub Username"
                                icon={Github}
                                placeholder="johndoe"
                                value={formData.github}
                                errors={errors}
                                onChange={handleInputChange}
                            />
                        </div>

                        {formData.role === 'mentor' && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Mentor Information
                                </h3>
                                <CondensedMentorSection
                                    formData={formData}
                                    errors={errors}
                                    onExpertiseChange={(expertise) => setFormData(prev => ({ ...prev, expertise }))}
                                    onExperienceChange={(experience) => setFormData(prev => ({ ...prev, experience }))}
                                    onLanguagesChange={(languages) => setFormData(prev => ({ ...prev, languages }))}
                                    onTimezoneChange={(timezone) => setFormData(prev => ({ ...prev, timezone }))}
                                />
                            </div>
                        )}

                        {/* Bio */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                Additional Information
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Bio
                                </Label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about this user..."
                                        rows={3}
                                        className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="border-slate-300 dark:border-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-sm"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="mr-2"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </motion.div>
                                    Creating...
                                </>
                            ) : (
                                'Create User'
                            )}
                        </Button>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

