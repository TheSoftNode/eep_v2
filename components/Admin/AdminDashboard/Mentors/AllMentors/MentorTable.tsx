import React from 'react';
import { motion } from 'framer-motion';
import {
    Eye,
    MessageSquare,
    MoreVertical,
    Star,
    Calendar,
    Users,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MentorProfile } from '@/Redux/types/Users/mentor';

// Table components with TypeScript
interface TableProps {
    children: React.ReactNode;
    className?: string;
}

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

interface TableHeadProps {
    children: React.ReactNode;
    className?: string;
}

const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => (
    <div className="w-full overflow-auto">
        <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
            {children}
        </table>
    </div>
);

const TableHeader: React.FC<TableProps> = ({ children, ...props }) => (
    <thead className="[&_tr]:border-b" {...props}>
        {children}
    </thead>
);

const TableRow: React.FC<TableRowProps> = ({ children, className = '', ...props }) => (
    <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`} {...props}>
        {children}
    </tr>
);

const TableHead: React.FC<TableHeadProps> = ({ children, className = '', ...props }) => (
    <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
        {children}
    </th>
);

const TableBody: React.FC<TableProps> = ({ children, ...props }) => (
    <tbody className="[&_tr:last-child]:border-0" {...props}>
        {children}
    </tbody>
);

const TableCell: React.FC<TableCellProps> = ({ children, className = '', ...props }) => (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
        {children}
    </td>
);

// Mentor Card Component
interface MentorCardProps {
    mentor: MentorProfile & {
        disabled?: boolean;
        sessionCount?: number;
        bio?: string | null;
    };
    onViewMentor: (mentor: MentorProfile) => void;
    onMessageMentor: (mentor: MentorProfile) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onViewMentor, onMessageMentor }) => {
    const getStatusBadge = (mentor: MentorCardProps['mentor']) => {
        if (mentor.disabled) {
            return <Badge variant="destructive">Inactive</Badge>;
        }
        if (mentor.isAvailable) {
            return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Available</Badge>;
        }
        return <Badge variant="secondary">Unavailable</Badge>;
    };

    const handleViewClick = (): void => {
        onViewMentor(mentor);
    };

    const handleMessageClick = (): void => {
        onMessageMentor(mentor);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Card className="h-full border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                {mentor.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg truncate">
                                    {mentor.fullName}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                    {mentor.email}
                                </p>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleViewClick}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleMessageClick}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Mentor
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View Schedule
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    {mentor.disabled ? (
                                        <>
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            Activate
                                        </>
                                    ) : (
                                        <>
                                            <UserX className="h-4 w-4 mr-2" />
                                            Deactivate
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Mentor
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Status and Company */}
                    <div className="flex items-center justify-between mb-3">
                        {getStatusBadge(mentor)}
                        {mentor.company && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate ml-2">
                                @ {mentor.company}
                            </span>
                        )}
                    </div>

                    {/* Bio */}
                    {mentor.bio && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                            {mentor.bio}
                        </p>
                    )}

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {mentor.expertise?.slice(0, 3).map((skill: string, index: number) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800"
                            >
                                {skill}
                            </Badge>
                        ))}
                        {mentor.expertise?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{mentor.expertise.length - 3}
                            </Badge>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                                <Star className="h-4 w-4 text-amber-500 mr-1" />
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {mentor.rating}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Rating
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-slate-900 dark:text-white mb-1">
                                {mentor.reviewCount}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Reviews
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-slate-900 dark:text-white mb-1">
                                {mentor.sessionCount || 0}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Sessions
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <Button
                            size="sm"
                            onClick={handleViewClick}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleMessageClick}
                            className="flex-1"
                        >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Mentor Table Row Component
interface MentorTableRowProps {
    mentor: MentorProfile & {
        disabled?: boolean;
        sessionCount?: number;
    };
    onViewMentor: (mentor: MentorProfile) => void;
    onMessageMentor: (mentor: MentorProfile) => void;
}

const MentorTableRow: React.FC<MentorTableRowProps> = ({ mentor, onViewMentor, onMessageMentor }) => {
    const getStatusBadge = (mentor: MentorTableRowProps['mentor']) => {
        if (mentor.disabled) {
            return <Badge variant="destructive" className="text-xs">Inactive</Badge>;
        }
        if (mentor.isAvailable) {
            return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">Available</Badge>;
        }
        return <Badge variant="secondary" className="text-xs">Unavailable</Badge>;
    };

    const handleViewClick = (): void => {
        onViewMentor(mentor);
    };

    const handleMessageClick = (): void => {
        onMessageMentor(mentor);
    };

    return (
        <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <TableCell>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {mentor.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                            {mentor.fullName}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            {mentor.email}
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                {getStatusBadge(mentor)}
            </TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-1">
                    {mentor.expertise?.slice(0, 2).map((skill: string, index: number) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800"
                        >
                            {skill}
                        </Badge>
                    ))}
                    {mentor.expertise?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{mentor.expertise.length - 2}
                        </Badge>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                        ({mentor.reviewCount})
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    {mentor.company || 'Not specified'}
                </span>
            </TableCell>
            <TableCell>
                <span className="font-medium">{mentor.sessionCount || 0}</span>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Button
                        size="sm"
                        onClick={handleViewClick}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleMessageClick}
                    >
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
};

// Main Mentor Table Component
interface MentorTableProps {
    mentors: (MentorProfile & {
        disabled?: boolean;
        sessionCount?: number;
        bio?: string | null;
    })[];
    viewMode: 'grid' | 'table';
    currentPage: number;
    setCurrentPage: (page: number) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    totalCount: number;
    onViewMentor: (mentor: MentorProfile) => void;
    onMessageMentor: (mentor: MentorProfile) => void;
    loading: boolean;
}

const MentorTable: React.FC<MentorTableProps> = ({
    mentors,
    viewMode,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,
    onViewMentor,
    onMessageMentor,
    loading
}) => {
    const totalPages: number = Math.ceil(totalCount / pageSize);
    const startIndex: number = (currentPage - 1) * pageSize + 1;
    const endIndex: number = Math.min(currentPage * pageSize, totalCount);

    const handlePreviousPage = (): void => {
        setCurrentPage(Math.max(currentPage - 1, 1));
    };

    const handleNextPage = (): void => {
        setCurrentPage(Math.min(currentPage + 1, totalPages));
    };

    const handlePageClick = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
        >
            {viewMode === 'grid' ? (
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                            Mentor Directory
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {mentors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                                {mentors.map((mentor) => (
                                    <MentorCard
                                        key={mentor.id}
                                        mentor={mentor}
                                        onViewMentor={onViewMentor}
                                        onMessageMentor={onMessageMentor}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    No mentors found
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Try adjusting your search criteria or add new mentors to the platform.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                            Mentor Directory
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {mentors.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mentor</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Expertise</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Sessions</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mentors.map((mentor) => (
                                        <MentorTableRow
                                            key={mentor.id}
                                            mentor={mentor}
                                            onViewMentor={onViewMentor}
                                            onMessageMentor={onMessageMentor}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="p-12 text-center">
                                <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    No mentors found
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Try adjusting your search criteria or add new mentors to the platform.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {mentors.length > 0 && totalPages > 1 && (
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Showing {startIndex} to {endIndex} of {totalCount} mentors
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
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
                                                onClick={() => handlePageClick(pageNumber)}
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
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
};

export default MentorTable;