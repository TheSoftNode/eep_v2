"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Folder,
    ExternalLink,
    X,
    ChevronRight,
    Globe,
    Lock,
    Building,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useActiveProject } from '../../ActiveProjectContexts/ActiveProjectContext';

const ActiveProjectIndicator: React.FC = () => {
    const { activeProject, activeWorkspace, clearActiveProject } = useActiveProject();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    // Auto-expand on first load, then collapse after 3 seconds
    useEffect(() => {
        if (activeProject && activeWorkspace) {
            setIsExpanded(true);
            const timer = setTimeout(() => setIsExpanded(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [activeProject?.id, activeWorkspace?.id]);

    // No indicator if no active project
    if (!activeProject || !activeWorkspace) {
        return null;
    }

    const navigateToProject = () => {
        router.push(`/admin/dashboard/workspaces/${activeWorkspace.id}`);
    };

    const getVisibilityIcon = () => {
        switch (activeWorkspace.visibility) {
            case 'public': return <Globe className="h-3 w-3" />;
            case 'private': return <Lock className="h-3 w-3" />;
            case 'organization': return <Building className="h-3 w-3" />;
            default: return <Lock className="h-3 w-3" />;
        }
    };

    const getStatusColor = () => {
        switch (activeProject.status) {
            case 'active': return 'from-green-400 to-emerald-500';
            case 'completed': return 'from-blue-400 to-indigo-500';
            case 'on-hold': return 'from-yellow-400 to-orange-500';
            case 'archived': return 'from-slate-400 to-gray-500';
            default: return 'from-indigo-400 to-purple-500';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.3
                }}
                className={cn(
                    "fixed bottom-6 right-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden transition-all duration-300 backdrop-blur-sm",
                    isExpanded ? 'w-80' : 'w-16',
                    isHovered && !isExpanded && 'scale-105'
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Elegant gradient header */}
                <div className={`h-1 bg-gradient-to-r ${getStatusColor()}`} />

                <div
                    className="p-4 flex items-center cursor-pointer group"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Enhanced project icon with gradient background */}
                    <div className="flex-shrink-0 relative">
                        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-3 rounded-xl shadow-sm ring-2 ring-white dark:ring-slate-900 group-hover:shadow-md transition-all duration-200">
                            <Folder className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>

                        {/* Animated pulse indicator */}
                        <div className="absolute -top-1 -right-1">
                            <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${getStatusColor()} shadow-sm animate-pulse`} />
                        </div>
                    </div>

                    {/* Enhanced project info with smooth animations */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="flex-grow ml-4 min-w-0"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate pr-2">
                                        {activeProject.name}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="text-xs px-2 py-0.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-medium"
                                    >
                                        Active
                                    </Badge>
                                </div>

                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    <span className="truncate">in {activeWorkspace.name}</span>
                                    <div className="mx-2 opacity-50">•</div>
                                    {getVisibilityIcon()}
                                    <span className="ml-1 capitalize">{activeWorkspace.visibility}</span>
                                </div>

                                {activeProject.progress !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full bg-gradient-to-r ${getStatusColor()} transition-all duration-300`}
                                                style={{ width: `${activeProject.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                            {activeProject.progress}%
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Enhanced close button with elegant hover effect */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0 ml-2"
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-full hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearActiveProject();
                                    }}
                                >
                                    <X className="h-4 w-4 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Expand/collapse indicator for collapsed state */}
                    {!isExpanded && (
                        <motion.div
                            animate={{ rotate: isHovered ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-4 right-4"
                        >
                            <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                        </motion.div>
                    )}
                </div>

                {/* Enhanced action buttons with gradient styling */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex gap-2 mt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/30 dark:hover:to-purple-800/30 transition-all duration-200 font-medium"
                                    onClick={navigateToProject}
                                >
                                    <ExternalLink className="h-3 w-3 mr-2" />
                                    Open Workspace
                                </Button>

                                {activeProject.memberCount && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                                        title={`${activeProject.memberCount} team members`}
                                    >
                                        <Users className="h-3 w-3" />
                                        <span className="ml-1 text-xs">{activeProject.memberCount}</span>
                                    </Button>
                                )}
                            </div>

                            {/* Additional project metadata */}
                            {(activeProject.lastActivityAt || activeProject.nextDeadline) && (
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                        {activeProject.lastActivityAt && (
                                            <span>
                                                Last active: {new Intl.DateTimeFormat('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                }).format(new Date(activeProject.lastActivityAt))}
                                            </span>
                                        )}
                                        {activeProject.nextDeadline && (
                                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                                                Due: {new Intl.DateTimeFormat('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                }).format(new Date(activeProject.nextDeadline))}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
};

export default ActiveProjectIndicator;