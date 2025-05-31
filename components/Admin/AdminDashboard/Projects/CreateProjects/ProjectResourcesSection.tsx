import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Github, FileText, Plus, X, Globe, Code, Database, BookOpen, Wrench, AlertCircle, Trash2, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
    useAddProjectResourceMutation,
    useGetProjectResourcesQuery,
    useDeleteProjectResourceMutation,
    useUpdateProjectResourceMutation
} from "@/Redux/apiSlices/Projects/projectsApiSlice";
import { Project } from "@/Redux/types/Projects";

interface ProjectResource {
    id?: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'link' | 'code' | 'dataset' | 'template' | 'guide' | 'other';
    category: 'learning' | 'reference' | 'tool' | 'research' | 'dataset';
    url: string;
    isRequired: boolean;
    tags: string[];
}

interface ProjectResourcesSectionProps {
    project?: Project; // Add project prop for edit mode
    formData: {
        repoUrl: string;
        demoUrl: string;
    };
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onArrayChange: (name: string, values: string[]) => void;
    projectId?: string; // Optional - only available after project is created
}

const RESOURCE_TYPES = [
    { value: 'document', label: 'Document', icon: FileText },
    { value: 'video', label: 'Video', icon: FileText },
    { value: 'link', label: 'Link', icon: Link },
    { value: 'code', label: 'Code', icon: Code },
    { value: 'dataset', label: 'Dataset', icon: Database },
    { value: 'template', label: 'Template', icon: FileText },
    { value: 'guide', label: 'Guide', icon: BookOpen },
    { value: 'other', label: 'Other', icon: FileText }
];

const RESOURCE_CATEGORIES = [
    { value: 'learning', label: 'Learning Material' },
    { value: 'reference', label: 'Reference' },
    { value: 'tool', label: 'Tool' },
    { value: 'research', label: 'Research' },
    { value: 'dataset', label: 'Dataset' }
];

const getResourceTypeIcon = (type: string) => {
    const resourceType = RESOURCE_TYPES.find(rt => rt.value === type);
    return resourceType ? resourceType.icon : FileText;
};

const getResourceCategoryColor = (category?: string) => {
    switch (category) {
        case 'learning':
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
        case 'reference':
            return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
        case 'tool':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
        case 'research':
            return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
        case 'dataset':
            return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
};

export const ProjectResourcesSection: React.FC<ProjectResourcesSectionProps> = ({
    formData,
    errors,
    onInputChange,
    onArrayChange,
    projectId
}) => {
    const { toast } = useToast();

    // API hooks
    const [addProjectResource, { isLoading: isAddingResource }] = useAddProjectResourceMutation();
    const [deleteProjectResource, { isLoading: isDeletingResource }] = useDeleteProjectResourceMutation();
    const [updateProjectResource, { isLoading: isUpdatingResource }] = useUpdateProjectResourceMutation();

    // Fetch existing resources if projectId exists (edit mode)
    const { data: resourcesResponse, isLoading: isLoadingResources, refetch: refetchResources } = useGetProjectResourcesQuery(
        { projectId: projectId! },
        { skip: !projectId }
    );

    const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<ProjectResource | null>(null);
    const [newResource, setNewResource] = useState<ProjectResource>({
        title: '',
        description: '',
        type: 'link',
        category: 'learning',
        url: '',
        isRequired: false,
        tags: []
    });
    const [newTag, setNewTag] = useState('');

    const resources = resourcesResponse?.data || [];

    // Reset form when dialog closes
    useEffect(() => {
        if (!isResourceDialogOpen) {
            setEditingResource(null);
            setNewResource({
                title: '',
                description: '',
                type: 'link',
                category: 'learning',
                url: '',
                isRequired: false,
                tags: []
            });
            setNewTag('');
        }
    }, [isResourceDialogOpen]);

    // Populate form when editing
    useEffect(() => {
        if (editingResource) {
            setNewResource({
                ...editingResource,
                tags: editingResource.tags || []
            });
        }
    }, [editingResource]);

    const handleAddTag = () => {
        if (newTag.trim() && !newResource.tags.includes(newTag.trim())) {
            setNewResource(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setNewResource(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const handleResourceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewResource(prev => ({ ...prev, [name]: value }));
    };

    const handleAddOrUpdateResource = async () => {
        if (!projectId) {
            toast({
                title: "Project Required",
                description: "Please create the project first before adding resources.",
                variant: "destructive",
            });
            return;
        }

        if (!newResource.title.trim() || !newResource.url.trim()) {
            toast({
                title: "Missing Fields",
                description: "Please fill in the title and URL.",
                variant: "destructive",
            });
            return;
        }

        try {
            if (editingResource && editingResource.id) {
                // Update existing resource
                await updateProjectResource({
                    projectId,
                    resourceId: editingResource.id,
                    data: {
                        title: newResource.title,
                        description: newResource.description,
                        type: newResource.type,
                        category: newResource.category,
                        url: newResource.url,
                        isRequired: newResource.isRequired,
                        tags: newResource.tags
                    }
                }).unwrap();

                toast({
                    title: "Resource Updated",
                    description: "Project resource has been successfully updated.",
                });
            } else {
                // Add new resource
                await addProjectResource({
                    projectId,
                    title: newResource.title,
                    description: newResource.description,
                    type: newResource.type,
                    category: newResource.category,
                    url: newResource.url,
                    isRequired: newResource.isRequired,
                    tags: newResource.tags
                }).unwrap();

                toast({
                    title: "Resource Added",
                    description: "Project resource has been successfully added.",
                });
            }

            // Refresh resources list
            refetchResources();
            setIsResourceDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to save resource. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteResource = async (resourceId: string, resourceTitle: string) => {
        if (!projectId) return;

        if (!confirm(`Are you sure you want to delete "${resourceTitle}"?`)) {
            return;
        }

        try {
            await deleteProjectResource({ projectId, resourceId }).unwrap();
            toast({
                title: "Resource Deleted",
                description: "Project resource has been successfully deleted.",
            });
            refetchResources();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to delete resource. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditResource = (resource: any) => {
        setEditingResource({
            id: resource.id,
            title: resource.title,
            description: resource.description || '',
            type: resource.type,
            category: resource.category || 'learning',
            url: resource.url,
            isRequired: resource.isRequired || false,
            tags: resource.tags || []
        });
        setIsResourceDialogOpen(true);
    };

    const resetResourceForm = () => {
        setEditingResource(null);
        setNewResource({
            title: '',
            description: '',
            type: 'link',
            category: 'learning',
            url: '',
            isRequired: false,
            tags: []
        });
        setNewTag('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                            <Link className="h-4 w-4" />
                        </div>
                        Project Resources & Links
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Repository, demo links, and additional learning resources
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Repository and Demo URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="repoUrl" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                Repository URL
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Link to the project's source code repository
                            </p>
                            <Input
                                id="repoUrl"
                                name="repoUrl"
                                placeholder="https://github.com/username/repository"
                                value={formData.repoUrl}
                                onChange={onInputChange}
                                className={cn(
                                    "transition-colors",
                                    errors.repoUrl && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                            {errors.repoUrl && (
                                <p className="text-sm text-red-500">{errors.repoUrl}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="demoUrl" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Demo URL
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Link to the live demo or deployed application
                            </p>
                            <Input
                                id="demoUrl"
                                name="demoUrl"
                                placeholder="https://demo.example.com"
                                value={formData.demoUrl}
                                onChange={onInputChange}
                                className={cn(
                                    "transition-colors",
                                    errors.demoUrl && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                            />
                            {errors.demoUrl && (
                                <p className="text-sm text-red-500">{errors.demoUrl}</p>
                            )}
                        </div>
                    </div>

                    {/* Additional Resources Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Additional Resources ({resources.length})
                            </Label>
                            <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
                                        onClick={() => {
                                            if (!projectId) {
                                                toast({
                                                    title: "Create Project First",
                                                    description: "Please create the project before adding resources.",
                                                    variant: "destructive",
                                                });
                                                return;
                                            }
                                            resetResourceForm();
                                            setIsResourceDialogOpen(true);
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Resource
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingResource ? 'Edit Resource' : 'Add Project Resource'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingResource
                                                ? 'Update the resource information'
                                                : 'Add learning materials, references, tools, or other resources for this project'
                                            }
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="resource-title">Title <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="resource-title"
                                                    name="title"
                                                    value={newResource.title}
                                                    onChange={handleResourceInputChange}
                                                    placeholder="e.g., React Documentation"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="resource-url">URL <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="resource-url"
                                                    name="url"
                                                    value={newResource.url}
                                                    onChange={handleResourceInputChange}
                                                    placeholder="https://example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Resource Type</Label>
                                                <Select value={newResource.type} onValueChange={(value) => setNewResource(prev => ({ ...prev, type: value as any }))}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {RESOURCE_TYPES.map((type) => {
                                                            const IconComponent = type.icon;
                                                            return (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    <div className="flex items-center gap-2">
                                                                        <IconComponent className="h-4 w-4" />
                                                                        {type.label}
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <Select value={newResource.category} onValueChange={(value) => setNewResource(prev => ({ ...prev, category: value as any }))}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {RESOURCE_CATEGORIES.map((category) => (
                                                            <SelectItem key={category.value} value={category.value}>
                                                                {category.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="resource-description">Description</Label>
                                            <Textarea
                                                id="resource-description"
                                                name="description"
                                                value={newResource.description}
                                                onChange={handleResourceInputChange}
                                                placeholder="Brief description of this resource and how it helps with the project"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Tags</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Add tag"
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
                                                    onClick={handleAddTag}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {newResource.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {tag}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-3 w-3 ml-1 hover:bg-red-100"
                                                            onClick={() => handleRemoveTag(tag)}
                                                        >
                                                            <X className="h-2 w-2" />
                                                        </Button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="required-resource"
                                                checked={newResource.isRequired}
                                                onCheckedChange={(checked) => setNewResource(prev => ({ ...prev, isRequired: checked }))}
                                            />
                                            <Label htmlFor="required-resource" className="text-sm">
                                                This is a required resource
                                            </Label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddOrUpdateResource}
                                            disabled={!newResource.title.trim() || !newResource.url.trim() || isAddingResource || isUpdatingResource}
                                        >
                                            {(isAddingResource || isUpdatingResource)
                                                ? (editingResource ? 'Updating...' : 'Adding...')
                                                : (editingResource ? 'Update Resource' : 'Add Resource')
                                            }
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Resources List */}
                        {projectId ? (
                            isLoadingResources ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                                    <p className="text-sm text-slate-500 mt-2">Loading resources...</p>
                                </div>
                            ) : resources.length > 0 ? (
                                <div className="space-y-3">
                                    {resources.map((resource) => {
                                        const ResourceIcon = getResourceTypeIcon(resource.type);
                                        return (
                                            <motion.div
                                                key={resource.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                                            <ResourceIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-medium text-slate-900 dark:text-white">
                                                                    {resource.title}
                                                                </h4>
                                                                <Badge className={cn("text-xs font-medium border", getResourceCategoryColor(resource.category))}>
                                                                    {RESOURCE_CATEGORIES.find(c => c.value === resource.category)?.label}
                                                                </Badge>
                                                                {resource.isRequired && (
                                                                    <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                                                                        Required
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {resource.description && (
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                                    {resource.description}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <a
                                                                    href={resource.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline truncate"
                                                                >
                                                                    {resource.url}
                                                                </a>
                                                            </div>
                                                            {resource.tags && resource.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {resource.tags.map((tag, index) => (
                                                                        <Badge key={index} variant="outline" className="text-xs">
                                                                            {tag}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                                            onClick={() => handleEditResource(resource)}
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDeleteResource(resource.id, resource.title)}
                                                            disabled={isDeletingResource}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-sm">No additional resources added yet</p>
                                    <p className="text-xs mt-1">Click "Add Resource" to get started</p>
                                </div>
                            )
                        ) : (
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                            Create Project First
                                        </h4>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            Additional resources can be added after the project is created. You can add learning materials, references, tools, and datasets to help participants.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

