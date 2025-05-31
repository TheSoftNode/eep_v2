import { AttachmentResponse, AttachmentsResponse, BasicResponse, EditMessageRequest, GetAttachmentsParams, GetMessagesParams, MessageReactionRequest, MessageResponse, MessagesResponse, PinnedMessagesResponse, ReactionResponse, SearchMessagesParams, SearchResultsResponse, SendMessageRequest } from '../../types/Workspace/workspace-messaging-types';
import { apiSlice } from '@/Redux/services/api';


export const workspaceMessagingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get messages with pagination
        getWorkspaceMessages: builder.query<MessagesResponse, GetMessagesParams>({
            query: ({ workspaceId, limit = 50, before, after }) => ({
                url: `/workspacesMessaging/${workspaceId}/messages`,
                method: 'GET',
                params: {
                    limit,
                    ...(before ? { before } : {}),
                    ...(after ? { after } : {})
                }
            }),
            providesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMessage', id: workspaceId }
            ],
        }),

        // Search messages
        searchWorkspaceMessages: builder.query<SearchResultsResponse, SearchMessagesParams>({
            query: ({ workspaceId, query, limit = 20 }) => ({
                url: `/workspacesMessaging/${workspaceId}/messages/search`,
                method: 'GET',
                params: { query, limit }
            })
        }),

        // Send a new message
        sendWorkspaceMessage: builder.mutation<MessageResponse, SendMessageRequest>({
            query: ({ workspaceId, ...messageData }) => ({
                url: `/workspacesMessaging/${workspaceId}/messages`,
                method: 'POST',
                body: messageData
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMessage', id: workspaceId }
            ],
        }),

        // Edit a message
        editMessage: builder.mutation<MessageResponse, EditMessageRequest>({
            query: ({ workspaceId, messageId, content }) => ({
                url: `/workspacesMessaging/${workspaceId}/messages/${messageId}`,
                method: 'PATCH',
                body: { content }
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMessage', id: workspaceId }
            ],
        }),

        // Delete a message
        deleteMessage: builder.mutation<BasicResponse, { workspaceId: string, messageId: string }>({
            query: ({ workspaceId, messageId }) => ({
                url: `/workspacesMessaging/${workspaceId}/messages/${messageId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMessage', id: workspaceId }
            ],
        }),

        // React to a message
        reactToMessage: builder.mutation<ReactionResponse, MessageReactionRequest>({
            query: ({ workspaceId, messageId, reaction }) => ({
                url: `/workspacesMessaging/${workspaceId}/messages/${messageId}/reactions`,
                method: 'POST',
                body: { reaction }
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMessage', id: workspaceId }
            ],
        }),

        // Pin a message
        pinMessage: builder.mutation<BasicResponse, { workspaceId: string, messageId: string }>({
            query: ({ workspaceId, messageId }) => ({
                url: `/workspacesMessaging/${workspaceId}/messages/${messageId}/pin`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMessage', id: workspaceId },
                { type: 'PinnedMessage', id: workspaceId }
            ],
        }),

        // Unpin a message
        unpinMessage: builder.mutation<BasicResponse, { workspaceId: string, messageId: string }>({
            query: ({ workspaceId, messageId }) => ({
                url: `/workspacesMessaging/${workspaceId}/messages/${messageId}/pin`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceMessage', id: workspaceId },
                { type: 'PinnedMessage', id: workspaceId }
            ],
        }),

        // Get pinned messages
        getPinnedMessages: builder.query<PinnedMessagesResponse, string>({
            query: (workspaceId) => ({
                url: `/workspacesMessaging/${workspaceId}/pinned-messages`,
                method: 'GET'
            }),
            providesTags: (result, error, workspaceId) => [
                { type: 'PinnedMessage', id: workspaceId }
            ],
        }),

        // Upload message attachment (special handling for FormData)
        uploadMessageAttachment: builder.mutation<AttachmentResponse, { workspaceId: string, file: File }>({
            query: ({ workspaceId, file }) => {
                const formData = new FormData();
                formData.append('file', file);

                return {
                    url: `/workspacesMessaging/${workspaceId}/attachments`,
                    method: 'POST',
                    body: formData,
                    formData: true
                };
            },
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceAttachment', id: workspaceId }
            ],
        }),

        // Upload voice note (special handling for FormData)
        uploadVoiceNote: builder.mutation<AttachmentResponse, { workspaceId: string, file: File, duration: number }>({
            query: ({ workspaceId, file, duration }) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('duration', duration.toString());

                return {
                    url: `/workspacesMessaging/${workspaceId}/voice-notes`,
                    method: 'POST',
                    body: formData,
                    formData: true
                };
            },
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceAttachment', id: workspaceId }
            ],
        }),

        // Get workspace attachments
        getWorkspaceAttachments: builder.query<AttachmentsResponse, GetAttachmentsParams>({
            query: ({ workspaceId, type, limit = 50, page = 1 }) => ({
                url: `/workspacesMessaging/${workspaceId}/attachments`,
                method: 'GET',
                params: {
                    ...(type ? { type } : {}),
                    limit,
                    page
                }
            }),
            providesTags: (result, error, { workspaceId }) => [
                { type: 'WorkspaceAttachment', id: workspaceId }
            ],
        }),

        // Get specific attachment
        getAttachment: builder.query<AttachmentResponse, { workspaceId: string, attachmentId: string }>({
            query: ({ workspaceId, attachmentId }) => ({
                url: `/workspacesMessaging/${workspaceId}/attachments/${attachmentId}`,
                method: 'GET'
            }),
            providesTags: (result, error, { workspaceId, attachmentId }) => [
                { type: 'WorkspaceAttachment', id: `${workspaceId}-${attachmentId}` }
            ],
        }),
    }),

    overrideExisting: true
});

// Export hooks for using the API endpoints
export const {
    useGetWorkspaceMessagesQuery,
    useSearchWorkspaceMessagesQuery,
    useSendWorkspaceMessageMutation,
    useEditMessageMutation,
    useDeleteMessageMutation,
    useReactToMessageMutation,
    usePinMessageMutation,
    useUnpinMessageMutation,
    useGetPinnedMessagesQuery,
    useUploadMessageAttachmentMutation,
    useUploadVoiceNoteMutation,
    useGetWorkspaceAttachmentsQuery,
    useGetAttachmentQuery
} = workspaceMessagingApiSlice;