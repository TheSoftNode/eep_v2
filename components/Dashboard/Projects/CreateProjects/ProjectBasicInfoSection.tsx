import React from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, Tag, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectBasicInfoSectionProps {
    formData: {
        name: string;
        description: string;
        category: string;
        level: 'beginner' | 'intermediate' | 'advanced';
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (name: string, value: string) => void;
}

const CATEGORY_OPTIONS = [
    { label: 'Web Development', value: 'web-development' },
    { label: 'Mobile Development', value: 'mobile-development' },
    { label: 'Data Science', value: 'data-science' },
    { label: 'Machine Learning', value: 'machine-learning' },
    { label: 'DevOps', value: 'devops' },
    { label: 'UI/UX Design', value: 'ui-ux-design' },
    { label: 'Cybersecurity', value: 'cybersecurity' },
    { label: 'Game Development', value: 'game-development' },
    { label: 'Cloud Computing', value: 'cloud-computing' },
    { label: 'Blockchain', value: 'blockchain' },
    { label: 'Other', value: 'other' }
];

const InputField: React.FC<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required?: boolean;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
}> = ({
    id,
    label,
    icon: Icon,
    required = false,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    disabled = false
}) => (
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
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={cn(
                        "pl-10 transition-colors",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                />
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );

const getLevelBadgeColor = (level: string) => {
    switch (level) {
        case 'beginner':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'intermediate':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'advanced':
            return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getLevelDescription = (level: string) => {
    switch (level) {
        case 'beginner':
            return 'Perfect for those new to the topic with basic foundational knowledge';
        case 'intermediate':
            return 'Suitable for learners with some experience and foundational skills';
        case 'advanced':
            return 'Designed for experienced learners ready for complex challenges';
        default:
            return 'Select an appropriate difficulty level for your project';
    }
};

export const ProjectBasicInfoSection: React.FC<ProjectBasicInfoSectionProps> = ({
    formData,
    errors,
    onInputChange,
    onSelectChange
}) => {
    const descriptionWordCount = formData.description.trim().split(/\s+/).filter(word => word).length;
    const descriptionCharCount = formData.description.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                            <Briefcase className="h-4 w-4" />
                        </div>
                        Basic Information
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Essential details that define your project
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            id="name"
                            label="Project Name"
                            icon={Briefcase}
                            required
                            placeholder="e.g., E-commerce Platform with React"
                            value={formData.name}
                            onChange={onInputChange}
                            error={errors.name}
                        />

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.category} onValueChange={(value) => onSelectChange('category', value)}>
                                <SelectTrigger className="h-11">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-slate-400" />
                                        <SelectValue placeholder="Select project category" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {descriptionCharCount}/1000 characters
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Provide a comprehensive description of what participants will build and learn
                        </p>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileText className="h-4 w-4 text-slate-400" />
                            </div>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={onInputChange}
                                placeholder="Describe the project goals, what participants will learn, and what they'll build. Include key features, technologies, and expected outcomes..."
                                rows={4}
                                maxLength={1000}
                                className={cn(
                                    "pl-10 resize-none transition-colors",
                                    errors.description && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                        </div>
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                        {descriptionWordCount > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {descriptionWordCount} words
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Difficulty Level <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.level} onValueChange={(value) => onSelectChange('level', value)}>
                            <SelectTrigger className="h-11">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-slate-400" />
                                    <SelectValue placeholder="Select difficulty level" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">
                                    <div className="flex items-center justify-between w-full">
                                        <span>Beginner</span>
                                        <Badge variant="outline" className="ml-2 text-xs text-emerald-600">
                                            Entry Level
                                        </Badge>
                                    </div>
                                </SelectItem>
                                <SelectItem value="intermediate">
                                    <div className="flex items-center justify-between w-full">
                                        <span>Intermediate</span>
                                        <Badge variant="outline" className="ml-2 text-xs text-yellow-600">
                                            Some Experience
                                        </Badge>
                                    </div>
                                </SelectItem>
                                <SelectItem value="advanced">
                                    <div className="flex items-center justify-between w-full">
                                        <span>Advanced</span>
                                        <Badge variant="outline" className="ml-2 text-xs text-red-600">
                                            Expert Level
                                        </Badge>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Level Information */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <Badge className={cn("text-xs font-medium border", getLevelBadgeColor(formData.level))}>
                                {formData.level.charAt(0).toUpperCase() + formData.level.slice(1)}
                            </Badge>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                                {getLevelDescription(formData.level)}
                            </p>
                        </div>
                    </div>

                    {/* Description Preview */}
                    {formData.description.trim() && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                                Description Preview
                            </h4>
                            <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                                {formData.description}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};