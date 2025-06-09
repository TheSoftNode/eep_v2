"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useDeleteUserMutation,
    useGetUserByIdQuery,
    useToggleUserStatusMutation,
    useUpdateUserRoleMutation,
    useVerifyUserEmailMutation
} from '@/Redux/apiSlices/users/adminApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    CalendarIcon,
    CheckCircle,
    Edit,
    Mail,
    UserCog,
    AlertTriangle,
    Clock,
    Shield,
    Power,
    Trash2,
    UserCheck,
    Key,
    Building2,
    Globe,
    Github,
    XCircle,
    AlertCircle,
    Save,
    X,
    RefreshCw,
    GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { firebaseFormatDate } from '@/components/utils/dateUtils';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';
import { ConfirmDialog } from './ConfirmDialog';

interface UserModalProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ userId, isOpen, onClose, onUserUpdated }) => {
    const { toast } = useToast();

    // State
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Fetch user data
    const {
        data: userData,
        isLoading,
        isError,
        error,
        refetch
    } = useGetUserByIdQuery(userId, {
        skip: !userId || !isOpen
    });

    // Mutations
    const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
    const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [verifyUserEmail, { isLoading: isVerifyingEmail }] = useVerifyUserEmailMutation();

    // Event handlers
    const handleRoleEditClick = () => {
        if (user?.role) {
            setSelectedRole(user.role);
        }
        setIsEditingRole(true);
    };

    const handleRoleSave = async () => {
        if (selectedRole && user?.id) {
            try {
                await updateUserRole({
                    id: user.id,
                    role: selectedRole as 'user' | 'admin' | 'mentor' | 'learner'
                }).unwrap();

                setIsEditingRole(false);
                onUserUpdated();
                refetch();

                toast({
                    title: "Role Updated",
                    description: `User role has been updated to ${selectedRole}`,
                });
            } catch (err: any) {
                toast({
                    title: "Error",
                    description: err?.data?.message || "Failed to update role",
                    variant: "destructive",
                });
            }
        }
    };

    const handleVerifyEmail = async () => {
        if (user?.id) {
            try {
                await verifyUserEmail(user.id).unwrap();

                onUserUpdated();
                refetch();

                toast({
                    title: "Email Verified",
                    description: "User's email has been verified successfully",
                });
            } catch (err: any) {
                toast({
                    title: "Error",
                    description: err?.data?.message || "Failed to verify email",
                    variant: "destructive",
                });
            }
        }
    };

    const handleToggleStatus = async () => {
        if (user?.id) {
            try {
                await toggleUserStatus({
                    id: user.id,
                    disabled: !user.disabled
                }).unwrap();

                onUserUpdated();
                refetch();

                toast({
                    title: "Status Updated",
                    description: `User has been ${user.disabled ? 'enabled' : 'disabled'}`,
                });
            } catch (err: any) {
                toast({
                    title: "Error",
                    description: err?.data?.message || "Failed to update status",
                    variant: "destructive",
                });
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (user?.id) {
            try {
                await deleteUser(user.id).unwrap();

                setShowDeleteConfirm(false);
                onClose();
                onUserUpdated();

                toast({
                    title: "User Deleted",
                    description: "User has been permanently deleted",
                });
            } catch (err: any) {
                toast({
                    title: "Error",
                    description: err?.data?.message || "Failed to delete user",
                    variant: "destructive",
                });
            }
        }
    };

    // Get user initials for avatar
    const getUserInitials = (name: string) => {
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    };

    // Role styling
    const getRoleStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return {
                    badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950',
                    avatar: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                };
            case 'mentor':
                return {
                    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950',
                    avatar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                };
            case 'learner':
                return {
                    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
                    avatar: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                };
            default:
                return {
                    badge: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                    avatar: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                };
        }
    };

    // Status styling
    const getStatusStyle = (disabled: boolean, emailVerified: boolean) => {
        if (disabled) {
            return {
                badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
                text: 'Disabled',
                icon: XCircle
            };
        }
        if (!emailVerified) {
            return {
                badge: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
                text: 'Pending',
                icon: AlertCircle
            };
        }
        return {
            badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
            text: 'Active',
            icon: CheckCircle
        };
    };

