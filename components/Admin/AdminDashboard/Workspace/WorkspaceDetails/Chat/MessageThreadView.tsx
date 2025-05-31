"use client"

import { useState, useEffect } from 'react';
import { X, MessageSquare, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/components/utils/dateUtils';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import MessageReactions from './MessageReactions';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import ChatInput from './ChatInput';
import { MessageResponse, WorkspaceMessage } from '@/Redux/types/Workspace/workspace-messaging-types';

interface MessageThreadViewProps {
    isOpen: boolean;
    onClose: () => void;
    originalMessage: WorkspaceMessage | null;
    replies: WorkspaceMessage[];
    workspaceId: string;
    currentUserId: string;
    onSendReply: (content: string, attachments?: File[]) => Promise<MessageResponse | undefined>;
    onReact: (messageId: string, reaction: string) => void;
}

export default function MessageThreadView({
    isOpen,
    onClose,
    originalMessage,
    replies,
    workspaceId,
    currentUserId,
    onSendReply,
    onReact
}: MessageThreadViewProps) {
    const [isSending, setIsSending] = useState(false);

    // Handle sending a reply
    const handleSendReply = async (content: string, attachments?: File[]) => {
        if (!originalMessage) return;

        try {
            setIsSending(true);
            await onSendReply(content, attachments);
        } catch (error) {
            console.error('Error sending reply:', error);
        } finally {
            setIsSending(false);
        }
    };

    // Get avatar fallback (initials)
    const getAvatarFallback = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    // Get avatar style based on role
    const getAvatarStyle = (role: string = 'user') => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300';
            case 'mentor':
                return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
            case 'learner':
                return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300';
        }
    };

    // Get role badge style
    const getRoleBadgeStyle = (role: string = 'user') => {
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

    // If no original message, don't render
    if (!originalMessage) return null;

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="h-[85vh] rounded-t-lg">
                <DrawerHeader className="border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 mr-2 text-gray-600 dark:text-gray-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <DrawerTitle className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                            Thread
                        </DrawerTitle>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col h-full">
                    <ScrollArea className="flex-1 p-4">
                        {/* Original message */}
                        <div className="mb-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50">
                            <div className="flex items-start space-x-3">
                                <Avatar>
                                    {originalMessage.senderAvatar && (
                                        <AvatarImage src={originalMessage.senderAvatar} alt={originalMessage.senderName} />
                                    )}
                                    <AvatarFallback className={getAvatarStyle(originalMessage.senderRole)}>
                                        {getAvatarFallback(originalMessage.senderName)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center mb-1">
                                        <span className="font-medium text-gray-900 dark:text-gray-100 mr-2">
                                            {originalMessage.senderName}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs px-1.5 py-0 h-5 ${getRoleBadgeStyle(originalMessage.senderRole)}`}
                                        >
                                            {originalMessage.senderRole}
                                        </Badge>
                                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(originalMessage.createdAt)}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                        {originalMessage.content}
                                    </div>

                                    {/* Voice message */}
                                    {originalMessage.messageType === 'voice-note' && originalMessage.attachments && originalMessage.attachments.length > 0 && (
                                        <div className="mt-2">
                                            <VoiceMessagePlayer
                                                url={originalMessage.attachments[0].url}
                                                filename={originalMessage.attachments[0].name}
                                                duration={originalMessage.attachments[0].duration || 0}
                                            />
                                        </div>
                                    )}

                                    {/* Attachments */}
                                    {originalMessage.attachments && originalMessage.attachments.length > 0 && originalMessage.messageType !== 'voice-note' && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {originalMessage.attachments.map(attachment => (
                                                <a
                                                    key={attachment.id}
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs rounded-md px-2 py-1 border border-indigo-200 dark:border-indigo-800/50 
                                                            bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 
                                                            hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                                                >
                                                    <span className="truncate max-w-[150px]">{attachment.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reactions */}
                                    {originalMessage.reactions && Object.keys(originalMessage.reactions).length > 0 && (
                                        <div className="mt-2">
                                            <MessageReactions
                                                reactions={originalMessage.reactions}
                                                currentUserId={currentUserId}
                                                onReact={(emoji) => onReact(originalMessage.id, emoji)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Thread replies */}
                        {replies.length === 0 ? (
                            <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
                                <p>No replies yet</p>
                                <p className="text-sm mt-1">Be the first to reply to this thread</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <Avatar>
                                            {reply.senderAvatar && (
                                                <AvatarImage src={reply.senderAvatar} alt={reply.senderName} />
                                            )}
                                            <AvatarFallback className={getAvatarStyle(reply.senderRole)}>
                                                {getAvatarFallback(reply.senderName)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center mb-1">
                                                <span className="font-medium text-gray-900 dark:text-gray-100 mr-2">
                                                    {reply.senderName}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs px-1.5 py-0 h-5 ${getRoleBadgeStyle(reply.senderRole)}`}
                                                >
                                                    {reply.senderRole}
                                                </Badge>
                                                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(reply.createdAt)}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                                {reply.content}
                                            </div>

                                            {/* Voice message */}
                                            {reply.messageType === 'voice-note' && reply.attachments && reply.attachments.length > 0 && (
                                                <div className="mt-2">
                                                    <VoiceMessagePlayer
                                                        url={reply.attachments[0].url}
                                                        filename={reply.attachments[0].name}
                                                        duration={reply.attachments[0].duration || 0}
                                                    />
                                                </div>
                                            )}

                                            {/* Attachments */}
                                            {reply.attachments && reply.attachments.length > 0 && reply.messageType !== 'voice-note' && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {reply.attachments.map(attachment => (
                                                        <a
                                                            key={attachment.id}
                                                            href={attachment.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center text-xs rounded-md px-2 py-1 border border-gray-200 dark:border-gray-800 
                                                                    bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 
                                                                    hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                        >
                                                            <span className="truncate max-w-[150px]">{attachment.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Reactions */}
                                            {reply.reactions && Object.keys(reply.reactions).length > 0 && (
                                                <div className="mt-2">
                                                    <MessageReactions
                                                        reactions={reply.reactions}
                                                        currentUserId={currentUserId}
                                                        onReact={(emoji) => onReact(reply.id, emoji)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Reply input */}
                    <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                        <ChatInput
                            workspaceId={workspaceId}
                            onSendMessage={handleSendReply}
                            isLoading={isSending}
                            replyingToMessage={null} // We don't need this since we're already in thread view
                        />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}