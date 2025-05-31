import React from 'react';
import {
    Users,
    Calendar,
    Sparkles,
    Clock,
    ArrowRight,
    Briefcase,
    Lock,
    Globe,
    Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Workspace, WorkspaceMember } from '@/Redux/types/Workspace/workspace';
import { ProjectSummary } from '@/Redux/types/Workspace/project-summary';

interface AdminWorkspaceCardProps {
    workspace: Workspace & {
        learners?: WorkspaceMember[];
        mentors?: WorkspaceMember[];
        projects?: ProjectSummary[];
    };
    onClick: () => void;
}

const AdminWorkspaceCard: React.FC<AdminWorkspaceCardProps> = ({
    workspace,
    onClick
}) => {
    const formatDate = (date: any) => {
        if (!date) return 'Not set';

        // Handle Firestore Timestamp
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getVisibilityColor = () => {
        switch (workspace.visibility) {
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

    const getStatusColor = () => {
        switch (workspace.status) {
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

    const getVisibilityIcon = () => {
        switch (workspace.visibility) {
            case 'public':
                return <Globe className="h-3 w-3" />;
            case 'private':
                return <Lock className="h-3 w-3" />;
            case 'organization':
                return <Building className="h-3 w-3" />;
            default:
                return <Lock className="h-3 w-3" />;
        }
    };

    const totalProjects = workspace.projects?.length || workspace.projectIds?.length || 0;
    const totalMembers = workspace.memberCount ||
        ((workspace.learners?.length || 0) + (workspace.mentors?.length || 0));

    // Combine all members for avatar display
    const allMembers = [
        ...(workspace.mentors || []),
        ...(workspace.learners || [])
    ];

    return (
        <div
            className="cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
            onClick={onClick}
        >
            {/* Header gradient */}
            <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

            {/* Card content */}
            <div className="p-6">
                {/* Header section */}
                <div className="flex items-center mb-4">
                    <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2 mr-3 flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {workspace.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {workspace.projectType || 'General Workspace'}
                        </p>
                    </div>
                </div>

                {/* Status and Visibility Badges */}
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={getStatusColor()}>
                        {workspace.status}
                    </Badge>
                    <Badge variant="outline" className={getVisibilityColor()}>
                        {getVisibilityIcon()}
                        <span className="ml-1 capitalize">{workspace.visibility}</span>
                    </Badge>
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                    {workspace.description || "No description provided"}
                </p>

                {/* Tags */}
                {workspace.tags && workspace.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {workspace.tags.slice(0, 3).map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {workspace.tags.length > 3 && (
                            <Badge
                                variant="secondary"
                                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                                +{workspace.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{totalMembers} members</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{totalProjects} projects</span>
                    </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated {formatDate(workspace.updatedAt)}</span>
                    </div>
                    {workspace.endDate && (
                        <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Ends {formatDate(workspace.endDate)}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    {/* Member Avatars */}
                    <div className="flex -space-x-2">
                        {allMembers.slice(0, 3).map((member, i) => (
                            <div
                                key={`member-${member.id}-${i}`}
                                className="h-8 w-8 rounded-full bg-indigo-400 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs text-white font-medium overflow-hidden"
                                title={member.fullName}
                            >
                                {member.photoURL ? (
                                    <img
                                        src={member.photoURL}
                                        alt={member.fullName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    member.fullName?.charAt(0)?.toUpperCase() || "M"
                                )}
                            </div>
                        ))}

                        {totalMembers > 3 && (
                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 font-medium">
                                +{totalMembers - 3}
                            </div>
                        )}

                        {totalMembers === 0 && (
                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs text-slate-400 font-medium">
                                0
                            </div>
                        )}
                    </div>

                    {/* Open Button */}
                    <div className="flex items-center">
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 mr-2">Open</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 rounded-full p-1.5 h-8 w-8 transition-colors duration-200"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWorkspaceCard;

