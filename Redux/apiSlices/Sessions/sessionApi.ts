import { apiSlice } from "@/Redux/services/api";
import { CreateSessionRequest, OpenSessionData } from "@/Redux/types/Sessions/session";


export const mentorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        createSession: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
            } & OpenSessionData;
        }, CreateSessionRequest>({
            query: (sessionData) => ({
                url: '/sessions/open-sessions/create',
                method: 'POST',
                body: sessionData
            }),
            invalidatesTags: ['Session']
        }),

        getAllOpenSessions: builder.query<{
            success: boolean;
            count: number;
            totalCount: number;
            pagination: {
                page: number;
                limit: number;
                hasMore: boolean;
                totalPages: number;
            };
            data: OpenSessionData[];
        }, {
            page?: number;
            limit?: number;
            sessionType?: 'individual' | 'group';
            isPublic?: boolean;
            mentorId?: string;
        }>({
            query: (params) => ({
                url: '/sessions/open-sessions',
                method: 'GET',
                params
            }),
            providesTags: ['OpenSession']
        }),

        getOpenSessionById: builder.query<{
            success: boolean;
            data: OpenSessionData & {
                formattedDate: string;
                spotsAvailable: number;
            };
        }, string>({
            query: (id) => `/sessions/open-sessions/${id}`,
            providesTags: (result, error, id) => [{ type: 'OpenSession', id }]
        }),

        getMyCreatedSessions: builder.query<{
            success: boolean;
            count: number;
            totalCount: number;
            pagination: {
                page: number;
                limit: number;
                hasMore: boolean;
                totalPages: number;
            };
            data: OpenSessionData[];
        }, {
            page?: number;
            limit?: number;
            status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
        }>({
            query: (params) => ({
                url: '/sessions/my-created-sessions',
                method: 'GET',
                params
            }),
            providesTags: ['OpenSession', 'MySession']
        }),

        joinOpenSession: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                participantCount: number;
            };
        }, string>({
            query: (id) => ({
                url: `/sessions/open-sessions/${id}/join`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'OpenSession', id },
                'OpenSession',
                'MySession'
            ]
        }),

        leaveOpenSession: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                participantCount: number;
            };
        }, string>({
            query: (id) => ({
                url: `/sessions/open-sessions/${id}/leave`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'OpenSession', id },
                'OpenSession',
                'MySession'
            ]
        }),

        updateOpenSession: builder.mutation<{
            success: boolean;
            message: string;
            data: Partial<OpenSessionData>;
        }, {
            id: string;
            updates: Partial<CreateSessionRequest>;
        }>({
            query: ({ id, updates }) => ({
                url: `/sessions/open-sessions/${id}`,
                method: 'PATCH',
                body: updates
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'OpenSession', id },
                'OpenSession',
                'MySession'
            ]
        }),

        cancelOpenSession: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                status: string;
            };
        }, {
            id: string;
            reason?: string;
        }>({
            query: ({ id, reason }) => ({
                url: `/sessions/open-sessions/${id}`,
                method: 'DELETE',
                body: { reason }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'OpenSession', id },
                'OpenSession',
                'MySession'
            ]
        }),

        // Add these to your sessionApi.ts
        getSessionParticipants: builder.query<{
            success: boolean;
            data: Array<{
                id: string;
                name: string;
                email: string;
                profilePicture?: string;
                joinedAt: string;
            }>;
        }, string>({
            query: (id) => `/sessions/open-sessions/${id}/participants`,
            providesTags: (result, error, id) => [{ type: 'SessionParticipants', id }]
        }),

        removeSessionParticipant: builder.mutation<{
            success: boolean;
            message: string;
        }, {
            sessionId: string;
            participantId: string;
        }>({
            query: ({ sessionId, participantId }) => ({
                url: `/sessions/open-sessions/${sessionId}/participants`,
                method: 'DELETE',
                body: { participantId }
            }),
            invalidatesTags: (result, error, { sessionId }) => [
                { type: 'SessionParticipants', id: sessionId },
                { type: 'OpenSession', id: sessionId }
            ]
        }),

        completeOpenSession: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                status: string;
            };
        }, {
            id: string;
            notes?: string;
        }>({
            query: ({ id, notes }) => ({
                url: `/sessions/open-sessions/${id}/complete`,
                method: 'PATCH',
                body: { notes }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'OpenSession', id },
                'OpenSession',
                'MySession'
            ]
        }),

        // Start session (you may need to implement this endpoint in your backend)
        startOpenSession: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                sessionId: string;
                status: string;
            };
        }, string>({
            query: (id) => ({
                url: `/sessions/open-sessions/${id}/start`,
                method: 'PATCH'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'OpenSession', id },
                'OpenSession',
                'MySession'
            ]
        }),

        // Bulk remove participants (you may need to implement this endpoint in your backend)
        bulkRemoveParticipants: builder.mutation<{
            success: boolean;
            message: string;
        }, {
            sessionId: string;
            participantIds: string[];
        }>({
            query: ({ sessionId, participantIds }) => ({
                url: `/sessions/open-sessions/${sessionId}/participants/bulk-remove`,
                method: 'DELETE',
                body: { participantIds }
            }),
            invalidatesTags: (result, error, { sessionId }) => [
                { type: 'SessionParticipants', id: sessionId },
                { type: 'OpenSession', id: sessionId }
            ]
        }),
    })
});

export const {
    useCreateSessionMutation,
    useGetAllOpenSessionsQuery,
    useGetOpenSessionByIdQuery,
    useGetMyCreatedSessionsQuery,
    useJoinOpenSessionMutation,
    useLeaveOpenSessionMutation,
    useUpdateOpenSessionMutation,
    useCancelOpenSessionMutation,
    useGetSessionParticipantsQuery,
    useRemoveSessionParticipantMutation,
    useCompleteOpenSessionMutation,
    useStartOpenSessionMutation,
    useBulkRemoveParticipantsMutation,
} = mentorApi;

