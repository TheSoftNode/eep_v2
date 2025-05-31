import { Calendar, CheckCircle2, CircleAlert, Flag, Github, MessageSquare, PlusCircle, User, UserPlus, Trash2, GitPullRequest, GitCommit, GitBranch, TrendingUp } from "lucide-react";

export const formatActivityAction = (action: string) => {
    switch (action) {
        case 'added_task_to_area':
            return 'added a task to area';
        case 'updated_area_task_status':
            return 'updated area task status';
        case 'updated_area_task_priority':
            return 'updated area task priority';
        case 'assigned_area_task':
            return 'assigned area task';
        case 'updated_task_status':
            return 'updated task status';
        case 'updated_project_area':
            return 'updated project area progress';
        case 'completed_task':
            return 'completed a task';
        case 'added_task':
            return 'added a task';
        case 'deleted_task':
            return 'deleted a task';
        case 'assigned_task':
            return 'assigned a task';
        case 'updated_task_priority':
            return 'updated task priority';
        case 'updated_task':
            return 'updated a task';
        case 'added_member':
            return 'added a team member';
        case 'removed_member':
            return 'removed a team member';
        case 'updated_member_role':
            return 'updated team member role';
        case 'joined_project':
            return 'joined the project';
        case 'submitted_progress_update':
            return 'submitted a progress update';
        case 'added_feedback':
            return 'provided feedback';
        case 'github_push':
            return 'pushed to repository';
        case 'github_pull_request':
            return 'created pull request';
        case 'github_commit':
            return 'committed changes';
        case 'github_branch':
            return 'created branch';
        case 'cleared_all_activities':
            return 'cleared all activities';
        case 'deleted_activity':
            return 'deleted an activity';
        default:
            return action?.replace(/_/g, ' ');
    }
};

export const formatActivityDetail = (action: string, details: any) => {
    if (!details) return '';

    const formatAssignee = (assignee: any) => {
        if (!assignee) return 'unassigned';
        if (typeof assignee === 'string') return assignee;
        return assignee.name || assignee.email || 'user';
    };

    switch (action) {
        case 'added_task_to_area':
            return `"${details.taskTitle || 'Task'}" to ${details.projectAreaName || 'area'}` +
                (details.assignee ? ` (assigned to ${formatAssignee(details.assignee)})` : '');

        case 'updated_area_task_status':
            return `"${details.taskTitle || 'Task'}" in ${details.projectAreaName || 'area'} from ${details.from || 'previous status'} to ${details.to || 'new status'}`;

        case 'updated_area_task_priority':
            return `"${details.taskTitle || 'Task'}" in ${details.projectAreaName || 'area'} from ${details.from || 'previous priority'} to ${details.to || 'new priority'}`;

        case 'assigned_area_task':
            return `"${details.taskTitle || 'Task'}" in ${details.projectAreaName || 'area'} from ${formatAssignee(details.from)} to ${formatAssignee(details.to)}`;

        case 'updated_task_status':
            return `"${details.taskTitle || 'Task'}" from ${details.from || 'previous status'} to ${details.to || 'new status'}`;

        case 'updated_project_area':
            return `"${details.areaName || 'Project area'}" progress changed (${details.progressChange || 'updated'})`;

        case 'added_task':
            return `"${details.taskTitle || 'Task'}"` +
                (details.assignee ? ` (assigned to ${formatAssignee(details.assignee)})` : '');

        case 'deleted_task':
            return `"${details.taskTitle || 'Task'}"` +
                (details.assignee ? ` (was assigned to ${formatAssignee(details.assignee)})` : '');

        case 'assigned_task':
            return `"${details.taskTitle || 'Task'}" from ${formatAssignee(details.from)} to ${formatAssignee(details.to)}`;

        case 'updated_task_priority':
            return `"${details.taskTitle || 'Task'}" from ${details.from || 'previous priority'} to ${details.to || 'new priority'}`;

        case 'updated_task':
            const changes = [];
            if (details.changes?.title) {
                changes.push(`title to "${details.changes.title.to}"`);
            }
            if (details.changes?.status) {
                changes.push(`status from ${details.changes.status.from} to ${details.changes.status.to}`);
            }
            if (details.changes?.dueDate) {
                changes.push(`due date to ${details.changes.dueDate.to}`);
            }
            if (details.changes?.assignee) {
                changes.push(`assignee from ${formatAssignee(details.changes.assignee.from)} to ${formatAssignee(details.changes.assignee.to)}`);
            }
            return `"${details.taskTitle || 'Task'}"` +
                (changes.length ? `: ${changes.join(', ')}` : '');

        case 'added_member':
            return `${details.memberName || 'new member'} as ${details.memberRole || 'team member'}`;

        case 'removed_member':
            return `${details.memberName || 'member'} (${details.memberRole || 'role'})`;

        case 'updated_member_role':
            return `${details.memberName || 'team member'} from ${details.previousRole || 'previous role'} to ${details.newRole || 'new role'}`;

        case 'submitted_progress_update':
            return `"${details.week || 'Weekly update'}"`;

        case 'added_feedback':
            return `on ${details.week || 'progress update'}`;

        case 'github_push':
            return `${details.commits || ''} commit${details.commits !== 1 ? 's' : ''}`;

        case 'github_pull_request':
            return `#${details.prNumber || ''} "${details.prTitle || 'Pull Request'}"`;

        case 'github_commit':
            return `"${details.commitMessage || 'changes'}"`;

        case 'github_branch':
            return `"${details.branchName || 'new branch'}"`;

        case 'cleared_all_activities':
            return `${details.count || 'all'} activities cleared`;
        case 'deleted_activity':
            return `activity "${details.deletedActivityId}" (${details.action || 'type unknown'})`;

        default:
            return JSON.stringify(details) || '';
    }
};

