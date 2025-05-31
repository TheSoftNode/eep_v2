import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/Redux/features/auth/authSlice';
import { IUserResponse } from '@/Redux/features/auth/authSlice';

export const useAuthHydration = () => {
    const dispatch = useDispatch();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const userRaw = localStorage.getItem('user');

            if (token && userRaw) {
                try {
                    const user = JSON.parse(userRaw) as IUserResponse;
                    dispatch(setCredentials({ user, token }));
                } catch (err) {
                    console.error("Invalid user object in localStorage", err);
                }
            }
            setIsHydrated(true);
        }
    }, [dispatch]);

    return isHydrated;
};
