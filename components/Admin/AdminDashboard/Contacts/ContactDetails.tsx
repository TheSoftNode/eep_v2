"use client";

import React from "react";
import {
    User,
    Mail,
    Phone,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Contact, LearnerContact, BusinessContact } from "@/Redux/types/Communication/communication";

interface ContactDetailsProps {
    contact: Contact;
    isOpen: boolean;
    onClose: () => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
    contact,
    isOpen,
    onClose
}) => {
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
                return <AlertCircle className="h-4 w-4" />;
            case "in_progress":
                return <Clock className="h-4 w-4" />;
            case "resolved":
                return <CheckCircle className="h-4 w-4" />;
            case "closed":
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const isBusinessContact = (contact: Contact): contact is BusinessContact => {
        return contact.type === "business_contact";
    };

    const isLearnerContact = (contact: Contact): contact is LearnerContact => {
        return contact.type === "learner_contact";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Contact Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information for {contact.fullName}'s contact inquiry
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status and Type */}
                    <div className="flex items-center gap-4">
                        <Badge className={`gap-2 ${getStatusColor(contact.status)}`}>
                            {getStatusIcon(contact.status)}
                            {contact.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="gap-2">
                            {contact.type === "business_contact" ? (
                                <Building className="h-3 w-3" />
                            ) : (
                                <User className="h-3 w-3" />
                            )}
                            {contact.type === "business_contact" ? "Business Contact" : "Learner Contact"}
                        </Badge>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Full Name
                                </label>
                                <p className="text-slate-900 dark:text-white font-medium">
                                    {contact.fullName}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <p className="text-slate-900 dark:text-white">
                                        {contact.email}
                                    </p>
                                </div>
                            </div>
                            {contact.phone && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Phone Number
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <p className="text-slate-900 dark:text-white">
                                            {contact.phone}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Submitted Date
                                </label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <p className="text-slate-900 dark:text-white">
                                        {new Date(contact.submittedAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Learner-specific Information */}
                    {isLearnerContact(contact) && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Learner Inquiry Details
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Program Interest
                                    </label>
                                    <p className="text-slate-900 dark:text-white font-medium">
                                        {contact.programInterest}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Message
                                    </label>
                                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                                            {contact.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Business-specific Information */}
                    {isBusinessContact(contact) && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Business Inquiry Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Company Name
                                    </label>
                                    <p className="text-slate-900 dark:text-white font-medium">
                                        {contact.company}
                                    </p>
                                </div>
                                {contact.projectType && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Project Type
                                        </label>
                                        <p className="text-slate-900 dark:text-white">
                                            {contact.projectType}
                                        </p>
                                    </div>
                                )}
                                {contact.projectStatus && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Project Status
                                        </label>
                                        <p className="text-slate-900 dark:text-white">
                                            {contact.projectStatus}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Project Details
                                </label>
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                                        {contact.projectDetails}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {contact.notes && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Admin Notes
                                </label>
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                                        {contact.notes}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ContactDetails;