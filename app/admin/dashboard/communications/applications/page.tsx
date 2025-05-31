"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Search,
    Download,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Building,
    User,
    Mail,
    Phone,
    Calendar,
    Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Application, ApplicationQueryParams } from "@/Redux/types/Communication/communication";
import { useDeleteApplicationMutation, useGetApplicationsQuery, useUpdateApplicationStatusMutation } from "@/Redux/apiSlices/communication/communicationApi";
import ApplicationStatusModal from "@/components/Admin/AdminDashboard/Applications/ApplicationStatusModal";
import ApplicationDetails from "@/components/Admin/AdminDashboard/Applications/ApplicationDetails";
import BulkActionModal from "@/components/Admin/AdminDashboard/Applications/BulkActionModal";


const ApplicationsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "learner_application" | "business_application">("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "reviewing" | "approved" | "rejected" | "on_hold">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
    const [showBulkModal, setShowBulkModal] = useState(false);

    const queryParams: ApplicationQueryParams = {
        page: currentPage,
        limit: 10,
        type: typeFilter,
        status: statusFilter,
        search: searchTerm || undefined
    };

    const { data: applicationsData, isLoading, error, refetch } = useGetApplicationsQuery(queryParams);
    const [updateStatus] = useUpdateApplicationStatusMutation();
    const [deleteApplication] = useDeleteApplicationMutation();

    const applications = applicationsData?.data || [];
    const totalPages = applicationsData?.totalPages || 1;
    const totalCount = applicationsData?.totalCount || 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "reviewing":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "approved":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            case "on_hold":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="h-3 w-3" />;
            case "reviewing":
                return <Eye className="h-3 w-3" />;
            case "approved":
                return <CheckCircle className="h-3 w-3" />;
            case "rejected":
                return <XCircle className="h-3 w-3" />;
            case "on_hold":
                return <AlertCircle className="h-3 w-3" />;
            default:
                return <Clock className="h-3 w-3" />;
        }
    };

    const getTypeIcon = (type: string) => {
        return type === "business_application" ?
            <Building className="h-4 w-4" /> :
            <User className="h-4 w-4" />;
    };

    const handleStatusUpdate = async (applicationId: string, status: string, notes?: string) => {
        try {
            await updateStatus({ id: applicationId, status, notes }).unwrap();
            setShowStatusModal(false);
            setSelectedApplication(null);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async (applicationId: string) => {
        if (confirm("Are you sure you want to delete this application?")) {
            try {
                await deleteApplication(applicationId).unwrap();
            } catch (error) {
                console.error("Failed to delete application:", error);
            }
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedApplications(applications.map(app => app.id));
        } else {
            setSelectedApplications([]);
        }
    };

    const handleSelectApplication = (applicationId: string, checked: boolean) => {
        if (checked) {
            setSelectedApplications(prev => [...prev, applicationId]);
        } else {
            setSelectedApplications(prev => prev.filter(id => id !== applicationId));
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mb-4"></div>
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Applications</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage learner and business applications
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedApplications.length > 0 && (
                        <Button
                            onClick={() => setShowBulkModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            Bulk Actions ({selectedApplications.length})
                        </Button>
                    )}
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="learner_application">Learner Applications</SelectItem>
                                    <SelectItem value="business_application">Business Applications</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="reviewing">Reviewing</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="on_hold">On Hold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Applications Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Applications ({totalCount})
                        </CardTitle>
                        <CardDescription>
                            {applications.length} applications shown
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedApplications.length === applications.length && applications.length > 0}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                className="rounded"
                                            />
                                        </TableHead>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead className="w-12">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((application, index) => (
                                        <motion.tr
                                            key={application.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedApplications.includes(application.id)}
                                                    onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                                                    className="rounded"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        {getTypeIcon(application.type)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {application.fullName}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                            <Mail className="h-3 w-3" />
                                                            {application.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="gap-1">
                                                    {getTypeIcon(application.type)}
                                                    {application.type === "business_application" ? "Business" : "Learner"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`gap-1 ${getStatusColor(application.status)}`}>
                                                    {getStatusIcon(application.status)}
                                                    {application.status.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(application.submittedAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {application.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="h-3 w-3" />
                                                            Phone
                                                        </div>
                                                    )}
                                                    {"cvAttachment" in application && application.cvAttachment && (
                                                        <div className="flex items-center gap-1">
                                                            <Paperclip className="h-3 w-3" />
                                                            CV
                                                        </div>
                                                    )}
                                                    {"companyName" in application && (
                                                        <div className="flex items-center gap-1">
                                                            <Building className="h-3 w-3" />
                                                            {application.companyName}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedApplication(application);
                                                                setShowDetailsModal(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedApplication(application);
                                                                setShowStatusModal(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Update Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(application.id)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} applications
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Modals */}
            {showStatusModal && selectedApplication && (
                <ApplicationStatusModal
                    application={selectedApplication}
                    isOpen={showStatusModal}
                    onClose={() => {
                        setShowStatusModal(false);
                        setSelectedApplication(null);
                    }}
                    onUpdate={handleStatusUpdate}
                />
            )}

            {showDetailsModal && selectedApplication && (
                <ApplicationDetails
                    application={selectedApplication}
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedApplication(null);
                    }}
                />
            )}

            {showBulkModal && (
                <BulkActionModal
                    isOpen={showBulkModal}
                    onClose={() => setShowBulkModal(false)}
                    selectedIds={selectedApplications}
                    type="applications"
                    onSuccess={() => {
                        setSelectedApplications([]);
                        refetch();
                    }}
                />
            )}
        </div>
    );
};

export default ApplicationsPage;