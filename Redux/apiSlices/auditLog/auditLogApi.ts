import { apiSlice } from "@/Redux/services/api";
import { AuditLogQueryParams, AuditLogResponse, AuditLogStatsResponse } from "@/Redux/types/AuditLog/auditLog";

export const auditApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAuditLogs: builder.query<AuditLogResponse, AuditLogQueryParams>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, value.toString());
                    }
                });

                return `/logs/audit-logs/audit?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'AuditLog' as const, id })),
                        { type: 'AuditLog', id: 'LIST' }
                    ]
                    : [{ type: 'AuditLog', id: 'LIST' }]
        }),

        getAuditLogStats: builder.query<AuditLogStatsResponse, void>({
            query: () => '/logs/audit-logs/stats',
            providesTags: [{ type: 'AuditLog', id: 'STATS' }]
        }),

        deleteOldAuditLogs: builder.mutation<
            { success: boolean; message: string; data: { count: number; dryRun: boolean } },
            { olderThanDays?: number; dryRun?: boolean }
        >({
            query: (data) => ({
                url: '/logs/audit-logs/cleanup',
                method: 'DELETE',
                body: data
            }),
            invalidatesTags: [{ type: 'AuditLog', id: 'LIST' }, { type: 'AuditLog', id: 'STATS' }]
        })
    })
});

export const {
    useGetAuditLogsQuery,
    useGetAuditLogStatsQuery,
    useDeleteOldAuditLogsMutation
} = auditApi;