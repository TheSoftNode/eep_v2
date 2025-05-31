"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserPlus, UserCog, Sparkles } from 'lucide-react';

interface UserProfileProps {
    collapsed: boolean;
    avatarUrl: string;
    name: string;
    role: string;
}

export default function UserProfile({ collapsed, avatarUrl, name, role }: UserProfileProps) {
    // Generate initials from name
    const getUserInitials = () => {
        if (!name) return 'U';

        const names = name.trim().split(' ');

        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }

        return names
            .slice(0, 2)
            .map(name => name[0])
            .join('')
            .toUpperCase();
    };

    // Format role display and get corresponding colors/styles based on brand palette
    const getRoleInfo = () => {
        switch (role.toLowerCase()) {
            case 'admin':
                return {
                    label: 'Admin',
                    bgColor: 'bg-gradient-to-r from-indigo-600 to-violet-600',
                    textColor: 'text-white',
                    ringColor: 'ring-indigo-500/50 dark:ring-indigo-400/30',
                    statusColor: 'bg-gradient-to-r from-indigo-500 to-violet-500',
                    icon: <UserCog className="h-3 w-3" />
                };
            case 'mentor':
                return {
                    label: 'Mentor',
                    bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
                    textColor: 'text-white',
                    ringColor: 'ring-blue-500/50 dark:ring-blue-400/30',
                    statusColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
                    icon: <UserPlus className="h-3 w-3" />
                };
            default:
                return {
                    label: 'Learner',
                    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    textColor: 'text-white',
                    ringColor: 'ring-green-500/50 dark:ring-green-400/30',
                    statusColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    icon: <Sparkles className="h-3 w-3" />
                };
        }
    };

    const initials = getUserInitials();
    const roleInfo = getRoleInfo();

    return (
        <div className={cn(
            "relative py-4 overflow-hidden",
            collapsed ? "px-2 flex flex-col items-center" : "px-4",
            "border-b border-slate-200/70 dark:border-slate-800/50",
            "bg-gradient-to-r from-slate-50/40 to-slate-50/20 dark:from-slate-900/40 dark:to-[#0A0E1F]/60"
        )}>
            {/* Subtle decorative elements - more sophisticated with reduced opacity */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-xl -ml-8 -mb-8"></div>
                <div className="absolute -bottom-2 right-1/2 w-12 h-1/2 bg-gradient-to-t from-indigo-500/5 to-transparent dark:from-indigo-500/5 dark:to-transparent blur-md"></div>
            </div>

            {/* User content with enhanced styling */}
            <div className={cn(
                "relative z-10 flex",
                collapsed ? "flex-col items-center" : "items-center"
            )}>
                {/* Avatar with refined animation and improved visual styling */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn("flex-shrink-0 relative", collapsed && "mb-2")}
                >
                    <Avatar className={cn(
                        "h-11 w-11 ring-2 ring-offset-2 dark:ring-offset-slate-900",
                        roleInfo.ringColor,
                        "shadow-md"
                    )}>
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    {/* Enhanced status indicator with gradient and better positioning */}
                    <div className={cn(
                        "absolute flex items-center justify-center h-4 w-4 rounded-full",
                        "ring-2 ring-white dark:ring-slate-900 shadow-sm",
                        collapsed ? "bottom-0 right-0" : "bottom-0 right-0"
                    )}>
                        <span className={cn(
                            "block h-full w-full rounded-full",
                            roleInfo.statusColor
                        )}></span>
                    </div>
                </motion.div>

                {/* User info with enhanced typography and spacing */}
                {!collapsed && (
                    <motion.div
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className="ml-3.5 flex-1 min-w-0"
                    >
                        <div className="flex items-center">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                {name}
                            </p>
                            <Badge className={cn(
                                "ml-2 px-2 py-0.5 text-[10px] h-5 flex items-center",
                                roleInfo.bgColor,
                                roleInfo.textColor,
                                "shadow-sm shadow-indigo-500/10 border-none"
                            )}>
                                <span className="mr-1">{roleInfo.icon}</span>
                                {roleInfo.label}
                            </Badge>
                        </div>

                        {/* Enhanced status display with better visual treatment */}
                        <div className="flex items-center mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                                Online
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Enhanced collapsed state indicator */}
            {collapsed && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.1 }}
                    className="mt-1"
                >
                    <Badge
                        className={cn(
                            "px-1.5 py-0.5 text-[9px] h-4",
                            roleInfo.bgColor,
                            roleInfo.textColor,
                            "shadow-sm border-none"
                        )}
                    >
                        {roleInfo.label}
                    </Badge>
                </motion.div>
            )}
        </div>
    );
}