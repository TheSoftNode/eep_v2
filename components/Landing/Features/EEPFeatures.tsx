"use client";

import React, { useState, useEffect, useRef, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    GraduationCap,
    Code,
    Users,
    Lightbulb,
    BrainCircuit,
    MessageSquare,
    Sparkles,
    ArrowRight
} from 'lucide-react';

interface BackgroundElementsProps {
    animationProgress: number
}
// Animated background elements
export const BackgroundElements: FC<BackgroundElementsProps> = ({ animationProgress }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Translucent gradient blobs */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/5 to-fuchsia-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>

            {/* Dynamic shape elements */}
            <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.05)" />
                            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.08)" />
                            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.05)" />
                        </linearGradient>
                        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.05)" />
                            <stop offset="50%" stopColor="rgba(236, 72, 153, 0.08)" />
                            <stop offset="100%" stopColor="rgba(79, 70, 229, 0.05)" />
                        </linearGradient>
                    </defs>

                    {/* Subtle grid pattern */}
                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#smallGrid)" />

                    {/* Flowing lines */}
                    <path
                        d="M0,200 C150,150 350,250 600,200 C850,150 1050,250 1440,200"
                        fill="none"
                        stroke="url(#lineGradient1)"
                        strokeWidth="1.5"
                        opacity="0.4"
                        style={{
                            transform: `translateY(${Math.sin(animationProgress / 100 * Math.PI) * 20}px)`,
                        }}
                    />
                    <path
                        d="M0,400 C250,350 450,450 700,400 C950,350 1150,450 1440,400"
                        fill="none"
                        stroke="url(#lineGradient2)"
                        strokeWidth="1.5"
                        opacity="0.4"
                        style={{
                            transform: `translateY(${Math.cos(animationProgress / 100 * Math.PI) * 20}px)`,
                        }}
                    />

                    {/* Pulsing nodes */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const x = 100 + (i % 4) * 350;
                        const y = 200 + Math.floor(i / 4) * 200;
                        const size = 2 + (i % 3);
                        const delay = i * 0.8;
                        const animDuration = 3 + (i % 2);

                        return (
                            <circle
                                key={`node-${i}`}
                                cx={x}
                                cy={y}
                                r={size}
                                fill={i % 3 === 0 ? "rgba(99, 102, 241, 0.7)" : i % 3 === 1 ? "rgba(139, 92, 246, 0.7)" : "rgba(236, 72, 153, 0.7)"}
                                opacity={0.4 + Math.sin((animationProgress + delay * 10) / 100 * Math.PI) * 0.3}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

// Define TypeScript interfaces
interface Feature {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    benefits: string[];
    color: string;
    gradient: string;
    accentColor: string;
}

const EEPFeatures: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('collaboration');
    const [userInteracted, setUserInteracted] = useState<boolean>(false);
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const autoRotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationRef = useRef<number>(0);
    const autoRotateDelayMs = 8000; // 8 seconds delay before rotation

    const features: Feature[] = [
        {
            id: 'collaboration',
            title: 'Live Collaboration',
            icon: <Users size={24} />,
            description: 'Work together with teammates in real-time on projects, with seamless communication and version control.',
            benefits: [
                'Real-time code editing with multiple participants',
                'Built-in chat and video conferencing',
                'Shared workspace for team resources',
                'Automated conflict resolution for code changes'
            ],
            color: '#4F46E5',
            gradient: 'from-indigo-500/20 to-indigo-700/10',
            accentColor: 'border-indigo-500/30'
        },
        {
            id: 'ai-assistant',
            title: 'AI-Powered Guidance',
            icon: <BrainCircuit size={24} />,
            description: 'Get intelligent suggestions, error detection, and code improvement recommendations from our advanced AI.',
            benefits: [
                'Real-time code analysis and improvement suggestions',
                'Natural language queries about your codebase',
                'Automated debugging assistance',
                'Context-aware documentation generation'
            ],
            color: '#8B5CF6',
            gradient: 'from-violet-500/20 to-violet-700/10',
            accentColor: 'border-violet-500/30'
        },
        {
            id: 'mentorship',
            title: 'Expert Mentorship',
            icon: <GraduationCap size={24} />,
            description: 'Connect with industry professionals who provide personalized guidance and code reviews.',
            benefits: [
                'On-demand access to senior developers',
                'Scheduled 1-on-1 mentoring sessions',
                'Code reviews with detailed feedback',
                'Career development and learning paths'
            ],
            color: '#EC4899',
            gradient: 'from-pink-500/20 to-pink-700/10',
            accentColor: 'border-pink-500/30'
        },
        {
            id: 'project-management',
            title: 'Integrated Project Tools',
            icon: <Lightbulb size={24} />,
            description: 'Manage tasks, track progress, and organize sprints with our built-in project management tools.',
            benefits: [
                'Kanban and sprint planning boards',
                'Time tracking and milestone management',
                'Task assignment and dependency visualization',
                'Custom workflow automation'
            ],
            color: '#10B981',
            gradient: 'from-emerald-500/20 to-emerald-700/10',
            accentColor: 'border-emerald-500/30'
        },
        {
            id: 'security',
            title: 'Enterprise Security',
            icon: <ShieldCheck size={24} />,
            description: 'Keep your code and data secure with advanced protection and compliance features.',
            benefits: [
                'Role-based access controls for team members',
                'End-to-end encryption for all data',
                'Compliance with GDPR, SOC 2, and HIPAA',
                'Secure credential management'
            ],
            color: '#3B82F6',
            gradient: 'from-blue-500/20 to-blue-700/10',
            accentColor: 'border-blue-500/30'
        },
        {
            id: 'communication',
            title: 'Seamless Communication',
            icon: <MessageSquare size={24} />,
            description: 'Connect with teammates through integrated messaging, video calls, and collaborative documentation.',
            benefits: [
                'Threaded conversations in context with code',
                'One-click video meetings with screen sharing',
                'Collaborative documentation with real-time editing',
                'Searchable message history and knowledge base'
            ],
            color: '#F43F5E',
            gradient: 'from-rose-500/20 to-red-700/10',
            accentColor: 'border-rose-500/30'
        }
    ];

    // Animation loop for smooth progress indicator
    useEffect(() => {
        const animate = () => {
            setAnimationProgress((prev) => {
                // Reset when we reach rotation time
                if (prev >= 100) return 0;
                // Smooth increment based on frame rate and rotation delay
                return prev + 100 / ((autoRotateDelayMs / 1000) * 60);
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [autoRotateDelayMs]);

    // Auto-rotation with user interaction handling
    useEffect(() => {
        if (autoRotateTimeoutRef.current) {
            clearTimeout(autoRotateTimeoutRef.current);
        }

        // Only auto-rotate if user hasn't recently interacted
        if (!userInteracted) {
            autoRotateTimeoutRef.current = setTimeout(() => {
                const currentIndex = features.findIndex(f => f.id === activeTab);
                const nextIndex = (currentIndex + 1) % features.length;
                setActiveTab(features[nextIndex].id);
                setAnimationProgress(0); // Reset progress for new tab
            }, autoRotateDelayMs);
        }

        return () => {
            if (autoRotateTimeoutRef.current) {
                clearTimeout(autoRotateTimeoutRef.current);
            }
        };
    }, [activeTab, features, userInteracted, autoRotateDelayMs]);

    const handleTabChange = (tabId: string) => {
        // Skip if already on this tab
        if (tabId === activeTab) return;

        setUserInteracted(true);
        setActiveTab(tabId);
        setAnimationProgress(0);

        // Resume auto-rotation after a delay
        setTimeout(() => {
            setUserInteracted(false);
        }, autoRotateDelayMs * 2);
    };

    const activeFeature = features.find(f => f.id === activeTab) || features[0];

    return (
        <section id="features" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br dark:from-slate-900 dark:to-[#0A0E1F] from-slate-50 to-slate-100 border-y dark:border-slate-800/50 border-slate-200/70">
            {/* Animated background elements */}
            <BackgroundElements animationProgress={animationProgress} />

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-800 dark:text-white group">
                        Transform Your Development Experience
                        <span className="inline-block w-12 h-1 ml-1 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full transform translate-y-1"></span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
                        Our platform delivers everything you need to accelerate development,
                        foster collaboration, and build better projects with AI-assisted guidance and expert mentorship.
                    </p>
                </div>

                {/* Features Tabs */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-8">
                    {features.map((feature) => (
                        <motion.button
                            key={feature.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTabChange(feature.id)}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg border transition-all ${activeTab === feature.id
                                ? `bg-gradient-to-r ${feature.gradient} ${feature.accentColor} shadow-md`
                                : 'dark:bg-slate-800/40 dark:border-slate-700/50 dark:hover:bg-slate-800 dark:hover:border-slate-600 bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
                                }`}
                        >
                            <span
                                className={`${activeTab === feature.id ? `text-[${feature.color}]` : 'dark:text-slate-400 text-slate-500'}`}
                                style={{ color: activeTab === feature.id ? feature.color : '' }}
                            >
                                {feature.icon}
                            </span>
                            <span className={`ml-2 font-medium text-sm ${activeTab === feature.id ? 'dark:text-white text-slate-800' : 'dark:text-slate-300 text-slate-600'
                                }`}>
                                {feature.title}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Feature Content with AnimatePresence */}
                <div className="relative min-h-[320px] md:min-h-[280px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10, position: 'absolute', width: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4"
                        >
                            {/* Feature Illustration Card */}
                            <div className="md:col-span-4 flex justify-center">
                                <div
                                    style={{
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 20px, rgba(0, 0, 0, 0.05) 0px 1px 5px'
                                    }}
                                    className="relative w-full h-56 md:h-full rounded-xl overflow-hidden backdrop-blur-sm">
                                    {/* Card border glow effect */}
                                    <div
                                        className="absolute inset-px rounded-xl z-0 bg-gradient-to-br dark:from-slate-700/40 dark:via-slate-700/10 dark:to-slate-700/40 from-slate-300/50 via-white/20 to-slate-300/50 opacity-70"
                                        style={{
                                            boxShadow: `0 0 30px 0px rgba(79, 70, 229, 0.08)`,
                                            border: '1px solid rgba(255, 255, 255, 0.05)'
                                        }}
                                    ></div>

                                    {/* Card main background */}
                                    <div className="absolute inset-0 bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/80 from-white/80 to-slate-100/80 backdrop-blur-sm"></div>

                                    {/* Icon animation */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* Radiating circles */}
                                        <div className="absolute w-40 h-40">
                                            <div
                                                className="absolute inset-0 rounded-full"
                                                style={{
                                                    background: `radial-gradient(circle, ${activeFeature.color}10 0%, transparent 70%)`,
                                                    animation: 'pulse 4s infinite',
                                                    transform: `scale(${1 + Math.sin(animationProgress / 100 * Math.PI) * 0.1})`
                                                }}
                                            ></div>
                                            <div
                                                className="absolute inset-4 rounded-full"
                                                style={{
                                                    background: `radial-gradient(circle, ${activeFeature.color}15 0%, transparent 70%)`,
                                                    animation: 'pulse 4s infinite 0.5s',
                                                    transform: `scale(${1 + Math.cos(animationProgress / 100 * Math.PI) * 0.15})`
                                                }}
                                            ></div>
                                            <div
                                                className="absolute inset-8 rounded-full"
                                                style={{
                                                    background: `radial-gradient(circle, ${activeFeature.color}20 0%, transparent 70%)`,
                                                    animation: 'pulse 4s infinite 1s',
                                                    transform: `scale(${1 + Math.sin(animationProgress / 100 * Math.PI + 1) * 0.2})`
                                                }}
                                            ></div>
                                        </div>

                                        {/* Floating icon */}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{
                                                scale: [1, 1.05, 1],
                                                opacity: 1,
                                                y: [0, -3, 0, 3, 0],
                                                rotate: [0, -2, 0, 2, 0],
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                repeatType: "mirror"
                                            }}
                                            className="relative z-10"
                                        >
                                            <div
                                                className="h-16 w-16 flex items-center justify-center rounded-full"
                                                style={{
                                                    background: `linear-gradient(135deg, ${activeFeature.color}30, ${activeFeature.color}10)`,
                                                    boxShadow: `0 0 20px 0px ${activeFeature.color}20`,
                                                    border: `1px solid ${activeFeature.color}30`
                                                }}
                                            >
                                                <span className="text-3xl" style={{ color: activeFeature.color }}>
                                                    {activeFeature.icon}
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Orbiting elements - custom for each feature */}
                                        <motion.div
                                            className="absolute h-8 w-8 z-10"
                                            animate={{
                                                rotate: 360,
                                            }}
                                            transition={{
                                                duration: 8,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                            style={{
                                                transformOrigin: "40px 40px"
                                            }}
                                        >
                                            <div className="h-8 w-8 flex items-center justify-center rounded-full"
                                                style={{
                                                    backgroundColor: `${activeFeature.color}20`,
                                                    color: activeFeature.color
                                                }}>
                                                {activeFeature.id === 'collaboration' ?
                                                    <Users size={16} /> :
                                                    activeFeature.id === 'ai-assistant' ?
                                                        <Sparkles size={16} /> :
                                                        activeFeature.id === 'mentorship' ?
                                                            <GraduationCap size={16} /> :
                                                            activeFeature.id === 'project-management' ?
                                                                <Lightbulb size={16} /> :
                                                                activeFeature.id === 'security' ?
                                                                    <ShieldCheck size={16} /> :
                                                                    <MessageSquare size={16} />
                                                }
                                            </div>
                                        </motion.div>

                                        {/* Second orbiting element in opposite direction */}
                                        <motion.div
                                            className="absolute h-6 w-6 z-10"
                                            animate={{
                                                rotate: -360,
                                            }}
                                            transition={{
                                                duration: 6,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                            style={{
                                                transformOrigin: "-30px -30px"
                                            }}
                                        >
                                            <div className="h-6 w-6 flex items-center justify-center rounded-full"
                                                style={{
                                                    backgroundColor: `${activeFeature.color}15`,
                                                    color: activeFeature.color
                                                }}>
                                                <Code size={12} />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Light beam effects */}
                                    <div
                                        className="absolute h-40 w-1 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent blur-sm"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: `translate(-50%, -50%) rotate(${animationProgress * 3.6}deg)`,
                                        }}
                                    ></div>
                                    <div
                                        className="absolute h-40 w-1 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent blur-sm"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: `translate(-50%, -50%) rotate(${(animationProgress * 3.6) + 90}deg)`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Feature Details */}
                            <div className="md:col-span-8">
                                <div
                                    className="h-full rounded-xl p-5 bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-900/60 from-white/60 to-slate-50/60 backdrop-blur-sm border dark:border-slate-700/30 border-slate-200/60"
                                    style={{
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 20px, rgba(0, 0, 0, 0.05) 0px 1px 5px'
                                    }}
                                >
                                    <h3
                                        className="text-lg font-bold mb-2.5 flex items-center"
                                        style={{ color: activeFeature.color }}
                                    >
                                        {activeFeature.icon}
                                        <span className="ml-2 dark:text-white text-slate-800">{activeFeature.title}</span>
                                    </h3>

                                    <p className="dark:text-slate-300 text-slate-600 text-sm mb-4 leading-relaxed">
                                        {activeFeature.description}
                                    </p>

                                    <div className="space-y-2">
                                        {activeFeature.benefits.map((benefit, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + (index * 0.05) }}
                                                className="flex items-start"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    <div
                                                        className="w-3 h-3 rounded-full flex items-center justify-center"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${activeFeature.color}, ${activeFeature.color}80)`,
                                                            boxShadow: `0 0 5px 0px ${activeFeature.color}40`
                                                        }}
                                                    >
                                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="ml-2.5 dark:text-slate-300 text-slate-600 text-sm">{benefit}</p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-5 pt-4 border-t dark:border-slate-700/30 border-slate-200/60">
                                        <a
                                            href="#learn-more"
                                            className="inline-flex items-center text-xs font-medium hover:opacity-80 transition-opacity"
                                            style={{ color: activeFeature.color }}
                                        >
                                            Learn more about {activeFeature.title.toLowerCase()}
                                            <ArrowRight className="w-3 h-3 ml-1.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress indicator */}
                <div className="mt-6 flex justify-center">
                    <div className="flex space-x-1.5">
                        {features.map((feature, index) => (
                            <button
                                key={index}
                                onClick={() => handleTabChange(feature.id)}
                                className="focus:outline-none"
                                aria-label={`Switch to ${feature.title}`}
                            >
                                <div className="h-1 rounded-full overflow-hidden transition-all duration-300" style={{ width: activeTab === feature.id ? '32px' : '12px' }}>
                                    <div
                                        className={activeTab === feature.id ? 'h-full' : 'h-full dark:bg-slate-600 bg-slate-300'}
                                        style={{
                                            background: activeTab === feature.id ? `linear-gradient(90deg, ${feature.color}, ${feature.color}80)` : '',
                                        }}
                                    >
                                        {activeTab === feature.id && (
                                            <motion.div
                                                className="h-full bg-white/0"
                                                style={{
                                                    width: `${100 - animationProgress}%`,
                                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.5))'
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-10 text-center">
                    <motion.div
                        whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-block"
                    >
                        <a
                            href="#apply"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all text-sm"
                        >
                            <Code className="mr-2 h-4 w-4" />
                            Start Collaborating Today
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.3;
                        transform: scale(1.02);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </section>
    );
};

export default EEPFeatures;