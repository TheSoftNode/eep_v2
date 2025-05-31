"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

export default function NotificationPagination({
    currentPage,
    totalPages,
    setCurrentPage
}: NotificationPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    // Generate page numbers to show
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if there are less than maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Determine start and end of the center section
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're at the start
            if (currentPage <= 3) {
                startPage = 2;
                endPage = Math.min(totalPages - 1, 4);
            }

            // Adjust if we're at the end
            if (currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 3);
                endPage = totalPages - 1;
            }

            // Add ellipsis if needed at the start
            if (startPage > 2) {
                pages.push('...');
            }

            // Add center pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed at the end
            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = generatePageNumbers();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex justify-center py-6 border-t border-indigo-100/40 dark:border-indigo-800/30"
        >
            <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-sm border border-indigo-100/70 dark:border-indigo-800/40 p-1.5">
                {/* Subtle background gradient effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-60"></div>

                <div className="relative flex items-center gap-1 sm:gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className={cn(
                            "h-8 w-8 p-0 sm:w-auto sm:px-3 border-indigo-200/70 dark:border-indigo-800/50",
                            "text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30",
                            "hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200 relative group",
                            "disabled:text-indigo-300 dark:disabled:text-indigo-700/50 disabled:border-indigo-100 dark:disabled:border-indigo-800/30",
                            "disabled:bg-indigo-50/30 dark:disabled:bg-indigo-900/10"
                        )}
                    >
                        <ChevronLeft className="h-4 w-4 sm:mr-1 group-hover:-translate-x-0.5 transition-transform duration-200" />
                        <span className="hidden sm:inline">Prev</span>
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center space-x-1">
                        {pages.map((page, index) => (
                            <React.Fragment key={index}>
                                {typeof page === 'number' ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentPage(page)}
                                        className={cn(
                                            "flex items-center justify-center h-8 w-8 rounded-md text-xs font-medium transition-colors relative overflow-hidden",
                                            currentPage === page
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30"
                                        )}
                                    >
                                        {/* Active page indicator with animated gradient border */}
                                        {currentPage === page && (
                                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-indigo-300/20 to-purple-300/20 dark:from-indigo-400/10 dark:to-purple-400/10 animate-pulse-slow"></div>
                                        )}
                                        <span className="relative">{page}</span>
                                    </motion.button>
                                ) : (
                                    <span className="text-slate-400 dark:text-slate-600 px-1">...</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={cn(
                            "h-8 w-8 p-0 sm:w-auto sm:px-3 border-indigo-200/70 dark:border-indigo-800/50",
                            "text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30",
                            "hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200 relative group",
                            "disabled:text-indigo-300 dark:disabled:text-indigo-700/50 disabled:border-indigo-100 dark:disabled:border-indigo-800/30",
                            "disabled:bg-indigo-50/30 dark:disabled:bg-indigo-900/10"
                        )}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4 sm:ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Button>
                </div>
            </div>

            {/* Custom animation */}
            <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
        </motion.div>
    );
}