"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    UserPlus,
    Settings,
    PanelLeft,
    Plus,
    Folder,
    Loader2,
    AlertCircle,
    MessageSquare,
    Calendar,
    Code,
    BarChart3,
    FileText,
    Users,
    Sparkles,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useGetWorkspaceByIdQuery } from '@/Redux/apiSlices/workspaces/workspaceApi';
import WorkspaceMembers from './Members/WorkspaceMembers';
import WorkspaceProjectSelector, { WorkspaceProjectSelectorRef } from './Projects/WorkspaceProjectSelector';
import { useGetWorkspaceProjectsQuery } from '@/Redux/apiSlices/workspaces/workspaceProjectApi';
import WorkspaceOverview from './Overview/WorkspaceOverview';
import WorkspaceFiles from '../Files/WorkspaceFiles';
import WorkspaceSchedulePlaceholder from './Schedule/WorkspaceSchedulePlaceholder';
import InviteMemberDialog from '../Invitations/InviteMemberDialog';
import EditWorkspaceDialog from './EditWorkspace/EditWorkspaceDialog';
import WorkspaceProgressComponent from './WorkspaceProgress/WorkspaceProgressComponent';
import { WorkspaceDetailed } from '@/Redux/types/Workspace/workspace';
import WorkspaceChat from './Chat/WorkspaceChat';

interface WorkspaceDetailPageProps {
    workspaceId: string;
}

