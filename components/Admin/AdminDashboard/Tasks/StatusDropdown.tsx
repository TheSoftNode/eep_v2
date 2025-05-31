"use client";

import React from "react";
import {
    ChevronDown,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { statusConfig, TaskStatus } from "./utils";



interface StatusDropdownProps {
    currentStatus: TaskStatus;
    onStatusChange: (status: TaskStatus) => void;
    compact?: boolean;
    disabled?: boolean;
    className?: string;
    availableStatuses?: TaskStatus[];
}

export function StatusDropdown({
    currentStatus,
    onStatusChange,
    compact = false,
    disabled = false,
    className,
    availableStatuses
}: StatusDropdownProps) {
    const config = statusConfig[currentStatus];
    const statuses = availableStatuses || Object.keys(statusConfig) as TaskStatus[];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size={compact ? "sm" : "default"}
                    disabled={disabled}
                    className={cn(
                        "transition-all duration-200 border",
                        config.borderColor,
                        config.hoverColor,
                        "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400",
                        compact ? "h-8 px-2 text-xs" : "h-9 px-3 text-sm",
                        config.bgColor,
                        disabled && "opacity-50 cursor-not-allowed",
                        className
                    )}
                >
                    <div className="flex items-center gap-2">
                        <div className={cn("flex items-center", config.color)}>
                            {config.icon}
                        </div>
                        <span className={cn("font-medium", config.color)}>
                            {config.label}
                        </span>
                        {!compact && (
                            <ChevronDown className={cn("h-3 w-3 ml-1", config.color)} />
                        )}
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg p-1"
                sideOffset={4}
            >
                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Update Task Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {statuses.map((status) => {
                    const statusConf = statusConfig[status];
                    return (
                        <DropdownMenuItem
                            key={status}
                            onClick={() => onStatusChange(status)}
                            className={cn(
                                "p-3 cursor-pointer transition-all duration-200 rounded-md mx-1 my-0.5",
                                statusConf.hoverColor,
                                "focus:ring-2 focus:ring-indigo-500/20"
                            )}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg border-2",
                                    statusConf.bgColor,
                                    statusConf.borderColor
                                )}>
                                    <div className={statusConf.color}>
                                        {statusConf.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className={cn("font-medium text-sm", statusConf.color)}>
                                        {statusConf.label}
                                    </span>
                                </div>
                                {currentStatus === status && (
                                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
