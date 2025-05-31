import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Shield, Users, UserCheck, Plus, X, Eye, EyeOff, Lock, Globe, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ConfigurationSectionProps {
    formData: {
        availableRoles: string[];
        visibility: 'public' | 'private' | 'organization';
        joinApproval: 'automatic' | 'admin_approval' | 'mentor_approval';
        allowLearnerInvites: boolean;
    };
    errors: Record<string, string>;
    onInputChange: (field: string, value: any) => void;
}

const DEFAULT_ROLES = ['frontend', 'backend', 'data_analyst', 'ui_designer', 'digital_marketing', 'mentor', 'admin'];

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

const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
        case 'public':
            return 'Anyone can discover and request to join this workspace';
        case 'organization':
            return 'Only members of your organization can see and join';
        case 'private':
            return 'Only invited members can access this workspace';
        default:
            return '';
    }
};

const getApprovalDescription = (approval: string) => {
    switch (approval) {
        case 'automatic':
            return 'Users can join immediately without approval';
        case 'mentor_approval':
            return 'Mentors and admins can approve join requests';
        case 'admin_approval':
            return 'Only admins can approve join requests';
        default:
            return '';
    }
};

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({
    formData,
    errors,
    onInputChange
}) => {
    const [roleInput, setRoleInput] = useState("");

    const handleAddRole = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newRole = roleInput.trim().toLowerCase().replace(/\s+/g, '_');
            if (newRole && !formData.availableRoles.includes(newRole)) {
                onInputChange('availableRoles', [...formData.availableRoles, newRole]);
                setRoleInput('');
            }
        }
    };

    const handleAddRoleButton = () => {
        const newRole = roleInput.trim().toLowerCase().replace(/\s+/g, '_');
        if (newRole && !formData.availableRoles.includes(newRole)) {
            onInputChange('availableRoles', [...formData.availableRoles, newRole]);
            setRoleInput('');
        }
    };

    const handleRemoveRole = (roleToRemove: string) => {
        // Prevent removing essential roles
        const essentialRoles = ['mentor', 'admin'];
        if (essentialRoles.includes(roleToRemove)) return;

        onInputChange('availableRoles', formData.availableRoles.filter(role => role !== roleToRemove));
    };

    const VisibilityIcon = getVisibilityIcon(formData.visibility);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <Settings className="h-4 w-4" />
                        </div>
                        Configuration & Access
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Configure roles, visibility, and access controls for the workspace
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Available Roles */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Available Roles <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Define roles that team members can be assigned in this workspace
                        </p>

                        {/* Roles Display */}
                        <div className="flex flex-wrap gap-2">
                            {formData.availableRoles.map((role) => {
                                const isEssential = ['mentor', 'admin'].includes(role);
                                return (
                                    <Badge
                                        key={role}
                                        variant="secondary"
                                        className={cn(
                                            "gap-1 px-2 py-1 border",
                                            isEssential
                                                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                                                : "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                        )}
                                    >
                                        {role.replace('_', ' ')}
                                        {!isEssential && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRole(role)}
                                                className="ml-1 text-purple-600 dark:text-purple-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                aria-label={`Remove ${role} role`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                        {isEssential && (
                                            <Shield className="h-3 w-3 ml-1 text-green-600 dark:text-green-400" />
                                        )}
                                    </Badge>
                                );
                            })}
                        </div>

                        {/* Role Input */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Users className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    placeholder="Add custom role (e.g., DevOps Engineer)"
                                    value={roleInput}
                                    onChange={(e) => setRoleInput(e.target.value)}
                                    onKeyDown={handleAddRole}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddRoleButton}
                                disabled={!roleInput.trim()}
                                className="border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            >
                                <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </Button>
                        </div>

                        {/* Suggested Roles */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Quick add common roles:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_ROLES.filter(role => !formData.availableRoles.includes(role)).map((role) => (
                                    <Button
                                        key={role}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onInputChange('availableRoles', [...formData.availableRoles, role])}
                                        className="h-7 px-2 text-xs text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                    >
                                        + {role.replace('_', ' ')}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {errors.availableRoles && (
                            <p className="text-sm text-red-500">{errors.availableRoles}</p>
                        )}
                    </div>

                    {/* Visibility Settings */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Workspace Visibility
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Control who can see and discover this workspace
                        </p>

                        <Select value={formData.visibility} onValueChange={(value) => onInputChange('visibility', value)}>
                            <SelectTrigger className="h-11">
                                <div className="flex items-center gap-2">
                                    <VisibilityIcon className="h-4 w-4 text-slate-400" />
                                    <SelectValue placeholder="Select visibility level" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="private">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        <div>
                                            <p className="font-medium">Private</p>
                                            <p className="text-xs text-slate-500">Invite only</p>
                                        </div>
                                    </div>
                                </SelectItem>
                                <SelectItem value="organization">
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        <div>
                                            <p className="font-medium">Organization</p>
                                            <p className="text-xs text-slate-500">Organization members</p>
                                        </div>
                                    </div>
                                </SelectItem>
                                <SelectItem value="public">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <div>
                                            <p className="font-medium">Public</p>
                                            <p className="text-xs text-slate-500">Anyone can discover</p>
                                        </div>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                {getVisibilityDescription(formData.visibility)}
                            </p>
                        </div>
                    </div>

                    {/* Join Approval */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Join Approval Process
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            How should join requests be handled?
                        </p>

                        <Select value={formData.joinApproval} onValueChange={(value) => onInputChange('joinApproval', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select approval process" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="automatic">
                                    <div>
                                        <p className="font-medium">Automatic</p>
                                        <p className="text-xs text-slate-500">Instant access</p>
                                    </div>
                                </SelectItem>
                                <SelectItem value="mentor_approval">
                                    <div>
                                        <p className="font-medium">Mentor Approval</p>
                                        <p className="text-xs text-slate-500">Mentors can approve</p>
                                    </div>
                                </SelectItem>
                                <SelectItem value="admin_approval">
                                    <div>
                                        <p className="font-medium">Admin Approval</p>
                                        <p className="text-xs text-slate-500">Admin approval required</p>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                {getApprovalDescription(formData.joinApproval)}
                            </p>
                        </div>
                    </div>

                    {/* Allow Learner Invites */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Allow Learner Invites
                                </Label>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Let learners invite other users to join this workspace
                            </p>
                        </div>
                        <Switch
                            checked={formData.allowLearnerInvites}
                            onCheckedChange={(checked) => onInputChange('allowLearnerInvites', checked)}
                        />
                    </div>

                    {/* Configuration Summary */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-3">
                            Configuration Summary
                        </h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-purple-700 dark:text-purple-300">Available Roles:</span>
                                <span className="text-purple-800 dark:text-purple-200 font-medium">
                                    {formData.availableRoles.length} roles
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-700 dark:text-purple-300">Visibility:</span>
                                <span className="text-purple-800 dark:text-purple-200 font-medium capitalize">
                                    {formData.visibility.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-700 dark:text-purple-300">Join Approval:</span>
                                <span className="text-purple-800 dark:text-purple-200 font-medium capitalize">
                                    {formData.joinApproval.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-700 dark:text-purple-300">Learner Invites:</span>
                                <span className="text-purple-800 dark:text-purple-200 font-medium">
                                    {formData.allowLearnerInvites ? 'Allowed' : 'Restricted'}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};