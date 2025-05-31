import { User } from "@/Redux/types/Users/user";


/**
 * Save authentication data to local storage
 * @param token JWT token
 * @param user User data
 * @param rememberMe Whether to remember the user's email
 */
export const saveAuthData = (token: string, user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('user', JSON.stringify(user));
    }
};


/**
 * Clear authentication data on logout
 */
export const clearAuthData = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
    }
};

/**
 * Get the user's JWT token
 */
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

/**
 * Get the user's ID from local storage
 */
export const getUserId = (): string | null => {
    return localStorage.getItem('userId');
};

/**
 * Get dashboard route based on user role
 */
export const getDashboardRoute = (role: string): string => {
    switch (role.toLowerCase()) {
        case 'admin':
            return '/learners-dashboard';
        case 'mentor':
            return '/learners-dashboard';
        default:
            return '/learners-dashboard';
    }
};

/**
 * Get user data from localStorage
 * @returns User object or null if not found/invalid
 */
export const getUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null;

    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr) as User;
    } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
        return null;
    }
};

/**
 * Check if user session is valid by verifying token exists
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
};

/**
 * Refresh user data from the server and update local storage
 * Useful for making sure the user data is up-to-date
 */
export const refreshUserData = async (): Promise<User | null> => {
    try {
        const token = getAuthToken();
        if (!token) return null;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/current-user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to refresh user data');
        }

        const data = await response.json();

        if (data.success && data.user) {
            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        }

        return null;
    } catch (error) {
        console.error('Error refreshing user data:', error);
        return null;
    }
};