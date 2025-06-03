import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyChatProps {
    onStartNewChat?: () => void;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ onStartNewChat }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 relative">
            {/* Subtle background gradient for brand consistency */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-500/5 dark:to-indigo-500/10 pointer-events-none" />

            <div className="max-w-md text-center space-y-6 relative z-10">
                <div className="flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mx-auto shadow-lg shadow-indigo-500/10 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50 transition-all duration-300">
                    <MessageSquare className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight dark:text-white">Welcome to Chat</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Connect with mentors, peers, and collaborate on your projects through real-time messaging.
                    </p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 space-y-3 border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm shadow-sm">
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-300">Get Started</h3>
                    <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-2 text-left">
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                            <span>Chat with mentors to get guidance on your projects</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                            <span>Connect with peers to share ideas and collaborate</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                            <span>Create group chats for team discussions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                            <span>Share files, code snippets, and resources</span>
                        </li>
                    </ul>
                </div>

                <Button
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
                    onClick={onStartNewChat}
                >
                    <Users className="h-4 w-4 mr-2" />
                    Start a New Conversation
                </Button>
            </div>
        </div>
    );
};

export default EmptyChat;
