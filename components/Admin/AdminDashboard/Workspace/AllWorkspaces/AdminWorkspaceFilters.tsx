import React from 'react';
import { Search, FilterX, Calendar, Users, FolderKanban } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { WorkspaceStatus } from '@/Redux/types/Workspace/workspace';

interface FilterState {
    search: string;
    status: WorkspaceStatus | 'all';
    visibility: 'all' | 'public' | 'private' | 'organization';
    sortBy: 'name' | 'createdAt' | 'updatedAt' | 'memberCount';
    sortOrder: 'asc' | 'desc';
}

interface AdminWorkspaceFiltersProps {
    filters: FilterState;
    onFiltersChange: (filters: Partial<FilterState>) => void;
    onClearFilters: () => void;
    totalCount: number;
    filteredCount: number;
}

const AdminWorkspaceFilters: React.FC<AdminWorkspaceFiltersProps> = ({
    filters,
    onFiltersChange,
    onClearFilters,
    totalCount,
    filteredCount
}) => {
    const hasActiveFilters = filters.search ||
        filters.status !== 'all' ||
        filters.visibility !== 'all' ||
        filters.sortBy !== 'updatedAt' ||
        filters.sortOrder !== 'desc';

    return (
        <div className="space-y-4">
            {/* Search and primary filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Search workspaces by name or description..."
                        className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                        value={filters.search}
                        onChange={(e) => onFiltersChange({ search: e.target.value })}
                    />
                </div>

                {/* Status Filter */}
                <Select
                    value={filters.status}
                    onValueChange={(value) => onFiltersChange({ status: value as WorkspaceStatus | 'all' })}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>

                {/* Visibility Filter */}
                <Select
                    value={filters.visibility}
                    onValueChange={(value) => onFiltersChange({ visibility: value as 'all' | 'public' | 'private' | 'organization' })}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Visibility</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort By */}
                <Select
                    value={filters.sortBy}
                    onValueChange={(value) => onFiltersChange({ sortBy: value as FilterState['sortBy'] })}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="updatedAt">Last Updated</SelectItem>
                        <SelectItem value="createdAt">Created Date</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="memberCount">Member Count</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Order */}
                <Select
                    value={filters.sortOrder}
                    onValueChange={(value) => onFiltersChange({ sortOrder: value as 'asc' | 'desc' })}
                >
                    <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Active filters and results count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {/* Results count */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <FolderKanban className="h-4 w-4" />
                        <span>
                            {filteredCount === totalCount
                                ? `${totalCount} workspaces`
                                : `${filteredCount} of ${totalCount} workspaces`
                            }
                        </span>
                    </div>

                    {/* Active filter indicators */}
                    {filters.search && (
                        <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                            Search: "{filters.search}"
                        </Badge>
                    )}

                    {filters.status !== 'all' && (
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Status: {filters.status}
                        </Badge>
                    )}

                    {filters.visibility !== 'all' && (
                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            Visibility: {filters.visibility}
                        </Badge>
                    )}
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                        <FilterX className="h-4 w-4 mr-2" />
                        Clear filters
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AdminWorkspaceFilters;