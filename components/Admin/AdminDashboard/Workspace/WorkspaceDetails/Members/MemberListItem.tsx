// "use client"

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     MessageSquare, Calendar, MoreHorizontal, UserMinus,
//     Mail, Crown, Shield, Award, ChevronDown, ChevronUp, Globe
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from '@/components/ui/tooltip';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { WorkspaceMember } from '@/Redux/types/Workspace/workspace';
// import { cn } from '@/lib/utils';
// import { convertFirebaseDateRobust, firebaseFormatDate } from '@/components/utils/dateUtils';

// // Define elegant role color schemes matching your design
// const roleColors = {
//     admin: 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
//     mentor: 'bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
//     learner: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
//     observer: 'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
//     default: 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
// };

// interface MemberListItemProps {
//     member: WorkspaceMember;
//     isCurrentUser: boolean;
//     canManage?: boolean;
//     isCreator: boolean;
//     onRemove: () => void;
//     onChangeRole?: (memberId: string, newRole: string) => void;
// }

// export default function MemberListItem({
//     member,
//     isCurrentUser,
//     canManage = false,
//     isCreator,
//     onRemove,
//     onChangeRole
// }: MemberListItemProps) {
//     const [expanded, setExpanded] = useState(false);

//     // Get role color class with elegant gradients
//     const getRoleColorClass = (role: string) => {
//         return roleColors[role.toLowerCase() as keyof typeof roleColors] || roleColors.default;
//     };

//     // Format join date elegantly
//     const joinedAt = member.joinedAt ?
//         firebaseFormatDate(convertFirebaseDateRobust(member.joinedAt)) :
//         'Recently';

//     // const joinedAt = new Intl.DateTimeFormat('en-US', {
//     //     month: 'short',
//     //     day: 'numeric',
//     //     year: 'numeric'
//     // }).format(joinDate);

//     // Enhanced online status
//     const isOnline = member.status === 'online' || Math.random() > 0.5;

//     return (
//         <motion.li
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.2 }}
//             className="group relative"
//         >
//             <div className="py-4 px-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 transition-all duration-200 rounded-xl mx-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
//                 <div className="flex flex-col space-y-3">
//                     {/* Main content row */}
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
//                         {/* Enhanced User avatar and name section */}
//                         <div className="flex items-center gap-4 min-w-0 flex-1">
//                             {/* Enhanced Avatar with elegant styling */}
//                             <div className="relative flex-shrink-0">
//                                 <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center text-sm font-semibold overflow-hidden text-indigo-800 dark:text-indigo-200 ring-2 ring-white dark:ring-slate-900 shadow-lg">
//                                     {member.photoURL ? (
//                                         <img
//                                             src={member.photoURL}
//                                             alt={member.fullName}
//                                             className="h-full w-full object-cover"
//                                         />
//                                     ) : (
//                                         member.fullName?.charAt(0)?.toUpperCase() || "?"
//                                     )}
//                                 </div>

//                                 {/* Enhanced online status indicator */}
//                                 <div className={cn(
//                                     "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm",
//                                     isOnline
//                                         ? 'bg-gradient-to-r from-green-400 to-emerald-500'
//                                         : 'bg-slate-300 dark:bg-slate-600'
//                                 )} />

//                                 {/* Enhanced creator badge with gradient */}
//                                 {isCreator && (
//                                     <div
//                                         className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-1 shadow-md"
//                                         title="Workspace Creator"
//                                     >
//                                         <Crown className="h-3 w-3 text-white" />
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Enhanced user info section */}
//                             <div className="flex flex-col min-w-0 flex-1">
//                                 <div className="flex items-center gap-2 mb-1">
//                                     <span className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
//                                         {member.fullName}
//                                         {isCurrentUser && (
//                                             <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300">
//                                                 You
//                                             </span>
//                                         )}
//                                     </span>
//                                 </div>
//                                 <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
//                                     {member.email}
//                                 </p>
//                                 {member.specialty && (
//                                     <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1">
//                                         <span className="font-medium">Specialty:</span> {member.specialty}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Enhanced Role badge and actions */}
//                         <div className="flex items-center gap-3 sm:justify-end w-full sm:w-auto">
//                             {/* Enhanced role badge with gradient */}
//                             <Badge
//                                 variant="outline"
//                                 className={cn(
//                                     "px-3 py-1 text-xs font-semibold whitespace-nowrap shadow-sm",
//                                     getRoleColorClass(member.workspaceRole || '')
//                                 )}
//                             >
//                                 {(member.workspaceRole || '').replace('_', ' ')}
//                             </Badge>

//                             {/* Enhanced action buttons with elegant hover effects */}
//                             <div className="flex items-center gap-1">
//                                 {/* Message button */}
//                                 <TooltipProvider>
//                                     <Tooltip>
//                                         <TooltipTrigger asChild>
//                                             <Button
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 className="h-9 w-9 rounded-full bg-transparent hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
//                                             >
//                                                 <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
//                                             </Button>
//                                         </TooltipTrigger>
//                                         <TooltipContent
//                                             side="bottom"
//                                             className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg"
//                                         >
//                                             <p>Message</p>
//                                         </TooltipContent>
//                                     </Tooltip>
//                                 </TooltipProvider>

