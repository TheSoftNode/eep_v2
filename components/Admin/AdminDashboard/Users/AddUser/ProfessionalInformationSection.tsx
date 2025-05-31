import React from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProfessionalInformationSectionProps {
    formData: {
        company: string;
        website: string;
        github: string;
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
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
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    description
}) => (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
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

export const ProfessionalInformationSection: React.FC<ProfessionalInformationSectionProps> = ({
    formData,
    errors,
    onInputChange
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <Building2 className="h-4 w-4" />
                        </div>
                        Professional Information
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Optional professional details to enhance the user profile
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            id="company"
                            label="Company"
                            icon={Building2}
                            placeholder="Acme Corporation"
                            value={formData.company}
                            onChange={onInputChange}
                            error={errors.company}
                            description="Current employer or organization"
                        />

                        <InputField
                            id="website"
                            label="Website"
                            icon={Globe}
                            type="url"
                            placeholder="https://example.com"
                            value={formData.website}
                            onChange={onInputChange}
                            error={errors.website}
                            description="Personal or professional website"
                        />
                    </div>

                    <InputField
                        id="github"
                        label="GitHub Username"
                        icon={Github}
                        placeholder="johndoe"
                        value={formData.github}
                        onChange={onInputChange}
                        error={errors.github}
                        description="GitHub username (without @ symbol)"
                    />

                    {/* Professional Info Preview */}
                    {(formData.company || formData.website || formData.github) && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                                Professional Profile Preview
                            </h4>
                            <div className="space-y-2">
                                {formData.company && (
                                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                        <Building2 className="h-3 w-3" />
                                        <span>{formData.company}</span>
                                    </div>
                                )}
                                {formData.website && (
                                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                        <Globe className="h-3 w-3" />
                                        <span className="truncate">{formData.website}</span>
                                    </div>
                                )}
                                {formData.github && (
                                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                        <Github className="h-3 w-3" />
                                        <span>@{formData.github}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};