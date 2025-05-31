import { apiSlice } from "@/Redux/services/api";
import {
    Application,
    Contact,
    NewsletterSubscription,
    ApplicationQueryParams,
    ContactQueryParams,
    NewsletterQueryParams,
    PaginatedResponse,
    StatusUpdateRequest,
    BulkUpdateRequest,
    CommunicationsStatsResponse,
    SubmissionResponse,
    LearnerContactForm,
    BusinessContactForm,
    NewsletterSubscriptionForm
} from "@/Redux/types/Communication/communication";

export const communicationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Public submission endpoints

        submitLearnerApplication: builder.mutation({
            query: (formData) => ({
                url: '/communications/applications/learner',
                method: 'POST',
                body: formData,

            }),
            invalidatesTags: [{ type: 'Application', id: 'LIST' }]
        }),

        submitBusinessApplication: builder.mutation({
            query: (applicationData) => ({
                url: '/communications/applications/business',
                method: 'POST',
                body: applicationData
            }),
            invalidatesTags: [{ type: 'Application', id: 'LIST' }]
        }),

        submitLearnerContact: builder.mutation<SubmissionResponse, LearnerContactForm>({
            query: (contactData) => ({
                url: '/communications/contacts/learner',
                method: 'POST',
                body: contactData
            }),
            invalidatesTags: [{ type: 'Contact', id: 'LIST' }]
        }),

        submitBusinessContact: builder.mutation<SubmissionResponse, BusinessContactForm>({
            query: (contactData) => ({
                url: '/communications/contacts/business',
                method: 'POST',
                body: contactData
            }),
            invalidatesTags: [{ type: 'Contact', id: 'LIST' }]
        }),

        subscribeToNewsletter: builder.mutation<SubmissionResponse, NewsletterSubscriptionForm>({
            query: (subscriptionData) => ({
                url: '/communications/newsletter/subscribe',
                method: 'POST',
                body: subscriptionData
            }),
            invalidatesTags: [{ type: 'Newsletter', id: 'LIST' }]
        }),

        // Admin endpoints - Applications
        getApplications: builder.query<PaginatedResponse<Application>, ApplicationQueryParams>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, value.toString());
                    }
                });
                return `/communications/applications?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Application' as const, id })),
                        { type: 'Application', id: 'LIST' }
                    ]
                    : [{ type: 'Application', id: 'LIST' }]
        }),

        updateApplicationStatus: builder.mutation<
            { success: boolean; message: string },
            { id: string } & StatusUpdateRequest
        >({
            query: ({ id, ...statusData }) => ({
                url: `/communications/applications/${id}/status`,
                method: 'PATCH',
                body: statusData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Application', id: arg.id },
                { type: 'Application', id: 'LIST' },
                { type: 'CommunicationsStats', id: 'STATS' }
            ]
        }),

        bulkUpdateApplications: builder.mutation<
            { success: boolean; message: string },
            BulkUpdateRequest
        >({
            query: (bulkData) => ({
                url: '/communications/applications/bulk-status',
                method: 'POST',
                body: bulkData
            }),
            invalidatesTags: [
                { type: 'Application', id: 'LIST' },
                { type: 'CommunicationsStats', id: 'STATS' }
            ]
        }),

        deleteApplication: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (id) => ({
                url: `/communications/applications/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Application', id },
                { type: 'Application', id: 'LIST' },
                { type: 'CommunicationsStats', id: 'STATS' }
            ]
        }),

        // Admin endpoints - Contacts
        getContacts: builder.query<PaginatedResponse<Contact>, ContactQueryParams>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, value.toString());
                    }
                });
                return `/communications/contacts?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Contact' as const, id })),
                        { type: 'Contact', id: 'LIST' }
                    ]
                    : [{ type: 'Contact', id: 'LIST' }]
        }),

        updateContactStatus: builder.mutation<
            { success: boolean; message: string },
            { id: string } & StatusUpdateRequest
        >({
            query: ({ id, ...statusData }) => ({
                url: `/communications/contacts/${id}/status`,
                method: 'PATCH',
                body: statusData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Contact', id: arg.id },
                { type: 'Contact', id: 'LIST' },
                { type: 'CommunicationsStats', id: 'STATS' }
            ]
        }),

        deleteContact: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (id) => ({
                url: `/communications/contacts/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Contact', id },
                { type: 'Contact', id: 'LIST' },
                { type: 'CommunicationsStats', id: 'STATS' }
            ]
        }),

        // Admin endpoints - Newsletter
        getNewsletterSubscriptions: builder.query<PaginatedResponse<NewsletterSubscription>, NewsletterQueryParams>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, value.toString());
                    }
                });
                return `/communications/newsletter/subscriptions?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Newsletter' as const, id })),
                        { type: 'Newsletter', id: 'LIST' }
                    ]
                    : [{ type: 'Newsletter', id: 'LIST' }]
        }),

        updateSubscriptionStatus: builder.mutation<
            { success: boolean; message: string },
            { id: string } & StatusUpdateRequest
        >({
            query: ({ id, ...statusData }) => ({
                url: `/communications/newsletter/subscriptions/${id}/status`,
                method: 'PATCH',
                body: statusData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Newsletter', id: arg.id },
                { type: 'Newsletter', id: 'LIST' },
                { type: 'CommunicationsStats', id: 'STATS' }
            ]
        }),

        deleteSubscription: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (id) => ({
                url: `/communications/newsletter/subscriptions/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Newsletter', id },
                { type: 'Newsletter', id: 'LIST' },
                { type: 'CommunicationsStats', id: 'STATS' }
            ]
        }),

        // Statistics endpoint
        getCommunicationsStats: builder.query<CommunicationsStatsResponse, void>({
            query: () => '/communications/stats',
            providesTags: [{ type: 'CommunicationsStats', id: 'STATS' }]
        }),

        // Time series endpoint
        getCommunicationsTimeSeries: builder.query<
            { success: boolean; data: Array<{ date: string; applications: number; contacts: number; subscriptions: number }> },
            { days?: number }
        >({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.days) {
                    queryParams.append('days', params.days.toString());
                }
                return `/communications/stats/timeseries?${queryParams.toString()}`;
            },
            providesTags: [{ type: 'CommunicationsStats', id: 'TIMESERIES' }]
        })

    }),
    overrideExisting: true
});

export const {
    // Public submission hooks
    useSubmitLearnerApplicationMutation,
    useSubmitBusinessApplicationMutation,
    useSubmitLearnerContactMutation,
    useSubmitBusinessContactMutation,
    useSubscribeToNewsletterMutation,

    // Admin application hooks
    useGetApplicationsQuery,
    useUpdateApplicationStatusMutation,
    useBulkUpdateApplicationsMutation,
    useDeleteApplicationMutation,

    // Admin contact hooks
    useGetContactsQuery,
    useUpdateContactStatusMutation,
    useDeleteContactMutation,

    // Admin newsletter hooks
    useGetNewsletterSubscriptionsQuery,
    useUpdateSubscriptionStatusMutation,
    useDeleteSubscriptionMutation,

    // Statistics hook
    useGetCommunicationsStatsQuery,
    useGetCommunicationsTimeSeriesQuery
} = communicationsApi;