"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, Sparkles, Settings, User, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCurrentUserQuery } from '@/Redux/apiSlices/users/profileApi';
import ProfileHeader from '@/components/Dashboard/Profile/ProfileHeader';
import ProfileCard from '@/components/Dashboard/Profile/ProfileCard';
import ProjectsTab from '@/components/Dashboard/Profile/ProjectsTab';
import WorkspacesTab from '@/components/Dashboard/Profile/WorkspacesTab';
import { useTheme } from 'next-themes';

// Define types for our component props and state
interface ErrorCardProps {
    error: unknown;
    refetch: () => void;
}

// Define type for SVG path animation
interface PathAnimationProps {
    transform: string;
}

// Dynamic background animation component
const DynamicBackground: React.FC = () => {
    const [animationProgress, setAnimationProgress] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationProgress(prev => (prev + 1) % 100);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Translucent gradient blobs */}
            <div
                className="absolute top-0 right-0 w-2/3 h-2/3 dark:bg-gradient-to-br dark:from-indigo-900/80 dark:via-purple-900/80 dark:to-pink-950/80 bg-gradient-to-br from-indigo-500/5 via-purple-500/3 to-pink-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"
                style={{
                    opacity: 0.5 + Math.sin(animationProgress / 100 * Math.PI) * 0.2,
                    transform: `translate(${Math.sin(animationProgress / 100 * Math.PI) * 5}%, ${Math.cos(animationProgress / 100 * Math.PI) * 5}%) scale(${1 + Math.sin(animationProgress / 100 * Math.PI) * 0.05})`,
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-2/3 h-2/3 dark:bg-gradient-to-tr dark:from-blue-900/80 dark:via-indigo-900/90 dark:to-purple-900/90 bg-gradient-to-tr from-blue-500/5 via-indigo-500/3 to-purple-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"
                style={{
                    opacity: 0.5 + Math.cos(animationProgress / 100 * Math.PI) * 0.2,
                    transform: `translate(${Math.cos(animationProgress / 100 * Math.PI) * 5}%, ${Math.sin(animationProgress / 100 * Math.PI) * 5}%) scale(${1 + Math.cos(animationProgress / 100 * Math.PI) * 0.05})`,
                }}
            />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 dark:bg-grid-slate-800/[0.03] bg-grid-slate-400/[0.03] bg-[size:40px_40px] mix-blend-overlay"></div>

            {/* Flowing lines */}
            <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
                <defs>
                    <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0.05)" />
                        <stop offset="50%" stopColor="rgba(139, 92, 246, 0.08)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0.05)" />
                    </linearGradient>
                    <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(79, 70, 229, 0.05)" />
                        <stop offset="50%" stopColor="rgba(236, 72, 153, 0.08)" />
                        <stop offset="100%" stopColor="rgba(79, 70, 229, 0.05)" />
                    </linearGradient>
                </defs>

                <path
                    d="M0,200 C150,150 350,250 600,200 C850,150 1050,250 1440,200"
                    fill="none"
                    stroke="url(#lineGradient1)"
                    strokeWidth="1.5"
                    opacity="0.4"
                    style={{
                        transform: `translateY(${Math.sin(animationProgress / 100 * Math.PI) * 20}px)`,
                    } as PathAnimationProps}
                />
                <path
                    d="M0,400 C250,350 450,450 700,400 C950,350 1150,450 1440,400"
                    fill="none"
                    stroke="url(#lineGradient2)"
                    strokeWidth="1.5"
                    opacity="0.4"
                    style={{
                        transform: `translateY(${Math.cos(animationProgress / 100 * Math.PI) * 20}px)`,
                    } as PathAnimationProps}
                />
            </svg>
        </div>
    );
};

