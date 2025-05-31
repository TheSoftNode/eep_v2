
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Project, ProjectMember, ProjectArea } from '@/Redux/types/Projects';
import {
    Layout,
    Plus,
    ChevronDown,
    ChevronRight,
    CheckSquare,
    List,
    Target,
    Settings,
    User,
    Calendar,
    BarChart3,
    Zap,
    AlertCircle,
    CheckCircle,
    Play,
    Square,
    RefreshCw,
    FileText,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    useRecalculateAreaProgressMutation,
    useUpdateProjectAreaMutation,
    useDeleteProjectAreaMutation
} from '@/Redux/apiSlices/Projects/projectAreaApiSlice';
import { useGetProjectMembersQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import AddTaskModal from '../../Tasks/AddTaskModal';
import { firebaseFormatDate, getDaysStatus } from '@/components/utils/dateUtils';
import { useGetTasksQuery } from '@/Redux/apiSlices/tasks/tasksApiSlice';
import ProjectTasks from '../../Tasks/ProjectTasks';
import EditAreaDialog from './EditAreaDialog'; // Import the separate component
import ProjectAreaCard from './ProjectAreaCard';

interface ProjectAreaSectionProps {
    project: Project;
    projectAreas: ProjectArea[];
    canManage?: boolean;
    className?: string;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'planned':
            return {
                label: 'Planned',
                color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                icon: Square,
                dotColor: 'bg-slate-500'
            };
        case 'in-progress':
            return {
                label: 'In Progress',
                color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
                icon: Play,
                dotColor: 'bg-blue-500'
            };
        case 'completed':
            return {
                label: 'Completed',
                color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
                icon: CheckCircle,
                dotColor: 'bg-emerald-500'
            };
        case 'blocked':
            return {
                label: 'Blocked',
                color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50',
                icon: AlertCircle,
                dotColor: 'bg-red-500'
            };
        default:
            return {
                label: 'Unknown',
                color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
                icon: Square,
                dotColor: 'bg-slate-500'
            };
    }
};

const getProgressColor = (progress: number) => {
    if (progress >= 80) return '[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600';
    if (progress >= 60) return '[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-600';
    if (progress >= 40) return '[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-yellow-600';
    if (progress >= 20) return '[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-orange-600';
    return '[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600';
};

const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (progress >= 60) return 'text-blue-600 dark:text-blue-400';
    if (progress >= 40) return 'text-yellow-600 dark:text-yellow-400';
    if (progress >= 20) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
};



