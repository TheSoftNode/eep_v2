import { Timestamp, serverTimestamp } from 'firebase/firestore';

/**
 * Represents a date/time value that can be used with Firebase Firestore
 * This type accommodates the various ways dates can be represented in Firebase
 */
export type FirebaseDate =
    | Timestamp
    | Date
    | { seconds: number; nanoseconds: number }
    | number
    | string;

/**
 * Helper functions for working with FirebaseDate
 */
export const FirebaseDateUtils = {
    /**
     * Converts any FirebaseDate format to a JavaScript Date object
     */
    toDate: (date: FirebaseDate): Date => {
        if (date instanceof Timestamp) {
            return date.toDate();
        } else if (date instanceof Date) {
            return date;
        } else if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
            return new Timestamp(date.seconds, date.nanoseconds).toDate();
        } else if (typeof date === 'number') {
            return new Date(date);
        } else if (typeof date === 'string') {
            return new Date(date);
        }
        return new Date(); // Fallback to current date if format is unknown
    },

    /**
     * Converts any FirebaseDate format to a Firestore Timestamp
     */
    toTimestamp: (date: FirebaseDate): Timestamp => {
        if (date instanceof Timestamp) {
            return date;
        } else if (date instanceof Date) {
            return Timestamp.fromDate(date);
        } else if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
            return new Timestamp(date.seconds, date.nanoseconds);
        } else if (typeof date === 'number') {
            return Timestamp.fromMillis(date);
        } else if (typeof date === 'string') {
            return Timestamp.fromDate(new Date(date));
        }
        return Timestamp.now(); // Fallback to current timestamp if format is unknown
    },

    /**
     * Returns the current timestamp
     */
    now: (): Timestamp => {
        return Timestamp.now();
    },

    /**
     * Returns a server timestamp placeholder to be filled by the server
     */
    serverTimestamp: () => {
        return serverTimestamp();
    }
};

// Other common types
export type Visibility = 'public' | 'private' | 'team' | 'mentors_only' | 'learner_only';

export type ProjectMemberRole = 'owner' | 'admin' | 'contributor' | 'viewer' | 'mentor' | 'learner';

export type ResourceType = 'article' | 'video' | 'document' | 'link' | 'template' | 'example' | 'reference';

export type ResourceCategory = 'learning' | 'code' | 'documentation' | 'design' | 'requirements' | 'inspiration' | 'other';