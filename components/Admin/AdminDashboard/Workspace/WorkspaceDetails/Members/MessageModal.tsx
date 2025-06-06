"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Send,
    MessageSquare,
    Calendar,
    Clock,
    Paperclip,
    Star,
    User,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import the API hook and types
import { SendMessageRequest } from '@/Redux/types/Users/mentorMessage';
import { useSendMessageToMentorMutation } from '@/Redux/apiSlices/users/mentorMessagApi';
import { useAuth } from '@/hooks/useAuth';
import { WorkspaceMember } from '@/Redux/types/Workspace/workspace';

interface MessageMemberModalProps {
    member: WorkspaceMember;
    onClose: () => void;
    onMessageSent?: () => void;
}

const MessageModal: React.FC<MessageMemberModalProps> = ({
    member,
    onClose,
    onMessageSent
}) => {
    const [messageType, setMessageType] = useState<string>('general');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
    const [includeScheduling, setIncludeScheduling] = useState<boolean>(false);

    const { user, isAdmin, isMentor, isLearner } = useAuth();

    // API hook
    const [sendMessage, { isLoading: isSending, isSuccess, isError, error }] = useSendMessageToMentorMutation();

    const messageTemplates = {
        general: {
            subject: `Message from ${isAdmin() ? 'Admin' : isMentor() ? 'Mentor' : 'Team Member'}`,
            placeholder: `Write your message to ${member.fullName}...`
        },
        collaboration: {
            subject: 'Collaboration Request',
            placeholder: `Hi ${member.fullName}! I'd like to collaborate with you on...`
        },
        project: {
            subject: 'Project Discussion',
            placeholder: 'I wanted to discuss our project progress and next steps...'
        },
        feedback: {
            subject: 'Feedback Request',
            placeholder: 'I would appreciate your feedback on...'
        },
        support: {
            subject: 'Support Request',
            placeholder: 'I need some assistance with...'
        },
        meeting: {
            subject: 'Meeting Request',
            placeholder: 'I would like to schedule a meeting to discuss...'
        }
    } as const;

    const handleTemplateChange = (type: string) => {
        setMessageType(type);
        const template = messageTemplates[type as keyof typeof messageTemplates];
        if (template) {
            setSubject(template.subject);
            setMessage('');
        }
    };

    const handleSendMessage = async () => {
        if (!subject.trim() || !message.trim()) return;

        try {
            const messageData: SendMessageRequest = {
                recipientId: member.userId,
                subject: subject.trim(),
                content: message.trim(),
                priority
            };

            const result = await sendMessage(messageData).unwrap();

            // Show success feedback
            console.log('Message sent successfully:', result);

            // Call success callback if provided
            if (onMessageSent) {
                onMessageSent();
            }

            // Close modal after a short delay to show success state
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err) {
            console.error('Failed to send message:', err);
            // Error will be handled by the error state below
        }
    };

    const getErrorMessage = () => {
        if (error && 'data' in error) {
            return (error.data as any)?.message || 'Failed to send message';
        }
        return 'Failed to send message. Please try again.';
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'from-purple-600 to-indigo-600';
            case 'mentor':
                return 'from-blue-600 to-cyan-600';
            case 'learner':
                return 'from-green-600 to-emerald-600';
            default:
                return 'from-slate-600 to-gray-600';
        }
    };

    // Show success state briefly before closing
    if (isSuccess) {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white dark:bg-slate-900 rounded-lg p-8 shadow-2xl max-w-md mx-4"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                Message Sent Successfully!
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Your message has been delivered to {member.fullName}.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto rounded-xl"
                >
                    <Card className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
                        {/* Header */}
                        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                            Send Message
                                        </CardTitle>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Communicate with {member.fullName}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    disabled={isSending}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Error Display */}
                            {isError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                                >
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        <p className="text-red-800 dark:text-red-200 font-medium">
                                            {getErrorMessage()}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Member Info */}
                            <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/70 dark:border-slate-700/50">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleColor(member.workspaceRole)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                    {member.photoURL ? (
                                        <img
                                            src={member.photoURL}
                                            alt={member.fullName}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        member.fullName.split(' ').map(n => n[0]).join('')
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                                        {member.fullName}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                                        {member.email}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <Badge className={`${member.workspaceRole === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                member.workspaceRole === 'mentor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            }`}>
                                            {member.workspaceRole?.replace('_', ' ') || 'Member'}
                                        </Badge>
                                        {member.specialty && (
                                            <Badge variant="outline" className="text-xs">
                                                {member.specialty}
                                            </Badge>
                                        )}
                                        <Badge className={member.isActive
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
                                        }>
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Message Type Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Message Type
                                </label>
                                <Select value={messageType} onValueChange={handleTemplateChange} disabled={isSending}>
                                    <SelectTrigger className="bg-white dark:bg-slate-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General Message</SelectItem>
                                        <SelectItem value="collaboration">Collaboration Request</SelectItem>
                                        <SelectItem value="project">Project Discussion</SelectItem>
                                        <SelectItem value="feedback">Feedback Request</SelectItem>
                                        <SelectItem value="support">Support Request</SelectItem>
                                        <SelectItem value="meeting">Meeting Request</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Priority Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Priority
                                    </label>
                                    <Select value={priority} onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') => setPriority(value)} disabled={isSending}>
                                        <SelectTrigger className="bg-white dark:bg-slate-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low Priority</SelectItem>
                                            <SelectItem value="normal">Normal Priority</SelectItem>
                                            <SelectItem value="high">High Priority</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {messageType === 'meeting' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Include Scheduling
                                        </label>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <input
                                                type="checkbox"
                                                id="includeScheduling"
                                                checked={includeScheduling}
                                                onChange={(e) => setIncludeScheduling(e.target.checked)}
                                                disabled={isSending}
                                                className="rounded border-slate-300 dark:border-slate-600"
                                            />
                                            <label htmlFor="includeScheduling" className="text-sm text-slate-600 dark:text-slate-400">
                                                Include calendar link
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter message subject"
                                    disabled={isSending}
                                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                />
                            </div>

                            {/* Message Content */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={messageTemplates[messageType as keyof typeof messageTemplates]?.placeholder || 'Write your message...'}
                                    rows={6}
                                    disabled={isSending}
                                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 resize-none"
                                />
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>{message.length} characters</span>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="sm" className="h-6 px-2" disabled={isSending}>
                                            <Paperclip className="h-3 w-3 mr-1" />
                                            Attach
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions for Meeting */}
                            {messageType === 'meeting' && (
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Quick Meeting Actions
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={isSending}
                                            className="bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                                        >
                                            <Clock className="h-4 w-4 mr-1" />
                                            View Schedule
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={isSending}
                                            className="bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                                        >
                                            <Calendar className="h-4 w-4 mr-1" />
                                            Suggest Times
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Message Templates */}
                            {messageType === 'general' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Quick Templates
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setMessage(`Hi ${member.fullName}! I hope you're doing well. I wanted to reach out regarding...`)}
                                            disabled={isSending}
                                            className="justify-start text-left h-auto p-3"
                                        >
                                            <div>
                                                <div className="font-medium">Friendly Check-in</div>
                                                <div className="text-xs text-slate-500">Casual greeting template</div>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setMessage(`Thanks for your collaboration on our recent work. I wanted to follow up on...`)}
                                            disabled={isSending}
                                            className="justify-start text-left h-auto p-3"
                                        >
                                            <div>
                                                <div className="font-medium">Follow-up Message</div>
                                                <div className="text-xs text-slate-500">Continue previous conversation</div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                    <User className="h-4 w-4" />
                                    <span>Sending as {user?.fullName || 'Team Member'}</span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isSending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!subject.trim() || !message.trim() || isSending}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSending ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Sending...
                                            </div>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MessageModal;