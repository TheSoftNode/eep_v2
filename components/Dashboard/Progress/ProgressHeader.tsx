import React from 'react';
import { Download, Share2, BarChart, PieChart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Project } from '@/Redux/types/Projects';

interface ProgressHeaderProps {
    project: Project;
    selectedPeriod: string;
    setSelectedPeriod: (period: string) => void;
}

export default function ProgressHeader({
    project,
    selectedPeriod,
    setSelectedPeriod
}: ProgressHeaderProps) {
    return (
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
                <h1 className="text-2xl font-bold text-indigo-900">
                    {project.name} - Progress Tracking
                </h1>
                <p className="text-gray-500 mt-1">{project.description}</p>
            </div>

            <div className="flex items-center gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[140px] border-indigo-200">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                </Select>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-indigo-200">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <BarChart className="h-4 w-4 mr-2" />
                            Export Progress Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <PieChart className="h-4 w-4 mr-2" />
                            Export Areas Breakdown
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Progress
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
