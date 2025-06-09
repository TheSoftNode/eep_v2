"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, MoreHorizontal, UserCheck, Mail, Eye, RefreshCw, Power } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetRecentUsersQuery, useToggleUserStatusMutation, useVerifyUserEmailMutation, useUnverifyUserEmailMutation } from "@/Redux/apiSlices/users/adminApi";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/Redux/types/Users/user";
import { cn } from "@/lib/utils";
import UserModal from "../Users/Main/UserDetailModal";

const RecentRegistrations: React.FC = () => {

    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const { toast } = useToast();
    const { data: usersData, isLoading, error, refetch: refetchUsers } = useGetRecentUsersQuery({ limit: 10 });
    const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
    const [verifyUserEmail, { isLoading: isVerifyingEmail }] = useVerifyUserEmailMutation();
    const [unverifyUserEmail, { isLoading: isUnverifyingEmail }] = useUnverifyUserEmailMutation();

    const recentUsers = usersData?.data || [];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'mentor':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'learner':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const getStatusBadgeColor = (disabled: boolean, emailVerified: boolean) => {
        if (disabled) {
            return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
        }
        if (!emailVerified) {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
        }
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
    };

    const getStatusText = (disabled: boolean, emailVerified: boolean) => {
        if (disabled) return 'Disabled';
        if (!emailVerified) return 'Pending';
        return 'Active';
    };

    const handleViewDetails = (userId: string) => {
        setSelectedUserId(userId);
        setIsUserModalOpen(true);
    };

    const handleCloseUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedUserId('');
    };

    const handleRefreshData = () => {
        refetchUsers();
    };

    const handleToggleStatus = async (userId: string, currentDisabled: boolean) => {
        try {
            await toggleUserStatus({
                id: userId,
                disabled: !currentDisabled
            }).unwrap();

            refetchUsers();

            toast({
                title: "Success",
                description: `User ${!currentDisabled ? 'disabled' : 'enabled'} successfully`
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to update user status",
                variant: "destructive"
            });
        }
    };

    const handleToggleEmailVerification = async (userId: string, currentEmailVerified: boolean) => {
        try {
            if (!currentEmailVerified) {
                // If email is not verified, verify it
                await verifyUserEmail(userId).unwrap();

                refetchUsers();

                toast({
                    title: "Success",
                    description: "User email verified successfully"
                });
            } else {
                // If email is verified, unverify it
                await unverifyUserEmail(userId).unwrap();

                refetchUsers();

                toast({
                    title: "Success",
                    description: "User email verification revoked successfully"
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to update email verification",
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-1"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-center h-48 text-slate-400">
                    <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2" />
                        <p>Failed to load recent registrations</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <Users className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Recent Registrations
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Latest user signups
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {recentUsers.map((user: User) => (
                    <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profilePicture || undefined} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {user.fullName}
                                </p>
                                <Badge
                                    className={cn("text-xs", getRoleBadgeColor(user.role))}
                                >
                                    {user.role}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {user.email}
                                </p>
                                <Badge
                                    className={cn("text-xs", getStatusBadgeColor(user.disabled || false, user.emailVerified))}
                                >
                                    {getStatusText(user.disabled || false, user.emailVerified)}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">
                                {formatDate(user.createdAt || '')}
                            </span>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => handleViewDetails(user.id)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </DropdownMenuItem>


                                    <DropdownMenuItem
                                        onClick={() => handleToggleEmailVerification(user.id, user.emailVerified)}
                                        disabled={isVerifyingEmail || isUnverifyingEmail}
                                        className={cn(
                                            "h-7 px-2 text-xs transition-colors",
                                            !user.emailVerified
                                                ? "text-emerald-600 hover:bg-emerald-50"
                                                : "text-orange-600 hover:bg-orange-50"
                                        )}
                                    >
                                        {(isVerifyingEmail || isUnverifyingEmail) ? (
                                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                            <Mail className="h-3 w-3 mr-1" />
                                        )}
                                        {!user.emailVerified ? 'Activate User' : 'Deactivate User'}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleToggleStatus(user.id, user.disabled || false)}
                                        disabled={isTogglingStatus}
                                        className={cn(
                                            "h-7 px-2 text-xs transition-colors",
                                            user.disabled
                                                ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                                                : "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                        )}
                                    >
                                        {isTogglingStatus ? (
                                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                            <Power className="h-3 w-3 mr-1" />
                                        )}
                                        {/* <UserCheck className="h-4 w-4 mr-2" /> */}
                                        {user.disabled ? 'Enable' : 'Disable'} User
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            {recentUsers.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No recent registrations</p>
                </div>
            )}

            <UserModal
                userId={selectedUserId}
                isOpen={isUserModalOpen}
                onClose={handleCloseUserModal}
                onUserUpdated={handleRefreshData}
            />
        </motion.div>
    );
};

export default RecentRegistrations;