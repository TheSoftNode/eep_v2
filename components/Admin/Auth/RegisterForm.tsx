"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Building, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRegisterUserMutation } from "@/Redux/apiSlices/users/adminApi";

interface RegisterFormProps {
  onSubmit: (data: { email: string; fullName: string }) => void;
  initialValues?: { email: string; fullName?: string; organization?: string };
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  initialValues = { email: "", fullName: "", organization: "" },
  onSwitchToLogin
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState<string>(initialValues.email || "");
  const [fullName, setFullName] = useState<string>(initialValues.fullName || "");
  const [organization, setOrganization] = useState<string>(initialValues.organization || "");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms and privacy policy");
      return;
    }

    clearError();

    try {
      const registrationData = {
        fullName: fullName.trim(),
        email: email.trim(),
        ...(organization.trim() && { company: organization.trim() }),
        role: 'admin' as const
      };

      await registerUser(registrationData).unwrap();

      toast({
        title: "Registration successful",
        description: "Please check your email for verification code"
      });

      onSubmit({ email: email.trim(), fullName: fullName.trim() });
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Registration failed. Please try again.";
      setError(errorMsg);

      toast({
        title: "Registration failed",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Register for Admin Access
        </h3>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Full Name
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearError();
              }}
              className={`pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent ${isError && !fullName.trim() ? "border-red-500 dark:border-red-500" : ""
                }`}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              className={`pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent ${isError && (!email.trim() || !validateEmail(email)) ? "border-red-500 dark:border-red-500" : ""
                }`}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Organization <span className="text-slate-400 dark:text-slate-500">(Optional)</span>
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="organization"
              type="text"
              placeholder="Enter your organization name"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => {
                setAgreeToTerms(checked as boolean);
                clearError();
              }}
              className={`${isError && !agreeToTerms ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
          </div>
          <div className="ml-3 text-sm">
            <Label htmlFor="terms" className="text-slate-600 dark:text-slate-400 cursor-pointer">
              I agree to the <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>
            </Label>
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3"
            >
              <p className="text-sm text-red-500 dark:text-red-400 flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-lg font-medium h-11 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Register <ShieldCheck className="h-4 w-4 ml-1" />
              </span>
            )}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have access?{" "}
            <button
              type="button"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Log in
            </button>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default RegisterForm;
