import { apiSlice } from "@/Redux/services/api";
import { ApiResponse } from "@/Redux/types/Projects/common";
import { WorkspaceFile } from "@/Redux/types/Workspace/workspace";
import { ShareFileRequest, UpdateFileMetadataRequest, CreateFolderRequest, FileShare } from "@/Redux/types/Workspace/workspace-dtos";



/**
 * Workspace Files API Slice
 * Contains endpoints for managing workspace files
 */
export const workspaceFilesApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        //==========================================================================
        // WORKSPACE FILES ENDPOINTS
        //==========================================================================

        /**
         * Upload a file to workspace
         * Note: Uses a custom upload mutation to handle FormData
         */
        uploadWorkspaceFile: builder.mutation<
            ApiResponse<WorkspaceFile>,
            FormData
        >({
            query: (formData) => ({
                url: '/workspace-files/upload',
                method: 'POST',
                body: formData,
                formData: true // Tell RTK Query this is FormData
            }),
            invalidatesTags: (result, error, formData) => {
                // Extract workspaceId and folder from FormData
                const workspaceId = formData.get('workspaceId') as string;
                const folder = formData.get('folder') as string || 'root';

                return [
                    { type: 'WorkspaceFile', id: `${workspaceId}:${folder}` },
                    { type: 'WorkspaceFile', id: 'LIST' }
                ];
            }
        }),

        /**
         * Create a new folder
         */
        createFolder: builder.mutation<
            ApiResponse<WorkspaceFile>,
            CreateFolderRequest
        >({
            query: (data) => ({
                url: '/workspace-files/folder',
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { workspaceId, parentFolder = 'root' }) => [
                { type: 'WorkspaceFolder', id: `${workspaceId}:${parentFolder}` },
                { type: 'WorkspaceFile', id: `${workspaceId}:${parentFolder}` },
                { type: 'WorkspaceFile', id: 'LIST' }
            ]
        }),

        /**
         * Get files in a workspace folder
         */
        getWorkspaceFiles: builder.query<
            ApiResponse<WorkspaceFile[]>,
            { workspaceId: string; folder?: string }
        >({
            query: ({ workspaceId, folder = 'root' }) =>
                `/workspace-files/${workspaceId}/files?folder=${folder}`,
            providesTags: (result, error, { workspaceId, folder = 'root' }) => [
                { type: 'WorkspaceFile', id: `${workspaceId}:${folder}` },
                { type: 'WorkspaceFolder', id: `${workspaceId}:${folder}` },
                { type: 'WorkspaceFile', id: 'LIST' }
            ]
        }),

        /**
         * Get a file by ID
         */
        getFileById: builder.query<
            ApiResponse<WorkspaceFile>,
            string
        >({
            query: (fileId) => `/workspace-files/files/${fileId}`,
            providesTags: (result, error, fileId) => [
                { type: 'WorkspaceFile', id: fileId }
            ]
        }),

        /**
         * Update file metadata
         */
        updateFileMetadata: builder.mutation<
            ApiResponse<WorkspaceFile>,
            { fileId: string } & UpdateFileMetadataRequest
        >({
            query: ({ fileId, ...data }) => ({
                url: `/workspace-files/files/${fileId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error, { fileId }) => [
                { type: 'WorkspaceFile', id: fileId },
                { type: 'WorkspaceFile', id: 'LIST' }
            ]
        }),

        /**
         * Delete a file or empty folder
         */
        deleteFile: builder.mutation<
            ApiResponse<null>,
            string
        >({
            query: (fileId) => ({
                url: `/workspace-files/files/${fileId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result) => {
                if (result?.data) {
                    const file = result.data as unknown as WorkspaceFile;
                    return [
                        { type: 'WorkspaceFile', id: file.id },
                        { type: 'WorkspaceFile', id: `${file.workspaceId}:${file.folder}` },
                        { type: 'WorkspaceFile', id: 'LIST' }
                    ];
                }
                return [{ type: 'WorkspaceFile', id: 'LIST' }];
            }
        }),

        /**
         * Share a file with another user or via link
         */
        shareFile: builder.mutation<
            ApiResponse<{ shareId: string; accessUrl: string; expiresAt: string }>,
            { fileId: string } & ShareFileRequest
        >({
            query: ({ fileId, ...data }) => ({
                url: `/workspace-files/files/${fileId}/share`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: [{ type: 'FileShare', id: 'LIST' }]
        }),

        /**
         * Get files shared with current user
         */
        getSharedWithMe: builder.query<
            ApiResponse<FileShare[]>,
            void
        >({
            query: () => '/workspace-files/files/shared-with-me',
            providesTags: [{ type: 'FileShare', id: 'LIST' }]
        }),

        /**
         * Search for files across workspaces
         */
        searchFiles: builder.query<
            ApiResponse<WorkspaceFile[]>,
            { query: string; workspaceId?: string }
        >({
            query: (params) => {
                let url = `/workspace-files/search?query=${encodeURIComponent(params.query)}`;
                if (params.workspaceId) {
                    url += `&workspaceId=${params.workspaceId}`;
                }
                return url;
            },
            providesTags: [{ type: 'WorkspaceFile', id: 'SEARCH' }]
        })
    })
});

/**
 * Export hooks for use in components
 */
export const {
    useUploadWorkspaceFileMutation,
    useCreateFolderMutation,
    useGetWorkspaceFilesQuery,
    useGetFileByIdQuery,
    useUpdateFileMetadataMutation,
    useDeleteFileMutation,
    useShareFileMutation,
    useGetSharedWithMeQuery,
    useSearchFilesQuery
} = workspaceFilesApiSlice;