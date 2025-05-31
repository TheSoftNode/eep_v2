"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, KeySquare, Fingerprint, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EmailRequestForm from '@/components/Auth/EmailRequestForm';
import LoginCodeForm from '@/components/Auth/LoginCodeForm';
import EmailVerificationForm from '@/components/Auth/EmailVerificationForm';
import TwoFactorAuthForm from '@/components/Auth/TwoFactorAuthForm';
import SocialLogin from '@/components/Auth/SocialLogin';
import { useRequestLoginCodeMutation } from '@/Redux/apiSlices/users/authApi';
import { EnhancedBackgroundElements } from '@/components/Auth/LoginBackground';

export default function LoginPage() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState<'email' | 'loginCode' | 'emailVerification' | 'twoFactor'>('email');
    const [email, setEmail] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [animationRef, setAnimationRef] = useState<number | null>(null);
    const [requestLoginCode] = useRequestLoginCodeMutation();

    useEffect(() => {
        const animate = () => {
            setAnimationProgress((prev) => (prev >= 100 ? 0 : prev + 0.3));
            const ref = requestAnimationFrame(animate);
            setAnimationRef(ref);
        };
        const ref = requestAnimationFrame(animate);
        setAnimationRef(ref);
        return () => {
            if (animationRef) cancelAnimationFrame(animationRef);
        };
    }, []);

    const handleEmailSubmit = (emailAddress: string, needsVerification: boolean) => {
        setEmail(emailAddress);
        setCurrentStep(needsVerification ? 'emailVerification' : 'loginCode');
    };

    const handleResendCode = async () => {
        try {
            await requestLoginCode({ email }).unwrap();
            toast({ title: "Code Resent", description: "A new verification code has been sent to your email" });
        } catch (error) {
            toast({ title: "Failed to resend code", description: "Please try again later", variant: "destructive" });
        }
    };

    const stepConfig = {
        email: { title: 'Sign In', subtitle: 'Access your workspace', icon: LogIn, description: 'Enter your email to continue to your development environment' },
        loginCode: { title: 'Verification', subtitle: 'Secure access', icon: KeySquare, description: 'Enter the secure code sent to your email' },
        emailVerification: { title: 'Verify Email', subtitle: 'Account security', icon: Shield, description: 'Please verify your email address to continue' },
        twoFactor: { title: 'Two-Factor', subtitle: 'Enhanced security', icon: Fingerprint, description: 'Enter your authenticator code for secure access' }
    };

    const currentConfig = stepConfig[currentStep];
    const StepIcon = currentConfig.icon;

    return (
        <>
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-[#0A0F2C] dark:via-slate-900 dark:to-[#0A0E1F] flex flex-col justify-center py-20 px-4 sm:px-6 transition-all duration-700">
                <EnhancedBackgroundElements animationProgress={animationProgress} />
                <div className="w-full max-w-7xl mx-auto z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left Panel - Enhanced Branding */}
                        <div className="flex flex-col items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-center lg:text-left space-y-6"
                            >
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-violet-500/20 dark:to-pink-500/20 border border-indigo-200/30 dark:border-indigo-700/30 backdrop-blur-sm"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mr-1.5" />
                                        <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Enterprise AI Platform</span>
                                    </motion.div>

                                    <div className="space-y-3">
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                                            <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-violet-800 dark:from-white dark:via-indigo-200 dark:to-violet-200 bg-clip-text text-transparent">
                                                Welcome Back
                                            </span>
                                            <br />
                                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                                                to EEP
                                            </span>
                                        </h1>

                                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                                            Continue your AI development journey with cutting-edge tools, expert mentorship, and collaborative workspaces.
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden lg:block space-y-4">
                                    <div className="bg-gradient-to-br from-white/60 via-indigo-50/80 to-violet-50/60 dark:from-slate-800/40 dark:via-indigo-900/20 dark:to-violet-900/20 backdrop-blur-sm p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30 shadow-lg shadow-indigo-500/5 dark:shadow-black/20">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center text-sm">
                                            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-1.5" />
                                            Platform Features
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {[
                                                { icon: "🚀", text: "AI-powered development environment" },
                                                { icon: "👥", text: "Connect with industry experts and mentors" },
                                                { icon: "⚡", text: "Real-time collaboration and project management" }
                                            ].map((feature, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                                    className="flex items-center group"
                                                >
                                                    <span className="text-sm mr-2.5 group-hover:scale-110 transition-transform duration-200">
                                                        {feature.icon}
                                                    </span>
                                                    <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {feature.text}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.8 }}
                                        className="text-xs text-slate-500 dark:text-slate-400"
                                    >
                                        New to our platform?{' '}
                                        <Link href="/auth/signup" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors group">
                                            Create an account
                                            <ArrowRight className="w-2.5 h-2.5 inline ml-1 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </motion.p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Panel - Enhanced Login Form */}
                        <div className="flex justify-center lg:justify-end">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                                className="w-full max-w-md"
                            >
                                <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 overflow-hidden">
                                    <CardHeader className="space-y-3 p-5 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                                    {currentConfig.title}
                                                </CardTitle>
                                                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                                                    {currentConfig.description}
                                                </CardDescription>
                                            </div>

                                            <motion.div
                                                key={currentStep}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25"
                                            >
                                                <StepIcon className="h-5 w-5 text-white" />
                                            </motion.div>
                                        </div>

                                        {currentStep === 'email' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-violet-900/20 border border-blue-200/50 dark:border-blue-800/30 rounded-lg p-3 backdrop-blur-sm"
                                            >
                                                <div className="flex items-start space-x-2.5">
                                                    <div className="w-6 h-6 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                                        <Shield className="h-3 w-3 text-white" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-xs">
                                                            Application Required
                                                        </h4>
                                                        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                                                            Your application must be approved before login access. Credentials will be provided after approval.
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 pt-1">
                                                            <Link
                                                                href="/application"
                                                                className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium rounded-md shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all duration-200 group"
                                                            >
                                                                Apply as Learner
                                                                <ArrowRight className="w-2.5 h-2.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                                            </Link>
                                                            <Link
                                                                href="/business-application"
                                                                className="inline-flex items-center px-2 py-1 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-md border border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 group backdrop-blur-sm"
                                                            >
                                                                Apply as Business
                                                                <ArrowRight className="w-2.5 h-2.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </CardHeader>

                                    <CardContent className="px-5 pb-5">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentStep}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                {currentStep === 'email' && (
                                                    <div className="space-y-4">
                                                        <EmailRequestForm
                                                            onCodeSent={handleEmailSubmit}
                                                            onRememberMeChange={setRememberMe}
                                                        />
                                                        <SocialLogin rememberMe={rememberMe} />
                                                    </div>
                                                )}

                                                {currentStep === 'loginCode' && (
                                                    <LoginCodeForm
                                                        email={email}
                                                        rememberMe={rememberMe}
                                                        onBack={() => setCurrentStep('email')}
                                                        onResendCode={handleResendCode}
                                                    />
                                                )}

                                                {currentStep === 'emailVerification' && (
                                                    <EmailVerificationForm
                                                        email={email}
                                                        onBack={() => setCurrentStep('email')}
                                                        onResendCode={handleResendCode}
                                                    />
                                                )}

                                                {currentStep === 'twoFactor' && (
                                                    <TwoFactorAuthForm
                                                        email={email}
                                                        rememberMe={rememberMe}
                                                        onBack={() => setCurrentStep('loginCode')}
                                                    />
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </CardContent>

                                    <CardFooter className="px-5 py-4 bg-gradient-to-r from-slate-50/50 via-white/50 to-indigo-50/50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-indigo-900/50 border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                                        <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-2 sm:space-y-0">
                                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                <Fingerprint className="h-3 w-3 mr-1.5 text-indigo-500" />
                                                <span>End-to-end encrypted authentication</span>
                                            </div>

                                            <div className="text-center sm:text-right">
                                                <p className="text-xs text-slate-600 dark:text-slate-400 lg:hidden">
                                                    New here?{' '}
                                                    <Link
                                                        href="/auth/signup"
                                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors group"
                                                    >
                                                        Sign up
                                                        <ArrowRight className="w-2.5 h-2.5 inline ml-1 group-hover:translate-x-0.5 transition-transform" />
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Animations */}
            <style jsx global>{`
                @keyframes sophisticated-pulse {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.02);
                    }
                }
                
                @keyframes elegant-float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-8px) rotate(1deg);
                    }
                }
                
                @keyframes gradient-shift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                .sophisticated-pulse {
                    animation: sophisticated-pulse 8s ease-in-out infinite;
                }
                
                .elegant-float {
                    animation: elegant-float 6s ease-in-out infinite;
                }
                
                .gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 8s ease-in-out infinite;
                }

                /* Enhanced Form Input Styling for Better Contrast */
                .login-form input[type="email"],
                .login-form input[type="text"],
                .login-form input[type="password"] {
                    background: rgba(255, 255, 255, 0.9) !important;
                    border: 1px solid rgba(203, 213, 225, 0.6) !important;
                    color: rgb(15, 23, 42) !important;
                    transition: all 0.3s ease !important;
                    height: 2.75rem !important;
                }

                .dark .login-form input[type="email"],
                .dark .login-form input[type="text"],
                .dark .login-form input[type="password"] {
                    background: rgba(30, 41, 59, 0.8) !important;
                    border: 1px solid rgba(71, 85, 105, 0.6) !important;
                    color: rgb(248, 250, 252) !important;
                }

                .login-form input[type="email"]:focus,
                .login-form input[type="text"]:focus,
                .login-form input[type="password"]:focus {
                    background: rgba(255, 255, 255, 1) !important;
                    border: 2px solid rgb(99, 102, 241) !important;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
                    color: rgb(15, 23, 42) !important;
                }

                .dark .login-form input[type="email"]:focus,
                .dark .login-form input[type="text"]:focus,
                .dark .login-form input[type="password"]:focus {
                    background: rgba(30, 41, 59, 1) !important;
                    border: 2px solid rgb(129, 140, 248) !important;
                    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1) !important;
                    color: rgb(248, 250, 252) !important;
                }

                .login-form input::placeholder {
                    color: rgb(100, 116, 139) !important;
                    opacity: 0.7 !important;
                }

                .dark .login-form input::placeholder {
                    color: rgb(148, 163, 184) !important;
                    opacity: 0.7 !important;
                }

                /* Enhanced Checkbox Styling */
                .login-form input[type="checkbox"] {
                    accent-color: rgb(99, 102, 241) !important;
                    transform: scale(1.1) !important;
                }

                .dark .login-form input[type="checkbox"] {
                    accent-color: rgb(129, 140, 248) !important;
                }

                .login-form label {
                    color: rgb(51, 65, 85) !important;
                    font-weight: 500 !important;
                }

                .dark .login-form label {
                    color: rgb(203, 213, 225) !important;
                }

                /* Remember Me Text Enhancement */
                .login-form .remember-me-text {
                    color: rgb(71, 85, 105) !important;
                    font-size: 0.75rem !important;
                }

                .dark .login-form .remember-me-text {
                    color: rgb(148, 163, 184) !important;
                }

            `}</style>
        </>
    );
}


