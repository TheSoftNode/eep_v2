import React from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Home } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Shared/Logo/Logo";
import ThemeToggle from "@/components/Shared/ThemeToggle";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
    isDark: boolean;
    onLogin: () => void;
    onRegister?: () => void;
    showHomeLink?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    isDark,
    onLogin,
    onRegister,
    showHomeLink = true
}) => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Navigation */}
                    <motion.div
                        className="flex items-center space-x-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Logo */}
                        <div className="flex items-center">
                            {isDark ? (
                                <Logo
                                    variant="light"
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
                            <span className="ml-3 text-lg font-semibold text-slate-800 dark:text-white">
                                Admin{" "}
                                <span className="text-indigo-600 font-serif italic">Portal</span>
                            </span>
                        </div>

                        {/* Navigation Links */}
                        {showHomeLink && (
                            <nav className="hidden md:flex items-center space-x-4">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <Home className="h-4 w-4" />
                                    <span>Back to Main Site</span>
                                </Link>
                            </nav>
                        )}
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <ThemeToggle />

                        {/* Desktop Actions */}
                        <div className="hidden sm:flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 rounded-full px-4 transition-all"
                                onClick={onLogin}
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Log in
                            </Button>

                            {onRegister && (
                                <Button
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-full px-4 transition-all duration-200"
                                    onClick={onRegister}
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Register
                                </Button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="sm:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 rounded-full px-3 transition-all"
                                onClick={onLogin}
                            >
                                <LogIn className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Subtle bottom border effect */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        </motion.header>
    );
};

export default AdminHeader;