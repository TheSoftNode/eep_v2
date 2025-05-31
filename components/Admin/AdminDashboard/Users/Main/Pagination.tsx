"use client"

import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    limit: number;
    onLimitChange: (limit: number) => void;
    totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    limit,
    onLimitChange,
    totalItems
}) => {
    const getPageNumbers = () => {
        const pages = [];

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        let rangeStart = Math.max(2, currentPage - 1);
        let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

        // Adjust range if currentPage is near start or end
        if (currentPage <= 3) {
            rangeEnd = Math.min(5, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
            rangeStart = Math.max(2, totalPages - 4);
        }

        // Add ellipsis if needed before range
        if (rangeStart > 2) {
            pages.push('...');
        }

        // Add range pages
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed after range
        if (rangeEnd < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    // Calculate displayed items range
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalItems);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm px-6 py-4">
            {/* Mobile view */}
            <div className="flex justify-between sm:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-slate-200 dark:border-slate-700"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="border-slate-200 dark:border-slate-700"
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>

            {/* Desktop view */}
            <div className="hidden sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Show
                        </span>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => onLimitChange(Number(value))}
                        >
                            <SelectTrigger className="w-20 h-8 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            per page
                        </span>
                    </div>

                    {/* Results info */}
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-medium text-slate-900 dark:text-white">{startItem}</span> to{' '}
                        <span className="font-medium text-slate-900 dark:text-white">{endItem}</span> of{' '}
                        <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> results
                    </div>
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                    {/* First page button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* Previous button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1 mx-2">
                        {/* Page numbers */}
                        {pageNumbers.map((page, index) => (
                            page === '...' ? (
                                <Button
                                    key={`ellipsis-${index}`}
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                    className="h-8 w-8 p-0"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    key={`page-${page}`}
                                    variant={currentPage === page ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => typeof page === 'number' && onPageChange(page)}
                                    className={cn(
                                        "h-8 w-8 p-0 font-medium",
                                        currentPage === page
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    {page}
                                </Button>
                            )
                        ))}
                    </div>

                    {/* Next button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last page button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;