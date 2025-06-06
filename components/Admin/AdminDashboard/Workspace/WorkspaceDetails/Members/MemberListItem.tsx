"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Calendar, MoreHorizontal, UserMinus,
    Mail, Crown, Shield, Award, ChevronDown, ChevronUp, Globe, Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { WorkspaceMember } from '@/Redux/types/Workspace/workspace';
import { cn } from '@/lib/utils';
import { convertFirebaseDateRobust, firebaseFormatDate } from '@/components/utils/dateUtils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import MessageModal from './MessageModal';

const roleColors = {
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    mentor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    learner: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    observer: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
};

interface MemberListItemProps {
    member: WorkspaceMember;
    isCurrentUser: boolean;
    canManage?: boolean;
    isCreator: boolean;
    onRemove: () => void;
    onChangeRole?: (memberId: string, newRole: string) => void;
}

export default function MemberListItem({
    member,
    isCurrentUser,
    canManage = false,
    isCreator,
    onRemove,
    onChangeRole
}: MemberListItemProps) {
    const [expanded, setExpanded] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const { user } = useAuth();

    const getRoleColorClass = (role: string) => {
        return roleColors[role.toLowerCase() as keyof typeof roleColors] || roleColors.default;
    };

    const joinedAt = member.joinedAt ?
        firebaseFormatDate(convertFirebaseDateRobust(member.joinedAt)) :
        'Recently';

    const isOnline = member.status === 'online' || Math.random() > 0.5;
    const canBeMessaged = member.workspaceRole === 'mentor' || member.workspaceRole === 'admin';

    const handleEmailClick = () => {
        const subject = encodeURIComponent(`Message from ${user?.fullName || 'Workspace Member'}`);
        const body = encodeURIComponent(`Hi ${member.fullName},\n\nI hope this message finds you well.\n\nBest regards,\n${user?.fullName || 'Workspace Member'}`);
        const mailtoUrl = `mailto:${member.email}?subject=${subject}&body=${body}`;

        window.open(mailtoUrl, '_blank');
        toast({
            title: "Email Client Opened",
            description: `Opening email to ${member.fullName}`,
        });
    };

    const handleScheduleClick = async () => {
        setActionLoading('schedule');
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const schedulingUrl = `https://calendly.com/schedule-with-${member.fullName.toLowerCase().replace(/\s+/g, '-')}`;
            window.open(schedulingUrl, '_blank');
            toast({
                title: "Scheduling Opened",
                description: `Opening calendar to schedule with ${member.fullName}`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to open scheduling. Please try again.",
                variant: "destructive",
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleRoleChange = async (newRole: string) => {
        if (!onChangeRole) return;
        setActionLoading('role');
        try {
            await onChangeRole(member.userId, newRole);
            toast({
                title: "Role Updated",
                description: `${member.fullName}'s role has been updated to ${newRole}`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update role. Please try again.",
                variant: "destructive",
            });
        } finally {
            setActionLoading(null);
        }
    };


    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
            >
                {/* Main content row */}
                <div className="flex items-start gap-3">
                    {/* Avatar Section */}
                    <div className="relative flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium overflow-hidden ring-2 ring-transparent group-hover:ring-slate-200 dark:group-hover:ring-slate-600 transition-all duration-200">
                            {member.photoURL ? (
                                <img
                                    src={member.photoURL}
                                    alt={member.fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-lg font-semibold">
                                    {member.fullName?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                            )}
                        </div>

                        {/* Online status indicator */}
                        <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-200",
                            isOnline ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-400'
                        )} />

                        {/* Creator crown badge */}
                        {isCreator && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1 shadow-lg">
                                <Crown className="h-3 w-3 text-white" />
                            </div>
                        )}

                    </div>


                    {/* Member Information */}
                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                                    {member.fullName}
                                </h4>
                                {isCurrentUser && (
                                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        You
                                    </Badge>
                                )}
                            </div>
                            <Badge
                                variant="secondary"
                                className={cn("text-xs font-medium px-2.5 py-1 rounded-full w-fit", getRoleColorClass(member.workspaceRole || ''))}
                            >
                                {(member.workspaceRole || '').replace('_', ' ')}
                            </Badge>
                        </div>

                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                        {/* Quick actions - only show for mentors and admins */}
                        {canBeMessaged && (
                            <div className="flex items-center gap-1">
                                {/* Message button */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                                onClick={() => setShowMessageModal(true)}
                                                disabled={actionLoading === 'message'}
                                            >
                                                {actionLoading === 'message' ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                ) : (
                                                    <MessageSquare className="h-4 w-4 text-blue-600" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-xs">
                                            Send Message
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {/* Email button */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                                                onClick={handleEmailClick}
                                                disabled={actionLoading === 'email'}
                                            >
                                                {actionLoading === 'email' ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                                                ) : (
                                                    <Mail className="h-4 w-4 text-emerald-600" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-xs">
                                            Send Email
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {/* Schedule button */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                                onClick={handleScheduleClick}
                                                disabled={actionLoading === 'schedule'}
                                            >
                                                {actionLoading === 'schedule' ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                                                ) : (
                                                    <Calendar className="h-4 w-4 text-purple-600" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-xs">
                                            Schedule Meeting
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}

                        {/* Management dropdown - only if can manage and not creator */}
                        {canManage && !isCreator && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        disabled={actionLoading !== null}
                                    >
                                        {actionLoading === 'role' || actionLoading === 'remove' ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <MoreHorizontal className="h-4 w-4" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-slate-900">
                                    <DropdownMenuLabel className="text-xs font-medium">
                                        Manage {member.fullName}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {/* Role changes */}
                                    {onChangeRole && (
                                        <>
                                            {member.workspaceRole !== 'admin' && (
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange('admin')}
                                                    disabled={actionLoading !== null}
                                                    className="text-purple-600 focus:text-purple-600"
                                                >
                                                    <Shield className="mr-3 h-4 w-4" />
                                                    Promote to Admin
                                                </DropdownMenuItem>
                                            )}
                                            {member.workspaceRole !== 'mentor' && (
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange('mentor')}
                                                    disabled={actionLoading !== null}
                                                    className="text-blue-600 focus:text-blue-600"
                                                >
                                                    <Award className="mr-3 h-4 w-4" />
                                                    Make Mentor
                                                </DropdownMenuItem>
                                            )}
                                            {member.workspaceRole !== 'learner' && (
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange('learner')}
                                                    disabled={actionLoading !== null}
                                                    className="text-green-600 focus:text-green-600"
                                                >
                                                    <Globe className="mr-3 h-4 w-4" />
                                                    Change to Learner
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

                                    {/* Remove member */}
                                    <DropdownMenuItem
                                        onClick={onRemove}
                                        className="text-red-600 focus:text-red-600"
                                        disabled={actionLoading !== null}
                                    >
                                        <UserMinus className="mr-3 h-4 w-4" />
                                        Remove from Workspace
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Expand toggle button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Expanded details section */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 overflow-auto"
                        >
                            <div className="space-y-3">
                                {/* Personal information */}
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <Mail className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Email Address</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 break-all">{member.email}</p>
                                        </div>
                                    </div>

                                    {member.permissions && (
                                        <div className="flex items-start gap-2">
                                            <Shield className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Permissions</p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    {Object.values(member.permissions).filter(Boolean).length} active permissions
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Show full name if different from display */}
                                    {member.fullName && (
                                        <div className="flex items-start gap-2">
                                            <Award className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Full Name</p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{member.fullName}</p>
                                            </div>
                                        </div>
                                    )}

                                    {member.specialty && (
                                        <div className="flex items-start gap-2">
                                            <Award className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Specialty</p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{member.specialty}</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Message Modal */}
            {showMessageModal && canBeMessaged && (
                <MessageModal
                    member={member}
                    onClose={() => setShowMessageModal(false)}
                    onMessageSent={() => {
                        setShowMessageModal(false);
                        toast({
                            title: "Message Sent",
                            description: `Your message has been sent to ${member.fullName}`,
                        });
                    }}
                />
            )}

        </>
    );
}
