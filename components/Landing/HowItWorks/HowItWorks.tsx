"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    Code,
    RefreshCw,
    Layers,
    ShieldCheck,
    Clock,
    ArrowRight,
    Users,
    Lightbulb,
    FileCode,
    BrainCircuit,
    MessageSquare,
    Calendar,
    CheckSquare,
    UserPlus,
    Sparkles,
    GraduationCap,
    Building
} from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HowItWorksSection: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [demoState, setDemoState] = useState<"idle" | "processing" | "success">("idle");
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Process steps data
    const steps = [
        {
            id: "apply",
            title: "Apply and Get Matched",
            description: "Submit your profile as a learner or business and get matched with the right team",
            icon: <UserPlus size={22} />,
            color: "indigo",
            demo: {
                title: "Application Process",
                subtitle: "Submit profile and get matched with the right team",
                mainIcon: <UserPlus className="h-5 w-5" />,
                configs: [
                    { label: "Profile", value: "Full-stack Developer", icon: <GraduationCap className="h-3 w-3" /> },
                    { label: "Experience", value: "2 years", icon: <Calendar className="h-3 w-3" /> },
                    { label: "Interest", value: "E-commerce, FinTech", icon: <Lightbulb className="h-3 w-3" /> },
                    { label: "Availability", value: "15-20 hrs/week", icon: <Clock className="h-3 w-3" /> }
                ],
                processingText: "Analyzing your profile and finding optimal matches",
                successText: "Profile approved! Perfect match found for your skills"
            }
        },
        {
            id: "onboard",
            title: "Onboarding & Setup",
            description: "Connect to your personalized development environment and set up tools",
            icon: <Layers size={22} />,
            color: "blue",
            demo: {
                title: "Workspace Setup",
                subtitle: "Configure your personalized development environment",
                mainIcon: <Layers className="h-5 w-5" />,
                configs: [
                    { label: "Project", value: "E-Commerce Platform", icon: <FileCode className="h-3 w-3" /> },
                    { label: "Stack", value: "React, Node, MongoDB", icon: <Code className="h-3 w-3" /> },
                    { label: "Team Size", value: "5 developers, 2 mentors", icon: <Users className="h-3 w-3" /> },
                    { label: "Timeline", value: "12-week development", icon: <Calendar className="h-3 w-3" /> }
                ],
                processingText: "Setting up your personalized workspace and tools",
                successText: "Workspace ready! All tools configured for your project"
            }
        },
        {
            id: "mentor",
            title: "Mentor Guidance",
            description: "Receive expert guidance and feedback from industry professionals",
            icon: <MessageSquare size={22} />,
            color: "violet",
            demo: {
                title: "Mentor Connection",
                subtitle: "Connect with experts tailored to your project needs",
                mainIcon: <MessageSquare className="h-5 w-5" />,
                configs: [
                    { label: "Mentors", value: "3 experts available", icon: <UserPlus className="h-3 w-3" /> },
                    { label: "Specialties", value: "UI/UX, Architecture, Testing", icon: <Sparkles className="h-3 w-3" /> },
                    { label: "Sessions", value: "Bi-weekly reviews", icon: <Calendar className="h-3 w-3" /> },
                    { label: "Support", value: "24/7 chat assistance", icon: <MessageSquare className="h-3 w-3" /> }
                ],
                processingText: "Connecting you with specialized mentors for your project",
                successText: "Mentor team assigned and ready to guide your development"
            }
        },
        {
            id: "develop",
            title: "AI-Assisted Development",
            description: "Build your project with advanced AI tools and real-time feedback",
            icon: <BrainCircuit size={22} />,
            color: "pink",
            demo: {
                title: "Smart Development",
                subtitle: "Code with AI assistance and intelligent feedback",
                mainIcon: <BrainCircuit className="h-5 w-5" />,
                configs: [
                    { label: "AI Assistance", value: "Code recommendations", icon: <Code className="h-3 w-3" /> },
                    { label: "Learning Path", value: "Adaptive curriculum", icon: <GraduationCap className="h-3 w-3" /> },
                    { label: "Analytics", value: "Real-time performance", icon: <Sparkles className="h-3 w-3" /> },
                    { label: "Challenges", value: "Personalized tasks", icon: <CheckSquare className="h-3 w-3" /> }
                ],
                processingText: "Calibrating AI assistance to your coding style and project",
                successText: "AI assistant active and providing intelligent guidance"
            }
        },
        {
            id: "collaborate",
            title: "Team Collaboration",
            description: "Work seamlessly with your team to bring your project to life",
            icon: <Users size={22} />,
            color: "green",
            demo: {
                title: "Team Workspace",
                subtitle: "Collaborate effectively with your development team",
                mainIcon: <Users className="h-5 w-5" />,
                configs: [
                    { label: "Communication", value: "Integrated channels", icon: <MessageSquare className="h-3 w-3" /> },
                    { label: "Tasks", value: "Agile board with 28 items", icon: <CheckSquare className="h-3 w-3" /> },
                    { label: "Meetings", value: "Daily standup at 10AM", icon: <Calendar className="h-3 w-3" /> },
                    { label: "Resources", value: "Shared library access", icon: <FileCode className="h-3 w-3" /> }
                ],
                processingText: "Synchronizing team communications & project assets",
                successText: "Team workspace synchronized and collaboration ready"
            }
        }
    ];

    // Handle auto cycling of demo states
    useEffect(() => {
        if (!isAutoPlaying) return;

        const cycleDemoStates = () => {
            // Start processing
            setDemoState("processing");

            // After 3 seconds, change to success
            timeoutRef.current = setTimeout(() => {
                setDemoState("success");

                // After 3 more seconds, reset to idle and move to next step
                timeoutRef.current = setTimeout(() => {
                    setDemoState("idle");
                    setActiveStep((prev) => (prev + 1) % steps.length);
                }, 3000);
            }, 3000);
        };

        // Start cycle with a slight delay
        autoPlayTimeoutRef.current = setTimeout(cycleDemoStates, 1500);

        // Clean up timeouts on unmount or when disabling autoplay
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        };
    }, [activeStep, isAutoPlaying, steps.length]);

    // Handle manual step selection
    const handleStepClick = (index: number) => {
        // Clear any existing timeouts
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

        // Set autoplay to false when manually selecting steps
        setIsAutoPlaying(false);
        setActiveStep(index);
        setDemoState("idle");
    };

    // Toggle autoplay
    const toggleAutoplay = () => {
        setIsAutoPlaying(!isAutoPlaying);
    };

    const colorClasses = {
        indigo: {
            primary: "text-indigo-600 dark:text-indigo-400",
            secondary: "text-indigo-500 dark:text-indigo-300",
            gradient: "from-indigo-600 to-indigo-500",
            softBg: "bg-indigo-50 dark:bg-indigo-900/30",
            borderAccent: "border-indigo-200 dark:border-indigo-800",
            activeBg: "bg-indigo-500/10 dark:bg-indigo-500/20"
        },
        blue: {
            primary: "text-blue-600 dark:text-blue-400",
            secondary: "text-blue-500 dark:text-blue-300",
            gradient: "from-blue-600 to-blue-500",
            softBg: "bg-blue-50 dark:bg-blue-900/30",
            borderAccent: "border-blue-200 dark:border-blue-800",
            activeBg: "bg-blue-500/10 dark:bg-blue-500/20"
        },
        violet: {
            primary: "text-violet-600 dark:text-violet-400",
            secondary: "text-violet-500 dark:text-violet-300",
            gradient: "from-violet-600 to-violet-500",
            softBg: "bg-violet-50 dark:bg-violet-900/30",
            borderAccent: "border-violet-200 dark:border-violet-800",
            activeBg: "bg-violet-500/10 dark:bg-violet-500/20"
        },
        pink: {
            primary: "text-pink-600 dark:text-pink-400",
            secondary: "text-pink-500 dark:text-pink-300",
            gradient: "from-pink-600 to-pink-500",
            softBg: "bg-pink-50 dark:bg-pink-900/30",
            borderAccent: "border-pink-200 dark:border-pink-800",
            activeBg: "bg-pink-500/10 dark:bg-pink-500/20"
        },
        green: {
            primary: "text-emerald-600 dark:text-emerald-400",
            secondary: "text-emerald-500 dark:text-emerald-300",
            gradient: "from-emerald-600 to-emerald-500",
            softBg: "bg-emerald-50 dark:bg-emerald-900/30",
            borderAccent: "border-emerald-200 dark:border-emerald-800",
            activeBg: "bg-emerald-500/10 dark:bg-emerald-500/20"
        }
    };

    const step = steps[activeStep];
    const colors = colorClasses[step.color as keyof typeof colorClasses];

    return (
        <section id="how-it-works" className="py-12 lg:py-20 relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/90">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Dot pattern */}
                <div className="absolute inset-0 dark:bg-grid-slate-700/[0.05] bg-grid-slate-200/[0.2] bg-[size:24px_24px]"></div>

                {/* Gradient blobs */}
                <div
                    className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/5 dark:from-indigo-500/10 dark:to-blue-500/5 blur-3xl"
                    style={{
                        transform: `translate(${Math.sin(activeStep * 0.5) * 20}px, ${Math.cos(activeStep * 0.5) * 20}px)`
                    }}
                ></div>
                <div
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/5 dark:from-pink-500/10 dark:to-purple-500/5 blur-3xl"
                    style={{
                        transform: `translate(${Math.cos(activeStep * 0.5) * 20}px, ${Math.sin(activeStep * 0.5) * 20}px)`
                    }}
                ></div>

                {/* Animated light beam */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-16 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent dark:via-indigo-500/5 blur-2xl"
                    style={{ transform: `translate(-50%, -50%) rotate(${activeStep * 30}deg)` }}
                ></div>

                {/* Digital circuit lines */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.4" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M200,200 L400,200 L400,400 L600,400 L600,200 L800,200 M300,800 L300,600 L500,600 L500,800 L700,800"
                        stroke="url(#circuitGradient)"
                        strokeWidth="2"
                        fill="none"
                    />
                    <circle cx="200" cy="200" r="5" fill="#4F46E5" />
                    <circle cx="400" cy="200" r="5" fill="#4F46E5" />
                    <circle cx="400" cy="400" r="5" fill="#4F46E5" />
                    <circle cx="600" cy="400" r="5" fill="#4F46E5" />
                    <circle cx="600" cy="200" r="5" fill="#4F46E5" />
                    <circle cx="800" cy="200" r="5" fill="#4F46E5" />
                    <circle cx="300" cy="800" r="5" fill="#4F46E5" />
                    <circle cx="300" cy="600" r="5" fill="#4F46E5" />
                    <circle cx="500" cy="600" r="5" fill="#4F46E5" />
                    <circle cx="500" cy="800" r="5" fill="#4F46E5" />
                    <circle cx="700" cy="800" r="5" fill="#4F46E5" />
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section title */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="relative inline-block">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
                            The EEP Journey
                        </span>
                        <div className="absolute -bottom-2 left-1/2 w-12 h-1 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"></div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">
                        How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">It Works</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        From application to project completion, follow our streamlined process to accelerate your development journey with expert guidance and collaboration.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
                    {/* Step selector - vertical on desktop, horizontal on mobile */}
                    <div className="lg:col-span-4 order-1 lg:order-none">
                        <div className="hidden lg:flex flex-col space-y-2.5">
                            {steps.map((step, idx) => {
                                const stepColors = colorClasses[step.color as keyof typeof colorClasses];
                                const isActive = idx === activeStep;

                                return (
                                    <motion.button
                                        key={step.id}
                                        onClick={() => handleStepClick(idx)}
                                        className={`relative text-left flex items-start p-3.5 rounded-xl transition-all duration-300 ${isActive
                                            ? `border-1 border-b-2 ${stepColors.borderAccent} bg-gradient-to-br from-white to-${step.color}-50/30 dark:from-slate-800/90 dark:to-${step.color}-900/20 shadow-sm backdrop-blur-sm`
                                            : 'border border-slate-200/70 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800/50'
                                            }`}
                                        style={{
                                            borderRadius: '14px',
                                            boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.08)' : 'none',
                                            borderImage: isActive ? 'linear-gradient(to right, #4F46E5, #2563EB) 1' : 'none',
                                        }}
                                        initial={false}
                                        animate={{
                                            y: isActive ? 0 : 0,
                                            scale: isActive ? 1 : 1
                                        }}
                                        whileHover={{
                                            x: 4,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {/* Step number and icon */}
                                        <div className="mr-3.5 flex-shrink-0">
                                            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${isActive
                                                ? `bg-gradient-to-br ${stepColors.gradient} text-white shadow-sm`
                                                : `bg-slate-100 dark:bg-slate-800 ${stepColors.primary}`
                                                }`}
                                                style={{ borderRadius: '10px' }}>
                                                {isActive ? (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {step.icon}
                                                    </motion.div>
                                                ) : (
                                                    <span className="font-semibold">{idx + 1}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Step title and description */}
                                        <div>
                                            <h3 className={`font-medium text-base mb-0.5 ${isActive ? stepColors.primary : 'text-slate-700 dark:text-slate-200'
                                                }`}>
                                                {step.title}
                                            </h3>
                                            <p className={`text-sm ${isActive ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                                                }`}>
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <motion.div
                                                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-gradient-to-b ${stepColors.gradient}`}
                                                layoutId="stepIndicator"
                                                style={{
                                                    borderRadius: '0 4px 4px 0',
                                                    boxShadow: '0 0 10px rgba(79, 70, 229, 0.3)'
                                                }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Mobile step selector - horizontal pills */}
                        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 w-full gap-3 overflow-x-auto pb-3 space-x-2 mb-4">
                            {steps.map((step, idx) => {
                                const stepColors = colorClasses[step.color as keyof typeof colorClasses];
                                const isActive = idx === activeStep;

                                return (
                                    <motion.button
                                        key={step.id}
                                        onClick={() => handleStepClick(idx)}
                                        className={`flex-shrink-0 flex items-center rounded-full px-4 py-3 transition-all ${isActive
                                            ? `bg-gradient-to-r ${stepColors.gradient} text-white shadow-md`
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                            }`}
                                        style={{
                                            boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none'
                                        }}
                                    >
                                        <span className="mr-2 h-4 w-4">{step.icon}</span>
                                        <span className="whitespace-nowrap font-medium text-xs">{step.title}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Interactive Demo */}
                    <div className="lg:col-span-8 order-2">
                        <Card className="overflow-hidden border-slate-200/70 dark:border-slate-700/50 shadow-lg shadow-slate-200/30 dark:shadow-none rounded-2xl backdrop-blur-sm"
                            style={{
                                borderRadius: '16px',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderImage: 'linear-gradient(120deg, rgba(79, 70, 229, 0.3), rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.3)) 1',
                                boxShadow: '0 10px 30px -15px rgba(79, 70, 229, 0.08), 0 0 0 1px rgba(79, 70, 229, 0.05)'
                            }}>
                            {/* Demo header */}
                            <CardHeader className="p-4 border-b border-slate-200/70 dark:border-slate-700/50 bg-gradient-to-r from-white to-slate-50/80 dark:from-slate-800/90 dark:to-slate-900/80 flex flex-row items-center justify-between space-y-0"
                                style={{
                                    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
                                    borderBottomRightRadius: '0',
                                    borderBottomLeftRadius: '0',
                                }}>
                                <div className="flex items-center">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 text-white shadow-md bg-gradient-to-br ${colors.gradient}`}
                                        style={{
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 10px -3px rgba(79, 70, 229, 0.3)'
                                        }}>
                                        {step.demo.mainIcon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                            {step.demo.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {step.demo.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center bg-slate-100/70 dark:bg-slate-800/50 rounded-full p-1">
                                        <button
                                            onClick={toggleAutoplay}
                                            className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors ${isAutoPlaying
                                                ? 'bg-indigo-500 text-white'
                                                : 'text-slate-500 dark:text-slate-400'
                                                }`}
                                            title={isAutoPlaying ? "Pause demo" : "Auto-play demo"}
                                            style={{
                                                boxShadow: isAutoPlaying ? '0 2px 5px rgba(79, 70, 229, 0.2)' : 'none'
                                            }}
                                        >
                                            {isAutoPlaying ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="6" y="4" width="4" height="16"></rect>
                                                    <rect x="14" y="4" width="4" height="16"></rect>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200/70 dark:border-green-800/30 flex items-center gap-1 px-2.5"
                                        style={{
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
                                        }}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        <span className="text-xs">Live Demo</span>
                                    </Badge>
                                </div>
                            </CardHeader>

                            {/* Demo content */}
                            <CardContent className="p-0">
                                <AnimatePresence mode="wait">
                                    {demoState === "idle" && (
                                        <motion.div
                                            key="idle"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-4"
                                        >
                                            <div className="rounded-lg border border-slate-200/70 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/20 p-4"
                                                style={{
                                                    borderRadius: '12px',
                                                    borderImage: 'linear-gradient(140deg, rgba(226, 232, 240, 0.6), rgba(148, 163, 184, 0.1)) 1',
                                                    boxShadow: 'rgba(148, 163, 184, 0.05) 0px 4px 12px'
                                                }}>
                                                <div className="flex items-start">
                                                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center mr-4 text-white shadow-md bg-gradient-to-br ${colors.gradient}`}
                                                        style={{
                                                            borderRadius: '10px',
                                                            boxShadow: '0 6px 12px -5px rgba(79, 70, 229, 0.3)'
                                                        }}>
                                                        {step.demo.mainIcon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`font-medium ${colors.primary} text-lg mb-1`}>
                                                            {step.demo.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                                                            {step.demo.subtitle}
                                                        </p>

                                                        <div className="grid grid-cols-2 gap-3 p-3 mb-4 rounded-lg bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/30"
                                                            style={{
                                                                borderRadius: '10px',
                                                                boxShadow: 'inset 0 1px 2px rgba(148, 163, 184, 0.05)'
                                                            }}>
                                                            {step.demo.configs.map((config, i) => (
                                                                <div key={i} className="flex flex-col">
                                                                    <div className="flex items-center mb-1">
                                                                        <span className={`mr-1.5 ${colors.primary}`}>{config.icon}</span>
                                                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{config.label}</span>
                                                                    </div>
                                                                    <span className="text-sm text-slate-700 dark:text-slate-200 font-medium pl-5">{config.value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5 px-1">
                                                    <span>Status</span>
                                                    <span className={colors.primary}>Ready to start</span>
                                                </div>

                                                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700/40 overflow-hidden mb-3.5">
                                                    <motion.div
                                                        className={`h-full bg-gradient-to-r ${colors.gradient}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 1.2 }}
                                                        style={{
                                                            boxShadow: '0 0 8px rgba(79, 70, 229, 0.3)'
                                                        }}
                                                    />
                                                </div>

                                                <Button
                                                    className={`w-full py-2 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-md flex items-center justify-center gap-1.5`}
                                                    onClick={() => {
                                                        setDemoState("processing");
                                                        setIsAutoPlaying(false);
                                                        timeoutRef.current = setTimeout(() => {
                                                            setDemoState("success");
                                                        }, 3000);
                                                    }}
                                                    style={{
                                                        borderRadius: '10px',
                                                        boxShadow: '0 4px 12px -2px rgba(79, 70, 229, 0.3)'
                                                    }}
                                                >
                                                    <span>Start {step.id} process</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {demoState === "processing" && (
                                        <motion.div
                                            key="processing"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-4"
                                        >
                                            <div className="rounded-lg border border-slate-200/70 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/20 p-4"
                                                style={{
                                                    borderRadius: '12px',
                                                    borderImage: 'linear-gradient(140deg, rgba(226, 232, 240, 0.6), rgba(148, 163, 184, 0.1)) 1',
                                                    boxShadow: 'rgba(148, 163, 184, 0.05) 0px 4px 12px'
                                                }}>
                                                <div className="flex items-start mb-4">
                                                    <div className="relative w-11 h-11 rounded-lg bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center mr-4 border border-slate-200/70 dark:border-slate-700/50 shadow-sm"
                                                        style={{
                                                            borderRadius: '10px'
                                                        }}>
                                                        <motion.div
                                                            className="absolute inset-0 rounded-lg border-2 border-transparent"
                                                            style={{
                                                                borderTopColor: step.color === "indigo" ? "#4F46E5" :
                                                                    step.color === "blue" ? "#2563EB" :
                                                                        step.color === "violet" ? "#7C3AED" :
                                                                            step.color === "pink" ? "#DB2777" : "#10B981",
                                                                borderRightColor: "transparent",
                                                                borderBottomColor: "transparent",
                                                                borderLeftColor: "transparent",
                                                                borderRadius: '10px'
                                                            }}
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                        />
                                                        <RefreshCw className={`h-5 w-5 ${colors.primary}`} />
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-medium ${colors.primary} text-lg mb-1`}>
                                                            Processing
                                                        </h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                                            {step.demo.processingText}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Processing animation */}
                                                <div className="rounded-lg bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/30 p-3.5 mb-3.5"
                                                    style={{
                                                        borderRadius: '10px',
                                                        boxShadow: 'inset 0 1px 2px rgba(148, 163, 184, 0.05)'
                                                    }}>
                                                    <div className="flex items-center justify-between mb-2.5">
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                                                            <span className="text-sm text-slate-600 dark:text-slate-300">Processing steps</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse mr-2"></div>
                                                            <span className="text-xs text-amber-500 dark:text-amber-400">In progress</span>
                                                        </div>
                                                    </div>

                                                    {/* Step progress indicators */}
                                                    <div className="space-y-2.5">
                                                        {["Initializing", "Loading resources", "Analyzing data", "Finalizing"].map((processStep, i) => {
                                                            // Determine if this step is active, completed, or pending
                                                            const isActive = i === 1;
                                                            const isCompleted = i < 1;
                                                            const isPending = i > 1;

                                                            return (
                                                                <div key={processStep} className="flex items-center">
                                                                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${isCompleted
                                                                        ? `bg-green-500 text-white`
                                                                        : isActive
                                                                            ? `bg-gradient-to-r ${colors.gradient} text-white animate-pulse`
                                                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                                                                        }`}
                                                                        style={{
                                                                            boxShadow: isActive ? '0 2px 5px rgba(79, 70, 229, 0.2)' : 'none'
                                                                        }}>
                                                                        {isCompleted ? (
                                                                            <Check className="h-3.5 w-3.5" />
                                                                        ) : (
                                                                            <span className="text-xs">{i + 1}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center">
                                                                            <span className={`text-sm ${isCompleted
                                                                                ? 'text-green-600 dark:text-green-400 font-medium'
                                                                                : isActive
                                                                                    ? colors.primary
                                                                                    : 'text-slate-500 dark:text-slate-400'
                                                                                }`}>{processStep}</span>

                                                                            {isActive && (
                                                                                <div className="ml-2 relative w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                                    <motion.div
                                                                                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.gradient}`}
                                                                                        animate={{
                                                                                            width: ["0%", "40%", "60%", "75%", "90%"]
                                                                                        }}
                                                                                        transition={{
                                                                                            duration: 3,
                                                                                            times: [0, 0.25, 0.5, 0.75, 1],
                                                                                            ease: "easeInOut"
                                                                                        }}
                                                                                        style={{
                                                                                            boxShadow: '0 0 8px rgba(79, 70, 229, 0.2)'
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {isActive && (
                                                                            <div className="flex flex-wrap mt-2 gap-2">
                                                                                {["Validating", "Optimizing", "Configuring"].map((subStep, j) => (
                                                                                    <span
                                                                                        key={subStep}
                                                                                        className={`inline-flex items-center text-xs py-1 px-2 rounded-full ${colors.softBg} ${colors.primary} ${j === 0 ? "animate-pulse" : ""}`}
                                                                                        style={{
                                                                                            boxShadow: '0 1px 2px rgba(79, 70, 229, 0.1)'
                                                                                        }}
                                                                                    >
                                                                                        {subStep}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Security & timing info */}
                                                <div className="flex items-center justify-between mb-2.5 text-xs text-slate-500 dark:text-slate-400">
                                                    <div className="flex items-center space-x-1">
                                                        <ShieldCheck className="h-3.5 w-3.5" />
                                                        <span>Secure processing</span>
                                                    </div>

                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>Estimated time: ~30s</span>
                                                    </div>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="relative w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
                                                    <motion.div
                                                        className={`h-full bg-gradient-to-r ${colors.gradient}`}
                                                        initial={{ width: "5%" }}
                                                        animate={{ width: "65%" }}
                                                        transition={{ duration: 3, ease: "easeInOut" }}
                                                        style={{
                                                            boxShadow: '0 0 8px rgba(79, 70, 229, 0.3)'
                                                        }}
                                                    />

                                                    {/* Glow effect */}
                                                    <motion.div
                                                        className="absolute top-0 h-full w-20 bg-white opacity-20"
                                                        animate={{
                                                            left: ["-20%", "120%"]
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {demoState === "success" && (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-4"
                                        >
                                            <div className="rounded-lg border border-slate-200/70 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/20 p-4"
                                                style={{
                                                    borderRadius: '12px',
                                                    borderImage: 'linear-gradient(140deg, rgba(226, 232, 240, 0.6), rgba(148, 163, 184, 0.1)) 1',
                                                    boxShadow: 'rgba(148, 163, 184, 0.05) 0px 4px 12px'
                                                }}>
                                                <div className="flex items-start mb-4">
                                                    <motion.div
                                                        className="w-11 h-11 rounded-lg flex items-center justify-center mr-4 bg-green-500 text-white shadow-md"
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ duration: 0.4 }}
                                                        style={{
                                                            borderRadius: '10px',
                                                            boxShadow: '0 6px 12px -5px rgba(16, 185, 129, 0.3)'
                                                        }}
                                                    >
                                                        <Check className="h-6 w-6" />
                                                    </motion.div>
                                                    <div>
                                                        <motion.h4
                                                            className="font-medium text-green-600 dark:text-green-400 text-lg mb-1"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.3, delay: 0.1 }}
                                                        >
                                                            Success!
                                                        </motion.h4>
                                                        <motion.p
                                                            className="text-sm text-slate-600 dark:text-slate-300"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.3, delay: 0.2 }}
                                                        >
                                                            {step.demo.successText}
                                                        </motion.p>
                                                    </div>
                                                </div>

                                                {/* Success details */}
                                                <motion.div
                                                    className="rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800/40 border border-slate-200/70 dark:border-slate-700/30 p-3.5 mb-3.5"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.3 }}
                                                    style={{
                                                        borderRadius: '10px',
                                                        boxShadow: 'inset 0 1px 2px rgba(148, 163, 184, 0.05)'
                                                    }}
                                                >
                                                    <div className="flex flex-wrap items-center mb-3">
                                                        <div className="flex items-center mr-6 mb-2">
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-2 shadow-sm shadow-green-500/10">
                                                                <Clock className="h-3.5 w-3.5 text-white" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Completed in</span>
                                                                <span className="text-sm text-slate-700 dark:text-slate-200">28 seconds</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center mb-2">
                                                            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center mr-2 shadow-sm shadow-indigo-500/10`}>
                                                                <Sparkles className="h-3.5 w-3.5 text-white" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Status</span>
                                                                <span className="text-sm text-slate-700 dark:text-slate-200">Ready for next step</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Activity preview */}
                                                    <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/40">
                                                        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Next Steps</div>
                                                        <div className="space-y-2">
                                                            <div className={`flex items-center p-2 rounded-md ${colors.softBg}`}
                                                                style={{
                                                                    borderRadius: '8px'
                                                                }}>
                                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.gradient} text-white flex items-center justify-center text-xs mr-3`}
                                                                    style={{
                                                                        boxShadow: '0 4px 8px -2px rgba(79, 70, 229, 0.3)'
                                                                    }}>
                                                                    {activeStep < steps.length - 1 ? (
                                                                        steps[activeStep + 1].icon
                                                                    ) : (
                                                                        <Sparkles className="h-4 w-4" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-medium ${colors.primary}`}>
                                                                        {activeStep < steps.length - 1
                                                                            ? `Continue to: ${steps[activeStep + 1].title}`
                                                                            : "Start your development journey!"}
                                                                    </p>
                                                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                                                        {activeStep < steps.length - 1
                                                                            ? steps[activeStep + 1].description
                                                                            : "Your workspace is ready for you to begin building."}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Success progress bar */}
                                                <motion.div
                                                    className="w-full h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 0.6, delay: 0.2 }}
                                                    style={{
                                                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)'
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Progress indicator */}
                                <div className="py-2 px-5 border-t border-slate-200/70 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 flex items-center justify-between">
                                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                                        <span>Step {activeStep + 1} of {steps.length}</span>
                                    </div>

                                    <div className="flex space-x-1">
                                        {steps.map((_, i) => (
                                            <button
                                                key={`step-indicator-${i}`}
                                                onClick={() => handleStepClick(i)}
                                                className="focus:outline-none"
                                                aria-label={`Go to step ${i + 1}`}
                                            >
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === i
                                                        ? `w-6 bg-gradient-to-r ${colorClasses[steps[i].color as keyof typeof colorClasses].gradient}`
                                                        : 'w-3 bg-slate-300 dark:bg-slate-600'
                                                        }`}
                                                    style={{
                                                        boxShadow: activeStep === i ? '0 1px 3px rgba(79, 70, 229, 0.3)' : 'none'
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                handleStepClick((activeStep - 1 + steps.length) % steps.length);
                                            }}
                                            className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                            disabled={activeStep === 0}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleStepClick((activeStep + 1) % steps.length);
                                            }}
                                            className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                            disabled={activeStep === steps.length - 1}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-14 text-center">
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-5 max-w-2xl mx-auto">
                        Ready to accelerate your development journey with expert guidance and AI-powered collaboration?
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-7 py-5 rounded-xl font-medium text-base shadow-lg shadow-indigo-500/20"
                            style={{
                                borderRadius: '12px',
                                boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.2)'
                            }}
                        >
                            <Link href="/application" className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                <span>Apply as a Learner</span>
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            className="border-2 border-indigo-200 dark:border-indigo-800/70 bg-white/80 dark:bg-slate-800/50 px-7 py-5 rounded-xl font-medium text-base text-indigo-600 dark:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                            style={{
                                borderRadius: '12px',
                                boxShadow: '0 4px 10px -2px rgba(79, 70, 229, 0.1)'
                            }}
                        >
                            <Link href="/business-application" className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                <span>Apply as a Business</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Animated CSS styles */}
            <style jsx>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.7; }
                        50% { opacity: 1; }
                    }
                    
                    @keyframes glow {
                        0%, 100% { opacity: 0.5; filter: blur(10px); }
                        50% { opacity: 0.8; filter: blur(15px); }
                    }
                    
                    @keyframes shimmer {
                        to {
                            transform: translateX(100%);
                        }
                    }
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                `}</style>
        </section>
    );
};

export default HowItWorksSection;

