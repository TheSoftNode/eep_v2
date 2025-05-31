import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyChatProps {
    onStartNewChat?: () => void;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ onStartNewChat }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="max-w-md text-center space-y-6">
                <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mx-auto">
                    <MessageSquare className="h-10 w-10 text-purple-600" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Welcome to Chat</h2>
                    <p className="text-gray-500">
                        Connect with mentors, peers, and collaborate on your projects through real-time messaging.
                    </p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-indigo-800">Get Started</h3>
                    <ul className="text-sm text-indigo-700 space-y-2 text-left">
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1">•</span>
                            <span>Chat with mentors to get guidance on your projects</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1">•</span>
                            <span>Connect with peers to share ideas and collaborate</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1">•</span>
                            <span>Create group chats for team discussions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1">•</span>
                            <span>Share files, code snippets, and resources</span>
                        </li>
                    </ul>
                </div>

                <Button className="bg-purple-600 hover:bg-purple-700" onClick={onStartNewChat}>
                    <Users className="h-4 w-4 mr-2" />
                    Start a New Conversation
                </Button>
            </div>
        </div>
    );
};

export default EmptyChat;

