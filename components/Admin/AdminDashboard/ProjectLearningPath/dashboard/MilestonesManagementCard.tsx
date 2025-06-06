import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Award,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    Flag,
    Target,
    Settings,
    BarChart3,
    MoreVertical,
    Zap,
    X,
    RefreshCw,
    AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
    useCreateMilestoneMutation,
    useDeleteMilestoneMutation,
    useUpdateMilestoneMutation
} from "@/Redux/apiSlices/learningPath/learningPathApi";

interface LearningSkill {
    id: string;
    name: string;
    category: string;
    level: 'basic' | 'intermediate' | 'advanced';
    description?: string;
    verificationCriteria?: string[];
}

interface MilestonesManagementCardProps {
    projectId: string;
    milestones: Array<{
        id: string;
        projectId: string;
        title: string;
        description: string;
        type: 'project-start' | 'area-complete' | 'skill-mastery' | 'project-complete' | 'custom';
        order: number;
        requiredTaskIds: string[];
        requiredAreaIds?: string[];
        skillsAwarded: string[];
        status: 'locked' | 'available' | 'in-progress' | 'completed' | 'failed' | 'skipped';
        difficulty: number;
        isOptional: boolean;
        autoComplete: boolean;
        estimatedHours?: number;
        completedAt?: any;
        createdAt: any;
        updatedAt: any;
        customCriteria?: string[];
    }>;
    onMilestoneUpdate: () => void;
    availableSkills?: LearningSkill[];
}

const MILESTONE_TYPES = [
    { value: 'project-start', label: 'Project Start', icon: Flag, description: 'Beginning of the learning journey' },
    { value: 'area-complete', label: 'Area Complete', icon: CheckCircle, description: 'Completion of a project area' },
    { value: 'skill-mastery', label: 'Skill Mastery', icon: Target, description: 'Demonstration of skill proficiency' },
    { value: 'project-complete', label: 'Project Complete', icon: Award, description: 'Final project completion' },
    { value: 'custom', label: 'Custom', icon: Settings, description: 'Custom learning checkpoint' }
];

const getMilestoneTypeIcon = (type: string) => {
    const typeData = MILESTONE_TYPES.find(t => t.value === type);
    return typeData?.icon || Settings;
};

