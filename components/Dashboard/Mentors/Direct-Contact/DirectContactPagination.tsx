import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DirectContactPaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
}

const DirectContactPagination: React.FC<DirectContactPaginationProps> = ({
    currentPage,
    totalPages,
    totalCount,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    const startIndex = (currentPage - 1) * 10 + 1;
    const endIndex = Math.min(currentPage * 10, totalCount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Showing {startIndex} to {endIndex} of {totalCount} messages
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNumber = i + 1;
                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => onPageChange(pageNumber)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default DirectContactPagination;