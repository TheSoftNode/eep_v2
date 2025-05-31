import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    Mail,
    Crown,
    Shield,
    User,
    MoreHorizontal,
    Calendar,
    Activity,
    Settings,
    UserMinus,
    MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { ProjectMember } from '@/Redux/types/Projects';

interface TeamMembersProps {
    members: ProjectMember[];
    canManage?: boolean;
    onManageTeam?: () => void;
    onAddMember?: () => void;
    onRemoveMember?: (memberId: string) => void;
    onChangeRole?: (memberId: string, newRole: string) => void;
    onViewContributions?: (memberId: string) => void;
    isLoading?: boolean;
    className?: string;
}

const getRoleConfig = (role: string) => {
    switch (role) {
        case 'owner':
            return {
                label: 'Owner',
                color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50',
                icon: Crown
            };
        case 'mentor':
            return {
                label: 'Mentor',
                color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
                icon: Shield
            };
        case 'contributor':
            return {
                label: 'Contributor',
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
                icon: User
            };
        case 'reviewer':
            return {
                label: 'Reviewer',
                color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50',
                icon: User
            };
        case 'observer':
            return {
                label: 'Observer',
                color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                icon: User
            };
        default:
            return {
                label: 'Member',
                color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                icon: User
            };
    }
};

const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const formatJoinDate = (date: any) => {
    if (!date) return 'Recently joined';
    const dateObj = typeof date === 'string' ? new Date(date) :
        date._seconds ? new Date(date._seconds * 1000) : date;
    return `Joined ${dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    })}`;
};

export default function TeamMembers({
    members = [],
    canManage = false,
    onManageTeam,
    onAddMember,
    onRemoveMember,
    onChangeRole,
    onViewContributions,
    isLoading = false,
    className
}: TeamMembersProps) {
    const [expandedMember, setExpandedMember] = useState<string | null>(null);

    const handleMemberAction = (action: string, memberId: string) => {
        switch (action) {
            case 'remove':
                onRemoveMember?.(memberId);
                break;
            case 'contributions':
                onViewContributions?.(memberId);
                break;
            case 'contact':
                // Handle contact action
                break;
        }
    };

    const toggleMemberExpand = (memberId: string) => {
        setExpandedMember(expandedMember === memberId ? null : memberId);
    };

    if (isLoading) {
        return (
            <Card className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg", className)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <Users className="h-4 w-4" />
                        </div>
                        Team Members
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={className}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-sm relative overflow-hidden">
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/5 to-indigo-500/5 blur-2xl -mr-12 -mt-12 pointer-events-none" />

                <CardHeader className="pb-4 relative">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                                <Users className="h-4 w-4" />
                            </div>
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Team Members
                            </span>
                        </CardTitle>
                        <Badge variant="outline" className="text-xs font-medium border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400">
                            {members.length} {members.length === 1 ? 'member' : 'members'}
                        </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Project team and their roles
                    </p>
                </CardHeader>

                <CardContent className="space-y-3 relative">
                    {members.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                No Team Members
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Add team members to collaborate on this project
                            </p>
                            {canManage && onAddMember && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onAddMember}
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Add Member
                                </Button>
                            )}
                        </div>
                    ) : (
                        <AnimatePresence>
                            {members.map((member, index) => {
                                const roleConfig = getRoleConfig(member.role);
                                const RoleIcon = roleConfig.icon;
                                const isExpanded = expandedMember === member.id;

                                return (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <div className="p-3 rounded-lg bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200 hover:shadow-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <TooltipProvider delayDuration={100}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="relative">
                                                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                                                        {member.avatar ? (
                                                                            <AvatarImage src={member.avatar} alt={member.name} />
                                                                        ) : (
                                                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-medium text-sm">
                                                                                {getUserInitials(member.name)}
                                                                            </AvatarFallback>
                                                                        )}
                                                                    </Avatar>
                                                                    {member.contributions?.lastActiveAt && (
                                                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                                                                    )}
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="font-medium">{member.name}</p>
                                                                <p className="text-xs opacity-80">{formatJoinDate(member.joinedAt)}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                {member.name}
                                                            </p>
                                                            <Badge className={cn("text-xs font-medium border flex items-center gap-1", roleConfig.color)}>
                                                                <RoleIcon className="h-3 w-3" />
                                                                {roleConfig.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {formatJoinDate(member.joinedAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {/* Quick Actions */}
                                                    <TooltipProvider delayDuration={100}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                                                    onClick={() => handleMemberAction('contact', member.id)}
                                                                >
                                                                    <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Send message</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    {canManage && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuItem onClick={() => toggleMemberExpand(member.id)}>
                                                                    <Activity className="h-4 w-4 mr-2" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleMemberAction('contributions', member.id)}>
                                                                    <Calendar className="h-4 w-4 mr-2" />
                                                                    View Contributions
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleMemberAction('contact', member.id)}>
                                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                                    Send Message
                                                                </DropdownMenuItem>
                                                                {member.role !== 'owner' && (
                                                                    <>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleMemberAction('remove', member.id)}
                                                                            className="text-red-600 focus:text-red-600"
                                                                        >
                                                                            <UserMinus className="h-4 w-4 mr-2" />
                                                                            Remove Member
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded Member Details */}
                                            <AnimatePresence>
                                                {isExpanded && member.contributions && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                            <div className="grid grid-cols-3 gap-3 text-center">
                                                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                                                        {member.contributions.completedTaskCount}
                                                                    </p>
                                                                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                                                        Tasks Done
                                                                    </p>
                                                                </div>
                                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                                                        {member.contributions.taskCount}
                                                                    </p>
                                                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                                                        Total Tasks
                                                                    </p>
                                                                </div>
                                                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                                                        {Math.round(member.contributions.totalHours)}h
                                                                    </p>
                                                                    <p className="text-xs text-purple-600 dark:text-purple-400">
                                                                        Hours
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </CardContent>

                {canManage && (
                    <CardFooter className="border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 p-4">
                        <div className="flex gap-2 w-full">
                            {onAddMember && (
                                <Button
                                    variant="outline"
                                    className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20 transition-colors"
                                    onClick={onAddMember}
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            )}
                            {onManageTeam && (
                                <Button
                                    variant="outline"
                                    className="flex-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20 transition-colors"
                                    onClick={onManageTeam}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Manage Team
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );
}