"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    RefreshCw,
    Trash2,
    UserX,
    UserCheck,
    Shield
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const BulkActionConfirmDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    action: string;
    selectedCount: number;
    isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, action, selectedCount, isLoading }) => {
    const [reason, setReason] = useState("");

    const getActionConfig = () => {
        switch (action) {
            case 'enable':
                return {
                    icon: UserCheck,
                    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
                    iconColor: 'text-emerald-600 dark:text-emerald-400',
                    titleColor: 'text-emerald-900 dark:text-emerald-100',
                    description: `enable ${selectedCount} selected users`,
                    confirmButtonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
                    type: 'info' as const
                };
            case 'disable':
                return {
                    icon: UserX,
                    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
                    iconColor: 'text-yellow-600 dark:text-yellow-400',
                    titleColor: 'text-yellow-900 dark:text-yellow-100',
                    description: `disable ${selectedCount} selected users`,
                    confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                    type: 'warning' as const
                };
            case 'delete':
                return {
                    icon: Trash2,
                    iconBg: 'bg-red-100 dark:bg-red-900/30',
                    iconColor: 'text-red-600 dark:text-red-400',
                    titleColor: 'text-red-900 dark:text-red-100',
                    description: `permanently delete ${selectedCount} selected users`,
                    confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white',
                    type: 'danger' as const
                };
            default:
                return {
                    icon: Shield,
                    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
                    iconColor: 'text-blue-600 dark:text-blue-400',
                    titleColor: 'text-blue-900 dark:text-blue-100',
                    description: `perform bulk action on ${selectedCount} selected users`,
                    confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
                    type: 'info' as const
                };
        }
    };

    const config = getActionConfig();
    const IconComponent = config.icon;

    const handleConfirm = () => {
        onConfirm();
        setReason(""); // Reset reason after confirmation
    };

    const handleClose = () => {
        onClose();
        setReason(""); // Reset reason when closing
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg max-w-md">
                <AlertDialogHeader className="pb-4">
                    <div className="flex items-start gap-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg",
                                config.iconBg
                            )}
                        >
                            <IconComponent className={cn("h-5 w-5", config.iconColor)} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <AlertDialogTitle className={cn(
                                "text-lg font-semibold",
                                config.titleColor
                            )}>
                                Confirm Bulk Action
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Are you sure you want to <span className="font-medium">{config.description}</span>?
                                {config.type === 'danger' && ' This action cannot be undone.'}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                {(action === 'delete' || action === 'disable') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="space-y-3 pb-4"
                    >
                        <Label
                            htmlFor="reason"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Reason {action === 'delete' ? '(recommended)' : '(optional)'}
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder={`Enter reason for ${action === 'delete' ? 'deleting' : 'disabling'} these users...`}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-20 resize-none"
                            disabled={isLoading}
                        />
                    </motion.div>
                )}

                <AlertDialogFooter className="pt-4 gap-3">
                    <AlertDialogCancel
                        onClick={handleClose}
                        disabled={isLoading}
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isLoading) {
                                handleConfirm();
                            }
                        }}
                        disabled={isLoading}
                        className={cn(
                            "font-medium min-w-[100px]",
                            config.confirmButtonClass,
                            isLoading && "opacity-75 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Processing...
                            </motion.div>
                        ) : (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="capitalize"
                            >
                                Confirm {action}
                            </motion.span>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};