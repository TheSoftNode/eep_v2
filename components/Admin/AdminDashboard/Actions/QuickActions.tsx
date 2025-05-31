"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    UserPlus,
    FolderKanban,
    Briefcase,
    Users,
    Download,
    Settings,
    Shield,
    FileText,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    action?: () => void;
    color: string;
    shortcut?: string;
}

const QuickActions: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();

    // Define quick actions based on your admin capabilities
    const quickActions: QuickAction[] = [
        {
            id: 'create-user',
            title: 'Create User',
            description: 'Add a new user to the system',
            icon: UserPlus,
            href: '/admin/users/create',
            color: 'from-blue-500 to-blue-600',
            shortcut: 'Ctrl+U'
        },
        {
            id: 'create-workspace',
            title: 'New Workspace',
            description: 'Create a new workspace',
            href: '/admin/workspaces/create',
            icon: FolderKanban,
            color: 'from-emerald-500 to-emerald-600',
            shortcut: 'Ctrl+W'
        },
        {
            id: 'create-project',
            title: 'New Project',
            description: 'Start a new project',
            href: '/admin/projects/create',
            icon: Briefcase,
            color: 'from-violet-500 to-violet-600',
            shortcut: 'Ctrl+P'
        },
        {
            id: 'manage-users',
            title: 'Manage Users',
            description: 'View and edit user accounts',
            href: '/admin/users',
            icon: Users,
            color: 'from-indigo-500 to-indigo-600'
        },
        {
            id: 'export-data',
            title: 'Export Data',
            description: 'Download system reports',
            icon: Download,
            color: 'from-orange-500 to-orange-600',
            action: () => handleExportData()
        },
        {
            id: 'system-settings',
            title: 'System Settings',
            description: 'Configure system preferences',
            href: '/admin/settings',
            icon: Settings,
            color: 'from-slate-500 to-slate-600'
        }
    ];

    const handleExportData = () => {
        toast({
            title: "Export Started",
            description: "Your data export will be ready shortly"
        });
        // Implement actual export logic here
    };

    const handleActionClick = (action: QuickAction) => {
        if (action.action) {
            action.action();
        } else if (action.href) {
            router.push(action.href);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <Shield className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Quick Actions
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Common administrative tasks
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action, index) => (
                    <motion.div
                        key={action.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => handleActionClick(action)}
                            className="w-full h-auto p-4 justify-start hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-all duration-200"
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className={`flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br ${action.color} text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                                    <action.icon className="h-5 w-5" />
                                </div>

                                <div className="flex-1 text-left">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                            {action.title}
                                        </h4>
                                        {action.shortcut && (
                                            <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                {action.shortcut}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {action.description}
                                    </p>
                                </div>

                                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                            </div>
                        </Button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Need help?</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/admin/support')}
                        className="text-xs h-6 px-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                        <FileText className="h-3 w-3 mr-1" />
                        View docs
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default QuickActions;