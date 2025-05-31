
import React from "react";
import {
    Flag,
    Zap,
    Target,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Upload,
    Play,
    Pause
} from "lucide-react";




// Updated types based on new API structure
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'upcoming' | 'in-progress' | 'submitted' | 'completed' | 'blocked' | 'overdue';

// Priority Configuration
export const priorityConfig = {
    low: {
        label: 'Low Priority',
        shortLabel: 'Low',
        icon: <Flag className="h-3 w-3" />,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        hoverColor: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
        gradient: 'from-emerald-500 to-green-500'
    },
    medium: {
        label: 'Medium Priority',
        shortLabel: 'Medium',
        icon: <Flag className="h-3 w-3" />,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        hoverColor: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
        gradient: 'from-yellow-500 to-orange-500'
    },
    high: {
        label: 'High Priority',
        shortLabel: 'High',
        icon: <Flag className="h-3 w-3" />,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        borderColor: 'border-orange-200 dark:border-orange-800',
        hoverColor: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
        gradient: 'from-orange-500 to-red-500'
    },
    critical: {
        label: 'Critical Priority',
        shortLabel: 'Critical',
        icon: <Zap className="h-3 w-3" />,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-800',
        hoverColor: 'hover:bg-red-50 dark:hover:bg-red-900/20',
        gradient: 'from-red-500 to-red-600'
    }
};

// Status Configuration
export const statusConfig = {
    todo: {
        label: 'To Do',
        icon: <Target className="h-3 w-3" />,
        color: 'text-slate-600 dark:text-slate-400',
        bgColor: 'bg-slate-100 dark:bg-slate-800',
        borderColor: 'border-slate-200 dark:border-slate-700',
        hoverColor: 'hover:bg-slate-50 dark:hover:bg-slate-700',
        gradient: 'from-slate-500 to-slate-600'
    },
    upcoming: {
        label: 'Upcoming',
        icon: <Calendar className="h-3 w-3" />,
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
        hoverColor: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
        gradient: 'from-indigo-500 to-indigo-600'
    },
    'in-progress': {
        label: 'In Progress',
        icon: <Play className="h-3 w-3" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
        hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
        gradient: 'from-blue-500 to-blue-600'
    },
    submitted: {
        label: 'Submitted',
        icon: <Upload className="h-3 w-3" />,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        hoverColor: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
        gradient: 'from-yellow-500 to-yellow-600'
    },
    completed: {
        label: 'Completed',
        icon: <CheckCircle2 className="h-3 w-3" />,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        hoverColor: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
        gradient: 'from-emerald-500 to-green-500'
    },
    blocked: {
        label: 'Blocked',
        icon: <Pause className="h-3 w-3" />,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-800',
        hoverColor: 'hover:bg-red-50 dark:hover:bg-red-900/20',
        gradient: 'from-red-500 to-red-600'
    },
    overdue: {
        label: 'Overdue',
        icon: <AlertCircle className="h-3 w-3" />,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        borderColor: 'border-orange-200 dark:border-orange-800',
        hoverColor: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
        gradient: 'from-orange-500 to-red-500'
    }
};