import React from 'react';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
    role: string;
    className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
    const getRoleStyling = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-800/30';
            case 'mentor':
                return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30';
            case 'learner':
                return 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30';
            case 'user':
                return 'bg-gradient-to-r from-slate-500/10 to-gray-500/10 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/30';
            default:
                return 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/30';
        }
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-200 shadow-sm",
            getRoleStyling(role),
            className
        )}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
};

export default RoleBadge;