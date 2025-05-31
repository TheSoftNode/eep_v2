"use client"

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Eye,
    Building2,
    Globe,
    Github,
    Mail,
    CheckCircle,
    XCircle,
    AlertCircle,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/Redux/types/Users/user';

// Format date utility function
const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Simple table components
const Table = ({ children, ...props }: any) => (
    <table className="w-full" {...props}>{children}</table>
);

const TableHeader = ({ children, ...props }: any) => (
    <thead {...props}>{children}</thead>
);

const TableBody = ({ children, ...props }: any) => (
    <tbody {...props}>{children}</tbody>
);

const TableRow = ({ children, className, ...props }: any) => (
    <tr className={cn("border-b border-slate-200 dark:border-slate-700", className)} {...props}>
        {children}
    </tr>
);

const TableHead = ({ children, className, ...props }: any) => (
    <th className={cn("px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300", className)} {...props}>
        {children}
    </th>
);

const TableCell = ({ children, className, ...props }: any) => (
    <td className={cn("px-6 py-4", className)} {...props}>
        {children}
    </td>
);

interface UserTableProps {
    users: User[];
    onViewUser: (id: string) => void;
    onOrderChange: (orderBy: string, order: 'asc' | 'desc') => void;
    currentOrderBy: string;
    currentOrder: 'asc' | 'desc';
}

const UserTable: React.FC<UserTableProps> = ({
    users,
    onViewUser,
    onOrderChange,
    currentOrderBy,
    currentOrder
}) => {
    const handleSort = (field: string) => {
        if (currentOrderBy === field) {
            onOrderChange(field, currentOrder === 'asc' ? 'desc' : 'asc');
        } else {
            onOrderChange(field, 'asc');
        }
    };

    // Role badge styling
    const getRoleBadgeStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            case 'mentor':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            case 'learner':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        }
    };

    // Status badge styling
    const getStatusBadgeStyle = (disabled: boolean, emailVerified: boolean) => {
        if (disabled) {
            return {
                style: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
                text: 'Disabled',
                icon: XCircle
            };
        }
        if (!emailVerified) {
            return {
                style: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
                text: 'Pending',
                icon: AlertCircle
            };
        }
        return {
            style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
            text: 'Active',
            icon: CheckCircle
        };
    };

    // User initials for avatar
    const getUserInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Avatar styling based on role
    const getAvatarStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
            case 'mentor':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
            case 'learner':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    // Sort icon
    const SortIcon = ({ field }: { field: string }) => {
        if (currentOrderBy !== field) {
            return <ArrowUpDown className="ml-2 h-4 w-4 text-slate-400" />;
        }
        return currentOrder === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-indigo-600" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-indigo-600" />
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                        <TableHead
                            className="w-[300px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                            onClick={() => handleSort('fullName')}
                        >
                            <div className="flex items-center">
                                User Details
                                <SortIcon field="fullName" />
                            </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                            onClick={() => handleSort('role')}
                        >
                            <div className="flex items-center">
                                Role & Status
                                <SortIcon field="role" />
                            </div>
                        </TableHead>
                        <TableHead>Professional Info</TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                            onClick={() => handleSort('createdAt')}
                        >
                            <div className="flex items-center">
                                Joined
                                <SortIcon field="createdAt" />
                            </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => {
                            const statusInfo = getStatusBadgeStyle(user.disabled || false, user.emailVerified);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <TableRow
                                    key={user.id}
                                    className={cn(
                                        "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                                        user.disabled && "opacity-60"
                                    )}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.profilePicture || undefined} />
                                                <AvatarFallback className={getAvatarStyle(user.role)}>
                                                    {getUserInitials(user.fullName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-slate-900 dark:text-white truncate">
                                                    {user.fullName}
                                                </p>
                                                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{user.email}</span>
                                                    {!user.emailVerified && (
                                                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <Badge className={cn("text-xs font-medium border", getRoleBadgeStyle(user.role))}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                            <div>
                                                <Badge className={cn("text-xs font-medium border", statusInfo.style)}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusInfo.text}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {user.company && (
                                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <Building2 className="h-3 w-3" />
                                                    <span className="truncate">{user.company}</span>
                                                </div>
                                            )}
                                            {user.website && (
                                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <Globe className="h-3 w-3" />
                                                    <span className="truncate">{user.website}</span>
                                                </div>
                                            )}
                                            {user.github && (
                                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <Github className="h-3 w-3" />
                                                    <span className="truncate">@{user.github}</span>
                                                </div>
                                            )}
                                            {!user.company && !user.website && !user.github && (
                                                <span className="text-xs text-slate-400">No info provided</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400">
                                        <div className="text-sm">
                                            {formatDate(user.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewUser(user.id)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">No users found</p>
                                        <p className="text-sm text-slate-400 mt-1">Try adjusting your search criteria</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default UserTable;



