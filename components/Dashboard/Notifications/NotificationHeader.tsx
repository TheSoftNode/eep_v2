"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailOpen, Trash2, X, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    CardTitle,
    CardDescription
} from '@/components/ui/card';

interface NotificationHeaderProps {
    selectedNotifications: string[];
    clearSelection: () => void;
    handleDeleteSelected: () => void;
    handleMarkAllAsRead: () => void;
    handleClearAll: () => void;
}

export default function NotificationHeader({
    selectedNotifications,
    clearSelection,
    handleDeleteSelected,
    handleMarkAllAsRead,
    handleClearAll
}: NotificationHeaderProps) {
    const [confirmClear, setConfirmClear] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="pb-4 sm:pb-6 pt-2 border-b border-indigo-100/40 dark:border-indigo-800/30 relative"
        >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10 opacity-60">
                <div className="absolute inset-0 bg-grid-indigo-100/40 dark:bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,80%,white)]"></div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative">
                <div>
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Notifications
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage all your notifications in one place
                    </CardDescription>
                </div>

                <AnimatePresence mode="wait">
                    {selectedNotifications.length > 0 ? (
                        <motion.div
                            key="selection-active"
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col xs:flex-row items-center gap-2 sm:gap-3"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearSelection}
                                className="w-full xs:w-auto border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
                            >
                                <X className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteSelected}
                                className="w-full xs:w-auto bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-600 dark:to-rose-600 hover:from-red-600 hover:to-rose-600 dark:hover:from-red-700 dark:hover:to-rose-700 text-white border-0 transition-colors shadow-sm shadow-red-500/20 dark:shadow-red-900/30 group"
                            >
                                <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                Delete ({selectedNotifications.length})
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="selection-inactive"
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col xs:flex-row items-center gap-2 sm:gap-3"
                        >
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    className="w-full xs:w-auto border-indigo-200 dark:border-indigo-800/50 bg-white/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-800/50 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors shadow-sm group"
                                >
                                    <MailOpen className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                                    <span className="hidden sm:inline">Mark All as</span> Read
                                </Button>
                            </motion.div>

                            <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
                                <DialogTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full xs:w-auto border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm group"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                                            <span className="hidden sm:inline">Clear</span> All
                                        </Button>
                                    </motion.div>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-md border-indigo-100 dark:border-indigo-800/50 shadow-lg rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-lg">
                                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                                            Clear All Notifications
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-600 dark:text-slate-400">
                                            Are you sure you want to clear all notifications? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="relative py-2">
                                        {/* Decorative element */}
                                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 opacity-20 blur-sm"></div>
                                        <div className="relative p-3 text-sm text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-800/30">
                                            All notifications, including unread ones, will be permanently removed from your account.
                                        </div>
                                    </div>

                                    <DialogFooter className="gap-2 sm:gap-0 mt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setConfirmClear(false)}
                                            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                handleClearAll();
                                                setConfirmClear(false);
                                            }}
                                            className="bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-600 dark:to-rose-600 hover:from-red-600 hover:to-rose-600 dark:hover:from-red-700 dark:hover:to-rose-700 text-white border-0 shadow-sm shadow-red-500/20 dark:shadow-red-900/30"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Clear All
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// Add utility classes for the grid background
const style = document.createElement('style');
style.textContent = `
  .bg-grid-indigo-100 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z' fill='rgba(99, 102, 241, 0.07)'/%3E%3C/svg%3E");
  }
  
  .bg-grid-white {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z' fill='rgba(255, 255, 255, 0.07)'/%3E%3C/svg%3E");
  }
`;
document.head.appendChild(style);