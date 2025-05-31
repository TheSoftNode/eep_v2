import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    label?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'primary',
    label,
    fullScreen = false
}) => {
    // Size class mapping
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    // Color class mapping
    const colorClasses = {
        primary: 'text-indigo-600',
        secondary: 'text-gray-600',
        success: 'text-green-500',
        danger: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500',
    };

    // Container class based on fullScreen prop
    const containerClass = fullScreen
        ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-50'
        : 'flex flex-col justify-center items-center py-6';

    return (
        <div className={containerClass}>
            <Loader2
                className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
                role="status"
            />
            {label && (
                <span className="mt-4 text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {label}
                </span>
            )}
        </div>
    );
};

export default LoadingSpinner;