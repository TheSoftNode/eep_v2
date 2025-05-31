import { Project, ProjectArea, ProjectTask } from "../Projects";
import { ApiResponse, FirebaseDate } from "../Projects/common";

// Project Learning Path Types
export type LearningPathNodeType = 'task' | 'milestone' | 'area' | 'skill-checkpoint' | 'assessment';
export type NodeStatus = 'locked' | 'available' | 'in-progress' | 'completed' | 'failed' | 'skipped';
export type MilestoneType = 'project-start' | 'area-complete' | 'skill-mastery' | 'project-complete' | 'custom';

// Skills and Learning Objectives
export interface LearningSkill {
    id: string;
    name: string;
    category: string;
    level: 'basic' | 'intermediate' | 'advanced';
    description?: string;
    verificationCriteria?: string[];
}

export interface LearningMilestone {
    id: string;
    projectId: string;
    title: string;
    description: string;
    type: MilestoneType;
    order: number;

    // Requirements
    requiredTaskIds: string[]; // Tasks that must be completed
    requiredAreaIds?: string[]; // Areas that must be completed
    requiredSkills?: string[]; // Skills that must be demonstrated
    customCriteria?: string[];

    // Progress tracking
    status: NodeStatus;
    completedAt?: FirebaseDate;
    completedBy?: string;

    // Learning outcomes
    skillsAwarded: string[]; // Skills gained upon completion
    experiencePoints?: number;
    badgeId?: string;

    // Metadata
    estimatedHours?: number;
    difficulty: number; // 1-10
    isOptional: boolean;
    autoComplete: boolean; // Automatically complete when requirements are met

    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
}

// Main Project Learning Path
export interface ProjectLearningPath {
    id: string; // Same as project ID
    projectId: string;
    projectTitle: string;

    // Structure
    totalTasks: number;
    totalAreas: number;
    totalMilestones: number;
    estimatedTotalHours: number;

    // Learning progression
    skillsToLearn: LearningSkill[];
    learningObjectives: string[];
    milestones: string[]; // Array of milestone IDs

    // Prerequisites and dependencies
    prerequisites: {
        skills?: string[];
        projects?: string[]; // Other project IDs that should be completed first
        courses?: string[];
    };

    // Progress tracking
    totalNodes: number; // tasks + milestones + areas
    completionSequence: Array<{
        nodeId: string;
        nodeType: LearningPathNodeType;
        order: number;
        dependsOn: string[]; // Other node IDs
        unlocks: string[]; // Node IDs this unlocks
    }>;

    // Metadata
    difficulty: number; // 1-10 calculated from tasks and areas
    categories: string[];
    tags: string[];

    // Auto-generated from project
    createdAt: FirebaseDate;
    updatedAt: FirebaseDate;
    lastRecalculated: FirebaseDate;
}

// User's Progress Through a Project's Learning Path
export interface ProjectLearningProgress {
    id: string; // projectId_userId
    userId: string;
    userName: string;
    projectId: string;
    projectTitle: string;

    // Current status
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
    currentPhase: 'setup' | 'development' | 'completion' | 'review';

    // Progress metrics
    overallProgress: number; // 0-100%
    tasksProgress: {
        total: number;
        completed: number;
        inProgress: number;
        percentage: number;
    };
    areasProgress: {
        total: number;
        completed: number;
        inProgress: number;
        percentage: number;
    };
    milestonesProgress: {
        total: number;
        completed: number;
        percentage: number;
    };

    // Learning outcomes
    skillsAcquired: Array<{
        skillId: string;
        skillName: string;
        acquiredAt: FirebaseDate;
        proficiencyLevel: 'basic' | 'intermediate' | 'advanced';
    }>;
    milestonesReached: Array<{
        milestoneId: string;
        title: string;
        completedAt: FirebaseDate;
        experienceGained?: number;
    }>;

    // Time tracking
    totalTimeSpent: number; // in minutes
    estimatedTimeRemaining: number;
    averageSessionTime: number;
    lastActivityAt: FirebaseDate;

    // Current focus
    currentTaskId?: string;
    currentAreaId?: string;
    nextMilestoneId?: string;
    recommendedNextSteps: Array<{
        type: 'task' | 'area' | 'milestone';
        id: string;
        title: string;
        priority: 'high' | 'medium' | 'low';
        reason: string;
    }>;

    // Learning notes and reflection
    learningNotes?: string;
    challenges: string[];
    achievements: string[];
    reflections?: string;

    // Goals and planning
    dailyTimeGoal?: number; // minutes
    weeklyTimeGoal?: number; // minutes
    targetCompletionDate?: FirebaseDate;
    personalGoals: string[];

    // Timestamps
    startedAt: FirebaseDate;
    lastProgressUpdate: FirebaseDate;
    completedAt?: FirebaseDate;
    updatedAt: FirebaseDate;
}

// Learning Path Analytics for a Project
export interface ProjectLearningAnalytics {
    projectId: string;
    period: {
        start: FirebaseDate;
        end: FirebaseDate;
    };

    // Engagement metrics
    totalLearners: number;
    activeLearners: number;
    completedLearners: number;
    averageCompletionTime: number; // in hours
    completionRate: number; // percentage
    dropoffRate: number;

    // Progress insights
    averageProgress: number;
    commonStuckPoints: Array<{
        nodeId: string;
        nodeTitle: string;
        nodeType: LearningPathNodeType;
        stuckCount: number;
        averageTimeStuck: number; // in hours
    }>;
    fastestCompletions: Array<{
        userId: string;
        userName: string;
        completionTime: number; // in hours
        completedAt: FirebaseDate;
    }>;

