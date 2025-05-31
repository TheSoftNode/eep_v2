"use client"

import { useRef, useEffect, useState } from 'react';
import { Paperclip, DownloadCloud, MessageSquare, CheckCircle2, Clock, ThumbsUp, Smile, MoreHorizontal, Reply, Edit, Copy, Trash2, Pin, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate } from '@/components/utils/dateUtils';
import MessageReactions from './MessageReactions';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { WorkspaceMessage } from '@/Redux/types/Workspace/workspace-messaging-types';

interface MessageGroup {
    date: string;
    messages: WorkspaceMessage[];
}

interface MessageListProps {
    messages: WorkspaceMessage[];
    autoScroll?: boolean;
    isLoading?: boolean;
    currentUserId?: string;
    onReply?: (message: WorkspaceMessage) => void;
    onReact?: (messageId: string, reaction: string) => void;
    onEdit?: (message: WorkspaceMessage) => void;
    onDelete?: (messageId: string) => void;
    onPin?: (messageId: string) => void;
    userPermissions?: {
        canPin: boolean;
        canDeleteOthers: boolean;
    };
}

export default function MessageList({
    messages,
    autoScroll = true,
    isLoading = false,
    currentUserId = '',
    onReply,
    onReact,
    onEdit,
    onDelete,
    onPin,
    userPermissions = {
        canPin: false,
        canDeleteOthers: false
    }
}: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
    const [atBottom, setAtBottom] = useState(true);

    // Common emojis for quick reactions
    const quickReactions = ["👍", "❤️", "😂", "😍", "👏", "🔥", "💯"];


    // Check if user is at bottom when scrolling
    const handleScroll = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const isAtBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 20;
            setAtBottom(isAtBottom);
        }
    };

    // Add scroll event listener
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Initial scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            if (atBottom && autoScroll) {
                container.scrollTop = container.scrollHeight;
            }
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, [atBottom, autoScroll]);


    // Scroll to bottom when messages change if user was at bottom or new message is from current user
    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const lastMessage = messages[messages.length - 1];
        const isCurrentUserMessage = lastMessage?.senderId === currentUserId;

        if ((autoScroll && atBottom) || isCurrentUserMessage) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, autoScroll, atBottom, currentUserId]);



    // Get avatar fallback colors based on role
    const getAvatarStyles = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300';
            case 'mentor':
                return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
            case 'learner':
                return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
        }
    };

    // Get role badge styles
    const getRoleBadgeStyles = (role: string) => {
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


    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );


    // Group messages by date
    const groupedMessages: MessageGroup[] = sortedMessages.reduce((groups, message) => {
        const date = formatDate(message.createdAt);

        const existingGroup = groups.find(group => group.date === date);
        if (existingGroup) {
            existingGroup.messages.push(message);
        } else {
            groups.push({ date, messages: [message] });
        }

        return groups;
    }, [] as MessageGroup[]);

    // Check if message is from current user
    const isCurrentUserMessage = (message: WorkspaceMessage) => {
        return message.senderId === currentUserId;
    };

    // Check if user can edit message
    const canEditMessage = (message: WorkspaceMessage) => {
        return isCurrentUserMessage(message) && message.messageType === 'text';
    };

    // Check if user can delete message
    const canDeleteMessage = (message: WorkspaceMessage) => {
        return isCurrentUserMessage(message) || userPermissions.canDeleteOthers;
    };

    // Handle message actions
    const handleReply = (message: WorkspaceMessage) => {
        if (onReply) onReply(message);
    };

    const handleReact = (messageId: string, reaction: string) => {
        if (onReact) onReact(messageId, reaction);
    };

    const handleEdit = (message: WorkspaceMessage) => {
        if (onEdit) onEdit(message);
    };

    const handleDelete = (messageId: string) => {
        if (onDelete) onDelete(messageId);
    };

    const handlePin = (messageId: string) => {
        if (onPin) onPin(messageId);
    };

    // Count total reactions on a message
    const getTotalReactions = (reactions: Record<string, string[]>) => {
        return Object.values(reactions).reduce((total, users) => total + users.length, 0);
    };

    // If loading, show skeleton loader
    if (isLoading && !messages.length) {
        return (
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-900/30">
                {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <div className="flex">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12 ml-2" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (!isLoading && messages.length === 0) {
        return (
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-900/30"
            >
                <div className="h-full flex flex-col items-center justify-center text-center p-4 mt-auto">
                    <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No messages yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                        Start the conversation by sending the first message in this channel.
                    </p>
                </div>
                <div ref={messagesEndRef} />
            </div>
        );
    }

    return (
        <div
            className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/30 flex flex-col"
            ref={containerRef}
        >
            {/* <div className="flex-1" />  */}

            {groupedMessages.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4 mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-gray-50 dark:bg-gray-900 px-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {group.date}
                            </span>
                        </div>
                    </div>

                    {group.messages.map((message) => (
                        <div
                            key={message.id}
                            id={`message-${message.id}`}
                            className={`group relative rounded-lg ${hoveredMessageId === message.id
                                ? 'bg-gray-100 dark:bg-gray-800/60'
                                : ''
                                } transition-all duration-300`}
                            onMouseEnter={() => setHoveredMessageId(message.id)}
                            onMouseLeave={() => setHoveredMessageId(null)}
                        >
                            {/* Pin indicator */}
                            {message.isPinned && (
                                <div className="absolute -top-2 -left-2 flex items-center justify-center w-5 h-5 bg-yellow-400 dark:bg-yellow-600 rounded-full shadow-sm">
                                    <Pin className="h-3 w-3 text-white" />
                                </div>
                            )}

                            <div className="flex items-start space-x-3 p-2">
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    {message.senderAvatar && (
                                        <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                                    )}
                                    <AvatarFallback className={getAvatarStyles(message.senderRole)}>
                                        {message.senderName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-1 min-w-0 overflow-hidden">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{message.senderName}</span>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs px-1.5 py-0 h-5 ${getRoleBadgeStyles(message.senderRole)}`}
                                        >
                                            {message.senderRole}
                                        </Badge>

                                        {message.edited && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 italic">(edited)</span>
                                        )}

                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto flex items-center">
                                            {message.readBy && message.readBy.length > 0 && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Read by {message.readBy.length} people</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatDate(message.createdAt)}
                                        </span>
                                    </div>

                                    {/* Message content */}
                                    <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                        {message.content}
                                    </div>

                                    {/* Voice message player */}
                                    {message.messageType === 'voice-note' && message.attachments && message.attachments.length > 0 && (
                                        <div className="mt-2">
                                            <VoiceMessagePlayer
                                                url={message.attachments[0].url}
                                                filename={message.attachments[0].name}
                                                duration={message.attachments[0]?.duration || 0}
                                            />
                                        </div>
                                    )}

                                    {/* Message attachments */}
                                    {message.attachments && message.attachments.length > 0 && message.messageType !== 'voice-note' && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {message.attachments.map(attachment => (
                                                <a
                                                    key={attachment.id}
                                                    href={attachment.url}
                                                    className="inline-flex items-center text-xs rounded-md px-2 py-1 border transition-colors hover:border-indigo-300 dark:hover:border-indigo-700"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        backgroundColor: attachment.type === 'image'
                                                            ? 'rgba(147, 51, 234, 0.1)' // Purple
                                                            : attachment.type === 'document' || attachment.type === 'pdf'
                                                                ? 'rgba(239, 68, 68, 0.1)' // Red
                                                                : attachment.type === 'code'
                                                                    ? 'rgba(16, 185, 129, 0.1)' // Green
                                                                    : 'rgba(59, 130, 246, 0.1)', // Blue
                                                        borderColor: attachment.type === 'image'
                                                            ? 'rgba(147, 51, 234, 0.2)'
                                                            : attachment.type === 'document' || attachment.type === 'pdf'
                                                                ? 'rgba(239, 68, 68, 0.2)'
                                                                : attachment.type === 'code'
                                                                    ? 'rgba(16, 185, 129, 0.2)'
                                                                    : 'rgba(59, 130, 246, 0.2)',
                                                        color: attachment.type === 'image'
                                                            ? 'rgb(147, 51, 234)'
                                                            : attachment.type === 'document' || attachment.type === 'pdf'
                                                                ? 'rgb(239, 68, 68)'
                                                                : attachment.type === 'code'
                                                                    ? 'rgb(16, 185, 129)'
                                                                    : 'rgb(59, 130, 246)'
                                                    }}
                                                >
                                                    <Paperclip className="h-3 w-3 mr-1.5" />
                                                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{attachment.name}</span>
                                                    <DownloadCloud className="h-3 w-3 ml-1.5" />
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Message reactions */}
                                    {message.reactions && getTotalReactions(message.reactions) > 0 && (
                                        <div className="mt-1">
                                            <MessageReactions
                                                reactions={message.reactions}
                                                currentUserId={currentUserId}
                                                onReact={(emoji) => handleReact(message.id, emoji)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Message actions */}
                                <div className={`flex items-center space-x-1 ${hoveredMessageId === message.id ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity`}>
                                    {/* Quick reactions */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                            >
                                                <Smile className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="bg-white dark:bg-gray-900 p-1 flex space-x-1">
                                            {quickReactions.map(emoji => (
                                                <Button
                                                    key={emoji}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                                    onClick={() => handleReact(message.id, emoji)}
                                                >
                                                    {emoji}
                                                </Button>
                                            ))}
                                        </PopoverContent>
                                    </Popover>

                                    {/* Reply */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                        onClick={() => handleReply(message)}
                                    >
                                        <Reply className="h-4 w-4" />
                                    </Button>

                                    {/* More actions */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                            <DropdownMenuItem
                                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => handleReply(message)}
                                            >
                                                <Reply className="h-4 w-4 mr-2" />
                                                Reply
                                            </DropdownMenuItem>

                                            {canEditMessage(message) && (
                                                <DropdownMenuItem
                                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    onClick={() => handleEdit(message)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuItem
                                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => navigator.clipboard.writeText(message.content)}
                                            >
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy text
                                            </DropdownMenuItem>

                                            {userPermissions.canPin && (
                                                <DropdownMenuItem
                                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    onClick={() => handlePin(message.id)}
                                                >
                                                    <Pin className="h-4 w-4 mr-2" />
                                                    {message.isPinned ? 'Unpin' : 'Pin'} message
                                                </DropdownMenuItem>
                                            )}

                                            {canDeleteMessage(message) && (
                                                <>
                                                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        onClick={() => handleDelete(message.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* This div is used as an anchor for auto-scrolling */}
            <div ref={messagesEndRef} />

            {/* Scroll to bottom button - shown when not at bottom */}
            {!atBottom && messages.length > 0 && (
                <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-20 right-4 rounded-full bg-indigo-600 text-white dark:text-white dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-700 shadow-md p-2 h-10 w-10"
                    onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <ChevronDown className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
}

