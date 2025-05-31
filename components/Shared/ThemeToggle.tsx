"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const ThemeToggle: React.FC = () => {
    const { setTheme, theme } = useTheme();

    return (
        <motion.div
            className="flex items-center bg-slate-100/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-full p-0.5 shadow-inner relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Background indicator that slides */}
            <motion.div
                className="absolute h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-sm"
                animate={{
                    left: theme === 'light' ? '0%' : '50%',
                    right: theme === 'light' ? '50%' : '0%'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* Light mode button */}
            <motion.button
                onClick={() => setTheme('light')}
                className={`relative z-10 p-1.5 rounded-full transition-colors duration-200 ${theme === 'light'
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                whileTap={{ scale: 0.95 }}
                aria-label="Light mode"
            >
                <Sun className="h-3.5 w-3.5" />
            </motion.button>

            {/* Dark mode button */}
            <motion.button
                onClick={() => setTheme('dark')}
                className={`relative z-10 p-1.5 rounded-full transition-colors duration-200 ${theme === 'dark'
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                whileTap={{ scale: 0.95 }}
                aria-label="Dark mode"
            >
                <Moon className="h-3.5 w-3.5" />
            </motion.button>
        </motion.div>
    );
};

export default ThemeToggle;