const getMilestoneTypeLabel = (type: string) => {
    const typeData = MILESTONE_TYPES.find(t => t.value === type);
    return typeData?.label || type;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'in-progress':
            return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'available':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'locked':
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
        case 'failed':
            return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
        case 'skipped':
            return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

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

export const MilestonesManagementCard: React.FC<MilestonesManagementCardProps> = ({
    projectId,
    milestones,
    onMilestoneUpdate,
    availableSkills = []
}) => {
    const [sortBy, setSortBy] = useState<'order' | 'status' | 'difficulty' | 'type'>('order');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [milestoneToDelete, setMilestoneToDelete] = useState<any | null>(null);

    // Form state
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        description: '',
        type: 'custom',
        skillsAwarded: [] as string[],
        estimatedHours: 1,
        difficulty: 5,
        isOptional: false,
        customCriteria: [] as string[]
    });
    const [newCriteria, setNewCriteria] = useState('');
    const [selectedSkillsForAward, setSelectedSkillsForAward] = useState<string[]>([]);

    const { isAdmin } = useAuth();
    const { toast } = useToast();

    // API Hooks
    const [createMilestone, { isLoading: isCreatingMilestone }] = useCreateMilestoneMutation();
    const [updateMilestone, { isLoading: isUpdatingMilestone }] = useUpdateMilestoneMutation();
    const [deleteMilestone, { isLoading: isDeletingMilestone }] = useDeleteMilestoneMutation();

    // Handle escape key for modal
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMilestoneDialogOpen) {
                handleCloseDialog();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMilestoneDialogOpen]);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        if (isMilestoneDialogOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMilestoneDialogOpen]);

    // Sort and filter milestones
    const sortedMilestones = [...milestones]
        .filter(milestone => filterStatus === 'all' || milestone.status === filterStatus)
        .sort((a, b) => {
            switch (sortBy) {
                case 'order':
                    return a.order - b.order;
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'difficulty':
                    return b.difficulty - a.difficulty;
                case 'type':
                    return a.type.localeCompare(b.type);
                default:
                    return a.order - b.order;
            }
        });

    // Calculate milestone statistics
    const milestoneStats = {
        total: milestones.length,
        completed: milestones.filter(m => m.status === 'completed').length,
        inProgress: milestones.filter(m => m.status === 'in-progress').length,
        available: milestones.filter(m => m.status === 'available').length,
        optional: milestones.filter(m => m.isOptional).length,
        totalHours: milestones.reduce((sum, m) => sum + (m.estimatedHours ?? 0), 0),
        averageDifficulty: milestones.length > 0 ? milestones.reduce((sum, m) => sum + m.difficulty, 0) / milestones.length : 0
    };

    const completionPercentage = milestones.length > 0 ? (milestoneStats.completed / milestones.length) * 100 : 0;

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

    const handleCloseDialog = () => {
        setIsMilestoneDialogOpen(false);
        resetMilestoneForm();
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

            if (editingMilestone?.id) {
                // Update existing milestone
                await updateMilestone({
                    projectId,
                    milestoneId: editingMilestone.id,
                    data: milestoneData
                }).unwrap();

                toast({
                    title: "Milestone Updated",
                    description: "Milestone has been successfully updated.",
                });
            } else {
                // Create new milestone
                await createMilestone({
                    projectId,
                    data: milestoneData
                }).unwrap();

                toast({
                    title: "Milestone Created",
                    description: "Milestone has been successfully created.",
                });
            }

            handleCloseDialog();
            onMilestoneUpdate();

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to save milestone. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (milestone: any) => {
        setEditingMilestone(milestone);
        setNewMilestone({
            title: milestone.title,
            description: milestone.description,
            type: milestone.type,
            skillsAwarded: milestone.skillsAwarded || [],
            estimatedHours: milestone.estimatedHours || 1,
            difficulty: milestone.difficulty || 5,
            isOptional: milestone.isOptional || false,
            customCriteria: milestone.customCriteria || []
        });
        setSelectedSkillsForAward(milestone.skillsAwarded || []);
        setIsMilestoneDialogOpen(true);
    };

    const handleDeleteMilestone = async () => {
        if (!milestoneToDelete) return;

        try {
            await deleteMilestone({
                projectId,
                milestoneId: milestoneToDelete.id
            }).unwrap();

            toast({
                title: "Milestone Deleted",
                description: "Milestone has been successfully deleted.",
            });

            setDeleteConfirmOpen(false);
            setMilestoneToDelete(null);
            onMilestoneUpdate();

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to delete milestone. Please try again.",
                variant: "destructive",
            });
        }
    };

    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        try {
            if (date.seconds) {
                return new Date(date.seconds * 1000).toLocaleDateString();
            }
            return new Date(date).toLocaleDateString();
        } catch {
            return 'N/A';
        }
    };

    return (
        <>
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
                            Milestones Management
                            <Badge className="ml-auto bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                {milestoneStats.completed}/{milestoneStats.total} Complete
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Statistics Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                                        {milestoneStats.completed}
                                    </p>
                                </div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">Completed</p>
                            </div>

                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                        {milestoneStats.inProgress}
                                    </p>
                                </div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">In Progress</p>
                            </div>

                            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Flag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                                        {milestoneStats.optional}
                                    </p>
                                </div>
                                <p className="text-xs text-purple-600 dark:text-purple-400">Optional</p>
                            </div>

                            <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                                        {milestoneStats.totalHours}h
                                    </p>
                                </div>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400">Total Time</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Overall Milestone Progress
                                </span>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {Math.round(completionPercentage)}%
                                </span>
                            </div>
                            <Progress value={completionPercentage} className="h-2" />
                        </div>

                        {/* Filters and Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="text-sm border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="locked">Locked</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="text-sm border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="order">Sort by Order</option>
                                    <option value="status">Sort by Status</option>
                                    <option value="difficulty">Sort by Difficulty</option>
                                    <option value="type">Sort by Type</option>
                                </select>
                            </div>
                            {isAdmin() && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/20"
                                    onClick={() => {
                                        resetMilestoneForm();
                                        setIsMilestoneDialogOpen(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Milestone
                                </Button>
                            )}
                        </div>

                        {/* Milestones List */}
                        {sortedMilestones.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                <Award className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                    No Milestones Found
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                                    {filterStatus !== 'all'
                                        ? `No milestones with status "${filterStatus}" found.`
                                        : 'No milestones have been created for this learning path yet.'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedMilestones.map((milestone, index) => {
                                    const TypeIcon = getMilestoneTypeIcon(milestone.type);
                                    return (
                                        <motion.div
                                            key={milestone.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            className="group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                                        <TypeIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h5 className="font-medium text-slate-900 dark:text-white">
                                                                {milestone.title}
                                                            </h5>
                                                            <Badge variant="outline" className="text-xs">
                                                                {getMilestoneTypeLabel(milestone.type)}
                                                            </Badge>
                                                            <Badge className={cn("text-xs", getStatusColor(milestone.status))}>
                                                                {milestone.status.replace('-', ' ')}
                                                            </Badge>
                                                            {milestone.isOptional && (
                                                                <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                                                                    Optional
                                                                </Badge>
                                                            )}
                                                            <Badge className={cn("text-xs", getDifficultyColor(milestone.difficulty))}>
                                                                {getDifficultyLabel(milestone.difficulty)}
                                                            </Badge>
                                                        </div>

                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                            {milestone.description}
                                                        </p>

                                                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {milestone.estimatedHours}h estimated
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Target className="h-3 w-3" />
                                                                Order: {milestone.order}
                                                            </span>
                                                            {milestone.skillsAwarded.length > 0 && (
                                                                <span className="flex items-center gap-1">
                                                                    <Award className="h-3 w-3" />
                                                                    {milestone.skillsAwarded.length} skill{milestone.skillsAwarded.length > 1 ? 's' : ''} awarded
                                                                </span>
                                                            )}
                                                            {milestone.autoComplete && (
                                                                <span className="flex items-center gap-1">
                                                                    <Zap className="h-3 w-3" />
                                                                    Auto-complete
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

                                                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                            <span>Created: {formatDate(milestone.createdAt)}</span>
                                                            {milestone.completedAt && (
                                                                <span>Completed: {formatDate(milestone.completedAt)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {isAdmin() && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEdit(milestone)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit Milestone
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setMilestoneToDelete(milestone);
                                                                    setDeleteConfirmOpen(true);
                                                                }}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete Milestone
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Summary Information */}
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Milestones Summary
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">Completion Rate:</span>
                                    <span className="ml-1 text-amber-800 dark:text-amber-200">{Math.round(completionPercentage)}%</span>
                                </div>
                                <div>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">Avg Difficulty:</span>
                                    <span className="ml-1 text-amber-800 dark:text-amber-200">{milestoneStats.averageDifficulty.toFixed(1)}/10</span>
                                </div>
                                <div>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">Skills Awarded:</span>
                                    <span className="ml-1 text-amber-800 dark:text-amber-200">
                                        {new Set(milestones.flatMap(m => m.skillsAwarded)).size} unique
                                    </span>
                                </div>
                                <div>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">Auto-Complete:</span>
                                    <span className="ml-1 text-amber-800 dark:text-amber-200">
                                        {milestones.filter(m => m.autoComplete).length} enabled
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Custom Milestone Dialog */}
            <AnimatePresence>
                {isMilestoneDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={handleCloseDialog}
                        />

                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4"
                        >
                            {/* Header */}
                            <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {editingMilestone ? 'Edit Milestone' : 'Create Learning Milestone'}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            {editingMilestone
                                                ? 'Update the milestone requirements and rewards'
                                                : 'Define a checkpoint that validates learning progress and awards skills'
                                            }
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCloseDialog}
                                        className="h-10 w-10 rounded-full"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
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
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-200 dark:border-slate-700 p-6">
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCloseDialog}
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
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {deleteConfirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setDeleteConfirmOpen(false)}
                        />

                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4"
                        >
                            <div className="space-y-4">
                                {/* Header */}
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <AlertTriangle className="h-5 w-5" />
                                        Delete Milestone
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                        Are you sure you want to delete "{milestoneToDelete?.title}"? This action cannot be undone and will permanently remove this milestone from the learning path.
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteConfirmOpen(false)}
                                        disabled={isDeletingMilestone}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDeleteMilestone}
                                        disabled={isDeletingMilestone}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isDeletingMilestone ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Milestone
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
