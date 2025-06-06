"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Plus,
    Briefcase,
    Users,
    Target,
    Activity,
    RefreshCw,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
    ProjectQueryParams,
    useGetProjectsQuery,
} from '@/Redux/apiSlices/Projects/projectsApiSlice';
import ProjectFilters from '@/components/Admin/AdminDashboard/Projects/AllProjects/ProjectFilters';
import ProjectGrid from '@/components/Admin/AdminDashboard/Projects/AllProjects/ProjectGrid';


// Filter Options
const STATUS_OPTIONS = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'archived', label: 'Archived' }
];

const CATEGORY_OPTIONS = [
    { value: 'all', label: 'All Categories' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-app', label: 'Mobile App' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'ui-ux-design', label: 'UI/UX Design' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'devops', label: 'DevOps' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'cybersecurity', label: 'Cybersecurity' }
];

const LEVEL_OPTIONS = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'progress-high', label: 'Progress (High to Low)' },
    { value: 'progress-low', label: 'Progress (Low to High)' },
    { value: 'members', label: 'Most Members' },
    { value: 'activity', label: 'Most Active' }
];

// Stats Card Component
const StatsCard = ({
    title,
    value,
    change,
    icon: Icon,
    color = 'indigo',
    loading = false
}: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    color?: string;
    loading?: boolean;
}) => {
    const colorClasses = {
        indigo: 'from-indigo-500 to-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
        emerald: 'from-emerald-500 to-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        amber: 'from-amber-500 to-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        purple: 'from-purple-500 to-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {title}
                            </p>
                            {loading ? (
                                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                            ) : (
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {value}
                                </p>
                            )}
                            {change && !loading && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                    {change}
                                </p>
                            )}
                        </div>
                        <div className={cn(
                            "flex items-center justify-center h-12 w-12 rounded-xl shadow-lg bg-gradient-to-br",
                            colorClasses[color as keyof typeof colorClasses]?.split(' ')[0],
                            colorClasses[color as keyof typeof colorClasses]?.split(' ')[1]
                        )}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function LearnerProjectsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { isAdmin, isMentor } = useAuth();

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [levelFilter, setLevelFilter] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>('all');
    const [sortBy, setSortBy] = useState('newest');
    const [activeTab, setActiveTab] = useState('all');



    const queryParams: ProjectQueryParams = {
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(levelFilter !== 'all' && { level: levelFilter }),
        orderBy: sortBy.includes('name') ? 'name' :
            sortBy.includes('progress') ? 'progress' :
                sortBy.includes('members') ? 'memberCount' : 'updatedAt',
        order: sortBy.includes('desc') || sortBy.includes('high') || sortBy === 'newest' ? 'desc' : 'asc',
        limit: 50
    };



    // API hooks
    const {
        data: projectsResponse,
        isLoading: isLoadingProjects,
        isError: isProjectsError,
        error: projectsError,
        refetch: refetchProjects
    } = useGetProjectsQuery(queryParams);


    // For the error message, use type-safe access:
    const errorMessage = (
        typeof projectsError === 'object' &&
        projectsError &&
        'data' in projectsError &&
        typeof projectsError.data === 'object' &&
        projectsError.data &&
        'message' in projectsError.data
    ) ? (projectsError.data as { message: string }).message : 'Failed to load projects';


    // Mock stats hook - replace with actual API when available
    const projectStats = {
        total: projectsResponse?.count || 0,
        active: 0,
        completed: 0,
        members: 0
    };

    const projects = projectsResponse?.data || [];

    // Client-side filtering for search and tabs
    const filterProjects = (projects: any[]) => {
        let results = [...projects];

        // Search filtering
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter(project =>
                project.name?.toLowerCase().includes(query) ||
                project.description?.toLowerCase().includes(query) ||
                project.technologies?.some((tech: string) => tech.toLowerCase().includes(query)) ||
                project.category?.toLowerCase().includes(query)
            );
        }

        // Tab-based filtering
        if (activeTab !== 'all') {
            results = results.filter(project => {
                switch (activeTab) {
                    case 'active':
                        return project.status === 'active';
                    case 'completed':
                        return project.status === 'completed';
                    case 'on-hold':
                        return project.status === 'on-hold';
                    case 'archived':
                        return project.status === 'archived';
                    default:
                        return true;
                }
            });
        }

        return results;
    };

    const filteredProjects = filterProjects(projects);

    // Event handlers
    const handleProjectClick = (projectId: string) => {
        router.push(`/Learner/dashboard/projects/${projectId}`);
    };

    const handleEditProject = (projectId: string) => {
        router.push(`/Learner/dashboard/projects/${projectId}/edit`);
    };

    const handleViewAnalytics = (projectId: string) => {
        router.push(`/Learner/dashboard/projects/${projectId}/analytics`);
    };

    const handleCreateProject = () => {
        router.push('/Learner/dashboard/projects/create');
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setCategoryFilter('all');
        setLevelFilter('all');
        setSortBy('newest');
    };

    const handleRefresh = () => {
        refetchProjects();
        toast({
            title: "Projects Refreshed",
            description: "Project data has been updated.",
        });
    };

    const formatDate = (date: any) => {
        if (!date) return 'Not set';
        const dateObj = typeof date === 'string' ? new Date(date) :
            date._seconds ? new Date(date._seconds * 1000) : date;
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysStatus = (endDate: any) => {
        if (!endDate) return { text: 'No deadline', isOverdue: false };
        const dateObj = typeof endDate === 'string' ? new Date(endDate) :
            endDate._seconds ? new Date(endDate._seconds * 1000) : endDate;
        const now = new Date();
        const diffTime = dateObj.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
        } else if (diffDays === 0) {
            return { text: 'Due today', isOverdue: false };
        } else {
            return { text: `${diffDays} days left`, isOverdue: false };
        }
    };

    // Handle errors
    useEffect(() => {
        if (isProjectsError) {
            toast({
                title: "Error Loading Projects",
                description: "Failed to load projects. Please try again.",
                variant: "destructive",
            });
        }
    }, [isProjectsError, toast]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Projects
                        </h1>

                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={isLoadingProjects}
                            className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingProjects && "animate-spin")} />
                            Refresh
                        </Button>

                        <Button
                            variant="outline"
                            className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>

                        {(isAdmin() || isMentor()) && (
                            <Button
                                onClick={handleCreateProject}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Project
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Projects"
                        value={projectStats.total}
                        change="+12% from last month"
                        icon={Briefcase}
                        color="indigo"
                        loading={isLoadingProjects}
                    />
                    <StatsCard
                        title="Active Projects"
                        value={projects.filter(p => p.status === 'active').length}
                        change="+5% from last week"
                        icon={Activity}
                        color="emerald"
                        loading={isLoadingProjects}
                    />
                    <StatsCard
                        title="Completed"
                        value={projects.filter(p => p.status === 'completed').length}
                        change="+8% from last month"
                        icon={Target}
                        color="purple"
                        loading={isLoadingProjects}
                    />
                    <StatsCard
                        title="Team Members"
                        value={projectStats.members || "124"}
                        change="+15% from last month"
                        icon={Users}
                        color="amber"
                        loading={isLoadingProjects}
                    />
                </div>

                {/* Filters */}
                <ProjectFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    levelFilter={levelFilter}
                    setLevelFilter={setLevelFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    statusOptions={STATUS_OPTIONS}
                    categoryOptions={CATEGORY_OPTIONS}
                    levelOptions={LEVEL_OPTIONS}
                    sortOptions={SORT_OPTIONS}
                    onResetFilters={handleResetFilters}
                    totalCount={projects.length}
                    resultCount={filteredProjects.length}
                    isLoading={isLoadingProjects}
                />

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-xl p-1">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                        >
                            All Projects
                        </TabsTrigger>
                        <TabsTrigger
                            value="active"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                        >
                            Active
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                        >
                            Completed
                        </TabsTrigger>
                        <TabsTrigger
                            value="on-hold"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                        >
                            On Hold
                        </TabsTrigger>
                        <TabsTrigger
                            value="archived"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                        >
                            Archived
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Content */}
                    {['all', 'active', 'completed', 'on-hold', 'archived'].map((tab) => (
                        <TabsContent key={tab} value={tab} className="mt-0">
                            <ProjectGrid
                                projects={filteredProjects}
                                isLoading={isLoadingProjects}
                                isError={isProjectsError}
                                error={isProjectsError ? errorMessage : undefined}
                                onProjectClick={handleProjectClick}
                                onEditProject={handleEditProject}
                                onViewAnalytics={handleViewAnalytics}
                                onCreateProject={handleCreateProject}
                                formatDate={formatDate}
                                getDaysStatus={getDaysStatus}
                                onRetry={refetchProjects}
                                showCreateButton={isAdmin() || isMentor()}
                                showStats={true}
                                totalCount={projects.length}
                                emptyStateTitle={
                                    tab === 'all' ? 'No projects found' :
                                        tab === 'active' ? 'No active projects' :
                                            tab === 'completed' ? 'No completed projects' :
                                                tab === 'on-hold' ? 'No projects on hold' :
                                                    'No archived projects'
                                }
                                emptyStateDescription={
                                    tab === 'all' ? 'Create your first project to get started with project management' :
                                        tab === 'active' ? 'No projects are currently active. Start a new project or activate an existing one.' :
                                            tab === 'completed' ? 'No projects have been completed yet. Keep working on your active projects!' :
                                                tab === 'on-hold' ? 'No projects are currently on hold.' :
                                                    'No projects have been archived yet.'
                                }
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}