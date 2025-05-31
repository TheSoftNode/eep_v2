"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Search,
    Download,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    UserX,
    Calendar,
    Users,
    AlertCircle
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
import { NewsletterSubscription, NewsletterQueryParams } from "@/Redux/types/Communication/communication";
import { useDeleteSubscriptionMutation, useGetNewsletterSubscriptionsQuery, useUpdateSubscriptionStatusMutation } from "@/Redux/apiSlices/communication/communicationApi";
import NewsletterStatusModal from "@/components/Admin/AdminDashboard/NewsLetters/NewsletterStatusModal";
import NewsletterDetails from "@/components/Admin/AdminDashboard/NewsLetters/NewsletterDetails";


const NewsletterPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "unsubscribed">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSubscription, setSelectedSubscription] = useState<NewsletterSubscription | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const queryParams: NewsletterQueryParams = {
        page: currentPage,
        limit: 10,
        status: statusFilter,
        search: searchTerm || undefined
    };

    const { data: subscriptionsData, isLoading, error } = useGetNewsletterSubscriptionsQuery(queryParams);
    const [updateStatus] = useUpdateSubscriptionStatusMutation();
    const [deleteSubscription] = useDeleteSubscriptionMutation();

    console.log(subscriptionsData)

    const subscriptions = subscriptionsData?.data || [];
    const totalPages = subscriptionsData?.totalPages || 1;
    const totalCount = subscriptionsData?.totalCount || 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "inactive":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "unsubscribed":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle className="h-3 w-3" />;
            case "inactive":
                return <AlertCircle className="h-3 w-3" />;
            case "unsubscribed":
                return <UserX className="h-3 w-3" />;
            default:
                return <AlertCircle className="h-3 w-3" />;
        }
    };

    const handleStatusUpdate = async (subscriptionId: string, status: string) => {
        try {
            await updateStatus({ id: subscriptionId, status }).unwrap();
            setShowStatusModal(false);
            setSelectedSubscription(null);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async (subscriptionId: string) => {
        if (confirm("Are you sure you want to delete this subscription?")) {
            try {
                await deleteSubscription(subscriptionId).unwrap();
            } catch (error) {
                console.error("Failed to delete subscription:", error);
            }
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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Newsletter Subscriptions</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage newsletter subscribers and campaigns
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Mail className="h-4 w-4" />
                        Send Campaign
                    </Button>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-500 text-white">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-700 dark:text-green-300">Active</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    {subscriptions.filter(s => s.status === "active").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-500 text-white">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Inactive</p>
                                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                                    {subscriptions.filter(s => s.status === "inactive").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-500 text-white">
                                <UserX className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-700 dark:text-red-300">Unsubscribed</p>
                                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                                    {subscriptions.filter(s => s.status === "unsubscribed").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-500 text-white">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Total</p>
                                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                    {totalCount}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by email address..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Subscriptions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Newsletter Subscriptions ({totalCount})
                        </CardTitle>
                        <CardDescription>
                            {subscriptions.length} subscriptions shown
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email Address</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Subscribed Date</TableHead>
                                        <TableHead>Last Updated</TableHead>
                                        <TableHead className="w-12">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subscriptions.map((subscription, index) => (
                                        <motion.tr
                                            key={subscription.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        <Mail className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {subscription.email}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            ID: {subscription.id.slice(0, 8)}...
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`gap-1 ${getStatusColor(subscription.status)}`}>
                                                    {getStatusIcon(subscription.status)}
                                                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(subscription.subscribedAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {subscription.updatedAt ?
                                                        new Date(subscription.updatedAt).toLocaleDateString() :
                                                        "Never"
                                                    }
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
                                                                setSelectedSubscription(subscription);
                                                                setShowDetailsModal(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedSubscription(subscription);
                                                                setShowStatusModal(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Update Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(subscription.id)}
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
                                    Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} subscriptions
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
            {showStatusModal && selectedSubscription && (
                <NewsletterStatusModal
                    subscription={selectedSubscription}
                    isOpen={showStatusModal}
                    onClose={() => {
                        setShowStatusModal(false);
                        setSelectedSubscription(null);
                    }}
                    onUpdate={handleStatusUpdate}
                />
            )}

            {showDetailsModal && selectedSubscription && (
                <NewsletterDetails
                    subscription={selectedSubscription}
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedSubscription(null);
                    }}
                />
            )}
        </div>
    );
};

export default NewsletterPage;