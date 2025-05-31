"use client"

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Plus, X, Calendar, Settings, Globe, Lock, Building, Shield, Users, UserCheck, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UpdateWorkspaceRequest } from '@/Redux/types/Workspace/workspace-dtos';
import { toast } from '@/hooks/use-toast';
import { useGetWorkspaceByIdQuery, useUpdateWorkspaceMutation } from '@/Redux/apiSlices/workspaces/workspaceApi';
import { convertFirebaseDateRobust } from '@/components/utils/dateUtils';

interface EditWorkspaceDialogProps {
    open: boolean;
    onClose: () => void;
    workspaceId: string;
    onSuccess?: () => void;
}

export default function EditWorkspaceDialog({
    open,
    onClose,
    workspaceId,
    onSuccess
}: EditWorkspaceDialogProps) {
    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [projectType, setProjectType] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<'draft' | 'active' | 'paused' | 'completed' | 'archived'>('active');
    const [roleInput, setRoleInput] = useState('');
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);

    // New fields from create workspace
    const [visibility, setVisibility] = useState<'public' | 'private' | 'organization'>('private');
    const [joinApproval, setJoinApproval] = useState<'automatic' | 'admin_approval' | 'mentor_approval'>('admin_approval');
    const [allowLearnerInvites, setAllowLearnerInvites] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        description: '',
    });

    // RTK Query hooks
    const { data: workspaceData, isLoading: isLoadingWorkspace } = useGetWorkspaceByIdQuery(
        workspaceId,
        { skip: !open || !workspaceId }
    );
    const [updateWorkspace, { isLoading: isUpdating }] = useUpdateWorkspaceMutation();

    // Populate form with existing workspace data
    useEffect(() => {
        if (workspaceData?.data) {
            const workspace = workspaceData.data;
            setName(workspace.name || '');
            setDescription(workspace.description || '');
            setProjectType(workspace.projectType || '');
            setTags(workspace.tags || []);
            setStatus(workspace.status || 'active');
            setAvailableRoles(workspace.availableRoles || []);

            // New fields
            setVisibility(workspace.visibility || 'private');
            setJoinApproval(workspace.joinApproval || 'admin_approval');
            setAllowLearnerInvites(workspace.allowLearnerInvites || false);

            // Format dates using your existing helper functions
            if (workspace.startDate) {
                const date = convertFirebaseDateRobust(workspace.startDate);
                setStartDate(date.toISOString().split('T')[0]);
            }

            if (workspace.endDate) {
                const date = convertFirebaseDateRobust(workspace.endDate);
                setEndDate(date.toISOString().split('T')[0]);
            }
        }
    }, [workspaceData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        const newErrors = {
            name: name.trim() ? '' : 'Workspace name is required',
            description: description.trim() ? '' : 'Description is required',
        };

        setErrors(newErrors);

        if (newErrors.name || newErrors.description) {
            return;
        }

        const updateData: UpdateWorkspaceRequest = {
            workspaceId,
            name: name.trim(),
            description: description.trim(),
            projectType: projectType || undefined,
            tags,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            status,
            availableRoles,
            visibility,
            joinApproval,
            allowLearnerInvites
        };

        try {
            await updateWorkspace(updateData).unwrap();

            toast({
                title: "Workspace Updated",
                description: "Your workspace has been updated successfully",
            });

            onClose();
            onSuccess?.();
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error?.data?.message || "Failed to update workspace. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Tag management
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setTagInput('');
            }
        }
    };

    const handleAddTagButton = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Role management
    const handleAddRole = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newRole = roleInput.trim();
            if (newRole && !availableRoles.includes(newRole)) {
                setAvailableRoles([...availableRoles, newRole]);
                setRoleInput('');
            }
        }
    };

    const handleAddRoleButton = () => {
        const newRole = roleInput.trim();
        if (newRole && !availableRoles.includes(newRole)) {
            setAvailableRoles([...availableRoles, newRole]);
            setRoleInput('');
        }
    };

    const handleRemoveRole = (roleToRemove: string) => {
        setAvailableRoles(availableRoles.filter(role => role !== roleToRemove));
    };

    const getVisibilityIcon = (vis: string) => {
        switch (vis) {
            case 'public': return Globe;
            case 'organization': return Building;
            default: return Lock;
        }
    };

    const getStatusColor = (stat: string) => {
        switch (stat) {
            case 'active': return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700';
            case 'completed': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            case 'paused': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700';
            case 'draft': return 'bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            case 'archived': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
            default: return '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-2">
                            <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Edit Workspace
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                                Update workspace settings and configuration
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {isLoadingWorkspace ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6 py-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Basic Information
                            </h3>

                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Workspace Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter workspace name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`mt-1 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? "border-red-400 dark:border-red-600" : ""
                                            }`}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the purpose and goals of this workspace"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className={`mt-1 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? "border-red-400 dark:border-red-600" : ""
                                            }`}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="projectType" className="text-slate-800 dark:text-slate-200 font-medium">
                                            Project Type
                                        </Label>
                                        <Input
                                            id="projectType"
                                            placeholder="Web Development, Mobile App, etc."
                                            value={projectType}
                                            onChange={(e) => setProjectType(e.target.value)}
                                            className="mt-1 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="status" className="text-slate-800 dark:text-slate-200 font-medium">
                                            Status
                                        </Label>
                                        <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                                            <SelectTrigger className="mt-1 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="paused">Paused</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Timeline
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startDate" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Start Date
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="mt-1 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endDate" className="text-slate-800 dark:text-slate-200 font-medium">
                                        End Date <span className="text-slate-400">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="mt-1 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                            <Label className="text-slate-800 dark:text-slate-200 font-medium">
                                Tags & Technologies
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add tags (press Enter or comma)"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddTagButton}
                                    className="border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Available Roles */}
                        <div className="space-y-4">
                            <Label className="text-slate-800 dark:text-slate-200 font-medium">
                                Available Roles
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {availableRoles.map((role) => (
                                    <Badge key={role} variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                                        {role}
                                        {['admin', 'mentor'].includes(role) && <Shield className="h-3 w-3 ml-1" />}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRole(role)}
                                            className="ml-1 hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add custom roles (press Enter or comma)"
                                    value={roleInput}
                                    onChange={(e) => setRoleInput(e.target.value)}
                                    onKeyDown={handleAddRole}
                                    className="border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddRoleButton}
                                    className="border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Access Configuration */}
                        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Access Configuration
                            </h3>

                            <div className="grid gap-4">
                                <div>
                                    <Label className="text-slate-800 dark:text-slate-200 font-medium">
                                        Workspace Visibility
                                    </Label>
                                    <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                                        <SelectTrigger className="mt-1 border-slate-200 dark:border-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                            <SelectItem value="private">
                                                <div className="flex items-center">
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    Private - Invite only
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="organization">
                                                <div className="flex items-center">
                                                    <Building className="h-4 w-4 mr-2" />
                                                    Organization - All org members
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="public">
                                                <div className="flex items-center">
                                                    <Globe className="h-4 w-4 mr-2" />
                                                    Public - Anyone can find
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-slate-800 dark:text-slate-200 font-medium">
                                        Join Approval
                                    </Label>
                                    <Select value={joinApproval} onValueChange={(value: any) => setJoinApproval(value)}>
                                        <SelectTrigger className="mt-1 border-slate-200 dark:border-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                            <SelectItem value="automatic">Automatic</SelectItem>
                                            <SelectItem value="mentor_approval">Mentor Approval</SelectItem>
                                            <SelectItem value="admin_approval">Admin Approval</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center space-x-3">
                                        <UserCheck className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        <div>
                                            <Label className="text-slate-900 dark:text-slate-100 font-medium">
                                                Allow Learner Invites
                                            </Label>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Let learners invite others to the workspace
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={allowLearnerInvites}
                                        onCheckedChange={setAllowLearnerInvites}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Current Status Preview */}
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                <div className="flex items-center justify-between">
                                    <span>Current Status:</span>
                                    <Badge className={getStatusColor(status)}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Badge>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <DialogFooter className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isUpdating}
                        className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isUpdating || !name.trim() || !description.trim()}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Update Workspace
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}