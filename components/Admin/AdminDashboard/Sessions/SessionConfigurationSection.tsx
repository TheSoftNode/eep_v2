import React from "react";
import { motion } from "framer-motion";
import { Settings, Users, Globe, Lock, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SessionConfigurationSectionProps {
    formData: {
        maxParticipants: number;
        isPublic: boolean;
        sessionType: 'individual' | 'group';
    };
    errors: Record<string, string>;
    onSelectChange: (name: string, value: string | number | boolean) => void;
}

const getSessionVisibilityDescription = (isPublic: boolean) => {
    return isPublic
        ? "Anyone can discover and join this session"
        : "Only users with direct links can join this session";
};

const getParticipantLimitDescription = (sessionType: string, maxParticipants: number) => {
    if (sessionType === 'individual') {
        return "Individual sessions are limited to 1 participant";
    }
    if (maxParticipants <= 5) {
        return "Small group - ideal for focused discussions";
    }
    if (maxParticipants <= 15) {
        return "Medium group - good for interactive workshops";
    }
    return "Large group - best for presentations and lectures";
};

const getRecommendedParticipants = (sessionType: string) => {
    if (sessionType === 'individual') {
        return [1];
    }
    return [5, 10, 15, 20, 25, 30];
};

export const SessionConfigurationSection: React.FC<SessionConfigurationSectionProps> = ({
    formData,
    errors,
    onSelectChange
}) => {
    const recommendedCounts = getRecommendedParticipants(formData.sessionType);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                            <Settings className="h-4 w-4" />
                        </div>
                        Session Configuration
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Configure participation limits and visibility settings
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Participant Limit */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="maxParticipants" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Maximum Participants
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                How many learners can join this session?
                            </p>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Users className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="maxParticipants"
                                    type="number"
                                    min={formData.sessionType === 'individual' ? 1 : 2}
                                    max="50"
                                    value={formData.maxParticipants}
                                    onChange={(e) => onSelectChange('maxParticipants', parseInt(e.target.value) || 1)}
                                    disabled={formData.sessionType === 'individual'}
                                    placeholder="10"
                                    className={cn(
                                        "pl-10 transition-colors",
                                        errors.maxParticipants && "border-red-500 focus:border-red-500 focus:ring-red-500",
                                        formData.sessionType === 'individual' && "bg-slate-50 dark:bg-slate-800/50"
                                    )}
                                />
                            </div>
                            {errors.maxParticipants && (
                                <p className="text-sm text-red-500">{errors.maxParticipants}</p>
                            )}

                            {/* Participant Limit Description */}
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <Users className="h-4 w-4 text-slate-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {getParticipantLimitDescription(formData.sessionType, formData.maxParticipants)}
                                </span>
                            </div>
                        </div>

                        {/* Quick Select Recommended Counts */}
                        {formData.sessionType === 'group' && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Quick Select
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {recommendedCounts.map((count) => (
                                        <Badge
                                            key={count}
                                            variant={formData.maxParticipants === count ? "default" : "outline"}
                                            className={cn(
                                                "cursor-pointer transition-all duration-200",
                                                formData.maxParticipants === count
                                                    ? "bg-orange-600 text-white border-orange-600"
                                                    : "hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700"
                                            )}
                                            onClick={() => onSelectChange('maxParticipants', count)}
                                        >
                                            {count} {count === 1 ? 'person' : 'people'}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Session Visibility */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Session Visibility
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Control who can discover and join your session
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Public Option */}
                            <div
                                className={cn(
                                    "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                    formData.isPublic
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                )}
                                onClick={() => onSelectChange('isPublic', true)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        formData.isPublic
                                            ? "bg-emerald-600 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                    )}>
                                        <Globe className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Public Session
                                        </h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Discoverable by all users
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 ml-11">
                                    Appears in session listings and search results
                                </p>
                            </div>

                            {/* Private Option */}
                            <div
                                className={cn(
                                    "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                    !formData.isPublic
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                )}
                                onClick={() => onSelectChange('isPublic', false)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        !formData.isPublic
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                    )}>
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Private Session
                                        </h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Invite-only access
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 ml-11">
                                    Only accessible via direct invitation or link
                                </p>
                            </div>
                        </div>

                        {/* Visibility Description */}
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            {formData.isPublic ? (
                                <Globe className="h-4 w-4 text-emerald-600" />
                            ) : (
                                <Lock className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {getSessionVisibilityDescription(formData.isPublic)}
                            </span>
                        </div>
                    </div>

                    {/* Configuration Summary */}
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Session Configuration Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700 dark:text-orange-300">
                            <div>
                                <span className="font-medium">Session Type:</span>
                                <p className="capitalize">{formData.sessionType} session</p>
                            </div>
                            <div>
                                <span className="font-medium">Max Participants:</span>
                                <p>{formData.maxParticipants} {formData.maxParticipants === 1 ? 'person' : 'people'}</p>
                            </div>
                            <div>
                                <span className="font-medium">Visibility:</span>
                                <p>{formData.isPublic ? 'Public' : 'Private'}</p>
                            </div>
                            <div>
                                <span className="font-medium">Access:</span>
                                <p>{formData.isPublic ? 'Open enrollment' : 'Invitation required'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Guidelines */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                            🎯 Configuration Best Practices
                        </h4>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <li>• Individual sessions provide focused, personalized attention</li>
                            <li>• Group sessions (5-15 people) encourage peer learning and discussion</li>
                            <li>• Public sessions increase discoverability and participation</li>
                            <li>• Private sessions offer controlled environments for sensitive topics</li>
                            <li>• Consider your topic complexity when setting participant limits</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};