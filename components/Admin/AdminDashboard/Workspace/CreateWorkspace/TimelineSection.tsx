import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimelineSectionProps {
    formData: {
        startDate: string;
        endDate: string;
    };
    errors: Record<string, string>;
    onInputChange: (field: string, value: any) => void;
}

const DateInput: React.FC<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    description?: string;
    min?: string;
}> = ({
    id,
    label,
    icon: Icon,
    required = false,
    value,
    onChange,
    error,
    description,
    min
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
                    type="date"
                    value={value}
                    onChange={onChange}
                    min={min}
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

export const TimelineSection: React.FC<TimelineSectionProps> = ({
    formData,
    errors,
    onInputChange
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onInputChange(name, value);
    };

    // Calculate duration if both dates are set
    const calculateDuration = () => {
        if (!formData.startDate || !formData.endDate) return null;

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);

        if (diffMonths > 0) {
            return `${diffMonths} month${diffMonths > 1 ? 's' : ''} (${diffDays} days)`;
        } else if (diffWeeks > 0) {
            return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} (${diffDays} days)`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        }
    };

    const duration = calculateDuration();
    const today = new Date().toISOString().split('T')[0];

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
                            <Calendar className="h-4 w-4" />
                        </div>
                        Timeline & Schedule
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Define the timeline and duration for this workspace
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DateInput
                            id="startDate"
                            label="Start Date"
                            icon={Calendar}
                            required
                            value={formData.startDate}
                            onChange={handleInputChange}
                            error={errors.startDate}
                            description="When does this workspace begin?"
                            min={today}
                        />

                        <DateInput
                            id="endDate"
                            label="End Date"
                            icon={Clock}
                            value={formData.endDate}
                            onChange={handleInputChange}
                            error={errors.endDate}
                            description="Optional: When should this workspace conclude?"
                            min={formData.startDate || today}
                        />
                    </div>

                    {/* Duration Display */}
                    {duration && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Workspace Duration
                                </h4>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                This workspace will run for <span className="font-semibold">{duration}</span>
                            </p>
                        </div>
                    )}

                    {/* Timeline Guidelines */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5" />
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                Timeline Guidelines
                            </h4>
                        </div>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-6">
                            <li>• Start date should be realistic and allow time for team assembly</li>
                            <li>• End date is optional but helps with project planning</li>
                            <li>• Consider buffer time for unexpected challenges</li>
                            <li>• You can always adjust dates later as needed</li>
                        </ul>
                    </div>

                    {/* Warning for past dates */}
                    {formData.startDate && formData.startDate < today && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Past Start Date
                                </p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                    The selected start date is in the past. Consider choosing today or a future date.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};