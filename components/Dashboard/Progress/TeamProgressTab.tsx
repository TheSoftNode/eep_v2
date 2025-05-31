import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import EmptyTeamState from './EmptyTeamState';
import { ProjectMember, ProjectTask } from '@/Redux/types/Projects';


interface TeamProgressTabProps {
    projectMembers: ProjectMember[];
    projectTasks: ProjectTask[];
}

export default function TeamProgressTab({ projectMembers, projectTasks }: TeamProgressTabProps) {
    if (projectMembers.length === 0) {
        return <EmptyTeamState />;
    }

    // Calculate member contributions
    const getMemberStats = (memberId: string) => {
        const memberTasks = projectTasks?.filter(task => task?.assigneeId === memberId);
        const completedTasks = memberTasks?.filter(task => task.status === 'completed').length;
        const inProgressTasks = memberTasks?.filter(task => task.status === 'in-progress').length;
        const todoTasks = memberTasks?.filter(task => task.status === 'todo').length;
        const blockedTasks = memberTasks?.filter(task => task.status === 'blocked').length;

        const totalAssigned = memberTasks?.length;
        const completionRate = totalAssigned > 0 ? (completedTasks / totalAssigned) * 100 : 0;

        return {
            totalAssigned,
            completedTasks,
            inProgressTasks,
            todoTasks,
            blockedTasks,
            completionRate
        };
    };

    // Get progress color based on completion rate
    const getProgressColor = (rate: number) => {
        if (rate >= 75) return "bg-green-100 [&>div]:bg-green-600";
        if (rate >= 50) return "bg-blue-100 [&>div]:bg-blue-600";
        if (rate >= 25) return "bg-yellow-100 [&>div]:bg-yellow-600";
        return "bg-indigo-100 [&>div]:bg-indigo-600";
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-indigo-900">Team Member Progress</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {projectMembers?.map(member => {
                    const stats = getMemberStats(member.id);

                    return (
                        <Card key={member?.id} className="border-indigo-100">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-indigo-200">
                                            {member?.avatar ? (
                                                <AvatarImage src={member?.avatar} alt={member?.name} />
                                            ) : null}
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {member?.initials || member?.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base text-indigo-900">{member?.name}</CardTitle>
                                            <CardDescription className="text-indigo-700">{member?.role}</CardDescription>
                                        </div>
                                    </div>
                                    {stats.totalAssigned > 0 ? (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {Math.round(stats.completionRate)}% Complete
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                                            No Tasks
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                {stats.totalAssigned > 0 ? (
                                    <>
                                        <div className="mb-4">
                                            <Progress
                                                value={stats.completionRate}
                                                className={cn("h-2", getProgressColor(stats.completionRate))}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <div className="text-lg font-semibold text-indigo-700">{stats.totalAssigned}</div>
                                                <div className="text-xs text-gray-600">Assigned</div>
                                            </div>
                                            <div className="p-2 bg-green-50 rounded-lg">
                                                <div className="text-lg font-semibold text-green-700">{stats.completedTasks}</div>
                                                <div className="text-xs text-gray-600">Completed</div>
                                            </div>
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <div className="text-lg font-semibold text-blue-700">{stats.inProgressTasks}</div>
                                                <div className="text-xs text-gray-600">In Progress</div>
                                            </div>
                                            <div className="p-2 bg-red-50 rounded-lg">
                                                <div className="text-lg font-semibold text-red-700">{stats.blockedTasks}</div>
                                                <div className="text-xs text-gray-600">Blocked</div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No tasks currently assigned to this team member.
                                    </div>
                                )}
                            </CardContent>
                            {stats.totalAssigned > 0 && (
                                <CardFooter className="bg-gray-50 border-t border-gray-100 py-2 px-4">
                                    <div className="w-full flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            Last completed: {stats.completedTasks > 0 ? '2 days ago' : 'Never'}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1 h-auto"
                                            asChild
                                        >
                                            <Link href={`#member-${member?.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                    );
                })}
            </div>
        </>
    );
}