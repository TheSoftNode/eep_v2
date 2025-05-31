import {
    AddWorkspaceMemberRequest,
    UpdateWorkspaceMemberRequest,
    ApiResponse,
    MemberOperationResponse
} from "@/Redux/types/Workspace/workspace-dtos";
import { apiSlice } from "@/Redux/services/api";
import { WorkspaceMember, WorkspaceRole } from "@/Redux/types/Workspace/workspace";
import { MemberContributionResponse, MemberDetailsResponse, WorkspaceMembersResponse } from "@/Redux/types/Workspace/workspace-members";


/**
 * Workspace Members API Slice
 * Contains endpoints for managing members within workspaces
 */
export const workspaceMembersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //==========================================================================
        // WORKSPACE MEMBERS ENDPOINTS
        //==========================================================================

        /**
         * Add a user to a workspace (admin/mentor only)
         */
        addUserToWorkspace: builder.mutation<
            MemberOperationResponse,
            AddWorkspaceMemberRequest
        >({
            query: ({ workspaceId, ...data }) => ({
                url: `/workspacesMembers/${workspaceId}/members`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMember', id: 'LIST' },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Update a workspace member's role or permissions
         */
        updateWorkspaceMember: builder.mutation<
            MemberOperationResponse,
            { workspaceId: string; userId: string } & Omit<UpdateWorkspaceMemberRequest, 'workspaceId'>
        >({
            query: ({ workspaceId, userId, ...data }) => ({
                url: `/workspacesMembers/${workspaceId}/members/${userId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { workspaceId, userId }) => [
                { type: 'WorkspaceMember', id: userId },
                { type: 'WorkspaceMember', id: 'LIST' },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Remove a user from a workspace
         */
        removeUserFromWorkspace: builder.mutation<
            MemberOperationResponse,
            { workspaceId: string; userId: string; reason?: string }
        >({
            query: ({ workspaceId, userId, reason }) => ({
                url: `/workspacesMembers/${workspaceId}/members/${userId}`,
                method: 'DELETE',
                body: reason ? { reason } : undefined
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMember', id: 'LIST' },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Get all members in a workspace
         */
        getWorkspaceMembers: builder.query<
            WorkspaceMembersResponse,
            string | { workspaceId: string; role?: WorkspaceRole; active?: boolean }
        >({
            query: (arg) => {
                // Handle both string ID and object with query parameters
                const isStringId = typeof arg === 'string';
                const workspaceId = isStringId ? arg : arg.workspaceId;

                if (isStringId) {
                    return `/workspacesMembers/${workspaceId}/members`;
                }

                // Build query with filters
                const { role, active } = arg;

                const queryParams = new URLSearchParams();
                if (role) queryParams.append('role', role);
                if (active !== undefined) queryParams.append('active', active.toString());

                return `/workspacesMembers/${workspaceId}/members?${queryParams.toString()}`;
            },
            providesTags: (result, error, arg) => {
                const workspaceId = typeof arg === 'string' ? arg : arg.workspaceId;
                return [
                    { type: 'WorkspaceMember', id: 'LIST' },
                    { type: 'Workspace', id: workspaceId }
                ];
            }
        }),

        /**
         * Get a specific member by ID
         */
        getWorkspaceMemberById: builder.query<
            ApiResponse<WorkspaceMember>,
            { workspaceId: string; memberId: string }
        >({
            query: ({ workspaceId, memberId }) =>
                `/workspacesMembers/${workspaceId}/members/${memberId}`,
            providesTags: (result, error, { workspaceId, memberId }) => [
                { type: 'WorkspaceMember', id: memberId },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Get detailed information about a workspace member
         */
        getWorkspaceMemberDetails: builder.query<
            MemberDetailsResponse,
            { workspaceId: string; memberId: string }
        >({
            query: ({ workspaceId, memberId }) =>
                `/workspacesMembers/${workspaceId}/members/${memberId}/details`,
            providesTags: (result, error, { workspaceId, memberId }) => [
                { type: 'WorkspaceMember', id: memberId },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Get a member's contributions to a workspace
         */
        getWorkspaceMemberContributions: builder.query<
            MemberContributionResponse,
            { workspaceId: string; memberId: string; startDate?: string; endDate?: string }
        >({
            query: ({ workspaceId, memberId, startDate, endDate }) => {
                let url = `/workspacesMembers/${workspaceId}/members/${memberId}/contributions`;
                const params = new URLSearchParams();

                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);

                const queryString = params.toString();
                if (queryString) url += `?${queryString}`;

                return url;
            },
            providesTags: (result, error, { workspaceId, memberId }) => [
                { type: 'WorkspaceMember', id: memberId },
                { type: 'Workspace', id: workspaceId }
            ]
        })
    })
});

/**
 * Export hooks for use in components
 */
export const {
    useAddUserToWorkspaceMutation,
    useUpdateWorkspaceMemberMutation,
    useRemoveUserFromWorkspaceMutation,
    useGetWorkspaceMembersQuery,
    useGetWorkspaceMemberByIdQuery,
    useGetWorkspaceMemberDetailsQuery,
    useGetWorkspaceMemberContributionsQuery
} = workspaceMembersApiSlice;