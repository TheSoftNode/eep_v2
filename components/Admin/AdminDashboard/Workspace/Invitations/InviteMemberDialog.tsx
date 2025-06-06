"use client"

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    UserPlus,
    Mail,
    CheckCircle,
    XCircle,
    Clock,
    Crown,
    GraduationCap,
    Loader2,
    Calendar,
    MoreHorizontal,
    Search,
    RefreshCw,
    Users,
    Send,
    Settings,
    Filter,
    Watch
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkspaceInvitation } from '@/Redux/types/Workspace/workspace';
import { firebaseFormatDate } from '@/components/utils/dateUtils';
import { useCancelInvitationMutation, useCreateInvitationMutation, useGetWorkspaceInvitationsQuery } from '@/Redux/apiSlices/workspaces/workspaceInvitationApi';

interface InviteMemberDialogProps {
    open: boolean;
    onClose: () => void;
    workspaceId: string;
    workspaceName: string;
    availableRoles: string[];
    onInvite?: (email: string, role: string) => Promise<void>;
}

export default function InviteMemberDialog({
    open,
    onClose,
    workspaceId,
    workspaceName,
    availableRoles,
    onInvite
}: InviteMemberDialogProps) {
    const [activeTab, setActiveTab] = useState('invite');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        role: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // RTK Query hooks
    const [createInvitation, { isLoading: isInviting }] = useCreateInvitationMutation();
    const {
        data: invitationsResponse,
        isLoading: isLoadingInvitations,
        refetch: refetchInvitations
    } = useGetWorkspaceInvitationsQuery({ workspaceId }, {
        skip: activeTab !== 'manage'
    });
    const [cancelInvitation, { isLoading: isCancelling }] = useCancelInvitationMutation();

    useEffect(() => {
        if (open) {
            setEmail('');
            setRole('');
            setSpecialty('');
            setMessage('');
            setErrors({ email: '', role: '' });

            if (availableRoles && availableRoles.length > 0) {
                setRole(availableRoles[0]);
            }
        }
    }, [open, availableRoles]);

    const formatDate = (dateString: string | Date) => {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    };

    const filteredInvitations = () => {
        if (!invitationsResponse?.data) return [];

        let filtered = [...invitationsResponse.data];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(invitation =>
                invitation.recipientEmail.toLowerCase().includes(query) ||
                invitation.role.toLowerCase().includes(query) ||
                (invitation.specialty && invitation.specialty.toLowerCase().includes(query))
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(invitation => invitation.status === filterStatus);
        }

        return filtered;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            email: '',
            role: '',
        };

        if (!email.trim() || !email.includes('@')) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);

        if (newErrors.email || newErrors.role) {
            return;
        }

        try {
            if (onInvite) {
                await onInvite(email, role);
            } else {
                await createInvitation({
                    workspaceId,
                    email,
                    role: role as 'mentor' | 'learner',
                    specialty: specialty || undefined,
                    message: message || undefined
                }).unwrap();
            }

            toast({
                title: "Invitation Sent Successfully",
                description: `Invitation sent to ${email} as ${role}`,
                variant: "default",
            });

            setEmail('');
            setRole(availableRoles[0] || '');
            setSpecialty('');
            setMessage('');

            if (activeTab === 'invite') {
                onClose();
            } else {
                refetchInvitations();
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast({
                title: "Failed to Send Invitation",
                description: "Please try again or contact support if the issue persists.",
                variant: "destructive",
            });
        }
    };

    const handleCancelInvitation = async (invitationId: string) => {
        try {
            await cancelInvitation(invitationId).unwrap();

            toast({
                title: "Invitation Cancelled",
                description: "The invitation has been successfully cancelled",
                variant: "default",
            });

            refetchInvitations();
        } catch (error) {
            console.error('Error cancelling invitation:', error);
            toast({
                title: "Failed to Cancel Invitation",
                description: "Please try again or contact support if the issue persists.",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700">
                        <Clock className="mr-1 h-3 w-3" /> Pending
                    </Badge>
                );
            case 'accepted':
                return (
                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                        <CheckCircle className="mr-1 h-3 w-3" /> Accepted
                    </Badge>
                );
            case 'declined':
                return (
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700">
                        <XCircle className="mr-1 h-3 w-3" /> Declined
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                        {status}
                    </Badge>
                );
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'mentor':
                return (
                    <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700">
                        <Crown className="mr-1 h-3 w-3" /> Mentor
                    </Badge>
                );
            case 'admin':
                return (
                    <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                        <Crown className="mr-1 h-3 w-3" /> Admin
                    </Badge>
                );
            case 'learner':
                return (
                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                        <GraduationCap className="mr-1 h-3 w-3" /> Learner
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="bg-violet-50 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-700">
                        {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                    </Badge>
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-2">
                            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Team Management
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                                Invite new members and manage invitations for "{workspaceName}"
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs
                    defaultValue="invite"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1">
                        <TabsTrigger
                            value="invite"
                            className="text-slate-600 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Send Invitation
                        </TabsTrigger>
                        <TabsTrigger
                            value="manage"
                            className="text-slate-600 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm"
                            onClick={refetchInvitations}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Invitations
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="invite" className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="colleague@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? "border-red-400 dark:border-red-600" : ""}`}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Role <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={role} onValueChange={setRole}>
                                        <SelectTrigger
                                            id="role"
                                            className={`border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 ${errors.role ? "border-red-400 dark:border-red-600" : ""}`}
                                        >
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                            {availableRoles.map((availableRole) => (
                                                <SelectItem key={availableRole} value={availableRole}>
                                                    <div className="flex items-center space-x-2">
                                                        {availableRole === 'mentor' && <Crown className="h-4 w-4 text-indigo-500" />}
                                                        {availableRole === 'admin' && <Crown className="h-4 w-4 text-purple-500" />}
                                                        {availableRole === 'learner' && <GraduationCap className="h-4 w-4 text-emerald-500" />}
                                                        {availableRole === 'observer' && <Search className="h-4 w-4 text-emerald-500" />}
                                                        <span>
                                                            {availableRole === 'mentor' ? 'Mentor' :
                                                                availableRole === 'admin' ? 'Admin' :
                                                                    availableRole.charAt(0).toUpperCase() + availableRole.slice(1).replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.role}</p>
                                    )}
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Define the member's role and permissions within this workspace
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="specialty" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Specialty <span className="text-slate-400">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="specialty"
                                        placeholder="e.g., React Development, UI/UX Design, Data Science"
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                        className="border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Area of expertise or focus within the workspace
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="message" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Personal Message <span className="text-slate-400">(Optional)</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Add a personal welcome message to make your invitation more engaging"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={3}
                                        className="border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="flex gap-3 justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isInviting}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    {isInviting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Invitation...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Send Invitation
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="manage" className="space-y-6">
                        {/* Filters and search */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-between">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search invitations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-full sm:w-40 border-slate-200 dark:border-slate-700">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Filter status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="accepted">Accepted</SelectItem>
                                        <SelectItem value="declined">Declined</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={() => refetchInvitations()}
                                    className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Invitations list */}
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                            {isLoadingInvitations ? (
                                <div className="flex items-center justify-center p-12">
                                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mr-3" />
                                    <span className="text-slate-600 dark:text-slate-400">Loading invitations...</span>
                                </div>
                            ) : !invitationsResponse?.data || invitationsResponse.data.length === 0 ? (
                                <div className="text-center py-12 px-6">
                                    <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 w-16 h-16 mx-auto mb-4">
                                        <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No invitations found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                                        No invitations have been sent for this workspace yet
                                    </p>
                                    <Button
                                        onClick={() => setActiveTab('invite')}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Send First Invitation
                                    </Button>
                                </div>
                            ) : filteredInvitations().length === 0 ? (
                                <div className="text-center py-12 px-6">
                                    <div className="rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-4 w-16 h-16 mx-auto mb-4">
                                        <Search className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No matching invitations</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                                        Try adjusting your search or filter criteria
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setFilterStatus('all');
                                        }}
                                        variant="outline"
                                        className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredInvitations().map((invitation: WorkspaceInvitation) => (
                                        <div key={invitation.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center mb-3">
                                                        <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-2 mr-3">
                                                            <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                                {invitation.recipientEmail}
                                                            </h3>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                Invited {firebaseFormatDate(invitation.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {getStatusBadge(invitation.status)}
                                                        {getRoleBadge(invitation.role)}
                                                        {invitation.specialty && (
                                                            <Badge variant="outline" className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700">
                                                                {invitation.specialty}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {invitation.message && (
                                                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                                                "{invitation.message}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {invitation.status === 'pending' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCancelInvitation(invitation.id)}
                                                            disabled={isCancelling}
                                                            className="border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Cancel
                                                        </Button>
                                                    )}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                            <DropdownMenuLabel className="text-slate-700 dark:text-slate-300">Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                                            {invitation.status === 'pending' && (
                                                                <DropdownMenuItem
                                                                    onClick={() => handleCancelInvitation(invitation.id)}
                                                                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300"
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-2" />
                                                                    Cancel Invitation
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setEmail(invitation.recipientEmail);
                                                                    setRole(invitation.role);
                                                                    setSpecialty(invitation.specialty || '');
                                                                    setActiveTab('invite');
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <UserPlus className="h-4 w-4 mr-2" />
                                                                Resend Similar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => refetchInvitations()}
                                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setActiveTab('invite')}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                New Invitation
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}