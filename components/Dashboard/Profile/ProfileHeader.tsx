import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
    className?: string;
    title?: string;
    subtitle?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    className,
    title = "My Profile",
    subtitle = "Manage your personal information and account settings"
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("mb-8 relative", className)}
        >
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl dark:from-indigo-500/5 dark:to-purple-500/5"></div>

            {/* Header content with animation */}
            <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <div className="p-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent inline-flex items-center">
                        {title}
                        <motion.div
                            initial={{ rotate: -20, scale: 0.8, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                            className="ml-2"
                        >
                            <Sparkles className="h-5 w-5 text-amber-400 dark:text-amber-300" />
                        </motion.div>
                    </h1>
                </div>

                {/* Subtitle with fade-in animation */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-gray-600 dark:text-gray-400 ml-14 mb-3 text-sm max-w-xl"
                >
                    {subtitle}
                </motion.p>

                {/* Animated gradient underline */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "160px", opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                    className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full ml-3"
                />

                {/* Extra thin line for added sophistication */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "80px", opacity: 0.6 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                    className="h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-700 to-transparent rounded-full ml-12 mt-1"
                />
            </div>
        </motion.div>
    );
};

export default ProfileHeader;