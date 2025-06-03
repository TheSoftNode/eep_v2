"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Settings,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileResponse } from "@/Redux/types/Users/profile";

interface UserProfileDropdownProps {
    user?: UserProfileResponse;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, isAdmin, isMentor } = useAuth();

    // Generate user initials
    const getUserInitials = () => {
        if (!user?.fullName) return 'U';

        const names = user.fullName.trim().split(' ');

        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }

        return names
            .slice(0, 2)
            .map(name => name[0])
            .join('')
            .toUpperCase();
    };

    // Get role-specific styling
    const getRoleStyles = () => {
        if (isAdmin()) {
            return {
                badge: "Admin",
                gradient: "from-indigo-500 to-purple-600",
                indicatorClass: "bg-purple-500"
            };
        } else if (isMentor()) {
            return {
                badge: "Mentor",
                gradient: "from-blue-500 to-indigo-600",
                indicatorClass: "bg-blue-500"
            };
        } else {
            return {
                badge: "Learner",
                gradient: "from-indigo-400 to-indigo-500",
                indicatorClass: "bg-green-500"
            };
        }
    };

    const roleStyles = getRoleStyles();

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full border dark:bg-indigo-900/80 border-indigo-100 dark:border-indigo-900/30 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                            {getUserInitials()}
                        </AvatarFallback>
                    </Avatar>
                    {isAdmin() && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-1 ring-white dark:ring-indigo-950"></span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-64 p-0 shadow-lg border border-indigo-100/80 dark:border-indigo-800/30 rounded-lg overflow-hidden"
                forceMount
            >
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="dark:bg-indigo-900/90 shadow-lg"
                >
                    {/* User info header with subtle gradient background */}
                    <div className="p-3 border-b border-indigo-100/70 dark:border-indigo-800/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/50 dark:to-purple-900/30">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-1 ring-indigo-200 dark:ring-indigo-700">
                                <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                    <p className="font-medium text-sm text-indigo-900 dark:text-indigo-100 truncate mr-2">
                                        {user?.fullName || "User"}
                                    </p>
                                    <Badge className={cn(
                                        "h-4 px-1.5 text-[10px] bg-gradient-to-r text-white",
                                        `bg-gradient-to-r ${roleStyles.gradient}`
                                    )}>
                                        {roleStyles.badge}
                                    </Badge>
                                </div>
                                <p className="text-xs text-indigo-600/80 dark:text-indigo-300/80 truncate">
                                    {user?.email || ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu items with refined hover effects */}
                    <DropdownMenuGroup className="p-1.5">
                        <DropdownMenuItem asChild className="h-8 px-2 text-sm rounded-md data-[highlighted]:bg-indigo-50 dark:data-[highlighted]:bg-indigo-800/30 cursor-pointer">
                            <Link href={`${isAdmin() ? "/admin/dashboard/profile" : "/Learner/dashboard/profile"}`} className="flex items-center">
                                <User className="mr-2 h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                                <span>Profile</span>
                                <ChevronRight className="ml-auto h-3.5 w-3.5 text-indigo-400 dark:text-indigo-500/50" />
                            </Link>
                        </DropdownMenuItem>

                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-0.5 bg-indigo-100/70 dark:bg-indigo-800/30" />

                    <DropdownMenuGroup className="p-1.5">
                        <DropdownMenuItem asChild className="h-8 px-2 text-sm rounded-md data-[highlighted]:bg-indigo-50 dark:data-[highlighted]:bg-indigo-800/30 cursor-pointer">
                            <Link href={`${isAdmin() ? "/admin/dashboard/settings" : "/Learner/dashboard/settings"}`} className="flex items-center">
                                <Settings className="mr-2 h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
                                <span>Settings</span>
                                <ChevronRight className="ml-auto h-3.5 w-3.5 text-indigo-400 dark:text-indigo-500/50" />
                            </Link>
                        </DropdownMenuItem>

                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-0.5 bg-indigo-100/70 dark:bg-indigo-800/30" />

                    {/* Logout */}
                    <div className="p-1.5">
                        <Button
                            variant="ghost"
                            className="w-full justify-start h-8 px-2 text-sm rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-700 dark:hover:text-red-300"
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-3.5 w-3.5" />
                            <span>Log Out</span>
                        </Button>
                    </div>
                </motion.div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserProfileDropdown;