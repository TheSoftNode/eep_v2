"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    Code,
    RefreshCw,
    Hourglass,
    ShieldCheck,
    Clock,
    ArrowRight,
    Users,
    Lightbulb,
    PanelRight,
    FileCode,
    BrainCircuit,
    MessageSquare,
    Calendar,
    CheckSquare,
    UserPlus,
    Sparkles,
    Zap,
    GraduationCap
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type WorkspaceAction = "code" | "ai" | "mentorship" | "collaboration";

interface WorkspaceConfig {
    id: WorkspaceAction;
    icon: React.ReactNode;
    name: string;
    title: string;
    description: string;
    primaryColor: string;
    secondaryColor: string;
    action: string;
    configs: Array<{ label: string; value: string; icon?: React.ReactNode }>;
    success: string;
    gradient: string;
    gradientBg: string;
}

const WorkspaceDemo: React.FC = () => {
    const [currentAction, setCurrentAction] = useState<number>(0);
    const [demoState, setDemoState] = useState<"idle" | "processing" | "success">("idle");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const workspaceActions: WorkspaceConfig[] = [
        {
            id: "code",
            icon: <Code className="h-5 w-5" />,
            name: "Code Studio",
            title: "Collaborative Coding Environment",
            description: "Real-time pair programming with version control",
            primaryColor: "text-indigo-600",
            secondaryColor: "text-indigo-500",
            action: "Setting up your development workspace",
            configs: [
                {
                    label: "Project",
                    value: "ECommerce Platform",
                    icon: <FileCode className="h-3 w-3 text-indigo-500" />
                },
                {
                    label: "Stack",
                    value: "React, Node.js, MongoDB",
                    icon: <Zap className="h-3 w-3 text-indigo-500" />
                },
                {
                    label: "Team Members",
                    value: "5 collaborators online",
                    icon: <Users className="h-3 w-3 text-indigo-500" />
                },
                {
                    label: "Git Integration",
                    value: "Auto-commit enabled",
                    icon: <Check className="h-3 w-3 text-indigo-500" />
                }
            ],
            success: "Workspace ready with all team files synced",
            gradient: "from-indigo-600 to-indigo-500",
            gradientBg: "from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900/30"
        },
        {
            id: "ai",
            icon: <BrainCircuit className="h-5 w-5" />,
            name: "AI Companion",
            title: "Intelligent Development Assistant",
            description: "Personalized code help and learning resources",
            primaryColor: "text-pink-600",
            secondaryColor: "text-pink-500",
            action: "Training AI on your project codebase",
            configs: [
                {
                    label: "Suggestion Mode",
                    value: "Active Learning",
                    icon: <Sparkles className="h-3 w-3 text-pink-500" />
                },
                {
                    label: "Code Analysis",
                    value: "Performance & Security",
                    icon: <ShieldCheck className="h-3 w-3 text-pink-500" />
                },
                {
                    label: "Learning Path",
                    value: "Full-stack Development",
                    icon: <GraduationCap className="h-3 w-3 text-pink-500" />
                },
                {
                    label: "Resources",
                    value: "12 modules available",
                    icon: <Lightbulb className="h-3 w-3 text-pink-500" />
                }
            ],
            success: "AI assistant is calibrated to your coding style",
            gradient: "from-pink-600 to-pink-500",
            gradientBg: "from-pink-50 to-white dark:from-pink-900/20 dark:to-slate-900/30"
        },
        {
            id: "mentorship",
            icon: <Users className="h-5 w-5" />,
            name: "Mentor Connect",
            title: "Expert Guidance & Feedback",
            description: "Direct access to industry professionals",
            primaryColor: "text-violet-600",
            secondaryColor: "text-violet-500",
            action: "Matching you with specialized mentors",
            configs: [
                {
                    label: "Mentors",
                    value: "3 experts available",
                    icon: <UserPlus className="h-3 w-3 text-violet-500" />
                },
                {
                    label: "Next Session",
                    value: "Today at 3:00 PM",
                    icon: <Calendar className="h-3 w-3 text-violet-500" />
                },
                {
                    label: "Review Status",
                    value: "2 code reviews pending",
                    icon: <FileCode className="h-3 w-3 text-violet-500" />
                },
                {
                    label: "Specialties",
                    value: "UI/UX, Architecture, ML",
                    icon: <Sparkles className="h-3 w-3 text-violet-500" />
                }
            ],
            success: "Mentor team connected and ready to help",
            gradient: "from-violet-600 to-violet-500",
            gradientBg: "from-violet-50 to-white dark:from-violet-900/20 dark:to-slate-900/30"
        },
        {
            id: "collaboration",
            icon: <MessageSquare className="h-5 w-5" />,
            name: "Team Hub",
            title: "Project Management & Communication",
            description: "Centralized tasks, chat, and file sharing",
            primaryColor: "text-blue-600",
            secondaryColor: "text-blue-500",
            action: "Syncing team communications & tasks",
            configs: [
                {
                    label: "Active Chats",
                    value: "4 conversations",
                    icon: <MessageSquare className="h-3 w-3 text-blue-500" />
                },
                {
                    label: "Tasks",
                    value: "8 assigned, 3 completed",
                    icon: <CheckSquare className="h-3 w-3 text-blue-500" />
                },
                {
                    label: "Sprint",
                    value: "Week 2 - UI Components",
                    icon: <Calendar className="h-3 w-3 text-blue-500" />
                },
                {
                    label: "Shared Files",
                    value: "24 assets available",
                    icon: <FileCode className="h-3 w-3 text-blue-500" />
                }
            ],
            success: "Team workspace synchronized successfully",
            gradient: "from-blue-600 to-blue-500",
            gradientBg: "from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900/30"
        }
    ];

    // Auto-cycling demo
    useEffect(() => {
        const startDemo = () => {
            setDemoState("processing");

            timeoutRef.current = setTimeout(() => {
                setDemoState("success");

                timeoutRef.current = setTimeout(() => {
                    setDemoState("idle");
                    setCurrentAction((prev) => (prev + 1) % workspaceActions.length);

                    timeoutRef.current = setTimeout(startDemo, 1500);
                }, 3000);
            }, 3000);
        };

        // Start the demo cycle with a longer initial delay
        timeoutRef.current = setTimeout(startDemo, 2000);

        // Clean up on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentAction, workspaceActions.length]);

    const action = workspaceActions[currentAction];

    return (
        <Card className="backdrop-blur-sm dark:bg-[#060f38]/80 bg-white/80 dark:border-slate-800/50 border-slate-200/70 shadow-xl overflow-hidden rounded-xl">
            {/* Header */}
            <CardHeader className="px-5 py-4 border-b dark:border-slate-700/30 border-slate-200/70 dark:bg-gradient-to-r dark:from-[#0A0F2C]/80 dark:to-[#0A0E1F]/80 bg-gradient-to-r from-slate-50/80 to-white/80 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center mr-3 text-white shadow-lg shadow-indigo-500/10">
                        <PanelRight className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium dark:text-white text-slate-800">EEP Workspace</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Project: E-Commerce Platform</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs text-white border-2 border-white dark:border-slate-900">S</div>
                        <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs text-white border-2 border-white dark:border-slate-900">A</div>
                        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white border-2 border-white dark:border-slate-900">J</div>
                        <div className="w-6 h-6 rounded-full bg-blue-500/80 flex items-center justify-center text-xs text-white border-2 border-white dark:border-slate-900">+2</div>
                    </div>

                    <Badge variant="outline" className="dark:bg-green-950/30 bg-green-50 dark:text-green-400 text-green-600 dark:border-green-800/30 border-green-200/70 flex items-center gap-1 px-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="text-xs">Live</span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                {/* Action type selector */}
                <div className="flex justify-around mb-5 pb-4 border-b dark:border-slate-700/30 border-slate-200/70">
                    {workspaceActions.map((a, idx) => (
                        <div
                            key={a.id}
                            className={`relative flex flex-col items-center px-3 py-1.5 rounded-lg transition-all duration-200 ${idx === currentAction
                                ? `${a.primaryColor} dark:bg-slate-800/40 bg-slate-100/70`
                                : 'dark:text-slate-400 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <div className="mb-1 relative">
                                {idx === currentAction && (
                                    <motion.div
                                        className={`absolute -inset-1 rounded-full bg-gradient-to-r ${a.gradientBg} opacity-50`}
                                        layoutId="tabHighlight"
                                    ></motion.div>
                                )}
                                <div className="relative">
                                    {a.icon}
                                </div>
                            </div>
                            <span className="text-xs font-medium">{a.name}</span>
                            {idx === currentAction && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className={`absolute -bottom-4 w-10 h-0.5 rounded-full bg-gradient-to-r ${a.gradient}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {demoState === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-lg border dark:border-slate-700/30 border-slate-200/70 dark:bg-slate-800/20 bg-slate-50/50 p-4"
                        >
                            <div className="flex items-start">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center mr-3 text-white shadow-md shadow-indigo-500/10`}>
                                    {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-medium ${action.primaryColor} mb-0.5 text-base`}>
                                        {action.title}
                                    </h4>
                                    <p className="text-xs dark:text-slate-300 text-slate-600 mb-3">
                                        {action.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 p-3 mb-3 rounded-lg bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-800/40 from-white to-slate-50/80 dark:border-slate-700/20 border-slate-200/70 backdrop-blur-sm">
                                        {action.configs.map((config, i) => (
                                            <div key={i} className="flex flex-col">
                                                <div className="flex items-center mb-1">
                                                    {config.icon}
                                                    <span className="text-xs dark:text-slate-400 text-slate-500 ml-1">{config.label}</span>
                                                </div>
                                                <span className="text-xs dark:text-white text-slate-800 font-medium truncate">{config.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 mb-2 px-1">
                                <span>Workspace Status</span>
                                <span className={action.secondaryColor}>Ready for {action.id}</span>
                            </div>

                            <div className="w-full h-1 rounded-full dark:bg-slate-700/40 bg-slate-200/70 overflow-hidden mb-4 backdrop-blur-sm">
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${action.gradient}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.2 }}
                                />
                            </div>

                            <motion.button
                                className={`w-full py-2 flex justify-center items-center rounded-lg border-0 bg-gradient-to-r ${action.gradient} text-xs text-white transition-all shadow-md shadow-indigo-500/10 hover:shadow-lg`}
                                whileHover={{ scale: 1.01, y: -1 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                                <span>Start {action.id} session</span>
                            </motion.button>
                        </motion.div>
                    )}

                    {demoState === "processing" && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-lg border dark:border-slate-700/30 border-slate-200/70 dark:bg-slate-800/20 bg-slate-50/50 p-4"
                        >
                            <div className="flex items-start mb-4">
                                <div className="relative w-10 h-10 rounded-full dark:bg-slate-800/80 bg-white flex items-center justify-center mr-3 shadow-md shadow-indigo-500/5">
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-2 border-transparent"
                                        style={{
                                            borderTopColor: action.id === "code" ? "#4F46E5" :
                                                action.id === "ai" ? "#DB2777" :
                                                    action.id === "mentorship" ? "#7C3AED" : "#2563EB",
                                            borderRightColor: "transparent",
                                            borderBottomColor: "transparent",
                                            borderLeftColor: "transparent"
                                        }}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                    <Hourglass className={`h-4 w-4 ${action.primaryColor}`} />
                                </div>
                                <div>
                                    <h4 className={`font-medium ${action.primaryColor} mb-0.5 text-base`}>
                                        Initializing {action.id}
                                    </h4>
                                    <p className="text-xs dark:text-slate-300 text-slate-600">
                                        {action.action}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 p-3 rounded-lg bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-800/40 from-white to-slate-50/80 dark:border-slate-700/20 border-slate-200/70 mb-4 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs dark:text-slate-400 text-slate-500">Loading Services:</span>
                                    <div className="flex items-center">
                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></div>
                                        <span className="text-xs text-amber-500">In Progress</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 py-1.5 px-3 rounded-md dark:bg-slate-800/60 bg-slate-100/60 dark:border-slate-700/30 border-slate-200/70 backdrop-blur-sm">
                                    <RefreshCw className={`h-4 w-4 ${action.primaryColor}`} style={{ animation: 'spin 2s linear infinite' }} />
                                    <span className="text-xs dark:text-slate-300 text-slate-600">EEP Platform is preparing your collaborative {action.id}...</span>
                                </div>

                                {/* Animated progress steps */}
                                <div className="grid grid-cols-4 gap-1 mt-2">
                                    {['Connecting', 'Resources', 'Data Sync', 'User Access'].map((step, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <div className={`w-full h-1 ${i <= Math.min(3, currentAction + 1) ? `bg-gradient-to-r ${action.gradient}` : 'bg-slate-200 dark:bg-slate-700'} rounded-full`}>
                                                <motion.div
                                                    className="h-full bg-white/30"
                                                    animate={{
                                                        opacity: i === Math.min(3, currentAction) ? [0.2, 0.5, 0.2] : 0
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                />
                                            </div>
                                            <span className="text-[9px] mt-1 text-slate-500 dark:text-slate-400">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-2 text-xs dark:text-slate-400 text-slate-500">
                                <div className="flex items-center space-x-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span>End-to-end encryption</span>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Ready in: <span className="dark:text-slate-300 text-slate-700">~12s</span></span>
                                </div>
                            </div>

                            <div className="relative w-full h-1.5 rounded-full dark:bg-slate-700/40 bg-slate-200/70 overflow-hidden backdrop-blur-sm">
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${action.gradient}`}
                                    initial={{ width: "20%" }}
                                    animate={{ width: "70%" }}
                                    transition={{ duration: 2.5, ease: "easeInOut" }}
                                />

                                {/* Enhanced glow effect */}
                                <motion.div
                                    className="absolute top-0 h-full w-20 bg-white opacity-20"
                                    animate={{
                                        left: ["-10%", "110%"]
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
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
                            className="rounded-lg border dark:border-slate-700/30 border-slate-200/70 dark:bg-slate-800/20 bg-slate-50/50 p-4"
                        >
                            <div className="flex items-start mb-4">
                                <motion.div
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-3 text-white shadow-md shadow-green-500/20"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Check className="h-5 w-5" />
                                </motion.div>
                                <div>
                                    <motion.h4
                                        className="font-medium text-green-500 mb-0.5 text-base"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        {action.id.charAt(0).toUpperCase() + action.id.slice(1)} Ready
                                    </motion.h4>
                                    <motion.p
                                        className="text-xs dark:text-slate-300 text-slate-600"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                    >
                                        {action.success}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                className="space-y-2 p-3 rounded-lg bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-800/40 from-white to-slate-50/80 dark:border-slate-700/20 border-slate-200/70 mb-3 backdrop-blur-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className="flex items-center mb-2 w-full sm:w-auto">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mr-2 shadow-sm shadow-indigo-500/10">
                                            <FileCode className="h-3.5 w-3.5 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] dark:text-slate-400 text-slate-500">Workspace</span>
                                            <span className="text-xs font-medium dark:text-slate-200 text-slate-700">#team-ecommerce-2023</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-2 shadow-sm shadow-green-500/10">
                                                <Clock className="h-3 w-3 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] dark:text-slate-400 text-slate-500">Ready in</span>
                                                <span className="text-xs dark:text-slate-300 text-slate-600">12 seconds</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mr-2 shadow-sm shadow-pink-500/10">
                                                <Users className="h-3 w-3 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] dark:text-slate-400 text-slate-500">Team</span>
                                                <span className="text-xs dark:text-slate-300 text-slate-600">5 members active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity feed preview */}
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                                    <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Recent Activity</div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-xs">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] mr-2">A</div>
                                            <span className="text-slate-700 dark:text-slate-300">Updated <span className="font-medium">ProductPage.jsx</span></span>
                                            <span className="text-slate-400 dark:text-slate-500 ml-auto">2m ago</span>
                                        </div>
                                        <div className="flex items-center text-xs">
                                            <div className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[8px] mr-2">S</div>
                                            <span className="text-slate-700 dark:text-slate-300">Created new task <span className="font-medium">API Integration</span></span>
                                            <span className="text-slate-400 dark:text-slate-500 ml-auto">5m ago</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.button
                                className="w-full py-2 flex justify-center items-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-xs text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 transition-all"
                                whileHover={{ scale: 1.01, y: -1 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                <span>Enter {action.id} workspace</span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Card>
    );
};

export default WorkspaceDemo;
