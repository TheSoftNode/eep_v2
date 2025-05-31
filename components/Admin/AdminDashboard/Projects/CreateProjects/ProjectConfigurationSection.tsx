import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Calendar, Target, Plus, X, Users, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Project } from "@/Redux/types/Projects";

interface ProjectConfigurationSectionProps {
    project?: Project; // Add this prop for edit mode
    formData: {
        startDate: string;
        endDate: string;
        technologies: string[];
        learningObjectives: string[];
        completionCriteria: string[];
        visibility: 'public' | 'members' | 'mentors-only' | 'private';
        workspaceId: string;
        primaryMentorId: string;
        mentorIds: string[];
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (name: string, value: string) => void;
    onArrayChange: (name: string, values: string[]) => void;
}

const VISIBILITY_OPTIONS = [
    {
        value: 'public',
        label: 'Public',
        description: 'Visible to everyone on the platform',
        icon: Eye
    },
    {
        value: 'members',
        label: 'Members Only',
        description: 'Only project members can view',
        icon: Users
    },
    {
        value: 'mentors-only',
        label: 'Mentors Only',
        description: 'Only mentors and admins can view',
        icon: Users
    },
    {
        value: 'private',
        label: 'Private',
        description: 'Only you and assigned admins can view',
        icon: EyeOff
    }
];

const getVisibilityBadgeColor = (visibility: string) => {
    switch (visibility) {
        case 'public':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'members':
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'mentors-only':
            return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
        case 'private':
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

export const ProjectConfigurationSection: React.FC<ProjectConfigurationSectionProps> = ({
    project, // Add this prop
    formData,
    errors,
    onInputChange,
    onSelectChange,
    onArrayChange
}) => {
    const [newTechnology, setNewTechnology] = useState('');
    const [newObjective, setNewObjective] = useState('');
    const [newCriteria, setNewCriteria] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize form data from project when in edit mode
    useEffect(() => {
        if (project && !isInitialized) {
            // Populate arrays only if they're different from current form data
            if (JSON.stringify(project.technologies || []) !== JSON.stringify(formData.technologies)) {
                onArrayChange('technologies', project.technologies || []);
            }
            if (JSON.stringify(project.learningObjectives || []) !== JSON.stringify(formData.learningObjectives)) {
                onArrayChange('learningObjectives', project.learningObjectives || []);
            }
            if (JSON.stringify(project.completionCriteria || []) !== JSON.stringify(formData.completionCriteria)) {
                onArrayChange('completionCriteria', project.completionCriteria || []);
            }

            // Set visibility if different
            if (project.visibility && project.visibility !== formData.visibility) {
                onSelectChange('visibility', project.visibility);
            }

            setIsInitialized(true);
        }
    }, [project, formData, onArrayChange, onSelectChange, isInitialized]);

    const handleAddTechnology = () => {
        if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
            onArrayChange('technologies', [...formData.technologies, newTechnology.trim()]);
            setNewTechnology('');
        }
    };

    const handleRemoveTechnology = (tech: string) => {
        onArrayChange('technologies', formData.technologies.filter(t => t !== tech));
    };

    const handleAddObjective = () => {
        if (newObjective.trim() && !formData.learningObjectives.includes(newObjective.trim())) {
            onArrayChange('learningObjectives', [...formData.learningObjectives, newObjective.trim()]);
            setNewObjective('');
        }
    };

    const handleRemoveObjective = (objective: string) => {
        onArrayChange('learningObjectives', formData.learningObjectives.filter(o => o !== objective));
    };

    const handleAddCriteria = () => {
        if (newCriteria.trim() && !formData.completionCriteria.includes(newCriteria.trim())) {
            onArrayChange('completionCriteria', [...formData.completionCriteria, newCriteria.trim()]);
            setNewCriteria('');
        }
    };

    const handleRemoveCriteria = (criteria: string) => {
        onArrayChange('completionCriteria', formData.completionCriteria.filter(c => c !== criteria));
    };

    const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            action();
        }
    };

