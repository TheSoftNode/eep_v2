import React, { useState } from 'react';
import { Filter, Search, Plus, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ContactList from './ContactList';
import { NewChatModal } from './NewChatModal'; // Import the NewChatModal component
import { Conversation } from '@/Redux/types/Chats/chat';
import { useGetCurrentUserQuery } from '@/Redux/apiSlices/users/profileApi';
import { useCreateConversationMutation } from '@/Redux/apiSlices/chat/chatApi';

interface ConversationsSidebarProps {
    conversations: Conversation[];
    selectedConversationId: string | null;
    onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({
    conversations,
    selectedConversationId,
    onSelectConversation
}) => {
    // State for filtering and search
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'newest' | 'unread'>('newest');

    // Queries and mutations
    const { data: currentUser } = useGetCurrentUserQuery();
    const [createConversation, { isLoading: isCreating }] = useCreateConversationMutation();

    // Handle creating a new conversation
    const handleCreateChat = async (params: {
        participants: string[];
        title?: string;
        initialMessage?: string;
        type: 'direct' | 'group';
    }) => {
        try {
            const result = await createConversation({
                participants: params.participants,
                initialMessage: params.initialMessage,
                title: params.title,
                type: params.type
            }).unwrap();

            if (result && result.data) {
                onSelectConversation(result.data);
                setIsCreateDialogOpen(false);
            }
        } catch (error) {
            console.error('Failed to create conversation:', error);
        }
    };

    // Filter conversations based on search and active tab
    const filterConversations = (conversations: Conversation[]) => {
        if (!conversations) return [];

        return conversations.filter(conversation => {
            const matchesSearch =
                conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                conversation.participants.some(p =>
                    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.role.toLowerCase().includes(searchQuery.toLowerCase())
                );

            if (activeTab === 'all') {
                return matchesSearch;
            } else if (activeTab === 'direct') {
                return matchesSearch && conversation.type === 'direct';
            } else if (activeTab === 'group') {
                return matchesSearch && conversation.type === 'group';
            } else if (activeTab === 'unread') {
                return matchesSearch && conversation.unreadCount > 0;
            } else if (activeTab === 'project') {
                return matchesSearch && conversation.projectId !== null;
            }

            return matchesSearch;
        });
    };

    // Sort conversations
    const sortConversations = (conversations: Conversation[]) => {
        const sorted = [...conversations].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            if (sortOrder === 'newest') {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            } else {
                if (b.unreadCount !== a.unreadCount) {
                    return b.unreadCount - a.unreadCount;
                }
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
        });

        return sorted;
    };

    // Convert conversations to Contact format for ContactList
    const conversationsToContacts = (conversations: Conversation[]) => {
        return conversations.map(conversation => {
            const otherParticipant = conversation.type === 'direct'
                ? conversation.participants.find(p => p.id !== currentUser?.user?.id)
                : null;

            const avatar = getConversationAvatar(conversation);

            let contactType: 'mentor' | 'peer' | 'group' | 'system';
            if (conversation.type === 'direct') {
                contactType = otherParticipant?.role === 'mentor' ? 'mentor' : 'peer';
            } else {
                contactType = 'group';
            }

            return {
                id: conversation.id,
                name: conversation.title,
                avatar: avatar.src,
                initials: avatar.fallback,
                type: contactType,
                role: otherParticipant?.role || 'Group',
                online: conversation.type === 'direct'
                    ? conversation.participants.some(p => p.id !== currentUser?.user?.id && p.status === 'online')
                    : false,
                lastActive: conversation.updatedAt,
                unreadCount: conversation.unreadCount,
                isPinned: conversation.isPinned,
                isMuted: conversation.isMuted,
                lastMessage: conversation.lastMessage ? {
                    content: conversation.lastMessage.content,
                    timestamp: conversation.lastMessage.timestamp || conversation.updatedAt,
                    senderId: conversation.lastMessage.senderId
                } : undefined
            };
        });
    };

    // Helper to get conversation avatar details
    const getConversationAvatar = (conversation: Conversation) => {
        if (conversation.type === 'group' || conversation.avatar) {
            return {
                src: conversation.avatar || undefined,
                fallback: conversation.title.substring(0, 2).toUpperCase(),
                color: conversation.projectId ? "bg-indigo-600" : "bg-purple-600"
            };
        }

        const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.user?.id);
        if (!otherParticipant) {
            return {
                src: undefined,
                fallback: "??",
                color: "bg-gray-600"
            };
        }

        const getColorForRole = (role: string) => {
            switch (role) {
                case 'mentor': return "bg-blue-600";
                case 'admin': return "bg-red-600";
                case 'instructor': return "bg-indigo-600";
                case 'teaching_assistant': return "bg-purple-600";
                default: return "bg-green-600";
            }
        };

        return {
            src: otherParticipant.profilePicture || undefined,
            fallback: otherParticipant.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
            color: getColorForRole(otherParticipant.role)
        };
    };

    const filteredConversations = sortConversations(filterConversations(conversations));
    const contacts = conversationsToContacts(filteredConversations);

    // Calculate total unread count
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

    // Handle pinning/muting/archiving contacts
    const handlePinContact = async (id: string | number, isPinned: boolean) => {
        console.log(`${isPinned ? 'Pinning' : 'Unpinning'} conversation ${id}`);
    };

    const handleMuteContact = async (id: string | number, isMuted: boolean) => {
        console.log(`${isMuted ? 'Muting' : 'Unmuting'} conversation ${id}`);
    };

    const handleArchiveContact = async (id: string | number) => {
        console.log(`Archiving conversation ${id}`);
    };

    const handleStarContact = async (id: string | number, isStarred: boolean) => {
        console.log(`${isStarred ? 'Starring' : 'Unstarring'} conversation ${id}`);
    };

    return (
        <Card className="h-[calc(80vh-2rem)] border-indigo-100 dark:border-slate-700/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg transition-all duration-300">
            <Tabs defaultValue="conversations" className="h-full flex flex-col">
                <div className="px-4 pt-4 pb-3 border-b border-indigo-100 dark:border-slate-700/50 flex items-center flex-wrap gap-3 justify-between">
                    <h3 className="font-semibold text-lg dark:text-white">Messages</h3>
                    <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30 border-0">
                            {totalUnread > 0 ? totalUnread : 0}
                        </Badge>
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-0"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            New
                        </Button>
                        <NewChatModal
                            isOpen={isCreateDialogOpen}
                            onClose={() => setIsCreateDialogOpen(false)}
                            onCreateChat={handleCreateChat}
                            isCreating={isCreating}
                        />
                    </div>
                </div>

                <div className="overflow-hidden flex flex-col flex-1">
                    <CardHeader className="pb-0 pt-3">
                        <div className="flex items-center justify-between mb-3 overflow-x-auto flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700/50 pb-3">
                            <div className="flex overflow-x-auto space-x-1 pb-1">
                                <Button
                                    variant={activeTab === 'all' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                        "h-7 px-2 text-xs transition-colors",
                                        activeTab === 'all'
                                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                            : "dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50"
                                    )}
                                    onClick={() => setActiveTab('all')}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={activeTab === 'direct' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                        "h-7 px-2 text-xs transition-colors",
                                        activeTab === 'direct'
                                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                            : "dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50"
                                    )}
                                    onClick={() => setActiveTab('direct')}
                                >
                                    Direct
                                </Button>
                                <Button
                                    variant={activeTab === 'group' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                        "h-7 px-2 text-xs transition-colors",
                                        activeTab === 'group'
                                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                            : "dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50"
                                    )}
                                    onClick={() => setActiveTab('group')}
                                >
                                    Groups
                                </Button>
                                <Button
                                    variant={activeTab === 'unread' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                        "h-7 px-2 text-xs transition-colors",
                                        activeTab === 'unread'
                                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                            : "dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50",
                                        totalUnread > 0 && "font-medium"
                                    )}
                                    onClick={() => setActiveTab('unread')}
                                >
                                    Unread
                                    {totalUnread > 0 && (
                                        <Badge
                                            className="ml-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-4 min-w-4 flex items-center justify-center text-white border-0"
                                        >
                                            {totalUnread}
                                        </Badge>
                                    )}
                                </Button>
                                <Button
                                    variant={activeTab === 'project' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                        "h-7 px-2 text-xs transition-colors",
                                        activeTab === 'project'
                                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                            : "dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50"
                                    )}
                                    onClick={() => setActiveTab('project')}
                                >
                                    Projects
                                </Button>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <DropdownMenuItem
                                        onClick={() => setSortOrder('newest')}
                                        className={cn(
                                            "cursor-pointer dark:hover:bg-slate-700/50 dark:text-slate-300",
                                            sortOrder === 'newest' && "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                                        )}
                                    >
                                        Most recent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setSortOrder('unread')}
                                        className={cn(
                                            "cursor-pointer dark:hover:bg-slate-700/50 dark:text-slate-300",
                                            sortOrder === 'unread' && "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                                        )}
                                    >
                                        Unread first
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="dark:border-slate-700/50" />
                                    <DropdownMenuItem className="cursor-pointer dark:hover:bg-slate-700/50 dark:text-slate-300">
                                        Show archived
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="relative mb-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Search messages..."
                                className="pl-9 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-100 dark:placeholder-slate-400 backdrop-blur-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden mt-2">
                        <ScrollArea className="h-[calc(100%-85px)]">
                            {contacts.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 inline-flex rounded-full p-3 mb-4">
                                        <Search className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-slate-900 dark:text-white font-medium">No conversations found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                        {searchQuery
                                            ? `No results for "${searchQuery}"`
                                            : activeTab !== 'all'
                                                ? `No ${activeTab} conversations`
                                                : 'Start a new conversation'
                                        }
                                    </p>
                                    <Button
                                        className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-0"
                                        size="sm"
                                        onClick={() => setIsCreateDialogOpen(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        New Conversation
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
                                    <ContactList
                                        contacts={contacts}
                                        currentContactId={selectedConversationId}
                                        setCurrentContactId={(id) => {
                                            const conversation = filteredConversations.find(c => c.id === id);
                                            if (conversation) {
                                                onSelectConversation(conversation);
                                            }
                                        }}
                                        onPinContact={handlePinContact}
                                        onMuteContact={handleMuteContact}
                                        onArchiveContact={handleArchiveContact}
                                        onStarContact={handleStarContact}
                                    />
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </div>
            </Tabs>
        </Card>
    );
};

export default ConversationsSidebar;