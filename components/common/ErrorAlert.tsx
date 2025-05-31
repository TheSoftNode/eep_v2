// ErrorAlert.tsx
import React from 'react';
import { XCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorAlertProps {
    message: string;
    details?: string;
    onDismiss?: () => void;
    className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
    message,
    details,
    onDismiss,
    className = ''
}) => {
    return (
        <Alert variant="destructive" className={`bg-red-50 dark:bg-red-900/20 border-red-300 text-red-800 dark:text-red-200 ${className}`}>
            <XCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
            <div className="flex-1">
                <AlertTitle>{message}</AlertTitle>
                {details && (
                    <AlertDescription className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {details}
                    </AlertDescription>
                )}
            </div>
            {onDismiss && (
                <div className="ml-auto pl-3">
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="inline-flex rounded-md bg-red-50 dark:bg-transparent p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/20 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                    >
                        <span className="sr-only">Dismiss</span>
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}
        </Alert>
    );
};

export default ErrorAlert;