export default function ProjectAreaSection({
    project,
    projectAreas,
    canManage = false,
    className
}: ProjectAreaSectionProps) {
    const { toast } = useToast();
    const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
    const [expandedAreaTasks, setExpandedAreaTasks] = useState<Record<string, boolean>>({});
    const [selectedArea, setSelectedArea] = useState<ProjectArea | null>(null);
    const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [progressValue, setProgressValue] = useState<number>(0);

    const [updateProjectArea, { isLoading: isUpdating }] = useUpdateProjectAreaMutation();
    const [deleteProjectArea, { isLoading: isDeleting }] = useDeleteProjectAreaMutation();
    const [recalculateProgress, { isLoading: isRecalculating }] = useRecalculateAreaProgressMutation();

    // Fetch project members using the normalized API
    const { data: membersResponse } = useGetProjectMembersQuery(project.id);
    const projectMembers = membersResponse?.data || [];

    // Handle area expansion toggle
    const toggleAreaExpanded = (areaId: string) => {
        setExpandedAreas(prev => ({
            ...prev,
            [areaId]: !prev[areaId]
        }));
    };

    // Handle area tasks expansion toggle
    const toggleAreaTasks = (areaId: string) => {
        setExpandedAreaTasks(prev => ({
            ...prev,
            [areaId]: !prev[areaId]
        }));
    };

    // Handle progress update dialog
    const handleOpenProgressDialog = (area: ProjectArea) => {
        setSelectedArea(area);
        setProgressValue(area.progress);
        setIsProgressDialogOpen(true);
    };

    // Handle edit dialog
    const handleOpenEditDialog = (area: ProjectArea) => {
        setSelectedArea(area);
        setIsEditDialogOpen(true);
    };

    // Handle delete dialog
    const handleOpenDeleteDialog = (area: ProjectArea) => {
        setSelectedArea(area);
        setIsDeleteDialogOpen(true);
    };

    const handleProgressUpdate = async () => {
        if (!selectedArea) return;

        try {
            await updateProjectArea({
                projectId: project.id,
                areaId: selectedArea.id,
                progress: progressValue
            }).unwrap();

            toast({
                title: "Progress Updated",
                description: `${selectedArea.name} progress updated to ${progressValue}%`,
            });

            setIsProgressDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Failed to Update Progress",
                description: error?.data?.message || "An error occurred while updating progress.",
                variant: "destructive",
            });
        }
    };

    // Handle area update
    const handleAreaUpdate = async (formData: any) => {
        if (!selectedArea) return;

        try {
            await updateProjectArea({
                projectId: project.id,
                areaId: selectedArea.id,
                ...formData
            }).unwrap();

            toast({
                title: "Area Updated",
                description: `${formData.name} has been updated successfully.`,
            });

            setIsEditDialogOpen(false);
            setSelectedArea(null);
        } catch (error: any) {
            toast({
                title: "Failed to Update Area",
                description: error?.data?.message || "An error occurred while updating the area.",
                variant: "destructive",
            });
        }
    };

    // Handle area deletion
    const handleAreaDelete = async () => {
        if (!selectedArea) return;

        try {
            await deleteProjectArea({
                projectId: project.id,
                areaId: selectedArea.id
            }).unwrap();

            toast({
                title: "Area Deleted",
                description: `${selectedArea.name} has been deleted successfully.`,
            });

            setIsDeleteDialogOpen(false);
            setSelectedArea(null);
        } catch (error: any) {
            toast({
                title: "Failed to Delete Area",
                description: error?.data?.message || "An error occurred while deleting the area.",
                variant: "destructive",
            });
        }
    };

    // Handle recalculate progress
    const handleRecalculateProgress = async (area: ProjectArea) => {
        try {
            await recalculateProgress({
                projectId: project.id,
                areaId: area.id
            }).unwrap();

            toast({
                title: "Progress Recalculated",
                description: `${area.name} progress has been recalculated based on task completion.`,
            });
        } catch (error: any) {
            toast({
                title: "Failed to Recalculate Progress",
                description: error?.data?.message || "An error occurred while recalculating progress.",
                variant: "destructive",
            });
        }
    };

    // Handle add task to area
    const handleAddTaskToArea = (area: ProjectArea) => {
        setSelectedArea(area);
        setIsAddTaskModalOpen(true);
    };

    const handleTaskCreated = () => {
        setIsAddTaskModalOpen(false);
        setSelectedArea(null);
        toast({
            title: "Task Created",
            description: "Task has been added to the project area successfully.",
        });
    };

    const toggleAllAreas = () => {
        const allExpanded = projectAreas.length > 0 && projectAreas.every(area => expandedAreas[area.id]);
        const newState: Record<string, boolean> = {};

        projectAreas.forEach(area => {
            newState[area.id] = !allExpanded;
        });

        setExpandedAreas(newState);
    };

    const allExpanded = projectAreas.length > 0 && projectAreas.every(area => expandedAreas[area.id]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={className}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-sm relative overflow-hidden">
                    {/* Gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/5 to-indigo-500/5 blur-2xl -mr-12 -mt-12 pointer-events-none" />

                    <CardHeader className="pb-4 relative">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
                                    <Layout className="h-4 w-4" />
                                </div>
                                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    Project Areas
                                </span>
                            </CardTitle>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-medium border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400">
                                    {projectAreas.length} {projectAreas.length === 1 ? 'area' : 'areas'}
                                </Badge>

                                {projectAreas.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={toggleAllAreas}
                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                                    >
                                        {allExpanded ? 'Collapse All' : 'Expand All'}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Organize work into focused areas with dedicated tasks and progress tracking
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4 relative">
                        {projectAreas.length === 0 ? (
                            <div className="text-center py-12">
                                <Layout className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                    No Project Areas
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                                    Project areas help organize work into logical sections like Frontend, Backend, Testing, etc.
                                </p>
                                {canManage && (
                                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create First Area
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {projectAreas.map((area, index) => (
                                        <ProjectAreaCard
                                            key={area.id}
                                            area={area}
                                            project={project}
                                            projectMembers={projectMembers}
                                            projectAreas={projectAreas}
                                            isExpanded={expandedAreas[area.id] || false}
                                            isTasksExpanded={expandedAreaTasks[area.id] || false}
                                            onToggleExpanded={() => toggleAreaExpanded(area.id)}
                                            onToggleTasks={() => toggleAreaTasks(area.id)}
                                            onUpdateProgress={() => handleOpenProgressDialog(area)}
                                            onRecalculateProgress={() => handleRecalculateProgress(area)}
                                            onAddTask={() => handleAddTaskToArea(area)}
                                            onEditArea={() => handleOpenEditDialog(area)}
                                            onDeleteArea={() => handleOpenDeleteDialog(area)}
                                            canManage={canManage}
                                            isRecalculating={isRecalculating}
                                            index={index}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Progress Update Dialog */}
            {selectedArea && (
                <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                                    <BarChart3 className="h-4 w-4" />
                                </div>
                                Update Area Progress
                            </DialogTitle>
                            <DialogDescription>
                                Manually update progress for <span className="font-semibold text-purple-600">{selectedArea.name}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="progress" className="text-sm font-medium">
                                        Progress
                                    </Label>
                                    <span className={cn("text-sm font-bold", getProgressTextColor(progressValue))}>
                                        {progressValue}%
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        id="progress"
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={progressValue}
                                        onChange={(e) => setProgressValue(parseInt(e.target.value))}
                                        className="w-full"
                                    />

                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>
                                </div>

                                <Progress
                                    value={progressValue}
                                    className={cn("h-3", getProgressColor(progressValue))}
                                />
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    <strong>Current:</strong> {selectedArea.progress}% •
                                    <strong> New:</strong> {progressValue}% •
                                    <strong> Change:</strong> {progressValue > selectedArea.progress ? '+' : ''}{progressValue - selectedArea.progress}%
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsProgressDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleProgressUpdate}
                                disabled={progressValue === selectedArea.progress || isUpdating}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            >
                                {isUpdating ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Update Progress
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit Area Dialog */}
            <EditAreaDialog
                area={selectedArea}
                open={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setSelectedArea(null);
                }}
                onSave={handleAreaUpdate}
                isLoading={isUpdating}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="h-5 w-5" />
                            Delete Project Area
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete "{selectedArea?.name}"? This action cannot be undone and will permanently remove:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>The project area and all its settings</li>
                                <li>All tasks within this area</li>
                                <li>All progress and activity history</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} className="border-slate-300 dark:border-slate-600">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleAreaDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Area
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Unified Add Task Modal */}
            {selectedArea && (
                <AddTaskModal
                    projectId={project.id}
                    projectAreaId={selectedArea.id}
                    open={isAddTaskModalOpen}
                    onClose={() => {
                        setIsAddTaskModalOpen(false);
                        setSelectedArea(null);
                    }}
                    onSuccess={handleTaskCreated}
                    members={projectMembers}
                    projectAreas={projectAreas}
                />
            )}
        </>
    );
}





// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle
// } from '@/components/ui/card';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { Project, ProjectMember, ProjectArea } from '@/Redux/types/Projects';
// import {
//     Layout,
//     Plus,
//     ChevronDown,
//     ChevronRight,
//     CheckSquare,
//     List,
//     Target,
//     Settings,
//     User,
//     Calendar,
//     BarChart3,
//     Zap,
//     AlertCircle,
//     CheckCircle,
//     Play,
//     Square,
//     RefreshCw,
//     FileText,
//     Eye
// } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { useRecalculateAreaProgressMutation, useUpdateProjectAreaMutation } from '@/Redux/apiSlices/Projects/projectAreaApiSlice';
// import { useGetProjectMembersQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
// import AddTaskModal from '../../Tasks/AddTaskModal';
// import { firebaseFormatDate, getDaysStatus } from '@/components/utils/dateUtils';
// import { useGetTasksQuery } from '@/Redux/apiSlices/tasks/tasksApiSlice';
// import ProjectTasks from '../../Tasks/ProjectTasks';


// interface ProjectAreaSectionProps {
//     project: Project;
//     projectAreas: ProjectArea[];
//     canManage?: boolean;
//     className?: string;
// }

// const getStatusConfig = (status: string) => {
//     switch (status) {
//         case 'planned':
//             return {
//                 label: 'Planned',
//                 color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
//                 icon: Square,
//                 dotColor: 'bg-slate-500'
//             };
//         case 'in-progress':
//             return {
//                 label: 'In Progress',
//                 color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
//                 icon: Play,
//                 dotColor: 'bg-blue-500'
//             };
//         case 'completed':
//             return {
//                 label: 'Completed',
//                 color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
//                 icon: CheckCircle,
//                 dotColor: 'bg-emerald-500'
//             };
//         case 'blocked':
//             return {
//                 label: 'Blocked',
//                 color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50',
//                 icon: AlertCircle,
//                 dotColor: 'bg-red-500'
//             };
//         default:
//             return {
//                 label: 'Unknown',
//                 color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
//                 icon: Square,
//                 dotColor: 'bg-slate-500'
//             };
//     }
// };

