"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Plus,
    Users,
    ChevronRight,
    Sparkles,
    Clock,
    ExternalLink
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { WorkspaceSummary } from '@/Redux/types/Users/profile';
import EmptyState from './EmptyState';
import { useRouter } from 'next/navigation';


interface WorkspacesTabProps {
    workspaces?: string[];
    workspaceDetails?: WorkspaceSummary[];
}

const WorkspacesTab: React.FC<WorkspacesTabProps> = ({ workspaces, workspaceDetails }) => {
    const { user, isAdmin } = useAuth();
    const isAdminOrMentor = user?.role === 'admin' || user?.role === 'mentor';
    const [hoveredWorkspace, setHoveredWorkspace] = useState<string | null>(null);
    const router = useRouter();

    const handleWorkspaceView = (workspaceId: string) => {
        isAdmin() ?
            router.push(`/admin/dashboard/workspaces/${workspaceId}`) :
            router.push(`/Learner/dashboard/workspaces/${workspaceId}`)
            ;
    };

    // Dynamic background animation for cards
    const BackgroundAnimation = () => (
        <div className="absolute top-0 right-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] right-[15%] w-[55%] h-[65%] rounded-full dark:bg-gradient-to-br dark:from-indigo-600/5 dark:via-purple-500/5 dark:to-pink-600/5 bg-gradient-to-br from-indigo-600/5 via-purple-500/3 to-pink-600/3 blur-3xl"
                style={{
                    animation: "pulse-slow 15s ease-in-out infinite alternate",
                    transformOrigin: "center"
                }}
            />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
        >
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 shadow-lg border-0 overflow-hidden relative">
                {/* Subtle gradient top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                {/* Subtle animated background */}
                <BackgroundAnimation />

                <CardHeader className="pb-2 pt-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl text-slate-800 dark:text-white flex items-center group">
                                <div className="relative">
                                    <div className="absolute -inset-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-sm group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-500/30 transition-all duration-300"></div>
                                    <Briefcase className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400 relative" />
                                </div>
                                <span className="relative">My Workspaces</span>
                                <div className="ml-2 h-1 w-0 group-hover:w-6 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"></div>
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">
                                Learning environments you're part of
                            </CardDescription>
                        </div>

                        {isAdminOrMentor && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    onClick={() => router.push(`${isAdmin() ?
                                        `/admin/dashboard/workspaces/create` :
                                        `/Learner/dashboard/workspaces/create`
                                        }`)}
                                    size="sm"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 dark:shadow-indigo-900/20 border-0"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    <span>New Workspace</span>
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="px-6">
                    {!workspaces || workspaces.length === 0 ? (
                        <EmptyState
                            icon={<Briefcase className="h-6 w-6" />}
                            title="No workspaces yet"
                            description="Join a workspace to start learning with others or create your own collaborative environment."
                            actionLabel="Browse Available Workspaces"
                        />
                    ) : (
                        <div className="space-y-4">
                            {workspaceDetails ? (
                                // Display workspace details if available
                                workspaceDetails.map((workspace, index) => (
                                    <motion.div
                                        key={workspace.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="relative overflow-hidden"
                                        onMouseEnter={() => setHoveredWorkspace(workspace.id)}
                                        onMouseLeave={() => setHoveredWorkspace(null)}
                                    >
                                        {/* Hover state animated gradient background */}
                                        <AnimatePresence>
                                            {hoveredWorkspace === workspace.id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl"
                                                />
                                            )}
                                        </AnimatePresence>

                                        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-300 relative z-10 hover:border-indigo-200 dark:hover:border-indigo-800">
                                            <div className="flex items-center gap-4">
                                                <div className="relative group">
                                                    {/* Animated gradient background on hover */}
                                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                    {/* Icon container */}
                                                    <div className="relative p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md group-hover:shadow-lg group-hover:shadow-indigo-500/20 dark:shadow-indigo-900/20 transition-all">
                                                        <Briefcase className="h-5 w-5" />

                                                        {/* Subtle spinning particle effect */}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-full h-full rounded-lg border border-white/10 absolute animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium text-slate-800 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                                                        {workspace.name}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-0.5 space-x-3">
                                                        <span className="flex items-center">
                                                            <Users className="h-3 w-3 mr-1 text-indigo-400 dark:text-indigo-500" />
                                                            {workspace.memberCount} members
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Briefcase className="h-3 w-3 mr-1 text-indigo-400 dark:text-indigo-500" />
                                                            {workspace.projectCount} projects
                                                        </span>

                                                        {/* Additional status information with conditional rendering */}
                                                        {(index % 2 === 0) && (
                                                            <span className="flex items-center">
                                                                <Sparkles className="h-3 w-3 mr-1 text-pink-400 dark:text-pink-500" />
                                                                <span className="text-pink-500 dark:text-pink-400">Active</span>
                                                            </span>
                                                        )}
                                                        {(index % 3 === 0) && (
                                                            <span className="flex items-center">
                                                                <Clock className="h-3 w-3 mr-1 text-yellow-400 dark:text-yellow-500" />
                                                                <span>Updated recently</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button
                                                    onClick={() => handleWorkspaceView(workspace.id)}
                                                    size="sm"
                                                    className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-800/60 text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 border-0 transition-colors shadow-sm"
                                                >
                                                    <span>View</span>
                                                    <ChevronRight className="h-3 w-3 ml-1" />
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                // Fallback if only workspace IDs are available
                                workspaces.map((workspaceId, index) => (
                                    <motion.div
                                        key={workspaceId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="relative overflow-hidden"
                                        onMouseEnter={() => setHoveredWorkspace(workspaceId)}
                                        onMouseLeave={() => setHoveredWorkspace(null)}
                                    >
                                        {/* Hover state animated gradient background */}
                                        <AnimatePresence>
                                            {hoveredWorkspace === workspaceId && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl"
                                                />
                                            )}
                                        </AnimatePresence>

                                        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-300 relative z-10 hover:border-indigo-200 dark:hover:border-indigo-800">
                                            <div className="flex items-center gap-4">
                                                <div className="relative group">
                                                    {/* Animated gradient background on hover */}
                                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                    {/* Icon container */}
                                                    <div className="relative p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md group-hover:shadow-lg group-hover:shadow-indigo-500/20 dark:shadow-indigo-900/20 transition-all">
                                                        <Briefcase className="h-5 w-5" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium text-slate-800 dark:text-white transition-colors">
                                                        Workspace
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">ID: {workspaceId}</p>
                                                </div>
                                            </div>

                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-800/60 text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 border-0 transition-colors shadow-sm"
                                                >
                                                    <span>View</span>
                                                    <ChevronRight className="h-3 w-3 ml-1" />
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-2">
                    <Button
                        onClick={() => router.push(`${isAdmin() ?
                            `/admin/dashboard/workspaces` :
                            `/Learner/dashboard/workspaces`
                            }`)}
                        variant="outline"
                        className="w-full bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700/70 transition-all shadow-sm group"
                    >
                        <span>View All Workspaces</span>
                        <ExternalLink className="h-3 w-3 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>

            {/* Custom animations */}
            <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
        </motion.div>
    );
};

export default WorkspacesTab;
