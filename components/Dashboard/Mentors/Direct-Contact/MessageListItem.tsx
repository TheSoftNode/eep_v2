import React from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageData } from '@/Redux/types/Users/mentorMessage';
import { formatDistanceToNow } from 'date-fns';

interface MessageListItemProps {
    message: MessageData;
    isSelected: boolean;
    onClick: () => void;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message, isSelected, onClick }) => {
    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Unknown time';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
            case 'normal': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            case 'low': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
            default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
        }
    };

    const getSenderIcon = (role: string) => {
        return role === 'admin' ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
            </div>
        ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                {role === 'learner' ? 'L' : role.charAt(0).toUpperCase()}
            </div>
        );
    };

    return (
        <motion.div
            whileHover={{ x: 4 }}
            onClick={onClick}
            className={cn(
                "p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-200",
                !message.isRead && "bg-indigo-50/50 dark:bg-indigo-950/20",
                isSelected && "bg-indigo-100 dark:bg-indigo-900/40",
                "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
        >
            <div className="flex items-start space-x-3">
                {getSenderIcon(message.senderRole)}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {message.senderName}
                        </p>
                        <div className="flex items-center space-x-1">
                            {message.isStarred && (
                                <Star className="h-3 w-3 text-amber-500 fill-current" />
                            )}
                            {!message.isRead && (
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            )}
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate mb-1">
                        {message.subject}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                        {message.content}
                    </p>
                    <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatTime(message.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MessageListItem;