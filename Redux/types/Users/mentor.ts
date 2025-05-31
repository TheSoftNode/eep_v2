export interface MentorSummary {
    id: string;
    fullName: string;
    email: string;
    disabled?: boolean;
    profilePicture: string | null;
    bio: string | null;
    expertise: string[];
    rating: number;
    reviewCount: number;
    isAvailable: boolean;
}



export interface MentorProfile extends MentorSummary {
    company: string | null;
    website: string | null;
    github: string | null;
    experience: number | null;
    languages: string[];
    timezone: string | null;
    availability: {
        days: string[];
        timeSlots: string[];
    };
    skills: string[];
    achievements: string[];
    sessionCount: number;
    sessionHours: number;
}

export interface MentorSearchParams {
    expertise?: string;
    skills?: string[];
    availability?: string[];
    rating?: number;
    language?: string;
    page?: string;
    limit?: string;
}

export interface MentorReview {
    id: string;
    mentorId: string;
    learnerId: string;
    learnerName: string;
    rating: number;
    comment: string;
    sessionId?: string;
    createdAt: string;
    strengths?: string[];
    improvements?: string[];
}

export interface SessionRequest {
    mentorId: string;
    topic: string;
    description: string;
    date: string;
    timeSlot: string;
    duration: number;
    objectives: string[];
    link: string;
}

export interface SessionData {
    id: string;
    mentorId: string;
    learnerId: string;
    mentorName: string;
    learnerName: string;
    topic: string;
    link?: string;
    description: string;
    date: string;
    timeSlot: string;
    duration: number;  // in minutes
    objectives: string[];
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    acceptedAt?: string;
    rejectedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    cancelledBy?: 'mentor' | 'learner';
    rejectionReason?: string;
    cancellationReason?: string;
    isReviewed?: boolean;
    reviewId?: string;
    notes?: string;
}

export interface SessionReview {
    rating: number;
    comment: string;
    strengths?: string[];
    improvements?: string[];
}


/**
 * Represents an availability time slot for a mentor
 */
export interface AvailabilitySlot {
    id: string;
    mentorId: string;
    date: string;
    timeSlot: string; // e.g. "9:00 AM - 10:00 AM"
    duration: number; // in minutes
    isRecurring: boolean;
    dayOfWeek?: string; // For recurring slots only
    createdAt: string;
}

/**
 * Request body for updating a mentor's availability
 */
export interface AvailabilityUpdateRequest {
    date: string;
    timeSlot: string;
    duration?: number;
    isRecurring?: boolean;
    dayOfWeek?: string; // Required if isRecurring is true
}

/**
 * Request body for bulk updating a mentor's availability
 */
export interface BulkAvailabilityUpdateRequest {
    action: 'add' | 'remove' | 'replace';
    slots?: {
        date: string;
        timeSlot: string;
        duration?: number;
    }[];
    dateRange?: {
        startDate: string;
        endDate: string;
    };
    recurringPattern?: {
        startDate: string;
        endDate: string;
        daysOfWeek: string[]; // ['Monday', 'Wednesday', 'Friday']
    };
}

/**
 * Response format for a mentor's calendar view
 */
export interface MentorCalendarResponse {
    [date: string]: {
        availableSlots: {
            id: string;
            timeSlot: string;
            duration: number;
        }[];
        bookedSlots: {
            id: string;
            timeSlot: string;
            duration: number;
            learnerName: string;
            topic: string;
            status: string;
        }[];
    };
}

/**
 * Parameters for searching mentors with availability
 */
export interface MentorSearchWithAvailabilityParams extends MentorSearchParams {
    date?: string;
    timeSlot?: string;
    duration?: string;
}

/**
 * Session request with advanced scheduling options
 */
export interface AdvancedSessionRequest extends SessionRequest {
    preferredDates?: string[]; // List of alternative dates if primary not available
    flexibleTiming?: boolean; // Indicates flexibility with timing
    urgency?: 'low' | 'medium' | 'high'; // Priority of the request
}

/**
 * Mentor analytics summary
 */
export interface MentorAnalyticsSummary {
    totalSessions: number;
    completedSessions: number;
    totalHours: number;
    averageRating: number;
    reviewCount: number;
    availabilityStats: {
        totalSlots: number;
        bookedSlots: number;
        bookingRate: string; // percentage
    };
    popularTimeSlots: {
        timeSlot: string;
        count: number;
    }[];
}

/**
 * Extended mentor profile with availability info
 */
export interface MentorWithAvailability extends MentorSummary {
    availabilityCalendar?: {
        [date: string]: string[]; // Array of available time slots
    };
    nextAvailableSlot?: {
        date: string;
        timeSlot: string;
    };
}