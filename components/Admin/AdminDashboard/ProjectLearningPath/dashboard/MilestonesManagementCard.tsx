import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
    }>;
    onMilestoneUpdate: () => void;
}

const getMilestoneTypeIcon = (type: string) => {
    switch (type) {
        case 'project-start': return Flag;
        case 'area-complete': return CheckCircle;
        case 'skill-mastery': return Target;
        case 'project-complete': return Award;
        case 'custom': return Settings;
        default: return Settings;
    }
};

const getMilestoneTypeLabel = (type: string) => {
    switch (type) {
        case 'project-start': return 'Project Start';
        case 'area-complete': return 'Area Complete';
        case 'skill-mastery': return 'Skill Mastery';
        case 'project-complete': return 'Project Complete';
        case 'custom': return 'Custom';
        default: return type;
    }
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
    onMilestoneUpdate
}) => {
    const [sortBy, setSortBy] = useState<'order' | 'status' | 'difficulty' | 'type'>('order');
    const [filterStatus, setFilterStatus] = useState<string>('all');

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

    const handleEdit = (milestone: any) => {
        // Handle milestone edit
        console.log('Edit milestone:', milestone.id);
        onMilestoneUpdate();
    };

    const handleDelete = (milestone: any) => {
        if (confirm(`Are you sure you want to delete "${milestone.title}"?`)) {
            // Handle milestone delete
            console.log('Delete milestone:', milestone.id);
            onMilestoneUpdate();
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
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/20"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Milestone
                        </Button>
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
                                                        onClick={() => handleDelete(milestone)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete Milestone
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
    );
};