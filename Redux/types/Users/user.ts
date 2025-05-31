export type UserRole = 'user' | 'learner' | 'mentor' | 'admin';


export interface User {
    // Identity
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    disabled?: boolean;
    profilePicture?: string | null;

    // Auth & Security
    twoFactorEnabled?: boolean;
    twoFactorPending?: boolean;
    twoFactorSecret?: string | null;
    twoFactorRecoveryCodes?: string[];
    provider?: 'google' | 'github' | 'password' | 'passwordless';
    lastLogin?: string;
    sessionKey?: string;
    sessionExpiry?: string;

    // Contact & Bio
    bio?: string | null;
    company?: string | null;
    website?: string | null;
    github?: string | null;

    // App & Feature Flags
    status?: 'online' | 'offline' | 'away';
    lastActive?: string;
    fcmToken?: string;

    // Project and workspace associations
    projects?: string[];
    workspaces?: string[];

    // Chat and mentoring
    groups?: string[]; // Chat group IDs
    mentees?: string[];
    mentors?: string[];

    // Notification Preferences
    notificationPreferences?: {
        email: NotificationChannelPreferences;
        push: NotificationChannelPreferences;
        inApp: NotificationChannelPreferences;
    };

    emailPreferences?: {
        marketing?: boolean;
        productUpdates?: boolean;
    };

    settings?: {
        theme?: 'light' | 'dark';
        language?: string;
        timezone?: string;
    };


    // Audit & Metadata
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    creatorId?: string;
    metadata?: Record<string, any>;
}

export interface NotificationChannelPreferences {
    projectUpdates: boolean;
    taskAssignments: boolean;
    mentorSessions: boolean;
    messages: boolean;
    weeklyDigest: boolean;
}


export interface ILoginRequest {
    email: string;
    rememberMe?: boolean;
}

export interface IVerifyEmailRequest {
    email: string;
    verificationCode: string;
    rememberMe?: boolean;
}

// Database models
export interface IRememberMeToken {
    userId: string;
    email: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

// Response interfaces
export interface IAuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: IUserResponse;
    rememberMe?: boolean;
    requireTwoFactor?: boolean
}

export interface IRememberMeResponse {
    success: boolean;
    autoLogin: boolean;
    message: string;
    token?: string;
    user?: IUserResponse;
}

export interface IUserResponse {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    disabled?: boolean;
    emailVerified: boolean;
    profilePicture?: string | null;
}

// Admin
export interface CreateUserRequest {
    email: string;
    fullName: string;
    role?: UserRole
    profilePicture?: string;
    bio?: string;
    company?: string;
    website?: string;
    github?: string;
    metadata?: {
        expertise?: string[];
        skills?: string[];
        languages?: string[];
        experience?: number;
        timezone?: string;
        isAvailable?: boolean;
        availability?: {
            days: string[];
            timeSlots: string[];
        };
        achievements?: string[];
    };
}

export interface UpdateUserRequest {
    fullName?: string;
    role?: UserRole
    profilePicture?: string;
    bio?: string;
    company?: string;
    website?: string;
    github?: string;
    notificationPreferences?: User['notificationPreferences'];
    emailPreferences?: User['emailPreferences'];
    settings?: User['settings'];
}

export interface UpdateUserRoleRequest {
    role: UserRole;
}

export interface ToggleUserStatusRequest {
    disabled: boolean;
}

export interface UserQueryParams {
    page?: string;
    limit?: string;
    orderBy?: string;
    order?: 'asc' | 'desc';
    searchQuery?: string;
    searchField?: 'email' | 'fullName' | 'role';
    status?: 'active' | 'disabled';
}

// Response interfaces
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
    totalCount?: number;
    pagination?: PaginationInfo;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
}

export interface UserStats {
    totalUsers: number;
    recentUsers: number;
    disabledUsers: number;
    activeUsers: number;
    growthRate: number;
    byRole: Record<string, number>;
}