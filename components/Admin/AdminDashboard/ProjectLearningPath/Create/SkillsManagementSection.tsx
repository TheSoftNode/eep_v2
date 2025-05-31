import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, X, Edit, AlertCircle, CheckCircle, Code, Palette, Database, Settings, Brain, Users, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface LearningSkill {
    id: string;
    name: string;
    category: string;
    level: 'basic' | 'intermediate' | 'advanced';
    description?: string;
    verificationCriteria?: string[];
}

interface SkillsManagementSectionProps {
    skills: LearningSkill[];
    onSkillsChange: (skills: LearningSkill[]) => void;
    error?: string;
}

const SKILL_CATEGORIES = [
    { value: 'frontend', label: 'Frontend Development', icon: Palette },
    { value: 'backend', label: 'Backend Development', icon: Database },
    { value: 'fullstack', label: 'Full Stack', icon: Code },
    { value: 'devops', label: 'DevOps & Infrastructure', icon: Settings },
    { value: 'data', label: 'Data Science & Analytics', icon: Brain },
    { value: 'design', label: 'UI/UX Design', icon: Palette },
    { value: 'mobile', label: 'Mobile Development', icon: Code },
    { value: 'testing', label: 'Testing & QA', icon: CheckCircle },
    { value: 'collaboration', label: 'Collaboration & Communication', icon: Users },
    { value: 'other', label: 'Other', icon: Target }
];

const SKILL_LEVELS = [
    { value: 'basic', label: 'Basic', description: 'Fundamental understanding and basic application' },
    { value: 'intermediate', label: 'Intermediate', description: 'Solid grasp with practical application' },
    { value: 'advanced', label: 'Advanced', description: 'Expert level with complex problem-solving' }
];

