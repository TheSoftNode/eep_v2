import React from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    Users,
    Globe,
    Lock,
    Video,
    Target,
    User,
    CheckCircle,
    Eye,
    MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SessionPreviewProps {
    formData: {
        mentorId: string;
        topic: string;
        description: string;
        date: string;
        timeSlot: string;
        duration: number;
        objectives: string[];
        link: string;
        maxParticipants: number;
        isPublic: boolean;
        sessionType: 'individual' | 'group';
    };
}

const getSessionTypeStyles = (type: string) => {
    switch (type) {
        case 'individual':
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-800/50";
        case 'group':
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-800/50";
        default:
            return "bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800/50";
    }
};

const getVisibilityStyles = (isPublic: boolean) => {
    return isPublic
        ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 dark:border-green-800/50"
        : "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300 dark:border-orange-800/50";
};

const formatDuration = (minutes: number) => {
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${remainingMinutes}m`;
        }
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getDaysUntilSession = (dateString: string) => {
    if (!dateString) return null;
    const sessionDate = new Date(dateString);
    const today = new Date();
    const diffTime = sessionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Past date';
};

export const SessionPreview: React.FC<SessionPreviewProps> = ({ formData }) => {
    const completionItems = [
        { key: 'topic', label: 'Topic', completed: !!formData.topic },
        { key: 'description', label: 'Description', completed: !!formData.description },
        { key: 'date', label: 'Date & Time', completed: !!(formData.date && formData.timeSlot) },
        { key: 'link', label: 'Meeting Link', completed: !!formData.link },
        { key: 'objectives', label: 'Objectives', completed: formData.objectives.length > 0 }
    ];

    const completionPercentage = Math.round(
        (completionItems.filter(item => item.completed).length / completionItems.length) * 100
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
        >
            {/* Preview Header */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-indigo-600" />
                        Session Preview
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Preview how your session will appear to potential participants
                    </p>
                </CardHeader>
            </Card>

            {/* Main Session Card */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 shadow-lg border-0 overflow-hidden">
                {/* Gradient Header */}
                <div className="h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-700 dark:via-purple-700 dark:to-violet-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTguMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE3Ljl6TTIxIDZjMS4yIDAgMi4xLjkgMi4xIDIuMXY0LjJjMCAxLjItLjkgMi4xLTIuMSAyLjFoLTIuMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWOC4xYzAtMS4yLjktMi4xIDIuMS0yLjFIMjF6bTI0IDI0YzEuMiAwIDIuMS45IDIuMSAyLjF2NGMwIDEuMi0uOSAyLjEtMi4xIDIuMWgtNGMtMS4yIDAtMi4xLS45LTIuMS0yLjF2LTRjMC0xLjIuOS0yLjEgMi4xLTIuMWg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

                    {/* Session Type Badge */}
                    <div className="absolute top-4 right-4">
                        <Badge className={cn("text-xs font-medium border", getSessionTypeStyles(formData.sessionType))}>
                            {formData.sessionType.charAt(0).toUpperCase() + formData.sessionType.slice(1)} Session
                        </Badge>
                    </div>
                </div>

                <CardHeader className="pb-4 pt-6 px-6">
                    {/* Session Title */}
                    <CardTitle className="text-xl mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        {formData.topic || 'Session Topic'}
                    </CardTitle>

                    {/* Session Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn("text-xs font-medium border", getVisibilityStyles(formData.isPublic))}>
                            {formData.isPublic ? (
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
                        </Badge>

                        <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {formData.maxParticipants} max
                        </Badge>

                        {formData.date && (
                            <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                {getDaysUntilSession(formData.date)}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pt-0 px-6 space-y-6">
                    {/* Session Description */}
                    {formData.description && (
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                About This Session
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {formData.description}
                            </p>
                        </div>
                    )}

                    {/* Schedule Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date & Time */}
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Date & Time</p>
                                <div className="text-slate-800 dark:text-slate-200">
                                    {formData.date ? (
                                        <>
                                            <p className="font-medium">{formatDate(formData.date)}</p>
                                            {formData.timeSlot && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{formData.timeSlot}</p>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-slate-400">Not scheduled</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Duration</p>
                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                    {formatDuration(formData.duration)}
                                </span>
                            </div>
                        </div>

                        {/* Meeting Access */}
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <Video className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Meeting Link</p>
                                <span className="text-slate-800 dark:text-slate-200">
                                    {formData.link ? (
                                        <span className="text-indigo-600 dark:text-indigo-400">✅ Provided</span>
                                    ) : (
                                        <span className="text-slate-400">Not provided</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Mentor */}
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mentor</p>
                                <span className="text-slate-800 dark:text-slate-200">
                                    {formData.mentorId ? `ID: ${formData.mentorId}` : 'Auto-assigned'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Learning Objectives */}
                    {formData.objectives.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Learning Objectives
                            </h4>
                            <div className="space-y-2">
                                {formData.objectives.map((objective, index) => (
                                    <div key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>{objective}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Session Completion Status */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        Session Setup Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Completion Progress */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                    Setup Progress
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {completionPercentage}%
                                </span>
                            </div>
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {completionPercentage < 50 ? 'Complete required fields to proceed' :
                                    completionPercentage < 100 ? 'Almost ready to publish!' : 'Session ready for publication!'}
                            </p>
                        </div>

                        {/* Completion Checklist */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {completionItems.map((item) => (
                                <div key={item.key} className="flex items-center gap-2">
                                    {item.completed ? (
                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                    )}
                                    <span className={cn(
                                        "text-sm",
                                        item.completed
                                            ? "text-slate-900 dark:text-white font-medium"
                                            : "text-slate-500 dark:text-slate-400"
                                    )}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Session Stats */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Type</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                                        {formData.sessionType}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Capacity</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formData.maxParticipants} {formData.maxParticipants === 1 ? 'person' : 'people'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatDuration(formData.duration)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Visibility</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formData.isPublic ? 'Public' : 'Private'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Recommendations */}
            {completionPercentage < 100 && (
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                                    Complete Your Session Setup
                                </h4>
                                <div className="space-y-1">
                                    {completionItems.filter(item => !item.completed).map((item) => (
                                        <p key={item.key} className="text-xs text-amber-700 dark:text-amber-300">
                                            • Complete the {item.label.toLowerCase()} section
                                        </p>
                                    ))}
                                </div>
                                {formData.objectives.length === 0 && (
                                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                                        💡 Adding learning objectives helps participants understand what they'll achieve
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Success State */}
            {completionPercentage === 100 && (
                <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                                    🎉 Session Ready for Publication!
                                </h4>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                    Your session is complete and ready to be published. Participants will be able to discover and join your session once it's created.
                                </p>
                                {formData.isPublic && (
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2">
                                        ✨ As a public session, it will appear in the session directory and search results.
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
};
