"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, AlertCircle, MessageCircle } from "lucide-react";
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
import { Contact } from "@/Redux/types/Communication/communication";

interface ContactStatusModalProps {
    contact: Contact;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (contactId: string, status: string, notes?: string) => Promise<void>;
}

type ContactsStatus = "closed" | "new" | "in_progress" | "resolved";

const ContactStatusModal: React.FC<ContactStatusModalProps> = ({
    contact,
    isOpen,
    onClose,
    onUpdate
}) => {
    const [selectedStatus, setSelectedStatus] = useState<ContactsStatus>(contact.status);
    const [notes, setNotes] = useState(contact.notes || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        {
            value: "new",
            label: "New",
            icon: <AlertCircle className="h-4 w-4" />,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            description: "Contact inquiry is new and unread"
        },
        {
            value: "in_progress",
            label: "In Progress",
            icon: <Clock className="h-4 w-4" />,
            color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            description: "Contact inquiry is being handled"
        },
        {
            value: "resolved",
            label: "Resolved",
            icon: <CheckCircle className="h-4 w-4" />,
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            description: "Contact inquiry has been resolved"
        },
        {
            value: "closed",
            label: "Closed",
            icon: <XCircle className="h-4 w-4" />,
            color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
            description: "Contact inquiry is closed"
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onUpdate(contact.id, selectedStatus, notes.trim() || undefined);
            onClose();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentStatus = statusOptions.find(option => option.value === contact.status);
    const newStatus = statusOptions.find(option => option.value === selectedStatus);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Update Contact Status
                    </DialogTitle>
                    <DialogDescription>
                        Update the status for {contact.fullName}'s contact inquiry
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
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
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => setSelectedStatus(value as ContactsStatus)}
                            >
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
                        {selectedStatus !== contact.status && (
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
                                disabled={isSubmitting || selectedStatus === contact.status}
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
            </DialogContent>
        </Dialog>
    );
};

export default ContactStatusModal;