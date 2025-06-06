"use client"

import { useState, useEffect } from 'react';
import {
    Users, Search, User, ChevronDown, Shield,
    UserPlus, Filter, RefreshCw, Check, X, UserMinus, Loader2,
    Crown, Globe, Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import MemberListItem from './MemberListItem';
import { toast } from '@/hooks/use-toast';
import { WorkspaceMember } from '@/Redux/types/Workspace/workspace';
import { cn } from '@/lib/utils';
import { convertFirebaseDateRobust } from '@/components/utils/dateUtils';
import { useAddUserToWorkspaceMutation, useRemoveUserFromWorkspaceMutation, useUpdateWorkspaceMemberMutation } from '@/Redux/apiSlices/workspaces/workspaceMembersApi';
import { useGetAllUsersQuery } from '@/Redux/apiSlices/users/adminApi';
import { RemoveConfirmModal } from './RemoveConfirmModal';

interface WorkspaceMembersProps {
    workspaceId: string;
    mentors: WorkspaceMember[];
    learners: WorkspaceMember[];
    admins?: WorkspaceMember[];
    observers?: WorkspaceMember[];
    currentUserId: string;
    availableRoles: string[];
    creatorId: string;
    onMemberUpdate?: () => void;
}

export default function WorkspaceMembers({
    workspaceId,
    mentors,
    learners,
    admins = [],
    observers = [],
    currentUserId,
    availableRoles,
    creatorId,
    onMemberUpdate
}: WorkspaceMembersProps) {
    // State management
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [searchQuery, setSearchQuery] = useState('');
    const [mentorsOpen, setMentorsOpen] = useState(true);
    const [learnersOpen, setLearnersOpen] = useState(true);
    const [adminsOpen, setAdminsOpen] = useState(true);
    const [observersOpen, setObserversOpen] = useState(false);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState<WorkspaceMember | null>(null);
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('name');
    const [searchUserQuery, setSearchUserQuery] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userSpecialty, setUserSpecialty] = useState('');
    const [addUserFormErrors, setAddUserFormErrors] = useState({ user: '', role: '' });

    // RTK Query hooks
    const [addUserToWorkspace, { isLoading: isAddingUser }] = useAddUserToWorkspaceMutation();
    const [removeUserFromWorkspace, { isLoading: isRemovingUser }] = useRemoveUserFromWorkspaceMutation();
    const [updateWorkspaceMember, { isLoading: isUpdatingMember }] = useUpdateWorkspaceMemberMutation();

    const {
        data: usersData,
        isLoading: isLoadingUsers,
        refetch: refetchUsers
    } = useGetAllUsersQuery({
        page: page.toString(),
        limit: limit.toString(),
        orderBy: 'fullName',
    });

    // Filter out existing members
    const filterAvailableUsers = (users: any[] = []) => {
        const existingMemberIds = [...mentors, ...learners, ...admins, ...observers].map(member => member.userId);
        return users.filter(user => !existingMemberIds.includes(user.id));
    };

    const availableUsers = filterAvailableUsers(
        searchUserQuery.length >= 2
            ? usersData?.data?.filter(user =>
                user.fullName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchUserQuery.toLowerCase())
            )
            : usersData?.data
    );

    // Filter and sort members
    const filterMembers = (members: WorkspaceMember[]) => {
        let filtered = members;

        if (searchQuery) {
            filtered = filtered.filter(member =>
                member.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.workspaceRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(member =>
                member.workspaceRole?.toLowerCase() === roleFilter.toLowerCase()
            );
        }

        return [...filtered].sort((a, b) => {
            if (sortOrder === 'name') {
                return (a.fullName || '').localeCompare(b.fullName || '');
            } else if (sortOrder === 'role') {
                return (a.workspaceRole || '').localeCompare(b.workspaceRole || '');
            } else if (sortOrder === 'recent') {
                const aDate = a.joinedAt ? convertFirebaseDateRobust(a.joinedAt) : new Date(0);
                const bDate = b.joinedAt ? convertFirebaseDateRobust(b.joinedAt) : new Date(0);
                return bDate.getTime() - aDate.getTime();
            }
            return 0;
        });
    };

    const filteredMentors = filterMembers(mentors);
    const filteredLearners = filterMembers(learners);
    const filteredAdmins = filterMembers(admins);
    const filteredObservers = filterMembers(observers);


    // Event handlers
    const handleAddUser = async () => {
        const errors = {
            user: selectedUserId ? '' : 'Please select a user',
            role: userRole ? '' : 'Role is required'
        };

        setAddUserFormErrors(errors);
        if (errors.user || errors.role) return;

        try {
            await addUserToWorkspace({
                workspaceId,
                userId: selectedUserId,
                role: userRole as any,
                specialty: userSpecialty || undefined
            }).unwrap();

            toast({
                title: "Success",
                description: "User added to workspace successfully",
                variant: "default",
            });

            setIsAddUserDialogOpen(false);
            setSelectedUserId('');
            setUserRole('');
            setUserSpecialty('');
            setSearchUserQuery('');

            if (onMemberUpdate) onMemberUpdate();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add user to workspace",
                variant: "destructive",
            });
        }
    };

    const confirmRemoveUser = (member: WorkspaceMember) => {
        setUserToRemove(member); // This opens the modal
    };

    const handleRemoveUser = async () => {
        if (!userToRemove) return;

        try {
            await removeUserFromWorkspace({
                workspaceId,
                userId: userToRemove.userId
            }).unwrap();

            toast({
                title: "Success",
                description: "User removed from workspace successfully",
                variant: "default",
            });

            if (onMemberUpdate) onMemberUpdate();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove user from workspace",
                variant: "destructive",
            });
        } finally {
            setUserToRemove(null);
        }
    };

    useEffect(() => {
        return () => {
            setUserToRemove(null);
        };
    }, []);

    const handleChangeRole = async (memberId: string, newRole: string) => {
        try {
            await updateWorkspaceMember({
                workspaceId,
                userId: memberId,
                role: newRole as any
            }).unwrap();

            toast({
                title: "Success",
                description: `Role updated successfully`,
                variant: "default",
            });

            if (onMemberUpdate) onMemberUpdate();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user role",
                variant: "destructive",
            });
        }
    };

    const canManageMembers = () => {
        const allMembers = [...mentors, ...learners, ...admins, ...observers];
        const currentUser = allMembers.find(member => member.userId === currentUserId);
        return currentUserId === creatorId ||
            (currentUser && ['admin', 'mentor'].includes(currentUser.workspaceRole || ''));
    };

    const totalMembers = mentors.length + learners.length + admins.length + observers.length;

    useEffect(() => {
        refetchUsers();
    }, [refetchUsers]);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:justify-between gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                        </div>

                        {canManageMembers() && (
                            <Button
                                onClick={() => setIsAddUserDialogOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-sm rounded-lg"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Member
                            </Button>
                        )}

                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Team Members
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {totalMembers} members • {mentors.length + admins.length} leads
                        </p>
                    </div>


                </div>

                {/* Search and Filters */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search members..."
                            className="pl-9 h-9 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'>
                                <Button variant="outline" size="sm" className="h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ">
                                <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setRoleFilter('all')}>
                                    All roles
                                </DropdownMenuItem>
                                {availableRoles.map(role => (
                                    <DropdownMenuItem
                                        key={role}
                                        onClick={() => setRoleFilter(role)}
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {[
                                    { value: 'name', label: 'Name' },
                                    { value: 'role', label: 'Role' },
                                    { value: 'recent', label: 'Recently joined' }
                                ].map(({ value, label }) => (
                                    <DropdownMenuItem
                                        key={value}
                                        onClick={() => setSortOrder(value)}
                                    >
                                        {label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                {/* Admins Section */}
                {admins.length > 0 && (
                    <Collapsible open={adminsOpen} onOpenChange={setAdminsOpen}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Crown className="h-4 w-4 text-purple-600" />
                                <span className="font-medium text-slate-900 dark:text-white">Administrators</span>
                                <Badge variant="secondary" className="text-xs">
                                    {filteredAdmins.length}
                                </Badge>
                            </div>
                            <ChevronDown className={cn(
                                "h-4 w-4 text-slate-500 transition-transform",
                                adminsOpen && "rotate-180"
                            )} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 space-y-1">
                            {filteredAdmins.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">
                                    No administrators match your search
                                </p>
                            ) : (
                                filteredAdmins.map((admin) => (
                                    <MemberListItem
                                        key={admin.id}
                                        member={admin}
                                        isCurrentUser={admin.userId === currentUserId}
                                        canManage={canManageMembers()}
                                        isCreator={admin.userId === creatorId}
                                        onRemove={() => confirmRemoveUser(admin)}
                                        onChangeRole={handleChangeRole}
                                    />
                                ))
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                )}
                {/* Section Divider */}
                <div className="border-t border-slate-100 dark:border-slate-800"></div>

                {/* Mentors Section */}
                <Collapsible open={mentorsOpen} onOpenChange={setMentorsOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-slate-900 dark:text-white">Mentors</span>
                            <Badge variant="secondary" className="text-xs">
                                {filteredMentors.length}
                            </Badge>
                        </div>
                        <ChevronDown className={cn(
                            "h-4 w-4 text-slate-500 transition-transform",
                            mentorsOpen && "rotate-180"
                        )} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-1">
                        {filteredMentors.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">
                                No mentors match your search
                            </p>
                        ) : (
                            filteredMentors.map((mentor) => (
                                <MemberListItem
                                    key={mentor.id}
                                    member={mentor}
                                    isCurrentUser={mentor.userId === currentUserId}
                                    canManage={canManageMembers()}
                                    isCreator={mentor.userId === creatorId}
                                    onRemove={() => confirmRemoveUser(mentor)}
                                    onChangeRole={handleChangeRole}
                                />
                            ))
                        )}
                    </CollapsibleContent>
                </Collapsible>
                {/* Section Divider */}
                <div className="border-t border-slate-100 dark:border-slate-800"></div>

                {/* Learners Section */}
                <Collapsible open={learnersOpen} onOpenChange={setLearnersOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-slate-900 dark:text-white">Team Members</span>
                            <Badge variant="secondary" className="text-xs">
                                {filteredLearners.length}
                            </Badge>
                        </div>
                        <ChevronDown className={cn(
                            "h-4 w-4 text-slate-500 transition-transform",
                            learnersOpen && "rotate-180"
                        )} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-1">
                        {filteredLearners.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">
                                No team members match your search
                            </p>
                        ) : (
                            filteredLearners.map((learner) => (
                                <MemberListItem
                                    key={learner.id}
                                    member={learner}
                                    isCurrentUser={learner.userId === currentUserId}
                                    canManage={canManageMembers()}
                                    isCreator={learner.userId === creatorId}
                                    onRemove={() => confirmRemoveUser(learner)}
                                    onChangeRole={handleChangeRole}
                                />
                            ))
                        )}
                    </CollapsibleContent>
                </Collapsible>
                {/* Section Divider */}
                <div className="border-t border-slate-100 dark:border-slate-800"></div>

                {/* Observers Section */}
                {observers.length > 0 && (
                    <Collapsible open={observersOpen} onOpenChange={setObserversOpen}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-slate-600" />
                                <span className="font-medium text-slate-900 dark:text-white">Observers</span>
                                <Badge variant="secondary" className="text-xs">
                                    {filteredObservers.length}
                                </Badge>
                            </div>
                            <ChevronDown className={cn(
                                "h-4 w-4 text-slate-500 transition-transform",
                                observersOpen && "rotate-180"
                            )} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 space-y-1">
                            {filteredObservers.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">
                                    No observers match your search
                                </p>
                            ) : (
                                filteredObservers.map((observer) => (
                                    <MemberListItem
                                        key={observer.id}
                                        member={observer}
                                        isCurrentUser={observer.userId === currentUserId}
                                        canManage={canManageMembers()}
                                        isCreator={observer.userId === creatorId}
                                        onRemove={() => confirmRemoveUser(observer)}
                                        onChangeRole={handleChangeRole}
                                    />
                                ))
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto dark:bg-slate-900  border border-slate-200 dark:border-slate-800 shadow-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Add Team Member
                        </DialogTitle>
                        <DialogDescription>
                            Select a user and assign them a role in this workspace
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                Find User
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchUserQuery}
                                    onChange={(e) => setSearchUserQuery(e.target.value)}
                                    className={cn(
                                        "pl-9",
                                        addUserFormErrors.user && "border-red-500"
                                    )}
                                />
                            </div>
                            {addUserFormErrors.user && (
                                <p className="text-sm text-red-500 mt-1">{addUserFormErrors.user}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                Available Users
                            </label>
                            <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-2">
                                {isLoadingUsers ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        <span className="text-sm text-slate-500">Loading users...</span>
                                    </div>
                                ) : availableUsers && availableUsers.length > 0 ? (
                                    availableUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className={cn(
                                                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                                                selectedUserId === user.id
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                            )}
                                            onClick={() => setSelectedUserId(user.id)}
                                        >
                                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium overflow-hidden">
                                                {user.profilePicture ? (
                                                    <img src={user.profilePicture} alt={user.fullName} className="h-full w-full object-cover" />
                                                ) : (
                                                    user.fullName.charAt(0)
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                    {user.fullName}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            {selectedUserId === user.id && (
                                                <Check className="h-4 w-4 text-blue-600" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-6">
                                        {searchUserQuery.length > 0 ? 'No matching users found' : 'No users available to add'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Workspace Role
                                </label>
                                <Select value={userRole} onValueChange={setUserRole}>
                                    <SelectTrigger className={cn(addUserFormErrors.role && "border-red-500")}>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {addUserFormErrors.role && (
                                    <p className="text-sm text-red-500 mt-1">{addUserFormErrors.role}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Specialty <span className="text-slate-400">(optional)</span>
                                </label>
                                <Input
                                    placeholder="e.g., Frontend Developer"
                                    value={userSpecialty}
                                    onChange={(e) => setUserSpecialty(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddUserDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddUser}
                            disabled={isAddingUser}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isAddingUser ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Add Member
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Remove Dialog */}
            {/* <Dialog open={confirmRemoveDialogOpen} onOpenChange={setConfirmRemoveDialogOpen}> */}
            {/* <Dialog
                open={confirmRemoveDialogOpen}
                onOpenChange={(open) => {
                    console.log('Dialog onOpenChange called with:', open);
                    setConfirmRemoveDialogOpen(open);
                    if (!open) {
                        console.log('Clearing userToRemove');
                        setUserToRemove(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserMinus className="h-5 w-5 text-red-600" />
                            Remove Team Member
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove <span className="font-medium">{userToRemove?.fullName}</span> from this workspace?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                This action cannot be undone. The user will lose access to all workspace resources.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmRemoveDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRemoveUser}
                            disabled={isRemovingUser}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isRemovingUser ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Removing...
                                </>
                            ) : (
                                <>
                                    <UserMinus className="h-4 w-4 mr-2" />
                                    Remove Member
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
            <RemoveConfirmModal
                member={userToRemove}
                onConfirm={handleRemoveUser}
                onCancel={() => setUserToRemove(null)}
                isLoading={isRemovingUser}
            />
        </div>
    );
}