// src/firebase/chatRealtimeService.ts
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    QuerySnapshot,
    DocumentData,
    writeBatch,
    arrayUnion,
    QueryDocumentSnapshot
} from "firebase/firestore";
import { store } from '@/Redux/core/store';
import { firestore } from "./firebase";
import { chatApiSlice } from "@/Redux/apiSlices/chat/chatApi";

class ChatRealtimeService {
    private conversationListeners = new Map<string, () => void>();
    private messageListeners = new Map<string, () => void>();
    private activeConversationId: string | null = null;
    private userId: string | null = null;

    constructor() {
        // Try to get user ID from localStorage
        if (typeof window !== 'undefined') {
            this.userId = localStorage.getItem('userId');
        }
    }

    /**
     * Set the current user ID
     */
    setUserId(userId: string) {
        this.userId = userId;
    }

    /**
     * Subscribe to all conversations for the current user
     */
    subscribeToConversations(): (() => void) | null {
        if (!this.userId) {
            console.error("Cannot subscribe to conversations: User ID not set");
            return null;
        }

        // Create a query for all conversations where the user is a participant
        const conversationsRef = collection(firestore, 'conversations');
        const conversationsQuery = query(
            conversationsRef,
            where('participants', 'array-contains', this.userId),
            orderBy('updatedAt', 'desc')
        );

        // Create a listener for the query
        const unsubscribe = onSnapshot(
            conversationsQuery,
            (snapshot: QuerySnapshot<DocumentData>) => {
                if (snapshot.docChanges().length > 0) {
                    // If there are changes, invalidate the conversations list cache
                    store.dispatch(chatApiSlice.util.invalidateTags([{ type: 'Conversation', id: 'LIST' }]));

                    // Also invalidate unread count, which may have changed
                    store.dispatch(chatApiSlice.util.invalidateTags([{ type: 'UnreadCount', id: 'TOTAL' }]));
                }
            },
            (error: Error) => {
                console.error("Error listening to conversations:", error);
            }
        );

        // Store the unsubscribe function
        this.conversationListeners.set('main', unsubscribe);

        return unsubscribe;
    }

    /**
     * Subscribe to messages for a specific conversation
     */
    subscribeToMessages(conversationId: string): (() => void) | null {
        if (!this.userId) {
            console.error("Cannot subscribe to messages: User ID not set");
            return null;
        }

        // If already listening to this conversation, return
        if (this.messageListeners.has(conversationId)) {
            return this.messageListeners.get(conversationId) || null;
        }

        // Set this as the active conversation
        this.activeConversationId = conversationId;

        // Create a query for all messages in the conversation
        const messagesRef = collection(firestore, 'messages');
        const messagesQuery = query(
            messagesRef,
            where('conversationId', '==', conversationId),
            orderBy('timestamp', 'desc')
        );

        // Create a listener for the query
        const unsubscribe = onSnapshot(
            messagesQuery,
            (snapshot: QuerySnapshot<DocumentData>) => {
                if (snapshot.docChanges().length > 0) {
                    // If there are changes, invalidate the conversation and its messages
                    store.dispatch(chatApiSlice.util.invalidateTags([
                        { type: 'Conversation', id: conversationId },
                        { type: 'Message', id: `CONVERSATION_${conversationId}` }
                    ]));

                    // Mark messages as read automatically
                    this.markMessagesAsRead(conversationId, snapshot);
                }
            },
            (error: Error) => {
                console.error(`Error listening to messages for conversation ${conversationId}:`, error);
            }
        );

        // Store the unsubscribe function
        this.messageListeners.set(conversationId, unsubscribe);

        return unsubscribe;
    }

    /**
     * Mark messages as read automatically when viewing a conversation
     */
    private async markMessagesAsRead(conversationId: string, snapshot: QuerySnapshot<DocumentData>): Promise<void> {
        if (!this.userId) return;

        const batch = writeBatch(firestore);
        let updatedCount = 0;

        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            // Only mark messages from other users as read
            if (data.senderId !== this.userId) {
                const readBy = data.readBy || [];
                // Only update if not already read
                if (!readBy.includes(this.userId)) {
                    batch.update(doc.ref, {
                        readBy: arrayUnion(this.userId)
                    });
                    updatedCount++;
                }
            }
        });

        // If there are messages to mark as read, commit the batch
        if (updatedCount > 0) {
            try {
                await batch.commit();
                // Invalidate unread count in the store
                store.dispatch(chatApiSlice.util.invalidateTags([{ type: 'UnreadCount', id: 'TOTAL' }]));
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }
    }

    /**
     * Unsubscribe from messages for a specific conversation
     */
    unsubscribeFromMessages(conversationId: string): void {
        if (this.messageListeners.has(conversationId)) {
            const unsubscribe = this.messageListeners.get(conversationId);
            if (unsubscribe) {
                unsubscribe();
            }
            this.messageListeners.delete(conversationId);

            if (this.activeConversationId === conversationId) {
                this.activeConversationId = null;
            }
        }
    }

    /**
     * Unsubscribe from all conversations and messages
     */
    unsubscribeAll(): void {
        // Unsubscribe from all conversation listeners
        this.conversationListeners.forEach(unsubscribe => {
            unsubscribe();
        });
        this.conversationListeners.clear();

        // Unsubscribe from all message listeners
        this.messageListeners.forEach(unsubscribe => {
            unsubscribe();
        });
        this.messageListeners.clear();

        this.activeConversationId = null;
    }
}

// Export as a singleton
export const chatService = new ChatRealtimeService();