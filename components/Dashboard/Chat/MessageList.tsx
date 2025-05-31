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

    // Get avatar colors based on role
    const getAvatarColorClass = (userId: string) => {
        const participant = conversation.participants.find(p => p.id === userId);
        if (!participant) return "bg-gray-600";

        switch (participant.role) {
            case 'admin': return "bg-red-600";
            case 'mentor': return "bg-blue-600";
            case 'learner': return "bg-indigo-600";
            case 'user': return "bg-purple-600";
            default: return "bg-green-600"; // peers/students
        }
    };

    return (
        <div className="flex-1 overflow-hidden p-4">
            <div
                ref={scrollContainerRef}
                className="h-full pr-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
            >
                {sortedDates.map((date) => (
                    <div key={date} className="mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
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
                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                    <AvatarImage src={sender.profilePicture || undefined} />
                                                    <AvatarFallback className={cn("text-white", getAvatarColorClass(msg.senderId))}>
                                                        {sender.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "p-3 rounded-lg group relative",
                                                isCurrentUser
                                                    ? "bg-indigo-600 text-white rounded-br-none"
                                                    : "bg-gray-100 text-gray-800 rounded-bl-none",
                                                editingMessageId === msg.id && "border-2 border-blue-400"
                                            )}>
                                                {!isCurrentUser && sender && (
                                                    <p className="text-xs text-gray-500 mb-1">{sender.fullName}</p>
                                                )}

                                                {editingMessageId === msg.id ? (
                                                    <div className="space-y-2">
                                                        <textarea
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="w-full p-2 border rounded-md text-black min-h-[100px]"
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="bg-white"
                                                                onClick={handleCancelEditing}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="bg-indigo-600 hover:bg-indigo-700"
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
                                                        "absolute -top-10 right-0 bg-white shadow-lg rounded-lg p-1 border opacity-0 group-hover:opacity-100 transition-opacity",
                                                        editingMessageId === msg.id && "hidden"
                                                    )}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleStartEditing(msg)}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Reply className="h-4 w-4 mr-2" />
                                                                    Reply
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => onDeleteMessage(msg.id)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                                                            "inline-block p-2 border rounded-lg",
                                                            isCurrentUser
                                                                ? "bg-indigo-50 border-indigo-200"
                                                                : "bg-gray-50 border-gray-200"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "h-8 w-8 rounded-lg flex items-center justify-center",
                                                                isCurrentUser
                                                                    ? "bg-indigo-100 text-indigo-600"
                                                                    : "bg-gray-100 text-gray-600"
                                                            )}>
                                                                <FileText className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium truncate">
                                                                    {attachment.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {typeof attachment.size === 'number'
                                                                        ? `${Math.round(attachment.size / 1024)} KB`
                                                                        : attachment.size}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
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
                                            "text-xs text-gray-500 mt-1",
                                            isCurrentUser ? "text-right" : "text-left"
                                        )}>
                                            {formatMessageTime(msg.timestamp)}
                                            {isCurrentUser && (
                                                <span className="ml-1">
                                                    {msg.readBy && msg.readBy.length > 1 ? (
                                                        <CheckCircle className="h-3 w-3 text-green-500 inline" />
                                                    ) : (
                                                        <CheckCircle className="h-3 w-3 text-gray-400 inline" />
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
                        <div className="text-center p-6 bg-purple-50 rounded-lg max-w-md space-y-4">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
                            <p className="text-gray-500">Start the conversation by sending a message below.</p>
                        </div>
                    </div>
                )}
                <div ref={messageEndRef} />
            </div>
        </div>
    );
};

