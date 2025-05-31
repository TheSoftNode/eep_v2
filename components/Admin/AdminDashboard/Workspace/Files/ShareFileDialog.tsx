"use client"

import { useState } from 'react';
import { X, Mail, Copy, Clock, Check, AlertCircle, Loader2, Share2, Link, User } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { WorkspaceFile } from '@/Redux/types/Workspace/workspace';
import { useShareFileMutation } from '@/Redux/apiSlices/workspaces/workspaceFilesApi';

interface ShareFileDialogProps {
    open: boolean;
    onClose: () => void;
    file: WorkspaceFile | null;
}

export default function ShareFileDialog({ open, onClose, file }: ShareFileDialogProps) {
    const [email, setEmail] = useState('');
    const [expiryDays, setExpiryDays] = useState('7');
    const [copySuccess, setCopySuccess] = useState(false);
    const [shareMethod, setShareMethod] = useState<'email' | 'link'>('email');
    const [password, setPassword] = useState('');
    const [shareResult, setShareResult] = useState<any>(null);

    const [shareFile, { isLoading }] = useShareFileMutation();

    // Reset state when dialog opens/closes
    const handleClose = () => {
        setEmail('');
        setExpiryDays('7');
        setCopySuccess(false);
        setShareMethod('email');
        setPassword('');
        setShareResult(null);
        onClose();
    };

    // Copy link to clipboard
    const handleCopyLink = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            setCopySuccess(true);

            toast({
                title: "Link Copied",
                description: "The share link has been copied to your clipboard",
            });

            // Reset success state after 3 seconds
            setTimeout(() => {
                setCopySuccess(false);
            }, 3000);
        } catch (error) {
            toast({
                title: "Copy Failed",
                description: "Unable to copy link to clipboard",
                variant: "destructive"
            });
        }
    };

    // Share file via email
    const handleShareViaEmail = async () => {
        if (!file) return;

        if (!email.trim()) {
            toast({
                title: "Email Required",
                description: "Please enter an email address",
                variant: "destructive"
            });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address",
                variant: "destructive"
            });
            return;
        }

        try {
            const response = await shareFile({
                fileId: file.id,
                workspaceId: file.workspaceId,
                expiryDays: parseInt(expiryDays),
                password: password || undefined
            }).unwrap();

            setShareResult(response.data);

            toast({
                title: "File Shared Successfully",
                description: `Share link sent to ${email}`,
            });
        } catch (err: any) {
            console.error('Failed to share file:', err);
            toast({
                title: "Share Failed",
                description: err?.data?.message || "Failed to share file. Please try again.",
                variant: "destructive"
            });
        }
    };

    // Generate shareable link
    const handleGenerateLink = async () => {
        if (!file) return;

        try {
            const response = await shareFile({
                fileId: file.id,
                workspaceId: file.workspaceId,
                expiryDays: parseInt(expiryDays),
                password: password || undefined
            }).unwrap();

            setShareResult(response.data);

            toast({
                title: "Share Link Generated",
                description: "Your shareable link is ready to use",
            });
        } catch (err: any) {
            console.error('Failed to generate share link:', err);
            toast({
                title: "Generation Failed",
                description: err?.data?.message || "Failed to generate share link. Please try again.",
                variant: "destructive"
            });
        }
    };

    if (!file) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-2">
                            <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Share File
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                                Share "{file.name}" with others securely
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {!shareResult ? (
                        <>
                            {/* Share Method Selection */}
                            <div>
                                <Label className="text-slate-800 dark:text-slate-200 font-medium mb-3 block">
                                    How would you like to share this file?
                                </Label>
                                <RadioGroup
                                    value={shareMethod}
                                    onValueChange={(value) => setShareMethod(value as 'email' | 'link')}
                                    className="space-y-3"
                                >
                                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <RadioGroupItem value="email" id="email" className="mt-1 border-indigo-500 text-indigo-600" />
                                        <Label htmlFor="email" className="flex-1 cursor-pointer">
                                            <div className="flex items-center mb-1">
                                                <Mail className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                                                <span className="font-medium text-slate-900 dark:text-slate-100">Share via email</span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Send a secure link directly to someone's email
                                            </p>
                                        </Label>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <RadioGroupItem value="link" id="link" className="mt-1 border-indigo-500 text-indigo-600" />
                                        <Label htmlFor="link" className="flex-1 cursor-pointer">
                                            <div className="flex items-center mb-1">
                                                <Link className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                                                <span className="font-medium text-slate-900 dark:text-slate-100">Generate shareable link</span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Create a link that you can share with anyone
                                            </p>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Email Input (for email sharing) */}
                            {shareMethod === 'email' && (
                                <div>
                                    <Label htmlFor="email-input" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-2">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email-input"
                                            type="email"
                                            placeholder="colleague@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Expiry Settings */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="expiry" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Link expires after
                                    </Label>
                                    <div className="flex items-center mt-2">
                                        <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                                        <select
                                            id="expiry"
                                            value={expiryDays}
                                            onChange={(e) => setExpiryDays(e.target.value)}
                                            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="1">1 day</option>
                                            <option value="3">3 days</option>
                                            <option value="7">7 days</option>
                                            <option value="30">30 days</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Password (Optional)
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Add password protection"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-2 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Security Notice */}
                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                    {shareMethod === 'email'
                                        ? `A secure link will be sent to ${email || 'the specified email'}. The recipient can access the file until the link expires.`
                                        : `Anyone with the generated link can access this file${password ? ' (password required)' : ''}. The link will expire after ${expiryDays} day${expiryDays !== '1' ? 's' : ''}.`
                                    }
                                </AlertDescription>
                            </Alert>
                        </>
                    ) : (
                        /* Share Result */
                        <div className="space-y-4">
                            <div className="text-center py-4">
                                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3 w-16 h-16 mx-auto mb-4">
                                    <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    File Shared Successfully!
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Your secure share link is ready to use
                                </p>
                            </div>

                            {/* Share Link */}
                            <div>
                                <Label className="text-slate-800 dark:text-slate-200 font-medium">Shareable Link</Label>
                                <div className="flex mt-2">
                                    <Input
                                        readOnly
                                        value={shareResult.accessUrl}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono text-sm"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleCopyLink(shareResult.accessUrl)}
                                        className="ml-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        {copySuccess ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Share Details */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Expires:</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {new Date(shareResult.expiresAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {password && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Password Protected:</span>
                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Yes</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Share ID:</span>
                                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                        {shareResult.shareId}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                        {shareResult ? 'Close' : 'Cancel'}
                    </Button>

                    {!shareResult && (
                        <Button
                            type="button"
                            onClick={shareMethod === 'email' ? handleShareViaEmail : handleGenerateLink}
                            disabled={isLoading || (shareMethod === 'email' && !email.trim())}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {shareMethod === 'email' ? 'Sending...' : 'Generating...'}
                                </>
                            ) : (
                                <>
                                    {shareMethod === 'email' ? (
                                        <>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Send Share Link
                                        </>
                                    ) : (
                                        <>
                                            <Link className="h-4 w-4 mr-2" />
                                            Generate Link
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}