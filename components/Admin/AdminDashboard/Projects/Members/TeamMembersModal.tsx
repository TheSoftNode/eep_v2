"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    X,
    Plus,
    Search,
    UserMinus,
    Crown,
    Shield,
    User,
    Check,
    AlertCircle,
    RefreshCw,
    Mail,
    LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
    useAddProjectMemberMutation,
    useRemoveProjectMemberMutation,
    useGetProjectMembersQuery,
    useUpdateMemberRoleMutation
} from '@/Redux/apiSlices/Projects/projectsApiSlice';
import { useGetAllUsersQuery } from '@/Redux/apiSlices/users/adminApi';
import { cn } from '@/lib/utils';

interface TeamMembersModalProps {
    projectId: string;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export type ProjectMemberRole = 'owner' | 'mentor' | 'contributor' | 'reviewer' | 'observer';

const ROLE_OPTIONS: {
    value: ProjectMemberRole;
    label: string;
    icon: LucideIcon;
    color: string;
    description: string;
}[] = [
        {
            value: 'owner' as const,
            label: 'Owner',
            icon: Crown,
            color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
            description: 'Full control over the project'
        },
        {
            value: 'mentor' as const,
            label: 'Mentor',
            icon: Shield,
            color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
            description: 'Guides and reviews project work'
        },
        {
            value: 'contributor' as const,
            label: 'Contributor',
            icon: User,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
            description: 'Active project contributor'
        },
        {
            value: 'reviewer' as const,
            label: 'Reviewer',
            icon: User,
            color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
            description: 'Reviews and provides feedback'
        },
        {
            value: 'observer' as const,
            label: 'Observer',
            icon: User,
            color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
            description: 'View-only access'
        }
    ];

const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const getRoleConfig = (role: string) => {
    return ROLE_OPTIONS.find(r => r.value === role) || ROLE_OPTIONS[2];
};

// Custom Alert Dialog Component
interface AlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText: string;
    isLoading?: boolean;
    children: React.ReactNode;
}

