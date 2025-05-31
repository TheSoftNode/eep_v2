import { apiSlice } from "@/Redux/services/api";
import { TwoFactorLoginRequest, TwoFactorSetupResponse, TwoFactorStatusResponse, TwoFactorVerifyResponse } from "@/Redux/types/Users/twoFactor";


export const twoFactorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get 2FA status
        getTwoFactorStatus: builder.query<TwoFactorStatusResponse, void>({
            query: () => ({
                url: '/two-factor/status',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),

        // Generate 2FA secret
        generateTwoFactorSecret: builder.mutation<TwoFactorSetupResponse, void>({
            query: () => ({
                url: '/two-factor/generate',
                method: 'POST',
            }),
        }),

        // Verify and enable 2FA setup
        verifyTwoFactorSetup: builder.mutation<TwoFactorVerifyResponse, { token: string }>({
            query: (data) => ({
                url: '/two-factor/verify-setup',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        // Disable 2FA
        disableTwoFactor: builder.mutation<TwoFactorVerifyResponse, { token?: string; recoveryCode?: string }>({
            query: (data) => ({
                url: '/two-factor/disable',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        // Verify 2FA during login
        verifyTwoFactorLogin: builder.mutation<any, TwoFactorLoginRequest>({
            query: (credentials) => ({
                url: '/auth/verify-2fa',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const {
    useGetTwoFactorStatusQuery,
    useGenerateTwoFactorSecretMutation,
    useVerifyTwoFactorSetupMutation,
    useDisableTwoFactorMutation,
    useVerifyTwoFactorLoginMutation,
} = twoFactorApi;

