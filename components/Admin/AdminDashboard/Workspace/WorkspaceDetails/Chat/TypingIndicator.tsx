"use client"

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TypingUser {
    userId: string;
    userName: string;
    userAvatar?: string | null;
    userRole?: string;
}

interface TypingIndicatorProps {
    typingUsers: TypingUser[];
    className?: string;
}

export default function TypingIndicator({
    typingUsers,
    className = ''
}: TypingIndicatorProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show indicator when typing users exist
        if (typingUsers.length > 0) {
            setVisible(true);
        } else {
            // Add a small delay before hiding to prevent flickering
            const timer = setTimeout(() => {
                setVisible(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [typingUsers]);

    // No need to render if no typing users
    if (!visible) return null;

    // Get appropriate text based on number of typing users
    const getTypingText = () => {
        if (typingUsers.length === 1) {
            return `${typingUsers[0].userName} is typing...`;
        } else if (typingUsers.length === 2) {
            return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
        } else if (typingUsers.length === 3) {
            return `${typingUsers[0].userName}, ${typingUsers[1].userName}, and ${typingUsers[2].userName} are typing...`;
        } else {
            return `${typingUsers.length} people are typing...`;
        }
    };

    // Get avatar fallback (initials)
    const getAvatarFallback = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    // Get avatar style based on role
    const getAvatarStyle = (role: string = 'user') => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300';
            case 'mentor':
                return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
            case 'learner':
                return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300';
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`px-4 py-2 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-800 text-sm ${className}`}
                >
                    <div className="flex items-center">
                        <div className="flex -space-x-2 mr-2">
                            {typingUsers.slice(0, 3).map((user, index) => (
                                <Avatar
                                    key={user.userId}
                                    className="h-6 w-6 border-2 border-white dark:border-gray-900"
                                >
                                    {user.userAvatar ? (
                                        <AvatarImage src={user.userAvatar} alt={user.userName} />
                                    ) : (
                                        <AvatarFallback className={getAvatarStyle(user.userRole)}>
                                            {getAvatarFallback(user.userName)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            ))}

                            {typingUsers.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-900">
                                    +{typingUsers.length - 3}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <span>{getTypingText()}</span>
                            <div className="flex ml-1 space-x-1">
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                                    className="h-1.5 w-1.5 bg-purple-500 dark:bg-purple-400 rounded-full"
                                />
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                                    className="h-1.5 w-1.5 bg-purple-500 dark:bg-purple-400 rounded-full"
                                />
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                                    className="h-1.5 w-1.5 bg-purple-500 dark:bg-purple-400 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}