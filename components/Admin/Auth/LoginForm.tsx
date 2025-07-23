"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    ArrowRight,
    RefreshCw,
    ChevronLeft,
    Lock,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCheckRememberMeStatusMutation, useRequestLoginCodeMutation, useVerifyLoginCodeMutation } from "@/Redux/apiSlices/users/authApi";

interface LoginFormProps {
    onSuccess: (data: any) => void;
    onNeedsTwoFactor: (email: string, rememberMe: boolean) => void;
    onNeedsTwoFactorSetup: (email: string, rememberMe: boolean) => void;
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onSuccess,
    onNeedsTwoFactor,
    onSwitchToRegister,
    onNeedsTwoFactorSetup
}) => {
    const { toast } = useToast();

    // Local state
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [resendCounter, setResendCounter] = useState(0);


    // API mutations
    const [requestLoginCode, { isLoading: isRequestingCode }] = useRequestLoginCodeMutation();
    const [verifyLoginCode, { isLoading: isVerifyingCode }] = useVerifyLoginCodeMutation();
    const [checkRememberMe, { isLoading: isCheckingRememberMe }] = useCheckRememberMeStatusMutation();

    // Auto-focus and countdown effect
    useEffect(() => {
        if (codeSent && !verificationCode) {
            document.getElementById('verification-code')?.focus();
        }
    }, [codeSent, verificationCode]);

    // Resend countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (resendCounter > 0) {
            interval = setInterval(() => {
                setResendCounter((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendCounter]);

    // Check for remember me on component mount
    useEffect(() => {
        if (email && !codeSent) {
            checkRememberMeForEmail(email);
        }
    }, []);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const clearError = () => {
        if (isError) {
            setIsError(false);
            setErrorMessage("");
        }
    };

    const setError = (message: string) => {
        setIsError(true);
        setErrorMessage(message);
    };

    const checkRememberMeForEmail = async (emailToCheck: string) => {
        try {
            const result = await checkRememberMe({ email: emailToCheck }).unwrap();

            if (result.success && result.autoLogin) {
                toast({
                    title: "Auto-login successful",
                    description: "Welcome back!"
                });
                onSuccess(result);
            }
        } catch (error) {
            // Silently fail - just means no remember me token
            console.log('No remember me token found');
        }
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        clearError();

        try {
            await requestLoginCode({ email, rememberMe }).unwrap();

            setCodeSent(true);
            setResendCounter(60);

            toast({
                title: "Verification code sent",
                description: "Check your email for the login code"
            });
        } catch (error: any) {
            const errorMsg = error?.data?.message || "Failed to send verification code";
            setError(errorMsg);

            toast({
                title: "Error",
                description: errorMsg,
                variant: "destructive"
            });
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!verificationCode || verificationCode.length !== 6) {
            setError("Please enter a valid 6-digit verification code");
            return;
        }

        clearError();

        try {
            const result = await verifyLoginCode({
                email,
                verificationCode,
                rememberMe
            }).unwrap();

            // if (!result.requireTwoFactor) {
            //     toast({
            //         title: "Two-factor authentication setup required",
            //         description: "Please set up 2FA to secure your admin account"
            //     });
            //     onNeedsTwoFactorSetup(email, rememberMe);
            //     return;
            // }

            // toast({
            //     title: "Two-factor authentication required",
            //     description: "Please complete two-factor authentication"
            // });
            // onNeedsTwoFactor(email, rememberMe);


        } catch (error: any) {
            const errorMsg = error?.data?.message || "Invalid verification code";
            setError(errorMsg);
            setVerificationCode("");

            toast({
                title: "Verification failed",
                description: errorMsg,
                variant: "destructive"
            });
        }
    };

    const handleResendCode = async () => {
        if (resendCounter > 0) return;

        try {
            await requestLoginCode({ email, rememberMe }).unwrap();

            setResendCounter(60);
            clearError();

            toast({
                title: "Code resent",
                description: "A new verification code has been sent to your email"
            });
        } catch (error: any) {
            const errorMsg = error?.data?.message || "Failed to resend code";
            setError(errorMsg);
        }
    };

    const handleBackToEmail = () => {
        setCodeSent(false);
        setVerificationCode("");
        clearError();
    };

    const isLoading = isRequestingCode || isVerifyingCode || isCheckingRememberMe;

    return (
        <div className="space-y-6 p-6">
            {!codeSent ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Welcome back
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enter your email to receive a secure login code
                        </p>
                    </div>

                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Email address
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your admin email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearError();
                                    }}
                                    className={`pl-10 ${isError ? "border-red-500" : ""}`}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <AnimatePresence>
                                {isError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                disabled={isLoading}
                            />
                            <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400">
                                Remember me for 30 days
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !email.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {isCheckingRememberMe ? "Checking..." : "Sending..."}
                                </>
                            ) : (
                                <>
                                    Send login code
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Don't have admin access?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
                                disabled={isLoading}
                            >
                                Request access
                            </button>
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <button
                        type="button"
                        onClick={handleBackToEmail}
                        className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        disabled={isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back</span>
                    </button>

                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Check your email
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            We sent a login code to{" "}
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                {email}
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="verification-code" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Verification code
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="verification-code"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter 6-digit code"
                                    value={verificationCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                        setVerificationCode(value);
                                        clearError();
                                    }}
                                    className={`pl-10 text-center tracking-wider font-mono ${isError ? "border-red-500" : ""}`}
                                    maxLength={6}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <AnimatePresence>
                                {isError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className={`text-xs flex items-center gap-1 ${resendCounter > 0 || isLoading
                                    ? "text-slate-400 cursor-not-allowed"
                                    : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                    }`}
                                disabled={resendCounter > 0 || isLoading}
                            >
                                {resendCounter > 0 ? (
                                    <>
                                        <span>Resend code in {resendCounter}s</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-3 w-3" />
                                        <span>Resend code</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || verificationCode.length !== 6}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Note: This admin portal uses passwordless authentication for enhanced security.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default LoginForm;


