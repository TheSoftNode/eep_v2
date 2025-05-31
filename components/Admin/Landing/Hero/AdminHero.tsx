import React from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles, Lock, UserPlus, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeroProps {
    onRegister: () => void;
    onLogin?: () => void;
}

const AdminHero: React.FC<AdminHeroProps> = ({ onRegister, onLogin }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto text-center"
        >
            {/* Hero Icon with enhanced styling */}
            <motion.div
                className="mb-8 flex justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="relative">
                    {/* Multiple pulsing rings for depth */}
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 dark:border-indigo-400/20"
                        style={{ animation: 'pulse-subtle 3s ease-in-out infinite' }} />
                    <div className="absolute inset-2 rounded-full border border-indigo-500/20 dark:border-indigo-400/10"
                        style={{ animation: 'pulse-subtle 3s ease-in-out infinite reverse' }} />

                    {/* Main icon container */}
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 via-indigo-50 to-white dark:from-indigo-900/40 dark:via-indigo-800/30 dark:to-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xl ring-1 ring-indigo-100/80 dark:ring-indigo-800/30 relative overflow-hidden">
                        {/* Subtle shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
                        <Shield className="h-12 w-12 relative z-10" />
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Hero Text */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6 mb-8"
            >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight dark:text-white text-slate-800 leading-tight">
                    Admin{" "}
                    <span className="text-indigo-600 font-serif italic relative">
                        Portal
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600/0 via-indigo-600/60 to-indigo-600/0"></div>
                    </span>
                </h1>

                <p className="text-lg sm:text-xl dark:text-gray-300 text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Secure administrative access to manage users, analytics, and system configurations.
                    Built with enterprise-grade security and modern design principles.
                </p>
            </motion.div>

            {/* Enhanced Feature Badges */}
            <motion.div
                className="mb-10 flex flex-wrap gap-3 justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-indigo-50/70 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300 gap-2 border border-indigo-100/60 dark:border-indigo-800/20">
                    <Lock className="h-4 w-4 text-pink-500" />
                    <span>Passwordless Authentication</span>
                </div>

                <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-emerald-50/70 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 gap-2 border border-emerald-100/60 dark:border-emerald-800/20">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <span>User Management</span>
                </div>

                <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-violet-50/70 dark:bg-violet-900/10 text-violet-700 dark:text-violet-300 gap-2 border border-violet-100/60 dark:border-violet-800/20">
                    <Settings className="h-4 w-4 text-violet-500" />
                    <span>System Configuration</span>
                    <div className="h-2 w-2 rounded-full bg-green-500 ml-1 animate-pulse"></div>
                </div>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            >
                <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:shadow-2xl rounded-xl px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                    onClick={onRegister}
                >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer"></div>
                    <UserPlus className="h-5 w-5 mr-2 relative z-10" />
                    <span className="relative z-10">Register for Access</span>
                    <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 relative z-10">
                        <Sparkles className="h-3.5 w-3.5" />
                    </div>
                </Button>

                {onLogin && (
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 shadow-lg hover:shadow-xl rounded-xl px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105"
                        onClick={onLogin}
                    >
                        <span>Already have access?</span>
                    </Button>
                )}
            </motion.div>

            {/* Security Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 text-center"
            >
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                    <Shield className="h-3 w-3" />
                    <span>Protected by enterprise-grade security protocols</span>
                </p>
            </motion.div>

            {/* Additional Keyframes */}
            <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
        </motion.div>
    );
};

export default AdminHero;