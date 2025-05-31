import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    writeBatch,
    Timestamp,
    startAfter,
    setDoc,
    arrayRemove,
    arrayUnion
} from 'firebase/firestore';
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    ref
} from 'firebase/storage';
import {
    ref as rtdbRef,
    set,
    update,
    onValue,
    onDisconnect,
    serverTimestamp as rtdbServerTimestamp
} from 'firebase/database';

import { Attachment, ChatCall, ChatConversation, ChatMessage, ChatNotification, ChatType, ConversationParticipant, ConversationWithParticipants, CreateConversationRequest, MessageReaction, MessageWithExtras, SendMessageRequest, UpdateConversationRequest, VoiceNote } from '@/components/Types/Chats/chat';
import { db, rtdb, storage } from '@/firebase/config/firebase.config';
import { User } from '@/components/Types/Users/user';
import { firebaseDateToMillis } from '@/firebase/utils/chatUtils';
import { v4 as uuidv4 } from 'uuid';

export class ChatService {
    // Firebase collection references
    private conversationsRef = collection(db, 'conversations');
    private messagesRef = collection(db, 'messages');
    private participantsRef = collection(db, 'conversationParticipants');
    private reactionsRef = collection(db, 'messageReactions');
    private callsRef = collection(db, 'calls');
    private voiceNotesRef = collection(db, 'voiceNotes');
    private presenceRef = collection(db, 'presence');
    private notificationsRef = collection(db, 'chatNotifications');

    // User Presence Methods
    // ====================

    /**
     * Sets up real-time presence tracking for a user
     */
    setupUserPresence(userId: string): void {
        const userStatusRef = rtdbRef(rtdb, `status/${userId}`);

        // Create references to offline and online states
        const isOfflineData = {
            status: 'offline',
            lastActive: rtdbServerTimestamp()
        };

        const isOnlineData = {
            status: 'online',
            lastActive: rtdbServerTimestamp()
        };

        // Firebase connection state reference
        const connectedRef = rtdbRef(rtdb, '.info/connected');

        // Listen for connection state changes
        onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === false) {
                // User is disconnected
                return;
            }

