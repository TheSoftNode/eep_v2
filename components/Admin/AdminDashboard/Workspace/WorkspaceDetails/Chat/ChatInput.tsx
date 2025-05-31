"use client"

import { useState, useRef, ChangeEvent, useCallback, useEffect } from 'react';
import { Send, Paperclip, Smile, X, Mic, Image, File, FileText, Loader2, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDropzone } from 'react-dropzone';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUploadMessageAttachmentMutation, useUploadVoiceNoteMutation } from '@/Redux/apiSlices/workspaces/workspaceMessagingApi';

interface ChatInputProps {
    workspaceId: string;
    projectId?: string | null; // Added projectId as optional parameter
    onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
    isLoading?: boolean;
    maxAttachmentSize?: number; // in bytes
    replyingToMessage?: any; // Update with correct type
}


export default function ChatInput({
    workspaceId,
    projectId = null, // Default to null if not provided
    onSendMessage,
    isLoading = false,
    maxAttachmentSize = 50 * 1024 * 1024, // 50MB default
    replyingToMessage = null
}: ChatInputProps) {
    // State management
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // API hooks
    const [uploadAttachment] = useUploadMessageAttachmentMutation();
    const [uploadVoiceNote] = useUploadVoiceNoteMutation();

    // Focus textarea when component mounts or when replying to a message
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [replyingToMessage]);

   

    // Handle recording timer
    useEffect(() => {
        if (isRecording) {
            recordingTimerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
                recordingTimerRef.current = null;
            }
        }
        
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
                recordingTimerRef.current = null;
            }
        };
    }, [isRecording]);

    // Handle message input
    const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Auto-resize the textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // File upload with dropzone
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);

        // Check size limits
        const oversizedFiles = acceptedFiles.filter(file => file.size > maxAttachmentSize);
        if (oversizedFiles.length > 0) {
            setError(`Some files exceed the maximum size of ${formatFileSize(maxAttachmentSize)}`);

            // Only add files that are within size limits
            const validFiles = acceptedFiles.filter(file => file.size <= maxAttachmentSize);
            setAttachments(prev => [...prev, ...validFiles]);
            return;
        }

        setAttachments(prev => [...prev, ...acceptedFiles]);
    }, [maxAttachmentSize]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
        maxSize: maxAttachmentSize
    });

    // Handle file selection via button
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            // Check size limits
            const oversizedFiles = files.filter(file => file.size > maxAttachmentSize);
            if (oversizedFiles.length > 0) {
                setError(`Some files exceed the maximum size of ${formatFileSize(maxAttachmentSize)}`);

                // Only add files that are within size limits
                const validFiles = files.filter(file => file.size <= maxAttachmentSize);
                setAttachments(prev => [...prev, ...validFiles]);
                return;
            }

            setAttachments(prev => [...prev, ...files]);
        }
    };

    // Handle file attachment button click
    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    // Start voice recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder: MediaRecorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setAudioChunks([]);
            
            // Explicitly type the chunks array
            const chunks: Blob[] = [];
            
            recorder.addEventListener('dataavailable', (event: BlobEvent) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                    setAudioChunks(prev => [...prev, event.data]);
                }
            });
            
            recorder.addEventListener('stop', async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/mp4' });
                
                if (audioBlob.size > 0) {
                    const audioFile = new (window as any).File(
                        [audioBlob], 
                        `voice-note-${new Date().toISOString()}.m4a`, 
                        { type: 'audio/mp4' }
                      ) as File;
                    
                    try {
                        setIsUploading(true);
                        // Upload the voice note with projectId if available
                        await uploadVoiceNote({
                            workspaceId,
                            // projectId: projectId || undefined,
                            file: audioFile,
                            duration: recordingTime
                        }).unwrap();
                        
                        // After successful upload, send a message with the voice note
                        await onSendMessage("Sent a voice note", [audioFile]);
                    } catch (error) {
                        console.error('Error uploading voice note:', error);
                        setError('Failed to upload voice note. Please try again.');
                    } finally {
                        setIsUploading(false);
                    }
                }
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            });
            
            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);
        } catch (error) {
            console.error('Error starting recording:', error);
            setError('Could not access microphone. Please check permissions.');
        }
    };

    // Stop voice recording
    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    // Format recording time
    const formatRecordingTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get file icon based on type
    const getFileIcon = (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';

        if (file.type.startsWith('image/')) {
            return <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
        } else if (
            extension === 'pdf' ||
            file.type.includes('document') ||
            ['doc', 'docx', 'txt', 'rtf'].includes(extension)
        ) {
            return <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />;
        } else {
            return <File className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
        }
    };

    // Remove attachment
    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // Send message
    const sendMessage = async () => {
        if ((!message.trim() && attachments.length === 0) || isLoading) return;

        try {
            await onSendMessage(message, attachments.length > 0 ? attachments : undefined);

            // Reset input state
            setMessage('');
            setAttachments([]);
            setError(null);

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message. Please try again.");
        }
    };

    // Add emoji to message
    const addEmoji = (emoji: string) => {
        setMessage(prev => prev + emoji);
        setShowEmojiPicker(false);

        // Focus textarea after adding emoji
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    return (
        <div
            {...getRootProps()}
            className={`p-3 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${isDragActive ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
        >
            <input {...getInputProps()} />

            {/* Drag overlay */}
            {isDragActive && (
                <div className="absolute inset-0 bg-purple-50 dark:bg-purple-900/20 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg z-10 flex items-center justify-center">
                    <div className="text-purple-700 dark:text-purple-300 font-medium text-lg">
                        Drop files to attach
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-xs border border-red-200 dark:border-red-800 flex items-center">
                    <X className="h-4 w-4 mr-1 cursor-pointer" onClick={() => setError(null)} />
                    {error}
                </div>
            )}

            {/* Voice recording indicator */}
            {isRecording && (
                <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400 animate-pulse mr-2"></div>
                        <span>Recording: {formatRecordingTime(recordingTime)}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopRecording}
                        className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                    </Button>
                </div>
            )}

            {/* Upload progress */}
            {isUploading && (
                <div className="mb-2 space-y-1">
                    <div className="flex justify-between text-xs text-indigo-700 dark:text-indigo-300">
                        <span>Uploading files...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress
                        value={uploadProgress}
                        className="h-1.5 bg-indigo-100 dark:bg-indigo-900/30"
                    >
                        <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
                    </Progress>
                </div>
            )}

            {/* Attachments preview */}
            {attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="flex items-center py-1 px-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                            {getFileIcon(file)}
                            <span className="text-xs truncate max-w-[150px] mx-1.5">
                                {file.name} ({formatFileSize(file.size)})
                            </span>
                            <button
                                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                onClick={() => removeAttachment(index)}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            <div className="flex space-x-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                />

                <div className="flex space-x-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleAttachClick}
                                    type="button"
                                    disabled={isLoading || isRecording}
                                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                                >
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Attach files</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={isRecording ? stopRecording : startRecording}
                                    type="button"
                                    disabled={isLoading}
                                    className={`
                                        ${isRecording ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400'}
                                    `}
                                >
                                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isRecording ? 'Stop recording' : 'Voice message'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            disabled={isLoading || isRecording}
                                            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <Smile className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                        <div className="grid grid-cols-7 gap-1">
                                            {/* Common emojis - simplified for example */}
                                            {["😀", "😊", "👍", "👆", "👇", "👈", "👉", "👋", "👏", "👌", "👎", "👊", "👀", "💪", "💯", "🔥", "❤️", "😂", "😍", "🙏", "👏"].map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => addEmoji(emoji)}
                                                    className="text-lg hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Add emoji</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="flex-1 relative">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleMessageChange}
                        onKeyDown={handleKeyDown}
                        placeholder={isRecording 
                            ? "Recording voice message..." 
                            : projectId 
                                ? `Type your message for this project...` 
                                : "Type your message..."
                        }
                        className="resize-none py-2 min-h-[40px] max-h-[150px] border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        disabled={isLoading || isRecording}
                    />
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={sendMessage}
                                disabled={isLoading || (!message.trim() && attachments.length === 0)}
                                type="button"
                                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Send message</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}


// "use client"

// import { useState, useRef, ChangeEvent, useCallback, useEffect } from 'react';
// import { Send, Paperclip, Smile, X, Mic, Image, File, FileText, Loader2, MicOff } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from '@/components/ui/tooltip';
// import { useDropzone } from 'react-dropzone';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { useUploadMessageAttachmentMutation, useUploadVoiceNoteMutation } from '@/state-management/workspace/workspace-messaging/workspaceMessagingApi';
// import workspaceSocketService from '@/state-management/workspace/workspaceSockets/workspaceSocketService';

// interface ChatInputProps {
//     workspaceId: string;
//     onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
//     isLoading?: boolean;
//     maxAttachmentSize?: number; // in bytes
//     replyingToMessage?: any; // Update with correct type
// }


// export default function ChatInput({
//     workspaceId,
//     onSendMessage,
//     isLoading = false,
//     maxAttachmentSize = 50 * 1024 * 1024, // 50MB default
//     replyingToMessage = null
// }: ChatInputProps) {
//     // State management
//     const [message, setMessage] = useState('');
//     const [attachments, setAttachments] = useState<File[]>([]);
//     const [isRecording, setIsRecording] = useState(false);
//     const [recordingTime, setRecordingTime] = useState(0);
//     const [isUploading, setIsUploading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [isTyping, setIsTyping] = useState(false);
//     const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
//     const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

//     // Refs
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const textareaRef = useRef<HTMLTextAreaElement>(null);
//     const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

//     // API hooks
//     const [uploadAttachment] = useUploadMessageAttachmentMutation();
//     const [uploadVoiceNote] = useUploadVoiceNoteMutation();

//     // Focus textarea when component mounts or when replying to a message
//     useEffect(() => {
//         if (textareaRef.current) {
//             textareaRef.current.focus();
//         }
//     }, [replyingToMessage]);

//     // Handle typing indicator
//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             if (message.trim() && !isTyping) {
//                 setIsTyping(true);
//                 workspaceSocketService.sendTypingIndicator(workspaceId, true);
//             } else if (!message.trim() && isTyping) {
//                 setIsTyping(false);
//                 workspaceSocketService.sendTypingIndicator(workspaceId, false);
//             }
//         }, 300);
        
//         return () => clearTimeout(timeoutId);
//     }, [message, isTyping, workspaceId]);

//     // Clean up typing indicator when component unmounts
//     useEffect(() => {
//         return () => {
//             if (isTyping) {
//                 workspaceSocketService.sendTypingIndicator(workspaceId, false);
//             }
//         };
//     }, [isTyping, workspaceId]);

//     // Handle recording timer
//     useEffect(() => {
//         if (isRecording) {
//             recordingTimerRef.current = setInterval(() => {
//                 setRecordingTime(prev => prev + 1);
//             }, 1000);
//         } else {
//             if (recordingTimerRef.current) {
//                 clearInterval(recordingTimerRef.current);
//                 recordingTimerRef.current = null;
//             }
//         }
        
//         return () => {
//             if (recordingTimerRef.current) {
//                 clearInterval(recordingTimerRef.current);
//                 recordingTimerRef.current = null;
//             }
//         };
//     }, [isRecording]);

//     // Handle message input
//     const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
//         setMessage(e.target.value);

//         // Auto-resize the textarea
//         if (textareaRef.current) {
//             textareaRef.current.style.height = 'auto';
//             textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
//         }
//     };

//     // Handle Enter key press
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     // File upload with dropzone
//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         setError(null);

//         // Check size limits
//         const oversizedFiles = acceptedFiles.filter(file => file.size > maxAttachmentSize);
//         if (oversizedFiles.length > 0) {
//             setError(`Some files exceed the maximum size of ${formatFileSize(maxAttachmentSize)}`);

//             // Only add files that are within size limits
//             const validFiles = acceptedFiles.filter(file => file.size <= maxAttachmentSize);
//             setAttachments(prev => [...prev, ...validFiles]);
//             return;
//         }

//         setAttachments(prev => [...prev, ...acceptedFiles]);
//     }, [maxAttachmentSize]);

//     const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
//         onDrop,
//         noClick: true,
//         maxSize: maxAttachmentSize
//     });

//     // Handle file selection via button
//     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             const files = Array.from(e.target.files);

//             // Check size limits
//             const oversizedFiles = files.filter(file => file.size > maxAttachmentSize);
//             if (oversizedFiles.length > 0) {
//                 setError(`Some files exceed the maximum size of ${formatFileSize(maxAttachmentSize)}`);

//                 // Only add files that are within size limits
//                 const validFiles = files.filter(file => file.size <= maxAttachmentSize);
//                 setAttachments(prev => [...prev, ...validFiles]);
//                 return;
//             }

//             setAttachments(prev => [...prev, ...files]);
//         }
//     };

//     // Handle file attachment button click
//     const handleAttachClick = () => {
//         fileInputRef.current?.click();
//     };

//     // Start voice recording
//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             const recorder: MediaRecorder = new MediaRecorder(stream);
//             setMediaRecorder(recorder);
//             setAudioChunks([]);
            
//             // Explicitly type the chunks array
//             const chunks: Blob[] = [];
            
//             recorder.addEventListener('dataavailable', (event: BlobEvent) => {
//                 if (event.data.size > 0) {
//                     chunks.push(event.data);
//                     setAudioChunks(prev => [...prev, event.data]);
//                 }
//             });
            
//             recorder.addEventListener('stop', async () => {
//                 const audioBlob = new Blob(chunks, { type: 'audio/mp4' });
                
//                 if (audioBlob.size > 0) {
//                     const audioFile = new (window as any).File(
//                         [audioBlob], 
//                         `voice-note-${new Date().toISOString()}.m4a`, 
//                         { type: 'audio/mp4' }
//                       ) as File;
                    
//                     try {
//                         setIsUploading(true);
//                         // Upload the voice note
//                         await uploadVoiceNote({
//                             workspaceId,
//                             file: audioFile,
//                             duration: recordingTime
//                         }).unwrap();
                        
//                         // After successful upload, send a message with the voice note
//                         await onSendMessage("Sent a voice note", [audioFile]);
//                     } catch (error) {
//                         console.error('Error uploading voice note:', error);
//                         setError('Failed to upload voice note. Please try again.');
//                     } finally {
//                         setIsUploading(false);
//                     }
//                 }
                
//                 // Stop all tracks
//                 stream.getTracks().forEach(track => track.stop());
//             });
            
//             recorder.start();
//             setIsRecording(true);
//             setRecordingTime(0);
//         } catch (error) {
//             console.error('Error starting recording:', error);
//             setError('Could not access microphone. Please check permissions.');
//         }
//     };

//     // Stop voice recording
//     const stopRecording = () => {
//         if (mediaRecorder && isRecording) {
//             mediaRecorder.stop();
//             setIsRecording(false);
//         }
//     };

//     // Format recording time
//     const formatRecordingTime = (seconds: number) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//     };

//     // Format file size
//     const formatFileSize = (bytes: number): string => {
//         if (bytes === 0) return '0 Bytes';

//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));

//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     };

//     // Get file icon based on type
//     const getFileIcon = (file: File) => {
//         const extension = file.name.split('.').pop()?.toLowerCase() || '';

//         if (file.type.startsWith('image/')) {
//             return <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
//         } else if (
//             extension === 'pdf' ||
//             file.type.includes('document') ||
//             ['doc', 'docx', 'txt', 'rtf'].includes(extension)
//         ) {
//             return <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />;
//         } else {
//             return <File className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
//         }
//     };

//     // Remove attachment
//     const removeAttachment = (index: number) => {
//         setAttachments(prev => prev.filter((_, i) => i !== index));
//     };

//     // Send message
//     const sendMessage = async () => {
//         if ((!message.trim() && attachments.length === 0) || isLoading) return;

//         try {
//             await onSendMessage(message, attachments.length > 0 ? attachments : undefined);

//             // Reset input state
//             setMessage('');
//             setAttachments([]);
//             setError(null);

//             // Reset textarea height
//             if (textareaRef.current) {
//                 textareaRef.current.style.height = 'auto';
//             }

//             // Clear file input
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = '';
//             }
//         } catch (err) {
//             console.error("Error sending message:", err);
//             setError("Failed to send message. Please try again.");
//         }
//     };

//     // Add emoji to message
//     const addEmoji = (emoji: string) => {
//         setMessage(prev => prev + emoji);
//         setShowEmojiPicker(false);

//         // Focus textarea after adding emoji
//         if (textareaRef.current) {
//             textareaRef.current.focus();
//         }
//     };

//     return (
//         <div
//             {...getRootProps()}
//             className={`p-3 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${isDragActive ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
//         >
//             <input {...getInputProps()} />

//             {/* Drag overlay */}
//             {isDragActive && (
//                 <div className="absolute inset-0 bg-purple-50 dark:bg-purple-900/20 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg z-10 flex items-center justify-center">
//                     <div className="text-purple-700 dark:text-purple-300 font-medium text-lg">
//                         Drop files to attach
//                     </div>
//                 </div>
//             )}

//             {/* Error message */}
//             {error && (
//                 <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-xs border border-red-200 dark:border-red-800 flex items-center">
//                     <X className="h-4 w-4 mr-1 cursor-pointer" onClick={() => setError(null)} />
//                     {error}
//                 </div>
//             )}

//             {/* Voice recording indicator */}
//             {isRecording && (
//                 <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-between">
//                     <div className="flex items-center">
//                         <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400 animate-pulse mr-2"></div>
//                         <span>Recording: {formatRecordingTime(recordingTime)}</span>
//                     </div>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={stopRecording}
//                         className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
//                     >
//                         <X className="h-4 w-4 mr-1" />
//                         Cancel
//                     </Button>
//                 </div>
//             )}

//             {/* Upload progress */}
//             {isUploading && (
//                 <div className="mb-2 space-y-1">
//                     <div className="flex justify-between text-xs text-indigo-700 dark:text-indigo-300">
//                         <span>Uploading files...</span>
//                         <span>{uploadProgress}%</span>
//                     </div>
//                     <Progress
//                         value={uploadProgress}
//                         className="h-1.5 bg-indigo-100 dark:bg-indigo-900/30"
//                     >
//                         <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
//                     </Progress>
//                 </div>
//             )}

//             {/* Attachments preview */}
//             {attachments.length > 0 && (
//                 <div className="mb-2 flex flex-wrap gap-2">
//                     {attachments.map((file, index) => (
//                         <Badge
//                             key={index}
//                             variant="outline"
//                             className="flex items-center py-1 px-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//                         >
//                             {getFileIcon(file)}
//                             <span className="text-xs truncate max-w-[150px] mx-1.5">
//                                 {file.name} ({formatFileSize(file.size)})
//                             </span>
//                             <button
//                                 className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
//                                 onClick={() => removeAttachment(index)}
//                             >
//                                 <X className="h-3.5 w-3.5" />
//                             </button>
//                         </Badge>
//                     ))}
//                 </div>
//             )}

//             <div className="flex space-x-2">
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     className="hidden"
//                     multiple
//                 />

//                 <div className="flex space-x-1">
//                     <TooltipProvider>
//                         <Tooltip>
//                             <TooltipTrigger asChild>
//                                 <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={handleAttachClick}
//                                     type="button"
//                                     disabled={isLoading || isRecording}
//                                     className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
//                                 >
//                                     <Paperclip className="h-4 w-4" />
//                                 </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                                 <p>Attach files</p>
//                             </TooltipContent>
//                         </Tooltip>
//                     </TooltipProvider>

//                     <TooltipProvider>
//                         <Tooltip>
//                             <TooltipTrigger asChild>
//                                 <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={isRecording ? stopRecording : startRecording}
//                                     type="button"
//                                     disabled={isLoading}
//                                     className={`
//                                         ${isRecording ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400'}
//                                     `}
//                                 >
//                                     {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
//                                 </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                                 <p>{isRecording ? 'Stop recording' : 'Voice message'}</p>
//                             </TooltipContent>
//                         </Tooltip>
//                     </TooltipProvider>

//                     <TooltipProvider>
//                         <Tooltip>
//                             <TooltipTrigger asChild>
//                                 <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
//                                     <PopoverTrigger asChild>
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             type="button"
//                                             disabled={isLoading || isRecording}
//                                             className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
//                                         >
//                                             <Smile className="h-4 w-4" />
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-64 p-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
//                                         <div className="grid grid-cols-7 gap-1">
//                                             {/* Common emojis - simplified for example */}
//                                             {["😀", "😊", "👍", "👆", "👇", "👈", "👉", "👋", "👏", "👌", "👎", "👊", "👀", "💪", "💯", "🔥", "❤️", "😂", "😍", "🙏", "👏"].map(emoji => (
//                                                 <button
//                                                     key={emoji}
//                                                     onClick={() => addEmoji(emoji)}
//                                                     className="text-lg hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
//                                                 >
//                                                     {emoji}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </PopoverContent>
//                                 </Popover>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                                 <p>Add emoji</p>
//                             </TooltipContent>
//                         </Tooltip>
//                     </TooltipProvider>
//                 </div>

//                 <div className="flex-1 relative">
//                     <Textarea
//                         ref={textareaRef}
//                         value={message}
//                         onChange={handleMessageChange}
//                         onKeyDown={handleKeyDown}
//                         placeholder={isRecording ? "Recording voice message..." : "Type your message..."}
//                         className="resize-none py-2 min-h-[40px] max-h-[150px] border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
//                         disabled={isLoading || isRecording}
//                     />
//                 </div>

//                 <TooltipProvider>
//                     <Tooltip>
//                         <TooltipTrigger asChild>
//                             <Button
//                                 onClick={sendMessage}
//                                 disabled={isLoading || (!message.trim() && attachments.length === 0)}
//                                 type="button"
//                                 className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white"
//                             >
//                                 {isLoading ? (
//                                     <Loader2 className="h-4 w-4 animate-spin" />
//                                 ) : (
//                                     <Send className="h-4 w-4" />
//                                 )}
//                             </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                             <p>Send message</p>
//                         </TooltipContent>
//                     </Tooltip>
//                 </TooltipProvider>
//             </div>
//         </div>
//     );
// }



