import { ProjectSummary } from './project-summary';
import {
    Workspace,
    WorkspaceRole,
    WorkspaceStatus,
    WorkspaceMember,
    WorkspaceActivity,
    WorkspaceMilestone,
    WorkspaceFile,
    WorkspaceFolder,
    LearnerProgress,
    WeeklySprint,
    WorkspaceMessage,
    WorkspaceChannel,
    WorkspaceInvitation,
    AIFeature
} from './workspace';

/**
 * Request to create a new workspace
 */
export interface CreateWorkspaceRequest {
    name: string;
    description: string;
    projectType?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    availableRoles?: string[];
    visibility?: 'public' | 'private' | 'organization';
    joinApproval?: 'automatic' | 'admin_approval' | 'mentor_approval';
    allowLearnerInvites?: boolean;
    aiFeatures?: AIFeature[];
}

/**
 * Request to update a workspace
 */
export interface UpdateWorkspaceRequest {
    workspaceId: string;
    name?: string;
    description?: string;
    projectType?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    status?: WorkspaceStatus;
    availableRoles?: string[];
    visibility?: 'public' | 'private' | 'organization';
    joinApproval?: 'automatic' | 'admin_approval' | 'mentor_approval';
    allowLearnerInvites?: boolean;
    aiIntegration?: {
        enabled?: boolean;
        features?: AIFeature[];
    };
}

/**
 * Request to add a user to a workspace
 */
export interface AddWorkspaceMemberRequest {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
    specialty?: string;
    permissions?: Partial<WorkspaceMember['permissions']>;
}

/**
 * Request to update a workspace member's role or permissions
 */
export interface UpdateWorkspaceMemberRequest {
    workspaceId: string;
    userId: string;
    role?: WorkspaceRole;
    specialty?: string;
    permissions?: Partial<WorkspaceMember['permissions']>;
    isActive?: boolean;
}

/**
 * Request to remove a user from a workspace
 */
export interface RemoveWorkspaceMemberRequest {
    workspaceId: string;
    userId: string;
    reason?: string;
}

/**
 * Request to invite a user to a workspace
 */
export interface CreateWorkspaceInvitationRequest {
    workspaceId: string;
    email: string;
    role: WorkspaceRole;
    specialty?: string;
    message?: string;
    expiryDays?: number; // Number of days until invitation expires
}

/**
 * Request to add a project to a workspace
 */
export interface AddProjectToWorkspaceRequest {
    workspaceId: string;
    projectId: string;
}

/**
 * Request to remove a project from a workspace
 */
export interface RemoveProjectFromWorkspaceRequest {
    workspaceId: string;
    projectId: string;
}

/**
 * Request to respond to a workspace invitation
 */
export interface RespondToInvitationRequest {
    invitationId: string;
    accept: boolean;
    message?: string;
}

/**
 * Request to get workspaces with filtering
 */
export interface GetWorkspacesRequest {
    // Pagination
    page?: number;
    limit?: number;
    lastDocId?: string;

    // Filters
    status?: WorkspaceStatus | WorkspaceStatus[];
    memberId?: string; // Get workspaces where this user is a member
    mentorId?: string; // Get workspaces where this user is a mentor
    role?: WorkspaceRole; // Filter by user's role in workspace
    projectId?: string; // Get workspaces containing this project
    search?: string; // Search in name and description
    tags?: string[]; // Filter by tags
    projectType?: string; // Filter by project type

    // Sorting
    orderBy?: 'name' | 'createdAt' | 'updatedAt' | 'memberCount' | 'startDate';
    orderDirection?: 'asc' | 'desc';

    // Include options
    includeProjects?: boolean;
    includeMemberCount?: boolean;
}

/**
 * Request to get a single workspace
 */
export interface GetWorkspaceRequest {
    workspaceId: string;
    includeMembers?: boolean;
    includeProjects?: boolean;
    includeMilestones?: boolean;
    includeActivity?: boolean;
    includeProgress?: boolean;
    activityLimit?: number;
}