    // Learning outcomes
    skillsMastery: Array<{
        skillId: string;
        skillName: string;
        masterCount: number;
        averageTimeToMaster: number;
    }>;
    milestoneFails: Array<{
        milestoneId: string;
        title: string;
        failCount: number;
        commonFailures: string[];
    }>;

    // Recommendations
    suggestedImprovements: string[];
    difficultyRating: number; // Based on user feedback and completion times
    popularityScore: number;
}

// Request Types
export interface CreateProjectLearningPathRequest {
    projectId: string;
    customMilestones?: Array<{
        title: string;
        description: string;
        type: MilestoneType;
        requiredTaskIds?: string[];
        requiredAreaIds?: string[];
        skillsAwarded: string[];
        isOptional?: boolean;
        estimatedHours?: number;
        difficulty?: number;
    }>;
    skillsToLearn?: LearningSkill[];
    prerequisites?: {
        skills?: string[];
        projects?: string[];
        courses?: string[];
    };
}

export interface UpdateProjectLearningPathRequest {
    skillsToLearn?: LearningSkill[];
    learningObjectives?: string[];
    prerequisites?: {
        skills?: string[];
        projects?: string[];
        courses?: string[];
    };
    customMilestones?: Array<{
        id?: string;
        title: string;
        description: string;
        type: MilestoneType;
        requiredTaskIds?: string[];
        requiredAreaIds?: string[];
        skillsAwarded: string[];
        isOptional?: boolean;
        estimatedHours?: number;
        difficulty?: number;
    }>;
}

export interface UpdateLearningProgressRequest {
    learningNotes?: string;
    challenges?: string[];
    achievements?: string[];
    reflections?: string;
    dailyTimeGoal?: number;
    weeklyTimeGoal?: number;
    targetCompletionDate?: string;
    personalGoals?: string[];
}

export interface CompleteMilestoneRequest {
    milestoneId: string;
    evidence?: Array<{
        type: 'task' | 'submission' | 'project' | 'other';
        url?: string;
        description?: string;
    }>;
    reflectionNotes?: string;
    skillsDemonstrated?: string[];
}

export interface TrackLearningActivityRequest {
    activityType: 'task_start' | 'task_complete' | 'area_progress' | 'skill_practice' | 'milestone_attempt';
    nodeId: string; // task, area, or milestone ID
    nodeType: LearningPathNodeType;
    timeSpent?: number; // in minutes
    notes?: string;
    skillsPracticed?: string[];
    challengesFaced?: string[];
}

// Response Types
export interface ProjectLearningPathResponse extends ApiResponse<ProjectLearningPath> { }
export interface ProjectLearningProgressResponse extends ApiResponse<ProjectLearningProgress> { }
export interface ProjectLearningAnalyticsResponse extends ApiResponse<ProjectLearningAnalytics> { }

// Complex Response Types
export interface ProjectLearningDashboardResponse extends ApiResponse<{
    project: Project;
    learningPath: ProjectLearningPath;
    userProgress: ProjectLearningProgress;

    // Current state
    availableTasks: ProjectTask[];
    nextMilestone?: LearningMilestone;
    currentAreas: ProjectArea[];

    // Progress visualization data
    progressByArea: Array<{
        area: ProjectArea;
        progress: number;
        tasksCompleted: number;
        totalTasks: number;
    }>;

    skillsProgress: Array<{
        skill: LearningSkill;
        progress: number; // 0-100
        tasksPracticed: number;
        proficiencyLevel: 'basic' | 'intermediate' | 'advanced';
        evidenceCount: number;
    }>;

    // Timeline
    recentActivity: Array<{
        date: FirebaseDate;
        activity: string;
        nodeType: LearningPathNodeType;
        nodeTitle: string;
        timeSpent?: number;
    }>;

    upcomingDeadlines: Array<{
        type: 'task' | 'milestone' | 'project';
        id: string;
        title: string;
        dueDate: FirebaseDate;
        priority: 'high' | 'medium' | 'low';
    }>;

    // Recommendations
    recommendations: {
        nextTasks: Array<{
            task: ProjectTask;
            reason: string;
            estimatedTime: number;
        }>;
        skillsToFocus: Array<{
            skill: LearningSkill;
            reason: string;
            suggestedTasks: string[];
        }>;
        studyResources: Array<{
            title: string;
            type: 'article' | 'video' | 'tutorial' | 'documentation';
            url: string;
            relevantSkills: string[];
        }>;
    };
}> { }

export interface LearningPathVisualizationResponse extends ApiResponse<{
    nodes: Array<{
        id: string;
        type: LearningPathNodeType;
        title: string;
        status: NodeStatus;
        position: { x: number; y: number };
        dependencies: string[];
        unlocks: string[];
        estimatedHours?: number;
        difficulty: number;
        completedAt?: FirebaseDate;
    }>;
    edges: Array<{
        from: string;
        to: string;
        type: 'dependency' | 'sequence' | 'skill-flow';
        isComplete: boolean;
    }>;
    milestones: Array<{
        id: string;
        title: string;
        status: NodeStatus;
        position: { x: number; y: number };
        requiredNodes: string[];
        skillsAwarded: string[];
    }>;
    userProgress: {
        currentPosition: { x: number; y: number };
        completedPath: string[];
        availableNext: string[];
    };
}> { }

// Search and Filter Types
export interface ProjectLearningPathFilters {
    difficulty?: {
        min?: number;
        max?: number;
    };
    estimatedHours?: {
        min?: number;
        max?: number;
    };
    skills?: string[];
    categories?: string[];
    completionRate?: {
        min?: number;
    };
    hasPrerequisites?: boolean;
    isCompleted?: boolean;
    sortBy?: 'difficulty' | 'duration' | 'popularity' | 'recent';
    sortOrder?: 'asc' | 'desc';
}