import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, X, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


// ErrorAlert Component
interface ErrorAlertProps {
    message: string;
    details?: string;
    onDismiss?: () => void;
    className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
    message,
    details,
    onDismiss,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Alert className={cn(
                "bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800/50 shadow-sm",
                className
            )}>
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <AlertTitle className="font-semibold text-sm text-red-800 dark:text-red-200">
                            {message}
                        </AlertTitle>
                        {details && (
                            <AlertDescription className="mt-1 text-sm text-red-700 dark:text-red-300">
                                {details}
                            </AlertDescription>
                        )}
                    </div>
                    {onDismiss && (
                        <div className="flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onDismiss}
                                className="h-6 w-6 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </Alert>
        </motion.div>
    );
};
