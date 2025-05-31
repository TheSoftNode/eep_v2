// "use client"

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Users, Search, User, ChevronDown, Shield,
//     UserPlus, Filter, RefreshCw, Check, X, UserMinus, Loader2,
//     Crown, Globe, Sparkles
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger
// } from '@/components/ui/collapsible';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import MemberListItem from './MemberListItem';
// import { toast } from '@/hooks/use-toast';
// import { WorkspaceMember } from '@/Redux/types/Workspace/workspace';
// import { cn } from '@/lib/utils';
// import { convertFirebaseDateRobust } from '@/components/utils/dateUtils';
// import { useAddUserToWorkspaceMutation, useRemoveUserFromWorkspaceMutation, useUpdateWorkspaceMemberMutation } from '@/Redux/apiSlices/workspaces/workspaceMembersApi';
// import { useGetAllUsersQuery } from '@/Redux/apiSlices/users/adminApi';

// interface WorkspaceMembersProps {
//     workspaceId: string;
//     mentors: WorkspaceMember[];
//     learners: WorkspaceMember[];
//     admins?: WorkspaceMember[];
//     observers?: WorkspaceMember[];
//     currentUserId: string;
//     availableRoles: string[];
//     creatorId: string;
//     onMemberUpdate?: () => void;
// }

// export default function WorkspaceMembers({
//     workspaceId,
//     mentors,
//     learners,
//     admins = [],
//     observers = [],
//     currentUserId,
//     availableRoles,
//     creatorId,
//     onMemberUpdate
// }: WorkspaceMembersProps) {
//     // State management
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(50);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [mentorsOpen, setMentorsOpen] = useState(true);
//     const [learnersOpen, setLearnersOpen] = useState(true);
//     const [adminsOpen, setAdminsOpen] = useState(true);
//     const [observersOpen, setObserversOpen] = useState(false);
//     const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
//     const [userToRemove, setUserToRemove] = useState<WorkspaceMember | null>(null);
//     const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = useState(false);
//     const [roleFilter, setRoleFilter] = useState('all');
//     const [sortOrder, setSortOrder] = useState('name');
//     const [searchUserQuery, setSearchUserQuery] = useState('');
//     const [selectedUserId, setSelectedUserId] = useState('');
//     const [userRole, setUserRole] = useState('');
//     const [userSpecialty, setUserSpecialty] = useState('');
//     const [addUserFormErrors, setAddUserFormErrors] = useState({ user: '', role: '' });

//     // RTK Query hooks
//     const [addUserToWorkspace, { isLoading: isAddingUser }] = useAddUserToWorkspaceMutation();
//     const [removeUserFromWorkspace, { isLoading: isRemovingUser }] = useRemoveUserFromWorkspaceMutation();
//     const [updateWorkspaceMember, { isLoading: isUpdatingMember }] = useUpdateWorkspaceMemberMutation();

//     const {
//         data: usersData,
//         isLoading: isLoadingUsers,
//         refetch: refetchUsers
//     } = useGetAllUsersQuery({
//         page: page.toString(),
//         limit: limit.toString(),
//         orderBy: 'fullName',
//     });

//     // Filter out existing members
//     const filterAvailableUsers = (users: any[] = []) => {
//         const existingMemberIds = [...mentors, ...learners, ...admins, ...observers].map(member => member.userId);
//         return users.filter(user => !existingMemberIds.includes(user.id));
//     };

//     const availableUsers = filterAvailableUsers(
//         searchUserQuery.length >= 2
//             ? usersData?.data?.filter(user =>
//                 user.fullName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
//                 user.email.toLowerCase().includes(searchUserQuery.toLowerCase())
//             )
//             : usersData?.data
//     );

//     // Filter and sort members
//     // Replace the problematic sort function with this corrected version
//     const filterMembers = (members: WorkspaceMember[]) => {
//         let filtered = members;

