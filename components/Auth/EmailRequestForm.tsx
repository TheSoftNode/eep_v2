"use client"

import React, { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/Redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useCheckRememberMeStatusMutation, useRequestLoginCodeMutation } from '@/Redux/apiSlices/users/authApi';

interface EmailRequestFormProps {
    onCodeSent: (email: string, isVerificationNeeded: boolean) => void;
    onRememberMeChange: (checked: boolean) => void;
}

const EmailRequestForm: React.FC<EmailRequestFormProps> = ({ onCodeSent, onRememberMeChange }) => {
    const [email, setEmail] = useState(''), [rememberMe, setRememberMe] = useState(false), [error, setError] = useState(''), [success, setSuccess] = useState('');
    const dispatch = useDispatch(), router = useRouter();
    const [requestLoginCode, { isLoading: isRequestingCode }] = useRequestLoginCodeMutation(), [checkRememberMe, { isLoading: isCheckingRememberMe }] = useCheckRememberMeStatusMutation();
    const isLoading = isRequestingCode || isCheckingRememberMe;

    const handleRememberMeChange = (checked: boolean) => { setRememberMe(checked); onRememberMeChange(checked); };

    const getRedirectPathByRole = (role: string): string => {
        switch (role) {
            case 'admin': return '/admin';
            case 'mentor': return '/Learner/dashboard';
            case 'learner':
            case 'user': return '/Learner/dashboard';
            default: return '/Learner/dashboard';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setSuccess('');
        if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address'); return; }

        try {
            const rememberMeResponse = await checkRememberMe({ email }).unwrap();

            // Check if user is admin - block completely and redirect
            if (rememberMeResponse.success && rememberMeResponse.user?.role === 'admin') {
                setError('');
                setSuccess('Admin account detected. Redirecting to admin portal...');
                setTimeout(() => {
                    router.push('/admin?message=Please use admin authentication');
                }, 1500);
                return;
            }

            // Handle auto-login for non-admin users
            if (rememberMeResponse.success && rememberMeResponse.autoLogin && rememberMeResponse.token && rememberMeResponse.user) {
                dispatch(setCredentials({ user: rememberMeResponse.user, token: rememberMeResponse.token }));
                setSuccess('Welcome back! Auto-logging you in...');
                setTimeout(() => {
                    const redirectPath = getRedirectPathByRole(rememberMeResponse.user!.role);
                    router.push(redirectPath);
                }, 300);
                return;
            }

            // Proceed with regular login code request for non-admin users
            const response = await requestLoginCode({ email, rememberMe }).unwrap();

            // Check if the response indicates an admin user
            if (response.user?.role === 'admin') {
                setError('');
                setSuccess('Admin account detected. Redirecting to admin portal...');
                setTimeout(() => {
                    router.push('/admin?message=Please use admin authentication');
                }, 1500);
                return;
            }

            if (response.success) {
                setSuccess(response.message || 'Verification code sent successfully');
                onCodeSent(email, false);
            } else {
                if (response.message && response.message.includes('not verified')) {
                    setSuccess('A verification code has been sent to your email. Please verify your email first.');
                    onCodeSent(email, true);
                } else {
                    setError(response.message || 'Failed to send verification code');
                }
            }
        } catch (err: any) {
            // Check if error response indicates admin user
            if (err.data?.user?.role === 'admin') {
                setError('');
                setSuccess('Admin account detected. Redirecting to admin portal...');
                setTimeout(() => {
                    router.push('/admin?message=Please use admin authentication');
                }, 1500);
                return;
            }

            if (err.data?.message?.includes('not verified')) {
                setSuccess('A verification code has been sent to your email. Please verify your email first.');
                onCodeSent(email, true);
            } else if (err.data?.message?.includes('not found')) {
                setError('No account found with this email. Please register first.');
            } else {
                setError(err.data?.message || 'Failed to send verification code. Please try again.');
            }
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
                        {success.includes('Admin account detected') ? (
                            <Shield className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                        ) : (
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                        )}
                        {success}
                    </div>
                )}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email Address
                    </Label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9 h-10 bg-white/90 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </div>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={handleRememberMeChange}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 dark:data-[state=checked]:bg-indigo-500 dark:data-[state=checked]:border-indigo-500"
                    />
                    <label
                        htmlFor="remember"
                        className="remember-me-text text-xs text-slate-600 dark:text-slate-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Remember me for 30 days
                    </label>
                </div>
                <Button
                    type="submit"
                    className="w-full h-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isCheckingRememberMe ? 'Checking account...' : 'Sending code...'}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <span>Continue</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default EmailRequestForm;


