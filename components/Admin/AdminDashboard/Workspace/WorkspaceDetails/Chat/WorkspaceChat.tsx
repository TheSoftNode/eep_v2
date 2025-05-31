"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
    WorkspaceMessage,
    MessageAttachment
} from '@/Redux/types/Workspace/workspace-messaging-types';

import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import PinnedMessagesDrawer from './PinnedMessagesDrawer';
import TypingIndicator from './TypingIndicator';
import MessageThreadView from './MessageThreadView';
import { Loader2, AlertCircle, Folder } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    useDeleteMessageMutation,
    useEditMessageMutation,
    useGetWorkspaceMessagesQuery,
    usePinMessageMutation,
    useReactToMessageMutation,
    useSendWorkspaceMessageMutation,
    useUnpinMessageMutation,
    useUploadMessageAttachmentMutation,
    useUploadVoiceNoteMutation
} from '@/Redux/apiSlices/workspaces/workspaceMessagingApi';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import isEqual from 'lodash.isequal';


interface WorkspaceChatProps {
    workspaceId: string;
    projectId?: string | null; // Added projectId prop
    channelName?: string;
    channelType?: 'team' | 'private';
    channelDescription?: string;
    channelMembers?: number;
    userPermissions?: {
        canPin: boolean;
        canDeleteOthers: boolean;
        isMentor: boolean;
        isAdmin: boolean;
    };
}

