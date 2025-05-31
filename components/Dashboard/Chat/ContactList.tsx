import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    MoreHorizontal,
    Pin,
    BellOff,
    Archive,
    UserPlus,
    UserMinus,
    Users,
    MessageCircle,
    Star,
    Calendar
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export interface Contact {
    id: string | number;
    name: string;
    avatar?: string;
    initials: string;
    type: 'mentor' | 'peer' | 'group' | 'system';
    role: string;
    online: boolean;
    lastActive?: string;
    unreadCount?: number;
    tags?: string[];
    isPinned?: boolean;
    isMuted?: boolean;
    isStarred?: boolean;
    hasReminder?: boolean;
    lastMessage?: {
        content: string;
        timestamp: string;
        senderId: string | number;
    };
}

interface ContactListProps {
    contacts: Contact[];
    currentContactId: string | number | null;
    setCurrentContactId: (id: string | number) => void;
    onPinContact?: (id: string | number, isPinned: boolean) => void;
    onMuteContact?: (id: string | number, isMuted: boolean) => void;
    onArchiveContact?: (id: string | number) => void;
    onStarContact?: (id: string | number, isStarred: boolean) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
    contacts,
    currentContactId,
    setCurrentContactId,
    onPinContact,
    onMuteContact,
    onArchiveContact,
    onStarContact
}) => {
    // Format timestamp for last message or activity
    const formatTime = (timestamp: string) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        const now = new Date();

        if (isToday(date)) {
            return format(date, 'h:mm a');
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else if (now.getFullYear() === date.getFullYear()) {
            return format(date, 'MMM d');
        } else {
            return format(date, 'MM/dd/yy');
        }
    };

    // Format last active time
    const formatLastActive = (timestamp?: string) => {
        if (!timestamp) return 'Never active';

        const date = new Date(timestamp);
        try {
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            return 'Unknown';
        }
    };

    // Get avatar fallback color based on contact type
    const getAvatarColor = (contact: Contact) => {
        switch (contact.type) {
            case 'mentor':
                return "bg-blue-600";
            case 'peer':
                return "bg-green-600";
            case 'group':
                return "bg-purple-600";
            case 'system':
                return "bg-indigo-600";
            default:
                return "bg-gray-600";
        }
    };

    // Get type label
    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'mentor':
                return 'Mentor';
            case 'peer':
                return 'Peer';
            case 'group':
                return 'Group';
            case 'system':
                return 'System';
            default:
                return type;
        }
    };

    return (
        <>
            {contacts.map((contact) => (
                <div
                    key={contact.id}
                    className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors relative",
                        currentContactId === contact.id ? "bg-purple-50 hover:bg-purple-50" : "",
                        contact.isPinned && "border-l-4 border-purple-600 pl-2"
                    )}
                    onClick={() => setCurrentContactId(contact.id)}
                >
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className={cn(
                                "text-white font-medium",
                                getAvatarColor(contact)
                            )}>{contact.initials}</AvatarFallback>
                        </Avatar>
                        {contact.type !== 'system' && (
                            <div
                                className={cn(
                                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                                    contact.online ? "bg-green-500" : "bg-gray-300"
                                )}
                            ></div>
                        )}
                        {contact.isStarred && (
                            <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                <Star className="h-3 w-3 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex justify-between items-center">
                            <h4 className={cn(
                                "font-medium truncate mr-1",
                                contact.unreadCount ? "font-semibold" : ""
                            )}>
                                {contact.name}
                                {contact.isMuted && (
                                    <BellOff className="h-3 w-3 ml-1 inline-block text-gray-400" />
                                )}
                            </h4>
                            <div className="flex items-center gap-1">
                                {contact.hasReminder && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Calendar className="h-3 w-3 text-purple-600" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Reminder set</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                {contact.unreadCount ? (
                                    <Badge className="bg-purple-600 hover:bg-purple-700 flex-shrink-0">
                                        {contact.unreadCount}
                                    </Badge>
                                ) : (
                                    <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                                        {contact.lastMessage ?
                                            formatTime(contact.lastMessage.timestamp) :
                                            contact.lastActive ?
                                                formatTime(contact.lastActive) : ''}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className={cn(
                                "text-sm truncate",
                                contact.unreadCount ? "text-gray-900" : "text-gray-500"
                            )}>
                                {contact.lastMessage ? (
                                    <span className="line-clamp-1">
                                        {contact.lastMessage.content}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            contact.online ? "bg-green-500" : "bg-gray-300"
                                        )}></span>
                                        {contact.online ? 'Online' : `Last active ${formatLastActive(contact.lastActive)}`}
                                    </span>
                                )}
                            </p>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 -mr-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px]">
                                    {onPinContact && (
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            onPinContact(contact.id, !contact.isPinned);
                                        }}>
                                            <Pin className="h-4 w-4 mr-2" />
                                            {contact.isPinned ? 'Unpin contact' : 'Pin contact'}
                                        </DropdownMenuItem>
                                    )}

                                    {onMuteContact && (
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            onMuteContact(contact.id, !contact.isMuted);
                                        }}>
                                            <BellOff className="h-4 w-4 mr-2" />
                                            {contact.isMuted ? 'Unmute notifications' : 'Mute notifications'}
                                        </DropdownMenuItem>
                                    )}

                                    {onStarContact && (
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            onStarContact(contact.id, !contact.isStarred);
                                        }}>
                                            <Star className="h-4 w-4 mr-2" />
                                            {contact.isStarred ? 'Unstar contact' : 'Star contact'}
                                        </DropdownMenuItem>
                                    )}

                                    {contact.type === 'group' && (
                                        <>
                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                <Users className="h-4 w-4 mr-2" />
                                                View members
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Add members
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Leave group
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    <DropdownMenuSeparator />

                                    {onArchiveContact && (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onArchiveContact(contact.id);
                                            }}
                                            className="text-red-600 hover:text-red-700 focus:text-red-700"
                                        >
                                            <Archive className="h-4 w-4 mr-2" />
                                            Archive
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {contact.tags && contact.tags.length > 0 && (
                        <div className="absolute bottom-1 right-1 flex gap-1">
                            {contact.tags.slice(0, 2).map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="h-4 text-[10px] px-1 bg-purple-50 text-purple-700 border-purple-200"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {contact.tags.length > 2 && (
                                <Badge
                                    variant="outline"
                                    className="h-4 text-[10px] px-1 bg-gray-50 text-gray-700 border-gray-200"
                                >
                                    +{contact.tags.length - 2}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {contacts.length === 0 && (
                <div className="p-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-lg text-gray-800 mb-1">No contacts found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        No contacts match your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                        Find Contacts
                    </Button>
                </div>
            )}
        </>
    );
};

export default ContactList;