export const getActivityIcon = (action: string) => {
    switch (action) {
        case 'added_task_to_area':
            return <PlusCircle className="h-4 w-4 text-blue-600" />;
        case 'updated_area_task_status':
            return <Flag className="h-4 w-4 text-yellow-600" />;
        case 'updated_area_task_priority':
            return <Flag className="h-4 w-4 text-purple-600" />;
        case 'assigned_area_task':
            return <User className="h-4 w-4 text-indigo-600" />;
        case 'updated_task_status':
            return <Flag className="h-4 w-4 text-yellow-600" />;
        case 'updated_project_area':
            return <TrendingUp className="h-4 w-4 text-green-600" />;
        case 'completed_task':
            return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        case 'added_task':
            return <PlusCircle className="h-4 w-4 text-blue-600" />;
        case 'deleted_task':
            return <Trash2 className="h-4 w-4 text-red-600" />;
        case 'assigned_task':
        case 'updated_member_role':
            return <User className="h-4 w-4 text-indigo-600" />;
        case 'updated_task_priority':
            return <Flag className="h-4 w-4 text-purple-600" />;
        case 'updated_task':
            return <CircleAlert className="h-4 w-4 text-blue-600" />;
        case 'added_member':
            return <UserPlus className="h-4 w-4 text-blue-600" />;
        case 'removed_member':
            return <User className="h-4 w-4 text-red-600" />;
        case 'submitted_progress_update':
            return <Calendar className="h-4 w-4 text-purple-600" />;
        case 'added_feedback':
            return <MessageSquare className="h-4 w-4 text-indigo-600" />;
        case 'github_push':
            return <Github className="h-4 w-4 text-indigo-800" />;
        case 'github_pull_request':
            return <GitPullRequest className="h-4 w-4 text-indigo-600" />;
        case 'github_commit':
            return <GitCommit className="h-4 w-4 text-indigo-600" />;
        case 'github_branch':
            return <GitBranch className="h-4 w-4 text-indigo-600" />;
        case 'cleared_all_activities':
        case 'deleted_activity':
            return <Trash2 className="h-4 w-4 text-red-600" />;
        default:
            return <CircleAlert className="h-4 w-4 text-indigo-600" />;
    }
};

