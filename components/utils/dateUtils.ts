import { FirebaseDate, Project } from "@/Redux/types/Projects";

export interface FirestoreTimestamp {
    _seconds: number;
    _nanoseconds: number;
}

export interface DaysStatus {
    text: string;
    isOverdue: boolean;
}

export const convertToDate = (dateInput: string | Date | FirestoreTimestamp | null | undefined): Date | null => {
    if (!dateInput) return null;

    try {
        if (typeof dateInput === 'string') {
            const date = new Date(dateInput);
            return isNaN(date.getTime()) ? null : date;
        }
        if (dateInput instanceof Date) {
            return isNaN(dateInput.getTime()) ? null : dateInput;
        }
        if ('_seconds' in dateInput) {
            return new Date(dateInput._seconds * 1000 + dateInput._nanoseconds / 1000000);
        }
        return null;
    } catch {
        return null;
    }
};

export const formatDate = (dateInput: string | Date | FirestoreTimestamp | null | undefined): string => {
    const date = convertToDate(dateInput);
    if (!date) return "No date";

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
};

export const getDaysStatus = (endDateInput: string | Date | FirestoreTimestamp | null | undefined): DaysStatus => {
    const today = new Date();
    const dueDate = convertToDate(endDateInput);

    if (!dueDate) {
        return { text: "No due date", isOverdue: false };
    }

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    } else if (diffDays === 0) {
        return { text: "Due today", isOverdue: false };
    } else {
        return { text: `${diffDays} days left`, isOverdue: false };
    }
};

export const sortProjects = (projects: Project[], sortBy: string): Project[] => {
    const sorted = [...projects];

    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) =>
                (convertToDate(b.createdAt)?.getTime() || 0) -
                (convertToDate(a.createdAt)?.getTime() || 0)
            );
        case 'oldest':
            return sorted.sort((a, b) =>
                (convertToDate(a.createdAt)?.getTime() || 0) -
                (convertToDate(b.createdAt)?.getTime() || 0)
            );
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'progress':
            return sorted.sort((a, b) => b.progress - a.progress);
        default:
            return sorted;
    }
};

/**
 * Format a date string to a longer, more detailed format
 */
export const formatDateLong = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};


/**
 * Format a time string (HH:MM) to 12-hour format
 */
export const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${period}`;
};

/**
 * Format a date and time for display
 */
export const formatDateTime = (date: string, time: string): string => {
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);

    return `${formattedDate} at ${formattedTime}`;
};


export const sortByDueDate = <T extends { dueDate?: string | Date | FirestoreTimestamp | null }>(
    a: T,
    b: T
): number => {
    const dateA = convertToDate(a.dueDate);
    const dateB = convertToDate(b.dueDate);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateA.getTime() - dateB.getTime();
};

const convertFirebaseDate = (date?: FirebaseDate | null): Date | null => {
    if (!date) return null;
    if (typeof date === 'string' || date instanceof Date) {
        return new Date(date);
    }
    if ('_seconds' in date && typeof date._seconds === 'number') {
        return new Date(date._seconds * 1000);
    }
    return null;
};

export const firebaseFormatDate = (dateInput?: FirebaseDate | null): string => {
    const date = convertFirebaseDate(dateInput);
    if (!date) return 'No due date';
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    return date.toLocaleDateString('en-US', options);
};

export const isOverdue = (dateInput?: FirebaseDate | null): boolean => {
    const date = convertFirebaseDate(dateInput);
    return !!date && date < new Date();
};


// Add this helper function at the top of your file or in a utils file
export const convertFirebaseDateRobust = (firebaseDate: FirebaseDate): Date => {
    if (firebaseDate instanceof Date) {
        return firebaseDate;
    }
    if (typeof firebaseDate === 'string') {
        return new Date(firebaseDate);
    }
    if (firebaseDate && typeof firebaseDate === 'object' && '_seconds' in firebaseDate) {
        return new Date(firebaseDate._seconds * 1000);
    }
    return new Date(); // fallback
};


