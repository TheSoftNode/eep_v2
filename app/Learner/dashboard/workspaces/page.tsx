"use client"

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Loader2,
    AlertCircle,
    FolderKanban,
    BarChart3,
    RefreshCw,
    BellRing
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    useGetAllWorkspacesQuery,
} from '@/Redux/apiSlices/workspaces/workspaceApi';
import { WorkspaceStatus } from '@/Redux/types/Workspace/workspace';
import AdminWorkspaceFilters from '@/components/Admin/AdminDashboard/Workspace/AllWorkspaces/AdminWorkspaceFilters';
import AdminCreateWorkspaceCard from '@/components/Admin/AdminDashboard/Workspace/AllWorkspaces/AdminCreateWorkspaceCard';
import AdminWorkspaceCard from '@/components/Admin/AdminDashboard/Workspace/AllWorkspaces/AdminWorkspaceCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetUserInvitationsQuery, useRespondToInvitationMutation } from '@/Redux/apiSlices/workspaces/workspaceInvitationApi';
import InvitationCard from '@/components/Admin/AdminDashboard/Workspace/Invitations/InvitationCard';

interface FilterState {
    search: string;
    status: WorkspaceStatus | 'all';
    visibility: 'all' | 'public' | 'private' | 'organization';
    sortBy: 'name' | 'createdAt' | 'updatedAt' | 'memberCount';
    sortOrder: 'asc' | 'desc';
}

