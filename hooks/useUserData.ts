import { User } from '@/Redux/types/Users/user';
import { useEffect, useState } from 'react';

export const useUserData = (uid: string | undefined) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uid) {
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/me`);

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data.user);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid]);

    return { userData, loading, error };
};