"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "./AdminSidebar";

interface AdminMobileSidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentDate: string;
}

const AdminMobileSidebar: React.FC<AdminMobileSidebarProps> = ({
    open,
    setOpen,
    currentDate
}) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Enhanced Backdrop with blur effect */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[3px]"
                        onClick={() => setOpen(false)}
                    />

                    {/* Sidebar content with better animation and styling */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                            damping: 20
                        }}
                        className="fixed top-0 left-0 bottom-0 z-50 w-[290px] overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-[#0A0E1F] border-r border-slate-200/70 dark:border-slate-800/50 shadow-2xl"
                    >
                        <div className="h-full flex flex-col">
                            {/* Enhanced header with gradient and icon */}
                            <div className="flex justify-between items-center px-4 py-4 bg-gradient-to-r from-indigo-50/80 to-indigo-50/40 dark:from-indigo-950/40 dark:to-indigo-950/20 border-b border-slate-200/70 dark:border-slate-800/50">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 mr-3">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Admin Dashboard</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Control Center</p>
                                    </div>
                                </div>

                                {/* Close button with improved hover effect */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Badge indicator for admin status */}
                            <div className="px-4 py-2 border-b border-slate-200/70 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/60 to-slate-50/40 dark:from-slate-900/60 dark:to-slate-900/40">
                                <Badge className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-none shadow-sm shadow-indigo-500/20 text-white font-medium px-2.5 py-1">
                                    <Menu className="h-3.5 w-3.5 mr-1.5" />
                                    Admin Navigation
                                </Badge>
                            </div>

                            {/* Sidebar content with subtle shadow */}
                            <div className="flex-1 overflow-y-auto relative">
                                {/* Subtle top shadow for better scrolling indication */}
                                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-slate-200/30 to-transparent dark:from-slate-800/30 z-10 pointer-events-none"></div>

                                <AdminSidebar
                                    isCollapsed={false}
                                    isMobile={true}
                                    onToggle={() => setOpen(false)}
                                    currentDate={currentDate}
                                />

                                {/* Subtle bottom shadow for better scrolling indication */}
                                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-slate-200/30 to-transparent dark:from-slate-800/30 z-10 pointer-events-none"></div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AdminMobileSidebar;