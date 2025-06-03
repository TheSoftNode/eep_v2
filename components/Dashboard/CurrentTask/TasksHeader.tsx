"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Download,
    FileSpreadsheet,
    FileText,
    Loader2,
    BarChart3,
    Users,
    Clock,
    CheckCircle,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UnifiedTask, FirebaseDate } from '@/Redux/types/Projects';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

interface TasksHeaderProps {
    projectName?: string;
    tasks?: UnifiedTask[];
    isLoading?: boolean;
}

export default function TasksHeader({
    projectName = "Project Tasks",
    tasks = [],
    isLoading = false
}: TasksHeaderProps) {
    const { toast } = useToast();
    const [exportingCSV, setExportingCSV] = useState(false);
    const [exportingPDF, setExportingPDF] = useState(false);
    const [addingToCalendar, setAddingToCalendar] = useState(false);
    const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);

    // Calculate task statistics
    const getTaskStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const inProgress = tasks.filter(task => task.status === 'in-progress').length;
        const overdue = tasks.filter(task => task.status === 'overdue').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, inProgress, overdue, completionRate };
    };

    // Function to format Firebase date
    const formatFirebaseDate = (date: FirebaseDate | string | undefined): string => {
        if (!date) return 'No due date';

        try {
            // Handle Firestore timestamp with _seconds
            if (typeof date === 'object' && '_seconds' in date) {
                return new Date(date._seconds * 1000).toLocaleDateString();
            }

            // Handle string date
            if (typeof date === 'string') {
                return new Date(date).toLocaleDateString();
            }

            // Handle Date object
            if (date instanceof Date) {
                return date.toLocaleDateString();
            }

            return String(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    // Function to export tasks as CSV
    const handleExportCSV = async () => {
        try {
            setExportingCSV(true);

            if (tasks.length === 0) {
                toast({
                    title: "No tasks to export",
                    description: "There are no tasks available to export.",
                    variant: "destructive",
                });
                return;
            }

            // Extract the relevant task data for CSV
            const csvData = tasks.map(task => ({
                Title: task.title,
                Description: task.description || '',
                Status: task.status,
                Priority: task.priority || 'N/A',
                TaskType: task.taskType || 'N/A',
                Week: task.week || 'N/A',
                DueDate: formatFirebaseDate(task.dueDate),
                Assignee: task.assigneeDetails?.name || 'Unassigned',
                Skills: (task.skills || []).join(', '),
                LearningObjectives: (task.learningObjectives || []).join(', '),
                Progress: task.progress || 0,
                Grade: task.grade || 'N/A'
            }));

            // Convert to CSV format
            const headers = Object.keys(csvData[0]);
            const csvContent = [
                headers.join(','),
                ...csvData.map(row =>
                    headers.map(header =>
                        JSON.stringify(row[header as keyof typeof row] || '')
                    ).join(',')
                )
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${projectName.replace(/\s+/g, '-')}-tasks.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Export successful",
                description: "Tasks have been exported as CSV successfully.",
            });
        } catch (error) {
            console.error("Error exporting CSV:", error);
            toast({
                title: "Export failed",
                description: "There was an error exporting tasks as CSV.",
                variant: "destructive",
            });
        } finally {
            setExportingCSV(false);
        }
    };

    // Function to export tasks as PDF
    const handleExportPDF = async () => {
        try {
            setExportingPDF(true);

            if (tasks.length === 0) {
                toast({
                    title: "No tasks to export",
                    description: "There are no tasks available to export.",
                    variant: "destructive",
                });
                return;
            }

            // Create PDF document
            const doc = new jsPDF();
            const title = `Tasks for ${projectName}`;
            doc.setFontSize(18);
            doc.setTextColor(79, 70, 229); // Indigo color
            doc.text(title, 14, 20);

            // Add project summary
            const stats = getTaskStats();
            doc.setFontSize(12);
            doc.setTextColor(107, 114, 128); // Gray color
            doc.text(`Total Tasks: ${stats.total} | Completed: ${stats.completed} | In Progress: ${stats.inProgress} | Completion Rate: ${stats.completionRate}%`, 14, 30);

            // Prepare table data
            const tableBody = tasks.map((task, index) => [
                index + 1,
                task.title,
                task.status,
                task.priority || 'N/A',
                task.taskType || 'N/A',
                task.assigneeDetails?.name || 'Unassigned',
                formatFirebaseDate(task.dueDate),
                task.progress ? `${task.progress}%` : 'N/A'
            ]);

            // Generate table with modern styling
            autoTable(doc, {
                head: [["#", "Title", "Status", "Priority", "Type", "Assignee", "Due Date", "Progress"]],
                body: tableBody,
                startY: 40,
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    textColor: [55, 65, 81] // Gray-700
                },
                headStyles: {
                    fillColor: [79, 70, 229], // Indigo-600
                    textColor: [255, 255, 255],
                    fontSize: 10,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252] // Slate-50
                },
                theme: 'grid',
                tableLineColor: [226, 232, 240], // Slate-200
                tableLineWidth: 0.5,
            });

            // Save the file
            const filename = `${projectName.replace(/\s+/g, "_")}_Tasks.pdf`;
            doc.save(filename);

            toast({
                title: "Export successful",
                description: `Tasks exported as ${filename}`,
            });
        } catch (error) {
            console.error("Error exporting PDF:", error);
            toast({
                title: "Export failed",
                description: "There was an error exporting tasks as PDF.",
                variant: "destructive",
            });
        } finally {
            setExportingPDF(false);
        }
    };

    // Function to add tasks to calendar
    const handleAddToCalendar = async () => {
        try {
            setAddingToCalendar(true);

            if (tasks.length === 0) {
                toast({
                    title: "No tasks to add",
                    description: "There are no tasks available to add to calendar.",
                    variant: "destructive",
                });
                return;
            }

            // Create iCalendar (.ics) file format
            let icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//EEP//Task Calendar//EN',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH',
            ];

            // Add each task as a calendar event
            tasks.forEach(task => {
                if (!task.dueDate) return;

                const dueDate = formatDateForICS(task.dueDate);
                if (!dueDate) return;

                const description = [
                    task.description || 'No description',
                    `Status: ${task.status}`,
                    task.priority ? `Priority: ${task.priority}` : '',
                    task.assigneeDetails?.name ? `Assigned to: ${task.assigneeDetails.name}` : '',
                    task.skills?.length ? `Skills: ${task.skills.join(', ')}` : ''
                ].filter(Boolean).join('\\n');

                icsContent = [
                    ...icsContent,
                    'BEGIN:VEVENT',
                    `UID:${task.id}@${window.location.hostname}`,
                    `DTSTAMP:${formatCurrentDateForICS()}`,
                    `DTSTART:${dueDate}`,
                    `DTEND:${dueDate}`,
                    `SUMMARY:${task.title}`,
                    `DESCRIPTION:${description}`,
                    `CATEGORIES:${task.taskType || 'Task'}`,
                    `PRIORITY:${getPriorityLevel(task.priority)}`,
                    'END:VEVENT'
                ];
            });

            icsContent.push('END:VCALENDAR');

            // Create and download the .ics file
            const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${projectName.replace(/\s+/g, '-')}-tasks.ics`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Calendar export successful",
                description: "Tasks have been added to calendar file successfully.",
            });
        } catch (error) {
            console.error("Error adding to calendar:", error);
            toast({
                title: "Calendar export failed",
                description: "There was an error adding tasks to calendar.",
                variant: "destructive",
            });
        } finally {
            setAddingToCalendar(false);
        }
    };

    // Helper function to format date for ICS file
    const formatDateForICS = (date: FirebaseDate | string | undefined): string | null => {
        try {
            let dateObj: Date;

            if (typeof date === 'object' && '_seconds' in date) {
                dateObj = new Date(date._seconds * 1000);
            } else if (typeof date === 'string') {
                dateObj = new Date(date);
            } else if (date instanceof Date) {
                dateObj = date;
            } else {
                return null;
            }

            // Format as YYYYMMDDTHHMMSSZ
            return dateObj.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        } catch (error) {
            console.error('Error formatting date for ICS:', error);
            return null;
        }
    };

    // Helper function to get current date in ICS format
    const formatCurrentDateForICS = (): string => {
        return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    // Helper function to get priority level for calendar
    const getPriorityLevel = (priority?: string): string => {
        switch (priority) {
            case 'critical': return '1';
            case 'high': return '3';
            case 'medium': return '5';
            case 'low': return '7';
            default: return '5';
        }
    };

    const stats = getTaskStats();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 mb-8"
        >
            {/* Header Section */}
            <div className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl rounded-xl p-6 border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2"
                        >
                            {projectName}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="dark:text-slate-400 text-slate-600 text-lg"
                        >
                            Manage and track your project tasks with AI-powered insights
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center gap-3"
                    >
                        <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="dark:border-slate-600 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700/50 hover:bg-slate-100/70 shadow-sm"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View Calendar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px] backdrop-blur-sm dark:bg-[#060f38]/95 bg-white/95 dark:border-slate-800/50 border-slate-200/70">
                                <DialogHeader>
                                    <DialogTitle className="dark:text-white text-slate-800">Task Calendar</DialogTitle>
                                    <DialogDescription className="dark:text-slate-400 text-slate-600">
                                        View all project deadlines in calendar format
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="h-96 dark:bg-slate-800/30 bg-slate-50/50 border dark:border-slate-700/30 border-slate-200/70 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-center">
                                        <Calendar className="h-16 w-16 dark:text-slate-500 text-slate-400 mx-auto mb-4" />
                                        <p className="dark:text-slate-400 text-slate-600 text-lg">Calendar integration coming soon</p>
                                        <p className="dark:text-slate-500 text-slate-500 text-sm mt-2">Advanced task timeline and scheduling features</p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" className="dark:border-slate-600 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700/50 hover:bg-slate-100/70">
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="backdrop-blur-sm dark:bg-[#060f38]/95 bg-white/95 dark:border-slate-800/50 border-slate-200/70 shadow-xl">
                                <DropdownMenuItem
                                    onClick={handleExportPDF}
                                    disabled={exportingPDF || isLoading || tasks.length === 0}
                                    className="cursor-pointer dark:hover:bg-slate-700/50 hover:bg-slate-100/70 dark:text-slate-300 text-slate-700 dark:focus:bg-slate-700/50 focus:bg-slate-100/70"
                                >
                                    {exportingPDF ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <FileText className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                                    )}
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleExportCSV}
                                    disabled={exportingCSV || isLoading || tasks.length === 0}
                                    className="cursor-pointer dark:hover:bg-slate-700/50 hover:bg-slate-100/70 dark:text-slate-300 text-slate-700 dark:focus:bg-slate-700/50 focus:bg-slate-100/70"
                                >
                                    {exportingCSV ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                                    )}
                                    Export as CSV
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="dark:bg-slate-700/50 bg-slate-200/70" />
                                <DropdownMenuItem
                                    onClick={handleAddToCalendar}
                                    disabled={addingToCalendar || isLoading || tasks.length === 0}
                                    className="cursor-pointer dark:hover:bg-slate-700/50 hover:bg-slate-100/70 dark:text-slate-300 text-slate-700 dark:focus:bg-slate-700/50 focus:bg-slate-100/70"
                                >
                                    {addingToCalendar ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Calendar className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                                    )}
                                    Add to Calendar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                </div>
            </div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <div className="backdrop-blur-sm dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm dark:text-slate-400 text-slate-600 mb-1">Total Tasks</p>
                            <p className="text-2xl font-bold dark:text-white text-slate-800">{stats.total}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-sm dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm dark:text-slate-400 text-slate-600 mb-1">Completed</p>
                            <p className="text-2xl font-bold dark:text-white text-slate-800">{stats.completed}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-sm dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm dark:text-slate-400 text-slate-600 mb-1">In Progress</p>
                            <p className="text-2xl font-bold dark:text-white text-slate-800">{stats.inProgress}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-sm dark:bg-slate-800/30 bg-white/70 border dark:border-slate-700/30 border-slate-200/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm dark:text-slate-400 text-slate-600 mb-1">Completion</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold dark:text-white text-slate-800">{stats.completionRate}%</p>
                                <Badge
                                    variant="outline"
                                    className={
                                        stats.completionRate >= 80
                                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/30"
                                            : stats.completionRate >= 60
                                                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30"
                                                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/30"
                                    }
                                >
                                    {stats.completionRate >= 80 ? 'Excellent' : stats.completionRate >= 60 ? 'Good' : 'Needs Focus'}
                                </Badge>
                            </div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center">
                            <Users className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}