import { apiSlice } from "@/Redux/services/api";
import {
    MentorSearchParams,
    SessionData,
    SessionRequest,
    MentorReview,
    SessionReview,
    MentorProfile,
} from "@/Redux/types/Users/mentor";

export const mentorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Public mentor endpoints
        getAllMentors: builder.query<{
            success: boolean;
            count: number;
            totalCount: number;
            pagination: {
                page: number;
                limit: number;
                hasMore: boolean;
                totalPages: number;
            };
            data: MentorProfile[];
        }, any>({
            query: (params) => ({
                url: '/user-mentors/mentors',
                method: 'GET',
                params
            }),
            providesTags: ['Mentor']
        }),

        searchMentors: builder.query<{
            success: boolean;
            count: number;
            totalCount: number;
            pagination: {
                page: number;
                limit: number;
                hasMore: boolean;
                totalPages: number;
            };
            data: MentorProfile[];
        }, MentorSearchParams>({
            query: (params) => ({
                url: '/user-mentors/mentors/search',
                method: 'GET',
                params
            }),
            providesTags: ['Mentor']
        }),

        getMentorById: builder.query<{
            success: boolean;
            data: MentorProfile & {
                recentReviews: MentorReview[];
            };
        }, string>({
            query: (id) => `/user-mentors/mentors/${id}`,
            providesTags: (result, error, id) => [{ type: 'Mentor', id }]
        }),

        getMentorReviews: builder.query<{
            success: boolean;
            count: number;
            totalCount: number;
            pagination: {
                page: number;
                limit: number;
                hasMore: boolean;
                totalPages: number;
            };
            data: MentorReview[];
        }, { id: string; page?: number; limit?: number }>({
            query: ({ id, ...params }) => ({
                url: `/user-mentors/mentors/${id}/reviews`,
                method: 'GET',
                params
            }),
            providesTags: (result, error, { id }) => [{ type: 'Mentor', id: `reviews-${id}` }]
        }),

        // Session management
        requestSession: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
            } & SessionData;
        }, SessionRequest>({
            query: (sessionData) => ({
                url: '/user-mentors/sessions/request',
                method: 'POST',
                body: sessionData
            }),
            invalidatesTags: ['Session']
        }),

        getMyUpcomingSessions: builder.query<{
            success: boolean;
            count: number;
            data: SessionData[];
        }, void>({
            query: () => '/user-mentors/sessions/upcoming',
            providesTags: ['Session']
        }),

        acceptSessionRequest: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                status: string;
            };
        }, string>({
            query: (id) => ({
                url: `/user-mentors/${id}/accept`,
                method: 'PATCH'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Session', id },
                'Session'
            ]
        }),

        rejectSessionRequest: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                status: string;
            };
        }, { id: string; reason?: string }>({
            query: ({ id, reason }) => ({
                url: `/user-mentors/${id}/reject`,
                method: 'PATCH',
                body: { reason }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Session', id },
                'Session'
            ]
        }),

        getSessionById: builder.query<{
            success: boolean;
            data: SessionData & {
                formattedDate: string;
                review?: any;
            };
        }, string>({
            query: (id) => `/user-mentors/sessions/${id}`,
            providesTags: (result, error, id) => [{ type: 'Session', id }]
        }),

        cancelSessionRequest: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                status: string;
                cancelledBy: string;
            };
        }, { id: string; reason?: string }>({
            query: ({ id, reason }) => ({
                url: `/user-mentors/sessions/${id}/cancel`,
                method: 'PATCH',
                body: { reason }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Session', id },
                'Session'
            ]
        }),

        submitSessionReview: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                id: string;
            } & MentorReview;
        }, { id: string } & SessionReview>({
            query: ({ id, ...reviewData }) => ({
                url: `/user-mentors/sessions/${id}/review`,
                method: 'POST',
                body: reviewData
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Session', id },
                { type: 'Mentor', id: result?.data?.mentorId },
                { type: 'Mentor', id: `reviews-${result?.data?.mentorId}` }
            ]
        }),

        completeSession: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                status: string;
            };
        }, { id: string; notes?: string }>({
            query: ({ id, notes }) => ({
                url: `/user-mentors/${id}/complete`,
                method: 'PATCH',
                body: { notes }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Session', id },
                'Session'
            ]
        }),

    })
});

export const {
    useGetAllMentorsQuery,
    useSearchMentorsQuery,
    useGetMentorByIdQuery,
    useGetMentorReviewsQuery,
    useRequestSessionMutation,
    useGetMyUpcomingSessionsQuery,
    useAcceptSessionRequestMutation,
    useRejectSessionRequestMutation,
    useGetSessionByIdQuery,
    useCancelSessionRequestMutation,
    useSubmitSessionReviewMutation,
    useCompleteSessionMutation
} = mentorApi;

