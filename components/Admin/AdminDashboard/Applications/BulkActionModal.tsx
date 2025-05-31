"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, AlertCircle, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useBulkUpdateApplicationsMutation } from "@/Redux/apiSlices/communication/communicationApi";

interface BulkActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedIds: string[];
    type: "applications" | "contacts" | "subscriptions";
    onSuccess: () => void;
}

const BulkActionModal: React.FC<BulkActionModalProps> = ({
    isOpen,
    onClose,
    selectedIds,
    type,
    onSuccess
}) => {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [bulkUpdateApplications] = useBulkUpdateApplicationsMutation();

    const getStatusOptions = () => {
        if (type === "applications") {
            return [
                {
                    value: "pending",
                    label: "Pending",
                    icon: <Clock className="h-4 w-4" />,
                    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                    description: "Mark as pending review"
                },
                {
                    value: "reviewing",
                    label: "Reviewing",
                    icon: <Eye className="h-4 w-4" />,
                    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                    description: "Mark as under review"
                },
                {
                    value: "approved",
                    label: "Approved",
                    icon: <CheckCircle className="h-4 w-4" />,
                    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                    description: "Approve all selected applications"
                },
                {
                    value: "rejected",
                    label: "Rejected",
                    icon: <XCircle className="h-4 w-4" />,
                    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                    description: "Reject all selected applications"
                },
                {
                    value: "on_hold",
                    label: "On Hold",
                    icon: <AlertCircle className="h-4 w-4" />,
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                    description: "Put applications on hold"
                }
            ];
        }

        // Add other types as needed
        return [];
    };

    const statusOptions = getStatusOptions();
    const selectedOption = statusOptions.find(option => option.value === selectedStatus);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStatus) return;

        setIsSubmitting(true);

        try {
            if (type === "applications") {
                await bulkUpdateApplications({
                    ids: selectedIds,
                    status: selectedStatus,
                    notes: notes.trim() || undefined
                }).unwrap();
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to perform bulk action:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case "applications":
                return "applications";
            case "contacts":
                return "contacts";
            case "subscriptions":
                return "subscriptions";
            default:
                return "items";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Bulk Action
                    </DialogTitle>
                    <DialogDescription>
                        Update status for {selectedIds.length} selected {getTypeLabel()}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Selected Items Count */}
                    <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-indigo-600 text-white">
                                {selectedIds.length}
                            </Badge>
                            <span className="text-sm text-indigo-700 dark:text-indigo-300">
                                {getTypeLabel()} selected for bulk update
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Status Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="bulkStatus">New Status</Label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status to apply" />
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
                            {selectedOption && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {selectedOption.description}
                                </p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="bulkNotes">Notes (Optional)</Label>
                            <Textarea
                                id="bulkNotes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes for this bulk update..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        {/* Preview */}
                        {selectedStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                            >
                                <div className="flex items-center gap-2 text-sm">
                                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    <span className="text-amber-800 dark:text-amber-200">
                                        This will update {selectedIds.length} {getTypeLabel()} to
                                    </span>
                                    <Badge className={`text-xs ${selectedOption?.color}`}>
                                        {selectedOption?.label}
                                    </Badge>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !selectedStatus}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isSubmitting ? "Updating..." : `Update ${selectedIds.length} ${getTypeLabel()}`}
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
            </DialogContent>
        </Dialog>
    );
};

export default BulkActionModal;