export interface MessageAttachment {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
    duration?: any;
    contentType: string;
    uploadedAt: string;
}

// Voice note
export interface VoiceNote extends MessageAttachment {
    duration: number;
    durationFormatted: string;
}

// Workspace message
export interface WorkspaceMessage {
    id: string;
    workspaceId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string | null;
    senderRole: string;
    content: string;
    messageType: 'text' | 'voice-note' | 'attachment';
    attachments: MessageAttachment[];
    replyTo: string | null;
    mentions: string[];
    reactions: Record<string, string[]>;
    readBy: string[];
    isPinned?: boolean;
    pinnedAt?: string | null;
    pinnedBy?: string | null;
    edited?: boolean;
    createdAt: string;
    updatedAt: string;
}

// Pinned message
export interface PinnedMessage {
    messageId: string;
    messageContent: string;
    messageSender: string;
    messageType: string;
    createdAt: any; // Firestore timestamp
    pinnedAt: any; // Firestore timestamp
    pinnedBy: string;
}

// Search result
export interface MessageSearchResult {
    id: string;
    content: string;
    snippet: string;
    createdAt: string;
    senderId: string;
    senderName: string;
    senderAvatar: string | null;
}

// Request to send a message
export interface SendMessageRequest {
    workspaceId: string;
    content: string;
    attachments?: MessageAttachment[];
    messageType?: 'text' | 'voice-note' | 'attachment';
    replyTo?: string | null;
    mentions?: string[];
}

// Request to react to a message
export interface MessageReactionRequest {
    workspaceId: string;
    messageId: string;
    reaction: string;
}

// Request to edit a message
export interface EditMessageRequest {
    workspaceId: string;
    messageId: string;
    content: string;
}

// Pagination parameters for message listing
export interface GetMessagesParams {
    workspaceId: string;
    limit?: number;
    before?: string;
    after?: string;
}

// Pagination parameters for attachments
export interface GetAttachmentsParams {
    workspaceId: string;
    type?: string;
    limit?: number;
    page?: number;
}

// Parameters for searching messages
export interface SearchMessagesParams {
    workspaceId: string;
    query: string;
    limit?: number;
}

// Response for a single message
export interface MessageResponse {
    success: boolean;
    message?: string;
    data: WorkspaceMessage;
}

// Response for multiple messages
export interface MessagesResponse {
    success: boolean;
    count: number;
    hasMore: boolean;
    nextCursor: string | null;
    data: WorkspaceMessage[];
}

// Response for search results
export interface SearchResultsResponse {
    success: boolean;
    count: number;
    data: MessageSearchResult[];
    query: string;
}

// Response for pinned messages
export interface PinnedMessagesResponse {
    success: boolean;
    count: number;
    data: PinnedMessage[];
}

// Response for reactions
export interface ReactionResponse {
    success: boolean;
    message: string;
    data: {
        messageId: string;
        reactions: Record<string, string[]>;
    };
}

// Response for attachments with pagination
export interface AttachmentsResponse {
    success: boolean;
    count: number;
    totalCount: number;
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
    };
    data: MessageAttachment[];
}

// Response for a single attachment
export interface AttachmentResponse {
    success: boolean;
    data: MessageAttachment | VoiceNote;
}

// Basic success response
export interface BasicResponse {
    success: boolean;
    message: string;
}