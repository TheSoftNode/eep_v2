"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderPlus, Loader2, Info, AlertCircle, Folder } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewFolderDialogProps {
    open: boolean;
    onClose: () => void;
    onCreateFolder: (folderName: string) => Promise<void>;
    isCreating?: boolean;
    currentPath?: string;
    workspaceName?: string;
}

export default function NewFolderDialog({
    open,
    onClose,
    onCreateFolder,
    isCreating = false,
    currentPath,
    workspaceName = 'Workspace'
}: NewFolderDialogProps) {
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState('');

    const handleCreateFolder = async () => {
        // Reset error
        setError('');

        // Basic validation
        if (!folderName.trim()) {
            setError('Folder name cannot be empty');
            return;
        }

        // Check for invalid characters
        const invalidChars = /[\\/:*?"<>|]/;
        if (invalidChars.test(folderName)) {
            setError('Folder name contains invalid characters (\\/:*?"<>|)');
            return;
        }

        // Check for reserved names
        const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
        if (reservedNames.includes(folderName.toUpperCase())) {
            setError('This folder name is reserved by the system');
            return;
        }

        // Check length
        if (folderName.length > 255) {
            setError('Folder name is too long (maximum 255 characters)');
            return;
        }

        try {
            await onCreateFolder(folderName.trim());
            handleClose();
        } catch (err: any) {
            console.error('Error creating folder:', err);
            setError(err?.message || 'Failed to create folder. It may already exist or you might not have permission.');
        }
    };

    const handleClose = () => {
        if (!isCreating) {
            setFolderName('');
            setError('');
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isCreating && folderName.trim()) {
            handleCreateFolder();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <DialogHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                        <FolderPlus className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Create New Folder
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* Location info */}
                    <div className="flex items-start p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <Folder className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                Creating folder in:
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                {currentPath ? `${workspaceName} / ${currentPath}` : workspaceName}
                            </p>
                        </div>
                    </div>

                    {/* Folder name input */}
                    <div className="space-y-2">
                        <Label htmlFor="folderName" className="text-slate-800 dark:text-slate-200 font-medium">
                            Folder Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="folderName"
                            placeholder="Enter folder name"
                            value={folderName}
                            onChange={(e) => {
                                setFolderName(e.target.value);
                                setError('');
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={isCreating}
                            autoFocus
                            className={`border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-400 dark:border-red-600' : ''
                                }`}
                        />
                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Guidelines */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            Folder names can contain letters, numbers, spaces, and most special characters except: \ / : * ? " &lt; &gt; |
                        </AlertDescription>
                    </Alert>
                </div>

                <DialogFooter className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isCreating}
                        className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCreateFolder}
                        disabled={isCreating || !folderName.trim()}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FolderPlus className="mr-2 h-4 w-4" />
                                Create Folder
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}