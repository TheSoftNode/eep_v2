"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    User,
    Mail,
    Building,
    Globe,
    Github,
    Plus,
    Trash2,
    Save,
    AlertCircle,
    CheckCircle,
    MapPin,
    Clock,
    Languages,
    Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import the API hook and types
import { CreateUserRequest, UserRole } from '@/Redux/types/Users/user';
import { useCreateUserMutation } from '@/Redux/apiSlices/users/adminApi';

interface CreateMentorModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface MentorFormData {
    fullName: string;
    email: string;
    role: 'mentor';
    profilePicture?: string;
    bio?: string;
    company?: string;
    website?: string;
    github?: string;
    // Mentor-specific fields (flattened for form handling)
    expertise: string[];
    skills: string[];
    languages: string[];
    experience: string; // string in form, converted to number for API
    timezone: string;
    isAvailable: boolean;
    availabilityDays: string[];
    availabilityTimeSlots: string[];
    achievements: string[];
}

const CreateMentorModal: React.FC<CreateMentorModalProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<MentorFormData>({
        fullName: '',
        email: '',
        role: 'mentor',
        bio: '',
        company: '',
        website: '',
        github: '',
        profilePicture: '',
        expertise: [],
        skills: [],
        languages: [],
        experience: '',
        timezone: '',
        isAvailable: true,
        availabilityDays: [],
        availabilityTimeSlots: [],
        achievements: []
    });

    const [currentExpertise, setCurrentExpertise] = useState<string>('');
    const [currentSkill, setCurrentSkill] = useState<string>('');
    const [currentLanguage, setCurrentLanguage] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // API hook
    const [createUser, { isLoading: isSubmitting, isError, error }] = useCreateUserMutation();

    // Common options
    const expertiseOptions = [
        'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Machine Learning',
        'UI/UX Design', 'DevOps', 'Mobile Development', 'Data Science', 'Blockchain',
        'Cybersecurity', 'Cloud Computing', 'Artificial Intelligence', 'Backend Development',
        'Frontend Development', 'Full Stack Development', 'Game Development', 'AR/VR',
        'Product Management', 'System Architecture', 'Database Design'
    ];

    const skillOptions = [
        'Problem Solving', 'Team Leadership', 'Code Review', 'System Design',
        'Database Design', 'API Development', 'Testing', 'Documentation',
        'Mentoring', 'Public Speaking', 'Project Management', 'Agile/Scrum',
        'Technical Writing', 'Performance Optimization', 'Security Best Practices'
    ];

    const languageOptions = [
        'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
        'Korean', 'Portuguese', 'Italian', 'Russian', 'Arabic', 'Hindi',
        'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish'
    ];

    const timezoneOptions = [
        'UTC-12:00 (Baker Island)', 'UTC-11:00 (American Samoa)', 'UTC-10:00 (Hawaii)',
        'UTC-09:00 (Alaska)', 'UTC-08:00 (Pacific Time)', 'UTC-07:00 (Mountain Time)',
        'UTC-06:00 (Central Time)', 'UTC-05:00 (Eastern Time)', 'UTC-04:00 (Atlantic)',
        'UTC-03:00 (Brazil)', 'UTC-02:00 (Mid-Atlantic)', 'UTC-01:00 (Azores)',
        'UTC+00:00 (London/Dublin)', 'UTC+01:00 (Central Europe)', 'UTC+02:00 (Eastern Europe)',
        'UTC+03:00 (Moscow)', 'UTC+04:00 (Dubai)', 'UTC+05:00 (Pakistan)',
        'UTC+06:00 (Bangladesh)', 'UTC+07:00 (Thailand)', 'UTC+08:00 (Singapore/China)',
        'UTC+09:00 (Japan/Korea)', 'UTC+10:00 (Australia East)', 'UTC+11:00 (Sydney)',
        'UTC+12:00 (New Zealand)'
    ];

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.expertise.length === 0) {
            newErrors.expertise = 'At least one area of expertise is required';
        }

        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            newErrors.website = 'Website must be a valid URL (include http:// or https://)';
        }

        if (formData.experience && isNaN(Number(formData.experience))) {
            newErrors.experience = 'Experience must be a valid number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof MentorFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const addExpertise = () => {
        if (currentExpertise && !formData.expertise.includes(currentExpertise)) {
            setFormData(prev => ({
                ...prev,
                expertise: [...prev.expertise, currentExpertise]
            }));
            setCurrentExpertise('');
            // Clear expertise error if it exists
            if (errors.expertise) {
                setErrors(prev => ({ ...prev, expertise: '' }));
            }
        }
    };

    const removeExpertise = (expertiseToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
        }));
    };

    const addSkill = () => {
        if (currentSkill && !formData.skills.includes(currentSkill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, currentSkill]
            }));
            setCurrentSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const addLanguage = () => {
        if (currentLanguage && !formData.languages.includes(currentLanguage)) {
            setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, currentLanguage]
            }));
            setCurrentLanguage('');
        }
    };

    const removeLanguage = (languageToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter(lang => lang !== languageToRemove)
        }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Prepare data for the createUser API with proper structure
            const createUserData: CreateUserRequest = {
                email: formData.email.trim(),
                fullName: formData.fullName.trim(),
                role: 'mentor',
                bio: formData.bio?.trim() || undefined,
                company: formData.company?.trim() || undefined,
                website: formData.website?.trim() || undefined,
                github: formData.github?.trim() || undefined,
                profilePicture: formData.profilePicture?.trim() || undefined,

                // Include mentor-specific metadata
                metadata: {
                    expertise: formData.expertise,
                    skills: formData.skills,
                    languages: formData.languages.length > 0 ? formData.languages : ['English'],
                    experience: formData.experience ? parseInt(formData.experience, 10) : 0,
                    timezone: formData.timezone || 'UTC+00:00',
                    isAvailable: formData.isAvailable,
                    availability: {
                        days: formData.availabilityDays,
                        timeSlots: formData.availabilityTimeSlots
                    },
                    achievements: formData.achievements
                }
            };

            const result = await createUser(createUserData).unwrap();

            console.log('Mentor created successfully:', result);
            onSuccess();

        } catch (err) {
            console.error('Failed to create mentor:', err);
            // Error handling is done by RTK Query
        }
    };

    const getErrorMessage = () => {
        if (error && 'data' in error) {
            return (error.data as any)?.message || 'Failed to create mentor';
        }
        return 'Failed to create mentor. Please try again.';
    };

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
                    className="relative w-full max-w-3xl mx-4 max-h-[90vh] overflow-auto rounded-xl"
                >
                    <Card className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
                        {/* Header */}
                        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                            Add New Mentor
                                        </CardTitle>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Create a new mentor profile for your platform
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                            {/* API Error Display */}
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

                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                                    <User className="h-5 w-5 mr-2 text-indigo-600" />
                                    Basic Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            placeholder="Enter full name"
                                            disabled={isSubmitting}
                                            className={`bg-white dark:bg-slate-800 ${errors.fullName ? 'border-red-500' : ''}`}
                                        />
                                        {errors.fullName && (
                                            <p className="text-xs text-red-600 flex items-center">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.fullName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Enter email address"
                                            disabled={isSubmitting}
                                            className={`bg-white dark:bg-slate-800 ${errors.email ? 'border-red-500' : ''}`}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-600 flex items-center">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Bio
                                    </label>
                                    <Textarea
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        placeholder="Write a brief bio about the mentor..."
                                        rows={3}
                                        disabled={isSubmitting}
                                        className="bg-white dark:bg-slate-800 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                                    <Building className="h-5 w-5 mr-2 text-indigo-600" />
                                    Professional Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Company
                                        </label>
                                        <Input
                                            value={formData.company}
                                            onChange={(e) => handleInputChange('company', e.target.value)}
                                            placeholder="Enter company name"
                                            disabled={isSubmitting}
                                            className="bg-white dark:bg-slate-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Years of Experience
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.experience}
                                            onChange={(e) => handleInputChange('experience', e.target.value)}
                                            placeholder="Enter years of experience"
                                            disabled={isSubmitting}
                                            className={`bg-white dark:bg-slate-800 ${errors.experience ? 'border-red-500' : ''}`}
                                        />
                                        {errors.experience && (
                                            <p className="text-xs text-red-600 flex items-center">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.experience}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Website
                                        </label>
                                        <Input
                                            value={formData.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            placeholder="https://example.com"
                                            disabled={isSubmitting}
                                            className={`bg-white dark:bg-slate-800 ${errors.website ? 'border-red-500' : ''}`}
                                        />
                                        {errors.website && (
                                            <p className="text-xs text-red-600 flex items-center">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.website}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            GitHub Username
                                        </label>
                                        <Input
                                            value={formData.github}
                                            onChange={(e) => handleInputChange('github', e.target.value)}
                                            placeholder="Enter GitHub username"
                                            disabled={isSubmitting}
                                            className="bg-white dark:bg-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Timezone
                                    </label>
                                    <Select
                                        value={formData.timezone}
                                        onValueChange={(value) => handleInputChange('timezone', value)}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger className="bg-white dark:bg-slate-800">
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timezoneOptions.map(tz => (
                                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Expertise */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                                    <Award className="h-5 w-5 mr-2 text-indigo-600" />
                                    Areas of Expertise <span className="text-red-500">*</span>
                                </h3>

                                <div className="flex gap-2">
                                    <Select value={currentExpertise} onValueChange={setCurrentExpertise} disabled={isSubmitting}>
                                        <SelectTrigger className="flex-1 bg-white dark:bg-slate-800">
                                            <SelectValue placeholder="Select expertise area" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {expertiseOptions.filter(exp => !formData.expertise.includes(exp)).map(expertise => (
                                                <SelectItem key={expertise} value={expertise}>{expertise}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={addExpertise}
                                        disabled={!currentExpertise || isSubmitting}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {formData.expertise.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.expertise.map((expertise, index) => (
                                            <Badge
                                                key={index}
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 pr-1"
                                            >
                                                {expertise}
                                                <button
                                                    onClick={() => removeExpertise(expertise)}
                                                    disabled={isSubmitting}
                                                    className="ml-2 hover:text-indigo-200 disabled:opacity-50"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {errors.expertise && (
                                    <p className="text-xs text-red-600 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.expertise}
                                    </p>
                                )}
                            </div>

                            {/* Skills */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Additional Skills
                                </h3>

                                <div className="flex gap-2">
                                    <Select value={currentSkill} onValueChange={setCurrentSkill} disabled={isSubmitting}>
                                        <SelectTrigger className="flex-1 bg-white dark:bg-slate-800">
                                            <SelectValue placeholder="Select skill" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {skillOptions.filter(skill => !formData.skills.includes(skill)).map(skill => (
                                                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={addSkill}
                                        disabled={!currentSkill || isSubmitting}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {formData.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 pr-1"
                                            >
                                                {skill}
                                                <button
                                                    onClick={() => removeSkill(skill)}
                                                    disabled={isSubmitting}
                                                    className="ml-2 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Languages */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                                    <Languages className="h-5 w-5 mr-2 text-indigo-600" />
                                    Languages
                                </h3>

                                <div className="flex gap-2">
                                    <Select value={currentLanguage} onValueChange={setCurrentLanguage} disabled={isSubmitting}>
                                        <SelectTrigger className="flex-1 bg-white dark:bg-slate-800">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languageOptions.filter(lang => !formData.languages.includes(lang)).map(language => (
                                                <SelectItem key={language} value={language}>{language}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={addLanguage}
                                        disabled={!currentLanguage || isSubmitting}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {formData.languages.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.languages.map((language, index) => (
                                            <Badge
                                                key={index}
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 pr-1"
                                            >
                                                {language}
                                                <button
                                                    onClick={() => removeLanguage(language)}
                                                    disabled={isSubmitting}
                                                    className="ml-2 hover:text-emerald-200 disabled:opacity-50"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Note about mentor creation */}
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    <strong>Mentor Account Creation:</strong> This will create a complete mentor profile with all specified expertise, skills, and availability preferences. The mentor will receive a welcome email with login instructions.
                                </p>
                            </div>
                        </CardContent>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Fields marked with <span className="text-red-500">*</span> are required
                                </p>

                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !formData.fullName.trim() || !formData.email.trim() || formData.expertise.length === 0}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Creating...
                                            </div>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Create Mentor
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

export default CreateMentorModal;