"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, UserX, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { NewsletterSubscription } from "@/Redux/types/Communication/communication";

interface NewsletterStatusModalProps {
    subscription: NewsletterSubscription;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (subscriptionId: string, status: string) => Promise<void>;
}

type SubscriptionStatus = "active" | "inactive" | "unsubscribed";


const NewsletterStatusModal: React.FC<NewsletterStatusModalProps> = ({
    subscription,
    isOpen,
    onClose,
    onUpdate
}) => {

    const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus>(subscription.status);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        {
            value: "active",
            label: "Active",
            icon: <CheckCircle className="h-4 w-4" />,
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            description: "Subscriber will receive newsletter emails"
        },
        {
            value: "inactive",
            label: "Inactive",
            icon: <AlertCircle className="h-4 w-4" />,
            color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            description: "Subscription is paused but not unsubscribed"
        },
        {
            value: "unsubscribed",
            label: "Unsubscribed",
            icon: <UserX className="h-4 w-4" />,
            color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            description: "Subscriber has unsubscribed from newsletter"
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onUpdate(subscription.id, selectedStatus);
            onClose();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentStatus = statusOptions.find(option => option.value === subscription.status);
    const newStatus = statusOptions.find(option => option.value === selectedStatus);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Update Subscription Status
                    </DialogTitle>
                    <DialogDescription>
                        Update the newsletter subscription status for {subscription.email}
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
                                onValueChange={(value: string) => setSelectedStatus(value as SubscriptionStatus)}
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

                        {/* Status Change Preview */}
                        {selectedStatus !== subscription.status && (
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

                        {/* Warning for Unsubscribe */}
                        {selectedStatus === "unsubscribed" && subscription.status !== "unsubscribed" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                            >
                                <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>
                                        This will unsubscribe the user from all newsletter communications.
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting || selectedStatus === subscription.status}
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

export default NewsletterStatusModal;