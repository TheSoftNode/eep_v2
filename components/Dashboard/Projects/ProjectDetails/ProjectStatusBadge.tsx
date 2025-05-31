import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Play,
    CheckCircle,
    Archive,
    Pause,
    FileText,
} from 'lucide-react';

type ProjectStatus = 'active' | 'completed' | 'archived' | 'on-hold' | 'planning';

interface ProjectStatusBadgeProps {
    status: ProjectStatus;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showIcon?: boolean;
    variant?: 'default' | 'minimal' | 'gradient';
}

const statusConfig = {
    active: {
        label: 'Active',
        default: 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50 dark:hover:bg-emerald-900/50',
        minimal: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
        gradient: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg hover:from-emerald-600 hover:to-green-700',
        icon: Play,
        dotColor: 'bg-emerald-500',
        emoji: '🟢',
    },
    completed: {
        label: 'Completed',
        default: 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50 dark:hover:bg-blue-900/50',
        minimal: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
        gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:from-blue-600 hover:to-indigo-700',
        icon: CheckCircle,
        dotColor: 'bg-blue-500',
        emoji: '✅',
    },
    archived: {
        label: 'Archived',
        default: 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700',
        minimal: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50',
        gradient: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 shadow-lg hover:from-slate-600 hover:to-slate-700',
        icon: Archive,
        dotColor: 'bg-slate-500',
        emoji: '🗄️',
    },
    'on-hold': {
        label: 'On Hold',
        default: 'bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50 dark:hover:bg-yellow-900/50',
        minimal: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30',
        gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:from-yellow-600 hover:to-orange-600',
        icon: Pause,
        dotColor: 'bg-yellow-500',
        emoji: '⏸️',
    },
    planning: {
        label: 'Planning',
        default: 'bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50 dark:hover:bg-purple-900/50',
        minimal: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30',
        gradient: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg hover:from-purple-600 hover:to-indigo-700',
        icon: FileText,
        dotColor: 'bg-purple-500',
        emoji: '📝',
    },
} as const;

const sizeClasses = {
    sm: {
        base: 'text-xs px-2.5 py-1 h-6',
        icon: 'h-3 w-3',
        dot: 'w-1.5 h-1.5',
        spacing: 'gap-1.5',
    },
    md: {
        base: 'text-sm px-3 py-1.5 h-7',
        icon: 'h-3.5 w-3.5',
        dot: 'w-2 h-2',
        spacing: 'gap-2',
    },
    lg: {
        base: 'text-base px-4 py-2 h-9',
        icon: 'h-4 w-4',
        dot: 'w-2.5 h-2.5',
        spacing: 'gap-2',
    },
};

export default function ProjectStatusBadge({
    status,
    size = 'md',
    className = '',
    showIcon = true,
    variant = 'default',
}: ProjectStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.active;
    const sizeConfig = sizeClasses[size];
    const Icon = config.icon;

    // Get the appropriate style based on variant
    const getVariantStyle = () => {
        switch (variant) {
            case 'minimal':
                return config.minimal;
            case 'gradient':
                return config.gradient;
            default:
                return config.default;
        }
    };

    return (
        <Badge
            className={cn(
                'inline-flex items-center font-medium rounded-lg transition-all duration-200 cursor-default select-none',
                getVariantStyle(),
                sizeConfig.base,
                sizeConfig.spacing,
                // Add subtle animation for gradient variant
                variant === 'gradient' && 'hover:scale-105 transform',
                className
            )}
            aria-label={`Project status: ${config.label}`}
        >
            {showIcon && (
                <div className="flex items-center justify-center">
                    {variant === 'minimal' ? (
                        // Use dot indicator for minimal variant
                        <div className={cn(
                            'rounded-full',
                            config.dotColor,
                            sizeConfig.dot
                        )} />
                    ) : size === 'sm' ? (
                        // Use emoji for small size to save space
                        <span className="mr-0.5">{config.emoji}</span>
                    ) : (
                        // Use Lucide icon for default and gradient variants
                        <Icon className={cn(
                            sizeConfig.icon,
                            variant === 'gradient' ? 'text-white' : ''
                        )} />
                    )}
                </div>
            )}
            <span className="font-semibold tracking-wide">
                {config.label}
            </span>
        </Badge>
    );
}