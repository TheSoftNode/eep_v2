"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import AdminBackground from "@/components/Admin/Landing/Hero/AdminBackground";
import AdminHeader from "@/components/Admin/Landing/AdminHeader";
import AdminHero from "@/components/Admin/Landing/Hero/AdminHero";
import AuthModal from "@/components/Admin/Auth/AuthModal";

const AdminPage: React.FC = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("register");
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const openRegisterModal = () => {
        setAuthMode("register");
        setIsAuthModalOpen(true);
    };

    const openLoginModal = () => {
        setAuthMode("login");
        setIsAuthModalOpen(true);
    };

    const getCurrentYear = () => new Date().getFullYear();

    return (
        <div className="relative min-h-screen overflow-hidden dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Background elements */}
            <AdminBackground />

            {/* Header */}
            <AdminHeader
                isDark={isDark}
                onLogin={openLoginModal}
                onRegister={openRegisterModal}
                showHomeLink={true}
            />

            {/* Main content */}
            <main className="container relative z-10 mx-auto px-4 md:px-6 py-16 min-h-screen flex flex-col items-center justify-center">
                <AdminHero
                    onRegister={openRegisterModal}
                    onLogin={openLoginModal}
                />
            </main>

            {/* Authentication Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                setIsOpen={setIsAuthModalOpen}
                initialMode={authMode}
                setAuthMode={setAuthMode}
            />

            {/* Footer */}
            <footer className="absolute bottom-0 left-0 w-full z-20 py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        &copy; {getCurrentYear()} EEP. Powered by HitoAI Limited. All rights reserved. • Secure Admin Portal
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AdminPage;