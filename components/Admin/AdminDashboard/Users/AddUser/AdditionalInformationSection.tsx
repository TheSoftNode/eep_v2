import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AdditionalInformationSectionProps {
    formData: {
        bio: string;
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const AdditionalInformationSection: React.FC<AdditionalInformationSectionProps> = ({
    formData,
    errors,
    onInputChange
}) => {
    const bioWordCount = formData.bio.trim().split(/\s+/).filter(word => word).length;
    const bioCharCount = formData.bio.length;

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
                            <FileText className="h-4 w-4" />
                        </div>
                        Additional Information
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Optional details to personalize the user profile
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="bio" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Bio
                            </Label>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {bioCharCount}/500 characters
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            A brief description about the user (optional)
                        </p>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileText className="h-4 w-4 text-slate-400" />
                            </div>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={onInputChange}
                                placeholder="Tell us about this user... (e.g., experienced developer, passionate learner, team leader)"
                                rows={4}
                                maxLength={500}
                                className={cn(
                                    "pl-10 resize-none transition-colors",
                                    errors.bio && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                        </div>
                        {errors.bio && (
                            <p className="text-sm text-red-500">{errors.bio}</p>
                        )}
                        {bioWordCount > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {bioWordCount} words
                            </p>
                        )}
                    </div>

                    {/* Bio Preview */}
                    {formData.bio.trim() && (
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                                Bio Preview
                            </h4>
                            <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                                {formData.bio}
                            </p>
                        </div>
                    )}

                    {/* Writing Tips */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                            💡 Writing Tips
                        </h4>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <li>• Keep it professional but personable</li>
                            <li>• Mention key skills or interests</li>
                            <li>• Include what they're passionate about</li>
                            <li>• Keep it concise but informative</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};