import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Phone, Video, User, Users, Info, Archive, Bell, BellOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/Redux/types/Chats/chat';
import { useGetCurrentUserQuery } from '@/Redux/apiSlices/users/profileApi';
import { useToggleMuteConversationMutation, useTogglePinConversationMutation } from '@/Redux/apiSlices/chat/chatApi';

interface ChatHeaderProps {
    conversation: Conversation;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
    const [infoOpen, setInfoOpen] = useState(false);
    const [togglePin] = useTogglePinConversationMutation();
    const [toggleMute] = useToggleMuteConversationMutation();
    const { data: currentUser } = useGetCurrentUserQuery();

    // Make sure conversation has the required properties
    useEffect(() => {
        if (!conversation || !conversation.participants) {
            console.error('Invalid conversation object:', conversation);
        }
    }, [conversation]);

    // Ensure participants is an array even if undefined
    const participants = conversation?.participants || [];

    // Get current user ID from query or localStorage
    const currentUserId = currentUser?.user?.id || localStorage.getItem('userId') || '';

    // Get other participants (excluding current user)
    const otherParticipants = participants.filter(p => p?.id !== currentUserId);

    // Safely get main participant with fallbacks
    const mainParticipant = otherParticipants.length > 0 ? otherParticipants[0] :
        participants.length > 0 ? participants[0] : null;

    // Calculate online status - safely handle if isGroup is undefined
    const isGroup = conversation?.type === 'group';
    const onlineCount = isGroup && Array.isArray(otherParticipants)
        ? otherParticipants.filter(p => p?.status === 'online').length
        : 0;

    // Get conversation type badge color with dark mode support
    const getBadgeColor = () => {
        if (conversation?.projectId) return "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600";
        if (conversation?.type === 'group') return "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600";

        // For direct conversations, look at the other person's role
        if (mainParticipant) {
            if (mainParticipant.role === 'mentor') return "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600";
            if (mainParticipant.role === 'admin') return "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600";
            return "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"; // peers
        }

        return "bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600";
    };

    // Get avatar fallback bg color based on type with dark mode support
    const getAvatarBgColor = () => {
        if (conversation?.projectId) return "bg-indigo-600 dark:bg-indigo-500";
        if (conversation?.type === 'group') return "bg-purple-600 dark:bg-purple-500";

        if (mainParticipant) {
            if (mainParticipant.role === 'mentor') return "bg-blue-600 dark:bg-blue-500";
            if (mainParticipant.role === 'admin') return "bg-red-600 dark:bg-red-500";
            return "bg-emerald-600 dark:bg-emerald-500"; // peers
        }

        return "bg-slate-600 dark:bg-slate-500";
    };

    // Get initials for avatar
    const getInitials = () => {
        if (conversation?.type === 'group' && conversation?.title) {
            return conversation.title.substring(0, 2).toUpperCase();
        }

        if (mainParticipant?.fullName) {
            return mainParticipant.fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
        }

        return '?';
    };

    const handleTogglePin = async () => {
        if (!conversation?.id) return;

        try {
            await togglePin({
                conversationId: conversation.id,
                isPinned: !conversation.isPinned
            }).unwrap();
        } catch (error) {
            console.error('Failed to toggle pin:', error);
        }
    };

    const handleToggleMute = async () => {
        if (!conversation?.id) return;

        try {
            await toggleMute({
                conversationId: conversation.id,
                isMuted: !conversation.isMuted
            }).unwrap();
        } catch (error) {
            console.error('Failed to toggle mute:', error);
        }
    };

