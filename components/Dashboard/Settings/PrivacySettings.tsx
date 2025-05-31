"use client"

import React, { useState, useEffect } from 'react';
import { Shield, Download, Lock, Save, RefreshCw, AlertTriangle, QrCode, KeyRound, CheckCircle, XCircle, Copy, Download as DownloadIcon, Eye, Activity, Fingerprint } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useDisableTwoFactorMutation, useGenerateTwoFactorSecretMutation, useGetTwoFactorStatusQuery, useVerifyTwoFactorSetupMutation } from '@/Redux/apiSlices/users/twoFactorApi';


export default function PrivacySettings() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Privacy settings state
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [activityTracking, setActivityTracking] = useState(true);

    // 2FA states
    const [setupDialogOpen, setSetupDialogOpen] = useState(false);
    const [disableDialogOpen, setDisableDialogOpen] = useState(false);
    const [verificationToken, setVerificationToken] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [savedRecoveryCodes, setSavedRecoveryCodes] = useState<string[]>([]);
    const [setupStep, setSetupStep] = useState(1);
    const [useRecoveryForDisable, setUseRecoveryForDisable] = useState(false);

    // RTK Query hooks for 2FA
    const { data: twoFactorStatus, isLoading: isStatusLoading, refetch: refetchStatus } = useGetTwoFactorStatusQuery();
    const [generateSecret, { isLoading: isGenerating, data: secretData }] = useGenerateTwoFactorSecretMutation();
    const [verifySetup, { isLoading: isVerifying }] = useVerifyTwoFactorSetupMutation();
    const [disableTwoFactor, { isLoading: isDisabling }] = useDisableTwoFactorMutation();

    // Reset states when dialogs close
    useEffect(() => {
        if (!setupDialogOpen) {
            setSetupStep(1);
            setVerificationToken('');
            setSavedRecoveryCodes([]);
        }
    }, [setupDialogOpen]);

    useEffect(() => {
        if (!disableDialogOpen) {
            setVerificationToken('');
            setRecoveryCode('');
            setUseRecoveryForDisable(false);
        }
    }, [disableDialogOpen]);

    const handleDownloadData = async () => {
        setIsDownloading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast({
                title: "Data export initiated",
                description: "Your data export request is being processed. You'll receive a download link in your email shortly."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate data export. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSavePrivacySettings = async () => {
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Privacy settings updated",
                description: "Your privacy settings have been saved successfully."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update privacy settings. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 2FA Setup Functions
    const handleStartSetup = async () => {
        try {
            await generateSecret().unwrap();
            setSetupStep(2);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate 2FA secret. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleVerifySetup = async () => {
        if (!verificationToken) {
            toast({
                title: "Verification code required",
                description: "Please enter the verification code from your authenticator app",
                variant: "destructive"
            });
            return;
        }

        try {
            const result = await verifySetup({ token: verificationToken }).unwrap();
            setSavedRecoveryCodes(result.recoveryCodes || []);
            setSetupStep(3);

            toast({
                title: "2FA Enabled",
                description: "Two-factor authentication has been enabled for your account."
            });

            // Refresh 2FA status
            refetchStatus();
        } catch (error) {
            toast({
                title: "Verification failed",
                description: "The verification code is invalid or has expired. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleDisable2FA = async () => {
        if (!verificationToken && !recoveryCode) {
            toast({
                title: "Verification required",
                description: "Please enter a verification code or recovery code",
                variant: "destructive"
            });
            return;
        }

        try {
            await disableTwoFactor({
                token: useRecoveryForDisable ? undefined : verificationToken,
                recoveryCode: useRecoveryForDisable ? recoveryCode : undefined
            }).unwrap();

            setDisableDialogOpen(false);

            toast({
                title: "2FA Disabled",
                description: "Two-factor authentication has been disabled for your account."
            });

            // Refresh 2FA status
            refetchStatus();
        } catch (error) {
            toast({
                title: "Verification failed",
                description: "The code you entered is invalid. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleFinishSetup = () => {
        setSetupDialogOpen(false);
        setSetupStep(1);

        toast({
            title: "2FA Setup Complete",
            description: "Two-factor authentication has been successfully set up for your account.",
        });

        // Optional: Refetch 2FA status to ensure UI is up-to-date
        refetchStatus();
    };

    // Helper function to download recovery codes
    const downloadRecoveryCodes = () => {
        if (savedRecoveryCodes.length === 0) return;

        const text = "RECOVERY CODES - KEEP THESE SAFE\n\n" +
            "These codes can be used to access your account if you lose your authenticator device.\n" +
            "Each code can only be used once.\n\n" +
            savedRecoveryCodes.join("\n");

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recovery-codes.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Recovery codes downloaded",
            description: "Please keep these codes in a safe place."
        });
    };

    // Copy recovery code to clipboard
    const copyRecoveryCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Code copied",
            description: "Recovery code copied to clipboard"
        });
    };

    return (
        <Card className="w-full border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="border-b border-gray-100/70 dark:border-gray-800/40 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center rounded-lg shadow-md shadow-indigo-500/10 dark:shadow-indigo-900/20">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Privacy & Security</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">Manage your privacy and security preferences</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 p-4 md:p-6">
                {/* Privacy Settings Section */}
                <div className="bg-white/60 dark:bg-gray-800/30 rounded-xl shadow-sm border border-gray-100/70 dark:border-gray-800/40 p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center rounded-lg shadow-md shadow-purple-500/10 dark:shadow-purple-900/20">
                            <Eye className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy Settings</h3>
                    </div>

                    <div className="space-y-4 pl-1 md:pl-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-sm shadow-purple-500/10 text-white group-hover:shadow-md group-hover:shadow-purple-500/20 transition-all duration-200">
                                    <Eye className="h-5 w-5" />
                                </div>
                                <div>
                                    <Label htmlFor="profile-visibility" className="font-medium text-gray-900 dark:text-white">Public Profile</Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow others to see your profile information</p>
                                </div>
                            </div>
                            <Switch
                                id="profile-visibility"
                                checked={profileVisibility}
                                onCheckedChange={setProfileVisibility}
                                className="data-[state=checked]:bg-purple-600 data-[state=checked]:dark:bg-purple-500"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200 group backdrop-blur-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800/40">
                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-sm shadow-blue-500/10 text-white group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-200">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <div>
                                    <Label htmlFor="activity-tracking" className="font-medium text-gray-900 dark:text-white">Activity Tracking</Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow us to collect usage data to improve your experience</p>
                                </div>
                            </div>
                            <Switch
                                id="activity-tracking"
                                checked={activityTracking}
                                onCheckedChange={setActivityTracking}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:dark:bg-blue-500"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleSavePrivacySettings}
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-medium rounded-lg focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Privacy Settings
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white/60 dark:bg-gray-800/30 rounded-xl shadow-sm border border-gray-100/70 dark:border-gray-800/40 p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center rounded-lg shadow-md shadow-indigo-500/10 dark:shadow-indigo-900/20">
                            <Fingerprint className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
                    </div>

                    <div className="space-y-4 pl-1 md:pl-10">
                        {/* Two-Factor Authentication Card */}
                        <div className="p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-50/50 dark:from-indigo-900/10 dark:to-indigo-800/5 rounded-lg border border-indigo-100/70 dark:border-indigo-900/20 shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="mb-4 md:mb-0 md:mr-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                                            <KeyRound className="h-4 w-4" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h4>

                                        {!isStatusLoading && twoFactorStatus && (
                                            twoFactorStatus.twoFactorEnabled ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-50 text-green-800 dark:from-green-900/30 dark:to-green-900/10 dark:text-green-400 border border-green-200/50 dark:border-green-800/30 shadow-sm">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Enabled
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 dark:from-gray-800 dark:to-gray-800/80 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Disabled
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Add an extra layer of security to your account by requiring both your password and a verification code from your mobile device.
                                    </p>
                                </div>

                                {isStatusLoading ? (
                                    <Button
                                        disabled
                                        className="w-full md:w-auto mt-2 md:mt-0 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                                    >
                                        <div className="flex items-center">
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Loading...
                                        </div>
                                    </Button>
                                ) : twoFactorStatus?.twoFactorEnabled ? (
                                    <Button
                                        variant="destructive"
                                        onClick={() => setDisableDialogOpen(true)}
                                        className="w-full md:w-auto mt-2 md:mt-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Disable 2FA
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSetupDialogOpen(true)}
                                        className="w-full md:w-auto mt-2 md:mt-0 border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        <KeyRound className="h-4 w-4 mr-2" />
                                        Enable 2FA
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Export Section */}
                <div className="bg-white/60 dark:bg-gray-800/30 rounded-xl shadow-sm border border-gray-100/70 dark:border-gray-800/40 p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center rounded-lg shadow-md shadow-blue-500/10 dark:shadow-blue-900/20">
                            <Download className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Export</h3>
                    </div>

                    <div className="space-y-4 pl-1 md:pl-10">
                        <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/10 dark:to-blue-800/5 rounded-lg border border-blue-100/70 dark:border-blue-900/20 shadow-sm transition-all duration-300 hover:shadow-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                Download a copy of all your personal data stored in our system. The export will include your profile information,
                                activity history, and preferences.
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleDownloadData}
                                disabled={isDownloading}
                                className="border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                {isDownloading ? (
                                    <div className="flex items-center">
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <DownloadIcon className="h-4 w-4 mr-2" />
                                        Request Data Export
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* 2FA Setup Dialog */}
            <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-none shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                                <KeyRound className="h-4 w-4" />
                            </div>
                            Setup Two-Factor Authentication
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Enhance your account security with two-factor authentication
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {setupStep === 1 && (
                            <div className="space-y-4">
                                <Alert className="bg-gradient-to-r from-yellow-50 to-yellow-50/50 dark:from-yellow-900/10 dark:to-yellow-800/5 border border-yellow-200/70 dark:border-yellow-800/30 text-yellow-800 dark:text-yellow-400">
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        <AlertDescription>
                                            You'll need an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy on your mobile device.
                                        </AlertDescription>
                                    </div>
                                </Alert>
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-4">
                                        <KeyRound className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Strengthen Your Account Security</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        With two-factor authentication, you'll need to provide a verification code from your authenticator app each time you sign in.
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleStartSetup}
                                        disabled={isGenerating}
                                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                                    >
                                        {isGenerating ? (
                                            <div className="flex items-center">
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Loading...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                Start Setup
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {setupStep === 2 && secretData && (
                            <div className="space-y-4">
                                <div className="flex flex-col items-center justify-center pb-4">
                                    <div className="relative bg-white p-3 rounded-lg shadow-md border border-indigo-100 dark:border-indigo-900/30 mx-auto mb-4 transition-all duration-300 hover:shadow-lg">
                                        <img src={secretData.qrCode} alt="QR Code" className="h-48 w-48" />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                                        Scan this QR code with your authenticator app or enter the setup key manually.
                                    </p>

                                    <div className="w-full max-w-xs">
                                        <Label htmlFor="setup-key" className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                                            <QrCode className="h-4 w-4 mr-2 text-indigo-500" />
                                            Setup Key (Manual Entry)
                                        </Label>
                                        <div className="flex">
                                            <Input
                                                id="setup-key"
                                                value={secretData.secret}
                                                readOnly
                                                className="flex-1 font-mono text-sm bg-gray-50/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <Button
                                                variant="outline"
                                                className="ml-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(secretData.secret);
                                                    toast({
                                                        title: "Copied",
                                                        description: "Setup key copied to clipboard"
                                                    });
                                                }}
                                            >
                                                <Copy className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200/70 dark:border-gray-800/40 pt-4">
                                    <Label htmlFor="verification-code" className="text-sm font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                                        <Fingerprint className="h-4 w-4 mr-2 text-indigo-500" />
                                        Enter Verification Code
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        Enter the 6-digit code from your authenticator app to verify setup
                                    </p>
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <Input
                                            id="verification-code"
                                            value={verificationToken}
                                            onChange={(e) => setVerificationToken(e.target.value)}
                                            placeholder="123456"
                                            className="flex-1 bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                            maxLength={6}
                                        />
                                        <Button
                                            onClick={handleVerifySetup}
                                            disabled={isVerifying || !verificationToken}
                                            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white w-full sm:w-auto shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                                        >
                                            {isVerifying ? (
                                                <div className="flex items-center">
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Verifying...
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Verify
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {setupStep === 3 && savedRecoveryCodes.length > 0 && (
                            <div className="space-y-4">
                                <Alert className="bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-900/10 dark:to-green-800/5 border border-green-200/70 dark:border-green-800/30 text-green-800 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    <AlertDescription>
                                        <AlertTitle className="font-semibold">Success!</AlertTitle>
                                        Two-factor authentication has been enabled for your account.
                                    </AlertDescription>
                                </Alert>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                                        <KeyRound className="h-5 w-5 mr-2 text-indigo-500" />
                                        Recovery Codes
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Save these recovery codes in a secure location. You can use them to sign in if you lose access to your authenticator app.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                        {savedRecoveryCodes.map((code, index) => (
                                            <div key={index} className="relative group">
                                                <div className="flex items-center p-2 font-mono text-sm bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 transition-all duration-200 group-hover:border-indigo-200 dark:group-hover:border-indigo-800/50">
                                                    {code}
                                                    <button
                                                        onClick={() => copyRecoveryCode(code)}
                                                        className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        aria-label="Copy code"
                                                    >
                                                        <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={downloadRecoveryCodes}
                                        className="w-full border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        <DownloadIcon className="h-4 w-4 mr-2" />
                                        Download Recovery Codes
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
                        {setupStep === 1 && (
                            <Button
                                variant="outline"
                                onClick={() => setSetupDialogOpen(false)}
                                className="w-full sm:w-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                            >
                                Cancel
                            </Button>
                        )}

                        {setupStep === 2 && (
                            <Button
                                variant="outline"
                                onClick={() => setSetupStep(1)}
                                className="w-full sm:w-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                            >
                                Back
                            </Button>
                        )}

                        {setupStep === 3 && (
                            <Button
                                onClick={handleFinishSetup}
                                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                            >
                                Finish
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2FA Disable Dialog */}
            <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-none shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-sm">
                                <XCircle className="h-4 w-4" />
                            </div>
                            Disable Two-Factor Authentication
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Verify your identity to disable 2FA
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Alert className="bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/10 dark:to-red-800/5 border border-red-200/70 dark:border-red-800/30 text-red-800 dark:text-red-400 mb-4">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <AlertDescription>
                                Warning: Disabling two-factor authentication will make your account less secure.
                            </AlertDescription>
                        </Alert>

                        <Tabs defaultValue="app" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-lg">
                                <TabsTrigger
                                    value="app"
                                    onClick={() => setUseRecoveryForDisable(false)}
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                                >
                                    <Fingerprint className="h-4 w-4 mr-2" />
                                    Authenticator
                                </TabsTrigger>
                                <TabsTrigger
                                    value="recovery"
                                    onClick={() => setUseRecoveryForDisable(true)}
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                                >
                                    <KeyRound className="h-4 w-4 mr-2" />
                                    Recovery Code
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="app" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="verification-code-disable" className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                        <Fingerprint className="h-4 w-4 mr-2 text-indigo-500" />
                                        Verification Code
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Enter the 6-digit code from your authenticator app
                                    </p>
                                    <Input
                                        id="verification-code-disable"
                                        value={verificationToken}
                                        onChange={(e) => setVerificationToken(e.target.value)}
                                        placeholder="123456"
                                        className="bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                        maxLength={6}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="recovery" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="recovery-code-disable" className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                        <KeyRound className="h-4 w-4 mr-2 text-indigo-500" />
                                        Recovery Code
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Enter one of your recovery codes
                                    </p>
                                    <Input
                                        id="recovery-code-disable"
                                        value={recoveryCode}
                                        onChange={(e) => setRecoveryCode(e.target.value)}
                                        placeholder="XXXX-XXXX-XX"
                                        className="bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
                        <Button
                            variant="outline"
                            onClick={() => setDisableDialogOpen(false)}
                            className="w-full sm:w-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDisable2FA}
                            disabled={isDisabling || (useRecoveryForDisable ? !recoveryCode : !verificationToken)}
                            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                        >
                            {isDisabling ? (
                                <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Disabling...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Disable 2FA
                                </div>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// "use client"

// import React, { useState, useEffect } from 'react';
// import { Shield, Download, Lock, Save, RefreshCw, AlertTriangle, QrCode, KeyRound, CheckCircle, XCircle, Copy, Download as DownloadIcon } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import {
//     Tabs,
//     TabsContent,
//     TabsList,
//     TabsTrigger,
// } from "@/components/ui/tabs";
// import { useDisableTwoFactorMutation, useGenerateTwoFactorSecretMutation, useGetTwoFactorStatusQuery, useVerifyTwoFactorSetupMutation } from '@/Redux/apiSlices/users/twoFactorApi';


// export default function PrivacySettings() {
//     const { toast } = useToast();
//     const [isLoading, setIsLoading] = useState(false);
//     const [isDownloading, setIsDownloading] = useState(false);

//     // Privacy settings state
//     const [profileVisibility, setProfileVisibility] = useState(true);
//     const [activityTracking, setActivityTracking] = useState(true);

//     // 2FA states
//     const [setupDialogOpen, setSetupDialogOpen] = useState(false);
//     const [disableDialogOpen, setDisableDialogOpen] = useState(false);
//     const [verificationToken, setVerificationToken] = useState('');
//     const [recoveryCode, setRecoveryCode] = useState('');
//     const [savedRecoveryCodes, setSavedRecoveryCodes] = useState<string[]>([]);
//     const [setupStep, setSetupStep] = useState(1);
//     const [useRecoveryForDisable, setUseRecoveryForDisable] = useState(false);

//     // RTK Query hooks for 2FA
//     const { data: twoFactorStatus, isLoading: isStatusLoading, refetch: refetchStatus } = useGetTwoFactorStatusQuery();
//     const [generateSecret, { isLoading: isGenerating, data: secretData }] = useGenerateTwoFactorSecretMutation();
//     const [verifySetup, { isLoading: isVerifying }] = useVerifyTwoFactorSetupMutation();
//     const [disableTwoFactor, { isLoading: isDisabling }] = useDisableTwoFactorMutation();

//     // Reset states when dialogs close
//     useEffect(() => {
//         if (!setupDialogOpen) {
//             setSetupStep(1);
//             setVerificationToken('');
//             setSavedRecoveryCodes([]);
//         }
//     }, [setupDialogOpen]);

//     useEffect(() => {
//         if (!disableDialogOpen) {
//             setVerificationToken('');
//             setRecoveryCode('');
//             setUseRecoveryForDisable(false);
//         }
//     }, [disableDialogOpen]);

//     const handleDownloadData = async () => {
//         setIsDownloading(true);

//         try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 2000));

//             toast({
//                 title: "Data export initiated",
//                 description: "Your data export request is being processed. You'll receive a download link in your email shortly."
//             });
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to generate data export. Please try again later.",
//                 variant: "destructive"
//             });
//         } finally {
//             setIsDownloading(false);
//         }
//     };

//     const handleSavePrivacySettings = async () => {
//         setIsLoading(true);

//         try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             toast({
//                 title: "Privacy settings updated",
//                 description: "Your privacy settings have been saved successfully."
//             });
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to update privacy settings. Please try again.",
//                 variant: "destructive"
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // 2FA Setup Functions
//     const handleStartSetup = async () => {
//         try {
//             await generateSecret().unwrap();
//             setSetupStep(2);
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to generate 2FA secret. Please try again.",
//                 variant: "destructive"
//             });
//         }
//     };

//     const handleVerifySetup = async () => {
//         if (!verificationToken) {
//             toast({
//                 title: "Verification code required",
//                 description: "Please enter the verification code from your authenticator app",
//                 variant: "destructive"
//             });
//             return;
//         }

//         try {
//             const result = await verifySetup({ token: verificationToken }).unwrap();
//             setSavedRecoveryCodes(result.recoveryCodes || []);
//             setSetupStep(3);

//             toast({
//                 title: "2FA Enabled",
//                 description: "Two-factor authentication has been enabled for your account."
//             });

//             // Refresh 2FA status
//             refetchStatus();
//         } catch (error) {
//             toast({
//                 title: "Verification failed",
//                 description: "The verification code is invalid or has expired. Please try again.",
//                 variant: "destructive"
//             });
//         }
//     };

//     const handleDisable2FA = async () => {
//         if (!verificationToken && !recoveryCode) {
//             toast({
//                 title: "Verification required",
//                 description: "Please enter a verification code or recovery code",
//                 variant: "destructive"
//             });
//             return;
//         }

//         try {
//             await disableTwoFactor({
//                 token: useRecoveryForDisable ? undefined : verificationToken,
//                 recoveryCode: useRecoveryForDisable ? recoveryCode : undefined
//             }).unwrap();

//             setDisableDialogOpen(false);

//             toast({
//                 title: "2FA Disabled",
//                 description: "Two-factor authentication has been disabled for your account."
//             });

//             // Refresh 2FA status
//             refetchStatus();
//         } catch (error) {
//             toast({
//                 title: "Verification failed",
//                 description: "The code you entered is invalid. Please try again.",
//                 variant: "destructive"
//             });
//         }
//     };

//     // This function is missing in your PrivacySettings component
//     const handleFinishSetup = () => {
//         setSetupDialogOpen(false);
//         setSetupStep(1);

//         toast({
//             title: "2FA Setup Complete",
//             description: "Two-factor authentication has been successfully set up for your account.",
//         });

//         // Optional: Refetch 2FA status to ensure UI is up-to-date
//         refetchStatus();
//     };

//     // Helper function to download recovery codes
//     const downloadRecoveryCodes = () => {
//         if (savedRecoveryCodes.length === 0) return;

//         const text = "RECOVERY CODES - KEEP THESE SAFE\n\n" +
//             "These codes can be used to access your account if you lose your authenticator device.\n" +
//             "Each code can only be used once.\n\n" +
//             savedRecoveryCodes.join("\n");

//         const blob = new Blob([text], { type: "text/plain" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "recovery-codes.txt";
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);

//         toast({
//             title: "Recovery codes downloaded",
//             description: "Please keep these codes in a safe place."
//         });
//     };

//     // Copy recovery code to clipboard
//     const copyRecoveryCode = (code: string) => {
//         navigator.clipboard.writeText(code);
//         toast({
//             title: "Code copied",
//             description: "Recovery code copied to clipboard"
//         });
//     };

//     return (
//         <Card className="w-full border-none shadow-md bg-white dark:bg-gray-900">
//             <CardHeader className="border-b border-gray-100 dark:border-gray-800">
//                 <div className="flex items-center space-x-3">
//                     <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">
//                         <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
//                     </div>
//                     <div>
//                         <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Privacy & Security</CardTitle>
//                         <CardDescription className="text-gray-500 dark:text-gray-400">Manage your privacy and security preferences</CardDescription>
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent className="space-y-8 pt-6">
//                 {/* Privacy Settings Section */}
//                 <div className="bg-white dark:bg-gray-900 rounded-xl">
//                     <div className="flex items-center gap-3 mb-4">
//                         <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
//                             <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy Settings</h3>
//                     </div>

//                     <div className="space-y-6 pl-1 md:pl-12">
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
//                             <div className="flex items-center space-x-3 mb-2 sm:mb-0">
//                                 <div className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full">
//                                     <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="profile-visibility" className="font-medium text-gray-900 dark:text-white">Public Profile</Label>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow others to see your profile information</p>
//                                 </div>
//                             </div>
//                             <Switch
//                                 id="profile-visibility"
//                                 checked={profileVisibility}
//                                 onCheckedChange={setProfileVisibility}
//                                 className="data-[state=checked]:bg-purple-600 data-[state=checked]:dark:bg-purple-500"
//                             />
//                         </div>

//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
//                             <div className="flex items-center space-x-3 mb-2 sm:mb-0">
//                                 <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
//                                     <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="activity-tracking" className="font-medium text-gray-900 dark:text-white">Activity Tracking</Label>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow us to collect usage data to improve your experience</p>
//                                 </div>
//                             </div>
//                             <Switch
//                                 id="activity-tracking"
//                                 checked={activityTracking}
//                                 onCheckedChange={setActivityTracking}
//                                 className="data-[state=checked]:bg-purple-600 data-[state=checked]:dark:bg-purple-500"
//                             />
//                         </div>

//                         <div className="flex justify-end pt-2">
//                             <Button
//                                 variant="outline"
//                                 onClick={handleSavePrivacySettings}
//                                 disabled={isLoading}
//                                 className="px-6 py-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-900/20 font-medium rounded-lg transition-colors focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 disabled:opacity-70"
//                             >
//                                 {isLoading ? (
//                                     <div className="flex items-center">
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Saving...
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center">
//                                         <Save className="h-4 w-4 mr-2" />
//                                         Save Privacy Settings
//                                     </div>
//                                 )}
//                             </Button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Security Section */}
//                 <div className="bg-white dark:bg-gray-900 rounded-xl border-t border-gray-100 dark:border-gray-800 pt-6">
//                     <div className="flex items-center gap-3 mb-4">
//                         <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">
//                             <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
//                     </div>

//                     <div className="space-y-4 pl-1 md:pl-12">
//                         {/* Two-Factor Authentication Card */}
//                         <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
//                             <div className="flex flex-col md:flex-row md:items-center justify-between">
//                                 <div className="mb-4 md:mb-0 md:mr-6">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
//                                         <h4 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h4>

//                                         {!isStatusLoading && twoFactorStatus && (
//                                             twoFactorStatus.twoFactorEnabled ? (
//                                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
//                                                     <CheckCircle className="w-3 h-3 mr-1" />
//                                                     Enabled
//                                                 </span>
//                                             ) : (
//                                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
//                                                     <XCircle className="w-3 h-3 mr-1" />
//                                                     Disabled
//                                                 </span>
//                                             )
//                                         )}
//                                     </div>
//                                     <p className="text-sm text-gray-700 dark:text-gray-300">
//                                         Add an extra layer of security to your account by requiring both your password and a verification code from your mobile device.
//                                     </p>
//                                 </div>

//                                 {isStatusLoading ? (
//                                     <Button
//                                         disabled
//                                         className="w-full md:w-auto mt-2 md:mt-0"
//                                     >
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Loading...
//                                     </Button>
//                                 ) : twoFactorStatus?.twoFactorEnabled ? (
//                                     <Button
//                                         variant="destructive"
//                                         onClick={() => setDisableDialogOpen(true)}
//                                         className="w-full md:w-auto mt-2 md:mt-0"
//                                     >
//                                         <XCircle className="h-4 w-4 mr-2" />
//                                         Disable 2FA
//                                     </Button>
//                                 ) : (
//                                     <Button
//                                         variant="outline"
//                                         onClick={() => setSetupDialogOpen(true)}
//                                         className="w-full md:w-auto border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/20 mt-2 md:mt-0"
//                                     >
//                                         <KeyRound className="h-4 w-4 mr-2" />
//                                         Enable 2FA
//                                     </Button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Data Export Section */}
//                 <div className="bg-white dark:bg-gray-900 rounded-xl border-t border-gray-100 dark:border-gray-800 pt-6">
//                     <div className="flex items-center gap-3 mb-4">
//                         <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
//                             <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Export</h3>
//                     </div>

//                     <div className="space-y-4 pl-1 md:pl-12">
//                         <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                             <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
//                                 Download a copy of all your personal data stored in our system. The export will include your profile information,
//                                 activity history, and preferences.
//                             </p>
//                             <Button
//                                 variant="outline"
//                                 onClick={handleDownloadData} disabled={isDownloading}
//                                 className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20"
//                             >
//                                 {isDownloading ? (
//                                     <div className="flex items-center">
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Processing...
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center">
//                                         <DownloadIcon className="h-4 w-4 mr-2" />
//                                         Request Data Export
//                                     </div>
//                                 )}
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>

//             {/* 2FA Setup Dialog */}
//             <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
//                 <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
//                     <DialogHeader>
//                         <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                             <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
//                             Setup Two-Factor Authentication
//                         </DialogTitle>
//                         <DialogDescription className="text-gray-600 dark:text-gray-400">
//                             Enhance your account security with two-factor authentication
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="py-4">
//                         {setupStep === 1 && (
//                             <div className="space-y-4">
//                                 <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
//                                     <AlertTriangle className="h-4 w-4 mr-2" />
//                                     <AlertDescription>
//                                         You'll need an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy on your mobile device.
//                                     </AlertDescription>
//                                 </Alert>
//                                 <div className="flex flex-col items-center justify-center text-center">
//                                     <KeyRound className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mb-4" />
//                                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Strengthen Your Account Security</h3>
//                                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//                                         With two-factor authentication, you'll need to provide a verification code from your authenticator app each time you sign in.
//                                     </p>
//                                 </div>
//                                 <div className="flex justify-end">
//                                     <Button
//                                         onClick={handleStartSetup}
//                                         disabled={isGenerating}
//                                         className="bg-indigo-600 hover:bg-indigo-700 text-white"
//                                     >
//                                         {isGenerating ? (
//                                             <div className="flex items-center">
//                                                 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                                 Loading...
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center">
//                                                 Start Setup
//                                             </div>
//                                         )}
//                                     </Button>
//                                 </div>
//                             </div>
//                         )}

//                         {setupStep === 2 && secretData && (
//                             <div className="space-y-4">
//                                 <div className="flex flex-col items-center justify-center pb-4">
//                                     <div className="relative bg-white p-2 rounded-lg shadow-sm mx-auto mb-4">
//                                         <img src={secretData.qrCode} alt="QR Code" className="h-48 w-48" />
//                                     </div>
//                                     <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
//                                         Scan this QR code with your authenticator app or enter the setup key manually.
//                                     </p>

//                                     <div className="w-full max-w-xs">
//                                         <Label htmlFor="setup-key" className="text-sm text-gray-600 dark:text-gray-400 mb-1">
//                                             Setup Key (Manual Entry)
//                                         </Label>
//                                         <div className="flex">
//                                             <Input
//                                                 id="setup-key"
//                                                 value={secretData.secret}
//                                                 readOnly
//                                                 className="flex-1 font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//                                             />
//                                             <Button
//                                                 variant="outline"
//                                                 className="ml-2 border-gray-200 dark:border-gray-700"
//                                                 onClick={() => {
//                                                     navigator.clipboard.writeText(secretData.secret);
//                                                     toast({
//                                                         title: "Copied",
//                                                         description: "Setup key copied to clipboard"
//                                                     });
//                                                 }}
//                                             >
//                                                 <Copy className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
//                                     <Label htmlFor="verification-code" className="text-sm font-medium text-gray-900 dark:text-white mb-1">
//                                         Enter Verification Code
//                                     </Label>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
//                                         Enter the 6-digit code from your authenticator app to verify setup
//                                     </p>
//                                     <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//                                         <Input
//                                             id="verification-code"
//                                             value={verificationToken}
//                                             onChange={(e) => setVerificationToken(e.target.value)}
//                                             placeholder="123456"
//                                             className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//                                             maxLength={6}
//                                         />
//                                         <Button
//                                             onClick={handleVerifySetup}
//                                             disabled={isVerifying || !verificationToken}
//                                             className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
//                                         >
//                                             {isVerifying ? (
//                                                 <div className="flex items-center">
//                                                     <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                                     Verifying...
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex items-center">
//                                                     <CheckCircle className="h-4 w-4 mr-2" />
//                                                     Verify
//                                                 </div>
//                                             )}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {setupStep === 3 && savedRecoveryCodes.length > 0 && (
//                             <div className="space-y-4">
//                                 <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
//                                     <CheckCircle className="h-4 w-4 mr-2" />
//                                     <AlertDescription>
//                                         <AlertTitle className="font-semibold">Success!</AlertTitle>
//                                         Two-factor authentication has been enabled for your account.
//                                     </AlertDescription>
//                                 </Alert>

//                                 <div>
//                                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                                         Recovery Codes
//                                     </h3>
//                                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//                                         Save these recovery codes in a secure location. You can use them to sign in if you lose access to your authenticator app.
//                                     </p>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
//                                         {savedRecoveryCodes.map((code, index) => (
//                                             <div key={index} className="relative group">
//                                                 <div className="flex items-center p-2 font-mono text-sm bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
//                                                     {code}
//                                                     <button
//                                                         onClick={() => copyRecoveryCode(code)}
//                                                         className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                                                         aria-label="Copy code"
//                                                     >
//                                                         <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <Button
//                                         variant="outline"
//                                         onClick={downloadRecoveryCodes}
//                                         className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
//                                     >
//                                         <DownloadIcon className="h-4 w-4 mr-2" />
//                                         Download Recovery Codes
//                                     </Button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
//                         {setupStep === 1 && (
//                             <Button
//                                 variant="outline"
//                                 onClick={() => setSetupDialogOpen(false)}
//                                 className="w-full sm:w-auto border-gray-200 dark:border-gray-700"
//                             >
//                                 Cancel
//                             </Button>
//                         )}

//                         {setupStep === 2 && (
//                             <Button
//                                 variant="outline"
//                                 onClick={() => setSetupStep(1)}
//                                 className="w-full sm:w-auto border-gray-200 dark:border-gray-700"
//                             >
//                                 Back
//                             </Button>
//                         )}

//                         {setupStep === 3 && (
//                             <Button
//                                 onClick={handleFinishSetup}
//                                 className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
//                             >
//                                 Finish
//                             </Button>
//                         )}
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* 2FA Disable Dialog */}
//             <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
//                 <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
//                     <DialogHeader>
//                         <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                             <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//                             Disable Two-Factor Authentication
//                         </DialogTitle>
//                         <DialogDescription className="text-gray-600 dark:text-gray-400">
//                             Verify your identity to disable 2FA
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="py-4">
//                         <Alert className="bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 mb-4">
//                             <AlertTriangle className="h-4 w-4 mr-2" />
//                             <AlertDescription>
//                                 Warning: Disabling two-factor authentication will make your account less secure.
//                             </AlertDescription>
//                         </Alert>

//                         <Tabs defaultValue="app" className="w-full">
//                             <TabsList className="grid w-full grid-cols-2 mb-4">
//                                 <TabsTrigger
//                                     value="app"
//                                     onClick={() => setUseRecoveryForDisable(false)}
//                                 >
//                                     Authenticator
//                                 </TabsTrigger>
//                                 <TabsTrigger
//                                     value="recovery"
//                                     onClick={() => setUseRecoveryForDisable(true)}
//                                 >
//                                     Recovery Code
//                                 </TabsTrigger>
//                             </TabsList>

//                             <TabsContent value="app" className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="verification-code-disable" className="text-sm font-medium text-gray-900 dark:text-white">
//                                         Verification Code
//                                     </Label>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                                         Enter the 6-digit code from your authenticator app
//                                     </p>
//                                     <Input
//                                         id="verification-code-disable"
//                                         value={verificationToken}
//                                         onChange={(e) => setVerificationToken(e.target.value)}
//                                         placeholder="123456"
//                                         className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//                                         maxLength={6}
//                                     />
//                                 </div>
//                             </TabsContent>

//                             <TabsContent value="recovery" className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="recovery-code-disable" className="text-sm font-medium text-gray-900 dark:text-white">
//                                         Recovery Code
//                                     </Label>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                                         Enter one of your recovery codes
//                                     </p>
//                                     <Input
//                                         id="recovery-code-disable"
//                                         value={recoveryCode}
//                                         onChange={(e) => setRecoveryCode(e.target.value)}
//                                         placeholder="XXXX-XXXX-XX"
//                                         className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//                                     />
//                                 </div>
//                             </TabsContent>
//                         </Tabs>
//                     </div>

//                     <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
//                         <Button
//                             variant="outline"
//                             onClick={() => setDisableDialogOpen(false)}
//                             className="w-full sm:w-auto border-gray-200 dark:border-gray-700"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             variant="destructive"
//                             onClick={handleDisable2FA}
//                             disabled={isDisabling || (useRecoveryForDisable ? !recoveryCode : !verificationToken)}
//                             className="w-full sm:w-auto"
//                         >
//                             {isDisabling ? (
//                                 <div className="flex items-center">
//                                     <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                     Disabling...
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center">
//                                     <XCircle className="h-4 w-4 mr-2" />
//                                     Disable 2FA
//                                 </div>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </Card>
//     );
// }