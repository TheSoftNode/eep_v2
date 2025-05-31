"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    Loader2,
    PlusCircle,
    X,
    Link as LinkIcon,
    FileText,
    Video,
    BookOpen,
    Tag,
    ChevronRight,
    ChevronLeft,
    AlertCircle,
    Users,
    Clock,
    Target,
    Zap,
    BookMarked,
    GraduationCap,
    Layers,
    Eye,
    EyeOff,
    Calendar,
    User,
    Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAddTaskMutation } from '@/Redux/apiSlices/tasks/tasksApiSlice';

// Mock types based on your API structure
interface ProjectMember {
    id: string;
    name: string;
    role: string;
    avatar?: string | null;
    initials?: string;
}

interface AddTaskModalProps {
    projectId: string;
    projectAreaId?: string;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    members: ProjectMember[];
    projectAreas?: Array<{
        id: string;
        name: string;
        status: string;
    }>;
}

const priorityOptions = [
    {
        value: 'low',
        label: 'Low',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        icon: <Flag className="h-3 w-3" />
    },
    {
        value: 'medium',
        label: 'Medium',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        icon: <Flag className="h-3 w-3" />
    },
    {
        value: 'high',
        label: 'High',
        color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
        icon: <Flag className="h-3 w-3" />
    },
    {
        value: 'critical',
        label: 'Critical',
        color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        icon: <Zap className="h-3 w-3" />
    },
];

const statusOptions = [
    {
        value: 'todo',
        label: 'To Do',
        color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        icon: <Target className="h-3 w-3" />
    },
    {
        value: 'upcoming',
        label: 'Upcoming',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
        icon: <Calendar className="h-3 w-3" />
    },
    {
        value: 'in-progress',
        label: 'In Progress',
        color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        icon: <Loader2 className="h-3 w-3" />
    },
];

const taskTypeOptions = [
    { value: 'assignment', label: 'Assignment', icon: <FileText className="h-4 w-4" /> },
    { value: 'quiz', label: 'Quiz', icon: <BookMarked className="h-4 w-4" /> },
    { value: 'project', label: 'Project', icon: <Layers className="h-4 w-4" /> },
    { value: 'research', label: 'Research', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'coding', label: 'Coding', icon: <FileText className="h-4 w-4" /> },
    { value: 'reading', label: 'Reading', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'other', label: 'Other', icon: <Target className="h-4 w-4" /> },
];

const resourceTypeOptions = [
    { value: 'link', label: 'Link', icon: LinkIcon },
    { value: 'document', label: 'Document', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'guide', label: 'Guide', icon: BookOpen },
    { value: 'template', label: 'Template', icon: Layers },
    { value: 'other', label: 'Other', icon: Tag },
];

const visibilityOptions = [
    { value: 'public', label: 'Public', icon: <Eye className="h-3 w-3" />, description: 'Visible to everyone' },
    { value: 'members', label: 'Members Only', icon: <Users className="h-3 w-3" />, description: 'Visible to project members' },
    { value: 'mentors-only', label: 'Mentors Only', icon: <GraduationCap className="h-3 w-3" />, description: 'Visible to mentors only' },
    { value: 'private', label: 'Private', icon: <EyeOff className="h-3 w-3" />, description: 'Visible to assignee only' },
];

