import { useAuth } from '@/hooks/useAuth';

// Define possible user roles
export type UserRole = 'admin' | 'mentor' | 'learner' | 'user';

interface UserRoleState {
    role: UserRole;
    isAdmin: boolean;
    isMentor: boolean;
    isLearner: boolean;
    isLoading: boolean;
}

export const useUserRole = () => {
    const { user, isAuthenticated, isAdmin, isMentor, isLearner } = useAuth();

    // Map the authenticated user role to our UserRoleState structure
    const role: UserRole = user?.role as UserRole || 'learner';

    const userRoleState: UserRoleState = {
        role: role,
        isAdmin: isAdmin(),
        isMentor: isMentor(),
        isLearner: isLearner(),
        isLoading: !isAuthenticated && user === null
    };

    return userRoleState;
};