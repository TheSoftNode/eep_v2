"use client"

import { useState, useMemo } from 'react';
import { Paperclip, Download, Copy, Eye, CheckCircle, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/components/utils/dateUtils';
import { MessageAttachment } from '@/Redux/types/Workspace/workspace-messaging-types';

export interface MessageSender {
    id: string;
    name: string;
    avatar?: string;
    role: 'admin' | 'mentor' | 'learner' | string;
}

export interface ChatMessageProps {
    id: string;
    content: string;
    sender: MessageSender;
    timestamp: Date;
    edited?: boolean;
    isPinned?: boolean;
    readBy?: string[];
    reactions?: Record<string, string[]>;
    attachments?: MessageAttachment[];
    currentUserId?: string;
    onCopy?: (content: string) => void;
    className?: string;
}

export default function ChatMessage({
    id,
    content,
    sender,
    timestamp,
    edited = false,
    isPinned = false,
    readBy = [],
    reactions = {},
    attachments = [],
    currentUserId = '',
    onCopy,
    className = ''
}: ChatMessageProps) {
    const [isHovered, setIsHovered] = useState(false);

    console.log(timestamp)

    const formatMessageTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getRoleStyles = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800';
            case 'mentor':
                return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800';
            case 'learner':
                return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800';
            default:
                return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800';
        }
    };

    const getAvatarStyles = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300';
            case 'mentor':
                return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
            case 'learner':
                return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
        }
    };

    // Get attachment style based on type
    const getAttachmentStyles = (type: string) => {
        switch (type) {
            case 'image':
                return {
                    bg: 'bg-purple-50 dark:bg-purple-900/20',
                    border: 'border-purple-200 dark:border-purple-800',
                    text: 'text-purple-700 dark:text-purple-300',
                    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
                };
            case 'document':
            case 'pdf':
                return {
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-red-200 dark:border-red-800',
                    text: 'text-red-700 dark:text-red-300',
                    hover: 'hover:bg-red-100 dark:hover:bg-red-900/30'
                };
            case 'code':
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800',
                    text: 'text-green-700 dark:text-green-300',
                    hover: 'hover:bg-green-100 dark:hover:bg-green-900/30'
                };
            case 'voice-note':
                return {
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    border: 'border-yellow-200 dark:border-yellow-800',
                    text: 'text-yellow-700 dark:text-yellow-300',
                    hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                };
            default:
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-200 dark:border-blue-800',
                    text: 'text-blue-700 dark:text-blue-300',
                    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
                };
        }
    };

    // Handle copy message
    const handleCopy = () => {
        if (onCopy) {
            onCopy(content);
        } else {
            navigator.clipboard.writeText(content);
        }
    };

    // Count total reactions
    const totalReactions = useMemo(() => {
        return Object.values(reactions).reduce((total, users) => total + users.length, 0);
    }, [reactions]);

    return (
        <div
            className={`group flex items-start space-x-3 p-2 rounded-lg transition-colors ${isHovered ? 'bg-gray-100 dark:bg-gray-800/60' : ''
                } ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Avatar className="h-10 w-10 flex-shrink-0">
                {sender.avatar && (
                    <AvatarImage src={sender.avatar} alt={sender.name} />
                )}
                <AvatarFallback className={getAvatarStyles(sender.role)}>
                    {sender.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1 min-w-0 overflow-hidden">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{sender.name}</span>
                    <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0 h-5 ${getRoleStyles(sender.role)}`}
                    >
                        {sender.role}
                    </Badge>

                    {edited && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 italic">(edited)</span>
                    )}

                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto flex items-center">
                        {readBy.length > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CheckCircle className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Read by {readBy.length} people</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(timestamp)}
                    </span>
                </div>

                {/* Message content */}
                <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                    {content}
                </div>

                {/* Message attachments */}
                {attachments && attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {attachments.map(attachment => {
                            const styles = getAttachmentStyles(attachment.type);
                            return (
                                <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    className={`inline-flex items-center text-xs rounded-md px-2 py-1.5 border ${styles.bg} ${styles.border} ${styles.text} ${styles.hover} transition-colors`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Paperclip className="h-3 w-3 mr-1.5" />
                                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{attachment.name}</span>
                                    <Download className="h-3 w-3 ml-1.5" />
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Message reactions */}
                {totalReactions > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                        {Object.entries(reactions).map(([emoji, users]) => (
                            users.length > 0 && (
                                <TooltipProvider key={`${id}-${emoji}`}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={`inline-flex items-center text-xs rounded-full px-2 py-0.5 
                                                ${users.includes(currentUserId)
                                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                <span>{emoji}</span>
                                                <span className="ml-1">{users.length}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {users.length === 1
                                                    ? (users[0] === currentUserId ? 'You' : users[0])
                                                    : `${users.length} people`}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        ))}
                    </div>
                )}
            </div>

            {/* Message actions */}
            <div className={`flex items-center transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                onClick={handleCopy}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copy message</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}