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
    ExternalLink
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
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>;
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

    const getUserIcon = (role: string) => {
        return role === 'mentor' ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
            </div>
        ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
            </div>
        );
    };

    const canUserAccept = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'pending';
    const canUserReject = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'pending';
    const canUserComplete = userRole === 'mentor' && session.mentorId === currentUserId && session.status === 'accepted';
    const canUserCancel = (userRole === 'mentor' && session.mentorId === currentUserId) ||
        (userRole === 'learner' && session.learnerId === currentUserId);
    const canUserReview = userRole === 'learner' && session.learnerId === currentUserId &&
        session.status === 'completed' && !session.isReviewed;
    const canUserReschedule = canUserCancel && ['pending', 'accepted'].includes(session.status);

    const isUpcoming = new Date(session.date) > new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Card className={cn(
                "border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                session.status === 'pending' && "bg-amber-50/80 dark:bg-amber-950/20",
                session.status === 'accepted' && "bg-green-50/80 dark:bg-green-950/20",
                session.status === 'completed' && "bg-blue-50/80 dark:bg-blue-950/20",
                session.status === 'cancelled' && "bg-red-50/80 dark:bg-red-950/20"
            )}>
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                            {getUserIcon(userRole === 'mentor' ? 'learner' : 'mentor')}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg truncate">
                                    {session.topic}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {userRole === 'mentor' ? `With ${session.learnerName}` : `With ${session.mentorName}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {getStatusBadge(session.status)}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onView(session)}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </DropdownMenuItem>

                                    {session.link && (
                                        <DropdownMenuItem onClick={() => window.open(session.link, '_blank')}>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Join Session
                                        </DropdownMenuItem>
                                    )}

                                    {canUserAccept && onAccept && (
                                        <DropdownMenuItem onClick={() => onAccept(session.id!)}>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Accept
                                        </DropdownMenuItem>
                                    )}

                                    {canUserReject && onReject && (
                                        <DropdownMenuItem onClick={() => onReject(session.id!)}>
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </DropdownMenuItem>
                                    )}

                                    {canUserComplete && onComplete && (
                                        <DropdownMenuItem onClick={() => onComplete(session.id!)}>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark Complete
                                        </DropdownMenuItem>
                                    )}

                                    {canUserReview && onReview && (
                                        <DropdownMenuItem onClick={() => onReview(session.id!)}>
                                            <Star className="h-4 w-4 mr-2" />
                                            Leave Review
                                        </DropdownMenuItem>
                                    )}

                                    {canUserReschedule && onReschedule && (
                                        <DropdownMenuItem onClick={() => onReschedule(session.id!)}>
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Reschedule
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    {canUserCancel && onCancel && (
                                        <DropdownMenuItem
                                            onClick={() => onCancel(session.id!)}
                                            className="text-red-600"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Cancel
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Description */}
                    {session.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                            {session.description}
                        </p>
                    )}

                    {/* Date and Time */}
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(session.date)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.timeSlot} ({session.duration} min)
                        </div>
                    </div>

                    {/* Objectives */}
                    {session.objectives && session.objectives.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Objectives:</p>
                            <div className="flex flex-wrap gap-1">
                                {session.objectives.slice(0, 3).map((objective, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {objective}
                                    </Badge>
                                ))}
                                {session.objectives.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{session.objectives.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {isUpcoming ? `In ${formatTime(session.date)}` : formatTime(session.date)}
                        </div>
                        <div className="flex space-x-2">
                            {canUserAccept && onAccept && (
                                <Button
                                    size="sm"
                                    onClick={() => onAccept(session.id!)}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Accept
                                </Button>
                            )}
                            {canUserReview && onReview && (
                                <Button
                                    size="sm"
                                    onClick={() => onReview(session.id!)}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    <Star className="h-4 w-4 mr-1" />
                                    Review
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onView(session)}
                            >
                                <Eye className="h-4 w-4 mr-1" />
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