"use client";

import React from "react";
import { motion } from "framer-motion";
import EEPBackground from "./EEPBackground";
import WorkspaceDemo from "./WorkspaceDemo";
import { GraduationCap, Briefcase, Sparkles } from "lucide-react";
import RefinedButton from "./RefinedButton";

const GlassHero: React.FC = () => {
    // Very subtle animated gradient
    const AnimatedGradient = () => (
        <div className="absolute top-0 right-0 w-full h-full z-0 opacity-15 overflow-hidden pointer-events-none">
            <div
                className="absolute top-[15%] right-[15%] w-[55%] h-[65%] rounded-full dark:bg-gradient-to-br dark:from-indigo-600/10 dark:via-pink-500/5 dark:to-violet-600/5 bg-gradient-to-br from-indigo-600/8 via-pink-500/4 to-violet-600/5 blur-3xl"
                style={{
                    animation: "pulse-slow 20s ease-in-out infinite alternate",
                    transformOrigin: "center"
                }}
            />
        </div>
    );

    return (
        <div className="relative pt-12 md:pt-6 sm:pt-0 min-h-screen md:min-h-0 md:h-auto overflow-hidden dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Background */}
            <EEPBackground />
            <AnimatedGradient />

            {/* Very subtle grid */}
            <div className="absolute inset-0 dark:bg-grid-slate-900/[0.01] bg-grid-slate-700/[0.01] bg-[size:60px_60px] mix-blend-overlay opacity-10"></div>

            {/* Main Content - Using specific height control for tablets */}
            <div className="container relative z-10 mx-auto px-4 md:px-6 
                py-8 
                sm:py-10 
                md:py-12
                lg:py-16
                min-h-screen 
                md:min-h-0
                md:h-[700px]
                lg:min-h-screen
                lg:h-auto
                flex flex-col justify-center">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 lg:gap-8 h-full items-center">
                    {/* Left Column - More balanced for tablets */}
                    <div className="flex flex-col gap-4 md:gap-3 lg:gap-5 md:col-span-6 lg:col-span-5 pr-0 md:pr-0 lg:pr-4">
                        {/* Simple heading with better tablet sizing */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight dark:text-white text-slate-800 leading-[1.2]">
                                Build <span className="font-serif italic mr-2 text-indigo-600">Your</span>
                                <br className="hidden xs:inline" />
                                <span className="font-serif italic dark:text-white text-slate-800">Projects.</span> <span>With</span>
                                <br className="hidden xs:inline" />
                                <span className="whitespace-nowrap ml-2">AI Guidance<span className="text-pink-500">.</span></span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-base md:text-base lg:text-lg dark:text-gray-300 text-slate-600 max-w-md md:max-w-sm lg:max-w-lg leading-relaxed"
                        >
                            Accelerate your development journey with AI-assisted guidance and expert mentorship.
                            Build, learn, and grow with structured project management and real-time collaboration.
                        </motion.p>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-1"
                        >
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-50/70 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300 gap-1.5">
                                <Sparkles className="h-3 w-3 text-pink-500" />
                                <span className="line-clamp-1">AI-powered learning & industry mentorship</span>
                            </span>
                        </motion.div>

                        {/* Buttons with proper spacing for tablet */}
                        <motion.div
                            className="flex flex-row mt-1 gap-3 md:gap-2 lg:gap-4 w-full sm:w-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <div className="w-full sm:w-auto">
                                <RefinedButton
                                    href="/application"
                                    text="Join as Learner"
                                    icon={<GraduationCap className="h-3.5 w-3.5" />}
                                    variant="primary"
                                // className="w-full sm:w-auto"
                                />
                            </div>
                            <div className="w-full sm:w-auto">
                                <RefinedButton
                                    href="/business-application"
                                    text="Join as Business"
                                    icon={<Briefcase className="h-3.5 w-3.5" />}
                                    variant="secondary"
                                // className="w-full sm:w-auto"
                                />
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-2 md:mt-3 flex items-center space-x-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400"
                        >
                            <div className="flex -space-x-1">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-500"></div>
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-slate-900 bg-pink-500"></div>
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-slate-900 bg-violet-500"></div>
                            </div>
                            <span>Joined by <span className="font-medium text-slate-700 dark:text-slate-300">3,000+</span> developers</span>
                        </motion.div>
                    </div>

                    {/* Right Column - Demo with better tablet sizing */}
                    <div className="md:col-span-6 lg:col-span-7 relative mt-2 sm:mt-4 md:mt-0 flex items-center justify-center md:justify-end">
                        {/* Very subtle ring */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="h-[102%] w-[102%] rounded-full border border-indigo-500/5 dark:border-indigo-400/3"
                                style={{ animation: 'pulse-subtle 10s ease-in-out infinite' }} />
                        </div>

                        {/* Demo Container - Properly sized for tablets */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: "easeOut"
                            }}
                            className="relative z-10 w-[95%] sm:w-[90%] md:w-full max-w-[580px] lg:max-w-[650px] mx-auto md:mx-0"
                        >
                            <WorkspaceDemo />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 0.1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.15;
                        transform: scale(1.01);
                    }
                }
                
                @keyframes pulse-subtle {
                    0%, 100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.1;
                        transform: scale(1.005);
                    }
                }
                
                /* Custom breakpoint for extra small devices */
                @media (min-width: 480px) {
                    .xs\\:inline {
                        display: inline;
                    }
                }
            `}</style>
        </div>
    );
};

export default GlassHero;