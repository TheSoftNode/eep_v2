"use client"

import { useState } from 'react';
import { Smile, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageReactionsProps {
    reactions: Record<string, string[]>;
    currentUserId: string;
    onReact: (emoji: string) => void;
    className?: string;
    maxDisplayed?: number;
}

export default function MessageReactions({
    reactions,
    currentUserId,
    onReact,
    className = '',
    maxDisplayed = 5
}: MessageReactionsProps) {
    const [showPopover, setShowPopover] = useState(false);

    // Common emoji reactions
    const commonEmojis = ["👍", "❤️", "😂", "😍", "👏", "🔥", "💯", "👌", "🎉", "🙌", "😊", "👀"];

    // Count total reactions
    const totalReactions = Object.values(reactions).reduce((sum, users) => sum + users.length, 0);

    // Get all unique reactions
    const uniqueReactions = Object.keys(reactions);

    // Sort reactions by count (most popular first)
    const sortedReactions = uniqueReactions.sort((a, b) => {
        // Put user's reactions first
        const userHasA = reactions[a].includes(currentUserId);
        const userHasB = reactions[b].includes(currentUserId);

        if (userHasA && !userHasB) return -1;
        if (!userHasA && userHasB) return 1;

        // Then sort by popularity
        return reactions[b].length - reactions[a].length;
    });

    // Check if there are any reactions to display
    if (totalReactions === 0) return null;

    return (
        <div className={`flex flex-wrap gap-1 ${className}`}>
            {/* Display most popular or user's reactions first */}
            <AnimatePresence>
                {sortedReactions.slice(0, maxDisplayed).map(emoji => (
                    <motion.div
                        key={emoji}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.15 }}
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => onReact(emoji)}
                                        className={`inline-flex items-center text-xs rounded-full px-2 py-0.5 
                                            ${reactions[emoji].includes(currentUserId)
                                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                                            } hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors`}
                                    >
                                        <span className="mr-1">{emoji}</span>
                                        <span>{reactions[emoji].length}</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {reactions[emoji].length === 1 ? (
                                        <p>{reactions[emoji][0] === currentUserId ? 'You' : reactions[emoji][0]}</p>
                                    ) : reactions[emoji].length <= 3 ? (
                                        <div>
                                            {reactions[emoji].map(user => (
                                                <p key={user}>{user === currentUserId ? 'You' : user}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>
                                            {reactions[emoji].includes(currentUserId) ? 'You and ' : ''}
                                            {reactions[emoji].filter(id => id !== currentUserId).slice(0, 2).join(', ')}
                                            {reactions[emoji].length > (reactions[emoji].includes(currentUserId) ? 3 : 2) &&
                                                ` and ${reactions[emoji].length - (reactions[emoji].includes(currentUserId) ? 3 : 2)} others`}
                                        </p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* "More" button if there are additional reactions */}
            {sortedReactions.length > maxDisplayed && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setShowPopover(true)}
                                className="inline-flex items-center text-xs rounded-full px-2 py-0.5 
                                    bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                                    border border-gray-200 dark:border-gray-700
                                    hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                +{sortedReactions.length - maxDisplayed}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Show all reactions</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            {/* Add reaction button */}
            <Popover open={showPopover} onOpenChange={setShowPopover}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5 rounded-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-0"
                    >
                        <Plus className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" side="top">
                    <div className="grid grid-cols-6 gap-1">
                        {/* Show all used reactions first */}
                        {sortedReactions.map(emoji => (
                            <Button
                                key={emoji}
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 rounded-full p-0 ${reactions[emoji].includes(currentUserId)
                                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                        : ''
                                    }`}
                                onClick={() => {
                                    onReact(emoji);
                                    setShowPopover(false);
                                }}
                            >
                                {emoji}
                            </Button>
                        ))}

                        {/* Then common emojis not already used */}
                        {commonEmojis
                            .filter(emoji => !sortedReactions.includes(emoji))
                            .map(emoji => (
                                <Button
                                    key={emoji}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full p-0"
                                    onClick={() => {
                                        onReact(emoji);
                                        setShowPopover(false);
                                    }}
                                >
                                    {emoji}
                                </Button>
                            ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}