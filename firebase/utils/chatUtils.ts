import { FirebaseDate } from "@/components/Types/common";
import { Timestamp } from "firebase/firestore";

export function firebaseDateToMillis(date: FirebaseDate): number {
    if (date instanceof Timestamp) {
        return date.toMillis();
    } else if (date instanceof Date) {
        return date.getTime();
    } else if (typeof date === 'object' && 'seconds' in date) {
        return date.seconds * 1000;
    } else if (typeof date === 'number') {
        return date;
    } else if (typeof date === 'string') {
        return new Date(date).getTime();
    }
    throw new Error('Invalid date format');
}