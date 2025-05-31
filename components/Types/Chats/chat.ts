import { FirebaseDate } from '../common';
import { User } from '../Users/user';

export type ChatMessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'voice_note' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type ChatType = 'direct' | 'group' | 'project' | 'workspace';

export type ReactionType = string;

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  createdAt: FirebaseDate;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: {
    id: string;
    name: string;
    avatar?: string | null;
    role?: string;
  };
  type: ChatMessageType;
  content: string;
  attachments: Attachment[];
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
  };
  mentions: string[]; // User IDs of mentioned users
  status: MessageStatus;
  reactions: {
    [reactionType: string]: string[]; // Map emoji to array of user IDs
  };
  readBy: {
    [userId: string]: FirebaseDate;
  };
  edited: boolean;
  editedAt?: FirebaseDate;
  deletedForUsers?: string[]; // Array of user IDs who can't see this message
  forwardedFrom?: {
    messageId: string;
    conversationId: string;
    senderName: string;
  };
  createdAt: FirebaseDate;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  type: ChatType;
  name?: string;
  description?: string;
  avatar?: string;
  createdBy: string;
  pinned?: boolean;
  muted?: boolean;
  archived?: boolean;
  lastMessage?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
    type: ChatMessageType;
    createdAt: FirebaseDate;
  };
  participants: Array<{
    id: string;
    role: 'admin' | 'member';
    joinedAt: FirebaseDate;
  }>;
  projectId?: string;
  workspaceId?: string;
  metadata?: Record<string, any>;
  createdAt: FirebaseDate;
  updatedAt: FirebaseDate;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  userName: string;
  type: ReactionType;
  createdAt: FirebaseDate;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: FirebaseDate;
  lastRead?: FirebaseDate;
  notificationSettings: {
    muted: boolean;
    desktop: boolean;
    mobile: boolean;
    email: boolean;
  };
}

export interface ChatCall {
  id: string;
  conversationId: string;
  initiatedBy: string;
  type: 'audio' | 'video';
  status: 'ringing' | 'ongoing' | 'ended' | 'missed' | 'declined';
  participants: Array<{
    userId: string;
    status: 'invited' | 'joined' | 'left' | 'declined' | 'missed';
    joinedAt?: FirebaseDate;
    leftAt?: FirebaseDate;
  }>;
  startedAt: FirebaseDate;
  endedAt?: FirebaseDate;
  duration?: number; // in seconds
  metadata?: Record<string, any>;
}

export interface VoiceNote {
  id: string;
  conversationId: string;
  messageId: string;
  url: string;
  duration: number; // in seconds
  waveform?: number[]; // amplitude values for visualization
  transcription?: string;
  createdAt: FirebaseDate;
}

export interface ChatPresence {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastActive: FirebaseDate;
  typing?: {
    conversationId: string;
    lastTypedAt: FirebaseDate;
  };
}

export interface ChatNotification {
  id: string;
  userId: string;
  conversationId: string;
  messageId?: string;
  type: 'new_message' | 'mention' | 'reaction' | 'call' | 'added_to_group';
  read: boolean;
  createdAt: FirebaseDate;
  metadata?: Record<string, any>;
}

// Request and Response Types
export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type: ChatMessageType;
  attachments?: File[];
  replyToId?: string;
  mentions?: string[];
}

export interface CreateConversationRequest {
  type: ChatType;
  name?: string;
  description?: string;
  avatar?: File;
  participantIds: string[];
  projectId?: string;
  workspaceId?: string;
}

export interface UpdateConversationRequest {
  name?: string;
  description?: string;
  avatar?: File;
}

export interface ChatSearchResults {
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface ChatUserSettings {
  userId: string;
  notifications: {
    desktop: boolean;
    mobile: boolean;
    email: boolean;
    sound: boolean;
  };
  statuses: {
    showStatus: boolean;
    showLastSeen: boolean;
  };
  readReceipts: boolean;
  theme: 'light' | 'dark' | 'system';
  media: {
    autoDownload: boolean;
    saveToDevice: boolean;
  };
  updatedAt: FirebaseDate;
}

export interface ConversationWithParticipants extends ChatConversation {
  participantDetails?: Partial<User>[];
  unreadCount?: number;
  lastReadMessageId?: string;
  userParticipationDetails?: ConversationParticipant;
}

export interface MessageWithExtras extends ChatMessage {
  attachmentsLoaded?: boolean;
  isLoadingAttachments?: boolean;
  isSending?: boolean;
  optimisticId?: string;
  reactionsDetails?: {
    [emojiKey: string]: {
      count: number;
      users: string[];
      userNames: string[];
    }
  };
}