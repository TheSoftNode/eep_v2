"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Changed from next/router
import { useSelector } from 'react-redux';
import { useAuthHydration } from '@/hooks/useAuthHydration';
import { isAuthenticated } from '@/Redux/features/auth/authUtils';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRoles = [] }) => {
    const router = useRouter();
    const pathname = usePathname(); // New hook to get current path
    const { user } = useAuth()

    const [isChecking, setIsChecking] = useState(true);

    const isHydrated = useAuthHydration();

    useEffect(() => {
        if (!isHydrated) return;

        if (!isAuthenticated) {
            // App Router doesn't support query parameters in the same way
            // You'll need to encode this in the URL or use a different approach
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }

        if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
            router.push('/unauthorized');
            return;
        }

        setIsChecking(false);
    }, [isAuthenticated, user, requiredRoles, router, isHydrated, pathname]);

    if (isChecking || !isHydrated) {
        return null; // You had an empty return here, I kept it the same
    }

    return <>{children}</>;
};

export default AuthGuard;