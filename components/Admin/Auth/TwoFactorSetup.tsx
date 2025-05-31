"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    KeyRound,
    CheckCircle,
    Copy,
    Download,
    AlertTriangle,
    Loader2,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
    useGenerateTwoFactorSecretMutation,
    useVerifyTwoFactorSetupMutation,
} from "@/Redux/apiSlices/users/twoFactorApi";

interface TwoFactorSetupProps {
    onComplete: (recoveryCodes: string[]) => void;
    isRequired?: boolean;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
    onComplete,
    isRequired = false
}) => {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [verificationToken, setVerificationToken] = useState("");
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

    const [generateSecret, { isLoading: isGenerating, data: secretData }] = useGenerateTwoFactorSecretMutation();
    const [verifySetup, { isLoading: isVerifying }] = useVerifyTwoFactorSetupMutation();

    const handleStartSetup = async () => {
        try {
            await generateSecret().unwrap();
            setCurrentStep(2);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate 2FA secret. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleVerifySetup = async () => {
        if (!verificationToken || verificationToken.length !== 6) {
            toast({
                title: "Invalid Code",
                description: "Please enter a valid 6-digit verification code",
                variant: "destructive"
            });
            return;
        }

        try {
            const result = await verifySetup({ token: verificationToken }).unwrap();
            setRecoveryCodes(result.recoveryCodes || []);
            setCurrentStep(3);

            toast({
                title: "2FA Enabled",
                description: "Two-factor authentication has been enabled successfully."
            });
        } catch (error) {
            toast({
                title: "Verification Failed",
                description: "The verification code is invalid or has expired. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleFinishSetup = () => {
        onComplete(recoveryCodes);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied",
            description: "Text copied to clipboard"
        });
    };

    const downloadRecoveryCodes = () => {
        const text = "RECOVERY CODES - KEEP THESE SAFE\n\n" +
            "These codes can be used to access your account if you lose your authenticator device.\n" +
            "Each code can only be used once.\n\n" +
            recoveryCodes.join("\n");

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "admin-recovery-codes.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Recovery codes downloaded",
            description: "Please keep these codes in a safe place."
        });
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-indigo-900/20 dark:to-indigo-800/10">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white text-center">
                    {isRequired ? "Setup Required" : "Setup Two-Factor Authentication"}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">
                    {isRequired
                        ? "Admin accounts require two-factor authentication for security"
                        : "Enhance your account security with 2FA"
                    }
                </p>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Introduction */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {isRequired && (
                                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        As an admin user, you must setup two-factor authentication to continue.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                    <KeyRound className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        Secure Your Admin Account
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        You'll need an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy.
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={handleStartSetup}
                                disabled={isGenerating}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Setting up...
                                    </>
                                ) : (
                                    "Start Setup"
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 2: QR Code & Verification */}
                    {currentStep === 2 && secretData && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="text-center">
                                <div className="bg-white p-4 rounded-lg shadow-sm border mx-auto inline-block mb-4">
                                    <img src={secretData.qrCode} alt="QR Code" className="h-40 w-40" />
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Scan this QR code with your authenticator app
                                </p>

                                <div className="text-left">
                                    <Label className="text-sm text-slate-600 dark:text-slate-400">
                                        Setup Key (Manual Entry)
                                    </Label>
                                    <div className="flex mt-1">
                                        <Input
                                            value={secretData.secret}
                                            readOnly
                                            className="font-mono text-xs bg-slate-50 dark:bg-slate-800"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="ml-2"
                                            onClick={() => copyToClipboard(secretData.secret)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <Label className="text-sm font-medium text-slate-900 dark:text-white">
                                    Enter Verification Code
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    Enter the 6-digit code from your authenticator app
                                </p>
                                <div className="flex gap-2">
                                    <Input
                                        value={verificationToken}
                                        onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        className="text-center tracking-wider font-mono"
                                        maxLength={6}
                                    />
                                    <Button
                                        onClick={handleVerifySetup}
                                        disabled={isVerifying || verificationToken.length !== 6}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {isVerifying ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Recovery Codes */}
                    {currentStep === 3 && recoveryCodes.length > 0 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-4"
                        >
                            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Setup Complete!</AlertTitle>
                                <AlertDescription>
                                    Two-factor authentication has been enabled for your admin account.
                                </AlertDescription>
                            </Alert>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                                    <KeyRound className="h-4 w-4 mr-2 text-indigo-500" />
                                    Recovery Codes
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                    Save these codes securely. You can use them to sign in if you lose access to your authenticator.
                                </p>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {recoveryCodes.map((code, index) => (
                                        <div
                                            key={index}
                                            className="relative group p-2 bg-slate-50 dark:bg-slate-800 rounded border font-mono text-xs text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            onClick={() => copyToClipboard(code)}
                                        >
                                            {code}
                                            <Copy className="absolute top-1 right-1 h-3 w-3 opacity-0 group-hover:opacity-100 text-slate-400" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={downloadRecoveryCodes}
                                        className="flex-1"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                    <Button
                                        onClick={handleFinishSetup}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        Continue
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TwoFactorSetup;