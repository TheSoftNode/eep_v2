import { apiSlice } from "@/Redux/services/api";
import {
    GetActivitiesRequest,
    ActivitiesResponse,
    ApiResponse,
    CreateMilestoneRequest,
    UpdateMilestoneRequest,
    MilestoneResponse,
    MilestonesResponse
} from "@/Redux/types/Workspace/workspace-dtos";

export const workspaceActivityApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //==========================================================================
        // WORKSPACE ACTIVITY ENDPOINTS
        //==========================================================================

        /**
         * Get workspace activity log
         */
        getWorkspaceActivities: builder.query<ActivitiesResponse, GetActivitiesRequest>({
            query: ({ workspaceId, ...params }) => {
                const queryParams = new URLSearchParams();

                if (params.page) queryParams.append('page', params.page.toString());
                if (params.limit) queryParams.append('limit', params.limit.toString());
                if (params.startAfter) queryParams.append('startAfter', params.startAfter);
                if (params.entityType) queryParams.append('entityType', params.entityType);
                if (params.entityId) queryParams.append('entityId', params.entityId);
                if (params.userId) queryParams.append('userId', params.userId);
                if (params.fromDate) queryParams.append('fromDate', params.fromDate);
                if (params.toDate) queryParams.append('toDate', params.toDate);
                if (params.importance) queryParams.append('importance', params.importance);

                return `/workspacesActivities/${workspaceId}/activities?${queryParams.toString()}`;
            },
            providesTags: (result, error, arg) => [
                { type: 'WorkspaceActivity', id: arg.workspaceId }
            ]
        }),

        /**
         * Delete a specific workspace activity
         */
        deleteWorkspaceActivity: builder.mutation<ApiResponse, { workspaceId: string, activityId: string }>({
            query: ({ workspaceId, activityId }) => ({
                url: `/workspacesActivities/${workspaceId}/activities/${activityId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'WorkspaceActivity', id: arg.workspaceId }
            ]
        }),

        /**
         * Clear all activities for a workspace
         */
        clearAllWorkspaceActivities: builder.mutation<ApiResponse, { workspaceId: string }>({
            query: ({ workspaceId }) => ({
                url: `/workspacesActivities/${workspaceId}/activities`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'WorkspaceActivity', id: arg.workspaceId }
            ]
        }),

        //==========================================================================
        // WORKSPACE TIMELINE & MILESTONE ENDPOINTS
        //==========================================================================

        /**
         * Get workspace timeline data (milestones)
         */
        getWorkspaceTimeline: builder.query<MilestonesResponse, { workspaceId: string }>({
            query: ({ workspaceId }) => `/workspacesActivities/${workspaceId}/timeline`,
            providesTags: (result, error, arg) => [
                { type: 'WorkspaceMilestone', id: arg.workspaceId }
            ]
        }),

        /**
         * Create a new workspace milestone
         */
        createWorkspaceMilestone: builder.mutation<MilestoneResponse, CreateMilestoneRequest>({
            query: ({ workspaceId, ...data }) => ({
                url: `/workspacesActivities/${workspaceId}/milestones`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'WorkspaceMilestone', id: arg.workspaceId },
                { type: 'WorkspaceActivity', id: arg.workspaceId }
            ]
        }),

        /**
         * Update a workspace milestone
         */
        updateWorkspaceMilestone: builder.mutation<MilestoneResponse, UpdateMilestoneRequest & { workspaceId: string, milestoneId: string }>({
            query: ({ workspaceId, milestoneId, ...data }) => ({
                url: `/workspacesActivities/${workspaceId}/milestones/${milestoneId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'WorkspaceMilestone', id: arg.workspaceId },
                { type: 'WorkspaceActivity', id: arg.workspaceId }
            ]
        }),

        /**
         * Delete a workspace milestone
         */
        deleteWorkspaceMilestone: builder.mutation<ApiResponse, { workspaceId: string, milestoneId: string }>({
            query: ({ workspaceId, milestoneId }) => ({
                url: `/workspacesActivities/${workspaceId}/milestones/${milestoneId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'WorkspaceMilestone', id: arg.workspaceId },
                { type: 'WorkspaceActivity', id: arg.workspaceId }
            ]
        })
    })
});

export const {
    useGetWorkspaceActivitiesQuery,
    useDeleteWorkspaceActivityMutation,
    useClearAllWorkspaceActivitiesMutation,
    useGetWorkspaceTimelineQuery,
    useCreateWorkspaceMilestoneMutation,
    useUpdateWorkspaceMilestoneMutation,
    useDeleteWorkspaceMilestoneMutation
} = workspaceActivityApiSlice;