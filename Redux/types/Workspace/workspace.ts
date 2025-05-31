import { FirebaseDate } from "../Projects";
import { ProjectSummary } from "./project-summary";
// import { ProjectSummary } from "../Users/profile";

/**
 * Main Workspace entity
 */
export interface Workspace {
    // Basic information
    id: string;
    name: string;
    description: string;
    projectType: string;
    tags: string[];

    // Dates and status
    startDate: FirebaseDate;
    endDate: FirebaseDate | null;
    status: WorkspaceStatus;

    // Creator and ownership information
    createdBy: string;
    creatorName?: string;
    creatorRole: string;

    // Participation 
    memberCount: number;
    learnerIds: string[];
    mentorIds: string[];
    roles: Record<string, WorkspaceRole>; // userId -> role
    specialties: Record<string, string>; // userId -> specialty

    // Content and references
    projectIds: string[];
    availableRoles: string[];

    // Workspace settings
    visibility: 'public' | 'private' | 'organization';
    joinApproval: 'automatic' | 'admin_approval' | 'mentor_approval';
    allowLearnerInvites: boolean;
    aiIntegration: {
        enabled: boolean;
        features: AIFeature[];
    };

    // Tracking fields
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    lastActivityAt: FirebaseDate;
}

/**
 * Workspace status
 */
export type WorkspaceStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

/**
 * Workspace role
 */
export type WorkspaceRole = 'admin' | 'mentor' | 'learner' | 'observer';

/**
 * AI integration features
 */
export type AIFeature = 'code_assistant' | 'document_analysis' | 'progress_tracking' | 'feedback_analysis' | 'knowledge_base';

/**
 * Workspace member with role and detailed information
 */
export interface WorkspaceMember {
    // Basic member info
    id: string;
    userId: string;
    workspaceId: string;

    // User details
    fullName: string;
    email: string;
    photoURL: string | null;
    userRole: string; // Global role in the system

    // Workspace-specific role and metadata
    workspaceRole: WorkspaceRole;
    specialty?: string;
    joinedAt: FirebaseDate;
    invitedBy?: string;

    // Permissions within workspace
    permissions: {
        canManageMembers: boolean;
        canInvite: boolean;
        canManageProjects: boolean;
        canCreateMilestones: boolean;
        canEditContent: boolean;
        canProvideFeedback: boolean;
        canAccessAnalytics: boolean;
    };

    // Activity and status
    isActive: boolean;
    lastActiveAt?: FirebaseDate;
    status?: 'online' | 'offline' | 'away';
}

/**
 * Simplified workspace data for listings and references
 */
export interface WorkspaceSummary {
    id: string;
    name: string;
    description: string;
    projectType: string;
    memberCount: number;
    projectCount: number;
    status: WorkspaceStatus;
    createdBy: string;
    creatorName: string;
    startDate: FirebaseDate;
    endDate: FirebaseDate | null;
    tags: string[];
    userRole?: WorkspaceRole; // Current user's role in this workspace
}

/**
 * Workspace with expanded data for detailed view
 */
export interface WorkspaceDetailed extends Workspace {
    learners: WorkspaceMember[];
    mentors: WorkspaceMember[];
    admins: WorkspaceMember[];
    projects: ProjectSummary[];
    milestones: WorkspaceMilestone[];
    recentActivity: WorkspaceActivity[];
    userProgress?: LearnerProgress; // Only for current user if learner
    learnersProgress?: LearnerProgressSummary[]; // Only for mentors/admins
}

/**
 * Workspace milestone for tracking important dates and achievements
 */
export interface WorkspaceMilestone {
    id: string;
    workspaceId: string;
    title: string;
    description?: string;
    dueDate: FirebaseDate;
    completedDate?: FirebaseDate;
    status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
    isPublic: boolean; // Visible to all members vs. only mentors/admins
    associatedProjectIds?: string[];
    createdBy: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    updatedBy?: string;
}

/**
 * Activity log entry for a workspace
 */
export interface WorkspaceActivity {
    id: string;
    workspaceId: string;

    // Actor information
    userId: string;
    userName: string;
    userRole: WorkspaceRole;
    userAvatar?: string | null;

    // Activity details
    action: WorkspaceActionType;
    entityType: WorkspaceEntityType;
    entityId?: string;
    entityName?: string;

    // Additional context
    details: Record<string, any>;
    metadata?: Record<string, any>;
    isSystemGenerated: boolean;
    importance: 'low' | 'medium' | 'high';
    visibility: 'all' | 'mentors_only' | 'admin_only';

