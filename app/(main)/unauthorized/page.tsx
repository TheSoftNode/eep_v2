'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useTheme } from 'next-themes';
import { selectCurrentUser } from '@/Redux/features/auth/authSlice';
import { Shield, Home, ArrowLeft, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Unauthorized() {
    const router = useRouter();
    const { theme } = useTheme();
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

    // Get user-friendly role description
    const getRoleDescription = () => {
        if (!user) return 'Guest User';

        switch (user.role) {
            case 'admin':
                return 'Administrator';
            case 'mentor':
                return 'Mentor';
            case 'learner':
            case 'user':
                return 'Learner';
            default:
                return 'User';
        }
    };

    // Get appropriate dashboard name
    const getDashboardName = () => {
        if (!user) return 'Login Page';

        switch (user.role) {
            case 'admin':
                return 'Admin Dashboard';
            case 'mentor':
                return 'Mentor Dashboard';
            case 'learner':
            case 'user':
                return 'Learner Dashboard';
            default:
                return 'Dashboard';
        }
    };

    return (
        <div className="flex items-center justify-center py-20 px-4 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-900 dark:via-indigo-950/20 dark:to-[#0A0E1F]">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-violet-200/20 dark:from-indigo-800/10 dark:to-violet-800/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/20 to-violet-200/20 dark:from-indigo-800/10 dark:to-violet-800/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-xl">
                {/* Main card */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 p-6">

                    <div className="space-y-6">

                        {/* Icon and title section */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center shadow-lg">
                                    <Shield className="w-8 h-8 text-red-500 dark:text-red-400" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
                                    <Lock className="w-2.5 h-2.5 text-white" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                                    Access Restricted
                                </h1>
                                <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Authorization Required</span>
                                </div>
                            </div>
                        </div>

                        {/* Content section */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-red-50/70 to-orange-50/70 dark:from-red-900/25 dark:to-orange-900/25 border border-red-100/60 dark:border-red-800/40">
                                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-medium text-center">
                                    You don't have the necessary permissions to access this page. This area is restricted to authorized personnel only.
                                </p>
                            </div>

                            {/* User info */}
                            {user && (
                                <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-900/25 border border-indigo-100/60 dark:border-indigo-800/40">
                                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Current Role:</span>
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                {getRoleDescription()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Signed in as:</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate ml-2">
                                                {user.email || user.fullName || 'User'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">
                                If you believe this is an error, please contact your system administrator or try accessing your designated dashboard below.
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-2">
                            <Button
                                onClick={() => router.push(getHomePage())}
                                className={cn(
                                    "w-full h-10 rounded-xl font-semibold transition-all duration-200 text-sm",
                                    "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700",
                                    "text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                                    "dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600"
                                )}
                            >
                                <Home className="w-4 h-4 mr-2.5" />
                                Go to {getDashboardName()}
                            </Button>

                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                className={cn(
                                    "w-full h-10 rounded-xl font-semibold transition-all duration-200 text-sm",
                                    "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
                                    "bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-700/70",
                                    "text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200",
                                    "shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                )}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2.5" />
                                Go Back
                            </Button>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                            <div className="text-center text-xs text-slate-400 dark:text-slate-500 space-y-1.5">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                                    <span className="font-medium">Error Code: 403 - Forbidden</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                                </div>
                                <p className="leading-relaxed">Need help? Contact support for assistance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

