import { apiSlice } from "@/Redux/services/api";
import { ApiResponse, CreateUserRequest, ToggleUserStatusRequest, UpdateUserRoleRequest, User, UserQueryParams, UserStats } from "@/Redux/types/Users/user";

export const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation<{ success: boolean; message: string }, Partial<CreateUserRequest>>({
            query: (userData) => ({
                url: '/admin/register',
                method: 'POST',
                body: userData
            })
        }),

        createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
            query: (userData) => ({
                url: '/admin/users',
                method: 'POST',
                body: userData
            }),
            invalidatesTags: ['AdminUser']
        }),

        getAllUsers: builder.query<ApiResponse<User[]>, UserQueryParams>({
            query: (params) => ({
                url: '/admin/users',
                method: 'GET',
                params
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'AdminUser' as const, id })),
                        { type: 'AdminUser', id: 'LIST' },
                    ]
                    : [{ type: 'AdminUser', id: 'LIST' }]
        }),

        getUserStats: builder.query<ApiResponse<UserStats>, void>({
            query: () => '/admin/users/admin/stats',
            providesTags: ['AdminUser']
        }),



        getUserById: builder.query<ApiResponse<User>, string>({
            query: (id) => `/admin/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'AdminUser', id }]
        }),


        getUserActivity: builder.query<
            ApiResponse<Array<{
                date: string;
                newUsers: number;
                activeUsers: number;
                sessions: number;
            }>>,
            { days?: number }
        >({
            query: (params) => ({
                url: '/admin/users/admin/activity',
                method: 'GET',
                params
            }),
            providesTags: ['AdminUser']
        }),

        getRecentUsers: builder.query<
            ApiResponse<User[]>,
            { limit?: number }
        >({
            query: (params) => ({
                url: '/admin/users',
                method: 'GET',
                params: { ...params, orderBy: 'createdAt', order: 'desc' }
            }),
            providesTags: ['AdminUser']
        }),


        updateUserRole: builder.mutation<ApiResponse<User>, { id: string, role: UpdateUserRoleRequest['role'] }>({
            query: ({ id, role }) => ({
                url: `/admin/users/${id}/role`,
                method: 'PATCH',
                body: { role }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AdminUser', id },
                { type: 'AdminUser', id: 'LIST' }
            ]
        }),

        toggleUserStatus: builder.mutation<ApiResponse<Partial<User>>, { id: string, disabled: ToggleUserStatusRequest['disabled'] }>({
            query: ({ id, disabled }) => ({
                url: `/admin/users/${id}/status`,
                method: 'PATCH',
                body: { disabled }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AdminUser', id },
                { type: 'AdminUser', id: 'LIST' }
            ]
        }),

        deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['AdminUser']
        }),

        bulkToggleUserStatus: builder.mutation<
            { success: boolean; message: string; data: { success: string[]; failed: { id: string; reason: string }[] } },
            { userIds: string[]; disabled: boolean }
        >({
            query: (data) => ({
                url: '/admin/users/bulk-status',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['AdminUser']
        }),

        bulkDeleteUsers: builder.mutation<
            { success: boolean; message: string; data: { success: string[]; failed: { id: string; reason: string }[] } },
            { userIds: string[] }
        >({
            query: (data) => ({
                url: '/admin/users/bulk-delete',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['AdminUser']
        }),

        assignMentor: builder.mutation<
            { success: boolean; message: string; data: { mentorId: string; learnerId: string } },
            { mentorId: string; learnerId: string }
        >({
            query: (data) => ({
                url: '/admin/users/assign-mentor',
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { mentorId, learnerId }) => [
                { type: 'AdminUser', id: mentorId },
                { type: 'AdminUser', id: learnerId }
            ]
        }),

        removeMentor: builder.mutation<
            { success: boolean; message: string; data: { mentorId: string; learnerId: string } },
            { mentorId: string; learnerId: string }
        >({
            query: (data) => ({
                url: '/admin/users/remove-mentor',
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { mentorId, learnerId }) => [
                { type: 'AdminUser', id: mentorId },
                { type: 'AdminUser', id: learnerId }
            ]
        }),

        exportUsers: builder.query<
            ApiResponse<Record<string, any>[]> | string,
            { format?: 'json' | 'csv'; fields?: string[] }
        >({
            query: (params) => ({
                url: '/admin/users/admin/export',
                method: 'GET',
                params,
                responseHandler: (response: Response) =>
                    params?.format === 'csv' ? response.text() : response.json()
            })
        })
    })
});

export const {
    useRegisterUserMutation,
    useCreateUserMutation,
    useGetAllUsersQuery,
    useGetUserStatsQuery,
    useGetUserActivityQuery,
    useGetRecentUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserRoleMutation,
    useToggleUserStatusMutation,
    useDeleteUserMutation,
    useBulkToggleUserStatusMutation,
    useBulkDeleteUsersMutation,
    useAssignMentorMutation,
    useRemoveMentorMutation,
    useExportUsersQuery
} = adminApi;