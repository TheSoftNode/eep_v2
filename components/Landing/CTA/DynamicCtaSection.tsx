"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Code,
    Layers,
    BrainCircuit,
    ArrowRight,
    Users,
    Sparkles,
    GraduationCap,
    Building,
    CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const DynamicCtaSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'learners' | 'businesses'>('learners');
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Safe client-side only values
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Initialize dimensions only on client side
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        // Set initial dimensions
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Track mouse position for effects
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Parallax and scroll-based animations
    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

    // Calculate relative mouse position for effects (safely)
    const getRelativeMousePos = () => {
        if (dimensions.width === 0) return { x: 0, y: 0 };
        return {
            x: (mousePosition.x - dimensions.width / 2) * 0.01,
            y: (mousePosition.y - dimensions.height / 2) * 0.01
        };
    };

    const relativeMousePos = getRelativeMousePos();

    const features = {
        learners: [
            { icon: <BrainCircuit size={20} />, text: "AI-powered learning assistance" },
            { icon: <Users size={20} />, text: "Expert mentorship & guidance" },
            { icon: <Code size={20} />, text: "Build real-world projects" },
            { icon: <GraduationCap size={20} />, text: "Skill certification & growth tracking" }
        ],
        businesses: [
            { icon: <Users size={20} />, text: "Access top development talent" },
            { icon: <Layers size={20} />, text: "Custom project management tools" },
            { icon: <Sparkles size={20} />, text: "Accelerated development timeline" },
            { icon: <CheckCircle size={20} />, text: "Quality assurance & professional support" }
        ]
    };

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden"
            style={{
                paddingTop: '4rem',
                paddingBottom: '5rem'
            }}
        >
            {/* Curved section borders */}
            <div className="absolute top-0 inset-x-0 h-16 overflow-hidden">
                <svg viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none" className="absolute w-full h-24 translate-y-[-60%]">
                    <path
                        d="M0,96 C480,30 960,30 1440,96 L1440,0 L0,0 Z"
                        className="fill-slate-50 dark:fill-slate-900"
                    />
                </svg>
                {/* Highlight line on top curve */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
            </div>

            {/* Background elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Primary gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900 opacity-90"></div>

                {/* Dot pattern */}
                <div className="absolute inset-0 dark:bg-grid-slate-700/[0.05] bg-grid-slate-300/[0.1] bg-[size:20px_20px]"></div>

                {/* Animated gradient blobs */}
                <motion.div
                    className="absolute left-1/4 top-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-400/5 to-purple-400/5 dark:from-indigo-400/10 dark:to-purple-400/10 blur-3xl"
                    style={{
                        y: backgroundY,
                        x: useTransform(scrollYProgress, [0, 1], [-20, 20]),
                    }}
                ></motion.div>
                <motion.div
                    className="absolute right-1/4 bottom-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/5 to-cyan-400/5 dark:from-blue-400/10 dark:to-cyan-400/10 blur-3xl"
                    style={{
                        y: useTransform(scrollYProgress, [0, 1], [20, -20]),
                        x: useTransform(scrollYProgress, [0, 1], [20, -20]),
                    }}
                ></motion.div>

                {/* Digital circuit lines */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-5 dark:opacity-10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="ctaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M200,200 L400,200 L400,400 L600,400 L600,200 L800,200 M300,800 L300,600 L500,600 L500,800 L700,800"
                        stroke="url(#ctaGradient)"
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

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Content Column */}
                    <div className="lg:col-span-6 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="inline-block">
                                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
                                    Ready to Join?
                                </span>
                                <div className="absolute -bottom-2 left-1/2 w-12 h-1 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"></div>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-4 mb-6 leading-tight">
                                Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">Development Journey</span> with EEP
                            </h2>

                            <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-lg">
                                Join our collaborative platform that connects developers, mentors and businesses to create remarkable projects with the power of guided learning and AI assistance.
                            </p>

                            {/* Tabs to toggle between learner and business */}
                            <div className="flex mb-8 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl shadow-sm">
                                <button
                                    onClick={() => setActiveTab('learners')}
                                    className={`py-2.5 px-5 text-sm font-medium rounded-lg transition-all duration-300 ${activeTab === 'learners'
                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <span className="flex items-center">
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        For Learners
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('businesses')}
                                    className={`py-2.5 px-5 text-sm font-medium rounded-lg transition-all duration-300 ${activeTab === 'businesses'
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <span className="flex items-center">
                                        <Building className="mr-2 h-4 w-4" />
                                        For Businesses
                                    </span>
                                </button>
                            </div>

                            {/* Feature list */}
                            <div className="mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {features[activeTab].map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                            className="flex items-start space-x-3"
                                        >
                                            <div className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full flex items-center justify-center ${activeTab === 'learners'
                                                ? 'text-indigo-600 dark:text-indigo-400'
                                                : 'text-blue-600 dark:text-blue-400'
                                                }`}>
                                                {feature.icon}
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 text-base">
                                                {feature.text}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Two-week notice badge */}
                            <div className="inline-block mb-8 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700/40 rounded-lg">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-500 dark:text-amber-400 mr-2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span className="text-amber-700 dark:text-amber-300 font-medium">Applications are reviewed within 2 weeks</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="flex flex-wrap mb-10 sm:mb-0 w-full gap-4">
                                <Button
                                    className={`px-8 py-6 w-full sm:w-auto rounded-xl font-medium text-base text-white shadow-lg ${activeTab === 'learners'
                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-indigo-500/20'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-500/20'
                                        }`}
                                    style={{
                                        borderRadius: '12px'
                                    }}
                                >
                                    <Link href={activeTab === 'learners' ? '/application' : '/business-application'} className="flex items-center gap-2">
                                        {activeTab === 'learners' ? (
                                            <>
                                                <GraduationCap className="h-5 w-5" />
                                                <span>Apply as a Learner</span>
                                            </>
                                        ) : (
                                            <>
                                                <Building className="h-5 w-5" />
                                                <span>Apply as a Business</span>
                                            </>
                                        )}
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className={`border-2 px-8 w-full sm:w-auto py-6 rounded-xl font-medium text-base ${activeTab === 'learners'
                                        ? 'border-indigo-200 dark:border-indigo-800/70 text-indigo-600 dark:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700'
                                        : 'border-blue-200 dark:border-blue-800/70 text-blue-600 dark:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700'
                                        }`}
                                    style={{
                                        borderRadius: '12px'
                                    }}
                                >
                                    <Link href="#learn-more" className="flex items-center gap-2">
                                        <span>Learn More</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Showcase Column */}
                    <div className="lg:col-span-6 relative flex justify-center items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative w-full max-w-lg"
                        >
                            {/* Decorative orbits */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border border-indigo-200 dark:border-indigo-800/30 opacity-70"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border border-slate-200 dark:border-slate-700/30 opacity-60"
                                style={{
                                    transform: `translate(-50%, -50%) rotate(${scrollYProgress.get() * 30}deg)`,
                                }}
                            ></div>

                            {/* Main showcase element */}
                            <div className="relative mx-auto aspect-square max-w-md z-10">
                                {/* Main circle with glowing effect */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-900/20 dark:to-slate-900/40 border border-indigo-100 dark:border-indigo-700/40 shadow-lg dark:shadow-indigo-900/20 flex items-center justify-center overflow-hidden">
                                    {/* Glow effect */}
                                    <div className="absolute -inset-10 bg-indigo-500/5 dark:bg-indigo-500/10 blur-2xl rounded-full"></div>

                                    {/* Visual display */}
                                    <div className="relative w-full h-full flex items-center justify-center rounded-full">
                                        {/* Inner core display */}
                                        <div className="relative w-4/5 h-4/5 rounded-full bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-xl flex items-center justify-center border border-slate-200 dark:border-slate-700/50"
                                            style={{
                                                transform: `translate(${relativeMousePos.x * 5}px, ${relativeMousePos.y * 5}px)`,
                                            }}
                                        >
                                            {/* Inner glow */}
                                            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-500/10 to-blue-500/5 dark:from-indigo-500/20 dark:to-blue-500/10 blur-xl rounded-full"></div>

                                            {/* Centered icon - different for each tab */}
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="relative z-20 text-indigo-500 dark:text-indigo-400"
                                                style={{
                                                    transform: `scale(1) translate(${relativeMousePos.x * 10}px, ${relativeMousePos.y * 10}px)`,
                                                }}
                                            >
                                                {activeTab === 'learners' ? (
                                                    <BrainCircuit className="w-20 h-20" />
                                                ) : (
                                                    <Building className="w-20 h-20" />
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Orbiting features */}
                                {features[activeTab].map((feature, index) => {
                                    const angle = (index * 90);
                                    const radians = angle * (Math.PI / 180);
                                    const radius = 150;
                                    const x = Math.cos(radians) * radius;
                                    const y = Math.sin(radians) * radius;

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x, y, scale: 0.8 }}
                                            animate={{
                                                opacity: 1,
                                                x,
                                                y,
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{
                                                opacity: { delay: 0.5 + (index * 0.1), duration: 0.5 },
                                                scale: {
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    duration: 3,
                                                    delay: index * 0.5
                                                }
                                            }}
                                            className="absolute top-1/2 left-1/2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                            style={{
                                                marginLeft: '-3rem',
                                                marginTop: '-1rem',
                                            }}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span className={activeTab === 'learners' ? 'text-indigo-500' : 'text-blue-500'}>
                                                    {feature.icon}
                                                </span>
                                                <span className="whitespace-nowrap text-slate-700 dark:text-slate-200">
                                                    {feature.text.split(' ').slice(0, 2).join(' ')}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom curved border */}
            <div className="absolute bottom-0 inset-x-0 h-16 overflow-hidden">
                <svg viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none" className="absolute w-full h-24 translate-y-[30%]">
                    <path
                        d="M0,0 C480,66 960,66 1440,0 L1440,96 L0,96 Z"
                        className="fill-slate-50 dark:fill-slate-900"
                    />
                </svg>
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
            </div>
        </section>
    );
};

export default DynamicCtaSection;