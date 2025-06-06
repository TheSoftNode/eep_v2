import React from "react";
import { motion } from "framer-motion";
import { Video, User, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetAllMentorsQuery } from "@/Redux/apiSlices/users/mentorApi";

interface SessionBasicInformationSectionProps {
    formData: {
        mentorId: string;
        topic: string;
        description: string;
        sessionType: 'individual' | 'group';
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (name: string, value: string | number | boolean) => void;
}


// Add this component before the main component
const MentorSelector: React.FC<{
    value: string;
    onChange: (value: string) => void;
    error?: string;
}> = ({ value, onChange, error }) => {
    const { data: mentorsData, isLoading, error: fetchError } = useGetAllMentorsQuery({
        page: 1,
        limit: 100 // Get enough mentors
    });

    const mentors = mentorsData?.data || [];

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={cn(
                "h-11",
                error && "border-red-500"
            )}>
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <SelectValue placeholder={
                        isLoading ? "Loading mentors..." :
                            fetchError ? "Error loading mentors" :
                                "Select a mentor or leave empty for auto-assignment"
                    } />
                </div>
            </SelectTrigger>
            <SelectContent className="max-h-60">
                <SelectItem value="auto-assign">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <User className="h-3 w-3 text-slate-500" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-400">Auto-assign mentor</span>
                    </div>
                </SelectItem>

                {isLoading && (
                    <SelectItem value="loading" disabled>
                        Loading mentors...
                    </SelectItem>
                )}

                {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                    {mentor.fullName.charAt(0)}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">{mentor.fullName}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {mentor.expertise?.slice(0, 2).join(', ')}
                                    {mentor.expertise?.length > 2 && '...'}
                                </span>
                            </div>
                        </div>
                    </SelectItem>
                ))}

                {!isLoading && mentors.length === 0 && (
                    <SelectItem value="no-mentors" disabled>
                        No mentors available
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
};

const InputField: React.FC<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required?: boolean;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    description?: string;
}> = ({
    id,
    label,
    icon: Icon,
    required = false,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    description
}) => (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
            )}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={cn(
                        "pl-10 transition-colors",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                />
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );

const getSessionTypeColor = (type: string) => {
    switch (type) {
        case 'individual':
            return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'group':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getSessionTypeDescription = (type: string) => {
    switch (type) {
        case 'individual':
            return 'One-on-one mentoring session with focused attention';
        case 'group':
            return 'Collaborative learning session with multiple participants';
        default:
            return 'Select a session type';
    }
};

export const SessionBasicInformationSection: React.FC<SessionBasicInformationSectionProps> = ({
    formData,
    errors,
    onInputChange,
    onSelectChange
}) => {
    const descriptionWordCount = formData.description.trim().split(/\s+/).filter(word => word).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                            <Video className="h-4 w-4" />
                        </div>
                        Basic Information
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Essential details about your mentoring session
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Session Topic */}
                        <InputField
                            id="topic"
                            label="Session Topic"
                            icon={BookOpen}
                            required
                            placeholder="e.g., React Fundamentals, Career Guidance"
                            value={formData.topic}
                            onChange={onInputChange}
                            error={errors.topic}
                            description="Clear, descriptive title for your session"
                        />

                        {/* Session Type */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Session Type <span className="text-red-500">*</span>
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Choose between individual or group mentoring
                            </p>
                            <Select
                                value={formData.sessionType}
                                onValueChange={(value) => onSelectChange('sessionType', value)}
                            >
                                <SelectTrigger className="h-11">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        <SelectValue placeholder="Select session type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="individual">
                                        <div className="flex items-center justify-between w-full">
                                            <span>Individual Session</span>
                                            <Badge variant="outline" className="ml-2 text-xs">
                                                1-on-1
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="group">
                                        <div className="flex items-center justify-between w-full">
                                            <span>Group Session</span>
                                            <Badge variant="outline" className="ml-2 text-xs">
                                                Multi-user
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Session Type Information */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <Badge className={cn("text-xs font-medium border", getSessionTypeColor(formData.sessionType))}>
                                    {formData.sessionType.charAt(0).toUpperCase() + formData.sessionType.slice(1)}
                                </Badge>
                                <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                                    {getSessionTypeDescription(formData.sessionType)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mentor Assignment */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Assign Mentor (Optional)
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Select a mentor from the list or leave empty for auto-assignment
                        </p>

                        <MentorSelector
                            value={formData.mentorId}
                            onChange={(value) => onSelectChange('mentorId', value)}
                            error={errors.mentorId}
                        />

                        {errors.mentorId && (
                            <p className="text-sm text-red-500">{errors.mentorId}</p>
                        )}
                    </div>

                    {/* Session Description */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Session Description <span className="text-red-500">*</span>
                            </Label>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {formData.description.length}/500 characters
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Detailed description of what participants will learn
                        </p>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <BookOpen className="h-4 w-4 text-slate-400" />
                            </div>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={onInputChange}
                                placeholder="Describe what participants will learn, the format of the session, and any prerequisites..."
                                rows={4}
                                maxLength={500}
                                className={cn(
                                    "pl-10 resize-none transition-colors",
                                    errors.description && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                        </div>
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                        {descriptionWordCount > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {descriptionWordCount} words
                            </p>
                        )}
                    </div>

                    {/* Session Preview */}
                    {formData.topic.trim() && formData.description.trim() && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                                Session Preview
                            </h4>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Topic:</span>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200">{formData.topic}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Type:</span>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200 capitalize">{formData.sessionType} Session</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Description:</span>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">{formData.description}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Writing Tips */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                            💡 Session Creation Tips
                        </h4>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <li>• Use clear, specific topics that attract the right audience</li>
                            <li>• Provide detailed descriptions to set proper expectations</li>
                            <li>• Individual sessions work best for personalized guidance</li>
                            <li>• Group sessions are ideal for collaborative learning</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};