const CustomAlertDialog: React.FC<AlertDialogProps> = ({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmText,
    isLoading = false,
    children
}) => {
    return (
        <>
            {React.cloneElement(children as React.ReactElement, {
                onClick: () => onOpenChange(true)
            })}

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={() => onOpenChange(false)}
                        />

                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4"
                        >
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                        {description}
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={onConfirm}
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Removing...
                                            </>
                                        ) : (
                                            confirmText
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default function TeamMembersModal({
    projectId,
    open,
    onClose,
    onSuccess
}: TeamMembersModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('contributor');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('current');
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
    const [alertDialog, setAlertDialog] = useState<{
        open: boolean;
        memberId: string;
        memberName: string;
    }>({ open: false, memberId: '', memberName: '' });
    const { toast } = useToast();

    // API Hooks
    const { data: membersResponse, isLoading: isLoadingMembers, refetch: refetchMembers } = useGetProjectMembersQuery(projectId, {
        skip: !open
    });

    const { data: usersResponse, isLoading: isLoadingUsers } = useGetAllUsersQuery({
        page: '1',
        limit: '100',
        searchQuery: searchTerm.length > 2 ? searchTerm : undefined
    }, {
        skip: !open || activeTab !== 'add'
    });

    const [addProjectMember, { isLoading: isAddingMember }] = useAddProjectMemberMutation();
    const [removeProjectMember, { isLoading: isRemovingMember }] = useRemoveProjectMemberMutation();
    const [updateMemberRole, { isLoading: isUpdatingRole }] = useUpdateMemberRoleMutation();

    const members = membersResponse?.data || [];
    const availableUsers = usersResponse?.data || [];

    // Filter out users who are already members
    const filteredUsers = searchTerm.length > 2
        ? availableUsers.filter(user =>
            !members.some(member => member.userId === user.id) &&
            (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            setSelectedUser(null);
            setSearchTerm('');
            setActiveTab('current');
            setMemberToRemove(null);
            setAlertDialog({ open: false, memberId: '', memberName: '' });
        }
    }, [open]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleAddMember = async () => {
        if (!selectedUser) return;

        try {
            await addProjectMember({
                id: projectId,
                memberId: selectedUser,
                role: selectedRole as ProjectMemberRole,
                permissions: {
                    canEdit: selectedRole === 'owner' || selectedRole === 'contributor',
                    canManageMembers: selectedRole === 'owner',
                    canCreateTasks: selectedRole === 'owner' || selectedRole === 'contributor' || selectedRole === 'mentor',
                    canAssignTasks: selectedRole === 'owner' || selectedRole === 'mentor',
                    canReviewSubmissions: selectedRole === 'owner' || selectedRole === 'mentor' || selectedRole === 'reviewer',
                    canGrade: selectedRole === 'owner' || selectedRole === 'mentor',
                    canSubmitUpdates: selectedRole !== 'observer'
                }
            }).unwrap();

            toast({
                title: "Member Added Successfully",
                description: "The team member has been added to the project.",
            });

            refetchMembers();
            onSuccess?.();
            setSelectedUser(null);
            setSearchTerm('');
            setActiveTab('current');
        } catch (error: any) {
            toast({
                title: "Failed to Add Member",
                description: error?.data?.message || "An error occurred while adding the member.",
                variant: "destructive",
            });
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!memberId) return;

        try {
            await removeProjectMember({
                id: projectId,
                memberId
            }).unwrap();

            toast({
                title: "Member Removed",
                description: "The team member has been removed from the project.",
            });

            refetchMembers();
            onSuccess?.();
            setAlertDialog({ open: false, memberId: '', memberName: '' });
        } catch (error: any) {
            toast({
                title: "Failed to Remove Member",
                description: error?.data?.message || "An error occurred while removing the member.",
                variant: "destructive",
            });
        }
    };

    const handleUpdateRole = async (memberId: string, newRole: string) => {
        if (!['owner', 'mentor', 'contributor', 'reviewer', 'observer'].includes(newRole)) {
            console.error('Invalid role provided');
            return;
        }

        try {
            await updateMemberRole({
                id: projectId,
                projectId: projectId,
                memberId,
                role: newRole as ProjectMemberRole,
                permissions: {
                    canEdit: newRole === 'owner' || newRole === 'contributor',
                    canManageMembers: newRole === 'owner',
                    canCreateTasks: newRole === 'owner' || newRole === 'contributor' || newRole === 'mentor',
                    canAssignTasks: newRole === 'owner' || newRole === 'mentor',
                    canReviewSubmissions: newRole === 'owner' || newRole === 'mentor' || newRole === 'reviewer',
                    canGrade: newRole === 'owner' || newRole === 'mentor',
                    canSubmitUpdates: newRole !== 'observer'
                }
            }).unwrap();

            toast({
                title: "Role Updated",
                description: "Member role has been updated successfully.",
            });

            refetchMembers();
            onSuccess?.();
        } catch (error: any) {
            toast({
                title: "Failed to Update Role",
                description: error?.data?.message || "An error occurred while updating the role.",
                variant: "destructive",
            });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto mx-4"
            >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 text-xl font-semibold mb-2">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
                                    <Users className="h-5 w-5" />
                                </div>
                                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    Manage Team Members
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">
                                Add new members, update roles, and manage your project team
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-10 w-10 rounded-full "
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 bg-white dark:bg-slate-900">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-900">
                            <TabsTrigger value="current" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Current Members ({members.length})
                            </TabsTrigger>
                            <TabsTrigger value="add" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add Members
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="current" className="space-y-4 bg-white dark:bg-slate-900">
                            <div className="max-h-96 overflow-y-auto space-y-3">
                                {isLoadingMembers ? (
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
                                                <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-900 rounded" />
                                                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-900 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : members.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                            No Team Members
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                                            Add team members to start collaborating on this project
                                        </p>
                                        <Button
                                            onClick={() => setActiveTab('add')}
                                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add First Member
                                        </Button>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {members.map((member, index) => {
                                            const roleConfig = getRoleConfig(member.role);
                                            const RoleIcon = roleConfig.icon;

                                            return (
                                                <motion.div
                                                    key={member.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="group"
                                                >
                                                    <Card className="p-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-md">
                                                                    {member.avatar ? (
                                                                        <AvatarImage src={member.avatar} alt={member.name} />
                                                                    ) : (
                                                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold">
                                                                            {getUserInitials(member.name)}
                                                                        </AvatarFallback>
                                                                    )}
                                                                </Avatar>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                                                                            {member.name}
                                                                        </h4>
                                                                        <Badge className={cn("text-xs font-medium border flex items-center gap-1", roleConfig.color)}>
                                                                            <RoleIcon className="h-3 w-3" />
                                                                            {roleConfig.label}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                                                        {roleConfig.description}
                                                                    </p>

                                                                    {member.contributions && (
                                                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                                            <span>{member.contributions.completedTaskCount} tasks completed</span>
                                                                            <span>{Math.round(member.contributions.totalHours)}h logged</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {/* Role Selector */}
                                                                <Select
                                                                    value={member.role}
                                                                    onValueChange={(newRole) => handleUpdateRole(member.userId, newRole)}
                                                                    disabled={isUpdatingRole || member.role === 'owner'}
                                                                >
                                                                    <SelectTrigger className="w-32 h-8 text-xs">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className='bg-white dark:bg-slate-900'>
                                                                        {ROLE_OPTIONS.map((role) => {
                                                                            const Icon = role.icon;
                                                                            return (
                                                                                <SelectItem key={role.value} value={role.value} className='bg-white dark:bg-slate-900'>
                                                                                    <div className="flex items-center gap-2 ">
                                                                                        <Icon className="h-3 w-3" />
                                                                                        {role.label}
                                                                                    </div>
                                                                                </SelectItem>
                                                                            );
                                                                        })}
                                                                    </SelectContent>
                                                                </Select>

                                                                {/* Remove Button */}
                                                                {member.role !== 'owner' && (
                                                                    <CustomAlertDialog
                                                                        open={alertDialog.open && alertDialog.memberId === member.userId}
                                                                        onOpenChange={(open) => setAlertDialog(open ?
                                                                            { open: true, memberId: member.userId, memberName: member.name } :
                                                                            { open: false, memberId: '', memberName: '' }
                                                                        )}
                                                                        onConfirm={() => handleRemoveMember(member.userId)}
                                                                        title="Remove Team Member"
                                                                        description={`Are you sure you want to remove ${member.name} from this project? This action cannot be undone and they will lose access to all project resources.`}
                                                                        confirmText="Remove Member"
                                                                        isLoading={isRemovingMember}
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                                                                        >
                                                                            <UserMinus className="h-4 w-4" />
                                                                        </Button>
                                                                    </CustomAlertDialog>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="add" className="space-y-6">
                            {/* Search Users */}
                            <Card className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 '>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Search className="h-5 w-5 text-indigo-600" />
                                        Search Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search by name or email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 h-12"
                                        />
                                    </div>

                                    {/* User Results */}
                                    <div className="max-h-64 overflow-y-auto space-y-2">
                                        {searchTerm.length <= 2 ? (
                                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                <p className="text-sm">Type at least 3 characters to search for users</p>
                                            </div>
                                        ) : isLoadingUsers ? (
                                            <div className="space-y-2">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
                                                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                                        <div className="flex-1 space-y-2">
                                                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                                                            <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : filteredUsers.length === 0 ? (
                                            <div className="text-center py-8">
                                                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    No users found or all users are already members
                                                </p>
                                            </div>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <motion.div
                                                    key={user.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                        selectedUser === user.id
                                                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800"
                                                            : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                                                    )}
                                                    onClick={() => setSelectedUser(user.id)}
                                                >
                                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800">
                                                        {user.profilePicture ? (
                                                            <AvatarImage src={user.profilePicture} alt={user.fullName} />
                                                        ) : (
                                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                                                                {getUserInitials(user.fullName)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-900 dark:text-white truncate">
                                                            {user.fullName}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3 w-3 text-slate-400" />
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {selectedUser === user.id && (
                                                        <div className="flex items-center justify-center h-6 w-6 bg-indigo-600 rounded-full text-white">
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Role Selection */}
                            {selectedUser && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Select Role</CardTitle>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Choose the appropriate role for the new team member
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {ROLE_OPTIONS.filter(role => role.value !== 'owner').map((role) => {
                                                    const Icon = role.icon;
                                                    return (
                                                        <div
                                                            key={role.value}
                                                            className={cn(
                                                                "p-4 rounded-lg border cursor-pointer transition-all",
                                                                selectedRole === role.value
                                                                    ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-700"
                                                                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                                                            )}
                                                            onClick={() => setSelectedRole(role.value)}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={cn(
                                                                    "flex items-center justify-center h-8 w-8 rounded-lg",
                                                                    selectedRole === role.value
                                                                        ? "bg-indigo-600 text-white"
                                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                                )}>
                                                                    <Icon className="h-4 w-4" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-slate-900 dark:text-white">
                                                                        {role.label}
                                                                    </h4>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                                        {role.description}
                                                                    </p>
                                                                </div>
                                                                {selectedRole === role.value && (
                                                                    <div className="flex items-center justify-center h-5 w-5 bg-indigo-600 rounded-full text-white">
                                                                        <Check className="h-3 w-3" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex justify-between w-full">
                        <Button variant="outline" onClick={onClose} className='bg-white dark:bg-slate-900'>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>

                        {activeTab === 'add' && (
                            <Button
                                onClick={handleAddMember}
                                disabled={!selectedUser || !selectedRole || isAddingMember}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            >
                                {isAddingMember ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Adding Member...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add to Team
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
