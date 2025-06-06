"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Calendar, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SessionData } from '@/Redux/types/Users/mentor';
import { OpenSessionData } from '@/Redux/types/Sessions/session';
import { useAuth } from '@/hooks/useAuth';

// Import API hooks
import {
    useGetMyUpcomingSessionsQuery,
    useAcceptSessionRequestMutation,
    useRejectSessionRequestMutation,
    useCancelSessionRequestMutation,
    useCompleteSessionMutation,
    useSubmitSessionReviewMutation,
} from '@/Redux/apiSlices/users/mentorApi';


import SessionStatsHeader from '@/components/Dashboard/Session/SessionStatsHeader';
import SessionFilters from '@/components/Dashboard/Session/SessionFilters';
import SessionCard from '@/components/Dashboard/Session/SessionCard';
import SessionRequestModal from '@/components/Dashboard/Session/SessionRequestModal';
import SessionDetailModal from '@/components/Dashboard/Session/SessionDetailModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGetAllOpenSessionsQuery, useGetMyCreatedSessionsQuery, useJoinOpenSessionMutation, useLeaveOpenSessionMutation } from '@/Redux/apiSlices/Sessions/sessionApi';
import OpenSessionCard from '@/components/Dashboard/Session/OpenSessionCard';
import SessionReviewModal from '@/components/Dashboard/Session/SessionReviewModal';

