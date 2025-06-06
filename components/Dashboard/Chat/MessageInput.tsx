import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Image, Send, Smile, Mic, X, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import EmojiPicker from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';
import { useSetTypingStatusMutation, useUploadAttachmentMutation } from '@/Redux/apiSlices/chat/chatApi';

interface MessageInputProps {
    conversationId: string;
    onSendMessage: (message: string, attachments?: any[]) => Promise<void>;
    replyToMessage?: { id: string; content: string; sender: string } | null;
    onCancelReply?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    conversationId,
    onSendMessage,
    replyToMessage,
    onCancelReply
}) => {
    // State for message and attachments
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadAttachment] = useUploadAttachmentMutation();
    const [setTypingStatus] = useSetTypingStatusMutation();

    // Voice recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    // Typing indicator states
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Focus textarea on mount and when reply changes
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [replyToMessage]);

    // Auto resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }

        // Handle typing indicator
        if (message && !isTyping) {
            setIsTyping(true);
            setTypingStatus({ conversationId, isTyping: true }).catch(err => {
                console.error('Failed to set typing status:', err);
            });
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to clear typing indicator after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                setTypingStatus({ conversationId, isTyping: false }).catch(err => {
                    console.error('Failed to clear typing status:', err);
                });
            }
        }, 2000);
    }, [message, conversationId, isTyping, setTypingStatus]);


    useEffect(() => {
        if (message && !isTyping) {
            setIsTyping(true);
            setTypingStatus({ conversationId, isTyping: true }).catch(err => {
                console.error('Failed to set typing status:', err);
            });
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to clear typing indicator after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                setTypingStatus({ conversationId, isTyping: false }).catch(err => {
                    console.error('Failed to clear typing status:', err);
                });
            }
        }, 2000); // 2 seconds delay after typing stops
    }, [message, conversationId, isTyping, setTypingStatus]);


    // Join conversation room when component mounts
    useEffect(() => {
        return () => {
            if (isTyping) {
                setTypingStatus({ conversationId, isTyping: false }).catch(err => {
                    console.error('Failed to clear typing status:', err);
                });
            }

            // Clean up voice recording if active
            if (isRecording) {
                stopRecording();
            }

            // Clear typing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [conversationId, isTyping, isRecording, setTypingStatus]);
    // Function to start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                setAudioBlob(audioBlob);

                // Upload audio file
                uploadVoiceNote(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Start timer
            setRecordingTime(0);
            recordingTimerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    // Function to stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        setIsRecording(false);

        // Clear timer
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
    };

    // Function to upload voice note
    const uploadVoiceNote = async (blob: Blob) => {
        try {
            const file = new File([blob], `voice-note-${Date.now()}.mp3`, { type: 'audio/mp3' });
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadAttachment(formData).unwrap();
            if (result.success) {
                setAttachments(prev => [...prev, result.data]);
            }
        } catch (error) {
            console.error('Error uploading voice note:', error);
        }
    };

    // Format recording time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if ((!message || message.trim() === '') && attachments.length === 0) return;

        try {
            console.log("Sending message:", message);
            setIsSubmitting(true);

            // Clear typing indicator
            if (isTyping) {
                setIsTyping(false);
                setTypingStatus({ conversationId, isTyping: false }).catch(err => {
                    console.error('Failed to clear typing status:', err);
                });
            }

            await onSendMessage(message, attachments);
            setMessage('');
            setAttachments([]);
            setAudioBlob(null);

            console.log("Message sent successfully");

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle file selection for attachments
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            // Upload each file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);

                const result = await uploadAttachment(formData).unwrap();
                if (result.success) {
                    setAttachments(prev => [...prev, result.data]);
                }
            }

            // Clear the input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading attachment:', error);
        }
    };

    // Remove an attachment
    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(attachment => attachment.id !== id));
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Add emoji to message
    const handleEmojiSelect = (emojiData: any) => {
        setMessage(prev => prev + emojiData.emoji);
    };

    return (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 backdrop-blur-sm relative">
            {/* Reply indicator */}
            {replyToMessage && (
                <div className="mb-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 dark:border-indigo-400 rounded-md flex items-center justify-between backdrop-blur-sm">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Replying to {replyToMessage.sender}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{replyToMessage.content}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0 dark:hover:bg-slate-700/50"
                        onClick={onCancelReply}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Recording indicator */}
            {isRecording && (
                <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-md flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">Recording voice message... {formatTime(recordingTime)}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={stopRecording}
                    >
                        <StopCircle className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Attachments preview */}
            {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map(attachment => (
                        <div
                            key={attachment.id}
                            className="bg-slate-100 dark:bg-slate-700/50 rounded-md p-2 pr-1 flex items-center gap-2 border border-slate-200 dark:border-slate-600/50 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-1 max-w-[180px]">
                                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded flex items-center justify-center flex-shrink-0">
                                    {attachment.type.startsWith('audio') ? (
                                        <Mic className="h-3 w-3" />
                                    ) : (
                                        <FileIcon className="h-3 w-3" />
                                    )}
                                </div>
                                <span className="text-xs font-medium truncate dark:text-slate-300">
                                    {attachment.type.startsWith('audio') ? 'Voice message' : attachment.name}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 dark:hover:bg-slate-600/50"
                                onClick={() => removeAttachment(attachment.id)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Message input area */}
            <div className="flex items-end gap-2">
                <div className="flex-1 border border-slate-200 dark:border-slate-600/50 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent dark:focus-within:ring-indigo-400 bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 py-3 min-h-[48px] dark:bg-transparent dark:text-slate-100 dark:placeholder-slate-400"
                        rows={1}
                        disabled={isRecording}
                    />

                    <div className="flex items-center p-2 border-t border-slate-200 dark:border-slate-600/50 bg-slate-50 dark:bg-slate-800/30">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isRecording}
                                    >
                                        <Paperclip className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <p>Attach file</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            multiple
                        />

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isRecording}
                                    >
                                        <Image className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <p>Add image</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                    disabled={isRecording}
                                >
                                    <Smile className="h-5 w-5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="top" align="start" className="p-0 w-[352px] dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiSelect}
                                    theme={Theme.DARK}
                                    width="100%"
                                    height={350}
                                    skinTonesDisabled
                                    searchDisabled={false}
                                    lazyLoadEmojis={false}
                                />
                            </PopoverContent>
                        </Popover>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            isRecording
                                                ? "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                : "text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        )}
                                        onClick={isRecording ? stopRecording : startRecording}
                                    >
                                        {isRecording ? (
                                            <StopCircle className="h-5 w-5" />
                                        ) : (
                                            <Mic className="h-5 w-5" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <p>{isRecording ? "Stop recording" : "Voice message"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <Button
                    onClick={handleSendMessage}
                    disabled={isSubmitting || isRecording || ((!message || message.trim() === '') && attachments.length === 0)}
                    className={cn(
                        "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-0 transition-all duration-300",
                        isSubmitting && "opacity-70 cursor-not-allowed"
                    )}
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

// File icon component
const FileIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);