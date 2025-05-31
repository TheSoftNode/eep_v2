import React, { useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, FileText, Tag, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BasicWorkspaceSectionProps {
    formData: {
        name: string;
        description: string;
        projectType: string;
        tags: string[];
    };
    errors: Record<string, string>;
    onInputChange: (field: string, value: any) => void;
}

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
    description?: string;
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
    description
}) => (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
            )}
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

export const BasicWorkspaceSection: React.FC<BasicWorkspaceSectionProps> = ({
    formData,
    errors,
    onInputChange
}) => {
    const [tagInput, setTagInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onInputChange(name, value);
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !formData.tags.includes(newTag)) {
                onInputChange('tags', [...formData.tags, newTag]);
                setTagInput('');
            }
        }
    };

    const handleAddTagButton = () => {
        const newTag = tagInput.trim();
        if (newTag && !formData.tags.includes(newTag)) {
            onInputChange('tags', [...formData.tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };

    const descriptionWordCount = formData.description.trim().split(/\s+/).filter(word => word).length;

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
                            <FolderPlus className="h-4 w-4" />
                        </div>
                        Basic Information
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Essential details to identify and describe the workspace
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            id="name"
                            label="Workspace Name"
                            icon={FolderPlus}
                            required
                            placeholder="E-Commerce Platform Development"
                            value={formData.name}
                            onChange={handleInputChange}
                            error={errors.name}
                            description="A clear, descriptive name for your workspace"
                        />

                        <InputField
                            id="projectType"
                            label="Project Type"
                            icon={FileText}
                            placeholder="Web Development, Mobile App, Data Analysis"
                            value={formData.projectType}
                            onChange={handleInputChange}
                            error={errors.projectType}
                            description="The type or category of project"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {descriptionWordCount} words
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Describe the purpose and goals of this workspace
                        </p>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileText className="h-4 w-4 text-slate-400" />
                            </div>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="This workspace is designed for building a comprehensive e-commerce platform. Team members will collaborate on frontend development, backend APIs, database design, and user experience optimization..."
                                rows={4}
                                className={cn(
                                    "pl-10 resize-none transition-colors",
                                    errors.description && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                        </div>
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Tags
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add relevant technologies, frameworks, or topics
                        </p>

                        {/* Tag Display */}
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                            aria-label={`Remove ${tag} tag`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Tag Input */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    placeholder="Enter tag and press Enter or comma"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddTagButton}
                                disabled={!tagInput.trim()}
                                className="border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                            >
                                <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </Button>
                        </div>

                        {/* Popular Tags Suggestions */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Popular tags:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'GraphQL'].map((tag) => (
                                    <Button
                                        key={tag}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (!formData.tags.includes(tag)) {
                                                onInputChange('tags', [...formData.tags, tag]);
                                            }
                                        }}
                                        disabled={formData.tags.includes(tag)}
                                        className="h-7 px-2 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                    >
                                        + {tag}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview of Basic Info */}
                    {(formData.name || formData.description) && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-3">
                                Basic Information Preview
                            </h4>
                            {formData.name && (
                                <div className="mb-2">
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Workspace Name:</p>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200">{formData.name}</p>
                                </div>
                            )}
                            {formData.projectType && (
                                <div className="mb-2">
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Project Type:</p>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200">{formData.projectType}</p>
                                </div>
                            )}
                            {formData.description && (
                                <div>
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Description:</p>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200 line-clamp-3">
                                        {formData.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};