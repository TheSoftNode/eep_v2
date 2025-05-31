"use client"

import React, { useState, useEffect, useRef } from "react";
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
import { useRouter } from 'next/navigation';
import NotificationsDropdown from "@/components/Dashboard/Notifications/NotificationsDropdown";
import UserProfileDropdown from "@/components/Dashboard/Profile/UserProfileDropdown";
import { AdminGuard } from "@/components/Auth/RoleGuards";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/Admin/AdminDashboard/Layout/AdminSidebar";
import AdminBackgroundElements from "@/components/Admin/AdminDashboard/Layout/AdminBackgroundElements";
import { useGetCurrentUserQuery } from "@/Redux/apiSlices/users/profileApi";

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
}


const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [navScrolled, setNavScrolled] = useState(false);
    const { theme } = useTheme();
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const animationRef = useRef<number>(0);

    const { data: user } = useGetCurrentUserQuery();

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

    // Animation for background elements
    useEffect(() => {
        const animate = () => {
            setAnimationProgress((prev) => (prev >= 100 ? 0 : prev + 0.2));
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
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

    // Generate a dynamic background based on theme - more elegant for admin
    const gradientBackground = theme === 'dark'
        ? "bg-gradient-to-br dark:from-slate-900 dark:to-[#0A0E1F]" // Using same gradient as features
        : "bg-gradient-to-br from-slate-50 to-slate-100"; // Light theme gradient matching features

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex h-screen overflow-hidden relative">
            {/* Background Elements */}
            <AdminBackgroundElements animationProgress={animationProgress} />

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
                    theme === 'dark'
                        ? "bg-gradient-to-b from-slate-900 to-[#0A0E1F] border-r border-slate-800/50"
                        : "bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200/70"
                )}
            >
                <AdminSidebar
                    isCollapsed={!sidebarOpen}
                    isMobile={isMobile}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
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

                            {/* Back to Admin Home Link */}
                            <div className="hidden sm:flex items-center ml-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push('/admin')}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Admin Home
                                </Button>
                            </div>

                            {/* Current Date Display */}
                            <div className="hidden md:flex items-center ml-2">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {currentDate}
                                </p>
                                <Badge className="ml-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-none shadow-sm shadow-indigo-500/20 text-white font-medium">Admin Panel</Badge>
                            </div>
                        </div>

                        {/* Right side - actions */}
                        <div className="flex items-center gap-2">
                            {/* Theme toggle */}
                            <ThemeToggle />

                            {/* Notifications */}
                            <NotificationsDropdown />

                            {/* User profile */}
                            <UserProfileDropdown user={user?.user} />
                        </div>
                    </div>
                </motion.header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">
                    <div className="container mx-auto py-6 px-4 md:px-0 lg:px-6">
                        <AdminGuard>
                            {children}
                        </AdminGuard>
                    </div>
                </div>
            </motion.div>

            {/* Custom animations */}
            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.3;
                        transform: scale(1.02);
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
            `}</style>
        </div>
    );
};


export default AdminDashboardLayout;