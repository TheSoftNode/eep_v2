import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Shield, Info, RefreshCw } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

// ConfirmDialog Component
interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    confirmButtonClass?: string;
    isLoading?: boolean;
    confirmDisabled?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onCancel,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    confirmButtonClass,
    isLoading = false,
    confirmDisabled = false,
}) => {
    const typeConfig = {
        danger: {
            icon: AlertTriangle,
            iconBg: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
            confirmButtonClass: confirmButtonClass || 'bg-red-600 hover:bg-red-700 text-white',
            titleColor: 'text-red-900 dark:text-red-100'
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            confirmButtonClass: confirmButtonClass || 'bg-yellow-600 hover:bg-yellow-700 text-white',
            titleColor: 'text-yellow-900 dark:text-yellow-100'
        },
        info: {
            icon: Info,
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            confirmButtonClass: confirmButtonClass || 'bg-blue-600 hover:bg-blue-700 text-white',
            titleColor: 'text-blue-900 dark:text-blue-100'
        },
    };

    const config = typeConfig[type];
    const IconComponent = config.icon;

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg max-w-md">
                <AlertDialogHeader className="pb-4">
                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg",
                            config.iconBg
                        )}>
                            <IconComponent className={cn("h-5 w-5", config.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <AlertDialogTitle className={cn(
                                "text-lg font-semibold",
                                config.titleColor
                            )}>
                                {title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                {message}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="pt-4 gap-3">
                    <AlertDialogCancel
                        onClick={onCancel}
                        disabled={isLoading}
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            if (!confirmDisabled && !isLoading) {
                                onConfirm();
                            }
                        }}
                        disabled={confirmDisabled || isLoading}
                        className={cn(
                            "font-medium",
                            config.confirmButtonClass,
                            (confirmDisabled || isLoading) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Processing...
                            </div>
                        ) : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
