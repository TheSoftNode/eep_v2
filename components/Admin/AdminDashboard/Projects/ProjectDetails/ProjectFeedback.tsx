import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Plus,
    Star,
    Reply,
    MoreVertical,
    Edit3,
    Trash2,
    Flag,
    Eye,
    Filter,
    Clock,
    User,
    Award,
    ThumbsUp,
    AlertCircle,
    Loader2,
    LinkIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
    useGetProjectFeedbackQuery,
    useDeleteProjectFeedbackMutation
} from '@/Redux/apiSlices/Projects/projectsApiSlice';
import AddFeedbackModal from '../Feedback/AddFeedbackModal';

interface ProjectFeedbackProps {
    projectId: string;
    projectName?: string;
    canManage: boolean;
    limit?: number;
    className?: string;
}

const getFeedbackTypeColor = (type: string) => {
    switch (type) {
        case 'guidance':
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
        case 'review':
            return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50';
        case 'approval':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
        case 'rejection':
            return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
        case 'general':
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case 'mentor':
            return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50';
        case 'admin':
            return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50';
        case 'peer':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
        case 'external':
            return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
};

const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) :
        date._seconds ? new Date(date._seconds * 1000) : date;
    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatTimeAgo = (date: any) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) :
        date._seconds ? new Date(date._seconds * 1000) : date;
    const now = new Date();
    const diffTime = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(date);
};

const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const ProjectFeedback: React.FC<ProjectFeedbackProps> = ({
    projectId,
    projectName,
    canManage,
    limit = 5,
    className = ""
}) => {
    const { toast } = useToast();
    const [typeFilter, setTypeFilter] = useState('all');
    const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // API hooks
    const {
        data: feedbackResponse,
        isLoading: isLoadingFeedback,
        error: feedbackError,
        refetch: refetchFeedback
    } = useGetProjectFeedbackQuery({
        projectId,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        limit,
        page: 1
    });

    const [deleteFeedback, { isLoading: isDeletingFeedback }] = useDeleteProjectFeedbackMutation();

    const feedback = feedbackResponse?.data || [];

    const handleAddFeedback = () => {
        setShowAddModal(true);
    };

    const handleFeedbackSuccess = () => {
        refetchFeedback();
        toast({
            title: "Success",
            description: "Feedback list has been refreshed with your new feedback.",
        });
    };

    const handleDeleteFeedback = async (feedbackId: string, authorName: string) => {
        if (!confirm(`Are you sure you want to delete feedback from ${authorName}?`)) {
            return;
        }

        try {
            await deleteFeedback({ projectId, feedbackId }).unwrap();
            toast({
                title: "Feedback Deleted",
                description: `Feedback from ${authorName} has been removed.`,
            });
        } catch (error: any) {
            toast({
                title: "Failed to Delete Feedback",
                description: error?.data?.message || "An error occurred while deleting the feedback.",
                variant: "destructive",
            });
        }
    };

    const toggleExpanded = (feedbackId: string) => {
        setExpandedFeedback(expandedFeedback === feedbackId ? null : feedbackId);
    };

    if (isLoadingFeedback) {
        return (
            <Card className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg", className)}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-32 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded animate-pulse" />
                        <div className="h-8 w-20 bg-orange-100 dark:bg-orange-900/30 rounded-md animate-pulse" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
                            <div className="h-10 w-10 bg-orange-200 dark:bg-orange-800 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded" />
                                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                                <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={className}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                    {/* Gradient accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-600 opacity-60 rounded-t-lg" />

                    <CardHeader className="relative">
                        <div className="flex items-center flex-wrap gap-3 justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                                    <MessageSquare className="h-4 w-4" />
                                </div>
                                Project Feedback
                            </CardTitle>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-medium">
                                    {feedback.length} feedback
                                </Badge>
                                {canManage && (
                                    <Button
                                        size="sm"
                                        onClick={handleAddFeedback}
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Feedback
                                    </Button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            Reviews and guidance from mentors and participants
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Filter */}
                        {feedback.length > 0 && (
                            <div className="flex items-center justify-between">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-40">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="guidance">Guidance</SelectItem>
                                        <SelectItem value="review">Review</SelectItem>
                                        <SelectItem value="approval">Approval</SelectItem>
                                        <SelectItem value="rejection">Rejection</SelectItem>
                                        <SelectItem value="general">General</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Feedback List */}
                        {feedback.length > 0 ? (
                            <div className="space-y-4">
                                {feedback.map((item) => {
                                    const isExpanded = expandedFeedback === item.id;
                                    const shouldTruncate = item.content.length > 150;
                                    const displayContent = isExpanded || !shouldTruncate
                                        ? item.content
                                        : `${item.content.substring(0, 150)}...`;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
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
                                                            {item.authorRole}
                                                        </Badge>
                                                        <Badge className={cn("text-xs font-medium border", getFeedbackTypeColor(item.type))}>
                                                            {item.type}
                                                        </Badge>
                                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTimeAgo(item.createdAt)}
                                                        </div>
                                                    </div>

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
                                                        <div className="flex items-center  gap-2 mb-3">
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={cn(
                                                                            "h-4 w-4",
                                                                            i < item.rating!
                                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                                : 'text-slate-300 dark:text-slate-600'
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
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

                                                    {/* Attachments */}
                                                    {item.attachments && item.attachments.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {item.attachments.map((attachment, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {attachment.fileType === 'link' && <LinkIcon className="h-3 w-3 mr-1" />}
                                                                    {attachment.fileName}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                        >
                                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                                            Helpful
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                        >
                                                            <Reply className="h-3 w-3 mr-1" />
                                                            Reply
                                                        </Button>
                                                    </div>
                                                </div>

                                                {canManage && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit3 className="h-4 w-4 mr-2" />
                                                                Edit Feedback
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Flag className="h-4 w-4 mr-2" />
                                                                Mark Important
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteFeedback(item.id, item.authorName)}
                                                                className="text-red-600 focus:text-red-600"
                                                                disabled={isDeletingFeedback}
                                                            >
                                                                {isDeletingFeedback ? (
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                )}
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 blur-xl opacity-60 mx-auto" />
                                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg">
                                        <MessageSquare className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    {typeFilter !== 'all' ? 'No feedback found' : 'No feedback yet'}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                                    {typeFilter !== 'all'
                                        ? 'Try changing the filter to see different types of feedback.'
                                        : 'Feedback from mentors and participants will appear here to help improve the project.'
                                    }
                                </p>
                                {canManage && typeFilter === 'all' && (
                                    <Button
                                        onClick={handleAddFeedback}
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Feedback
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* View All Button */}
                        {feedback.length >= limit && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Button
                                    variant="outline"
                                    className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    View All Feedback
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Add Feedback Modal */}
            <AddFeedbackModal
                projectId={projectId}
                projectName={projectName}
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleFeedbackSuccess}
            />
        </>
    );
};

export default ProjectFeedback;