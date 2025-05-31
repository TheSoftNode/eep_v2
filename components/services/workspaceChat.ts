import axios from 'axios';
import 'firebase/firestore';
import {
    collection,
    query,
    where,
    orderBy,
    limit as limitFn,
    onSnapshot
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { ChatMessageProps } from '../Admin/AdminDashboard/Workspace/WorkspaceDetails/Chat/ChatMessage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yourapp.com';

// Convert Firestore message to ChatMessageProps
const convertMessage = (message: any): ChatMessageProps => {
    return {
        id: message.id,
        content: message.content,
        sender: {
            id: message.senderId,
            name: message.senderName,
            role: message.senderRole
        },
        timestamp: new Date(message.createdAt),
        attachments: message.attachments || []
    };
};

// Fetch messages from the API
export const fetchMessages = async (workspaceId: string, limit = 50): Promise<ChatMessageProps[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/workspaces/${workspaceId}/messages`, {
            params: { limit }
        });

        if (response.data.success) {
            return response.data.data.map(convertMessage);
        }

        throw new Error(response.data.message || 'Failed to fetch messages');
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

// Send a message via the API
export const sendMessage = async (
    workspaceId: string,
    content: string,
    isPrivate = false,
    recipientId?: string,
    attachments?: File[]
): Promise<ChatMessageProps> => {
    try {
        // First, handle file attachments if any
        let attachmentData: any[] = [];

        if (attachments && attachments.length > 0) {
            // Upload each file
            const uploadPromises = attachments.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', 'chat_attachments');

                const uploadResponse = await axios.post(
                    `${API_BASE_URL}/workspaces/${workspaceId}/files`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                if (uploadResponse.data.success) {
                    return {
                        id: uploadResponse.data.data.id,
                        name: file.name,
                        type: file.type,
                        url: uploadResponse.data.data.downloadUrl
                    };
                }

                throw new Error('Failed to upload attachment');
            });

            attachmentData = await Promise.all(uploadPromises);
        }

        // Now send the message with attachment references
        const messageData = {
            content,
            isPrivate,
            recipientId: isPrivate ? recipientId : undefined,
            attachments: attachmentData.length > 0 ? attachmentData : undefined
        };

        const response = await axios.post(
            `${API_BASE_URL}/workspaces/${workspaceId}/messages`,
            messageData
        );

        if (response.data.success) {
            return convertMessage(response.data.data);
        }

        throw new Error(response.data.message || 'Failed to send message');
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Set up real-time listener for new messages
export const subscribeToMessages = (
    workspaceId: string,
    onNewMessage: (message: ChatMessageProps) => void,
    limit = 50
): (() => void) => {
    const publicMessagesQuery = query(
        collection(db, 'workspaces', workspaceId, 'messages'),
        orderBy('createdAt', 'desc'),
        limitFn(limit)
    );

    const publicUnsub = onSnapshot(publicMessagesQuery, (snapshot) => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const message = { id: change.doc.id, ...change.doc.data() };
                onNewMessage(convertMessage(message));
            }
        });
    });

    const user = auth.currentUser;
    let privateUnsub = () => { };

    if (user) {
        const privateMessagesQuery = query(
            collection(db, 'workspaces', workspaceId, 'privateMessages'),
            where('isPrivate', '==', true),
            where('recipientId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limitFn(limit)
        );

        privateUnsub = onSnapshot(privateMessagesQuery, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const message = { id: change.doc.id, ...change.doc.data() };
                    onNewMessage(convertMessage(message));
                }
            });
        });
    }

    return () => {
        publicUnsub();
        privateUnsub();
    };
};