"use client"

import { Search, FolderOpen, Home, ChevronRight, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FileNavigationProps {
    currentPath: string[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onNavigateUp: () => void;
    onNavigateTo: (index: number) => void;
    totalFiles?: number;
    workspaceName?: string;
}

export default function FileNavigation({
    currentPath,
    searchQuery,
    onSearchChange,
    onNavigateUp,
    onNavigateTo,
    totalFiles,
    workspaceName
}: FileNavigationProps) {
    return (
        <div className="space-y-4">
            {/* Search and Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                        type="search"
                        placeholder="Search files and folders..."
                        className="pl-10 pr-8 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                            onClick={() => onSearchChange('')}
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* File count and status */}
                <div className="flex items-center gap-3">
                    {totalFiles !== undefined && (
                        <div className="text-sm">
                            {searchQuery ? (
                                <Badge
                                    variant="outline"
                                    className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 font-medium"
                                >
                                    <Filter className="h-3 w-3 mr-1" />
                                    {totalFiles} result{totalFiles !== 1 ? 's' : ''}
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                >
                                    {totalFiles} item{totalFiles !== 1 ? 's' : ''}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    {/* Workspace root */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigateTo(-1)}
                        className="h-8 px-3 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex-shrink-0"
                    >
                        <Home className="h-4 w-4 mr-1.5" />
                        {workspaceName || 'Workspace'}
                    </Button>

                    {currentPath.length > 0 && (
                        <>
                            <ChevronRight className="h-4 w-4 mx-2 text-slate-400 dark:text-slate-600 flex-shrink-0" />

                            {currentPath.map((folder, index) => (
                                <div key={index} className="flex items-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onNavigateTo(index)}
                                        className="h-8 px-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0 max-w-[120px] truncate"
                                        title={folder}
                                    >
                                        {folder}
                                    </Button>

                                    {index < currentPath.length - 1 && (
                                        <ChevronRight className="h-4 w-4 mx-2 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    {/* Up button */}
                    {currentPath.length > 0 && (
                        <div className="ml-auto pl-4 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onNavigateUp}
                                className="h-8 px-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            >
                                <FolderOpen className="h-4 w-4 mr-1.5" />
                                Up
                            </Button>
                        </div>
                    )}
                </div>

                {/* Current location indicator */}
                {searchQuery && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Searching in: <span className="font-medium text-slate-700 dark:text-slate-300">
                                {currentPath.length > 0 ? currentPath.join(' / ') : 'All files'}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}