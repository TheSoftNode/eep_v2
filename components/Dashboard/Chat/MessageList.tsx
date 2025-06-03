import React, { useRef, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, Download, FileText, MoreHorizontal, Edit, Trash2, Reply, MessageSquare } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isToday, isYesterday, isThisYear } from 'date-fns';
import { Conversation, Message } from '@/Redux/types/Chats/chat';
import { useGetCurrentUserQuery } from '@/Redux/apiSlices/users/profileApi';


interface MessageListProps {
    conversation: Conversation;
    onDeleteMessage?: (messageId: string) => Promise<void>;
    onEditMessage?: (messageId: string, content: string) => Promise<void>;
}

export const MessageList: React.FC<MessageListProps> = ({
    conversation,
    onDeleteMessage,
    onEditMessage
}) => {
    // Get current user
    const { data: userData } = useGetCurrentUserQuery();
    const currentUserId = userData?.user?.id;

    // Refs
    const messageEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const prevMessageLengthRef = useRef(0);
    const initialLoadRef = useRef(false);

    // State for editing messages
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    // Helper functions for date formatting
    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return format(date, 'h:mm a');
    };

    const formatMessageDate = (timestamp: string) => {
        const date = new Date(timestamp);

        if (isToday(date)) {
            return 'Today';
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else if (isThisYear(date)) {
            return format(date, 'MMMM d');
        } else {
            return format(date, 'MMMM d, yyyy');
        }
    };

    // Group messages by date
    const messages = conversation.messages || [];
    const groupedMessages: { [key: string]: Message[] } = {};

    // First, create a sorted messages array in chronological order (oldest to newest)
    const sortedMessages = [...messages].sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Then group the sorted messages by date
    sortedMessages.forEach(message => {
        const date = formatMessageDate(message.timestamp);
        if (!groupedMessages[date]) {
            groupedMessages[date] = [];
        }
        groupedMessages[date].push(message);
    });


    // IMPORTANT FIX: Get dates in chronological order - not reverse chronological
    const sortedDates = Object.keys(groupedMessages).sort((a, b) => {
        // First convert date strings to actual dates for proper comparison
        // Special handling for "Today" and "Yesterday"
        let dateValueA, dateValueB;

        if (a === "Today") {
            dateValueA = new Date(); // Today
        } else if (a === "Yesterday") {
            dateValueA = new Date();
            dateValueA.setDate(dateValueA.getDate() - 1); // Yesterday
        } else {
            dateValueA = new Date(a); // Other date strings
        }

        if (b === "Today") {
            dateValueB = new Date();
        } else if (b === "Yesterday") {
            dateValueB = new Date();
            dateValueB.setDate(dateValueB.getDate() - 1);
        } else {
            dateValueB = new Date(b);
        }

        // Sort in ascending order (older dates first)
        return dateValueA.getTime() - dateValueB.getTime();
    });

    // Custom scroll function
    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        // Only scroll if there are actually NEW messages (not just on load)
        if (messages.length > 0 &&
            (messages.length > prevMessageLengthRef.current || !initialLoadRef.current)) {

            // Add a small delay to ensure content is rendered before scrolling
            setTimeout(() => {
                scrollToBottom();
                initialLoadRef.current = true;
            }, 100);
        }

        // Update the previous length reference
        prevMessageLengthRef.current = messages.length;
    }, [messages]);

    // Handle message editing
    const handleStartEditing = (message: Message) => {
        setEditingMessageId(message.id);
        setEditContent(message.content);
    };

    const handleCancelEditing = () => {
        setEditingMessageId(null);
        setEditContent('');
    };

    const handleSaveEdit = async () => {
        if (editingMessageId && onEditMessage) {
            await onEditMessage(editingMessageId, editContent);
            setEditingMessageId(null);
            setEditContent('');
        }
    };

    // Get avatar colors based on role with dark mode support
    const getAvatarColorClass = (userId: string) => {
        const participant = conversation.participants.find(p => p.id === userId);
        if (!participant) return "bg-slate-600 dark:bg-slate-500";

        switch (participant.role) {
            case 'admin': return "bg-red-600 dark:bg-red-500";
            case 'mentor': return "bg-blue-600 dark:bg-blue-500";
            case 'learner': return "bg-indigo-600 dark:bg-indigo-500";
            case 'user': return "bg-purple-600 dark:bg-purple-500";
            default: return "bg-emerald-600 dark:bg-emerald-500"; // peers/students
        }
    };

    return (
        <div className="flex-1 overflow-hidden p-4 bg-white dark:bg-transparent">
            <div
                ref={scrollContainerRef}
                className="h-full pr-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
            >
                {sortedDates.map((date) => (
                    <div key={date} className="mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50">
                                {date}
                            </div>
                        </div>
                        <div className="space-y-4">
                            {groupedMessages[date].map((msg) => {
                                const isCurrentUser = msg.senderId === currentUserId;
                                const sender = conversation.participants.find(p => p.id === msg.senderId);

                                return (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[80%]",
                                            isCurrentUser ? "ml-auto items-end" : "mr-auto items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-start gap-3",
                                            isCurrentUser && "flex-row-reverse"
                                        )}>
                                            {!isCurrentUser && sender && (
                                                <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white dark:ring-slate-700/50 shadow-sm">
                                                    <AvatarImage src={sender.profilePicture || undefined} />
                                                    <AvatarFallback className={cn("text-white", getAvatarColorClass(msg.senderId))}>
                                                        {sender.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "p-3 rounded-lg group relative shadow-sm backdrop-blur-sm transition-all duration-200",
                                                isCurrentUser
                                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none shadow-indigo-500/20"
                                                    : "bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/50 dark:border-slate-600/50",
                                                editingMessageId === msg.id && "border-2 border-blue-400 dark:border-blue-500"
                                            )}>
                                                {!isCurrentUser && sender && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{sender.fullName}</p>
                                                )}

                                                {editingMessageId === msg.id ? (
                                                    <div className="space-y-2">
                                                        <textarea
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 min-h-[100px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                                                onClick={handleCancelEditing}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                                                onClick={handleSaveEdit}
                                                            >
                                                                Save
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                                )}

                                                {isCurrentUser && onDeleteMessage && onEditMessage && (
                                                    <div className={cn(
                                                        "absolute -top-10 right-0 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-1 border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm",
                                                        editingMessageId === msg.id && "hidden"
                                                    )}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-slate-700">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStartEditing(msg)}
                                                                    className="dark:hover:bg-slate-700/50 dark:text-slate-300"
                                                                >
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="dark:hover:bg-slate-700/50 dark:text-slate-300">
                                                                    <Reply className="h-4 w-4 mr-2" />
                                                                    Reply
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="dark:border-slate-700/50" />
                                                                <DropdownMenuItem
                                                                    onClick={() => onDeleteMessage(msg.id)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Attachments */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className={cn(
                                                "mt-2 space-y-2",
                                                isCurrentUser ? "text-right" : "text-left"
                                            )}>
                                                {msg.attachments.map((attachment) => (
                                                    <div
                                                        key={attachment.id}
                                                        className={cn(
                                                            "inline-block p-2 border rounded-lg backdrop-blur-sm",
                                                            isCurrentUser
                                                                ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50"
                                                                : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600/50"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "h-8 w-8 rounded-lg flex items-center justify-center",
                                                                isCurrentUser
                                                                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                                                    : "bg-slate-100 dark:bg-slate-600/50 text-slate-600 dark:text-slate-400"
                                                            )}>
                                                                <FileText className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium truncate dark:text-slate-200">
                                                                    {attachment.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {typeof attachment.size === 'number'
                                                                        ? `${Math.round(attachment.size / 1024)} KB`
                                                                        : attachment.size}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 dark:hover:bg-slate-600/50"
                                                                onClick={() => window.open(attachment.url, '_blank')}
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className={cn(
                                            "text-xs text-slate-500 dark:text-slate-400 mt-1",
                                            isCurrentUser ? "text-right" : "text-left"
                                        )}>
                                            {formatMessageTime(msg.timestamp)}
                                            {isCurrentUser && (
                                                <span className="ml-1">
                                                    {msg.readBy && msg.readBy.length > 1 ? (
                                                        <CheckCircle className="h-3 w-3 text-emerald-500 inline" />
                                                    ) : (
                                                        <CheckCircle className="h-3 w-3 text-slate-400 dark:text-slate-500 inline" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg max-w-md space-y-4 border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
                                <MessageSquare className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No messages yet</h3>
                            <p className="text-slate-500 dark:text-slate-400">Start the conversation by sending a message below.</p>
                        </div>
                    </div>
                )}
                <div ref={messageEndRef} />
            </div>
        </div>
    );
};