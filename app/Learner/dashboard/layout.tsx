"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/Shared/ThemeToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import NotificationsDropdown from "@/components/Dashboard/Notifications/NotificationsDropdown";
import UserProfileDropdown from "@/components/Dashboard/Profile/UserProfileDropdown";
import EEPSidebar from "@/components/Dashboard/Layout/EEPSidebar";
import { LearnerGuard } from "@/components/Auth/RoleGuards";
import { ReduxProvider } from "@/Redux/core/provider";
import { useGetCurrentUserQuery } from "@/Redux/apiSlices/users/profileApi";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [navScrolled, setNavScrolled] = useState(false);
    const { theme } = useTheme();
    const { isAdmin, isMentor } = useAuth();

    const { data: userData } = useGetCurrentUserQuery();

    const router = useRouter();

    // Handle window resize to detect mobile view
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
            else setSidebarOpen(true);
        };

        // Initial check
        handleResize();

        // Listen for window resize
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle scroll for navbar shadow
    useEffect(() => {
        const handleScroll = () => {
            setNavScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Layout animations
    const sidebarVariants = {
        open: {
            width: isMobile ? "280px" : "280px",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        },
        closed: {
            width: isMobile ? "0" : "80px",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const contentVariants = {
        open: {
            marginLeft: isMobile ? "0" : "280px",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        },
        closed: {
            marginLeft: isMobile ? "0" : "80px",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const navbarVariants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        },
        hidden: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    // Generate a dynamic background based on theme
    const gradientBackground = theme === 'dark'
        ? "bg-gradient-to-br dark:from-slate-900 dark:to-[#0A0E1F]"
        : "bg-gradient-to-br from-slate-50 to-slate-100";

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar backdrop for mobile */}
            <AnimatePresence>
                {isMobile && sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                variants={sidebarVariants}
                initial={false}
                animate={sidebarOpen ? "open" : "closed"}
                className={cn(
                    "fixed top-0 left-0 h-full z-50 overflow-hidden",
                    isMobile ? (sidebarOpen ? "w-[220px]" : "w-0") : "w-auto",
                    // theme === 'dark'
                    //     ? "bg-[#1a1744] border-r border-purple-800/50"
                    //     : "bg-white border-r border-indigo-200/50"
                )}
            >
                <EEPSidebar
                    isCollapsed={!sidebarOpen}
                    isMobile={isMobile}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    isAdmin={isAdmin()}
                    isMentor={isMentor()}
                    currentDate={currentDate}
                />
            </motion.div>

            {/* Main Content */}
            <motion.div
                variants={contentVariants}
                initial={false}
                animate={sidebarOpen ? "open" : "closed"}
                className={cn(
                    "flex-1 flex flex-col h-screen w-full",
                    isMobile ? "ml-0" : (sidebarOpen ? "ml-[220px]" : "ml-0"),
                    gradientBackground
                )}
            >
                {/* Top Navigation */}
                <motion.header
                    initial="visible"
                    animate="visible"
                    variants={navbarVariants}
                    className={cn(
                        "sticky top-0 z-30 w-full transition-all duration-300 h-16",
                        navScrolled ?
                            (theme === 'dark' ?
                                "bg-gradient-to-br from-slate-900/90 to-[#0A0E1F]/90 backdrop-blur-md border-b border-slate-800/50 shadow-sm" :
                                "bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-sm"
                            ) :
                            (theme === 'dark' ? "bg-transparent" : "bg-white")
                    )}
                >
                    <div className="h-full px-4 flex items-center justify-between">
                        {/* Left Side */}
                        <div className="flex items-center gap-2">
                            {/* Mobile menu toggle */}
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="flex lg:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            )}

                            {/* Desktop sidebar toggle */}
                            {!isMobile && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                                className="hidden lg:flex"
                                            >
                                                {sidebarOpen ? (
                                                    <ChevronLeft className="h-5 w-5" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            <div className="hidden sm:flex items-center ml-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push('/')}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Home
                                </Button>
                            </div>

                            {/* Current Date Display */}
                            <div className="hidden md:block ml-2">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {currentDate}
                                </p>
                            </div>
                        </div>

                        {/* Right side - actions */}
                        <div className="flex items-center gap-2">
                            {/* Theme toggle */}
                            <ThemeToggle />

                            {/* Notifications */}
                            <NotificationsDropdown />

                            {/* User profile */}
                            <UserProfileDropdown user={userData?.user} />
                        </div>
                    </div>
                </motion.header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">
                    <div className=" mx-auto py-6 px-4 md:px-6">
                        <ReduxProvider>
                            <TooltipProvider>
                                <LearnerGuard>

                                    {children}

                                </LearnerGuard>
                            </TooltipProvider>
                        </ReduxProvider>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardLayout;