"use client"

import React, { useState, useEffect } from 'react';
import ErrorAlert from '@/components/common/ErrorAlert';
import LoaderSimple from '@/components/common/LoaderSimple';
import { useGetAllUsersQuery, useGetUserStatsQuery } from '@/Redux/apiSlices/users/adminApi';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UserStatsCards from '@/components/Admin/AdminDashboard/Users/Main/UserStatsCards';
import UserFilters from '@/components/Admin/AdminDashboard/Users/Main/UserFilters';
import UserTable from '@/components/Admin/AdminDashboard/Users/Main/UserTable';
import Pagination from '@/components/Admin/AdminDashboard/Users/Main/Pagination';
import UserModal from '@/components/Admin/AdminDashboard/Users/Main/UserDetailModal';
import { CreateUserModal } from '@/components/Admin/AdminDashboard/Users/Main/CreateUserModal';

const AdminUsersPage: React.FC = () => {
    // State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState<'email' | 'fullName' | 'role'>('email');
    const [activeTab, setActiveTab] = useState('all');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    // Update query parameters based on filter selections
    useEffect(() => {
        if (activeTab === 'active') {
            setFilterStatus('active');
        } else if (activeTab === 'disabled') {
            setFilterStatus('disabled');
        } else {
            setFilterStatus(null);
        }
        setPage(1);
    }, [activeTab]);

    // Fetch users with pagination and filters
    const {
        data: usersData,
        isLoading: isLoadingUsers,
        isError: isErrorUsers,
        error: usersError,
        refetch: refetchUsers,
        isFetching: isFetchingUsers
    } = useGetAllUsersQuery({
        page: page.toString(),
        limit: limit.toString(),
        orderBy,
        order,
        searchQuery: searchQuery.trim(),
        searchField: searchQuery.trim() ? searchField : undefined,
        status: filterStatus as 'active' | 'disabled' | undefined
    });

    // Fetch user statistics
    const {
        data: statsData,
        isLoading: isLoadingStats,
        isError: isErrorStats,
        refetch: refetchStats,
        isFetching: isFetchingStats
    } = useGetUserStatsQuery();

    // Event handlers
    const handleViewUser = (id: string) => {
        setSelectedUserId(id);
    };

    const handleCloseModal = () => {
        setSelectedUserId(null);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleOrderChange = (newOrderBy: string, newOrder: 'asc' | 'desc') => {
        setOrderBy(newOrderBy);
        setOrder(newOrder);
        setPage(1);
    };

    const handleSearch = (query: string, field: 'email' | 'fullName' | 'role') => {
        setSearchQuery(query);
        setSearchField(field);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setPage(1);
    };

    const handleRefreshData = () => {
        refetchUsers();
        refetchStats();
    };

    // Loading and error states
    if (isLoadingUsers && isLoadingStats) {
        return <LoaderSimple />;
    }

    if (isErrorUsers) {
        return (
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <ErrorAlert
                        message="Failed to load users"
                        details="Unable to fetch user data from the server"
                    />
                </div>
            </div>
        );
    }

    if (isErrorStats) {
        return (
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <ErrorAlert
                        message="Failed to load user statistics"
                        details="Unable to fetch statistics from the server"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Simple Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600 text-white">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            User Management
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Manage and monitor platform users
                        </p>
                    </div>
                </div>

                {/* Refresh Button */}
                <Button
                    onClick={handleRefreshData}
                    disabled={isFetchingUsers || isFetchingStats}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {(isFetchingUsers || isFetchingStats) ? (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Data
                        </>
                    )}
                </Button>
            </div>

            {/* Stats Cards */}
            {statsData?.data && (
                <UserStatsCards stats={statsData.data} />
            )}

            {/* Filters */}
            <UserFilters
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
                onCreateUser={handleOpenCreateModal}
                searchQuery={searchQuery}
                searchField={searchField}
            />

            {/* Simple Tab Filters */}
            <div className="mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1">
                        <TabsTrigger
                            value="all"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                                activeTab === 'all'
                                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <Users className="h-4 w-4" />
                            All Users
                            {usersData?.totalCount !== undefined && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                                    {usersData.totalCount}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="active"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                                activeTab === 'active'
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <UserCheck className="h-4 w-4" />
                            Active
                            {statsData?.data?.activeUsers !== undefined && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                                    {statsData.data.activeUsers}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="disabled"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                                activeTab === 'disabled'
                                    ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <UserX className="h-4 w-4" />
                            Disabled
                            {statsData?.data?.disabledUsers !== undefined && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                                    {statsData.data.disabledUsers}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Users Table */}
            {usersData?.data && (
                <UserTable
                    users={usersData.data}
                    onViewUser={handleViewUser}
                    onOrderChange={handleOrderChange}
                    currentOrderBy={orderBy}
                    currentOrder={order}
                />
            )}

            {/* Pagination */}
            {usersData?.pagination && (
                <Pagination
                    currentPage={usersData.pagination.page}
                    totalPages={usersData.pagination.totalPages}
                    onPageChange={handlePageChange}
                    limit={limit}
                    onLimitChange={handleLimitChange}
                    totalItems={usersData.totalCount || 0}
                />
            )}

            {/* User Detail Modal */}
            {selectedUserId && (
                <UserModal
                    userId={selectedUserId}
                    isOpen={Boolean(selectedUserId)}
                    onClose={handleCloseModal}
                    onUserUpdated={handleRefreshData}
                />
            )}

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onUserCreated={handleRefreshData}
            />
        </div>
    );
};

export default AdminUsersPage;