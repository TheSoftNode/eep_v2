"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Clock,
    User,
    FolderKanban,
    CheckCircle,
    XCircle,
    Eye,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface PendingApproval {
    id: string;
    type: 'join_request' | 'workspace_invitation' | 'mentor_application';
    title: string;
    description: string;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    priority: 'high' | 'medium' | 'low';
    timestamp: string;
    projectId?: string;
    workspaceId?: string;
}

const PendingApprovals: React.FC = () => {
    const { toast } = useToast();

    // Mock data - in real implementation, you'd fetch pending approvals from various sources
    const approvals: PendingApproval[] = [
        {
            id: '1',
            type: 'join_request',
            title: 'Project Join Request',
            description: 'Request to join "React Learning Path"',
            user: {
                name: 'Sarah Johnson',
                email: 'sarah@example.com'
            },
            priority: 'high',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            projectId: 'proj-1'
        },
        {
            id: '2',
            type: 'workspace_invitation',
            title: 'Workspace Access',
            description: 'Request access to "Frontend Development"',
            user: {
                name: 'Mike Chen',
                email: 'mike@example.com'
            },
            priority: 'medium',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            workspaceId: 'ws-1'
        },
        {
            id: '3',
            type: 'mentor_application',
            title: 'Mentor Application',
            description: 'Application to become a mentor',
            user: {
                name: 'Alex Rivera',
                email: 'alex@example.com'
            },
            priority: 'medium',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
    ];

    const getTypeIcon = (type: PendingApproval['type']) => {
        switch (type) {
            case 'join_request':
                return <User className="h-4 w-4" />;
            case 'workspace_invitation':
                return <FolderKanban className="h-4 w-4" />;
            case 'mentor_application':
                return <User className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'low':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else {
            const diffInHours = Math.floor(diffInMinutes / 60);
            return `${diffInHours}h ago`;
        }
    };

    const handleApprove = (approval: PendingApproval) => {
        toast({
            title: "Approved",
            description: `${approval.title} has been approved`
        });
    };

    const handleReject = (approval: PendingApproval) => {
        toast({
            title: "Rejected",
            description: `${approval.title} has been rejected`,
            variant: "destructive"
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Pending Approvals
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Items requiring attention
                        </p>
                    </div>
                </div>

                {approvals.length > 0 && (
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                        {approvals.length}
                    </Badge>
                )}
            </div>

            <div className="space-y-4">
                {approvals.map((approval, index) => (
                    <motion.div
                        key={approval.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {getTypeIcon(approval.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {approval.title}
                                    </h4>
                                    <Badge className={`text-xs ${getPriorityColor(approval.priority)}`}>
                                        {approval.priority}
                                    </Badge>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                    {approval.description}
                                </p>

                                <div className="flex items-center gap-2 mb-3">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={approval.user.avatar} />
                                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            {approval.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-medium text-slate-900 dark:text-white">
                                            {approval.user.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {approval.user.email}
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 ml-auto">
                                        {formatTime(approval.timestamp)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 px-2 text-xs text-slate-600 dark:text-slate-400"
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                    </Button>

                                    <Button
                                        size="sm"
                                        onClick={() => handleApprove(approval)}
                                        className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Approve
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleReject(approval)}
                                        className="h-7 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {approvals.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No pending approvals</p>
                    <p className="text-xs">All caught up!</p>
                </div>
            )}
        </motion.div>
    );
};

export default PendingApprovals;