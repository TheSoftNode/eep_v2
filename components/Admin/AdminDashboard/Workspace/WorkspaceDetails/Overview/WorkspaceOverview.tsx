"use client"

import { motion } from 'framer-motion';
import {
    Clock,
    Calendar,
    BookOpen,
    AlertTriangle,
    Users,
    Folder,
    TrendingUp,
    Target,
    Timer,
    Brain,
    Sparkles,
    Globe,
    Lock,
    Building,
    Plus,
    FolderPlus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Workspace } from '@/Redux/types/Workspace/workspace';
import { ProjectSummary } from '@/Redux/types/Workspace/project-summary';
import { formatDate } from '@/components/utils/dateUtils';
import EnhancedWorkspaceActivities from '../Activities/WorkspaceActivity';
import WorkspaceTimeline from '../Timeline/WorkspaceTimeline';
import { useActiveProject } from '../../ActiveProjectContexts/ActiveProjectContext';

interface WorkspaceOverviewProps {
    workspace: Workspace & {
        learners?: any[];
        mentors?: any[];
        projects?: ProjectSummary[];
        projectsData?: ProjectSummary[];
    };
    activeProjectId?: string | null;
}

export default function WorkspaceOverview({ workspace, activeProjectId = null }: WorkspaceOverviewProps) {
    const { activeProject: contextActiveProject, updateActiveProject } = useActiveProject();

    // Use context project if it matches the workspace, otherwise use prop
    const effectiveActiveProjectId = contextActiveProject?.workspaceId === workspace.id
        ? contextActiveProject.id
        : activeProjectId;

    // Find active project data using the effective ID
    const activeProject = effectiveActiveProjectId
        ? (workspace.projectsData || workspace.projects)?.find(project => project.id === effectiveActiveProjectId)
        : null;

    // Calculate workspace stats - always show workspace-level stats
    const hasProjects = workspace.projectIds && workspace.projectIds.length > 0;

    const stats = hasProjects ? {
        totalTasks: activeProject?.taskCount || workspace.projectIds.length * 8, // Estimated tasks across projects
        completedTasks: activeProject?.completedTaskCount || Math.floor(workspace.projectIds.length * 6),
        upcomingDeadlines: 3,
        resources: activeProject?.resourceCount || workspace.projectIds.length * 5,
        hoursSpent: 42,
        progress: activeProject?.progress || 75 // Workspace average progress
    } : {
        totalTasks: 0,
        completedTasks: 0,
        upcomingDeadlines: 0,
        resources: 0,
        hoursSpent: 0,
        progress: 0
    };

    // Safely calculate completion percentage
    const completionPercentage = stats.totalTasks > 0
        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
        : 0;

    const totalMembers = workspace.memberCount ||
        ((workspace.learners?.length || 0) + (workspace.mentors?.length || 0));

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Always show workspace header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-t-xl"></div>
                <div className="p-4 sm:p-6">
                    {/* Workspace Info - Always Visible */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {workspace.name}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {workspace.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={getStatusColor(workspace.status)}>
                                {workspace.status}
                            </Badge>
                            <Badge variant="secondary" className={getVisibilityColor(workspace.visibility)}>
                                {getVisibilityIcon(workspace.visibility)}
                                <span className="ml-1 capitalize">{workspace.visibility}</span>
                            </Badge>
                        </div>
                    </div>

                    {/* Active Project Indicator - Only when project is selected */}
                    {activeProject && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800"
                        >
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                                    Active Project: {activeProject.name}
                                </span>
                                <Badge className="ml-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs">
                                    {activeProject.progress || 0}% Complete
                                </Badge>
                            </div>
                            {activeProject.description && (
                                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                                    {activeProject.description}
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* No Projects CTA - Only when no projects exist */}
                    {!hasProjects && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <FolderPlus className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                                        Ready to start your first project?
                                    </h4>
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                                        Add a project to organize your work and collaborate with your team
                                    </p>
                                </div>
                                <div className="text-xs text-indigo-600 dark:text-indigo-400 italic">
                                    Use "Add First Project" button above
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Tags */}
                    {workspace.tags && workspace.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {workspace.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created {formatDate(workspace.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {formatDate(workspace.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {totalMembers} members
                        </span>
                        <span className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            {workspace.projectIds?.length || 0} projects
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards - Always show, adjust based on project data */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-green-500 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {activeProject ? 'Project Progress' : 'Workspace Progress'}
                            </span>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {completionPercentage}%
                        </div>
                        {hasProjects ? (
                            <>
                                <Progress value={completionPercentage} className="h-2 mb-2" />
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {stats.completedTasks}/{stats.totalTasks} tasks
                                </p>
                            </>
                        ) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Add projects to track progress
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-amber-500 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Deadlines</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.upcomingDeadlines}
                            </div>
                            {hasProjects && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {hasProjects ? 'Due this week' : 'No deadlines yet'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-blue-500 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Timer className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Time</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.hoursSpent}h
                            </div>
                            {hasProjects && <TrendingUp className="h-4 w-4 text-blue-500" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {hasProjects ? 'Total logged' : 'Ready to start tracking'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-1 bg-purple-500 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-purple-500" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Resources</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.resources}
                            </div>
                            {hasProjects && <Brain className="h-4 w-4 text-purple-500" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {hasProjects ? 'Documents' : 'No resources yet'}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recent Activity Section - Always show with enhanced toggle */}
            <EnhancedWorkspaceActivities
                workspaceId={workspace.id}
                projectId={effectiveActiveProjectId || undefined}
                projectName={activeProject?.name}
                className="col-span-full"
            />

            {/* Timeline Section - Always show */}
            <WorkspaceTimeline
                workspaceId={workspace.id}
                activeProjectId={effectiveActiveProjectId || undefined}
                className="col-span-full"
            />
        </div>
    );
}

// Helper functions moved outside component for better performance
const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
        case 'public': return <Globe className="h-3 w-3" />;
        case 'private': return <Lock className="h-3 w-3" />;
        case 'organization': return <Building className="h-3 w-3" />;
        default: return <Lock className="h-3 w-3" />;
    }
};

const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
        case 'public':
            return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
        case 'private':
            return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
        case 'organization':
            return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
        default:
            return 'bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
        case 'completed':
            return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
        case 'paused':
            return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
        case 'draft':
            return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
        case 'archived':
            return 'bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800';
        default:
            return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
};



// "use client"

// import { motion } from 'framer-motion';
// import {
//     Clock,
//     Calendar,
//     BookOpen,
//     AlertTriangle,
//     Users,
//     Folder,
//     TrendingUp,
//     Target,
//     Timer,
//     Brain,
//     Sparkles,
//     Globe,
//     Lock,
//     Building,
//     Plus
// } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Workspace } from '@/Redux/types/Workspace/workspace';
// import { ProjectSummary } from '@/Redux/types/Workspace/project-summary';
// import { formatDate } from '@/components/utils/dateUtils';
// import WorkspaceActivities from '../Activities/WorkspaceActivity';
// import WorkspaceTimeline from '../Timeline/WorkspaceTimeline';
// import { useActiveProject } from '../../ActiveProjectContexts/ActiveProjectContext';

// interface WorkspaceOverviewProps {
//     workspace: Workspace & {
//         learners?: any[];
//         mentors?: any[];
//         projects?: ProjectSummary[];
//         projectsData?: ProjectSummary[];
//     };
//     activeProjectId?: string | null;
// }

// export default function WorkspaceOverview({ workspace, activeProjectId = null }: WorkspaceOverviewProps) {
//     const { activeProject: contextActiveProject, updateActiveProject } = useActiveProject();

//     // Use context project if it matches the workspace, otherwise use prop
//     const effectiveActiveProjectId = contextActiveProject?.workspaceId === workspace.id
//         ? contextActiveProject.id
//         : activeProjectId;

//     // Find active project data using the effective ID
//     const activeProject = effectiveActiveProjectId
//         ? (workspace.projectsData || workspace.projects)?.find(project => project.id === effectiveActiveProjectId)
//         : null;

//     // Handle empty workspace state
//     if (!workspace.projectIds || workspace.projectIds.length === 0) {
//         return (
//             <div className="p-4 sm:p-6 space-y-6">
//                 {/* Header Section */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
//                 >
//                     <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-t-xl"></div>
//                     <div className="p-4 sm:p-6">
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                             <div className="flex items-center gap-3">
//                                 <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                                     <Sparkles className="h-5 w-5 text-white" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
//                                         {workspace.name}
//                                     </h2>
//                                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                                         {workspace.description}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <Badge variant="secondary" className={getStatusColor(workspace.status)}>
//                                     {workspace.status}
//                                 </Badge>
//                                 <Badge variant="secondary" className={getVisibilityColor(workspace.visibility)}>
//                                     {getVisibilityIcon(workspace.visibility)}
//                                     <span className="ml-1 capitalize">{workspace.visibility}</span>
//                                 </Badge>
//                             </div>
//                         </div>

//                         {/* Tags */}
//                         {workspace.tags && workspace.tags.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mt-4">
//                                 {workspace.tags.map((tag) => (
//                                     <Badge
//                                         key={tag}
//                                         variant="secondary"
//                                         className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
//                                     >
//                                         {tag}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         )}

//                         {/* Metadata */}
//                         <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
//                             <span className="flex items-center gap-1">
//                                 <Calendar className="h-3 w-3" />
//                                 Created {formatDate(workspace.createdAt)}
//                             </span>
//                             <span className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 Updated {formatDate(workspace.updatedAt)}
//                             </span>
//                             <span className="flex items-center gap-1">
//                                 <Users className="h-3 w-3" />
//                                 {workspace.memberCount || ((workspace.learners?.length || 0) + (workspace.mentors?.length || 0))} members
//                             </span>
//                             <span className="flex items-center gap-1">
//                                 <Folder className="h-3 w-3" />
//                                 0 projects
//                             </span>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Empty State */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1 }}
//                     className="text-center py-16"
//                 >
//                     <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
//                         <Folder className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
//                         No Projects Yet
//                     </h3>
//                     <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
//                         Get started by adding your first project to this workspace. Projects help organize your work and enable collaboration.
//                     </p>
//                     <div className="flex justify-center">
//                         <div className="text-sm text-slate-400 dark:text-slate-500 italic">
//                             Use the "Add First Project" button in the header to get started
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         );
//     }

//     // Calculate workspace stats
//     const stats = activeProject ? {
//         totalTasks: activeProject.taskCount || 0,
//         completedTasks: activeProject.completedTaskCount || 0,
//         upcomingDeadlines: 3,
//         resources: activeProject.resourceCount || 0,
//         hoursSpent: 42,
//         progress: activeProject.progress || 0
//     } : {
//         totalTasks: workspace.projectIds?.length ? workspace.projectIds.length * 10 : 0,
//         completedTasks: workspace.projectIds?.length ? Math.floor(workspace.projectIds.length * 7) : 0,
//         upcomingDeadlines: 3,
//         resources: 8,
//         hoursSpent: 42,
//         progress: 67
//     };

//     // Safely calculate completion percentage
//     const completionPercentage = stats.totalTasks > 0
//         ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
//         : stats.progress || 0;

//     const totalMembers = workspace.memberCount ||
//         ((workspace.learners?.length || 0) + (workspace.mentors?.length || 0));

//     return (
//         <div className="p-4 sm:p-6 space-y-6">
//             {/* Header Section */}
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
//             >
//                 <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-t-xl"></div>
//                 <div className="p-4 sm:p-6">
//                     {activeProject ? (
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                             <div className="flex items-center gap-3">
//                                 <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                                     <Sparkles className="h-5 w-5 text-white" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
//                                         {activeProject.name}
//                                     </h2>
//                                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                                         {activeProject.description || "Active project in this workspace"}
//                                     </p>
//                                 </div>
//                             </div>
//                             <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
//                                 Active Project
//                             </Badge>
//                         </div>
//                     ) : (
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                             <div className="flex items-center gap-3">
//                                 <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                                     <Sparkles className="h-5 w-5 text-white" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
//                                         {workspace.name}
//                                     </h2>
//                                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                                         {workspace.description}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <Badge variant="secondary" className={getStatusColor(workspace.status)}>
//                                     {workspace.status}
//                                 </Badge>
//                                 <Badge variant="secondary" className={getVisibilityColor(workspace.visibility)}>
//                                     {getVisibilityIcon(workspace.visibility)}
//                                     <span className="ml-1 capitalize">{workspace.visibility}</span>
//                                 </Badge>
//                             </div>
//                         </div>
//                     )}

//                     {/* Tags */}
//                     {workspace.tags && workspace.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mt-4">
//                             {workspace.tags.map((tag) => (
//                                 <Badge
//                                     key={tag}
//                                     variant="secondary"
//                                     className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
//                                 >
//                                     {tag}
//                                 </Badge>
//                             ))}
//                         </div>
//                     )}

//                     {/* Metadata */}
//                     <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
//                         <span className="flex items-center gap-1">
//                             <Calendar className="h-3 w-3" />
//                             Created {formatDate(workspace.createdAt)}
//                         </span>
//                         <span className="flex items-center gap-1">
//                             <Clock className="h-3 w-3" />
//                             Updated {formatDate(workspace.updatedAt)}
//                         </span>
//                         <span className="flex items-center gap-1">
//                             <Users className="h-3 w-3" />
//                             {totalMembers} members
//                         </span>
//                         <span className="flex items-center gap-1">
//                             <Folder className="h-3 w-3" />
//                             {workspace.projectIds?.length || 0} projects
//                         </span>
//                     </div>
//                 </div>
//             </motion.div>

//             {/* Stats Cards */}
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
//             >
//                 <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
//                     <div className="h-1 bg-green-500 rounded-t-lg"></div>
//                     <CardContent className="p-3 sm:p-4">
//                         <div className="flex items-center gap-2 mb-2">
//                             <Target className="h-4 w-4 text-green-500" />
//                             <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Progress</span>
//                         </div>
//                         <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
//                             {completionPercentage}%
//                         </div>
//                         <Progress value={completionPercentage} className="h-2 mb-2" />
//                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                             {stats.completedTasks}/{stats.totalTasks} tasks
//                         </p>
//                     </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
//                     <div className="h-1 bg-amber-500 rounded-t-lg"></div>
//                     <CardContent className="p-3 sm:p-4">
//                         <div className="flex items-center gap-2 mb-2">
//                             <Calendar className="h-4 w-4 text-amber-500" />
//                             <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Deadlines</span>
//                         </div>
//                         <div className="flex items-center gap-2 mb-2">
//                             <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
//                                 {stats.upcomingDeadlines}
//                             </div>
//                             <AlertTriangle className="h-4 w-4 text-amber-500" />
//                         </div>
//                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                             Due this week
//                         </p>
//                     </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
//                     <div className="h-1 bg-blue-500 rounded-t-lg"></div>
//                     <CardContent className="p-3 sm:p-4">
//                         <div className="flex items-center gap-2 mb-2">
//                             <Timer className="h-4 w-4 text-blue-500" />
//                             <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Time</span>
//                         </div>
//                         <div className="flex items-center gap-2 mb-2">
//                             <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
//                                 {stats.hoursSpent}h
//                             </div>
//                             <TrendingUp className="h-4 w-4 text-blue-500" />
//                         </div>
//                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                             Total logged
//                         </p>
//                     </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
//                     <div className="h-1 bg-purple-500 rounded-t-lg"></div>
//                     <CardContent className="p-3 sm:p-4">
//                         <div className="flex items-center gap-2 mb-2">
//                             <BookOpen className="h-4 w-4 text-purple-500" />
//                             <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Resources</span>
//                         </div>
//                         <div className="flex items-center gap-2 mb-2">
//                             <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
//                                 {stats.resources}
//                             </div>
//                             <Brain className="h-4 w-4 text-purple-500" />
//                         </div>
//                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                             Documents
//                         </p>
//                     </CardContent>
//                 </Card>
//             </motion.div>

//             {/* Recent Activity Section */}
//             <WorkspaceActivities
//                 workspaceId={workspace.id}
//                 projectId={effectiveActiveProjectId || undefined}
//                 className="col-span-full"
//             />

//             {/* Timeline Section */}
//             <WorkspaceTimeline
//                 workspaceId={workspace.id}
//                 activeProjectId={effectiveActiveProjectId || undefined}
//                 className="col-span-full"
//             />
//         </div>
//     );
// }

// // Helper functions moved outside component for better performance
// const getVisibilityIcon = (visibility: string) => {
//     switch (visibility) {
//         case 'public': return <Globe className="h-3 w-3" />;
//         case 'private': return <Lock className="h-3 w-3" />;
//         case 'organization': return <Building className="h-3 w-3" />;
//         default: return <Lock className="h-3 w-3" />;
//     }
// };

// const getVisibilityColor = (visibility: string) => {
//     switch (visibility) {
//         case 'public':
//             return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
//         case 'private':
//             return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
//         case 'organization':
//             return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
//         default:
//             return 'bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800';
//     }
// };

// const getStatusColor = (status: string) => {
//     switch (status) {
//         case 'active':
//             return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
//         case 'completed':
//             return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
//         case 'paused':
//             return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
//         case 'draft':
//             return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
//         case 'archived':
//             return 'bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800';
//         default:
//             return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
//     }
// };

