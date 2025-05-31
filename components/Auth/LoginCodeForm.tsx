"use client"

import React, { useState } from 'react';
import { KeySquare, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from 'react-redux';
import { setCredentials, requireTwoFactorAuth } from '@/Redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useVerifyLoginCodeMutation } from '@/Redux/apiSlices/users/authApi';

interface LoginCodeFormProps {
    email: string;
    rememberMe: boolean;
    onBack: () => void;
    onResendCode: () => void;
}

const LoginCodeForm: React.FC<LoginCodeFormProps> = ({ email, rememberMe, onBack, onResendCode }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();
    const [verifyLoginCode, { isLoading }] = useVerifyLoginCodeMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!verificationCode.trim()) {
            setError('Please enter the verification code sent to your email');
            return;
        }
        try {
            const response = await verifyLoginCode({ email, verificationCode, rememberMe }).unwrap();
            if (response.success && response.requireTwoFactor && response.user) {
                setSuccess('Email verification successful! Additional verification required.');
                dispatch(requireTwoFactorAuth({ email: response.user.email, rememberMe }));
                router.push('/auth/two-factor');
                return;
            }
            if (response.success && response.token && response.user) {
                setSuccess('Login successful!');
                dispatch(setCredentials({ user: response.user, token: response.token }));
                const redirectPath = getRedirectPathByRole(response.user.role);
                router.push(redirectPath);
            } else {
                setError(response.message || 'Invalid verification code');
            }
        } catch (err: any) {
            setError(err.data?.message || 'Failed to verify code. Please try again.');
        }
    };

    const getRedirectPathByRole = (role: string): string => {
        switch (role) {
            case 'admin': return '/admin';
            case 'mentor': return '/Learner/dashboard';
            case 'learner':
            case 'user': return '/Learner/dashboard';
            default: return '/Learner/dashboard';
        }
    };

    return (
        <div className="login-form">
            <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2.5 rounded-md flex items-center text-sm border border-red-200 dark:border-red-800/50">
                        <AlertCircle className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2.5 rounded-md flex items-center text-sm border border-green-200 dark:border-green-800/50">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                        {success}
                    </div>
                )}
                <div className="space-y-1.5">
                    <Label htmlFor="loginCode" className="text-sm font-medium text-slate-700 dark:text-slate-300">Login Code</Label>
                    <div className="relative">
                        <Input id="loginCode" type="text" placeholder="Enter 6-digit code" className="pl-9 h-10 bg-white/90 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-200 text-center text-lg tracking-wider font-mono" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))} maxLength={6} required />
                        <KeySquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">A login code has been sent to {email}</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                    <Button type="button" variant="outline" className="text-xs bg-white/80 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 h-8 px-3" onClick={onBack}>
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        Back
                    </Button>
                    <Button type="button" variant="ghost" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 h-8 px-3" onClick={onResendCode} disabled={isLoading}>Resend code</Button>
                </div>
                <Button type="submit" className="w-full h-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <span>Verify and Sign In</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default LoginCodeForm;

