import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/enterprise-edu/us-central1/api/v1/eep';

export const customFetchBase = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});
