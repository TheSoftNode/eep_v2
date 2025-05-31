import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Plus, X, Tag, BarChart3, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ConfigurationSectionProps {
    difficulty: number;
    categories: string[];
    tags: string[];
    estimatedHours: number;
    onConfigChange: (field: string, value: any) => void;
    errors: Record<string, string>;
}

const SUGGESTED_CATEGORIES = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'UI/UX Design',
    'Cybersecurity',
    'Game Development',
    'Cloud Computing',
    'Blockchain',
    'Full Stack',
    'Frontend',
    'Backend',
    'Database',
    'API Development'
];

const SUGGESTED_TAGS = [
    'React',
    'Vue.js',
    'Angular',
    'Node.js',
    'Python',
    'JavaScript',
    'TypeScript',
    'HTML/CSS',
    'SQL',
    'NoSQL',
    'MongoDB',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Kubernetes',
    'Git',
    'REST API',
    'GraphQL',
    'Testing',
    'Agile',
    'Scrum',
    'CI/CD',
    'Microservices',
    'Authentication',
    'Security'
];

const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return 'Beginner';
    if (difficulty <= 6) return 'Intermediate';
    return 'Advanced';
};

const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
};

const getDifficultyDescription = (difficulty: number) => {
    if (difficulty <= 3) return 'Suitable for beginners with basic foundational knowledge';
    if (difficulty <= 6) return 'Appropriate for learners with some experience and core skills';
    return 'Designed for experienced learners ready for complex challenges';
};

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({
    difficulty,
    categories,
    tags,
    estimatedHours,
    onConfigChange,
    errors
}) => {
    const [newCategory, setNewCategory] = useState('');
    const [newTag, setNewTag] = useState('');
    const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);

    const handleAddCategory = (category?: string) => {
        const categoryToAdd = category || newCategory.trim();
        if (categoryToAdd && !categories.includes(categoryToAdd)) {
            const updatedCategories = [...categories, categoryToAdd];
            onConfigChange('categories', updatedCategories);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (categoryToRemove: string) => {
        const updatedCategories = categories.filter(cat => cat !== categoryToRemove);
        onConfigChange('categories', updatedCategories);
    };

    const handleAddTag = (tag?: string) => {
        const tagToAdd = tag || newTag.trim();
        if (tagToAdd && !tags.includes(tagToAdd)) {
            const updatedTags = [...tags, tagToAdd];
            onConfigChange('tags', updatedTags);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(t => t !== tagToRemove);
        onConfigChange('tags', updatedTags);
    };

    const handleDifficultyChange = (value: number[]) => {
        onConfigChange('difficulty', value[0]);
    };

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        onConfigChange('estimatedTotalHours', value);
    };

    const filteredCategorySuggestions = SUGGESTED_CATEGORIES.filter(
        category => !categories.includes(category) &&
            category.toLowerCase().includes(newCategory.toLowerCase())
    );

    const filteredTagSuggestions = SUGGESTED_TAGS.filter(
        tag => !tags.includes(tag) &&
            tag.toLowerCase().includes(newTag.toLowerCase())
    );

    const getHoursLabel = (hours: number) => {
        if (hours === 0) return 'Not specified';
        if (hours < 1) return `${Math.round(hours * 60)} minutes`;
        if (hours === 1) return '1 hour';
        if (hours < 24) return `${Math.round(hours * 10) / 10} hours`;
        const days = Math.round((hours / 8) * 10) / 10;
        return `${Math.round(hours * 10) / 10} hours (~${days} working days)`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                            <Settings className="h-4 w-4" />
                        </div>
                        Configuration & Metadata
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Set difficulty level, categories, tags, and time estimates for the learning path
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Difficulty Level */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-slate-600" />
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Difficulty Level: {difficulty}/10
                            </Label>
                        </div>

                        <div className="space-y-3">
                            <div className="px-3">
                                <Slider
                                    value={[difficulty]}
                                    onValueChange={handleDifficultyChange}
                                    max={10}
                                    min={1}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>1 - Easy</span>
                                    <span>5 - Medium</span>
                                    <span>10 - Expert</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <Badge className={cn("text-xs font-medium border", getDifficultyColor(difficulty))}>
                                    {getDifficultyLabel(difficulty)}
                                </Badge>
                                <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                                    {getDifficultyDescription(difficulty)}
                                </p>
                            </div>
                        </div>

                        {errors.difficulty && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300">{errors.difficulty}</p>
                            </div>
                        )}
                    </div>

                    {/* Estimated Hours */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-600" />
                            <Label htmlFor="estimated-hours" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Estimated Total Hours
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Input
                                id="estimated-hours"
                                type="number"
                                min="0"
                                step="0.5"
                                value={estimatedHours || ''}
                                onChange={handleHoursChange}
                                placeholder="e.g., 40"
                                className={cn(
                                    "transition-colors",
                                    errors.estimatedHours && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Total time learners should expect to spend: {getHoursLabel(estimatedHours)}
                            </p>
                        </div>

                        {errors.estimatedHours && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300">{errors.estimatedHours}</p>
                            </div>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-slate-600" />
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Categories ({categories.length})
                                </Label>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCategorySuggestions(!showCategorySuggestions)}
                                className="text-slate-600 dark:text-slate-400"
                            >
                                {showCategorySuggestions ? 'Hide' : 'Show'} Suggestions
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g., Web Development, Frontend"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCategory();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleAddCategory()}
                                    disabled={!newCategory.trim()}
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {showCategorySuggestions && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    {SUGGESTED_CATEGORIES.filter(cat => !categories.includes(cat)).map((category, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleAddCategory(category)}
                                            className="text-xs justify-start h-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {categories.map((category, index) => (
                                    <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 pr-1 dark:bg-slate-800 dark:text-slate-400">
                                        {category}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            onClick={() => handleRemoveCategory(category)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                                {categories.length === 0 && (
                                    <p className="text-sm text-slate-500">No categories added</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-slate-600" />
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Tags ({tags.length})
                                </Label>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowTagSuggestions(!showTagSuggestions)}
                                className="text-slate-600 dark:text-slate-400"
                            >
                                {showTagSuggestions ? 'Hide' : 'Show'} Suggestions
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g., React, Node.js, JavaScript"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleAddTag()}
                                    disabled={!newTag.trim()}
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {showTagSuggestions && (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 max-h-40 overflow-y-auto">
                                    {SUGGESTED_TAGS.filter(tag => !tags.includes(tag)).map((tag, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleAddTag(tag)}
                                            className="text-xs justify-start h-7 text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-1"
                                        >
                                            <Plus className="h-2 w-2 mr-1" />
                                            {tag}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-1">
                                {tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 pr-1 dark:bg-slate-800/50 dark:text-slate-400">
                                        {tag}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-3 w-3 ml-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            <X className="h-2 w-2" />
                                        </Button>
                                    </Badge>
                                ))}
                                {tags.length === 0 && (
                                    <p className="text-sm text-slate-500">No tags added</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Configuration Guidelines */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                            💡 Configuration Tips
                        </h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Set difficulty based on prerequisite knowledge and complexity</li>
                            <li>• Use categories to help learners find relevant content</li>
                            <li>• Add specific technology tags for better discoverability</li>
                            <li>• Estimate hours realistically including learning, practice, and project time</li>
                            <li>• Consider different learning speeds and skill levels</li>
                        </ul>
                    </div>

                    {/* Configuration Summary */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                            ⚙️ Configuration Summary
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                                <span className="text-slate-600 dark:text-slate-400 font-medium">Difficulty:</span>
                                <span className="ml-1 text-slate-800 dark:text-slate-200">
                                    {difficulty}/10 ({getDifficultyLabel(difficulty)})
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-600 dark:text-slate-400 font-medium">Duration:</span>
                                <span className="ml-1 text-slate-800 dark:text-slate-200">
                                    {estimatedHours || 0}h
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-600 dark:text-slate-400 font-medium">Categories:</span>
                                <span className="ml-1 text-slate-800 dark:text-slate-200">{categories.length}</span>
                            </div>
                            <div>
                                <span className="text-slate-600 dark:text-slate-400 font-medium">Tags:</span>
                                <span className="ml-1 text-slate-800 dark:text-slate-200">{tags.length}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};