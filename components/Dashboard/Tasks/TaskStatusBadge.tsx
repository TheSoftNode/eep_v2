
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusConfig, TaskStatus } from "./utils";



// Enhanced Task Status Badge Component
interface TaskStatusBadgeProps {
    status: TaskStatus;
    withIcon?: boolean;
    compact?: boolean;
    variant?: 'default' | 'minimal' | 'pill';
    animated?: boolean;
    showPulse?: boolean;
    className?: string;
}

export function TaskStatusBadge({
    status,
    withIcon = true,
    compact = false,
    variant = 'default',
    animated = false,
    showPulse = false,
    className
}: TaskStatusBadgeProps) {
    const config = statusConfig[status];

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
                {config.label}
            </span>
            {showPulse && (status === 'in-progress' || status === 'upcoming') && (
                <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    status === 'in-progress' ? 'bg-blue-500' : 'bg-indigo-500'
                )} />
            )}
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
                    "flex items-center gap-2 border-2 font-medium transition-all duration-200",
                    config.bgColor,
                    config.borderColor,
                    config.color,
                    compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
                    "rounded-full shadow-sm",
                    animated && "hover:scale-105 hover:shadow-md",
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
                "flex items-center gap-2 border-2 font-medium transition-all duration-200",
                config.bgColor,
                config.borderColor,
                config.color,
                compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
                "shadow-sm",
                animated && "hover:scale-105 hover:shadow-md",
                className
            )}
        >
            {badgeContent}
        </Badge>
    );
}