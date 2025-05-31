import { FileAttachment, FirebaseDate, TimeEntry, Visibility } from './common';

/**
 * Task status types
 */
export type TaskStatus = 'todo' | 'upcoming' | 'in-progress' | 'submitted' | 'completed' | 'blocked' | 'overdue';

/**
 * Task priority types
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Task types
 */
export type TaskType = 'assignment' | 'quiz' | 'project' | 'research' | 'coding' | 'reading' | 'other';

/**
 * Task submission status
 */
export type SubmissionStatus = 'draft' | 'submitted' | 'revised' | 'rejected' | 'approved';

/**
 * Task submission entity
 */
export interface TaskSubmission {
    id: string;
    content: string;
    attachments?: FileAttachment[];
    timestamp: FirebaseDate;
    status?: SubmissionStatus;
    feedback?: string;
}

/**
 * Grading rubric criterion
 */
export interface RubricCriterion {
    name: string;
    weight: number;
    score?: number;
    feedback?: string;
}

/**
 * Task resource reference
 */
export interface TaskResource {
    id: string;
    title: string;
    type: string;
    url?: string;
    description?: string;
}

/**
 * Progress history entry
 */
export interface ProgressHistoryEntry {
    value: number;
    updatedAt: FirebaseDate;
    updatedBy: string;
}

/**
 * Feedback history entry
 */
export interface FeedbackHistoryEntry {
    content: string;
    createdAt: FirebaseDate;
    createdBy: string;
    createdByName: string;
}

/**
 * Assignee details
 */
export interface AssigneeDetails {
    id: string;
    name: string;
    email?: string;
    role?: string;
    profilePicture?: string;
}

/**
 * Unified Task entity
 */
export interface UnifiedTask {
    id: string;
    title: string;
    description: string;

    // References - normalized approach
    projectId: string;
    projectAreaId?: string | null; // Optional since tasks can be directly under projects

    // Status and priority
    status: TaskStatus;
    previousStatus?: TaskStatus;
    priority: TaskPriority;

    // Scheduling and deadlines
    dueDate: FirebaseDate;
    startDate?: FirebaseDate;
    estimatedHours?: number;
    actualHours?: number;

    // Progress tracking
    progress?: number; // 0-100 percent
    progressHistory?: ProgressHistoryEntry[];

    // Assignment and ownership
    assigneeId?: string | null;
    assigneeDetails?: AssigneeDetails | null;

    // Multiple assignees option
    collaboratorIds?: string[];

    // Dependency tracking
    dependsOn?: string[]; // Tasks that must be completed before this one
    blockedBy?: string[]; // Tasks currently blocking this one
    isBlocking?: string[]; // Tasks this task is blocking

    // For ordered/sequential tasks
    order?: number;

    // Academic/learning attributes
    week?: number;
    grade?: number | null;
    maxGrade?: number;
    gradingNotes?: string | null;
    gradingRubric?: {
        criteria: RubricCriterion[];
    };
    feedback?: string;
    feedbackHistory?: FeedbackHistoryEntry[];
    skills?: string[];
    learningObjectives?: string[];

    // Custom fields for flexible task types
    customFields?: Record<string, any>;

    // Submission tracking
    submissionDate?: FirebaseDate;
    submissionHistory?: TaskSubmission[];
    submission?: TaskSubmission;

    completedAt?: FirebaseDate;

    // Resource materials
    resources?: TaskResource[];

    // Activity and comments
    comments?: Comment[];

    // Revision tracking
    revisionCount?: number;
    lastRevisedAt?: FirebaseDate;

    // Time tracking
    timeEntries?: TimeEntry[];

    // Metadata
    taskType?: TaskType;
    isRecurring?: boolean;
    recurrencePattern?: string;
    weight?: number; // For calculating project progress
    visibility?: Visibility;
    createdBy: string;
    createdByName?: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    reviewedBy?: string;
    reviewedAt?: FirebaseDate;
}

// Use UnifiedTask as our main task type
export type ProjectTask = UnifiedTask;