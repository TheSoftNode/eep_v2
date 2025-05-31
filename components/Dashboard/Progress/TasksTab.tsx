import React, { useState } from 'react';
import {
    CheckCircle,
    Clock,
    Layout,
    AlertCircle,
} from 'lucide-react';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import EmptyTaskState from './EmptyTaskState';
import TaskCard from './TaskCard';
import { ProjectMember, ProjectTask } from '@/Redux/types/Projects';



interface TasksTabProps {
    projectTasks: ProjectTask[];
    projectMembers: ProjectMember[];
}

export default function TasksTab({ projectTasks, projectMembers }: TasksTabProps) {
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Count tasks by status
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = projectTasks.filter(task => task.status === 'todo').length;
    const blockedTasks = projectTasks.filter(task => task.status === 'blocked').length;

    // Filter tasks based on selected status
    const filteredTasks = statusFilter === 'all'
        ? projectTasks
        : projectTasks.filter(task => task.status === statusFilter);

    if (projectTasks.length === 0) {
        return <EmptyTaskState />;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-indigo-900">Project Tasks</h2>
                <div className="flex gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[140px] border-indigo-200">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Task Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <Card className="border-green-100 bg-green-50/30">
                    <CardContent className="p-3 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-green-700">{completedTasks}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500 opacity-60" />
                    </CardContent>
                </Card>

                <Card className="border-blue-100 bg-blue-50/30">
                    <CardContent className="p-3 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-blue-700">{inProgressTasks}</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-500 opacity-60" />
                    </CardContent>
                </Card>

                <Card className="border-indigo-100 bg-indigo-50/30">
                    <CardContent className="p-3 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-600">To Do</p>
                            <p className="text-2xl font-bold text-indigo-700">{todoTasks}</p>
                        </div>
                        <Layout className="h-8 w-8 text-indigo-500 opacity-60" />
                    </CardContent>
                </Card>

                <Card className="border-red-100 bg-red-50/30">
                    <CardContent className="p-3 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-600">Blocked</p>
                            <p className="text-2xl font-bold text-red-700">{blockedTasks}</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-red-500 opacity-60" />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                {filteredTasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        members={projectMembers}
                    />
                ))}
            </div>
        </>
    );
}