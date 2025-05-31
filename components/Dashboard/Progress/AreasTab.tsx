import React from 'react';
import { Layout, Filter, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';
import EmptyAreaState from './EmptyAreaState';
import { formatDate } from '@/components/utils/dateUtils';
import { cn } from '@/lib/utils';
import { getProgressBadgeColor, getProgressColor } from '@/components/utils/projectUtils';
import { ProjectArea, ProjectTask } from '@/Redux/types/Projects';

interface AreasTabProps {
    projectId: string;
    projectAreas: ProjectArea[];
    projectTasks: ProjectTask[];
    selectedArea: string;
    setSelectedArea: (area: string) => void;
    projectUpdatedAt?: string | Date | { _seconds: number; _nanoseconds: number };
}

export default function AreasTab({
    projectAreas,
    projectTasks,
    selectedArea,
    setSelectedArea,
    projectUpdatedAt
}: AreasTabProps) {
    // Filter areas based on selected category
    const filteredAreas = selectedArea === 'all'
        ? projectAreas
        : projectAreas.filter(area => area.name === selectedArea);

    // Helper function to associate tasks with areas
    const getTasksForArea = (areaName: string) => {
        // Since there's no direct relationship between tasks and areas,
        // we can search task titles or descriptions for area names
        // or implement your business logic here

        // Example approach: check if task title or description contains the area name
        return projectTasks.filter(task =>
            task.title.toLowerCase().includes(areaName.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(areaName.toLowerCase()))
        );
    };

    if (projectAreas.length === 0) {
        return <EmptyAreaState />;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-indigo-900">Project Areas Progress</h2>
                <div className="flex gap-2">
                    <Select
                        value={selectedArea}
                        onValueChange={setSelectedArea}
                    >
                        <SelectTrigger className="w-[180px] border-indigo-200">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by area" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Areas</SelectItem>
                            {projectAreas.map(area => (
                                <SelectItem key={area.name} value={area.name}>
                                    {area.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-6">
                {filteredAreas.map(area => {
                    const areaRelatedTasks = getTasksForArea(area.name);

                    return (
                        <Card key={area.name} className="border-indigo-100 overflow-hidden">
                            <CardHeader className="pb-3 bg-indigo-50/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg text-indigo-900">{area.name}</CardTitle>
                                        <CardDescription className="text-indigo-700">{area.description}</CardDescription>
                                    </div>
                                    <Badge variant="outline" className={cn(getProgressBadgeColor(area.progress))}>
                                        {area.progress}% Complete
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="mb-4">
                                    <Progress
                                        value={area.progress}
                                        className={cn("h-2.5", getProgressColor(area.progress))}
                                    />
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-indigo-900 mb-3">Related Tasks</h4>
                                    <div className="space-y-2">
                                        {areaRelatedTasks.slice(0, 3).map(task => (
                                            <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                <div className="flex items-center">
                                                    {task.status === 'completed' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                                    )}
                                                    <span className="text-sm text-gray-800">{task.title}</span>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        task.status === 'completed' ? "bg-green-50 text-green-700 border-green-200" :
                                                            task.status === 'in-progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                                task.status === 'blocked' ? "bg-red-50 text-red-700 border-red-200" :
                                                                    "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                    )}
                                                >
                                                    {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </Badge>
                                            </div>
                                        ))}

                                        {areaRelatedTasks.length > 3 && (
                                            <Link
                                                href="#tasks"
                                                className="text-xs text-indigo-600 flex items-center justify-center p-1 hover:underline"
                                            >
                                                View all related tasks
                                                <ChevronRight className="h-3 w-3 ml-1" />
                                            </Link>
                                        )}

                                        {areaRelatedTasks.length === 0 && (
                                            <p className="text-sm text-gray-500 italic p-2">No tasks associated with this area</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t border-gray-100 py-2 px-4">
                                <div className="flex justify-between items-center w-full text-xs text-gray-500">
                                    {/* Use project's last updated date since areas don't have one */}
                                    <span>Last updated: {formatDate(projectUpdatedAt) || 'N/A'}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1 h-auto"
                                    >
                                        View Details
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}