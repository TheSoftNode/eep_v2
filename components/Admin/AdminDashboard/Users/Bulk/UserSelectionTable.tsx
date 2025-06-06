"use client";

import React from "react";
import {
    CheckCircle,
    Search,
    Eye,
    Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { User } from "@/Redux/types/Users/user";

// Simple table components matching UserTable style
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

export const UserSelectionTable: React.FC<{
    users: User[];
    selectedUsers: string[];
    onSelectionChange: (selected: string[]) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    roleFilter: string;
    onRoleFilterChange: (role: string) => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    onViewUser?: (id: string) => void;
}> = ({
    users,
    selectedUsers,
    onSelectionChange,
    searchQuery,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    statusFilter,
    onStatusFilterChange,
    onViewUser
}) => {
        const filteredUsers = React.useMemo(() => {
            return users.filter(user => {
                const matchesSearch = !searchQuery ||
                    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesRole = roleFilter === 'all' || user.role === roleFilter;
                const matchesStatus = statusFilter === 'all' ||
                    (statusFilter === 'active' && !user.disabled) ||
                    (statusFilter === 'disabled' && user.disabled);

                return matchesSearch && matchesRole && matchesStatus;
            });
        }, [users, searchQuery, roleFilter, statusFilter]);

        const handleSelectAll = (checked: boolean) => {
            if (checked) {
                const allIds = filteredUsers.map(user => user.id);
                onSelectionChange([...new Set([...selectedUsers, ...allIds])]);
            } else {
                const filteredIds = filteredUsers.map(user => user.id);
                onSelectionChange(selectedUsers.filter(id => !filteredIds.includes(id)));
            }
        };

        const handleSelectUser = (userId: string, checked: boolean) => {
            if (checked) {
                onSelectionChange([...selectedUsers, userId]);
            } else {
                onSelectionChange(selectedUsers.filter(id => id !== userId));
            }
        };

        const isAllSelected = filteredUsers.length > 0 &&
            filteredUsers.every(user => selectedUsers.includes(user.id));
        const isIndeterminate = filteredUsers.some(user => selectedUsers.includes(user.id)) && !isAllSelected;

        const getInitials = (name: string) => {
            return name.split(' ').map(n => n[0]).join('').toUpperCase();
        };

        const getRoleBadgeColor = (role: string) => {
            switch (role) {
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

        return (
            <div className="space-y-6">
                {/* Filters */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                    <SelectItem value="learner">Learner</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={isAllSelected}
                                        // @ts-ignore
                                        indeterminate={isIndeterminate ? true : undefined}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className={cn(
                                            "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                                            selectedUsers.includes(user.id) && "bg-indigo-50 dark:bg-indigo-900/20",
                                            user.disabled && "opacity-60"
                                        )}
                                    >
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectUser(user.id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.profilePicture || undefined} />
                                                    <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                        {getInitials(user.fullName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {user.fullName}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-700 dark:text-slate-300">{user.email}</span>
                                                {!user.emailVerified && (
                                                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                                                        Unverified
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs font-medium border", getRoleBadgeColor(user.role))}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs font-medium border",
                                                    user.disabled
                                                        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                                        : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                                )}
                                            >
                                                {user.disabled ? 'Disabled' : 'Active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                                onClick={() => onViewUser?.(user.id)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
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

                {/* Selection Summary */}
                {selectedUsers.length > 0 && (
                    <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    <span className="font-medium text-indigo-900 dark:text-indigo-100">
                                        {selectedUsers.length} users selected
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onSelectionChange([])}
                                    className="text-indigo-600 border-indigo-300 hover:bg-indigo-100 dark:text-indigo-400"
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };