"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useVerifyEmailMutation } from "@/Redux/apiSlices/users/authApi";

interface VerificationFormProps {
  email: string;
  onComplete: () => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ email, onComplete }) => {
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [counter, setCounter] = useState<number>(60);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // References for digit inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // API mutation
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  // Initialize array of 6 null elements for our 6 inputs
  useEffect(() => {
    inputRefs.current = Array(6).fill(null).map((_, i) => inputRefs.current[i] || null);
  }, []);

  // Start countdown when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  const clearError = () => {
    if (isError) {
      setIsError(false);
      setErrorMessage("");
    }
  };

  const setError = (message: string) => {
    setIsError(true);
    setErrorMessage(message);
  };

  // Handle input of verification code digits
  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digits
    if (!/^\d?$/.test(value)) return;

    // Update the verification code
    const newCode = verificationCode.split('');
    newCode[index] = value;
    setVerificationCode(newCode.join(''));

    // Clear any previous errors
    clearError();

    // If a digit was entered (not cleared) and we're not on the last input, focus the next one
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      // If current input is empty and we're not on the first input, focus the previous one
      if (!verificationCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle pasting the code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // If pasted data is 6 digits, fill the inputs
    if (/^\d{6}$/.test(pastedData)) {
      setVerificationCode(pastedData);

      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      setError("Please enter all 6 digits of the verification code");
      return;
    }

    clearError();

    try {
      await verifyEmail({
        email,
        verificationCode
      }).unwrap();

      // Show success animation
      setIsSuccess(true);

      toast({
        title: "Email verified successfully",
        description: "Setting up two-factor authentication..."
      });

      // Complete verification after brief delay
      setTimeout(() => {
        onComplete();
      }, 1500);

    } catch (error: any) {
      const errorMsg = error?.data?.message || "Invalid verification code. Please try again.";
      setError(errorMsg);
      setVerificationCode("");

      // Focus first input
      inputRefs.current[0]?.focus();

      toast({
        title: "Verification failed",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  const resendCode = async () => {
    if (counter > 0) return;

    // Reset counter
    setCounter(60);
    clearError();

    // Start new countdown
    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    toast({
      title: "Code resent",
      description: "A new verification code has been sent to your email"
    });
  };

  return (
    <div className="p-6">
      <div className="mb-5">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Verify Your Email
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          We've sent a 6-digit verification code to <span className="font-medium text-indigo-600 dark:text-indigo-400">{email}</span>
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
              Verification Code
            </label>

            {/* Digit input fields for verification code */}
            <div className="flex justify-between gap-2">
              {Array(6).fill(null).map((_, index) => (
                <input
                  key={index}
                  ref={el => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={verificationCode[index] || ''}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-10 h-12 text-center text-lg font-mono border rounded-lg dark:bg-slate-800 bg-slate-50
                    ${isError ? 'border-red-500 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={`Digit ${index + 1}`}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Error message */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 mt-2"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className={`text-xs flex items-center gap-1 ${counter > 0 || isLoading
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                }`}
              onClick={counter > 0 || isLoading ? undefined : resendCode}
              disabled={counter > 0 || isLoading}
            >
              {counter > 0 ? (
                <>
                  <span>Resend code in {counter}s</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  <span>Resend code</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-lg font-medium h-11 flex items-center justify-center gap-2 transition-all"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Verifying...
                </span>
              ) : (
                <>
                  <span>Verify and Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
            After verification, you'll be prompted to set up
            <span className="font-medium"> two-factor authentication</span> for enhanced security.
          </p>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Email Verified Successfully!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Setting up two-factor authentication...
          </p>

          {/* Loading bar animation */}
          <div className="mt-6 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 dark:bg-green-400"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VerificationForm;