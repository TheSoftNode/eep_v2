import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    GraduationCap,
    Star,
    Globe,
    Clock,
    Plus,
    X,
    Users,
    Award,
    CheckCircle2,
    ToggleLeft,
    ToggleRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MentorInformationSectionProps {
    formData: {
        expertise: string[];
        skills: string[];
        languages: string[];
        experience: number;
        timezone: string;
        isAvailable: boolean;
    };
    errors: Record<string, string>;
    onExpertiseChange: (expertise: string[]) => void;
    onSkillsChange: (skills: string[]) => void;
    onLanguagesChange: (languages: string[]) => void;
    onExperienceChange: (experience: number) => void;
    onTimezoneChange: (timezone: string) => void;
    onAvailabilityChange: (isAvailable: boolean) => void;
}

// Common expertise areas for suggestions
const COMMON_EXPERTISE = [
    "JavaScript", "React", "Node.js", "Python", "Java", "TypeScript", "AWS",
    "DevOps", "Machine Learning", "Data Science", "UI/UX Design", "Product Management",
    "Mobile Development", "Backend Development", "Frontend Development", "Full Stack",
    "Cybersecurity", "Cloud Computing", "Blockchain", "AI/ML", "Database Design"
];

// Common skills for suggestions
const COMMON_SKILLS = [
    "Leadership", "Mentoring", "Code Review", "System Design", "Problem Solving",
    "Communication", "Project Management", "Agile", "Scrum", "Git", "Docker",
    "Kubernetes", "Testing", "API Design", "Database Management", "Performance Optimization"
];

// Common languages
const COMMON_LANGUAGES = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese", "Portuguese",
    "Russian", "Arabic", "Hindi", "Italian", "Korean", "Dutch", "Swedish"
];

