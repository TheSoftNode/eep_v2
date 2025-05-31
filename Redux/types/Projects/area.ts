import { FirebaseDate } from './common';

/**
 * Project Area entity
 */
export interface ProjectArea {
    id: string;
    name: string;
    description: string;
    projectId: string; // Reference to parent project
    status: 'planned' | 'in-progress' | 'completed' | 'blocked';
    progress: number; // 0-100, calculated from tasks

    // Tasks normalized - reference only IDs
    taskIds: string[];

    // Learning focus
    learningFocus?: string[];
    technologies?: string[];

    // Custom attributes
    customAttributes?: Record<string, any>;

    // Order in project
    order?: number;

    // Due dates
    startDate?: FirebaseDate;
    endDate?: FirebaseDate;

    // Statistics
    taskCount?: number;
    completedTaskCount?: number;
    estimatedHours?: number;
    actualHours?: number;

    // Mentor reviewing this area
    assignedMentorId?: string;

    // Tracking fields
    createdBy: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    lastActivityAt?: FirebaseDate;
}

/**
 * Area status types
 */
export type AreaStatus = 'planned' | 'in-progress' | 'completed' | 'blocked';