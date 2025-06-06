"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    Save,
    RefreshCw,
    Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SessionBasicInformationSection } from "@/components/Admin/AdminDashboard/Sessions/SessionBasicInformationSection";
import { SessionSchedulingSection } from "@/components/Admin/AdminDashboard/Sessions/SessionSchedulingSection";
import { SessionDetailsSection } from "@/components/Admin/AdminDashboard/Sessions/SessionDetailsSection";
import { SessionConfigurationSection } from "@/components/Admin/AdminDashboard/Sessions/SessionConfigurationSection";
import { SessionPreview } from "@/components/Admin/AdminDashboard/Sessions/SessionPreview";
import { useCreateSessionMutation } from "@/Redux/apiSlices/Sessions/sessionApi";

interface SessionFormData {
    mentorId: string;
    topic: string;
    description: string;
    date: string;
    timeSlot: string;
    duration: number;
    objectives: string[];
    link: string;
    maxParticipants: number;
    isPublic: boolean;
    sessionType: 'individual' | 'group';
}

const CreateSessionPage: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<SessionFormData>({
        mentorId: '',
        topic: '',
        description: '',
        date: '',
        timeSlot: '',
        duration: 60,
        objectives: [],
        link: '',
        maxParticipants: 10,
        isPublic: true,
        sessionType: 'group'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);

    const [createSession, { isLoading }] = useCreateSessionMutation();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.topic.trim()) {
            newErrors.topic = 'Session topic is required';
        } else if (formData.topic.trim().length < 3) {
            newErrors.topic = 'Topic must be at least 3 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Session description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!formData.date) {
            newErrors.date = 'Session date is required';
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.date = 'Session date cannot be in the past';
            }
        }

        if (!formData.timeSlot) {
            newErrors.timeSlot = 'Time slot is required';
        }

        if (!formData.link.trim()) {
            newErrors.link = 'Meeting link is required';
        } else {
            try {
                new URL(formData.link);
            } catch {
                newErrors.link = 'Please enter a valid URL';
            }
        }

        if (formData.duration < 15 || formData.duration > 480) {
            newErrors.duration = 'Duration must be between 15 minutes and 8 hours';
        }

        if (formData.sessionType === 'group' && (formData.maxParticipants < 2 || formData.maxParticipants > 50)) {
            newErrors.maxParticipants = 'Group sessions must have 2-50 participants';
        }

        if (formData.sessionType === 'individual' && formData.maxParticipants !== 1) {
            setFormData(prev => ({ ...prev, maxParticipants: 1 }));
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

    const handleSelectChange = (name: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
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
            const sessionData = {
                ...formData,
                mentorId: formData.mentorId === 'auto-assign' ? '' : formData.mentorId,
                objectives: formData.objectives.filter(obj => obj.trim()),
            };

            await createSession(sessionData).unwrap();

            toast({
                title: "Session Created Successfully",
                description: `"${formData.topic}" has been scheduled and is now available for participants.`,
            });

            // Reset form
            setFormData({
                mentorId: '',
                topic: '',
                description: '',
                date: '',
                timeSlot: '',
                duration: 60,
                objectives: [],
                link: '',
                maxParticipants: 10,
                isPublic: true,
                sessionType: 'group'
            });
            setErrors({});
            setShowPreview(false);

        } catch (error: any) {
            toast({
                title: "Failed to Create Session",
                description: error?.data?.message || "An error occurred while creating the session.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    const hasRequiredFields = formData.topic.trim() &&
        formData.description.trim() &&
        formData.date &&
        formData.timeSlot &&
        formData.link.trim();

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className="space-y-6 px-6">
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
                            Create New Session
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Schedule a mentoring session for learners to join
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
                        {showPreview ? 'Edit Session' : 'Preview'}
                    </Button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Sections */}
                <div className="lg:col-span-2 space-y-6">
                    {!showPreview ? (
                        <>
                            <SessionBasicInformationSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
                            />

                            <SessionSchedulingSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
                            />

                            <SessionDetailsSection
                                formData={formData}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onObjectivesChange={(objectives) => setFormData(prev => ({ ...prev, objectives }))}
                            />

                            <SessionConfigurationSection
                                formData={formData}
                                errors={errors}
                                onSelectChange={handleSelectChange}
                            />
                        </>
                    ) : (
                        <SessionPreview formData={formData} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Session Status */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Video className="h-5 w-5 text-indigo-600" />
                                    Session Status
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
                                                Creating Session...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Create Session
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Session Info */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Session Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        Session Types
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Individual sessions for 1-on-1 mentoring or group sessions for collaborative learning.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        Scheduling
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Sessions must be scheduled at least 1 hour in advance for proper notification delivery.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        Meeting Links
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Provide valid meeting links (Zoom, Google Meet, Teams, etc.) for participants to join.
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

export default CreateSessionPage;