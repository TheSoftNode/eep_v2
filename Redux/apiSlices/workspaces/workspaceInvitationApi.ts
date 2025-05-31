// Import workspace invitation types
import {
    WorkspaceRole
} from "@/Redux/types/Workspace/workspace";

// Import request and response types
import {
    CreateWorkspaceInvitationRequest,
    JoinWorkspaceRequest,
    RespondToInvitationRequest,
    InvitationResponse,
    InvitationsResponse
} from "@/Redux/types/Workspace/workspace-dtos";
import { apiSlice } from "@/Redux/services/api";

/**
 * Workspace Invitations API Slice
 * Contains endpoints for managing workspace invitations and join requests
 */
export const workspaceInvitationsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //==========================================================================
        // WORKSPACE INVITATIONS ENDPOINTS
        //==========================================================================

        /**
         * Create an invitation to join a workspace
         */
        createInvitation: builder.mutation<
            InvitationResponse,
            { workspaceId: string } & CreateWorkspaceInvitationRequest
        >({
            query: ({ workspaceId, ...data }) => ({
                url: `/workspacesInvites/${workspaceId}/invitations`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceInvitation', id: 'LIST' },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Get all invitations for a workspace
         */
        getWorkspaceInvitations: builder.query<
            InvitationsResponse,
            { workspaceId: string; status?: string }
        >({
            query: ({ workspaceId, status }) => {
                let url = `/workspacesInvites/${workspaceId}/invitations`;
                if (status) url += `?status=${status}`;
                return url;
            },
            providesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceInvitation', id: 'LIST' },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Get all invitations for the current user
         */
        getUserInvitations: builder.query<
            InvitationsResponse,
            { status?: string }
        >({
            query: ({ status = 'pending' }) => `/invitations/user?status=${status}`,
            providesTags: [{ type: 'WorkspaceInvitation', id: 'USER' }]
        }),

        /**
         * Respond to a workspace invitation (accept or decline)
         */
        respondToInvitation: builder.mutation<
            InvitationResponse,
            { invitationId: string } & RespondToInvitationRequest
        >({
            query: ({ invitationId, ...data }) => ({
                url: `/invitations/${invitationId}/respond`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result) => [
                { type: 'WorkspaceInvitation', id: 'USER' },
                { type: 'WorkspaceInvitation', id: 'LIST' },
                { type: 'WorkspaceMember', id: 'LIST' },
                { type: 'Workspace', id: 'LIST' }
            ]
        }),

        /**
         * Cancel an invitation (for the sender)
         */
        cancelInvitation: builder.mutation<
            InvitationResponse,
            string
        >({
            query: (invitationId) => ({
                url: `/invitations/${invitationId}/cancel`,
                method: 'POST'
            }),
            invalidatesTags: [
                { type: 'WorkspaceInvitation', id: 'LIST' },
                { type: 'WorkspaceInvitation', id: 'USER' }
            ]
        }),

        //==========================================================================
        // WORKSPACE JOIN REQUESTS ENDPOINTS
        //==========================================================================

        /**
         * Request to join a workspace (for public/findable workspacesInvites)
         */
        requestToJoinWorkspace: builder.mutation<
            InvitationResponse,
            { workspaceId: string } & JoinWorkspaceRequest
        >({
            query: ({ workspaceId, ...data }) => ({
                url: `/workspacesInvites/${workspaceId}/join-request`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: [
                { type: 'WorkspaceInvitation', id: 'USER' },
                { type: 'Workspace', id: 'LIST' }
            ]
        }),

        /**
         * Respond to a join request (for workspace admins/mentors)
         */
        respondToJoinRequest: builder.mutation<
            InvitationResponse,
            { requestId: string; accept: boolean; message?: string; assignedRole?: WorkspaceRole }
        >({
            query: ({ requestId, ...data }) => ({
                url: `/invitations/${requestId}/respond-join-request`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result) => [
                { type: 'WorkspaceInvitation', id: 'LIST' },
                { type: 'WorkspaceMember', id: 'LIST' },
                { type: 'Workspace', id: 'LIST' }
            ]
        }),

        /**
         * Get join requests for a workspace
         */
        getJoinRequests: builder.query<
            InvitationsResponse,
            { workspaceId: string; status?: string }
        >({
            query: ({ workspaceId, status = 'pending' }) =>
                `/workspacesInvites/${workspaceId}/join-requests?status=${status}`,
            providesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceInvitation', id: 'JOIN_REQUESTS' },
                { type: 'Workspace', id: workspaceId }
            ]
        }),

        /**
         * Withdraw a join request (for the user who sent it)
         */
        withdrawJoinRequest: builder.mutation<
            InvitationResponse,
            string
        >({
            query: (requestId) => ({
                url: `/workspacesInvites/join-requests/${requestId}/withdraw`,
                method: 'POST'
            }),
            invalidatesTags: [
                { type: 'WorkspaceInvitation', id: 'USER' },
                { type: 'WorkspaceInvitation', id: 'JOIN_REQUESTS' }
            ]
        })
    })
});

/**
 * Export hooks for use in components
 */
export const {
    useCreateInvitationMutation,
    useGetWorkspaceInvitationsQuery,
    useGetUserInvitationsQuery,
    useRespondToInvitationMutation,
    useCancelInvitationMutation,
    useRequestToJoinWorkspaceMutation,
    useRespondToJoinRequestMutation,
    useGetJoinRequestsQuery,
    useWithdrawJoinRequestMutation
} = workspaceInvitationsApiSlice;