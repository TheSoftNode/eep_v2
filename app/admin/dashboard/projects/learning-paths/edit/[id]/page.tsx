"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    AlertTriangle,
    Save,
    RefreshCw,
    Eye,
    Search,
    Users,
    Target,
    Award,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useGetProjectsQuery } from "@/Redux/apiSlices/Projects/projectsApiSlice";
import { ProjectSelectionSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/ProjectSelectionSection";
import { BasicInformationSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/BasicInformationSection";
import { SkillsManagementSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/SkillsManagementSection";
import { MilestonesSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/MilestonesSection";
import { ConfigurationSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/ConfigurationSection";
import { LearningPathPreview } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/LearningPathPreview";
import { PrerequisitesSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/PrerequisitesSection";
import {
    useGenerateProjectLearningPathMutation,
    useGetProjectLearningDashboardQuery,
    useUpdateProjectLearningPathMutation
} from "@/Redux/apiSlices/learningPath/learningPathApi";

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

const CreateLearningPathPage: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();

    // API Hooks
    const [generateLearningPath, { isLoading: isGenerating }] = useGenerateProjectLearningPathMutation();
    const [updateLearningPath, { isLoading: isUpdating }] = useUpdateProjectLearningPathMutation();
    const { data: projectsResponse, isLoading: isLoadingProjects } = useGetProjectsQuery({});

    // State
    const [isEditMode, setIsEditMode] = useState(false);
    const [existingLearningPathId, setExistingLearningPathId] = useState<string | null>(null);
    const [formData, setFormData] = useState<LearningPathFormData>({
        projectId: '',
        projectTitle: '',
        skillsToLearn: [],
        learningObjectives: [],
        customMilestones: [],
        prerequisites: {
            skills: [],
            projects: [],
            courses: []
        },
        difficulty: 5,
        categories: [],
        tags: [],
        estimatedTotalHours: 0
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Check if selected project already has a learning path
    const { data: existingPathData } = useGetProjectLearningDashboardQuery(
        formData.projectId,
        { skip: !formData.projectId }
    );

    useEffect(() => {
        if (existingPathData?.data?.learningPath) {
            setIsEditMode(true);
            setExistingLearningPathId(existingPathData.data.learningPath.id);

            // Populate form with existing data
            const existingPath = existingPathData.data.learningPath;
            setFormData(prev => ({
                ...prev,
                skillsToLearn: existingPath.skillsToLearn || [],
                learningObjectives: existingPath.learningObjectives || [],
                prerequisites: existingPath.prerequisites || { skills: [], projects: [], courses: [] },
                difficulty: existingPath.difficulty || 5,
                categories: existingPath.categories || [],
                tags: existingPath.tags || [],
                estimatedTotalHours: existingPath.estimatedTotalHours || 0
            }));
        } else {
            setIsEditMode(false);
            setExistingLearningPathId(null);
        }
    }, [existingPathData]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.projectId) {
            newErrors.projectId = 'Please select a project';
        }

        if (formData.skillsToLearn.length === 0) {
            newErrors.skills = 'Please add at least one skill';
        }

        if (formData.learningObjectives.length === 0) {
            newErrors.objectives = 'Please add at least one learning objective';
        }

        if (formData.difficulty < 1 || formData.difficulty > 10) {
            newErrors.difficulty = 'Difficulty must be between 1 and 10';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProjectSelect = (projectId: string, projectTitle: string) => {
        setFormData(prev => ({
            ...prev,
            projectId,
            projectTitle
        }));
        if (errors.projectId) {
            setErrors(prev => ({ ...prev, projectId: '' }));
        }
    };

    const handleSkillsChange = (skills: any[]) => {
        setFormData(prev => ({ ...prev, skillsToLearn: skills }));
        if (errors.skills) {
            setErrors(prev => ({ ...prev, skills: '' }));
        }
    };

    const handleMilestonesChange = (milestones: any[]) => {
        setFormData(prev => ({ ...prev, customMilestones: milestones }));
    };

    const handleObjectivesChange = (objectives: string[]) => {
        setFormData(prev => ({ ...prev, learningObjectives: objectives }));
        if (errors.objectives) {
            setErrors(prev => ({ ...prev, objectives: '' }));
        }
    };

    const handlePrerequisitesChange = (prerequisites: any) => {
        setFormData(prev => ({ ...prev, prerequisites }));
    };

    const handleConfigChange = (field: string, value: any) => {
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
            if (isEditMode && existingLearningPathId) {
                // Update existing learning path - matches UpdateProjectLearningPathRequest
                const updateData = {
                    projectId: formData.projectId,
                    data: {
                        skillsToLearn: formData.skillsToLearn,
                        learningObjectives: formData.learningObjectives,
                        prerequisites: formData.prerequisites,
                        customMilestones: formData.customMilestones.map(milestone => ({
                            id: milestone.id,
                            title: milestone.title,
                            description: milestone.description,
                            type: milestone.type,
                            requiredTaskIds: milestone.requiredTaskIds,
                            requiredAreaIds: milestone.requiredAreaIds,
                            skillsAwarded: milestone.skillsAwarded,
                            isOptional: milestone.isOptional,
                            estimatedHours: milestone.estimatedHours,
                            difficulty: milestone.difficulty
                        }))
                    }
                };

                await updateLearningPath(updateData).unwrap();
                toast({
                    title: "Learning Path Updated",
                    description: `Learning path for ${formData.projectTitle} has been successfully updated.`,
                });
            } else {
                // Generate new learning path - matches CreateProjectLearningPathRequest
                const createData = {
                    projectId: formData.projectId,
                    skillsToLearn: formData.skillsToLearn,
                    prerequisites: formData.prerequisites,
                    customMilestones: formData.customMilestones.map(milestone => ({
                        title: milestone.title,
                        description: milestone.description,
                        type: milestone.type,
                        requiredTaskIds: milestone.requiredTaskIds,
                        requiredAreaIds: milestone.requiredAreaIds,
                        skillsAwarded: milestone.skillsAwarded,
                        isOptional: milestone.isOptional,
                        estimatedHours: milestone.estimatedHours,
                        difficulty: milestone.difficulty
                    }))
                };

                await generateLearningPath({ projectId: formData.projectId, data: createData }).unwrap();
                toast({
                    title: "Learning Path Created",
                    description: `Learning path for ${formData.projectTitle} has been successfully generated.`,
                });
            }

            // Navigate to the learning path dashboard
            setTimeout(() => {
                router.push(`/admin/dashboard/learning-paths/${formData.projectId}`);
            }, 2000);

        } catch (error: any) {
            console.error('Learning path creation/update error:', error);
            toast({
                title: isEditMode ? "Failed to Update Learning Path" : "Failed to Create Learning Path",
                description: error?.data?.message || "An error occurred while processing the learning path.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    const steps = [
        { id: 0, title: 'Project Selection', icon: Search, component: ProjectSelectionSection },
        { id: 1, title: 'Basic Information', icon: BookOpen, component: BasicInformationSection },
        { id: 2, title: 'Skills Management', icon: Target, component: SkillsManagementSection },
        { id: 3, title: 'Milestones', icon: Award, component: MilestonesSection },
        { id: 4, title: 'Prerequisites', icon: Users, component: PrerequisitesSection },
        { id: 5, title: 'Configuration', icon: Settings, component: ConfigurationSection }
    ];

    const currentStepData = steps[currentStep];
    const hasRequiredFields = formData.projectId && formData.skillsToLearn.length > 0 && formData.learningObjectives.length > 0;
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
                            {isEditMode ? 'Edit Learning Path' : 'Create Learning Path'}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {isEditMode
                                ? `Update the learning path structure for ${formData.projectTitle}`
                                : 'Design a structured learning progression for project completion'
                            }
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

            {/* Progress Steps */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4"
            >
                <div className="flex items-center flex-wrap gap-3 justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep || (index === 0 && formData.projectId);

                        return (
                            <div key={step.id} className="flex items-center">
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setCurrentStep(index)}
                                    className={`flex items-center gap-2 ${isCompleted && !isActive
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                        : ''
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{step.title}</span>
                                </Button>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Sections */}
                <div className="lg:col-span-2 space-y-6">
                    {!showPreview ? (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 0 && (
                                <ProjectSelectionSection
                                    selectedProjectId={formData.projectId}
                                    selectedProjectTitle={formData.projectTitle}
                                    onProjectSelect={handleProjectSelect}
                                    projects={projectsResponse?.data || []}
                                    isLoading={isLoadingProjects}
                                    error={errors.projectId}
                                    isEditMode={isEditMode}
                                />
                            )}
                            {currentStep === 1 && (
                                <BasicInformationSection
                                    objectives={formData.learningObjectives}
                                    onObjectivesChange={handleObjectivesChange}
                                    projectTitle={formData.projectTitle}
                                    error={errors.objectives}
                                />
                            )}
                            {currentStep === 2 && (
                                <SkillsManagementSection
                                    skills={formData.skillsToLearn}
                                    onSkillsChange={handleSkillsChange}
                                    error={errors.skills}
                                    projectId={formData.projectId || undefined}
                                    isEditMode={isEditMode}
                                />
                            )}
                            {currentStep === 3 && (
                                <MilestonesSection
                                    milestones={formData.customMilestones}
                                    onMilestonesChange={handleMilestonesChange}
                                    projectId={formData.projectId}
                                    availableSkills={formData.skillsToLearn}
                                />
                            )}
                            {currentStep === 4 && (
                                <PrerequisitesSection
                                    prerequisites={formData.prerequisites}
                                    onPrerequisitesChange={handlePrerequisitesChange}
                                    availableProjects={projectsResponse?.data || []}
                                />
                            )}
                            {currentStep === 5 && (
                                <ConfigurationSection
                                    difficulty={formData.difficulty}
                                    categories={formData.categories}
                                    tags={formData.tags}
                                    estimatedHours={formData.estimatedTotalHours}
                                    onConfigChange={handleConfigChange}
                                    errors={errors}
                                />
                            )}
                        </motion.div>
                    ) : (
                        <LearningPathPreview formData={formData} />
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() => {
                                if (currentStep < steps.length - 1) {
                                    setCurrentStep(currentStep + 1);
                                }
                            }}
                            disabled={currentStep === steps.length - 1}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Status Card */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <BookOpen className="h-5 w-5 text-indigo-600" />
                                    Learning Path Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Project Selected</span>
                                    <div className="flex items-center gap-1">
                                        {formData.projectId ? (
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Skills Added</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {formData.skillsToLearn.length}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Milestones</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {formData.customMilestones.length}
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
                                    </div>
                                </div>

                                {isEditMode && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            🔄 Editing existing learning path
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!hasRequiredFields || hasErrors || isGenerating || isUpdating}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {(isGenerating || isUpdating) ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                {isEditMode ? 'Updating...' : 'Generating...'}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                {isEditMode ? 'Update Learning Path' : 'Generate Learning Path'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Card */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Learning Path Guide</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        🎯 Skills Framework
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Define skills learners will acquire, organized by category and difficulty level.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        🏆 Milestone System
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Create checkpoints that validate learning progress and skill mastery.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        📋 Prerequisites
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Set required knowledge, skills, or completed projects before starting.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                        📊 Analytics Ready
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Track learner progress, identify bottlenecks, and optimize the learning path.
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

export default CreateLearningPathPage;







// "use client"

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//     ArrowLeft,
//     BookOpen,
//     CheckCircle,
//     AlertTriangle,
//     Save,
//     RefreshCw,
//     Eye,
//     Search,
//     Users,
//     Target,
//     Award,
//     Settings,
//     Edit3
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter, useParams } from "next/navigation";
// import { useGetProjectsQuery } from "@/Redux/apiSlices/Projects/projectsApiSlice";
// import { ProjectSelectionSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/ProjectSelectionSection";
// import { BasicInformationSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/BasicInformationSection";
// import { SkillsManagementSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/SkillsManagementSection";
// import { MilestonesSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/MilestonesSection";
// import { ConfigurationSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/ConfigurationSection";
// import { LearningPathPreview } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/LearningPathPreview";
// import { PrerequisitesSection } from "@/components/Admin/AdminDashboard/ProjectLearningPath/Create/PrerequisitesSection";
// import {
//     useGetProjectLearningDashboardQuery,
//     useUpdateProjectLearningPathMutation
// } from "@/Redux/apiSlices/learningPath/learningPathApi";

// interface LearningPathFormData {
//     projectId: string;
//     projectTitle: string;
//     skillsToLearn: Array<{
//         id: string;
//         name: string;
//         category: string;
//         level: 'basic' | 'intermediate' | 'advanced';
//         description?: string;
//         verificationCriteria?: string[];
//     }>;
//     learningObjectives: string[];
//     customMilestones: Array<{
//         id?: string;
//         title: string;
//         description: string;
//         type: 'project-start' | 'area-complete' | 'skill-mastery' | 'project-complete' | 'custom';
//         requiredTaskIds?: string[];
//         requiredAreaIds?: string[];
//         skillsAwarded: string[];
//         estimatedHours?: number;
//         difficulty?: number;
//         isOptional?: boolean;
//         customCriteria?: string[];
//     }>;
//     prerequisites: {
//         skills?: string[];
//         projects?: string[];
//         courses?: string[];
//     };
//     difficulty: number;
//     categories: string[];
//     tags: string[];
//     estimatedTotalHours: number;
// }

// const EditLearningPathPage: React.FC = () => {
//     const router = useRouter();
//     const params = useParams();
//     const { toast } = useToast();
//     const projectId = params?.projectId as string;

//     // API Hooks
//     const [updateLearningPath, { isLoading: isUpdating }] = useUpdateProjectLearningPathMutation();
//     const { data: projectsResponse, isLoading: isLoadingProjects } = useGetProjectsQuery({});
//     const {
//         data: existingPathData,
//         isLoading: isLoadingPath,
//         error: pathError
//     } = useGetProjectLearningDashboardQuery(projectId, { skip: !projectId });

//     // State
//     const [formData, setFormData] = useState<LearningPathFormData>({
//         projectId: '',
//         projectTitle: '',
//         skillsToLearn: [],
//         learningObjectives: [],
//         customMilestones: [],
//         prerequisites: {
//             skills: [],
//             projects: [],
//             courses: []
//         },
//         difficulty: 5,
//         categories: [],
//         tags: [],
//         estimatedTotalHours: 0
//     });
//     const [errors, setErrors] = useState<Record<string, string>>({});
//     const [showPreview, setShowPreview] = useState(false);
//     const [currentStep, setCurrentStep] = useState(0);
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//     const [isDataLoaded, setIsDataLoaded] = useState(false);

//     // Load existing learning path data
//     useEffect(() => {
//         if (existingPathData?.data && !isDataLoaded) {
//             const { project, learningPath } = existingPathData.data;

//             setFormData({
//                 projectId: project.id,
//                 projectTitle: project.name,
//                 skillsToLearn: learningPath.skillsToLearn || [],
//                 learningObjectives: learningPath.learningObjectives || [],
//                 customMilestones: [], // This would be populated from separate milestones API call
//                 prerequisites: learningPath.prerequisites || { skills: [], projects: [], courses: [] },
//                 difficulty: learningPath.difficulty || 5,
//                 categories: learningPath.categories || [],
//                 tags: learningPath.tags || [],
//                 estimatedTotalHours: learningPath.estimatedTotalHours || 0
//             });

//             setIsDataLoaded(true);
//         }
//     }, [existingPathData, isDataLoaded]);

//     const validateForm = () => {
//         const newErrors: Record<string, string> = {};

//         if (!formData.projectId) {
//             newErrors.projectId = 'Please select a project';
//         }

//         if (formData.skillsToLearn.length === 0) {
//             newErrors.skills = 'Please add at least one skill';
//         }

//         if (formData.learningObjectives.length === 0) {
//             newErrors.objectives = 'Please add at least one learning objective';
//         }

//         if (formData.difficulty < 1 || formData.difficulty > 10) {
//             newErrors.difficulty = 'Difficulty must be between 1 and 10';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleProjectSelect = (projectId: string, projectTitle: string) => {
//         setFormData(prev => ({
//             ...prev,
//             projectId,
//             projectTitle
//         }));
//         setHasUnsavedChanges(true);
//         if (errors.projectId) {
//             setErrors(prev => ({ ...prev, projectId: '' }));
//         }
//     };

//     const handleSkillsChange = (skills: any[]) => {
//         setFormData(prev => ({ ...prev, skillsToLearn: skills }));
//         setHasUnsavedChanges(true);
//         if (errors.skills) {
//             setErrors(prev => ({ ...prev, skills: '' }));
//         }
//     };

//     const handleMilestonesChange = (milestones: any[]) => {
//         setFormData(prev => ({ ...prev, customMilestones: milestones }));
//         setHasUnsavedChanges(true);
//     };

//     const handleObjectivesChange = (objectives: string[]) => {
//         setFormData(prev => ({ ...prev, learningObjectives: objectives }));
//         setHasUnsavedChanges(true);
//         if (errors.objectives) {
//             setErrors(prev => ({ ...prev, objectives: '' }));
//         }
//     };

//     const handlePrerequisitesChange = (prerequisites: any) => {
//         setFormData(prev => ({ ...prev, prerequisites }));
//         setHasUnsavedChanges(true);
//     };

//     const handleConfigChange = (field: string, value: any) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//         setHasUnsavedChanges(true);
//         if (errors[field]) {
//             setErrors(prev => ({ ...prev, [field]: '' }));
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             toast({
//                 title: "Validation Error",
//                 description: "Please fix the errors before submitting.",
//                 variant: "destructive",
//             });
//             return;
//         }

//         try {
//             // Update existing learning path - matches UpdateProjectLearningPathRequest
//             const updateData = {
//                 projectId: formData.projectId,
//                 data: {
//                     skillsToLearn: formData.skillsToLearn,
//                     learningObjectives: formData.learningObjectives,
//                     prerequisites: formData.prerequisites,
//                     customMilestones: formData.customMilestones.map(milestone => ({
//                         id: milestone.id,
//                         title: milestone.title,
//                         description: milestone.description,
//                         type: milestone.type,
//                         requiredTaskIds: milestone.requiredTaskIds,
//                         requiredAreaIds: milestone.requiredAreaIds,
//                         skillsAwarded: milestone.skillsAwarded,
//                         isOptional: milestone.isOptional,
//                         estimatedHours: milestone.estimatedHours,
//                         difficulty: milestone.difficulty
//                     }))
//                 }
//             };

//             await updateLearningPath(updateData).unwrap();

//             toast({
//                 title: "Learning Path Updated",
//                 description: `Learning path for ${formData.projectTitle} has been successfully updated.`,
//             });

//             setHasUnsavedChanges(false);

//             // Navigate back to learning paths list or dashboard
//             setTimeout(() => {
//                 router.push(`/admin/dashboard/projects/learning-paths`);
//             }, 2000);

//         } catch (error: any) {
//             console.error('Learning path update error:', error);
//             toast({
//                 title: "Failed to Update Learning Path",
//                 description: error?.data?.message || "An error occurred while updating the learning path.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleBack = () => {
//         if (hasUnsavedChanges) {
//             if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
//                 router.back();
//             }
//         } else {
//             router.back();
//         }
//     };

//     const steps = [
//         { id: 0, title: 'Project Selection', icon: Search, component: ProjectSelectionSection },
//         { id: 1, title: 'Basic Information', icon: BookOpen, component: BasicInformationSection },
//         { id: 2, title: 'Skills Management', icon: Target, component: SkillsManagementSection },
//         { id: 3, title: 'Milestones', icon: Award, component: MilestonesSection },
//         { id: 4, title: 'Prerequisites', icon: Users, component: PrerequisitesSection },
//         { id: 5, title: 'Configuration', icon: Settings, component: ConfigurationSection }
//     ];

//     const hasRequiredFields = formData.projectId && formData.skillsToLearn.length > 0 && formData.learningObjectives.length > 0;
//     const hasErrors = Object.keys(errors).length > 0;

//     // Loading state
//     if (isLoadingPath) {
//         return (
//             <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
//                 <div className="text-center">
//                     <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
//                     <p className="text-slate-600 dark:text-slate-400">Loading learning path...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (pathError) {
//         return (
//             <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
//                 <div className="text-center">
//                     <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//                     <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
//                         Error Loading Learning Path
//                     </h2>
//                     <p className="text-slate-600 dark:text-slate-400 mb-4">
//                         Unable to load the learning path data. Please try again.
//                     </p>
//                     <Button onClick={() => router.back()} variant="outline">
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Go Back
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="flex items-center justify-between"
//             >
//                 <div className="flex items-center gap-4">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={handleBack}
//                         className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
//                     >
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back
//                     </Button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
//                             <Edit3 className="h-6 w-6 text-indigo-600" />
//                             Edit Learning Path
//                         </h1>
//                         <p className="text-slate-600 dark:text-slate-400 mt-1">
//                             Update the learning path structure for {formData.projectTitle || 'selected project'}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     {hasUnsavedChanges && (
//                         <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
//                             <AlertTriangle className="h-4 w-4" />
//                             <span className="text-sm">Unsaved changes</span>
//                         </div>
//                     )}
//                     <Button
//                         variant="outline"
//                         onClick={() => setShowPreview(!showPreview)}
//                         disabled={!hasRequiredFields}
//                         className="border-slate-300 dark:border-slate-600"
//                     >
//                         <Eye className="h-4 w-4 mr-2" />
//                         {showPreview ? 'Edit Form' : 'Preview'}
//                     </Button>
//                 </div>
//             </motion.div>

//             {/* Progress Steps */}
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4"
//             >
//                 <div className="flex items-center justify-between">
//                     {steps.map((step, index) => {
//                         const Icon = step.icon;
//                         const isActive = index === currentStep;
//                         const isCompleted = index < currentStep || (index === 0 && formData.projectId);

//                         return (
//                             <div key={step.id} className="flex items-center">
//                                 <Button
//                                     variant={isActive ? "default" : "ghost"}
//                                     size="sm"
//                                     onClick={() => setCurrentStep(index)}
//                                     className={`flex items-center gap-2 ${isCompleted && !isActive
//                                         ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
//                                         : ''
//                                         }`}
//                                 >
//                                     <Icon className="h-4 w-4" />
//                                     <span className="hidden sm:inline">{step.title}</span>
//                                 </Button>
//                                 {index < steps.length - 1 && (
//                                     <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
//                                         }`} />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </motion.div>

//             {/* Main Content */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Form Sections */}
//                 <div className="lg:col-span-2 space-y-6">
//                     {!showPreview ? (
//                         <motion.div
//                             key={currentStep}
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             {currentStep === 0 && (
//                                 <ProjectSelectionSection
//                                     selectedProjectId={formData.projectId}
//                                     selectedProjectTitle={formData.projectTitle}
//                                     onProjectSelect={handleProjectSelect}
//                                     projects={projectsResponse?.data || []}
//                                     isLoading={isLoadingProjects}
//                                     error={errors.projectId}
//                                     isEditMode={true}
//                                 />
//                             )}
//                             {currentStep === 1 && (
//                                 <BasicInformationSection
//                                     objectives={formData.learningObjectives}
//                                     onObjectivesChange={handleObjectivesChange}
//                                     projectTitle={formData.projectTitle}
//                                     error={errors.objectives}
//                                 />
//                             )}
//                             {currentStep === 2 && (
//                                 <SkillsManagementSection
//                                     skills={formData.skillsToLearn}
//                                     onSkillsChange={handleSkillsChange}
//                                     error={errors.skills}
//                                     projectId={formData.projectId || undefined}
//                                     isEditMode={true}
//                                 />
//                             )}
//                             {currentStep === 3 && (
//                                 <MilestonesSection
//                                     milestones={formData.customMilestones}
//                                     onMilestonesChange={handleMilestonesChange}
//                                     projectId={formData.projectId}
//                                     availableSkills={formData.skillsToLearn}
//                                 />
//                             )}
//                             {currentStep === 4 && (
//                                 <PrerequisitesSection
//                                     prerequisites={formData.prerequisites}
//                                     onPrerequisitesChange={handlePrerequisitesChange}
//                                     availableProjects={projectsResponse?.data || []}
//                                 />
//                             )}
//                             {currentStep === 5 && (
//                                 <ConfigurationSection
//                                     difficulty={formData.difficulty}
//                                     categories={formData.categories}
//                                     tags={formData.tags}
//                                     estimatedHours={formData.estimatedTotalHours}
//                                     onConfigChange={handleConfigChange}
//                                     errors={errors}
//                                 />
//                             )}
//                         </motion.div>
//                     ) : (
//                         <LearningPathPreview formData={formData} />
//                     )}

//                     {/* Navigation Buttons */}
//                     <div className="flex justify-between pt-6">
//                         <Button
//                             variant="outline"
//                             onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
//                             disabled={currentStep === 0}
//                         >
//                             Previous
//                         </Button>
//                         <Button
//                             onClick={() => {
//                                 if (currentStep < steps.length - 1) {
//                                     setCurrentStep(currentStep + 1);
//                                 }
//                             }}
//                             disabled={currentStep === steps.length - 1}
//                         >
//                             Next
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Sidebar */}
//                 <div className="lg:col-span-1">
//                     <div className="sticky top-6 space-y-6">
//                         {/* Status Card */}
//                         <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2 text-lg">
//                                     <Edit3 className="h-5 w-5 text-indigo-600" />
//                                     Edit Status
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">Project Selected</span>
//                                     <div className="flex items-center gap-1">
//                                         {formData.projectId ? (
//                                             <CheckCircle className="h-4 w-4 text-emerald-500" />
//                                         ) : (
//                                             <AlertTriangle className="h-4 w-4 text-yellow-500" />
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">Skills Added</span>
//                                     <div className="flex items-center gap-1">
//                                         <span className="text-sm font-medium text-slate-900 dark:text-white">
//                                             {formData.skillsToLearn.length}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">Milestones</span>
//                                     <div className="flex items-center gap-1">
//                                         <span className="text-sm font-medium text-slate-900 dark:text-white">
//                                             {formData.customMilestones.length}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">Validation</span>
//                                     <div className="flex items-center gap-1">
//                                         {!hasErrors ? (
//                                             <CheckCircle className="h-4 w-4 text-emerald-500" />
//                                         ) : (
//                                             <AlertTriangle className="h-4 w-4 text-red-500" />
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                                     <p className="text-sm text-blue-700 dark:text-blue-300">
//                                         ✏️ Editing existing learning path
//                                     </p>
//                                 </div>

//                                 <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
//                                     <Button
//                                         onClick={handleSubmit}
//                                         disabled={!hasRequiredFields || hasErrors || isUpdating}
//                                         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
//                                     >
//                                         {isUpdating ? (
//                                             <>
//                                                 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                                 Updating...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Save className="h-4 w-4 mr-2" />
//                                                 Update Learning Path
//                                             </>
//                                         )}
//                                     </Button>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {/* Help Card */}
//                         <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
//                             <CardHeader>
//                                 <CardTitle className="text-lg">Edit Guidelines</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-3">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
//                                         🔄 Live Updates
//                                     </h4>
//                                     <p className="text-xs text-slate-600 dark:text-slate-400">
//                                         Changes are saved individually as you modify skills and milestones through their respective sections.
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
//                                         🎯 Skill Dependencies
//                                     </h4>
//                                     <p className="text-xs text-slate-600 dark:text-slate-400">
//                                         Be careful when removing skills that are referenced in milestones or prerequisites.
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
//                                         📊 Impact Assessment
//                                     </h4>
//                                     <p className="text-xs text-slate-600 dark:text-slate-400">
//                                         Changes to difficulty and time estimates will affect learner recommendations and analytics.
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
//                                         👥 Active Learners
//                                     </h4>
//                                     <p className="text-xs text-slate-600 dark:text-slate-400">
//                                         Consider the impact on users currently following this learning path before making major changes.
//                                     </p>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditLearningPathPage;