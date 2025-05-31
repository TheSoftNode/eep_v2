import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Link,
    FileText,
    Plus,
    ExternalLink,
    Edit3,
    Trash2,
    MoreVertical,
    Code,
    Database,
    BookOpen,
    Eye,
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
    useGetProjectResourcesQuery,
    useDeleteProjectResourceMutation
} from '@/Redux/apiSlices/Projects/projectsApiSlice';

interface ProjectResourcesProps {
    projectId: string;
    canManage: boolean;
    className?: string;
}

const getResourceTypeIcon = (type: string) => {
    switch (type) {
        case 'document': return FileText;
        case 'code': return Code;
        case 'dataset': return Database;
        case 'guide': return BookOpen;
        case 'link': return Link;
        default: return FileText;
    }
};

const getResourceCategoryColor = (category?: string) => {
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

const ProjectResources: React.FC<ProjectResourcesProps> = ({
    projectId,
    canManage,
    className = ""
}) => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // API hooks
    const {
        data: resourcesResponse,
        isLoading: isLoadingResources,
        error: resourcesError,
        refetch: refetchResources
    } = useGetProjectResourcesQuery({
        projectId,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined
    });

    const [deleteResource, { isLoading: isDeletingResource }] = useDeleteProjectResourceMutation();

    const resources = resourcesResponse?.data || [];

    const handleOpenResource = (url?: string) => {
        if (!url) {
            toast({
                title: "No URL available",
                description: "This resource doesn't have a valid URL to open.",
                variant: "destructive",
            });
            return;
        }
        window.open(url, '_blank');
    };

    const handleDeleteResource = async (resourceId: string, resourceTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${resourceTitle}"?`)) {
            return;
        }

        try {
            await deleteResource({ projectId, resourceId }).unwrap();
            toast({
                title: "Resource Deleted",
                description: `"${resourceTitle}" has been removed from the project.`,
            });
        } catch (error: any) {
            toast({
                title: "Failed to Delete Resource",
                description: error?.data?.message || "An error occurred while deleting the resource.",
                variant: "destructive",
            });
        }
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const requiredResources = filteredResources.filter(r => r.isRequired);
    const optionalResources = filteredResources.filter(r => !r.isRequired);

    if (isLoadingResources) {
        return (
            <Card className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg", className)}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-32 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded animate-pulse" />
                        <div className="h-8 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-md animate-pulse" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
                            <div className="h-10 w-10 bg-emerald-200 dark:bg-emerald-800 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded" />
                                <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={className}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-60 rounded-t-lg" />

                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
                                <Link className="h-4 w-4" />
                            </div>
                            Project Resources
                        </CardTitle>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-medium">
                                {resources.length} resources
                            </Badge>
                            {canManage && (
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Resource
                                </Button>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Learning materials, tools, and references for this project
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Filters */}
                    {resources.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search resources..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
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
                                            className="group flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 rounded-lg border border-red-200/50 dark:border-red-800/30 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                                                <IconComponent className="h-5 w-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-medium text-slate-900 dark:text-white truncate">
                                                        {resource.title}
                                                    </h5>
                                                    <Badge className={cn("text-xs font-medium border", getResourceCategoryColor(resource.category))}>
                                                        {resource.category}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs text-red-600 border-red-300 dark:text-red-400 dark:border-red-800">
                                                        Required
                                                    </Badge>
                                                </div>
                                                {resource.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {resource.description}
                                                    </p>
                                                )}
                                                {resource.tags && resource.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {resource.tags.slice(0, 3).map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs py-0 px-2 h-5">
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

                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                    onClick={() => handleOpenResource(resource.url)}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>

                                                {canManage && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit3 className="h-4 w-4 mr-2" />
                                                                Edit Resource
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteResource(resource.id, resource.title)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Optional Resources */}
                    {optionalResources.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Additional Resources ({optionalResources.length})
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {optionalResources.map((resource) => {
                                    const IconComponent = getResourceTypeIcon(resource.type);
                                    return (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="group flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
                                                <IconComponent className="h-5 w-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-medium text-slate-900 dark:text-white truncate">
                                                        {resource.title}
                                                    </h5>
                                                    <Badge className={cn("text-xs font-medium border", getResourceCategoryColor(resource.category))}>
                                                        {resource.category}
                                                    </Badge>
                                                </div>
                                                {resource.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {resource.description}
                                                    </p>
                                                )}
                                                {resource.tags && resource.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {resource.tags.slice(0, 3).map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs py-0 px-2 h-5">
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

                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                    onClick={() => handleOpenResource(resource.url)}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>

                                                {canManage && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit3 className="h-4 w-4 mr-2" />
                                                                Edit Resource
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteResource(resource.id, resource.title)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
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
                                <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 blur-xl opacity-60 mx-auto" />
                                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                                    <Link className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
                                    ? 'No resources found'
                                    : 'No resources added yet'
                                }
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                                {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
                                    ? 'Try adjusting your search or filters to find resources.'
                                    : 'Add learning materials, tools, and references to help with this project.'
                                }
                            </p>
                            {canManage && !searchTerm && categoryFilter === 'all' && typeFilter === 'all' && (
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add First Resource
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProjectResources;