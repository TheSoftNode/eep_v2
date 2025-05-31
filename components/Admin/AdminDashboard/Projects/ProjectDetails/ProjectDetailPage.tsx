"use client"

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Settings, MoreVertical, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Components
import ProjectDetailSkeleton from './ProjectDetailSkeleton';
import ProjectOverview from './ProjectOverview';
import ProjectTasks from '../../Tasks/ProjectTasks';
import TeamMembers from '../Members/TeamMembers';
import ProjectActivity from '../Activities/ProjectActivity';
import TeamMembersModal from '../Members/TeamMembersModal';
import { ActivityViewModal } from '../Activities/ActivityViewModal';

// API Hooks - Updated to use new normalized structure
import {
    useDeleteProjectMutation,
    useGetProjectByIdQuery,
    useGetProjectMembersQuery,
} from '@/Redux/apiSlices/Projects/projectsApiSlice';
import ProjectResources from './ProjectResources';
import ProjectFeedback from './ProjectFeedback';

export default function ProjectDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { user } = useAuth();

    // Modal states
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Get project ID from URL params
    const projectId = params?.id as string;

    // Determine user permissions
    const isAdmin = user?.role === 'admin';
    const isMentor = user?.role === 'mentor';
    const canManage = isAdmin || isMentor;

    // API hooks - Updated for normalized structure
    const {
        data: projectResponse,
        isLoading: isProjectLoading,
        isError: isProjectError,
        error: projectError,
        refetch: refetchProject
    } = useGetProjectByIdQuery(projectId, {
        skip: !projectId
    });

    // Fetch project members using separate endpoint
    const {
        data: membersResponse,
        isLoading: isLoadingMembers,
        refetch: refetchMembers
    } = useGetProjectMembersQuery(projectId, {
        skip: !projectId
    });

    const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();

    // Handle errors
    useEffect(() => {
        if (isProjectError) {
            toast({
                title: "Error Loading Project",
                description: "Failed to load project details. Please try again.",
                variant: "destructive",
            });
            // Navigate back after showing error
            setTimeout(() => {
                router.push('/admin/dashboard/projects');
            }, 2000);
        }
    }, [isProjectError, router, toast]);

    const handleEditProject = () => {
        if (projectId) {
            router.push(`/admin/dashboard/projects/${projectId}/edit`);
        }
    };

    const handleDeleteProject = async () => {
        if (!projectId) return;

        try {
            await deleteProject(projectId).unwrap();

            toast({
                title: "Project Deleted Successfully",
                description: "The project has been permanently removed.",
            });

            router.push('/admin/dashboard/projects');
        } catch (error: any) {
            toast({
                title: "Failed to Delete Project",
                description: error?.data?.message || "An error occurred while deleting the project.",
                variant: "destructive",
            });
        }
    };

    const handleManageTeam = () => {
        setIsTeamModalOpen(true);
    };

    const handleViewAllActivity = () => {
        setIsActivityModalOpen(true);
    };

    const handleTeamManagementSuccess = () => {
        // Refetch both project and members data
        refetchProject();
        refetchMembers();
        toast({
            title: "Team Updated",
            description: "Team changes have been saved successfully.",
        });
    };

    const handleRefreshProject = () => {
        refetchProject();
        refetchMembers();
        toast({
            title: "Project Refreshed",
            description: "Project data has been updated.",
        });
    };

    // Loading state
    if (isProjectLoading || !projectResponse?.data) {
        return <ProjectDetailSkeleton />;
    }

    const project = projectResponse.data;
    const projectMembers = membersResponse?.data || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/admin/projects')}
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
                        </Button>

                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />

                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Project Details
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Comprehensive project management and oversight
                            </p>
                        </div>
                    </div>

                    {canManage && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefreshProject}
                                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleEditProject}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Project
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-slate-300 dark:border-slate-600"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={handleManageTeam}>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Manage Team
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleViewAllActivity}>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        View All Activity
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Project
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <ProjectOverview
                            project={project}
                            canManage={canManage}
                        />

                        <ProjectTasks
                            project={project}
                            canManage={canManage}
                        />

                        <ProjectResources
                            projectId={projectId}
                            canManage={canManage}
                        />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        <TeamMembers
                            members={projectMembers}
                            canManage={canManage}
                            onManageTeam={handleManageTeam}
                            isLoading={isLoadingMembers}
                        />

                        <ProjectActivity
                            projectId={projectId}
                            onViewAllActivity={handleViewAllActivity}
                        />

                        <ProjectFeedback
                            projectId={projectId}
                            canManage={canManage}
                            limit={5} // Show recent feedback
                        />
                    </div>
                </div>
            </div>

            {/* Team Members Modal */}
            <TeamMembersModal
                projectId={projectId}
                open={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
                onSuccess={handleTeamManagementSuccess}
            />

            {/* Activity View Modal */}
            <ActivityViewModal
                projectId={projectId}
                open={isActivityModalOpen}
                onClose={() => setIsActivityModalOpen(false)}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="h-5 w-5" />
                            Delete Project
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete "{project.name}"? This action cannot be undone and will permanently remove:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>All project tasks and areas</li>
                                <li>Team member assignments</li>
                                <li>Project resources and files</li>
                                <li>All activity history</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isDeletingProject}
                            className="border-slate-300 dark:border-slate-600"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProject}
                            disabled={isDeletingProject}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeletingProject ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Project
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}