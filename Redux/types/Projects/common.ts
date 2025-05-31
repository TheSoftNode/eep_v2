

export type FirebaseDate =
    | Date
    | { _seconds: number; _nanoseconds: number }
    | string
    | Date;


export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    count: number;
    totalCount?: number;
    pagination?: PaginationInfo;
}

export interface CursorPaginationInfo {
    hasMore: boolean;
    nextCursor?: string | null;
    totalCount: number;
}

export interface CursorPaginatedResponse<T> extends ApiResponse<T[]> {
    count: number;
    pagination?: CursorPaginationInfo;
}

export interface FileAttachment {
    id: string;
    fileName: string;
    fileType: string;
    fileSize?: number;
    url: string;
}

export interface TimeEntry {
    id: string;
    userId: string;
    userName: string;
    duration: number; // in minutes
    description?: string;
    startedAt: FirebaseDate;
    endedAt?: FirebaseDate;
    isManual?: boolean;
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    userRole?: string;
    content: string;
    createdAt: FirebaseDate;
    updatedAt?: FirebaseDate;
    attachments?: FileAttachment[];
    isPrivate?: boolean;
}

// Common visibility and status types
export type Visibility = 'public' | 'members' | 'mentors-only' | 'private';
export type ActivityScope = 'project' | 'area' | 'task' | 'member' | 'resource' | 'update' | 'feedback';
export type ProjectMemberRole = 'owner' | 'contributor' | 'mentor' | 'reviewer' | 'observer' | 'member';
export type FeedbackType = 'guidance' | 'review' | 'approval' | 'rejection' | 'general';
export type ResourceType = 'document' | 'video' | 'link' | 'code' | 'dataset' | 'template' | 'guide' | 'other';
export type ResourceCategory = 'learning' | 'reference' | 'tool' | 'research' | 'dataset';