//         if (searchQuery) {
//             filtered = filtered.filter(member =>
//                 member.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 member.workspaceRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 member.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         if (roleFilter !== 'all') {
//             filtered = filtered.filter(member =>
//                 member.workspaceRole?.toLowerCase() === roleFilter.toLowerCase()
//             );
//         }

//         return [...filtered].sort((a, b) => {
//             if (sortOrder === 'name') {
//                 return (a.fullName || '').localeCompare(b.fullName || '');
//             } else if (sortOrder === 'role') {
//                 return (a.workspaceRole || '').localeCompare(b.workspaceRole || '');
//             } else if (sortOrder === 'recent') {
//                 const aDate = a.joinedAt ? convertFirebaseDateRobust(a.joinedAt) : new Date(0);
//                 const bDate = b.joinedAt ? convertFirebaseDateRobust(b.joinedAt) : new Date(0);
//                 return bDate.getTime() - aDate.getTime();
//             }
//             return 0;
//         });
//     };

//     const filteredMentors = filterMembers(mentors);
//     const filteredLearners = filterMembers(learners);
//     const filteredAdmins = filterMembers(admins);
//     const filteredObservers = filterMembers(observers);

//     // Event handlers
//     const handleAddUser = async () => {
//         const errors = {
//             user: selectedUserId ? '' : 'Please select a user',
//             role: userRole ? '' : 'Role is required'
//         };

//         setAddUserFormErrors(errors);
//         if (errors.user || errors.role) return;

//         try {
//             await addUserToWorkspace({
//                 workspaceId,
//                 userId: selectedUserId,
//                 role: userRole as any,
//                 specialty: userSpecialty || undefined
//             }).unwrap();

//             toast({
//                 title: "Success",
//                 description: "User added to workspace successfully",
//                 variant: "default",
//             });

//             setIsAddUserDialogOpen(false);
//             setSelectedUserId('');
//             setUserRole('');
//             setUserSpecialty('');
//             setSearchUserQuery('');

//             if (onMemberUpdate) onMemberUpdate();
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to add user to workspace",
//                 variant: "destructive",
//             });
//         }
//     };

//     const confirmRemoveUser = (member: WorkspaceMember) => {
//         setUserToRemove(member);
//         setConfirmRemoveDialogOpen(true);
//     };

//     const handleRemoveUser = async () => {
//         if (!userToRemove) return;

//         try {
//             await removeUserFromWorkspace({
//                 workspaceId,
//                 userId: userToRemove.userId
//             }).unwrap();

//             toast({
//                 title: "Success",
//                 description: "User removed from workspace successfully",
//                 variant: "default",
//             });

//             setConfirmRemoveDialogOpen(false);
//             setUserToRemove(null);

//             if (onMemberUpdate) onMemberUpdate();
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to remove user from workspace",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleChangeRole = async (memberId: string, newRole: string) => {
//         try {
//             await updateWorkspaceMember({
//                 workspaceId,
//                 userId: memberId,
//                 role: newRole as any
//             }).unwrap();

//             toast({
//                 title: "Success",
//                 description: `Role updated successfully`,
//                 variant: "default",
//             });

//             if (onMemberUpdate) onMemberUpdate();
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to update user role",
//                 variant: "destructive",
//             });
//         }
//     };

//     const canManageMembers = () => {
//         const allMembers = [...mentors, ...learners, ...admins, ...observers];
//         const currentUser = allMembers.find(member => member.userId === currentUserId);
//         return currentUserId === creatorId ||
//             (currentUser && ['admin', 'mentor'].includes(currentUser.workspaceRole || ''));
//     };

//     const totalMembers = mentors.length + learners.length + admins.length + observers.length;

//     useEffect(() => {
//         refetchUsers();
//     }, [refetchUsers]);

//     return (
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
//             {/* Elegant Gradient Header */}
//             {/* <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div> */}

