import { ChatCall, ConversationWithParticipants, CreateConversationRequest, MessageWithExtras, SendMessageRequest, UpdateConversationRequest } from '@/components/Types/Chats/chat';
import { ChatService } from '@/services/Chats/chat.service';
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';


// Create a singleton instance of the chat service
const chatService = new ChatService();

// Define the shape of our chat context
interface ChatContextType {
    // State
    conversations: ConversationWithParticipants[];
    activeConversation: ConversationWithParticipants | null;
    messages: MessageWithExtras[];
    loading: {
        conversations: boolean;
        messages: boolean;
        sending: boolean;
    };
    error: string | null;
    typingUsers: Array<{ userId: string; name: string }>;
    activeCall: ChatCall | null;

    // Actions
    setActiveConversation: (conversation: ConversationWithParticipants | null) => void;
    loadConversations: () => Promise<void>;
    loadMessages: (conversationId: string) => Promise<void>;
    sendMessage: (request: SendMessageRequest) => Promise<string | null>;
    createConversation: (request: CreateConversationRequest) => Promise<string | null>;
    updateConversation: (conversationId: string, updates: UpdateConversationRequest) => Promise<void>;
    setTyping: (conversationId: string, isTyping: boolean) => void;
    addReaction: (messageId: string, reaction: string) => Promise<void>;
    removeReaction: (messageId: string, reaction: string) => Promise<void>;
    sendVoiceNote: (
        conversationId: string,
        audioBlob: Blob,
        duration: number,
        waveform: number[]
    ) => Promise<string | null>;
    markAsRead: (conversationId: string) => Promise<void>;
    startCall: (conversationId: string, callType: 'audio' | 'video') => Promise<string | null>;
    joinCall: (callId: string) => Promise<void>;
    leaveCall: (callId: string) => Promise<void>;
    declineCall: (callId: string) => Promise<void>;
    endCall: (callId: string) => Promise<void>;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationWithParticipants[]>([]);
    const [activeConversation, setActiveConversation] = useState<ConversationWithParticipants | null>(null);
    const [messages, setMessages] = useState<MessageWithExtras[]>([]);
    const [loading, setLoading] = useState({
        conversations: false,
        messages: false,
        sending: false
    });
    const [error, setError] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<Array<{ userId: string; name: string }>>([]);
    const [activeCall, setActiveCall] = useState<ChatCall | null>(null);

    const safeUser = user ? { ...user, disabled: user.disabled ?? false } : null;

    // Initialize user presence when auth is ready
    useEffect(() => {
        if (user) {
            chatService.setupUserPresence(user.id);
        }
    }, [user]);

    // Load user's conversations
    const loadConversations = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(prev => ({ ...prev, conversations: true }));
            setError(null);