// const getProgressColor = (progress: number) => {
//     if (progress >= 80) return '[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600';
//     if (progress >= 60) return '[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-600';
//     if (progress >= 40) return '[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-yellow-600';
//     if (progress >= 20) return '[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-orange-600';
//     return '[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600';
// };

// const getProgressTextColor = (progress: number) => {
//     if (progress >= 80) return 'text-emerald-600 dark:text-emerald-400';
//     if (progress >= 60) return 'text-blue-600 dark:text-blue-400';
//     if (progress >= 40) return 'text-yellow-600 dark:text-yellow-400';
//     if (progress >= 20) return 'text-orange-600 dark:text-orange-400';
//     return 'text-red-600 dark:text-red-400';
// };

// export default function ProjectAreaSection({
//     project,
//     projectAreas,
//     canManage = false,
//     className
// }: ProjectAreaSectionProps) {
//     const { toast } = useToast();
//     const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
//     const [expandedAreaTasks, setExpandedAreaTasks] = useState<Record<string, boolean>>({});
//     const [selectedArea, setSelectedArea] = useState<ProjectArea | null>(null);
//     const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
//     const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
//     const [progressValue, setProgressValue] = useState<number>(0);

//     const [updateProjectArea, { isLoading: isUpdating }] = useUpdateProjectAreaMutation();
//     const [recalculateProgress, { isLoading: isRecalculating }] = useRecalculateAreaProgressMutation();

//     // Fetch project members using the normalized API
//     const { data: membersResponse } = useGetProjectMembersQuery(project.id);
//     const projectMembers = membersResponse?.data || [];

//     // Handle area expansion toggle
//     const toggleAreaExpanded = (areaId: string) => {
//         setExpandedAreas(prev => ({
//             ...prev,
//             [areaId]: !prev[areaId]
//         }));
//     };

//     // Handle area tasks expansion toggle
//     const toggleAreaTasks = (areaId: string) => {
//         setExpandedAreaTasks(prev => ({
//             ...prev,
//             [areaId]: !prev[areaId]
//         }));
//     };

//     // Handle progress update dialog
//     const handleOpenProgressDialog = (area: ProjectArea) => {
//         setSelectedArea(area);
//         setProgressValue(area.progress);
//         setIsProgressDialogOpen(true);
//     };

//     const handleProgressUpdate = async () => {
//         if (!selectedArea) return;

//         try {
//             await updateProjectArea({
//                 projectId: project.id,
//                 areaId: selectedArea.id,
//                 progress: progressValue
//             }).unwrap();

//             toast({
//                 title: "Progress Updated",
//                 description: `${selectedArea.name} progress updated to ${progressValue}%`,
//             });

//             setIsProgressDialogOpen(false);
//         } catch (error: any) {
//             toast({
//                 title: "Failed to Update Progress",
//                 description: error?.data?.message || "An error occurred while updating progress.",
//                 variant: "destructive",
//             });
//         }
//     };

//     // Handle recalculate progress
//     const handleRecalculateProgress = async (area: ProjectArea) => {
//         try {
//             await recalculateProgress({
//                 projectId: project.id,
//                 areaId: area.id
//             }).unwrap();

//             toast({
//                 title: "Progress Recalculated",
//                 description: `${area.name} progress has been recalculated based on task completion.`,
//             });
//         } catch (error: any) {
//             toast({
//                 title: "Failed to Recalculate Progress",
//                 description: error?.data?.message || "An error occurred while recalculating progress.",
//                 variant: "destructive",
//             });
//         }
//     };

//     // Handle add task to area
//     const handleAddTaskToArea = (area: ProjectArea) => {
//         setSelectedArea(area);
//         setIsAddTaskModalOpen(true);
//     };

//     const handleTaskCreated = () => {
//         setIsAddTaskModalOpen(false);
//         setSelectedArea(null);
//         toast({
//             title: "Task Created",
//             description: "Task has been added to the project area successfully.",
//         });
//     };

//     const toggleAllAreas = () => {
//         const allExpanded = projectAreas.length > 0 && projectAreas.every(area => expandedAreas[area.id]);
//         const newState: Record<string, boolean> = {};

//         projectAreas.forEach(area => {
//             newState[area.id] = !allExpanded;
//         });

//         setExpandedAreas(newState);
//     };

