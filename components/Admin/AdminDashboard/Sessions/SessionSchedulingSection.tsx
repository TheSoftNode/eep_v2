import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SessionSchedulingSectionProps {
    formData: {
        date: string;
        timeSlot: string;
        duration: number;
        link: string;
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (name: string, value: string | number | boolean) => void;
}

// Generate time slots for the day
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const startTime = new Date();
            startTime.setHours(hour, minute, 0, 0);

            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + 30);

            const formatTime = (date: Date) => {
                return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
            };

            const timeSlot = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            slots.push({
                value: timeSlot,
                label: timeSlot
            });
        }
    }
    return slots;
};

// Duration options in minutes
const DURATION_OPTIONS = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 300, label: '5 hours' },
    { value: 360, label: '6 hours' },
    { value: 420, label: '7 hours' },
    { value: 480, label: '8 hours' }
];

const TIME_SLOTS = generateTimeSlots();

const formatDuration = (minutes: number) => {
    if (minutes < 60) {
        return `${minutes} minutes`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            return `${hours}h ${remainingMinutes}m`;
        }
    }
};

const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow as minimum
    return today.toISOString().split('T')[0];
};

export const SessionSchedulingSection: React.FC<SessionSchedulingSectionProps> = ({
    formData,
    errors,
    onInputChange,
    onSelectChange
}) => {
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const formatSelectedDate = (date: string) => {
        if (!date) return '';
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                            <Calendar className="h-4 w-4" />
                        </div>
                        Scheduling & Access
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Set the date, time, and meeting details for your session
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Date and Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Session Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Session Date <span className="text-red-500">*</span>
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Choose a date at least 24 hours in advance
                            </p>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    min={getMinDate()}
                                    value={formData.date}
                                    onChange={onInputChange}
                                    className={cn(
                                        "pl-10 transition-colors",
                                        errors.date && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    )}
                                />
                            </div>
                            {errors.date && (
                                <p className="text-sm text-red-500">{errors.date}</p>
                            )}
                            {formData.date && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                    📅 {formatSelectedDate(formData.date)}
                                </p>
                            )}
                        </div>

                        {/* Time Slot */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Time Slot <span className="text-red-500">*</span>
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Select the start time for your session
                            </p>
                            <Select
                                value={formData.timeSlot}
                                onValueChange={(value) => onSelectChange('timeSlot', value)}
                            >
                                <SelectTrigger className="h-11">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        <SelectValue placeholder="Select time slot" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {TIME_SLOTS.map((slot) => (
                                        <SelectItem key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.timeSlot && (
                                <p className="text-sm text-red-500">{errors.timeSlot}</p>
                            )}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Session Duration <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            How long will your session last?
                        </p>
                        <Select
                            value={formData.duration.toString()}
                            onValueChange={(value) => onSelectChange('duration', parseInt(value))}
                        >
                            <SelectTrigger className="h-11">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <SelectValue placeholder="Select duration" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {DURATION_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value.toString()}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.duration && (
                            <p className="text-sm text-red-500">{errors.duration}</p>
                        )}
                        {formData.duration > 0 && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                ⏱️ {formatDuration(formData.duration)}
                            </p>
                        )}
                    </div>

                    {/* Meeting Link */}
                    <div className="space-y-2">
                        <Label htmlFor="link" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Meeting Link <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Provide the video call link (Zoom, Google Meet, Teams, etc.)
                        </p>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Link className="h-4 w-4 text-slate-400" />
                            </div>
                            <Input
                                id="link"
                                name="link"
                                type="url"
                                placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                                value={formData.link}
                                onChange={onInputChange}
                                className={cn(
                                    "pl-10 transition-colors",
                                    errors.link && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                        </div>
                        {errors.link && (
                            <p className="text-sm text-red-500">{errors.link}</p>
                        )}
                        {formData.link && isValidUrl(formData.link) && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                ✅ Valid meeting link provided
                            </p>
                        )}
                    </div>

                    {/* Scheduling Summary */}
                    {formData.date && formData.timeSlot && formData.duration > 0 && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <h4 className="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Session Schedule Summary
                            </h4>
                            <div className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                                <div className="flex justify-between">
                                    <span className="font-medium">Date:</span>
                                    <span>{formatSelectedDate(formData.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Time:</span>
                                    <span>{formData.timeSlot}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Duration:</span>
                                    <span>{formatDuration(formData.duration)}</span>
                                </div>
                                {formData.link && isValidUrl(formData.link) && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Meeting:</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">Link provided</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Platform Guidelines */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                            📋 Meeting Platform Guidelines
                        </h4>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <li>• Ensure your meeting link is accessible to all participants</li>
                            <li>• Test your meeting link before the session starts</li>
                            <li>• Include waiting room or password if required for security</li>
                            <li>• Consider time zones when scheduling for international participants</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};