const SUGGESTED_SKILLS_BY_CATEGORY = {
    frontend: ['React', 'Vue.js', 'Angular', 'JavaScript ES6+', 'HTML5 & CSS3', 'Responsive Design', 'State Management'],
    backend: ['Node.js', 'Python', 'Java', 'RESTful APIs', 'GraphQL', 'Database Design', 'Authentication'],
    fullstack: ['MERN Stack', 'MEAN Stack', 'Django', 'Ruby on Rails', 'System Architecture', 'API Integration'],
    devops: ['Docker', 'Kubernetes', 'CI/CD', 'AWS/Azure', 'Linux Administration', 'Monitoring', 'Infrastructure as Code'],
    data: ['Python Data Analysis', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistics', 'ETL Processes'],
    design: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
    mobile: ['React Native', 'Flutter', 'iOS Development', 'Android Development', 'Mobile UI/UX'],
    testing: ['Unit Testing', 'Integration Testing', 'Test Automation', 'Jest', 'Cypress', 'QA Methodologies'],
    collaboration: ['Git & GitHub', 'Agile Methodologies', 'Code Review', 'Documentation', 'Team Communication'],
    other: ['Problem Solving', 'Critical Thinking', 'Time Management', 'Project Management', 'Research Skills']
};

import { useToast } from "@/hooks/use-toast";
import { useAddSkillMutation, useBulkUpdateSkillsMutation, useRemoveSkillMutation, useUpdateSkillMutation } from "@/Redux/apiSlices/learningPath/learningPathApi";

interface SkillsManagementSectionProps {
    skills: LearningSkill[];
    onSkillsChange: (skills: LearningSkill[]) => void;
    error?: string;
    projectId?: string; // Add projectId prop for edit mode
    isEditMode?: boolean; // Add edit mode flag
}

export const SkillsManagementSection: React.FC<SkillsManagementSectionProps> = ({
    skills,
    onSkillsChange,
    error,
    projectId,
    isEditMode = false
}) => {
    const { toast } = useToast();

    // API Hooks - conditionally used when projectId is available (edit mode)
    const [addSkill, { isLoading: isAddingSkill }] = useAddSkillMutation();
    const [updateSkill, { isLoading: isUpdatingSkill }] = useUpdateSkillMutation();
    const [removeSkill, { isLoading: isRemovingSkill }] = useRemoveSkillMutation();
    // const [bulkUpdateSkills, { isLoading: isBulkUpdating }] = useBulkUpdateSkillsMutation();

    const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<LearningSkill | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [newSkill, setNewSkill] = useState<Partial<LearningSkill>>({
        name: '',
        category: '',
        level: 'intermediate',
        description: '',
        verificationCriteria: []
    });
    const [newCriteria, setNewCriteria] = useState('');

    const getCategoryIcon = (category: string) => {
        const categoryData = SKILL_CATEGORIES.find(cat => cat.value === category);
        return categoryData?.icon || Target;
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'basic':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'advanced':
                return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const resetSkillForm = () => {
        setNewSkill({
            name: '',
            category: '',
            level: 'intermediate',
            description: '',
            verificationCriteria: []
        });
        setNewCriteria('');
        setEditingSkill(null);
    };

    const handleAddCriteria = () => {
        if (newCriteria.trim() && !newSkill.verificationCriteria?.includes(newCriteria.trim())) {
            setNewSkill(prev => ({
                ...prev,
                verificationCriteria: [...(prev.verificationCriteria || []), newCriteria.trim()]
            }));
            setNewCriteria('');
        }
    };

    const handleRemoveCriteria = (criteria: string) => {
        setNewSkill(prev => ({
            ...prev,
            verificationCriteria: prev.verificationCriteria?.filter(c => c !== criteria) || []
        }));
    };

    const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewSkill(prev => ({ ...prev, [name]: value }));
    };

    const generateSkillId = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const handleAddOrUpdateSkill = async () => {
        if (!newSkill.name?.trim() || !newSkill.category) {
            toast({
                title: "Missing Fields",
                description: "Please fill in skill name and category.",
                variant: "destructive",
            });
            return;
        }

        const skillData = {
            id: newSkill.id || generateSkillId(newSkill.name),
            name: newSkill.name.trim(),
            category: newSkill.category,
            level: newSkill.level || 'intermediate',
            description: newSkill.description?.trim(),
            verificationCriteria: newSkill.verificationCriteria || []
        } as LearningSkill;

        try {
            if (projectId && isEditMode && editingSkill) {
                // Update existing skill via API in edit mode
                await updateSkill({
                    projectId,
                    skillId: editingSkill.id,
                    data: {
                        name: skillData.name,
                        category: skillData.category,
                        level: skillData.level,
                        description: skillData.description,
                        verificationCriteria: skillData.verificationCriteria
                    }
                }).unwrap();

                toast({
                    title: "Skill Updated",
                    description: "Skill has been successfully updated.",
                });

                // Update local state
                const updatedSkills = skills.map(skill =>
                    skill.id === editingSkill.id ? skillData : skill
                );
                onSkillsChange(updatedSkills);

            } else if (projectId && isEditMode) {
                // Add new skill via API in edit mode
                const response = await addSkill({
                    projectId,
                    data: {
                        name: skillData.name,
                        category: skillData.category,
                        level: skillData.level,
                        description: skillData.description,
                        verificationCriteria: skillData.verificationCriteria
                    }
                }).unwrap();

                toast({
                    title: "Skill Added",
                    description: "Skill has been successfully added.",
                });

                // Update local state with returned data
                if (response.data) {
                    onSkillsChange([...skills, response.data]);
                } else {
                    onSkillsChange([...skills, skillData]);
                }

            } else {
                // Local state only (create mode)
                if (editingSkill) {
                    const updatedSkills = skills.map(skill =>
                        skill.id === editingSkill.id ? skillData : skill
                    );
                    onSkillsChange(updatedSkills);
                } else {
                    // Check for duplicates
                    const existingSkill = skills.find(skill =>
                        skill.name.toLowerCase() === skillData.name.toLowerCase()
                    );

                    if (existingSkill) {
                        toast({
                            title: "Duplicate Skill",
                            description: "A skill with this name already exists.",
                            variant: "destructive",
                        });
                        return;
                    }

                    onSkillsChange([...skills, skillData]);
                }
            }

            setIsSkillDialogOpen(false);
            resetSkillForm();

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to save skill. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteSkill = async (skillToDelete: LearningSkill) => {
        if (!confirm(`Are you sure you want to delete "${skillToDelete.name}"?`)) {
            return;
        }

        try {
            if (projectId && isEditMode) {
                // Delete via API in edit mode
                await removeSkill({
                    projectId,
                    skillId: skillToDelete.id
                }).unwrap();

                toast({
                    title: "Skill Deleted",
                    description: "Skill has been successfully deleted.",
                });
            }

            // Update local state
            const updatedSkills = skills.filter(skill => skill.id !== skillToDelete.id);
            onSkillsChange(updatedSkills);

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to delete skill. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditSkill = (skill: LearningSkill) => {
        setEditingSkill(skill);
        setNewSkill({ ...skill });
        setIsSkillDialogOpen(true);
    };

    const handleAddSuggestedSkill = (skillName: string) => {
        const existingSkill = skills.find(skill =>
            skill.name.toLowerCase() === skillName.toLowerCase()
        );

        if (existingSkill) {
            toast({
                title: "Skill Already Added",
                description: "This skill is already in your list.",
                variant: "destructive",
            });
            return;
        }

        const skillData = {
            id: generateSkillId(skillName),
            name: skillName,
            category: selectedCategory || 'other',
            level: 'intermediate' as const,
            description: '',
            verificationCriteria: []
        };

        onSkillsChange([...skills, skillData]);
    };

    const filteredSuggestions = selectedCategory && SUGGESTED_SKILLS_BY_CATEGORY[selectedCategory as keyof typeof SUGGESTED_SKILLS_BY_CATEGORY]
        ? SUGGESTED_SKILLS_BY_CATEGORY[selectedCategory as keyof typeof SUGGESTED_SKILLS_BY_CATEGORY].filter(
            suggestion => !skills.some(skill => skill.name.toLowerCase() === suggestion.toLowerCase())
        )
        : [];

    const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, LearningSkill[]>);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <Target className="h-4 w-4" />
                        </div>
                        Skills Management
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Define the skills learners will acquire through this learning path
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Skill Button */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                Learning Skills ({skills.length})
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Skills that learners will develop and demonstrate
                            </p>
                        </div>
                        <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
                                    onClick={() => {
                                        resetSkillForm();
                                        setIsSkillDialogOpen(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Skill
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingSkill ? 'Edit Skill' : 'Add Learning Skill'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingSkill
                                            ? 'Update the skill information and requirements'
                                            : 'Define a skill that learners will develop through this learning path'
                                        }
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="skill-name">Skill Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="skill-name"
                                                name="name"
                                                value={newSkill.name || ''}
                                                onChange={handleSkillInputChange}
                                                placeholder="e.g., React State Management"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={newSkill.category || ''}
                                                onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SKILL_CATEGORIES.map((category) => {
                                                        const IconComponent = category.icon;
                                                        return (
                                                            <SelectItem key={category.value} value={category.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <IconComponent className="h-4 w-4" />
                                                                    {category.label}
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Skill Level</Label>
                                        <Select
                                            value={newSkill.level || 'intermediate'}
                                            onValueChange={(value) => setNewSkill(prev => ({ ...prev, level: value as any }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SKILL_LEVELS.map((level) => (
                                                    <SelectItem key={level.value} value={level.value}>
                                                        <div>
                                                            <div className="font-medium">{level.label}</div>
                                                            <div className="text-xs text-slate-500">{level.description}</div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="skill-description">Description</Label>
                                        <Textarea
                                            id="skill-description"
                                            name="description"
                                            value={newSkill.description || ''}
                                            onChange={handleSkillInputChange}
                                            placeholder="Describe what this skill involves and how it will be applied..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Verification Criteria</Label>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Define how learners can demonstrate mastery of this skill
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="e.g., Build a component using hooks"
                                                value={newCriteria}
                                                onChange={(e) => setNewCriteria(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddCriteria();
                                                    }
                                                }}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleAddCriteria}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        <div className="space-y-1">
                                            {newSkill.verificationCriteria?.map((criteria, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                                                    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                                                        {criteria}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-slate-500 hover:text-red-500"
                                                        onClick={() => handleRemoveCriteria(criteria)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )) || []}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsSkillDialogOpen(false);
                                            resetSkillForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddOrUpdateSkill}
                                        disabled={!newSkill.name?.trim() || !newSkill.category || isAddingSkill || isUpdatingSkill}
                                    >
                                        {(isAddingSkill || isUpdatingSkill) ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                {editingSkill ? 'Updating...' : 'Adding...'}
                                            </>
                                        ) : (
                                            editingSkill ? 'Update Skill' : 'Add Skill'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Quick Add Suggestions */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Quick Add by Category
                            </Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSuggestions(!showSuggestions)}
                                className="text-slate-600 dark:text-slate-400"
                            >
                                {showSuggestions ? 'Hide' : 'Show'} Suggestions
                            </Button>
                        </div>

                        {showSuggestions && (
                            <div className="space-y-3">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category to see suggestions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SKILL_CATEGORIES.map((category) => {
                                            const IconComponent = category.icon;
                                            return (
                                                <SelectItem key={category.value} value={category.value}>
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="h-4 w-4" />
                                                        {category.label}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>

                                {selectedCategory && filteredSuggestions.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                                        {filteredSuggestions.map((suggestion, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAddSuggestedSkill(suggestion)}
                                                className="text-xs justify-start h-8"
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                {suggestion}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Skills List */}
                    <div className="space-y-4">
                        {skills.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                <Target className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                    No Skills Added Yet
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                                    Add skills that learners will develop through this learning path. Skills should be specific, measurable, and relevant to the project goals.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
                                    const CategoryIcon = getCategoryIcon(category);
                                    const categoryData = SKILL_CATEGORIES.find(cat => cat.value === category);

                                    return (
                                        <div key={category} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CategoryIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {categoryData?.label || category} ({categorySkills.length})
                                                </h4>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {categorySkills.map((skill, index) => (
                                                    <motion.div
                                                        key={skill.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                                        className="group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h5 className="font-medium text-slate-900 dark:text-white">
                                                                        {skill.name}
                                                                    </h5>
                                                                    <Badge className={cn("text-xs", getLevelColor(skill.level))}>
                                                                        {skill.level}
                                                                    </Badge>
                                                                </div>
                                                                {skill.description && (
                                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                                        {skill.description}
                                                                    </p>
                                                                )}
                                                                {skill.verificationCriteria && skill.verificationCriteria.length > 0 && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                                            Verification:
                                                                        </p>
                                                                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                                                                            {skill.verificationCriteria.map((criteria, idx) => (
                                                                                <li key={idx} className="flex items-start gap-1">
                                                                                    <span className="text-slate-400 mt-1">•</span>
                                                                                    <span>{criteria}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                                                    onClick={() => handleEditSkill(skill)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleDeleteSkill(skill)}
                                                                    disabled={isRemovingSkill}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Skills Summary */}
                    {skills.length > 0 && (
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                                🎯 Skills Summary
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">Total Skills:</span>
                                    <span className="ml-1 text-purple-800 dark:text-purple-200">{skills.length}</span>
                                </div>
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">Categories:</span>
                                    <span className="ml-1 text-purple-800 dark:text-purple-200">
                                        {Object.keys(skillsByCategory).length}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">Advanced:</span>
                                    <span className="ml-1 text-purple-800 dark:text-purple-200">
                                        {skills.filter(s => s.level === 'advanced').length}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">With Criteria:</span>
                                    <span className="ml-1 text-purple-800 dark:text-purple-200">
                                        {skills.filter(s => s.verificationCriteria && s.verificationCriteria.length > 0).length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};