    const projectDuration = formData.startDate && formData.endDate ?
        Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24)) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <Settings className="h-4 w-4" />
                        </div>
                        Project Configuration
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Timeline, technologies, and learning objectives
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Project Timeline */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Project Timeline <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate" className="text-xs text-slate-500 dark:text-slate-400">
                                    Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={onInputChange}
                                    className={cn(
                                        "transition-colors",
                                        errors.startDate && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate" className="text-xs text-slate-500 dark:text-slate-400">
                                    End Date
                                </Label>
                                <Input
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={onInputChange}
                                    min={formData.startDate}
                                    className={cn(
                                        "transition-colors",
                                        errors.endDate && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    )}
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-red-500">{errors.endDate}</p>
                                )}
                            </div>
                        </div>
                        {projectDuration > 0 && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    📅 Project duration: <strong>{projectDuration} days</strong>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Technologies */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Technologies & Tools
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add the technologies, frameworks, and tools used in this project
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., React, Node.js, MongoDB"
                                value={newTechnology}
                                onChange={(e) => setNewTechnology(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleAddTechnology)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleAddTechnology}
                                variant="secondary"
                                className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.technologies.map((tech, index) => (
                                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 pr-1 dark:bg-blue-900/20 dark:text-blue-400">
                                    {tech}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1 text-blue-500 hover:text-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800"
                                        onClick={() => handleRemoveTechnology(tech)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                            {formData.technologies.length === 0 && (
                                <p className="text-sm text-slate-500">No technologies added yet</p>
                            )}
                        </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Learning Objectives
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Define what participants will learn and achieve by completing this project
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Learn REST API development"
                                value={newObjective}
                                onChange={(e) => setNewObjective(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleAddObjective)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleAddObjective}
                                variant="secondary"
                                className="bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.learningObjectives.map((objective, index) => (
                                <div key={index} className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
                                    <Target className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                    <span className="text-sm text-purple-700 dark:text-purple-300 flex-1">{objective}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-purple-500 hover:text-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800 flex-shrink-0"
                                        onClick={() => handleRemoveObjective(objective)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {formData.learningObjectives.length === 0 && (
                                <p className="text-sm text-slate-500">No learning objectives added yet</p>
                            )}
                        </div>
                    </div>

                    {/* Completion Criteria */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Completion Criteria
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Define specific requirements that must be met for project completion
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Deploy working application"
                                value={newCriteria}
                                onChange={(e) => setNewCriteria(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleAddCriteria)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleAddCriteria}
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.completionCriteria.map((criteria, index) => (
                                <div key={index} className="flex items-start gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-200 dark:border-emerald-800">
                                    <div className="h-4 w-4 mt-0.5 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span className="text-sm text-emerald-700 dark:text-emerald-300 flex-1">{criteria}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-800 flex-shrink-0"
                                        onClick={() => handleRemoveCriteria(criteria)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {formData.completionCriteria.length === 0 && (
                                <p className="text-sm text-slate-500">No completion criteria added yet</p>
                            )}
                        </div>
                    </div>

                    {/* Project Visibility */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Project Visibility
                        </Label>
                        <Select value={formData.visibility} onValueChange={(value) => onSelectChange('visibility', value)}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select visibility level" />
                            </SelectTrigger>
                            <SelectContent>
                                {VISIBILITY_OPTIONS.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <IconComponent className="h-4 w-4" />
                                                <div>
                                                    <div className="font-medium">{option.label}</div>
                                                    <div className="text-xs text-slate-500">{option.description}</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        {/* Visibility Information */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <Badge className={cn("text-xs font-medium border", getVisibilityBadgeColor(formData.visibility))}>
                                {VISIBILITY_OPTIONS.find(opt => opt.value === formData.visibility)?.label}
                            </Badge>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                                {VISIBILITY_OPTIONS.find(opt => opt.value === formData.visibility)?.description}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
