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

    // Get avatar fallback color based on contact type with dark mode support
    const getAvatarColor = (contact: Contact) => {
        switch (contact.type) {
            case 'mentor':
                return "bg-blue-600 dark:bg-blue-500";
            case 'peer':
                return "bg-emerald-600 dark:bg-emerald-500";
            case 'group':
                return "bg-purple-600 dark:bg-purple-500";
            case 'system':
                return "bg-indigo-600 dark:bg-indigo-500";
            default:
                return "bg-slate-600 dark:bg-slate-500";
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
                        "group flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative backdrop-blur-sm",
                        currentContactId === contact.id
                            ? "bg-indigo-50 hover:bg-indigo-50 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/20"
                            : "",
                        contact.isPinned && "border-l-4 border-indigo-600 dark:border-indigo-500 pl-2"
                    )}
                    onClick={() => setCurrentContactId(contact.id)}
                >
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-700/50 shadow-sm">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className={cn(
                                "text-white font-medium",
                                getAvatarColor(contact)
                            )}>{contact.initials}</AvatarFallback>
                        </Avatar>
                        {contact.type !== 'system' && (
                            <div
                                className={cn(
                                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-700",
                                    contact.online ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                )}
                            ></div>
                        )}
                        {contact.isStarred && (
                            <div className="absolute -top-1 -right-1 bg-amber-400 dark:bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                                <Star className="h-3 w-3 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex justify-between items-center">
                            <h4 className={cn(
                                "font-medium truncate mr-1 dark:text-white",
                                contact.unreadCount ? "font-semibold" : ""
                            )}>
                                {contact.name}
                                {contact.isMuted && (
                                    <BellOff className="h-3 w-3 ml-1 inline-block text-slate-400 dark:text-slate-500" />
                                )}
                            </h4>
                            <div className="flex items-center gap-1">
                                {contact.hasReminder && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                            </TooltipTrigger>
                                            <TooltipContent className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                                <p>Reminder set</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                {contact.unreadCount ? (
                                    <Badge className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white border-0 flex-shrink-0 shadow-sm">
                                        {contact.unreadCount}
                                    </Badge>
                                ) : (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap flex-shrink-0">
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
                                contact.unreadCount
                                    ? "text-slate-900 dark:text-slate-100"
                                    : "text-slate-500 dark:text-slate-400"
                            )}>
                                {contact.lastMessage ? (
                                    <span className="line-clamp-1">
                                        {contact.lastMessage.content}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            contact.online ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                        )}></span>
                                        {contact.online ? 'Online' : `Last active ${formatLastActive(contact.lastActive)}`}
                                    </span>
                                )}
                            </p>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 flex-shrink-0 -mr-1 opacity-0 group-hover:opacity-100 focus:opacity-100 dark:hover:bg-slate-600/50 transition-all"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px] dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    {onPinContact && (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPinContact(contact.id, !contact.isPinned);
                                            }}
                                            className="dark:hover:bg-slate-700/50 dark:text-slate-300"
                                        >
                                            <Pin className="h-4 w-4 mr-2" />
                                            {contact.isPinned ? 'Unpin contact' : 'Pin contact'}
                                        </DropdownMenuItem>
                                    )}

                                    {onMuteContact && (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onMuteContact(contact.id, !contact.isMuted);
                                            }}
                                            className="dark:hover:bg-slate-700/50 dark:text-slate-300"
                                        >
                                            <BellOff className="h-4 w-4 mr-2" />
                                            {contact.isMuted ? 'Unmute notifications' : 'Mute notifications'}
                                        </DropdownMenuItem>
                                    )}

                                    {onStarContact && (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStarContact(contact.id, !contact.isStarred);
                                            }}
                                            className="dark:hover:bg-slate-700/50 dark:text-slate-300"
                                        >
                                            <Star className="h-4 w-4 mr-2" />
                                            {contact.isStarred ? 'Unstar contact' : 'Star contact'}
                                        </DropdownMenuItem>
                                    )}

                                    {contact.type === 'group' && (
                                        <>
                                            <DropdownMenuItem
                                                onClick={(e) => e.stopPropagation()}
                                                className="dark:hover:bg-slate-700/50 dark:text-slate-300"
                                            >
                                                <Users className="h-4 w-4 mr-2" />
                                                View members
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => e.stopPropagation()}
                                                className="dark:hover:bg-slate-700/50 dark:text-slate-300"
                                            >
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Add members
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => e.stopPropagation()}
                                                className="dark:hover:bg-slate-700/50 dark:text-slate-300"
                                            >
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Leave group
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    <DropdownMenuSeparator className="dark:border-slate-700/50" />

                                    {onArchiveContact && (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onArchiveContact(contact.id);
                                            }}
                                            className="text-red-600 hover:text-red-700 focus:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
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
                                    className="h-4 text-[10px] px-1 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {contact.tags.length > 2 && (
                                <Badge
                                    variant="outline"
                                    className="h-4 text-[10px] px-1 bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50"
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
                    <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <MessageCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-lg text-slate-800 dark:text-white mb-1">No contacts found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        No contacts match your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-0">
                        Find Contacts
                    </Button>
                </div>
            )}
        </>
    );
};

export default ContactList;
