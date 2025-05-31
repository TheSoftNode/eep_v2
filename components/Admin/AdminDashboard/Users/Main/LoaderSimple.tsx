import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';


// LoaderSimple Component
interface LoaderSimpleProps {
    message?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const LoaderSimple: React.FC<LoaderSimpleProps> = ({
    message = 'Loading...',
    className = '',
    size = 'lg'
}) => {
    const sizeConfig = {
        sm: {
            container: 'py-8',
            spinner: 'w-6 h-6',
            text: 'text-sm'
        },
        md: {
            container: 'py-12',
            spinner: 'w-8 h-8',
            text: 'text-base'
        },
        lg: {
            container: 'py-20',
            spinner: 'w-10 h-10',
            text: 'text-lg'
        }
    };

    const config = sizeConfig[size];

    return (
        <div className={cn(
            "flex flex-col items-center justify-center space-y-4",
            config.container,
            className
        )}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={cn(
                    "rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400",
                    config.spinner
                )}
            />
            <p className={cn(
                "font-medium text-slate-600 dark:text-slate-400",
                config.text
            )}>
                {message}
            </p>
        </div>
    );
};