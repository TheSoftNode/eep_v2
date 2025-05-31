"use client"

import { useState, useEffect } from 'react';
import {
    CheckCircle2,
    CircleDashed,
    MessageSquare,
    Save,
    Plus,
    Edit,
    Trash,
    Calendar,
    Target,
    AlertCircle,
    TrendingUp,
    Clock,
    BookOpen,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface Challenge {
    id: string;
    title: string;
    status: 'not_started' | 'in_progress' | 'completed';
}

interface WorkspaceProgress {
    id: string;
    workspaceId: string;
    userId: string;
    week: number;
    tasks: Task[];
    challenges: Challenge[];
    notes: string;
    mentorFeedback?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface WorkspaceProgressComponentProps {
    workspaceId: string;
    userId: string;
}

export default function WorkspaceProgressComponent({
    workspaceId,
    userId
}: WorkspaceProgressComponentProps) {
    const [selectedWeek, setSelectedWeek] = useState<string>("1");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Mock data - In real implementation, fetch from API
    const progressData: WorkspaceProgress = {
        id: '1',
        workspaceId,
        userId,
        week: 1,
        tasks: [
            { id: 't1', title: 'Set up development environment', completed: true },
            { id: 't2', title: 'Review project requirements', completed: true },
            { id: 't3', title: 'Create initial wireframes', completed: true },
            { id: 't4', title: 'Set up API endpoints', completed: false },
            { id: 't5', title: 'Implement user authentication', completed: false }
        ],
        challenges: [
            { id: 'c1', title: 'Understanding the authentication flow', status: 'completed' },
            { id: 'c2', title: 'Setting up the development environment', status: 'completed' },
            { id: 'c3', title: 'Implementing the API schema', status: 'in_progress' }
        ],
        notes: "This week I focused on understanding the project requirements and setting up the initial development environment. I started working on the API endpoints but encountered some challenges with the authentication flow.",
        mentorFeedback: "Great progress on the initial setup! For the authentication flow, consider using JWT tokens instead of session-based auth for better scalability. Let me know if you need help with the API schema.",
        createdAt: new Date('2023-10-15'),
        updatedAt: new Date('2023-10-20')
    };

    // State for editing mode
    const [editData, setEditData] = useState({
        tasks: [...progressData.tasks],
        challenges: [...progressData.challenges],
        notes: progressData.notes,
        newTaskTitle: '',
        newChallengeTitle: ''
    });

    // Calculate progress statistics
    const completedTasks = editData.tasks.filter(task => task.completed).length;
    const totalTasks = editData.tasks.length;
    const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const completedChallenges = editData.challenges.filter(challenge => challenge.status === 'completed').length;
    const totalChallenges = editData.challenges.length;
    const challengeProgress = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

    // Toggle task completion
    const toggleTask = (taskId: string) => {
        if (!isEditing) return;

        setEditData({
            ...editData,
            tasks: editData.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        });
    };

    // Toggle challenge status
    const toggleChallengeStatus = (challengeId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => {
        if (!isEditing) return;

        setEditData({
            ...editData,
            challenges: editData.challenges.map(challenge =>
                challenge.id === challengeId ? { ...challenge, status: newStatus } : challenge
            )
        });
    };

    // Add new task
    const addTask = () => {
        if (!editData.newTaskTitle.trim()) return;

        const newTask = {
            id: `t${Date.now()}`,
            title: editData.newTaskTitle,
            completed: false
        };

        setEditData({
            ...editData,
            tasks: [...editData.tasks, newTask],
            newTaskTitle: ''
        });
    };

    // Remove task
    const removeTask = (taskId: string) => {
        setEditData({
            ...editData,
            tasks: editData.tasks.filter(task => task.id !== taskId)
        });
    };

    // Add new challenge
    const addChallenge = () => {
        if (!editData.newChallengeTitle.trim()) return;

        const newChallenge = {
            id: `c${Date.now()}`,
            title: editData.newChallengeTitle,
            status: 'not_started' as const
        };

        setEditData({
            ...editData,
            challenges: [...editData.challenges, newChallenge],
            newChallengeTitle: ''
        });
    };

    // Remove challenge
    const removeChallenge = (challengeId: string) => {
        setEditData({
            ...editData,
            challenges: editData.challenges.filter(challenge => challenge.id !== challengeId)
        });
    };

    // Save progress updates
    const saveProgressUpdates = async () => {
        setIsSaving(true);
        try {
            // In real implementation, call API to save updates
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            console.log('Saving progress updates:', editData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving progress:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const getChallengeStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700';
            case 'in_progress':
                return 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            default:
                return 'bg-slate-50 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 min-h-full">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <div className="rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Progress Tracking
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Track your weekly progress and overcome challenges
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                        <SelectTrigger className="w-full sm:w-48 border-slate-200 dark:border-slate-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Select week" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(week => (
                                <SelectItem key={week} value={week.toString()}>
                                    Week {week}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {isEditing ? (
                        <Button
                            onClick={saveProgressUpdates}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Updates
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            className="border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Update Progress
                        </Button>
                    )}
                </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">Task Progress</span>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {completedTasks}/{totalTasks}
                            </span>
                        </div>
                        <Progress value={taskProgress} className="h-2" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {Math.round(taskProgress)}% completed
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">Challenges</span>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {completedChallenges}/{totalChallenges}
                            </span>
                        </div>
                        <Progress value={challengeProgress} className="h-2" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {Math.round(challengeProgress)}% resolved
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Tasks Column */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {editData.tasks.map((task) => (
                                <div key={task.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                                    <div
                                        className={`mt-0.5 ${isEditing ? 'cursor-pointer' : ''}`}
                                        onClick={() => toggleTask(task.id)}
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                            <CircleDashed className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${task.completed
                                                ? 'line-through text-slate-500 dark:text-slate-400'
                                                : 'text-slate-900 dark:text-slate-100'
                                            }`}>
                                            {task.title}
                                        </p>
                                    </div>
                                    {isEditing && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                                            onClick={() => removeTask(task.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            {editData.tasks.length === 0 && (
                                <div className="text-center py-8">
                                    <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No tasks yet</p>
                                </div>
                            )}

                            {isEditing && (
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Input
                                        placeholder="Add a new task..."
                                        value={editData.newTaskTitle}
                                        onChange={(e) => setEditData({ ...editData, newTaskTitle: e.target.value })}
                                        className="text-sm border-slate-200 dark:border-slate-700"
                                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        onClick={addTask}
                                    >
                                        <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Challenges Column */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            Challenges
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {editData.challenges.map((challenge) => (
                                <div key={challenge.id} className="space-y-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors duration-150">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {challenge.title}
                                            </p>
                                        </div>
                                        {isEditing && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                                                onClick={() => removeChallenge(challenge.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div className="flex flex-wrap gap-2">
                                            {(['not_started', 'in_progress', 'completed'] as const).map(status => (
                                                <Badge
                                                    key={status}
                                                    variant={challenge.status === status ? 'default' : 'outline'}
                                                    className={`cursor-pointer text-xs ${challenge.status === status
                                                            ? getChallengeStatusColor(status)
                                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                                        }`}
                                                    onClick={() => toggleChallengeStatus(challenge.id, status)}
                                                >
                                                    {status === 'not_started' ? 'Not Started' :
                                                        status === 'in_progress' ? 'In Progress' : 'Completed'}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <Badge variant="outline" className={getChallengeStatusColor(challenge.status)}>
                                            {challenge.status === 'completed' ? 'Completed' :
                                                challenge.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                                        </Badge>
                                    )}
                                </div>
                            ))}

                            {editData.challenges.length === 0 && (
                                <div className="text-center py-8">
                                    <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No challenges yet</p>
                                </div>
                            )}

                            {isEditing && (
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Input
                                        placeholder="Add a new challenge..."
                                        value={editData.newChallengeTitle}
                                        onChange={(e) => setEditData({ ...editData, newChallengeTitle: e.target.value })}
                                        className="text-sm border-slate-200 dark:border-slate-700"
                                        onKeyDown={(e) => e.key === 'Enter' && addChallenge()}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                        onClick={addChallenge}
                                    >
                                        <Plus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes & Feedback Column */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            Notes & Feedback
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Your Notes</p>
                                </div>
                                {isEditing ? (
                                    <Textarea
                                        placeholder="Add your notes for this week..."
                                        value={editData.notes}
                                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                        className="resize-none border-slate-200 dark:border-slate-700 min-h-[120px]"
                                        rows={6}
                                    />
                                ) : (
                                    <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                                        {progressData.notes || (
                                            <span className="text-slate-400 dark:text-slate-500 italic">
                                                No notes added yet
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {progressData.mentorFeedback && (
                                <>
                                    <Separator className="bg-slate-200 dark:bg-slate-800" />
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                Mentor Feedback
                                            </p>
                                        </div>
                                        <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                                            <AlertDescription className="text-sm text-purple-800 dark:text-purple-300">
                                                {progressData.mentorFeedback}
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </>
                            )}

                            <div className="pt-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        Last updated: {progressData.updatedAt.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}