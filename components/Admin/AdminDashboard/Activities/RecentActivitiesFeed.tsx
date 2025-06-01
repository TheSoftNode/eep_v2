"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    UserPlus,
    FolderPlus,
    Settings,
    Shield,
    CheckCircle,
    AlertTriangle,
    Clock,
    UserX,
    Users,
    UserCheck,
    Download,
    Key,
    LogOut,
    Database,
    Bell,
    Mail,
    AlertCircle,
    Lock,
    Unlock,
    ChevronRight,
    Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetAuditLogsQuery } from "@/Redux/apiSlices/auditLog/auditLogApi";
import { AuditLogEntry } from "@/Redux/types/AuditLog/auditLog";
import { RecentActivitiesModal } from "./RecentActivitiesModal";

const RecentActivitiesFeed: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const { data: auditData, isLoading, error } = useGetAuditLogsQuery({
        limit: 5, // Only show 5 items in the preview
        actionType: 'all'
    });

    const activities: AuditLogEntry[] = auditData?.data || [];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user_created':
                return <UserPlus className="h-4 w-4" />;
            case 'user_updated':
                return <UserCheck className="h-4 w-4" />;
            case 'user_deleted':
                return <UserX className="h-4 w-4" />;
            case 'user_status_changed':
                return <UserCheck className="h-4 w-4" />;
            case 'user_role_updated':
                return <Shield className="h-4 w-4" />;
            case 'project_created':
                return <FolderPlus className="h-4 w-4" />;
            case 'project_updated':
                return <FolderPlus className="h-4 w-4" />;
            case 'project_deleted':
                return <UserX className="h-4 w-4" />;
            case 'project_status_changed':
                return <FolderPlus className="h-4 w-4" />;
            case 'workspace_created':
                return <FolderPlus className="h-4 w-4" />;
            case 'workspace_updated':
                return <FolderPlus className="h-4 w-4" />;
            case 'workspace_deleted':
                return <UserX className="h-4 w-4" />;
            case 'workspace_member_added':
                return <UserPlus className="h-4 w-4" />;
            case 'mentor_assigned':
                return <UserPlus className="h-4 w-4" />;
            case 'mentor_removed':
                return <UserX className="h-4 w-4" />;
            case 'settings_updated':
                return <Settings className="h-4 w-4" />;
            case 'system_backup':
                return <Database className="h-4 w-4" />;
            case 'system_maintenance':
                return <Settings className="h-4 w-4" />;
            case 'system_announcement':
                return <Bell className="h-4 w-4" />;
            case 'bulk_operation':
                return <Users className="h-4 w-4" />;
            case 'data_export':
                return <Download className="h-4 w-4" />;
            case 'notification_sent':
                return <Bell className="h-4 w-4" />;
            case 'email_campaign':
                return <Mail className="h-4 w-4" />;
            case 'security_alert':
                return <AlertCircle className="h-4 w-4" />;
            case 'login_attempt':
                return <LogOut className="h-4 w-4" />;
            case 'password_reset':
                return <Key className="h-4 w-4" />;
            case 'two_factor_enabled':
                return <Lock className="h-4 w-4" />;
            case 'two_factor_disabled':
                return <Unlock className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
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

    const formatTime = (timestamp: any) => {
        // Handle Firebase Timestamp or ISO string
        let date: Date;
        if (timestamp && typeof timestamp.toDate === 'function') {
            date = timestamp.toDate();
        } else if (typeof timestamp === 'string') {
            date = new Date(timestamp);
        } else {
            date = new Date();
        }

        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Recent Activities
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Loading activities...
                        </p>
                    </div>
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
                            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Recent Activities
                        </h3>
                        <p className="text-sm text-red-500">
                            Failed to load activities
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Recent Activities
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Latest admin actions
                            </p>
                        </div>
                    </div>

                    {activities.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowModal(true)}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20 transition-colors"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {activities.slice(0, 5).map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                            onClick={() => setShowModal(true)}
                        >
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {getActivityIcon(activity.actionType)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {activity.title}
                                    </h4>
                                    {getStatusIcon(activity.status)}
                                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(activity.severity)}`}>
                                        {activity.severity}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                    {activity.description}
                                </p>

                                {activity.targetResource && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-2 truncate">
                                        Target: {activity.targetResource.type} - {activity.targetResource.name}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={activity.performedBy.userAvatar} />
                                            <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                {activity.performedBy.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {activity.performedBy.userName}
                                            </span>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                {activity.performedBy.userRole}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(activity.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {activities.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No recent activities</p>
                        <p className="text-xs text-slate-300 dark:text-slate-500 mt-1">
                            Activities will appear here as they occur
                        </p>
                    </div>
                )}

                {activities.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            variant="outline"
                            className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/20 transition-all"
                            onClick={() => setShowModal(true)}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            View All Activities
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                )}
            </motion.div>

            {/* Modal Component */}
            <RecentActivitiesModal
                open={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default RecentActivitiesFeed;
