import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    User,
    Users,
    ExternalLink,
    UserPlus,
    UserMinus,
    Globe,
    Lock,
    Target,
    MapPin,
    Copy,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OpenSessionData } from '@/Redux/types/Sessions/session';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface OpenSessionDetailModalProps {
    session: OpenSessionData;
    isOpen: boolean;
    onClose: () => void;
    currentUserId: string;
    onJoin?: (sessionId: string) => void;
    onLeave?: (sessionId: string) => void;
    isCreator?: boolean;
}

const OpenSessionDetailModal: React.FC<OpenSessionDetailModalProps> = ({
    session,
    isOpen,
    onClose,
    currentUserId,
    onJoin,
    onLeave,
    isCreator = false
}) => {
    const [linkCopied, setLinkCopied] = React.useState(false);

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

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Unknown time';
        }
    };

    const formatTimeSlot = (timeSlot: string) => {
        return timeSlot || 'Time TBD';
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-3 py-1.5 text-sm font-medium rounded-full border";
        switch (status) {
            case 'open':
                return <Badge className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30`}>Open for Registration</Badge>;
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
            <Users className="h-5 w-5" />
        ) : (
            <User className="h-5 w-5" />
        );
    };

    const isParticipant = session.participants?.includes(currentUserId);
    const isOwner = session.createdBy === currentUserId;
    const sessionStatus = session.status as string;
    const canJoin = sessionStatus === 'open' && !isParticipant && !isOwner && session.currentParticipants < session.maxParticipants;
    const canLeave = sessionStatus === 'open' && isParticipant && !isOwner;
    const isUpcoming = new Date(session.date) > new Date();
    const spotsLeft = session.maxParticipants - session.currentParticipants;
    const progressPercentage = (session.currentParticipants / session.maxParticipants) * 100;

    const copySessionLink = async () => {
        if (session.link) {
            try {
                await navigator.clipboard.writeText(session.link);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    };

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
                    className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto rounded-xl"
                >
                    <Card className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
                        {/* Header */}
                        <CardHeader className="pb-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className={cn(
                                        "w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg",
                                        session.sessionType === 'group'
                                            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                                            : "bg-gradient-to-br from-emerald-500 to-teal-600"
                                    )}>
                                        {getSessionTypeIcon(session.sessionType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            {session.topic}
                                        </CardTitle>
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-sm font-medium">
                                                    {session.creatorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                </div>
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    Created by <span className="font-medium text-slate-900 dark:text-white">{session.creatorName}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {getStatusBadge(sessionStatus)}
                                            <Badge variant="outline" className="flex items-center space-x-1">
                                                {getSessionTypeIcon(session.sessionType)}
                                                <span className="capitalize">{session.sessionType} Session</span>
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center space-x-1">
                                                {session.isPublic ? (
                                                    <>
                                                        <Globe className="h-3 w-3" />
                                                        <span>Public</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="h-3 w-3" />
                                                        <span>Private</span>
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
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
                            {/* Description */}
                            {session.description && (
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About This Session</h4>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {session.description}
                                    </p>
                                </div>
                            )}

                            {/* Session Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date & Time */}
                                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                    <CardContent className="p-4">
                                        <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Schedule
                                        </h5>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">Date:</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{formatDate(session.date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">Time:</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{formatTimeSlot(session.timeSlot)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{session.duration} minutes</span>
                                            </div>
                                            <div className="pt-1 border-t border-slate-200 dark:border-slate-600">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {isUpcoming ? `Starts ${formatTime(session.date)}` : formatTime(session.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Participants */}
                                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                    <CardContent className="p-4">
                                        <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                            <Users className="h-4 w-4 mr-2" />
                                            Participants
                                        </h5>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 dark:text-slate-400">Registered:</span>
                                                <span className="font-bold text-lg text-slate-900 dark:text-white">
                                                    {session.currentParticipants}/{session.maxParticipants}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div
                                                    className={cn(
                                                        "h-2 rounded-full transition-all duration-300",
                                                        progressPercentage < 70 ? "bg-emerald-500" :
                                                            progressPercentage < 90 ? "bg-amber-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500 dark:text-slate-400">
                                                    {spotsLeft > 0 ? `${spotsLeft} spots available` : 'Session full'}
                                                </span>
                                                <span className="text-slate-500 dark:text-slate-400">
                                                    {Math.round(progressPercentage)}% filled
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Learning Objectives */}
                            {session.objectives && session.objectives.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                        <Target className="h-5 w-5 mr-2" />
                                        Learning Goals
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {session.objectives.map((objective, index) => (
                                            <div key={index} className="flex items-start space-x-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{objective}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Session Link */}
                            {session.link && (
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                        <ExternalLink className="h-5 w-5 mr-2" />
                                        Join Session
                                    </h4>
                                    <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                                        <div className="flex-1">
                                            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">Session Meeting Link</p>
                                            <p className="text-xs text-blue-600 dark:text-blue-500 truncate">{session.link}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={copySessionLink}
                                                className="border-blue-200 text-blue-600 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-400"
                                            >
                                                {linkCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => window.open(session.link, '_blank')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Open
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Participant Status */}
                            {(isParticipant || isOwner) && (
                                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                                    <div className="flex items-center space-x-3">
                                        {isOwner ? (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                                                    <MapPin className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-purple-700 dark:text-purple-400">You created this session</p>
                                                    <p className="text-sm text-purple-600 dark:text-purple-500">Manage participants and session details</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-emerald-700 dark:text-emerald-400">You're registered for this session</p>
                                                    <p className="text-sm text-emerald-600 dark:text-emerald-500">You'll receive updates about this session</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="px-6"
                                >
                                    Close
                                </Button>

                                {canJoin && onJoin && (
                                    <Button
                                        onClick={() => onJoin(session.id!)}
                                        disabled={spotsLeft === 0}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                                    >
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Join Session
                                    </Button>
                                )}

                                {canLeave && onLeave && (
                                    <Button
                                        onClick={() => onLeave(session.id!)}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-950/20 px-6"
                                    >
                                        <UserMinus className="h-4 w-4 mr-2" />
                                        Leave Session
                                    </Button>
                                )}

                                {session.link && (
                                    <Button
                                        onClick={() => window.open(session.link, '_blank')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Join Now
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

export default OpenSessionDetailModal;