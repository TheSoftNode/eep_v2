import {
    Conversation,
    Message,
    ConversationResponse,
    MessageResponse,
    ContactsResponse,
    UnreadCountResponse,
    CreateConversationRequest,
    SendMessageRequest,
    AddParticipantsRequest
} from '../../types/Chats/chat';
import { apiSlice } from '@/Redux/services/api';

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get user's conversations (chats)
        getUserChats: builder.query<Conversation[], { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 20 }) => `/chat?page=${page}&limit=${limit}`,
            transformResponse: (response: ConversationResponse) => response.data, // Unwrap the data
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Conversation' as const, id })),
                        { type: 'Conversation', id: 'LIST' }
                    ]
                    : [{ type: 'Conversation', id: 'LIST' }]
        }),

        // Get single conversation with messages
        getConversation: builder.query<Conversation, { id: string; limit?: number; before?: string }>({
            query: ({ id, limit = 50, before }) => {
                let url = `/chat/${id}?limit=${limit}`;
                if (before) url += `&before=${before}`;
                return url;
            },
            providesTags: (result, error, { id }) => [
                { type: 'Conversation', id },
                { type: 'Message', id: `CONVERSATION_${id}` }
            ]
        }),

        // Create a new conversation
        createConversation: builder.mutation<{ data: Conversation, isExisting: boolean }, CreateConversationRequest>({
            query: (conversationData) => ({
                url: '/chat',
                method: 'POST',
                body: conversationData
            }),
            invalidatesTags: [{ type: 'Conversation', id: 'LIST' }]
        }),

        // Create a project-specific group chat
        createProjectChat: builder.mutation<{ data: Conversation }, { projectId: string; title: string; participants?: string[]; initialMessage?: string }>({
            query: ({ projectId, ...chatData }) => ({
                url: `/chat/project/${projectId}`,
                method: 'POST',
                body: chatData
            }),
            invalidatesTags: [{ type: 'Conversation', id: 'LIST' }]
        }),

        // Send a message
        sendMessage: builder.mutation<MessageResponse, { conversationId: string } & SendMessageRequest>({
            query: ({ conversationId, ...messageData }) => ({
                url: `/chat/${conversationId}/messages`,
                method: 'POST',
                body: messageData
            }),
            invalidatesTags: (result, error, { conversationId }) => [
                { type: 'Message', id: `CONVERSATION_${conversationId}` },
                { type: 'Conversation', id: conversationId },
                { type: 'Conversation', id: 'LIST' }
            ]
        }),

        // Mark conversation as read
        markConversationAsRead: builder.mutation<{ success: boolean; count: number }, string>({
            query: (conversationId) => ({
                url: `/chat/${conversationId}/read`,
                method: 'PATCH'
            }),
            invalidatesTags: (result, error, conversationId) => [
                { type: 'Conversation', id: conversationId },
                { type: 'Conversation', id: 'LIST' },
                { type: 'UnreadCount', id: 'TOTAL' }
            ]
        }),

        // Delete a message
        deleteMessage: builder.mutation<{ success: boolean }, string>({
            query: (messageId) => ({
                url: `/chat/messages/${messageId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, messageId) => [
                { type: 'Message', id: messageId },
                { type: 'Conversation', id: 'LIST' }
            ]
        }),

        // Edit a message
        updateMessage: builder.mutation<{ success: boolean; data: Message }, { messageId: string; content: string }>({
            query: ({ messageId, content }) => ({
                url: `/chat/messages/${messageId}`,
                method: 'PATCH',
                body: { content }
            }),
            invalidatesTags: (result, error, { messageId }) => [
                { type: 'Message', id: messageId }
            ]
        }),

        // Search messages in conversation
        searchConversationMessages: builder.query<{ data: Message[]; count: number }, { conversationId: string; q: string; limit?: number }>({
            query: ({ conversationId, q, limit = 20 }) =>
                `/chat/${conversationId}/messages/search?q=${encodeURIComponent(q)}&limit=${limit}`,
            providesTags: (result, error, { conversationId }) => [
                { type: 'Message', id: `SEARCH_${conversationId}` }
            ]
        }),

        // Get all unread message counts
        getUnreadMessagesCount: builder.query<UnreadCountResponse, void>({
            query: () => '/chat/unread',
            providesTags: [{ type: 'UnreadCount', id: 'TOTAL' }]
        }),

        // Add participants to group conversation
        addConversationParticipants: builder.mutation<{ success: boolean; data: { participants: string[] } }, AddParticipantsRequest>({
            query: ({ conversationId, participants }) => ({
                url: `/chat/${conversationId}/participants`,
                method: 'POST',
                body: { participants }
            }),
            invalidatesTags: (result, error, { conversationId }) => [
                { type: 'Conversation', id: conversationId }
            ]
        }),

        // Remove participant from group conversation
        removeConversationParticipant: builder.mutation<{ success: boolean }, { conversationId: string; participantId: string }>({
            query: ({ conversationId, participantId }) => ({
                url: `/chat/${conversationId}/participants/${participantId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { conversationId }) => [
                { type: 'Conversation', id: conversationId }
            ]
        }),

        // Pin/unpin conversation
        togglePinConversation: builder.mutation<{ success: boolean }, { conversationId: string; isPinned: boolean }>({
            query: ({ conversationId, isPinned }) => ({
                url: `/chat/${conversationId}/pin`,
                method: 'PATCH',
                body: { isPinned }
            }),
            invalidatesTags: (result, error, { conversationId }) => [
                { type: 'Conversation', id: conversationId },
                { type: 'Conversation', id: 'LIST' }
            ]
        }),

        // Mute/unmute conversation
        toggleMuteConversation: builder.mutation<{ success: boolean }, { conversationId: string; isMuted: boolean }>({
            query: ({ conversationId, isMuted }) => ({
                url: `/chat/${conversationId}/mute`,
                method: 'PATCH',
                body: { isMuted }
            }),
            invalidatesTags: (result, error, { conversationId }) => [
                { type: 'Conversation', id: conversationId },
                { type: 'Conversation', id: 'LIST' }
            ]
        }),

        setTypingStatus: builder.mutation<{ success: boolean }, { conversationId: string; isTyping: boolean }>({
            query: ({ conversationId, isTyping }) => ({
                url: `/chat/${conversationId}/typing`,
                method: 'POST',
                body: { isTyping }
            })
        }),

        getUserContacts: builder.query<ContactsResponse, {
            search?: string;
            projectId?: string;
            role?: string;
            limit?: number
        }>({
            query: (params) => ({
                url: '/chat/contacts',
                params: { // Let RTK Query handle URL encoding and parameter construction
                    search: params.search,
                    projectId: params.projectId,
                    role: params.role,
                    limit: params.limit || 20
                }
            }),
            providesTags: [{ type: 'Contact', id: 'LIST' }]
        }),

        getRecentContacts: builder.query<ContactsResponse, { limit?: number }>({
            query: ({ limit = 10 }) => `/chat/contacts/recent?limit=${limit}`,
            providesTags: [{ type: 'Contact', id: 'RECENT' }]
        }),

        // Get project team contacts
        getProjectTeamContacts: builder.query<ContactsResponse & { projectName: string }, string>({
            query: (projectId) => `/chat/contacts/project/${projectId}`,
            providesTags: (result, error, projectId) => [
                { type: 'Contact', id: `PROJECT_${projectId}` }
            ]
        }),

        // Get mentor contacts
        getMentorContacts: builder.query<ContactsResponse, void>({
            query: () => '/chat/contacts/mentors',
            providesTags: [{ type: 'Contact', id: 'MENTORS' }]
        }),

        // Upload file attachment
        uploadAttachment: builder.mutation<{ success: boolean; data: any }, FormData>({
            query: (formData) => ({
                url: '/chat/attachments',
                method: 'POST',
                body: formData,
                formData: true
            })
        }),

        // Get attachment details
        getAttachmentDetails: builder.query<{ success: boolean; data: any }, string>({
            query: (attachmentId) => `/chat/attachments/${attachmentId}`
        }),

        // Delete attachment
        deleteAttachment: builder.mutation<{ success: boolean }, string>({
            query: (attachmentId) => ({
                url: `/chat/attachments/${attachmentId}`,
                method: 'DELETE'
            })
        })
    })
});

export const {
    useGetUserChatsQuery,
    useGetConversationQuery,
    useCreateConversationMutation,
    useCreateProjectChatMutation,
    useSendMessageMutation,
    useMarkConversationAsReadMutation,
    useDeleteMessageMutation,
    useUpdateMessageMutation,
    useSearchConversationMessagesQuery,
    useGetUnreadMessagesCountQuery,
    useAddConversationParticipantsMutation,
    useRemoveConversationParticipantMutation,
    useTogglePinConversationMutation,
    useToggleMuteConversationMutation,
    useGetUserContactsQuery,
    useGetRecentContactsQuery,
    useGetProjectTeamContactsQuery,
    useGetMentorContactsQuery,
    useUploadAttachmentMutation,
    useGetAttachmentDetailsQuery,
    useDeleteAttachmentMutation,
    useSetTypingStatusMutation
} = chatApiSlice;