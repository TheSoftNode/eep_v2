"use client";

import React, { useState } from 'react';
import {
    CheckCircle,
    Loader2,
    X,
    PlusCircle,
    Link as LinkIcon,
    FileText,
    Video,
    BookOpen,
    Tag,
    Calendar as CalendarIcon,
    User,
    Edit3
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { UnifiedTask } from '@/Redux/types/Projects/task';
import { ProjectMember } from '@/Redux/types/Projects';
import { firebaseFormatDate } from '@/components/utils/dateUtils';

interface EditTaskModalProps {
    task: UnifiedTask;
    open: boolean;
    onClose: () => void;
    onSave: (task: UnifiedTask) => void;
    members: ProjectMember[];
    projectAreas?: Array<{
        id: string;
        name: string;
        status: string;
    }>;
    isLoading?: boolean;
}

const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
];

const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { value: 'upcoming', label: 'Upcoming', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'submitted', label: 'Submitted', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'overdue', label: 'Overdue', color: 'bg-orange-100 text-orange-700 border-orange-200' },
];

const taskTypeOptions = [
    { value: 'assignment', label: 'Assignment', icon: <FileText className="h-4 w-4" /> },
    { value: 'quiz', label: 'Quiz', icon: <CheckCircle className="h-4 w-4" /> },
    { value: 'project', label: 'Project', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'research', label: 'Research', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'coding', label: 'Coding', icon: <FileText className="h-4 w-4" /> },
    { value: 'reading', label: 'Reading', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'other', label: 'Other', icon: <Tag className="h-4 w-4" /> },
];

const resourceTypeOptions = [
    { value: 'link', label: 'Link', icon: LinkIcon },
    { value: 'document', label: 'Document', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'guide', label: 'Guide', icon: BookOpen },
    { value: 'other', label: 'Other', icon: Tag },
];

const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Visible to everyone' },
    { value: 'members', label: 'Members Only', description: 'Visible to project members' },
    { value: 'mentors-only', label: 'Mentors Only', description: 'Visible to mentors only' },
    { value: 'private', label: 'Private', description: 'Visible to assignee only' },
];

