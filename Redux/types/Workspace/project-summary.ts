
import { FirebaseDate } from "../Projects";

/**
 * Project Summary interface for lightweight project representation
 * Used when listing projects or showing project information in workspaces
 */
export interface ProjectSummary {
    // Core identifiers
    id: string;
    name: string;
    description: string;
    slug?: string; // URL-friendly identifier

    // Classification
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    technologies: string[];
    mentors: string[];

    // Timeline
    startDate: FirebaseDate;
    endDate: FirebaseDate | null;
    estimatedDuration: number; // In hours

    // Status information
    status: 'draft' | 'active' | 'completed' | 'archived' | 'on-hold';
    progress: number; // 0-100 percent
    lastActivityAt: FirebaseDate;

    // Membership
    memberCount: number;
    learnerCount: number;

    // Current user's relationship to project (optional)
    userRole?: 'owner' | 'mentor' | 'learner' | 'observer';
    userJoinedAt?: FirebaseDate;

    // Quick stats
    taskCount: number;
    completedTaskCount: number;
    resourceCount: number;
    collaborationCount: number; // Number of comments/discussions

    // Associated workspaces
    workspaceIds: string[];
    primaryWorkspaceId?: string;

    // Learning objectives (short form)
    learningObjectives: string[];

    // Mentor information
    primaryMentorId?: string;
    primaryMentorName?: string;
    primaryMentorPhoto?: string;
    mentorCount: number;

    // Visibility and access
    visibility: 'public' | 'private' | 'workspace' | 'organization';
    isJoinable: boolean;
    requiresApproval: boolean;

    // Evaluation 
    hasGrading: boolean;
    averageRating?: number; // If project has been rated by users
    reviewCount?: number;

    // Media and presentation
    thumbnailUrl?: string;
    bannerUrl?: string;

    // Links
    repoUrl?: string | null;
    demoUrl?: string | null;

    // Creation metadata
    createdBy: string;
    creatorName: string;
    creatorRole: string;
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
}

/**
 * Project Participation Stats for analytics
 */
export interface ProjectParticipationStats {
    totalLearners: number;
    activeLearners: number; // Active in last 7 days
    completionRate: number; // Percentage of learners who completed
    averageProgress: number;
    averageTimeToComplete?: number; // In days
    dropoutCount: number;
    learnersByLevel: {
        beginner: number;
        intermediate: number;
        advanced: number;
    };
    topPerformers: Array<{
        learnerId: string;
        learnerName: string;
        progress: number;
        completedAt?: FirebaseDate;
    }>;
    needsAttentionLearners: Array<{
        learnerId: string;
        learnerName: string;
        progress: number;
        lastActiveAt: FirebaseDate;
        reason: string;
    }>;
}

/**
 * Project Achievement for users who completed a project
 */
export interface ProjectAchievement {
    id: string;
    projectId: string;
    projectName: string;
    userId: string;
    completedAt: FirebaseDate;
    certificateUrl?: string;
    grade?: string | number;
    mentorId: string;
    mentorName: string;
    feedbackSummary?: string;
    skillsAcquired: string[];
    showcaseUrl?: string;
    isPublic: boolean;
}

/**
 * Project Feedback for reviews on projects
 */
export interface ProjectReview {
    id: string;
    projectId: string;
    userId: string;
    userName: string;
    userRole: string;
    userPhoto?: string;
    rating: number; // 1-5
    content: string;
    completionStatus: 'completed' | 'in-progress' | 'dropped';
    difficulty: 'too_easy' | 'just_right' | 'too_difficult';
    timeSpent: number; // Hours
    wouldRecommend: boolean;
    pros: string[];
    cons: string[];
    createdAt: FirebaseDate;
    updatedAt?: FirebaseDate;
    isVerified: boolean; // If user actually completed project
}

/**
 * Quick information for project templates
 */
export interface ProjectTemplateInfo {
    id: string;
    name: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    technologies: string[];
    estimatedDuration: number;
    learningObjectives: string[];
    thumbnailUrl?: string;
    popularity: number; // Number of projects created from template
    rating: number; // Average rating
    createdBy: string;
    isOfficial: boolean;
}