export default function AddTaskModal({
    projectId,
    projectAreaId,
    open,
    onClose,
    onSuccess,
    members,
    projectAreas = []
}: AddTaskModalProps) {
    // Form state - adapted to new API structure
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        projectAreaId: projectAreaId || null,
        priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
        status: 'todo' as 'todo' | 'upcoming' | 'in-progress',
        taskType: 'assignment' as 'assignment' | 'quiz' | 'project' | 'research' | 'coding' | 'reading' | 'other',
        assigneeId: null as string | null,
        collaboratorIds: [] as string[],
        dueDate: '',
        startDate: '',
        estimatedHours: undefined as number | undefined,
        week: undefined as number | undefined,
        weight: undefined as number | undefined,
        maxGrade: undefined as number | undefined,
        skills: [] as string[],
        learningObjectives: [] as string[],
        visibility: 'members' as 'public' | 'members' | 'mentors-only' | 'private',
        resources: [] as Array<{
            title: string;
            type: string;
            url?: string;
            description?: string;
        }>
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState(1);
    const [newSkill, setNewSkill] = useState('');
    const [newLearningObjective, setNewLearningObjective] = useState('');
    const [newResource, setNewResource] = useState({
        title: '',
        type: 'link',
        url: '',
        description: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const [addTask, { isLoading: isAddingTask }] = useAddTaskMutation();

    const totalSteps = 4;

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            projectAreaId: projectAreaId || null,
            priority: 'medium',
            status: 'todo',
            taskType: 'assignment',
            assigneeId: null,
            collaboratorIds: [],
            dueDate: '',
            startDate: '',
            estimatedHours: undefined,
            week: undefined,
            weight: undefined,
            maxGrade: undefined,
            skills: [],
            learningObjectives: [],
            visibility: 'members',
            resources: []
        });
        setErrors({});
        setCurrentStep(1);
        setNewSkill('');
        setNewLearningObjective('');
        setNewResource({
            title: '',
            type: 'link',
            url: '',
            description: ''
        });
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.title.trim()) {
                newErrors.title = 'Task title is required';
            }
            if (!formData.dueDate) {
                newErrors.dueDate = 'Due date is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const updateNewResource = (field: string, value: string) => {
        console.log(`Updating newResource.${field} to:`, value);
        setNewResource(prev => {
            const updated = { ...prev, [field]: value };
            console.log('Updated newResource:', updated);
            return updated;
        });
    };

    const addResource = () => {
        console.log('=== ADD RESOURCE DEBUG ===');
        console.log('Current newResource:', newResource);
        console.log('Current formData.resources:', formData.resources);

        // Trim whitespace from title and url
        const trimmedTitle = newResource.title.trim();
        const trimmedUrl = newResource.url.trim();
        const trimmedDescription = newResource.description.trim();

        console.log('Trimmed values:', { trimmedTitle, trimmedUrl, trimmedDescription });

        // Validation
        if (!trimmedTitle) {
            console.log('Validation failed: No title');
            toast({
                title: "Validation Error",
                description: "Resource title is required",
                variant: "destructive",
            });
            return;
        }

        if (newResource.type === 'link' && !trimmedUrl) {
            console.log('Validation failed: No URL for link type');
            toast({
                title: "Validation Error",
                description: "URL is required for link resources",
                variant: "destructive",
            });
            return;
        }

        // Create the resource object
        const resourceToAdd = {
            title: trimmedTitle,
            type: newResource.type,
            url: trimmedUrl || undefined,
            description: trimmedDescription || undefined
        };

        console.log('Resource to add:', resourceToAdd);

        // Add to resources array
        const updatedResources = [...formData.resources, resourceToAdd];
        console.log('Updated resources array:', updatedResources);

        // Update form data
        setFormData(prev => {
            const updated = { ...prev, resources: updatedResources };
            console.log('Updated formData:', updated);
            return updated;
        });

        // Reset new resource form
        setNewResource({
            title: '',
            type: 'link',
            url: '',
            description: ''
        });

        console.log('Resource added successfully!');
        console.log('=== END ADD RESOURCE DEBUG ===');
    };


    const handleSubmit = async () => {
        if (!validateStep(1)) {
            setCurrentStep(1);
            return;
        }

        setIsLoading(true);
        try {
            // Prepare task data according to new API structure
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                projectId,
                projectAreaId: formData.projectAreaId,
                dueDate: formData.dueDate,
                startDate: formData.startDate || undefined,
                estimatedHours: formData.estimatedHours,
                assigneeId: formData.assigneeId,
                collaboratorIds: formData.collaboratorIds.length > 0 ? formData.collaboratorIds : undefined,
                priority: formData.priority,
                status: formData.status,
                taskType: formData.taskType,
                week: formData.week,
                weight: formData.weight,
                maxGrade: formData.maxGrade,
                skills: formData.skills.length > 0 ? formData.skills : undefined,
                learningObjectives: formData.learningObjectives.length > 0 ? formData.learningObjectives : undefined,
                visibility: formData.visibility,
                resources: formData.resources.length > 0 ? formData.resources.map(resource => ({
                    title: resource.title,
                    type: resource.type,
                    url: resource.url || undefined,
                    description: resource.description || undefined
                })) : []
            };

            console.log('Creating task with data:', taskData);

            // Simulate API call - replace with actual API call
            // await new Promise(resolve => setTimeout(resolve, 1500));

            await addTask(taskData).unwrap();

            toast({
                title: "Task Created Successfully",
                description: `"${formData.title}" has been added to the ${projectAreaId ? 'project area' : 'project'}.`,
            });

            resetForm();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
            toast({
                title: "Failed to Create Task",
                description: "An error occurred while creating the task. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            handleInputChange('skills', [...formData.skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
    };

    const addLearningObjective = () => {
        if (newLearningObjective.trim() && !formData.learningObjectives.includes(newLearningObjective.trim())) {
            handleInputChange('learningObjectives', [...formData.learningObjectives, newLearningObjective.trim()]);
            setNewLearningObjective('');
        }
    };

    const removeLearningObjective = (objectiveToRemove: string) => {
        handleInputChange('learningObjectives', formData.learningObjectives.filter(obj => obj !== objectiveToRemove));
    };

    // const addResource = () => {
    //     if (newResource.title.trim() && (newResource.type !== 'link' || newResource.url.trim())) {
    //         handleInputChange('resources', [...formData.resources, { ...newResource }]);
    //         setNewResource({
    //             title: '',
    //             type: 'link',
    //             url: '',
    //             description: ''
    //         });
    //     } else {
    //         toast({
    //             title: "Validation Error",
    //             description: newResource.type === 'link' ? "Resource title and URL are required" : "Resource title is required",
    //             variant: "destructive",
    //         });
    //     }
    // };

    const removeResource = (index: number) => {
        handleInputChange('resources', formData.resources.filter((_, i) => i !== index));
    };

    const getStepIcon = (step: number) => {
        switch (step) {
            case 1: return <FileText className="h-4 w-4" />;
            case 2: return <Users className="h-4 w-4" />;
            case 3: return <GraduationCap className="h-4 w-4" />;
            case 4: return <BookOpen className="h-4 w-4" />;
            default: return <Target className="h-4 w-4" />;
        }
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1: return 'Basic Information';
            case 2: return 'Assignment & Scheduling';
            case 3: return 'Learning Objectives';
            case 4: return 'Resources & Settings';
            default: return 'Step';
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    Task Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Task Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Enter a clear, descriptive task title"
                                        className={cn(
                                            "transition-colors",
                                            errors.title && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        )}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Provide detailed instructions and context for this task..."
                                        className="min-h-24 resize-none"
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Task Type
                                        </Label>
                                        <Select value={formData.taskType} onValueChange={(value) => handleInputChange('taskType', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select task type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {taskTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            {option.icon}
                                                            {option.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {projectAreas.length > 0 && !projectAreaId && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Project Area
                                            </Label>
                                            <Select
                                                value={formData.projectAreaId || 'none'}
                                                onValueChange={(value) => handleInputChange('projectAreaId', value === 'none' ? null : value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select project area (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No specific area</SelectItem>
                                                    {projectAreas.map((area) => (
                                                        <SelectItem key={area.id} value={area.id}>
                                                            {area.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Due Date <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="dueDate"
                                                type="date"
                                                value={formData.dueDate}
                                                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                                className={cn(
                                                    "pl-10",
                                                    errors.dueDate && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                )}
                                            />
                                        </div>
                                        {errors.dueDate && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.dueDate}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="startDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Start Date
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    Assignment & Priority
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Priority Level
                                        </Label>
                                        <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                            <SelectTrigger>
                                                <SelectValue>
                                                    {priorityOptions.find(p => p.value === formData.priority) && (
                                                        <div className="flex items-center gap-2">
                                                            {priorityOptions.find(p => p.value === formData.priority)!.icon}
                                                            <Badge className={cn("border", priorityOptions.find(p => p.value === formData.priority)!.color)}>
                                                                {priorityOptions.find(p => p.value === formData.priority)!.label}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {priorityOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            {option.icon}
                                                            <Badge className={cn("border", option.color)}>
                                                                {option.label}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Initial Status
                                        </Label>
                                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue>
                                                    {statusOptions.find(s => s.value === formData.status) && (
                                                        <div className="flex items-center gap-2">
                                                            {statusOptions.find(s => s.value === formData.status)!.icon}
                                                            <Badge className={cn("border", statusOptions.find(s => s.value === formData.status)!.color)}>
                                                                {statusOptions.find(s => s.value === formData.status)!.label}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            {option.icon}
                                                            <Badge className={cn("border", option.color)}>
                                                                {option.label}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Assign To
                                    </Label>
                                    <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
                                        {members.length === 0 ? (
                                            <div className="text-sm text-slate-500 dark:text-slate-400 p-2 text-center">
                                                No team members available
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    className={cn(
                                                        "flex items-center p-3 rounded-lg cursor-pointer transition-all border",
                                                        formData.assigneeId === null
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-transparent'
                                                    )}
                                                    onClick={() => handleInputChange('assigneeId', null)}
                                                >
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 mr-3">
                                                        <User className="h-4 w-4 text-slate-500" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Unassigned
                                                    </span>
                                                </div>

                                                {members.map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className={cn(
                                                            "flex items-center p-3 rounded-lg cursor-pointer transition-all border",
                                                            formData.assigneeId === member.id
                                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                                                                : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-transparent'
                                                        )}
                                                        onClick={() => handleInputChange('assigneeId', member.id)}
                                                    >
                                                        <Avatar className="h-8 w-8 mr-3 border-2 border-white dark:border-slate-800 shadow-sm">
                                                            {member.avatar ? (
                                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                            ) : (
                                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
                                                                    {member.initials || member.name.charAt(0)}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                                {member.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                {member.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="estimatedHours" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Estimated Hours
                                        </Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="estimatedHours"
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                value={formData.estimatedHours || ''}
                                                onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseFloat(e.target.value) : undefined)}
                                                placeholder="0"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="week" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Week Number
                                        </Label>
                                        <Input
                                            id="week"
                                            type="number"
                                            min="1"
                                            value={formData.week || ''}
                                            onChange={(e) => handleInputChange('week', e.target.value ? parseInt(e.target.value) : undefined)}
                                            placeholder="1"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="weight" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Task Weight
                                        </Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={formData.weight || ''}
                                            onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                                            placeholder="1.0"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                        <GraduationCap className="h-4 w-4" />
                                    </div>
                                    Learning Objectives & Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Skills Section */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Skills to Practice
                                    </Label>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Add skills that learners will practice or demonstrate with this task
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                placeholder="e.g., JavaScript, Problem Solving, UI Design"
                                                className="pl-10"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addSkill();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={addSkill}
                                            variant="outline"
                                            className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {formData.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                            {formData.skills.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                                                >
                                                    <Tag className="h-3 w-3" />
                                                    {skill}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:text-indigo-900 dark:hover:text-indigo-100"
                                                        onClick={() => removeSkill(skill)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Learning Objectives Section */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Learning Objectives
                                    </Label>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Define what learners should achieve by completing this task
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={newLearningObjective}
                                                onChange={(e) => setNewLearningObjective(e.target.value)}
                                                placeholder="e.g., Understand React hooks concepts"
                                                className="pl-10"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addLearningObjective();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={addLearningObjective}
                                            variant="outline"
                                            className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {formData.learningObjectives.length > 0 && (
                                        <div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                            {formData.learningObjectives.map((objective, index) => (
                                                <div key={index} className="flex items-start gap-2 p-2 bg-white dark:bg-slate-800 rounded-md border border-purple-100 dark:border-purple-800">
                                                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{objective}</span>
                                                    <X
                                                        className="h-4 w-4 cursor-pointer text-slate-400 hover:text-red-500 flex-shrink-0"
                                                        onClick={() => removeLearningObjective(objective)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Grading Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="space-y-2">
                                        <Label htmlFor="maxGrade" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Maximum Grade
                                        </Label>
                                        <Input
                                            id="maxGrade"
                                            type="number"
                                            min="0"
                                            value={formData.maxGrade || ''}
                                            onChange={(e) => handleInputChange('maxGrade', e.target.value ? parseFloat(e.target.value) : undefined)}
                                            placeholder="100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Visibility
                                        </Label>
                                        <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                                            <SelectTrigger>
                                                <SelectValue>
                                                    {visibilityOptions.find(v => v.value === formData.visibility) && (
                                                        <div className="flex items-center gap-2">
                                                            {visibilityOptions.find(v => v.value === formData.visibility)!.icon}
                                                            {visibilityOptions.find(v => v.value === formData.visibility)!.label}
                                                        </div>
                                                    )}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {visibilityOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                {option.icon}
                                                                {option.label}
                                                            </div>
                                                            <span className="text-xs text-slate-500">{option.description}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    Learning Resources
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Add Learning Resources</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Add helpful resources that will assist with completing this task
                                        </p>
                                    </div>

                                    {/* Add Resource Form */}
                                    {/* <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <CardContent className="pt-4 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Resource Title <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        value={newResource.title}
                                                        onChange={(e) => setNewResource({
                                                            ...newResource,
                                                            title: e.target.value
                                                        })}
                                                        placeholder="e.g., React Hooks Documentation"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Resource Type
                                                    </Label>
                                                    <Select
                                                        value={newResource.type}
                                                        onValueChange={(value) => setNewResource({
                                                            ...newResource,
                                                            type: value
                                                        })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select resource type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {resourceTypeOptions.map((option) => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    <div className="flex items-center gap-2">
                                                                        <option.icon className="h-4 w-4" />
                                                                        {option.label}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {newResource.type === 'link' && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        URL <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            value={newResource.url}
                                                            onChange={(e) => setNewResource({
                                                                ...newResource,
                                                                url: e.target.value
                                                            })}
                                                            placeholder="https://example.com/resource"
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    value={newResource.description}
                                                    onChange={(e) => setNewResource({
                                                        ...newResource,
                                                        description: e.target.value
                                                    })}
                                                    placeholder="Brief description of this resource and how it helps with the task"
                                                    className="h-20 resize-none"
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={addResource}
                                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                                            >
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Add Resource
                                            </Button>
                                        </CardContent>
                                    </Card> */}
                                    <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <CardContent className="pt-4 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Resource Title <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        value={newResource.title}
                                                        onChange={(e) => updateNewResource('title', e.target.value)}
                                                        placeholder="e.g., React Hooks Documentation"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Resource Type
                                                    </Label>
                                                    <Select
                                                        value={newResource.type}
                                                        onValueChange={(value) => updateNewResource('type', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select resource type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {resourceTypeOptions.map((option) => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    <div className="flex items-center gap-2">
                                                                        <option.icon className="h-4 w-4" />
                                                                        {option.label}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {newResource.type === 'link' && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        URL <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            value={newResource.url}
                                                            onChange={(e) => updateNewResource('url', e.target.value)}
                                                            placeholder="https://example.com/resource"
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    value={newResource.description}
                                                    onChange={(e) => updateNewResource('description', e.target.value)}
                                                    placeholder="Brief description of this resource and how it helps with the task"
                                                    className="h-20 resize-none"
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={addResource}
                                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                                            >
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Add Resource
                                            </Button>

                                            {/* Debug info - remove this in production */}
                                            <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                                <p>Debug - Current resources count: {formData.resources.length}</p>
                                                <p>Debug - New resource title: "{newResource.title}"</p>
                                                <p>Debug - New resource URL: "{newResource.url}"</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Resource List */}
                                    {formData.resources.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
                                                Added Resources ({formData.resources.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {formData.resources.map((resource, index) => {
                                                    const ResourceIcon = resourceTypeOptions.find(option => option.value === resource.type)?.icon || LinkIcon;

                                                    return (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex items-start p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
                                                        >
                                                            <div className="flex-shrink-0 p-2 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg">
                                                                <ResourceIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                            </div>
                                                            <div className="ml-3 flex-grow">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                                            {resource.title}
                                                                        </h4>
                                                                        {resource.url && (
                                                                            <p className="text-xs text-indigo-600 dark:text-indigo-400 truncate max-w-sm mt-1">
                                                                                {resource.url}
                                                                            </p>
                                                                        )}
                                                                        {resource.description && (
                                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                                                {resource.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                                                                        onClick={() => removeResource(index)}
                                                                    >
                                                                        <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
                    <DialogTitle className="flex items-center text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mr-3 shadow-lg">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        Create New Task
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2">
                        {projectAreaId ? 'Add a new task to this project area' : 'Create a comprehensive task for your project'}
                    </DialogDescription>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mt-6 px-4">
                        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                                    step <= currentStep
                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                        : "border-slate-300 dark:border-slate-600 text-slate-400"
                                )}>
                                    {step < currentStep ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        getStepIcon(step)
                                    )}
                                </div>
                                {step < totalSteps && (
                                    <div className={cn(
                                        "h-0.5 w-16 mx-2 transition-all",
                                        step < currentStep ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {getStepTitle(currentStep)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Step {currentStep} of {totalSteps}
                        </p>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-6">
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>
                </div>

                <DialogFooter className="border-t border-slate-200 dark:border-slate-800 pt-4">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex gap-2">
                            {currentStep > 1 && (
                                <Button
                                    variant="outline"
                                    onClick={handlePrevious}
                                    className="border-slate-300 dark:border-slate-600"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>

                            {currentStep < totalSteps ? (
                                <Button
                                    onClick={handleNext}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading || isAddingTask}
                                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                                >
                                    {isLoading || isAddingTask ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Task...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Create Task
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}