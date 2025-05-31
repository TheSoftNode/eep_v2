export interface AuditLogEntry {
    id: string;
    actionType: string;
    title: string;
    description: string;
    performedBy: {
        userId: string;
        userName: string;
        userEmail: string;
        userRole: string;
        userAvatar?: string;
    };
    targetResource?: {
        type: 'user' | 'project' | 'workspace' | 'system';
        id: string;
        name: string;
    };
    metadata?: Record<string, any>;
    status: 'success' | 'warning' | 'error' | 'pending';
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: any;
    createdAt: string;
}

export interface AuditLogQueryParams {
    page?: number;
    limit?: number;
    actionType?: string;
    performedBy?: string;
    targetResourceType?: string;
    status?: string;
    severity?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface AuditLogResponse {
    success: boolean;
    data: AuditLogEntry[];
    count: number;
    page: number;
    totalPages: number;
    totalCount: number;
}

export interface AuditLogStatsResponse {
    success: boolean;
    data: {
        total: number;
        today: number;
        thisWeek: number;
        thisMonth: number;
        byActionType: Record<string, number>;
        byStatus: Record<string, number>;
        bySeverity: Record<string, number>;
        byUser: Array<{
            userId: string;
            userName: string;
            count: number;
        }>;
        recentActivity: number;
    };
}