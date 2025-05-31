import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { transformProjectData, transformWorkspaceData } from './activeProjectUtils';
import { useGetWorkspaceByIdQuery } from '@/Redux/apiSlices/workspaces/workspaceApi';
import { useGetWorkspaceProjectsQuery } from '@/Redux/apiSlices/workspaces/workspaceProjectApi';
import { useGetProjectByIdQuery } from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { ActiveProjectData, ActiveWorkspaceData } from './ActiveProjectTypes';

// Hook for refreshing active project data using RTK Query
export function useRefreshActiveProject(
    activeProject: ActiveProjectData | null,
    activeWorkspace: ActiveWorkspaceData | null,
    enableNotifications: boolean = true
) {
    // Get workspace data
    const {
        refetch: refetchWorkspace,
        isLoading: isLoadingWorkspace,
        error: workspaceError
    } = useGetWorkspaceByIdQuery(
        {
            id: activeWorkspace?.id || '',
            includeProjects: false, // We'll get projects separately
            includeMembers: false,
            includeMilestones: false
        },
        {
            skip: !activeWorkspace?.id
        }
    );

    // Get workspace projects (which are just IDs)
    const {
        refetch: refetchWorkspaceProjects,
        isLoading: isLoadingWorkspaceProjects,
        error: workspaceProjectsError
    } = useGetWorkspaceProjectsQuery(
        activeWorkspace?.id || '',
        { skip: !activeWorkspace?.id }
    );

    // Get the actual project data
    const {
        refetch: refetchProject,
        isLoading: isLoadingProject,
        error: projectError
    } = useGetProjectByIdQuery(
        activeProject?.id || '',
        { skip: !activeProject?.id }
    );

    const refreshActiveProject = useCallback(async (): Promise<{
        project: ActiveProjectData | null;
        workspace: ActiveWorkspaceData | null;
        success: boolean;
    }> => {
        if (!activeProject || !activeWorkspace) {
            return { project: null, workspace: null, success: false };
        }

        try {
            // Fetch all required data in parallel
            const [workspaceResult, workspaceProjectsResult, projectResult] = await Promise.all([
                refetchWorkspace(),
                refetchWorkspaceProjects(),
                refetchProject()
            ]);

            // Check for errors
            if (workspaceResult.error || workspaceProjectsResult.error || projectResult.error) {
                throw new Error('Failed to fetch data');
            }

            // Validate workspace data
            if (!workspaceResult.data?.success || !workspaceResult.data.data) {
                throw new Error('Invalid workspace response');
            }

            // Validate workspace projects data
            if (!workspaceProjectsResult.data?.success) {
                throw new Error('Invalid workspace projects response');
            }

            // Validate project data
            if (!projectResult.data?.success || !projectResult.data.data) {
                throw new Error('Invalid project response');
            }

            const updatedWorkspace = transformWorkspaceData(workspaceResult.data.data);
            const updatedProject = transformProjectData(projectResult.data.data);

            // Check if project is still in the workspace
            const workspaceProjectIds = workspaceProjectsResult.data.data?.map((p: any) => p.id) || [];
            const isProjectStillInWorkspace = workspaceProjectIds.includes(activeProject.id);

            if (!isProjectStillInWorkspace) {
                // Project no longer exists in workspace
                if (enableNotifications) {
                    toast({
                        title: "Project Removed",
                        description: "The active project is no longer available in this workspace",
                        variant: "destructive",
                    });
                }

                return { project: null, workspace: null, success: false };
            }

            if (enableNotifications) {
                toast({
                    title: "Project Refreshed",
                    description: "Active project data has been updated",
                    variant: "default",
                });
            }

            return {
                project: updatedProject,
                workspace: updatedWorkspace,
                success: true
            };

        } catch (error) {
            console.error('Error refreshing active project:', error);
            if (enableNotifications) {
                toast({
                    title: "Refresh Failed",
                    description: "Failed to refresh project data. Please try again.",
                    variant: "destructive",
                });
            }

            return { project: null, workspace: null, success: false };
        }
    }, [
        activeProject,
        activeWorkspace,
        refetchWorkspace,
        refetchWorkspaceProjects,
        refetchProject,
        enableNotifications
    ]);

    return {
        refreshActiveProject,
        isRefreshing: isLoadingWorkspace || isLoadingWorkspaceProjects || isLoadingProject,
        error: workspaceError || workspaceProjectsError || projectError
    };
}

