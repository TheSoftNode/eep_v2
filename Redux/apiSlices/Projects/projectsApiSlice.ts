import { customFetchBase } from "@/Redux/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

// Import common types
// Import project-related types
import {
    Project,
    ProjectResponse,
    ProjectsResponse,
    ProjectMemberResponse,
    ProjectMembersResponse,
    MemberContributionsResponse,
    ProjectActivitiesResponse,
    ProjectActivityResponse,
    ProjectResourceResponse,
    ProjectResourcesResponse,
    ProjectFeedbackResponse,
    ProjectFeedbacksResponse,
    ProjectUpdateResponse,
    ProjectUpdatesResponse,
    ApiResponse,
    PaginatedResponse
} from "@/Redux/types/Projects";

// Import request types
import {
    CreateProjectRequest,
    UpdateProjectRequest,
    AddMemberRequest,
    UpdateMemberRoleRequest,
    UpdateProgressRequest,
    SearchProjectsRequest,
    AddProjectResourceRequest,
    AddFeedbackRequest,
    ProgressUpdateRequest
} from "@/Redux/types/Projects";
import { apiSlice } from "@/Redux/services/api";


// Define query param interfaces
export interface ProjectQueryParams {
    category?: string;
    status?: string;
    cursor?: string;
    limit?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
    level?: 'beginner' | 'intermediate' | 'advanced' | "all";
}

// Define join request interfaces
export interface JoinRequestResponse extends ApiResponse<{
    id: string;
    projectId: string;
    projectName: string;
    userId: string;
    userName: string;
    userAvatar: string | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    processedBy?: string;
    processedAt?: string;
}> { }

export interface JoinRequestsResponse extends PaginatedResponse<{
    id: string;
    projectId: string;
    projectName: string;
    userId: string;
    userName: string;
    userAvatar: string | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    processedBy?: string;
    processedAt?: string;
}> { }

export interface ProcessJoinRequestRequest {
    action: 'approve' | 'reject';
}



/**
 * Projects API Slice
 * Contains endpoints for managing projects and related entities
 */
