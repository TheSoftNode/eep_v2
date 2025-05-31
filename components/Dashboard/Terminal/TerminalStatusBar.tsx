import React from 'react';
import { CircleCheck, CircleOff, Clock } from 'lucide-react';
import { HistoryItem } from './terminalTypes';

interface TerminalStatusBarProps {
    connected: boolean;
    lastCommand: HistoryItem | null;
}

export default function TerminalStatusBar({
    connected,
    lastCommand
}: TerminalStatusBarProps) {
    // Format time since last command
    const getLastActivity = () => {
        if (!lastCommand) return 'No activity';

        const timeElapsed = Math.floor((Date.now() - lastCommand.timestamp.getTime()) / 1000);

        if (timeElapsed < 60) {
            return `${timeElapsed} seconds ago`;
        } else if (timeElapsed < 3600) {
            return `${Math.floor(timeElapsed / 60)} minutes ago`;
        } else if (timeElapsed < 86400) {
            return `${Math.floor(timeElapsed / 3600)} hours ago`;
        } else {
            return `${Math.floor(timeElapsed / 86400)} days ago`;
        }
    };

    return (
        <div className="flex items-center text-xs text-gray-400 bg-gray-800 border-t border-gray-700 p-2">
            <div className="flex items-center mr-4">
                {connected ? (
                    <CircleCheck className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                    <CircleOff className="h-3 w-3 text-red-400 mr-1" />
                )}
                <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>

            <div className="flex items-center mr-4">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last activity: {getLastActivity()}</span>
            </div>
        </div>
    );
}