import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    Clock,
    User,
    ExternalLink,
    CheckCircle,
    XCircle,
    Star,
    Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SessionData } from '@/Redux/types/Users/mentor';

interface SessionDetailModalProps {
    session: SessionData;
    isOpen: boolean;
    onClose: () => void;
    userRole: string;
    currentUserId: string;
    onAccept?: (sessionId: string) => void;
    onReject?: (sessionId: string) => void;
    onCancel?: (sessionId: string) => void;
    onComplete?: (sessionId: string) => void;
    onReview?: (sessionId: string) => void;
    onReschedule?: (sessionId: string) => void;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
    session,
    isOpen,
    onClose,
    userRole,
    currentUserId,
    onAccept,
    onReject,
    onCancel,
    onComplete,
    onReview,
    onReschedule
}) => {
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">Pending Approval</Badge>;
            case 'accepted':
                return <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">Confirmed</Badge>;
            case 'completed':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const canUserAccept = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'pending';
    const canUserReject = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'pending';
    const canUserComplete = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'accepted';
    const canUserCancel = (userRole === 'mentor' && session.mentorId === currentUserId) ||
        (userRole === 'learner' && session.learnerId === currentUserId);
    const canUserReview = userRole === 'learner' && session.learnerId === currentUserId &&
        session.status === 'completed' && !session.isReviewed;
    const canUserReschedule = canUserCancel && ['pending', 'accepted'].includes(session.status);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto rounded-xl"
                >
                    <Card className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
                        {/* Header */}
                        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        {session.topic}
                                    </CardTitle>
                                    <div className="flex items-center space-x-3">
                                        {getStatusBadge(session.status)}
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            Session #{session.id?.slice(-6)}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            {/* Participants */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Mentor</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{session.mentorName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Learner</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{session.learnerName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Session Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-slate-500" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</p>
                                            <p className="text-slate-900 dark:text-white">{formatDate(session.date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-slate-500" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Time & Duration</p>
                                            <p className="text-slate-900 dark:text-white">{session.timeSlot} ({session.duration} minutes)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {session.link && (
                                        <div className="flex items-center space-x-3">
                                            <ExternalLink className="h-5 w-5 text-slate-500" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Session Link</p>
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto text-indigo-600 hover:text-indigo-700"
                                                    onClick={() => window.open(session.link, '_blank')}
                                                >
                                                    Join Session
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {session.description && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</h4>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {session.description}
                                    </p>
                                </div>
                            )}

                            {/* Objectives */}
                            {session.objectives && session.objectives.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                                        <Target className="h-4 w-4 mr-2" />
                                        Learning Objectives
                                    </h4>
                                    <div className="space-y-2">
                                        {session.objectives.map((objective, index) => (
                                            <div key={index} className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">{objective}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes (if any) */}
                            {session.notes && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Notes</h4>
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                            {session.notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Rejection/Cancellation Reason */}
                            {(session.rejectionReason || session.cancellationReason) && (
                                <div>
                                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                        {session.rejectionReason ? 'Rejection Reason' : 'Cancellation Reason'}
                                    </h4>
                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                                        <p className="text-red-600 dark:text-red-400 text-sm">
                                            {session.rejectionReason || session.cancellationReason}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                {canUserAccept && onAccept && (
                                    <Button
                                        onClick={() => onAccept(session.id!)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Accept Session
                                    </Button>
                                )}

                                {canUserReject && onReject && (
                                    <Button
                                        onClick={() => onReject(session.id!)}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                )}

                                {canUserComplete && onComplete && (
                                    <Button
                                        onClick={() => onComplete(session.id!)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark Complete
                                    </Button>
                                )}

                                {canUserReview && onReview && (
                                    <Button
                                        onClick={() => onReview(session.id!)}
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        <Star className="h-4 w-4 mr-2" />
                                        Leave Review
                                    </Button>
                                )}

                                {canUserReschedule && onReschedule && (
                                    <Button
                                        onClick={() => onReschedule(session.id!)}
                                        variant="outline"
                                    >
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Reschedule
                                    </Button>
                                )}

                                {session.link && (
                                    <Button
                                        onClick={() => window.open(session.link, '_blank')}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Join Session
                                    </Button>
                                )}

                                {canUserCancel && onCancel && (
                                    <Button
                                        onClick={() => onCancel(session.id!)}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 ml-auto"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancel Session
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SessionDetailModal;