"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Book,
    Edit,
    Download,
    RefreshCw,
    AlertCircle,
    FileText,
    Search,
    Users,
    BarChart3,
    Trash2,
    Award,
    Settings,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";

// Import the actual API hooks
import {
    useGetProjectLearningDashboardQuery,
    useGetProjectLearningAnalyticsQuery,
    useGetAllUserProgressQuery,
    useGetBottlenecksQuery,
    useLazyExportLearningDataQuery,
    useDeleteProjectLearningPathMutation,
    useGetProjectMilestonesQuery
} from "@/Redux/apiSlices/learningPath/learningPathApi";

// Import the ACTUAL components that exist in your project
import { LearningPathOverviewCards } from "@/components/Admin/AdminDashboard/ProjectLearningPath/dashboard/LearningPathOverviewCards";
import { LearningPathInfoCard } from "@/components/Admin/AdminDashboard/ProjectLearningPath/dashboard/LearningPathInfoCard";
import { AnalyticsSummaryCard } from "@/components/Admin/AdminDashboard/ProjectLearningPath/dashboard/AnalyticsSummaryCard";
import { MilestonesManagementCard } from "@/components/Admin/AdminDashboard/ProjectLearningPath/dashboard/MilestonesManagementCard";
import { LearnerProgressCard } from "@/components/Admin/AdminDashboard/ProjectLearningPath/dashboard/LearnerProgressCard";
import { ProjectSelectionView } from "@/components/Admin/AdminDashboard/ProjectLearningPath/dashboard/ProjectSelectionView";

const LearningPathDashboardPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const projectId = params?.projectId as string;

    // State
    const [activeTab, setActiveTab] = useState("overview");
    const [progressFilter, setProgressFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [analyticsRange, setAnalyticsRange] = useState("month");

    // If no projectId, show project selection
    if (!projectId) {
        return (
            <ProjectSelectionView
                onProjectSelect={(selectedProjectId) => {
                    router.push(`/admin/dashboard/projects/learning-paths/${selectedProjectId}`);
                }}
            />
        );
    }

    // API Hooks
    const {
        data: dashboardData,
        isLoading: isLoadingDashboard,
        error: dashboardError
    } = useGetProjectLearningDashboardQuery(projectId);

    const {
        data: analyticsData,
        isLoading: isLoadingAnalytics
    } = useGetProjectLearningAnalyticsQuery({
        projectId,
        period: analyticsRange
    });

    const {
        data: userProgressData,
        isLoading: isLoadingProgress
    } = useGetAllUserProgressQuery({
        projectId,
        status: progressFilter === "all" ? undefined : progressFilter,
        sortBy: 'lastProgressUpdate',
        sortOrder: 'desc'
    });

    const {
        data: bottlenecksData
    } = useGetBottlenecksQuery(projectId);

    const {
        data: milestonesData,
        isLoading: isLoadingMilestones
    } = useGetProjectMilestonesQuery({ projectId });

    const [exportData] = useLazyExportLearningDataQuery();
    const [deleteProjectLearningPath] = useDeleteProjectLearningPathMutation();

    // Loading state
    if (isLoadingDashboard) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading learning path dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (dashboardError || !dashboardData?.data) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        Learning Path Not Found
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        The learning path you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => router.back()} variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    // Extract data
    const { project, learningPath } = dashboardData.data;
    const analytics = analyticsData?.data;
    const userProgressList = userProgressData?.data || [];
    const bottlenecks = bottlenecksData?.data;
    const milestones = milestonesData?.data || [];

    // Action handlers
    const handleEdit = () => {
        router.push(`/admin/dashboard/learning-paths/create?projectId=${projectId}`);
    };

    const handleExport = async (format: 'json' | 'csv' = 'csv') => {
        try {
            const result = await exportData({
                projectId,
                format,
                includePersonalData: 'true'
            }).unwrap();

            const url = window.URL.createObjectURL(result);
            const a = document.createElement('a');
            a.href = url;
            a.download = `learning-path-${project.name}-${format}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Export Successful",
                description: `Learning path data exported as ${format.toUpperCase()}`,
            });
        } catch (error: any) {
            toast({
                title: "Export Failed",
                description: error?.data?.message || "Failed to export data. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the learning path for "${project.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteProjectLearningPath(projectId).unwrap();
            toast({
                title: "Learning Path Deleted",
                description: `Learning path for ${project.name} has been successfully deleted.`,
            });
            router.push('/admin/dashboard/learning-paths');
        } catch (error: any) {
            toast({
                title: "Error Deleting Learning Path",
                description: error?.data?.message || "Failed to delete learning path. Please try again.",
                variant: "destructive",
            });
        }
    };

    const filteredUserProgress = userProgressList.filter(progress =>
        progress.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMilestoneUpdate = () => {
        toast({
            title: "Milestones Updated",
            description: "Milestone data has been refreshed.",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                                <Book className="h-4 w-4" />
                            </div>
                            {project.name}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Learning Path Dashboard
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExport('csv')}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export as CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('json')}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export as JSON
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={handleEdit}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Path
                    </Button>
                </div>
            </motion.div>

            {/* Overview Cards - USING THE REAL COMPONENT */}
            <LearningPathOverviewCards learningPath={learningPath} analytics={analytics} />

            {/* Main Content Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 lg:w-fit">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="milestones" className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            <span className="hidden sm:inline">Milestones</span>
                        </TabsTrigger>
                        <TabsTrigger value="learners" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Learners</span>
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Analytics</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* USING THE REAL COMPONENTS */}
                            <LearningPathInfoCard learningPath={learningPath} />
                            {analytics && <AnalyticsSummaryCard analytics={analytics} />}
                        </div>
                    </TabsContent>

                    {/* Milestones Tab */}
                    <TabsContent value="milestones" className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Milestone Management
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Manage learning milestones and track completion progress
                            </p>
                        </div>

                        {isLoadingMilestones ? (
                            <div className="flex items-center justify-center py-12">
                                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                                <span className="ml-3 text-slate-600 dark:text-slate-400">Loading milestones...</span>
                            </div>
                        ) : (
                            <MilestonesManagementCard
                                projectId={projectId}
                                milestones={milestones}
                                onMilestoneUpdate={handleMilestoneUpdate}
                            />
                        )}
                    </TabsContent>

                    {/* Learners Tab */}
                    <TabsContent value="learners" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Learner Progress ({userProgressList.length})
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Track individual learner progress and performance
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search learners..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <Select value={progressFilter} onValueChange={setProgressFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="not-started">Not Started</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="on-hold">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {isLoadingProgress ? (
                            <div className="flex items-center justify-center py-12">
                                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                                <span className="ml-3 text-slate-600 dark:text-slate-400">Loading learner progress...</span>
                            </div>
                        ) : filteredUserProgress.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center shadow-lg">
                                <Users className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                    No Learners Found
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {searchTerm || progressFilter !== "all"
                                        ? "Try adjusting your search or filter criteria."
                                        : "No learners have started this learning path yet."
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* USING THE REAL LEARNER PROGRESS CARD COMPONENT */}
                                {filteredUserProgress.map((progress: any) => (
                                    <LearnerProgressCard key={progress.id} progress={progress} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Learning Path Analytics
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Detailed insights and performance metrics
                                </p>
                            </div>
                            <Select value={analyticsRange} onValueChange={setAnalyticsRange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Time Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">Last Week</SelectItem>
                                    <SelectItem value="month">Last Month</SelectItem>
                                    <SelectItem value="quarter">Last Quarter</SelectItem>
                                    <SelectItem value="year">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {isLoadingAnalytics ? (
                            <div className="flex items-center justify-center py-12">
                                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                                <span className="ml-3 text-slate-600 dark:text-slate-400">Loading analytics...</span>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center shadow-lg">
                                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                    Analytics Available
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Analytics data will be displayed here using the AnalyticsSummaryCard component.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Learning Path Settings
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Manage and configure this learning path
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-lg">
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Actions</h4>
                                <div className="space-y-3">
                                    <Button
                                        onClick={handleEdit}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Learning Path
                                    </Button>

                                    <Button
                                        onClick={() => handleExport('csv')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-lg">
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Danger Zone</h4>
                                <div className="space-y-3">
                                    <Button
                                        onClick={handleDelete}
                                        className="w-full justify-start"
                                        variant="destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Learning Path
                                    </Button>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        This action cannot be undone. All progress data will be lost.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default LearningPathDashboardPage;