const WorkspacesPage: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { isAdmin } = useAuth();

    // State for filters
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: 'all',
        visibility: 'all',
        sortBy: 'updatedAt',
        sortOrder: 'desc'
    });

    // State for invitation processing
    const [processingInvitationId, setProcessingInvitationId] = useState<string | null>(null);

    // API calls for workspaces
    const {
        data: workspacesResponse,
        isLoading,
        error,
        refetch
    } = useGetAllWorkspacesQuery({
        page: 1,
        limit: 50,
        orderBy: filters.sortBy,
        orderDirection: filters.sortOrder,
        includeProjects: true,
        includeMemberCount: true,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search })
    });

    // API calls for invitations
    const {
        data: invitationsResponse,
        isLoading: isLoadingInvitations,
        error: invitationsError,
        refetch: refetchInvitations
    } = useGetUserInvitationsQuery({ status: 'pending' });

    // API mutation for responding to invitations
    const [respondToInvitation, { isLoading: isProcessingInvitation }] = useRespondToInvitationMutation();

    // Get pending invitations
    const pendingInvitations = invitationsResponse?.data?.filter(
        invitation => invitation.status === 'pending'
    ) || [];

    // Filter and sort workspaces based on current filters
    const filteredWorkspaces = useMemo(() => {
        if (!workspacesResponse?.data) return [];

        let filtered = [...workspacesResponse.data];

        // Apply client-side filters that aren't handled by API
        if (filters.visibility !== 'all') {
            filtered = filtered.filter(workspace => workspace.visibility === filters.visibility);
        }

        return filtered;
    }, [workspacesResponse?.data, filters]);

    // Handle filter changes
    const handleFiltersChange = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            visibility: 'all',
            sortBy: 'updatedAt',
            sortOrder: 'desc'
        });
    };

    // Navigation handlers
    const handleCreateWorkspace = () => {
        router.push('/Learner/dashboard/workspaces/create');
    };

    const handleWorkspaceClick = (workspaceId: string) => {
        router.push(`/Learner/dashboard/workspaces/${workspaceId}`);
    };

    // Handle invitation actions
    const handleAcceptInvitation = async (invitationId: string, message?: string) => {
        setProcessingInvitationId(invitationId);

        try {
            const response = await respondToInvitation({
                invitationId,
                accept: true,
                ...(message && { message })
            }).unwrap();

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Invitation accepted successfully",
                });

                refetchInvitations();
                refetch(); // Refetch workspaces

                // Navigate to the workspace if available
                if (response.data?.workspaceId) {
                    router.push(`/Learner/dashboard/workspaces/${response.data.workspaceId}`);
                }
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to accept invitation",
                variant: "destructive"
            });
        } finally {
            setProcessingInvitationId(null);
        }
    };

    const handleDeclineInvitation = async (invitationId: string, message?: string) => {
        setProcessingInvitationId(invitationId);

        try {
            const response = await respondToInvitation({
                invitationId,
                accept: false,
                ...(message && { message })
            }).unwrap();

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Invitation declined",
                });

                refetchInvitations();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to decline invitation",
                variant: "destructive"
            });
        } finally {
            setProcessingInvitationId(null);
        }
    };

    // Get workspace statistics
    const workspaceStats = useMemo(() => {
        if (!workspacesResponse?.data) return null;

        const total = workspacesResponse.data.length;
        const active = workspacesResponse.data.filter(w => w.status === 'active').length;
        const draft = workspacesResponse.data.filter(w => w.status === 'draft').length;
        const completed = workspacesResponse.data.filter(w => w.status === 'completed').length;
        const totalMembers = workspacesResponse.data.reduce((sum, w) => sum + (w.memberCount || 0), 0);
        const totalProjects = workspacesResponse.data.reduce((sum, w) => sum + (w.projectIds?.length || 0), 0);

        return { total, active, draft, completed, totalMembers, totalProjects };
    }, [workspacesResponse?.data]);

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            All Workspaces
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Manage and monitor all workspaces in the system
                        </p>
                    </div>
                </div>

                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Workspaces</AlertTitle>
                    <AlertDescription>
                        Failed to load workspaces. Please try again later.
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="ml-2"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        All Workspaces
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage and monitor all workspaces in the system
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/dashboard/workspaces/analytics')}
                        className="bg-white dark:bg-slate-900"
                    >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                    </Button>
                    {isAdmin() && (
                        <Button
                            onClick={handleCreateWorkspace}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Workspace
                        </Button>
                    )}
                </div>
            </div>

            {/* Statistics Cards */}
            {workspaceStats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {workspaceStats.total}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Total Workspaces
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {workspaceStats.active}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Active
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {workspaceStats.draft}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Draft
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {workspaceStats.completed}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Completed
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {workspaceStats.totalMembers}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Total Members
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {workspaceStats.totalProjects}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Total Projects
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Pending Invitations Alert */}
            {pendingInvitations.length > 0 && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg p-4 flex items-start gap-3">
                    <BellRing className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-medium text-indigo-800 dark:text-indigo-300">
                            You have {pendingInvitations.length} pending invitation{pendingInvitations.length !== 1 ? 's' : ''}
                        </h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">
                            You've been invited to join workspace{pendingInvitations.length !== 1 ? 's' : ''} as an admin.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pendingInvitations.map(invitation => {
                                const isProcessing = processingInvitationId === invitation.id && isProcessingInvitation;

                                return (
                                    <InvitationCard
                                        key={invitation.id}
                                        invitation={invitation}
                                        onAccept={(message) => handleAcceptInvitation(invitation.id, message)}
                                        onDecline={(message) => handleDeclineInvitation(invitation.id, message)}
                                        isLoading={isProcessing}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Error messages */}
            {invitationsError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Invitations</AlertTitle>
                    <AlertDescription>
                        Failed to load workspace invitations. Please try again later.
                    </AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <AdminWorkspaceFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                totalCount={workspacesResponse?.data?.length || 0}
                filteredCount={filteredWorkspaces.length}
            />

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    <span className="ml-3 text-slate-600 dark:text-slate-300">Loading workspaces...</span>
                </div>
            ) : filteredWorkspaces.length === 0 && filters.search ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <FolderKanban className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                        No matching workspaces
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                        No workspaces match your current filters
                    </p>
                    <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                    >
                        Clear filters
                    </Button>
                </div>
            ) : filteredWorkspaces.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <FolderKanban className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                        No workspaces yet
                    </h3>
                    {isAdmin() && (
                        <>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                                Get started by creating your first workspace
                            </p>
                            <Button
                                onClick={handleCreateWorkspace}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Workspace
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create workspace card */}
                    {isAdmin() && (
                        <AdminCreateWorkspaceCard onClick={handleCreateWorkspace} />
                    )}

                    {/* Workspace cards */}
                    {filteredWorkspaces.map((workspace) => (
                        <AdminWorkspaceCard
                            key={workspace.id}
                            workspace={workspace}
                            onClick={() => handleWorkspaceClick(workspace.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkspacesPage;


// "use client"

// import React, { useState, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//     Plus,
//     Loader2,
//     AlertCircle,
//     FolderKanban,
//     BarChart3,
//     RefreshCw
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//     useGetAllWorkspacesQuery,
// } from '@/Redux/apiSlices/workspaces/workspaceApi';
// import { WorkspaceStatus } from '@/Redux/types/Workspace/workspace';
// import AdminWorkspaceFilters from '@/components/Admin/AdminDashboard/Workspace/AllWorkspaces/AdminWorkspaceFilters';
// import AdminCreateWorkspaceCard from '@/components/Admin/AdminDashboard/Workspace/AllWorkspaces/AdminCreateWorkspaceCard';
// import AdminWorkspaceCard from '@/components/Admin/AdminDashboard/Workspace/AllWorkspaces/AdminWorkspaceCard';
// import { useAuth } from '@/hooks/useAuth';



// interface FilterState {
//     search: string;
//     status: WorkspaceStatus | 'all';
//     visibility: 'all' | 'public' | 'private' | 'organization';
//     sortBy: 'name' | 'createdAt' | 'updatedAt' | 'memberCount';
//     sortOrder: 'asc' | 'desc';
// }

// const WorkspacesPage: React.FC = () => {
//     const router = useRouter();

//     const { isAdmin } = useAuth();

//     // State for filters
//     const [filters, setFilters] = useState<FilterState>({
//         search: '',
//         status: 'all',
//         visibility: 'all',
//         sortBy: 'updatedAt',
//         sortOrder: 'desc'
//     });

//     // API calls
//     const {
//         data: workspacesResponse,
//         isLoading,
//         error,
//         refetch
//     } = useGetAllWorkspacesQuery({
//         page: 1,
//         limit: 50,
//         orderBy: filters.sortBy,
//         orderDirection: filters.sortOrder,
//         includeProjects: true,
//         includeMemberCount: true,
//         ...(filters.status !== 'all' && { status: filters.status }),
//         ...(filters.search && { search: filters.search })
//     });



//     // Filter and sort workspaces based on current filters
//     const filteredWorkspaces = useMemo(() => {
//         if (!workspacesResponse?.data) return [];

//         let filtered = [...workspacesResponse.data];

//         // Apply client-side filters that aren't handled by API
//         if (filters.visibility !== 'all') {
//             filtered = filtered.filter(workspace => workspace.visibility === filters.visibility);
//         }

//         return filtered;
//     }, [workspacesResponse?.data, filters]);

//     // Handle filter changes
//     const handleFiltersChange = (newFilters: Partial<FilterState>) => {
//         setFilters(prev => ({ ...prev, ...newFilters }));
//     };

//     // Clear all filters
//     const handleClearFilters = () => {
//         setFilters({
//             search: '',
//             status: 'all',
//             visibility: 'all',
//             sortBy: 'updatedAt',
//             sortOrder: 'desc'
//         });
//     };

//     // Navigation handlers
//     const handleCreateWorkspace = () => {
//         router.push('/Learner/dashboard/workspaces/create');
//     };

//     const handleWorkspaceClick = (workspaceId: string) => {
//         router.push(`/Learner/dashboard/workspaces/${workspaceId}`);
//     };



//     // Get workspace statistics
//     const workspaceStats = useMemo(() => {
//         if (!workspacesResponse?.data) return null;

//         const total = workspacesResponse.data.length;
//         const active = workspacesResponse.data.filter(w => w.status === 'active').length;
//         const draft = workspacesResponse.data.filter(w => w.status === 'draft').length;
//         const completed = workspacesResponse.data.filter(w => w.status === 'completed').length;
//         const totalMembers = workspacesResponse.data.reduce((sum, w) => sum + (w.memberCount || 0), 0);
//         const totalProjects = workspacesResponse.data.reduce((sum, w) => sum + (w.projectIds?.length || 0), 0);

//         return { total, active, draft, completed, totalMembers, totalProjects };
//     }, [workspacesResponse?.data]);

//     if (error) {
//         return (
//             <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
//                             All Workspaces
//                         </h1>
//                         <p className="text-slate-500 dark:text-slate-400">
//                             Manage and monitor all workspaces in the system
//                         </p>
//                     </div>
//                 </div>

//                 <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error Loading Workspaces</AlertTitle>
//                     <AlertDescription>
//                         Failed to load workspaces. Please try again later.
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => refetch()}
//                             className="ml-2"
//                         >
//                             <RefreshCw className="h-4 w-4 mr-2" />
//                             Retry
//                         </Button>
//                     </AlertDescription>
//                 </Alert>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//                 <div>
//                     <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
//                         All Workspaces
//                     </h1>
//                     <p className="text-slate-500 dark:text-slate-400">
//                         Manage and monitor all workspaces in the system
//                     </p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <Button
//                         variant="outline"
//                         onClick={() => router.push('/admin/dashboard/workspaces/analytics')}
//                         className="bg-white dark:bg-slate-900"
//                     >
//                         <BarChart3 className="h-4 w-4 mr-2" />
//                         Analytics
//                     </Button>
//                     {
//                         isAdmin() && (
//                             <Button
//                                 onClick={handleCreateWorkspace}
//                                 className="bg-indigo-600 hover:bg-indigo-700 text-white"
//                             >
//                                 <Plus className="h-4 w-4 mr-2" />
//                                 Create Workspace
//                             </Button>
//                         )
//                     }
//                 </div>
//             </div>

//             {/* Statistics Cards */}
//             {workspaceStats && (
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                     <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                         <CardContent className="p-4">
//                             <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
//                                 {workspaceStats.total}
//                             </div>
//                             <div className="text-sm text-slate-500 dark:text-slate-400">
//                                 Total Workspaces
//                             </div>
//                         </CardContent>
//                     </Card>
//                     <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                         <CardContent className="p-4">
//                             <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                                 {workspaceStats.active}
//                             </div>
//                             <div className="text-sm text-slate-500 dark:text-slate-400">
//                                 Active
//                             </div>
//                         </CardContent>
//                     </Card>
//                     <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                         <CardContent className="p-4">
//                             <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
//                                 {workspaceStats.draft}
//                             </div>
//                             <div className="text-sm text-slate-500 dark:text-slate-400">
//                                 Draft
//                             </div>
//                         </CardContent>
//                     </Card>
//                     <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                         <CardContent className="p-4">
//                             <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                                 {workspaceStats.completed}
//                             </div>
//                             <div className="text-sm text-slate-500 dark:text-slate-400">
//                                 Completed
//                             </div>
//                         </CardContent>
//                     </Card>
//                     <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                         <CardContent className="p-4">
//                             <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
//                                 {workspaceStats.totalMembers}
//                             </div>
//                             <div className="text-sm text-slate-500 dark:text-slate-400">
//                                 Total Members
//                             </div>
//                         </CardContent>
//                     </Card>
//                     <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                         <CardContent className="p-4">
//                             <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
//                                 {workspaceStats.totalProjects}
//                             </div>
//                             <div className="text-sm text-slate-500 dark:text-slate-400">
//                                 Total Projects
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             )}

//             {/* Filters */}
//             <AdminWorkspaceFilters
//                 filters={filters}
//                 onFiltersChange={handleFiltersChange}
//                 onClearFilters={handleClearFilters}
//                 totalCount={workspacesResponse?.data?.length || 0}
//                 filteredCount={filteredWorkspaces.length}
//             />

//             {/* Content */}
//             {isLoading ? (
//                 <div className="flex items-center justify-center py-12">
//                     <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
//                     <span className="ml-3 text-slate-600 dark:text-slate-300">Loading workspaces...</span>
//                 </div>
//             ) : filteredWorkspaces.length === 0 && filters.search ? (
//                 <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
//                     <FolderKanban className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
//                         No matching workspaces
//                     </h3>
//                     <p className="text-slate-500 dark:text-slate-400 mb-4">
//                         No workspaces match your current filters
//                     </p>
//                     <Button
//                         variant="outline"
//                         onClick={handleClearFilters}
//                         className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
//                     >
//                         Clear filters
//                     </Button>
//                 </div>
//             ) : filteredWorkspaces.length === 0 ? (
//                 <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
//                     <FolderKanban className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
//                         No workspaces yet
//                     </h3>
//                     {
//                         isAdmin() && (
//                             <>
//                                 <p className="text-slate-500 dark:text-slate-400 mb-4">
//                                     Get started by creating your first workspace
//                                 </p>
//                                 <Button
//                                     onClick={handleCreateWorkspace}
//                                     className="bg-indigo-600 hover:bg-indigo-700 text-white"
//                                 >
//                                     <Plus className="h-4 w-4 mr-2" />
//                                     Create First Workspace
//                                 </Button>
//                             </>
//                         )
//                     }
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {/* Create workspace card */}
//                     <AdminCreateWorkspaceCard onClick={handleCreateWorkspace} />

//                     {/* Workspace cards */}
//                     {filteredWorkspaces.map((workspace) => (
//                         <AdminWorkspaceCard
//                             key={workspace.id}
//                             workspace={workspace}
//                             onClick={() => handleWorkspaceClick(workspace.id)}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default WorkspacesPage;


