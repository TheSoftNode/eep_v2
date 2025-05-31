"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, ArrowLeft, SlidersHorizontal, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NotificationFilterProps {
    unreadOnly: boolean;
    setUnreadOnly: (value: boolean) => void;
}

export default function NotificationFilter({
    unreadOnly,
    setUnreadOnly
}: NotificationFilterProps) {
    const router = useRouter();
    const [filterOpen, setFilterOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-1"
        >
            <div className="flex items-center w-full sm:w-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/learners-dashboard')}
                    className="group relative overflow-hidden text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/30 transition-all duration-300"
                >
                    {/* Subtle hover effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-100/0 via-indigo-100/40 to-indigo-100/0 dark:from-indigo-900/0 dark:via-indigo-900/20 dark:to-indigo-900/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>

                    <div className="relative flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="font-medium">Back to Dashboard</span>
                    </div>
                </Button>
            </div>

            <div className="flex items-center w-full sm:w-auto gap-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={unreadOnly ? "unread" : "all"}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUnreadOnly(!unreadOnly)}
                            className={cn(
                                "w-full sm:w-auto border shadow-sm transition-all duration-200 backdrop-blur-sm",
                                unreadOnly
                                    ? "bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-200/90 dark:hover:bg-indigo-900/50"
                                    : "bg-white/80 dark:bg-slate-900/80 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50"
                            )}
                        >
                            {unreadOnly ? (
                                <Eye className="h-4 w-4 mr-2 text-indigo-700 dark:text-indigo-400" />
                            ) : (
                                <EyeOff className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-500" />
                            )}
                            <span className="font-medium">{unreadOnly ? "Unread Only" : "Show All"}</span>
                        </Button>
                    </motion.div>
                </AnimatePresence>

                <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-indigo-100 dark:border-indigo-800/30 bg-white/80 dark:bg-slate-900/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 shadow-sm transition-all duration-200"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 p-2 border-indigo-100/80 dark:border-indigo-800/30 shadow-lg rounded-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95"
                    >
                        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Filter Options
                        </div>
                        <DropdownMenuItem
                            className="flex items-center rounded-md cursor-pointer px-2 py-1.5 text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30"
                            onClick={() => setUnreadOnly(true)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Show Unread Only</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="flex items-center rounded-md cursor-pointer px-2 py-1.5 text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30"
                            onClick={() => setUnreadOnly(false)}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            <span>Show All Notifications</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.div>
    );
}