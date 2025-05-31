// Contact and related types
export type ContactType = 'mentor' | 'peer' | 'group' | 'system';

export interface Contact {
    id: number;
    name: string;
    role: string;
    avatar?: string;
    initials: string;
    online: boolean;
    lastActive?: string;
    unreadCount?: number;
    tags?: string[];
    type: ContactType;
}

// Message and related types
export type MessageType = 'text' | 'file' | 'image' | 'code' | 'assignment';

export interface MessageAttachment {
    id: number;
    name: string;
    type: string;
    url: string;
    size: string;
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    read: boolean;
    type?: MessageType;
    attachments?: MessageAttachment[];
}

// Assignment types
export type AssignmentStatus = 'pending' | 'submitted' | 'reviewed';

export interface Assignment {
    id: number;
    title: string;
    dueDate: string;
    status: AssignmentStatus;
    description: string;
}