// Hook for validating if active project still exists
export function useValidateActiveProject(
    activeProject: ActiveProjectData | null,
    activeWorkspace: ActiveWorkspaceData | null
) {
    // Get workspace projects to check if project is still in workspace
    const { data: workspaceProjectsData, isLoading: isLoadingWorkspaceProjects } = useGetWorkspaceProjectsQuery(
        activeWorkspace?.id || '',
        {
            skip: !activeWorkspace?.id,
            // Poll every 5 minutes to check if project still exists
            pollingInterval: 300000
        }
    );

    // Get the actual project data to check if it still exists
    const { data: projectData, isLoading: isLoadingProject } = useGetProjectByIdQuery(
        activeProject?.id || '',
        {
            skip: !activeProject?.id,
            pollingInterval: 300000
        }
    );

    const isProjectValid = useCallback((): boolean => {
        if (!activeProject || !activeWorkspace) return false;

        // Check if project exists
        const projectExists = projectData?.success && projectData.data;
        if (!projectExists) return false;

        // Check if project is still in workspace
        const workspaceProjectIds = workspaceProjectsData?.data?.map((p: any) => p.id) || [];
        const isInWorkspace = workspaceProjectIds.includes(activeProject.id);

        return isInWorkspace;
    }, [activeProject, activeWorkspace, projectData, workspaceProjectsData]);

    const getCurrentProjectData = useCallback(() => {
        if (!projectData?.success || !projectData.data) return null;
        return projectData.data;
    }, [projectData]);

    return {
        isProjectValid: isProjectValid(),
        currentProjectData: getCurrentProjectData(),
        isValidating: isLoadingWorkspaceProjects || isLoadingProject
    };
}

// Hook for getting workspace projects (for project switching)
export function useWorkspaceProjects(workspaceId: string | null) {
    // Get workspace project IDs
    const {
        data: workspaceProjectsData,
        isLoading: isLoadingWorkspaceProjects,
        error: workspaceProjectsError,
        refetch: refetchWorkspaceProjects
    } = useGetWorkspaceProjectsQuery(
        workspaceId || '',
        { skip: !workspaceId }
    );

    // Get actual project data for each project ID
    // Note: This is a simplified approach. In a real app, you might want to batch these requests
    // or use a more efficient method to get multiple projects at once
    const projectIds = workspaceProjectsData?.data?.map((p: any) => p.id) || [];

    // For now, we'll return the project IDs and let individual components fetch project details as needed
    // You could enhance this to actually fetch all project details if your API supports batch requests

    const projects = projectIds.map((id: string) => ({
        id,
        // Add placeholder data - components using this should fetch full project data separately
        name: `Project ${id}`,
        status: 'active' as const
    }));

    return {
        projects,
        projectIds,
        isLoading: isLoadingWorkspaceProjects,
        error: workspaceProjectsError,
        refetch: refetchWorkspaceProjects
    };
}

// Hook for getting full project data for workspace projects
export function useWorkspaceProjectsWithData(workspaceId: string | null) {
    const { projectIds, isLoading: isLoadingIds, error: idsError } = useWorkspaceProjects(workspaceId);

    // This would need to be implemented based on whether your API supports batch project fetching
    // For now, returning basic structure
    return {
        projects: [],
        isLoading: isLoadingIds,
        error: idsError,
        refetch: () => { }
    };
}

// Hook for getting available workspaces for project context
export function useAvailableWorkspaces() {
    // You can implement this using your existing workspace queries
    // This would be useful for switching workspace context

    // Placeholder - implement based on your workspace management API
    const workspaces: ActiveWorkspaceData[] = [];
    const isLoading = false;
    const error = null;

    return {
        workspaces,
        isLoading,
        error
    };
}