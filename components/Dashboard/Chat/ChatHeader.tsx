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

    // Get conversation type badge color
    const getBadgeColor = () => {
        if (conversation?.projectId) return "bg-indigo-600 hover:bg-indigo-700";
        if (conversation?.type === 'group') return "bg-purple-600 hover:bg-purple-700";

        // For direct conversations, look at the other person's role
        if (mainParticipant) {
            if (mainParticipant.role === 'mentor') return "bg-blue-600 hover:bg-blue-700";
            if (mainParticipant.role === 'admin') return "bg-red-600 hover:bg-red-700";
            return "bg-green-600 hover:bg-green-700"; // peers
        }

        return "bg-gray-600 hover:bg-gray-700";
    };

    // Get avatar fallback bg color based on type
    const getAvatarBgColor = () => {
        if (conversation?.projectId) return "bg-indigo-600";
        if (conversation?.type === 'group') return "bg-purple-600";

        if (mainParticipant) {
            if (mainParticipant.role === 'mentor') return "bg-blue-600";
            if (mainParticipant.role === 'admin') return "bg-red-600";
            return "bg-green-600"; // peers
        }

        return "bg-gray-600";
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
            <div className="p-3 border-b flex items-center bg-white">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-white bg-gray-600">?</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">Loading conversation...</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 border-b flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar || mainParticipant?.profilePicture || ''} />
                    <AvatarFallback className={cn("text-white", getAvatarBgColor())}>
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{conversation.title || 'Untitled Conversation'}</h3>
                        <Badge className={cn("text-xs", getBadgeColor())}>
                            {isGroup ? 'Group' : mainParticipant?.role || 'Contact'}
                        </Badge>
                        {conversation.isPinned && (
                            <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                                Pinned
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        {isGroup ? (
                            <p>{participants.length} members • {onlineCount} online</p>
                        ) : (
                            <div className="flex items-center">
                                <div className={cn(
                                    "w-2 h-2 rounded-full mr-2",
                                    mainParticipant?.status === 'online' ? "bg-green-500" : "bg-gray-300"
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
                                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-700 hover:bg-purple-50">
                                        <Phone className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Voice call</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-700 hover:bg-purple-50">
                                        <Video className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Video call</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-700 hover:bg-purple-50">
                                        <Info className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Conversation Info</DialogTitle>
                                        <DialogDescription>
                                            Details about this conversation
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="flex items-center justify-center mb-4">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={conversation.avatar || mainParticipant?.profilePicture || ''} />
                                                <AvatarFallback className={cn("text-white text-xl", getAvatarBgColor())}>
                                                    {getInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-medium">{conversation.title || 'Untitled Conversation'}</h3>
                                            <p className="text-sm text-gray-500">
                                                {isGroup ?
                                                    `${participants.length} members` :
                                                    mainParticipant?.role || 'Contact'}
                                            </p>
                                        </div>
                                        {conversation.projectId && (
                                            <div className="bg-indigo-50 p-3 rounded-md">
                                                <p className="text-sm text-indigo-800">This conversation is part of a project</p>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">Members</h4>
                                            <div className="max-h-48 overflow-y-auto space-y-2">
                                                {participants.map((participant) => (
                                                    participant && (
                                                        <div key={participant.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={participant.profilePicture || ''} />
                                                                <AvatarFallback className="text-white bg-blue-600">
                                                                    {participant.fullName
                                                                        ? participant.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                                                                        : '?'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{participant.fullName}</p>
                                                                <p className="text-xs text-gray-500 truncate">{participant.role}</p>
                                                            </div>
                                                            <div className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                participant.status === 'online' ? "bg-green-500" : "bg-gray-300"
                                                            )} />
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-4 flex justify-center gap-2">
                                            <Button variant="outline" onClick={handleTogglePin}>
                                                {conversation.isPinned ? 'Unpin' : 'Pin'} Conversation
                                            </Button>
                                            <Button variant="outline" onClick={handleToggleMute}>
                                                {conversation.isMuted ? 'Unmute' : 'Mute'} Notifications
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Conversation info</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-700 hover:bg-purple-50">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {isGroup && (
                            <DropdownMenuItem className="cursor-pointer">
                                <Users className="h-4 w-4 mr-2" />
                                Manage members
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="cursor-pointer" onClick={handleTogglePin}>
                            <User className="h-4 w-4 mr-2" />
                            {conversation.isPinned ? 'Unpin' : 'Pin'} conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={handleToggleMute}>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Archive className="h-4 w-4 mr-2" />
                            Archive conversation
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
