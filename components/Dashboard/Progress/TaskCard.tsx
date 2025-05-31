import React from 'react';
import { CheckCircle, Clock, AlertCircle, Layout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { ProjectMember, ProjectTask } from '@/Redux/types/Projects';
import { firebaseFormatDate } from '@/components/utils/dateUtils';


interface TaskCardProps {
    task: ProjectTask;
    members: ProjectMember[];
}

export default function TaskCard({ task, members }: TaskCardProps) {
    // Format date
    const formatDate = (dateString?: string | Date | null) => {
        if (!dateString) return 'No due date';
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get task status color and icon
    const getStatusIcon = () => {
        switch (task.status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'in-progress':
                return <Clock className="h-4 w-4 text-blue-600" />;
            case 'blocked':
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Layout className="h-4 w-4 text-indigo-600" />;
        }
    };

    const getStatusColorClass = () => {
        switch (task.status) {
            case 'completed':
                return "bg-green-100";
            case 'in-progress':
                return "bg-blue-100";
            case 'blocked':
                return "bg-red-100";
            default:
                return "bg-indigo-100";
        }
    };

    const getStatusBadgeClass = () => {
        switch (task.status) {
            case 'completed':
                return "bg-green-50 text-green-700 border-green-200";
            case 'in-progress':
                return "bg-blue-50 text-blue-700 border-blue-200";
            case 'blocked':
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-indigo-50 text-indigo-700 border-indigo-200";
        }
    };

    const getPriorityBadgeClass = () => {
        switch (task.priority) {
            case 'critical':
                return "bg-red-50 text-red-700 border-red-200";
            case 'high':
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case 'medium':
                return "bg-blue-50 text-blue-700 border-blue-200";
            case 'low':
                return "bg-green-50 text-green-700 border-green-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    // Get assignee information
    const assignee = members.find(member => member.id === task.assigneeId);

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <Card className="border-indigo-100 hover:border-indigo-300 transition-all">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            getStatusColorClass()
                        )}>
                            {getStatusIcon()}
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800">{task.title}</h3>
                            {task.description && (
                                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{task.description}</p>
                            )}

                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className={getStatusBadgeClass()}>
                                    {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Badge>

                                <Badge variant="outline" className={getPriorityBadgeClass()}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                </Badge>

                                {task.dueDate && (
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                        Due: {firebaseFormatDate(task.dueDate)}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {assignee ? (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border border-indigo-200">
                                {assignee.avatar ? (
                                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                ) : null}
                                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                    {assignee.initials || getInitials(assignee.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-gray-800">{assignee.name}</p>
                                <p className="text-xs text-gray-500">{assignee.role}</p>
                            </div>
                        </div>
                    ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                            Unassigned
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}