export const getActivityIconBg = (action: string) => {
    switch (action) {
        case 'added_task_to_area':
            return 'bg-blue-100';
        case 'updated_area_task_status':
            return 'bg-yellow-100';
        case 'updated_area_task_priority':
            return 'bg-purple-100';
        case 'assigned_area_task':
            return 'bg-indigo-100';
        case 'updated_task_status':
            return 'bg-yellow-100';
        case 'updated_project_area':
            return 'bg-green-100';
        case 'completed_task':
            return 'bg-green-100';
        case 'added_task':
            return 'bg-blue-100';
        case 'deleted_task':
            return 'bg-red-100';
        case 'assigned_task':
        case 'updated_member_role':
            return 'bg-indigo-100';
        case 'updated_task_priority':
            return 'bg-purple-100';
        case 'updated_task':
            return 'bg-blue-100';
        case 'added_member':
            return 'bg-blue-100';
        case 'removed_member':
            return 'bg-red-100';
        case 'submitted_progress_update':
            return 'bg-purple-100';
        case 'added_feedback':
            return 'bg-indigo-100';
        case 'github_push':
        case 'github_pull_request':
        case 'github_commit':
        case 'github_branch':
            return 'bg-indigo-100';
        case 'cleared_all_activities':
        case 'deleted_activity':
            return 'bg-red-100';
        default:
            return 'bg-indigo-50';
    }
};

export const getIconBgColor = (action: string) => {
    switch (action) {
        case 'completed_task':
            return 'bg-green-100';
        case 'added_task':
            return 'bg-blue-100';
        case 'deleted_task':
            return 'bg-red-100';
        case 'assigned_task':
        case 'updated_member_role':
            return 'bg-indigo-100';
        case 'updated_task_status':
            return 'bg-yellow-100';
        case 'updated_task_priority':
            return 'bg-purple-100';
        case 'updated_task':
            return 'bg-blue-100';
        case 'added_member':
            return 'bg-blue-100';
        case 'removed_member':
            return 'bg-red-100';
        case 'submitted_progress_update':
            return 'bg-purple-100';
        case 'added_feedback':
            return 'bg-indigo-100';
        case 'github_push':
            return 'bg-indigo-100';
        default:
            return 'bg-indigo-50';
    }
};

// Function to get color class based on progress
export const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-100 [&>div]:bg-red-500';
    if (progress < 50) return 'bg-yellow-100 [&>div]:bg-yellow-500';
    if (progress < 75) return 'bg-blue-100 [&>div]:bg-blue-600';
    return 'bg-green-100 [&>div]:bg-green-600';
};

// Function to get badge color based on progress
export const getProgressBadgeColor = (progress: number) => {
    if (progress < 25) return 'bg-red-100 text-red-800';
    if (progress < 50) return 'bg-yellow-100 text-yellow-800';
    if (progress < 75) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
};

export const getProgressRangeClasses = (progress: number) => {
    if (progress < 25) return '[&::-webkit-slider-thumb]:bg-red-500 [&::-moz-range-thumb]:bg-red-500';
    if (progress < 50) return '[&::-webkit-slider-thumb]:bg-yellow-500 [&::-moz-range-thumb]:bg-yellow-500';
    if (progress < 75) return '[&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:bg-blue-600';
    return '[&::-webkit-slider-thumb]:bg-green-600 [&::-moz-range-thumb]:bg-green-600';
};

export const getProgressStatusText = (progress: number) => {
    if (progress === 100) return 'Complete';
    if (progress >= 75) return 'Almost Complete';
    if (progress >= 50) return 'Good Progress';
    if (progress >= 25) return 'In Progress';
    return 'Just Started';
};