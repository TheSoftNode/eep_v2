"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Book,
    MessageSquare,
    Calendar,
    Award,
    Settings,
    HelpCircle,
    LogOut,
    Terminal,
    FileText,
    BarChart3,
    FolderKanban,
    Briefcase,
    Clock,
    Users,
    Bell,
    ChevronDown,
    GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useGetNotificationsQuery } from "@/Redux/apiSlices/notifications/notificationApi";
import UserProfile from "../Profile/UserProfile";
import { useGetUnreadMentorRepliesCountQuery, useGetUnreadMessageCountQuery } from "@/Redux/apiSlices/users/mentorMessagApi";

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    onClick?: () => void;
    badge?: number;
    subItems?: {
        name: string;
        href: string;
        icon?: React.ReactNode;
    }[];
    isNew?: boolean;
    adminOnly?: boolean;
    mentorOnly?: boolean;
}

interface EEPSidebarProps {
    isCollapsed: boolean;
    isMobile: boolean;
    onToggle: () => void;
    isAdmin: boolean;
    isMentor: boolean;
    currentDate: string;
}

const EEPSidebar: React.FC<EEPSidebarProps> = ({
    isCollapsed,
    isMobile,
    onToggle,
    isAdmin,
    isMentor,
}) => {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const pathname = usePathname();
    const { theme } = useTheme();
    const { user, logout } = useAuth();

    // Get the active project ID from pathname if it exists
    function useActiveProjectId() {
        const projectMatch = pathname.match(/^\/dashboard\/projects\/([a-zA-Z0-9-_]+)(?:\/|$)/);
        if (projectMatch && !['create', 'settings', 'tasks'].includes(projectMatch[1])) {
            return projectMatch[1];
        }
        return null;
    }

    const {
        data: unreadMessagesData,
    } = useGetUnreadMessageCountQuery(undefined, {
        skip: user?.role !== 'mentor'
    });

    const {
        data: unreadMentorRepliesData,
    } = useGetUnreadMentorRepliesCountQuery(undefined, {
        skip: user?.role === 'mentor' // Only for learners
    });

    const unreadMentorReplies = unreadMentorRepliesData?.data?.count || 0;

    const unreadDirectMessages = unreadMessagesData?.data?.count || 0;
    const activeProjectId = useActiveProjectId();

    // RTK Query hooks for notifications
    const {
        data: notificationsData,
        isLoading: isLoadingNotifications,
    } = useGetNotificationsQuery({
        page: 1,
        limit: 5,
        unreadOnly: false
    });

    // Extract notification data from the query response
    const unreadCount = notificationsData?.unreadCount || 0;

    // Build navigation items with refined icons (smaller size for compactness)
    const learnerNavItems: NavItem[] = [
        {
            name: "Dashboard",
            href: "/Learner/dashboard",
            icon: <Home className="h-4 w-4" />
        },
        {
            name: "Projects",
            href: "/Learner/dashboard/projects",
            icon: <Briefcase className="h-4 w-4" />
        },
        {
            name: "Workspaces",
            href: "/Learner/dashboard/workspaces",
            icon: <FolderKanban className="h-4 w-4" />
        },
        {
            name: "Learning Path",
            href: "/Learner/dashboard/learning-path",
            icon: <Book className="h-4 w-4" />
        },
        {
            name: "Tasks",
            href: "/Learner/dashboard/tasks",
            icon: <FileText className="h-4 w-4" />
        },
        {
            name: "Terminal",
            href: "/Learner/dashboard/terminal",
            icon: <Terminal className="h-4 w-4" />
        },
        {
            name: "Progress",
            href: activeProjectId
                ? `/Learner/dashboard/projects/${activeProjectId}/progress`
                : "/Learner/dashboard/progress",
            icon: <BarChart3 className="h-4 w-4" />
        },
        {
            name: "Mentors",
            href: "/Learner/dashboard/mentors",
            icon: <Users className="h-4 w-4" />
        },

        {
            name: "Mentor Replies",
            href: "/Learner/dashboard/mentor-replies",
            icon: <GraduationCap className="h-4 w-4" />,
            badge: unreadMentorReplies > 0 ? unreadMentorReplies : undefined
        },

        // ...(user?.role !== "mentor" ? [{
        //     name: "Mentor Replies",
        //     href: "/Learner/dashboard/mentor-replies",
        //     icon: <GraduationCap className="h-4 w-4" />,
        //     badge: unreadMentorReplies > 0 ? unreadMentorReplies : undefined
        // }] : []),

        {
            name: user?.role === 'mentor' ? "Direct Contact" : "Messages",
            href: user?.role === 'mentor' ? "/Learner/dashboard/direct-contact" : "/Learner/dashboard/messages",
            icon: <MessageSquare className="h-4 w-4" />,
            badge: user?.role === 'mentor' ? (unreadDirectMessages > 0 ? unreadDirectMessages : undefined) : 3
        },
        {
            name: "Schedule",
            href: "/Learner/dashboard/schedule",
            icon: <Calendar className="h-4 w-4" />
        },
        {
            name: "Sessions",
            href: `/Learner/dashboard/sessions`,
            icon: <Clock className="h-4 w-4" />
        },
        {
            name: "Certificates",
            href: "/Learner/dashboard/certificates",
            icon: <Award className="h-4 w-4" />
        },
        {
            name: "Notifications",
            href: "/Learner/dashboard/notifications",
            icon: <Bell className="h-4 w-4" />,
            badge: unreadCount > 0 ? unreadCount : undefined
        }
    ];


    // Utilities section
    const utilityItems: NavItem[] = [
        {
            name: "Settings",
            href: "/Learner/dashboard/settings",
            icon: <Settings className="h-4 w-4" />
        },
        {
            name: "Help & Support",
            href: "/Learner/dashboard/support",
            icon: <HelpCircle className="h-4 w-4" />
        }
    ];

    // Function to toggle subgroup expansion
    const toggleGroup = (groupName: string) => {
        setExpandedGroup(expandedGroup === groupName ? null : groupName);
    };

    // Check if a nav item is active
    const isActiveLink = (href: string) => {
        if (href === "/dashboard" && pathname === "/dashboard") {
            return true;
        }
        if (href === "/dashboard/admin" && pathname === "/dashboard/admin") {
            return true;
        }
        return pathname.startsWith(href) && href !== "/dashboard";
    };

    // Render a navigation item with refined styling
    const renderNavItem = (item: NavItem, index: number, groupName: string) => {
        if ((item.adminOnly && !isAdmin) || (item.mentorOnly && !isMentor && !isAdmin)) {
            return null;
        }

        const active = isActiveLink(item.href);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedGroup === groupName + "-" + item.name;

        return (
            <div key={item.name + index} className="w-full">
                {hasSubItems ? (
                    <div className="w-full">
                        <Button
                            variant="ghost"
                            className={cn(
                                "relative w-full justify-start gap-x-2 rounded-md p-1.5",
                                active
                                    ? "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60",
                                isCollapsed && "justify-center px-0",
                                hasSubItems && isExpanded && "bg-slate-100 dark:bg-slate-800/50"
                            )}
                            onClick={() => toggleGroup(groupName + "-" + item.name)}
                        >
                            <span className="flex min-w-0 items-center justify-center">
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <>
                                    <span className="text-lg font-medium">{item.name}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-auto text-sm h-4 px-1 min-w-[16px] flex items-center justify-center"
                                        >
                                            {item.badge}
                                        </Badge>
                                    )}
                                    {item.isNew && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-auto text-[9px] px-1 py-0 h-4 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                                        >
                                            New
                                        </Badge>
                                    )}
                                    <ChevronDown
                                        className={cn(
                                            "h-3 w-3 ml-auto transition-transform",
                                            isExpanded ? "transform rotate-180" : ""
                                        )}
                                    />
                                </>
                            )}
                        </Button>
                        {hasSubItems && !isCollapsed && (
                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-7 pr-2 py-0.5 space-y-0.5">
                                            {item.subItems?.map((subItem, i) => {
                                                const subActive = pathname === subItem.href;
                                                return (
                                                    <Link
                                                        key={i}
                                                        href={subItem.href}
                                                        className={cn(
                                                            "flex items-center gap-x-2 rounded-md px-2 py-1.5 text-xs",
                                                            subActive
                                                                ? "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                                        )}
                                                    >
                                                        {subItem.icon && <span>{subItem.icon}</span>}
                                                        <span className="truncate">{subItem.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                ) : (
                    <TooltipProvider delayDuration={isCollapsed ? 100 : 0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    onClick={(e) => {
                                        if (item.onClick) {
                                            e.preventDefault();
                                            item.onClick();
                                        }
                                    }}
                                    className={cn(
                                        "flex h-8 w-full items-center gap-x-2 rounded-md px-2.5 text-xs font-medium",
                                        active
                                            ? "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60",
                                        isCollapsed && "justify-center h-7 w-7 px-0"
                                    )}
                                >
                                    <span className="flex min-w-0 items-center justify-center">
                                        {item.icon}
                                    </span>
                                    {!isCollapsed && (
                                        <>
                                            <span className="truncate">{item.name}</span>
                                            {item.badge !== undefined && item.badge > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-auto text-[10px] h-4 px-1 min-w-[16px] flex items-center justify-center"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            {item.isNew && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-auto text-[9px] px-1 py-0 h-4 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                                                >
                                                    New
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </Link>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" className="bg-[#1e1b4b]/90 font-semibold text-xs dark:text-[#1e1b4b] dark:bg-white backdrop-blur-md border-b border-purple-800/50 shadow-sm">
                                    <div className="flex flex-col">
                                        <span>{item.name}</span>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="text-[9px] opacity-80 mt-0.5">
                                                {item.badge} {item.badge === 1 ? 'item' : 'items'}
                                            </span>
                                        )}
                                    </div>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        );
    };

    // Render a navigation group with refined spacing
    const renderNavGroup = (
        title: string,
        items: NavItem[],
        groupName: string
    ) => {
        // Filter items based on admin/mentor status
        const filteredItems = items.filter(item =>
            !(item.adminOnly && !isAdmin) && !(item.mentorOnly && !isMentor && !isAdmin)
        );

        if (filteredItems.length === 0) return null;

        return (
            <div className="space-y-0.5">
                {!isCollapsed && (
                    <h3 className="px-3 text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">
                        {title}
                    </h3>
                )}
                {filteredItems.map((item, i) => renderNavItem(item, i, groupName))}
            </div>
        );
    };

    // Determine background color based on theme - keeping this unchanged
    const sidebarBackground = theme === 'dark'
        ? "bg-gradient-to-b from-slate-900 to-[#0A0E1F] border-r border-slate-800/50"
        : "bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200/70";

    return (
        <div
            className={cn(
                "h-full flex flex-col overflow-hidden transition-all duration-300",
                sidebarBackground,
                isCollapsed && !isMobile ? "items-center" : "items-stretch"
            )}
        >

            <UserProfile
                collapsed={isCollapsed}
                avatarUrl={user?.profilePicture || "/avatars/placeholder.jpg"}
                name={user?.fullName || "EEP User"}
                role={user?.role || "user"}
            />

            {/* Navigation Items - more compact spacing */}
            <div
                className={cn(
                    "flex-1 !text-lg flex flex-col overflow-y-auto px-2 py-3 space-y-4",
                    isCollapsed && !isMobile ? "items-center px-1.5" : ""
                )}
            >
                {/* Show appropriate navigation based on user role */}
                {renderNavGroup("Main Navigation", learnerNavItems, "main")}

                {/* Utilities */}
                {renderNavGroup("Utilities", utilityItems, "utilities")}
            </div>

            {/* Sidebar Footer with Logout - refined */}
            <div
                className={cn(
                    "mt-auto border-t border-indigo-200 dark:border-purple-800/50 p-2",
                    isCollapsed && !isMobile ? "flex justify-center" : ""
                )}
            >
                <Button
                    variant="ghost"
                    onClick={logout}
                    className={cn(
                        "w-full justify-start gap-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-700 dark:hover:text-red-300 h-8 rounded-md",
                        isCollapsed && !isMobile ? "justify-center p-1.5 h-7 w-7" : ""
                    )}
                >
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && <span className="text-xs font-medium">Log Out</span>}
                </Button>
            </div>
        </div>
    );
};

export default EEPSidebar;

