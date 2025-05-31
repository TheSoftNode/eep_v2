import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Target,
    Send,
    Plus,
    Minus,
    ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllMentorsQuery, useRequestSessionMutation } from '@/Redux/apiSlices/users/mentorApi';
import { SessionRequest } from '@/Redux/types/Users/mentor';

interface SessionRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentorId?: string;
    mentorName?: string;
    onSuccess?: () => void;
}

const SessionRequestModal: React.FC<SessionRequestModalProps> = ({
    isOpen,
    onClose,
    mentorId,
    mentorName,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        mentorId: mentorId || '',
        topic: '',
        description: '',
        date: '',
        timeSlot: '',
        duration: 60,
        link: ''
    });
    const [objectives, setObjectives] = useState<string[]>(['']);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [requestSession, { isLoading, error }] = useRequestSessionMutation();

    // ADD THIS:
    const { data: mentorsData, isLoading: mentorsLoading } = useGetAllMentorsQuery({
        page: '1',
        limit: '100' // Get enough mentors for the dropdown
    });

    const availableMentors = mentorsData?.data || [];

    const addObjective = () => {
        setObjectives([...objectives, '']);
    };

    const removeObjective = (index: number) => {
        const newObjectives = objectives.filter((_, i) => i !== index);
        setObjectives(newObjectives.length === 0 ? [''] : newObjectives);
    };

    const updateObjective = (index: number, value: string) => {
        const newObjectives = [...objectives];
        newObjectives[index] = value;
        setObjectives(newObjectives);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.mentorId) newErrors.mentorId = 'Please select a mentor';
        if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required';
        if (!formData.link.trim()) newErrors.link = 'Session link is required';
        if (formData.duration < 15 || formData.duration > 180) {
            newErrors.duration = 'Duration must be between 15 and 180 minutes';
        }

        // Check if date is in the future
        if (formData.date) {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.date = 'Please select a future date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const sessionRequest: SessionRequest = {
                mentorId: formData.mentorId,
                topic: formData.topic.trim(),
                description: formData.description.trim(),
                date: formData.date,
                timeSlot: formData.timeSlot,
                duration: formData.duration,
                objectives: objectives.filter(obj => obj.trim() !== ''),
                link: formData.link.trim()
            };

            await requestSession(sessionRequest).unwrap();

            if (onSuccess) onSuccess();
            onClose();

            // Reset form
            setFormData({
                mentorId: mentorId || '',
                topic: '',
                description: '',
                date: '',
                timeSlot: '',
                duration: 60,
                link: ''
            });
            setObjectives(['']);
            setErrors({});
        } catch (err) {
            console.error('Failed to request session:', err);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const timeSlots = [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '12:00 PM - 01:00 PM',
        '01:00 PM - 02:00 PM',
        '02:00 PM - 03:00 PM',
        '03:00 PM - 04:00 PM',
        '04:00 PM - 05:00 PM',
        '05:00 PM - 06:00 PM',
        '06:00 PM - 07:00 PM',
        '07:00 PM - 08:00 PM',
        '08:00 PM - 09:00 PM'
    ];

    const getErrorMessage = () => {
        if (error && 'data' in error) {
            return (error.data as any)?.message || 'Failed to request session';
        }
        return 'Failed to request session. Please try again.';
    };

    if (!isOpen) return null;

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
                        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        Request Mentoring Session
                                    </CardTitle>
                                    {mentorName && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            With {mentorName}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Display */}
                                {error && (
                                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                                        <p className="text-red-800 dark:text-red-200 text-sm">
                                            {getErrorMessage()}
                                        </p>
                                    </div>
                                )}

                                {/* Mentor Selection (if not pre-selected) */}
                                {!mentorId && (
                                    <div>
                                        <Label htmlFor="mentor" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Select Mentor <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.mentorId}
                                            onValueChange={(value) => handleInputChange('mentorId', value)}
                                        >
                                            <SelectTrigger className="mt-1 bg-white dark:bg-slate-800">
                                                <SelectValue placeholder="Choose a mentor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mentorsLoading ? (
                                                    <SelectItem value="loading" disabled>Loading mentors...</SelectItem>
                                                ) : availableMentors.length > 0 ? (
                                                    availableMentors.map((mentor) => (
                                                        <SelectItem key={mentor.id} value={mentor.id}>
                                                            {mentor.fullName}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-mentors" disabled>No mentors available</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.mentorId && (
                                            <p className="text-red-600 text-xs mt-1">{errors.mentorId}</p>
                                        )}
                                    </div>
                                )}

                                {/* Topic */}
                                <div>
                                    <Label htmlFor="topic" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Session Topic <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="topic"
                                        value={formData.topic}
                                        onChange={(e) => handleInputChange('topic', e.target.value)}
                                        placeholder="e.g., JavaScript Best Practices, React Hooks Deep Dive"
                                        className="mt-1 bg-white dark:bg-slate-800"
                                        disabled={isLoading}
                                    />
                                    {errors.topic && (
                                        <p className="text-red-600 text-xs mt-1">{errors.topic}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Describe what you'd like to learn and any specific questions you have..."
                                        rows={4}
                                        className="mt-1 bg-white dark:bg-slate-800"
                                        disabled={isLoading}
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-xs mt-1">{errors.description}</p>
                                    )}
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Preferred Date <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleInputChange('date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="mt-1 bg-white dark:bg-slate-800"
                                            disabled={isLoading}
                                        />
                                        {errors.date && (
                                            <p className="text-red-600 text-xs mt-1">{errors.date}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="timeSlot" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Preferred Time <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.timeSlot}
                                            onValueChange={(value) => handleInputChange('timeSlot', value)}
                                        >
                                            <SelectTrigger className="mt-1 bg-white dark:bg-slate-800">
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map((slot) => (
                                                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.timeSlot && (
                                            <p className="text-red-600 text-xs mt-1">{errors.timeSlot}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <Label htmlFor="duration" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Duration (minutes) <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.duration.toString()}
                                        onValueChange={(value) => handleInputChange('duration', parseInt(value))}
                                    >
                                        <SelectTrigger className="mt-1 bg-white dark:bg-slate-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="45">45 minutes</SelectItem>
                                            <SelectItem value="60">60 minutes</SelectItem>
                                            <SelectItem value="90">90 minutes</SelectItem>
                                            <SelectItem value="120">120 minutes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.duration && (
                                        <p className="text-red-600 text-xs mt-1">{errors.duration}</p>
                                    )}
                                </div>

                                {/* Session Link */}
                                <div>
                                    <Label htmlFor="link" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Session Link <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="link"
                                            value={formData.link}
                                            onChange={(e) => handleInputChange('link', e.target.value)}
                                            placeholder="https://meet.google.com/... or https://zoom.us/..."
                                            className="bg-white dark:bg-slate-800 pr-10"
                                            disabled={isLoading}
                                        />
                                        <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    </div>
                                    {errors.link && (
                                        <p className="text-red-600 text-xs mt-1">{errors.link}</p>
                                    )}
                                </div>

                                {/* Learning Objectives */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                                        <Target className="h-4 w-4 mr-2" />
                                        Learning Objectives (Optional)
                                    </Label>
                                    <div className="space-y-2">
                                        {objectives.map((objective, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Input
                                                    value={objective}
                                                    onChange={(e) => updateObjective(index, e.target.value)}
                                                    placeholder={`Objective ${index + 1}`}
                                                    className="bg-white dark:bg-slate-800"
                                                    disabled={isLoading}
                                                />
                                                {objectives.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeObjective(index)}
                                                        disabled={isLoading}
                                                        className="p-2"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {index === objectives.length - 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={addObjective}
                                                        disabled={isLoading}
                                                        className="p-2"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Requesting...
                                            </div>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Request Session
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SessionRequestModal;