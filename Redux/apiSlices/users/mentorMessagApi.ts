import { apiSlice } from "@/Redux/services/api";
import {
    SendMessageRequest,
    MessageFilters,
    MessagesResponse,
    ThreadsResponse,
    MessageStatsResponse,
    SendMessageResponse,
    ThreadMessagesResponse
} from "@/Redux/types/Users/mentorMessage";

export const mentorMessagingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Send message to mentor
        sendMessageToMentor: builder.mutation<SendMessageResponse, SendMessageRequest>({
            query: (messageData) => ({
                url: '/mentor-messages/send',
                method: 'POST',
                body: messageData,
            }),
            invalidatesTags: ['Message', 'MessageThread'],
        }),

        // Get inbox messages (received)
        getInboxMessages: builder.query<MessagesResponse, MessageFilters>({
            query: (filters = {}) => ({
                url: '/mentor-messages/inbox',
                method: 'GET',
                params: filters,
            }),
            providesTags: ['Message'],
        }),

        // Get sent messages
        getSentMessages: builder.query<MessagesResponse, { page?: number; limit?: number }>({
            query: (params = {}) => ({
                url: '/mentor-messages/sent',
                method: 'GET',
                params,
            }),
            providesTags: ['Message'],
        }),

        // Get message threads
        getMessageThreads: builder.query<ThreadsResponse, { page?: number; limit?: number }>({
            query: (params = {}) => ({
                url: '/mentor-messages/threads',
                method: 'GET',
                params,
            }),
            providesTags: ['MessageThread'],
        }),

        // Get messages in a specific thread
        getThreadMessages: builder.query<ThreadMessagesResponse, { threadId: string; page?: number; limit?: number }>({
            query: ({ threadId, ...params }) => ({
                url: `/mentor-messages/threads/${threadId}/messages`,
                method: 'GET',
                params,
            }),
            providesTags: (result, error, { threadId }) => [
                { type: 'Message', id: threadId },
                'Message',
            ],
        }),

        // Mark message as read
        markMessageAsRead: builder.mutation<{ success: boolean; message: string }, string>({
            query: (messageId) => ({
                url: `/mentor-messages/messages/${messageId}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, messageId) => [
                { type: 'Message', id: messageId },
                'Message',
                'MessageStats',
            ],
        }),

        // Toggle message star
        toggleMessageStar: builder.mutation<{ success: boolean; message: string; data: { messageId: string; isStarred: boolean } }, string>({
            query: (messageId) => ({
                url: `/mentor-messages/messages/${messageId}/star`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, messageId) => [
                { type: 'Message', id: messageId },
                'Message',
            ],
        }),

        // Delete message
        deleteMessage: builder.mutation<{ success: boolean; message: string }, string>({
            query: (messageId) => ({
                url: `/mentor-messages/messages/${messageId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, messageId) => [
                { type: 'Message', id: messageId },
                'Message',
                'MessageThread',
                'MessageStats',
            ],
        }),

        // Get message statistics
        getMessageStats: builder.query<MessageStatsResponse, void>({
            query: () => ({
                url: '/mentor-messages/stats',
                method: 'GET',
            }),
            providesTags: ['MessageStats'],
        }),

        // Mark all messages as read
        markAllMessagesAsRead: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: '/mentor-messages/mark-all-read',
                method: 'PATCH',
            }),
            invalidatesTags: ['Message', 'MessageStats'],
        }),

        // Get unread message count
        getUnreadMessageCount: builder.query<{ success: boolean; data: { count: number } }, void>({
            query: () => ({
                url: '/mentor-messages/unread-count',
                method: 'GET',
            }),
            providesTags: ['MessageStats'],
        }),

        // Search messages
        searchMessages: builder.query<MessagesResponse, { query: string; page?: number; limit?: number }>({
            query: (params) => ({
                url: '/mentor-messages/search',
                method: 'GET',
                params,
            }),
            providesTags: ['Message'],
        }),

        // Get starred messages
        getStarredMessages: builder.query<MessagesResponse, { page?: number; limit?: number }>({
            query: (params = {}) => ({
                url: '/mentor-messages/starred',
                method: 'GET',
                params,
            }),
            providesTags: ['Message'],
        }),

        replyToMessage: builder.mutation<SendMessageResponse, {
            originalMessageId: string;
            content: string;
            priority?: 'low' | 'normal' | 'high' | 'urgent';
        }>({
            query: (replyData) => ({
                url: '/mentor-messages/reply',
                method: 'POST',
                body: replyData,
            }),
            invalidatesTags: ['Message', 'MessageThread', 'MessageStats'],
        }),

        // Get mentor replies for learners
        getMentorReplies: builder.query<MessagesResponse, MessageFilters>({
            query: (filters = {}) => ({
                url: '/mentor-messages/mentor-replies',
                method: 'GET',
                params: filters,
            }),
            providesTags: ['Message'],
        }),

        // Get mentor reply statistics for learners
        getMentorReplyStats: builder.query<{
            success: boolean; data: {
                totalReceived: number;
                unreadCount: number;
                starredCount: number;
                recentReplies: number;
            }
        }, void>({
            query: () => ({
                url: '/mentor-messages/mentor-reply-stats',
                method: 'GET',
            }),
            providesTags: ['MessageStats'],
        }),

        // Get unread mentor replies count for learners
        getUnreadMentorRepliesCount: builder.query<{ success: boolean; data: { count: number } }, void>({
            query: () => ({
                url: '/mentor-messages/mentor-replies/unread-count',
                method: 'GET',
            }),
            providesTags: ['MessageStats'],
        }),

    }),
});

export const {
    useSendMessageToMentorMutation,
    useGetInboxMessagesQuery,
    useGetSentMessagesQuery,
    useGetMessageThreadsQuery,
    useGetThreadMessagesQuery,
    useMarkMessageAsReadMutation,
    useToggleMessageStarMutation,
    useDeleteMessageMutation,
    useGetMessageStatsQuery,
    useMarkAllMessagesAsReadMutation,
    useGetUnreadMessageCountQuery,
    useSearchMessagesQuery,
    useGetStarredMessagesQuery,
    useReplyToMessageMutation,
    useGetMentorRepliesQuery,
    useGetMentorReplyStatsQuery,
    useGetUnreadMentorRepliesCountQuery
} = mentorMessagingApi;