import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProjectArea } from '@/Redux/types/Projects';
import {
    X,
    Target,
    CheckCircle,
    RefreshCw
} from 'lucide-react';
import { firebaseFormatDate } from '@/components/utils/dateUtils';

interface EditAreaDialogProps {
    area: ProjectArea | null;
    open: boolean;
    onClose: () => void;
    onSave: (areaData: any) => void;
    isLoading: boolean;
}

const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'blocked', label: 'Blocked' }
];

export default function EditAreaDialog({
    area,
    open,
    onClose,
    onSave,
    isLoading
}: EditAreaDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'planned' as 'planned' | 'in-progress' | 'completed' | 'blocked',
        learningFocus: [] as string[],
        technologies: [] as string[],
        startDate: '',
        endDate: '',
        estimatedHours: 0
    });
    const [newLearningFocus, setNewLearningFocus] = useState('');
    const [newTechnology, setNewTechnology] = useState('');

    useEffect(() => {
        if (area) {
            setFormData({
                name: area.name || '',
                description: area.description || '',
                status: area.status || 'planned',
                learningFocus: area.learningFocus || [],
                technologies: area.technologies || [],
                startDate: area.startDate ? (typeof area.startDate === 'string' ? area.startDate : firebaseFormatDate(area.startDate).split('T')[0]) : '',
                endDate: area.endDate ? (typeof area.endDate === 'string' ? area.endDate : firebaseFormatDate(area.endDate).split('T')[0]) : '',
                estimatedHours: area.estimatedHours || 0
            });
        }
    }, [area]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddLearningFocus = () => {
        if (newLearningFocus.trim() && !formData.learningFocus.includes(newLearningFocus.trim())) {
            setFormData(prev => ({
                ...prev,
                learningFocus: [...prev.learningFocus, newLearningFocus.trim()]
            }));
            setNewLearningFocus('');
        }
    };

    const handleRemoveLearningFocus = (focus: string) => {
        setFormData(prev => ({
            ...prev,
            learningFocus: prev.learningFocus.filter(f => f !== focus)
        }));
    };

    const handleAddTechnology = () => {
        if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, newTechnology.trim()]
            }));
            setNewTechnology('');
        }
    };

    const handleRemoveTechnology = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            return;
        }
        onSave(formData);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            status: 'planned',
            learningFocus: [],
            technologies: [],
            startDate: '',
            endDate: '',
            estimatedHours: 0
        });
        setNewLearningFocus('');
        setNewTechnology('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                            <Target className="h-4 w-4" />
                        </div>
                        Edit Project Area
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Update the details for this project area
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Area Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="e.g., Frontend Development"
                                className="transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Status
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleInputChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Description
                        </Label>
                        <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe what this area covers and its main objectives..."
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-start-date" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Start Date
                            </Label>
                            <Input
                                id="edit-start-date"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-end-date" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                End Date
                            </Label>
                            <Input
                                id="edit-end-date"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleInputChange('endDate', e.target.value)}
                                min={formData.startDate}
                            />
                        </div>
                    </div>

                    {/* Estimated Hours */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-hours" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Estimated Hours
                        </Label>
                        <Input
                            id="edit-hours"
                            type="number"
                            min="0"
                            value={formData.estimatedHours}
                            onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>

                    {/* Learning Focus */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Learning Focus
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add skills that learners will practice or demonstrate with this area
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., React Hooks, API Design"
                                value={newLearningFocus}
                                onChange={(e) => setNewLearningFocus(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddLearningFocus();
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleAddLearningFocus}
                                variant="outline"
                                size="sm"
                                className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.learningFocus.length > 0 && (
                            <div className="flex flex-wrap gap-1 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                {formData.learningFocus.map((focus, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
                                    >
                                        <Target className="h-3 w-3" />
                                        {focus}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-3 w-3 ml-1 hover:bg-red-100 dark:hover:bg-red-900/20"
                                            onClick={() => handleRemoveLearningFocus(focus)}
                                        >
                                            <X className="h-2 w-2" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Technologies */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Technologies
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add technologies and tools used in this area
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., React, Node.js, PostgreSQL"
                                value={newTechnology}
                                onChange={(e) => setNewTechnology(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTechnology();
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleAddTechnology}
                                variant="outline"
                                size="sm"
                                className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                {formData.technologies.map((tech, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                                    >
                                        {tech}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-3 w-3 ml-1 hover:bg-red-100 dark:hover:bg-red-900/20"
                                            onClick={() => handleRemoveTechnology(tech)}
                                        >
                                            <X className="h-2 w-2" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!formData.name.trim() || isLoading}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}