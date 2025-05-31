"use client";

import React from "react";
import {
    Mail,
    Calendar,
    CheckCircle,
    AlertCircle,
    UserX,
    Clock,
    User
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
import { NewsletterSubscription } from "@/Redux/types/Communication/communication";

interface NewsletterDetailsProps {
    subscription: NewsletterSubscription;
    isOpen: boolean;
    onClose: () => void;
}

const NewsletterDetails: React.FC<NewsletterDetailsProps> = ({
    subscription,
    isOpen,
    onClose
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "inactive":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "unsubscribed":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case "active":
                return "This subscriber is actively receiving newsletter emails";
            case "inactive":
                return "This subscription is paused but not unsubscribed";
            case "unsubscribed":
                return "This subscriber has unsubscribed from newsletter emails";
            default:
                return "Unknown status";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle className="h-4 w-4" />;
            case "inactive":
                return <AlertCircle className="h-4 w-4" />;
            case "unsubscribed":
                return <UserX className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Newsletter Subscription Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information for newsletter subscription
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-center">
                        <Badge className={`gap-2 px-4 py-2 text-sm ${getStatusColor(subscription.status)}`}>
                            {getStatusIcon(subscription.status)}
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)} Subscription
                        </Badge>
                    </div>

                    {/* Email Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Subscriber Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Email Address
                                        </label>
                                        <p className="text-slate-900 dark:text-white font-medium">
                                            {subscription.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Subscription ID
                                        </label>
                                        <p className="text-slate-900 dark:text-white font-mono text-sm">
                                            {subscription.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Status Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Status Information
                        </h3>
                        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(subscription.status)}
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {getStatusDescription(subscription.status)}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Timeline Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Timeline
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <div>
                                        <label className="text-sm font-medium text-green-700 dark:text-green-300">
                                            Subscribed Date
                                        </label>
                                        <p className="text-green-900 dark:text-green-100 font-medium">
                                            {formatDate(subscription.subscribedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {subscription.updatedAt && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                Last Updated
                                            </label>
                                            <p className="text-blue-900 dark:text-blue-100 font-medium">
                                                {formatDate(subscription.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {subscription.updatedBy && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        <div>
                                            <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                                Updated By
                                            </label>
                                            <p className="text-indigo-900 dark:text-indigo-100 font-medium">
                                                Admin ({subscription.updatedBy})
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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

export default NewsletterDetails;
