import React, { useState } from 'react';
import Link from 'next/link';
import {
    Bell,
    Users,
    MessageSquare,
    Info,
    FileText,
    ChevronRight,
    Search,
    X,
    CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { NewChatModal } from './NewChatModal';
import { useGetNotificationsQuery, useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation } from '@/Redux/apiSlices/notifications/notificationApi';
import { useCreateConversationMutation } from '@/Redux/apiSlices/chat/chatApi';

interface MessagePageHeaderProps {
    notificationsOpen: boolean;
    setNotificationsOpen: (open: boolean) => void;
    unreadNotificationsCount: number;
    onStartNewChat?: () => void;
}

export const MessagePageHeader: React.FC<MessagePageHeaderProps> = ({
    notificationsOpen,
    setNotificationsOpen,
    unreadNotificationsCount,
    onStartNewChat
}) => {
    // State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [activeNotificationTab, setActiveNotificationTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Queries
    const { data: notificationsData, isLoading: isLoadingNotifications } =
        useGetNotificationsQuery({ page: 1, limit: 20, unreadOnly: false });

    // Mutations
    const [markAllNotificationsAsRead] = useMarkAllNotificationsReadMutation();
    const [markNotificationAsRead] = useMarkNotificationReadMutation();
    const [createConversation, { isLoading: isCreatingConversation }] = useCreateConversationMutation();

    const formatNotificationTime = (timestamp?: string | null) => {
        if (!timestamp) return ''; // Handle undefined/null cases

        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return ''; // Handle invalid dates

            if (isToday(date)) {
                return format(date, 'h:mm a');
            } else if (isYesterday(date)) {
                return 'Yesterday';
            } else {
                return format(date, 'MMM d');
            }
        } catch (error) {
            console.error('Error formatting notification time:', error);
            return '';
        }
    };

    // Handle marking all notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead().unwrap();
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    // Handle marking a single notification as read
    const handleMarkNotificationAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id).unwrap();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    // Handle creating a new conversation or group
    const handleCreateChat = async (params: {
        participants: string[];
        title?: string;
        initialMessage?: string;
        type: 'direct' | 'group';
    }) => {
        try {
            const result = await createConversation({
                participants: params.participants,
                type: params.type,
                title: params.title,
                initialMessage: params.initialMessage
            }).unwrap();

            // Close dialog
            setIsCreateDialogOpen(false);

            // If there's a callback, call it
            if (onStartNewChat) {
                onStartNewChat();
            }
        } catch (error) {
            console.error('Failed to create conversation:', error);
        }
    };

    // Filter notifications based on the active tab
    const getFilteredNotifications = () => {
        if (!notificationsData?.data) return [];

        let filtered = [...notificationsData.data];

        // Apply active tab filter
        if (activeNotificationTab !== 'all') {
            filtered = filtered.filter(notification => {
                if (activeNotificationTab === 'unread') {
                    return !notification.read;
                } else if (activeNotificationTab === 'messages') {
                    return notification.type === 'message_received' || notification.type === 'message_mentioned';
                } else if (activeNotificationTab === 'tasks') {
                    return notification.type.includes('task') || notification.type.includes('assignment');
                } else if (activeNotificationTab === 'system') {
                    return notification.type === 'system_announcement';
                }
                return true;
            });
        }

        // Apply search filter if query exists
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(notification =>
                notification.title.toLowerCase().includes(lowerQuery) ||
                notification.description.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered;
    };

    // Get badge color based on notification type
    const getNotificationBadgeColor = (type: string) => {
        if (type.includes('task') || type.includes('assignment')) {
            return "bg-amber-100 text-amber-800";
        } else if (type.includes('message')) {
            return "bg-purple-100 text-purple-800";
        } else if (type.includes('project')) {
            return "bg-indigo-100 text-indigo-800";
        } else if (type.includes('system')) {
            return "bg-blue-100 text-blue-800";
        } else {
            return "bg-gray-100 text-gray-800";
        }
    };

    // Get icon based on notification type
    const getNotificationIcon = (type: string) => {
        if (type.includes('task') || type.includes('assignment')) {
            return <FileText className="h-4 w-4" />;
        } else if (type.includes('message')) {
            return <MessageSquare className="h-4 w-4" />;
        } else if (type.includes('project')) {
            return <Users className="h-4 w-4" />;
        } else if (type.includes('system')) {
            return <Info className="h-4 w-4" />;
        } else {
            return <Bell className="h-4 w-4" />;
        }
    };

    const filteredNotifications = getFilteredNotifications();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Messages</h1>
                <p className="text-gray-500">Connect with mentors, peers, and collaborate on your projects</p>
            </div>

            <div className="flex items-center gap-2">
                {/* Notifications Dropdown */}
                <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="relative">
                            <Bell className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Notifications</span>
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[350px] sm:w-[400px]" align="end">
                        <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                                <DropdownMenuLabel className="px-0">Notifications</DropdownMenuLabel>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    disabled={!notificationsData?.data || notificationsData?.data.every(n => n.read)}
                                >
                                    <CheckCheck className="h-4 w-4 mr-1" />
                                    Mark all as read
                                </Button>
                            </div>

                            {/* Notification Search */}
                            <div className="relative mb-2">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search notifications..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1 h-7 w-7"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Notification Tabs */}
                            <Tabs defaultValue="all" value={activeNotificationTab} onValueChange={setActiveNotificationTab}>
                                <TabsList className="w-full grid grid-cols-4">
                                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                                    <TabsTrigger value="unread" className="text-xs">
                                        Unread
                                        {unreadNotificationsCount > 0 && (
                                            <Badge className="ml-1 bg-purple-600 hover:bg-purple-700 h-4 min-w-4 flex items-center justify-center">
                                                {unreadNotificationsCount}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
                                    <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Notification List */}
                        <ScrollArea className="max-h-[350px]">
                            {isLoadingNotifications ? (
                                <div className="p-6 text-center">
                                    <div className="animate-spin h-6 w-6 border-t-2 border-purple-600 border-r-2 rounded-full mx-auto mb-2"></div>
                                    <p className="text-gray-500">Loading notifications...</p>
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">No notifications found</p>
                                    {searchQuery && (
                                        <p className="text-sm text-gray-400">Try a different search term</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {filteredNotifications?.map(notification => (
                                        <DropdownMenuItem
                                            key={notification.id}
                                            className={cn(
                                                "p-3 focus:bg-purple-50 cursor-pointer",
                                                !notification.read && "bg-purple-50"
                                            )}
                                            onClick={() => handleMarkNotificationAsRead(notification?.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={cn(
                                                    "rounded-full p-2 flex-shrink-0",
                                                    getNotificationBadgeColor(notification?.type)
                                                )}>
                                                    {getNotificationIcon(notification?.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "text-sm",
                                                        !notification?.read && "font-medium"
                                                    )}>
                                                        {notification?.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                                        {notification?.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatNotificationTime(notification?.time)}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-1"></div>
                                                )}
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="p-2 focus:bg-purple-50">
                            <Link href="/dashboard/notifications" className="w-full flex items-center justify-center">
                                View all notifications
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* New Chat Button - Triggers the Modal */}
                <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    <Users className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">New Chat</span>
                </Button>

                {/* New Chat Modal Component */}
                <NewChatModal
                    isOpen={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    onCreateChat={handleCreateChat}
                    isCreating={isCreatingConversation}
                />
            </div>
        </div>
    );
};

export default MessagePageHeader;
// Small utility CheckIcon component
const CheckIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);




