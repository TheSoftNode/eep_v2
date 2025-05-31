"use client"

import React, { useState } from 'react';
import { Trash2, AlertTriangle, RefreshCw, ShieldOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDeleteAccountMutation } from '@/Redux/apiSlices/users/profileApi';

export default function DangerZone() {
    const { toast } = useToast();
    const router = useRouter();
    const { logout } = useAuth();
    const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

    // Enable delete button only when user types "DELETE" correctly
    const handleConfirmTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmText(value);
        setIsConfirmEnabled(value === 'DELETE');
    };

    const handleDeleteAccount = async () => {
        if (!isConfirmEnabled) {
            toast({
                title: "Confirmation required",
                description: "Please type DELETE to confirm account deletion",
                variant: "destructive"
            });
            return;
        }

        try {
            await deleteAccount().unwrap();

            toast({
                title: "Account deleted",
                description: "Your account has been successfully deleted."
            });

            // Clean up auth state
            logout();

            // Close dialog
            setConfirmDialogOpen(false);

            // Redirect to homepage after a short delay
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (error) {
            console.error('Account deletion error:', error);
            toast({
                title: "Error",
                description: "Failed to delete your account. Please try again or contact support.",
                variant: "destructive"
            });
        }
    };

    return (
        <Card className="w-full border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="border-b border-gray-100/70 dark:border-gray-800/40 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center rounded-lg shadow-md shadow-red-500/10 dark:shadow-red-900/20">
                        <ShieldOff className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Danger Zone</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">Actions that cannot be undone</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
                <div className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-900/10 dark:to-red-800/5 border border-red-100/70 dark:border-red-900/20 rounded-lg p-4 md:p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-md shadow-red-500/10 text-white">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-red-800 dark:text-red-400 text-lg">Delete Account</h3>
                                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                    Permanently delete your account and remove all your data from our servers.
                                    This action is irreversible and will immediately revoke all access.
                                </p>
                            </div>
                        </div>

                        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 mt-2 md:mt-0"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-none shadow-xl backdrop-blur-sm">
                                <DialogHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center rounded-full shadow-md shadow-red-500/10 text-white">
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Delete Your Account</DialogTitle>
                                    </div>
                                    <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 border-t border-b border-gray-100 dark:border-gray-800 my-2">
                                    <div className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-900/10 dark:to-red-800/5 p-3 rounded-lg mb-4">
                                        <p className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Please be aware that:
                                        </p>
                                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-red-600 dark:text-red-300">
                                            <li>All your projects and tasks will be deleted</li>
                                            <li>Your profile information will be removed</li>
                                            <li>You will lose access to any learning resources</li>
                                            <li>This action is permanent and cannot be reversed</li>
                                        </ul>
                                    </div>

                                    <div className="mt-4">
                                        <Label htmlFor="confirm-delete" className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Type <span className="font-bold mx-1">DELETE</span> to confirm
                                        </Label>
                                        <Input
                                            id="confirm-delete"
                                            placeholder="DELETE"
                                            className="mt-2 border-red-300 dark:border-red-800 focus:ring-red-500 focus:border-red-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
                                            value={confirmText}
                                            onChange={handleConfirmTextChange}
                                            disabled={isDeleting}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => setConfirmDialogOpen(false)}
                                        disabled={isDeleting}
                                        className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting || !isConfirmEnabled}
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white disabled:from-red-400 dark:disabled:from-red-900/50 disabled:to-red-400 dark:disabled:to-red-900/50 shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                                    >
                                        {isDeleting ? (
                                            <div className="flex items-center">
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Deleting...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Yes, Delete My Account
                                            </div>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}