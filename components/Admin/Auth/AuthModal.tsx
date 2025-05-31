"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import VerificationForm from "./VerificationForm";
import TwoFactorSetup from "./TwoFactorSetup";
import TwoFactorLogin from "./TwoFactorLogin";

interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
}

type ViewType = "login" | "register" | "verification" | "2fa-setup" | "2fa-login" | "success";

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  setIsOpen,
  initialMode,
  setAuthMode
}) => {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<ViewType>(initialMode);
  const [userData, setUserData] = useState({ email: "", fullName: "", organization: "" });
  const [rememberMe, setRememberMe] = useState(false);

  // Update currentView when initialMode changes and modal is opening
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialMode);
    }
  }, [isOpen, initialMode]);

  const resetModal = () => {
    setTimeout(() => {
      setCurrentView(initialMode);
      setUserData({ email: "", fullName: "", organization: "" });
      setRememberMe(false);
    }, 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetModal();
  };

  const switchToLogin = () => {
    setCurrentView("login");
    setAuthMode("login");
  };

  const switchToRegister = () => {
    setCurrentView("register");
    setAuthMode("register");
  };

  // Handle registration success - goes to email verification
  const handleRegisterSuccess = (data: { email: string; fullName: string }) => {
    setUserData({ ...userData, ...data });
    setCurrentView("verification");
    toast({
      title: "Registration successful",
      description: "Please check your email for verification code"
    });
  };

  // Handle login that requires 2FA setup (when 2FA is not yet configured)
  const handleLoginNeeds2FASetup = (email: string, remember: boolean = false) => {
    setUserData({ ...userData, email });
    setRememberMe(remember);
    setCurrentView("2fa-setup");
  };

  // Handle email verification - admin users MUST setup 2FA
  const handleEmailVerified = () => {
    setCurrentView("2fa-setup");
    toast({
      title: "Email verified",
      description: "Now setting up two-factor authentication"
    });
  };

  // Handle login that requires 2FA
  const handleLoginNeedsTwoFactor = (email: string, remember: boolean = false) => {
    setUserData({ ...userData, email });
    setRememberMe(remember);
    setCurrentView("2fa-login");
  };

  // Handle 2FA setup completion (after registration)
  const handle2FASetupComplete = () => {
    setCurrentView("success");
    setTimeout(() => {
      handleClose();
      window.location.href = "/admin/dashboard";
    }, 2000);
  };

  // Handle 2FA login success
  const handle2FALoginSuccess = (loginData: any) => {
    // Store auth data
    localStorage.setItem('adminToken', loginData.token);
    localStorage.setItem('adminUser', JSON.stringify(loginData.user));

    setCurrentView("success");
    setTimeout(() => {
      handleClose();
      window.location.href = "/admin/dashboard";
    }, 2000);
  };

  const handleBack = () => {
    if (currentView === "verification") {
      setCurrentView(initialMode);
    } else if (currentView === "2fa-setup") {
      // Check if we came from verification (registration flow) or login flow
      if (userData.fullName) {
        setCurrentView("verification");
      } else {
        setCurrentView("login");
      }
    } else if (currentView === "2fa-login") {
      setCurrentView("login");
    }
  };

  const showBackButton = currentView !== "login" && currentView !== "register" && currentView !== "success";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 max-h-[99vh] overflow-auto bg-white dark:bg-slate-900 border-none shadow-2xl rounded-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 relative flex items-center justify-center">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="absolute left-5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-2">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">
              {currentView === "login" && "Admin Login"}
              {currentView === "register" && "Register for Access"}
              {currentView === "verification" && "Verify Email"}
              {currentView === "2fa-setup" && "Setup Two-Factor Auth"}
              {currentView === "2fa-login" && "Two-Factor Authentication"}
              {currentView === "success" && "Success"}
            </h2>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentView === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LoginForm
                onSuccess={handle2FALoginSuccess}
                onNeedsTwoFactor={handleLoginNeedsTwoFactor}
                onSwitchToRegister={switchToRegister}
                onNeedsTwoFactorSetup={handleLoginNeeds2FASetup}
              />
            </motion.div>
          )}

          {currentView === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm
                onSubmit={handleRegisterSuccess}
                initialValues={userData}
                onSwitchToLogin={switchToLogin}
              />
            </motion.div>
          )}

          {currentView === "verification" && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <VerificationForm
                email={userData.email}
                onComplete={handleEmailVerified}
              />
            </motion.div>
          )}

          {currentView === "2fa-setup" && (
            <motion.div
              key="2fa-setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TwoFactorSetup
                onComplete={handle2FASetupComplete}
                isRequired={true}
              />
            </motion.div>
          )}

          {currentView === "2fa-login" && (
            <motion.div
              key="2fa-login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TwoFactorLogin
                email={userData.email}
                rememberMe={rememberMe}
                onSuccess={handle2FALoginSuccess}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentView === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Welcome to Admin Dashboard!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Redirecting you to the dashboard...
              </p>

              <div className="mt-6 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500 dark:bg-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
