import React, { useState } from "react";
import { Star, Clock, Globe, Plus, X } from "lucide-react";
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

interface CondensedMentorSectionProps {
    formData: {
        expertise: string[];
        experience: number;
        languages: string[];
        timezone: string;
    };
    errors: Record<string, string>;
    onExpertiseChange: (expertise: string[]) => void;
    onExperienceChange: (experience: number) => void;
    onLanguagesChange: (languages: string[]) => void;
    onTimezoneChange: (timezone: string) => void;
}

// Common expertise areas for quick selection
const QUICK_EXPERTISE = [
    "JavaScript", "React", "Node.js", "Python", "Java", "TypeScript",
    "AWS", "DevOps", "Machine Learning", "UI/UX Design", "Mobile Development"
];

// Essential timezones for modal
const ESSENTIAL_TIMEZONES = [
    { value: "UTC-08:00", label: "Pacific Time (UTC-8)" },
    { value: "UTC-07:00", label: "Mountain Time (UTC-7)" },
    { value: "UTC-06:00", label: "Central Time (UTC-6)" },
    { value: "UTC-05:00", label: "Eastern Time (UTC-5)" },
    { value: "UTC+00:00", label: "London, GMT (UTC+0)" },
    { value: "UTC+01:00", label: "Berlin, Paris (UTC+1)" },
    { value: "UTC+05:30", label: "India (UTC+5:30)" },
    { value: "UTC+08:00", label: "Singapore, Beijing (UTC+8)" },
    { value: "UTC+09:00", label: "Tokyo, Seoul (UTC+9)" },
    { value: "UTC+10:00", label: "Sydney (UTC+10)" }
];

const COMMON_LANGUAGES = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Portuguese"];

export const CondensedMentorSection: React.FC<CondensedMentorSectionProps> = ({
    formData,
    errors,
    onExpertiseChange,
    onExperienceChange,
    onLanguagesChange,
    onTimezoneChange
}) => {
    const [expertiseInput, setExpertiseInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");

    const addExpertise = (value: string) => {
        const trimmedValue = value.trim();
        if (trimmedValue && !formData.expertise.includes(trimmedValue)) {
            onExpertiseChange([...formData.expertise, trimmedValue]);
        }
        setExpertiseInput("");
    };

    const removeExpertise = (index: number) => {
        onExpertiseChange(formData.expertise.filter((_, i) => i !== index));
    };

    const addLanguage = (value: string) => {
        const trimmedValue = value.trim();
        if (trimmedValue && !formData.languages.includes(trimmedValue)) {
            onLanguagesChange([...formData.languages, trimmedValue]);
        }
        setLanguageInput("");
    };

    const removeLanguage = (index: number) => {
        onLanguagesChange(formData.languages.filter((_, i) => i !== index));
    };

    const handleExpertiseKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addExpertise(expertiseInput);
        }
    };

    const handleLanguageKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addLanguage(languageInput);
        }
    };

    return (
        <div className="space-y-4">
            {/* Areas of Expertise - Required */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Areas of Expertise <span className="text-red-500">*</span>
                </Label>

                {/* Selected expertise tags */}
                {formData.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
                        {formData.expertise.map((item, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeExpertise(index)}
                                    className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Input for new expertise */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Star className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        onKeyDown={handleExpertiseKeyDown}
                        placeholder="Type expertise area and press Enter (e.g., JavaScript, React)"
                        className={cn(
                            "pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors",
                            errors.expertise && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                    />
                    {expertiseInput && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => addExpertise(expertiseInput)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                {/* Quick expertise buttons */}
                <div className="flex flex-wrap gap-1">
                    {QUICK_EXPERTISE.filter(item => !formData.expertise.includes(item)).slice(0, 6).map((item) => (
                        <Button
                            key={item}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addExpertise(item)}
                            className="h-6 px-2 text-xs border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                            + {item}
                        </Button>
                    ))}
                </div>

                {errors.expertise && (
                    <p className="text-sm text-red-500">{errors.expertise}</p>
                )}
            </div>

            {/* Experience and Languages Row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Years of Experience */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Experience (Years)
                    </Label>
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
                                "pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors",
                                errors.experience && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                        />
                    </div>
                    {errors.experience && (
                        <p className="text-sm text-red-500">{errors.experience}</p>
                    )}
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Timezone
                    </Label>
                    <Select value={formData.timezone} onValueChange={onTimezoneChange}>
                        <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <SelectValue placeholder="Select timezone" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {ESSENTIAL_TIMEZONES.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Languages
                </Label>

                {/* Selected languages */}
                {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
                        {formData.languages.map((lang, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs"
                            >
                                {lang}
                                <button
                                    type="button"
                                    onClick={() => removeLanguage(index)}
                                    className="ml-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Language input */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        onKeyDown={handleLanguageKeyDown}
                        placeholder="Add language and press Enter"
                        className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                    {languageInput && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => addLanguage(languageInput)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                {/* Quick language buttons */}
                <div className="flex flex-wrap gap-1">
                    {COMMON_LANGUAGES.filter(lang => !formData.languages.includes(lang)).slice(0, 4).map((lang) => (
                        <Button
                            key={lang}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addLanguage(lang)}
                            className="h-6 px-2 text-xs border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                        >
                            + {lang}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Quick summary */}
            {formData.expertise.length > 0 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">Mentor Profile:</span> {formData.expertise.length} expertise area{formData.expertise.length !== 1 ? 's' : ''}, {formData.experience} years experience, {formData.languages.length} language{formData.languages.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};