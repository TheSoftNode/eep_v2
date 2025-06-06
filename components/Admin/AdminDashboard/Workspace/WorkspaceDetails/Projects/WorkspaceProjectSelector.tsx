import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    FolderOpen,
    Plus,
    ChevronRight,
    Folder,
    Sparkles,
    Users,
    Calendar,
    Tag,
    Loader2,
    CheckCircle,
    X
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/Redux/types/Projects/project';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useGetProjectsQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { useAddProjectToWorkspaceMutation } from '@/Redux/apiSlices/workspaces/workspaceProjectApi';
import { firebaseFormatDate } from '@/components/utils/dateUtils';
import { ProjectSummary } from '@/Redux/types/Workspace/project-summary';

interface WorkspaceProjectSelectorProps {
    workspaceId: string;
    workspaceProjects: ProjectSummary[];
    canManageWorkspace: boolean;
    onProjectSelect: (projectId: string) => void;
    refetchWorkspace: () => void;
    minimal?: boolean;
    isAddProjectDialogOpen: boolean;
    onOpenAddProjectDialog: () => void;
    onCloseAddProjectDialog: () => void;
}

const WorkspaceProjectSelector: React.FC<WorkspaceProjectSelectorProps> = ({
    workspaceId,
    workspaceProjects = [],
    canManageWorkspace,
    onProjectSelect,
    refetchWorkspace,
    minimal = false,
    isAddProjectDialogOpen,
    onOpenAddProjectDialog,
    onCloseAddProjectDialog
}) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
    const { toast } = useToast();

    // RTK Query hooks
    const { data: projectsResponse, isLoading: isLoadingProjects } = useGetProjectsQuery({});
    const [addProject, { isLoading: isAddingProject }] = useAddProjectToWorkspaceMutation();

    // Filter out projects that are already in the workspace
    useEffect(() => {
        if (projectsResponse?.data) {
            const workspaceProjectIds = workspaceProjects.map(project => project.id);
            const filtered = projectsResponse.data.filter(
                project => !workspaceProjectIds.includes(project.id)
            );
            setAvailableProjects(filtered);
        }
    }, [projectsResponse, workspaceProjects]);

    // Set first project as selected when component mounts or projects change
    useEffect(() => {
        if (workspaceProjects.length > 0 && selectedProjectId === null && workspaceProjects.length === 1) {
            // Only auto-select if there's exactly one project and nothing is selected
            setSelectedProjectId(workspaceProjects[0].id);
            if (onProjectSelect) {
                onProjectSelect(workspaceProjects[0].id);
            }
        }
    }, [workspaceProjects, selectedProjectId, onProjectSelect]);

    const handleAddProject = async (projectId: string) => {
        try {
            // First add the project to the workspace
            const result = await addProject({
                workspaceId,
                projectId
            }).unwrap();

            // Get the added project data from the result or find it in available projects
            const addedProject = availableProjects.find(p => p.id === projectId);

            if (addedProject) {
                // Immediately set this as the active project if it's the first project in workspace
                if (workspaceProjects.length === 0) {
                    onProjectSelect(projectId);

                    toast({
                        title: "Project Added & Selected",
                        description: `${addedProject.name} has been added to the workspace and is now active`,
                        variant: "default"
                    });
                } else {
                    toast({
                        title: "Project Added",
                        description: `${addedProject.name} has been added to the workspace`,
                        variant: "default"
                    });
                }
            }

            onCloseAddProjectDialog();
            refetchWorkspace(); // This will refresh the workspace projects list
        } catch (error: any) {
            console.error("Error adding project:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to add project to workspace",
                variant: "destructive"
            });
        }
    };

    const handleProjectSelect = (projectId: string) => {
        if (projectId === '') {
            // Clear selection
            setSelectedProjectId(null);
            if (onProjectSelect) {
                onProjectSelect(''); // Signal to parent to clear
            }
            setIsDropdownOpen(false);
            return;
        }

        // Rest of existing logic for normal project selection
        setSelectedProjectId(projectId);
        if (onProjectSelect) {
            onProjectSelect(projectId);
        }
        setIsDropdownOpen(false);

        // Notify parent to update context
        if (workspaceProjects.length > 0) {
            const selectedProject = workspaceProjects.find(p => p.id === projectId);
            // This will be handled by the parent component's onProjectSelect
        }
    };

    // Get the selected project data
    const selectedProject = selectedProjectId
        ? workspaceProjects.find(p => p.id === selectedProjectId)
        : null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'from-green-400 to-emerald-500';
            case 'completed': return 'from-blue-400 to-indigo-500';
            case 'on-hold': return 'from-yellow-400 to-orange-500';
            case 'archived': return 'from-slate-400 to-gray-500';
            default: return 'from-indigo-400 to-purple-500';
        }
    };

    return (
        <>
            <div className="relative">
                <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                                "flex items-center gap-2 transition-all duration-200 shadow-sm",
                                minimal
                                    ? 'h-9 px-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/30 dark:hover:to-purple-800/30 rounded-xl font-medium'
                                    : 'h-10 px-4 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 rounded-xl'
                            )}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <div className={cn(
                                    "p-1 rounded-lg",
                                    selectedProject
                                        ? `bg-gradient-to-r ${getStatusColor(selectedProject.status || 'active')}`
                                        : "bg-gradient-to-r from-slate-400 to-gray-500"
                                )}>
                                    <Folder className="h-3 w-3 text-white" />
                                </div>
                                <span className="truncate text-sm font-medium">
                                    {selectedProject ? selectedProject.name : 'No Project Selected'}
                                </span>
                            </div>
                            <ChevronDown className={cn(
                                "h-4 w-4 ml-1 transition-transform duration-200",
                                isDropdownOpen && "rotate-180"
                            )} />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-80 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl">
                        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center">
                                <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
                                Workspace Projects
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Switch between projects in this workspace
                            </p>
                        </div>

                        {/* <div className="py-2 max-h-64 overflow-y-auto">
                            <AnimatePresence>
                                {workspaceProjects.map((project, index) => (
                                    <motion.button
                                        key={project.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className={cn(
                                            "w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center transition-all duration-200 group",
                                            selectedProjectId === project.id && 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
                                        )}
                                        onClick={() => handleProjectSelect(project.id)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={cn(
                                                "p-2 rounded-lg shadow-sm",
                                                selectedProjectId === project.id
                                                    ? `bg-gradient-to-r ${getStatusColor(project.status || 'active')}`
                                                    : "bg-gradient-to-r from-slate-200 to-gray-200 dark:from-slate-700 dark:to-slate-600"
                                            )}>
                                                {selectedProjectId === project.id ? (
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                ) : (
                                                    <FolderOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                                                        {project.name}
                                                    </span>
                                                    {selectedProjectId === project.id && (
                                                        <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-sm">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    {project.category && (
                                                        <span className="flex items-center">
                                                            <Tag className="h-3 w-3 mr-1" />
                                                            {project.category}
                                                        </span>
                                                    )}
                                                    {project.memberCount && (
                                                        <span className="flex items-center">
                                                            <Users className="h-3 w-3 mr-1" />
                                                            {project.memberCount}
                                                        </span>
                                                    )}
                                                    {project.progress !== undefined && (
                                                        <span className="flex items-center">
                                                            <div className="w-8 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mr-1">
                                                                <div
                                                                    className={`h-full rounded-full bg-gradient-to-r ${getStatusColor(project.status || 'active')}`}
                                                                    style={{ width: `${project.progress}%` }}
                                                                />
                                                            </div>
                                                            {project.progress}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div> */}

                        <div className="py-2 max-h-64 overflow-y-auto">
                            {/* Clear Selection Option */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-900/20 flex items-center transition-all duration-200 group",
                                    !selectedProjectId && 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700'
                                )}
                                onClick={() => handleProjectSelect('')}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 rounded-lg shadow-sm bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700">
                                        <X className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                Clear Selection
                                            </span>
                                            {!selectedProjectId && (
                                                <Badge className="text-xs px-2 py-0.5 bg-slate-500 text-white border-none shadow-sm">
                                                    Current
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            View workspace without project focus
                                        </p>
                                    </div>
                                </div>
                            </motion.button>

                            {/* Separator */}
                            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

                            <AnimatePresence>
                                {workspaceProjects.map((project, index) => (
                                    <motion.button
                                        key={project.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className={cn(
                                            "w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center transition-all duration-200 group",
                                            selectedProjectId === project.id && 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
                                        )}
                                        onClick={() => handleProjectSelect(project.id)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={cn(
                                                "p-2 rounded-lg shadow-sm",
                                                selectedProjectId === project.id
                                                    ? `bg-gradient-to-r ${getStatusColor(project.status || 'active')}`
                                                    : "bg-gradient-to-r from-slate-200 to-gray-200 dark:from-slate-700 dark:to-slate-600"
                                            )}>
                                                {selectedProjectId === project.id ? (
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                ) : (
                                                    <FolderOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                                                        {project.name}
                                                    </span>
                                                    {selectedProjectId === project.id && (
                                                        <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-sm">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    {project.category && (
                                                        <span className="flex items-center">
                                                            <Tag className="h-3 w-3 mr-1" />
                                                            {project.category}
                                                        </span>
                                                    )}
                                                    {project.memberCount && (
                                                        <span className="flex items-center">
                                                            <Users className="h-3 w-3 mr-1" />
                                                            {project.memberCount}
                                                        </span>
                                                    )}
                                                    {project.progress !== undefined && (
                                                        <span className="flex items-center">
                                                            <div className="w-8 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mr-1">
                                                                <div
                                                                    className={`h-full rounded-full bg-gradient-to-r ${getStatusColor(project.status || 'active')}`}
                                                                    style={{ width: `${project.progress}%` }}
                                                                />
                                                            </div>
                                                            {project.progress}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>

                        {canManageWorkspace && (
                            <div className="border-t border-slate-100 dark:border-slate-800 p-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-green-600 dark:text-green-400 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-200 rounded-lg"
                                    onClick={() => {
                                        onOpenAddProjectDialog();
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Project to Workspace
                                </Button>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>

            {/* Enhanced Add Project Dialog */}
            <Dialog open={isAddProjectDialogOpen} onOpenChange={onCloseAddProjectDialog}>
                <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
                    {/* Gradient Header */}
                    <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-t-2xl -m-6 mb-4" />

                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 mr-3 shadow-sm">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            Add Project to Workspace
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2">
                            Select a project to add to this workspace. Projects help organize your work and collaborate with team members.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6">
                        {isLoadingProjects ? (
                            <div className="text-center py-12">
                                <div className="flex items-center justify-center mb-4">
                                    <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading available projects...</p>
                            </div>
                        ) : availableProjects.length > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Available Projects</h4>
                                    <Badge variant="outline" className="text-xs px-2 py-1">
                                        {availableProjects.length} available
                                    </Badge>
                                </div>

                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {availableProjects.map((project, index) => (
                                        <motion.button
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            className="w-full text-left p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 group"
                                            onClick={() => handleAddProject(project.id)}
                                            disabled={isAddingProject}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200",
                                                    `bg-gradient-to-r ${getStatusColor(project.status || 'active')}`
                                                )}>
                                                    <Folder className="h-5 w-5 text-white" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h5 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                            {project.name}
                                                        </h5>
                                                        {project.status && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs capitalize px-2 py-0.5"
                                                            >
                                                                {project.status}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {project.description && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                                            {project.description}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                        {project.category && (
                                                            <div className="flex items-center">
                                                                <Tag className="h-3 w-3 mr-1" />
                                                                {project.category}
                                                            </div>
                                                        )}
                                                        {project.memberIds.length && (
                                                            <div className="flex items-center">
                                                                <Users className="h-3 w-3 mr-1" />
                                                                {project.memberIds.length} members
                                                            </div>
                                                        )}
                                                        {project.createdAt && (
                                                            <div className="flex items-center">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {firebaseFormatDate(project.createdAt)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-shrink-0">
                                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="rounded-full bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                                    <Folder className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">No Available Projects</h4>
                                <p className="text-slate-500 dark:text-slate-400 mb-4">
                                    All existing projects are already added to this workspace.
                                </p>
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                    Create a new project to add it to this workspace.
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCloseAddProjectDialog}
                            className="px-6 py-3 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

WorkspaceProjectSelector.displayName = 'WorkspaceProjectSelector';

export default WorkspaceProjectSelector;
