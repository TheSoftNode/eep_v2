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

    // Render dialog content
    const dialogContent = (
        <DialogContent className="sm:max-w-[600px] max-w-[95vw]">
            <DialogHeader>
                <DialogTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                    {isCreatingGroup ? 'Create Group Chat' : 'New Conversation'}
                </DialogTitle>
                <DialogDescription>
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
                        <label className="text-sm font-medium">Group Name</label>
                        <Input
                            placeholder="Enter group name..."
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                        />
                    </div>
                )}

                {/* Contact Selection */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                            {isCreatingGroup ? 'Add Participants' : 'Select Recipient'}
                        </label>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setIsCreatingGroup(!isCreatingGroup)}
                        >
                            {isCreatingGroup ? 'Create Direct Chat' : 'Create Group Chat'}
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search by name or role..."
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

                    {/* Selected Contacts Pills */}
                    {selectedContacts.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {selectedContacts.map(id => {
                                const contact = contactsData?.data?.find(c => c.id === id);
                                if (!contact) return null;

                                return (
                                    <Badge
                                        key={id}
                                        className="bg-purple-100 text-purple-800 hover:bg-purple-200 pl-2 py-1.5 gap-1"
                                        onClick={() => toggleContactSelection(id)}
                                    >
                                        {contact.fullName}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 text-purple-800 hover:bg-purple-200 rounded-full"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                );
                            })}
                        </div>
                    )}

                    {/* Contacts List */}
                    <ScrollArea className="h-[200px] border rounded-md">
                        <div className="p-1">
                            {isLoadingContacts ? (
                                <div className="p-6 text-center">
                                    <div className="animate-spin h-6 w-6 border-t-2 border-purple-600 border-r-2 rounded-full mx-auto mb-2"></div>
                                    <p className="text-gray-500">Loading contacts...</p>
                                </div>
                            ) : filteredContacts.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">No contacts found</p>
                                    {searchQuery && (
                                        <p className="text-sm text-gray-400">Try a different search term</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredContacts.map((contact: Contact) => (
                                        <div
                                            key={contact.id}
                                            className={cn(
                                                "flex items-center gap-3 p-2 rounded-md cursor-pointer",
                                                selectedContacts.includes(contact.id)
                                                    ? "bg-purple-100"
                                                    : "hover:bg-gray-100"
                                            )}
                                            onClick={() => toggleContactSelection(contact.id)}
                                        >
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={contact.profilePicture || undefined} />
                                                <AvatarFallback className={cn(
                                                    "text-white",
                                                    contact.role === 'mentor' ? "bg-blue-600" :
                                                        contact.role === 'admin' ? "bg-red-600" : "bg-green-600"
                                                )}>
                                                    {contact.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm">{contact.fullName}</p>
                                                <p className="text-xs text-gray-500">{contact.role}</p>
                                            </div>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                selectedContacts.includes(contact.id)
                                                    ? "bg-purple-600 border-purple-600 text-white"
                                                    : "border-gray-300"
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
                    <label className="text-sm font-medium">Message (optional)</label>
                    <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[100px] resize-none"
                        value={initialMessage}
                        onChange={e => setInitialMessage(e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                    className="bg-purple-600 hover:bg-purple-700"
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