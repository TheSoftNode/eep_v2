import { FirebaseDate, ProjectMemberRole, ResourceType, ResourceCategory, Visibility } from './common';

/**
 * Main Project entity
 */
export interface Project {
    id: string;
    name: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    startDate: FirebaseDate;
    endDate: FirebaseDate;
    status: 'active' | 'completed' | 'archived' | 'on-hold';
    progress: number; // 0-100, calculated based on tasks
    technologies: string[];

    workspaceId?: string;

    // Reference arrays for normalized data structure
    memberIds: string[];
    areaIds: string[]; // Array of area IDs
    taskIds: string[]; // Array of task IDs
    resourceIds: string[]; // Array of resource IDs
    feedbackIds: string[]; // Array of feedback IDs

    // Learning objectives
    learningObjectives: string[];

    // Mentor information
    primaryMentorId?: string;
    mentorIds: string[]; // All assigned mentors

    // Completion criteria
    completionCriteria?: string[];

    // Grading schema
    gradingSchema?: {
        type: 'percentage' | 'letter' | 'points';
        maxPoints?: number;
        passingThreshold?: number;
    };

    // External links
    repoUrl?: string | null;
    demoUrl?: string | null;

    // Statistics and metrics
    taskCount?: number;
    areaCount?: number;
    completedTaskCount?: number;
    totalEstimatedHours?: number;
    actualHours?: number;

    // Tracking fields
    createdBy: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    lastActivityAt?: FirebaseDate;

    // Academic term information (optional)
    term?: string;
    academicYear?: string;

    // Visibility settings
    visibility?: Visibility;
}

/**
 * Project Member representation
 */
export interface ProjectMember {
    id: string;
    projectId: string;
    userId: string;
    name: string;
    role: ProjectMemberRole;
    avatar?: string | null;
    initials?: string;
    joinedAt: FirebaseDate;
    permissions?: {
        canEdit: boolean;
        canManageMembers: boolean;
        canCreateTasks: boolean;
        canAssignTasks: boolean;
        canReviewSubmissions: boolean;
        canGrade: boolean;
        canSubmitUpdates: boolean;
    };
    contributions?: {
        taskCount: number;
        completedTaskCount: number;
        totalHours: number;
        lastActiveAt: FirebaseDate;
    };
}

/**
 * Project Resource entity
 */
export interface ProjectResource {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    type: ResourceType;
    url?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    category?: ResourceCategory;
    tags?: string[];
    addedBy: string;
    addedAt: FirebaseDate;
    updatedAt?: FirebaseDate;
    isRequired?: boolean;
    order?: number;
}

/**
 * Project Feedback entity
 */
export interface ProjectFeedback {
    id: string;
    projectId: string;
    authorId: string;
    authorName: string;
    authorRole: 'mentor' | 'admin' | 'peer' | 'external';
    content: string;
    type: 'guidance' | 'review' | 'approval' | 'rejection' | 'general';
    rating?: number; // Optional rating (1-5)
    targetType?: 'project' | 'task' | 'update' | 'area';
    targetId?: string; // ID of specific entity being commented on
    taskId?: string;
    createdAt: FirebaseDate;
    updatedAt?: FirebaseDate;
    isPrivate?: boolean; // If true, only visible to mentors and the recipient
    relatedMilestone?: string;
    status?: 'pending' | 'acknowledged' | 'implemented' | 'declined';
    attachments?: Array<{
        id: string;
        fileName: string;
        fileType: string;
        fileSize?: number;
        url: string;
    }>;
}

/**
 * Project Activity entity for tracking changes
 */
export interface ProjectActivity {
    id: string;
    projectId: string;
    userId: string;
    userName: string;
    userAvatar?: string | null;
    action: string;
    actorRole?: string;
    workspaceId?: string;
    workspaceName?: string;
    isSystemGenerated?: boolean;
    details: {
        [key: string]: any;
        taskId?: string;
        taskTitle?: string;
        from?: string;
        to?: string;
        areaId?: string;
        areaName?: string;
        progressChange?: string;
        week?: string;
        updateId?: string;
        resourceId?: string;
        resourceName?: string;
    };
    createdAt: FirebaseDate;
    scope?: 'project' | 'area' | 'task' | 'member' | 'resource' | 'update' | 'feedback';
    visibility?: Visibility;
}

/**
 * Project Update for periodic progress reporting
 */
export interface ProjectUpdate {
    id: string;
    projectId: string;
    userId: string;
    userName: string;
    userRole?: string;
    week: string;
    period: {
        start: FirebaseDate;
        end: FirebaseDate;
    };
    content: {
        completed: string;
        challenges?: string;
        nextSteps: string;
        learnings?: string;
        hoursSpent?: number;
        taskProgress?: Array<{
            taskId: string;
            taskTitle: string;
            status: string;
            progressChange?: number;
        }>;
    };
    privateNotes?: string;
    feedback?: Array<{
        id: string;
        userId: string;
        userName: string;
        userRole?: string;
        comment: string;
        createdAt: FirebaseDate;
        updatedAt?: FirebaseDate;
        isPrivate?: boolean;
    }>;
    overallStatus?: 'on-track' | 'ahead' | 'behind' | 'at-risk';
    attachments?: Array<{
        id: string;
        fileName: string;
        fileType: string;
        fileSize?: number;
        url: string;
    }>;
    isPublished: boolean;
    draftSavedAt?: FirebaseDate;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
}