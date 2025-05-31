import { apiSlice } from "@/Redux/services/api";
import { AvailabilityUpdateRequest, BulkAvailabilityUpdateRequest } from "@/Redux/types/Users/mentor";


export const mentorAvailabilityApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Public endpoints
        getMentorAvailability: builder.query({
            query: ({ mentorId, startDate, endDate }) => ({
                url: `/user-mentors/mentors/${mentorId}/availability`,
                method: 'GET',
                params: { startDate, endDate },
            }),
        }),

        getMentorAvailableSlots: builder.query({
            query: ({ mentorId, date }) => ({
                url: `/user-mentors/mentors/${mentorId}/available-slots`,
                method: 'GET',
                params: { date },
            }),
        }),

        getMentorBusySlots: builder.query({
            query: ({ mentorId, startDate, endDate }) => ({
                url: `/user-mentors/mentors/${mentorId}/busy-slots`,
                method: 'GET',
                params: { startDate, endDate },
            }),
        }),

        checkSchedulingConflicts: builder.query({
            query: ({ mentorId, date, timeSlot, sessionId }) => ({
                url: `/user-mentors/sessions/conflicts`,
                method: 'GET',
                params: { mentorId, date, timeSlot, sessionId },
            }),
        }),

        // Mentor-only endpoints
        updateMentorAvailability: builder.mutation({
            query: (data: AvailabilityUpdateRequest) => ({
                url: `/user-mentors/mentors/availability`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Mentor'],
        }),

        removeAvailabilitySlot: builder.mutation({
            query: (slotId: string) => ({
                url: `/user-mentors/mentors/availability/${slotId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Mentor'],
        }),

        bulkUpdateAvailability: builder.mutation({
            query: (data: BulkAvailabilityUpdateRequest) => ({
                url: `/user-mentors/mentors/availability/bulk`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Mentor'],
        }),

        getMentorAvailabilityCalendar: builder.query({
            query: ({ startDate, endDate }) => ({
                url: `/user-mentors/mentors/availability/calendar`,
                method: 'GET',
                params: { startDate, endDate },
            }),
            providesTags: ['Mentor'],
        }),

        getMentorAvailabilityAnalytics: builder.query({
            query: () => ({
                url: `/user-mentors/mentors/analytics/availability`,
                method: 'GET',
            }),
        }),

        getMentorSessionAnalytics: builder.query({
            query: () => ({
                url: `/user-mentors/mentors/analytics/sessions`,
                method: 'GET',
            }),
        }),

        // Session rescheduling
        rescheduleSession: builder.mutation({
            query: ({ sessionId, newDate, newTimeSlot, reason }) => ({
                url: `/user-mentors/sessions/${sessionId}/reschedule`,
                method: 'POST',
                body: { newDate, newTimeSlot, reason },
            }),
            invalidatesTags: (result, error, { sessionId }) => [
                { type: 'Session', id: sessionId },
                'Mentor',
            ],
        }),

        // Learner-specific endpoints
        getRecommendedMentors: builder.query({
            query: () => ({
                url: `/user-mentors/learners/recommended-mentors`,
                method: 'GET',
            }),
        }),

        getLearnerSessionHistory: builder.query({
            query: ({ page, limit }) => ({
                url: `/user-mentors/learners/sessions/history`,
                method: 'GET',
                params: { page, limit },
            }),
        }),

        getLearnerMentorHistory: builder.query({
            query: () => ({
                url: `/user-mentors/learners/mentor-history`,
                method: 'GET',
            }),
        }),
    }),
    overrideExisting: true
});

export const {
    useGetMentorAvailabilityQuery,
    useGetMentorAvailableSlotsQuery,
    useGetMentorBusySlotsQuery,
    useCheckSchedulingConflictsQuery,
    useUpdateMentorAvailabilityMutation,
    useRemoveAvailabilitySlotMutation,
    useBulkUpdateAvailabilityMutation,
    useGetMentorAvailabilityCalendarQuery,
    useGetMentorAvailabilityAnalyticsQuery,
    useGetMentorSessionAnalyticsQuery,
    useRescheduleSessionMutation,
    useGetRecommendedMentorsQuery,
    useGetLearnerSessionHistoryQuery,
    useGetLearnerMentorHistoryQuery,
} = mentorAvailabilityApi;