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
    ExternalLink,
    MapPin,
    Target,
    Settings
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
    onManage?: (session: OpenSessionData) => void; // NEW: Added manage function
    isCreator?: boolean;
}

const OpenSessionCard: React.FC<OpenSessionCardProps> = ({
    session,
    currentUserId,
    onView,
    onJoin,
    onLeave,
    onManage,
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
        const baseClasses = "px-2 text-xs font-medium rounded-full border";
        switch (status) {
            case 'open':
                return <Badge className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30`}>Open</Badge>;
            case 'in_progress':
                return <Badge className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30`}>In Progress</Badge>;
            case 'completed':
                return <Badge className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700/50`}>Completed</Badge>;
            case 'cancelled':
                return <Badge className={`${baseClasses} bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30`}>Cancelled</Badge>;
            default:
                return <Badge className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700`}>{status}</Badge>;
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
    const isOwner = session.createdBy === currentUserId;

    const sessionStatus = session.status as string;
    const canJoin = sessionStatus === 'open' &&
        !isParticipant &&
        !isOwner &&
        session.currentParticipants < session.maxParticipants;

    const canLeave = sessionStatus === 'open' && isParticipant && !isOwner;
    const isUpcoming = new Date(session.date) > new Date();
    const spotsLeft = session.maxParticipants - session.currentParticipants;
    const progressPercentage = (session.currentParticipants / session.maxParticipants) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group"
        >
            <Card className={cn(
                "relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl",
                sessionStatus === 'open' && "ring-1 ring-emerald-200/50 dark:ring-emerald-800/20",
                sessionStatus === 'in_progress' && "ring-1 ring-blue-200/50 dark:ring-blue-800/20"
            )}>
                {/* Status indicator line */}
                <div className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    sessionStatus === 'open' && "bg-gradient-to-r from-emerald-500 to-teal-500",
                    sessionStatus === 'in_progress' && "bg-gradient-to-r from-blue-500 to-indigo-500",
                    sessionStatus === 'completed' && "bg-gradient-to-r from-slate-400 to-slate-500",
                    sessionStatus === 'cancelled' && "bg-gradient-to-r from-red-500 to-pink-500"
                )} />

                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex items-start space-x-4 flex-1">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm",
                                session.sessionType === 'group'
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                                    : "bg-gradient-to-br from-emerald-500 to-teal-600"
                            )}>
                                {getSessionTypeIcon(session.sessionType)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight mb-1 truncate">
                                    {session.topic}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    by {session.creatorName}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                        {getSessionTypeIcon(session.sessionType)}
                                        <span className="ml-1 capitalize">{session.sessionType}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                        {session.isPublic ? (
                                            <>
                                                <Globe className="h-3 w-3 mr-1" />
                                                Public
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-3 w-3 mr-1" />
                                                Private
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            {getStatusBadge(sessionStatus)}
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
                                            Open Session Link
                                        </DropdownMenuItem>
                                    )}

                                    {/* NEW: Added manage option for creators */}
                                    {isOwner && onManage && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onManage(session)} className="cursor-pointer text-purple-600">
                                                <Settings className="h-4 w-4 mr-3" />
                                                Manage Session
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {canJoin && onJoin && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onJoin(session.id!)} className="cursor-pointer text-emerald-600">
                                                <UserPlus className="h-4 w-4 mr-3" />
                                                Join Session
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {canLeave && onLeave && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onLeave(session.id!)}
                                                className="cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                                <UserMinus className="h-4 w-4 mr-3" />
                                                Leave Session
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
                                {formatTimeSlot(session.timeSlot)}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="h-4 w-4 mr-2 text-slate-500" />
                                {session.duration} minutes
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {isUpcoming ? `Starts ${formatTime(session.date)}` : formatTime(session.date)}
                            </div>
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Users className="h-4 w-4 mr-2 text-slate-500" />
                                <span className="font-medium">{session.currentParticipants}</span>
                                <span className="mx-1">/</span>
                                <span>{session.maxParticipants} participants</span>
                            </div>
                            {sessionStatus === 'open' && (
                                <div className="text-xs">
                                    {spotsLeft > 0 ? (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                            {spotsLeft} spots left
                                        </span>
                                    ) : (
                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                            Full
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    progressPercentage < 70 ? "bg-emerald-500" :
                                        progressPercentage < 90 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Objectives */}
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

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-700/50">
                        <div className="flex items-center space-x-2">
                            {isParticipant && (
                                <Badge className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30">
                                    <User className="h-3 w-3 mr-1" />
                                    Joined
                                </Badge>
                            )}
                            {isOwner && (
                                <Badge className="text-xs bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/30">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    Creator
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* NEW: Added manage button for creators */}
                            {isOwner && onManage && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onManage(session)}
                                    className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800/30 dark:text-purple-400 dark:hover:bg-purple-950/20 px-2 py-1 h-auto"
                                >
                                    <Settings className="h-3 w-3 mr-1" />
                                    Manage
                                </Button>
                            )}

                            {canJoin && onJoin && (
                                <Button
                                    size="sm"
                                    onClick={() => onJoin(session.id!)}
                                    disabled={spotsLeft === 0}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm px-4 py-2 h-auto"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Join
                                </Button>
                            )}
                            {canLeave && onLeave && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onLeave(session.id!)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-950/20 px-2 py-1 h-auto"
                                >
                                    <UserMinus className="h-3 w-3 mr-1" />
                                    Leave
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onView(session)}
                                className="border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50 px-2 py-1 h-auto"
                            >
                                <Eye className="h-3 w-3 mr-1" />
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
