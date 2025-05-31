"use client";

import React from "react";
import {

    CheckCircle,
    AlertTriangle,

} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


// Bulk Action Result Component
export const BulkActionResult: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    results: {
        success: string[];
        failed: { id: string; reason: string }[];
    } | null;
    action: string;
}> = ({ isOpen, onClose, results, action }) => {
    if (!results) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {results.success.length > 0 && results.failed.length === 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : results.failed.length > 0 ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : null}
                        Bulk {action} Results
                    </DialogTitle>
                    <DialogDescription>
                        Operation completed with {results.success.length} successful and {results.failed.length} failed actions.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {results.success.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Successful ({results.success.length})
                            </h4>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 max-h-32 overflow-y-auto">
                                <div className="text-sm text-green-800 dark:text-green-300 space-y-1">
                                    {results.success.map((id, index) => (
                                        <div key={index} className="font-mono text-xs">
                                            {id}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {results.failed.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                Failed ({results.failed.length})
                            </h4>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 max-h-32 overflow-y-auto">
                                <div className="space-y-2">
                                    {results.failed.map((item, index) => (
                                        <div key={index} className="text-sm border-b border-red-200 dark:border-red-800 pb-1 last:border-b-0">
                                            <div className="font-mono text-xs font-medium text-red-800 dark:text-red-300">
                                                {item.id}
                                            </div>
                                            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                {item.reason}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};