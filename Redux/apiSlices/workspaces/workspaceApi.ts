// Import request and response types
import {
    CreateWorkspaceRequest,
    UpdateWorkspaceRequest,
    GetWorkspacesRequest,
    GetWorkspaceRequest,
    WorkspaceResponse,
    WorkspacesResponse,
} from "@/Redux/types/Workspace/workspace-dtos";
import { apiSlice } from "@/Redux/services/api";

// Import project-related types

/**
 * Workspace API Slice
 * Contains endpoints for managing workspaces and related entities
 */
export const workspaceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //==========================================================================
        // WORKSPACE MANAGEMENT ENDPOINTS
        //==========================================================================

        /**
         * Create a new workspace (admin or mentor only)
         */
        createWorkspace: builder.mutation<
            WorkspaceResponse,
            CreateWorkspaceRequest
        >({
            query: (data) => ({
                url: '/workspaces',
                method: 'POST',
                body: data
            }),
            invalidatesTags: [{ type: 'Workspace', id: 'LIST' }]
        }),

        /**
         * Get all workspaces (admin: all, mentor/learner: limited)
         */

        getAllWorkspaces: builder.query<
            WorkspacesResponse,
            Partial<GetWorkspacesRequest>
        >({
            query: (params = {}) => {
                const {
                    page = 1,
                    limit = 10,
                    lastDocId,
                    status,
                    memberId,
                    mentorId,
                    role,
                    projectId,
                    search,
                    tags,
                    projectType,
                    orderBy = 'updatedAt',
                    orderDirection = 'desc',
                    includeProjects,
                    includeMemberCount
                } = params;

                // Build query string
                const queryParams = new URLSearchParams();
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());

                if (lastDocId) queryParams.append('lastDocId', lastDocId);
                if (status) {
                    if (Array.isArray(status)) {
                        status.forEach(s => queryParams.append('status[]', s));
                    } else {
                        queryParams.append('status', status);
                    }
                }
                if (memberId) queryParams.append('memberId', memberId);
                if (mentorId) queryParams.append('mentorId', mentorId);
                if (role) queryParams.append('role', role);
                if (projectId) queryParams.append('projectId', projectId);
                if (search) queryParams.append('search', search);
                if (tags && Array.isArray(tags)) {
                    tags.forEach(tag => queryParams.append('tags[]', tag));
                }
                if (projectType) queryParams.append('projectType', projectType);
                if (orderBy) queryParams.append('orderBy', orderBy);
                if (orderDirection) queryParams.append('orderDirection', orderDirection);
                if (includeProjects !== undefined) queryParams.append('includeProjects', includeProjects.toString());
                if (includeMemberCount !== undefined) queryParams.append('includeMemberCount', includeMemberCount.toString());

                return `/workspaces?${queryParams.toString()}`;
            },
            providesTags: (result) => {
                // Check if result and result.data exist and are not empty
                if (result?.data && result.data.length > 0) {
                    return [
                        ...result.data.map(({ id }) => ({ type: 'Workspace' as const, id })),
                        { type: 'Workspace', id: 'LIST' }
                    ];
                }
                // Default case when result or result.data is undefined/empty
                return [{ type: 'Workspace', id: 'LIST' }];
            }
        }),

        /**
         * Get one workspace by ID with detailed information
         */
        getWorkspaceById: builder.query<
            WorkspaceResponse,
            string | Partial<GetWorkspaceRequest & { id: string }>
        >({
            query: (arg) => {
                // Handle both string ID and object with query parameters
                const isStringId = typeof arg === 'string';
                const id = isStringId ? arg : arg.id;

                if (isStringId) {
                    return `/workspaces/${id}`;
                }

                // Build query with options
                const {
                    includeMembers,
                    includeProjects,
                    includeMilestones,
                    includeActivity,
                    includeProgress,
                    activityLimit
                } = arg;

                const queryParams = new URLSearchParams();

                if (includeMembers !== undefined) queryParams.append('includeMembers', includeMembers.toString());
                if (includeProjects !== undefined) queryParams.append('includeProjects', includeProjects.toString());
                if (includeMilestones !== undefined) queryParams.append('includeMilestones', includeMilestones.toString());
                if (includeActivity !== undefined) queryParams.append('includeActivity', includeActivity.toString());
                if (includeProgress !== undefined) queryParams.append('includeProgress', includeProgress.toString());
                if (activityLimit !== undefined) queryParams.append('activityLimit', activityLimit.toString());

                const queryString = queryParams.toString();
                return `/workspaces/${id}${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: (result, error, arg) => {
                const id = typeof arg === 'string' ? arg : arg.id;
                return [
                    { type: 'Workspace', id },
                    { type: 'WorkspaceMember', id: 'LIST' },
                    { type: 'WorkspaceProject', id: 'LIST' },
                    { type: 'WorkspaceMilestone', id: 'LIST' },
                    { type: 'WorkspaceActivity', id: 'LIST' }
                ];
            }
        }),

        /**
         * Update a workspace
         */
        updateWorkspace: builder.mutation<
            WorkspaceResponse,
            UpdateWorkspaceRequest
        >({
            query: ({ workspaceId, ...data }) => ({
                url: `/workspaces/${workspaceId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'Workspace', id: workspaceId },
                { type: 'Workspace', id: 'LIST' }
            ]
        })
    })
});

/**
 * Export hooks for use in components
 */
export const {
    useCreateWorkspaceMutation,
    useGetAllWorkspacesQuery,
    useGetWorkspaceByIdQuery,
    useUpdateWorkspaceMutation
} = workspaceApiSlice;