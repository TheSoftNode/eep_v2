// Redux/apiSlices/auth/authApiSlice.ts
import { apiSlice } from '@/Redux/services/api';
import {
    setCredentials,
    requireTwoFactorAuth,
    logout,
    setTwoFactorPending
} from '@/Redux/features/auth/authSlice';
import {
    IAuthResponse,
    ILoginRequest,
    IRememberMeResponse,
    IVerifyEmailRequest
} from '@/Redux/types/Users/user';
import {
    TwoFactorLoginRequest,
    TwoFactorLoginResponse
} from '@/Redux/types/Users/twoFactor';

// Define the auth API slice by injecting endpoints into the main apiSlice
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Ping endpoint for health check
        authPing: builder.query<{ message: string }, void>({
            query: () => ({
                url: '/auth/ping',
                method: 'GET',
            }),
        }),

        // Verify email after registration
        verifyEmail: builder.mutation<IAuthResponse, IVerifyEmailRequest>({
            query: (credentials) => ({
                url: '/auth/verify-email',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
            // Handle successful email verification
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // If email verification is complete and no 2FA required
                    if (data.success && data.token && data.user && !data.requireTwoFactor) {
                        dispatch(setCredentials({
                            user: data.user,
                            token: data.token
                        }));
                    }
                    // If 2FA is required, don't set credentials yet
                } catch (error) {
                    console.error('Email verification failed:', error);
                }
            },
        }),

        // Request login code for email-based login
        requestLoginCode: builder.mutation<IAuthResponse, ILoginRequest>({
            query: (credentials) => ({
                url: '/auth/request-login-code',
                method: 'POST',
                body: credentials,
            }),
        }),

        // Check remember me status
        checkRememberMeStatus: builder.mutation<IRememberMeResponse, { email: string }>({
            query: (emailData) => ({
                url: '/auth/check-remember-me',
                method: 'POST',
                body: emailData,
            }),
            // Handle successful remember me check
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // If auto-login is successful, save auth data
                    if (data.success && data.autoLogin && data.token && data.user) {
                        dispatch(setCredentials({
                            user: data.user,
                            token: data.token
                        }));
                    }
                } catch (error) {
                    console.error('Failed to check remember me status:', error);
                }
            },
        }),

        // Verify login code to complete login
        verifyLoginCode: builder.mutation<IAuthResponse, IVerifyEmailRequest>({
            query: (credentials) => ({
                url: '/auth/verify-login-code',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
            // Handle login code verification
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // Check if 2FA is required
                    if (data.success && data.requireTwoFactor) {
                        // Set 2FA required state
                        dispatch(requireTwoFactorAuth({
                            email: arg.email,
                            rememberMe: arg.rememberMe || false
                        }));
                        return; // Don't set credentials yet
                    }

                    // If no 2FA required, set credentials normally
                    if (data.success && data.token && data.user) {
                        dispatch(setCredentials({
                            user: data.user,
                            token: data.token
                        }));
                    }
                } catch (error) {
                    console.error('Login verification failed:', error);
                }
            },
        }),

        // Verify 2FA during login (from twoFactor controller)
        verify2FALogin: builder.mutation<TwoFactorLoginResponse, TwoFactorLoginRequest>({
            query: (credentials) => ({
                url: '/auth/verify-2fa',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
            // Handle successful 2FA verification
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    dispatch(setTwoFactorPending(true));
                    const { data } = await queryFulfilled;

                    // Save auth data after successful 2FA
                    if (data.success && data.token && data.user) {
                        dispatch(setCredentials({
                            user: data.user,
                            token: data.token
                        }));
                    }
                } catch (error) {
                    console.error('2FA verification failed:', error);
                } finally {
                    dispatch(setTwoFactorPending(false));
                }
            },
        }),

        // Logout
        logout: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
            // Clear auth state on logout
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch (error) {
                    // Even if logout fails on server, clear local state
                    dispatch(logout());
                    console.error('Logout failed:', error);
                }
            },
        }),
    }),
});

// Export hooks for using the API endpoints
export const {
    useAuthPingQuery,
    useVerifyEmailMutation,
    useRequestLoginCodeMutation,
    useCheckRememberMeStatusMutation,
    useVerifyLoginCodeMutation,
    useVerify2FALoginMutation,
    useLogoutMutation,
} = authApiSlice;