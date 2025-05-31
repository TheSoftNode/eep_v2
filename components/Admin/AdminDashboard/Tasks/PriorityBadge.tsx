import { cn } from "@/lib/utils";
import { priorityConfig, TaskPriority } from "./utils";
import { Badge } from "@/components/ui/badge";

interface PriorityBadgeProps {
    priority: TaskPriority;
    compact?: boolean;
    variant?: 'default' | 'minimal' | 'pill';
    withIcon?: boolean;
    className?: string;
}

export function PriorityBadge({
    priority,
    compact = false,
    variant = 'default',
    withIcon = true,
    className
}: PriorityBadgeProps) {
    const config = priorityConfig[priority];

    const badgeContent = (
        <>
            {withIcon && (
                <div className={cn("flex items-center", config.color)}>
                    {config.icon}
                </div>
            )}
            <span className={cn(
                "font-medium",
                config.color,
                compact ? "text-xs" : "text-sm"
            )}>
                {compact ? config.shortLabel : config.label}
            </span>
        </>
    );

    if (variant === 'minimal') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                {badgeContent}
            </div>
        );
    }

    if (variant === 'pill') {
        return (
            <Badge
                variant="outline"
                className={cn(
                    "flex items-center gap-2 border-2 font-medium",
                    config.bgColor,
                    config.borderColor,
                    config.color,
                    compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
                    "rounded-full shadow-sm",
                    className
                )}
            >
                {badgeContent}
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className={cn(
                "flex items-center gap-2 border-2 font-medium",
                config.bgColor,
                config.borderColor,
                config.color,
                compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
                "shadow-sm",
                className
            )}
        >
            {badgeContent}
        </Badge>
    );
}