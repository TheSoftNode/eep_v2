import { ApiResponse } from '@/Redux/types/Projects';
import {
    ProjectLearningProgress,
    LearningMilestone,
    LearningSkill,
    CreateProjectLearningPathRequest,
    UpdateProjectLearningPathRequest,
    UpdateLearningProgressRequest,
    CompleteMilestoneRequest,
    TrackLearningActivityRequest,
    ProjectLearningPathResponse,
    ProjectLearningProgressResponse,
    ProjectLearningDashboardResponse,
    LearningPathVisualizationResponse,
    ProjectLearningAnalyticsResponse
} from '../../types/LearningPath/learningPath';
import { apiSlice } from '@/Redux/services/api';


export const projectLearningPathApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // User learning path endpoints
        getProjectLearningDashboard: builder.query<ProjectLearningDashboardResponse, string>({
            query: (projectId) => `/learning-paths/${projectId}/dashboard`,
            providesTags: (result, error, projectId) => [
                { type: 'ProjectDashboard', id: projectId },
                { type: 'ProjectLearningProgress', id: projectId },
                { type: 'ProjectLearningPath', id: projectId }
            ],
        }),



        getLearningPathVisualization: builder.query<LearningPathVisualizationResponse, string>({
            query: (projectId) => `/learning-paths/${projectId}/visualization`,
            providesTags: (result, error, projectId) => [
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectLearningProgress', id: projectId }
            ],
        }),

        updateLearningProgress: builder.mutation<ProjectLearningProgressResponse, {
            projectId: string;
            data: UpdateLearningProgressRequest;
        }>({
            query: ({ projectId, data }) => ({
                url: `/learning-paths/${projectId}/progress`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectLearningProgress', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),

        trackLearningActivity: builder.mutation<{ success: boolean; message: string }, {
            projectId: string;
            data: TrackLearningActivityRequest;
        }>({
            query: ({ projectId, data }) => ({
                url: `/learning-paths/${projectId}/activity`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectLearningProgress', id: projectId },
                { type: 'ProjectDashboard', id: projectId },
                { type: 'LearningAnalytics', id: projectId }
            ],
        }),

        completeMilestone: builder.mutation<{ success: boolean; message: string; data: any }, {
            projectId: string;
            milestoneId: string;
            data: CompleteMilestoneRequest;
        }>({
            query: ({ projectId, milestoneId, data }) => ({
                url: `/learning-paths/${projectId}/milestones/${milestoneId}/complete`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId, milestoneId }) => [
                { type: 'LearningMilestone', id: milestoneId },
                { type: 'ProjectLearningProgress', id: projectId },
                { type: 'ProjectDashboard', id: projectId },
                { type: 'LearningAnalytics', id: projectId }
            ],
        }),

        // Skills endpoints
        getProjectSkills: builder.query<{ success: boolean; count: number; data: any[] }, string>({
            query: (projectId) => `/learning-paths/${projectId}/skills`,
            providesTags: (result, error, projectId) => [
                { type: 'LearningSkill', id: projectId }
            ],
        }),

        // Management endpoints (Admin/Mentor)
        generateProjectLearningPath: builder.mutation<ProjectLearningPathResponse, {
            projectId: string;
            data: CreateProjectLearningPathRequest;
        }>({
            query: ({ projectId, data }) => ({
                url: `/learning-paths/${projectId}/generate`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId },
                { type: 'LearningMilestone', id: projectId },
                { type: 'LearningSkill', id: projectId }
            ],
        }),

        updateProjectLearningPath: builder.mutation<ProjectLearningPathResponse, {
            projectId: string;
            data: UpdateProjectLearningPathRequest;
        }>({
            query: ({ projectId, data }) => ({
                url: `/learning-paths/${projectId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId },
                { type: 'LearningMilestone', id: projectId },
                { type: 'LearningSkill', id: projectId }
            ],
        }),

        deleteProjectLearningPath: builder.mutation<{ success: boolean; message: string }, string>({
            query: (projectId) => ({
                url: `/learning-paths/${projectId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, projectId) => [
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId },
                { type: 'LearningMilestone', id: projectId },
                { type: 'LearningSkill', id: projectId },
                { type: 'ProjectLearningProgress', id: projectId }
            ],
        }),

        // Milestone management
        createMilestone: builder.mutation<{ success: boolean; message: string; data: LearningMilestone }, {
            projectId: string;
            data: {
                title: string;
                description: string;
                type?: string;
                requiredTaskIds?: string[];
                requiredAreaIds?: string[];
                skillsAwarded?: string[];
                estimatedHours?: number;
                difficulty?: number;
                isOptional?: boolean;
                customCriteria?: string[];
            };
        }>({
            query: ({ projectId, data }) => ({
                url: `/learning-paths/${projectId}/milestones`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'LearningMilestone', id: projectId },
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),


        getProjectMilestones: builder.query<
            ApiResponse<LearningMilestone[]>,
            { projectId: string; includeCompleted?: boolean }
        >({
            query: ({ projectId, includeCompleted = true }) => {
                let url = `/learning-paths/${projectId}/milestones`;
                if (!includeCompleted) url += `?includeCompleted=false`;
                return url;
            },
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectMilestone', id: 'LIST' },
                { type: 'Project', id: projectId }
            ]
        }),

        updateMilestone: builder.mutation<{ success: boolean; message: string; data: LearningMilestone }, {
            projectId: string;
            milestoneId: string;
            data: Partial<{
                title: string;
                description: string;
                requiredTaskIds: string[];
                requiredAreaIds: string[];
                skillsAwarded: string[];
                estimatedHours: number;
                difficulty: number;
                isOptional: boolean;
                customCriteria: string[];
            }>;
        }>({
            query: ({ projectId, milestoneId, data }) => ({
                url: `/learning-paths/${projectId}/milestones/${milestoneId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId, milestoneId }) => [
                { type: 'LearningMilestone', id: milestoneId },
                { type: 'LearningMilestone', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),

        deleteMilestone: builder.mutation<{ success: boolean; message: string }, {
            projectId: string;
            milestoneId: string;
        }>({
            query: ({ projectId, milestoneId }) => ({
                url: `/learning-paths/${projectId}/milestones/${milestoneId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { projectId, milestoneId }) => [
                { type: 'LearningMilestone', id: milestoneId },
                { type: 'LearningMilestone', id: projectId },
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),

        reorderMilestones: builder.mutation<{ success: boolean; message: string }, {
            projectId: string;
            milestoneIds: string[];
        }>({
            query: ({ projectId, milestoneIds }) => ({
                url: `/learning-paths/${projectId}/milestones/reorder`,
                method: 'POST',
                body: { milestoneIds },
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'LearningMilestone', id: projectId },
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),

        // Skills management
        addSkill: builder.mutation<{ success: boolean; message: string; data: LearningSkill }, {
            projectId: string;
            data: {
                name: string;
                category: string;
                level?: 'basic' | 'intermediate' | 'advanced';
                description?: string;
                verificationCriteria?: string[];
            };
        }>({
            query: ({ projectId, data }) => ({
                url: `/learning-paths/${projectId}/skills`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'LearningSkill', id: projectId },
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),

        updateSkill: builder.mutation<{ success: boolean; message: string; data: LearningSkill }, {
            projectId: string;
            skillId: string;
            data: Partial<{
                name: string;
                category: string;
                level: 'basic' | 'intermediate' | 'advanced';
                description: string;
                verificationCriteria: string[];
            }>;
        }>({
            query: ({ projectId, skillId, data }) => ({
                url: `/learning-paths/${projectId}/skills/${skillId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId, skillId }) => [
                { type: 'LearningSkill', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),

        removeSkill: builder.mutation<{ success: boolean; message: string }, {
            projectId: string;
            skillId: string;
        }>({
            query: ({ projectId, skillId }) => ({
                url: `/learning-paths/${projectId}/skills/${skillId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { projectId, skillId }) => [
                { type: 'LearningSkill', id: projectId },
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),

        bulkUpdateSkills: builder.mutation<{ success: boolean; message: string; data: LearningSkill[] }, {
            projectId: string;
            skills: Array<{
                id?: string;
                name: string;
                category: string;
                level?: 'basic' | 'intermediate' | 'advanced';
                description?: string;
                verificationCriteria?: string[];
            }>;
        }>({
            query: ({ projectId, skills }) => ({
                url: `/learning-paths/${projectId}/skills/bulk`,
                method: 'PUT',
                body: { skills },
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'LearningSkill', id: projectId },
                { type: 'ProjectLearningPath', id: projectId },
                { type: 'ProjectDashboard', id: projectId }
            ],
        }),

        // Analytics endpoints
        getProjectLearningAnalytics: builder.query<ProjectLearningAnalyticsResponse, {
            projectId: string;
            startDate?: string;
            endDate?: string;
            period?: string;
        }>({
            query: ({ projectId, ...params }) => ({
                url: `/learning-paths/${projectId}/analytics`,
                params,
            }),
            providesTags: (result, error, { projectId }) => [
                { type: 'LearningAnalytics', id: projectId }
            ],
        }),

        getAllUserProgress: builder.query<{
            success: boolean;
            count: number;
            data: Array<ProjectLearningProgress & { insights: any }>;
        }, {
            projectId: string;
            status?: string;
            sortBy?: string;
            sortOrder?: string;
            limit?: string;
        }>({
            query: ({ projectId, ...params }) => ({
                url: `/learning-paths/${projectId}/progress/all`,
                params,
            }),
            providesTags: (result, error, { projectId }) => [
                { type: 'LearningAnalytics', id: projectId },
                { type: 'ProjectLearningProgress', id: projectId }
            ],
        }),

        getBottlenecks: builder.query<{
            success: boolean;
            data: {
                tasks: any[];
                milestones: any[];
                skills: any[];
                timeBasedIssues: any[];
                summary: any;
            };
        }, string>({
            query: (projectId) => `/learning-paths/${projectId}/bottlenecks`,
            providesTags: (result, error, projectId) => [
                { type: 'LearningAnalytics', id: projectId }
            ],
        }),

        exportLearningData: builder.query<Blob, {
            projectId: string;
            format?: 'json' | 'csv';
            includePersonalData?: string;
        }>({
            query: ({ projectId, ...params }) => ({
                url: `/learning-paths/${projectId}/export`,
                params,
                responseHandler: 'blob',
            }),
            providesTags: (result, error, { projectId }) => [
                { type: 'LearningAnalytics', id: projectId }
            ],
        }),

        // Admin-only endpoints
        createTemplate: builder.mutation<{ success: boolean; message: string; data: any }, {
            sourceProjectId: string;
            templateName: string;
            templateDescription?: string;
        }>({
            query: (data) => ({
                url: '/templates/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProjectLearningPath'],
        }),

        getTemplates: builder.query<{ success: boolean; count: number; data: any[] }, void>({
            query: () => '/templates',
            providesTags: ['ProjectLearningPath'],
        }),

        bulkRegeneratePaths: builder.mutation<{ success: boolean; message: string; data: any }, {
            projectIds: string[];
            templateId?: string;
        }>({
            query: (data) => ({
                url: '/bulk/regenerate',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProjectLearningPath', 'ProjectDashboard'],
        }),
    }),
});

export const {
    // User endpoints
    useGetProjectLearningDashboardQuery,
    useGetLearningPathVisualizationQuery,
    useUpdateLearningProgressMutation,
    useTrackLearningActivityMutation,
    useCompleteMilestoneMutation,
    useGetProjectSkillsQuery,
    useGetProjectMilestonesQuery,

    // Management endpoints
    useGenerateProjectLearningPathMutation,
    useUpdateProjectLearningPathMutation,
    useDeleteProjectLearningPathMutation,

    // Milestone management
    useCreateMilestoneMutation,
    useUpdateMilestoneMutation,
    useDeleteMilestoneMutation,
    useReorderMilestonesMutation,

    // Skills management
    useAddSkillMutation,
    useUpdateSkillMutation,
    useRemoveSkillMutation,
    useBulkUpdateSkillsMutation,

    // Analytics
    useGetProjectLearningAnalyticsQuery,
    useGetAllUserProgressQuery,
    useGetBottlenecksQuery,
    useLazyExportLearningDataQuery,

    // Admin endpoints
    useCreateTemplateMutation,
    useGetTemplatesQuery,
    useBulkRegeneratePathsMutation,
} = projectLearningPathApi;