//             {/* Enhanced Header Section */}
//             <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
//                     <div className="flex items-center">
//                         <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 mr-4 shadow-lg">
//                             <Users className="h-6 w-6 text-white" />
//                         </div>
//                         <div>
//                             <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Team Members</h2>
//                             <p className="text-slate-600 dark:text-slate-400 mt-1">
//                                 Manage your workspace team members and roles
//                             </p>
//                             <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
//                                 <span className="flex items-center">
//                                     <Sparkles className="h-3 w-3 mr-1" />
//                                     {totalMembers} total members
//                                 </span>
//                                 <span>•</span>
//                                 <span>{mentors.length + admins.length} mentors & admins</span>
//                                 <span>•</span>
//                                 <span>{learners.length} team members</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* {canManageMembers() && ( */}
//                     <Button
//                         onClick={() => setIsAddUserDialogOpen(true)}
//                         className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
//                     >
//                         <UserPlus className="h-4 w-4" />
//                         <span>Add Member</span>
//                     </Button>
//                     {/* )} */}
//                 </div>

//                 {/* Enhanced Search and Filter Section */}
//                 <div className="mt-6 flex flex-col sm:flex-row gap-4">
//                     <div className="relative flex-grow">
//                         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
//                         <Input
//                             type="search"
//                             placeholder="Search by name, email, or role..."
//                             className="w-full pl-11 py-3 text-sm border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                     </div>

//                     <div className="flex gap-3">
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button
//                                     variant="outline"
//                                     className="flex items-center gap-2 px-4 py-3 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 rounded-xl shadow-sm transition-all duration-200"
//                                 >
//                                     <Filter className="h-4 w-4" />
//                                     <span>Filter</span>
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl rounded-xl">
//                                 <DropdownMenuLabel className="text-slate-700 dark:text-slate-300 font-semibold px-3 py-2">
//                                     Filter by role
//                                 </DropdownMenuLabel>
//                                 <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
//                                 <DropdownMenuItem
//                                     className={cn(
//                                         "cursor-pointer mx-2 rounded-lg transition-all duration-200",
//                                         roleFilter === 'all'
//                                             ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300'
//                                             : ''
//                                     )}
//                                     onClick={() => setRoleFilter('all')}
//                                 >
//                                     All roles
//                                 </DropdownMenuItem>
//                                 {availableRoles.map(role => (
//                                     <DropdownMenuItem
//                                         key={role}
//                                         className={cn(
//                                             "cursor-pointer mx-2 rounded-lg transition-all duration-200",
//                                             roleFilter === role
//                                                 ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300'
//                                                 : ''
//                                         )}
//                                         onClick={() => setRoleFilter(role)}
//                                     >
//                                         {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
//                                     </DropdownMenuItem>
//                                 ))}
//                             </DropdownMenuContent>
//                         </DropdownMenu>

//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button
//                                     variant="outline"
//                                     className="flex items-center gap-2 px-4 py-3 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 rounded-xl shadow-sm transition-all duration-200"
//                                 >
//                                     <RefreshCw className="h-4 w-4" />
//                                     <span>Sort</span>
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl rounded-xl">
//                                 <DropdownMenuLabel className="text-slate-700 dark:text-slate-300 font-semibold px-3 py-2">
//                                     Sort by
//                                 </DropdownMenuLabel>
//                                 <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
//                                 {[
//                                     { value: 'name', label: 'Name' },
//                                     { value: 'role', label: 'Role' },
//                                     { value: 'recent', label: 'Recently joined' }
//                                 ].map(({ value, label }) => (
//                                     <DropdownMenuItem
//                                         key={value}
//                                         className={cn(
//                                             "cursor-pointer mx-2 rounded-lg transition-all duration-200",
//                                             sortOrder === value
//                                                 ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300'
//                                                 : ''
//                                         )}
//                                         onClick={() => setSortOrder(value)}
//                                     >
//                                         {label}
//                                     </DropdownMenuItem>
//                                 ))}
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </div>
//                 </div>
//             </div>

