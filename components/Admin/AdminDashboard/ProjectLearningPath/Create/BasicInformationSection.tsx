import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Target, Plus, X, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BasicInformationSectionProps {
    objectives: string[];
    onObjectivesChange: (objectives: string[]) => void;
    projectTitle: string;
    error?: string;
}

const SUGGESTED_OBJECTIVES = [
    "Master fundamental concepts and principles",
    "Develop practical implementation skills",
    "Learn industry best practices and standards",
    "Build portfolio-ready projects",
    "Gain hands-on experience with real-world scenarios",
    "Understand system architecture and design patterns",
    "Practice debugging and problem-solving skills",
    "Learn version control and collaboration workflows",
    "Develop testing and quality assurance skills",
    "Build confidence in technology stack usage"
];

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
    objectives,
    onObjectivesChange,
    projectTitle,
    error
}) => {
    const [newObjective, setNewObjective] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleAddObjective = () => {
        if (newObjective.trim() && !objectives.includes(newObjective.trim())) {
            const updatedObjectives = [...objectives, newObjective.trim()];
            onObjectivesChange(updatedObjectives);
            setNewObjective('');
        }
    };

    const handleRemoveObjective = (objectiveToRemove: string) => {
        const updatedObjectives = objectives.filter(obj => obj !== objectiveToRemove);
        onObjectivesChange(updatedObjectives);
    };

    const handleAddSuggestedObjective = (suggestion: string) => {
        if (!objectives.includes(suggestion)) {
            const updatedObjectives = [...objectives, suggestion];
            onObjectivesChange(updatedObjectives);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddObjective();
        }
    };

    // Filter suggestions to exclude already added objectives
    const availableSuggestions = SUGGESTED_OBJECTIVES.filter(
        suggestion => !objectives.includes(suggestion)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        Learning Objectives
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Define what learners will achieve by completing the learning path for <strong>{projectTitle}</strong>
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add New Objective */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Add Learning Objective
                        </Label>

                        <div className="space-y-2">
                            <Textarea
                                placeholder="e.g., Develop proficiency in React hooks and state management patterns"
                                value={newObjective}
                                onChange={(e) => setNewObjective(e.target.value)}
                                onKeyPress={handleKeyPress}
                                rows={2}
                                className={cn(
                                    "resize-none transition-colors",
                                    error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                            <div className="flex items-center justify-between">
                                <Button
                                    type="button"
                                    onClick={handleAddObjective}
                                    disabled={!newObjective.trim() || objectives.includes(newObjective.trim())}
                                    variant="secondary"
                                    size="sm"
                                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Objective
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                    className="text-slate-600 dark:text-slate-400"
                                >
                                    {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Suggested Objectives */}
                    {showSuggestions && availableSuggestions.length > 0 && (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Suggested Objectives
                            </Label>
                            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                {availableSuggestions.map((suggestion, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                                            {suggestion}
                                        </span>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleAddSuggestedObjective(suggestion)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Current Objectives */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Learning Objectives ({objectives.length})
                            </Label>
                            {objectives.length >= 3 && (
                                <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                                    <Target className="h-4 w-4" />
                                    Good coverage
                                </div>
                            )}
                        </div>

                        {objectives.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                <Target className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                    No Learning Objectives Added
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                                    Add specific, measurable learning objectives that define what participants will achieve.
                                    Good objectives are specific, actionable, and outcome-focused.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {objectives.map((objective, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="group flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                    >
                                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                                                {objective}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 flex-shrink-0"
                                            onClick={() => handleRemoveObjective(objective)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Objectives Guidelines */}
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                            💡 Writing Effective Learning Objectives
                        </h4>
                        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            <li>• Use action verbs: "Build", "Implement", "Analyze", "Create"</li>
                            <li>• Be specific about what will be accomplished</li>
                            <li>• Focus on practical, applicable skills</li>
                            <li>• Consider different learning levels: knowledge, comprehension, application</li>
                            <li>• Align with project requirements and industry standards</li>
                        </ul>
                    </div>

                    {/* Progress Summary */}
                    {objectives.length > 0 && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                📋 Objectives Summary
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">Total:</span>
                                    <span className="ml-1 text-blue-800 dark:text-blue-200">{objectives.length}</span>
                                </div>
                                <div>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">Coverage:</span>
                                    <span className="ml-1 text-blue-800 dark:text-blue-200">
                                        {objectives.length < 3 ? 'Basic' : objectives.length < 6 ? 'Good' : 'Comprehensive'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">Status:</span>
                                    <span className="ml-1 text-blue-800 dark:text-blue-200">
                                        {objectives.length === 0 ? 'Empty' : 'Ready'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};