    // Tracking
    createdAt: FirebaseDate;
}

/**
 * Type of action performed in a workspace
 */
export type WorkspaceActionType =
    // Membership actions
    'joined' | 'left' | 'invited' | 'removed' | 'role_changed' |
    // Content actions
    'created' | 'updated' | 'deleted' | 'commented' | 'shared' | 'viewed' |
    // Project actions
    'added_project' | 'removed_project' | 'completed_task' | 'submitted_work' |
    // Milestone actions
    'added_milestone' | 'completed_milestone' | 'updated_milestone' |
    // Progress actions
    'submitted_update' | 'provided_feedback' | 'approved_submission' |
    // Communication actions
    'posted_message' | 'scheduled_meeting' | 'uploaded_file';

/**
 * Type of entity in a workspace activity
 */
export type WorkspaceEntityType =
    'workspace' | 'project' | 'task' | 'milestone' | 'file' |
    'member' | 'message' | 'comment' | 'progress_update' | 'meeting';

/**
 * Invitation to join a workspace
 */
export interface WorkspaceInvitation {
    id: string;
    workspaceId: string;

    // Workspace preview info
    workspaceName: string;
    workspaceDescription: string;

    // Sender information
    senderId: string;
    senderName: string;
    senderRole: WorkspaceRole;
    senderPhoto?: string;

    // Recipient information
    recipientId?: string; // Optional if inviting by email
    recipientEmail: string;
    recipientName?: string;

    // Invitation details
    role: WorkspaceRole;
    specialty?: string;
    message?: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';

    // For public workspaces - join requests
    isJoinRequest: boolean;

    // Tracking
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    expiresAt: FirebaseDate;
    respondedAt?: FirebaseDate;
}

/**
 * File in a workspace
 */
export interface WorkspaceFile {
    id: string;
    workspaceId: string;
    projectId?: string;

    // File metadata
    name: string;
    description?: string;
    size: number;
    sizeFormatted: string;
    type: FileType;
    mimeType: string;
    extension: string;

    // Storage information
    path: string;
    downloadUrl: string;
    thumbnailUrl?: string;

    // Organization
    folder: string;
    folderPath: string[];
    tags?: string[];

    // Permissions
    isPrivate: boolean;
    accessLevel: 'all_members' | 'mentors_only' | 'specific_members';
    accessibleTo?: string[]; // User IDs who can access if specific_members

    // Sharing
    isShared: boolean;
    shareSettings?: {
        shareId: string;
        accessUrl: string;
        expiresAt: FirebaseDate;
        password?: string;
        downloadCount: number;
    };

    // Ownership and tracking
    uploadedBy: string;
    uploaderName: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    lastAccessedAt?: FirebaseDate;
}

/**
 * File type enum
 */
export type FileType =
    'image' | 'video' | 'audio' | 'document' | 'spreadsheet' |
    'presentation' | 'pdf' | 'text' | 'code' | 'archive' | 'folder' | 'other';

/**
 * File folder in a workspace
 */
export interface WorkspaceFolder {
    id: string;
    workspaceId: string;
    name: string;
    parentId?: string;
    path: string[];
    createdBy: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    fileCount: number;
    subfolderCount: number;
    isShared: boolean;
}

/**
 * Progress tracking for a learner
 */
export interface LearnerProgress {
    id: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    workspaceId: string;

    // Overall progress
    overallProgress: number;
    taskCompletion: {
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
    };

    // Sprint information
    currentSprintId?: string;
    sprints: WeeklySprint[];

    // Tasks assigned to the learner
    tasks: ProgressTask[];

    // Learning goals and outcomes
    learningGoals: string[];
    achievedGoals: string[];

    // Skill development tracking
    skills: {
        skillName: string;
        initialLevel: number;
        currentLevel: number;
        targetLevel: number;
    }[];

    // Feedback summary
    feedbackSummary: {
        lastFeedbackDate?: FirebaseDate;
        positiveAreas: string[];
        improvementAreas: string[];
        mentorRating?: number;
    };

    // Time tracking
    totalHoursSpent: number;
    weeklyHoursAverage: number;
    lastActiveAt: FirebaseDate;

    // Tracking
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
}

/**
 * Summary of learner progress for mentors to view
 */
export interface LearnerProgressSummary {
    id: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    overallProgress: number;
    currentSprint?: string;
    tasksCompleted: number;
    totalTasks: number;
    lastUpdateAt: FirebaseDate;
    status: 'on_track' | 'at_risk' | 'behind' | 'ahead';
    needsAttention: boolean;
    lastFeedbackDate?: FirebaseDate;
}

