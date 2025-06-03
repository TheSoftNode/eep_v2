"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Users, Search, X, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetUserContactsQuery } from '@/Redux/apiSlices/chat/chatApi';
import { Contact } from '@/Redux/types/Chats/chat';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateChat: (params: {
        participants: string[];
        title?: string;
        initialMessage?: string;
        type: 'direct' | 'group';
    }) => Promise<void>;
    isCreating: boolean;
    buttonTrigger?: React.ReactNode;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
    isOpen,
    onClose,
    onCreateChat,
    isCreating,
    buttonTrigger
}) => {
    // State
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [initialMessage, setInitialMessage] = useState('');

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setIsCreatingGroup(false);
            setGroupName('');
            setSearchQuery('');
            setSelectedContacts([]);
            setInitialMessage('');
        }
    }, [isOpen]);

    // Get contacts from API
    const { data: contactsData, isLoading: isLoadingContacts } = useGetUserContactsQuery({
        // search: searchQuery,
        limit: 50
    });

    useEffect(() => {
        console.log("Contacts query result:", contactsData);
    }, [contactsData]);

    // Filter contacts
    const filteredContacts = contactsData?.data || [];

    // Toggle contact selection
    const toggleContactSelection = (contactId: string) => {
        setSelectedContacts(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    // Create chat handler
    const handleCreateChat = async () => {
        if (selectedContacts.length === 0) return;
        if (isCreatingGroup && !groupName.trim()) return;

        await onCreateChat({
            participants: selectedContacts,
            title: isCreatingGroup ? groupName : undefined,
            initialMessage: initialMessage.trim() || undefined,
            type: isCreatingGroup ? 'group' : 'direct'
        });
    };

    // Get avatar color based on role with dark mode support
    const getAvatarColorClass = (role: string) => {
        switch (role) {
            case 'mentor': return "bg-blue-600 dark:bg-blue-500";
            case 'admin': return "bg-red-600 dark:bg-red-500";
            case 'instructor': return "bg-indigo-600 dark:bg-indigo-500";
            case 'teaching_assistant': return "bg-purple-600 dark:bg-purple-500";
            default: return "bg-emerald-600 dark:bg-emerald-500";
        }
    };

    // Render dialog content
    const dialogContent = (
        <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[95vh] overflow-auto dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
            <DialogHeader>
                <DialogTitle className="flex items-center dark:text-white">
                    <MessageSquare className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    {isCreatingGroup ? 'Create Group Chat' : 'New Conversation'}
                </DialogTitle>
                <DialogDescription className="dark:text-slate-400">
                    {isCreatingGroup
                        ? 'Create a group for team collaboration'
                        : 'Start a conversation with mentors, peers, or colleagues'
                    }
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                {/* Group Name (if creating group) */}
                {isCreatingGroup && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Group Name</label>
                        <Input
                            placeholder="Enter group name..."
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            className="dark:bg-slate-800/50 dark:border-slate-600/50 dark:text-slate-100 dark:placeholder-slate-400 backdrop-blur-sm"
                        />
                    </div>
                )}

                {/* Contact Selection */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium dark:text-slate-300">
                            {isCreatingGroup ? 'Add Participants' : 'Select Recipient'}
                        </label>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs dark:hover:bg-slate-700/50 dark:text-slate-400"
                            onClick={() => setIsCreatingGroup(!isCreatingGroup)}
                        >
                            {isCreatingGroup ? 'Create Direct Chat' : 'Create Group Chat'}
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search by name or role..."
                            className="pl-9 dark:bg-slate-800/50 dark:border-slate-600/50 dark:text-slate-100 dark:placeholder-slate-400 backdrop-blur-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 h-7 w-7 dark:hover:bg-slate-700/50"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Selected Contacts Pills */}
                    {selectedContacts.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {selectedContacts.map(id => {
                                const contact = contactsData?.data?.find(c => c.id === id);
                                if (!contact) return null;

                                return (
                                    <Badge
                                        key={id}
                                        className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30 pl-2 py-1.5 gap-1 cursor-pointer transition-colors border-0"
                                        onClick={() => toggleContactSelection(id)}
                                    >
                                        {contact.fullName}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 text-indigo-800 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/40 rounded-full"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                );
                            })}
                        </div>
                    )}

                    {/* Contacts List */}
                    <ScrollArea className="h-[200px] border border-slate-200 dark:border-slate-600/50 rounded-md dark:bg-slate-800/30 backdrop-blur-sm">
                        <div className="p-1">
                            {isLoadingContacts ? (
                                <div className="p-6 text-center">
                                    <div className="animate-spin h-6 w-6 border-t-2 border-indigo-600 dark:border-indigo-400 border-r-2 rounded-full mx-auto mb-2"></div>
                                    <p className="text-slate-500 dark:text-slate-400">Loading contacts...</p>
                                </div>
                            ) : filteredContacts.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Users className="h-8 w-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                                    <p className="text-slate-500 dark:text-slate-400">No contacts found</p>
                                    {searchQuery && (
                                        <p className="text-sm text-slate-400 dark:text-slate-500">Try a different search term</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredContacts.map((contact: Contact) => (
                                        <div
                                            key={contact.id}
                                            className={cn(
                                                "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                                                selectedContacts.includes(contact.id)
                                                    ? "bg-indigo-100 dark:bg-indigo-900/20"
                                                    : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                            )}
                                            onClick={() => toggleContactSelection(contact.id)}
                                        >
                                            <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-700/50 shadow-sm">
                                                <AvatarImage src={contact.profilePicture || undefined} />
                                                <AvatarFallback className={cn(
                                                    "text-white",
                                                    getAvatarColorClass(contact.role)
                                                )}>
                                                    {contact.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm dark:text-slate-200">{contact.fullName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{contact.role}</p>
                                            </div>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                selectedContacts.includes(contact.id)
                                                    ? "bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 text-white"
                                                    : "border-slate-300 dark:border-slate-600"
                                            )}>
                                                {selectedContacts.includes(contact.id) && (
                                                    <CheckIcon className="h-3 w-3" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Initial Message */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dark:text-slate-300">Message (optional)</label>
                    <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[100px] resize-none dark:bg-slate-800/50 dark:border-slate-600/50 dark:text-slate-100 dark:placeholder-slate-400 backdrop-blur-sm"
                        value={initialMessage}
                        onChange={e => setInitialMessage(e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter className="dark:border-slate-700/50">
                <DialogClose asChild>
                    <Button variant="outline" className="dark:border-slate-600/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">Cancel</Button>
                </DialogClose>
                <Button
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-0"
                    disabled={selectedContacts.length === 0 || (isCreatingGroup && !groupName.trim()) || isCreating}
                    onClick={handleCreateChat}
                >
                    {isCreating ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-t-2 border-white border-r-2 rounded-full mr-2"></div>
                            Creating...
                        </>
                    ) : (
                        <>Start Conversation</>
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    );

    // If a trigger button is provided, use it with DialogTrigger
    if (buttonTrigger) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogTrigger asChild>
                    {buttonTrigger}
                </DialogTrigger>
                {dialogContent}
            </Dialog>
        );
    }

    // Otherwise, use controlled open state
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {dialogContent}
        </Dialog>
    );
};

export default NewChatModal;
