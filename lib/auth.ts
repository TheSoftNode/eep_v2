import { store } from '@/Redux/core/store';
import { setCredentials } from '@/Redux/features/auth/authSlice';
import type { IUserResponse } from '@/Redux/types/Users/user';

export async function restoreAuthState() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const response = await fetch('/api/profile/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.user) {
                        store.dispatch(setCredentials({
                            user: data.user as IUserResponse,
                            token
                        }));

                        // Set user role cookie for middleware (HTTP-only in production)
                        document.cookie = `user_role=${data.user.role}; path=/; max-age=86400;`;

                        return true;
                    }
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Failed to restore session:', error);
                localStorage.removeItem('token');
            }
        }
    }
    return false;
}