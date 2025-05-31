"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserCheck,
    UserX,
    Trash2,
    Download,
    CheckCircle,
    AlertTriangle,
    FileText,
    Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useBulkDeleteUsersMutation, useBulkToggleUserStatusMutation, useExportUsersQuery, useGetAllUsersQuery } from "@/Redux/apiSlices/users/adminApi";
import { UserSelectionTable } from "@/components/Admin/AdminDashboard/Users/Bulk/UserSelectionTable";
import { ExportOptions } from "@/components/Admin/AdminDashboard/Users/Bulk/ExportOptions";
import { BulkActionConfirmDialog } from "@/components/Admin/AdminDashboard/Users/Bulk/BulkActionConfirmDialog";
import { BulkActionResult } from "@/components/Admin/AdminDashboard/Users/Bulk/BulkActionResult";




const BulkOperationsPage: React.FC = () => {
    const { toast } = useToast();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        action: string;
    }>({ isOpen: false, action: '' });
    const [resultDialog, setResultDialog] = useState<{
        isOpen: boolean;
        results: any;
        action: string;
    }>({ isOpen: false, results: null, action: '' });

    // API hooks
    const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery({
        page: '1',
        limit: '100' // Get more users for bulk operations
    });

    const [bulkToggleStatus, { isLoading: isTogglingStatus }] = useBulkToggleUserStatusMutation();
    const [bulkDeleteUsers, { isLoading: isDeletingUsers }] = useBulkDeleteUsersMutation();
    const { refetch: exportUsers, isFetching: isExporting } = useExportUsersQuery(
        { format: 'csv', fields: ['id', 'fullName', 'email'] },
        { skip: true }
    );

    const users = usersData?.data || [];

    // Statistics
    const stats = React.useMemo(() => {
        const total = users.length;
        const selected = selectedUsers.length;
        const active = users.filter(u => !u.disabled).length;
        const disabled = users.filter(u => u.disabled).length;

        return { total, selected, active, disabled };
    }, [users, selectedUsers]);

    // Handlers
    const handleBulkAction = async (action: 'enable' | 'disable' | 'delete') => {
        if (selectedUsers.length === 0) {
            toast({
                title: "No Users Selected",
                description: "Please select users to perform bulk actions.",
                variant: "destructive"
            });
            return;
        }

        setConfirmDialog({ isOpen: true, action });
    };

    const confirmBulkAction = async () => {
        const { action } = confirmDialog;

        try {
            let results;

            switch (action) {
                case 'enable':
                    results = await bulkToggleStatus({
                        userIds: selectedUsers,
                        disabled: false
                    }).unwrap();
                    break;
                case 'disable':
                    results = await bulkToggleStatus({
                        userIds: selectedUsers,
                        disabled: true
                    }).unwrap();
                    break;
                case 'delete':
                    results = await bulkDeleteUsers({
                        userIds: selectedUsers
                    }).unwrap();
                    break;
                default:
                    throw new Error('Invalid action');
            }

            setResultDialog({
                isOpen: true,
                results: results.data,
                action: action
            });

            setSelectedUsers([]);
            refetch();

            toast({
                title: "Bulk Operation Completed",
                description: `Successfully processed ${results.data.success.length} users.`,
            });

        } catch (error: any) {
            toast({
                title: "Bulk Operation Failed",
                description: error?.data?.message || "An error occurred during the bulk operation.",
                variant: "destructive"
            });
        } finally {
            setConfirmDialog({ isOpen: false, action: '' });
        }
    };

    const handleExport = async (format: 'json' | 'csv', fields: string[]) => {
        try {
            const result = await exportUsers().unwrap();

            // Create and download file
            const blob = new Blob([typeof result === 'string' ? result : JSON.stringify(result, null, 2)], {
                type: format === 'csv' ? 'text/csv' : 'application/json'
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-export-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Export Successful",
                description: `Users data exported as ${format.toUpperCase()} file.`,
            });
        } catch (error: any) {
            toast({
                title: "Export Failed",
                description: error?.data?.message || "Failed to export users data.",
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen ">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen ">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <p className="text-red-600 dark:text-red-400 mb-4">Failed to load users</p>
                            <Button onClick={() => refetch()} variant="outline">
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Bulk Operations
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Perform bulk actions on multiple users simultaneously
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Total Users
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {stats.total}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Selected
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {stats.selected}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Active Users
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {stats.active}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Disabled Users
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {stats.disabled}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm">
                                    <UserX className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="bulk-actions" className="space-y-6">
                    <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
                        <TabsTrigger
                            value="bulk-actions"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300"
                        >
                            <Users className="h-4 w-4 mr-2" />
                            Bulk Actions
                        </TabsTrigger>
                        <TabsTrigger
                            value="export"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bulk-actions" className="space-y-6">
                        {/* Bulk Action Buttons */}
                        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle>Bulk Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={() => handleBulkAction('enable')}
                                        disabled={selectedUsers.length === 0 || isTogglingStatus}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <UserCheck className="h-4 w-4 mr-2" />
                                        Enable Users ({selectedUsers.length})
                                    </Button>
                                    <Button
                                        onClick={() => handleBulkAction('disable')}
                                        disabled={selectedUsers.length === 0 || isTogglingStatus}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                    >
                                        <UserX className="h-4 w-4 mr-2" />
                                        Disable Users ({selectedUsers.length})
                                    </Button>
                                    <Button
                                        onClick={() => handleBulkAction('delete')}
                                        disabled={selectedUsers.length === 0 || isDeletingUsers}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Users ({selectedUsers.length})
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Selection Table */}
                        <UserSelectionTable
                            users={users}
                            selectedUsers={selectedUsers}
                            onSelectionChange={setSelectedUsers}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            roleFilter={roleFilter}
                            onRoleFilterChange={setRoleFilter}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                        />
                    </TabsContent>

                    <TabsContent value="export" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <ExportOptions
                                    onExport={handleExport}
                                    isExporting={isExporting}
                                />
                            </div>
                            <div className="lg:col-span-2">
                                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                    <CardHeader>
                                        <CardTitle>Export Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-blue-900 dark:text-blue-100">CSV Export</h4>
                                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                                    Exports data in comma-separated format, ideal for spreadsheet applications like Excel.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-green-900 dark:text-green-100">JSON Export</h4>
                                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                                    Exports data in JSON format, perfect for developers and system integrations.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                            <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Privacy Notice</h4>
                                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                                    Only selected fields will be exported. Sensitive information like passwords are never included.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Confirmation Dialog */}
            <BulkActionConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, action: '' })}
                onConfirm={confirmBulkAction}
                action={confirmDialog.action}
                selectedCount={selectedUsers.length}
                isLoading={isTogglingStatus || isDeletingUsers}
            />

            {/* Results Dialog */}
            <BulkActionResult
                isOpen={resultDialog.isOpen}
                onClose={() => setResultDialog({ isOpen: false, results: null, action: '' })}
                results={resultDialog.results}
                action={resultDialog.action}
            />
        </div>
    );
};

export default BulkOperationsPage;