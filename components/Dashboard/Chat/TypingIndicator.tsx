import { useGetCurrentUserQuery } from '@/Redux/apiSlices/users/profileApi';
import { RootState } from '@/Redux/core/store';
import React from 'react';
import { useSelector } from 'react-redux';

interface TypingIndicatorProps {
    conversationId: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ conversationId }) => {

    return (
        <div className="text-xs text-gray-500 italic flex items-center h-6 pl-4">
            {/* <div className="flex space-x-1 mr-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            typing */}
        </div>
    );
};