'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/Redux/features/auth/authSlice';

export default function Unauthorized() {
    const router = useRouter();
    const user = useSelector(selectCurrentUser);

    // Get appropriate home page based on user role
    const getHomePage = () => {
        if (!user) return '/';

        switch (user.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'mentor':
                return '/Learner/dashboard';
            case 'learner':
            case 'user':
                return '/Learner/dashboard';
            default:
                return '/';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-700 mb-6">
                    You don't have permission to access this page. This area is restricted to authorized users only.
                </p>
                <div className="flex flex-col space-y-3">
                    <button
                        onClick={() => router.push(getHomePage())}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}