//             {/* Enhanced Members Sections */}
//             <div className="p-6 space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto">
//                 {/* Admins Section */}
//                 {admins.length > 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <Collapsible
//                             open={adminsOpen}
//                             onOpenChange={setAdminsOpen}
//                             className="border rounded-xl border-purple-200 dark:border-purple-800 overflow-hidden shadow-sm"
//                         >
//                             <CollapsibleTrigger asChild>
//                                 <div className="flex justify-between items-center px-6 py-4 cursor-pointer bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-800/30 dark:hover:to-indigo-800/30 transition-all duration-200">
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm">
//                                             <Crown className="h-4 w-4 text-white" />
//                                         </div>
//                                         <span className="text-base font-semibold text-purple-800 dark:text-purple-200">Administrators</span>
//                                         <Badge variant="outline" className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 px-2 py-1">
//                                             {filteredAdmins.length}
//                                         </Badge>
//                                     </div>
//                                     <ChevronDown
//                                         className={cn(
//                                             "h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform duration-200",
//                                             adminsOpen && "transform rotate-180"
//                                         )}
//                                     />
//                                 </div>
//                             </CollapsibleTrigger>
//                             <CollapsibleContent className="bg-white dark:bg-slate-900">
//                                 <AnimatePresence>
//                                     {filteredAdmins.length === 0 ? (
//                                         <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
//                                             <Crown className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                                             No administrators match your search
//                                         </div>
//                                     ) : (
//                                         <ul>
//                                             {filteredAdmins.map((admin) => (
//                                                 <MemberListItem
//                                                     key={admin.id}
//                                                     member={admin}
//                                                     isCurrentUser={admin.userId === currentUserId}
//                                                     canManage={canManageMembers()}
//                                                     isCreator={admin.userId === creatorId}
//                                                     onRemove={() => confirmRemoveUser(admin)}
//                                                     onChangeRole={handleChangeRole}
//                                                 />
//                                             ))}
//                                         </ul>
//                                     )}
//                                 </AnimatePresence>
//                             </CollapsibleContent>
//                         </Collapsible>
//                     </motion.div>
//                 )}

//                 {/* Mentors Section */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.1 }}
//                 >
//                     <Collapsible
//                         open={mentorsOpen}
//                         onOpenChange={setMentorsOpen}
//                         className="border rounded-xl border-indigo-200 dark:border-indigo-800 overflow-hidden shadow-sm"
//                     >
//                         <CollapsibleTrigger asChild>
//                             <div className="flex justify-between items-center px-6 py-4 cursor-pointer bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-800/30 dark:hover:to-blue-800/30 transition-all duration-200">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 shadow-sm">
//                                         <Shield className="h-4 w-4 text-white" />
//                                     </div>
//                                     <span className="text-base font-semibold text-indigo-800 dark:text-indigo-200">Mentors</span>
//                                     <Badge variant="outline" className="text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 px-2 py-1">
//                                         {filteredMentors.length}
//                                     </Badge>
//                                 </div>
//                                 <ChevronDown
//                                     className={cn(
//                                         "h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform duration-200",
//                                         mentorsOpen && "transform rotate-180"
//                                     )}
//                                 />
//                             </div>
//                         </CollapsibleTrigger>
//                         <CollapsibleContent className="bg-white dark:bg-slate-900">
//                             <AnimatePresence>
//                                 {filteredMentors.length === 0 ? (
//                                     <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
//                                         <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                                         No mentors match your search
//                                     </div>
//                                 ) : (
//                                     <ul>
//                                         {filteredMentors.map((mentor) => (
//                                             <MemberListItem
//                                                 key={mentor.id}
//                                                 member={mentor}
//                                                 isCurrentUser={mentor.userId === currentUserId}
//                                                 canManage={canManageMembers()}
//                                                 isCreator={mentor.userId === creatorId}
//                                                 onRemove={() => confirmRemoveUser(mentor)}
//                                                 onChangeRole={handleChangeRole}
//                                             />
//                                         ))}
//                                     </ul>
//                                 )}
//                             </AnimatePresence>
//                         </CollapsibleContent>
//                     </Collapsible>
//                 </motion.div>

