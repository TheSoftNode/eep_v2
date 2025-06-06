import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Users,
    Eye,
    UserPlus,
    UserMinus,
    Globe,
    Lock,
    MoreVertical,
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
import { OpenSessionData } from '@/Redux/types/Sessions/session';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface OpenSessionCardProps {
    session: OpenSessionData;
    currentUserId: string;
    onView: (session: OpenSessionData) => void;
    onJoin?: (sessionId: string) => void;
    onLeave?: (sessionId: string) => void;
    isCreator?: boolean;
}

const OpenSessionCard: React.FC<OpenSessionCardProps> = ({
    session,
    currentUserId,
    onView,
    onJoin,
    onLeave,
    isCreator = false
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

    const formatTimeSlot = (timeSlot: string) => {
        return timeSlot || 'Time TBD';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">Open</Badge>;
            case 'in_progress':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400">In Progress</Badge>;
            case 'completed':
                return <Badge className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getSessionTypeIcon = (type: string) => {
        return type === 'group' ? (
            <Users className="h-4 w-4" />
        ) : (
            <User className="h-4 w-4" />
        );
    };

    const isParticipant = session.participants?.includes(currentUserId);
    const canJoin = session.status === 'open' &&
        !isParticipant &&
        !isCreator &&
        session.currentParticipants < session.maxParticipants;
    const canLeave = session.status === 'open' && isParticipant && !isCreator;
    const isUpcoming = new Date(session.date) > new Date();
    const spotsLeft = session.maxParticipants - session.currentParticipants;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Card className={cn(
                "border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                session.status === 'open' && "bg-green-50/80 dark:bg-green-950/20",
                session.status === 'in_progress' && "bg-blue-50/80 dark:bg-blue-950/20",
                session.status === 'completed' && "bg-slate-50/80 dark:bg-slate-950/20",
                session.status === 'cancelled' && "bg-red-50/80 dark:bg-red-950/20"
            )}>
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg truncate">
                                    {session.topic}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Created by {session.creatorName}
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

                                    {canJoin && onJoin && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onJoin(session.id!)}>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Join Session
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {canLeave && onLeave && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onLeave(session.id!)}
                                                className="text-red-600"
                                            >
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Leave Session
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            {getSessionTypeIcon(session.sessionType)}
                            <span className="ml-1 capitalize">{session.sessionType}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            {session.isPublic ? (
                                <>
                                    <Globe className="h-4 w-4 mr-1" />
                                    Public
                                </>
                            ) : (
                                <>
                                    <Lock className="h-4 w-4 mr-1" />
                                    Private
                                </>
                            )}
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
                            {formatTimeSlot(session.timeSlot)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.duration} min
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {session.currentParticipants}/{session.maxParticipants} participants
                            </span>
                        </div>
                        {spotsLeft > 0 && session.status === 'open' ? (
                            <Badge variant="outline" className="text-xs">
                                {spotsLeft} spots left
                            </Badge>
                        ) : session.status === 'open' && spotsLeft === 0 ? (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                                Full
                            </Badge>
                        ) : null}
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
                            {isUpcoming ? `Starts ${formatTime(session.date)}` : formatTime(session.date)}
                        </div>
                        <div className="flex space-x-2">
                            {canJoin && onJoin && (
                                <Button
                                    size="sm"
                                    onClick={() => onJoin(session.id!)}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    disabled={spotsLeft === 0}
                                >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Join
                                </Button>
                            )}
                            {canLeave && onLeave && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onLeave(session.id!)}
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    <UserMinus className="h-4 w-4 mr-1" />
                                    Leave
                                </Button>
                            )}
                            {isParticipant && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                    Joined
                                </Badge>
                            )}
                            {isCreator && (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                                    Creator
                                </Badge>
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

export default OpenSessionCard;