// Timezone options
const TIMEZONES = [
    { value: "UTC-12:00", label: "(UTC-12:00) International Date Line West" },
    { value: "UTC-11:00", label: "(UTC-11:00) Coordinated Universal Time-11" },
    { value: "UTC-10:00", label: "(UTC-10:00) Hawaii" },
    { value: "UTC-09:00", label: "(UTC-09:00) Alaska" },
    { value: "UTC-08:00", label: "(UTC-08:00) Pacific Time (US & Canada)" },
    { value: "UTC-07:00", label: "(UTC-07:00) Mountain Time (US & Canada)" },
    { value: "UTC-06:00", label: "(UTC-06:00) Central Time (US & Canada)" },
    { value: "UTC-05:00", label: "(UTC-05:00) Eastern Time (US & Canada)" },
    { value: "UTC-04:00", label: "(UTC-04:00) Atlantic Time (Canada)" },
    { value: "UTC-03:00", label: "(UTC-03:00) Buenos Aires, Georgetown" },
    { value: "UTC-02:00", label: "(UTC-02:00) Coordinated Universal Time-02" },
    { value: "UTC-01:00", label: "(UTC-01:00) Azores" },
    { value: "UTC+00:00", label: "(UTC+00:00) London, Dublin, Edinburgh" },
    { value: "UTC+01:00", label: "(UTC+01:00) Berlin, Madrid, Paris" },
    { value: "UTC+02:00", label: "(UTC+02:00) Cairo, Helsinki, Athens" },
    { value: "UTC+03:00", label: "(UTC+03:00) Moscow, St. Petersburg" },
    { value: "UTC+04:00", label: "(UTC+04:00) Abu Dhabi, Muscat" },
    { value: "UTC+05:00", label: "(UTC+05:00) Islamabad, Karachi" },
    { value: "UTC+05:30", label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi" },
    { value: "UTC+06:00", label: "(UTC+06:00) Almaty, Novosibirsk" },
    { value: "UTC+07:00", label: "(UTC+07:00) Bangkok, Hanoi, Jakarta" },
    { value: "UTC+08:00", label: "(UTC+08:00) Beijing, Perth, Singapore" },
    { value: "UTC+09:00", label: "(UTC+09:00) Tokyo, Seoul, Osaka" },
    { value: "UTC+10:00", label: "(UTC+10:00) Eastern Australia" },
    { value: "UTC+11:00", label: "(UTC+11:00) Magadan, Solomon Is." },
    { value: "UTC+12:00", label: "(UTC+12:00) Auckland, Wellington" }
];

const TagInput: React.FC<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required?: boolean;
    placeholder: string;
    values: string[];
    onChange: (values: string[]) => void;
    error?: string;
    suggestions?: string[];
    description?: string;
}> = ({
    label,
    icon: Icon,
    required = false,
    placeholder,
    values,
    onChange,
    error,
    suggestions = [],
    description
}) => {
        const [inputValue, setInputValue] = useState("");
        const [showSuggestions, setShowSuggestions] = useState(false);

        const addValue = (value: string) => {
            const trimmedValue = value.trim();
            if (trimmedValue && !values.includes(trimmedValue)) {
                onChange([...values, trimmedValue]);
            }
            setInputValue("");
            setShowSuggestions(false);
        };

        const removeValue = (index: number) => {
            onChange(values.filter((_, i) => i !== index));
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addValue(inputValue);
            }
        };

        const filteredSuggestions = suggestions.filter(
            suggestion =>
                suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
                !values.includes(suggestion)
        );

        return (
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
                {description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                )}

                {/* Tags Display */}
                {values.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        {values.map((value, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                            >
                                {value}
                                <button
                                    type="button"
                                    onClick={() => removeValue(index)}
                                    className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={placeholder}
                        className={cn(
                            "pl-10 transition-colors",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                    />
                    {inputValue && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => addValue(inputValue)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2"
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                {/* Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-lg max-h-32 overflow-y-auto">
                        {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => addValue(suggestion)}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    };

export const MentorInformationSection: React.FC<MentorInformationSectionProps> = ({
    formData,
    errors,
    onExpertiseChange,
    onSkillsChange,
    onLanguagesChange,
    onExperienceChange,
    onTimezoneChange,
    onAvailabilityChange
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                            <GraduationCap className="h-4 w-4" />
                        </div>
                        Mentor Information
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Mentor-specific details required for mentorship capabilities
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Expertise Areas - Required */}
                    <TagInput
                        label="Areas of Expertise"
                        icon={Star}
                        required
                        placeholder="Add area of expertise (e.g., JavaScript, React, Python)"
                        values={formData.expertise}
                        onChange={onExpertiseChange}
                        error={errors.expertise}
                        suggestions={COMMON_EXPERTISE}
                        description="Primary areas where you can mentor others (required)"
                    />

                    {/* Skills - Optional */}
                    <TagInput
                        label="Technical Skills"
                        icon={Award}
                        placeholder="Add technical skill (e.g., Leadership, System Design)"
                        values={formData.skills}
                        onChange={onSkillsChange}
                        error={errors.skills}
                        suggestions={COMMON_SKILLS}
                        description="Additional skills and competencies"
                    />

                    {/* Experience and Languages Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Years of Experience */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Years of Experience
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Total years of professional experience
                            </p>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={formData.experience}
                                    onChange={(e) => onExperienceChange(Number(e.target.value))}
                                    placeholder="5"
                                    className={cn(
                                        "pl-10 transition-colors",
                                        errors.experience && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    )}
                                />
                            </div>
                            {errors.experience && (
                                <p className="text-sm text-red-500">{errors.experience}</p>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="space-y-2">
                            <TagInput
                                label="Languages"
                                icon={Globe}
                                placeholder="Add language (e.g., English, Spanish)"
                                values={formData.languages}
                                onChange={onLanguagesChange}
                                error={errors.languages}
                                suggestions={COMMON_LANGUAGES}
                                description="Languages you can mentor in"
                            />
                        </div>
                    </div>

                    {/* Timezone and Availability Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Timezone */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Timezone
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Your primary timezone for scheduling
                            </p>
                            <Select value={formData.timezone} onValueChange={onTimezoneChange}>
                                <SelectTrigger className="h-11">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        <SelectValue placeholder="Select timezone" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {TIMEZONES.map((tz) => (
                                        <SelectItem key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Availability Status */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Availability Status
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Whether mentor is currently accepting new mentees
                            </p>
                            <div className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => onAvailabilityChange(!formData.isAvailable)}
                                    className="flex items-center gap-2"
                                >
                                    {formData.isAvailable ? (
                                        <ToggleRight className="h-6 w-6 text-emerald-600" />
                                    ) : (
                                        <ToggleLeft className="h-6 w-6 text-slate-400" />
                                    )}
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${formData.isAvailable
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-slate-600 dark:text-slate-400'
                                            }`}>
                                            {formData.isAvailable ? 'Available' : 'Not Available'}
                                        </span>
                                        {formData.isAvailable && (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {formData.isAvailable
                                            ? 'Accepting new mentorship requests'
                                            : 'Not accepting new mentees currently'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mentor Profile Preview */}
                    {formData.expertise.length > 0 && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <h4 className="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Mentor Profile Summary
                            </h4>
                            <div className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                                <div>
                                    <span className="font-medium">Expertise:</span> {formData.expertise.join(', ')}
                                </div>
                                {formData.skills.length > 0 && (
                                    <div>
                                        <span className="font-medium">Skills:</span> {formData.skills.join(', ')}
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium">Experience:</span> {formData.experience} years
                                </div>
                                <div>
                                    <span className="font-medium">Languages:</span> {formData.languages.join(', ')}
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span> {formData.isAvailable ? 'Available for mentoring' : 'Not available'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mentor Guidelines */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                            💡 Mentor Guidelines
                        </h4>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <li>• Areas of expertise are required and help match with mentees</li>
                            <li>• Skills showcase additional competencies beyond core expertise</li>
                            <li>• Experience level helps set appropriate expectations</li>
                            <li>• Language preferences enable global mentorship opportunities</li>
                            <li>• Availability status controls visibility to potential mentees</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};