"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Book,
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
    UserCog,
    ChevronDown,
    Database,
    Server,
    GitBranch,
    Shield,
    FileCode,
    UserPlus,
    UserMinus,
    Layers,
    Share2,
    Key,
    Settings2,
    Mail,
    MessageCircle,
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
import UserProfile from "@/components/Dashboard/Profile/UserProfile";

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
}

interface AdminSidebarProps {
    isCollapsed: boolean;
    isMobile: boolean;
    onToggle: () => void;
    currentDate: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    isCollapsed,
    isMobile,
    onToggle,
    currentDate,
}) => {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const pathname = usePathname();
    const { theme } = useTheme();
    const { user, logout } = useAuth();


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

    // Admin navigation items with expanded functionality
    const adminNavItems: NavItem[] = [
        {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: <Home className="h-4 w-4" />
        },
        {
            name: "User Management",
            href: "/admin/dashboard/users",
            icon: <UserCog className="h-4 w-4" />,
            subItems: [
                {
                    name: "All Users",
                    href: "/admin/dashboard/users",
                    icon: <Users className="h-4 w-4" />
                },
                {
                    name: "User Statistics",
                    href: "/admin/dashboard/users/stats",
                    icon: <BarChart3 className="h-4 w-4" />
                },
                {
                    name: "Mentors",
                    href: "/admin/dashboard/users/mentors",
                    icon: <Users className="h-4 w-4" />
                },
                {
                    name: "Add User",
                    href: "/admin/dashboard/users/create",
                    icon: <UserPlus className="h-4 w-4" />
                },
                {
                    name: "Bulk Operations",
                    href: "/admin/dashboard/users/bulk",
                    icon: <Layers className="h-4 w-4" />
                },
                // {
                //     name: "Security Management",
                //     href: "/admin/dashboard/users/security",
                //     icon: <Shield className="h-4 w-4" />
                // }
            ]
        },
        {
            name: "Workspace Management",
            href: "/admin/workspaces",
            icon: <FolderKanban className="h-4 w-4" />,
            subItems: [
                {
                    name: "All Workspaces",
                    href: "/admin/dashboard/workspaces",
                    icon: <Database className="h-4 w-4" />
                },
                {
                    name: "Create Workspace",
                    href: "/admin/dashboard/workspaces/create",
                    icon: <FileCode className="h-4 w-4" />
                },
            ]
        },
        {
            name: "Project Management",
            href: "/admin/projects",
            icon: <Briefcase className="h-4 w-4" />,
            subItems: [
                {
                    name: "All Projects",
                    href: "/admin/dashboard/projects",
                    icon: <Briefcase className="h-4 w-4" />
                },
                {
                    name: "Create Project",
                    href: "/admin/dashboard/projects/create",
                    icon: <FileCode className="h-4 w-4" />
                },
            ]
        },
        {
            name: "Learning Paths",
            href: "/admin/learning-paths",
            icon: <Book className="h-4 w-4" />,
            subItems: [
                {
                    name: "All Learning Paths",
                    href: "/admin/dashboard/projects/learning-paths",
                    icon: <Book className="h-4 w-4" />
                },
                {
                    name: "Create Learning Path",
                    href: "/admin/dashboard/projects/learning-paths/create",
                    icon: <FileCode className="h-4 w-4" />
                },
            ]
        },
        {
            name: "Mentorship",
            href: "/admin/mentorship",
            icon: <Users className="h-4 w-4" />,
            subItems: [
                {
                    name: "All Mentors",
                    href: "/admin/dashboard/mentors",
                    icon: <UserPlus className="h-4 w-4" />
                },
                {
                    name: "Mentor availability",
                    href: "/admin/dashboard/mentor-availablity",
                    icon: <UserMinus className="h-4 w-4" />
                },
                {
                    name: "Mentorship Stats",
                    href: "/admin/mentorship/stats",
                    icon: <BarChart3 className="h-4 w-4" />
                }
            ]
        },
        {
            name: "Session Management",
            href: "/admin/dashboard/sessions",
            icon: <Calendar className="h-4 w-4" />,
            subItems: [
                {
                    name: "All Sessions",
                    href: "/admin/dashboard/sessions",
                    icon: <Calendar className="h-4 w-4" />
                },
                {
                    name: "Create Session",
                    href: "/admin/dashboard/sessions/create",
                    icon: <Clock className="h-4 w-4" />
                },

            ]
        },
        {
            name: "Certification",
            href: "/admin/certificates",
            icon: <Award className="h-4 w-4" />,
            subItems: [
                {
                    name: "All Certificates",
                    href: "/admin/certificates",
                    icon: <Award className="h-4 w-4" />
                },
                {
                    name: "Create Certificate",
                    href: "/admin/certificates/create",
                    icon: <FileCode className="h-4 w-4" />
                },
                {
                    name: "Certificate Templates",
                    href: "/admin/certificates/templates",
                    icon: <FileText className="h-4 w-4" />
                }
            ]
        },
        {
            name: "Analytics",
            href: "/admin/analytics",
            icon: <BarChart3 className="h-4 w-4" />,
            subItems: [
                {
                    name: "User Analytics",
                    href: "/admin/analytics/users",
                    icon: <Users className="h-4 w-4" />
                },
                {
                    name: "Project Analytics",
                    href: "/admin/analytics/projects",
                    icon: <Briefcase className="h-4 w-4" />
                },
                {
                    name: "Workspace Analytics",
                    href: "/admin/analytics/workspaces",
                    icon: <FolderKanban className="h-4 w-4" />
                },
                {
                    name: "Learning Analytics",
                    href: "/admin/analytics/learning",
                    icon: <Book className="h-4 w-4" />
                },
                {
                    name: "Session Analytics",
                    href: "/admin/sessions/analytics",
                    icon: <BarChart3 className="h-4 w-4" />
                },
                {
                    name: "System Analytics",
                    href: "/admin/analytics/system",
                    icon: <Server className="h-4 w-4" />
                }
            ]
        },
        {
            name: "Communications",
            href: "/admin/communications",
            icon: <Mail className="h-4 w-4" />,
            subItems: [
                {
                    name: "Applications",
                    href: "/admin/dashboard/communications/applications",
                    icon: <FileText className="h-4 w-4" />
                },
                {
                    name: "Contact Inquiries",
                    href: "/admin/dashboard/communications/contacts",
                    icon: <MessageCircle className="h-4 w-4" />
                },
                {
                    name: "Newsletter",
                    href: "/admin/dashboard/communications/newsletter",
                    icon: <Mail className="h-4 w-4" />
                },
                {
                    name: "Statistics",
                    href: "/admin/dashboard/communications/stats",
                    icon: <BarChart3 className="h-4 w-4" />
                }
            ]
        },
        {
            name: "System Settings",
            href: "/admin/settings",
            icon: <Settings className="h-4 w-4" />,
            subItems: [
                {
                    name: "General Settings",
                    href: "/admin/settings/general",
                    icon: <Settings2 className="h-4 w-4" />
                },
                {
                    name: "Security Settings",
                    href: "/admin/settings/security",
                    icon: <Shield className="h-4 w-4" />
                },
                {
                    name: "API Management",
                    href: "/admin/settings/api",
                    icon: <Terminal className="h-4 w-4" />
                },
                {
                    name: "Backup & Restore",
                    href: "/admin/settings/backup",
                    icon: <Database className="h-4 w-4" />
                }
            ]

        },
        {
            name: "Notifications",
            href: "/admin/dashboard/notifications",
            icon: <Bell className="h-4 w-4" />,
            badge: unreadCount > 0 ? unreadCount : undefined
        },

    ];

    // Utilities section
    const utilityItems: NavItem[] = [
        {
            name: "Help & Support",
            href: "/admin/support",
            icon: <HelpCircle className="h-4 w-4" />
        }
    ];

    // Function to toggle subgroup expansion
    const toggleGroup = (groupName: string) => {
        setExpandedGroup(expandedGroup === groupName ? null : groupName);
    };

    // Check if a nav item is active
    const isActiveLink = (href: string) => {
        if (href === "/admin/dashboard" && pathname === "/admin/dashboard") {
            return true;
        }
        return pathname.startsWith(href) && href !== "/admin/dashboard";
    };

    // Render a navigation item with modern styling
    const renderNavItem = (item: NavItem, index: number, groupName: string) => {
        const active = isActiveLink(item.href);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedGroup === groupName + "-" + item.name;

        return (
            <div key={item.name + index} className="w-full mb-0.5">
                {hasSubItems ? (
                    <div className="w-full">
                        <Button
                            variant="ghost"
                            className={cn(
                                "relative w-full justify-start gap-x-3 rounded-md p-2",
                                active
                                    ? "bg-gradient-to-r from-indigo-500/20 to-indigo-700/10 text-indigo-600 dark:text-indigo-400 font-medium"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20",
                                isCollapsed && "justify-center px-0",
                                hasSubItems && isExpanded && "bg-gradient-to-r from-indigo-50/50 to-indigo-100/30 dark:from-indigo-900/30 dark:to-indigo-800/20"
                            )}
                            onClick={() => toggleGroup(groupName + "-" + item.name)}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-md transition-colors",
                                active
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-500 dark:text-slate-400"
                            )}>
                                {item.icon}
                            </div>
                            {!isCollapsed && (
                                <>
                                    <span className="text-sm font-medium ">{item.name}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <Badge
                                            className="ml-auto px-1.5 py-0.5 text-[10px] min-w-[20px] h-5 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium border-none shadow-sm"
                                        >
                                            {item.badge}
                                        </Badge>
                                    )}
                                    {item.isNew && (
                                        <Badge
                                            className="ml-auto text-[10px] px-1.5 py-0.5 h-5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium border-none shadow-sm"
                                        >
                                            New
                                        </Badge>
                                    )}
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 ml-1 transition-transform text-slate-400 dark:text-slate-500",
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
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-9 pr-2 py-1 space-y-1 mt-0.5">
                                            {item.subItems?.map((subItem, i) => {
                                                const subActive = pathname === subItem.href;
                                                return (
                                                    <Link
                                                        key={i}
                                                        href={subItem.href}
                                                        className={cn(
                                                            "flex items-center gap-x-3 rounded-md px-3 py-2 text-xs transition-all",
                                                            subActive
                                                                ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
                                                                : "text-slate-600 dark:text-slate-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                        )}
                                                    >
                                                        {subItem.icon && (
                                                            <span className={cn(
                                                                "w-4 h-4 flex items-center justify-center",
                                                                subActive ? "text-indigo-500" : "text-slate-500"
                                                            )}>
                                                                {subItem.icon}
                                                            </span>
                                                        )}
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
                                        "flex h-10 w-full items-center gap-x-3 rounded-md px-3 text-sm font-medium transition-all",
                                        active
                                            ? "bg-gradient-to-r from-indigo-500/20 to-indigo-700/10 text-indigo-600 dark:text-indigo-400"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400",
                                        isCollapsed && "justify-center h-10 w-10 p-0 rounded-md"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center w-6 h-6 rounded-md transition-colors",
                                        active
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-slate-500 dark:text-slate-400"
                                    )}>
                                        {item.icon}
                                    </div>
                                    {!isCollapsed && (
                                        <>
                                            <span className="truncate">{item.name}</span>
                                            {item.badge !== undefined && item.badge > 0 && (
                                                <Badge
                                                    className="ml-auto px-1.5 py-0.5 text-[10px] min-w-[20px] h-5 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium border-none shadow-sm"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            {item.isNew && (
                                                <Badge
                                                    className="ml-auto text-[10px] px-1.5 py-0.5 h-5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium border-none shadow-sm"
                                                >
                                                    New
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </Link>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-xs shadow-md border-none px-3 py-2 rounded-md">
                                    <div className="flex flex-col">
                                        <span>{item.name}</span>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="text-[9px] opacity-90 mt-0.5">
                                                {item.badge} {item.badge === 1 ? 'notification' : 'notifications'}
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

    // Render a navigation group with improved styling
    const renderNavGroup = (
        title: string,
        items: NavItem[],
        groupName: string
    ) => {
        if (items.length === 0) return null;

        return (
            <div className="space-y-1">
                {!isCollapsed && (
                    <h3 className="px-3 text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-2 mt-2 ml-1">
                        {title}
                    </h3>
                )}
                {items.map((item, i) => renderNavItem(item, i, groupName))}
            </div>
        );
    };

    // Refined background color based on theme - elegant gradients matching the design
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
            {/* UserProfile component */}
            <UserProfile
                collapsed={isCollapsed}
                avatarUrl={user?.profilePicture || "/avatars/placeholder.jpg"}
                name={user?.fullName || "EEP Admin"}
                role={user?.role || "admin"}
            />

            {/* Navigation Items */}
            <div
                className={cn(
                    "flex-1 flex flex-col overflow-y-auto px-3 py-4 space-y-6",
                    isCollapsed && !isMobile ? "items-center px-2" : ""
                )}
            >
                {/* Admin Navigation */}
                {renderNavGroup("Admin", adminNavItems, "admin")}

                {/* Utilities */}
                {renderNavGroup("Utilities", utilityItems, "utilities")}
            </div>

            {/* Sidebar Footer with Logout */}
            <div
                className={cn(
                    "mt-auto border-t border-slate-200/70 dark:border-slate-800/50 p-3",
                    isCollapsed && !isMobile ? "flex justify-center" : ""
                )}
            >
                <Button
                    variant="ghost"
                    onClick={logout}
                    className={cn(
                        "w-full justify-start gap-x-3 text-red-500 dark:text-red-400 hover:bg-red-50/40 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 rounded-md h-10",
                        isCollapsed && !isMobile ? "justify-center p-2 h-10 w-10" : "",
                        "transition-all duration-200"
                    )}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-md text-red-500">
                        <LogOut className="h-4 w-4" />
                    </div>
                    {!isCollapsed && <span className="text-sm font-medium">Log Out</span>}
                </Button>
            </div>
        </div>
    );
};

export default AdminSidebar;