/**
 * Request to create a workspace milestone
 */
export interface CreateMilestoneRequest {
    workspaceId: string;
    title: string;
    description?: string;
    dueDate: string;
    associatedProjectIds?: string[];
    isPublic?: boolean;
}

/**
 * Request to update a milestone
 */
export interface UpdateMilestoneRequest {
    workspaceId: string;
    milestoneId: string;
    title?: string;
    description?: string;
    dueDate?: string;
    status?: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
    completedDate?: string;
    isPublic?: boolean;
    associatedProjectIds?: string[];
}

/**
 * Request to get activities with filtering
 */
export interface GetActivitiesRequest {
    workspaceId: string;
    page?: number;
    limit?: number;
    startAfter?: string;
    entityType?: string;
    entityId?: string;
    userId?: string;
    fromDate?: string;
    toDate?: string;
    importance?: 'low' | 'medium' | 'high';
}

/**
 * Request to upload a file
 */
export interface UploadFileRequest {
    workspaceId: string;
    projectId?: string;
    file: File;
    folder?: string;
    description?: string;
    isPrivate?: boolean;
    accessLevel?: 'all_members' | 'mentors_only' | 'specific_members';
    accessibleTo?: string[];
    tags?: string[];
}

/**
 * Interface for folder creation request
 */
export interface CreateFolderRequest {
    name: string;
    parentFolder?: string;
    workspaceId: string;
}

/**
 * Interface for file share data
 */
export interface FileShare {
    id: string;
    fileId: string;
    fileName: string;
    filePath: string;
    fileType: string;
    sharedBy: string;
    sharedTo: string | null;
    recipientEmail: string;
    recipientName: string | null;
    accessUrl: string;
    expiresAt: string;
    createdAt: string;
}


/**
 * Request to update file metadata
 */
export interface UpdateFileMetadataRequest {
    workspaceId: string;
    fileId: string;
    name?: string;
    description?: string;
    isPrivate?: boolean;
    accessLevel?: 'all_members' | 'mentors_only' | 'specific_members';
    accessibleTo?: string[];
    tags?: string[];
}

/**
 * Request to share a file
 */
export interface ShareFileRequest {
    workspaceId: string;
    fileId: string;
    expiryDays?: number;
    password?: string;
}

/**
 * Request to update learner progress
 */
export interface UpdateLearnerProgressRequest {
    workspaceId: string;
    learnerId: string;
    overallProgress?: number;
    taskUpdates?: Partial<ProgressTaskUpdate>[];
    learningGoals?: string[];
    achievedGoals?: string[];
    skillUpdates?: {
        skillName: string;
        currentLevel?: number;
        targetLevel?: number;
    }[];
    hoursSpent?: number;
}

/**
 * Progress task update
 */
export interface ProgressTaskUpdate {
    taskId: string;
    status?: 'not_started' | 'in_progress' | 'under_review' | 'completed' | 'blocked';
    actualHours?: number;
    completedAt?: string;
    blockers?: string[];
    reviewStatus?: 'not_submitted' | 'awaiting_review' | 'changes_requested' | 'approved';
}

/**
 * Request to create or update a weekly sprint
 */
export interface UpdateWeeklySprintRequest {
    workspaceId: string;
    learnerId: string;
    sprintId?: string; // If updating existing sprint
    week?: number;
    startDate?: string;
    endDate?: string;
    goals?: string[];
    completedGoals?: string[];
    tasks?: {
        taskId: string;
        status?: string;
        progress?: number;
    }[];
    learnerNotes?: string;
    challenges?: string;
    learnings?: string;
    nextSteps?: string;
    hoursSpent?: number;
    status?: 'upcoming' | 'active' | 'completed' | 'missed';
    overallAssessment?: 'on_track' | 'ahead' | 'behind' | 'at_risk';
}

/**
 * Request to add feedback to a sprint
 */
export interface AddSprintFeedbackRequest {
    workspaceId: string;
    learnerId: string;
    sprintId: string;
    content: string;
    rating?: number;
    isPrivate?: boolean;
}

