"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Keyboard,
    Mouse,
    Zap,
    Shield,
    Users,
    FolderKanban,
    Briefcase,
    Download,
    Settings,
    UserPlus,
    HelpCircle,
    Lightbulb,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ShortcutItem {
    key: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    category: 'navigation' | 'actions' | 'management';
}

interface TipItem {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    type: 'tip' | 'feature' | 'shortcut';
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const shortcuts: ShortcutItem[] = [
        { key: 'Ctrl + U', description: 'Create new user', icon: UserPlus, category: 'actions' },
        { key: 'Ctrl + W', description: 'Create new workspace', icon: FolderKanban, category: 'actions' },
        { key: 'Ctrl + P', description: 'Create new project', icon: Briefcase, category: 'actions' },
        { key: 'Ctrl + M', description: 'Manage users', icon: Users, category: 'management' },
        { key: 'Ctrl + E', description: 'Export data', icon: Download, category: 'management' },
        { key: 'Ctrl + S', description: 'System settings', icon: Settings, category: 'management' },
    ];

    const tips: TipItem[] = [
        {
            title: 'Quick Actions Panel',
            description: 'Access the most common administrative tasks directly from your dashboard sidebar.',
            icon: Zap,
            type: 'feature'
        },
        {
            title: 'Keyboard Navigation',
            description: 'Use keyboard shortcuts to navigate faster. Press and hold Ctrl + any letter key to trigger actions.',
            icon: Keyboard,
            type: 'shortcut'
        },
        {
            title: 'System Notifications',
            description: 'Monitor user activities and system events in real-time through the notifications panel.',
            icon: Shield,
            type: 'feature'
        },
        {
            title: 'Batch Operations',
            description: 'Select multiple users or items to perform bulk actions like status updates or deletions.',
            icon: Users,
            type: 'tip'
        },
        {
            title: 'Smart Search',
            description: 'Use the search functionality with filters to quickly find users, projects, or workspaces.',
            icon: Lightbulb,
            type: 'tip'
        },
        {
            title: 'Role Management',
            description: 'Assign and modify user roles directly from the user management panel for better access control.',
            icon: Shield,
            type: 'feature'
        }
    ];

    const getCategoryColor = (category: string): string => {
        switch (category) {
            case 'navigation': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'actions': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'management': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const getTypeIcon = (type: string): React.ComponentType<{ className?: string }> => {
        switch (type) {
            case 'tip': return Lightbulb;
            case 'feature': return Star;
            case 'shortcut': return Keyboard;
            default: return HelpCircle;
        }
    };

    const getTypeColor = (type: string): string => {
        switch (type) {
            case 'tip': return 'text-yellow-600 dark:text-yellow-400';
            case 'feature': return 'text-indigo-600 dark:text-indigo-400';
            case 'shortcut': return 'text-green-600 dark:text-green-400';
            default: return 'text-slate-600 dark:text-slate-400';
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 p-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                                    <HelpCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        Admin Dashboard Help
                                    </h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Tips, shortcuts, and features to boost your productivity
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div className="p-6 space-y-8">

                            {/* Keyboard Shortcuts Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                        <Keyboard className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Keyboard Shortcuts
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {shortcuts.map((shortcut, index) => (
                                        <motion.div
                                            key={shortcut.key}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-white dark:bg-slate-700 shadow-sm">
                                                <shortcut.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {shortcut.description}
                                                    </span>
                                                    <Badge className={`text-xs font-mono ${getCategoryColor(shortcut.category)}`}>
                                                        {shortcut.key}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* Tips & Features Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                                        <Star className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Tips & Features
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tips.map((tip, index) => {
                                        const TypeIcon = getTypeIcon(tip.type);
                                        return (
                                            <motion.div
                                                key={tip.title}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${getTypeColor(tip.type)} bg-current/10`}>
                                                        <TypeIcon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                                                            {tip.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                            {tip.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Quick Start Guide */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Quick Start Guide
                                    </h3>
                                </div>

                                <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-800/50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mx-auto mb-3">
                                                <Mouse className="h-6 w-6" />
                                            </div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                Click to Navigate
                                            </h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Use the sidebar menu to access different sections of the admin panel.
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white mx-auto mb-3">
                                                <Keyboard className="h-6 w-6" />
                                            </div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                Use Shortcuts
                                            </h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Press Ctrl + key combinations for quick access to common actions.
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mx-auto mb-3">
                                                <Shield className="h-6 w-6" />
                                            </div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                Monitor Activity
                                            </h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Keep track of user activities and system events through notifications.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Need more help? Contact your system administrator
                            </div>
                            <Button
                                onClick={onClose}
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                            >
                                Got it, thanks!
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default HelpModal;