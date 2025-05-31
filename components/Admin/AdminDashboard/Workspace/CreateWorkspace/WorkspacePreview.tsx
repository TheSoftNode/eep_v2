import React from "react";
import { motion } from "framer-motion";
import {
    Eye,
    FolderPlus,
    Calendar,
    Clock,
    Users,
    Settings,
    Tag,
    Globe,
    Lock,
    Building,
    Shield,
    UserCheck,
    CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface WorkspacePreviewProps {
    formData: {
        name: string;
        description: string;
        projectType: string;
        tags: string[];
        startDate: string;
        endDate: string;
        availableRoles: string[];
        visibility: 'public' | 'private' | 'organization';
        joinApproval: 'automatic' | 'admin_approval' | 'mentor_approval';
        allowLearnerInvites: boolean;
    };
}

const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
        case 'public':
            return Globe;
        case 'organization':
            return Building;
        default:
            return Lock;
    }
};

const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
        case 'public':
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'organization':
            return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
        default:
            return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
    }
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0) {
        return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else if (diffWeeks > 0) {
        return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}`;
    } else {
        return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
};

export const WorkspacePreview: React.FC<WorkspacePreviewProps> = ({ formData }) => {
    const VisibilityIcon = getVisibilityIcon(formData.visibility);
    const duration = calculateDuration(formData.startDate, formData.endDate);
    const completionPercentage = Math.round(
        ((formData.name ? 1 : 0) +
            (formData.description ? 1 : 0) +
            (formData.projectType ? 1 : 0) +
            (formData.tags.length > 0 ? 1 : 0) +
            (formData.startDate ? 1 : 0) +
            (formData.availableRoles.length > 0 ? 1 : 0)) / 6 * 100
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
                        Workspace Preview
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Preview how the workspace will appear once created
                    </p>
                </CardHeader>
            </Card>

            {/* Main Workspace Card */}
            <Card className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                {/* Gradient Header */}
                <div className="h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTguMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE3Ljl6TTIxIDZjMS4yIDAgMi4xLjkgMi4xIDIuMXY0LjJjMCAxLjItLjkgMi4xLTIuMSAyLjFoLTIuMWMtMS4yIDAtMi4xLS45LTIuMS0yLjFWOC4xYzAtMS4yLjktMi4xIDIuMS0yLjFIMjF6bTI0IDI0YzEuMiAwIDIuMS45IDIuMSAyLjF2NGMwIDEuMi0uOSAyLjEtMi4xIDIuMWgtNGMtMS4yIDAtMi4xLS45LTIuMS0yLjF2LTRjMC0xLjIuOS0yLjEgMi4xLTIuMWg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                </div>

                <CardContent className="relative -mt-6">
                    {/* Workspace Icon */}
                    <div className="flex items-start gap-4 mb-6">
                        <Avatar className="h-16 w-16 border-4 border-white dark:border-slate-800 shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold">
                                {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'WS'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 pt-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {formData.name || 'Workspace Name'}
                            </h2>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge className={cn("text-xs font-medium border", getVisibilityColor(formData.visibility))}>
                                    <VisibilityIcon className="h-3 w-3 mr-1" />
                                    {formData.visibility.charAt(0).toUpperCase() + formData.visibility.slice(1)}
                                </Badge>
                                {formData.projectType && (
                                    <Badge variant="outline" className="text-xs">
                                        {formData.projectType}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {formData.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <FolderPlus className="h-4 w-4" />
                                About
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {formData.description}
                            </p>
                        </div>
                    )}

                    {/* Tags */}
                    {formData.tags.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Technologies & Topics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Timeline
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <Calendar className="h-4 w-4 text-indigo-600" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Start Date</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {formatDate(formData.startDate) || 'Not set'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <Clock className="h-4 w-4 text-purple-600" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {duration || (formData.endDate ? formatDate(formData.endDate) : 'Ongoing')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Roles */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Available Roles ({formData.availableRoles.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {formData.availableRoles.map((role) => {
                                const isEssential = ['mentor', 'admin'].includes(role);
                                return (
                                    <Badge
                                        key={role}
                                        variant="outline"
                                        className={cn(
                                            "text-xs",
                                            isEssential && "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                        )}
                                    >
                                        {role.replace('_', ' ')}
                                        {isEssential && <Shield className="h-3 w-3 ml-1" />}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>

                    {/* Configuration */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Access Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Join Approval</p>
                                <p className="text-sm text-slate-900 dark:text-white capitalize">
                                    {formData.joinApproval.replace('_', ' ')}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Learner Invites</p>
                                <div className="flex items-center gap-1">
                                    {formData.allowLearnerInvites ? (
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <UserCheck className="h-3 w-3 text-slate-400" />
                                    )}
                                    <p className="text-sm text-slate-900 dark:text-white">
                                        {formData.allowLearnerInvites ? 'Allowed' : 'Restricted'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Completion Status */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        Workspace Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Setup Completion
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
                                {completionPercentage < 50 ? 'Add more details to complete setup' :
                                    completionPercentage < 100 ? 'Almost ready!' : 'Ready to create!'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Workspace Type
                            </p>
                            <div className="flex items-center gap-2">
                                <VisibilityIcon className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                                    {formData.visibility} Workspace
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                With {formData.availableRoles.length} available roles
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};