            // Set up automatic disconnect handling
            onDisconnect(userStatusRef)
                .set(isOfflineData)
                .then(() => {
                    // User is connected
                    set(userStatusRef, isOnlineData);
                });
        });

        // Sync RTDB presence with Firestore
        onValue(userStatusRef, async (snapshot) => {
            if (snapshot.exists()) {
                const status = snapshot.val();

                // Update Firestore presence document
                const userPresenceDoc = doc(this.presenceRef, userId);
                const presenceSnapshot = await getDoc(userPresenceDoc);

                if (presenceSnapshot.exists()) {
                    await updateDoc(userPresenceDoc, {
                        status: status.status,
                        lastActive: serverTimestamp()
                    });
                } else {
                    await addDoc(this.presenceRef, {
                        userId,
                        status: status.status,
                        lastActive: serverTimestamp()
                    });
                }
            }
        });
    }

    /**
   * Updates a user's status (online, offline, away, busy)
   */
    async updateUserStatus(userId: string, status: 'online' | 'offline' | 'away' | 'busy'): Promise<void> {
        const userStatusRef = rtdbRef(rtdb, `status/${userId}`);

        await update(userStatusRef, {
            status,
            lastActive: rtdbServerTimestamp()
        });
    }

    /**
     * Sets a user's typing indicator
     */
    setTypingIndicator(userId: string, conversationId: string, isTyping: boolean): void {
        const userStatusRef = rtdbRef(rtdb, `status/${userId}`);

        if (isTyping) {
            update(userStatusRef, {
                typing: {
                    conversationId,
                    lastTypedAt: rtdbServerTimestamp()
                }
            });

            // Clear typing indicator after 5 seconds of inactivity
            setTimeout(() => {
                // Check if we're still typing in the same conversation
                onValue(userStatusRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        if (data.typing && data.typing.conversationId === conversationId) {
                            update(userStatusRef, {
                                typing: null
                            });
                        }
                    }
                }, { onlyOnce: true });
            }, 5000);
        } else {
            update(userStatusRef, {
                typing: null
            });
        }
    }

    /**
     * Listens for typing indicators in a specific conversation
     */
    listenToTypingIndicators(
        conversationId: string,
        callback: (typingUsers: Array<{ userId: string, name: string }>) => void
    ): () => void {
        const statusRef = rtdbRef(rtdb, 'status');

        // Start listening
        const unsubscribe = onValue(statusRef, async (snapshot) => {
            if (!snapshot.exists()) return;

            const data = snapshot.val();
            const typingUsers: Array<{ userId: string, name: string }> = [];

            // Get all participants in the conversation
            const participantsQuery = query(
                this.participantsRef,
                where('conversationId', '==', conversationId)
            );

            const participantsSnapshot = await getDocs(participantsQuery);
            const participantIds = participantsSnapshot.docs.map(doc => doc.data().userId);

            // Check each participant's typing status
            for (const userId in data) {
                if (
                    participantIds.includes(userId) &&
                    data[userId].typing &&
                    data[userId].typing.conversationId === conversationId
                ) {
                    // Get user info from Firestore
                    const userDoc = await getDoc(doc(db, 'users', userId));

                    if (userDoc.exists()) {
                        const userData = userDoc.data() as User;
                        typingUsers.push({
                            userId,
                            name: userData.fullName
                        });
                    }
                }
            }

            callback(typingUsers);
        });

        return unsubscribe;
    }

    /**
     * Gets online users from a list of user IDs
     */
    async getOnlineUsers(userIds: string[]): Promise<string[]> {
        if (!userIds.length) return [];

        // Users' online status is in batches of 10 due to Firestore limitations
        const onlineUsers: string[] = [];
        const batchSize = 10;

        for (let i = 0; i < userIds.length; i += batchSize) {
            const batch = userIds.slice(i, i + batchSize);

            const presenceQuery = query(
                this.presenceRef,
                where('userId', 'in', batch),
                where('status', '==', 'online')
            );

            const presenceSnapshot = await getDocs(presenceQuery);

            presenceSnapshot.docs.forEach(doc => {
                onlineUsers.push(doc.data().userId);
            });
        }

        return onlineUsers;
    }

    /**
     * Creates a new conversation
     */
    async createConversation(request: CreateConversationRequest, currentUser: User): Promise<string> {
        // Create a new document reference with auto-generated ID
        const conversationRef = doc(this.conversationsRef);
        const batch = writeBatch(db);

        // Initialize participants array
        const participants: Array<{
            id: string;
            role: 'admin' | 'member';
            joinedAt: Timestamp;
        }> = [
                {
                    id: currentUser.id,
                    role: 'admin',
                    joinedAt: Timestamp.now()
                }
            ];

        // Set core conversation data
        const newConversation: Partial<ChatConversation> = {
            id: conversationRef.id,
            type: request.type,
            name: request.name,
            description: request.description,
            createdBy: currentUser.id,
            participants, // Now definitely defined
            projectId: request.projectId,
            workspaceId: request.workspaceId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        // Handle avatar upload if provided
        if (request.avatar) {
            const fileRef = ref(storage, `conversation_avatars/${conversationRef.id}`);
            await uploadBytes(fileRef, request.avatar);
            newConversation.avatar = await getDownloadURL(fileRef);
        }

        // Add other participants
        for (const participantId of request.participantIds) {
            if (participantId !== currentUser.id) {
                participants.push({
                    id: participantId,
                    role: 'member',
                    joinedAt: Timestamp.now()
                });
            }
        }

        // Set conversation document
        batch.set(conversationRef, newConversation);

        // Create participant documents for each participant
        for (const participant of participants) {
            const participantDocRef = doc(this.participantsRef);

            batch.set(participantDocRef, {
                id: participantDocRef.id,
                conversationId: conversationRef.id,
                userId: participant.id,
                role: participant.role,
                joinedAt: participant.joinedAt,
                lastRead: Timestamp.now(),
                notificationSettings: {
                    muted: false,
                    desktop: true,
                    mobile: true,
                    email: true
                }
            });
        }

        // Create a system message
        const systemMessage = this.getSystemMessageForNewConversation(
            request.type,
            currentUser.fullName,
            request.name
        );

        const messageRef = doc(this.messagesRef);
        batch.set(messageRef, {
            id: messageRef.id,
            conversationId: conversationRef.id,
            sender: {
                id: 'system',
                name: 'System'
            },
            type: 'system',
            content: systemMessage,
            attachments: [],
            mentions: [],
            status: 'delivered',
            reactions: {},
            readBy: {
                [currentUser.id]: Timestamp.now()
            },
            edited: false,
            createdAt: Timestamp.now()
        });

        // Update conversation with the last message
        batch.update(conversationRef, {
            lastMessage: {
                id: messageRef.id,
                content: systemMessage,
                sender: {
                    id: 'system',
                    name: 'System'
                },
                type: 'system',
                createdAt: Timestamp.now()
            }
        });

        // Commit all changes
        await batch.commit();

        // Create notifications for all participants except the creator
        for (const participant of participants) {
            if (participant.id !== currentUser.id) {
                await this.createChatNotification({
                    userId: participant.id,
                    conversationId: conversationRef.id,
                    type: 'added_to_group',
                    content: `You were added to ${request.type === 'direct' ? 'a conversation' : `the group "${request.name}"`} by ${currentUser.fullName}`
                });
            }
        }

        return conversationRef.id;
    }

    /**
     * Generates an appropriate system message for new conversations
     */
    private getSystemMessageForNewConversation(
        type: ChatType,
        creatorName: string,
        groupName?: string
    ): string {
        switch (type) {
            case 'direct':
                return `${creatorName} started a conversation`;
            case 'group':
                return `${creatorName} created the group "${groupName}"`;
            case 'project':
                return `${creatorName} created a project conversation`;
            case 'workspace':
                return `${creatorName} created a workspace conversation`;
            default:
                return `${creatorName} started a conversation`;
        }
    }

    /**
     * Create a chat notification
     */
    private async createChatNotification(params: {
        userId: string;
        conversationId: string;
        messageId?: string;
        type: 'new_message' | 'mention' | 'reaction' | 'call' | 'added_to_group';
        content: string;
    }): Promise<string> {
        const notificationRef = doc(this.notificationsRef);

        await setDoc(notificationRef, {
            id: notificationRef.id,
            userId: params.userId,
            conversationId: params.conversationId,
            messageId: params.messageId,
            type: params.type,
            content: params.content,
            read: false,
            createdAt: Timestamp.now()
        });

        return notificationRef.id;
    }

    /**
     * Gets conversations for a user
     */
    async getConversationsForUser(userId: string): Promise<ConversationWithParticipants[]> {
        // Find conversations where the user is a participant
        const participantQuery = query(
            this.participantsRef,
            where('userId', '==', userId)
        );

        const participantSnapshot = await getDocs(participantQuery);
        const conversationIds = participantSnapshot.docs.map(doc => doc.data().conversationId);

        if (!conversationIds.length) {
            return [];
        }

        // Store user participation details for later use
        const userParticipationDetails: { [key: string]: ConversationParticipant } = {};
        participantSnapshot.docs.forEach(doc => {
            const data = doc.data() as ConversationParticipant;
            userParticipationDetails[data.conversationId] = data;
        });

        // Get conversations in batches (Firestore limits 'in' queries to 10 items)
        const conversations: ConversationWithParticipants[] = [];
        const batchSize = 10;

        for (let i = 0; i < conversationIds.length; i += batchSize) {
            const batch = conversationIds.slice(i, i + batchSize);

            const conversationsQuery = query(
                this.conversationsRef,
                where('id', 'in', batch),
                orderBy('updatedAt', 'desc')
            );

            const conversationsSnapshot = await getDocs(conversationsQuery);

            // Process each conversation
            for (const conversationDoc of conversationsSnapshot.docs) {
                const conversation = conversationDoc.data() as ChatConversation;

                // Count unread messages
                const lastRead = userParticipationDetails[conversation.id]?.lastRead;
                let unreadCount = 0;

                if (lastRead) {
                    const unreadQuery = query(
                        this.messagesRef,
                        where('conversationId', '==', conversation.id),
                        where('createdAt', '>', lastRead),
                        where('sender.id', '!=', userId)
                    );

                    const unreadSnapshot = await getDocs(unreadQuery);
                    unreadCount = unreadSnapshot.size;
                } else {
                    const unreadQuery = query(
                        this.messagesRef,
                        where('conversationId', '==', conversation.id),
                        where('sender.id', '!=', userId)
                    );

                    const unreadSnapshot = await getDocs(unreadQuery);
                    unreadCount = unreadSnapshot.size;
                }

                // Get participant details
                const participantDetails: Partial<User>[] = [];

                // Fetch user details for each participant
                for (const participant of conversation.participants) {
                    // Skip system user
                    if (participant.id === 'system') continue;

                    const userDoc = await getDoc(doc(db, 'users', participant.id));

                    if (userDoc.exists()) {
                        const userData = userDoc.data() as User;
                        participantDetails.push({
                            id: userData.id,
                            fullName: userData.fullName,
                            email: userData.email,
                            profilePicture: userData.profilePicture,
                            role: userData.role,
                            status: userData.status
                        });
                    }
                }

                conversations.push({
                    ...conversation,
                    participantDetails,
                    unreadCount,
                    userParticipationDetails: userParticipationDetails[conversation.id]
                });
            }
        }

        // Sort by last message time (most recent first)
        return conversations.sort((a, b) => {
            if (!a.lastMessage?.createdAt) return 1;
            if (!b.lastMessage?.createdAt) return -1;
            return (b.lastMessage.createdAt as Timestamp).toMillis() -
                (a.lastMessage.createdAt as Timestamp).toMillis();
        });
    }

    /**
     * Gets a single conversation by ID with participant details
     */
    async getConversationById(conversationId: string, userId: string): Promise<ConversationWithParticipants | null> {
        const conversationDoc = await getDoc(doc(this.conversationsRef, conversationId));

        if (!conversationDoc.exists()) {
            return null;
        }

        const conversation = conversationDoc.data() as ChatConversation;

        // Check if user is a participant
        const isParticipant = conversation.participants.some(p => p.id === userId);

        if (!isParticipant) {
            throw new Error('User is not a participant in this conversation');
        }

        // Get user's participation details
        const participantQuery = query(
            this.participantsRef,
            where('conversationId', '==', conversationId),
            where('userId', '==', userId)
        );

        const participantSnapshot = await getDocs(participantQuery);
        const userParticipationDetails = participantSnapshot.docs.length > 0
            ? participantSnapshot.docs[0].data() as ConversationParticipant
            : undefined;

        // Count unread messages
        const lastRead = userParticipationDetails?.lastRead;
        let unreadCount = 0;

        if (lastRead) {
            const unreadQuery = query(
                this.messagesRef,
                where('conversationId', '==', conversationId),
                where('createdAt', '>', lastRead),
                where('sender.id', '!=', userId)
            );

            const unreadSnapshot = await getDocs(unreadQuery);
            unreadCount = unreadSnapshot.size;
        } else {
            const unreadQuery = query(
                this.messagesRef,
                where('conversationId', '==', conversationId),
                where('sender.id', '!=', userId)
            );

            const unreadSnapshot = await getDocs(unreadQuery);
            unreadCount = unreadSnapshot.size;
        }

        // Get participant details
        const participantDetails: Partial<User>[] = [];

        for (const participant of conversation.participants) {
            if (participant.id === 'system') continue;

            const userDoc = await getDoc(doc(db, 'users', participant.id));

            if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                participantDetails.push({
                    id: userData.id,
                    fullName: userData.fullName,
                    email: userData.email,
                    profilePicture: userData.profilePicture,
                    role: userData.role,
                    status: userData.status
                });
            }
        }

        return {
            ...conversation,
            participantDetails,
            unreadCount,
            userParticipationDetails
        };
    }

    /**
     * Listen to changes in a conversation
     */
    listenToConversation(
        conversationId: string,
        callback: (conversation: ChatConversation | null) => void
    ): () => void {
        const conversationRef = doc(this.conversationsRef, conversationId);

        const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as ChatConversation);
            } else {
                callback(null);
            }
        });

        return unsubscribe;
    }

    /**
     * Sends a message to a conversation
     */
    async sendMessage(request: SendMessageRequest, currentUser: User): Promise<string> {
        // Create message document reference with auto-generated ID
        const messageRef = doc(this.messagesRef);
        const batch = writeBatch(db);

        // Check if the conversation exists
        const conversationDoc = await getDoc(doc(this.conversationsRef, request.conversationId));

        if (!conversationDoc.exists()) {
            throw new Error('Conversation not found');
        }

        const conversation = conversationDoc.data() as ChatConversation;

        // Check if user is a participant
        if (!conversation.participants.some(p => p.id === currentUser.id)) {
            throw new Error('User is not a participant in this conversation');
        }

        // Process attachments if any
        const attachments: Attachment[] = [];

        if (request.attachments && request.attachments.length > 0) {
            for (const file of request.attachments) {
                const attachmentId = uuidv4();
                const fileExtension = file.name.split('.').pop() || '';
                const filePath = `chat_attachments/${request.conversationId}/${messageRef.id}/${attachmentId}.${fileExtension}`;

                // Upload file to storage
                const fileRef = storageRef(storage, filePath);
                await uploadBytes(fileRef, file);
                const downloadUrl = await getDownloadURL(fileRef);

                // Determine file type
                let type: 'image' | 'video' | 'audio' | 'file' = 'file';
                if (file.type.startsWith('image/')) {
                    type = 'image';
                } else if (file.type.startsWith('video/')) {
                    type = 'video';
                } else if (file.type.startsWith('audio/')) {
                    type = 'audio';
                }

                // Create attachment object
                const attachment = {
                    id: attachmentId,
                    type,
                    url: downloadUrl,
                    name: file.name,
                    size: file.size,
                    mimeType: file.type,
                    createdAt: Timestamp.now() as any
                };

                attachments.push(attachment);
            }
        }

        // Handle reply if specified
        let replyTo = undefined;

        if (request.replyToId) {
            const replyMessageDoc = await getDoc(doc(this.messagesRef, request.replyToId));

            if (replyMessageDoc.exists()) {
                const replyMessage = replyMessageDoc.data() as ChatMessage;

                replyTo = {
                    id: replyMessage.id,
                    content: replyMessage.content,
                    sender: {
                        id: replyMessage.sender.id,
                        name: replyMessage.sender.name
                    }
                };
            }
        }

        // Create the message
        const newMessage: Partial<ChatMessage> = {
            id: messageRef.id,
            conversationId: request.conversationId,
            sender: {
                id: currentUser.id,
                name: currentUser.fullName,
                avatar: currentUser.profilePicture,
                role: currentUser.role
            },
            type: request.type,
            content: request.content,
            attachments,
            replyTo,
            mentions: request.mentions || [],
            status: 'sent',
            reactions: {},
            readBy: {
                [currentUser.id]: Timestamp.now() as any
            },
            edited: false,
            createdAt: Timestamp.now() as any
        };

        // Add message to Firestore
        batch.set(messageRef, newMessage);

        // Update conversation's last message and timestamp
        batch.update(doc(this.conversationsRef, request.conversationId), {
            lastMessage: {
                id: messageRef.id,
                content: request.content || (attachments.length ? 'Sent an attachment' : ''),
                sender: {
                    id: currentUser.id,
                    name: currentUser.fullName
                },
                type: request.type,
                createdAt: Timestamp.now() as any
            },
            updatedAt: serverTimestamp()
        });

        await batch.commit();

        // Create notifications for mentioned users
        if (request.mentions && request.mentions.length > 0) {
            for (const mentionedUserId of request.mentions) {
                if (mentionedUserId !== currentUser.id) {
                    await this.createChatNotification({
                        userId: mentionedUserId,
                        conversationId: request.conversationId,
                        messageId: messageRef.id,
                        type: 'mention',
                        content: `${currentUser.fullName} mentioned you in ${conversation.name || 'a conversation'}`
                    });
                }
            }
        }

        // Create notifications for other participants (except sender)
        const otherParticipants = conversation.participants
            .filter(p => p.id !== currentUser.id && p.id !== 'system');

        // Check if user has muted the conversation before sending notification
        for (const participant of otherParticipants) {
            // Skip mentioned users (they already got a notification)
            if (request.mentions && request.mentions.includes(participant.id)) {
                continue;
            }

            // Check if user has muted the conversation
            const participantQuery = query(
                this.participantsRef,
                where('conversationId', '==', request.conversationId),
                where('userId', '==', participant.id)
            );

            const participantSnapshot = await getDocs(participantQuery);

            if (participantSnapshot.docs.length > 0) {
                const participantData = participantSnapshot.docs[0].data() as ConversationParticipant;

                if (!participantData.notificationSettings?.muted) {
                    await this.createChatNotification({
                        userId: participant.id,
                        conversationId: request.conversationId,
                        messageId: messageRef.id,
                        type: 'new_message',
                        content: `${currentUser.fullName}: ${request.content || 'Sent an attachment'}`
                    });
                }
            }
        }

        return messageRef.id;
    }

    /**
     * Retrieves messages for a conversation with pagination
     */
    async getMessages(
        conversationId: string,
        resultLimit = 50,
        beforeMessageId?: string
    ): Promise<MessageWithExtras[]> {
        let messagesQuery;

        if (beforeMessageId) {
            const beforeMessage = await getDoc(doc(this.messagesRef, beforeMessageId));

            if (!beforeMessage.exists()) {
                throw new Error('Reference message not found');
            }

            messagesQuery = query(
                this.messagesRef,
                where('conversationId', '==', conversationId),
                orderBy('createdAt', 'desc'),
                startAfter(beforeMessage),
                limit(resultLimit)
            );
        } else {
            messagesQuery = query(
                this.messagesRef,
                where('conversationId', '==', conversationId),
                orderBy('createdAt', 'desc'),
                limit(resultLimit)
            );
        }

        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map(doc => doc.data() as ChatMessage);

        // Fetch reaction details for each message
        const messagesWithReactions: MessageWithExtras[] = [];

        for (const message of messages) {
            // Get reactions for this message
            const reactionsQuery = query(
                this.reactionsRef,
                where('messageId', '==', message.id)
            );

            const reactionsSnapshot = await getDocs(reactionsQuery);
            const reactions = reactionsSnapshot.docs.map(doc => doc.data() as MessageReaction);

            // Group reactions by type
            const reactionsDetails: {
                [emojiKey: string]: {
                    count: number;
                    users: string[];
                    userNames: string[];
                }
            } = {};

            for (const reaction of reactions) {
                if (!reactionsDetails[reaction.type]) {
                    reactionsDetails[reaction.type] = {
                        count: 0,
                        users: [],
                        userNames: []
                    };
                }

                reactionsDetails[reaction.type].count++;
                reactionsDetails[reaction.type].users.push(reaction.userId);
                reactionsDetails[reaction.type].userNames.push(reaction.userName);
            }

            messagesWithReactions.push({
                ...message,
                reactionsDetails
            });
        }

        // Sort messages by creation time (oldest first)
        return messagesWithReactions.sort((a, b) =>
            (a.createdAt as Timestamp).toMillis() - (b.createdAt as Timestamp).toMillis()
        );
    }

    /**
     * Listen to messages in a conversation with real-time updates
     */
    listenToMessages(
        conversationId: string,
        callback: (messages: MessageWithExtras[]) => void,
        resultLimit = 50
    ): () => void {
        const messagesQuery = query(
            this.messagesRef,
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'desc'),
            limit(resultLimit)
        );

        return onSnapshot(messagesQuery, async (snapshot) => {
            const messages = snapshot.docs.map(doc => doc.data() as ChatMessage);

            // Process reactions for each message
            const messagesWithReactions: MessageWithExtras[] = [];

            for (const message of messages) {
                // Get reactions for this message
                const reactionsQuery = query(
                    this.reactionsRef,
                    where('messageId', '==', message.id)
                );

                const reactionsSnapshot = await getDocs(reactionsQuery);
                const reactions = reactionsSnapshot.docs.map(doc => doc.data() as MessageReaction);

                // Group reactions by type
                const reactionsDetails: {
                    [emojiKey: string]: {
                        count: number;
                        users: string[];
                        userNames: string[];
                    }
                } = {};

                for (const reaction of reactions) {
                    if (!reactionsDetails[reaction.type]) {
                        reactionsDetails[reaction.type] = {
                            count: 0,
                            users: [],
                            userNames: []
                        };
                    }

                    reactionsDetails[reaction.type].count++;
                    reactionsDetails[reaction.type].users.push(reaction.userId);
                    reactionsDetails[reaction.type].userNames.push(reaction.userName);
                }

                messagesWithReactions.push({
                    ...message,
                    reactionsDetails
                });
            }

            // Sort messages by creation time (oldest first)
            callback(messagesWithReactions.sort((a, b) =>
                (a.createdAt as Timestamp).toMillis() - (b.createdAt as Timestamp).toMillis()
            ));
        });
    }

    /**
     * Mark messages as read in a conversation
     */
    async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
        // Get unread messages
        const unreadMessagesQuery = query(
            this.messagesRef,
            where('conversationId', '==', conversationId),
            where(`readBy.${userId}`, '==', null)
        );

        const unreadSnapshot = await getDocs(unreadMessagesQuery);

        if (unreadSnapshot.empty) {
            return; // No unread messages
        }

        // Update each message
        const batch = writeBatch(db);
        const now = Timestamp.now();

        unreadSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, {
                [`readBy.${userId}`]: now,
                status: 'read'
            });
        });

        // Update the last read timestamp in the participation document
        const participantQuery = query(
            this.participantsRef,
            where('conversationId', '==', conversationId),
            where('userId', '==', userId)
        );

        const participantSnapshot = await getDocs(participantQuery);

        if (!participantSnapshot.empty) {
            batch.update(participantSnapshot.docs[0].ref, {
                lastRead: now
            });
        }

        await batch.commit();
    }

    /**
     * Edit a message
     */
    async editMessage(
        messageId: string,
        newContent: string,
        userId: string
    ): Promise<void> {
        const messageDoc = await getDoc(doc(this.messagesRef, messageId));

        if (!messageDoc.exists()) {
            throw new Error('Message not found');
        }

        const message = messageDoc.data() as ChatMessage;

        // Check if user is the sender
        if (message.sender.id !== userId) {
            throw new Error('Only the sender can edit the message');
        }

        // Check if it's not a system message
        if (message.type === 'system') {
            throw new Error('System messages cannot be edited');
        }

        // Update the message
        await updateDoc(doc(this.messagesRef, messageId), {
            content: newContent,
            edited: true,
            editedAt: Timestamp.now()
        });

        // Update the conversation's last message if needed
        const conversationDoc = await getDoc(doc(this.conversationsRef, message.conversationId));

        if (conversationDoc.exists()) {
            const conversation = conversationDoc.data() as ChatConversation;

            if (conversation.lastMessage?.id === messageId) {
                await updateDoc(doc(this.conversationsRef, message.conversationId), {
                    'lastMessage.content': newContent
                });
            }
        }
    }

    /**
     * Delete a message (soft delete)
     */
    async deleteMessage(messageId: string, userId: string): Promise<void> {
        const messageDoc = await getDoc(doc(this.messagesRef, messageId));

        if (!messageDoc.exists()) {
            throw new Error('Message not found');
        }

        const message = messageDoc.data() as ChatMessage;

        // Check if user is the sender or an admin
        const conversationDoc = await getDoc(doc(this.conversationsRef, message.conversationId));

        if (!conversationDoc.exists()) {
            throw new Error('Conversation not found');
        }

        const conversation = conversationDoc.data() as ChatConversation;
        const participant = conversation.participants.find(p => p.id === userId);

        const isAdmin = participant?.role === 'admin';
        const isSender = message.sender.id === userId;

        if (!isAdmin && !isSender) {
            throw new Error('No permission to delete this message');
        }

        if (message.type === 'system' && !isAdmin) {
            throw new Error('Only admins can delete system messages');
        }

        // Soft delete the message (update content)
        await updateDoc(doc(this.messagesRef, messageId), {
            content: 'This message was deleted',
            attachments: [],
            deletedForUsers: arrayUnion(userId),
            edited: true,
            editedAt: Timestamp.now()
        });

        // If it was the last message, set the previous message as the last one
        if (conversation.lastMessage?.id === messageId) {
            // Find the previous message
            const previousMessagesQuery = query(
                this.messagesRef,
                where('conversationId', '==', message.conversationId),
                where('createdAt', '<', message.createdAt),
                orderBy('createdAt', 'desc'),
                limit(1)
            );

            const previousMessagesSnapshot = await getDocs(previousMessagesQuery);

            if (!previousMessagesSnapshot.empty) {
                const previousMessage = previousMessagesSnapshot.docs[0].data() as ChatMessage;

                await updateDoc(doc(this.conversationsRef, message.conversationId), {
                    lastMessage: {
                        id: previousMessage.id,
                        content: previousMessage.content,
                        sender: previousMessage.sender,
                        type: previousMessage.type,
                        createdAt: previousMessage.createdAt
                    }
                });
            } else {
                // No previous message, set a placeholder
                await updateDoc(doc(this.conversationsRef, message.conversationId), {
                    lastMessage: null
                });
            }
        }
    }

    /**
     * Add a reaction to a message
     */
    async addReaction(messageId: string, reaction: string, user: User): Promise<string> {
        // Check if message exists
        const messageDoc = await getDoc(doc(this.messagesRef, messageId));

        if (!messageDoc.exists()) {
            throw new Error('Message not found');
        }

        const message = messageDoc.data() as ChatMessage;

        // Check if user already reacted with this emoji
        const existingReactionQuery = query(
            this.reactionsRef,
            where('messageId', '==', messageId),
            where('userId', '==', user.id),
            where('type', '==', reaction)
        );

        const existingReactionSnapshot = await getDocs(existingReactionQuery);

        // If user already reacted with this emoji, return the id
        if (!existingReactionSnapshot.empty) {
            return existingReactionSnapshot.docs[0].id;
        }

        // Create a new reaction
        const reactionRef = doc(this.reactionsRef);

        await setDoc(reactionRef, {
            id: reactionRef.id,
            messageId,
            userId: user.id,
            userName: user.fullName,
            type: reaction,
            createdAt: Timestamp.now()
        });

        // Update the message's reactions
        const reactions = message.reactions || {};
        const usersReacted = reactions[reaction] || [];

        if (!usersReacted.includes(user.id)) {
            await updateDoc(doc(this.messagesRef, messageId), {
                [`reactions.${reaction}`]: arrayUnion(user.id)
            });
        }

        // Create notification for message sender if not the current user
        if (message.sender.id !== user.id) {
            await this.createChatNotification({
                userId: message.sender.id,
                conversationId: message.conversationId,
                messageId,
                type: 'reaction',
                content: `${user.fullName} reacted with ${reaction} to your message`
            });
        }

        return reactionRef.id;
    }

    /**
     * Remove a reaction from a message
     */
    async removeReaction(messageId: string, reaction: string, userId: string): Promise<void> {
        // Find the reaction
        const reactionQuery = query(
            this.reactionsRef,
            where('messageId', '==', messageId),
            where('userId', '==', userId),
            where('type', '==', reaction)
        );

        const reactionSnapshot = await getDocs(reactionQuery);

        if (reactionSnapshot.empty) {
            return; // No reaction to remove
        }

        // Delete the reaction
        await deleteDoc(reactionSnapshot.docs[0].ref);

        // Update the message's reactions
        await updateDoc(doc(this.messagesRef, messageId), {
            [`reactions.${reaction}`]: arrayRemove(userId)
        });
    }

    /**
     * Upload and send a voice note
     */
    async sendVoiceNote(
        conversationId: string,
        audioBlob: Blob,
        duration: number,
        waveform: number[],
        user: User
    ): Promise<string> {
        // Create a unique ID for the voice note
        const voiceNoteId = uuidv4();
        const messageRef = doc(this.messagesRef);

        // Upload audio file to storage
        const filePath = `voice_notes/${conversationId}/${messageRef.id}/${voiceNoteId}.webm`;
        const fileRef = storageRef(storage, filePath);

        await uploadBytes(fileRef, audioBlob, {
            contentType: 'audio/webm'
        });

        const downloadUrl = await getDownloadURL(fileRef);

        // Store voice note metadata
        const voiceNoteRef = doc(this.voiceNotesRef);
        await setDoc(voiceNoteRef, {
            id: voiceNoteRef.id,
            conversationId,
            messageId: messageRef.id,
            url: downloadUrl,
            duration,
            waveform,
            createdAt: Timestamp.now()
        });

        // Create a message with the voice note
        const message: Partial<ChatMessage> = {
            id: messageRef.id,
            conversationId,
            sender: {
                id: user.id,
                name: user.fullName,
                avatar: user.profilePicture,
                role: user.role
            },
            type: 'voice_note',
            content: 'Voice message',
            attachments: [{
                id: voiceNoteRef.id,
                type: 'audio',
                url: downloadUrl,
                name: 'Voice message',
                size: audioBlob.size,
                mimeType: 'audio/webm',
                duration,
                createdAt: Timestamp.now() as any
            }],
            mentions: [],
            status: 'sent',
            reactions: {},
            readBy: {
                [user.id]: Timestamp.now() as any
            },
            edited: false,
            createdAt: Timestamp.now() as any,
            metadata: {
                voiceNoteId: voiceNoteRef.id,
                duration,
                waveform
            }
        };

        // Use a batch write to update both the message and the conversation
        const batch = writeBatch(db);

        // Add the message
        batch.set(messageRef, message);

        // Update the conversation's last message
        batch.update(doc(this.conversationsRef, conversationId), {
            lastMessage: {
                id: messageRef.id,
                content: 'Voice message',
                sender: {
                    id: user.id,
                    name: user.fullName
                },
                type: 'voice_note',
                createdAt: Timestamp.now() as any
            },
            updatedAt: serverTimestamp()
        });

        await batch.commit();

        // Get conversation to notify participants
        const conversationDoc = await getDoc(doc(this.conversationsRef, conversationId));

        if (conversationDoc.exists()) {
            const conversation = conversationDoc.data() as ChatConversation;

            // Create notifications for other participants (except sender)
            const otherParticipants = conversation.participants
                .filter(p => p.id !== user.id && p.id !== 'system');

            for (const participant of otherParticipants) {
                // Check if user has muted the conversation
                const participantQuery = query(
                    this.participantsRef,
                    where('conversationId', '==', conversationId),
                    where('userId', '==', participant.id)
                );

                const participantSnapshot = await getDocs(participantQuery);

                if (participantSnapshot.docs.length > 0) {
                    const participantData = participantSnapshot.docs[0].data() as ConversationParticipant;

                    if (!participantData.notificationSettings?.muted) {
                        await this.createChatNotification({
                            userId: participant.id,
                            conversationId,
                            messageId: messageRef.id,
                            type: 'new_message',
                            content: `${user.fullName} sent a voice message`
                        });
                    }
                }
            }
        }

        return messageRef.id;
    }

    /**
     * Get voice note details
     */
    async getVoiceNote(voiceNoteId: string): Promise<VoiceNote | null> {
        const voiceNoteDoc = await getDoc(doc(this.voiceNotesRef, voiceNoteId));

        if (!voiceNoteDoc.exists()) {
            return null;
        }

        return voiceNoteDoc.data() as VoiceNote;
    }

    /**
     * Start a call in a conversation
     */
    async startCall(
        conversationId: string,
        callType: 'audio' | 'video',
        initiatedBy: User
    ): Promise<string> {
        // Check if the conversation exists
        const conversationDoc = await getDoc(doc(this.conversationsRef, conversationId));

        if (!conversationDoc.exists()) {
            throw new Error('Conversation not found');
        }

        const conversation = conversationDoc.data() as ChatConversation;

        // Check if user is a participant
        if (!conversation.participants.some(p => p.id === initiatedBy.id)) {
            throw new Error('User is not a participant in this conversation');
        }

        // Check if there's an ongoing call in this conversation
        const ongoingCallQuery = query(
            this.callsRef,
            where('conversationId', '==', conversationId),
            where('status', 'in', ['ringing', 'ongoing'])
        );

        const ongoingCallSnapshot = await getDocs(ongoingCallQuery);

        if (!ongoingCallSnapshot.empty) {
            const ongoingCall = ongoingCallSnapshot.docs[0].data() as ChatCall;

            // If the user is already in the call, return the call ID
            if (ongoingCall.participants.some(p => p.userId === initiatedBy.id)) {
                return ongoingCall.id;
            }

            throw new Error('There is already an ongoing call in this conversation');
        }

        // Create a new call
        const callRef = doc(this.callsRef);
        const participants = conversation.participants
            .filter(p => p.id !== 'system')
            .map(p => ({
                userId: p.id,
                status: p.id === initiatedBy.id ? 'joined' : 'invited'
            }));

        await setDoc(callRef, {
            id: callRef.id,
            conversationId,
            initiatedBy: initiatedBy.id,
            type: callType,
            status: 'ringing',
            participants,
            startedAt: Timestamp.now(),
            metadata: {
                initiatorName: initiatedBy.fullName
            }
        });

        // Create a system message about the call
        const messageRef = doc(this.messagesRef);
        await setDoc(messageRef, {
            id: messageRef.id,
            conversationId,
            sender: {
                id: 'system',
                name: 'System'
            },
            type: 'system',
            content: `${initiatedBy.fullName} started a ${callType} call`,
            attachments: [],
            mentions: [],
            status: 'delivered',
            reactions: {},
            readBy: {},
            edited: false,
            createdAt: Timestamp.now(),
            metadata: {
                callId: callRef.id,
                callType,
                callStatus: 'started'
            }
        });

        // Update the conversation's last message
        await updateDoc(doc(this.conversationsRef, conversationId), {
            lastMessage: {
                id: messageRef.id,
                content: `${initiatedBy.fullName} started a ${callType} call`,
                sender: {
                    id: 'system',
                    name: 'System'
                },
                type: 'system',
                createdAt: Timestamp.now() as any
            },
            updatedAt: serverTimestamp()
        });

        // Create notifications for other participants
        const otherParticipants = conversation.participants
            .filter(p => p.id !== initiatedBy.id && p.id !== 'system');

        for (const participant of otherParticipants) {
            await this.createChatNotification({
                userId: participant.id,
                conversationId,
                messageId: messageRef.id,
                type: 'call',
                content: `${initiatedBy.fullName} is calling you (${callType})`
            });
        }

        return callRef.id;
    }

    /**
     * Join a call
     */
    async joinCall(callId: string, userId: string): Promise<void> {
        const callDoc = await getDoc(doc(this.callsRef, callId));

        if (!callDoc.exists()) {
            throw new Error('Call not found');
        }

        const call = callDoc.data() as ChatCall;

        // Check if the call is still active
        if (call.status !== 'ringing' && call.status !== 'ongoing') {
            throw new Error('Call is not active');
        }

        // Check if user is a participant
        const participantIndex = call.participants.findIndex(p => p.userId === userId);

        if (participantIndex === -1) {
            throw new Error('User is not invited to this call');
        }

        // Update the participant's status
        const updatedParticipants = [...call.participants];
        updatedParticipants[participantIndex] = {
            ...updatedParticipants[participantIndex],
            status: 'joined',
            joinedAt: Timestamp.now() as any
        };

        // Update the call status to ongoing
        await updateDoc(doc(this.callsRef, callId), {
            participants: updatedParticipants,
            status: 'ongoing'
        });

        // Get user info for the system message
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (userDoc.exists()) {
            const user = userDoc.data() as User;

            // Add a system message that the user joined (only if they're not the initiator)
            if (call.initiatedBy !== userId) {
                const messageRef = doc(this.messagesRef);
                await setDoc(messageRef, {
                    id: messageRef.id,
                    conversationId: call.conversationId,
                    sender: {
                        id: 'system',
                        name: 'System'
                    },
                    type: 'system',
                    content: `${user.fullName} joined the call`,
                    attachments: [],
                    mentions: [],
                    status: 'delivered',
                    reactions: {},
                    readBy: {},
                    edited: false,
                    createdAt: Timestamp.now(),
                    metadata: {
                        callId,
                        callType: call.type,
                        callStatus: 'joined'
                    }
                });
            }
        }
    }

    /**
     * Decline a call
     */
    async declineCall(callId: string, userId: string): Promise<void> {
        const callDoc = await getDoc(doc(this.callsRef, callId));

        if (!callDoc.exists()) {
            throw new Error('Call not found');
        }

        const call = callDoc.data() as ChatCall;

        // Check if the call is still ringing
        if (call.status !== 'ringing') {
            throw new Error('Call cannot be declined at this stage');
        }

        // Check if user is a participant
        const participantIndex = call.participants.findIndex(p => p.userId === userId);

        if (participantIndex === -1) {
            throw new Error('User is not invited to this call');
        }

        // Update the participant's status
        const updatedParticipants = [...call.participants];
        updatedParticipants[participantIndex] = {
            ...updatedParticipants[participantIndex],
            status: 'declined'
        };

        // Update the call
        await updateDoc(doc(this.callsRef, callId), {
            participants: updatedParticipants
        });

        // Check if all participants have declined
        const allDeclined = updatedParticipants.every(p =>
            p.userId === call.initiatedBy || p.status === 'declined'
        );

        if (allDeclined) {
            // End the call if everyone declined
            await updateDoc(doc(this.callsRef, callId), {
                status: 'ended',
                endedAt: Timestamp.now(),
                duration: 0
            });

            // Add a system message
            const messageRef = doc(this.messagesRef);
            await setDoc(messageRef, {
                id: messageRef.id,
                conversationId: call.conversationId,
                sender: {
                    id: 'system',
                    name: 'System'
                },
                type: 'system',
                content: 'Call ended - no one joined',
                attachments: [],
                mentions: [],
                status: 'delivered',
                reactions: {},
                readBy: {},
                edited: false,
                createdAt: Timestamp.now(),
                metadata: {
                    callId,
                    callType: call.type,
                    callStatus: 'ended',
                    duration: 0
                }
            });

            // Update the conversation's last message
            await updateDoc(doc(this.conversationsRef, call.conversationId), {
                lastMessage: {
                    id: messageRef.id,
                    content: 'Call ended - no one joined',
                    sender: {
                        id: 'system',
                        name: 'System'
                    },
                    type: 'system',
                    createdAt: Timestamp.now() as any
                },
                updatedAt: serverTimestamp()
            });
        } else {
            // Get user info for the system message
            const userDoc = await getDoc(doc(db, 'users', userId));

            if (userDoc.exists()) {
                const user = userDoc.data() as User;

                // Add a system message that the user declined
                const messageRef = doc(this.messagesRef);
                await setDoc(messageRef, {
                    id: messageRef.id,
                    conversationId: call.conversationId,
                    sender: {
                        id: 'system',
                        name: 'System'
                    },
                    type: 'system',
                    content: `${user.fullName} declined the call`,
                    attachments: [],
                    mentions: [],
                    status: 'delivered',
                    reactions: {},
                    readBy: {},
                    edited: false,
                    createdAt: Timestamp.now(),
                    metadata: {
                        callId,
                        callType: call.type,
                        callStatus: 'declined'
                    }
                });
            }
        }
    }

    /**
     * Leave a call
     */
    async leaveCall(callId: string, userId: string): Promise<void> {
        const callDoc = await getDoc(doc(this.callsRef, callId));

        if (!callDoc.exists()) {
            throw new Error('Call not found');
        }

        const call = callDoc.data() as ChatCall;

        // Check if the call is ongoing
        if (call.status !== 'ongoing') {
            throw new Error('Call is not active');
        }

        // Check if user is a participant and has joined
        const participantIndex = call.participants.findIndex(p =>
            p.userId === userId && p.status === 'joined'
        );

        if (participantIndex === -1) {
            throw new Error('User is not in this call');
        }

        // Update the participant's status
        const updatedParticipants = [...call.participants];
        updatedParticipants[participantIndex] = {
            ...updatedParticipants[participantIndex],
            status: 'left',
            leftAt: Timestamp.now() as any
        };

        // Check if this was the last person in the call
        const remainingParticipants = updatedParticipants.filter(p => p.status === 'joined');

        if (remainingParticipants.length === 0) {
            // End the call if everyone left
            const startTime = firebaseDateToMillis(call.startedAt);
            const endTime = Timestamp.now().toMillis();
            const duration = Math.floor((endTime - startTime) / 1000); // duration in seconds

            await updateDoc(doc(this.callsRef, callId), {
                participants: updatedParticipants,
                status: 'ended',
                endedAt: Timestamp.now(),
                duration
            });

            // Add a system message for call ended
            const messageRef = doc(this.messagesRef);
            await setDoc(messageRef, {
                id: messageRef.id,
                conversationId: call.conversationId,
                sender: {
                    id: 'system',
                    name: 'System'
                },
                type: 'system',
                content: `Call ended - ${this.formatCallDuration(duration)}`,
                attachments: [],
                mentions: [],
                status: 'delivered',
                reactions: {},
                readBy: {},
                edited: false,
                createdAt: Timestamp.now(),
                metadata: {
                    callId,
                    callType: call.type,
                    callStatus: 'ended',
                    duration
                }
            });

            // Update the conversation's last message
            await updateDoc(doc(this.conversationsRef, call.conversationId), {
                lastMessage: {
                    id: messageRef.id,
                    content: `Call ended - ${this.formatCallDuration(duration)}`,
                    sender: {
                        id: 'system',
                        name: 'System'
                    },
                    type: 'system',
                    createdAt: Timestamp.now() as any
                },
                updatedAt: serverTimestamp()
            });
        } else {
            // Just update the participant status
            await updateDoc(doc(this.callsRef, callId), {
                participants: updatedParticipants
            });

            // Get user info for the system message
            const userDoc = await getDoc(doc(db, 'users', userId));

            if (userDoc.exists()) {
                const user = userDoc.data() as User;

                // Add a system message that the user left
                const messageRef = doc(this.messagesRef);
                await setDoc(messageRef, {
                    id: messageRef.id,
                    conversationId: call.conversationId,
                    sender: {
                        id: 'system',
                        name: 'System'
                    },
                    type: 'system',
                    content: `${user.fullName} left the call`,
                    attachments: [],
                    mentions: [],
                    status: 'delivered',
                    reactions: {},
                    readBy: {},
                    edited: false,
                    createdAt: Timestamp.now(),
                    metadata: {
                        callId,
                        callType: call.type,
                        callStatus: 'left'
                    }
                });
            }
        }
    }

    /**
     * End an ongoing call (by admin or initiator)
     */
    async endCall(callId: string, userId: string): Promise<void> {
        const callDoc = await getDoc(doc(this.callsRef, callId));

        if (!callDoc.exists()) {
            throw new Error('Call not found');
        }

        const call = callDoc.data() as ChatCall;

        // Check if the call is active
        if (call.status !== 'ringing' && call.status !== 'ongoing') {
            throw new Error('Call is not active');
        }

        // Check if user is the initiator or an admin in the conversation
        if (call.initiatedBy !== userId) {
            // Check if user is an admin
            const conversationDoc = await getDoc(doc(this.conversationsRef, call.conversationId));

            if (!conversationDoc.exists()) {
                throw new Error('Conversation not found');
            }

            const conversation = conversationDoc.data() as ChatConversation;
            const participant = conversation.participants.find(p => p.id === userId);

            if (!participant || participant.role !== 'admin') {
                throw new Error('Only the call initiator or a conversation admin can end the call');
            }
        }


        const startTime = firebaseDateToMillis(call.startedAt);

        const endTime = Timestamp.now().toMillis();
        const duration = Math.floor((endTime - startTime) / 1000); // duration in seconds

        // Mark all active participants as left
        const updatedParticipants = call.participants.map(participant => {
            if (participant.status === 'joined') {
                return {
                    ...participant,
                    status: 'left',
                    leftAt: Timestamp.now()
                };
            }
            return participant;
        });

        // Update the call
        await updateDoc(doc(this.callsRef, callId), {
            participants: updatedParticipants,
            status: 'ended',
            endedAt: Timestamp.now(),
            duration
        });

        // Get user info for the system message
        const userDoc = await getDoc(doc(db, 'users', userId));
        let userName = 'Unknown user';

        if (userDoc.exists()) {
            const user = userDoc.data() as User;
            userName = user.fullName;
        }

        // Add a system message for call ended
        const messageRef = doc(this.messagesRef);
        await setDoc(messageRef, {
            id: messageRef.id,
            conversationId: call.conversationId,
            sender: {
                id: 'system',
                name: 'System'
            },
            type: 'system',
            content: `${userName} ended the call - ${this.formatCallDuration(duration)}`,
            attachments: [],
            mentions: [],
            status: 'delivered',
            reactions: {},
            readBy: {},
            edited: false,
            createdAt: Timestamp.now(),
            metadata: {
                callId,
                callType: call.type,
                callStatus: 'ended',
                duration,
                endedBy: userId
            }
        });

        // Update the conversation's last message
        await updateDoc(doc(this.conversationsRef, call.conversationId), {
            lastMessage: {
                id: messageRef.id,
                content: `${userName} ended the call - ${this.formatCallDuration(duration)}`,
                sender: {
                    id: 'system',
                    name: 'System'
                },
                type: 'system',
                createdAt: Timestamp.now()
            },
            updatedAt: serverTimestamp()
        });
    }

    /**
     * Get the status of an ongoing call in a conversation
     */
    async getActiveCall(conversationId: string): Promise<ChatCall | null> {
        const activeCallQuery = query(
            this.callsRef,
            where('conversationId', '==', conversationId),
            where('status', 'in', ['ringing', 'ongoing'])
        );

        const activeCallSnapshot = await getDocs(activeCallQuery);

        if (activeCallSnapshot.empty) {
            return null;
        }

        return activeCallSnapshot.docs[0].data() as ChatCall;
    }

    /**
     * Listen to changes in a call
     */
    listenToCall(callId: string, callback: (call: ChatCall | null) => void): () => void {
        const callRef = doc(this.callsRef, callId);

        return onSnapshot(callRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as ChatCall);
            } else {
                callback(null);
            }
        });
    }

    /**
     * Format call duration in a readable format (e.g., "2m 30s")
     */
    private formatCallDuration(seconds: number): string {
        if (seconds < 60) {
            return `${seconds}s`;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes < 60) {
            return `${minutes}m ${remainingSeconds}s`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    }

    /**
     * Get call details by ID
     */
    async getCall(callId: string): Promise<ChatCall | null> {
        const callDoc = await getDoc(doc(this.callsRef, callId));

        if (!callDoc.exists()) {
            return null;
        }

        return callDoc.data() as ChatCall;
    }

    /**
     * Update a conversation
     */
    async updateConversation(
        conversationId: string,
        userId: string,
        updates: UpdateConversationRequest
    ): Promise<void> {
        // Verify user has permission
        const conversationDoc = await getDoc(doc(this.conversationsRef, conversationId));

        if (!conversationDoc.exists()) {
            throw new Error('Conversation not found');
        }

        const conversation = conversationDoc.data() as ChatConversation;
        const participant = conversation.participants.find(p => p.id === userId);

        if (!participant || participant.role !== 'admin') {
            throw new Error('User does not have permission to update this conversation');
        }

        const updateData: Record<string, any> = {
            updatedAt: serverTimestamp()
        };

        // Handle name update
        if (updates.name !== undefined) {
            updateData.name = updates.name;
        }

        // Handle description update
        if (updates.description !== undefined) {
            updateData.description = updates.description;
        }

        // Handle avatar update
        if (updates.avatar) {
            const fileRef = storageRef(storage, `conversation_avatars/${conversationId}`);

            // Delete old avatar if exists
            if (conversation.avatar) {
                try {
                    await deleteObject(fileRef);
                } catch (error) {
                    console.error('Error deleting old avatar:', error);
                }
            }

            // Upload new avatar
            await uploadBytes(fileRef, updates.avatar);
            updateData.avatar = await getDownloadURL(fileRef);
        }

        // Update conversation
        await updateDoc(doc(this.conversationsRef, conversationId), updateData);

        // Create system message about the update
        await this.addSystemMessage(
            conversationId,
            userId,
            `${conversation.participants.find(p => p.id === userId)?.id} updated the conversation details`
        );
    }

    /**
     * Add a system message to a conversation
     */
    private async addSystemMessage(
        conversationId: string,
        userId: string,
        content: string
    ): Promise<string> {
        const messageRef = doc(this.messagesRef);
        const now = Timestamp.now();

        await setDoc(messageRef, {
            id: messageRef.id,
            conversationId,
            sender: {
                id: 'system',
                name: 'System'
            },
            type: 'system',
            content,
            attachments: [],
            mentions: [],
            status: 'delivered',
            reactions: {},
            readBy: {
                [userId]: now
            },
            edited: false,
            createdAt: now
        });

        await updateDoc(doc(this.conversationsRef, conversationId), {
            lastMessage: {
                id: messageRef.id,
                content,
                sender: {
                    id: 'system',
                    name: 'System'
                },
                type: 'system',
                createdAt: now
            },
            updatedAt: serverTimestamp()
        });

        return messageRef.id;
    }

    /**
     * Get notifications for a user
     */
    async getNotifications(
        userId: string,
        resultLimit = 20,
        beforeId?: string
    ): Promise<ChatNotification[]> {
        let notificationsQuery;

        if (beforeId) {
            const beforeDoc = await getDoc(doc(this.notificationsRef, beforeId));

            if (!beforeDoc.exists()) {
                throw new Error('Reference notification not found');
            }

            notificationsQuery = query(
                this.notificationsRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                startAfter(beforeDoc),
                limit(resultLimit)
            );
        } else {
            notificationsQuery = query(
                this.notificationsRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(resultLimit)
            );
        }

        const notificationsSnap = await getDocs(notificationsQuery);
        return notificationsSnap.docs.map(doc => doc.data() as ChatNotification);
    }

    /**
     * Mark notification as read
     */
    async markNotificationAsRead(notificationId: string): Promise<void> {
        await updateDoc(doc(this.notificationsRef, notificationId), {
            read: true
        });
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllNotificationsAsRead(userId: string): Promise<void> {
        const notificationsQuery = query(
            this.notificationsRef,
            where('userId', '==', userId),
            where('read', '==', false)
        );

        const notificationsSnap = await getDocs(notificationsQuery);

        const batch = writeBatch(db);
        notificationsSnap.docs.forEach(doc => {
            batch.update(doc.ref, { read: true });
        });

        await batch.commit();
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId: string): Promise<void> {
        await deleteDoc(doc(this.notificationsRef, notificationId));
    }

    /**
     * Pin or unpin a conversation for a user
     */
    async togglePinConversation(
        conversationId: string,
        userId: string,
        pinned: boolean
    ): Promise<void> {
        const participantQuery = query(
            this.participantsRef,
            where('conversationId', '==', conversationId),
            where('userId', '==', userId)
        );

        const participantSnap = await getDocs(participantQuery);

        if (participantSnap.empty) {
            throw new Error('User is not a participant in this conversation');
        }

        await updateDoc(participantSnap.docs[0].ref, { pinned });
    }

    /**
     * Mute or unmute notifications for a conversation
     */
    async toggleMuteConversation(
        conversationId: string,
        userId: string,
        muted: boolean
    ): Promise<void> {
        const participantQuery = query(
            this.participantsRef,
            where('conversationId', '==', conversationId),
            where('userId', '==', userId)
        );

        const participantSnap = await getDocs(participantQuery);

        if (participantSnap.empty) {
            throw new Error('User is not a participant in this conversation');
        }

        await updateDoc(participantSnap.docs[0].ref, {
            'notificationSettings.muted': muted
        });
    }

    /**
     * Update notification preferences for a conversation
     */
    async updateNotificationPreferences(
        conversationId: string,
        userId: string,
        preferences: {
            desktop?: boolean;
            mobile?: boolean;
            email?: boolean;
        }
    ): Promise<void> {
        const participantQuery = query(
            this.participantsRef,
            where('conversationId', '==', conversationId),
            where('userId', '==', userId)
        );

        const participantSnap = await getDocs(participantQuery);

        if (participantSnap.empty) {
            throw new Error('User is not a participant in this conversation');
        }

        const updateData: Record<string, any> = {};

        if (preferences.desktop !== undefined) {
            updateData['notificationSettings.desktop'] = preferences.desktop;
        }

        if (preferences.mobile !== undefined) {
            updateData['notificationSettings.mobile'] = preferences.mobile;
        }

        if (preferences.email !== undefined) {
            updateData['notificationSettings.email'] = preferences.email;
        }

        await updateDoc(participantSnap.docs[0].ref, updateData);
    }

    /**
     * Get unread notification count for a user
     */
    async getUnreadNotificationCount(userId: string): Promise<number> {
        const unreadQuery = query(
            this.notificationsRef,
            where('userId', '==', userId),
            where('read', '==', false)
        );

        const unreadSnap = await getDocs(unreadQuery);
        return unreadSnap.size;
    }

    /**
     * Archive or unarchive a conversation for a user
     */
    async toggleArchiveConversation(
        conversationId: string,
        userId: string,
        archived: boolean
    ): Promise<void> {
        const participantQuery = query(
            this.participantsRef,
            where('conversationId', '==', conversationId),
            where('userId', '==', userId)
        );

        const participantSnap = await getDocs(participantQuery);

        if (participantSnap.empty) {
            throw new Error('User is not a participant in this conversation');
        }

        await updateDoc(participantSnap.docs[0].ref, { archived });
    }

    /**
     * Search for messages in a conversation
     */
    async searchMessages(
        conversationId: string,
        searchTerm: string,
        resultLimit = 20
    ): Promise<MessageWithExtras[]> {
        // Note: Firebase doesn't support full-text search
        // In a real application, you'd use a service like Algolia or Elasticsearch
        // This is a simple implementation that searches for exact matches
        const messagesQuery = query(
            this.messagesRef,
            where('conversationId', '==', conversationId),
            where('content', '>=', searchTerm),
            where('content', '<=', searchTerm + '\uf8ff'),
            limit(resultLimit)
        );

        const messagesSnap = await getDocs(messagesQuery);
        const messages = messagesSnap.docs.map(doc => doc.data() as ChatMessage);

        // Process reactions for each message
        const messagesWithReactions: MessageWithExtras[] = [];

        for (const message of messages) {
            const reactionsQuery = query(
                this.reactionsRef,
                where('messageId', '==', message.id)
            );

            const reactionsSnap = await getDocs(reactionsQuery);
            const reactions = reactionsSnap.docs.map(doc => doc.data() as MessageReaction);

            const reactionsDetails: {
                [emojiKey: string]: {
                    count: number;
                    users: string[];
                    userNames: string[];
                }
            } = {};

            for (const reaction of reactions) {
                if (!reactionsDetails[reaction.type]) {
                    reactionsDetails[reaction.type] = {
                        count: 0,
                        users: [],
                        userNames: []
                    };
                }

                reactionsDetails[reaction.type].count++;
                reactionsDetails[reaction.type].users.push(reaction.userId);
                reactionsDetails[reaction.type].userNames.push(reaction.userName);
            }

            messagesWithReactions.push({
                ...message,
                reactionsDetails
            });
        }

        return messagesWithReactions;
    }

    /**
     * Clear conversation history for a user
     */
    async clearConversationHistory(conversationId: string, userId: string): Promise<void> {
        // This is a soft delete - we mark all messages as deleted for this user
        const messagesQuery = query(
            this.messagesRef,
            where('conversationId', '==', conversationId)
        );

        const messagesSnap = await getDocs(messagesQuery);
        const batch = writeBatch(db);

        messagesSnap.docs.forEach(doc => {
            const message = doc.data() as ChatMessage;
            const deletedForUsers = message.deletedForUsers || [];

            if (!deletedForUsers.includes(userId)) {
                batch.update(doc.ref, {
                    deletedForUsers: arrayUnion(userId)
                });
            }
        });

        await batch.commit();

        // Add a system message that is only visible to the user
        const messageRef = doc(this.messagesRef);
        await setDoc(messageRef, {
            id: messageRef.id,
            conversationId,
            sender: {
                id: 'system',
                name: 'System'
            },
            type: 'system',
            content: 'You cleared the conversation history',
            attachments: [],
            mentions: [],
            status: 'delivered',
            reactions: {},
            readBy: {
                [userId]: Timestamp.now()
            },
            edited: false,
            createdAt: Timestamp.now(),
            metadata: {
                visibleOnlyTo: [userId]
            }
        });
    }
}