"use client"

import React, { useState } from 'react';
import { KeySquare, RefreshCw, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/Redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useVerifyTwoFactorLoginMutation } from '@/Redux/apiSlices/users/twoFactorApi';

interface TwoFactorAuthFormProps {
    email: string;
    rememberMe: boolean;
    onBack: () => void;
}

export default function TwoFactorAuthForm({ email, rememberMe, onBack }: TwoFactorAuthFormProps) {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const router = useRouter();
    const [verificationToken, setVerificationToken] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [activeTab, setActiveTab] = useState<'app' | 'recovery'>('app');
    const [verify2FA, { isLoading }] = useVerifyTwoFactorLoginMutation();

    const getRedirectPathByRole = (role: string): string => {
        switch (role) {
            case 'admin': return '/admin/dashboard';
            case 'mentor': return '/mentor/dashboard';
            case 'learner':
            case 'user': return '/dashboard';
            default: return '/dashboard';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === 'app' && !verificationToken) {
            toast({ title: "Verification code required", description: "Please enter the 6-digit code from your authenticator app", variant: "destructive" });
            return;
        }
        if (activeTab === 'recovery' && !recoveryCode) {
            toast({ title: "Recovery code required", description: "Please enter a recovery code", variant: "destructive" });
            return;
        }
        try {
            const result = await verify2FA({
                email,
                token: activeTab === 'app' ? verificationToken : undefined,
                recoveryCode: activeTab === 'recovery' ? recoveryCode : undefined,
                rememberMe
            }).unwrap();
            if (result.success && result.token && result.user) {
                dispatch(setCredentials({ user: result.user, token: result.token }));
                toast({ title: "Authentication successful", description: "You have been successfully logged in.", variant: "default" });
                const redirectPath = getRedirectPathByRole(result.user.role);
                router.push(redirectPath);
            } else {
                toast({ title: "Authentication error", description: "Received unexpected response format. Please try again.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Verification failed", description: "The code you entered is invalid. Please try again.", variant: "destructive" });
        }
    };

    return (
        <div className="login-form">
            <div className="space-y-4">
                <div className="flex items-center justify-center">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                        <KeySquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>

                <Alert className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200/50 dark:border-indigo-800/30 text-indigo-800 dark:text-indigo-300 p-3">
                    <Shield className="h-3.5 w-3.5 mr-1.5" />
                    <AlertDescription className="text-xs">
                        Your account is protected with two-factor authentication. Please enter a verification code.
                    </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit}>
                    <Tabs
                        defaultValue="app"
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as 'app' | 'recovery')}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-4 h-9 bg-slate-100 dark:bg-slate-800/50">
                            <TabsTrigger value="app" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">Authenticator</TabsTrigger>
                            <TabsTrigger value="recovery" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">Recovery Code</TabsTrigger>
                        </TabsList>

                        <TabsContent value="app" className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="verification-code" className="text-sm font-medium text-slate-700 dark:text-slate-300">Verification Code</Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Enter the 6-digit code from your authenticator app
                                </p>
                                <Input
                                    id="verification-code"
                                    placeholder="123456"
                                    maxLength={6}
                                    value={verificationToken}
                                    onChange={(e) => setVerificationToken(e.target.value)}
                                    className="h-10 bg-white/90 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-200 text-center text-lg tracking-wider font-mono"
                                    disabled={isLoading}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="recovery" className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="recovery-code" className="text-sm font-medium text-slate-700 dark:text-slate-300">Recovery Code</Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Enter one of your recovery codes (format: XXXX-XXXX-XX)
                                </p>
                                <Input
                                    id="recovery-code"
                                    placeholder="XXXX-XXXX-XX"
                                    value={recoveryCode}
                                    onChange={(e) => setRecoveryCode(e.target.value)}
                                    className="h-10 bg-white/90 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-200 text-center tracking-wider font-mono"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center bg-slate-50 dark:bg-slate-800/30 p-2 rounded-md">
                                <HelpCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                                Recovery codes are provided when you set up two-factor authentication
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            disabled={isLoading}
                            className="w-full sm:w-auto order-2 sm:order-1 h-9 text-xs bg-white/80 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || (activeTab === 'app' ? !verificationToken : !recoveryCode)}
                            className="w-full sm:w-auto order-1 sm:order-2 h-9 text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify and Sign In'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}