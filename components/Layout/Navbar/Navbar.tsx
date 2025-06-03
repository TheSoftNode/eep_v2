"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Settings, LogOut, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/Shared/Logo/Logo";
import ThemeToggle from "@/components/Shared/ThemeToggle";
import { useTheme } from "next-themes";
import { useGetCurrentUserQuery } from "@/Redux/apiSlices/users/profileApi";
import { useAuth } from "@/hooks/useAuth";

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [isApplyDropdownOpen, setIsApplyDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { isAuthenticated, logout } = useAuth();
    const { data: userData } = useGetCurrentUserQuery();

    const user = userData?.user;

    // Handle scroll events for navbar styling and active section tracking
    useEffect(() => {
        const handleScroll = () => {
            // Change navbar style on scroll
            setScrolled(window.scrollY > 20);

            // Track active section for highlighting in navbar
            const sections = ['features', 'how-it-works', 'testimonials', 'pricing'];
            let currentSection = '';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        currentSection = section;
                        break;
                    }
                }
            }

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640 && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileMenuOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsApplyDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Generate user initials for avatar fallback
    const getUserInitials = () => {
        if (!user || !user.fullName) return 'U';

        const names = user.fullName.trim().split(' ');

        if (names.length === 1) {
            // Single-word name: take first two letters
            return names[0].substring(0, 2).toUpperCase();
        }

        // Multi-word name: take initials of first two words
        return names
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const navItems = [
        { name: 'Features', href: '/#features' },
        { name: 'How It Works', href: '/#how-it-works' },
        { name: 'Testimonials', href: '/#testimonials' },
        { name: 'Pricing', href: '/#pricing' },
    ];

    const menuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.2, ease: "easeInOut" }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -5, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }
    };

    // Elegant apply button component
    const ElegantApplyButton = () => (
        <div className="relative" ref={dropdownRef}>
            <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1 rounded-full px-4 h-9 transition-all duration-200"
                onClick={() => setIsApplyDropdownOpen(!isApplyDropdownOpen)}
                aria-expanded={isApplyDropdownOpen}
            >
                <span className="font-medium text-sm">Apply</span>
                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isApplyDropdownOpen ? 'rotate-180' : ''}`}
                />

                {/* Subtle highlight effect */}
                <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </Button>

            {/* Apply Dropdown Menu */}
            <AnimatePresence>
                {isApplyDropdownOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none overflow-hidden"
                    >
                        <div className="py-1">
                            <Link href="/application">
                                <div
                                    className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                    onClick={() => setIsApplyDropdownOpen(false)}
                                >
                                    Apply as a Learner
                                </div>
                            </Link>
                            <Link href="/business-application">
                                <div
                                    className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                    onClick={() => setIsApplyDropdownOpen(false)}
                                >
                                    Apply as a Business
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/40'
                : 'bg-white/70 dark:bg-slate-900/20 backdrop-blur-sm border-b border-slate-200/30 dark:border-slate-800/10'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Desktop Navigation */}
                    <div className="flex items-center">
                        {/* Logo with subtle animation */}

                        {isDark ? (
                            <Logo
                                variant='light'
                                size="md"
                                showText={false}
                                animate={true}
                                showBeta={false}
                            />
                        ) : (
                            <Logo
                                variant="dark"
                                size="md"
                                showText={false}
                                animate={true}
                                showBeta={false}
                            />
                        )}


                        {/* Desktop Navigation Links */}
                        <div className="hidden md:ml-8 lg:flex md:space-x-5">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.href.substring(1);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative px-1 py-2 text-sm transition-colors duration-200 flex items-center ${isActive
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                                            }`}
                                    >
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navIndicator"
                                                className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Desktop Action Buttons / User Profile */}
                    <div className="hidden lg:flex md:items-center md:space-x-3">
                        <ThemeToggle />

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={userData?.user.profilePicture || ""} alt={user?.fullName || "User"} />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {getUserInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-128 mt-1 rounded-xl p-1 dark:bg-slate-900">
                                    <div className="flex items-center p-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                                        <Avatar className="h-9 w-9 mr-2">
                                            <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {getUserInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{user?.fullName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                                        </div>
                                    </div>
                                    <DropdownMenuItem asChild className="rounded-md h-9 my-0.5">
                                        <Link href="/Learner/dashboard/profile" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>My Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-md h-9 my-0.5">
                                        <Link href="/Learner/dashboard" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer rounded-md h-9 my-0.5 text-red-600 dark:text-red-400" onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button
                                        variant="ghost"
                                        className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 rounded-full h-9 px-4 transition-all"
                                    >
                                        Log in
                                    </Button>
                                </Link>

                                {/* Apply Button */}
                                <ElegantApplyButton />
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center lg:hidden space-x-2">
                        <ThemeToggle />

                        <button
                            type="button"
                            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:outline-none transition-colors duration-200"
                            aria-expanded="false"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Toggle navigation</span>
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu with Smooth Animation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="lg:hidden bg-white dark:bg-slate-900 shadow-xl border-b border-slate-200 dark:border-slate-800 overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                    >
                        <motion.div variants={itemVariants} className="px-4 py-3 space-y-1.5">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.href.substring(1);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="px-4 py-4 border-t border-slate-200 dark:border-slate-800"
                        >
                            {isAuthenticated ? (
                                <div className="space-y-3">
                                    <div className="flex items-center pb-3">
                                        <Avatar className="h-9 w-9 mr-3">
                                            <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {getUserInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{user?.fullName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link href="/Learner/dashboard/profile" className="block">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center text-xs h-9 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                                            >
                                                <User className="h-3.5 w-3.5 mr-1.5" />
                                                My Profile
                                            </Button>
                                        </Link>
                                        <Link href="/Learner/dashboard" className="block">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center text-xs h-9 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                                            >
                                                <Settings className="h-3.5 w-3.5 mr-1.5" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                    </div>
                                    <Button
                                        className="w-full justify-center text-xs h-9 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 border-0 rounded-lg"
                                        onClick={logout}
                                    >
                                        <LogOut className="h-3.5 w-3.5 mr-1.5" />
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link href="/auth/login" className="block w-full">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center h-9 text-sm border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                                        >
                                            Log in
                                        </Button>
                                    </Link>

                                    <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">Apply as:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/application" className="block">
                                                <Button
                                                    className="w-full justify-center text-xs h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                                                >
                                                    Learner
                                                </Button>
                                            </Link>
                                            <Link href="/business-application" className="block">
                                                <Button
                                                    className="w-full justify-center text-xs h-9 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/30 rounded-lg"
                                                >
                                                    Business
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
