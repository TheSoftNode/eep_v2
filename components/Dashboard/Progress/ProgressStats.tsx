import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { convertToDate, formatDate, getDaysStatus } from '@/components/utils/dateUtils';
import { Project, ProjectTask } from '@/Redux/types/Projects';
import { getProgressBadgeColor, getProgressColor, getProgressStatusText } from '@/components/utils/projectUtils';

interface ProgressStatsProps {
    project: Project;
    tasks: ProjectTask[]; // Now using the unified type
}

export default function ProgressStats({ project, tasks }: ProgressStatsProps) {
    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;

    // Calculate days remaining
    const calculateDaysRemaining = () => {
        const endDate = convertToDate(project.endDate);
        if (!endDate) return 0;
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };

    const daysStatus = getDaysStatus(project.endDate);

    // Estimated completion date
    const calculateEstimatedCompletion = () => {
        const startDate = convertToDate(project.startDate);
        const endDate = convertToDate(project.endDate);

        if (!startDate || !endDate) return "Unknown";

        const today = new Date();

        if (project.progress >= 100 || today > endDate) {
            return "Completed";
        }

        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedDuration = today.getTime() - startDate.getTime();
        const expectedProgress = (elapsedDuration / totalDuration) * 100;

        if (project.progress >= expectedProgress + 20) {
            const progressRate = project.progress / elapsedDuration;
            const estimatedTotalTime = 100 / progressRate;
            const estimatedCompletionDate = new Date(startDate.getTime() + estimatedTotalTime);
            return formatDate(estimatedCompletionDate);
        }

        if (project.progress <= expectedProgress - 20) {
            const progressRate = project.progress / elapsedDuration;
            const estimatedTotalTime = 100 / progressRate;
            const estimatedCompletionDate = new Date(startDate.getTime() + estimatedTotalTime);
            return formatDate(estimatedCompletionDate);
        }

        return formatDate(endDate);
    };

    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            <Card className="border-indigo-100">
                <CardHeader className="pb-1 md:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-900">{project.progress}%</div>
                        <Badge variant="outline" className={cn("text-xs", getProgressBadgeColor(project.progress))}>
                            {getProgressStatusText(project.progress)}
                        </Badge>
                    </div>
                    <Progress
                        value={project.progress}
                        className={cn("h-2 md:h-2.5 mt-1", getProgressColor(project.progress))}
                    />
                </CardContent>
            </Card>

            <Card className="border-indigo-100">
                <CardHeader className="pb-1 md:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Task Completion</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-900">
                            {completedTasks}/{totalTasks}
                        </div>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {Math.round((completedTasks / (totalTasks || 1)) * 100)}% Complete
                        </Badge>
                    </div>
                    <Progress
                        value={(completedTasks / (totalTasks || 1)) * 100}
                        className="h-2 md:h-2.5 mt-1 bg-blue-100 [&>div]:bg-blue-600"
                    />
                </CardContent>
            </Card>

            <Card className="border-indigo-100">
                <CardHeader className="pb-1 md:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Time Remaining</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-900 truncate pr-1">
                            {calculateDaysRemaining()} days
                        </div>
                        <Badge
                            variant="outline"
                            className={cn("text-xs whitespace-nowrap", daysStatus.isOverdue ?
                                "bg-red-50 text-red-700 border-red-200" :
                                "bg-purple-50 text-purple-700 border-purple-200")}
                        >
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            {daysStatus.isOverdue ? 'Overdue' : (calculateDaysRemaining() > 0 ? 'In Progress' : 'Due Today')}
                        </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 md:mt-3">
                        <span className="truncate pr-1">Started: {formatDate(project.startDate)}</span>
                        <span className="truncate pl-1">Due: {formatDate(project.endDate)}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-indigo-100">
                <CardHeader className="pb-1 md:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Estimated Completion</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-lg sm:text-xl md:text-xl font-bold text-indigo-900 truncate pr-1">
                            {calculateEstimatedCompletion()}
                        </div>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                            Projected
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 md:mt-3 line-clamp-2">
                        Based on current progress rate and remaining work
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}


