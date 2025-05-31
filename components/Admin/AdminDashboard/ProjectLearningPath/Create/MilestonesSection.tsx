import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, Plus, X, Edit, AlertCircle, Flag, Target, CheckCircle, Settings, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCreateMilestoneMutation, useDeleteMilestoneMutation, useGetProjectMilestonesQuery, useUpdateMilestoneMutation } from "@/Redux/apiSlices/learningPath/learningPathApi";

interface LearningMilestone {
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
}

interface LearningSkill {
    id: string;
    name: string;
    category: string;
    level: 'basic' | 'intermediate' | 'advanced';
    description?: string;
    verificationCriteria?: string[];
}

interface MilestonesSectionProps {
    milestones: LearningMilestone[];
    onMilestonesChange: (milestones: LearningMilestone[]) => void;
    projectId: string;
    availableSkills: LearningSkill[];
}

const MILESTONE_TYPES = [
    { value: 'project-start', label: 'Project Start', icon: Flag, description: 'Beginning of the learning journey' },
    { value: 'area-complete', label: 'Area Complete', icon: CheckCircle, description: 'Completion of a project area' },
    { value: 'skill-mastery', label: 'Skill Mastery', icon: Target, description: 'Demonstration of skill proficiency' },
    { value: 'project-complete', label: 'Project Complete', icon: Award, description: 'Final project completion' },
    { value: 'custom', label: 'Custom', icon: Settings, description: 'Custom learning checkpoint' }
];

const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
};

