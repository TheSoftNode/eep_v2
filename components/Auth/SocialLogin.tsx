"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/Redux/features/auth/authSlice';
import { saveUserToFirestore } from "@/firebase/auths/saveUser";
import { auth, githubProvider, googleProvider } from "@/firebase/config/firebase.config";
import { signInWithPopup, UserCredential, AuthProvider } from "firebase/auth";
import { IUserResponse } from '@/Redux/types/Users/user';

type ProviderType = "google" | "github";

interface SocialLoginProps {
    rememberMe: boolean;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ rememberMe }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeProvider, setActiveProvider] = useState<ProviderType | null>(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (provider: ProviderType): Promise<void> => {
        try {
            setIsLoading(true);
            setActiveProvider(provider);

            const providerInstance: AuthProvider = provider === "google" ? googleProvider : githubProvider;
            const result: UserCredential = await signInWithPopup(auth, providerInstance);
            const user = result.user;

            await saveUserToFirestore(user);

            const transformedUser: IUserResponse = {
                id: user.uid,
                fullName: user.displayName || 'User',
                email: user.email || '',
                role: "user",
                emailVerified: user.emailVerified,
                profilePicture: user.photoURL || null
            };

            const token = await user.getIdToken();

            dispatch(setCredentials({
                user: transformedUser,
                token: token
            }));

            toast({
                title: "Login Successful",
                description: `Welcome, ${user.displayName}!`,
            });

            router.push('/dashboard');
        } catch (error: unknown) {
            console.error("Login error:", error);
            toast({
                title: "Login Failed",
                description: "Could not sign in with social account. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
            setActiveProvider(null);
        }
    };

    return (
        <div className="space-y-3 mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200/40 dark:border-slate-700/40"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white/90 dark:bg-slate-900/90 px-3 text-slate-500 dark:text-slate-400 backdrop-blur-sm">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button
                        onClick={() => handleLogin("google")}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full h-10 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300/70 dark:hover:border-slate-600/70 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-900/5 dark:shadow-black/20 transition-all duration-300 group"
                    >
                        {isLoading && activeProvider === "google" ? (
                            <div className="flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"
                                />
                                <span className="ml-2 text-xs">Processing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                            className="text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors" />
                                    </svg>
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                                <span className="text-xs font-medium">Google</span>
                            </div>
                        )}
                    </Button>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button
                        onClick={() => handleLogin("github")}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full h-10 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300/70 dark:hover:border-slate-600/70 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-900/5 dark:shadow-black/20 transition-all duration-300 group"
                    >
                        {isLoading && activeProvider === "github" ? (
                            <div className="flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"
                                />
                                <span className="ml-2 text-xs">Processing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <Github className="w-4 h-4 mr-2 text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors" />
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    />
                                </div>
                                <span className="text-xs font-medium">GitHub</span>
                            </div>
                        )}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default SocialLogin;