export default function WorkspaceChat({
    workspaceId,
    projectId = null, // Default to null if not provided
    channelName = 'General',
    channelType = 'team',
    channelDescription = '',
    channelMembers = 0,
    userPermissions = {
        canPin: false,
        canDeleteOthers: false,
        isMentor: false,
        isAdmin: false
    }
}: WorkspaceChatProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [editingMessage, setEditingMessage] = useState<WorkspaceMessage | null>(null);
    const [replyingToMessage, setReplyingToMessage] = useState<WorkspaceMessage | null>(null);
    const [editedContent, setEditedContent] = useState("");
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isPinnedDrawerOpen, setIsPinnedDrawerOpen] = useState(false);
    const [threadViewMessage, setThreadViewMessage] = useState<WorkspaceMessage | null>(null);
    const [threadReplies, setThreadReplies] = useState<WorkspaceMessage[]>([]);

    // API Hooks with projectId parameter when available
    const {
        data: messagesData,
        isLoading: isLoadingMessages,
        error: messagesError,
        refetch: refetchMessages
    } = useGetWorkspaceMessagesQuery({
        workspaceId,
        limit: 50
    });

    const [sendMessageMutation, { isLoading: isSendingMessage }] = useSendWorkspaceMessageMutation();
    const [reactToMessageMutation] = useReactToMessageMutation();
    const [editMessageMutation] = useEditMessageMutation();
    const [deleteMessageMutation] = useDeleteMessageMutation();
    const [pinMessageMutation] = usePinMessageMutation();
    const [unpinMessageMutation] = useUnpinMessageMutation();
    const [uploadAttachmentMutation] = useUploadMessageAttachmentMutation();
    const [uploadVoiceNoteMutation] = useUploadVoiceNoteMutation();

    // Refresh messages when projectId changes
    useEffect(() => {
        refetchMessages();
    }, [projectId, refetchMessages]);

    // Get typing indicator from Redux store
    const typingIndicator = useSelector((state: any) =>
        state.workspaceSocket?.typingIndicators?.[workspaceId] || []
    );

    // Monitor typing indicators
    useEffect(() => {
        if (typingIndicator && Array.isArray(typingIndicator)) {
            const otherTypingUsers = typingIndicator
                .filter(u => u.userId !== user?.id)
                .map(u => u.userName || 'Someone');

            if (!isEqual(otherTypingUsers, typingUsers)) {
                setTypingUsers(otherTypingUsers);
            }
        }
    }, [typingIndicator, user, typingUsers]);


    // Load messages when data changes
    useEffect(() => {
        if (messagesData?.success && messagesData.data) {
            setMessages(messagesData.data);

            // Check if there are more messages to load
            setHasMoreMessages(messagesData.hasMore || false);
        }
    }, [messagesData]);


    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        // Auto-scroll only if near bottom
        const isNearBottom =
            chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 300;

        if (isNearBottom) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);


    // Load more messages when scrolling to top
    const loadMoreMessages = async () => {
        if (!hasMoreMessages || isLoadingMore) return;

        try {
            setIsLoadingMore(true);

            // Get the oldest message ID for pagination
            const oldestMessage = messages[0];
            if (!oldestMessage) return;

            // Fetch more messages before the oldest one, including projectId if available
            const endpoint = projectId
                ? `/api/workspaces/${workspaceId}/messages?before=${oldestMessage.id}&limit=20&projectId=${projectId}`
                : `/api/workspaces/${workspaceId}/messages?before=${oldestMessage.id}&limit=20`;

            const moreMessages = await fetch(endpoint);
            const moreMessagesData = await moreMessages.json();

            if (moreMessagesData.success && moreMessagesData.data?.length) {
                // Prepend new messages to the existing ones
                setMessages(prev => [...moreMessagesData.data, ...prev]);
                setHasMoreMessages(moreMessagesData.hasMore || false);
            } else {
                setHasMoreMessages(false);
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
            toast({
                title: "Error",
                description: "Failed to load more messages",
                variant: "destructive"
            });
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Handle sending a message
    const handleSendMessage = async (content: string, attachments?: File[]) => {
        if (!user) return;

        try {
            // Prepare the message request using our helper
            const messageRequest = {
                ...await prepareMessageRequest(content, attachments),
                replyTo: replyingToMessage ? replyingToMessage.id : null,
                projectId: projectId || undefined // Include projectId when available
            };

            // For optimistic UI updates, create a temporary message
            const tempId = `temp-${Date.now()}`;
            const optimisticMessage: WorkspaceMessage = {
                id: tempId,
                workspaceId,
                senderId: user.id || '',
                senderName: user.fullName || 'You',
                senderAvatar: user.profilePicture || null,
                senderRole: userPermissions.isAdmin
                    ? 'admin'
                    : userPermissions.isMentor
                        ? 'mentor'
                        : 'learner',
                content,
                messageType: messageRequest.attachments.some(a => a.type === 'voice-note')
                    ? 'voice-note'
                    : 'text',
                attachments: messageRequest.attachments,
                replyTo: replyingToMessage ? replyingToMessage.id : null,
                mentions: messageRequest.mentions,
                reactions: {},
                readBy: [user.id || ''],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Add optimistic message to state
            setMessages(prev => {
                const exists = prev.some(msg => msg.id === optimisticMessage.id);
                return exists ? prev : [...prev, optimisticMessage];
            });

            // Reset reply state
            setReplyingToMessage(null);

            // Send the actual message
            await sendMessageMutation(messageRequest).unwrap();

            // The real message will be added via the socket connection
            // Remove the optimistic message after a short delay
            setTimeout(() => {
                setMessages(prev => prev.filter(msg => msg.id !== tempId));
            }, 200);

        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            });

            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
        }
    };

    // Extract @mentions from message content
    const extractMentions = (content: string): string[] => {
        const mentions: string[] = [];
        const mentionRegex = /@(\w+)/g;
        let match;

        while ((match = mentionRegex.exec(content)) !== null) {
            mentions.push(match[1]);
        }

        return mentions;
    };

    // Handle message reactions
    const handleReaction = async (messageId: string, reaction: string) => {
        try {
            await reactToMessageMutation({
                workspaceId,
                messageId,
                reaction,
            }).unwrap();
        } catch (error) {
            console.error('Error adding reaction:', error);
            toast({
                title: "Error",
                description: "Failed to add reaction.",
                variant: "destructive"
            });
        }
    };

    // Handle message edit
    const handleEditMessage = async (message: WorkspaceMessage) => {
        setEditingMessage(message);
        setEditedContent(message.content);
    };

    // Handle completing message edit
    const handleEditComplete = async () => {
        if (!editingMessage) return;

        try {
            await editMessageMutation({
                workspaceId,
                messageId: editingMessage.id,
                content: editedContent,
            }).unwrap();

            // Update will come from socket connection
            setEditingMessage(null);
            setEditedContent("");
        } catch (error) {
            console.error('Error editing message:', error);
            toast({
                title: "Error",
                description: "Failed to edit message.",
                variant: "destructive"
            });
        }
    };

    // Handle message cancel edit
    const handleEditCancel = () => {
        setEditingMessage(null);
        setEditedContent("");
    };

    // Handle message delete
    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessageMutation({
                workspaceId,
                messageId,
            }).unwrap();

            // Update locally immediately for better UX
            setMessages(prev => prev.filter(msg => msg.id !== messageId));

            toast({
                title: "Success",
                description: "Message deleted successfully.",
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            toast({
                title: "Error",
                description: "Failed to delete message.",
                variant: "destructive"
            });
        }
    };

    // Handle message pin/unpin
    const handlePinMessage = async (messageId: string) => {
        try {
            // Find message to check if it's already pinned
            const message = messages.find(msg => msg.id === messageId);

            if (message?.isPinned) {
                // Unpin if already pinned
                await unpinMessageMutation({
                    workspaceId,
                    messageId,
                }).unwrap();

                toast({
                    title: "Success",
                    description: "Message unpinned.",
                });
            } else {
                // Pin if not pinned
                await pinMessageMutation({
                    workspaceId,
                    messageId,
                }).unwrap();

                toast({
                    title: "Success",
                    description: "Message pinned.",
                });
            }

            // Update will come from socket connection
        } catch (error) {
            console.error('Error pinning/unpinning message:', error);
            toast({
                title: "Error",
                description: "Failed to pin/unpin message.",
                variant: "destructive"
            });
        }
    };

    // Handle message reply
    const handleReplyToMessage = (message: WorkspaceMessage) => {
        // If it's already a reply to another message, open thread view for the original message
        if (message.replyTo) {
            const originalMessage = messages.find(msg => msg.id === message.replyTo);
            if (originalMessage) {
                openThreadView(originalMessage);
            } else {
                // Original message not found in current messages, need to fetch it
                fetchThreadMessage(message.replyTo).then(original => {
                    if (original) {
                        openThreadView(original);
                    } else {
                        // Fallback to simple reply if we can't load the thread
                        setReplyingToMessage(message);
                    }
                });
            }
        } else {
            // Check if this message already has replies - if yes, open thread view
            const replies = messages.filter(msg => msg.replyTo === message.id);
            if (replies.length > 0) {
                openThreadView(message);
            } else {
                // Simple reply mode
                setReplyingToMessage(message);
            }
        }
    };

    // Open thread view for a message
    const openThreadView = (message: WorkspaceMessage) => {
        setThreadViewMessage(message);

        // Find all replies to this message
        const replies = messages.filter(msg => msg.replyTo === message.id);
        setThreadReplies(replies);

        // Optionally, fetch additional replies from API if needed
        fetchThreadReplies(message.id);
    };

    // Close thread view
    const closeThreadView = () => {
        setThreadViewMessage(null);
        setThreadReplies([]);
    };

    // Fetch replies for a thread
    const fetchThreadReplies = async (messageId: string) => {
        try {
            // In a real implementation, you would fetch additional replies from the API
            console.log(`Fetching replies for message ${messageId}`);

            // Simulating API call
            // const response = await fetch(`/api/workspaces/${workspaceId}/messages/${messageId}/replies?projectId=${projectId || ''}`);
            // const data = await response.json();
            // if (data.success) {
            //     setThreadReplies(data.data);
            // }
        } catch (error) {
            console.error('Error fetching thread replies:', error);
        }
    };

    // Fetch original message for a reply
    const fetchThreadMessage = async (messageId: string): Promise<WorkspaceMessage | null> => {
        try {
            // In a real implementation, you would fetch the original message from the API
            console.log(`Fetching original message ${messageId}`);

            // Simulating API call
            // const response = await fetch(`/api/workspaces/${workspaceId}/messages/${messageId}?projectId=${projectId || ''}`);
            // const data = await response.json();
            // if (data.success) {
            //     return data.data;
            // }
            return null;
        } catch (error) {
            console.error('Error fetching original message:', error);
            return null;
        }
    };

    // Send a reply in thread view
    const handleSendThreadReply = async (content: string, attachments?: File[]) => {
        if (!threadViewMessage) return;

        try {
            // Prepare message with replyTo field set to the original message
            const messageRequest = {
                ...await prepareMessageRequest(content, attachments),
                replyTo: threadViewMessage.id,
                projectId: projectId || undefined // Include projectId when available
            };

            // Send the message
            const response = await sendMessageMutation(messageRequest).unwrap();

            // Add the new reply to thread replies
            if (response.success && response.data) {
                setThreadReplies(prev => [...prev, response.data as WorkspaceMessage]);
            }

            return response;
        } catch (error) {
            console.error('Error sending thread reply:', error);
            throw error;
        }
    };

    // Helper to prepare message request (reduces duplication)
    const prepareMessageRequest = async (content: string, attachments?: File[]) => {
        let uploadedAttachments: MessageAttachment[] = [];

        // Handle attachments if any
        if (attachments && attachments.length > 0) {
            for (const file of attachments) {
                try {
                    // Handle voice notes vs regular attachments
                    if (file.type.startsWith('audio/') && file.name.includes('voice-note')) {
                        const response = await uploadVoiceNoteMutation({
                            workspaceId,
                            file,
                            duration: 0, // You would calculate actual duration
                        }).unwrap();

                        if (response.success && response.data) {
                            uploadedAttachments.push(response.data as MessageAttachment);
                        }
                    } else {
                        const response = await uploadAttachmentMutation({
                            workspaceId,
                            file,
                        }).unwrap();

                        if (response.success && response.data) {
                            uploadedAttachments.push(response.data as MessageAttachment);
                        }
                    }
                } catch (error) {
                    console.error('Error uploading attachment:', error);
                    toast({
                        title: "Error",
                        description: "Failed to upload attachment.",
                        variant: "destructive"
                    });
                }
            }
        }

        return {
            workspaceId,
            content,
            attachments: uploadedAttachments,
            messageType: 'text' as const,
            mentions: extractMentions(content),
            projectId: projectId || undefined // Include projectId when available
        };
    };

    // UI event handlers
    const handleChannelInfoClick = useCallback(() => {
        toast({
            title: "Channel Info",
            description: "Channel info dialog will be implemented here.",
        });
    }, [toast]);

    const handleSettingsClick = useCallback(() => {
        toast({
            title: "Settings",
            description: "Channel settings dialog will be implemented here.",
        });
    }, [toast]);

    const handlePinnedMessagesClick = useCallback(() => {
        setIsPinnedDrawerOpen(true);
    }, []);

    const handleNotificationsToggle = useCallback(() => {
        setNotificationsEnabled(prev => !prev);
        toast({
            title: notificationsEnabled ? "Notifications Muted" : "Notifications Enabled",
            description: notificationsEnabled
                ? "You will no longer receive notifications for this channel."
                : "You will now receive notifications for this channel.",
        });
    }, [notificationsEnabled, toast]);

    const handleShareChannelClick = useCallback(() => {
        toast({
            title: "Share Channel",
            description: "Channel sharing dialog will be implemented here.",
        });
    }, [toast]);

    // If no workspace ID, show a placeholder
    if (!workspaceId) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400">
                <p>Select a workspace to start chatting</p>
            </div>
        );
    }

    // Loading state
    if (isLoadingMessages && !messages.length) {
        return (
            <div className="flex flex-col h-full" ref={chatContainerRef}>
                <ChatHeader
                    channelName={channelName}
                    channelType={channelType}
                    channelDescription={channelDescription}
                    channelMembers={channelMembers}
                />

                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30">
                    <div className="text-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
                    </div>
                </div>

                <ChatInput
                    workspaceId={workspaceId}
                    projectId={projectId || undefined}
                    onSendMessage={handleSendMessage}
                    isLoading={true}
                    replyingToMessage={replyingToMessage}
                />
            </div>
        );
    }

    // Error state
    if (messagesError) {
        return (
            <div className="flex flex-col h-full" ref={chatContainerRef}>
                <ChatHeader
                    channelName={channelName}
                    channelType={channelType}
                    channelDescription={channelDescription}
                    channelMembers={channelMembers}
                />

                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 p-4">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Failed to load messages. Please try again later.
                        </AlertDescription>
                    </Alert>
                </div>

                <ChatInput
                    workspaceId={workspaceId}
                    projectId={projectId || undefined}
                    onSendMessage={handleSendMessage}
                    isLoading={false}
                    replyingToMessage={replyingToMessage}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden" ref={chatContainerRef}>
            {/* Chat Header with Project Badge if project is selected */}
            <div className="flex flex-col">
                <ChatHeader
                    channelName={channelName}
                    channelType={channelType}
                    channelDescription={channelDescription}
                    channelMembers={channelMembers}
                    onSettingsClick={handleSettingsClick}
                    onChannelInfoClick={handleChannelInfoClick}
                    onPinnedMessagesClick={handlePinnedMessagesClick}
                    onNotificationsToggle={handleNotificationsToggle}
                    onShareChannelClick={handleShareChannelClick}
                    notificationsEnabled={notificationsEnabled}
                />

                {/* Project indicator */}
                {projectId && (
                    <div className="flex items-center px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center">
                            <Folder className="h-3 w-3 mr-1" />
                            Project Messages
                        </Badge>
                        <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                            Messages in this channel are specific to the selected project
                        </span>
                    </div>
                )}
            </div>

            {/* Reply to message indicator */}
            {replyingToMessage && (
                <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-y border-indigo-100 dark:border-indigo-800 flex justify-between items-center">
                    <div className="flex items-center text-sm text-indigo-700 dark:text-indigo-300">
                        <span className="font-medium mr-1">Replying to</span>
                        <span>{replyingToMessage.senderName}:</span>
                        <span className="ml-1 truncate max-w-[400px] text-indigo-600 dark:text-indigo-400">
                            {replyingToMessage.content}
                        </span>
                    </div>
                    <button
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        onClick={() => setReplyingToMessage(null)}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
                <TypingIndicator
                    typingUsers={typingUsers.map(name => ({
                        userId: name, // Using name as ID since we don't have full user objects
                        userName: name
                    }))}
                />
            )}

            {/* Message List */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto"
            >
                <MessageList
                    messages={messages}
                    autoScroll={true}
                    isLoading={isLoadingMessages}
                    currentUserId={user?.id || ''}
                    onReply={handleReplyToMessage}
                    onReact={handleReaction}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                    onPin={handlePinMessage}
                    userPermissions={{
                        canPin: userPermissions.canPin,
                        canDeleteOthers: userPermissions.canDeleteOthers
                    }}
                />
            </div>

            {/* Chat Input */}
            <ChatInput
                workspaceId={workspaceId}
                projectId={projectId || undefined}
                onSendMessage={handleSendMessage}
                isLoading={isSendingMessage}
                replyingToMessage={replyingToMessage}
            />

            {/* Edit Message Dialog */}
            <Dialog open={!!editingMessage} onOpenChange={(open) => !open && handleEditCancel()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Message</DialogTitle>
                        <DialogDescription>
                            Update your message content below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full min-h-[100px] focus-visible:ring-purple-500 dark:focus-visible:ring-purple-500"
                            placeholder="Edit your message..."
                        />
                    </div>
                    <DialogFooter className="flex justify-between">
                        <Button variant="outline" onClick={handleEditCancel}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditComplete}
                            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Thread View Drawer */}
            <MessageThreadView
                isOpen={!!threadViewMessage}
                onClose={closeThreadView}
                originalMessage={threadViewMessage}
                replies={threadReplies}
                workspaceId={workspaceId}
                currentUserId={user?.id || ''}
                onSendReply={handleSendThreadReply}
                onReact={handleReaction}
            />

            {/* Pinned Messages Drawer */}
            <PinnedMessagesDrawer
                workspaceId={workspaceId}
                isOpen={isPinnedDrawerOpen}
                onClose={() => setIsPinnedDrawerOpen(false)}
                onMessageClick={(messageId) => {
                    // Scroll to the message and highlight it
                    // This would need a more complex implementation to find and highlight specific messages
                    const messageElement = document.getElementById(`message-${messageId}`);
                    if (messageElement) {
                        messageElement.scrollIntoView({ behavior: 'smooth' });
                        messageElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900/20');
                        setTimeout(() => {
                            messageElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/20');
                        }, 2000);
                    }
                }}
                canUnpin={userPermissions.canPin}
            />
        </div>
    );
}