//                                 {/* Email button */}
//                                 <TooltipProvider>
//                                     <Tooltip>
//                                         <TooltipTrigger asChild>
//                                             <Button
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 className="h-9 w-9 rounded-full bg-transparent hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
//                                             >
//                                                 <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
//                                             </Button>
//                                         </TooltipTrigger>
//                                         <TooltipContent
//                                             side="bottom"
//                                             className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg"
//                                         >
//                                             <p>Email</p>
//                                         </TooltipContent>
//                                     </Tooltip>
//                                 </TooltipProvider>

//                                 {/* Calendar button for mentors and admins */}
//                                 {(member.workspaceRole === 'mentor' || member.workspaceRole === 'admin') && (
//                                     <TooltipProvider>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     className="h-9 w-9 rounded-full bg-transparent hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
//                                                 >
//                                                     <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
//                                                 </Button>
//                                             </TooltipTrigger>
//                                             <TooltipContent
//                                                 side="bottom"
//                                                 className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg"
//                                             >
//                                                 <p>Schedule Meeting</p>
//                                             </TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                 )}

//                                 {/* Enhanced Management dropdown */}
//                                 {canManage && !isCreator && (
//                                     <DropdownMenu>
//                                         <DropdownMenuTrigger asChild>
//                                             <Button
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 className="h-9 w-9 rounded-full bg-transparent hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
//                                             >
//                                                 <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
//                                             </Button>
//                                         </DropdownMenuTrigger>
//                                         <DropdownMenuContent
//                                             align="end"
//                                             className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl rounded-xl"
//                                         >
//                                             <DropdownMenuLabel className="text-slate-700 dark:text-slate-300 font-semibold">
//                                                 Member Actions
//                                             </DropdownMenuLabel>
//                                             <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />

//                                             {/* Role change options */}
//                                             {onChangeRole && (
//                                                 <>
//                                                     <DropdownMenuItem
//                                                         className="cursor-pointer flex items-center text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 rounded-lg mx-1"
//                                                         onClick={() => onChangeRole(member.userId, 'admin')}
//                                                     >
//                                                         <Shield className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
//                                                         Make Admin
//                                                     </DropdownMenuItem>

//                                                     <DropdownMenuItem
//                                                         className="cursor-pointer flex items-center text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20 rounded-lg mx-1"
//                                                         onClick={() => onChangeRole(member.userId, 'mentor')}
//                                                     >
//                                                         <Award className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
//                                                         Make Mentor
//                                                     </DropdownMenuItem>

//                                                     <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
//                                                 </>
//                                             )}

//                                             {/* Remove user option */}
//                                             <DropdownMenuItem
//                                                 className="cursor-pointer flex items-center text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 rounded-lg mx-1"
//                                                 onClick={onRemove}
//                                             >
//                                                 <UserMinus className="mr-2 h-4 w-4" />
//                                                 Remove Member
//                                             </DropdownMenuItem>
//                                         </DropdownMenuContent>
//                                     </DropdownMenu>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Expandable details section with elegant animation */}
//                     <AnimatePresence>
//                         {(expanded || (typeof window !== 'undefined' && window.innerWidth >= 640)) && (
//                             <motion.div
//                                 initial={{ height: 0, opacity: 0 }}
//                                 animate={{ height: "auto", opacity: 1 }}
//                                 exit={{ height: 0, opacity: 0 }}
//                                 transition={{ duration: 0.2, ease: "easeInOut" }}
//                                 className="overflow-hidden"
//                             >
//                                 <div className="pt-3 pb-2 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-4 pl-16">
//                                     <span className="inline-flex items-center">
//                                         <Calendar className="h-3 w-3 mr-1" />
//                                         Joined {joinedAt}
//                                     </span>
//                                     {member.lastActiveAt && (
//                                         <span className="inline-flex items-center">
//                                             <Globe className="h-3 w-3 mr-1" />
//                                             Last active {new Intl.DateTimeFormat('en-US', {
//                                                 month: 'short',
//                                                 day: 'numeric'
//                                             }).format(convertFirebaseDateRobust(member.lastActiveAt))}
//                                         </span>
//                                     )}
//                                     {member.permissions && (
//                                         <span className="inline-flex items-center">
//                                             <Shield className="h-3 w-3 mr-1" />
//                                             {Object.values(member.permissions).filter(Boolean).length} permissions
//                                         </span>
//                                     )}
//                                 </div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {/* Mobile toggle button with elegant styling */}
//                     <button
//                         className="sm:hidden text-xs text-indigo-600 dark:text-indigo-400 self-start flex items-center mt-2 pl-16 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 font-medium"
//                         onClick={() => setExpanded(!expanded)}
//                     >
//                         {expanded ? (
//                             <>
//                                 Less Details
//                                 <ChevronUp className="h-3 w-3 ml-1" />
//                             </>
//                         ) : (
//                             <>
//                                 More Details
//                                 <ChevronDown className="h-3 w-3 ml-1" />
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </motion.li>
//     );
// }

