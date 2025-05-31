import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../features/auth/authSlice';
import { RootState } from '../core/store';
import {
    IRememberMeResponse,

} from '../types/Users/user';


// Base query with auth header and token handling
const baseQuery = fetchBaseQuery({
    baseUrl: 'https://api-4b7msmz37a-uc.a.run.app/v1/eep',

    // baseUrl: 'http://127.0.0.1:5001/enterprise-edu/us-central1/api/v1/eep',

    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }
});

// Custom query function with token refresh handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    // Try the initial query
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401 Unauthorized error, the token might have expired
    if (result.error && result.error.status === 401) {
        // Get user email from state
        const email = (api.getState() as RootState).auth.user?.email;

        if (email) {
            // Try to refresh token using remember me endpoint
            const refreshResult = await baseQuery(
                {
                    url: '/auth/check-remember-me',
                    method: 'POST',
                    body: { email }
                },
                api,
                extraOptions
            );

            const refreshData = refreshResult.data as IRememberMeResponse;

            // If refresh successful, update auth state and retry original query
            if (refreshData?.success && refreshData?.autoLogin && refreshData.user && refreshData.token) {
                // Store the new token
                api.dispatch(setCredentials({
                    user: refreshData.user,
                    token: refreshData.token
                }));

                // Retry the original query with new token
                result = await baseQuery(args, api, extraOptions);
            } else {
                // If refresh failed, log out
                api.dispatch(logout());
            }
        } else {
            // No user email in state, just log out
            api.dispatch(logout());
        }
    }

    return result;
};

// Create our base API slice
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User',
        'Profile',
        'Mentor',
        'Session',
        'Notification',
        'Workspace',
        'Project',
        'ProjectArea',
        'AreaTask',
        'Task',
        'ProjectTasks',
        'AreaTasks',
        'AdminUser',
        'ProjectMember',
        'ProjectActivity',
        'ProjectResource',
        'ProjectFeedback',
        'ProjectUpdate',
        'JoinRequest',
        'WorkspaceMember',
        'WorkspaceProject',
        'WorkspaceActivity',
        'WorkspaceMilestone',
        'WorkspaceFile',
        'WorkspaceFolder',
        'FileShare',
        'WorkspaceInvitation',
        'ProjectLearningPath',
        'ProjectLearningProgress',
        'LearningMilestone',
        'LearningSkill',
        'LearningAnalytics',
        'ProjectDashboard',
        'AuditLog',
        'Application',
        'Contact',
        'CommunicationsStats',
        'Newsletter',
        'Deployment',
        'ProjectMilestone',
        'Message',
        'MessageThread',
        'MessageStats',
        'Conversation',
        'Message',
        'Contact',
        'UnreadCount',
        'WorkspaceMessage',
        'PinnedMessage',
        'WorkspaceAttachment'
    ],
    endpoints: () => ({}),
});