import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Clock,
    Calendar,
    CheckCircle2,
    FileCheck,
    FileText,
    AlertTriangle,
    ChevronRight,
    BookOpen
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format, isBefore, parseISO, addDays } from 'date-fns';

interface Assignment {
    id: number | string;
    title: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'reviewed' | 'late' | 'missed';
    description: string;
    progress?: number;
    taskCount?: number;
    completedTasks?: number;
    points?: number;
    grade?: number;
    feedback?: string;
}

interface AssignmentListProps {
    assignments: Assignment[];
}

export const AssignmentList: React.FC<AssignmentListProps> = ({ assignments }) => {
    // Format due date with different labels based on timing
    const formatDueDate = (dueDate: string) => {
        const date = parseISO(dueDate);
        const now = new Date();
        const tomorrow = addDays(now, 1);

        // Check if due date is in the past
        if (isBefore(date, now)) {
            return {
                text: `Due ${format(date, 'MMM d, yyyy')} (Past due)`,
                isUrgent: true
            };
        }

        // Check if due date is today
        if (format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
            return {
                text: `Due today at ${format(date, 'h:mm a')}`,
                isUrgent: true
            };
        }

        // Check if due date is tomorrow
        if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
            return {
                text: `Due tomorrow at ${format(date, 'h:mm a')}`,
                isUrgent: true
            };
        }

        // Check if due date is within a week
        const oneWeekLater = addDays(now, 7);
        if (isBefore(date, oneWeekLater)) {
            return {
                text: `Due ${format(date, 'EEEE, MMM d')} at ${format(date, 'h:mm a')}`,
                isUrgent: false
            };
        }

        // Default format for dates more than a week away
        return {
            text: `Due ${format(date, 'MMM d, yyyy')}`,
            isUrgent: false
        };
    };

    // Get status badge for assignment with dark mode support
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    text: 'Pending',
                    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50"
                };
            case 'submitted':
                return {
                    text: 'Submitted',
                    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50"
                };
            case 'reviewed':
                return {
                    text: 'Reviewed',
                    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50"
                };
            case 'late':
                return {
                    text: 'Late',
                    className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50"
                };
            case 'missed':
                return {
                    text: 'Missed',
                    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50"
                };
            default:
                return {
                    text: status,
                    className: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50"
                };
        }
    };

    // Get status icon for assignment with dark mode colors
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
            case 'submitted':
                return <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
            case 'reviewed':
                return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
            case 'late':
                return <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
            case 'missed':
                return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
            default:
                return <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
        }
    };

    // Get button text based on status
    const getButtonText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Start Working';
            case 'submitted':
                return 'View Submission';
            case 'reviewed':
                return 'View Feedback';
            case 'late':
                return 'Submit Now';
            case 'missed':
                return 'View Details';
            default:
                return 'View Details';
        }
    };

    // Get button variant based on status
    const getButtonVariant = (status: string): "default" | "outline" | "secondary" | "destructive" | "ghost" | "link" => {
        switch (status) {
            case 'pending':
            case 'late':
                return 'default';
            default:
                return 'outline';
        }
    };

    // Get button color class with dark mode support
    const getButtonClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-0';
            case 'late':
                return 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 border-0';
            default:
                return 'dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50 backdrop-blur-sm';
        }
    };

    // Calculate progress value 
    const calculateProgress = (assignment: Assignment) => {
        if (assignment.progress !== undefined) {
            return assignment.progress;
        }

        if (assignment.taskCount && assignment.completedTasks !== undefined) {
            return (assignment.completedTasks / assignment.taskCount) * 100;
        }

        switch (assignment.status) {
            case 'pending':
                return 0;
            case 'submitted':
                return 75;
            case 'reviewed':
                return 100;
            case 'late':
                return 25;
            case 'missed':
                return 0;
            default:
                return 0;
        }
    };

    // Get progress indicator color with dark mode support
    const getProgressClassName = (status: string) => {
        switch (status) {
            case 'reviewed':
                return "bg-emerald-600 dark:bg-emerald-500";
            case 'submitted':
                return "bg-blue-600 dark:bg-blue-500";
            case 'late':
                return "bg-orange-600 dark:bg-orange-500";
            default:
                return "bg-indigo-600 dark:bg-indigo-500";
        }
    };

    return (
        <>
            {assignments.map((assignment) => {
                const status = getStatusBadge(assignment.status);
                const dueDate = formatDueDate(assignment.dueDate);
                const progress = calculateProgress(assignment);
                const progressColor = getProgressClassName(assignment.status);

                return (
                    <Card
                        key={assignment.id}
                        className="overflow-hidden border-indigo-100 dark:border-slate-700/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all hover:shadow-lg dark:hover:shadow-indigo-500/10 shadow-sm"
                    >
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-base line-clamp-1 dark:text-white">
                                        {assignment.title}
                                    </CardTitle>
                                    <div className="flex items-center text-sm">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "mr-2",
                                                status.className
                                            )}
                                        >
                                            <span className="flex items-center gap-1">
                                                {getStatusIcon(assignment.status)}
                                                {status.text}
                                            </span>
                                        </Badge>

                                        {assignment.points && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                                                            <BookOpen className="h-3.5 w-3.5 mr-1" />
                                                            {assignment.points} points
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                                        <p>Assignment worth {assignment.points} points</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}

                                        {assignment.grade !== undefined && (
                                            <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm">
                                                {assignment.grade}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-2">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                {assignment.description}
                            </p>

                            <div className="flex flex-col space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className={cn(
                                        "flex items-center text-sm",
                                        dueDate.isUrgent
                                            ? "text-amber-600 dark:text-amber-400 font-medium"
                                            : "text-slate-500 dark:text-slate-400"
                                    )}>
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {dueDate.text}
                                    </div>

                                    {progress > 0 && (
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {Math.round(progress)}% complete
                                        </span>
                                    )}
                                </div>

                                {/* Custom progress bar with dark mode support */}
                                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-300", progressColor)}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t dark:border-slate-700/50">
                            {assignment.status === 'reviewed' && assignment.feedback && (
                                <div className="text-xs text-slate-500 dark:text-slate-400 overflow-hidden line-clamp-1 mr-2">
                                    <span className="font-medium">Feedback:</span> {assignment.feedback}
                                </div>
                            )}

                            <div className="ml-auto">
                                <Button
                                    variant={getButtonVariant(assignment.status)}
                                    size="sm"
                                    className={cn(
                                        "flex items-center gap-1",
                                        getButtonClass(assignment.status)
                                    )}
                                    asChild
                                >
                                    <Link href={`/dashboard/assignments/${assignment.id}`}>
                                        {getButtonText(assignment.status)}
                                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}

            {assignments.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-lg dark:bg-slate-800/30 backdrop-blur-sm">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-lg text-slate-800 dark:text-white mb-1">No assignments available</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        You don't have any active assignments at the moment. Check back later or contact your mentor.
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50 backdrop-blur-sm"
                        asChild
                    >
                        <Link href="/dashboard/projects">
                            View Your Projects
                        </Link>
                    </Button>
                </div>
            )}
        </>
    );
};

export default AssignmentList;