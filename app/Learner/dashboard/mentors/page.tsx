"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import proper API hooks and types
import { useGetAllMentorsQuery, useSearchMentorsQuery } from '@/Redux/apiSlices/users/mentorApi';
import { MentorSearchParams, MentorProfile } from '@/Redux/types/Users/mentor';

// Import components (you'll need to create these or update the imports)
import MentorStatsHeader from '@/components/Admin/AdminDashboard/Mentors/AllMentors/MentorStatsHeader';
import MentorSearchFilters from '@/components/Admin/AdminDashboard/Mentors/AllMentors/MentorSearchFilters';
import MentorTable from '@/components/Admin/AdminDashboard/Mentors/AllMentors/MentorTable';
import MentorDetailModal from '@/components/Admin/AdminDashboard/Mentors/AllMentors/MentorDetailModal';
import MessageMentorModal from '@/components/Admin/AdminDashboard/Mentors/AllMentors/MessageMentorModal';
import CreateMentorModal from '@/components/Admin/AdminDashboard/Mentors/AllMentors/CreateMentorModal';
import { useAuth } from '@/hooks/useAuth';

interface AllMentorsPageProps { }

const AllMentorsPage: React.FC<AllMentorsPageProps> = () => {
    // State management with proper TypeScript types
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'available' | 'unavailable'>('all');
    const [filterExpertise, setFilterExpertise] = useState<string>('all');
    const [filterRating, setFilterRating] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(12);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const { user, isMentor, isAdmin, isLearner } = useAuth();

    // Modal states with proper typing
    const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

    // Build search parameters with proper typing
    const buildSearchParams = (): any => {
        const params: any = {
            page: currentPage.toString(),
            limit: pageSize.toString(),
        };

        if (filterExpertise !== 'all') {
            params.expertise = filterExpertise;
        }

        if (filterRating !== 'all') {
            params.rating = filterRating;
        }

        return params;
    };

    const searchParams = buildSearchParams();

    // Determine if we should use search API
    const shouldUseSearch = searchTerm.trim() !== '' || filterExpertise !== 'all' || filterRating !== 'all';

    // API calls with proper error handling
    const {
        data: mentorsData,
        isLoading: isMentorsLoading,
        error: mentorsError,
        refetch: refetchMentors
    } = useGetAllMentorsQuery(searchParams, {
        skip: shouldUseSearch
    });

    console.log(mentorsData)

    const {
        data: searchData,
        isLoading: isSearchLoading,
        error: searchError
    } = useSearchMentorsQuery(searchParams as MentorSearchParams, {
        skip: !shouldUseSearch
    });

    // Use appropriate data source
    const data = shouldUseSearch ? searchData : mentorsData;
    const mentors: MentorProfile[] = data?.data || [];
    const totalCount: number = data?.totalCount || 0;
    const loading = shouldUseSearch ? isSearchLoading : isMentorsLoading;
    const error = shouldUseSearch ? searchError : mentorsError;



    const filteredMentors = mentors.filter((mentor: MentorProfile) => {
        // Exclude current user if they are a mentor
        const isNotCurrentUser = mentor.id !== user?.id;

        const matchesSearch = !searchTerm ||
            mentor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (mentor as any).company?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && !mentor.disabled) ||
            (filterStatus === 'inactive' && mentor.disabled) ||
            (filterStatus === 'available' && mentor.isAvailable) ||
            (filterStatus === 'unavailable' && !mentor.isAvailable);

        return isNotCurrentUser && matchesSearch && matchesStatus;
    });


    // Handlers with proper typing
    const handleViewMentor = (mentor: MentorProfile): void => {
        setSelectedMentor(mentor);
        setShowDetailModal(true);
    };

    const handleMessageMentor = (mentor: MentorProfile): void => {
        setSelectedMentor(mentor);
        setShowMessageModal(true);
    };

    const handleCreateMentor = (): void => {
        setShowCreateModal(true);
    };

    const handleRefresh = (): void => {
        if (shouldUseSearch) {
            // For search, we need to refetch the search query
            // RTK Query will automatically refetch when dependencies change
        } else {
            refetchMentors();
        }
    };

    const handleCloseModals = (): void => {
        setShowDetailModal(false);
        setShowMessageModal(false);
        setSelectedMentor(null);
    };

    const handleMentorCreated = (): void => {
        setShowCreateModal(false);
        handleRefresh();
    };

    const handleMessageSent = (): void => {
        setShowMessageModal(false);
        setSelectedMentor(null);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        {/* Header skeleton */}
                        <div className="flex justify-between items-center">
                            <div className="space-y-3">
                                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
                            </div>
                            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                        </div>

                        {/* Stats skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            ))}
                        </div>

                        {/* Filters skeleton */}
                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>

                        {/* Content skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        const errorMessage = 'data' in error
            ? (error.data as any)?.message || 'An error occurred'
            : 'Network error occurred';

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                            Error Loading Mentors
                        </h3>
                        <p className="text-red-600 dark:text-red-400 mb-6">
                            {errorMessage}
                        </p>
                        <button
                            onClick={handleRefresh}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Try Again
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
            </div>

            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                All Mentors
                            </h1>
                            {isAdmin() ? (
                                <>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Manage and monitor all mentors in your platform
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Explore the available mentors
                                    </p>
                                </>
                            )}

                        </div>
                    </motion.div>

                    {/* Stats Header */}
                    <MentorStatsHeader
                        mentorsData={data}
                        onRefresh={handleRefresh}
                        onCreate={handleCreateMentor}
                        userRole={user?.role}
                    />

                    {/* Search and Filters */}
                    <MentorSearchFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        filterExpertise={filterExpertise}
                        setFilterExpertise={setFilterExpertise}
                        filterRating={filterRating}
                        setFilterRating={setFilterRating}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        totalCount={filteredMentors.length}
                    />

                    {/* Mentors Table/Grid */}
                    <MentorTable
                        mentors={filteredMentors}
                        viewMode={viewMode}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalCount={totalCount}
                        onViewMentor={handleViewMentor}
                        onMessageMentor={handleMessageMentor}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Modals */}
            {showDetailModal && selectedMentor && (
                <MentorDetailModal
                    mentor={selectedMentor}
                    onClose={handleCloseModals}
                    onMessage={() => {
                        setShowDetailModal(false);
                        setShowMessageModal(true);
                    }}
                />
            )}

            {showMessageModal && selectedMentor && (
                <MessageMentorModal
                    mentor={selectedMentor}
                    onClose={handleCloseModals}
                    onMessageSent={handleMessageSent}
                />
            )}

            {showCreateModal && (
                <CreateMentorModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleMentorCreated}
                />
            )}
        </div>
    );
};

export default AllMentorsPage;