export const projectsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //==========================================================================
        // PROJECT CORE ENDPOINTS
        //==========================================================================

        /**
         * Create a new project
         */
        createProject: builder.mutation<
            ProjectResponse,
            CreateProjectRequest
        >({
            query: (data) => ({
                url: '/projects',
                method: 'POST',
                body: data
            }),
            invalidatesTags: [{ type: 'Project', id: 'LIST' }]
        }),
        getProjects: builder.query<ProjectsResponse, ProjectQueryParams>({
            query: (params) => {
                const {
                    category,
                    status,
                    cursor,
                    limit = 20,
                    orderBy = 'updatedAt',
                    order = 'desc',
                    level
                } = params;

                let url = `/projects?limit=${limit}`;
                if (category && category !== 'all') url += `&category=${category}`;
                if (status && status !== 'all') url += `&status=${status}`;
                if (cursor) url += `&cursor=${cursor}`;
                if (orderBy) url += `&orderBy=${orderBy}`;
                if (order) url += `&order=${order}`;
                if (level && level !== 'all') url += `&level=${level}`;

                return url;
            },
            providesTags: (result) => [
                ...(result?.data?.map(({ id }) => ({ type: 'Project' as const, id })) || []),
                { type: 'Project', id: 'LIST' }
            ],
            transformResponse: (response: ProjectsResponse) => ({
                ...response,
                data: response.data || []
            }),
            // Optional error handling
            transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
                console.error('Projects query failed:', response);
                return {
                    data: [],
                    page: 1,
                    limit: 20,
                    total: 0,
                    hasNextPage: false,
                    error: response.data?.message || 'Unknown error'
                };
            }
        }),

        /**
         * Get a specific project by ID
         */
        getProjectById: builder.query<
            ProjectResponse,
            string
        >({
            query: (id) => `/projects/${id}`,
            providesTags: (result, error, id) => [{ type: 'Project', id }]
        }),

        /**
         * Update a project
         */
        updateProject: builder.mutation<
            ProjectResponse,
            UpdateProjectRequest
        >({
            query: ({ id, ...data }) => ({
                url: `/projects/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Project', id },
                { type: 'Project', id: 'LIST' }
            ]
        }),

        /**
         * Delete a project
         */
        deleteProject: builder.mutation<
            ApiResponse<null>,
            string
        >({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Project', id: 'LIST' }]
        }),

        /**
         * Search for projects based on criteria
         */
        searchProjects: builder.query<
            ProjectsResponse,
            SearchProjectsRequest
        >({
            query: (params) => {
                const queryParams = new URLSearchParams();

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        if (Array.isArray(value)) {
                            value.forEach(item => queryParams.append(`${key}[]`, item));
                        } else if (typeof value === 'object') {
                            Object.entries(value).forEach(([subKey, subValue]) => {
                                if (subValue !== undefined) {
                                    queryParams.append(`${key}.${subKey}`, String(subValue));
                                }
                            });
                        } else {
                            queryParams.append(key, String(value));
                        }
                    }
                });

                return `/projects/search?${queryParams.toString()}`;
            },
            providesTags: [{ type: 'Project', id: 'SEARCH' }]
        }),

        /**
         * Update project progress
         */
        updateProjectProgress: builder.mutation<
            ProjectResponse,
            { id: string } & UpdateProgressRequest
        >({
            query: ({ id, ...data }) => ({
                url: `/projects/${id}/progress`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Project', id },
                { type: 'Project', id: 'LIST' }
            ]
        }),

        //==========================================================================
        // PROJECT MEMBERS ENDPOINTS
        //==========================================================================

        /**
         * Add a member to a project
         */
        addProjectMember: builder.mutation<
            ProjectMemberResponse,
            { id: string } & AddMemberRequest
        >({
            query: ({ id, ...data }) => ({
                url: `/projects/${id}/members`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Project', id },
                { type: 'ProjectMember', id: 'LIST' }
            ]
        }),

        /**
         * Get all members of a project
         */
        getProjectMembers: builder.query<
            ProjectMembersResponse,
            string
        >({
            query: (id) => `/projects/${id}/members`,
            providesTags: (result, error, id) => [
                { type: 'ProjectMember', id: 'LIST' },
                { type: 'Project', id }
            ]
        }),

        /**
         * Update a member's role in a project
         */
        updateMemberRole: builder.mutation<
            ProjectMemberResponse,
            { id: string; memberId: string } & UpdateMemberRoleRequest
        >({
            query: ({ id, memberId, ...data }) => ({
                url: `/projects/${id}/members/${memberId}/role`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id, memberId }) => [
                { type: 'ProjectMember', id: memberId },
                { type: 'ProjectMember', id: 'LIST' },
                { type: 'Project', id }
            ]
        }),

        /**
         * Remove a member from a project
         */
        removeProjectMember: builder.mutation<
            ApiResponse<null>,
            { id: string; memberId: string; reassignTasksTo?: string }
        >({
            query: ({ id, memberId, reassignTasksTo }) => ({
                url: `/projects/${id}/members/${memberId}`,
                method: 'DELETE',
                body: reassignTasksTo ? { reassignTasksTo } : undefined
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'ProjectMember', id: 'LIST' },
                { type: 'Project', id }
            ]
        }),

        /**
         * Get a member's contributions to a project
         */
        getMemberContributions: builder.query<
            MemberContributionsResponse,
            { id: string; memberId: string }
        >({
            query: ({ id, memberId }) => `/projects/${id}/members/${memberId}/contributions`,
            providesTags: (result, error, { id, memberId }) => [
                { type: 'ProjectMember', id: memberId }
            ]
        }),

        //==========================================================================
        // PROJECT ACTIVITIES ENDPOINTS
        //==========================================================================

        /**
         * Get project activities with pagination and filtering
         */
        getProjectActivity: builder.query<
            ProjectActivitiesResponse,
            { id: string; page?: number; limit?: number; scope?: string; sortBy?: string; sortDirection?: 'asc' | 'desc' }
        >({
            query: ({ id, page = 1, limit = 20, scope, sortBy = 'createdAt', sortDirection = 'desc' }) => {
                let url = `/projects/${id}/activities?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
                if (scope) url += `&scope=${scope}`;
                return url;
            },
            providesTags: (result, error, { id }) => [
                { type: 'ProjectActivity', id: 'LIST' },
                { type: 'Project', id }
            ]
        }),

        /**
         * Get project activity statistics
         */
        getProjectActivityStats: builder.query<
            ApiResponse<{
                total: number;
                byDate: Record<string, number>;
                byUser: Array<{ userId: string; userName: string; count: number }>;
                byType: Record<string, number>;
                byScope: Record<string, number>;
                latestActivityDate: string | null;
            }>,
            string
        >({
            query: (id) => `/projects/${id}/activities/stats`,
            providesTags: (result, error, id) => [
                { type: 'ProjectActivity', id: 'STATS' },
                { type: 'Project', id }
            ]
        }),

        /**
         * Clear all project activities (with option to keep system events)
         */
        clearAllProjectActivities: builder.mutation<
            ApiResponse<{ deletedCount: number }>,
            { id: string; keepSystemEvents?: boolean }
        >({
            query: ({ id, keepSystemEvents }) => ({
                url: `/projects/${id}/activities`,
                method: 'DELETE',
                body: { keepSystemEvents }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'ProjectActivity', id: 'LIST' },
                { type: 'ProjectActivity', id: 'STATS' },
                { type: 'Project', id }
            ]
        }),

        /**
         * Delete a specific project activity
         */
        deleteProjectActivity: builder.mutation<
            ProjectActivityResponse,
            { projectId: string; activityId: string }
        >({
            query: ({ projectId, activityId }) => ({
                url: `/projects/${projectId}/activities/${activityId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectActivity', id: 'LIST' },
                { type: 'ProjectActivity', id: 'STATS' },
                { type: 'Project', id: projectId }
            ]
        }),

        /**
         * Get activities for a specific project resource
         */
        getResourceActivities: builder.query<
            ProjectActivitiesResponse,
            { projectId: string; resourceId: string }
        >({
            query: ({ projectId, resourceId }) =>
                `/projects/${projectId}/resources/${resourceId}/activities`,
            providesTags: (result, error, { projectId, resourceId }) => [
                { type: 'ProjectActivity', id: resourceId },
                { type: 'ProjectResource', id: resourceId }
            ]
        }),

        //==========================================================================
        // PROJECT JOIN REQUESTS ENDPOINTS
        //==========================================================================

        /**
         * Request to join a project
         */
        requestToJoinProject: builder.mutation<
            JoinRequestResponse,
            string
        >({
            query: (id) => ({
                url: `/projects/${id}/join-request`,
                method: 'POST'
            }),
            invalidatesTags: [{ type: 'JoinRequest', id: 'LIST' }]
        }),

        /**
         * Get all join requests for a project
         */
        getProjectJoinRequests: builder.query<
            JoinRequestsResponse,
            { id: string; status?: 'pending' | 'approved' | 'rejected' }
        >({
            query: ({ id, status }) => {
                let url = `/projects/${id}/join-requests`;
                if (status) url += `?status=${status}`;
                return url;
            },
            providesTags: (result, error, { id }) => [
                { type: 'JoinRequest', id: 'LIST' },
                { type: 'Project', id }
            ]
        }),

        /**
         * Process (approve/reject) a join request
         */
        processJoinRequest: builder.mutation<
            JoinRequestResponse,
            { requestId: string } & ProcessJoinRequestRequest
        >({
            query: ({ requestId, ...data }) => ({
                url: `/projects/join-requests/${requestId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: [
                { type: 'JoinRequest', id: 'LIST' },
                { type: 'Project', id: 'LIST' },
                { type: 'ProjectMember', id: 'LIST' }
            ]
        }),

        /**
         * Get all join requests made by the current user
         */
        getUserJoinRequests: builder.query<
            JoinRequestsResponse,
            { status?: 'pending' | 'approved' | 'rejected' }
        >({
            query: ({ status }) => {
                let url = `/projects/user/join-requests`;
                if (status) url += `?status=${status}`;
                return url;
            },
            providesTags: [{ type: 'JoinRequest', id: 'USER' }]
        }),

        //==========================================================================
        // PROJECT RESOURCES ENDPOINTS
        //==========================================================================

        /**
         * Add a resource to a project
         */
        addProjectResource: builder.mutation<
            ProjectResourceResponse,
            { projectId: string } & AddProjectResourceRequest
        >({
            query: ({ projectId, ...data }) => ({
                url: `/projects/${projectId}/resources`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectResource', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        /**
         * Get all resources for a project with filtering
         */
        getProjectResources: builder.query<
            ProjectResourcesResponse,
            { projectId: string; category?: string; type?: string; tags?: string[] }
        >({
            query: ({ projectId, category, type, tags }) => {
                let url = `/projects/${projectId}/resources`;
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (type) params.append('type', type);
                if (tags && tags.length > 0) {
                    tags.forEach(tag => params.append('tags[]', tag));
                }

                const queryString = params.toString();
                if (queryString) url += `?${queryString}`;

                return url;
            },
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectResource', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        /**
         * Update a project resource
         */
        updateProjectResource: builder.mutation<
            ProjectResourceResponse,
            { projectId: string; resourceId: string; data: Partial<AddProjectResourceRequest> }
        >({
            query: ({ projectId, resourceId, data }) => ({
                url: `/projects/${projectId}/resources/${resourceId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { projectId, resourceId }) => [
                { type: 'ProjectResource', id: resourceId },
                { type: 'ProjectResource', id: 'LIST' }
            ]
        }),

        /**
         * Delete a project resource
         */
        deleteProjectResource: builder.mutation<
            ApiResponse<null>,
            { projectId: string; resourceId: string }
        >({
            query: ({ projectId, resourceId }) => ({
                url: `/projects/${projectId}/resources/${resourceId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectResource', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        //==========================================================================
        // PROJECT FEEDBACK ENDPOINTS
        //==========================================================================

        /**
         * Add feedback to a project
         */
        addProjectFeedback: builder.mutation<
            ProjectFeedbackResponse,
            { projectId: string } & AddFeedbackRequest
        >({
            query: ({ projectId, ...data }) => ({
                url: `/projects/${projectId}/feedback`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectFeedback', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        /**
         * Get all feedback for a project
         */
        getProjectFeedback: builder.query<
            ProjectFeedbacksResponse,
            { projectId: string; type?: string; page?: number; limit?: number }
        >({
            query: ({ projectId, type, page = 1, limit = 20 }) => {
                let url = `/projects/${projectId}/feedback?page=${page}&limit=${limit}`;
                if (type) url += `&type=${type}`;
                return url;
            },
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectFeedback', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        /**
         * Update existing project feedback
         */
        updateProjectFeedback: builder.mutation<
            ProjectFeedbackResponse,
            { projectId: string; feedbackId: string; data: Partial<AddFeedbackRequest> }
        >({
            query: ({ projectId, feedbackId, data }) => ({
                url: `/projects/${projectId}/feedback/${feedbackId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { projectId, feedbackId }) => [
                { type: 'ProjectFeedback', id: feedbackId },
                { type: 'ProjectFeedback', id: 'LIST' }
            ]
        }),

        /**
         * Delete project feedback
         */
        deleteProjectFeedback: builder.mutation<
            ApiResponse<null>,
            { projectId: string; feedbackId: string }
        >({
            query: ({ projectId, feedbackId }) => ({
                url: `/projects/${projectId}/feedback/${feedbackId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectFeedback', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        //==========================================================================
        // PROJECT UPDATES ENDPOINTS
        //==========================================================================

        /**
         * Add a progress update to a project
         */
        addProjectUpdate: builder.mutation<
            ProjectUpdateResponse,
            { projectId: string } & ProgressUpdateRequest
        >({
            query: ({ projectId, ...data }) => ({
                url: `/projects/${projectId}/updates`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectUpdate', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        /**
         * Get all updates for a project
         */
        getProjectUpdates: builder.query<
            ProjectUpdatesResponse,
            { projectId: string; page?: number; limit?: number }
        >({
            query: ({ projectId, page = 1, limit = 10 }) =>
                `/projects/${projectId}/updates?page=${page}&limit=${limit}`,
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectUpdate', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        /**
         * Get a specific project update
         */
        getProjectUpdate: builder.query<
            ProjectUpdateResponse,
            { projectId: string; updateId: string }
        >({
            query: ({ projectId, updateId }) =>
                `/projects/${projectId}/updates/${updateId}`,
            providesTags: (result, error, { updateId }) => [
                { type: 'ProjectUpdate', id: updateId }
            ]
        }),

        /**
         * Update an existing project progress update
         */
        updateProjectUpdate: builder.mutation<
            ProjectUpdateResponse,
            { projectId: string; updateId: string; data: Partial<ProgressUpdateRequest> }
        >({
            query: ({ projectId, updateId, data }) => ({
                url: `/projects/${projectId}/updates/${updateId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { projectId, updateId }) => [
                { type: 'ProjectUpdate', id: updateId },
                { type: 'ProjectUpdate', id: 'LIST' }
            ]
        }),

        /**
         * Delete a project update
         */
        deleteProjectUpdate: builder.mutation<
            ApiResponse<null>,
            { projectId: string; updateId: string }
        >({
            query: ({ projectId, updateId }) => ({
                url: `/projects/${projectId}/updates/${updateId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectUpdate', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        /**
         * Publish a project update draft
         */
        publishProjectUpdate: builder.mutation<
            ProjectUpdateResponse,
            { projectId: string; updateId: string }
        >({
            query: ({ projectId, updateId }) => ({
                url: `/projects/${projectId}/updates/${updateId}/publish`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, { projectId, updateId }) => [
                { type: 'ProjectUpdate', id: updateId },
                { type: 'ProjectUpdate', id: 'LIST' }
            ]
        })
    })
});

/**
 * Export hooks for use in components
 */
export const {
    // Project endpoints
    useCreateProjectMutation,
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useSearchProjectsQuery,
    useUpdateProjectProgressMutation,

    // Project members endpoints
    useAddProjectMemberMutation,
    useGetProjectMembersQuery,
    useUpdateMemberRoleMutation,
    useRemoveProjectMemberMutation,
    useGetMemberContributionsQuery,

    // Project activities endpoints
    useGetProjectActivityQuery,
    useGetProjectActivityStatsQuery,
    useClearAllProjectActivitiesMutation,
    useDeleteProjectActivityMutation,
    useGetResourceActivitiesQuery,

    // Project join requests endpoints
    useRequestToJoinProjectMutation,
    useGetProjectJoinRequestsQuery,
    useProcessJoinRequestMutation,
    useGetUserJoinRequestsQuery,

    // Project resources endpoints
    useAddProjectResourceMutation,
    useGetProjectResourcesQuery,
    useUpdateProjectResourceMutation,
    useDeleteProjectResourceMutation,

    // Project feedback endpoints
    useAddProjectFeedbackMutation,
    useGetProjectFeedbackQuery,
    useUpdateProjectFeedbackMutation,
    useDeleteProjectFeedbackMutation,

    // Project updates endpoints
    useAddProjectUpdateMutation,
    useGetProjectUpdatesQuery,
    useGetProjectUpdateQuery,
    useUpdateProjectUpdateMutation,
    useDeleteProjectUpdateMutation,
    usePublishProjectUpdateMutation
} = projectsApiSlice;