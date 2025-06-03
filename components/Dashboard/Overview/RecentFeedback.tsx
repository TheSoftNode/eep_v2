"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    ArrowRight,
    Star,
    Clock,
    User,
    Award,
    Eye,
    ThumbsUp,
    AlertCircle,
    Target,
    BookOpen,
    ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProjectFeedback } from '@/Redux/types/Projects';

interface RecentFeedbackProps {
    feedback: ProjectFeedback[];
    projectId?: string;
    className?: string;
}

// Utility functions
const getFeedbackTypeConfig = (type: string) => {
    switch (type) {
        case 'guidance':
            return {
                label: 'Guidance',
                color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
                icon: Target,
                dotColor: 'bg-blue-500'
            };
        case 'review':
            return {
                label: 'Review',
                color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
                icon: BookOpen,
                dotColor: 'bg-purple-500'
            };
        case 'approval':
            return {
                label: 'Approved',
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
                icon: Award,
                dotColor: 'bg-emerald-500'
            };
        case 'rejection':
            return {
                label: 'Needs Work',
                color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
                icon: AlertCircle,
                dotColor: 'bg-red-500'
            };
        case 'general':
        default:
            return {
                label: 'General',
                color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
                icon: MessageSquare,
                dotColor: 'bg-slate-500'
            };
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case 'mentor':
            return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400';
        case 'admin':
            return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
        case 'peer':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const formatTimeAgo = (date: any) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) :
        date._seconds ? new Date(date._seconds * 1000) : date;
    const now = new Date();
    const diffTime = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export default function RecentFeedback({
    feedback,
    projectId,
    className = ""
}: RecentFeedbackProps) {
    const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

    const toggleExpanded = (feedbackId: string) => {
        setExpandedFeedback(expandedFeedback === feedbackId ? null : feedbackId);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={className}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-600 opacity-80" />

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/5 to-amber-500/5 blur-2xl -mr-16 -mt-16 pointer-events-none" />

                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Recent Feedback
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                    Latest mentor evaluations and comments
                                </CardDescription>
                            </div>
                        </div>

                        <Badge variant="outline" className="border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400">
                            {feedback.length} items
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 relative">
                    {feedback.length > 0 ? (
                        <div className="space-y-3">
                            {feedback.map((item, index) => {
                                const typeConfig = getFeedbackTypeConfig(item.type);
                                const TypeIcon = typeConfig.icon;
                                const isExpanded = expandedFeedback === item.id;
                                const shouldTruncate = item.content.length > 120;
                                const displayContent = isExpanded || !shouldTruncate
                                    ? item.content
                                    : `${item.content.substring(0, 120)}...`;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-900 shadow-sm">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.authorName}`} />
                                                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-white font-medium">
                                                    {getUserInitials(item.authorName)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center flex-wrap gap-2 mb-2">
                                                    <h5 className="font-medium text-slate-900 dark:text-white">
                                                        {item.authorName}
                                                    </h5>
                                                    <Badge className={cn("text-xs font-medium border", getRoleColor(item.authorRole))}>
                                                        <User className="h-2 w-2 mr-1" />
                                                        {item.authorRole}
                                                    </Badge>
                                                    <Badge className={cn("text-xs font-medium border", typeConfig.color)}>
                                                        <div className={cn("w-1.5 h-1.5 rounded-full mr-1", typeConfig.dotColor)}></div>
                                                        {typeConfig.label}
                                                    </Badge>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        {formatTimeAgo(item.createdAt)}
                                                    </div>
                                                </div>

                                                {/* Target info */}
                                                {item.targetType && item.targetType !== 'project' && (
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                                                        <Target className="h-3 w-3" />
                                                        on {item.targetType}
                                                        {item.relatedMilestone && (
                                                            <>: {item.relatedMilestone}</>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                                                    {displayContent}
                                                </p>

                                                {shouldTruncate && (
                                                    <button
                                                        onClick={() => toggleExpanded(item.id)}
                                                        className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium mb-3"
                                                    >
                                                        {isExpanded ? 'Show less' : 'Show more'}
                                                    </button>
                                                )}

                                                {/* Rating */}
                                                {item.rating && (
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={cn(
                                                                        "h-3 w-3",
                                                                        i < item.rating!
                                                                            ? 'text-yellow-400 fill-yellow-400'
                                                                            : 'text-slate-300 dark:text-slate-600'
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                            {item.rating}/5
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Private indicator */}
                                                {item.isPrivate && (
                                                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mb-2">
                                                        <Eye className="h-3 w-3" />
                                                        Private feedback
                                                    </div>
                                                )}

                                                {/* Quick Actions */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                    >
                                                        <ThumbsUp className="h-3 w-3 mr-1" />
                                                        Helpful
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {feedback.length >= 3 && (
                                <div className="pt-2 text-center">
                                    <span className="text-xs text-orange-600 dark:text-orange-400 flex items-center justify-center font-medium">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        {feedback.length > 3 ? `${feedback.length - 3} more feedback items` : 'Latest feedback'}
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-orange-100 to-amber-200 dark:from-orange-900/20 dark:to-amber-800/20 blur-xl opacity-60 mx-auto" />
                                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto shadow-lg">
                                    <MessageSquare className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No feedback yet
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                                Feedback from mentors and participants will appear here after task submissions and project reviews.
                            </p>
                        </div>
                    )}
                </CardContent>

                {/* {feedback.length > 0 && (
                    <CardFooter className="border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full group hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                        >
                            <Link
                                href={projectId ? `/Learner/dashboard/projects/${projectId}/feedback` : "/dashboard/feedback"}
                                className="flex items-center justify-center"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                View All Feedback
                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                            </Link>
                        </Button>
                    </CardFooter>
                )} */}
            </Card>
        </motion.div>
    );
}