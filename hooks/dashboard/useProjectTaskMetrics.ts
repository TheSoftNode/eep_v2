"use client";

import { useMemo } from "react";
import { useGetTasksQuery } from "@/Redux/apiSlices/tasks/tasksApiSlice";
import { convertFirebaseDateRobust } from "@/components/utils/dateUtils";

export interface ProjectTaskMetrics {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    averageCompletionTime?: number; // in days
    upcomingDeadlines: number; // tasks due in next 7 days
}

export const useProjectTaskMetrics = (projectId: string, areaId?: string) => {
    // Fetch tasks for specific project/area
    const { data: tasksData, isLoading, error, refetch } = useGetTasksQuery({
        projectId,
        projectAreaId: areaId,
        limit: 1000, // Get all tasks for accurate metrics
        includeCompleted: true
    });

    // Calculate task-specific metrics
    const metrics: ProjectTaskMetrics | null = useMemo(() => {
        if (!tasksData?.data) {
            return null;
        }

        const tasks = tasksData.data;
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Basic counts
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;

        // Overdue tasks (not completed and past due date)
        const overdue = tasks.filter(t => {
            if (t.status === 'completed') return false;
            const dueDate = convertFirebaseDateRobust(t.dueDate);
            return dueDate < now;
        }).length;

        // Completion rate
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Group by priority
        const byPriority = tasks.reduce((acc, t) => {
            acc[t.priority] = (acc[t.priority] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Group by status
        const byStatus = tasks.reduce((acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Upcoming deadlines (tasks due in next 7 days)
        const upcomingDeadlines = tasks.filter(t => {
            if (t.status === 'completed') return false;
            const dueDate = convertFirebaseDateRobust(t.dueDate);
            return dueDate >= now && dueDate <= nextWeek;
        }).length;

        // Average completion time (simplified calculation)
        const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt && t.createdAt);
        const averageCompletionTime = completedTasks.length > 0 ?
            completedTasks.reduce((sum, task) => {
                const created = convertFirebaseDateRobust(task.createdAt);
                const completed = convertFirebaseDateRobust(task.completedAt!);
                const days = Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0) / completedTasks.length : undefined;

        return {
            total,
            completed,
            inProgress,
            overdue,
            completionRate,
            byPriority,
            byStatus,
            averageCompletionTime,
            upcomingDeadlines
        };
    }, [tasksData]);

    return {
        metrics,
        isLoading,
        error,
        refetch
    };
};