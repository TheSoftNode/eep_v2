
import {
    ResourceType,
    ResourceCategory,
    Visibility,
    ProjectMemberRole,
    FeedbackType,
    FileAttachment
} from './common';
import { TaskPriority, TaskStatus, TaskType, RubricCriterion } from './task';
import { AreaStatus } from './area';

// Project request types
export interface CreateProjectRequest {
    name: string;
    description: string;
    category: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    startDate: string;
    endDate: string;
    technologies?: string[];
    learningObjectives?: string[];
    workspaceId?: string;
    primaryMentorId?: string;
    mentorIds?: string[];
    repoUrl?: string;
    demoUrl?: string;
    completionCriteria?: string[];
    gradingSchema?: {
        type: 'percentage' | 'letter' | 'points';
        maxPoints?: number;
        passingThreshold?: number;
    };
    resources?: Array<{
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
        isRequired?: boolean;
        order?: number;
    }>;
    visibility?: Visibility;
}

export interface UpdateProjectRequest {
    id: string;
    name?: string;
    description?: string;
    category?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'completed' | 'archived' | 'on-hold';
    technologies?: string[];
    learningObjectives?: string[];
    workspaceId?: string;
    primaryMentorId?: string;
    mentorIds?: string[];
    repoUrl?: string | null;
    demoUrl?: string | null;
    completionCriteria?: string[];
    gradingSchema?: {
        type: 'percentage' | 'letter' | 'points';
        maxPoints?: number;
        passingThreshold?: number;
    };
    visibility?: Visibility;
}

export interface UpdateProgressRequest {
    // For manually updating project progress
    progress: number;
    notes?: string;
    recalculateFromTasks?: boolean; // If true, calculate from tasks instead of using provided progress
}

// Area request types
export interface AddProjectAreaRequest {
    name: string;
    description?: string;
    projectId: string;
    status?: AreaStatus;
    learningFocus?: string[];
    technologies?: string[];
    startDate?: string;
    endDate?: string;
    estimatedHours?: number;
    assignedMentorId?: string;
    order?: number;
    customAttributes?: Record<string, any>;
}

export interface UpdateProjectAreaRequest {
    name?: string;
    description?: string;
    status?: AreaStatus;
    learningFocus?: string[];
    technologies?: string[];
    startDate?: string;
    endDate?: string;
    estimatedHours?: number;
    assignedMentorId?: string;
    order?: number;
    customAttributes?: Record<string, any>;
    progress?: number;
}

export interface UpdateProjectAreasRequest {
    areas: {
        id: string;
        name?: string;
        description?: string;
        status?: AreaStatus;
        learningFocus?: string[];
        technologies?: string[];
        startDate?: string;
        endDate?: string;
        estimatedHours?: number;
        assignedMentorId?: string;
        order?: number;
        progress?: number;
    }[];
}

// Task request types
export interface AddTaskRequest {
    title: string;
    description?: string;
    projectId: string;
    projectAreaId?: string | null;
    dueDate: string;
    startDate?: string;
    estimatedHours?: number;
    assigneeId?: string | null;
    collaboratorIds?: string[];
    priority?: TaskPriority;
    status?: TaskStatus;
    week?: number;
    skills?: string[];
    learningObjectives?: string[];
    taskType?: TaskType;
    weight?: number;
    maxGrade?: number;
    dependsOn?: string[];
    order?: number;
    resources?: Array<{
        title: string;
        type: string;
        url?: string;
        description?: string;
    }>;
    customFields?: Record<string, any>;
    visibility?: Visibility;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    projectAreaId?: string | null;
    status?: TaskStatus;
    dueDate?: string;
    startDate?: string;
    estimatedHours?: number;
    assigneeId?: string | null;
    collaboratorIds?: string[];
    priority?: TaskPriority;
    week?: number;
    skills?: string[];
    learningObjectives?: string[];
    taskType?: TaskType;
    weight?: number;
    maxGrade?: number;
    dependsOn?: string[];
    order?: number;
    resources?: Array<{
        id?: string;
        title: string;
        type: string;
        url?: string;
        description?: string;
    }>;
    grade?: number;
    gradingNotes?: string;
    feedback?: string;
    customFields?: Record<string, any>;
    visibility?: Visibility;
    submission?: {
        content: string;
        attachments?: Partial<FileAttachment>[];
    };
}

export interface UpdateTaskStatusRequest {
    status: TaskStatus;
    actualHours?: number;
    progressUpdate?: string;
}

export interface GradeTaskRequest {
    grade: number;
    gradingNotes?: string;
    feedback?: string;
    skills?: string[];
    rubric?: {
        criteria: RubricCriterion[];
    };
}

// Resource request types
export interface AddProjectResourceRequest {
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
    isRequired?: boolean;
    order?: number;
}

// Feedback request types
export interface AddFeedbackRequest {
    content: string;
    type?: FeedbackType;
    rating?: number;
    targetType?: 'project' | 'task' | 'update' | 'area';
    targetId?: string;
    isPrivate?: boolean;
    attachments?: Partial<FileAttachment>[];
}

// Update request types
export interface ProgressUpdateRequest {
    week: string;
    period: {
        start: string;
        end: string;
    };
    completed: string;
    challenges?: string;
    nextSteps: string;
    learnings?: string;
    privateNotes?: string;
    hoursSpent?: number;
    taskProgress?: Array<{
        taskId: string;
        status: string;
        progressChange?: number;
    }>;
    overallStatus?: 'on-track' | 'ahead' | 'behind' | 'at-risk';
    attachments?: Partial<FileAttachment>[];
    isPublished?: boolean; // If false, save as draft
}

// Member management request types
export interface AddMemberRequest {
    id: string; // projectId
    memberId: string;
    role: ProjectMemberRole;
    permissions?: {
        canEdit: boolean;
        canManageMembers: boolean;
        canCreateTasks: boolean;
        canAssignTasks: boolean;
        canReviewSubmissions: boolean;
        canGrade: boolean;
        canSubmitUpdates: boolean;
    };
}

export interface UpdateMemberRoleRequest {
    projectId: string;
    memberId: string;
    role: ProjectMemberRole;
    permissions?: {
        canEdit: boolean;
        canManageMembers: boolean;
        canCreateTasks: boolean;
        canAssignTasks: boolean;
        canReviewSubmissions: boolean;
        canGrade: boolean;
        canSubmitUpdates: boolean;
    };
}

export interface RemoveMemberRequest {
    id: string; // projectId
    memberId: string;
    reassignTasksTo?: string; // Optional user ID to reassign tasks to
}

// Search request types
export interface SearchProjectsRequest {
    category?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    status?: string;
    search?: string;
    technologies?: string[];
    mentorId?: string;
    dateRange?: { start: string; end: string };
    memberCount?: { min?: number; max?: number };
    progress?: { min?: number; max?: number };
    cursor?: string;
    limit?: number;
}