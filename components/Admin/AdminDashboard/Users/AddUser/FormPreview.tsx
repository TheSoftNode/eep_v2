import React from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Shield,
    Building2,
    Globe,
    Github,
    FileText,
    Eye,
    Calendar,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserRole } from "@/Redux/types/Users/user";

interface FormPreviewProps {
    formData: {
        fullName: string;
        email: string;
        role: UserRole;
        bio: string;
        company: string;
        website: string;
        github: string;
    };
}

const getRoleBadgeStyles = (role: UserRole) => {
    switch (role) {
        case 'admin':
            return "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 dark:border-red-800/50";
        case 'mentor':
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-800/50";
        case 'learner':
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-800/50";
        default:
            return "bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800/50";
    }
};

const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
        case 'admin':
            return 'Administrator';
        case 'mentor':
            return 'Mentor';
        case 'learner':
            return 'Learner';
        default:
            return 'User';
    }
};

export const FormPreview: React.FC<FormPreviewProps> = ({ formData }) => {
    const hasAdditionalInfo = formData.company || formData.website || formData.github;
    const completionPercentage = Math.round(
        ((formData.fullName ? 1 : 0) +
            (formData.email ? 1 : 0) +
            (formData.bio ? 1 : 0) +
            (formData.company ? 1 : 0) +
            (formData.website ? 1 : 0) +
            (formData.github ? 1 : 0)) / 6 * 100
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
        >
            {/* Preview Header */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-indigo-600" />
                        User Profile Preview
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Preview how the user profile will appear once created
                    </p>
                </CardHeader>
            </Card>

            {/* Main Profile Card */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 shadow-lg border-0 overflow-hidden">
                {/* Gradient Header */}
                <div className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTguMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE3Ljl6TTIxIDZjMS4yIDAgMi4xLjkgMi4xIDIuMXY0LjJjMCAxLjItLjkgMi4xLTIuMSAyLjFoLTIuMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWOC4xYzAtMS4yLjktMi4xIDIuMS0yLjFIMjF6bTI0IDI0YzEuMiAwIDIuMS45IDIuMSAyLjF2NGMwIDEuMi0uOSAyLjEtMi4xIDIuMWgtNGMtMS4yIDAtMi4xLS45LTIuMS0yLjF2LTRjMC0xLjIuOS0yLjEgMi4xLTIuMWg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                </div>

                <CardHeader className="pb-0 pt-0 px-6 flex justify-center items-center flex-col relative">
                    {/* Avatar */}
                    <div className="relative -mt-12 mb-4">
                        <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
                                {getUserInitials(formData.fullName)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Name and Role */}
                    <CardTitle className="text-xl text-center mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        {formData.fullName || 'Full Name'}
                    </CardTitle>

                    <div className="text-center pb-4">
                        <Badge className={cn(
                            "rounded-full px-3 py-0.5 text-xs font-medium mt-1 border dark:border-opacity-20",
                            getRoleBadgeStyles(formData.role)
                        )}>
                            {getRoleDisplayName(formData.role)}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="pt-4 px-6 space-y-4">
                    {/* Email */}
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Email</p>
                            <span className="text-slate-800 dark:text-slate-200">
                                {formData.email || 'email@example.com'}
                            </span>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Account Status</p>
                            <div className="flex items-center">
                                <span className="w-2 h-2 rounded-full mr-2 bg-yellow-500"></span>
                                <span className="text-slate-800 dark:text-slate-200 flex items-center">
                                    <span>Pending verification</span>
                                    <AlertCircle className="h-3.5 w-3.5 ml-1 text-yellow-500" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Member Since</p>
                            <span className="text-slate-800 dark:text-slate-200">
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Bio */}
                    {formData.bio && (
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bio</p>
                                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                                    {formData.bio}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Professional Information */}
                    {hasAdditionalInfo && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-medium text-sm mb-3 text-indigo-600 dark:text-indigo-400">
                                Professional Information
                            </h3>

                            <div className="space-y-3">
                                {/* Company */}
                                {formData.company && (
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Company</p>
                                            <span className="text-slate-800 dark:text-slate-200">{formData.company}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Website */}
                                {formData.website && (
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                            <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Website</p>
                                            <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors">
                                                {formData.website.replace(/^https?:\/\//, '')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* GitHub */}
                                {formData.github && (
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                            <Github className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">GitHub</p>
                                            <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors">
                                                @{formData.github}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Empty State for Professional Info */}
                    {!hasAdditionalInfo && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="py-4 px-4 rounded-md bg-slate-50 dark:bg-slate-800/50 text-center">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No professional information provided
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Add company, website, or GitHub to enhance the profile
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20"></div>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 blur-xl -ml-8 -mb-8 pointer-events-none"></div>
            </Card>

            {/* Profile Completion Card */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        Profile Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Account Type
                            </p>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {getRoleDisplayName(formData.role)} Account
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Profile Completion
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completionPercentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    />
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {completionPercentage}%
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {completionPercentage < 50 ? 'Add more details to complete profile' :
                                    completionPercentage < 100 ? 'Almost complete!' : 'Profile complete!'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};