    // Loading state
    if (isLoading) {
        return (
            <>
                {isOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <div className="absolute inset-0 bg-black/50" />
                        <div
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-8 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <LoadingSpinner size="md" />
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Error state
    if (isError || !userData?.data) {
        return (
            <>
                {isOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <div className="absolute inset-0 bg-black/50" />
                        <div
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            </button>

                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Error Loading User</h2>
                            </div>
                            <ErrorAlert
                                message="Failed to load user details"
                                details="Unable to fetch user information from the server"
                            />
                        </div>
                    </div>
                )}
            </>
        );
    }

    const user = userData.data;

    // Field checks
    const hasCompany = user.company && user.company.trim() !== '';
    const hasWebsite = user.website && user.website.trim() !== '';
    const hasGithub = user.github && user.github.trim() !== '';
    const hasBio = user.bio && user.bio.trim() !== '';
    const hasLastLogin = user.lastLogin;
    const hasCreatedAt = user.createdAt;

    const roleStyle = getRoleStyle(user.role);
    const statusInfo = getStatusStyle(user.disabled || false, user.emailVerified);
    const StatusIcon = statusInfo.icon;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Modal Content */}
                    <div
                        className="relative w-full max-w-4xl max-h-[97vh] overflow-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        </button>

                        <div className="flex flex-col h-full">
                            {/* Compact Header */}
                            <div className="border-b border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-16 w-16 border-2 border-slate-200 dark:border-slate-700">
                                            <AvatarImage src={user.profilePicture || undefined} />
                                            <AvatarFallback className={cn("text-lg font-semibold", roleStyle.avatar)}>
                                                {getUserInitials(user.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1">
                                            <StatusIcon className="h-3 w-3 text-emerald-500" />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white truncate">
                                                {user.fullName}
                                            </h2>
                                            <Badge className={cn("text-xs font-medium border", statusInfo.badge)}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusInfo.text}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Email Verification</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {user.emailVerified ? "Email address has been verified" : "Email address requires verification"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {user.emailVerified ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <>
                                                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Unverified
                                                        </Badge>
                                                        <Button
                                                            size="sm"
                                                            onClick={handleVerifyEmail}
                                                            disabled={isVerifyingEmail}
                                                            className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        >
                                                            {isVerifyingEmail ? (
                                                                <RefreshCw className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Verify
                                                                </>
                                                            )}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Management */}
                                    <div className="flex items-center gap-2">
                                        <AnimatePresence mode="wait">
                                            {isEditingRole ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                                                        <SelectTrigger className="w-28 h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="user">User</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="mentor">Mentor</SelectItem>
                                                            <SelectItem value="learner">Learner</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleRoleSave}
                                                        disabled={isUpdatingRole}
                                                        className="h-8 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    >
                                                        {isUpdatingRole ? (
                                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Save className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setIsEditingRole(false)}
                                                        disabled={isUpdatingRole}
                                                        className="h-8 px-2"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Badge className={cn("text-xs font-medium border", roleStyle.badge)}>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleRoleEditClick}
                                                        className="h-8 px-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Compact Tabs */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
                                <div className="border-b border-slate-200 dark:border-slate-700 px-4">
                                    <TabsList className="bg-transparent h-10">
                                        <TabsTrigger
                                            value="profile"
                                            className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/20 dark:data-[state=active]:text-indigo-400 text-xs"
                                        >
                                            <UserCheck className="h-3 w-3 mr-1" />
                                            Profile
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="professional"
                                            className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/20 dark:data-[state=active]:text-indigo-400 text-xs"
                                        >
                                            <Building2 className="h-3 w-3 mr-1" />
                                            Professional
                                        </TabsTrigger>
                                        {user.role === 'mentor' && (
                                            <TabsTrigger
                                                value="mentor"
                                                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/20 dark:data-[state=active]:text-indigo-400 text-xs"
                                            >
                                                <GraduationCap className="h-3 w-3 mr-1" />
                                                Mentor
                                            </TabsTrigger>
                                        )}
                                        <TabsTrigger
                                            value="security"
                                            className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/20 dark:data-[state=active]:text-indigo-400 text-xs"
                                        >
                                            <Shield className="h-3 w-3 mr-1" />
                                            Security
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="overflow-y-auto p-4 space-y-4">
                                    <TabsContent value="profile" className="mt-0">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {/* Account Information */}
                                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <UserCog className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                        <h3 className="font-medium text-slate-900 dark:text-white">Account Information</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Full Name</span>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.fullName}</p>
                                                        </div>
                                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Email Address</span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</p>
                                                                {user.emailVerified && (
                                                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                                                                        Verified
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Auth Provider</span>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {user.provider || 'Email'}
                                                            </p>
                                                        </div>
                                                        {hasBio && (
                                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bio</span>
                                                                <p className="text-sm text-slate-900 dark:text-white mt-1 leading-relaxed">{user.bio}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Activity Timeline */}
                                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                        <h3 className="font-medium text-slate-900 dark:text-white">Activity Timeline</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {hasCreatedAt && (
                                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Account Created</span>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <CalendarIcon className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                        {firebaseFormatDate(user.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {hasLastLogin && (
                                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Last Sign In</span>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <CalendarIcon className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                        {firebaseFormatDate(user.lastLogin)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {!hasCreatedAt && !hasLastLogin && (
                                                            <div className="p-4 text-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                <Clock className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                                                <p className="text-sm text-slate-500 dark:text-slate-400">No timestamp information available</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="professional" className="mt-0">
                                        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Building2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                                    <h3 className="font-medium text-slate-900 dark:text-white">Professional Information</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {hasCompany && (
                                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Building2 className="h-3 w-3 text-violet-500" />
                                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Company</span>
                                                            </div>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.company}</p>
                                                        </div>
                                                    )}

                                                    {hasWebsite && (
                                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Globe className="h-3 w-3 text-violet-500" />
                                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Website</span>
                                                            </div>
                                                            <a
                                                                href={user.website!}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                                                            >
                                                                {user.website}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {hasGithub && (
                                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Github className="h-3 w-3 text-violet-500" />
                                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">GitHub</span>
                                                            </div>
                                                            <a
                                                                href={`https://github.com/${user.github}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                                                            >
                                                                @{user.github}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {!hasCompany && !hasWebsite && !hasGithub && (
                                                        <div className="col-span-full p-6 text-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                            <Building2 className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">No professional information provided</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {user.role === 'mentor' && (
                                        <TabsContent value="mentor" className="mt-0">
                                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                        <h3 className="font-medium text-slate-900 dark:text-white">Mentor Information</h3>
                                                    </div>

                                                    {user.role === 'mentor' && user.metadata ? (
                                                        <div className="space-y-4">
                                                            {/* Expertise */}
                                                            {user.metadata.expertise && user.metadata.expertise.length > 0 && (
                                                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Areas of Expertise</span>
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        {user.metadata.expertise.map((skill: string, index: number) => (
                                                                            <Badge key={index} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs">
                                                                                {skill}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Skills */}
                                                            {user.metadata.skills && user.metadata.skills.length > 0 && (
                                                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Technical Skills</span>
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        {user.metadata.skills.map((skill: string, index: number) => (
                                                                            <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs">
                                                                                {skill}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Experience and Languages Row */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Experience</span>
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                                                                        {user.metadata.experience || 0} years
                                                                    </p>
                                                                </div>

                                                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Timezone</span>
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                                                                        {user.metadata.timezone || 'UTC+00:00'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Languages */}
                                                            {user.metadata.languages && user.metadata.languages.length > 0 && (
                                                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Languages</span>
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        {user.metadata.languages.map((lang: string, index: number) => (
                                                                            <Badge key={index} className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-xs">
                                                                                {lang}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Availability Status */}
                                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Availability Status</span>
                                                                        <p className="text-sm text-slate-900 dark:text-white mt-1">
                                                                            {user.metadata.isAvailable ? 'Available for mentoring' : 'Not available'}
                                                                        </p>
                                                                    </div>
                                                                    <Badge className={cn(
                                                                        "text-xs",
                                                                        user.metadata.isAvailable
                                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                                                                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                                                    )}>
                                                                        {user.metadata.isAvailable ? 'Available' : 'Not Available'}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            {/* Achievements */}
                                                            {user.metadata.achievements && user.metadata.achievements.length > 0 && (
                                                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Achievements</span>
                                                                    <div className="space-y-1 mt-2">
                                                                        {user.metadata.achievements.map((achievement: string, index: number) => (
                                                                            <p key={index} className="text-sm text-slate-900 dark:text-white">
                                                                                • {achievement}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 text-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                            <GraduationCap className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                {user.role === 'mentor' ? 'No mentor information available' : 'This user is not a mentor'}
                                                            </p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    )}

                                    <TabsContent value="security" className="mt-0">
                                        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                    <h3 className="font-medium text-slate-900 dark:text-white">Security & Verification</h3>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Email Verification</h4>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                {user.emailVerified ? "Email address has been verified" : "Email address requires verification"}
                                                            </p>
                                                        </div>
                                                        {user.emailVerified ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                Unverified
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Account Status</h4>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                {user.disabled ? "Account is currently disabled" : "Account is active and accessible"}
                                                            </p>
                                                        </div>
                                                        <Badge className={cn("text-xs font-medium border", statusInfo.badge)}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusInfo.text}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Authentication Provider</h4>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                Sign-in method: {user.provider || 'Email/Password'}
                                                            </p>
                                                        </div>
                                                        <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 text-xs">
                                                            <Key className="h-3 w-3 mr-1" />
                                                            {user.provider || 'Email'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </div>
                            </Tabs>

                            {/* Compact Action Footer */}
                            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        User ID: <span className="font-mono text-slate-700 dark:text-slate-300">{user.id}</span>
                                    </div>

                                    <div className="flex flex-wrap justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleToggleStatus}
                                            disabled={isTogglingStatus}
                                            className={cn(
                                                "h-8 px-3 text-xs transition-colors",
                                                user.disabled
                                                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                    : "border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                            )}
                                        >
                                            {isTogglingStatus ? (
                                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                            ) : (
                                                <Power className="h-3 w-3 mr-1" />
                                            )}
                                            {user.disabled ? 'Enable' : 'Disable'}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="h-8 px-3 text-xs border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete User Account"
                message={`Are you sure you want to permanently delete ${user.fullName}'s account (${user.email})? This action cannot be undone and will remove all associated data.`}
                confirmText="Delete Permanently"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
                isLoading={isDeleting}
                type="danger"
            />
        </>
    );
};

export default UserModal;