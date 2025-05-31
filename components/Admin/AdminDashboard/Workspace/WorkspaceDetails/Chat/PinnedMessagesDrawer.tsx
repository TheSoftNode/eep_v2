"use client"

import { useState, useEffect } from 'react';
import { X, Pin, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/components/utils/dateUtils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPinnedMessagesQuery, useUnpinMessageMutation } from '@/Redux/apiSlices/workspaces/workspaceMessagingApi';

interface PinnedMessagesDrawerProps {
    workspaceId: string;
    isOpen: boolean;
    onClose: () => void;
    onMessageClick?: (messageId: string) => void;
    canUnpin?: boolean;
}

export default function PinnedMessagesDrawer({
    workspaceId,
    isOpen,
    onClose,
    onMessageClick,
    canUnpin = false
}: PinnedMessagesDrawerProps) {
    const { toast } = useToast();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // Get pinned messages from API
    const {
        data: pinnedMessagesData,
        isLoading,
        error,
        refetch
    } = useGetPinnedMessagesQuery(workspaceId, {
        skip: !isOpen // Only fetch when drawer is open
    });

    // Unpin message mutation
    const [unpinMessage, { isLoading: isUnpinning }] = useUnpinMessageMutation();

    // Toggle message expansion
    const toggleExpand = (messageId: string) => {
        setExpanded(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    // Handle unpin message
    const handleUnpin = async (messageId: string) => {
        try {
            await unpinMessage({ workspaceId, messageId }).unwrap();
            toast({
                title: "Success",
                description: "Message unpinned successfully",
            });
        } catch (error) {
            console.error('Error unpinning message:', error);
            toast({
                title: "Error",
                description: "Failed to unpin message",
                variant: "destructive"
            });
        }
    };

    // Handle click on a pinned message
    const handleMessageClick = (messageId: string) => {
        if (onMessageClick) {
            onMessageClick(messageId);
            onClose();
        }
    };

    // Get avatar fallback
    const getAvatarFallback = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    // Get avatar style based on role
    const getAvatarStyle = (role: string): string => {
        switch (role?.toLowerCase()) {
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

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-full sm:w-[400px] md:w-[500px] p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Pin className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
                            <SheetTitle>Pinned Messages</SheetTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <SheetDescription>
                        Important messages pinned in this workspace
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    {isLoading ? (
                        // Loading skeleton
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        // Error state
                        <div className="text-center py-8 text-red-500 dark:text-red-400">
                            <p>Failed to load pinned messages</p>
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                                className="mt-2"
                            >
                                Retry
                            </Button>
                        </div>
                    ) : pinnedMessagesData?.data?.length === 0 ? (
                        // Empty state
                        <div className="text-center py-10">
                            <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No pinned messages</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                Important messages will appear here when you pin them.
                            </p>
                        </div>
                    ) : (
                        // Pinned messages list
                        <div className="space-y-4">
                            {pinnedMessagesData?.data?.map((message: any) => (
                                <div
                                    key={message.messageId}
                                    className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
                                >
                                    <div className="p-4 bg-white dark:bg-gray-900">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center">
                                                <Avatar className="h-8 w-8 mr-2">
                                                    {message.senderAvatar && (
                                                        <AvatarImage src={message.senderAvatar} alt={message.messageSender} />
                                                    )}
                                                    <AvatarFallback className={getAvatarStyle(message.senderRole)}>
                                                        {getAvatarFallback(message.messageSender)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                        {message.messageSender}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(message.createdAt)}
                                                    </div>
                                                </div>
                                            </div>

                                            {canUnpin && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleUnpin(message.messageId)}
                                                    disabled={isUnpinning}
                                                    className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                                >
                                                    <Pin className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>

                                        <div
                                            className={`text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words ${expanded[message.messageId] ? '' : 'line-clamp-3'}`}
                                        >
                                            {message.messageContent}
                                        </div>

                                        {/* Expand/collapse and go to message buttons */}
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                            {message.messageContent && message.messageContent.length > 200 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleExpand(message.messageId)}
                                                    className="text-xs px-2 py-0 h-6 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                                >
                                                    {expanded[message.messageId] ? 'Show less' : 'Show more'}
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleMessageClick(message.messageId)}
                                                className="text-xs ml-auto flex items-center h-6 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                                            >
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                Go to message
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}