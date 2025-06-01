"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    RefreshCw,
    Clock,
    Search,
    CheckCircle,
    UserPlus,
    FolderPlus,
    Settings,
    Shield,
    AlertTriangle,
    UserX,
    Users,
    UserCheck,
    Download,
    Key,
    LogOut,
    Database,
    Bell,
    Mail,
    Lock,
    Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useGetAuditLogsQuery } from '@/Redux/apiSlices/auditLog/auditLogApi';
import { AuditLogEntry } from '@/Redux/types/AuditLog/auditLog';
import { cn } from '@/lib/utils';

// Activity type configurations
const ACTIVITY_CONFIGS = {
    user_created: {
        icon: UserPlus,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        label: 'User Created'
    },
    user_updated: {
        icon: UserCheck,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'User Updated'
    },
    user_deleted: {
        icon: UserX,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'User Deleted'
    },
    user_status_changed: {
        icon: UserCheck,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        label: 'Status Changed'
    },
    user_role_updated: {
        icon: Shield,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        label: 'Role Updated'
    },
    project_created: {
        icon: FolderPlus,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        label: 'Project Created'
    },
    project_updated: {
        icon: FolderPlus,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Project Updated'
    },
    project_deleted: {
        icon: UserX,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Project Deleted'
    },
    workspace_created: {
        icon: FolderPlus,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        label: 'Workspace Created'
    },
    workspace_updated: {
        icon: FolderPlus,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Workspace Updated'
    },
    workspace_deleted: {
        icon: UserX,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Workspace Deleted'
    },
    workspace_member_added: {
        icon: UserPlus,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        label: 'Member Added'
    },
    mentor_assigned: {
        icon: UserPlus,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        label: 'Mentor Assigned'
    },
    mentor_removed: {
        icon: UserX,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Mentor Removed'
    },
    settings_updated: {
        icon: Settings,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Settings Updated'
    },
    system_backup: {
        icon: Database,
        color: 'text-slate-600',
        bg: 'bg-slate-100 dark:bg-slate-800',
        label: 'System Backup'
    },
    system_maintenance: {
        icon: Settings,
        color: 'text-orange-600',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        label: 'System Maintenance'
    },
    system_announcement: {
        icon: Bell,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Announcement'
    },
    bulk_operation: {
        icon: Users,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        label: 'Bulk Operation'
    },
    data_export: {
        icon: Download,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30',
        label: 'Data Export'
    },
    notification_sent: {
        icon: Bell,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        label: 'Notification Sent'
    },
    email_campaign: {
        icon: Mail,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        label: 'Email Campaign'
    },
    security_alert: {
        icon: AlertCircle,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'Security Alert'
    },
    login_attempt: {
        icon: LogOut,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        label: 'Login Attempt'
    },
    password_reset: {
        icon: Key,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        label: 'Password Reset'
    },
    two_factor_enabled: {
        icon: Lock,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30',
        label: '2FA Enabled'
    },
    two_factor_disabled: {
        icon: Unlock,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: '2FA Disabled'
    },
    default: {
        icon: Activity,
        color: 'text-slate-600',
        bg: 'bg-slate-100 dark:bg-slate-800',
        label: 'Activity'
    }
};

const getActivityConfig = (action: string) => {
    return ACTIVITY_CONFIGS[action as keyof typeof ACTIVITY_CONFIGS] || ACTIVITY_CONFIGS.default;
};

const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const formatActivityTime = (timestamp: any) => {
    if (!timestamp) return 'recently';

    try {
        let date: Date;
        if (timestamp && typeof timestamp.toDate === 'function') {
            date = timestamp.toDate();
        } else if (typeof timestamp === 'string') {
            date = new Date(timestamp);
        } else {
            date = new Date();
        }

        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

        return date.toLocaleDateString();
    } catch {
        return 'recently';
    }
};

const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'critical':
            return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
        case 'high':
            return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
        case 'medium':
            return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'low':
            return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
        default:
            return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'success':
            return <CheckCircle className="h-3 w-3 text-emerald-500" />;
        case 'warning':
            return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
        case 'error':
            return <AlertTriangle className="h-3 w-3 text-red-500" />;
        case 'pending':
            return <Clock className="h-3 w-3 text-blue-500" />;
        default:
            return null;
    }
};

interface RecentActivitiesModalProps {
    open: boolean;
    onClose: () => void;
}