//                 {/* Learners Section */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.2 }}
//                 >
//                     <Collapsible
//                         open={learnersOpen}
//                         onOpenChange={setLearnersOpen}
//                         className="border rounded-xl border-green-200 dark:border-green-800 overflow-hidden shadow-sm"
//                     >
//                         <CollapsibleTrigger asChild>
//                             <div className="flex justify-between items-center px-6 py-4 cursor-pointer bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 transition-all duration-200">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm">
//                                         <User className="h-4 w-4 text-white" />
//                                     </div>
//                                     <span className="text-base font-semibold text-green-800 dark:text-green-200">Team Members</span>
//                                     <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 px-2 py-1">
//                                         {filteredLearners.length}
//                                     </Badge>
//                                 </div>
//                                 <ChevronDown
//                                     className={cn(
//                                         "h-5 w-5 text-green-600 dark:text-green-400 transition-transform duration-200",
//                                         learnersOpen && "transform rotate-180"
//                                     )}
//                                 />
//                             </div>
//                         </CollapsibleTrigger>
//                         <CollapsibleContent className="bg-white dark:bg-slate-900">
//                             <AnimatePresence>
//                                 {filteredLearners.length === 0 ? (
//                                     <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
//                                         <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                                         No team members match your search
//                                     </div>
//                                 ) : (
//                                     <ul>
//                                         {filteredLearners.map((learner) => (
//                                             <MemberListItem
//                                                 key={learner.id}
//                                                 member={learner}
//                                                 isCurrentUser={learner.userId === currentUserId}
//                                                 canManage={canManageMembers()}
//                                                 isCreator={learner.userId === creatorId}
//                                                 onRemove={() => confirmRemoveUser(learner)}
//                                                 onChangeRole={handleChangeRole}
//                                             />
//                                         ))}
//                                     </ul>
//                                 )}
//                             </AnimatePresence>
//                         </CollapsibleContent>
//                     </Collapsible>
//                 </motion.div>

//                 {/* Observers Section */}
//                 {observers.length > 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.3 }}
//                     >
//                         <Collapsible
//                             open={observersOpen}
//                             onOpenChange={setObserversOpen}
//                             className="border rounded-xl border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
//                         >
//                             <CollapsibleTrigger asChild>
//                                 <div className="flex justify-between items-center px-6 py-4 cursor-pointer bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-800/30 dark:hover:to-gray-800/30 transition-all duration-200">
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-2 rounded-lg bg-gradient-to-r from-slate-500 to-gray-500 shadow-sm">
//                                             <Globe className="h-4 w-4 text-white" />
//                                         </div>
//                                         <span className="text-base font-semibold text-slate-800 dark:text-slate-200">Observers</span>
//                                         <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 px-2 py-1">
//                                             {filteredObservers.length}
//                                         </Badge>
//                                     </div>
//                                     <ChevronDown
//                                         className={cn(
//                                             "h-5 w-5 text-slate-600 dark:text-slate-400 transition-transform duration-200",
//                                             observersOpen && "transform rotate-180"
//                                         )}
//                                     />
//                                 </div>
//                             </CollapsibleTrigger>
//                             <CollapsibleContent className="bg-white dark:bg-slate-900">
//                                 <AnimatePresence>
//                                     {filteredObservers.length === 0 ? (
//                                         <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
//                                             <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                                             No observers match your search
//                                         </div>
//                                     ) : (
//                                         <ul>
//                                             {filteredObservers.map((observer) => (
//                                                 <MemberListItem
//                                                     key={observer.id}
//                                                     member={observer}
//                                                     isCurrentUser={observer.userId === currentUserId}
//                                                     canManage={canManageMembers()}
//                                                     isCreator={observer.userId === creatorId}
//                                                     onRemove={() => confirmRemoveUser(observer)}
//                                                     onChangeRole={handleChangeRole}
//                                                 />
//                                             ))}
//                                         </ul>
//                                     )}
//                                 </AnimatePresence>
//                             </CollapsibleContent>
//                         </Collapsible>
//                     </motion.div>
//                 )}
//             </div>

