import { User } from "../Users/user";

export type MessageType = 'text' | 'file' | 'image' | 'video' | 'audio' | 'code' | 'system' | 'reply';
export type ConversationType = 'direct' | 'group';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// export interface User {
//     id: string;
//     fullName: string;
//     email: string;
//     role: string;
//     profilePicture?: string | null;
// }

export interface MessageAttachment {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
    uploadedAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    senderId: string;
    sender?: {
        id: string;
        fullName: string;
        profilePicture?: string | null;
    };
    timestamp: string;
    editedAt?: string;
    type: MessageType;
    status?: MessageStatus;
    attachments?: MessageAttachment[];
    readBy: string[];
    replyTo?: string | null;
    mentions?: string[];
}

export interface Conversation {
    id: string;
    title: string;
    type: ConversationType;
    participants: User[];
    lastMessage?: {
        content: string;
        senderId: string;
        senderName: string;
        timestamp: string;
        type: MessageType;
    };
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
    projectId?: string | null;
    taskId?: string | null;
    avatar?: string | null;
    isGroup: boolean;
    isPinned: boolean;
    isMuted: boolean;
    createdBy?: string;
    messages?: Message[];
}

export interface Contact {
    id: string;
    fullName: string;
    email: string;
    role: string;
    profilePicture?: string | null;
    lastActive?: string | null;
    status?: 'online' | 'offline' | 'away' | 'busy';
    conversationId?: string | null;
    projectRole?: string;
    lastInteraction?: string;
}

// Response types
export interface ConversationResponse {
    success: boolean;
    count: number;
    data: Conversation[];
    page: number;
    totalPages: number;
    totalCount: number;
}

export interface MessageResponse {
    success: boolean;
    message: string;
    data: Message;
}

export interface ContactsResponse {
    success: boolean;
    count: number;
    data: Contact[];
}

export interface UnreadCountResponse {
    success: boolean;
    total: number;
    conversations: {
        [key: string]: {
            count: number;
            isMuted: boolean;
        }
    };
}

// Request types
export interface CreateConversationRequest {
    participants: string[];
    title?: string;
    type?: ConversationType;
    projectId?: string;
    taskId?: string;
    initialMessage?: string;
}

export interface SendMessageRequest {
    content: string;
    type?: MessageType;
    attachments?: Omit<MessageAttachment, 'id' | 'uploadedAt'>[];
    replyTo?: string;
    mentions?: string[];
}

export interface AddParticipantsRequest {
    conversationId: string;
    participants: string[];
}