//     const allExpanded = projectAreas.length > 0 && projectAreas.every(area => expandedAreas[area.id]);

//     return (
//         <>
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={className}
//             >
//                 <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-sm relative overflow-hidden">
//                     {/* Gradient accent */}
//                     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />

//                     {/* Background decoration */}
//                     <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/5 to-indigo-500/5 blur-2xl -mr-12 -mt-12 pointer-events-none" />

//                     <CardHeader className="pb-4 relative">
//                         <div className="flex items-center justify-between">
//                             <CardTitle className="flex items-center gap-2">
//                                 <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
//                                     <Layout className="h-4 w-4" />
//                                 </div>
//                                 <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                                     Project Areas
//                                 </span>
//                             </CardTitle>

//                             <div className="flex items-center gap-2">
//                                 <Badge variant="outline" className="text-xs font-medium border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400">
//                                     {projectAreas.length} {projectAreas.length === 1 ? 'area' : 'areas'}
//                                 </Badge>

//                                 {projectAreas.length > 0 && (
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={toggleAllAreas}
//                                         className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
//                                     >
//                                         {allExpanded ? 'Collapse All' : 'Expand All'}
//                                     </Button>
//                                 )}
//                             </div>
//                         </div>
//                         <p className="text-sm text-slate-600 dark:text-slate-400">
//                             Organize work into focused areas with dedicated tasks and progress tracking
//                         </p>
//                     </CardHeader>

//                     <CardContent className="space-y-4 relative">
//                         {projectAreas.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <Layout className="h-16 w-16 mx-auto mb-4 text-slate-400" />
//                                 <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
//                                     No Project Areas
//                                 </h3>
//                                 <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
//                                     Project areas help organize work into logical sections like Frontend, Backend, Testing, etc.
//                                 </p>
//                                 {canManage && (
//                                     <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Create First Area
//                                     </Button>
//                                 )}
//                             </div>
//                         ) : (
//                             <div className="space-y-3">
//                                 <AnimatePresence>
//                                     {projectAreas.map((area, index) => (
//                                         <ProjectAreaCard
//                                             key={area.id}
//                                             area={area}
//                                             project={project}
//                                             projectMembers={projectMembers}
//                                             projectAreas={projectAreas}
//                                             isExpanded={expandedAreas[area.id] || false}
//                                             isTasksExpanded={expandedAreaTasks[area.id] || false}
//                                             onToggleExpanded={() => toggleAreaExpanded(area.id)}
//                                             onToggleTasks={() => toggleAreaTasks(area.id)}
//                                             onUpdateProgress={() => handleOpenProgressDialog(area)}
//                                             onRecalculateProgress={() => handleRecalculateProgress(area)}
//                                             onAddTask={() => handleAddTaskToArea(area)}
//                                             canManage={canManage}
//                                             isRecalculating={isRecalculating}
//                                             index={index}
//                                         />
//                                     ))}
//                                 </AnimatePresence>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </motion.div>

//             {/* Progress Update Dialog */}
//             {selectedArea && (
//                 <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
//                     <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                         <DialogHeader>
//                             <DialogTitle className="flex items-center gap-2">
//                                 <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
//                                     <BarChart3 className="h-4 w-4" />
//                                 </div>
//                                 Update Area Progress
//                             </DialogTitle>
//                             <DialogDescription>
//                                 Manually update progress for <span className="font-semibold text-purple-600">{selectedArea.name}</span>
//                             </DialogDescription>
//                         </DialogHeader>

//                         <div className="py-6 space-y-4">
//                             <div className="space-y-3">
//                                 <div className="flex justify-between items-center">
//                                     <Label htmlFor="progress" className="text-sm font-medium">
//                                         Progress
//                                     </Label>
//                                     <span className={cn("text-sm font-bold", getProgressTextColor(progressValue))}>
//                                         {progressValue}%
//                                     </span>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Input
//                                         id="progress"
//                                         type="range"
//                                         min="0"
//                                         max="100"
//                                         step="5"
//                                         value={progressValue}
//                                         onChange={(e) => setProgressValue(parseInt(e.target.value))}
//                                         className="w-full"
//                                     />

//                                     <div className="flex justify-between text-xs text-slate-500">
//                                         <span>0%</span>
//                                         <span>25%</span>
//                                         <span>50%</span>
//                                         <span>75%</span>
//                                         <span>100%</span>
//                                     </div>
//                                 </div>

//                                 <Progress
//                                     value={progressValue}
//                                     className={cn("h-3", getProgressColor(progressValue))}
//                                 />
//                             </div>