//             {/* Enhanced Add User Dialog */}
//             <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
//                 <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
//                     <DialogHeader>
//                         <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
//                             <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 mr-3 shadow-sm">
//                                 <UserPlus className="h-5 w-5 text-white" />
//                             </div>
//                             Add Team Member
//                         </DialogTitle>
//                         <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2">
//                             Select a user and assign them a role in this workspace
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="grid gap-6 py-6">
//                         <div className="space-y-6">
//                             <div>
//                                 <label htmlFor="user-search" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
//                                     Find User
//                                 </label>
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
//                                     <Input
//                                         id="user-search"
//                                         type="search"
//                                         placeholder="Search by name or email..."
//                                         value={searchUserQuery}
//                                         onChange={(e) => setSearchUserQuery(e.target.value)}
//                                         className={cn(
//                                             "pl-10 py-3 border-slate-300 dark:border-slate-600 rounded-xl",
//                                             addUserFormErrors.user && "border-red-500 dark:border-red-700"
//                                         )}
//                                     />
//                                 </div>
//                                 {addUserFormErrors.user && (
//                                     <p className="text-sm text-red-500 dark:text-red-400 mt-2">{addUserFormErrors.user}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
//                                     Available Users
//                                 </label>
//                                 <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-slate-50 dark:bg-slate-800">
//                                     {isLoadingUsers ? (
//                                         <div className="flex items-center justify-center py-8">
//                                             <Loader2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-spin mr-3" />
//                                             <span className="text-sm text-slate-500 dark:text-slate-400">Loading users...</span>
//                                         </div>
//                                     ) : availableUsers && availableUsers.length > 0 ? (
//                                         <div className="space-y-2">
//                                             {availableUsers.map(user => (
//                                                 <motion.div
//                                                     key={user.id}
//                                                     initial={{ opacity: 0, scale: 0.95 }}
//                                                     animate={{ opacity: 1, scale: 1 }}
//                                                     transition={{ duration: 0.2 }}
//                                                     className={cn(
//                                                         "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200",
//                                                         selectedUserId === user.id
//                                                             ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm'
//                                                             : 'hover:bg-white dark:hover:bg-slate-700 border-2 border-transparent'
//                                                     )}
//                                                     onClick={() => setSelectedUserId(user.id)}
//                                                 >
//                                                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800 dark:to-purple-800 flex items-center justify-center text-sm font-semibold overflow-hidden shadow-sm">
//                                                         {user.profilePicture ? (
//                                                             <img src={user.profilePicture} alt={user.fullName} className="h-full w-full object-cover" />
//                                                         ) : (
//                                                             user.fullName.charAt(0)
//                                                         )}
//                                                     </div>
//                                                     <div className="flex-1">
//                                                         <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.fullName}</p>
//                                                         <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
//                                                         {user.role && (
//                                                             <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">System Role: {user.role}</p>
//                                                         )}
//                                                     </div>
//                                                     {selectedUserId === user.id && (
//                                                         <div className="p-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm">
//                                                             <Check className="h-4 w-4 text-white" />
//                                                         </div>
//                                                     )}
//                                                 </motion.div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
//                                             <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                                             {searchUserQuery.length > 0 ? 'No matching users found' : 'No users available to add'}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="role" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
//                                         Workspace Role
//                                     </label>
//                                     <Select value={userRole} onValueChange={setUserRole}>
//                                         <SelectTrigger
//                                             id="role"
//                                             className={cn(
//                                                 "py-3 border-slate-300 dark:border-slate-600 rounded-xl",
//                                                 addUserFormErrors.role && "border-red-500 dark:border-red-700"
//                                             )}
//                                         >
//                                             <SelectValue placeholder="Select a role" />
//                                         </SelectTrigger>
//                                         <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
//                                             {availableRoles.map((role) => (
//                                                 <SelectItem key={role} value={role}>
//                                                     {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     {addUserFormErrors.role && (
//                                         <p className="text-sm text-red-500 dark:text-red-400 mt-2">{addUserFormErrors.role}</p>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <label htmlFor="specialty" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
//                                         Specialty <span className="text-slate-400">(optional)</span>
//                                     </label>
//                                     <Input
//                                         id="specialty"
//                                         placeholder="e.g., Frontend Developer, Data Analyst"
//                                         value={userSpecialty}
//                                         onChange={(e) => setUserSpecialty(e.target.value)}
//                                         className="py-3 border-slate-300 dark:border-slate-600 rounded-xl"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <DialogFooter className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => setIsAddUserDialogOpen(false)}
//                             className="px-6 py-3 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="button"
//                             onClick={handleAddUser}
//                             disabled={isAddingUser}
//                             className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg rounded-xl"
//                         >
//                             {isAddingUser ? (
//                                 <span className="flex items-center">
//                                     <Loader2 className="h-4 w-4 text-white mr-2 animate-spin" />
//                                     Adding...
//                                 </span>
//                             ) : (
//                                 <span className="flex items-center">
//                                     <Check className="mr-2 h-4 w-4" />
//                                     Add Member
//                                 </span>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Enhanced Confirm Remove Dialog */}
//             <Dialog open={confirmRemoveDialogOpen} onOpenChange={setConfirmRemoveDialogOpen}>
//                 <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
//                     <DialogHeader>
//                         <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
//                             <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 mr-3 shadow-sm">
//                                 <UserMinus className="h-5 w-5 text-white" />
//                             </div>
//                             Remove Team Member
//                         </DialogTitle>
//                         <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2">
//                             Are you sure you want to remove <span className="font-semibold text-slate-800 dark:text-slate-200">{userToRemove?.fullName}</span> from this workspace?
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="py-6">
//                         <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
//                             <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">
//                                 ⚠️ This action cannot be undone
//                             </p>
//                             <p className="text-sm text-red-600 dark:text-red-400">
//                                 The user will lose access to all workspace resources and will need to be re-invited to rejoin.
//                             </p>
//                         </div>
//                     </div>

