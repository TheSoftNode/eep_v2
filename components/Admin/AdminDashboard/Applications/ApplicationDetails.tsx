"use client";

import React, { useEffect } from "react";
import {
    X,
    User,
    Mail,
    Phone,
    Building,
    Calendar,
    FileText,
    Paperclip,
    Download,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    Eye
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
import { Application, LearnerApplication, BusinessApplication } from "@/Redux/types/Communication/communication";

interface ApplicationDetailsProps {
    application: Application;
    isOpen: boolean;
    onClose: () => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
    application,
    isOpen,
    onClose
}) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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
                return <Clock className="h-4 w-4" />;
            case "reviewing":
                return <Eye className="h-4 w-4" />;
            case "approved":
                return <CheckCircle className="h-4 w-4" />;
            case "rejected":
                return <XCircle className="h-4 w-4" />;
            case "on_hold":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const isBusinessApplication = (app: Application): app is BusinessApplication => {
        return app.type === "business_application";
    };

    const isLearnerApplication = (app: Application): app is LearnerApplication => {
        return app.type === "learner_application";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Application Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information for {application.fullName}'s application
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status and Type */}
                    <div className="flex items-center gap-4">
                        <Badge className={`gap-2 ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            {application.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="gap-2">
                            {application.type === "business_application" ? (
                                <Building className="h-3 w-3" />
                            ) : (
                                <User className="h-3 w-3" />
                            )}
                            {application.type === "business_application" ? "Business Application" : "Learner Application"}
                        </Badge>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Full Name
                                </label>
                                <p className="text-slate-900 dark:text-white font-medium">
                                    {application.fullName}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <p className="text-slate-900 dark:text-white">
                                        {application.email}
                                    </p>
                                </div>
                            </div>
                            {application.phone && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Phone Number
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <p className="text-slate-900 dark:text-white">
                                            {application.phone}
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
                                        {new Date(application.submittedAt).toLocaleDateString("en-US", {
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
                    {isLearnerApplication(application) && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Learner Details
                            </h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Areas of Interest
                                </label>
                                <p className="text-slate-900 dark:text-white">
                                    {application.interests}
                                </p>
                            </div>
                            {application.cvAttachment && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        CV/Resume
                                    </label>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <Paperclip className="h-4 w-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {application.cvAttachment.filename}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {(application.cvAttachment.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        {application.cvAttachment.publicUrl && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    if (application.cvAttachment?.publicUrl) {
                                                        window.open(application.cvAttachment.publicUrl, "_blank");
                                                    }
                                                }}
                                                className="gap-2"
                                            >
                                                <Download className="h-3 w-3" />
                                                Download
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Business-specific Information */}
                    {isBusinessApplication(application) && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Business Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Company Name
                                    </label>
                                    <p className="text-slate-900 dark:text-white font-medium">
                                        {application.companyName}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Position
                                    </label>
                                    <p className="text-slate-900 dark:text-white">
                                        {application.status}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Industry
                                    </label>
                                    <p className="text-slate-900 dark:text-white">
                                        {application.industry}
                                    </p>
                                </div>
                                {application.employeeSize && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Company Size
                                        </label>
                                        <p className="text-slate-900 dark:text-white">
                                            {application.employeeSize}
                                        </p>
                                    </div>
                                )}
                                {application.type && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Project Type
                                        </label>
                                        <p className="text-slate-900 dark:text-white">
                                            {application.type}
                                        </p>
                                    </div>
                                )}
                                {application.status && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Project Status
                                        </label>
                                        <p className="text-slate-900 dark:text-white">
                                            {application.status}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {application.aiRequirements && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Requirements
                                    </label>
                                    <p className="text-slate-900 dark:text-white">
                                        {application.aiRequirements}
                                    </p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Terms Accepted
                                </label>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <p className="text-slate-900 dark:text-white">
                                        Yes, terms and conditions accepted
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {application.notes && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Admin Notes
                                </label>
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                                        {application.notes}
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

export default ApplicationDetails;