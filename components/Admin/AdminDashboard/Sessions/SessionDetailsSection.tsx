import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SessionDetailsSectionProps {
    formData: {
        objectives: string[];
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onObjectivesChange: (objectives: string[]) => void;
}

// Suggested learning objectives for different topics
const SUGGESTED_OBJECTIVES = [
    "Understand core concepts and fundamentals",
    "Apply practical skills through hands-on exercises",
    "Identify best practices and common pitfalls",
    "Build confidence in problem-solving approach",
    "Develop actionable next steps for continued learning",
    "Create a personal development roadmap",
    "Master essential tools and techniques",
    "Improve communication and collaboration skills",
    "Gain industry insights and real-world experience",
    "Build a portfolio project or deliverable"
];

export const SessionDetailsSection: React.FC<SessionDetailsSectionProps> = ({
    formData,
    errors,
    onInputChange,
    onObjectivesChange
}) => {
    const [newObjective, setNewObjective] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const addObjective = (objective: string) => {
        const trimmedObjective = objective.trim();
        if (trimmedObjective && !formData.objectives.includes(trimmedObjective)) {
            onObjectivesChange([...formData.objectives, trimmedObjective]);
        }
        setNewObjective("");
        setShowSuggestions(false);
    };

    const removeObjective = (index: number) => {
        onObjectivesChange(formData.objectives.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addObjective(newObjective);
        }
    };

    const filteredSuggestions = SUGGESTED_OBJECTIVES.filter(
        suggestion =>
            suggestion.toLowerCase().includes(newObjective.toLowerCase()) &&
            !formData.objectives.includes(suggestion)
    );

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
                            <Target className="h-4 w-4" />
                        </div>
                        Learning Objectives
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Define what participants will achieve by the end of the session
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Current Objectives */}
                    {formData.objectives.length > 0 && (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Session Objectives ({formData.objectives.length})
                            </Label>
                            <div className="space-y-2">
                                {formData.objectives.map((objective, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                                    >
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white flex-shrink-0">
                                            <CheckCircle className="h-3 w-3" />
                                        </div>
                                        <span className="flex-1 text-sm text-purple-900 dark:text-purple-100 font-medium">
                                            {objective}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeObjective(index)}
                                            className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full transition-colors"
                                        >
                                            <X className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add New Objective */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Add Learning Objective
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            What specific outcome should participants achieve?
                        </p>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Target className="h-4 w-4 text-slate-400" />
                            </div>
                            <Input
                                value={newObjective}
                                onChange={(e) => {
                                    setNewObjective(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="e.g., Master React hooks and state management"
                                className="pl-10 transition-colors"
                            />
                            {newObjective && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => addObjective(newObjective)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2"
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            )}
                        </div>

                        {/* Suggestions */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-lg max-h-40 overflow-y-auto">
                                <div className="p-2">
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                        Suggested objectives:
                                    </p>
                                    {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => addObjective(suggestion)}
                                            className="w-full text-left px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm rounded transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {errors.objectives && (
                            <p className="text-sm text-red-500">{errors.objectives}</p>
                        )}
                    </div>

                    {/* Quick Add Popular Objectives */}
                    {formData.objectives.length === 0 && (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Quick Add Popular Objectives
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_OBJECTIVES.slice(0, 6).map((objective, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                                        onClick={() => addObjective(objective)}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        {objective}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Objectives Guidelines */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                            💡 Writing Effective Learning Objectives
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                                    ✅ Good Examples:
                                </h5>
                                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>• "Build a functional React component"</li>
                                    <li>• "Identify 3 career growth strategies"</li>
                                    <li>• "Master Git branching workflow"</li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                                    ❌ Avoid:
                                </h5>
                                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>• "Learn about React" (too vague)</li>
                                    <li>• "Become an expert" (unrealistic)</li>
                                    <li>• "Understand everything" (unmeasurable)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                <strong>Tip:</strong> Use action verbs like "create," "identify," "demonstrate," "analyze," or "apply" to make objectives specific and measurable.
                            </p>
                        </div>
                    </div>

                    {/* Objectives Summary */}
                    {formData.objectives.length > 0 && (
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Session Learning Outcomes
                            </h4>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                                By the end of this session, participants will be able to:
                            </p>
                            <div className="space-y-1">
                                {formData.objectives.map((objective, index) => (
                                    <div key={index} className="flex items-start gap-2 text-sm text-purple-800 dark:text-purple-200">
                                        <span className="font-medium text-purple-600 dark:text-purple-400">
                                            {index + 1}.
                                        </span>
                                        <span>{objective}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};