    // If conversation is undefined or severely malformed, show a placeholder
    if (!conversation || !conversation.id) {
        return (
            <div className="p-3 border-b border-slate-200 dark:border-slate-700/50 flex items-center bg-white dark:bg-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-white bg-slate-600 dark:bg-slate-500">?</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold dark:text-white">Loading conversation...</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-slate-800/50 backdrop-blur-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-700/50 shadow-sm">
                    <AvatarImage src={conversation.avatar || mainParticipant?.profilePicture || ''} />
                    <AvatarFallback className={cn("text-white", getAvatarBgColor())}>
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold dark:text-white">{conversation.title || 'Untitled Conversation'}</h3>
                        <Badge className={cn("text-xs text-white border-0", getBadgeColor())}>
                            {isGroup ? 'Group' : mainParticipant?.role || 'Contact'}
                        </Badge>
                        {conversation.isPinned && (
                            <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-700 bg-indigo-50 dark:border-indigo-800/50 dark:text-indigo-400 dark:bg-indigo-900/20">
                                Pinned
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        {isGroup ? (
                            <p>{participants.length} members • {onlineCount} online</p>
                        ) : (
                            <div className="flex items-center">
                                <div className={cn(
                                    "w-2 h-2 rounded-full mr-2",
                                    mainParticipant?.status === 'online' ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                )} />
                                <span>
                                    {mainParticipant?.status === 'online' ? 'Online' :
                                        mainParticipant?.lastActive ? `Last active ${mainParticipant.lastActive}` : 'Offline'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <TooltipProvider>
                    {!isGroup && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors">
                                        <Phone className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <p>Voice call</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors">
                                        <Video className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <p>Video call</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors">
                                        <Info className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <DialogHeader>
                                        <DialogTitle className="dark:text-white">Conversation Info</DialogTitle>
                                        <DialogDescription className="dark:text-slate-400">
                                            Details about this conversation
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="flex items-center justify-center mb-4">
                                            <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-slate-700/50 shadow-lg">
                                                <AvatarImage src={conversation.avatar || mainParticipant?.profilePicture || ''} />
                                                <AvatarFallback className={cn("text-white text-xl", getAvatarBgColor())}>
                                                    {getInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-medium dark:text-white">{conversation.title || 'Untitled Conversation'}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {isGroup ?
                                                    `${participants.length} members` :
                                                    mainParticipant?.role || 'Contact'}
                                            </p>
                                        </div>
                                        {conversation.projectId && (
                                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md border border-indigo-200 dark:border-indigo-800/50">
                                                <p className="text-sm text-indigo-800 dark:text-indigo-400">This conversation is part of a project</p>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium dark:text-white">Members</h4>
                                            <div className="max-h-48 overflow-y-auto space-y-2">
                                                {participants.map((participant) => (
                                                    participant && (
                                                        <div key={participant.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={participant.profilePicture || ''} />
                                                                <AvatarFallback className="text-white bg-blue-600 dark:bg-blue-500">
                                                                    {participant.fullName
                                                                        ? participant.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                                                                        : '?'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate dark:text-white">{participant.fullName}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{participant.role}</p>
                                                            </div>
                                                            <div className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                participant.status === 'online' ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                                            )} />
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-4 flex justify-center gap-2">
                                            <Button variant="outline" onClick={handleTogglePin} className="dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                                                {conversation.isPinned ? 'Unpin' : 'Pin'} Conversation
                                            </Button>
                                            <Button variant="outline" onClick={handleToggleMute} className="dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                                                {conversation.isMuted ? 'Unmute' : 'Mute'} Notifications
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                            <p>Conversation info</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                        {isGroup && (
                            <DropdownMenuItem className="cursor-pointer dark:hover:bg-slate-700/50 dark:text-slate-300">
                                <Users className="h-4 w-4 mr-2" />
                                Manage members
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="cursor-pointer dark:hover:bg-slate-700/50 dark:text-slate-300" onClick={handleTogglePin}>
                            <User className="h-4 w-4 mr-2" />
                            {conversation.isPinned ? 'Unpin' : 'Pin'} conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer dark:hover:bg-slate-700/50 dark:text-slate-300" onClick={handleToggleMute}>
                            {conversation.isMuted ? (
                                <>
                                    <Bell className="h-4 w-4 mr-2" />
                                    Unmute notifications
                                </>
                            ) : (
                                <>
                                    <BellOff className="h-4 w-4 mr-2" />
                                    Mute notifications
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="dark:border-slate-700/50" />
                        <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20">
                            <Archive className="h-4 w-4 mr-2" />
                            Archive conversation
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
