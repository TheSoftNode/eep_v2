// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { X, CheckCircle, XCircle, Clock, AlertCircle, Eye } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Application } from "@/Redux/types/Communication/communication";

// interface ApplicationStatusModalProps {
//     application: Application;
//     isOpen: boolean;
//     onClose: () => void;
//     onUpdate: (applicationId: string, status: string, notes?: string) => Promise<void>;
// }

// type ApplicationStatus = "pending" | "reviewing" | "approved" | "rejected" | "on_hold";

// const ApplicationStatusModal: React.FC<ApplicationStatusModalProps> = ({
//     application,
//     isOpen,
//     onClose,
//     onUpdate
// }) => {
//     const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(application.status);
//     const [notes, setNotes] = useState(application.notes || "");
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const statusOptions = [
//         {
//             value: "pending",
//             label: "Pending",
//             icon: <Clock className="h-4 w-4" />,
//             color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
//             description: "Application is waiting for review"
//         },
//         {
//             value: "reviewing",
//             label: "Reviewing",
//             icon: <Eye className="h-4 w-4" />,
//             color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
//             description: "Application is currently being reviewed"
//         },
//         {
//             value: "approved",
//             label: "Approved",
//             icon: <CheckCircle className="h-4 w-4" />,
//             color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
//             description: "Application has been approved"
//         },
//         {
//             value: "rejected",
//             label: "Rejected",
//             icon: <XCircle className="h-4 w-4" />,
//             color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
//             description: "Application has been rejected"
//         },
//         {
//             value: "on_hold",
//             label: "On Hold",
//             icon: <AlertCircle className="h-4 w-4" />,
//             color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
//             description: "Application is temporarily on hold"
//         }
//     ];

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         try {
//             await onUpdate(application.id, selectedStatus, notes.trim() || undefined);
//             onClose();
//         } catch (error) {
//             console.error("Failed to update status:", error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const currentStatus = statusOptions.find(option => option.value === application.status);
//     const newStatus = statusOptions.find(option => option.value === selectedStatus);

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-md dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
//                 <DialogHeader>
//                     <DialogTitle className="flex items-center gap-2">
//                         Update Application Status
//                     </DialogTitle>
//                     <DialogDescription>
//                         Update the status for {application.fullName}'s application
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-4">
//                     {/* Current Status */}
//                     <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
//                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                             Current Status
//                         </Label>
//                         <div className="mt-2">
//                             {currentStatus && (
//                                 <Badge className={`gap-2 ${currentStatus.color}`}>
//                                     {currentStatus.icon}
//                                     {currentStatus.label}
//                                 </Badge>
//                             )}
//                             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//                                 {currentStatus?.description}
//                             </p>
//                         </div>
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         {/* New Status Selection */}
//                         <div className="space-y-2">
//                             <Label htmlFor="status">New Status</Label>
//                             <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ApplicationStatus)}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {statusOptions.map((option) => (
//                                         <SelectItem key={option.value} value={option.value}>
//                                             <div className="flex items-center gap-2">
//                                                 {option.icon}
//                                                 <span>{option.label}</span>
//                                             </div>
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             {newStatus && (
//                                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                                     {newStatus.description}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Notes */}
//                         <div className="space-y-2">
//                             <Label htmlFor="notes">Notes (Optional)</Label>
//                             <Textarea
//                                 id="notes"
//                                 value={notes}
//                                 onChange={(e) => setNotes(e.target.value)}
//                                 placeholder="Add any notes about this status change..."
//                                 rows={3}
//                                 className="resize-none"
//                             />
//                         </div>

//                         {/* Status Change Preview */}
//                         {selectedStatus !== application.status && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20"
//                             >
//                                 <div className="flex items-center gap-2 text-sm">
//                                     <span className="text-slate-600 dark:text-slate-400">Status will change from</span>
//                                     <Badge className={`text-xs ${currentStatus?.color}`}>
//                                         {currentStatus?.label}
//                                     </Badge>
//                                     <span className="text-slate-600 dark:text-slate-400">to</span>
//                                     <Badge className={`text-xs ${newStatus?.color}`}>
//                                         {newStatus?.label}
//                                     </Badge>
//                                 </div>
//                             </motion.div>
//                         )}

//                         {/* Action Buttons */}
//                         <div className="flex items-center gap-3 pt-4">
//                             <Button
//                                 type="submit"
//                                 disabled={isSubmitting || selectedStatus === application.status}
//                                 className="flex-1 bg-indigo-600 hover:bg-indigo-700"
//                             >
//                                 {isSubmitting ? "Updating..." : "Update Status"}
//                             </Button>
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={onClose}
//                                 disabled={isSubmitting}
//                             >
//                                 Cancel
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default ApplicationStatusModal;

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, XCircle, Clock, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Application } from "@/Redux/types/Communication/communication";

interface ApplicationStatusModalProps {
    application: Application;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (applicationId: string, status: string, notes?: string) => Promise<void>;
}

type ApplicationStatus = "pending" | "reviewing" | "approved" | "rejected" | "on_hold";

const ApplicationStatusModal: React.FC<ApplicationStatusModalProps> = ({
    application,
    isOpen,
    onClose,
    onUpdate
}) => {
    const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(application.status);
    const [notes, setNotes] = useState(application.notes || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const statusOptions = [
        {
            value: "pending",
            label: "Pending",
            icon: <Clock className="h-4 w-4" />,
            color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            description: "Application is waiting for review"
        },
        {
            value: "reviewing",
            label: "Reviewing",
            icon: <Eye className="h-4 w-4" />,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            description: "Application is currently being reviewed"
        },
        {
            value: "approved",
            label: "Approved",
            icon: <CheckCircle className="h-4 w-4" />,
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            description: "Application has been approved"
        },
        {
            value: "rejected",
            label: "Rejected",
            icon: <XCircle className="h-4 w-4" />,
            color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            description: "Application has been rejected"
        },
        {
            value: "on_hold",
            label: "On Hold",
            icon: <AlertCircle className="h-4 w-4" />,
            color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
            description: "Application is temporarily on hold"
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onUpdate(application.id, selectedStatus, notes.trim() || undefined);
            onClose();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const currentStatus = statusOptions.find(option => option.value === application.status);
    const newStatus = statusOptions.find(option => option.value === selectedStatus);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" />
            
            {/* Dialog Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg"
            >
                {/* Header */}
                <div className="p-6 pb-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                Update Application Status
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Update the status for {application.fullName}'s application
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Current Status */}
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Current Status
                        </Label>
                        <div className="mt-2">
                            {currentStatus && (
                                <Badge className={`gap-2 ${currentStatus.color}`}>
                                    {currentStatus.icon}
                                    {currentStatus.label}
                                </Badge>
                            )}
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {currentStatus?.description}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Status Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="status">New Status</Label>
                            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ApplicationStatus)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                {option.icon}
                                                <span>{option.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {newStatus && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {newStatus.description}
                                </p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes about this status change..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        {/* Status Change Preview */}
                        {selectedStatus !== application.status && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20"
                            >
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Status will change from</span>
                                    <Badge className={`text-xs ${currentStatus?.color}`}>
                                        {currentStatus?.label}
                                    </Badge>
                                    <span className="text-slate-600 dark:text-slate-400">to</span>
                                    <Badge className={`text-xs ${newStatus?.color}`}>
                                        {newStatus?.label}
                                    </Badge>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting || selectedStatus === application.status}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isSubmitting ? "Updating..." : "Update Status"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ApplicationStatusModal;