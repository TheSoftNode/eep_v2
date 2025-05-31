import { RootState } from '@/Redux/core/store';
import { User } from '@/Redux/types/Users/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserResponse extends Pick<User,
    'id' | 'fullName' | 'email' | 'role' | 'disabled' | 'emailVerified' | 'profilePicture' |
    'notificationPreferences' | 'settings' | 'bio' | 'company' | 'website' | 'github'
> {
    // You can add any additional response-specific fields here if needed
}

const getInitialToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('adminToken');
    }
    return null;
};

const getInitialUser = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user') || localStorage.getItem('adminUser');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

interface AuthState {
    user: IUserResponse | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isTwoFactorRequired: boolean;
    isTwoFactorPending: boolean;
    isTwoFactorSetupRequired: boolean; // New: for when 2FA setup is needed
    tempEmail: string | null;
    rememberMe: boolean;
    isAdmin: boolean; // New: track if current session is admin
}

const initialState: AuthState = {
    user: getInitialUser(),
    token: getInitialToken(),
    isAuthenticated: typeof window !== 'undefined' ?
        !!localStorage.getItem('token') || !!localStorage.getItem('adminToken') : false,
    isLoading: false,
    isTwoFactorRequired: false,
    isTwoFactorPending: false,
    isTwoFactorSetupRequired: false,
    tempEmail: null,
    rememberMe: false,
    isAdmin: typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: IUserResponse; token: string; isAdmin?: boolean }>) => {
            const { user, token, isAdmin = false } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.isTwoFactorRequired = false;
            state.isTwoFactorSetupRequired = false;
            state.tempEmail = null;
            state.isAdmin = isAdmin;

            if (typeof window !== 'undefined') {
                if (isAdmin) {
                    localStorage.setItem('adminToken', token);
                    localStorage.setItem('adminUser', JSON.stringify(user));
                    // Clear regular user tokens if they exist
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                } else {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    // Clear admin tokens if they exist
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                }
            }
        },
        requireTwoFactorAuth: (state, action: PayloadAction<{ email: string; rememberMe: boolean }>) => {
            state.isTwoFactorRequired = true;
            state.isTwoFactorSetupRequired = false;
            state.tempEmail = action.payload.email;
            state.rememberMe = action.payload.rememberMe;
        },
        requireTwoFactorSetup: (state, action: PayloadAction<{ email: string; rememberMe: boolean }>) => {
            state.isTwoFactorSetupRequired = true;
            state.isTwoFactorRequired = false;
            state.tempEmail = action.payload.email;
            state.rememberMe = action.payload.rememberMe;
        },
        setTwoFactorPending: (state, action: PayloadAction<boolean>) => {
            state.isTwoFactorPending = action.payload;
        },
        setRememberMe: (state, action: PayloadAction<boolean>) => {
            state.rememberMe = action.payload;
        },
        logout: (state) => {
            const wasAdmin = state.isAdmin;

            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isTwoFactorRequired = false;
            state.isTwoFactorPending = false;
            state.isTwoFactorSetupRequired = false;
            state.tempEmail = null;
            state.rememberMe = false;
            state.isAdmin = false;

            if (typeof window !== 'undefined') {
                if (wasAdmin) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        },
        updateUser: (state, action: PayloadAction<Partial<IUserResponse>>) => {
            if (state.user) {
                const updatedUser = {
                    ...state.user,
                    ...action.payload,
                    // Ensure nested objects are properly merged
                    notificationPreferences: action.payload.notificationPreferences
                        ? { ...state.user.notificationPreferences, ...action.payload.notificationPreferences }
                        : state.user.notificationPreferences,
                    settings: action.payload.settings
                        ? { ...state.user.settings, ...action.payload.settings }
                        : state.user.settings
                };

                state.user = updatedUser;

                // Update localStorage as well
                if (typeof window !== 'undefined') {
                    if (state.isAdmin) {
                        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
                    } else {
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                }
            }
        }
    }
});

export const {
    setCredentials,
    requireTwoFactorAuth,
    requireTwoFactorSetup,
    setTwoFactorPending,
    setRememberMe,
    logout,
    updateUser
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsTwoFactorRequired = (state: RootState) => state.auth.isTwoFactorRequired;
export const selectIsTwoFactorSetupRequired = (state: RootState) => state.auth.isTwoFactorSetupRequired;
export const selectIsTwoFactorPending = (state: RootState) => state.auth.isTwoFactorPending;
export const selectTempEmail = (state: RootState) => state.auth.tempEmail;
export const selectRememberMe = (state: RootState) => state.auth.rememberMe;
export const selectIsAdmin = (state: RootState) => state.auth.isAdmin;

