import { customFetchBase } from "@/Redux/core/baseQuery";
import { apiSlice } from "@/Redux/services/api";
import { ApiResponse, CursorPaginatedResponse, FileAttachment, PaginatedResponse, ProjectTask, RubricCriterion, SubmissionStatus, TaskPriority, TaskStatus, TaskType, UnifiedTask } from "@/Redux/types/Projects";
import { createApi } from "@reduxjs/toolkit/query/react";

// Task response types
export interface TasksResponse {
    data: UnifiedTask[];
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    cursor?: string;
}

export interface TasksErrorResponse {
    status: 'fail' | 'error';
    message: string;
    error?: {
        statusCode: number;
        status: string;
        isOperational: boolean;
    };
}

// Define interfaces for task query params
export interface TaskQueryParams {
    projectId?: string;
    projectAreaId?: string | null;
    status?: TaskStatus | 'all';
    priority?: TaskPriority | 'all';
    assigneeId?: string | null;
    taskType?: TaskType | 'all';
    dueDate?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    cursor?: string;
    includeCompleted?: boolean;
}

// Define interfaces for task response types
export interface TaskResponse extends ApiResponse<ProjectTask> { }
// export interface TasksResponse extends CursorPaginatedResponse<ProjectTask> { }
export interface TasksListResponse extends PaginatedResponse<ProjectTask> { }

// Define interfaces for task request types
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
    visibility?: 'public' | 'members' | 'mentors-only' | 'private';
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
    visibility?: 'public' | 'members' | 'mentors-only' | 'private';
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

export interface UpdateTaskPriorityRequest {
    priority: TaskPriority;
}

export interface AssignTaskRequest {
    assigneeId: string | null;
}

export interface SubmitTaskRequest {
    content: string;
    attachments?: Partial<FileAttachment>[];
    status?: SubmissionStatus;
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

export interface CommentTaskRequest {
    content: string;
    isPrivate?: boolean;
    attachments?: Partial<FileAttachment>[];
}

export interface UpdateTaskResourcesRequest {
    resources: Array<{
        id?: string;
        title: string;
        type: string;
        url?: string;
        description?: string;
    }>;
}

export interface UpdateTaskSkillsRequest {
    skills: string[];
}

export interface UpdateTaskFeedbackRequest {
    feedback: string;
    gradingNotes?: string;
}

export interface TaskStatsResponse extends ApiResponse<{
    totalTasks: number;
    completedTasks: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
    byType: Record<TaskType, number>;
    byAssignee: Record<string, { count: number; completed: number; name: string }>;
    overdueTasks: number;
    upcomingTasks: number;
    averageCompletionTime: number; // In days
}> { }

export interface TaskTimelineResponse extends ApiResponse<{
    timeline: Array<{
        date: string;
        tasks: ProjectTask[];
    }>;
    startDate: string;
    endDate: string;
    overdueTasks: ProjectTask[];
}> { }

export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get tasks with filtering and pagination (unified endpoint)
        // getTasks: builder.query<
        //     TasksResponse,
        //     TaskQueryParams
        // >({
        //     query: (params) => {
        //         const {
        //             projectId,
        //             projectAreaId,
        //             status,
        //             priority,
        //             assigneeId,
        //             taskType,
        //             dueDate,
        //             search,
        //             sortBy = 'dueDate',
        //             sortOrder = 'asc',
        //             page = 1,
        //             limit = 20,
        //             cursor,
        //             includeCompleted = true
        //         } = params;

        //         // Use project-specific endpoint if projectId is provided
        //         if (projectId) {
        //             let url = `/tasks/${projectId}/tasks?page=${page}&limit=${limit}`;

        //             if (projectAreaId !== undefined) {
        //                 if (projectAreaId === null) {
        //                     url += `&projectAreaId=null`;
        //                 } else {
        //                     url += `&projectAreaId=${projectAreaId}`;
        //                 }
        //             }
        //             if (status && status !== 'all') url += `&status=${status}`;
        //             if (priority && priority !== 'all') url += `&priority=${priority}`;
        //             if (assigneeId !== undefined) {
        //                 if (assigneeId === null) {
        //                     url += `&assigneeId=null`;
        //                 } else {
        //                     url += `&assigneeId=${assigneeId}`;
        //                 }
        //             }
        //             if (taskType && taskType !== 'all') url += `&taskType=${taskType}`;
        //             if (dueDate) url += `&dueDate=${dueDate}`;
        //             if (search) url += `&search=${encodeURIComponent(search)}`;
        //             if (sortBy) url += `&sortBy=${sortBy}`;
        //             if (sortOrder) url += `&sortOrder=${sortOrder}`;
        //             if (cursor) url += `&cursor=${cursor}`;
        //             if (!includeCompleted) url += `&includeCompleted=false`;