//                             <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
//                                 <p className="text-xs text-slate-600 dark:text-slate-400">
//                                     <strong>Current:</strong> {selectedArea.progress}% •
//                                     <strong> New:</strong> {progressValue}% •
//                                     <strong> Change:</strong> {progressValue > selectedArea.progress ? '+' : ''}{progressValue - selectedArea.progress}%
//                                 </p>
//                             </div>
//                         </div>

//                         <DialogFooter>
//                             <Button variant="outline" onClick={() => setIsProgressDialogOpen(false)}>
//                                 Cancel
//                             </Button>
//                             <Button
//                                 onClick={handleProgressUpdate}
//                                 disabled={progressValue === selectedArea.progress || isUpdating}
//                                 className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
//                             >
//                                 {isUpdating ? (
//                                     <>
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Updating...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <CheckCircle className="h-4 w-4 mr-2" />
//                                         Update Progress
//                                     </>
//                                 )}
//                             </Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             )}

//             {/* Unified Add Task Modal */}
//             {selectedArea && (
//                 <AddTaskModal
//                     projectId={project.id}
//                     projectAreaId={selectedArea.id}
//                     open={isAddTaskModalOpen}
//                     onClose={() => {
//                         setIsAddTaskModalOpen(false);
//                         setSelectedArea(null);
//                     }}
//                     onSuccess={handleTaskCreated}
//                     members={projectMembers}
//                     projectAreas={projectAreas}
//                 />
//             )}
//         </>
//     );
// }

// // Individual Project Area Card Component
// interface ProjectAreaCardProps {
//     area: ProjectArea;
//     project: Project;
//     projectMembers: ProjectMember[];
//     projectAreas: ProjectArea[];
//     isExpanded: boolean;
//     isTasksExpanded: boolean;
//     onToggleExpanded: () => void;
//     onToggleTasks: () => void;
//     onUpdateProgress: () => void;
//     onRecalculateProgress: () => void;
//     onAddTask: () => void;
//     canManage: boolean;
//     isRecalculating: boolean;
//     index: number;
// }

// function ProjectAreaCard({
//     area,
//     project,
//     projectMembers,
//     projectAreas,
//     isExpanded,
//     isTasksExpanded,
//     onToggleExpanded,
//     onToggleTasks,
//     onUpdateProgress,
//     onRecalculateProgress,
//     onAddTask,
//     canManage,
//     isRecalculating,
//     index
// }: ProjectAreaCardProps) {
//     const statusConfig = getStatusConfig(area.status);
//     const StatusIcon = statusConfig.icon;
//     const daysStatus = getDaysStatus(area.endDate);

//     // Fetch tasks for this area for summary (when expanded)
//     const { data: tasksResponse, isLoading: isLoadingTasks } = useGetTasksQuery({
//         projectId: project.id,
//         projectAreaId: area.id,
//         limit: 50
//     }, {
//         skip: !isExpanded
//     });

//     const tasks = tasksResponse?.data || [];
//     const completedTasks = tasks.filter(task => task.status === 'completed').length;

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="group"
//         >
//             <Card className="border border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200 overflow-hidden">
//                 {/* Area Header */}
//                 <div
//                     className="p-4 cursor-pointer hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/50 dark:hover:to-transparent transition-all duration-200"
//                     onClick={onToggleExpanded}
//                 >
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3 flex-1 min-w-0">
//                             <div className="flex items-center gap-2">
//                                 {isExpanded ? (
//                                     <ChevronDown className="h-4 w-4 text-slate-500 transition-transform" />
//                                 ) : (
//                                     <ChevronRight className="h-4 w-4 text-slate-500 transition-transform" />
//                                 )}
//                                 <div className={cn(
//                                     "flex items-center justify-center h-8 w-8 rounded-lg shadow-sm",
//                                     statusConfig.color.includes('bg-slate') ? 'bg-slate-100 dark:bg-slate-800' :
//                                         statusConfig.color.includes('bg-blue') ? 'bg-blue-100 dark:bg-blue-900/30' :
//                                             statusConfig.color.includes('bg-emerald') ? 'bg-emerald-100 dark:bg-emerald-900/30' :
//                                                 'bg-red-100 dark:bg-red-900/30'
//                                 )}>
//                                     <StatusIcon className={cn("h-4 w-4",
//                                         statusConfig.color.includes('text-slate') ? 'text-slate-600 dark:text-slate-400' :
//                                             statusConfig.color.includes('text-blue') ? 'text-blue-600 dark:text-blue-400' :
//                                                 statusConfig.color.includes('text-emerald') ? 'text-emerald-600 dark:text-emerald-400' :
//                                                     'text-red-600 dark:text-red-400'
//                                     )} />
//                                 </div>
//                             </div>