"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Calendar, MoreHorizontal, UserMinus,
    Mail, Crown, Shield, Award, ChevronDown, ChevronUp, Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkspaceMember } from '@/Redux/types/Workspace/workspace';
import { cn } from '@/lib/utils';
import { convertFirebaseDateRobust, firebaseFormatDate } from '@/components/utils/dateUtils';

const roleColors = {
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    mentor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    learner: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    observer: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
};

interface MemberListItemProps {
    member: WorkspaceMember;
    isCurrentUser: boolean;
    canManage?: boolean;
    isCreator: boolean;
    onRemove: () => void;
    onChangeRole?: (memberId: string, newRole: string) => void;
}

export default function MemberListItem({
    member,
    isCurrentUser,
    canManage = false,
    isCreator,
    onRemove,
    onChangeRole
}: MemberListItemProps) {
    const [expanded, setExpanded] = useState(false);

    const getRoleColorClass = (role: string) => {
        return roleColors[role.toLowerCase() as keyof typeof roleColors] || roleColors.default;
    };

    const joinedAt = member.joinedAt ?
        firebaseFormatDate(convertFirebaseDateRobust(member.joinedAt)) :
        'Recently';

    const isOnline = member.status === 'online' || Math.random() > 0.5;

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
            <div className="flex items-center justify-between">
                {/* Left side - User info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium overflow-hidden">
                            {member.photoURL ? (
                                <img
                                    src={member.photoURL}
                                    alt={member.fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                member.fullName?.charAt(0)?.toUpperCase() || "?"
                            )}
                        </div>

                        {/* Online status */}
                        <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900",
                            isOnline ? 'bg-green-500' : 'bg-slate-400'
                        )} />

                        {/* Creator badge */}
                        {isCreator && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                                <Crown className="h-2.5 w-2.5 text-white" />
                            </div>
                        )}
                    </div>

                    {/* User details */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {member.fullName}
                            </span>
                            {isCurrentUser && (
                                <Badge variant="secondary" className="text-xs px-2 py-0">
                                    You
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 truncate">
                                {member.email}
                            </span>
                            {member.specialty && (
                                <>
                                    <span className="text-xs text-slate-400">•</span>
                                    <span className="text-xs text-slate-500 truncate">
                                        {member.specialty}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right side - Role and actions */}
                <div className="flex items-center gap-2 ml-2">
                    {/* Role badge */}
                    <Badge
                        variant="secondary"
                        className={cn("text-xs whitespace-nowrap", getRoleColorClass(member.workspaceRole || ''))}
                    >
                        {(member.workspaceRole || '').replace('_', ' ')}
                    </Badge>

                    {/* Actions */}
                    <div className="flex items-center">
                        {/* Quick actions */}
                        <div className="hidden sm:flex items-center gap-1 mr-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs">
                                        Message
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                            <Mail className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs">
                                        Email
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {(member.workspaceRole === 'mentor' || member.workspaceRole === 'admin') && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                <Calendar className="h-3.5 w-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-xs">
                                            Schedule
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        {/* Management dropdown */}
                        {canManage && !isCreator && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel className="text-xs">
                                        Member Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {/* Mobile quick actions */}
                                    <div className="sm:hidden">
                                        <DropdownMenuItem>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Message
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Email
                                        </DropdownMenuItem>
                                        {(member.workspaceRole === 'mentor' || member.workspaceRole === 'admin') && (
                                            <DropdownMenuItem>
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Schedule Meeting
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                    </div>

                                    {/* Role changes */}
                                    {onChangeRole && (
                                        <>
                                            <DropdownMenuItem
                                                onClick={() => onChangeRole(member.userId, 'admin')}
                                            >
                                                <Shield className="mr-2 h-4 w-4" />
                                                Make Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onChangeRole(member.userId, 'mentor')}
                                            >
                                                <Award className="mr-2 h-4 w-4" />
                                                Make Mentor
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

                                    {/* Remove */}
                                    <DropdownMenuItem
                                        onClick={onRemove}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <UserMinus className="mr-2 h-4 w-4" />
                                        Remove Member
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Mobile expand button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="sm:hidden h-7 w-7 p-0 ml-1"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Expandable details for mobile or always shown on desktop */}
            <AnimatePresence>
                {(expanded || (typeof window !== 'undefined' && window.innerWidth >= 640)) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined {joinedAt}
                            </span>
                            {member.lastActiveAt && (
                                <span className="flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    Last active {new Intl.DateTimeFormat('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    }).format(convertFirebaseDateRobust(member.lastActiveAt))}
                                </span>
                            )}
                            {member.permissions && (
                                <span className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    {Object.values(member.permissions).filter(Boolean).length} permissions
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}