        //             return url;
        //         } else {
        //             // Fallback to user tasks endpoint
        //             let url = `/tasks/my/tasks?page=${page}&limit=${limit}`;
        //             if (status && status !== 'all') url += `&status=${status}`;
        //             if (priority && priority !== 'all') url += `&priority=${priority}`;
        //             if (search) url += `&search=${encodeURIComponent(search)}`;
        //             return url;
        //         }
        //     },
        //     providesTags: (result, error, { projectId }) =>
        //         result
        //             ? [
        //                 ...result.data.map(({ id }) => ({ type: 'Task' as const, id })),
        //                 { type: 'ProjectTasks', id: projectId || 'LIST' }
        //             ]
        //             : [{ type: 'ProjectTasks', id: projectId || 'LIST' }]
        // }),

        getTasks: builder.query<TasksResponse, TaskQueryParams>({
            query: (params) => {
                const {
                    projectId,
                    projectAreaId,
                    status,
                    priority,
                    assigneeId,
                    taskType,
                    dueDate,
                    search,
                    sortBy = 'dueDate',
                    sortOrder = 'asc',
                    page = 1,
                    limit = 20,
                    cursor,
                    includeCompleted = true
                } = params;

                // Build base URL based on whether we're fetching area-specific tasks
                let baseUrl = '';
                if (projectId && projectAreaId) {
                    // ✅ Use area-specific endpoint
                    baseUrl = `/tasks/${projectId}/areas/${projectAreaId}/tasks`;
                } else if (projectId) {
                    // ✅ Use project-specific endpoint
                    baseUrl = `/tasks/${projectId}/tasks`;
                } else {
                    // ✅ Fallback to user tasks endpoint
                    baseUrl = `/tasks/my/tasks`;
                }

                // Build query parameters
                const queryParams = new URLSearchParams();
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());

                if (status && status !== 'all') queryParams.append('status', status);
                if (priority && priority !== 'all') queryParams.append('priority', priority);
                if (assigneeId !== undefined) {
                    queryParams.append('assigneeId', assigneeId === null ? 'null' : assigneeId);
                }
                if (taskType && taskType !== 'all') queryParams.append('taskType', taskType);
                if (dueDate) queryParams.append('dueDate', dueDate);
                if (search) queryParams.append('search', search);
                if (sortBy) queryParams.append('sortBy', sortBy);
                if (sortOrder) queryParams.append('sortOrder', sortOrder);
                if (cursor) queryParams.append('cursor', cursor);
                if (!includeCompleted) queryParams.append('includeCompleted', 'false');

                return `${baseUrl}?${queryParams.toString()}`;
            },
            providesTags: (result, error, { projectId, projectAreaId }) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Task' as const, id })),
                        { type: 'ProjectTasks', id: projectAreaId || projectId || 'LIST' }
                    ]
                    : [{ type: 'ProjectTasks', id: projectAreaId || projectId || 'LIST' }]
        }),

        // Get task by ID
        getTaskById: builder.query<
            TaskResponse,
            { id: string; projectId: string }
        >({
            query: ({ id, projectId }) => `/tasks/${projectId}/tasks/${id}`,
            providesTags: (result, error, { id }) => [{ type: 'Task', id }]
        }),


        // Get overdue tasks
        getOverdueTasks: builder.query<
            TasksListResponse,
            { projectId: string }
        >({
            query: ({ projectId }) => `/tasks/${projectId}/tasks/overdue`,
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectTasks', id: `${projectId}_overdue` }
            ]
        }),

        // Get current task
        getCurrentTask: builder.query<
            TaskResponse,
            { projectId: string }
        >({
            query: ({ projectId }) => `/tasks/${projectId}/tasks/current`,
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectTasks', id: `${projectId}_current` }
            ]
        }),

        // Get user tasks
        getUserTasks: builder.query<
            TasksListResponse,
            { status?: TaskStatus; priority?: TaskPriority; limit?: number }
        >({
            query: ({ status, priority, limit = 50 }) => {
                let url = `/tasks/my/tasks?limit=${limit}`;
                if (status) url += `&status=${status}`;
                if (priority) url += `&priority=${priority}`;
                return url;
            },
            providesTags: [{ type: 'ProjectTasks', id: 'USER_TASKS' }]
        }),

        // Get task timeline
        getTaskTimeline: builder.query<
            TaskTimelineResponse,
            { projectId: string; startDate?: string; endDate?: string }
        >({
            query: ({ projectId, startDate, endDate }) => {
                let url = `/tasks/${projectId}/tasks/timeline`;
                if (startDate) url += `?startDate=${startDate}`;
                if (endDate) url += startDate ? `&endDate=${endDate}` : `?endDate=${endDate}`;
                return url;
            },
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectTasks', id: `${projectId}_timeline` }
            ]
        }),

        // Get task statistics
        getTaskStats: builder.query<
            TaskStatsResponse,
            { projectId: string }
        >({
            query: ({ projectId }) => `/tasks/${projectId}/tasks/stats`,
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectTasks', id: `${projectId}_stats` }
            ]
        }),

        // Create task - FIXED to use correct endpoint
        addTask: builder.mutation<
            TaskResponse,
            AddTaskRequest
        >({
            query: (data) => ({
                url: `/tasks/${data.projectId}/tasks`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { projectId, projectAreaId }) => [
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' },
                projectAreaId ? { type: 'AreaTasks', id: projectAreaId } : { type: 'AreaTasks', id: 'LIST' }
            ]
        }),

        // Update task - FIXED to use correct endpoint
        updateTask: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & UpdateTaskRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' }
            ]
        }),

        // Delete task - FIXED to use correct endpoint
        deleteTask: builder.mutation<
            ApiResponse<null>,
            { id: string; projectId: string; projectAreaId?: string }
        >({
            query: ({ id, projectId }) => ({
                url: `/tasks/${projectId}/tasks/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { id, projectId, projectAreaId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' },
                projectAreaId ? { type: 'AreaTasks', id: projectAreaId } : { type: 'AreaTasks', id: 'LIST' }
            ]
        }),

        // Update task status - FIXED to use correct endpoint
        updateTaskStatus: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & UpdateTaskStatusRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}/status`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' }
            ]
        }),

        // Update task priority - FIXED to use correct endpoint
        updateTaskPriority: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & UpdateTaskPriorityRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}/priority`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' }
            ]
        }),

        // Assign task - FIXED to use correct endpoint
        assignTask: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & AssignTaskRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}/assign`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' }
            ]
        }),

        // Update task resources - FIXED to use correct endpoint
        updateTaskResources: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & UpdateTaskResourcesRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}/resources`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId }
            ]
        }),

        // Update task skills - FIXED to use correct endpoint
        updateTaskSkills: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & UpdateTaskSkillsRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}/skills`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId }
            ]
        }),

        // Update task feedback - FIXED to use correct endpoint
        updateTaskFeedback: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & UpdateTaskFeedbackRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}/feedback`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId }
            ]
        }),

        // Submit task - FIXED to use correct endpoint
        submitTask: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & SubmitTaskRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}/submit`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' }
            ]
        }),

        // Grade task - FIXED to use correct endpoint
        gradeTask: builder.mutation<
            TaskResponse,
            { id: string; projectId: string } & GradeTaskRequest
        >({
            query: ({ id, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${id}/grade`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { id, projectId }) => [
                { type: 'Task', id },
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' }
            ]
        }),

        // Add comment to task
        addTaskComment: builder.mutation<
            ApiResponse<{ id: string }>,
            { taskId: string; projectId: string } & CommentTaskRequest
        >({
            query: ({ taskId, projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/${taskId}/comments`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { taskId, projectId }) => [
                { type: 'Task', id: taskId },
                { type: 'ProjectTasks', id: projectId }
            ]
        }),

        // Bulk update tasks
        bulkUpdateTasks: builder.mutation<
            ApiResponse<{ updated: number }>,
            { taskIds: string[]; updates: Partial<UpdateTaskRequest>; projectId: string }
        >({
            query: ({ projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/bulk-update`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' }
            ]
        }),

        // Bulk delete tasks
        bulkDeleteTasks: builder.mutation<
            ApiResponse<{ deleted: number }>,
            { taskIds: string[]; projectId: string }
        >({
            query: ({ projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/bulk-delete`,
                method: 'DELETE',
                body: data
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' }
            ]
        }),

        // Re-order tasks
        reorderTasks: builder.mutation<
            ApiResponse<null>,
            { projectId: string; projectAreaId?: string; taskOrders: { id: string; order: number }[] }
        >({
            query: ({ projectId, ...data }) => ({
                url: `/tasks/${projectId}/tasks/reorder`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { projectId, projectAreaId }) => [
                { type: 'ProjectTasks', id: projectId },
                { type: 'ProjectTasks', id: 'LIST' },
                projectAreaId ? { type: 'AreaTasks', id: projectAreaId } : { type: 'AreaTasks', id: 'LIST' }
            ]
        })
    })
});

export const {
    useGetTasksQuery,
    useGetTaskByIdQuery,
    useGetOverdueTasksQuery,
    useGetCurrentTaskQuery,
    useGetUserTasksQuery,
    useGetTaskTimelineQuery,
    useGetTaskStatsQuery,
    useAddTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useUpdateTaskStatusMutation,
    useUpdateTaskPriorityMutation,
    useAssignTaskMutation,
    useUpdateTaskResourcesMutation,
    useUpdateTaskSkillsMutation,
    useUpdateTaskFeedbackMutation,
    useSubmitTaskMutation,
    useGradeTaskMutation,
    useAddTaskCommentMutation,
    useBulkUpdateTasksMutation,
    useBulkDeleteTasksMutation,
    useReorderTasksMutation
} = tasksApiSlice;