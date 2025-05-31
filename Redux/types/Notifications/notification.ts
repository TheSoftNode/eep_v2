
// Define notification types
export type NotificationType =
    | 'project_created' | 'project_updated' | 'project_completed' | 'project_added'
    | 'project_removed' | 'role_updated' | 'project_complete_prompt'
    | 'task_assigned' | 'task_updated' | 'task_completed'
    | 'workspace_created' | 'workspace_updated' | 'workspace_invitation'
    | 'message_received' | 'message_mentioned' | 'workspace_removal'
    | 'progress_update' | 'mentor_feedback' | 'workspace_project_added'
    | 'session_requested' | 'session_confirmed' | 'session_reminder'
    | 'system_announcement' | 'session_rejected' | 'session_completed'
    | 'session_cancelled' | 'join_request_processed' | 'join_request'
    | 'session_rescheduled' | 'workspace_invitation_accepted' | 'workspace_role_updated'
    | 'invitation_declined' | 'invitation_accepted' | 'invitation_cancelled'
    | 'workspace_join_request' | 'join_request_declined' | 'join_request_accepted'
    | 'join_request_withdrawn';


export type NotificationPriority = 'low' | 'normal' | 'high';

// Interfaces for notification data
export interface Notification {
    id: string;
    userId: string;
    createdBy: string;
    type: NotificationType;
    title: string;
    message: string;
    projectId: string | null;
    workspaceId: string | null;
    taskId: string | null;
    sessionId: string | null;
    updateId: string | null;
    priority: NotificationPriority;
    read: boolean;
    readAt?: Date | null;
    createdAt: Date;
    metadata?: Record<string, any> | null;
}

// Frontend-friendly notification format with relative time
export interface FormattedNotification {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: NotificationType;
    priority: NotificationPriority;
    projectId: string | null;
    workspaceId: string | null;
    taskId: string | null;
    sessionId: string | null;
    updateId: string | null;
    createdAt: Date;
    metadata?: Record<string, any> | null;
}

export interface NotificationStats {
    total: number;
    unread: number;
    byType: Record<string, number>;
    mostRecent: Notification | null;
}

export interface NotificationCategoryCount {
    projects: number;
    tasks: number;
    messages: number;
    sessions: number;
    system: number;
}

export interface CreateNotificationParams {
    userId: string;
    createdBy: string;
    type: NotificationType;
    title: string;
    reviewId?: string;
    message: string;
    projectId?: string;
    workspaceId?: string;
    taskId?: string;
    sessionId?: string;
    updateId?: string;
    sendEmail?: boolean;
    sendPush?: boolean;
    priority?: NotificationPriority;
    metadata?: Record<string, any>;
}

export interface NotificationResponse {
    success: boolean;
    message?: string;
    data?: any;
    count?: number;
    unreadCount?: number;
    categories?: NotificationCategoryCount;
    page?: number;
    totalPages?: number;
}