//                     <DialogFooter className="flex gap-3">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => setConfirmRemoveDialogOpen(false)}
//                             className="px-6 py-3 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="button"
//                             onClick={handleRemoveUser}
//                             disabled={isRemovingUser}
//                             className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-xl"
//                         >
//                             {isRemovingUser ? (
//                                 <span className="flex items-center">
//                                     <Loader2 className="h-4 w-4 text-white mr-2 animate-spin" />
//                                     Removing...
//                                 </span>
//                             ) : (
//                                 <span className="flex items-center">
//                                     <UserMinus className="mr-2 h-4 w-4" />
//                                     Remove Member
//                                 </span>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }

"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = useState(false);
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
        setUserToRemove(member);
        setConfirmRemoveDialogOpen(true);
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

            setConfirmRemoveDialogOpen(false);
            setUserToRemove(null);

            if (onMemberUpdate) onMemberUpdate();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove user from workspace",
                variant: "destructive",
            });
        }
    };

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
        <div className="bg-white dark:bg-slate-900 h-fit border border-slate-200 dark:border-slate-800 shadow-sm">
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
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 px-3">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
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
                                <Button variant="outline" size="sm" className="h-9 px-3">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
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
            <Dialog open={confirmRemoveDialogOpen} onOpenChange={setConfirmRemoveDialogOpen}>
                <DialogContent className="sm:max-w-md">
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
            </Dialog>
        </div>
    );
}