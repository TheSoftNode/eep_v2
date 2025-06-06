"use client";

import React, { useEffect, useCallback, useState } from "react";
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
import HelpModal from "./HelpModal";

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    action?: () => void;
    color: string;
    shortcut?: string;
    keyCombo?: string[]; // For detecting key combinations
}

const QuickActions: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

    const quickActions: QuickAction[] = [
        {
            id: 'create-user',
            title: 'Create User',
            description: 'Add a new user to the system',
            icon: UserPlus,
            href: '/admin/dashboard/users/create',
            color: 'from-blue-500 to-blue-600',
            shortcut: 'Ctrl+U',
            keyCombo: ['ctrl', 'u']
        },
        {
            id: 'create-workspace',
            title: 'New Workspace',
            description: 'Create a new workspace',
            href: '/admin/dashboard/workspaces/create',
            icon: FolderKanban,
            color: 'from-emerald-500 to-emerald-600',
            shortcut: 'Ctrl+W',
            keyCombo: ['ctrl', 'w']
        },
        {
            id: 'create-project',
            title: 'New Project',
            description: 'Start a new project',
            href: '/admin/dashboard/projects/create',
            icon: Briefcase,
            color: 'from-violet-500 to-violet-600',
            shortcut: 'Ctrl+P',
            keyCombo: ['ctrl', 'p']
        },
        {
            id: 'manage-users',
            title: 'Manage Users',
            description: 'View and edit user accounts',
            href: '/admin/dashboard/users',
            icon: Users,
            color: 'from-indigo-500 to-indigo-600',
            shortcut: 'Ctrl+M',
            keyCombo: ['ctrl', 'm']
        },
        {
            id: 'export-data',
            title: 'Export Data',
            description: 'Download system reports',
            icon: Download,
            color: 'from-orange-500 to-orange-600',
            shortcut: 'Ctrl+E',
            keyCombo: ['ctrl', 'e'],
            action: () => handleExportData()
        },
        {
            id: 'system-settings',
            title: 'System Settings',
            description: 'Configure system preferences',
            href: '/admin/dashboard/settings',
            icon: Settings,
            color: 'from-slate-500 to-slate-600',
            shortcut: 'Ctrl+S',
            keyCombo: ['ctrl', 's']
        }
    ];

    const handleExportData = (): void => {
        toast({
            title: "Export Started",
            description: "Your data export will be ready shortly"
        });
        // Implement actual export logic here
    };

    const handleActionClick = (action: QuickAction): void => {
        if (action.action) {
            action.action();
        } else if (action.href) {
            router.push(action.href);
        }

        // Show toast feedback for keyboard shortcut usage
        toast({
            title: `${action.title}`,
            description: `Opened via ${action.shortcut || 'click'}`,
            duration: 2000
        });
    };

    // Keyboard event handler
    const handleKeyDown = useCallback((event: KeyboardEvent): void => {
        // Don't trigger shortcuts if user is typing in an input field
        const activeElement = document.activeElement;
        const isInputField = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            (activeElement as HTMLElement).contentEditable === 'true'
        );

        if (isInputField) return;

        const pressedKeys: string[] = [];

        // Check for modifier keys
        if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl');
        if (event.shiftKey) pressedKeys.push('shift');
        if (event.altKey) pressedKeys.push('alt');

        // Add the main key
        pressedKeys.push(event.key.toLowerCase());

        // Find matching action
        const matchingAction = quickActions.find((action: QuickAction) => {
            if (!action.keyCombo) return false;

            // Check if all keys in the combo are pressed
            return action.keyCombo.every((key: string) => pressedKeys.includes(key)) &&
                action.keyCombo.length === pressedKeys.length;
        });

        if (matchingAction) {
            event.preventDefault();
            event.stopPropagation();

            // Add visual feedback
            const actionElement = document.querySelector(`[data-action-id="${matchingAction.id}"]`) as HTMLElement;
            if (actionElement) {
                actionElement.classList.add('bg-indigo-100', 'dark:bg-indigo-900/30');
                setTimeout(() => {
                    actionElement.classList.remove('bg-indigo-100', 'dark:bg-indigo-900/30');
                }, 200);
            }

            handleActionClick(matchingAction);
        }
    }, [quickActions, router, toast]);

    // Set up keyboard event listeners
    useEffect((): (() => void) => {
        document.addEventListener('keydown', handleKeyDown);

        return (): void => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // Show keyboard shortcuts help on mount
    useEffect((): void => {
        const hasSeenShortcuts = localStorage.getItem('admin-shortcuts-seen');
        if (!hasSeenShortcuts) {
            setTimeout(() => {
                toast({
                    title: "⌨️ Keyboard Shortcuts Available",
                    description: "Use Ctrl+U, Ctrl+W, Ctrl+P and more for quick actions!",
                    duration: 5000
                });
                localStorage.setItem('admin-shortcuts-seen', 'true');
            }, 2000);
        }
    }, [toast]);

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
                        Common administrative tasks • Keyboard shortcuts enabled
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
                            data-action-id={action.id}
                            className="w-full h-auto p-4 justify-start hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                            title={`${action.title} - ${action.shortcut || 'No shortcut'}`}
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
                                            <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono">
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
                    <div className="flex items-center gap-4">
                        <span>⌨️ Shortcuts active</span>
                        <span className="hidden sm:inline">• Use Ctrl+Key for quick access</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsHelpModalOpen(true)}
                        className="text-xs h-6 px-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                        <FileText className="h-3 w-3 mr-1" />
                        View docs
                    </Button>
                </div>
            </div>

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />
        </motion.div>
    );
};

export default QuickActions;