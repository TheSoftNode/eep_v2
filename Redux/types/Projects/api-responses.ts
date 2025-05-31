import {
    ApiResponse,
    PaginatedResponse,
    CursorPaginatedResponse
} from './common';
import { Project, ProjectMember, ProjectResource, ProjectFeedback, ProjectActivity, ProjectUpdate } from './project';
import { ProjectArea } from './area';
import { ProjectTask } from './task';

// Project response types
export interface ProjectResponse extends ApiResponse<Project> { }
export interface ProjectsResponse extends CursorPaginatedResponse<Project> { }

// Member response types
export interface ProjectMemberResponse extends ApiResponse<ProjectMember> { }
export interface ProjectMembersResponse extends PaginatedResponse<ProjectMember> { }

// Area response types
export interface ProjectAreaResponse extends ApiResponse<ProjectArea> { }
export interface ProjectAreasResponse extends PaginatedResponse<ProjectArea> { }

// Task response types
export interface TaskResponse extends ApiResponse<ProjectTask> { }
export interface TasksResponse extends CursorPaginatedResponse<ProjectTask> { }

// Resource response types
export interface ProjectResourceResponse extends ApiResponse<ProjectResource> { }
export interface ProjectResourcesResponse extends PaginatedResponse<ProjectResource> { }

// Feedback response types
export interface ProjectFeedbackResponse extends ApiResponse<ProjectFeedback> { }
export interface ProjectFeedbacksResponse extends PaginatedResponse<ProjectFeedback> { }

// Update response types
export interface ProjectUpdateResponse extends ApiResponse<ProjectUpdate> { }
export interface ProjectUpdatesResponse extends PaginatedResponse<ProjectUpdate> { }

// Activity response types
export interface ProjectActivityResponse extends ApiResponse<ProjectActivity> { }
export interface ProjectActivitiesResponse extends PaginatedResponse<ProjectActivity> {
    canDelete?: boolean;
    canClearAll?: boolean;
}

// Combined response types
export interface ProjectAreaTasksResponse extends ApiResponse<{
    area: ProjectArea;
    tasks: ProjectTask[];
}> {
    count: number;
}

export interface MemberContributionsResponse extends ApiResponse<{
    tasks: {
        total: number;
        completed: number;
        inProgress: number;
        list: Array<{
            id: string;
            title: string;
            status: string;
            completedAt?: string | Date;
        }>;
    };
    activities: ProjectActivity[];
    timeSpent: number; // Total hours
    progressUpdates: number;
    resources: number; // Resources contributed
}> { }