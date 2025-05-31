"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    MessageCircle,
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
    MessageSquare
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
import { Contact, ContactQueryParams } from "@/Redux/types/Communication/communication";
import { useDeleteContactMutation, useGetContactsQuery, useUpdateContactStatusMutation } from "@/Redux/apiSlices/communication/communicationApi";
import ContactStatusModal from "@/components/Admin/AdminDashboard/Contacts/ContactStatusModal";
import ContactDetails from "@/components/Admin/AdminDashboard/Contacts/ContactDetails";


const ContactsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "learner_contact" | "business_contact">("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "new" | "in_progress" | "resolved" | "closed">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const queryParams: ContactQueryParams = {
        page: currentPage,
        limit: 10,
        type: typeFilter,
        status: statusFilter,
        search: searchTerm || undefined
    };

    const { data: contactsData, isLoading, error } = useGetContactsQuery(queryParams);
    const [updateStatus] = useUpdateContactStatusMutation();
    const [deleteContact] = useDeleteContactMutation();

    const contacts = contactsData?.data || [];
    const totalPages = contactsData?.totalPages || 1;
    const totalCount = contactsData?.totalCount || 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "resolved":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "closed":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "new":
                return <AlertCircle className="h-3 w-3" />;
            case "in_progress":
                return <Clock className="h-3 w-3" />;
            case "resolved":
                return <CheckCircle className="h-3 w-3" />;
            case "closed":
                return <XCircle className="h-3 w-3" />;
            default:
                return <AlertCircle className="h-3 w-3" />;
        }
    };

    const getTypeIcon = (type: string) => {
        return type === "business_contact" ?
            <Building className="h-4 w-4" /> :
            <User className="h-4 w-4" />;
    };

    const handleStatusUpdate = async (contactId: string, status: string, notes?: string) => {
        try {
            await updateStatus({ id: contactId, status, notes }).unwrap();
            setShowStatusModal(false);
            setSelectedContact(null);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async (contactId: string) => {
        if (confirm("Are you sure you want to delete this contact?")) {
            try {
                await deleteContact(contactId).unwrap();
            } catch (error) {
                console.error("Failed to delete contact:", error);
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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Inquiries</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage learner and business contact inquiries
                    </p>
                </div>
                <div className="flex items-center gap-3">
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
                                    placeholder="Search contacts..."
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
                                    <SelectItem value="learner_contact">Learner Contacts</SelectItem>
                                    <SelectItem value="business_contact">Business Contacts</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Contacts Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Contact Inquiries ({totalCount})
                        </CardTitle>
                        <CardDescription>
                            {contacts.length} contacts shown
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="w-12">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contacts.map((contact, index) => (
                                        <motion.tr
                                            key={contact.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        {getTypeIcon(contact.type)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {contact.fullName}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                            <Mail className="h-3 w-3" />
                                                            {contact.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="gap-1">
                                                    {getTypeIcon(contact.type)}
                                                    {contact.type === "business_contact" ? "Business" : "Learner"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`gap-1 ${getStatusColor(contact.status)}`}>
                                                    {getStatusIcon(contact.status)}
                                                    {contact.status.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(contact.submittedAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    {contact.type === "learner_contact" ? (
                                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <MessageSquare className="h-3 w-3" />
                                                            <span className="truncate">
                                                                Interest in {(contact as any).programInterest}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <Building className="h-3 w-3" />
                                                            <span className="truncate">
                                                                {(contact as any).company}
                                                            </span>
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
                                                                setSelectedContact(contact);
                                                                setShowDetailsModal(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedContact(contact);
                                                                setShowStatusModal(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Update Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(contact.id)}
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
                                    Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} contacts
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
            {showStatusModal && selectedContact && (
                <ContactStatusModal
                    contact={selectedContact}
                    isOpen={showStatusModal}
                    onClose={() => {
                        setShowStatusModal(false);
                        setSelectedContact(null);
                    }}
                    onUpdate={handleStatusUpdate}
                />
            )}

            {showDetailsModal && selectedContact && (
                <ContactDetails
                    contact={selectedContact}
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedContact(null);
                    }}
                />
            )}
        </div>
    );
};

export default ContactsPage;