/**
 * Task in a learner's progress
 */
export interface ProgressTask {
    id: string;
    title: string;
    description: string;
    projectId?: string;
    status: 'not_started' | 'in_progress' | 'under_review' | 'completed' | 'blocked';
    priority: 'low' | 'medium' | 'high';
    dueDate?: FirebaseDate;
    completedAt?: FirebaseDate;

    // Assignment information
    assignedBy?: string;
    assignedByName?: string;
    assignedAt?: FirebaseDate;

    // Additional task info
    estimatedHours?: number;
    actualHours?: number;
    dependencies?: string[]; // IDs of tasks that must be completed first
    blockers?: string[]; // Reasons for blocked status

    // Review and feedback
    reviewStatus?: 'not_submitted' | 'awaiting_review' | 'changes_requested' | 'approved';
    feedback?: {
        id: string;
        mentorId: string;
        mentorName: string;
        content: string;
        rating?: number;
        createdAt: FirebaseDate;
    }[];
}

/**
 * Weekly sprint for tracking progress
 */
export interface WeeklySprint {
    id: string;
    workspaceId: string;
    learnerId: string;

    // Sprint metadata
    week: number;
    startDate: FirebaseDate;
    endDate: FirebaseDate;

    // Goals and achievements
    goals: string[];
    completedGoals: string[];
    progress: number;

    // Task tracking for the sprint
    tasks: {
        taskId: string;
        title: string;
        status: string;
        progress: number;
    }[];

    // Notes and reflection
    learnerNotes?: string;
    challenges?: string;
    learnings?: string;
    nextSteps?: string;
    hoursSpent: number;

    // Mentor feedback
    feedback?: SprintFeedback[];

    // Status tracking
    status: 'upcoming' | 'active' | 'completed' | 'missed';
    submittedAt?: FirebaseDate;
    reviewedAt?: FirebaseDate;
    overallAssessment?: 'on_track' | 'ahead' | 'behind' | 'at_risk';

    // Tracking fields
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
}

/**
 * Feedback on a sprint
 */
export interface SprintFeedback {
    id: string;
    sprintId: string;
    mentorId: string;
    mentorName: string;
    mentorPhoto?: string;
    content: string;
    rating?: number; // Optional rating (e.g., 1-5)
    isPrivate: boolean; // Whether feedback is visible to all workspace mentors
    createdAt: FirebaseDate;
    updatedAt?: FirebaseDate;
}

/**
 * Message in the workspace chat
 */
export interface WorkspaceMessage {
    id: string;
    workspaceId: string;
    channelId: string;

    // Sender information
    senderId: string;
    senderName: string;
    senderRole: WorkspaceRole;
    senderPhoto?: string;

    // Message content
    content: string;
    contentType: 'text' | 'code' | 'file' | 'link' | 'system';
    attachments?: {
        id: string;
        type: string;
        name: string;
        url: string;
        size?: number;
        thumbnailUrl?: string;
    }[];

    // Thread information
    isThreadStarter: boolean;
    threadId?: string;
    threadResponseCount?: number;

    // Mentions and reactions
    mentions: string[]; // Array of user IDs
    reactions?: {
        [emojiId: string]: string[]; // emoji -> array of user IDs
    };

    // Status tracking
    isEdited: boolean;
    isPinned: boolean;
    readBy: string[]; // Array of user IDs

    // Tracking fields
    createdAt: FirebaseDate;
    updatedAt?: FirebaseDate;
    deletedAt?: FirebaseDate;
    isDeleted: boolean;
}

/**
 * Workspace channel for organizing messages
 */
export interface WorkspaceChannel {
    id: string;
    workspaceId: string;
    name: string;
    description?: string;
    type: 'general' | 'project' | 'team' | 'announcements' | 'mentors_only';
    isPrivate: boolean;
    members?: string[]; // Only for private channels
    createdBy: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    messageCount: number;
    lastMessageAt?: FirebaseDate;
    lastMessagePreview?: string;
}

/**
 * AI-assisted note in a workspace
 */
export interface WorkspaceNote {
    id: string;
    workspaceId: string;
    projectId?: string;
    title: string;
    content: string;
    isPrivate: boolean;
    tags: string[];
    createdBy: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    aiSuggestions?: {
        id: string;
        type: 'improvement' | 'resource' | 'insight' | 'question';
        content: string;
        createdAt: FirebaseDate;
        isApplied: boolean;
    }[];
}