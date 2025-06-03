"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    FileText,
    Code,
    Database,
    BookOpen,
    ExternalLink,
    Play,
    Search,
    Eye,
    Calendar,
    Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FirebaseDate, ProjectResource, ResourceCategory, ResourceType } from '@/Redux/types/Projects';

interface LearningResourcesProps {
    resources: ProjectResource[];
    projectId?: string;
    canManage?: boolean;
    className?: string;
}

// Utility functions
const getResourceTypeIcon = (type: ResourceType) => {
    switch (type) {
        case 'document': return FileText;
        case 'code': return Code;
        case 'dataset': return Database;
        case 'guide': return BookOpen;
        case 'video': return Play;
        case 'link': return ExternalLink;
        case 'template': return FileText;
        case 'other': return FileText;
        default: return FileText;
    }
};

const getResourceCategoryColor = (category?: ResourceCategory) => {
    switch (category) {
        case 'learning':
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
        case 'reference':
            return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50';
        case 'tool':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
        case 'research':
            return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50';
        case 'dataset':
            return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800/50';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
};

const formatDate = (date: FirebaseDate) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) :
        date instanceof Date ? date :
            '_seconds' in date ? new Date(date._seconds * 1000) : new Date();
    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

export default function LearningResources({
    resources,
    projectId,
    canManage = false,
    className = ""
}: LearningResourcesProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | ResourceCategory>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | ResourceType>('all');

    const handleOpenResource = (url?: string) => {
        if (!url) return;
        window.open(url, '_blank');
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
        const matchesType = typeFilter === 'all' || resource.type === typeFilter;

        return matchesSearch && matchesCategory && matchesType;
    });

    const requiredResources = filteredResources.filter(r => r.isRequired);
    const optionalResources = filteredResources.filter(r => !r.isRequired);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={className}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-80" />

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl -mr-16 -mt-16 pointer-events-none" />

                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Learning Resources
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                    Materials and references for your project
                                </CardDescription>
                            </div>
                        </div>

                        <Badge variant="outline" className="text-xs font-medium border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400">
                            {resources.length} resources
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5 relative">
                    {/* Search and Filters */}
                    {resources.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search resources..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as 'all' | ResourceCategory)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="learning">Learning</SelectItem>
                                        <SelectItem value="reference">Reference</SelectItem>
                                        <SelectItem value="tool">Tool</SelectItem>
                                        <SelectItem value="research">Research</SelectItem>
                                        <SelectItem value="dataset">Dataset</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as 'all' | ResourceType)}>
                                    <SelectTrigger className="w-28">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="document">Document</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="link">Link</SelectItem>
                                        <SelectItem value="code">Code</SelectItem>
                                        <SelectItem value="dataset">Dataset</SelectItem>
                                        <SelectItem value="template">Template</SelectItem>
                                        <SelectItem value="guide">Guide</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Required Resources */}
                    {requiredResources.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Required Resources ({requiredResources.length})
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {requiredResources.map((resource) => {
                                    const IconComponent = getResourceTypeIcon(resource.type);
                                    return (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="group flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 rounded-lg border border-red-200/50 dark:border-red-800/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                                            onClick={() => handleOpenResource(resource.url)}
                                        >
                                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                                                <IconComponent className="h-5 w-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                                                        {resource.title}
                                                    </h5>
                                                    {resource.category && (
                                                        <Badge className={cn("text-xs font-medium border", getResourceCategoryColor(resource.category))}>
                                                            {resource.category}
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="text-xs text-red-600 border-red-300 dark:text-red-400 dark:border-red-800">
                                                        Required
                                                    </Badge>
                                                </div>
                                                {resource.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                                                        {resource.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="capitalize">{resource.type}</span>
                                                    {resource.addedAt && (
                                                        <>
                                                            <span>•</span>
                                                            <Calendar className="h-3 w-3" />
                                                            <span>Added {formatDate(resource.addedAt)}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {resource.tags && resource.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {resource.tags.slice(0, 3).map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs py-0 px-2 h-5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                                <Tag className="h-2 w-2 mr-1" />
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {resource.tags.length > 3 && (
                                                            <Badge variant="secondary" className="text-xs py-0 px-2 h-5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                                +{resource.tags.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenResource(resource.url);
                                                }}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Optional Resources */}
                    {optionalResources.length > 0 && (
                        <div className="space-y-3">
                            {requiredResources.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Additional Resources ({optionalResources.length})
                                    </h4>
                                </div>
                            )}
                            <div className="space-y-2">
                                {optionalResources.map((resource) => {
                                    const IconComponent = getResourceTypeIcon(resource.type);
                                    return (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="group flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 cursor-pointer"
                                            onClick={() => handleOpenResource(resource.url)}
                                        >
                                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                                                <IconComponent className="h-5 w-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {resource.title}
                                                    </h5>
                                                    {resource.category && (
                                                        <Badge className={cn("text-xs font-medium border", getResourceCategoryColor(resource.category))}>
                                                            {resource.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {resource.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                                                        {resource.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="capitalize">{resource.type}</span>
                                                    {resource.addedAt && (
                                                        <>
                                                            <span>•</span>
                                                            <Calendar className="h-3 w-3" />
                                                            <span>Added {formatDate(resource.addedAt)}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {resource.tags && resource.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {resource.tags.slice(0, 3).map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs py-0 px-2 h-5">
                                                                <Tag className="h-2 w-2 mr-1" />
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {resource.tags.length > 3 && (
                                                            <Badge variant="secondary" className="text-xs py-0 px-2 h-5">
                                                                +{resource.tags.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenResource(resource.url);
                                                }}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredResources.length === 0 && (
                        <div className="text-center py-12">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-100 to-purple-200 dark:from-indigo-900/20 dark:to-purple-800/20 blur-xl opacity-60 mx-auto" />
                                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
                                    <BookOpen className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
                                    ? 'No resources found'
                                    : 'No resources available'
                                }
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                                {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
                                    ? 'Try adjusting your search or filters to find resources.'
                                    : 'Resources will appear here when they are added to your project.'
                                }
                            </p>
                        </div>
                    )}
                </CardContent>

                {resources.length > 0 && (
                    <CardFooter className="border-t border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
                        <Button asChild variant="ghost" className="w-full group hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                            <Link href="/dashboard/resources" className="flex items-center justify-center">
                                <Eye className="h-4 w-4 mr-2" />
                                Browse All Resources
                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                            </Link>
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );
}