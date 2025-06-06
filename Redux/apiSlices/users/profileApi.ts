import { apiSlice } from "@/Redux/services/api";
import { DeleteResponse, ProfilePictureResponse, ProfileResponse, UpdateProfilePictureRequest, UpdateProfileRequest } from "@/Redux/types/Users/profile";
import { User } from "@/Redux/types/Users/user";


export const profileApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query<ProfileResponse, void>({
            query: () => ({
                url: '/profile/me',
                method: 'GET',
            }),
            transformResponse: (response: ProfileResponse) => ({
                success: response.success,
                message: response.message,
                user: response.user
            }),
            providesTags: ['Profile']

        }),

        updateUserProfile: builder.mutation<User, UpdateProfileRequest>({
            query: (profileData) => ({
                url: '/profile/me',
                method: 'PATCH',
                body: profileData
            }),
            transformResponse: (response: { success: boolean; user: User }) => response.user,
            invalidatesTags: ['Profile']
        }),

        updateProfilePicture: builder.mutation<{ profilePicture: string }, UpdateProfilePictureRequest>({
            query: ({ file }) => {
                const formData = new FormData();
                formData.append('file', file);

                return {
                    url: 'profile/me/uploadPicture',
                    method: 'PATCH',
                    body: formData,
                    formData: true,
                };
            },
            transformResponse: (response: { success: boolean; profilePicture: string }) => ({
                profilePicture: response.profilePicture
            }),
            invalidatesTags: ['Profile']
        }),

        deleteProfilePicture: builder.mutation<ProfilePictureResponse, void>({
            query: () => ({
                url: '/profile/me/picture',
                method: 'DELETE'
            }),
            invalidatesTags: ['Profile'],
        }),

        deleteAccount: builder.mutation<DeleteResponse, void>({
            query: () => ({
                url: '/profile/me',
                method: 'DELETE'
            })
        }),

        updateNotificationPreferences: builder.mutation<
            User,
            User['notificationPreferences']
        >({
            query: (preferences) => ({
                url: '/profile/me/notifications',
                method: 'PATCH',
                body: { notificationPreferences: preferences }
            }),
            transformResponse: (response: { success: boolean; user: User }) => response.user,
        }),

        updateUserSettings: builder.mutation<
            User,
            User['settings']
        >({
            query: (settings) => ({
                url: '/profile/me/settings',
                method: 'PATCH',
                body: { settings }
            }),
            transformResponse: (response: { success: boolean; user: User }) => response.user,
        })
    }),
    overrideExisting: true
});

export const {
    useGetCurrentUserQuery,
    useUpdateUserProfileMutation,
    useUpdateProfilePictureMutation,
    useDeleteProfilePictureMutation,
    useDeleteAccountMutation,
    useUpdateNotificationPreferencesMutation,
    useUpdateUserSettingsMutation
} = profileApi;