export function RecentActivitiesModal({
    open,
    onClose
}: RecentActivitiesModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activityType, setActivityType] = useState("all");
    const [sortDirection, setSortDirection] = useState("desc");
    const [allActivities, setAllActivities] = useState<AuditLogEntry[]>([]);
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);

    const handleClose = () => {
        setSearchTerm('');
        setActivityType("all");
        onClose();
    };

    // API hook for fetching all audit logs
    const {
        data: activityResponse,
        isLoading,
        isError,
        refetch,
        isFetching
    } = useGetAuditLogsQuery({
        limit: 50, // Get more activities for the modal
        actionType: activityType === 'all' ? 'all' : activityType,
    }, {
        skip: !open,
        refetchOnMountOrArgChange: true
    });

    // Update activities when data changes
    useEffect(() => {
        if (activityResponse?.data) {
            setAllActivities(activityResponse.data);
        }
    }, [activityResponse?.data]);

    // Reset when modal opens
    useEffect(() => {
        if (open) {
            setSearchTerm('');
            setActivityType("all");
            setIsManualRefreshing(false);
        }
    }, [open]);

    // Handle loading states
    useEffect(() => {
        if (!isFetching) setIsManualRefreshing(false);
    }, [isFetching]);

    const handleRefresh = async () => {
        try {
            setIsManualRefreshing(true);
            await refetch();
        } catch (error) {
            setIsManualRefreshing(false);
        }
    };

    // Filter activities by search term
    const filteredActivities = allActivities.filter(activity => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            activity.performedBy.userName?.toLowerCase().includes(searchLower) ||
            activity.actionType?.toLowerCase().includes(searchLower) ||
            activity.title?.toLowerCase().includes(searchLower) ||
            activity.description?.toLowerCase().includes(searchLower)
        );
    });

    // Handle client-side sorting
    const sortedActivities = [...filteredActivities].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (sortDirection === 'desc') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    const isLoadingContent = isLoading || isManualRefreshing;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
                            <Activity className="h-5 w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                            All Activities
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Complete history of all admin actions and system activities
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search activities..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={activityType} onValueChange={setActivityType}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Activities</SelectItem>
                                    <SelectItem value="user">User Actions</SelectItem>
                                    <SelectItem value="project">Projects</SelectItem>
                                    <SelectItem value="workspace">Workspaces</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                    <SelectItem value="security">Security</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortDirection} onValueChange={setSortDirection}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Newest First</SelectItem>
                                    <SelectItem value="asc">Oldest First</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isLoadingContent}
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
                            >
                                <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingContent && "animate-spin")} />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Activity List */}
                    <div className="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                        {isLoadingContent ? (
                            <div className="p-6">
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                                            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                                                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="flex flex-col items-center justify-center p-12 text-red-500">
                                <AlertCircle className="h-12 w-12 mb-4" />
                                <p className="text-lg font-medium mb-2">Failed to Load Activities</p>
                                <p className="text-sm text-slate-500 mb-4">There was an error loading the activity log</p>
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                            </div>
                        ) : sortedActivities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12">
                                <Activity className="h-12 w-12 mb-4 text-slate-400" />
                                <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                    {searchTerm ? 'No matching activities' : 'No activities found'}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Admin activities will appear here'}
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 space-y-3">
                                <AnimatePresence>
                                    {sortedActivities.map((activity, index) => {
                                        const config = getActivityConfig(activity.actionType);
                                        const IconComponent = config.icon;

                                        return (
                                            <motion.div
                                                key={activity.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group"
                                            >
                                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <div className={cn(
                                                        "flex items-center justify-center h-10 w-10 rounded-full shadow-sm",
                                                        config.bg
                                                    )}>
                                                        <IconComponent className={cn("h-5 w-5", config.color)} />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Avatar className="h-7 w-7 border border-white dark:border-slate-800">
                                                                {activity.performedBy.userAvatar ? (
                                                                    <AvatarImage src={activity.performedBy.userAvatar} alt={activity.performedBy.userName} />
                                                                ) : (
                                                                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-medium">
                                                                        {getUserInitials(activity.performedBy.userName)}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                        {activity.performedBy.userName || 'System'}
                                                                    </span>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {config.label}
                                                                    </Badge>
                                                                    {getStatusIcon(activity.status)}
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(activity.severity)}`}>
                                                                        {activity.severity}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                                    {activity.title}
                                                                </h4>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                                    {activity.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {activity.targetResource && (
                                                            <div className="ml-9 mb-2">
                                                                <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                                                                    Target: {activity.targetResource.type} - {activity.targetResource.name}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between ml-9 mt-2">
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                                <Clock className="h-3 w-3" />
                                                                <span>{formatActivityTime(activity.createdAt)}</span>
                                                                <span>•</span>
                                                                <Badge variant="secondary" className="text-xs py-0 h-4">
                                                                    {activity.performedBy.userRole}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Summary Stats */}
                    {allActivities.length > 0 && (
                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 px-2">
                            <span>
                                Showing {sortedActivities.length} of {allActivities.length} activities
                            </span>
                            {searchTerm && (
                                <span>
                                    Filtered by: "{searchTerm}"
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}