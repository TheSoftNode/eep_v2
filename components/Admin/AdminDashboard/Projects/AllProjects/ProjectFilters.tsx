import React, { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    ArrowUpDown,
    X,
    Sparkles,
    SlidersHorizontal,
    Check,
    ChevronDown,
    RotateCcw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface ProjectFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    levelFilter?: 'beginner' | 'intermediate' | 'advanced' | 'all';
    setLevelFilter?: (level: 'beginner' | 'intermediate' | 'advanced' | 'all') => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    statusOptions: FilterOption[];
    categoryOptions: FilterOption[];
    levelOptions?: FilterOption[];
    sortOptions: FilterOption[];
    className?: string;
    onResetFilters?: () => void;
    totalCount?: number;
    resultCount?: number;
    isLoading?: boolean;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    levelFilter,
    setLevelFilter,
    sortBy,
    setSortBy,
    statusOptions,
    categoryOptions,
    levelOptions,
    sortOptions,
    className = "",
    onResetFilters,
    totalCount,
    resultCount,
    isLoading = false,
}) => {
    const hasActiveFilters =
        statusFilter !== 'all' ||
        categoryFilter !== 'all' ||
        (levelFilter && levelFilter !== 'all') ||
        searchQuery.trim() !== '';

    const activeFilterCount = [
        statusFilter !== 'all' ? 1 : 0,
        categoryFilter !== 'all' ? 1 : 0,
        (levelFilter && levelFilter !== 'all') ? 1 : 0,
        searchQuery.trim() !== '' ? 1 : 0,
    ].reduce((sum, count) => sum + count, 0);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleResetFilters = () => {
        setStatusFilter('all');
        setCategoryFilter('all');
        setLevelFilter?.('all');
        setSortBy(sortOptions[0]?.value || 'newest');
        setSearchQuery('');
        onResetFilters?.();
    };

    const containerVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn("space-y-4", className)}
        >
            {/* Main Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-sm">
                {/* Search */}
                <motion.div variants={itemVariants} className="flex-1 max-w-md">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search projects by name, description, or technology..."
                            className="pl-10 pr-4 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            disabled={isLoading}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Filter Controls */}
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                    {/* Advanced Filters Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "h-11 gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200",
                                    hasActiveFilters && "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                                )}
                                disabled={isLoading}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                <AnimatePresence>
                                    {activeFilterCount > 0 && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-medium"
                                        >
                                            {activeFilterCount}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
                        >
                            <DropdownMenuLabel className="flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <span className="font-semibold">Filter Projects</span>
                                </div>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResetFilters}
                                        className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1" />
                                        Reset
                                    </Button>
                                )}
                            </DropdownMenuLabel>

                            <div className="p-4 space-y-4">
                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Project Status
                                    </label>
                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span>{option.label}</span>
                                                    {option.count !== undefined && (
                                                        <Badge variant="secondary" className="ml-2 text-xs">
                                                            {option.count}
                                                        </Badge>
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Category Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Project Category
                                    </label>
                                    <Select
                                        value={categoryFilter}
                                        onValueChange={setCategoryFilter}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="All categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span>{option.label}</span>
                                                    {option.count !== undefined && (
                                                        <Badge variant="secondary" className="ml-2 text-xs">
                                                            {option.count}
                                                        </Badge>
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Level Filter */}
                                {levelOptions && setLevelFilter && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Difficulty Level
                                        </label>
                                        <Select
                                            value={levelFilter}
                                            onValueChange={setLevelFilter}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                <SelectValue placeholder="All levels" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {levelOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span>{option.label}</span>
                                                        {option.count !== undefined && (
                                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                                {option.count}
                                                            </Badge>
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sort Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-11 gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                                disabled={isLoading}
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                Sort
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
                        >
                            <DropdownMenuLabel className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                                Sort By
                            </DropdownMenuLabel>
                            {sortOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => setSortBy(option.value)}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
                                        sortBy === option.value && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                                    )}
                                >
                                    <span>{option.label}</span>
                                    {sortBy === option.value && (
                                        <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </motion.div>
            </div>

            {/* Active Filters Display */}
            <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap items-center gap-2 p-4 bg-gradient-to-r from-indigo-50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/10 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50"
                    >
                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                            <Sparkles className="h-4 w-4" />
                            Active Filters:
                        </div>

                        {searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="pl-2 pr-1 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                                >
                                    Search: "{searchQuery}"
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="ml-1 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            </motion.div>
                        )}

                        {statusFilter !== 'all' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="pl-2 pr-1 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                                >
                                    Status: {statusOptions.find(o => o.value === statusFilter)?.label}
                                    <button
                                        onClick={() => setStatusFilter('all')}
                                        className="ml-1 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            </motion.div>
                        )}

                        {categoryFilter !== 'all' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="pl-2 pr-1 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                                >
                                    Category: {categoryOptions.find(o => o.value === categoryFilter)?.label}
                                    <button
                                        onClick={() => setCategoryFilter('all')}
                                        className="ml-1 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            </motion.div>
                        )}

                        {levelFilter && levelFilter !== 'all' && levelOptions && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="pl-2 pr-1 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                                >
                                    Level: {levelOptions.find(o => o.value === levelFilter)?.label}
                                    <button
                                        onClick={() => setLevelFilter?.('all')}
                                        className="ml-1 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            </motion.div>
                        )}

                        <button
                            onClick={handleResetFilters}
                            className="ml-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium transition-colors"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Summary */}
            {(totalCount !== undefined || resultCount !== undefined) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400"
                >
                    <div>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                                <span>Filtering projects...</span>
                            </div>
                        ) : (
                            <span>
                                {resultCount !== undefined && totalCount !== undefined ? (
                                    `Showing ${resultCount} of ${totalCount} projects`
                                ) : resultCount !== undefined ? (
                                    `${resultCount} project${resultCount !== 1 ? 's' : ''} found`
                                ) : totalCount !== undefined ? (
                                    `${totalCount} project${totalCount !== 1 ? 's' : ''} total`
                                ) : (
                                    'Projects'
                                )}
                            </span>
                        )}
                    </div>

                    {hasActiveFilters && !isLoading && (
                        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                            <Filter className="h-3 w-3" />
                            <span className="text-xs font-medium">Filtered</span>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default ProjectFilters;