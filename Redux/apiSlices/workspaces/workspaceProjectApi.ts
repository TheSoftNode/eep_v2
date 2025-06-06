

// Import project-related types
import { apiSlice } from "@/Redux/services/api";
import { AddProjectToWorkspaceRequest, ProjectOperationResponse, RemoveProjectFromWorkspaceRequest, SetPrimaryWorkspaceProjectRequest, WorkspaceProjectsResponse } from "@/Redux/types/Workspace/workspace-dtos";



/**
 * Workspace Project API Slice
 * Contains endpoints for managing projects within workspaces
 */
export const workspaceProjectApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //==========================================================================
        // WORKSPACE PROJECT ENDPOINTS
        //==========================================================================

        /**
         * Add a project to a workspace
         */
        addProjectToWorkspace: builder.mutation<
            ProjectOperationResponse,
            AddProjectToWorkspaceRequest
        >({
            query: ({ workspaceId, projectId }) => ({
                url: `/workspacesProjects/${workspaceId}/projects`,
                method: 'POST',
                body: { projectId }
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceProject', id: 'LIST' },
                { type: 'Workspace', id: workspaceId },
                { type: 'Workspace', id: workspaceId },
                'Project'
            ]
        }),

        /**
         * Remove a project from a workspace
         */
        removeProjectFromWorkspace: builder.mutation<
            ProjectOperationResponse,
            RemoveProjectFromWorkspaceRequest
        >({
            query: ({ workspaceId, projectId }) => ({
                url: `/workspacesProjects/${workspaceId}/projects`,
                method: 'DELETE',
                body: { projectId }
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceProject', id: 'LIST' },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Get all projects within a workspace
         */
        getWorkspaceProjects: builder.query<
            WorkspaceProjectsResponse,
            string | { workspaceId: string; limit?: number; page?: number; status?: string; category?: string }
        >({
            query: (arg) => {
                // Handle both string ID and object with query parameters
                const isStringId = typeof arg === 'string';
                const workspaceId = isStringId ? arg : arg.workspaceId;

                if (isStringId) {
                    return `/workspacesProjects/${workspaceId}/projects`;
                }

                // Build query with filters
                const { limit = 20, page = 1, status, category } = arg;

                const queryParams = new URLSearchParams();
                queryParams.append('limit', limit.toString());
                queryParams.append('page', page.toString());

                if (status) queryParams.append('status', status);
                if (category) queryParams.append('category', category);

                return `/workspacesProjects/${workspaceId}/projects?${queryParams.toString()}`;
            },
            providesTags: (result, error, arg) => {
                const workspaceId = typeof arg === 'string' ? arg : arg.workspaceId;
                return [
                    { type: 'WorkspaceProject', id: 'LIST' },
                    { type: 'Workspace', id: workspaceId }
                ];
            }
        }),

        /**
         * Set primary project for a workspace
         */
        setPrimaryWorkspaceProject: builder.mutation<
            ProjectOperationResponse,
            SetPrimaryWorkspaceProjectRequest
        >({
            query: ({ workspaceId, projectId }) => ({
                url: `/workspacesProjects/${workspaceId}/projects/primary`,
                method: 'PATCH',
                body: { projectId }
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceProject', id: 'LIST' },
                { type: 'Workspace', id: workspaceId }
            ]
        })
    })
});

/**
 * Export hooks for use in components
 */
export const {
    useAddProjectToWorkspaceMutation,
    useRemoveProjectFromWorkspaceMutation,
    useGetWorkspaceProjectsQuery,
    useSetPrimaryWorkspaceProjectMutation
} = workspaceProjectApiSlice;