export default function EditTaskModal({
    task,
    open,
    onClose,
    onSave,
    members,
    projectAreas = [],
    isLoading = false
}: EditTaskModalProps) {
    // Form state using formData object like the original
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description || '',
        projectAreaId: task.projectAreaId || null,
        priority: task.priority,
        status: task.status,
        taskType: task.taskType || 'assignment',
        assigneeId: task.assigneeId || null,
        collaboratorIds: task.collaboratorIds || [],
        dueDate: task.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate : format(firebaseFormatDate(task.dueDate), 'yyyy-MM-dd')) : '',
        startDate: task.startDate ? (typeof task.startDate === 'string' ? task.startDate : format(firebaseFormatDate(task.startDate), 'yyyy-MM-dd')) : '',
        estimatedHours: task.estimatedHours || undefined,
        week: task.week || undefined,
        weight: task.weight || undefined,
        maxGrade: task.maxGrade || undefined,
        skills: task.skills || [],
        learningObjectives: task.learningObjectives || [],
        visibility: task.visibility || 'members',
        resources: task.resources?.map(r => ({
            ...r,
            id: r.id || `resource_${Date.now()}`
        })) || []
    });

    const [newSkill, setNewSkill] = useState('');
    const [newLearningObjective, setNewLearningObjective] = useState('');
    const [newResource, setNewResource] = useState({
        title: '',
        type: 'link',
        url: '',
        description: ''
    });

    // UI state
    const [activeTab, setActiveTab] = useState('basic');
    const [isSaving, setIsSaving] = useState(false);
    const [dueDateOpen, setDueDateOpen] = useState(false);
    const [startDateOpen, setStartDateOpen] = useState(false);
    const { toast } = useToast();

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast({
                title: "Validation Error",
                description: "Task title is required",
                variant: "destructive",
            });
            return;
        }

        if (!formData.dueDate) {
            toast({
                title: "Validation Error",
                description: "Due date is required",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            const updatedTask: UnifiedTask = {
                ...task,
                title: formData.title.trim(),
                description: formData.description.trim(),
                projectAreaId: formData.projectAreaId,
                priority: formData.priority,
                status: formData.status,
                taskType: formData.taskType,
                assigneeId: formData.assigneeId,
                collaboratorIds: formData.collaboratorIds,
                dueDate: formData.dueDate,
                startDate: formData.startDate || undefined,
                estimatedHours: formData.estimatedHours,
                week: formData.week,
                weight: formData.weight,
                maxGrade: formData.maxGrade,
                skills: formData.skills,
                learningObjectives: formData.learningObjectives,
                visibility: formData.visibility,
                resources: formData.resources.map(resource => ({
                    id: resource.id || `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    title: resource.title,
                    type: resource.type,
                    url: resource.url || undefined,
                    description: resource.description || undefined
                })),
                updatedAt: new Date().toISOString()
            };

            await onSave(updatedTask);

            toast({
                title: "Task Updated Successfully",
                description: `"${formData.title}" has been updated with your changes.`,
            });

            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
            toast({
                title: "Failed to Update Task",
                description: "An error occurred while updating the task. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
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

    const addResource = () => {
        if (newResource.title.trim() && (newResource.type !== 'link' || newResource.url.trim())) {
            handleInputChange('resources', [...formData.resources, { ...newResource, id: `resource_${Date.now()}` }]);
            setNewResource({ title: '', type: 'link', url: '', description: '' });
        } else {
            toast({
                title: "Validation Error",
                description: newResource.type === 'link' ? "Resource title and URL are required" : "Resource title is required",
                variant: "destructive",
            });
        }
    };

    const removeResource = (index: number) => {
        handleInputChange('resources', formData.resources.filter((_, i) => i !== index));
    };

    const getSelectedColor = (value: string, options: typeof priorityOptions) => {
        return options.find(p => p.value === value)?.color || options[0].color;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                        <Edit3 className="mr-2 h-5 w-5 text-indigo-600" />
                        Edit Task
                    </DialogTitle>
                    <DialogDescription>
                        Update task details, assignment, and resources
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-grow overflow-y-auto py-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-3 mb-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="learning">Learning & Skills</TabsTrigger>
                            <TabsTrigger value="resources">Resources</TabsTrigger>
                        </TabsList>

                        {/* Basic Info Tab */}
                        <TabsContent value="basic" className="space-y-4">
                            {/* Task Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Task Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter task title"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Enter task description"
                                    className="min-h-20"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Task Type */}
                                <div className="space-y-2">
                                    <Label>Task Type</Label>
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

                                {/* Project Area */}
                                {projectAreas.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Project Area</Label>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status */}
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue>
                                                <Badge className={cn("border", getSelectedColor(formData.status, statusOptions))}>
                                                    {statusOptions.find(s => s.value === formData.status)?.label}
                                                </Badge>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <Badge className={cn("border", option.color)}>
                                                        {option.label}
                                                    </Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                        <SelectTrigger>
                                            <SelectValue>
                                                <Badge className={cn("border", getSelectedColor(formData.priority, priorityOptions))}>
                                                    {priorityOptions.find(p => p.value === formData.priority)?.label}
                                                </Badge>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorityOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <Badge className={cn("border", option.color)}>
                                                        {option.label}
                                                    </Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Due Date */}
                                <div className="space-y-2">
                                    <Label>Due Date <span className="text-red-500">*</span></Label>
                                    <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.dueDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.dueDate ? format(new Date(formData.dueDate), 'PPP') : <span>Select date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                                                onSelect={(date) => {
                                                    handleInputChange('dueDate', date ? format(date, 'yyyy-MM-dd') : '');
                                                    setDueDateOpen(false);
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Start Date */}
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.startDate ? format(new Date(formData.startDate), 'PPP') : <span>Select date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formData.startDate ? new Date(formData.startDate) : undefined}
                                                onSelect={(date) => {
                                                    handleInputChange('startDate', date ? format(date, 'yyyy-MM-dd') : '');
                                                    setStartDateOpen(false);
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Assignee Selection */}
                            <div className="space-y-2">
                                <Label>Assign To</Label>
                                <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-2">
                                    <div
                                        className={cn(
                                            "flex items-center p-2 rounded-md cursor-pointer",
                                            formData.assigneeId === null
                                                ? 'bg-indigo-100 border border-indigo-200'
                                                : 'hover:bg-gray-100'
                                        )}
                                        onClick={() => handleInputChange('assigneeId', null)}
                                    >
                                        <User className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="text-sm font-medium">Unassigned</span>
                                    </div>

                                    {members.map((member) => (
                                        <div
                                            key={member.id}
                                            className={cn(
                                                "flex items-center p-2 rounded-md cursor-pointer",
                                                formData.assigneeId === member.id
                                                    ? 'bg-indigo-100 border border-indigo-200'
                                                    : 'hover:bg-gray-100'
                                            )}
                                            onClick={() => handleInputChange('assigneeId', member.id)}
                                        >
                                            <Avatar className="h-6 w-6 mr-2">
                                                {member.avatar ? (
                                                    <AvatarImage src={member.avatar} alt={member.name} />
                                                ) : (
                                                    <AvatarFallback className="text-xs">
                                                        {member.initials || member.name.charAt(0)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Fields */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Estimated Hours</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={formData.estimatedHours || ''}
                                        onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Week</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.week || ''}
                                        onChange={(e) => handleInputChange('week', e.target.value ? parseInt(e.target.value) : undefined)}
                                        placeholder="1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Weight</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.weight || ''}
                                        onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        placeholder="1.0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Max Grade</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.maxGrade || ''}
                                        onChange={(e) => handleInputChange('maxGrade', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        placeholder="100"
                                    />
                                </div>
                            </div>

                            {/* Visibility */}
                            <div className="space-y-2">
                                <Label>Visibility</Label>
                                <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {visibilityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex flex-col">
                                                    <span>{option.label}</span>
                                                    <span className="text-xs text-gray-500">{option.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        {/* Learning & Skills Tab */}
                        <TabsContent value="learning" className="space-y-4">
                            {/* Skills */}
                            <div className="space-y-3">
                                <Label>Skills to Practice</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="e.g., JavaScript, Problem Solving"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={addSkill} variant="outline">
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </div>

                                {formData.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="flex items-center gap-1 px-2 py-1"
                                            >
                                                <Tag className="h-3 w-3" />
                                                {skill}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                                                    onClick={() => removeSkill(skill)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Learning Objectives */}
                            <div className="space-y-3">
                                <Label>Learning Objectives</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newLearningObjective}
                                        onChange={(e) => setNewLearningObjective(e.target.value)}
                                        placeholder="e.g., Understand React hooks concepts"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addLearningObjective();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={addLearningObjective} variant="outline">
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </div>

                                {formData.learningObjectives.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.learningObjectives.map((objective, index) => (
                                            <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-md">
                                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm flex-1">{objective}</span>
                                                <X
                                                    className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500 flex-shrink-0"
                                                    onClick={() => removeLearningObjective(objective)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Resources Tab */}
                        <TabsContent value="resources" className="space-y-4">
                            {/* Add Resource Form */}
                            <Card>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Resource Title <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={newResource.title}
                                                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                                placeholder="e.g., React Hooks Documentation"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Resource Type</Label>
                                            <Select
                                                value={newResource.type}
                                                onValueChange={(value) => setNewResource({ ...newResource, type: value })}
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
                                            <Label>URL <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={newResource.url}
                                                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                                placeholder="https://example.com/resource"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={newResource.description}
                                            onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                            placeholder="Brief description of this resource"
                                            className="h-20"
                                        />
                                    </div>

                                    <Button type="button" onClick={addResource} className="w-full">
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Add Resource
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Resource List */}
                            {formData.resources.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium">Resources ({formData.resources.length})</h4>
                                    <div className="space-y-2">
                                        {formData.resources.map((resource, index) => {
                                            const ResourceIcon = resourceTypeOptions.find(option => option.value === resource.type)?.icon || LinkIcon;

                                            return (
                                                <div key={index} className="flex items-start p-3 rounded-md border bg-gray-50">
                                                    <div className="flex-shrink-0 p-1.5 bg-indigo-100 rounded-md mr-3">
                                                        <ResourceIcon className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="text-sm font-medium">{resource.title}</h4>
                                                                {resource.url && (
                                                                    <p className="text-xs text-indigo-600 truncate max-w-sm">{resource.url}</p>
                                                                )}
                                                                {resource.description && (
                                                                    <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 rounded-full hover:bg-red-100"
                                                                onClick={() => removeResource(index)}
                                                            >
                                                                <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="flex justify-between space-x-2 pt-4 border-t">
                    <div className="flex items-center">
                        {activeTab !== 'resources' && (
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab(
                                    activeTab === 'basic' ? 'learning' : 'resources'
                                )}
                                size="sm"
                            >
                                Next Tab
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!formData.title.trim() || !formData.dueDate || isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     CheckCircle,
//     Loader2,
//     X,
//     PlusCircle,
//     Link as LinkIcon,
//     FileText,
//     Video,
//     BookOpen,
//     Tag,
//     ChevronRight,
//     ChevronLeft,
//     AlertCircle,
//     Users,
//     Clock,
//     Target,
//     BookMarked,
//     GraduationCap,
//     Layers,
//     Eye,
//     EyeOff,
//     Calendar,
//     User,
//     Save,
//     Edit3,
//     History
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from '@/hooks/use-toast';
// import { cn } from '@/lib/utils';
// import { format } from 'date-fns';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { priorityConfig, statusConfig } from './utils';
// import { UnifiedTask } from '@/Redux/types/Projects/task';
// import { firebaseFormatDate } from '@/components/utils/dateUtils';
// import { ProjectMember } from '@/Redux/types/Projects';

// interface EditTaskModalProps {
//     task: UnifiedTask;
//     open: boolean;
//     onClose: () => void;
//     onSave: (task: UnifiedTask) => void;
//     members: ProjectMember[];
//     projectAreas?: Array<{
//         id: string;
//         name: string;
//         status: string;
//     }>;
//     isLoading?: boolean;
// }

// const taskTypeOptions = [
//     { value: 'assignment', label: 'Assignment', icon: <FileText className="h-4 w-4" /> },
//     { value: 'quiz', label: 'Quiz', icon: <BookMarked className="h-4 w-4" /> },
//     { value: 'project', label: 'Project', icon: <Layers className="h-4 w-4" /> },
//     { value: 'research', label: 'Research', icon: <BookOpen className="h-4 w-4" /> },
//     { value: 'coding', label: 'Coding', icon: <FileText className="h-4 w-4" /> },
//     { value: 'reading', label: 'Reading', icon: <BookOpen className="h-4 w-4" /> },
//     { value: 'other', label: 'Other', icon: <Target className="h-4 w-4" /> },
// ];

// const resourceTypeOptions = [
//     { value: 'link', label: 'Link', icon: LinkIcon },
//     { value: 'document', label: 'Document', icon: FileText },
//     { value: 'video', label: 'Video', icon: Video },
//     { value: 'guide', label: 'Guide', icon: BookOpen },
//     { value: 'template', label: 'Template', icon: Layers },
//     { value: 'other', label: 'Other', icon: Tag },
// ];

// const visibilityOptions = [
//     { value: 'public', label: 'Public', icon: <Eye className="h-3 w-3" />, description: 'Visible to everyone' },
//     { value: 'members', label: 'Members Only', icon: <Users className="h-3 w-3" />, description: 'Visible to project members' },
//     { value: 'mentors-only', label: 'Mentors Only', icon: <GraduationCap className="h-3 w-3" />, description: 'Visible to mentors only' },
//     { value: 'private', label: 'Private', icon: <EyeOff className="h-3 w-3" />, description: 'Visible to assignee only' },
// ];

// export default function EditTaskModal({
//     task,
//     open,
//     onClose,
//     onSave,
//     members,
//     projectAreas = [],
//     isLoading = false
// }: EditTaskModalProps) {
//     // Form state
//     const [formData, setFormData] = useState({
//         title: task.title,
//         description: task.description || '',
//         projectAreaId: task.projectAreaId || null,
//         priority: task.priority,
//         status: task.status,
//         taskType: task.taskType || 'assignment',
//         assigneeId: task.assigneeId || null,
//         collaboratorIds: task.collaboratorIds || [],
//         dueDate: task.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate : format(firebaseFormatDate(task.dueDate), 'yyyy-MM-dd')) : '',
//         startDate: task.startDate ? (typeof task.startDate === 'string' ? task.startDate : format(firebaseFormatDate(task.startDate), 'yyyy-MM-dd')) : '',
//         estimatedHours: task.estimatedHours || undefined,
//         week: task.week || undefined,
//         weight: task.weight || undefined,
//         maxGrade: task.maxGrade || undefined,
//         skills: task.skills || [],
//         learningObjectives: task.learningObjectives || [],
//         visibility: task.visibility || 'members',
//         resources: task.resources?.map(r => ({
//             ...r,
//             id: r.id || `resource_${Date.now()}`
//         })) || []
//     });

//     const [errors, setErrors] = useState<Record<string, string>>({});
//     const [currentStep, setCurrentStep] = useState(1);
//     const [newSkill, setNewSkill] = useState('');
//     const [newLearningObjective, setNewLearningObjective] = useState('');
//     const [newResource, setNewResource] = useState({
//         title: '',
//         type: 'link',
//         url: '',
//         description: ''
//     });

//     const [isSaving, setIsSaving] = useState(false);
//     const [hasChanges, setHasChanges] = useState(false);
//     const { toast } = useToast();

//     const totalSteps = 4;

//     useEffect(() => {
//         // Create a comprehensive comparison of original vs current data
//         const originalData = {
//             title: task.title,
//             description: task.description || '',
//             projectAreaId: task.projectAreaId || null,
//             priority: task.priority,
//             status: task.status,
//             taskType: task.taskType || 'assignment',
//             assigneeId: task.assigneeId || null,
//             collaboratorIds: task.collaboratorIds || [],
//             dueDate: task.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate : format(firebaseFormatDate(task.dueDate), 'yyyy-MM-dd')) : '',
//             startDate: task.startDate ? (typeof task.startDate === 'string' ? task.startDate : format(firebaseFormatDate(task.startDate), 'yyyy-MM-dd')) : '',
//             estimatedHours: task.estimatedHours || undefined,
//             week: task.week || undefined,
//             weight: task.weight || undefined,
//             maxGrade: task.maxGrade || undefined,
//             skills: task.skills || [],
//             learningObjectives: task.learningObjectives || [],
//             visibility: task.visibility || 'members',
//             resources: task.resources?.map(r => ({
//                 title: r.title,
//                 type: r.type,
//                 url: r.url || '',
//                 description: r.description || ''
//             })) || []
//         };

//         const currentData = {
//             title: formData.title,
//             description: formData.description,
//             projectAreaId: formData.projectAreaId,
//             priority: formData.priority,
//             status: formData.status,
//             taskType: formData.taskType,
//             assigneeId: formData.assigneeId,
//             collaboratorIds: formData.collaboratorIds,
//             dueDate: formData.dueDate,
//             startDate: formData.startDate,
//             estimatedHours: formData.estimatedHours,
//             week: formData.week,
//             weight: formData.weight,
//             maxGrade: formData.maxGrade,
//             skills: formData.skills,
//             learningObjectives: formData.learningObjectives,
//             visibility: formData.visibility,
//             resources: formData.resources.map(r => ({
//                 title: r.title,
//                 type: r.type,
//                 url: r.url || '',
//                 description: r.description || ''
//             }))
//         };

//         // Deep comparison function for arrays and objects
//         const deepEqual = (obj1: any, obj2: any) => {
//             if (obj1 === obj2) return true;

//             if (obj1 == null || obj2 == null) return obj1 === obj2;

//             if (Array.isArray(obj1) && Array.isArray(obj2)) {
//                 if (obj1.length !== obj2.length) return false;
//                 for (let i = 0; i < obj1.length; i++) {
//                     if (!deepEqual(obj1[i], obj2[i])) return false;
//                 }
//                 return true;
//             }

//             if (typeof obj1 === 'object' && typeof obj2 === 'object') {
//                 const keys1 = Object.keys(obj1);
//                 const keys2 = Object.keys(obj2);

//                 if (keys1.length !== keys2.length) return false;

//                 for (let key of keys1) {
//                     if (!keys2.includes(key)) return false;
//                     if (!deepEqual(obj1[key], obj2[key])) return false;
//                 }
//                 return true;
//             }

//             return obj1 === obj2;
//         };

//         const hasChanges = !deepEqual(originalData, currentData);

//         console.log('Change Detection Debug:');
//         console.log('Original Data:', originalData);
//         console.log('Current Data:', currentData);
//         console.log('Has Changes:', hasChanges);

//         setHasChanges(hasChanges);
//     }, [formData, task]);

//     const validateStep = (step: number) => {
//         const newErrors: Record<string, string> = {};

//         if (step === 1) {
//             if (!formData.title.trim()) {
//                 newErrors.title = 'Task title is required';
//             }
//             if (!formData.dueDate) {
//                 newErrors.dueDate = 'Due date is required';
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleNext = () => {
//         if (validateStep(currentStep)) {
//             setCurrentStep(prev => Math.min(prev + 1, totalSteps));
//         }
//     };

//     const handlePrevious = () => {
//         setCurrentStep(prev => Math.max(prev - 1, 1));
//     };

//     const handleInputChange = (field: string, value: any) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//         if (errors[field]) {
//             setErrors(prev => ({ ...prev, [field]: '' }));
//         }
//     };

//     const handleSubmit = async () => {
//         if (!validateStep(1)) {
//             setCurrentStep(1);
//             return;
//         }

//         setIsSaving(true);
//         try {
//             // Prepare updated task data with proper resource handling
//             const updatedTask: UnifiedTask = {
//                 ...task,
//                 title: formData.title.trim(),
//                 description: formData.description.trim(),
//                 projectAreaId: formData.projectAreaId,
//                 priority: formData.priority,
//                 status: formData.status,
//                 taskType: formData.taskType,
//                 assigneeId: formData.assigneeId,
//                 collaboratorIds: formData.collaboratorIds,
//                 dueDate: formData.dueDate,
//                 startDate: formData.startDate || undefined,
//                 estimatedHours: formData.estimatedHours,
//                 week: formData.week,
//                 weight: formData.weight,
//                 maxGrade: formData.maxGrade,
//                 skills: formData.skills,
//                 learningObjectives: formData.learningObjectives,
//                 visibility: formData.visibility,
//                 // Ensure resources always has proper structure
//                 resources: formData.resources.map(resource => ({
//                     id: resource.id || `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//                     title: resource.title,
//                     type: resource.type,
//                     url: resource.url || undefined,
//                     description: resource.description || undefined
//                 })),
//                 updatedAt: new Date().toISOString()
//             };

//             console.log('Submitting updated task:', updatedTask);

//             await onSave(updatedTask);

//             toast({
//                 title: "Task Updated Successfully",
//                 description: `"${formData.title}" has been updated with your changes.`,
//             });

//             onClose();
//         } catch (error) {
//             console.error('Error updating task:', error);
//             toast({
//                 title: "Failed to Update Task",
//                 description: "An error occurred while updating the task. Please try again.",
//                 variant: "destructive",
//             });
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     // const handleSubmit = async () => {
//     //     if (!validateStep(1)) {
//     //         setCurrentStep(1);
//     //         return;
//     //     }

//     //     setIsSaving(true);
//     //     try {
//     //         // Prepare updated task data
//     //         const updatedTask: UnifiedTask = {
//     //             ...task,
//     //             title: formData.title.trim(),
//     //             description: formData.description.trim(),
//     //             projectAreaId: formData.projectAreaId,
//     //             priority: formData.priority,
//     //             status: formData.status,
//     //             taskType: formData.taskType,
//     //             assigneeId: formData.assigneeId,
//     //             collaboratorIds: formData.collaboratorIds,
//     //             dueDate: formData.dueDate,
//     //             startDate: formData.startDate || undefined,
//     //             estimatedHours: formData.estimatedHours,
//     //             week: formData.week,
//     //             weight: formData.weight,
//     //             maxGrade: formData.maxGrade,
//     //             skills: formData.skills.length > 0 ? formData.skills : undefined,
//     //             learningObjectives: formData.learningObjectives.length > 0 ? formData.learningObjectives : undefined,
//     //             visibility: formData.visibility,
//     //             resources: formData.resources.length > 0 ? formData.resources : undefined,
//     //             updatedAt: new Date().toISOString()
//     //         };

//     //         await onSave(updatedTask);

//     //         toast({
//     //             title: "Task Updated Successfully",
//     //             description: `"${formData.title}" has been updated with your changes.`,
//     //         });

//     //         onClose();
//     //     } catch (error) {
//     //         console.error('Error updating task:', error);
//     //         toast({
//     //             title: "Failed to Update Task",
//     //             description: "An error occurred while updating the task. Please try again.",
//     //             variant: "destructive",
//     //         });
//     //     } finally {
//     //         setIsSaving(false);
//     //     }
//     // };



//     const addSkill = () => {
//         if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
//             handleInputChange('skills', [...formData.skills, newSkill.trim()]);
//             setNewSkill('');
//         }
//     };

//     const removeSkill = (skillToRemove: string) => {
//         handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
//     };

//     const addLearningObjective = () => {
//         if (newLearningObjective.trim() && !formData.learningObjectives.includes(newLearningObjective.trim())) {
//             handleInputChange('learningObjectives', [...formData.learningObjectives, newLearningObjective.trim()]);
//             setNewLearningObjective('');
//         }
//     };

//     const removeLearningObjective = (objectiveToRemove: string) => {
//         handleInputChange('learningObjectives', formData.learningObjectives.filter(obj => obj !== objectiveToRemove));
//     };

//     const addResource = () => {
//         if (newResource.title.trim() && (newResource.type !== 'link' || newResource.url.trim())) {
//             handleInputChange('resources', [...formData.resources, { ...newResource, id: `resource_${Date.now()}` }]);
//             setNewResource({
//                 title: '',
//                 type: 'link',
//                 url: '',
//                 description: ''
//             });
//         } else {
//             toast({
//                 title: "Validation Error",
//                 description: newResource.type === 'link' ? "Resource title and URL are required" : "Resource title is required",
//                 variant: "destructive",
//             });
//         }
//     };

//     const removeResource = (index: number) => {
//         handleInputChange('resources', formData.resources.filter((_, i) => i !== index));
//     };

//     const getStepIcon = (step: number) => {
//         switch (step) {
//             case 1: return <Edit3 className="h-4 w-4" />;
//             case 2: return <Users className="h-4 w-4" />;
//             case 3: return <GraduationCap className="h-4 w-4" />;
//             case 4: return <BookOpen className="h-4 w-4" />;
//             default: return <Target className="h-4 w-4" />;
//         }
//     };

//     const getStepTitle = (step: number) => {
//         switch (step) {
//             case 1: return 'Task Details';
//             case 2: return 'Assignment & Status';
//             case 3: return 'Learning Objectives';
//             case 4: return 'Resources & Settings';
//             default: return 'Step';
//         }
//     };

//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 1:
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0, x: 20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="space-y-6"
//                     >
//                         <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2 text-lg">
//                                     <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
//                                         <Edit3 className="h-4 w-4" />
//                                     </div>
//                                     Task Information
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-6">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                         Task Title <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Input
//                                         id="title"
//                                         value={formData.title}
//                                         onChange={(e) => handleInputChange('title', e.target.value)}
//                                         placeholder="Enter a clear, descriptive task title"
//                                         className={cn(
//                                             "transition-colors",
//                                             errors.title && "border-red-500 focus:border-red-500 focus:ring-red-500"
//                                         )}
//                                     />
//                                     {errors.title && (
//                                         <p className="text-sm text-red-500 flex items-center gap-1">
//                                             <AlertCircle className="h-3 w-3" />
//                                             {errors.title}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                         Description
//                                     </Label>
//                                     <Textarea
//                                         id="description"
//                                         value={formData.description}
//                                         onChange={(e) => handleInputChange('description', e.target.value)}
//                                         placeholder="Provide detailed instructions and context for this task..."
//                                         className="min-h-24 resize-none"
//                                         rows={4}
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="space-y-2">
//                                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Task Type
//                                         </Label>
//                                         <Select value={formData.taskType} onValueChange={(value) => handleInputChange('taskType', value)}>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select task type" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {taskTypeOptions.map((option) => (
//                                                     <SelectItem key={option.value} value={option.value}>
//                                                         <div className="flex items-center gap-2">
//                                                             {option.icon}
//                                                             {option.label}
//                                                         </div>
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     {projectAreas.length > 0 && (
//                                         <div className="space-y-2">
//                                             <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                                 Project Area
//                                             </Label>
//                                             <Select
//                                                 value={formData.projectAreaId || 'none'}
//                                                 onValueChange={(value) => handleInputChange('projectAreaId', value === 'none' ? null : value)}
//                                             >
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder="Select project area (optional)" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="none">No specific area</SelectItem>
//                                                     {projectAreas.map((area) => (
//                                                         <SelectItem key={area.id} value={area.id}>
//                                                             {area.name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Due Date <span className="text-red-500">*</span>
//                                         </Label>
//                                         <div className="relative">
//                                             <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                                             <Input
//                                                 id="dueDate"
//                                                 type="date"
//                                                 value={formData.dueDate}
//                                                 onChange={(e) => handleInputChange('dueDate', e.target.value)}
//                                                 className={cn(
//                                                     "pl-10",
//                                                     errors.dueDate && "border-red-500 focus:border-red-500 focus:ring-red-500"
//                                                 )}
//                                             />
//                                         </div>
//                                         {errors.dueDate && (
//                                             <p className="text-sm text-red-500 flex items-center gap-1">
//                                                 <AlertCircle className="h-3 w-3" />
//                                                 {errors.dueDate}
//                                             </p>
//                                         )}
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="startDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Start Date
//                                         </Label>
//                                         <div className="relative">
//                                             <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                                             <Input
//                                                 id="startDate"
//                                                 type="date"
//                                                 value={formData.startDate}
//                                                 onChange={(e) => handleInputChange('startDate', e.target.value)}
//                                                 className="pl-10"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </motion.div>
//                 );

//             case 2:
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0, x: 20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="space-y-6"
//                     >
//                         <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2 text-lg">
//                                     <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
//                                         <Users className="h-4 w-4" />
//                                     </div>
//                                     Status & Assignment
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="space-y-2">
//                                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Priority Level
//                                         </Label>
//                                         <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
//                                             <SelectTrigger>
//                                                 <SelectValue>
//                                                     {priorityConfig[formData.priority] && (
//                                                         <div className="flex items-center gap-2">
//                                                             {priorityConfig[formData.priority].icon}
//                                                             <Badge className={cn("border", priorityConfig[formData.priority].borderColor, priorityConfig[formData.priority].bgColor, priorityConfig[formData.priority].color)}>
//                                                                 {priorityConfig[formData.priority].shortLabel}
//                                                             </Badge>
//                                                         </div>
//                                                     )}
//                                                 </SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {Object.entries(priorityConfig).map(([priority, config]) => (
//                                                     <SelectItem key={priority} value={priority}>
//                                                         <div className="flex items-center gap-2">
//                                                             {config.icon}
//                                                             <Badge className={cn("border", config.borderColor, config.bgColor, config.color)}>
//                                                                 {config.label}
//                                                             </Badge>
//                                                         </div>
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Task Status
//                                         </Label>
//                                         <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
//                                             <SelectTrigger>
//                                                 <SelectValue>
//                                                     {statusConfig[formData.status] && (
//                                                         <div className="flex items-center gap-2">
//                                                             {statusConfig[formData.status].icon}
//                                                             <Badge className={cn("border", statusConfig[formData.status].borderColor, statusConfig[formData.status].bgColor, statusConfig[formData.status].color)}>
//                                                                 {statusConfig[formData.status].label}
//                                                             </Badge>
//                                                         </div>
//                                                     )}
//                                                 </SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {Object.entries(statusConfig).map(([status, config]) => (
//                                                     <SelectItem key={status} value={status}>
//                                                         <div className="flex items-center gap-2">
//                                                             {config.icon}
//                                                             <Badge className={cn("border", config.borderColor, config.bgColor, config.color)}>
//                                                                 {config.label}
//                                                             </Badge>
//                                                         </div>
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                         Assign To
//                                     </Label>
//                                     <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
//                                         {members.length === 0 ? (
//                                             <div className="text-sm text-slate-500 dark:text-slate-400 p-2 text-center">
//                                                 No team members available
//                                             </div>
//                                         ) : (
//                                             <>
//                                                 <div
//                                                     className={cn(
//                                                         "flex items-center p-3 rounded-lg cursor-pointer transition-all border",
//                                                         formData.assigneeId === null
//                                                             ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
//                                                             : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-transparent'
//                                                     )}
//                                                     onClick={() => handleInputChange('assigneeId', null)}
//                                                 >
//                                                     <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 mr-3">
//                                                         <User className="h-4 w-4 text-slate-500" />
//                                                     </div>
//                                                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                                         Unassigned
//                                                     </span>
//                                                 </div>

//                                                 {members.map((member) => (
//                                                     <div
//                                                         key={member.id}
//                                                         className={cn(
//                                                             "flex items-center p-3 rounded-lg cursor-pointer transition-all border",
//                                                             formData.assigneeId === member.id
//                                                                 ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
//                                                                 : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-transparent'
//                                                         )}
//                                                         onClick={() => handleInputChange('assigneeId', member.id)}
//                                                     >
//                                                         <Avatar className="h-8 w-8 mr-3 border-2 border-white dark:border-slate-800 shadow-sm">
//                                                             {member.avatar ? (
//                                                                 <AvatarImage src={member.avatar} alt={member.name} />
//                                                             ) : (
//                                                                 <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
//                                                                     {member.initials || member.name.charAt(0)}
//                                                                 </AvatarFallback>
//                                                             )}
//                                                         </Avatar>
//                                                         <div>
//                                                             <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
//                                                                 {member.name}
//                                                             </p>
//                                                             <p className="text-xs text-slate-500 dark:text-slate-400">
//                                                                 {member.role}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="estimatedHours" className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Estimated Hours
//                                         </Label>
//                                         <div className="relative">
//                                             <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                                             <Input
//                                                 id="estimatedHours"
//                                                 type="number"
//                                                 min="0"
//                                                 step="0.5"
//                                                 value={formData.estimatedHours || ''}
//                                                 onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseFloat(e.target.value) : undefined)}
//                                                 placeholder="0"
//                                                 className="pl-10"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="week" className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Week Number
//                                         </Label>
//                                         <Input
//                                             id="week"
//                                             type="number"
//                                             min="1"
//                                             value={formData.week || ''}
//                                             onChange={(e) => handleInputChange('week', e.target.value ? parseInt(e.target.value) : undefined)}
//                                             placeholder="1"
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="weight" className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Task Weight
//                                         </Label>
//                                         <Input
//                                             id="weight"
//                                             type="number"
//                                             min="0"
//                                             step="0.1"
//                                             value={formData.weight || ''}
//                                             onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
//                                             placeholder="1.0"
//                                         />
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </motion.div>
//                 );

//             case 3:
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0, x: 20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="space-y-6"
//                     >
//                         <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2 text-lg">
//                                     <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
//                                         <GraduationCap className="h-4 w-4" />
//                                     </div>
//                                     Learning Objectives & Skills
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-6">
//                                 {/* Skills Section */}
//                                 <div className="space-y-3">
//                                     <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                         Skills to Practice
//                                     </Label>
//                                     <p className="text-xs text-slate-500 dark:text-slate-400">
//                                         Add skills that learners will practice or demonstrate with this task
//                                     </p>
//                                     <div className="flex gap-2">
//                                         <div className="relative flex-1">
//                                             <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                                             <Input
//                                                 value={newSkill}
//                                                 onChange={(e) => setNewSkill(e.target.value)}
//                                                 placeholder="e.g., JavaScript, Problem Solving, UI Design"
//                                                 className="pl-10"
//                                                 onKeyDown={(e) => {
//                                                     if (e.key === 'Enter') {
//                                                         e.preventDefault();
//                                                         addSkill();
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                         <Button
//                                             type="button"
//                                             onClick={addSkill}
//                                             variant="outline"
//                                             className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
//                                         >
//                                             <PlusCircle className="h-4 w-4" />
//                                         </Button>
//                                     </div>

//                                     {formData.skills.length > 0 && (
//                                         <div className="flex flex-wrap gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
//                                             {formData.skills.map((skill, index) => (
//                                                 <Badge
//                                                     key={index}
//                                                     variant="secondary"
//                                                     className="flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
//                                                 >
//                                                     <Tag className="h-3 w-3" />
//                                                     {skill}
//                                                     <X
//                                                         className="h-3 w-3 cursor-pointer hover:text-indigo-900 dark:hover:text-indigo-100"
//                                                         onClick={() => removeSkill(skill)}
//                                                     />
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Learning Objectives Section */}
//                                 <div className="space-y-3">
//                                     <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                         Learning Objectives
//                                     </Label>
//                                     <p className="text-xs text-slate-500 dark:text-slate-400">
//                                         Define what learners should achieve by completing this task
//                                     </p>
//                                     <div className="flex gap-2">
//                                         <div className="relative flex-1">
//                                             <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                                             <Input
//                                                 value={newLearningObjective}
//                                                 onChange={(e) => setNewLearningObjective(e.target.value)}
//                                                 placeholder="e.g., Understand React hooks concepts"
//                                                 className="pl-10"
//                                                 onKeyDown={(e) => {
//                                                     if (e.key === 'Enter') {
//                                                         e.preventDefault();
//                                                         addLearningObjective();
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                         <Button
//                                             type="button"
//                                             onClick={addLearningObjective}
//                                             variant="outline"
//                                             className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
//                                         >
//                                             <PlusCircle className="h-4 w-4" />
//                                         </Button>
//                                     </div>

//                                     {formData.learningObjectives.length > 0 && (
//                                         <div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
//                                             {formData.learningObjectives.map((objective, index) => (
//                                                 <div key={index} className="flex items-start gap-2 p-2 bg-white dark:bg-slate-800 rounded-md border border-purple-100 dark:border-purple-800">
//                                                     <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
//                                                     <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{objective}</span>
//                                                     <X
//                                                         className="h-4 w-4 cursor-pointer text-slate-400 hover:text-red-500 flex-shrink-0"
//                                                         onClick={() => removeLearningObjective(objective)}
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Grading Section */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="maxGrade" className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Maximum Grade
//                                         </Label>
//                                         <Input
//                                             id="maxGrade"
//                                             type="number"
//                                             min="0"
//                                             value={formData.maxGrade || ''}
//                                             onChange={(e) => handleInputChange('maxGrade', e.target.value ? parseFloat(e.target.value) : undefined)}
//                                             placeholder="100"
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                             Visibility
//                                         </Label>
//                                         <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
//                                             <SelectTrigger>
//                                                 <SelectValue>
//                                                     {visibilityOptions.find(v => v.value === formData.visibility) && (
//                                                         <div className="flex items-center gap-2">
//                                                             {visibilityOptions.find(v => v.value === formData.visibility)!.icon}
//                                                             {visibilityOptions.find(v => v.value === formData.visibility)!.label}
//                                                         </div>
//                                                     )}
//                                                 </SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {visibilityOptions.map((option) => (
//                                                     <SelectItem key={option.value} value={option.value}>
//                                                         <div className="flex flex-col">
//                                                             <div className="flex items-center gap-2">
//                                                                 {option.icon}
//                                                                 {option.label}
//                                                             </div>
//                                                             <span className="text-xs text-slate-500">{option.description}</span>
//                                                         </div>
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </motion.div>
//                 );

//             case 4:
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0, x: 20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="space-y-6"
//                     >
//                         <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2 text-lg">
//                                     <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
//                                         <BookOpen className="h-4 w-4" />
//                                     </div>
//                                     Resources & Materials
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-6">
//                                 {/* Add Resource Form */}
//                                 <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
//                                     <CardContent className="pt-4 space-y-4">
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div className="space-y-2">
//                                                 <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                                     Resource Title <span className="text-red-500">*</span>
//                                                 </Label>
//                                                 <Input
//                                                     value={newResource.title}
//                                                     onChange={(e) => setNewResource({
//                                                         ...newResource,
//                                                         title: e.target.value
//                                                     })}
//                                                     placeholder="e.g., React Hooks Documentation"
//                                                 />
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                                     Resource Type
//                                                 </Label>
//                                                 <Select
//                                                     value={newResource.type}
//                                                     onValueChange={(value) => setNewResource({
//                                                         ...newResource,
//                                                         type: value
//                                                     })}
//                                                 >
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select resource type" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {resourceTypeOptions.map((option) => (
//                                                             <SelectItem key={option.value} value={option.value}>
//                                                                 <div className="flex items-center gap-2">
//                                                                     <option.icon className="h-4 w-4" />
//                                                                     {option.label}
//                                                                 </div>
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </div>
//                                         </div>

//                                         {newResource.type === 'link' && (
//                                             <div className="space-y-2">
//                                                 <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                                     URL <span className="text-red-500">*</span>
//                                                 </Label>
//                                                 <div className="relative">
//                                                     <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                                                     <Input
//                                                         value={newResource.url}
//                                                         onChange={(e) => setNewResource({
//                                                             ...newResource,
//                                                             url: e.target.value
//                                                         })}
//                                                         placeholder="https://example.com/resource"
//                                                         className="pl-10"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         )}

//                                         <div className="space-y-2">
//                                             <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                                 Description
//                                             </Label>
//                                             <Textarea
//                                                 value={newResource.description}
//                                                 onChange={(e) => setNewResource({
//                                                     ...newResource,
//                                                     description: e.target.value
//                                                 })}
//                                                 placeholder="Brief description of this resource and how it helps with the task"
//                                                 className="h-20 resize-none"
//                                             />
//                                         </div>

//                                         <Button
//                                             type="button"
//                                             onClick={addResource}
//                                             className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
//                                         >
//                                             <PlusCircle className="h-4 w-4 mr-2" />
//                                             Add Resource
//                                         </Button>
//                                     </CardContent>
//                                 </Card>

//                                 {/* Resource List */}
//                                 {formData.resources.length > 0 && (
//                                     <div className="space-y-3">
//                                         <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                                             <BookOpen className="h-4 w-4" />
//                                             Current Resources ({formData.resources.length})
//                                         </h4>
//                                         <div className="space-y-2">
//                                             {formData.resources.map((resource, index) => {
//                                                 const ResourceIcon = resourceTypeOptions.find(option => option.value === resource.type)?.icon || LinkIcon;

//                                                 return (
//                                                     <motion.div
//                                                         key={resource.id || index}
//                                                         initial={{ opacity: 0, y: 10 }}
//                                                         animate={{ opacity: 1, y: 0 }}
//                                                         transition={{ duration: 0.2 }}
//                                                         className="flex items-start p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
//                                                     >
//                                                         <div className="flex-shrink-0 p-2 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg">
//                                                             <ResourceIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
//                                                         </div>
//                                                         <div className="ml-3 flex-grow">
//                                                             <div className="flex justify-between items-start">
//                                                                 <div className="flex-1">
//                                                                     <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
//                                                                         {resource.title}
//                                                                     </h4>
//                                                                     {resource.url && (
//                                                                         <p className="text-xs text-indigo-600 dark:text-indigo-400 truncate max-w-sm mt-1">
//                                                                             {resource.url}
//                                                                         </p>
//                                                                     )}
//                                                                     {resource.description && (
//                                                                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
//                                                                             {resource.description}
//                                                                         </p>
//                                                                     )}
//                                                                 </div>
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="sm"
//                                                                     className="h-8 w-8 p-0 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
//                                                                     onClick={() => removeResource(index)}
//                                                                 >
//                                                                     <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
//                                                                 </Button>
//                                                             </div>
//                                                         </div>
//                                                     </motion.div>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     </motion.div>
//                 );

//             default:
//                 return null;
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col overflow-hidden">
//                 <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
//                     <DialogTitle className="flex items-center text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
//                         <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mr-3 shadow-lg">
//                             <Edit3 className="h-5 w-5" />
//                         </div>
//                         Edit Task
//                     </DialogTitle>
//                     <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-2">
//                         <History className="h-4 w-4" />
//                         Last updated {format(firebaseFormatDate(task.updatedAt), 'MMM dd, yyyy')}
//                         {hasChanges && (
//                             <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
//                                 Unsaved changes
//                             </Badge>
//                         )}
//                     </DialogDescription>

//                     {/* Progress Steps */}
//                     <div className="flex items-center justify-between mt-6 px-4">
//                         {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
//                             <div key={step} className="flex items-center">
//                                 <div className={cn(
//                                     "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
//                                     step <= currentStep
//                                         ? "bg-indigo-600 border-indigo-600 text-white"
//                                         : "border-slate-300 dark:border-slate-600 text-slate-400"
//                                 )}>
//                                     {step < currentStep ? (
//                                         <CheckCircle className="h-4 w-4" />
//                                     ) : (
//                                         getStepIcon(step)
//                                     )}
//                                 </div>
//                                 {step < totalSteps && (
//                                     <div className={cn(
//                                         "h-0.5 w-16 mx-2 transition-all",
//                                         step < currentStep ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
//                                     )} />
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     <div className="text-center mt-2">
//                         <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                             {getStepTitle(currentStep)}
//                         </p>
//                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                             Step {currentStep} of {totalSteps}
//                         </p>
//                     </div>
//                 </DialogHeader>

//                 <div className="flex-1 overflow-y-auto py-6">
//                     <AnimatePresence mode="wait">
//                         {renderStepContent()}
//                     </AnimatePresence>
//                 </div>

//                 <DialogFooter className="border-t border-slate-200 dark:border-slate-800 pt-4">
//                     <div className="flex justify-between items-center w-full">
//                         <div className="flex gap-2">
//                             {currentStep > 1 && (
//                                 <Button
//                                     variant="outline"
//                                     onClick={handlePrevious}
//                                     className="border-slate-300 dark:border-slate-600"
//                                 >
//                                     <ChevronLeft className="h-4 w-4 mr-1" />
//                                     Previous
//                                 </Button>
//                             )}
//                         </div>

//                         <div className="flex gap-2">
//                             <Button variant="outline" onClick={onClose}>
//                                 Cancel
//                             </Button>

//                             {currentStep < totalSteps ? (
//                                 <Button
//                                     onClick={handleNext}
//                                     className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
//                                 >
//                                     Next
//                                     <ChevronRight className="h-4 w-4 ml-1" />
//                                 </Button>
//                             ) : (
//                                 <Button
//                                     onClick={handleSubmit}
//                                     disabled={isSaving || !hasChanges}
//                                     className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
//                                 >
//                                     {isSaving ? (
//                                         <>
//                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                             Saving Changes...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Save className="mr-2 h-4 w-4" />
//                                             Save Changes
//                                         </>
//                                     )}
//                                 </Button>
//                             )}
//                         </div>
//                     </div>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }