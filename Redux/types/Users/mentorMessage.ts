export interface MessageData {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    recipientId: string;
    recipientName: string;
    recipientRole: string;
    subject: string;
    content: string;
    isRead: boolean;
    isStarred: boolean;
    isArchived: boolean;
    threadId?: string;
    replyToId?: string;
    attachments?: string[];
    priority: 'low' | 'normal' | 'high' | 'urgent';
    createdAt: string;
    updatedAt: string;
    readAt?: string;
    deletedBySender?: boolean;
    deletedByRecipient?: boolean;
}

export interface MessageThread {
    id: string;
    participants: {
        id: string;
        name: string;
        role: string;
    }[];
    subject: string;
    lastMessageAt: string;
    messageCount: number;
    unreadCount: {
        [userId: string]: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface SendMessageRequest {
    recipientId: string;
    subject: string;
    content: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    threadId?: string;
    replyToId?: string;
}

export interface MessageStats {
    totalSent: number;
    totalReceived: number;
    unreadCount: number;
    starredCount: number;
    activeThreads: number;
}

export interface MessageFilters {
    isRead?: boolean;
    isStarred?: boolean;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    page?: number;
    limit?: number;
}

export interface ThreadMessagesResponse {
    thread: MessageThread;
    messages: MessageData[];
}

// API Response interfaces
export interface MessagesResponse {
    success: boolean;
    count: number;
    totalCount?: number;
    pagination?: {
        page: number;
        limit: number;
        hasMore: boolean;
        totalPages: number;
    };
    data: MessageData[];
}

export interface ThreadsResponse {
    success: boolean;
    count: number;
    data: MessageThread[];
}

export interface MessageStatsResponse {
    success: boolean;
    data: MessageStats;
}

export interface SendMessageResponse {
    success: boolean;
    message: string;
    data: {
        messageId: string;
        threadId: string;
    } & MessageData;
}