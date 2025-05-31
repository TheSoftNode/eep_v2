export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
    role: MessageRole;
    content: string;
    timestamp?: string;
    id?: string;
}

export type ViewMode = 'closed' | 'minimized' | 'normal' | 'maximized' | 'fullscreen';