export default function WorkspaceDetailPage({ workspaceId }: WorkspaceDetailPageProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

    const projectSelectorRef = useRef<WorkspaceProjectSelectorRef>(null);

    // RTK Query hooks
    const {
        data: workspaceResponse,
        isLoading: isLoadingWorkspace,
        isError: isWorkspaceError,
        refetch: refetchWorkspace
    } = useGetWorkspaceByIdQuery({
        id: workspaceId,
        includeMembers: true,
        includeProjects: false, // We'll fetch projects separately
        includeMilestones: true,
        includeActivity: true,
        includeProgress: true,
        activityLimit: 10
    });

    // Fetch workspace projects separately
    const {
        data: projectsResponse,
        isLoading: isLoadingProjects,
        refetch: refetchProjects
    } = useGetWorkspaceProjectsQuery(workspaceId, {
        skip: !workspaceId
    });

    // Set default active project if none is selected and projects load
    useEffect(() => {
        if (projectsResponse?.data && projectsResponse.data.length > 0 && !activeProjectId) {
            setActiveProjectId(projectsResponse.data[0].id);
        }
    }, [projectsResponse, activeProjectId]);

    const handleProjectSelect = (projectId: string) => {
        setActiveProjectId(projectId);
    };

    // Determine user permissions
    const workspace = workspaceResponse?.data as WorkspaceDetailed;
    const projects = projectsResponse?.data || [];
    const userRole = workspace?.roles?.[user?.id || ''] || 'learner';
    const isCreator = workspace?.createdBy === user?.id;
    const isAdmin = user?.role === 'admin' || userRole === 'admin';
    const isMentor = userRole === 'mentor' || workspace?.mentorIds?.includes(user?.id || '');

    const canInviteMembers = isAdmin || isMentor || isCreator;
    const canManageWorkspace = isAdmin || isCreator;

    // Handle tab change with analytics
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Could add analytics tracking here
    };

    // Combined loading state
    const isLoading = isLoadingWorkspace || isLoadingProjects;

    // Loading state with elegant spinner
    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-pulse"></div>
                    <Loader2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin relative z-10" />
                </div>
                <div className="mt-4 text-center">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                        Loading Workspace
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Preparing your collaborative environment...
                    </p>
                </div>
            </div>
        );
    }

    // Error state with recovery options
    if (isWorkspaceError || !workspace) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900">
                <div className="max-w-md w-full">
                    <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertTitle className="text-red-800 dark:text-red-300">
                            Workspace Not Found
                        </AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-400 mt-2">
                            The workspace you're looking for doesn't exist or you don't have permission to access it.
                        </AlertDescription>
                        <div className="mt-4 flex gap-2">
                            <Button
                                onClick={() => router.push('/workspaces')}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Workspaces
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    refetchWorkspace();
                                    refetchProjects();
                                }}
                                className="border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
                            >
                                Try Again
                            </Button>
                        </div>
                    </Alert>
                </div>
            </div>
        );
    }

    const activeProject = projects.find(project => project.id === activeProjectId);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700';
            case 'completed':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            case 'paused':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700';
            case 'draft':
                return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            default:
                return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-t-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="px-4 sm:px-6 py-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex items-center min-w-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/workspaces')}
                                className="mr-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                        <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                                        {workspace.name}
                                    </h1>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className={getStatusColor(workspace.status)}>
                                        {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                                    </Badge>
                                    {workspace.projectType && (
                                        <Badge variant="secondary" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                                            {workspace.projectType}
                                        </Badge>
                                    )}
                                    {workspace.tags?.slice(0, 2).map(tag => (
                                        <Badge key={tag} variant="secondary" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {workspace.tags && workspace.tags.length > 2 && (
                                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            +{workspace.tags.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Project Selector */}
                            {projects && projects.length > 0 && (
                                <WorkspaceProjectSelector
                                    ref={projectSelectorRef}
                                    workspaceId={workspaceId}
                                    workspaceProjects={projects}
                                    canManageWorkspace={canManageWorkspace}
                                    onProjectSelect={handleProjectSelect}
                                    refetchWorkspace={() => {
                                        refetchWorkspace();
                                        refetchProjects();
                                    }}
                                    minimal={true}
                                />
                            )}

                            {canManageWorkspace && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => projectSelectorRef.current?.openAddProjectDialog()}
                                    className="border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Add Project</span>
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarVisible(!sidebarVisible)}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                title={sidebarVisible ? "Hide members" : "Show members"}
                            >
                                <PanelLeft className={`h-4 w-4 transition-transform ${sidebarVisible ? '' : 'rotate-180'}`} />
                            </Button>

                            {canInviteMembers && (
                                <Button
                                    onClick={() => setIsInviteDialogOpen(true)}
                                    size="sm"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Invite</span>
                                </Button>
                            )}

                            {canManageWorkspace && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsSettingsDialogOpen(true)}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Tabs
                        defaultValue="overview"
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        {/* Tab Navigation */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6">
                            <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1">
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                                >
                                    <BarChart3 className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Overview</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="files"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                                >
                                    <FileText className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Files</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="chat"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
                                >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Chat</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="terminal"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400"
                                >
                                    <Code className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Terminal</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="progress"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400"
                                >
                                    <Activity className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Progress</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="schedule"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400"
                                >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Schedule</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-auto bg-white dark:bg-slate-900">
                            <TabsContent value="overview" className="h-full m-0">
                                <WorkspaceOverview
                                    workspace={workspace}
                                    activeProjectId={activeProjectId}
                                />
                            </TabsContent>

                            <TabsContent value="files" className="h-full m-0">
                                <WorkspaceFiles
                                    workspaceId={workspace.id}
                                    userPermissions={{
                                        canUpload: true,
                                        canCreate: true,
                                        canDelete: canManageWorkspace || isMentor || false,
                                        canEdit: true,
                                        canShare: true
                                    }}
                                />
                            </TabsContent>

                            <TabsContent value="chat" className="h-full">
                                <WorkspaceChat
                                    workspaceId={workspace.id}
                                    projectId={activeProjectId}
                                    channelName={workspace.name}
                                    channelType="team"
                                    channelDescription={activeProject
                                        ? `${workspace.name} > ${activeProject.name}`
                                        : workspace.description}
                                    channelMembers={workspace.learners.length + workspace.mentors.length}
                                    userPermissions={{
                                        canPin: canManageWorkspace || workspace.mentorIds.includes(user?.id || ''),
                                        canDeleteOthers: canManageWorkspace,
                                        isMentor: workspace.mentorIds.includes(user?.id || ''),
                                        isAdmin: user?.role === 'admin' || workspace.roles?.[user?.id || ''] === 'admin'
                                    }}
                                />
                            </TabsContent>

                            <TabsContent value="terminal" className="h-full m-0">
                                <div className="p-4 sm:p-6">
                                    {activeProject && (
                                        <div className="mb-4">
                                            <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800">
                                                <Folder className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                                                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                                                    Active Project: {activeProject.name}
                                                </span>
                                                <Badge className="ml-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs">
                                                    {activeProject.progress || 0}% Complete
                                                </Badge>
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                                        <div className="p-4 sm:p-6">
                                            <div className="flex items-center mb-4">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mr-3">
                                                    <Code className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        Google Colab Enterprise
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        Advanced collaborative coding environment
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                                {[
                                                    { icon: Code, label: 'Code & Test', color: 'indigo' },
                                                    { icon: Users, label: 'Collaborate', color: 'blue' },
                                                    { icon: Activity, label: 'Deploy', color: 'emerald' },
                                                    { icon: Sparkles, label: 'ML Resources', color: 'purple' }
                                                ].map(({ icon: Icon, label, color }) => (
                                                    <div key={label} className={`flex items-center p-2 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800`}>
                                                        <div className={`h-6 w-6 bg-${color}-100 dark:bg-${color}-800/30 rounded-full flex items-center justify-center mr-2`}>
                                                            <Icon className={`h-3 w-3 text-${color}-600 dark:text-${color}-400`} />
                                                        </div>
                                                        <span className={`text-xs font-medium text-${color}-700 dark:text-${color}-300`}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                                                    Download your files after coding and upload to Files tab for deployment
                                                </AlertDescription>
                                            </Alert>

                                            <div className="flex justify-end">
                                                <a
                                                    href="https://console.cloud.google.com/vertex-ai/colab/notebooks?project=enterprise-edu&inv=1&invt=AbwvbA&activeNb=projects%2Fenterprise-edu%2Flocations%2Fus-central1%2Frepositories%2F3b0959d1-5196-4943-9e7a-fa034d96fea3"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                                                        <Code className="h-4 w-4 mr-2" />
                                                        Launch Notebook
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="progress" className="h-full m-0">
                                <div className="p-4 sm:p-6">
                                    {activeProject && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800">
                                                <div className="flex items-center">
                                                    <Folder className="h-4 w-4 text-rose-600 dark:text-rose-400 mr-2" />
                                                    <span className="text-sm font-medium text-rose-800 dark:text-rose-300">
                                                        Tracking progress for: {activeProject.name}
                                                    </span>
                                                </div>
                                                <Badge className="bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 text-xs">
                                                    {activeProject.progress || 0}% Complete
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                    <WorkspaceProgressComponent
                                        workspaceId={workspace.id}
                                        userId={user?.id || ''}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="schedule" className="h-full m-0">
                                <div className="p-4 sm:p-6">
                                    {activeProject && (
                                        <div className="mb-4">
                                            <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800">
                                                <Folder className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-2" />
                                                <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                                    Schedule for: {activeProject.name}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <WorkspaceSchedulePlaceholder workspaceId={workspace.id} />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Members Sidebar */}
                {sidebarVisible && (
                    <div className="w-80 h-fit flex-shrink-0 overflow-y-auto">
                        <WorkspaceMembers
                            workspaceId={workspace.id}
                            mentors={workspace.mentors || []}
                            learners={workspace.learners || []}
                            currentUserId={user?.id || ''}
                            availableRoles={workspace.availableRoles || ['admin', 'mentor', 'learner']}
                            creatorId={workspace.createdBy}
                            onMemberUpdate={() => {
                                refetchWorkspace();
                                refetchProjects();
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Dialogs */}
            {isInviteDialogOpen && (
                <InviteMemberDialog
                    open={isInviteDialogOpen}
                    onClose={() => setIsInviteDialogOpen(false)}
                    workspaceId={workspace.id}
                    workspaceName={workspace.name}
                    availableRoles={workspace.availableRoles || ['mentor', 'learner']}
                />
            )}

            {isSettingsDialogOpen && (
                <EditWorkspaceDialog
                    open={isSettingsDialogOpen}
                    onClose={() => setIsSettingsDialogOpen(false)}
                    workspaceId={workspace.id}
                    onSuccess={() => {
                        refetchWorkspace();
                        refetchProjects();
                        toast({
                            title: "Workspace Updated",
                            description: "Your workspace settings have been saved successfully.",
                        });
                    }}
                />
            )}
        </div>
    );
}