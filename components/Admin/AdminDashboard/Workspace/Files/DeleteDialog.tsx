"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash, AlertTriangle, Loader2, FolderX, FileX } from 'lucide-react';
import { WorkspaceFile } from '@/Redux/types/Workspace/workspace';


interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isDeleting?: boolean;
    file: WorkspaceFile | null;
}

export default function DeleteDialog({
    open,
    onClose,
    onConfirm,
    isDeleting = false,
    file
}: DeleteDialogProps) {
    if (!file) return null;

    const handleConfirm = async () => {
        try {
            await onConfirm();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleClose = () => {
        if (!isDeleting) {
            onClose();
        }
    };

    const isFolder = file.type === 'folder';

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <DialogHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Delete {isFolder ? 'Folder' : 'File'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2">
                        This action cannot be undone. Please confirm your decision.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* File/Folder preview */}
                    <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-4">
                        <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2 mr-3">
                            {isFolder ? (
                                <FolderX className="h-5 w-5 text-red-600 dark:text-red-400" />
                            ) : (
                                <FileX className="h-5 w-5 text-red-600 dark:text-red-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                {file.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {isFolder ? 'Folder' : `${file.sizeFormatted || 'Unknown size'}`}
                            </p>
                        </div>
                    </div>

                    {/* Warning message */}
                    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
                        <div className="flex items-start">
                            <Trash className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                    {isFolder ? 'Folder Deletion Warning' : 'File Deletion Warning'}
                                </p>
                                <div className="text-sm text-red-700 dark:text-red-400 space-y-1">
                                    <p>
                                        The {isFolder ? 'folder' : 'file'} "{file.name}" will be permanently deleted.
                                    </p>
                                    {isFolder && (
                                        <p className="font-medium">
                                            Note: Only empty folders can be deleted.
                                        </p>
                                    )}
                                    {!isFolder && (
                                        <p>
                                            Any shared links to this file will no longer work.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete {isFolder ? 'Folder' : 'File'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}