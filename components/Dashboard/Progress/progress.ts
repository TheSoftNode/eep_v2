import { ProjectTask } from "@/Redux/types/Projects/task";

// Unified Task interface
export type ProjectTaskStatus = 'todo' | 'upcoming' | 'in-progress' | 'submitted' | 'completed' | 'blocked' | 'overdue';
export type ProjectTaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type BasicProjectTaskStatus = 'todo' | 'in-progress' | 'completed' | 'blocked';
export interface BasicProjectTask extends Omit<ProjectTask, 'status'> {
    status: BasicProjectTaskStatus;
}

export function adaptToBasicTask(task: ProjectTask): BasicProjectTask {
    const statusMap: Record<ProjectTaskStatus, BasicProjectTaskStatus> = {
        'todo': 'todo',
        'upcoming': 'todo',
        'in-progress': 'in-progress',
        'submitted': 'in-progress',
        'completed': 'completed',
        'blocked': 'blocked',
        'overdue': 'blocked'
    };

    return {
        ...task,
        status: statusMap[task.status]
    };
}