const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return 'Easy';
    if (difficulty <= 6) return 'Medium';
    return 'Hard';
};

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
    milestones,
    onMilestonesChange,
    projectId,
    availableSkills
}) => {
    const { toast } = useToast();

    // API Hooks
    const [createMilestone, { isLoading: isCreatingMilestone }] = useCreateMilestoneMutation();
    const [updateMilestone, { isLoading: isUpdatingMilestone }] = useUpdateMilestoneMutation();
    const [deleteMilestone, { isLoading: isDeletingMilestone }] = useDeleteMilestoneMutation();

    const isEditMode = projectId && projectId !== '';

    console.log("ProjectId: ", projectId)

    // Fetch existing milestones for edit mode
    const {
        data: existingMilestonesData,
        isLoading: isLoadingExistingMilestones,
        error: milestonesError
    } = useGetProjectMilestonesQuery(
        { projectId },
        { skip: !projectId || !isEditMode }
    );

    const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<LearningMilestone | null>(null);
    const [newMilestone, setNewMilestone] = useState<LearningMilestone>({
        title: '',
        description: '',
        type: 'custom',
        skillsAwarded: [],
        estimatedHours: 1,
        difficulty: 5,
        isOptional: false,
        customCriteria: []
    });
    const [newCriteria, setNewCriteria] = useState('');
    const [selectedSkillsForAward, setSelectedSkillsForAward] = useState<string[]>([]);
    const [hasLoadedExistingMilestones, setHasLoadedExistingMilestones] = useState(false);

    // Load existing milestones when data is available
    React.useEffect(() => {
        if (existingMilestonesData?.data && isEditMode && !hasLoadedExistingMilestones) {
            const existingMilestones = existingMilestonesData.data;
            if (existingMilestones.length > 0) {
                onMilestonesChange(existingMilestones);
                setHasLoadedExistingMilestones(true);
            }
        }
    }, [existingMilestonesData, isEditMode, hasLoadedExistingMilestones, onMilestonesChange]);

    // Reset the loaded flag when projectId changes
    React.useEffect(() => {
        setHasLoadedExistingMilestones(false);
    }, [projectId]);

    const resetMilestoneForm = () => {
        setNewMilestone({
            title: '',
            description: '',
            type: 'custom',
            skillsAwarded: [],
            estimatedHours: 1,
            difficulty: 5,
            isOptional: false,
            customCriteria: []
        });
        setNewCriteria('');
        setSelectedSkillsForAward([]);
        setEditingMilestone(null);
    };

    const handleMilestoneInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewMilestone(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCriteria = () => {
        if (newCriteria.trim() && !newMilestone.customCriteria?.includes(newCriteria.trim())) {
            setNewMilestone(prev => ({
                ...prev,
                customCriteria: [...(prev.customCriteria || []), newCriteria.trim()]
            }));
            setNewCriteria('');
        }
    };

    const handleRemoveCriteria = (criteria: string) => {
        setNewMilestone(prev => ({
            ...prev,
            customCriteria: prev.customCriteria?.filter(c => c !== criteria) || []
        }));
    };

    const handleSkillSelectionChange = (skillName: string, isSelected: boolean) => {
        if (isSelected) {
            setSelectedSkillsForAward(prev => [...prev, skillName]);
            setNewMilestone(prev => ({
                ...prev,
                skillsAwarded: [...prev.skillsAwarded, skillName]
            }));
        } else {
            setSelectedSkillsForAward(prev => prev.filter(s => s !== skillName));
            setNewMilestone(prev => ({
                ...prev,
                skillsAwarded: prev.skillsAwarded.filter(s => s !== skillName)
            }));
        }
    };

    const handleAddOrUpdateMilestone = async () => {
        if (!newMilestone.title.trim() || !newMilestone.description.trim()) {
            toast({
                title: "Missing Fields",
                description: "Please fill in title and description.",
                variant: "destructive",
            });
            return;
        }

        try {
            const milestoneData = {
                title: newMilestone.title.trim(),
                description: newMilestone.description.trim(),
                type: newMilestone.type,
                skillsAwarded: newMilestone.skillsAwarded,
                estimatedHours: newMilestone.estimatedHours || 1,
                difficulty: newMilestone.difficulty || 5,
                isOptional: newMilestone.isOptional || false,
                customCriteria: newMilestone.customCriteria || []
            };

            if (projectId && isEditMode && editingMilestone?.id) {
                // Update existing milestone via API in edit mode
                const response = await updateMilestone({
                    projectId,
                    milestoneId: editingMilestone.id,
                    data: milestoneData
                }).unwrap();

                toast({
                    title: "Milestone Updated",
                    description: "Milestone has been successfully updated.",
                });

                // Update local state with response data
                const updatedMilestones = milestones.map(milestone =>
                    milestone.id === editingMilestone.id ? (response.data || { ...milestone, ...milestoneData }) : milestone
                );
                onMilestonesChange(updatedMilestones);

            } else if (projectId && isEditMode) {
                // Create new milestone via API in edit mode
                const response = await createMilestone({
                    projectId,
                    data: milestoneData
                }).unwrap();

                toast({
                    title: "Milestone Created",
                    description: "Milestone has been successfully created.",
                });

                // Update local state with the returned milestone
                if (response.data) {
                    onMilestonesChange([...milestones, response.data]);
                }

            } else {
                // Local state only (create mode)
                const milestoneWithId = {
                    ...milestoneData,
                    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                };

                if (editingMilestone) {
                    const updatedMilestones = milestones.map(milestone =>
                        milestone.id === editingMilestone.id ? milestoneWithId : milestone
                    );
                    onMilestonesChange(updatedMilestones);
                } else {
                    onMilestonesChange([...milestones, milestoneWithId]);
                }
            }

            setIsMilestoneDialogOpen(false);
            resetMilestoneForm();

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to save milestone. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteMilestone = async (milestoneToDelete: LearningMilestone) => {
        if (!confirm(`Are you sure you want to delete "${milestoneToDelete.title}"?`)) {
            return;
        }

        try {
            if (projectId && isEditMode && milestoneToDelete.id && !milestoneToDelete.id.startsWith('temp_')) {
                // Delete via API in edit mode
                await deleteMilestone({
                    projectId,
                    milestoneId: milestoneToDelete.id
                }).unwrap();

                toast({
                    title: "Milestone Deleted",
                    description: "Milestone has been successfully deleted.",
                });
            }

            // Update local state
            const updatedMilestones = milestones.filter(milestone => milestone.id !== milestoneToDelete.id);
            onMilestonesChange(updatedMilestones);

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to delete milestone. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditMilestone = (milestone: LearningMilestone) => {
        setEditingMilestone(milestone);
        setNewMilestone({ ...milestone });
        setSelectedSkillsForAward(milestone.skillsAwarded || []);
        setIsMilestoneDialogOpen(true);
    };

    const getMilestoneTypeIcon = (type: string) => {
        const typeData = MILESTONE_TYPES.find(t => t.value === type);
        return typeData?.icon || Settings;
    };

    const getMilestoneTypeLabel = (type: string) => {
        const typeData = MILESTONE_TYPES.find(t => t.value === type);
        return typeData?.label || type;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                            <Award className="h-4 w-4" />
                        </div>
                        Learning Milestones
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Define checkpoints that validate learning progress and skill mastery
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Milestone Button */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                Custom Milestones ({milestones.length})
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Create checkpoints to track and validate learning progress
                            </p>
                        </div>
                        <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/20"
                                    onClick={() => {
                                        resetMilestoneForm();
                                        setIsMilestoneDialogOpen(true);
                                    }}
                                    disabled={isLoadingExistingMilestones}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Milestone
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingMilestone ? 'Edit Milestone' : 'Create Learning Milestone'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingMilestone
                                            ? 'Update the milestone requirements and rewards'
                                            : 'Define a checkpoint that validates learning progress and awards skills'
                                        }
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="milestone-title">Title <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="milestone-title"
                                                name="title"
                                                value={newMilestone.title}
                                                onChange={handleMilestoneInputChange}
                                                placeholder="e.g., Complete API Integration"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="milestone-description">Description <span className="text-red-500">*</span></Label>
                                            <Textarea
                                                id="milestone-description"
                                                name="description"
                                                value={newMilestone.description}
                                                onChange={handleMilestoneInputChange}
                                                placeholder="Describe what learners need to accomplish to reach this milestone..."
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="milestone-hours">Estimated Hours</Label>
                                                <Input
                                                    id="milestone-hours"
                                                    name="estimatedHours"
                                                    type="number"
                                                    min="0.5"
                                                    step="0.5"
                                                    value={newMilestone.estimatedHours || ''}
                                                    onChange={handleMilestoneInputChange}
                                                    placeholder="1"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="milestone-difficulty">Difficulty (1-10)</Label>
                                                <Input
                                                    id="milestone-difficulty"
                                                    name="difficulty"
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={newMilestone.difficulty || ''}
                                                    onChange={handleMilestoneInputChange}
                                                    placeholder="5"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm">Options</Label>
                                                <div className="flex items-center space-x-2 h-10">
                                                    <Switch
                                                        id="milestone-optional"
                                                        checked={newMilestone.isOptional || false}
                                                        onCheckedChange={(checked) => setNewMilestone(prev => ({ ...prev, isOptional: checked }))}
                                                    />
                                                    <Label htmlFor="milestone-optional" className="text-sm">
                                                        Optional milestone
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills to Award */}
                                        <div className="space-y-3">
                                            <Label>Skills Awarded</Label>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Select skills that learners will gain upon completing this milestone
                                            </p>
                                            {availableSkills.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md p-3">
                                                    {availableSkills.map((skill) => (
                                                        <div key={skill.id} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`skill-${skill.id}`}
                                                                checked={selectedSkillsForAward.includes(skill.name)}
                                                                onChange={(e) => handleSkillSelectionChange(skill.name, e.target.checked)}
                                                                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                                            />
                                                            <Label htmlFor={`skill-${skill.id}`} className="text-sm cursor-pointer">
                                                                {skill.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                                        No skills available. Add skills in the previous step to award them through milestones.
                                                    </p>
                                                </div>
                                            )}
                                            {selectedSkillsForAward.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {selectedSkillsForAward.map((skillName, index) => (
                                                        <Badge key={index} variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                                            {skillName}
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-3 w-3 ml-1 hover:bg-red-100"
                                                                onClick={() => handleSkillSelectionChange(skillName, false)}
                                                            >
                                                                <X className="h-2 w-2" />
                                                            </Button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Custom Criteria */}
                                        <div className="space-y-3">
                                            <Label>Custom Completion Criteria</Label>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Define specific requirements for completing this milestone
                                            </p>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="e.g., Submit working code with documentation"
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
                                                {newMilestone.customCriteria?.map((criteria, index) => (
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
                                                setIsMilestoneDialogOpen(false);
                                                resetMilestoneForm();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddOrUpdateMilestone}
                                            disabled={!newMilestone.title.trim() || !newMilestone.description.trim() || isCreatingMilestone || isUpdatingMilestone}
                                        >
                                            {(isCreatingMilestone || isUpdatingMilestone) ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    {editingMilestone ? 'Updating...' : 'Creating...'}
                                                </>
                                            ) : (
                                                editingMilestone ? 'Update Milestone' : 'Create Milestone'
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Loading State for Existing Milestones */}
                    {isLoadingExistingMilestones && (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin text-indigo-600 mr-3" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Loading existing milestones...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {milestonesError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Failed to load existing milestones. You can still create new ones.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Milestones List */}
                    {!isLoadingExistingMilestones && (
                        <div className="space-y-4">
                            {milestones.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                    <Award className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                        No Milestones Created
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                                        Create milestones to track learning progress and validate skill acquisition. Milestones provide clear checkpoints for learners.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {milestones.map((milestone, index) => {
                                        const MilestoneIcon = getMilestoneTypeIcon(milestone.type);
                                        return (
                                            <motion.div
                                                key={milestone.id || index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                className="group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                                            <MilestoneIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h5 className="font-medium text-slate-900 dark:text-white">
                                                                    {milestone.title}
                                                                </h5>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {getMilestoneTypeLabel(milestone.type)}
                                                                </Badge>
                                                                {milestone.isOptional && (
                                                                    <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                                                                        Optional
                                                                    </Badge>
                                                                )}
                                                                {milestone.difficulty && (
                                                                    <Badge className={cn("text-xs", getDifficultyColor(milestone.difficulty))}>
                                                                        {getDifficultyLabel(milestone.difficulty)}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                                {milestone.description}
                                                            </p>
                                                            <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                                {milestone.estimatedHours && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Settings className="h-3 w-3" />
                                                                        {milestone.estimatedHours}h estimated
                                                                    </span>
                                                                )}
                                                                {milestone.skillsAwarded.length > 0 && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Award className="h-3 w-3" />
                                                                        {milestone.skillsAwarded.length} skill{milestone.skillsAwarded.length > 1 ? 's' : ''} awarded
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {milestone.skillsAwarded.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mb-2">
                                                                    {milestone.skillsAwarded.map((skill, skillIndex) => (
                                                                        <Badge key={skillIndex} variant="secondary" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                                                            {skill}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {milestone.customCriteria && milestone.customCriteria.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                                        Completion Criteria:
                                                                    </p>
                                                                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                                                                        {milestone.customCriteria.map((criteria, idx) => (
                                                                            <li key={idx} className="flex items-start gap-1">
                                                                                <span className="text-slate-400 mt-1">•</span>
                                                                                <span>{criteria}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                                            onClick={() => handleEditMilestone(milestone)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDeleteMilestone(milestone)}
                                                            disabled={isDeletingMilestone}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Milestones Summary */}
                    {milestones.length > 0 && !isLoadingExistingMilestones && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                                🏆 Milestones Summary
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">Total:</span>
                                    <span className="ml-1 text-amber-800 dark:text-amber-200">{milestones.length}</span>
                                </div>
                                <div>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">Optional:</span>
                                    <span className="ml-1 text-amber-800 dark:text-amber-200">
                                        {milestones.filter(m => m.isOptional).length}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">Est. Hours:</span>
                                    <span className="ml-1 text-amber-800 dark:text-amber-200">
                                        {milestones.reduce((total, m) => total + (m.estimatedHours || 0), 0)}h
                                    </span>
                                </div>
                                <div>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">Skills:</span>
                                    <span className="ml-1 text-amber-800 dark:text-amber-200">
                                        {new Set(milestones.flatMap(m => m.skillsAwarded)).size} unique
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