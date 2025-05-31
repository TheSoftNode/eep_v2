// Import workspace member types
import {
    WorkspaceMember,
    LearnerProgress
} from "@/Redux/types/Workspace/workspace";

// Import request and response types
import {
    ApiResponse,
} from "@/Redux/types/Workspace/workspace-dtos";

/**
 * Interface for workspace members response
 */
export interface WorkspaceMembersResponse extends ApiResponse<WorkspaceMember[]> {
    learners?: WorkspaceMember[];
    mentors?: WorkspaceMember[];
    admins?: WorkspaceMember[];
    observers?: WorkspaceMember[];
}

/**
 * Interface for member details response
 */
export interface MemberDetailsResponse extends ApiResponse<{
    member: WorkspaceMember;
    learnerProgress?: LearnerProgress;
    projects: Array<{
        id: string;
        name: string;
        description: string;
        progress: number;
        role: string;
        status: string;
    }>;
    recentActivities: any[];
    user: {
        fullName: string;
        email: string;
        role: string;
        profilePicture?: string;
        bio?: string;
        skills?: string[];
        interests?: string[];
        title?: string;
        organization?: string;
        location?: string;
        social?: Record<string, string>;
    };
}> { }

/**
 * Interface for member contribution response
 */
export interface MemberContributionResponse extends ApiResponse<{
    memberId: string;
    memberName: string;
    workspaceId: string;
    totalActivities: number;
    firstActivityDate: string | null;
    lastActivityDate: string | null;
    activitiesByType: Record<string, number>;
    activitiesByEntityType: Record<string, number>;
    activitiesByDate: Record<string, number>;
    activitiesByDayOfWeek: Record<string, number>;
    activitiesByHour: Record<string, number>;
    projectsContributed: Array<{
        projectId: string;
        projectName: string;
        activitiesCount: number;
        lastActivity: string;
    }>;
    resourcesCreated: number;
    filesUploaded: number;
    commentsPosted: number;
    feedbackProvided: number;
    tasksCompleted: number;
    activeTimespan: number;
    averageActivitiesPerDay: number;
    activeStreak: number;
    currentStreak: number;
    timeDistribution: {
        totalTimeTracked: number;
        averageSessionDuration: number;
        lastSessionDuration: number;
    };
}> { }
