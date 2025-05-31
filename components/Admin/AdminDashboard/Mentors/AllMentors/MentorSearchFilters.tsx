import React from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Grid3x3,
    List,
    SlidersHorizontal,
    X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MentorSearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterStatus: 'all' | 'active' | 'inactive' | 'available' | 'unavailable';
    setFilterStatus: (status: 'all' | 'active' | 'inactive' | 'available' | 'unavailable') => void;
    filterExpertise: string;
    setFilterExpertise: (expertise: string) => void;
    filterRating: string;
    setFilterRating: (rating: string) => void;
    viewMode: 'grid' | 'table';
    setViewMode: (mode: 'grid' | 'table') => void;
    totalCount: number;
}

const MentorSearchFilters: React.FC<MentorSearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterExpertise,
    setFilterExpertise,
    filterRating,
    setFilterRating,
    viewMode,
    setViewMode,
    totalCount
}) => {
    // Clear all filters
    const clearFilters = (): void => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterExpertise('all');
        setFilterRating('all');
    };

    // Check if any filters are active
    const hasActiveFilters: boolean = !!(searchTerm || filterStatus !== 'all' || filterExpertise !== 'all' || filterRating !== 'all');

    // Common expertise areas
    const expertiseOptions: string[] = [
        'React',
        'Node.js',
        'Python',
        'JavaScript',
        'TypeScript',
        'Machine Learning',
        'UI/UX Design',
        'DevOps',
        'Mobile Development',
        'Data Science',
        'Blockchain',
        'Cybersecurity'
    ];

    const handleSearchClear = (): void => {
        setSearchTerm('');
    };

    const handleFilterStatusClear = (): void => {
        setFilterStatus('all');
    };

    const handleFilterExpertiseClear = (): void => {
        setFilterExpertise('all');
    };

    const handleFilterRatingClear = (): void => {
        setFilterRating('all');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Top Row - Search and View Toggle */}
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                            {/* Search */}
                            <div className="relative flex-1 w-full lg:max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    placeholder="Search mentors by name, email, or company..."
                                    value={searchTerm}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 focus:border-indigo-500 dark:focus:border-indigo-400"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={handleSearchClear}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        type="button"
                                        aria-label="Clear search"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Results Count and View Toggle */}
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {totalCount} mentor{totalCount !== 1 ? 's' : ''} found
                                </span>

                                {/* View Mode Toggle */}
                                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className={`h-8 px-3 ${viewMode === 'grid'
                                            ? 'bg-white dark:bg-slate-700 shadow-sm'
                                            : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
                                            }`}
                                        aria-label="Grid view"
                                    >
                                        <Grid3x3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('table')}
                                        className={`h-8 px-3 ${viewMode === 'table'
                                            ? 'bg-white dark:bg-slate-700 shadow-sm'
                                            : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
                                            }`}
                                        aria-label="Table view"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters:
                            </div>

                            <div className="flex flex-wrap gap-3 flex-1">
                                {/* Status Filter */}
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-[140px] bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="unavailable">Unavailable</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Expertise Filter */}
                                <Select value={filterExpertise} onValueChange={setFilterExpertise}>
                                    <SelectTrigger className="w-[160px] bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                                        <SelectValue placeholder="Expertise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Expertise</SelectItem>
                                        {expertiseOptions.map((expertise: string) => (
                                            <SelectItem
                                                key={expertise}
                                                value={expertise.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                                            >
                                                {expertise}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Rating Filter */}
                                <Select value={filterRating} onValueChange={setFilterRating}>
                                    <SelectTrigger className="w-[140px] bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                                        <SelectValue placeholder="Rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Ratings</SelectItem>
                                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                                        <SelectItem value="4.0">4.0+ Stars</SelectItem>
                                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                                        <SelectItem value="3.0">3.0+ Stars</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Advanced Filters Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50"
                                >
                                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                                    Advanced
                                </Button>
                            </div>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear
                                </Button>
                            )}
                        </div>

                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2">
                                    Active filters:
                                </span>

                                {searchTerm && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                                    >
                                        Search: "{searchTerm}"
                                        <button
                                            onClick={handleSearchClear}
                                            className="ml-1 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                                            type="button"
                                            aria-label="Remove search filter"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}

                                {filterStatus !== 'all' && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    >
                                        Status: {filterStatus}
                                        <button
                                            onClick={handleFilterStatusClear}
                                            className="ml-1 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                                            type="button"
                                            aria-label="Remove status filter"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}

                                {filterExpertise !== 'all' && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                    >
                                        Expertise: {filterExpertise}
                                        <button
                                            onClick={handleFilterExpertiseClear}
                                            className="ml-1 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                                            type="button"
                                            aria-label="Remove expertise filter"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}

                                {filterRating !== 'all' && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    >
                                        Rating: {filterRating}+ stars
                                        <button
                                            onClick={handleFilterRatingClear}
                                            className="ml-1 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                                            type="button"
                                            aria-label="Remove rating filter"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MentorSearchFilters;