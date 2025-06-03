import { apiSlice } from "@/Redux/services/api";
import { AddProjectAreaRequest, ApiResponse, ProjectArea, ProjectAreaResponse, ProjectAreaTasksResponse, UpdateProjectAreaRequest, UpdateProjectAreasRequest } from "@/Redux/types/Projects";


// In your types file (e.g., types/projects.ts)
export interface ProjectAreasResponse {
    data: ProjectArea[];
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
}

// Define interfaces for query params
export interface AreaQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: 'planned' | 'in-progress' | 'completed' | 'blocked' | 'all';

}

export const projectAreasApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all project areas
        getProjectAreas: builder.query<
            ProjectAreasResponse,
            { projectId: string } & AreaQueryParams
        >({
            query: ({ projectId, page = 1, limit = 20, sortBy = 'order', sortOrder = 'asc', status }) => {
                let url = `/projects/${projectId}/areas?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
                if (status && status !== 'all') url += `&status=${status}`;
                return url;
            },
            providesTags: (result, error, { projectId }) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'ProjectArea' as const, id })),
                        { type: 'ProjectArea', id: projectId },
                        { type: 'ProjectArea', id: 'LIST' }
                    ]
                    : [{ type: 'ProjectArea', id: projectId }, { type: 'ProjectArea', id: 'LIST' }]
        }),

        // Get a specific project area
        getProjectArea: builder.query<
            ProjectAreaResponse,
            { projectId: string; areaId: string }
        >({
            query: ({ projectId, areaId }) => `/projects/${projectId}/areas/${areaId}`,
            providesTags: (result, error, { areaId }) => [{ type: 'ProjectArea', id: areaId }]
        }),

        // Get a project area with its tasks
        getProjectAreaWithTasks: builder.query<
            ProjectAreaTasksResponse,
            { projectId: string; areaId: string; status?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }
        >({
            query: ({ projectId, areaId, status, sortBy = 'dueDate', sortOrder = 'asc' }) => {
                let url = `/projects/${projectId}/areas/${areaId}/tasks?sortBy=${sortBy}&sortOrder=${sortOrder}`;
                if (status) url += `&status=${status}`;
                return url;
            },
            providesTags: (result, error, { areaId }) => [
                { type: 'ProjectArea', id: areaId },
                { type: 'AreaTask', id: areaId }
            ]
        }),

        // Add a new project area
        addProjectArea: builder.mutation<
            ProjectAreaResponse,
            { projectId: string } & AddProjectAreaRequest
        >({
            query: ({ projectId, ...data }) => ({
                url: `/projects/${projectId}/areas`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectArea', id: projectId },
                { type: 'ProjectArea', id: 'LIST' }
            ]
        }),

        // Update a project area
        updateProjectArea: builder.mutation<
            ProjectAreaResponse,
            { projectId: string; areaId: string } & UpdateProjectAreaRequest
        >({
            query: ({ projectId, areaId, ...data }) => ({
                url: `/projects/${projectId}/areas/${areaId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { projectId, areaId }) => [
                { type: 'ProjectArea', id: areaId },
                { type: 'ProjectArea', id: projectId },
                { type: 'ProjectArea', id: 'LIST' }
            ]
        }),

        // Update multiple project areas at once
        updateProjectAreas: builder.mutation<
            ProjectAreasResponse,
            { projectId: string } & UpdateProjectAreasRequest
        >({
            query: ({ projectId, ...data }) => ({
                url: `/projects/${projectId}/areas`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectArea', id: projectId },
                { type: 'ProjectArea', id: 'LIST' }
            ]
        }),

        // Delete a project area
        deleteProjectArea: builder.mutation<
            ApiResponse<null>,
            { projectId: string; areaId: string }
        >({
            query: ({ projectId, areaId }) => ({
                url: `/projects/${projectId}/areas/${areaId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectArea', id: projectId },
                { type: 'ProjectArea', id: 'LIST' }
            ]
        }),

        // Recalculate area progress
        recalculateAreaProgress: builder.mutation<
            ProjectAreaResponse,
            { projectId: string; areaId: string }
        >({
            query: ({ projectId, areaId }) => ({
                url: `/projects/${projectId}/areas/${areaId}/recalculate`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, { projectId, areaId }) => [
                { type: 'ProjectArea', id: areaId },
                { type: 'ProjectArea', id: projectId },
                { type: 'AreaTask', id: areaId }
            ]
        })
    })
});

export const {
    useGetProjectAreasQuery,
    useGetProjectAreaQuery,
    useGetProjectAreaWithTasksQuery,
    useAddProjectAreaMutation,
    useUpdateProjectAreaMutation,
    useUpdateProjectAreasMutation,
    useDeleteProjectAreaMutation,
    useRecalculateAreaProgressMutation
} = projectAreasApiSlice;