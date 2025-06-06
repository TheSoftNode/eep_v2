import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    MessageSquare,
    CheckCircle,
    XCircle,
    Eye,
    MoreVertical,
    Star,
    ExternalLink,
    Target,
    Users,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SessionData } from '@/Redux/types/Users/mentor';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface SessionCardProps {
    session: SessionData;
    userRole: string;
    currentUserId: string;
    onView: (session: SessionData) => void;
    onAccept?: (sessionId: string) => void;
    onReject?: (sessionId: string) => void;
    onCancel?: (sessionId: string) => void;
    onComplete?: (sessionId: string) => void;
    onReview?: (sessionId: string) => void;
    onReschedule?: (sessionId: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
    session,
    userRole,
    currentUserId,
    onView,
    onAccept,
    onReject,
    onCancel,
    onComplete,
    onReview,
    onReschedule
}) => {
    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Unknown time';
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const formatFullDate = (dateString: string) => {
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
        const baseClasses = "px-3 py-1 text-xs font-medium rounded-full border";
        switch (status) {
            case 'pending':
                return <Badge className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30`}>Pending Review</Badge>;
            case 'accepted':
                return <Badge className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30`}>Confirmed</Badge>;
            case 'completed':
                return <Badge className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30`}>Completed</Badge>;
            case 'cancelled':
                return <Badge className={`${baseClasses} bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30`}>Cancelled</Badge>;
            case 'rejected':
                return <Badge className={`${baseClasses} bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30`}>Declined</Badge>;
            default:
                return <Badge className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700`}>{status}</Badge>;
        }
    };

    const getUserAvatar = (role: string, name: string) => {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const isMentor = role === 'mentor' || (userRole === 'learner' && role !== 'learner');

        return (
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm font-medium text-sm",
                isMentor
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600"
            )}>
                {initials}
            </div>
        );
    };

    const getParticipantInfo = () => {
        if (userRole === 'mentor') {
            return {
                name: session.learnerName,
                role: 'learner',
                label: 'Learner'
            };
        } else {
            return {
                name: session.mentorName,
                role: 'mentor',
                label: 'Mentor'
            };
        }
    };

    const participant = getParticipantInfo();

    const canUserAccept = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'pending';
    const canUserReject = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'pending';
    const canUserComplete = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'accepted';
    const canUserCancel = (userRole === 'mentor' && session.mentorId === currentUserId) ||
        (userRole === 'learner' && session.learnerId === currentUserId);
    const canUserReview = userRole === 'learner' && session.learnerId === currentUserId &&
        session.status === 'completed' && !session.isReviewed;
    const canUserReschedule = canUserCancel && ['pending', 'accepted'].includes(session.status);

    const isUpcoming = new Date(session.date) > new Date();
    const isPending = session.status === 'pending';
    const isCompleted = session.status === 'completed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group"
        >
            <Card className={cn(
                "relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl",
                session.status === 'pending' && "ring-1 ring-amber-200/50 dark:ring-amber-800/20",
                session.status === 'accepted' && "ring-1 ring-emerald-200/50 dark:ring-emerald-800/20",
                session.status === 'completed' && "ring-1 ring-blue-200/50 dark:ring-blue-800/20"
            )}>
                {/* Status indicator line */}
                <div className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    session.status === 'pending' && "bg-gradient-to-r from-amber-500 to-orange-500",
                    session.status === 'accepted' && "bg-gradient-to-r from-emerald-500 to-teal-500",
                    session.status === 'completed' && "bg-gradient-to-r from-blue-500 to-indigo-500",
                    session.status === 'cancelled' && "bg-gradient-to-r from-red-500 to-pink-500",
                    session.status === 'rejected' && "bg-gradient-to-r from-red-500 to-pink-500"
                )} />

                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex items-start space-x-4 flex-1">
                            {getUserAvatar(participant.role, participant.name)}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight mb-1 truncate">
                                    {session.topic}
                                </h3>
                                <div className="flex items-center space-x-2 mb-2">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        with <span className="font-medium">{participant.name}</span>
                                    </p>
                                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-slate-50 dark:bg-slate-800/50">
                                        {participant.label}
                                    </Badge>
                                </div>

                                {/* Session Type Indicator */}
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                    <Users className="h-3 w-3 mr-1" />
                                    1-on-1 Session
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            {getStatusBadge(session.status)}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52">
                                    <DropdownMenuItem onClick={() => onView(session)} className="cursor-pointer">
                                        <Eye className="h-4 w-4 mr-3" />
                                        View Details
                                    </DropdownMenuItem>

                                    {session.link && (
                                        <DropdownMenuItem onClick={() => window.open(session.link, '_blank')} className="cursor-pointer">
                                            <ExternalLink className="h-4 w-4 mr-3" />
                                            Join Session
                                        </DropdownMenuItem>
                                    )}

                                    {canUserAccept && onAccept && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onAccept(session.id!)} className="cursor-pointer text-emerald-600">
                                                <CheckCircle className="h-4 w-4 mr-3" />
                                                Accept Request
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {canUserReject && onReject && (
                                        <DropdownMenuItem onClick={() => onReject(session.id!)} className="cursor-pointer text-red-600 focus:text-red-600">
                                            <XCircle className="h-4 w-4 mr-3" />
                                            Decline Request
                                        </DropdownMenuItem>
                                    )}

                                    {canUserComplete && onComplete && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onComplete(session.id!)} className="cursor-pointer text-blue-600">
                                                <CheckCircle className="h-4 w-4 mr-3" />
                                                Mark Complete
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {canUserReview && onReview && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onReview(session.id!)} className="cursor-pointer text-amber-600">
                                                <Star className="h-4 w-4 mr-3" />
                                                Leave Review
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {canUserReschedule && onReschedule && (
                                        <DropdownMenuItem onClick={() => onReschedule(session.id!)} className="cursor-pointer">
                                            <Calendar className="h-4 w-4 mr-3" />
                                            Reschedule
                                        </DropdownMenuItem>
                                    )}

                                    {canUserCancel && onCancel && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onCancel(session.id!)}
                                                className="cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                                <XCircle className="h-4 w-4 mr-3" />
                                                Cancel Session
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Description */}
                    {session.description && (
                        <div className="mb-5">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                                {session.description}
                            </p>
                        </div>
                    )}

                    {/* Session Details */}
                    <div className="space-y-3 mb-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                                {formatDate(session.date)}
                            </div>
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="h-4 w-4 mr-2 text-slate-500" />
                                {session.timeSlot}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="h-4 w-4 mr-2 text-slate-500" />
                                {session.duration} minutes
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {isUpcoming ? formatTime(session.date) : formatTime(session.date)}
                            </div>
                        </div>
                    </div>

                    {/* Learning Objectives */}
                    {session.objectives && session.objectives.length > 0 && (
                        <div className="mb-5">
                            <div className="flex items-center mb-2">
                                <Target className="h-4 w-4 mr-2 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Learning Goals</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {session.objectives.slice(0, 3).map((objective, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                    >
                                        {objective}
                                    </Badge>
                                ))}
                                {session.objectives.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-500"
                                    >
                                        +{session.objectives.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Status-specific Information */}
                    {isPending && userRole === 'mentor' && (
                        <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
                            <div className="flex items-center text-sm text-amber-700 dark:text-amber-400">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                <span className="font-medium">Action Required:</span>
                                <span className="ml-1">Review and respond to this session request</span>
                            </div>
                        </div>
                    )}

                    {isCompleted && canUserReview && (
                        <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                            <div className="flex items-center text-sm text-blue-700 dark:text-blue-400">
                                <Star className="h-4 w-4 mr-2" />
                                <span className="font-medium">Review Pending:</span>
                                <span className="ml-1">Share your experience with this session</span>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-700/50">
                        <div className="flex items-center space-x-2">
                            {session.isReviewed && (
                                <Badge className="text-xs bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800/30">
                                    <Star className="h-3 w-3 mr-1" />
                                    Reviewed
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {canUserAccept && onAccept && (
                                <Button
                                    size="sm"
                                    onClick={() => onAccept(session.id!)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm px-4 py-2 h-auto"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept
                                </Button>
                            )}
                            {canUserReview && onReview && (
                                <Button
                                    size="sm"
                                    onClick={() => onReview(session.id!)}
                                    className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm px-4 py-2 h-auto"
                                >
                                    <Star className="h-4 w-4 mr-2" />
                                    Review
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onView(session)}
                                className="border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50 px-4 py-2 h-auto"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SessionCard;