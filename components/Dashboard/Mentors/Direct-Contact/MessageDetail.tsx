import React, { useState } from 'react';
import { MoreVertical, Star, StarOff, Trash2, Reply, Send, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageData, SendMessageRequest } from '@/Redux/types/Users/mentorMessage';
import { formatDistanceToNow } from 'date-fns';

interface MessageDetailProps {
    message: MessageData | null;
    onToggleStar: (messageId: string) => void;
    onDelete: (messageId: string) => void;
    onReply: (replyData: SendMessageRequest) => void;
    isSendingReply?: boolean;
}

const MessageDetail: React.FC<MessageDetailProps> = ({
    message,
    onToggleStar,
    onDelete,
    onReply,
    isSendingReply = false
}) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Unknown time';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
            case 'normal': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            case 'low': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
            default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
        }
    };

    const getSenderIcon = (role: string) => {
        return role === 'admin' ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
            </div>
        ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                {role === 'learner' ? 'L' : role.charAt(0).toUpperCase()}
            </div>
        );
    };

    const handleReply = () => {
        if (!replyContent.trim() || !message) return;

        const replyData: SendMessageRequest = {
            recipientId: message.senderId,
            subject: message.subject.startsWith('Re:')
                ? message.subject
                : `Re: ${message.subject}`,
            content: replyContent.trim(),
            threadId: message.threadId,
            replyToId: message.id,
            priority: 'normal'
        };

        onReply(replyData);
        setReplyContent('');
        setShowReplyForm(false);
    };

    if (!message) {
        return (
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-12 text-center">
                    <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Select a message to read
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Choose a message from the list to view its contents and reply.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        {getSenderIcon(message.senderRole)}
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                {message.subject}
                            </CardTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                From: {message.senderName} • {formatTime(message.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onToggleStar(message.id)}>
                                    {message.isStarred ? (
                                        <>
                                            <StarOff className="h-4 w-4 mr-2" />
                                            Remove Star
                                        </>
                                    ) : (
                                        <>
                                            <Star className="h-4 w-4 mr-2" />
                                            Add Star
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete(message.id)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="prose dark:prose-invert max-w-none mb-6">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                    </p>
                </div>

                {/* Reply Section */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    {!showReplyForm ? (
                        <Button
                            onClick={() => setShowReplyForm(true)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Reply to {message.senderName}
                                </label>
                                <Textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Type your reply..."
                                    rows={6}
                                    className="bg-white dark:bg-slate-800"
                                />
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button
                                    onClick={handleReply}
                                    disabled={!replyContent.trim() || isSendingReply}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    {isSendingReply ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Reply
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyContent('');
                                    }}
                                    disabled={isSendingReply}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MessageDetail;