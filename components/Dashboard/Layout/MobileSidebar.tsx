"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import EEPSidebar from "./EEPSidebar";

interface MobileSidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentDate: string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
    open,
    setOpen,
    currentDate
}) => {
    const { isAdmin, isMentor } = useAuth();

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={() => setOpen(false)}
                    />

                    {/* Sidebar content */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        className="fixed top-0 left-0 bottom-0 z-50 w-[280px] overflow-hidden bg-white dark:bg-[#1e1b4b] shadow-xl"
                    >
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">EEP Dashboard Menu</p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <EEPSidebar
                                    isCollapsed={false}
                                    isMobile={true}
                                    onToggle={() => setOpen(false)}
                                    isAdmin={isAdmin()}
                                    isMentor={isMentor()}
                                    currentDate={currentDate}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;