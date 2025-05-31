"use client"

import { Info, Settings, ChevronRight, Hash, Lock, Bell, BellOff, Pin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface ChatHeaderProps {
    channelName?: string;
    channelType?: 'team' | 'private';
    channelMembers?: number;
    channelDescription?: string;
    onSettingsClick?: () => void;
    onChannelInfoClick?: () => void;
    onPinnedMessagesClick?: () => void;
    onNotificationsToggle?: () => void;
    onShareChannelClick?: () => void;
    notificationsEnabled?: boolean;
}

export default function ChatHeader({
    channelName = 'General',
    channelType = 'team',
    channelMembers = 0,
    channelDescription = '',
    onSettingsClick,
    onChannelInfoClick,
    onPinnedMessagesClick,
    onNotificationsToggle,
    onShareChannelClick,
    notificationsEnabled = true
}: ChatHeaderProps) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className="border-b bg-white dark:bg-gray-900 p-3 flex justify-between items-center shadow-sm sticky top-0 z-10">
            <div
                className="flex items-center cursor-pointer group"
                onClick={onChannelInfoClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mr-3">
                        {channelType === 'team' ? (
                            <Hash className="h-4 w-4" />
                        ) : (
                            <Lock className="h-4 w-4" />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            {channelName}
                            {channelMembers > 0 && (
                                <Badge
                                    variant="outline"
                                    className="ml-2 h-5 px-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 text-xs"
                                >
                                    {channelMembers} {channelMembers === 1 ? 'member' : 'members'}
                                </Badge>
                            )}
                        </h3>

                        {channelDescription && (
                            <p className={`text-xs ${isHovering ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'} transition-colors truncate max-w-[200px] sm:max-w-md`}>
                                {channelDescription}
                            </p>
                        )}
                    </div>
                </div>

                <ChevronRight className={`h-4 w-4 ml-1 transition-all ${isHovering ? 'text-purple-600 dark:text-purple-400 translate-x-1' : 'text-gray-400 dark:text-gray-600'}`} />
            </div>

            <div className="flex items-center space-x-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                    onClick={onPinnedMessagesClick}
                    title="Pinned Messages"
                >
                    <Pin className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className={`${notificationsEnabled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                    onClick={onNotificationsToggle}
                    title={notificationsEnabled ? "Mute Channel" : "Unmute Channel"}
                >
                    {notificationsEnabled ? (
                        <Bell className="h-4 w-4" />
                    ) : (
                        <BellOff className="h-4 w-4" />
                    )}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                    onClick={onShareChannelClick}
                    title="Share Channel"
                >
                    <Share2 className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                            title="Channel Settings"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <DropdownMenuItem
                            onClick={onChannelInfoClick}
                            className="text-gray-700 dark:text-gray-300 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
                        >
                            <Info className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Channel Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={onPinnedMessagesClick}
                            className="text-gray-700 dark:text-gray-300 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
                        >
                            <Pin className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                            Pinned Messages
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />

                        <DropdownMenuItem
                            onClick={onSettingsClick}
                            className="text-gray-700 dark:text-gray-300 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
                        >
                            <Settings className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                            Channel Settings
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}