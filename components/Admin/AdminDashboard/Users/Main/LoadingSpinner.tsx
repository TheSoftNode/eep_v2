import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// LoadingSpinner Component
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message,
    className = ''
}) => {
    const sizeConfig = {
        sm: {
            spinner: 'w-6 h-6',
            text: 'text-sm',
            container: 'py-8'
        },
        md: {
            spinner: 'w-8 h-8',
            text: 'text-base',
            container: 'py-12'
        },
        lg: {
            spinner: 'w-10 h-10',
            text: 'text-lg',
            container: 'py-16'
        }
    };

    const config = sizeConfig[size];

    return (
        <div className={cn("flex flex-col items-center justify-center space-y-4", config.container, className)}>
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={cn(
                        "rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400",
                        config.spinner
                    )}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                </div>
            </div>
            {message && (
                <p className={cn(
                    "text-slate-600 dark:text-slate-400 font-medium text-center",
                    config.text
                )}>
                    {message}
                </p>
            )}
        </div>
    );
};
