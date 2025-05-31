import React from "react";
import { statusConfig, TaskStatus } from "./utils";
import { cn } from "@/lib/utils";

interface TaskStatusIconProps {
    status: TaskStatus;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'icon' | 'badge' | 'circle';
    animated?: boolean;
    className?: string;
}

export function TaskStatusIcon({
    status,
    size = 'md',
    variant = 'icon',
    animated = false,
    className
}: TaskStatusIconProps) {
    const config = statusConfig[status];

    const sizeClasses = {
        sm: { icon: 'h-3 w-3', container: 'w-6 h-6' },
        md: { icon: 'h-4 w-4', container: 'w-8 h-8' },
        lg: { icon: 'h-5 w-5', container: 'w-10 h-10' }
    };

    const iconElement = React.cloneElement(config.icon, {
        className: cn(sizeClasses[size].icon, config.color)
    });

    if (variant === 'icon') {
        return (
            <div className={cn(
                "flex items-center justify-center",
                animated && "transition-transform hover:scale-110",
                className
            )}>
                {iconElement}
            </div>
        );
    }

    if (variant === 'badge') {
        return (
            <div className={cn(
                "flex items-center justify-center rounded-md border-2",
                sizeClasses[size].container,
                config.bgColor,
                config.borderColor,
                animated && "transition-all hover:scale-110 hover:shadow-md",
                className
            )}>
                {iconElement}
            </div>
        );
    }

    return (
        <div className={cn(
            "flex items-center justify-center rounded-full border-2 shadow-sm",
            sizeClasses[size].container,
            config.bgColor,
            config.borderColor,
            animated && "transition-all hover:scale-110 hover:shadow-md",
            className
        )}>
            {iconElement}
        </div>
    );
}