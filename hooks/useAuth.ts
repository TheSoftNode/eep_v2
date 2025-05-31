import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import {
    selectIsAuthenticated,
    selectCurrentUser,
    selectIsTwoFactorRequired,
    selectIsAdmin,
    logout
} from '@/Redux/features/auth/authSlice';
import { useLogoutMutation } from '@/Redux/apiSlices/users/authApi';

export const useAuth = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const isTwoFactorRequired = useSelector(selectIsTwoFactorRequired);
    const isAdminSession = useSelector(selectIsAdmin);
    const [logoutApi] = useLogoutMutation();

    const hasRole = (roles: string | string[]): boolean => {
        if (!user) return false;

        const rolesToCheck = Array.isArray(roles) ? roles : [roles];
        return rolesToCheck.includes(user.role);
    };

    const isAdmin = (): boolean => hasRole('admin');
    const isMentor = (): boolean => hasRole(['mentor', 'admin']);
    const isLearner = (): boolean => hasRole(['learner', 'user']);

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Determine redirect based on current session type and location
            const isOnAdminRoute = pathname.startsWith('/admin');
            const wasAdminSession = isAdminSession || isAdmin();

            dispatch(logout());

            // Redirect logic
            if (wasAdminSession || isOnAdminRoute) {
                router.push('/admin');
            } else {
                router.push('/auth/login');
            }
        }
    };

    return {
        isAuthenticated,
        user,
        isTwoFactorRequired,
        hasRole,
        isAdmin,
        isMentor,
        isLearner,
        logout: handleLogout
    };
};