//                             <div className="flex-1 min-w-0">
//                                 <div className="flex items-center gap-2 mb-1">
//                                     <h4 className="font-semibold text-slate-900 dark:text-white truncate">
//                                         {area.name}
//                                     </h4>
//                                     <Badge className={cn("text-xs font-medium border", statusConfig.color)}>
//                                         <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", statusConfig.dotColor)}></div>
//                                         {statusConfig.label}
//                                     </Badge>
//                                 </div>

//                                 {area.description && (
//                                     <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
//                                         {area.description}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3 ml-4">
//                             {/* Progress Badge */}
//                             <div className="text-right">
//                                 <div className={cn("text-lg font-bold", getProgressTextColor(area.progress))}>
//                                     {area.progress}%
//                                 </div>
//                                 {area.taskCount !== undefined && area.taskCount > 0 && (
//                                     <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
//                                         <CheckSquare className="h-3 w-3" />
//                                         <span>{area.completedTaskCount || 0}/{area.taskCount}</span>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Quick Actions */}
//                             {canManage && (
//                                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             onRecalculateProgress();
//                                         }}
//                                         disabled={isRecalculating}
//                                         className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                     >
//                                         <RefreshCw className={cn("h-4 w-4 text-blue-600", isRecalculating && "animate-spin")} />
//                                     </Button>

//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             onUpdateProgress();
//                                         }}
//                                         className="h-8 w-8 hover:bg-purple-50 dark:hover:bg-purple-900/20"
//                                     >
//                                         <Settings className="h-4 w-4 text-purple-600" />
//                                     </Button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Progress Bar */}
//                     <div className="mt-3">
//                         <Progress
//                             value={area.progress}
//                             className={cn("h-2", getProgressColor(area.progress))}
//                         />
//                     </div>
//                 </div>

//                 {/* Expanded Content */}
//                 <AnimatePresence>
//                     {isExpanded && (
//                         <motion.div
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: "auto", opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="overflow-hidden"
//                         >
//                             <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 dark:to-transparent">
//                                 <div className="pt-4 space-y-4">
//                                     {/* Area Details */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {/* Left Column */}
//                                         <div className="space-y-3">
//                                             {area.learningFocus && area.learningFocus.length > 0 && (
//                                                 <div>
//                                                     <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
//                                                         <Target className="h-3 w-3" />
//                                                         Learning Focus
//                                                     </h5>
//                                                     <div className="flex flex-wrap gap-1">
//                                                         {area.learningFocus.map((focus, i) => (
//                                                             <Badge key={i} variant="secondary" className="text-xs py-0 h-5 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
//                                                                 {focus}
//                                                             </Badge>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             {area.technologies && area.technologies.length > 0 && (
//                                                 <div>
//                                                     <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
//                                                         <Zap className="h-3 w-3" />
//                                                         Technologies
//                                                     </h5>
//                                                     <div className="flex flex-wrap gap-1">
//                                                         {area.technologies.map((tech, i) => (
//                                                             <Badge key={i} variant="secondary" className="text-xs py-0 h-5 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
//                                                                 {tech}
//                                                             </Badge>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Right Column */}
//                                         <div className="space-y-3">
//                                             {(area.startDate || area.endDate) && (
//                                                 <div>
//                                                     <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
//                                                         <Calendar className="h-3 w-3" />
//                                                         Timeline
//                                                     </h5>
//                                                     <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
//                                                         {area.startDate && (
//                                                             <div>Start: {firebaseFormatDate(area.startDate)}</div>
//                                                         )}
//                                                         {area.endDate && (
//                                                             <div className="flex items-center gap-2">
//                                                                 <span>End: {firebaseFormatDate(area.endDate)}</span>
//                                                                 {!daysStatus.isOverdue && area.status !== 'completed' && (
//                                                                     <Badge variant="outline" className="text-xs">
//                                                                         {daysStatus.text}
//                                                                     </Badge>
//                                                                 )}
//                                                                 {daysStatus.isOverdue && area.status !== 'completed' && (
//                                                                     <Badge variant="outline" className="text-xs text-red-600 border-red-300">
//                                                                         {daysStatus.text}
//                                                                     </Badge>
//                                                                 )}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             {area.assignedMentorId && (
//                                                 <div>
//                                                     <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
//                                                         <User className="h-3 w-3" />
//                                                         Assigned Mentor
//                                                     </h5>
//                                                     <Badge variant="outline" className="text-xs">
//                                                         Mentor Assigned
//                                                     </Badge>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Tasks Summary */}
//                                     {isLoadingTasks ? (
//                                         <div className="flex items-center justify-center py-4">
//                                             <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
//                                         </div>
//                                     ) : tasks.length > 0 ? (
//                                         <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
//                                             <div className="flex items-center justify-between mb-3">
//                                                 <h5 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
//                                                     <List className="h-4 w-4 text-purple-600" />
//                                                     Tasks in this Area
//                                                 </h5>
//                                                 <Badge variant="outline" className="text-xs">
//                                                     {completedTasks}/{tasks.length} completed
//                                                 </Badge>
//                                             </div>