/**
 * Request to create a workspace channel
 */
export interface CreateChannelRequest {
    workspaceId: string;
    name: string;
    description?: string;
    type: 'general' | 'project' | 'team' | 'announcements' | 'mentors_only';
    isPrivate?: boolean;
    members?: string[];
}

/**
 * Request to send a message
 */
export interface SendMessageRequest {
    workspaceId: string;
    channelId: string;
    content: string;
    contentType?: 'text' | 'code' | 'file' | 'link';
    attachments?: {
        id?: string;
        type: string;
        name: string;
        url?: string;
        file?: File;
    }[];
    threadId?: string;
    mentions?: string[];
}

/**
 * Request to request to join a workspace
 */
export interface JoinWorkspaceRequest {
    workspaceId: string;
    message?: string;
    preferredRole?: WorkspaceRole;
    specialty?: string;
}


/**
 * Interface for setting primary workspace project
 */
export interface SetPrimaryWorkspaceProjectRequest {
    workspaceId: string;
    projectId: string;
}

// ================ Response Types ================

/**
 * Base API response
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
    totalCount?: number;
    pagination?: PaginationInfo;
    lastDocId?: string | null;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
}



/**
 * Response for workspace operations
 */
export interface WorkspaceResponse extends ApiResponse<Workspace> { }

/**
 * Response for multiple workspaces
 */
export interface WorkspacesResponse extends ApiResponse<Workspace[]> { }

/**
 * Response for member operations
 */
export interface MemberOperationResponse extends ApiResponse<{
    workspaceId: string;
    userId?: string;
    role?: WorkspaceRole;
    member?: WorkspaceMember;
}> { }

/**
 * Response for project operations
 */
export interface ProjectOperationResponse extends ApiResponse<{
    workspaceId: string;
    projectId: string;
    project?: any; // Project data
}> { }

/**
 * Response for invitations
 */
export interface InvitationResponse extends ApiResponse<WorkspaceInvitation> { }

/**
 * Response for multiple invitations
 */
export interface InvitationsResponse extends ApiResponse<WorkspaceInvitation[]> { }

/**
 * Response for activities
 */
export interface ActivitiesResponse extends ApiResponse<WorkspaceActivity[]> { }

/**
 * Response for a milestone
 */
export interface MilestoneResponse extends ApiResponse<WorkspaceMilestone> { }

/**
 * Response for multiple milestones
 */
export interface MilestonesResponse extends ApiResponse<WorkspaceMilestone[]> { }

/**
 * Response for a file
 */
export interface FileResponse extends ApiResponse<WorkspaceFile> { }

/**
 * Response for multiple files
 */
export interface FilesResponse extends ApiResponse<WorkspaceFile[]> { }

/**
 * Response for folder operations
 */
export interface FolderResponse extends ApiResponse<WorkspaceFolder> { }

/**
 * Response for multiple folders
 */
export interface FoldersResponse extends ApiResponse<WorkspaceFolder[]> { }

/**
 * Response for learner progress
 */
export interface ProgressResponse extends ApiResponse<LearnerProgress> { }

/**
 * Response for multiple learners' progress
 */
export interface AllProgressResponse extends ApiResponse<LearnerProgress[]> { }

/**
 * Response for sprint operations
 */
export interface SprintResponse extends ApiResponse<WeeklySprint> { }

/**
 * Response for channel operations
 */
export interface ChannelResponse extends ApiResponse<WorkspaceChannel> { }

/**
 * Response for multiple channels
 */
export interface ChannelsResponse extends ApiResponse<WorkspaceChannel[]> { }

/**
 * Response for message operations
 */
export interface MessageResponse extends ApiResponse<WorkspaceMessage> { }

/**
 * Response for multiple messages
 */
export interface MessagesResponse extends ApiResponse<WorkspaceMessage[]> { }

/**
 * Interface for workspace projects response
 */
export interface WorkspaceProjectsResponse extends ApiResponse<ProjectSummary[]> {
    pagination?: PaginationInfo;
}