            const userConversations = await chatService.getConversationsForUser(user.id);
            setConversations(userConversations);
        } catch (err) {
            console.error('Error loading conversations:', err);
            setError('Failed to load conversations');
        } finally {
            setLoading(prev => ({ ...prev, conversations: false }));
        }
    }, [user]);

    // Load conversations when user is authenticated
    useEffect(() => {
        if (user) {
            loadConversations();
        }
    }, [user, loadConversations]);

    // Load conversation messages
    const loadMessages = useCallback(async (conversationId: string) => {
        if (!user) return;

        try {
            setLoading(prev => ({ ...prev, messages: true }));
            setError(null);

            const conversationMessages = await chatService.getMessages(conversationId);
            setMessages(conversationMessages);
        } catch (err) {
            console.error('Error loading messages:', err);
            setError('Failed to load messages');
        } finally {
            setLoading(prev => ({ ...prev, messages: false }));
        }
    }, [user]);

    // Mark messages as read
    const markAsRead = useCallback(async (conversationId: string) => {
        if (!user) return;

        try {
            await chatService.markMessagesAsRead(conversationId, user.id);

            // Update local conversations list to reflect read status
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === conversationId
                        ? { ...conv, unreadCount: 0 }
                        : conv
                )
            );
        } catch (err) {
            console.error('Error marking messages as read:', err);
        }
    }, [user]);

    // Listen for new messages when active conversation changes
    useEffect(() => {
        if (!activeConversation || !user) return;

        // Mark messages as read when opening a conversation
        markAsRead(activeConversation.id);

        // Load initial messages
        loadMessages(activeConversation.id);

        // Set up real-time listener for new messages
        const unsubscribe = chatService.listenToMessages(
            activeConversation.id,
            newMessages => {
                setMessages(newMessages);
            }
        );

        // Listen for typing indicators
        const unsubscribeTyping = chatService.listenToTypingIndicators(
            activeConversation.id,
            users => {
                // Filter out current user
                const otherUsers = users.filter(u => u.userId !== user.id);
                setTypingUsers(otherUsers);
            }
        );

        // Listen for active call
        const checkActiveCall = async () => {
            const call = await chatService.getActiveCall(activeConversation.id);
            if (call) {
                setActiveCall(call);

                // Set up call listener
                const unsubscribeCall = chatService.listenToCall(call.id, updatedCall => {
                    if (!updatedCall || updatedCall.status === 'ended') {
                        setActiveCall(null);
                    } else {
                        setActiveCall(updatedCall);
                    }
                });

                return unsubscribeCall;
            }
            return () => { };
        };

        const unsubscribeCall = checkActiveCall();

        // Clean up listeners
        // return () => {
        //     unsubscribe();
        //     unsubscribeTyping();
        //     if (typeof unsubscribeCall === 'function') {
        //         unsubscribeCall();
        //     } else {
        //         unsubscribeCall.then(unsub => unsub());
        //     }
        // };
    }, [activeConversation, user, loadMessages, markAsRead]);

    // Listen for changes in conversations list
    useEffect(() => {
        if (!user) return;

        // Real-time updates to conversations are more complex
        // We'll need to listen for changes in user's participant documents
        // and update the conversations accordingly

        // For simplicity, we'll just refresh the list periodically
        const intervalId = setInterval(() => {
            loadConversations();
        }, 30000); // Every 30 seconds

        return () => clearInterval(intervalId);
    }, [user, loadConversations]);

    // Send a message
    const sendMessage = useCallback(async (request: SendMessageRequest) => {
        if (!user) return null;

        try {
            setLoading(prev => ({ ...prev, sending: true }));
            setError(null);

            // const messageId = await chatService.sendMessage(request, safe);
            return "message";
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
            return null;
        } finally {
            setLoading(prev => ({ ...prev, sending: false }));
        }
    }, [user]);

    // Create a new conversation
    const createConversation = useCallback(async (request: CreateConversationRequest) => {
        if (!user) return null;

        try {
            setLoading(prev => ({ ...prev, conversations: true }));
            setError(null);

            // const conversationId = await chatService.createConversation(request, user!);

            // Refresh conversations
            loadConversations();

            return "conversationId";
        } catch (err) {
            console.error('Error creating conversation:', err);
            setError('Failed to create conversation');
            return null;
        } finally {
            setLoading(prev => ({ ...prev, conversations: false }));
        }
    }, [user, loadConversations]);

    // Update a conversation
    const updateConversation = useCallback(async (
        conversationId: string,
        updates: UpdateConversationRequest
    ) => {
        if (!user) return;

        try {
            await chatService.updateConversation(conversationId, user.id, updates);

            // Refresh conversation data
            if (activeConversation?.id === conversationId) {
                const updatedConversation = await chatService.getConversationById(conversationId, user.id);
                if (updatedConversation) {
                    setActiveConversation(updatedConversation);
                }
            }

            // Refresh conversations list
            loadConversations();
        } catch (err) {
            console.error('Error updating conversation:', err);
            setError('Failed to update conversation');
        }
    }, [user, activeConversation, loadConversations]);

    // Set typing indicator
    const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
        if (!user) return;

        chatService.setTypingIndicator(user.id, conversationId, isTyping);
    }, [user]);

    // Add a reaction to a message
    const addReaction = useCallback(async (messageId: string, reaction: string) => {
        if (!user) return;

        try {
            // await chatService.addReaction(messageId, reaction, user);
        } catch (err) {
            console.error('Error adding reaction:', err);
            setError('Failed to add reaction');
        }
    }, [user]);

    // Remove a reaction from a message
    const removeReaction = useCallback(async (messageId: string, reaction: string) => {
        if (!user) return;

        try {
            await chatService.removeReaction(messageId, reaction, user.id);
        } catch (err) {
            console.error('Error removing reaction:', err);
            setError('Failed to remove reaction');
        }
    }, [user]);

    // Send a voice note
    const sendVoiceNote = useCallback(async (
        conversationId: string,
        audioBlob: Blob,
        duration: number,
        waveform: number[]
    ) => {
        if (!user) return null;

        try {
            setLoading(prev => ({ ...prev, sending: true }));
            // const messageId = await chatService.sendVoiceNote(
            //     conversationId,
            //     audioBlob,
            //     duration,
            //     waveform,
            //     user: {}
            // );
            return "messageId";
        } catch (err) {
            console.error('Error sending voice note:', err);
            setError('Failed to send voice note');
            return null;
        } finally {
            setLoading(prev => ({ ...prev, sending: false }));
        }
    }, [user]);

    // Call handling functions
    const startCall = useCallback(async (
        conversationId: string,
        callType: 'audio' | 'video'
    ) => {
        if (!user) return null;

        try {
            // const callId = await chatService.startCall(conversationId, callType, user);

            // Get call details and update state
            // const call = await chatService.getCall(callId);
            // if (call) {
            //     setActiveCall(call);
            // }

            return "callId";
        } catch (err) {
            console.error('Error starting call:', err);
            setError('Failed to start call');
            return null;
        }
    }, [user]);

    const joinCall = useCallback(async (callId: string) => {
        if (!user) return;

        try {
            await chatService.joinCall(callId, user.id);

            // Get updated call details
            const call = await chatService.getCall(callId);
            if (call) {
                setActiveCall(call);
            }
        } catch (err) {
            console.error('Error joining call:', err);
            setError('Failed to join call');
        }
    }, [user]);

    const leaveCall = useCallback(async (callId: string) => {
        if (!user) return;

        try {
            await chatService.leaveCall(callId, user.id);
            setActiveCall(null);
        } catch (err) {
            console.error('Error leaving call:', err);
            setError('Failed to leave call');
        }
    }, [user]);

    const declineCall = useCallback(async (callId: string) => {
        if (!user) return;

        try {
            await chatService.declineCall(callId, user.id);
            setActiveCall(null);
        } catch (err) {
            console.error('Error declining call:', err);
            setError('Failed to decline call');
        }
    }, [user]);

    const endCall = useCallback(async (callId: string) => {
        if (!user) return;

        try {
            await chatService.endCall(callId, user.id);
            setActiveCall(null);
        } catch (err) {
            console.error('Error ending call:', err);
            setError('Failed to end call');
        }
    }, [user]);

    // Context value
    const value = {
        // State
        conversations,
        activeConversation,
        messages,
        loading,
        error,
        typingUsers,
        activeCall,

        // Actions
        setActiveConversation,
        loadConversations,
        loadMessages,
        sendMessage,
        createConversation,
        updateConversation,
        setTyping,
        addReaction,
        removeReaction,
        sendVoiceNote,
        markAsRead,
        startCall,
        joinCall,
        leaveCall,
        declineCall,
        endCall
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the chat context
export const useChat = () => {
    const context = useContext(ChatContext);

    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }

    return context;
};