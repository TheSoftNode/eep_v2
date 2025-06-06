import { apiSlice } from "@/Redux/services/api";
import {
    NotificationResponse,
    NotificationStats,
    NotificationType,
    FormattedNotification,
    NotificationCategoryCount
} from "@/Redux/types/Notifications/notification";
import { NotificationChannelPreferences } from "@/Redux/types/Users/user";

// Define interfaces for the response types
export interface UpdatePreferencesResponse {
    success: boolean;
    message: string;
    data: NotificationChannelPreferences;
}

export interface GetPreferencesResponse {
    success: boolean;
    data: NotificationChannelPreferences;
}

export interface GetStatsResponse {
    success: boolean;
    data: NotificationStats;
}

export interface BasicResponse {
    success: boolean;
    message: string;
}

// Type for notification query params
export interface NotificationQueryParams {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: NotificationType | 'all';
}

// Properly typed NotificationResponse
export interface TypedNotificationResponse extends Omit<NotificationResponse, 'data'> {
    success: boolean;
    message?: string;
    data: FormattedNotification[];
    count?: number;
    unreadCount?: number;
    categories?: NotificationCategoryCount;
    page?: number;
    totalPages?: number;
}

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<
            TypedNotificationResponse,
            NotificationQueryParams
        >({
            query: ({ page = 1, limit = 20, unreadOnly = false, type }) => {
                let url = `/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`;
                if (type && type !== 'all') {
                    url += `&type=${type}`;
                }
                return url;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Notification' as const, id })),
                        { type: 'Notification', id: 'LIST' }
                    ]
                    : [{ type: 'Notification', id: 'LIST' }]
        }),

        getNotificationStats: builder.query<
            GetStatsResponse,
            void
        >({
            query: () => '/notifications/stats',
            providesTags: [{ type: 'Notification', id: 'STATS' }]
        }),

        getNotificationPreferences: builder.query<
            GetPreferencesResponse,
            void
        >({
            query: () => '/notifications/preferences',
            providesTags: [{ type: 'Notification', id: 'PREFERENCES' }]
        }),

        updateNotificationPreferences: builder.mutation<
            UpdatePreferencesResponse,
            { preferences: NotificationChannelPreferences }
        >({
            query: ({ preferences }) => ({
                url: '/notifications/preferences',
                method: 'PATCH',
                body: { preferences }
            }),
            invalidatesTags: [{ type: 'Notification', id: 'PREFERENCES' }]
        }),

        markNotificationRead: builder.mutation<
            BasicResponse,
            string
        >({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PATCH'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Notification', id },
                { type: 'Notification', id: 'LIST' },
                { type: 'Notification', id: 'STATS' }
            ]
        }),

        markAllNotificationsRead: builder.mutation<
            BasicResponse,
            void
        >({
            query: () => ({
                url: '/notifications/mark-all-read',
                method: 'PATCH'
            }),
            invalidatesTags: [
                { type: 'Notification', id: 'LIST' },
                { type: 'Notification', id: 'STATS' }
            ]
        }),

        deleteNotification: builder.mutation<
            BasicResponse,
            string
        >({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Notification', id },
                { type: 'Notification', id: 'LIST' },
                { type: 'Notification', id: 'STATS' }
            ]
        }),

        clearAllNotifications: builder.mutation<
            BasicResponse,
            void
        >({
            query: () => ({
                url: '/notifications/clear-all',
                method: 'DELETE'
            }),
            invalidatesTags: [
                { type: 'Notification', id: 'LIST' },
                { type: 'Notification', id: 'STATS' }
            ]
        })
    }),
    overrideExisting: true
});

export const {
    useGetNotificationsQuery,
    useGetNotificationStatsQuery,
    useGetNotificationPreferencesQuery,
    useUpdateNotificationPreferencesMutation,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
    useDeleteNotificationMutation,
    useClearAllNotificationsMutation
} = notificationsApi;
