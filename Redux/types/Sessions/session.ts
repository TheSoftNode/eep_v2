// export interface OpenSessionData {
//     id: string;
//     mentorId: string;
//     mentorName: string;
//     createdBy: string;
//     creatorName: string;
//     topic: string;
//     description: string;
//     date: string;
//     timeSlot: string;
//     duration: number;
//     objectives: string[];
//     link: string;
//     maxParticipants: number;
//     currentParticipants: number;
//     participants: string[]; // Array of learner IDs
//     isPublic: boolean;
//     sessionType: 'individual' | 'group';
//     status: 'open' | 'in_progress' | 'completed' | 'cancelled';
//     createdAt: string;
//     updatedAt: string;
//     cancelledAt?: string;
//     cancellationReason?: string;
//     formattedDate?: string;
//     spotsAvailable?: number;
// }

import { SessionData } from "../Users/mentor";

export interface OpenSessionData extends SessionData {
    createdBy: string;
    creatorName: string;
    maxParticipants: number;
    currentParticipants: number;
    participants: string[];
    isPublic: boolean;
    sessionType: 'individual' | 'group';
}


export interface OpenSessionFilters {
    page?: number;
    limit?: number;
    sessionType?: 'individual' | 'group';
    isPublic?: boolean;
    mentorId?: string;
    status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
}

export interface UpdateOpenSessionRequest {
    topic?: string;
    description?: string;
    date?: string;
    timeSlot?: string;
    duration?: number;
    objectives?: string[];
    link?: string;
    maxParticipants?: number;
    isPublic?: boolean;
}

export interface JoinSessionResponse {
    sessionId: string;
    participantCount: number;
}

export interface CancelSessionRequest {
    reason?: string;
}

export interface CreateSessionRequest {
    mentorId?: string;
    topic: string;
    description: string;
    date: string;
    timeSlot: string;
    duration: number;
    objectives?: string[];
    link: string;
    maxParticipants?: number;
    isPublic?: boolean;
    sessionType?: 'individual' | 'group';
}