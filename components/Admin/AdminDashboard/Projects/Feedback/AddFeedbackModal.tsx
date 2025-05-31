import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Star,
    AlertCircle,
    Plus,
    FileText,
    Link as LinkIcon,
    Image,
    X,
    Send,
    Eye,
    EyeOff,
    Target,
    BookOpen,
    User,
    Award
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAddProjectFeedbackMutation } from '@/Redux/apiSlices/Projects/projectsApiSlice';

interface AddFeedbackModalProps {
    projectId: string;
    projectName?: string;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    targetType?: 'project' | 'task' | 'update' | 'area';
    targetId?: string;
    targetName?: string;
}

interface FeedbackFormData {
    content: string;
    type: 'general' | 'guidance' | 'review' | 'approval' | 'rejection';
    rating?: number;
    isPrivate: boolean;
    targetType?: 'project' | 'task' | 'update' | 'area';
    targetId?: string;
    attachments: Array<{
        id: string;
        name: string;
        type: 'link' | 'file' | 'image';
        url: string;
        description?: string;
    }>;
}

const feedbackTypes = [
    {
        value: 'general',
        label: 'General Feedback',
        description: 'General comments and observations',
        icon: <MessageSquare className="h-4 w-4" />,
        color: 'bg-slate-50 text-slate-700 border-slate-200'
    },
    {
        value: 'guidance',
        label: 'Guidance & Direction',
        description: 'Helpful guidance and direction',
        icon: <Target className="h-4 w-4" />,
        color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
        value: 'review',
        label: 'Code/Work Review',
        description: 'Review of work or code quality',
        icon: <BookOpen className="h-4 w-4" />,
        color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
        value: 'approval',
        label: 'Approval',
        description: 'Approval and positive feedback',
        icon: <Award className="h-4 w-4" />,
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
        value: 'rejection',
        label: 'Needs Improvement',
        description: 'Areas that need improvement',
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-red-50 text-red-700 border-red-200'
    }
];

const attachmentTypes = [
    { value: 'link', label: 'Link/URL', icon: LinkIcon },
    { value: 'file', label: 'File', icon: FileText },
    { value: 'image', label: 'Image', icon: Image }
];

export default function AddFeedbackModal({
    projectId,
    projectName,
    open,
    onClose,
    onSuccess,
    targetType = 'project',
    targetId,
    targetName
}: AddFeedbackModalProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState<FeedbackFormData>({
        content: '',
        type: 'general',
        rating: undefined,
        isPrivate: false,
        targetType,
        targetId,
        attachments: []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [newAttachment, setNewAttachment] = useState({
        name: '',
        type: 'link' as 'link' | 'file' | 'image',
        url: '',
        description: ''
    });

    const [addFeedback, { isLoading }] = useAddProjectFeedbackMutation();

    const resetForm = () => {
        setFormData({
            content: '',
            type: 'general',
            rating: undefined,
            isPrivate: false,
            targetType,
            targetId,
            attachments: []
        });
        setErrors({});
        setNewAttachment({
            name: '',
            type: 'link',
            url: '',
            description: ''
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.content.trim()) {
            newErrors.content = 'Feedback content is required';
        }

        if (formData.content.trim().length < 10) {
            newErrors.content = 'Feedback must be at least 10 characters long';
        }

        if (formData.rating !== undefined && (formData.rating < 1 || formData.rating > 5)) {
            newErrors.rating = 'Rating must be between 1 and 5';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FeedbackFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const addAttachment = () => {
        if (!newAttachment.name.trim()) {
            toast({
                title: "Validation Error",
                description: "Attachment name is required",
                variant: "destructive",
            });
            return;
        }

        if (newAttachment.type === 'link' && !newAttachment.url.trim()) {
            toast({
                title: "Validation Error",
                description: "URL is required for link attachments",
                variant: "destructive",
            });
            return;
        }

        const attachment = {
            id: `attachment_${Date.now()}`,
            name: newAttachment.name.trim(),
            type: newAttachment.type,
            url: newAttachment.url.trim(),
            description: newAttachment.description.trim() || undefined
        };

        handleInputChange('attachments', [...formData.attachments, attachment]);
        setNewAttachment({
            name: '',
            type: 'link',
            url: '',
            description: ''
        });
    };

    const removeAttachment = (attachmentId: string) => {
        handleInputChange('attachments', formData.attachments.filter(a => a.id !== attachmentId));
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const feedbackData = {
                content: formData.content.trim(),
                type: formData.type,
                rating: formData.rating,
                isPrivate: formData.isPrivate,
                targetType: formData.targetType,
                targetId: formData.targetId,
                attachments: formData.attachments.length > 0 ? formData.attachments : undefined
            };

            await addFeedback({ projectId, ...feedbackData }).unwrap();

            toast({
                title: "Feedback Added Successfully",
                description: `Your ${formData.type} feedback has been submitted.`,
            });

            handleClose();
            onSuccess?.();
        } catch (error: any) {
            console.error('Error adding feedback:', error);
            toast({
                title: "Failed to Add Feedback",
                description: error?.data?.message || "An error occurred while adding feedback.",
                variant: "destructive",
            });
        }
    };

    const selectedType = feedbackTypes.find(t => t.value === formData.type);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        Add Project Feedback
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Provide feedback for {targetName || projectName || 'this project'}.
                        Your input helps improve the project and guide participants.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Feedback Type Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Feedback Type <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {feedbackTypes.map((type) => (
                                <motion.div
                                    key={type.value}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={cn(
                                            "cursor-pointer transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg",
                                            formData.type === type.value
                                                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                                : "border-slate-200 dark:border-slate-700 hover:border-orange-300"
                                        )}
                                        onClick={() => handleInputChange('type', type.value)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg border",
                                                    type.color,
                                                    formData.type === type.value && "bg-orange-100 text-orange-700 border-orange-200"
                                                )}>
                                                    {type.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm text-slate-900 dark:text-white">
                                                        {type.label}
                                                    </h4>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                        {type.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Feedback Content <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            placeholder="Provide detailed feedback, suggestions, or observations..."
                            className={cn(
                                "min-h-32 resize-none",
                                errors.content && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                        />
                        {errors.content && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.content}
                            </p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formData.content.length}/1000 characters
                        </p>
                    </div>

                    {/* Rating (optional) */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Rating (Optional)
                        </Label>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => handleInputChange('rating',
                                            formData.rating === rating ? undefined : rating
                                        )}
                                        className="p-1 hover:scale-110 transition-transform"
                                    >
                                        <Star
                                            className={cn(
                                                "h-6 w-6",
                                                formData.rating && rating <= formData.rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-slate-300 dark:text-slate-600 hover:text-yellow-300'
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            {formData.rating && (
                                <Badge variant="outline" className="ml-2">
                                    {formData.rating}/5
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Attachments (Optional)
                        </Label>

                        {/* Add Attachment Form */}
                        <Card className="bg-slate-50 dark:bg-slate-800/50">
                            <CardContent className="p-4 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs text-slate-600 dark:text-slate-400">Name</Label>
                                        <Input
                                            value={newAttachment.name}
                                            onChange={(e) => setNewAttachment(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Attachment name"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-600 dark:text-slate-400">Type</Label>
                                        <Select
                                            value={newAttachment.type}
                                            onValueChange={(value: 'link' | 'file' | 'image') =>
                                                setNewAttachment(prev => ({ ...prev, type: value }))
                                            }
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {attachmentTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <div className="flex items-center gap-2">
                                                            <type.icon className="h-4 w-4" />
                                                            {type.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {newAttachment.type === 'link' && (
                                    <div>
                                        <Label className="text-xs text-slate-600 dark:text-slate-400">URL</Label>
                                        <Input
                                            value={newAttachment.url}
                                            onChange={(e) => setNewAttachment(prev => ({ ...prev, url: e.target.value }))}
                                            placeholder="https://example.com"
                                            className="mt-1"
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label className="text-xs text-slate-600 dark:text-slate-400">Description</Label>
                                    <Input
                                        value={newAttachment.description}
                                        onChange={(e) => setNewAttachment(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Brief description (optional)"
                                        className="mt-1"
                                    />
                                </div>

                                <Button
                                    type="button"
                                    onClick={addAttachment}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Attachment
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Attachments List */}
                        {formData.attachments.length > 0 && (
                            <div className="space-y-2">
                                {formData.attachments.map((attachment) => {
                                    const AttachmentIcon = attachmentTypes.find(t => t.value === attachment.type)?.icon || FileText;
                                    return (
                                        <div
                                            key={attachment.id}
                                            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                                        >
                                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                <AttachmentIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                                                    {attachment.name}
                                                </p>
                                                {attachment.url && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                        {attachment.url}
                                                    </p>
                                                )}
                                                {attachment.description && (
                                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                                        {attachment.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeAttachment(attachment.id)}
                                                className="h-8 w-8 text-slate-500 hover:text-red-500"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Privacy Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            {formData.isPrivate ? (
                                <EyeOff className="h-5 w-5 text-amber-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-slate-600" />
                            )}
                            <div>
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Private Feedback
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Only visible to project admins and mentors
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={formData.isPrivate}
                            onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                    >
                        {isLoading ? (
                            <>
                                <motion.div
                                    className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Submit Feedback
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}