// Enhanced loading spinner component
const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center py-20">
        <div className="relative">
            {/* Outer spinning ring with gradient */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-b-purple-600 animate-spin"></div>

            {/* Inner spinning ring */}
            <div className="w-16 h-16 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>

            {/* Center pulsing icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
        </div>
    </div>
);

// Enhanced error card component
const ErrorCard: React.FC<ErrorCardProps> = ({ error, refetch }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
    >
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm overflow-hidden">
            {/* Red gradient border at top */}
            <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>

            {/* Animated background effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-500/10 blur-xl"
                    style={{
                        animation: "pulse-slow 4s infinite alternate ease-in-out",
                    }}
                />
                <div
                    className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-orange-500/10 blur-xl"
                    style={{
                        animation: "pulse-slow 4s infinite alternate-reverse ease-in-out",
                    }}
                />
            </div>

            <CardHeader className="relative">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-xl text-red-600 dark:text-red-400">Error Loading Profile</CardTitle>
                </div>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    We encountered an error while loading your profile data.
                </CardDescription>
            </CardHeader>

            <CardContent className="relative">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
                    {error instanceof Error ? error.message : 'Unknown error occurred'}
                </p>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Button
                        onClick={() => refetch()}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 dark:shadow-indigo-900/20 border-0"
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </motion.div>
            </CardContent>
        </Card>
    </motion.div>
);


const ProfilePage: React.FC = () => {
    // RTK Query hook for fetching user data
    const {
        data: userData,
        isLoading,
        error,
        refetch
    } = useGetCurrentUserQuery();

    const user = userData?.user;

    const [activeTab, setActiveTab] = useState<string>('projects');
    const profileRef = useRef<HTMLDivElement>(null);

    // Scroll to top on error/refetch
    useEffect(() => {
        if (error && profileRef.current) {
            profileRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [error]);

    // Smooth tab switching handler
    const handleTabChange = (value: string): void => {
        setActiveTab(value);
    };

    // Log user data once loaded - for debugging only
    useEffect(() => {
        if (user && process.env.NODE_ENV === 'development') {
            console.log('User data loaded:', user);
        }
    }, [user]);

    return (
        <div className="relative min-h-screen" ref={profileRef}>

            {/* Container with backdrop blur and shadow for main content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Profile header component */}
                <ProfileHeader />

                {/* Show loading spinner when data is being fetched */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <ErrorCard error={error} refetch={refetch} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Profile Info Card (Left Column) */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ProfileCard user={user} />
                            </motion.div>
                        </div>

                        {/* Tabs Content (Right Column) */}
                        <div className="lg:col-span-2">
                            <Tabs
                                value={activeTab}
                                onValueChange={handleTabChange}
                                className="w-full"
                            >
                                <TabsList className="grid grid-cols-2 mb-6 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-sm">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full"
                                    >
                                        <TabsTrigger
                                            value="projects"
                                            className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=inactive]:text-slate-700 data-[state=inactive]:dark:text-slate-300 rounded-md transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center">
                                                <BrainCircuit className="h-4 w-4 mr-2" />
                                                Projects
                                            </div>
                                        </TabsTrigger>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full"
                                    >
                                        <TabsTrigger
                                            value="workspaces"
                                            className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-slate-700 data-[state=inactive]:dark:text-slate-300 rounded-md transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center">
                                                <User className="h-4 w-4 mr-2" />
                                                Workspaces
                                            </div>
                                        </TabsTrigger>
                                    </motion.div>
                                </TabsList>

                                <div className="relative min-h-[400px]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <TabsContent value="projects" className="mt-0">
                                                <ProjectsTab
                                                    projects={user?.projects}
                                                    projectDetails={user?.projectDetails}
                                                />
                                            </TabsContent>

                                            <TabsContent value="workspaces" className="mt-0">
                                                <WorkspacesTab
                                                    workspaces={user?.workspaces}
                                                    workspaceDetails={user?.workspaceDetails}
                                                />
                                            </TabsContent>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                )}
            </motion.div>


            <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .bg-grid-slate-800 {
          background-size: 60px 60px;
          background-image: linear-gradient(to right, rgba(15, 23, 42, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(15, 23, 42, 0.1) 1px, transparent 1px);
        }
        
        .bg-grid-slate-400 {
          background-size: 60px 60px;
          background-image: linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
        }
      `}</style>
        </div>
    );
};

export default ProfilePage;