//                                             <div className="space-y-2">
//                                                 {tasks.slice(0, 3).map((task) => (
//                                                     <div key={task.id} className="flex items-center gap-2 text-sm">
//                                                         <div className={cn(
//                                                             "w-2 h-2 rounded-full",
//                                                             task.status === 'completed' ? 'bg-emerald-500' :
//                                                                 task.status === 'in-progress' ? 'bg-blue-500' :
//                                                                     task.status === 'blocked' ? 'bg-red-500' :
//                                                                         'bg-slate-400'
//                                                         )} />
//                                                         <span className={cn(
//                                                             "flex-1 truncate",
//                                                             task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'
//                                                         )}>
//                                                             {task.title}
//                                                         </span>
//                                                         <Badge variant="secondary" className="text-xs py-0 h-4">
//                                                             {task.status.replace('-', ' ')}
//                                                         </Badge>
//                                                     </div>
//                                                 ))}

//                                                 {tasks.length > 3 && (
//                                                     <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200 dark:border-slate-700">
//                                                         +{tasks.length - 3} more tasks
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* View All Tasks Button */}
//                                             <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         onToggleTasks();
//                                                     }}
//                                                     className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
//                                                 >
//                                                     <Eye className="h-4 w-4 mr-2" />
//                                                     {isTasksExpanded ? 'Hide Tasks' : 'View All Tasks'}
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
//                                             <CheckSquare className="h-8 w-8 mx-auto mb-2 text-slate-400" />
//                                             <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
//                                                 No tasks in this area yet
//                                             </p>
//                                             {canManage && (
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         onAddTask();
//                                                     }}
//                                                     className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
//                                                 >
//                                                     <Plus className="h-4 w-4 mr-2" />
//                                                     Add First Task
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     )}

//                                     {/* Action Buttons */}
//                                     {canManage && (
//                                         <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     onAddTask();
//                                                 }}
//                                                 className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
//                                             >
//                                                 <Plus className="h-4 w-4 mr-2" />
//                                                 Add Task
//                                             </Button>

//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
//                                             >
//                                                 <Settings className="h-4 w-4 mr-2" />
//                                                 Edit Area
//                                             </Button>
//                                         </div>
//                                     )}

//                                     {/* Full Task List - Using the Unified ProjectTasks Component */}
//                                     <AnimatePresence>
//                                         {isTasksExpanded && (
//                                             <motion.div
//                                                 initial={{ height: 0, opacity: 0 }}
//                                                 animate={{ height: "auto", opacity: 1 }}
//                                                 exit={{ height: 0, opacity: 0 }}
//                                                 transition={{ duration: 0.3 }}
//                                                 className="overflow-hidden mt-4"
//                                             >
//                                                 <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
//                                                     <div className="flex items-center justify-between mb-4">
//                                                         <h5 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
//                                                             <FileText className="h-4 w-4 text-indigo-600" />
//                                                             {area.name} Tasks
//                                                         </h5>
//                                                         <Button
//                                                             variant="ghost"
//                                                             size="sm"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 onToggleTasks();
//                                                             }}
//                                                             className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
//                                                         >
//                                                             <ChevronDown className="h-4 w-4" />
//                                                         </Button>
//                                                     </div>

//                                                     {/* Use the Unified ProjectTasks Component */}
//                                                     <ProjectTasks
//                                                         project={project}
//                                                         projectArea={area}
//                                                         projectAreas={projectAreas}
//                                                         canManage={canManage}
//                                                         className="bg-transparent"
//                                                     />
//                                                 </div>
//                                             </motion.div>
//                                         )}
//                                     </AnimatePresence>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </Card>
//         </motion.div>
//     );
// }