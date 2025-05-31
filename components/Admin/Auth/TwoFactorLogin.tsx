"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    KeyRound,
    RefreshCw,
    ArrowRight,
    Loader2,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useVerifyTwoFactorLoginMutation } from "@/Redux/apiSlices/users/twoFactorApi";

interface TwoFactorLoginProps {
    email: string;
    rememberMe?: boolean;
    onSuccess: (data: any) => void;
    onBack: () => void;
}

const TwoFactorLogin: React.FC<TwoFactorLoginProps> = ({
    email,
    rememberMe = false,
    onSuccess,
    onBack
}) => {
    const { toast } = useToast();
    const [verificationToken, setVerificationToken] = useState("");
    const [recoveryCode, setRecoveryCode] = useState("");
    const [useRecovery, setUseRecovery] = useState(false);
    const [resendCounter, setResendCounter] = useState(0);

    const [verifyLogin, { isLoading }] = useVerifyTwoFactorLoginMutation();

    const handleVerify = async () => {
        if (useRecovery) {
            if (!recoveryCode.trim()) {
                toast({
                    title: "Recovery code required",
                    description: "Please enter a recovery code",
                    variant: "destructive"
                });
                return;
            }
        } else {
            if (!verificationToken || verificationToken.length !== 6) {
                toast({
                    title: "Verification code required",
                    description: "Please enter a valid 6-digit verification code",
                    variant: "destructive"
                });
                return;
            }
        }

        try {
            const result = await verifyLogin({
                email,
                token: useRecovery ? undefined : verificationToken,
                recoveryCode: useRecovery ? recoveryCode : undefined,
                rememberMe
            }).unwrap();

            toast({
                title: "Login successful",
                description: "Welcome to the admin dashboard"
            });

            onSuccess(result);
        } catch (error: any) {
            toast({
                title: "Verification failed",
                description: error?.data?.message || "Invalid code. Please try again.",
                variant: "destructive"
            });

            // Clear the inputs on error
            setVerificationToken("");
            setRecoveryCode("");
        }
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
                    Two-Factor Authentication
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">
                    Verify your identity to access the admin dashboard
                </p>
            </div>

            <div className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="mb-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Signing in as: <span className="font-medium text-indigo-600 dark:text-indigo-400">{email}</span>
                        </p>
                    </div>

                    <Tabs defaultValue="app" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger
                                value="app"
                                onClick={() => setUseRecovery(false)}
                            >
                                <KeyRound className="h-4 w-4 mr-2" />
                                Authenticator
                            </TabsTrigger>
                            <TabsTrigger
                                value="recovery"
                                onClick={() => setUseRecovery(true)}
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                Recovery Code
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="app" className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-slate-900 dark:text-white">
                                    Verification Code
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    Enter the 6-digit code from your authenticator app
                                </p>
                                <Input
                                    value={verificationToken}
                                    onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    className="text-center tracking-wider font-mono"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="recovery" className="space-y-4">
                            <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Recovery codes are single-use. Once used, they cannot be used again.
                                </AlertDescription>
                            </Alert>

                            <div>
                                <Label className="text-sm font-medium text-slate-900 dark:text-white">
                                    Recovery Code
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    Enter one of your recovery codes
                                </p>
                                <Input
                                    value={recoveryCode}
                                    onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                                    placeholder="XXXX-XXXX-XX"
                                    className="font-mono"
                                    autoFocus
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="flex-1"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={
                                isLoading ||
                                (useRecovery ? !recoveryCode.trim() : verificationToken.length !== 6)
                            }
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TwoFactorLogin;