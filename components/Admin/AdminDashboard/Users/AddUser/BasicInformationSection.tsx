import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserRole } from "@/Redux/types/Users/user";

interface BasicInformationSectionProps {
    formData: {
        fullName: string;
        email: string;
        role: UserRole;
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRoleChange: (value: string) => void;
}

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
    disabled?: boolean;
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
    disabled = false
}) => (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
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
                    disabled={disabled}
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

const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
        case 'admin':
            return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
        case 'mentor':
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'learner':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getRoleDescription = (role: UserRole) => {
    switch (role) {
        case 'admin':
            return 'Full system access with administrative privileges';
        case 'mentor':
            return 'Can guide and mentor other users';
        case 'learner':
            return 'Can access learning resources and receive mentorship';
        default:
            return 'Standard user with basic platform access';
    }
};

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
    formData,
    errors,
    onInputChange,
    onRoleChange
}) => {
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
                            <User className="h-4 w-4" />
                        </div>
                        Basic Information
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Essential details required to create the user account
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            id="fullName"
                            label="Full Name"
                            icon={User}
                            required
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={onInputChange}
                            error={errors.fullName}
                        />

                        <InputField
                            id="email"
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={onInputChange}
                            error={errors.email}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            User Role <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.role} onValueChange={onRoleChange}>
                            <SelectTrigger className="h-11">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-slate-400" />
                                    <SelectValue placeholder="Select user role" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">
                                    <div className="flex items-center justify-between w-full">
                                        <span>User</span>
                                        <Badge variant="outline" className="ml-2 text-xs">
                                            Standard
                                        </Badge>
                                    </div>
                                </SelectItem>
                                <SelectItem value="learner">
                                    <div className="flex items-center justify-between w-full">
                                        <span>Learner</span>
                                        <Badge variant="outline" className="ml-2 text-xs">
                                            Learning
                                        </Badge>
                                    </div>
                                </SelectItem>
                                <SelectItem value="mentor">
                                    <div className="flex items-center justify-between w-full">
                                        <span>Mentor</span>
                                        <Badge variant="outline" className="ml-2 text-xs">
                                            Teaching
                                        </Badge>
                                    </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                    <div className="flex items-center justify-between w-full">
                                        <span>Admin</span>
                                        <Badge variant="outline" className="ml-2 text-xs">
                                            Full Access
                                        </Badge>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Role Information */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <Badge className={cn("text-xs font-medium border", getRoleBadgeColor(formData.role))}>
                                {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                            </Badge>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                                {getRoleDescription(formData.role)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};