const SessionsPage: React.FC = () => {
    const { user, isAdmin, isMentor } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');
    const [filterTimeframe, setFilterTimeframe] = useState<'all' | 'upcoming' | 'past' | 'this_week' | 'this_month'>('all');
    const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
    const [selectedOpenSession, setSelectedOpenSession] = useState<OpenSessionData | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewingSessionId, setReviewingSessionId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'my-sessions' | 'open-sessions' | 'created-sessions'>('my-sessions');

    // Open sessions filters
    const [openSessionFilters, setOpenSessionFilters] = useState({
        sessionType: 'all' as 'all' | 'individual' | 'group',
        isPublic: true,
    });

    const canManage = isMentor() || isAdmin();

    // API hooks for regular sessions
    const { data: sessionsData, isLoading, error, refetch } = useGetMyUpcomingSessionsQuery();
    const [acceptSession] = useAcceptSessionRequestMutation();
    const [rejectSession] = useRejectSessionRequestMutation();
    const [cancelSession] = useCancelSessionRequestMutation();
    const [completeSession] = useCompleteSessionMutation();
    const [submitReview] = useSubmitSessionReviewMutation();

    // API hooks for open sessions
    const { data: openSessionsData, isLoading: isLoadingOpenSessions, refetch: refetchOpenSessions } = useGetAllOpenSessionsQuery({
        sessionType: openSessionFilters.sessionType === 'all' ? undefined : openSessionFilters.sessionType,
        isPublic: openSessionFilters.isPublic,
    });

    const { data: myCreatedSessionsData, isLoading: isLoadingCreatedSessions, refetch: refetchCreatedSessions } = useGetMyCreatedSessionsQuery({});

    const [joinOpenSession] = useJoinOpenSessionMutation();
    const [leaveOpenSession] = useLeaveOpenSessionMutation();

    const sessions = sessionsData?.data || [];
    const openSessions = openSessionsData?.data || [];
    const createdSessions = myCreatedSessionsData?.data || [];

    // Filter sessions based on search and filters
    const filteredSessions = sessions.filter((session: SessionData) => {
        // Search filter
        const matchesSearch = !searchTerm ||
            session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.description?.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus = filterStatus === 'all' || session.status === filterStatus;

        // Timeframe filter
        const sessionDate = new Date(session.date);
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        let matchesTimeframe = true;
        switch (filterTimeframe) {
            case 'upcoming':
                matchesTimeframe = sessionDate > now;
                break;
            case 'past':
                matchesTimeframe = sessionDate < now;
                break;
            case 'this_week':
                matchesTimeframe = sessionDate >= now && sessionDate <= weekFromNow;
                break;
            case 'this_month':
                matchesTimeframe = sessionDate >= now && sessionDate <= monthFromNow;
                break;
            default:
                matchesTimeframe = true;
        }

        return matchesSearch && matchesStatus && matchesTimeframe;
    });

    // Filter open sessions
    const filteredOpenSessions = openSessions.filter((session: OpenSessionData) => {
        const matchesSearch = !searchTerm ||
            session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Action handlers for regular sessions
    const handleAcceptSession = async (sessionId: string) => {
        try {
            await acceptSession(sessionId).unwrap();
            refetch();
        } catch (error) {
            console.error('Failed to accept session:', error);
        }
    };

    const handleRejectSession = async (sessionId: string) => {
        try {
            const reason = prompt('Please provide a reason for rejection (optional):');
            await rejectSession({ id: sessionId, reason: reason || undefined }).unwrap();
            refetch();
        } catch (error) {
            console.error('Failed to reject session:', error);
        }
    };

    const handleCancelSession = async (sessionId: string) => {
        try {
            const reason = prompt('Please provide a reason for cancellation (optional):');
            await cancelSession({ id: sessionId, reason: reason || undefined }).unwrap();
            refetch();
        } catch (error) {
            console.error('Failed to cancel session:', error);
        }
    };

    const handleCompleteSession = async (sessionId: string) => {
        try {
            const notes = prompt('Add any notes about the session (optional):');
            await completeSession({ id: sessionId, notes: notes || undefined }).unwrap();
            refetch();
        } catch (error) {
            console.error('Failed to complete session:', error);
        }
    };

    const handleReviewSession = (sessionId: string) => {
        setReviewingSessionId(sessionId);
        setShowReviewModal(true);
    };

    const handleSubmitReview = async (reviewData: { rating: number; comment: string; strengths?: string[]; improvements?: string[] }) => {
        if (!reviewingSessionId) return;

        try {
            await submitReview({
                id: reviewingSessionId,
                ...reviewData
            }).unwrap();
            refetch();
            setShowReviewModal(false);
            setReviewingSessionId(null);
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    // Action handlers for open sessions
    const handleJoinOpenSession = async (sessionId: string) => {
        try {
            await joinOpenSession(sessionId).unwrap();
            refetchOpenSessions();
        } catch (error) {
            console.error('Failed to join session:', error);
        }
    };

    const handleLeaveOpenSession = async (sessionId: string) => {
        try {
            await leaveOpenSession(sessionId).unwrap();
            refetchOpenSessions();
        } catch (error) {
            console.error('Failed to leave session:', error);
        }
    };

    const handleViewSession = (session: SessionData) => {
        setSelectedSession(session);
        setShowDetailModal(true);
    };

    const handleViewOpenSession = (session: OpenSessionData) => {
        setSelectedOpenSession(session);
        setShowDetailModal(true);
    };

    const handleRescheduleSession = (sessionId: string) => {
        // Navigate to reschedule page or open reschedule modal
        console.log('Reschedule session:', sessionId);
    };

    const handleCreateSession = () => {
        setShowRequestModal(true);
    };

    const handleCreateOpenSession = () => {
        router.push('/admin/dashboard/create');
    };

    const handleSessionRequestSuccess = () => {
        refetch();
    };

    const handleRefresh = () => {
        refetch();
        refetchOpenSessions();
        refetchCreatedSessions();
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedSession(null);
        setSelectedOpenSession(null);
    };

    const isLoadingAny = isLoading || isLoadingOpenSessions || isLoadingCreatedSessions;

    if (isLoadingAny && sessions.length === 0 && openSessions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                            <Clock className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                            Error Loading Sessions
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
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    Sessions Hub
                                </h1>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">
                                Manage your sessions, discover open sessions, and connect with the community
                            </p>
                        </div>

                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            {(user?.role === 'learner' || user?.role === 'user') && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    onClick={handleCreateSession}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                                >
                                    <Clock className="h-5 w-5" />
                                    <span>Request Session</span>
                                </motion.button>
                            )}

                            {isMentor() && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    onClick={handleCreateOpenSession}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Create Open Session</span>
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Stats Header */}
                    <SessionStatsHeader
                        sessions={sessions}
                        isLoading={isLoading}
                        onRefresh={handleRefresh}
                        onCreateSession={user?.role === 'learner' ? handleCreateSession : undefined}
                        userRole={user?.role}
                    />

                    {/* Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                            <TabsList className="grid w-full grid-cols-3 lg:w-fit">
                                <TabsTrigger value="my-sessions" className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4" />
                                    <span>My Sessions</span>
                                </TabsTrigger>
                                <TabsTrigger value="open-sessions" className="flex items-center space-x-2">
                                    <Users className="h-4 w-4" />
                                    <span>Open Sessions</span>
                                </TabsTrigger>
                                {isMentor() && (
                                    <TabsTrigger value="created-sessions" className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Created Sessions</span>
                                    </TabsTrigger>
                                )}
                            </TabsList>

                            {/* Filters */}
                            <div className="mt-6">
                                <SessionFilters
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    filterStatus={filterStatus}
                                    setFilterStatus={setFilterStatus}
                                    filterTimeframe={filterTimeframe}
                                    setFilterTimeframe={setFilterTimeframe}
                                    onRefresh={handleRefresh}
                                    totalCount={
                                        activeTab === 'my-sessions' ? filteredSessions.length :
                                            activeTab === 'open-sessions' ? filteredOpenSessions.length :
                                                createdSessions.length
                                    }
                                    activeTab={activeTab}
                                    openSessionFilters={openSessionFilters}
                                    setOpenSessionFilters={setOpenSessionFilters}
                                />
                            </div>

                            <TabsContent value="my-sessions" className="mt-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {filteredSessions.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filteredSessions.map((session) => (
                                                <SessionCard
                                                    key={session.id}
                                                    session={session}
                                                    userRole={user?.role || 'learner'}
                                                    currentUserId={user?.id || ''}
                                                    onView={handleViewSession}
                                                    onAccept={handleAcceptSession}
                                                    onReject={handleRejectSession}
                                                    onCancel={handleCancelSession}
                                                    onComplete={handleCompleteSession}
                                                    onReview={handleReviewSession}
                                                    onReschedule={handleRescheduleSession}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-6">
                                                <Clock className="h-12 w-12 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                No sessions found
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                                {user?.role === 'mentor'
                                                    ? "You don't have any sessions yet. Learners will be able to request sessions with you."
                                                    : "You don't have any sessions yet. Start by requesting a session with a mentor."
                                                }
                                            </p>
                                            {user?.role === 'learner' && (
                                                <button
                                                    onClick={handleCreateSession}
                                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                                >
                                                    Request Your First Session
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="open-sessions" className="mt-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {filteredOpenSessions.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filteredOpenSessions.map((session) => (
                                                <OpenSessionCard
                                                    key={session.id}
                                                    session={session}
                                                    currentUserId={user?.id || ''}
                                                    onView={handleViewOpenSession}
                                                    onJoin={handleJoinOpenSession}
                                                    onLeave={handleLeaveOpenSession}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-6">
                                                <Users className="h-12 w-12 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                No open sessions available
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                                There are no open sessions at the moment. Check back later or create your own!
                                            </p>
                                            {isMentor() && (
                                                <button
                                                    onClick={handleCreateOpenSession}
                                                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                                >
                                                    Create Open Session
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </TabsContent>

                            {isMentor() && (
                                <TabsContent value="created-sessions" className="mt-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {createdSessions.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {createdSessions.map((session) => (
                                                    <OpenSessionCard
                                                        key={session.id}
                                                        session={session}
                                                        currentUserId={user?.id || ''}
                                                        onView={handleViewOpenSession}
                                                        onJoin={handleJoinOpenSession}
                                                        onLeave={handleLeaveOpenSession}
                                                        isCreator={true}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-6">
                                                    <Calendar className="h-12 w-12 text-slate-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                    No created sessions
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                                    You haven't created any open sessions yet. Create one to start sharing knowledge!
                                                </p>
                                                <button
                                                    onClick={handleCreateOpenSession}
                                                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                                >
                                                    Create Your First Open Session
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </motion.div>
                </div>
            </div>

            {/* Session Request Modal */}
            {showRequestModal && (
                <SessionRequestModal
                    isOpen={showRequestModal}
                    onClose={() => setShowRequestModal(false)}
                    onSuccess={handleSessionRequestSuccess}
                />
            )}

            {/* Session Detail Modal */}
            {selectedSession && (
                <SessionDetailModal
                    session={selectedSession}
                    isOpen={showDetailModal}
                    onClose={handleCloseModal}
                    userRole={user?.role || 'learner'}
                    currentUserId={user?.id || ''}
                    onAccept={handleAcceptSession}
                    onReject={handleRejectSession}
                    onCancel={handleCancelSession}
                    onComplete={handleCompleteSession}
                    onReview={handleReviewSession}
                    onReschedule={handleRescheduleSession}
                />
            )}

            {/* Session Review Modal */}
            {showReviewModal && reviewingSessionId && (
                <SessionReviewModal
                    isOpen={showReviewModal}
                    onClose={() => {
                        setShowReviewModal(false);
                        setReviewingSessionId(null);
                    }}
                    onSubmit={handleSubmitReview}
                    sessionId={reviewingSessionId}
                />
            )}
        </div>
    );
};

export default SessionsPage;




// "use client";

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Clock } from 'lucide-react';
// import { SessionData } from '@/Redux/types/Users/mentor';
// import { useAuth } from '@/hooks/useAuth';

// // Import API hooks
// import {
//     useGetMyUpcomingSessionsQuery,
//     useAcceptSessionRequestMutation,
//     useRejectSessionRequestMutation,
//     useCancelSessionRequestMutation,
//     useCompleteSessionMutation,
// } from '@/Redux/apiSlices/users/mentorApi';
// import SessionStatsHeader from '@/components/Dashboard/Session/SessionStatsHeader';
// import SessionFilters from '@/components/Dashboard/Session/SessionFilters';
// import SessionCard from '@/components/Dashboard/Session/SessionCard';
// import SessionRequestModal from '@/components/Dashboard/Session/SessionRequestModal';
// import SessionDetailModal from '@/components/Dashboard/Session/SessionDetailModal';



// const SessionsPage: React.FC = () => {
//     const { user } = useAuth();
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');
//     const [filterTimeframe, setFilterTimeframe] = useState<'all' | 'upcoming' | 'past' | 'this_week' | 'this_month'>('all');
//     const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
//     const [showDetailModal, setShowDetailModal] = useState(false);
//     const [showRequestModal, setShowRequestModal] = useState(false); // Add this

//     // API hooks
//     const { data: sessionsData, isLoading, error, refetch } = useGetMyUpcomingSessionsQuery();
//     const [acceptSession] = useAcceptSessionRequestMutation();
//     const [rejectSession] = useRejectSessionRequestMutation();
//     const [cancelSession] = useCancelSessionRequestMutation();
//     const [completeSession] = useCompleteSessionMutation();

//     const sessions = sessionsData?.data || [];

//     // Filter sessions based on search and filters
//     const filteredSessions = sessions.filter((session: SessionData) => {
//         // Search filter
//         const matchesSearch = !searchTerm ||
//             session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             session.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             session.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             session.description?.toLowerCase().includes(searchTerm.toLowerCase());

//         // Status filter
//         const matchesStatus = filterStatus === 'all' || session.status === filterStatus;

//         // Timeframe filter
//         const sessionDate = new Date(session.date);
//         const now = new Date();
//         const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
//         const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

//         let matchesTimeframe = true;
//         switch (filterTimeframe) {
//             case 'upcoming':
//                 matchesTimeframe = sessionDate > now;
//                 break;
//             case 'past':
//                 matchesTimeframe = sessionDate < now;
//                 break;
//             case 'this_week':
//                 matchesTimeframe = sessionDate >= now && sessionDate <= weekFromNow;
//                 break;
//             case 'this_month':
//                 matchesTimeframe = sessionDate >= now && sessionDate <= monthFromNow;
//                 break;
//             default:
//                 matchesTimeframe = true;
//         }

//         return matchesSearch && matchesStatus && matchesTimeframe;
//     });

//     // Action handlers
//     const handleAcceptSession = async (sessionId: string) => {
//         try {
//             await acceptSession(sessionId).unwrap();
//             refetch();
//         } catch (error) {
//             console.error('Failed to accept session:', error);
//         }
//     };

//     const handleRejectSession = async (sessionId: string) => {
//         try {
//             const reason = prompt('Please provide a reason for rejection (optional):');
//             await rejectSession({ id: sessionId, reason: reason || undefined }).unwrap();
//             refetch();
//         } catch (error) {
//             console.error('Failed to reject session:', error);
//         }
//     };

//     const handleCancelSession = async (sessionId: string) => {
//         try {
//             const reason = prompt('Please provide a reason for cancellation (optional):');
//             await cancelSession({ id: sessionId, reason: reason || undefined }).unwrap();
//             refetch();
//         } catch (error) {
//             console.error('Failed to cancel session:', error);
//         }
//     };

//     const handleCompleteSession = async (sessionId: string) => {
//         try {
//             const notes = prompt('Add any notes about the session (optional):');
//             await completeSession({ id: sessionId, notes: notes || undefined }).unwrap();
//             refetch();
//         } catch (error) {
//             console.error('Failed to complete session:', error);
//         }
//     };

//     const handleViewSession = (session: SessionData) => {
//         setSelectedSession(session);
//         setShowDetailModal(true);
//     };

//     const handleReviewSession = (sessionId: string) => {
//         // Navigate to review page or open review modal
//         // This would be implemented based on your review system
//         console.log('Review session:', sessionId);
//     };

//     const handleRescheduleSession = (sessionId: string) => {
//         // Navigate to reschedule page or open reschedule modal
//         // This would be implemented based on your reschedule system
//         console.log('Reschedule session:', sessionId);
//     };

//     const handleCreateSession = () => {
//         setShowRequestModal(true);
//     };

//     const handleSessionRequestSuccess = () => {
//         refetch(); // Refresh sessions after successful request
//     };

//     const handleRefresh = () => {
//         refetch();
//     };

//     const handleCloseModal = () => {
//         setShowDetailModal(false);
//         setSelectedSession(null);
//     };

//     if (isLoading && sessions.length === 0) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="animate-pulse space-y-6">
//                         <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             {Array.from({ length: 6 }).map((_, i) => (
//                                 <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         const errorMessage = 'data' in error
//             ? (error.data as any)?.message || 'An error occurred'
//             : 'Network error occurred';

//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
//                 <div className="max-w-7xl mx-auto">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center"
//                     >
//                         <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Clock className="w-8 h-8 text-red-600 dark:text-red-400" />
//                         </div>
//                         <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
//                             Error Loading Sessions
//                         </h3>
//                         <p className="text-red-600 dark:text-red-400 mb-6">
//                             {errorMessage}
//                         </p>
//                         <button
//                             onClick={handleRefresh}
//                             className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
//                         >
//                             Try Again
//                         </button>
//                     </motion.div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//             {/* Background Elements */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
//                 <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
//             </div>

//             <div className="relative z-10 p-6">
//                 <div className="max-w-7xl mx-auto space-y-6">
//                     {/* Header */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
//                     >
//                         <div>
//                             <div className="flex items-center space-x-3 mb-2">
//                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
//                                     <Clock className="h-6 w-6 text-white" />
//                                 </div>
//                                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
//                                     My Sessions
//                                 </h1>
//                             </div>
//                             <p className="text-slate-600 dark:text-slate-400">
//                                 {user?.role === 'mentor'
//                                     ? 'Manage your mentoring sessions and learner requests'
//                                     : 'View and manage your learning sessions with mentors'
//                                 }
//                             </p>
//                         </div>
//                         {(user?.role === 'learner' || user?.role === 'user') && (
//                             <motion.button
//                                 initial={{ opacity: 0, x: 20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.1 }}
//                                 onClick={handleCreateSession}
//                                 className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
//                             >
//                                 <Clock className="h-5 w-5" />
//                                 <span>Request Session</span>
//                             </motion.button>
//                         )}
//                     </motion.div>

//                     {/* Stats Header */}
//                     <SessionStatsHeader
//                         sessions={sessions}
//                         isLoading={isLoading}
//                         onRefresh={handleRefresh}
//                         onCreateSession={user?.role === 'learner' ? handleCreateSession : undefined}
//                         userRole={user?.role}
//                     />

//                     {/* Filters */}
//                     <SessionFilters
//                         searchTerm={searchTerm}
//                         setSearchTerm={setSearchTerm}
//                         filterStatus={filterStatus}
//                         setFilterStatus={setFilterStatus}
//                         filterTimeframe={filterTimeframe}
//                         setFilterTimeframe={setFilterTimeframe}
//                         onRefresh={handleRefresh}
//                         totalCount={filteredSessions.length}
//                     />

//                     {/* Sessions Grid */}
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.3 }}
//                     >
//                         {filteredSessions.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                                 {filteredSessions.map((session) => (
//                                     <SessionCard
//                                         key={session.id}
//                                         session={session}
//                                         userRole={user?.role || 'learner'}
//                                         currentUserId={user?.id || ''}
//                                         onView={handleViewSession}
//                                         onAccept={handleAcceptSession}
//                                         onReject={handleRejectSession}
//                                         onCancel={handleCancelSession}
//                                         onComplete={handleCompleteSession}
//                                         onReview={handleReviewSession}
//                                         onReschedule={handleRescheduleSession}
//                                     />
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-12">
//                                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-6">
//                                     <Clock className="h-12 w-12 text-slate-400" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
//                                     No sessions found
//                                 </h3>
//                                 <p className="text-slate-600 dark:text-slate-400 mb-6">
//                                     {user?.role === 'mentor'
//                                         ? "You don't have any sessions yet. Learners will be able to request sessions with you."
//                                         : "You don't have any sessions yet. Start by requesting a session with a mentor."
//                                     }
//                                 </p>
//                                 {user?.role === 'learner' && (
//                                     <button
//                                         onClick={handleCreateSession}
//                                         className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//                                     >
//                                         Request Your First Session
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </motion.div>
//                 </div>
//             </div>

//             {/* Session Request Modal */}
//             {showRequestModal && (
//                 <SessionRequestModal
//                     isOpen={showRequestModal}
//                     onClose={() => setShowRequestModal(false)}
//                     onSuccess={handleSessionRequestSuccess}
//                 />
//             )}

//             {/* Session Detail Modal */}
//             {selectedSession && (
//                 <SessionDetailModal
//                     session={selectedSession}
//                     isOpen={showDetailModal}
//                     onClose={handleCloseModal}
//                     userRole={user?.role || 'learner'}
//                     currentUserId={user?.id || ''}
//                     onAccept={handleAcceptSession}
//                     onReject={handleRejectSession}
//                     onCancel={handleCancelSession}
//                     onComplete={handleCompleteSession}
//                     onReview={handleReviewSession}
//                     onReschedule={handleRescheduleSession}
//                 />
//             )}
//         </div>
//     );
// };

// export default SessionsPage;