import React from 'react';
import AuthGuard from './AuthGuard';

interface RoleGuardProps {
    children: React.ReactNode;
}

// Admin only routes
export const AdminGuard: React.FC<RoleGuardProps> = ({ children }) => (
    <AuthGuard requiredRoles={['admin']}>
        {children}
    </AuthGuard>
);

// Mentor only routes
export const MentorGuard: React.FC<RoleGuardProps> = ({ children }) => (
    <AuthGuard requiredRoles={['mentor', 'admin']}>
        {children}
    </AuthGuard>
);

// Learner only routes
export const LearnerGuard: React.FC<RoleGuardProps> = ({ children }) => (
    <AuthGuard requiredRoles={['learner', 'user', 'mentor']}>
        {children}
    </AuthGuard>
);

// Any authenticated user
export const AuthenticatedGuard: React.FC<RoleGuardProps> = ({ children }) => (
    <AuthGuard requiredRoles={[]}>
        {children}
    </AuthGuard>
);