"use client";

import React from "react";
import {
    ChevronDown,
    User,
    UserCheck,
    Users,
    Crown,
    Shield,
    GraduationCap,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FirebaseDate } from "@/Redux/types/Projects";

// Updated interface based on new API structure
interface ProjectMember {
    id: string;
    name: string;
    role: 'owner' | 'contributor' | 'mentor' | 'reviewer' | 'observer' | 'member';
    avatar?: string | null;
    initials?: string;
    userId: string;
    projectId: string;
    permissions?: {
        canEdit: boolean;
        canManageMembers: boolean;
        canCreateTasks: boolean;
        canAssignTasks: boolean;
        canReviewSubmissions: boolean;
        canGrade: boolean;
        canSubmitUpdates: boolean;
    };
    contributions?: {
        taskCount: number;
        completedTaskCount: number;
        totalHours: number;
        lastActiveAt: FirebaseDate;
    };
}

interface AssigneeDropdownProps {
    members: ProjectMember[];
    currentAssignee?: string | null;
    onAssigneeChange: (assigneeId: string | null) => void;
    compact?: boolean;
    variant?: 'default' | 'minimal' | 'detailed';
    showRole?: boolean;
    showContributions?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

const getRoleIcon = (role: ProjectMember['role']) => {
    switch (role) {
        case 'owner':
            return <Crown className="h-3 w-3 text-yellow-600" />;
        case 'mentor':
            return <GraduationCap className="h-3 w-3 text-blue-600" />;
        case 'reviewer':
            return <Shield className="h-3 w-3 text-purple-600" />;
        case 'contributor':
            return <UserCheck className="h-3 w-3 text-green-600" />;
        case 'observer':
            return <Eye className="h-3 w-3 text-slate-500" />;
        default:
            return <User className="h-3 w-3 text-slate-500" />;
    }
};

const getRoleBadgeStyle = (role: ProjectMember['role']) => {
    switch (role) {
        case 'owner':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
        case 'mentor':
            return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
        case 'reviewer':
            return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
        case 'contributor':
            return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
        case 'observer':
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        default:
            return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800';
    }
};

const getRoleDisplayName = (role: ProjectMember['role']) => {
    switch (role) {
        case 'owner':
            return 'Owner';
        case 'mentor':
            return 'Mentor';
        case 'reviewer':
            return 'Reviewer';
        case 'contributor':
            return 'Contributor';
        case 'observer':
            return 'Observer';
        default:
            return 'Member';
    }
};

export default function AssigneeDropdown({
    members,
    currentAssignee,
    onAssigneeChange,
    compact = false,
    variant = 'default',
    showRole = true,
    showContributions = false,
    disabled = false,
    placeholder = 'Unassigned',
    className
}: AssigneeDropdownProps) {
    const currentMember = members.find(m => m.id === currentAssignee || m.userId === currentAssignee);

    // Group members by role for better organization
    const groupedMembers = members.reduce((acc, member) => {
        if (!acc[member.role]) {
            acc[member.role] = [];
        }
        acc[member.role].push(member);
        return acc;
    }, {} as Record<string, ProjectMember[]>);

    const roleOrder: ProjectMember['role'][] = ['owner', 'mentor', 'reviewer', 'contributor', 'member', 'observer'];
    const sortedRoles = roleOrder.filter(role => groupedMembers[role]?.length > 0);

    const renderTriggerContent = () => {
        if (variant === 'minimal') {
            return (
                <div className="flex items-center gap-2">
                    {currentMember ? (
                        <Avatar className="h-6 w-6 border-2 border-white dark:border-slate-800 shadow-sm">
                            <AvatarImage src={currentMember.avatar || undefined} alt={currentMember.name} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
                                {currentMember.initials || currentMember.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700">
                            <User className="h-3 w-3 text-slate-500" />
                        </div>
                    )}
                    {!compact && <ChevronDown className="h-3 w-3 text-slate-400" />}
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 min-w-0">
                    {currentMember ? (
                        <>
                            <Avatar className={cn(
                                "border-2 border-white dark:border-slate-800 shadow-sm",
                                compact ? "h-5 w-5" : "h-6 w-6"
                            )}>
                                <AvatarImage src={currentMember.avatar || undefined} alt={currentMember.name} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
                                    {currentMember.initials || currentMember.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <span className={cn(
                                    "font-medium text-slate-700 dark:text-slate-300 truncate",
                                    compact ? "text-xs" : "text-sm"
                                )}>
                                    {currentMember.name}
                                </span>
                                {showRole && !compact && (
                                    <div className="flex items-center gap-1">
                                        {getRoleIcon(currentMember.role)}
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {getRoleDisplayName(currentMember.role)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={cn(
                                "flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800",
                                compact ? "h-5 w-5" : "h-6 w-6"
                            )}>
                                <User className={cn("text-slate-400", compact ? "h-3 w-3" : "h-3 w-3")} />
                            </div>
                            <span className={cn(
                                "text-slate-500 dark:text-slate-400",
                                compact ? "text-xs" : "text-sm"
                            )}>
                                {placeholder}
                            </span>
                        </>
                    )}
                </div>
                {!compact && <ChevronDown className="h-4 w-4 text-slate-400 ml-2 flex-shrink-0" />}
            </div>
        );
    };

    const renderMemberItem = (member: ProjectMember) => (
        <DropdownMenuItem
            key={member.id}
            onClick={() => onAssigneeChange(member.id)}
            className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors"
        >
            <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-800 shadow-sm">
                    <AvatarImage src={member.avatar || undefined} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
                        {member.initials || member.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {member.name}
                        </span>
                        {currentAssignee === member.id && (
                            <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        {showRole && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-xs border px-2 py-0.5 font-medium",
                                    getRoleBadgeStyle(member.role)
                                )}
                            >
                                <div className="flex items-center gap-1">
                                    {getRoleIcon(member.role)}
                                    <span>{getRoleDisplayName(member.role)}</span>
                                </div>
                            </Badge>
                        )}

                        {showContributions && member.contributions && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span>{member.contributions.taskCount} tasks</span>
                                <span>•</span>
                                <span>{member.contributions.totalHours}h</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DropdownMenuItem>
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size={compact ? "sm" : "default"}
                    disabled={disabled}
                    className={cn(
                        "transition-all duration-200 border-slate-200 dark:border-slate-700",
                        "hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600",
                        "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400",
                        compact ? "h-8 px-2" : "h-10 px-3",
                        variant === 'minimal' ? "border-none shadow-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800" : "",
                        currentMember && variant !== 'minimal' ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/10" : "",
                        disabled && "opacity-50 cursor-not-allowed",
                        className
                    )}
                >
                    {renderTriggerContent()}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className={cn(
                    "w-72 max-h-96 overflow-y-auto",
                    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl",
                    "rounded-lg p-2"
                )}
                sideOffset={4}
            >
                {/* Unassigned Option */}
                <DropdownMenuItem
                    onClick={() => onAssigneeChange(null)}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors mb-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                            <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <span className="font-medium text-slate-600 dark:text-slate-400">
                                {placeholder}
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                                No one assigned to this task
                            </p>
                        </div>
                        {currentAssignee === null && (
                            <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                    </div>
                </DropdownMenuItem>

                {members.length > 0 && <DropdownMenuSeparator className="my-2" />}

                {/* Members grouped by role */}
                {variant === 'detailed' && sortedRoles.length > 1 ? (
                    <div className="space-y-2">
                        {sortedRoles.map((role) => (
                            <div key={role}>
                                <DropdownMenuLabel className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        {getRoleIcon(role)}
                                        {getRoleDisplayName(role)}s ({groupedMembers[role].length})
                                    </div>
                                </DropdownMenuLabel>
                                <div className="space-y-1">
                                    {groupedMembers[role].map(renderMemberItem)}
                                </div>
                                {role !== sortedRoles[sortedRoles.length - 1] && (
                                    <DropdownMenuSeparator className="my-2" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {members.map(renderMemberItem)}
                    </div>
                )}

                {members.length === 0 && (
                    <div className="p-4 text-center">
                        <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            No team members available
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Add members to the project first
                        </p>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}