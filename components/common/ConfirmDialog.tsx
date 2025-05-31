import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
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

interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void; // Changed from onClose to onCancel
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    confirmButtonClass?: string; // Added to match your usage
    isLoading?: boolean; // Changed from processing to isLoading
    confirmDisabled?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onCancel, // Changed from onClose
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    confirmButtonClass, // Added to match your usage
    isLoading = false, // Changed from processing
    confirmDisabled = false,
}) => {
    // Type configuration
    const typeConfig = {
        danger: {
            icon: <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />,
            confirmButtonClass: confirmButtonClass || 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
        },
        warning: {
            icon: <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />,
            confirmButtonClass: confirmButtonClass || 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white',
        },
        info: {
            icon: <AlertTriangle className="h-6 w-6 text-blue-600" aria-hidden="true" />,
            confirmButtonClass: confirmButtonClass || 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
        },
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent className="bg-white dark:bg-gray-800">
                <AlertDialogHeader>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 mr-4">
                            {typeConfig[type].icon}
                        </div>
                        <div>
                            <AlertDialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                                {message}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium ${typeConfig[type].confirmButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => {
                            // Prevent default to handle manually
                            e.preventDefault();
                            if (!confirmDisabled && !isLoading) {
                                onConfirm();
                            }
                        }}
                        disabled={confirmDisabled || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                Processing...
                            </>
                        ) : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDialog;