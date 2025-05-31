"use client"

import React, { useEffect, useRef, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ZapIcon,
    ArrowRightIcon,
    GraduationCap,
    Building
} from 'lucide-react';
import { ClockIcon, CloudIcon, CodeIcon, DatabaseIcon, FolderGitIcon, GlobeIcon, KeyIcon, LayoutIcon, RocketIcon, ServerIcon } from "lucide-react";
import { FaFlask } from "react-icons/fa";
import { masteryModules } from '@/data/eep-data';

// Define local version of masteryModules
// const masteryModules = [
//     {
//         title: "AWS Basics",
//         description: "Gain hands-on experience with AWS core services, including Lambda, EventBridge, IAM, and S3, to build scalable cloud solutions.",
//         icon: CloudIcon,
//     },
//     {
//         title: "Serverless with Lambda & EventBridge",
//         description: "Master event-driven architectures by creating serverless applications with AWS Lambda and EventBridge, optimizing performance and efficiency.",
//         icon: RocketIcon,
//     },
//     {
//         title: "Flask API Development",
//         description: "Develop RESTful APIs using Flask, integrating seamlessly with DynamoDB and SQL databases for robust backend solutions.",
//         icon: FaFlask,
//     },
//     {
//         title: "JWT Authentication",
//         description: "Implement JWT-based authentication for secure API access, ensuring safe token management and user verification.",
//         icon: KeyIcon,
//     },
//     {
//         title: "SQL & DynamoDB",
//         description: "Understand SQL fundamentals and work with DynamoDB to manage structured and unstructured data, learning when to use NoSQL vs. SQL.",
//         icon: DatabaseIcon,
//     },
//     {
//         title: "Automated Scheduling with Cron Jobs",
//         description: "Set up and manage Unix cron jobs and AWS EventBridge for task automation, ensuring seamless background operations.",
//         icon: ClockIcon,
//     },
//     {
//         title: "CI/CD & Deployment",
//         description: "Build CI/CD pipelines with GitHub Actions, deploy applications on Render, and automate updates for smooth and efficient software releases.",
//         icon: RocketIcon,
//     },
//     {
//         title: "Web Development Basics",
//         description: "Understand web fundamentals including client-server architecture, HTTP protocols, and build a clear roadmap for your development journey.",
//         icon: GlobeIcon,
//     },
//     {
//         title: "Frontend Development",
//         description: "Create responsive UIs with HTML, CSS, and JavaScript. Master DOM manipulation, event handling, and modern styling techniques.",
//         icon: LayoutIcon,
//     },
//     {
//         title: "Advanced Frontend",
//         description: "Build dynamic web applications with React and Next.js, utilizing reusable components, state management, and server-side rendering.",
//         icon: CodeIcon,
//     },
//     {
//         title: "Backend Development",
//         description: "Develop robust systems using Node.js, Django, NestJS and .NET. Create RESTful APIs, handle authentication, and manage server logic.",
//         icon: ServerIcon,
//     },
//     {
//         title: "Database Design",
//         description: "Design optimized database structures. Master both relational and non-relational concepts, schema design, and query optimization.",
//         icon: DatabaseIcon,
//     }
// ];

export const MasterySection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isDropupOpen, setIsDropupOpen] = useState(false);
    const dropupRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Handle card expansion
    const toggleExpand = (index: number) => {
        console.log(`Toggling index ${index}, current expandedIndex: ${expandedIndex}`);
        setExpandedIndex(prevIndex => {
            const newIndex = prevIndex === index ? null : index;
            console.log(`Setting new expandedIndex: ${newIndex}`);
            return newIndex;
        });
    };

    // Track mouse position for interactive effects
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Apply stagger animation for cards
        const cards = document.querySelectorAll('.mastery-card');
        cards.forEach((card, index) => {
            const element = card as HTMLElement;
            element.style.setProperty('--index', index.toString());

            // Trigger the animation immediately for initial render
            setTimeout(() => {
                element.classList.add('animate-in');
            }, 100 + (index * 50));
        });

        function handleClickOutside(event: MouseEvent) {
            if (dropupRef.current && !dropupRef.current.contains(event.target as Node)) {
                setIsDropupOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-16 relative overflow-hidden"
        >
            {/* Background elements with light/dark mode support */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                {/* Light mode background */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
                // className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
                ></div>

                {/* Section frame with stylish glowing borders */}
                <div className="absolute inset-4 border border-indigo-500/10 rounded-3xl pointer-events-none"></div>
                <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]"></div>

                {/* Dot pattern overlay - light for light mode, darker for dark mode */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(#6366F1 0.8px, transparent 0.8px)',
                        backgroundSize: '20px 20px'
                    }}>
                </div>

                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20">
                    <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent animate-pulse-slow"></div>
                    <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-pulse-slow"></div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent animate-pulse-slow"></div>
                    <div className="absolute top-0 right-0 w-12 h-px bg-gradient-to-l from-transparent via-purple-500/30 to-transparent animate-pulse-slow"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-20 h-20">
                    <div className="absolute bottom-0 left-0 w-px h-12 bg-gradient-to-t from-transparent via-indigo-500/30 to-transparent animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-pulse-slow"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20">
                    <div className="absolute bottom-0 right-0 w-px h-12 bg-gradient-to-t from-transparent via-pink-500/30 to-transparent animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-px bg-gradient-to-l from-transparent via-pink-500/30 to-transparent animate-pulse-slow"></div>
                </div>

                {/* Curved top and bottom edges */}
                <div className="absolute top-0 inset-x-0 h-16 overflow-hidden">
                    <svg viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none" className="absolute w-full h-24 translate-y-[-85%]">
                        <path
                            d="M0,96 C280,40 960,80 1440,16 L1440,0 L0,0 Z"
                            className="fill-slate-50 dark:fill-slate-900"
                        />
                    </svg>
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-indigo-500/30 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-16 overflow-hidden">
                    <svg viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none" className="absolute w-full h-24 translate-y-[80%]">
                        <path
                            d="M0,0 C280,56 960,16 1440,80 L1440,96 L0,96 Z"
                            className="fill-slate-50 dark:fill-slate-900"
                        />
                    </svg>
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-indigo-500/30 to-transparent"></div>
                </div>

                {/* Animated prismatic effect */}
                <div
                    className="absolute inset-0 opacity-10 dark:opacity-30 mix-blend-soft-light"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'g\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%236366F1\' stop-opacity=\'0.1\'/%3E%3Cstop offset=\'50%25\' stop-color=\'%23A855F7\' stop-opacity=\'0.2\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23EC4899\' stop-opacity=\'0.1\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id=\'p\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M0 0L40 40ZM40 0L0 40Z\' stroke=\'url(%23g)\' stroke-width=\'1\'/%3E%3C/pattern%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23p)\'/%3E%3C/svg%3E")',
                        backgroundSize: '40px 40px',
                        animation: 'background-shift 20s linear infinite'
                    }}
                ></div>

                {/* Galactic center glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 dark:from-indigo-600/5 dark:via-purple-600/10 dark:to-pink-600/5 blur-3xl"></div>
                </div>

                {/* Light beams effect */}
                <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
                    <div className="light-beam light-beam-1"></div>
                    <div className="light-beam light-beam-2"></div>
                    <div className="light-beam light-beam-3"></div>
                </div>

                {/* Parallax stars effect - only visible in dark mode */}
                <div className="hidden dark:block star-layer-1 absolute inset-0"></div>
                <div className="hidden dark:block star-layer-2 absolute inset-0"></div>
                <div className="hidden dark:block star-layer-3 absolute inset-0"></div>

                {/* Futuristic circuit lines */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-5 dark:opacity-10">
                    <svg width="90%" height="90%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke="url(#circuitGradient)" strokeWidth="1">
                            <path d="M100,100 C200,50 300,50 400,100 S600,150 700,100" className="circuit-animate" />
                            <path d="M100,200 C200,150 300,150 400,200 S600,250 700,200" className="circuit-animate-delay-1" />
                            <path d="M100,300 C200,250 300,250 400,300 S600,350 700,300" className="circuit-animate-delay-2" />
                            <circle cx="400" cy="250" r="5" fill="#6366F1" />
                            <circle cx="200" cy="150" r="3" fill="#6366F1" />
                            <circle cx="600" cy="350" r="3" fill="#6366F1" />
                            <circle cx="300" cy="200" r="2" fill="#EC4899" />
                            <circle cx="500" cy="300" r="2" fill="#EC4899" />
                        </g>
                        <defs>
                            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366F1" />
                                <stop offset="50%" stopColor="#A855F7" />
                                <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="container relative z-10 px-4 mx-auto">
                <div className="text-center mb-10">
                    {/* Title badge with enhanced design */}
                    <div className="inline-flex items-center justify-center mb-3">
                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-900/80 dark:via-purple-900/80 dark:to-indigo-900/80 border border-indigo-200 dark:border-indigo-500/30 backdrop-blur-sm relative overflow-hidden shadow-lg shadow-indigo-100/30 dark:shadow-indigo-950/30">
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/5 to-transparent skew-x-12 -translate-x-full animate-shine"></div>

                            <div className="flex items-center">
                                <ZapIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                                <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">AI Mastery Curriculum</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-800 dark:text-white">
                        Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Skills & Technologies</span> You'll Master
                    </h2>

                    <p className="text-base text-indigo-800/70 dark:text-indigo-200/80 max-w-2xl mx-auto">
                        Comprehensive enterprise-grade technologies that power modern AI applications
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {masteryModules.map((module, index) => {
                        const isExpanded = expandedIndex === index;
                        const isHovered = hoveredIndex === index;
                        return (
                            <div
                                key={`mastery-card-${index}`}
                                className="mastery-card opacity-0 perspective-[1000px]"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Card
                                    className={`relative h-full bg-gradient-to-br from-white/90 via-slate-50/95 to-white/90 dark:from-slate-800/80 dark:via-slate-900/90 dark:to-slate-800/80 backdrop-blur-sm border-0 overflow-hidden group transition-all duration-300 mastery-card-inner ${isHovered ? 'hover-state' : ''}`}
                                    style={{
                                        borderRadius: '20px',
                                        boxShadow: isHovered
                                            ? '0 20px 30px -12px rgba(79, 70, 229, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.3)'
                                            : '0 10px 30px -12px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.1)'
                                    }}
                                // style={{
                                //     borderRadius: '20px',
                                //     boxShadow: isHovered
                                //         ? '0 20px 30px -12px rgba(79, 70, 229, 0.1), 0 0 0 1px rgba(99, 102, 241, 0.2)'
                                //         : '0 10px 30px -12px rgba(99, 102, 241, 0.07), 0 0 0 1px rgba(99, 102, 241, 0.08)'
                                // }}
                                >
                                    {/* Curved highlight on top */}
                                    <div className="absolute top-0 inset-x-0 h-1 pointer-events-none">
                                        <svg width="100%" height="100%" viewBox="0 0 100 4" preserveAspectRatio="none">
                                            <path
                                                d="M0,4 C20,0 80,0 100,4"
                                                className={`${isExpanded || isHovered ? 'fill-indigo-500' : 'fill-indigo-200 dark:fill-indigo-900'} transition-all duration-300`}
                                            // className={`${isExpanded || isHovered ? 'fill-indigo-500' : 'fill-indigo-200 dark:fill-indigo-800/50'} transition-all duration-300`}
                                            />
                                        </svg>
                                    </div>

                                    {/* Animated subtle gradient on hover */}
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-indigo-100/30 via-purple-100/20 to-white/0 dark:from-indigo-600/20 dark:via-purple-600/15 dark:to-slate-900/0 pointer-events-none`}></div>
                                    {/* <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-indigo-100/30 via-purple-100/20 to-white/0 dark:from-indigo-600/5 dark:via-purple-600/5 dark:to-slate-800/0 pointer-events-none`}></div> */}

                                    {/* Sparkle effect on hover - only in light mode */}
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 pointer-events-none ${isHovered ? 'opacity-30 dark:opacity-0' : 'opacity-0'} transition-opacity duration-500`}>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.4)_0%,transparent_70%)]"></div>
                                    </div>

                                    <CardHeader
                                        className="p-4 pb-3 cursor-pointer"
                                        onClick={() => toggleExpand(index)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <div className={`relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-600/20 dark:to-purple-600/20 flex items-center justify-center flex-shrink-0 transition-all duration-500 overflow-hidden ${isExpanded || isHovered ? 'shadow-lg shadow-indigo-100 dark:shadow-indigo-500/20' : ''}`}>
                                                    {/* Animated luminescence */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/0 via-indigo-300/20 to-indigo-200/0 dark:from-indigo-600/0 dark:via-indigo-600/20 dark:to-indigo-600/0 animate-pulse-slow pointer-events-none"></div>
                                                    <div className="relative z-10">
                                                        {React.createElement(module.icon, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" })}
                                                    </div>
                                                </div>

                                                <div>
                                                    <CardTitle
                                                        className={`text-sm font-medium transition-colors duration-300 leading-tight ${isExpanded || isHovered ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'}`}
                                                    //  className={`text-sm font-medium transition-colors duration-300 leading-tight ${isExpanded || isHovered ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300'}`}
                                                    >
                                                        {module.title}
                                                    </CardTitle>
                                                </div>
                                            </div>

                                            {/* Toggle icon with rotation animation */}
                                            <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-300 ${isExpanded ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300' : 'text-indigo-500 dark:text-indigo-400'}`}>
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {/* AnimatePresence for smooth animation */}
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                key={`content-${index}`}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                                style={{ position: 'relative' }}
                                            >
                                                <CardContent className="px-4 pt-0 pb-4">
                                                    <div className="pl-12">
                                                        <p
                                                            className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                                                        // className="text-xs text-slate-600 dark:text-indigo-200/70 leading-relaxed"
                                                        >
                                                            {module.description}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </div>
                        );
                    })}
                </div>

                {/* Enhanced dropdown menu */}
                <div className="text-center mt-10">
                    <div className="relative inline-block z-20" ref={dropupRef}>
                        {/* Stylized dropup menu */}
                        <AnimatePresence>
                            {isDropupOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 overflow-hidden z-50"
                                    style={{
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 40px -5px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.1)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <div className="flex flex-col bg-gradient-to-b from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-indigo-200/50 dark:border-indigo-500/20 rounded-2xl overflow-hidden">
                                        {/* Path selection options */}
                                        <motion.a
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            href="/application"
                                            className="group flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-600/20 hover:text-indigo-700 dark:hover:text-white transition-colors duration-150 relative"
                                        >
                                            <span className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-600/20 dark:to-purple-600/20">
                                                <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors" />
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-medium">Start as a Learner</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">Build personal AI skills</span>
                                            </div>
                                            <ArrowRightIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.a>
                                        <motion.a
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            href="/business-application"
                                            className="group flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-600/20 hover:text-indigo-700 dark:hover:text-white transition-colors duration-150 relative"
                                        >
                                            <span className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-600/20 dark:to-purple-600/20">
                                                <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors" />
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-medium">Start as a Business</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">Power your enterprise AI</span>
                                            </div>
                                            <ArrowRightIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Enhanced button with animations */}
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.2)'
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsDropupOpen(!isDropupOpen)}
                            className="relative px-6 py-3 overflow-hidden rounded-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-800/30"
                            style={{
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 50%, #ec4899 100%)',
                                backgroundSize: '200% 200%',
                                animation: 'gradient-shift 3s ease infinite'
                            }}
                        >
                            {/* Button content */}
                            <div className="relative z-10 flex items-center">
                                <span className="mr-2 font-medium text-white">Power Up Your AI Journey</span>
                                <ChevronUpIcon className={`h-4 w-4 text-white transition-transform duration-300 ${isDropupOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Animated shine effect */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shine-slow pointer-events-none"></div>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Advanced animation styles */}
            <style jsx>{`
                @keyframes background-shift {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 100% 100%; }
                }
                
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes shine {
                    to {
                        transform: translateX(100%) skewX(-12deg);
                    }
                }
                
                @keyframes shine-slow {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    30%, 100% { transform: translateX(200%) skewX(-12deg); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
                
                @keyframes circuit-flow {
                    0% { stroke-dashoffset: 300; }
                    100% { stroke-dashoffset: 0; }
                }
                
                .animate-shine {
                    animation: shine 2s infinite;
                }
                
                .animate-shine-slow {
                    animation: shine-slow 5s infinite;
                }
                
                .circuit-animate {
                    stroke-dasharray: 300;
                    stroke-dashoffset: 300;
                    animation: circuit-flow 5s linear infinite;
                }
                
                .circuit-animate-delay-1 {
                    stroke-dasharray: 300;
                    stroke-dashoffset: 300;
                    animation: circuit-flow 5s linear 1s infinite;
                }
                
                .circuit-animate-delay-2 {
                    stroke-dasharray: 300;
                    stroke-dashoffset: 300;
                    animation: circuit-flow 5s linear 2s infinite;
                }
                
                .mastery-card {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
                }
                
                .mastery-card.animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .perspective-[1000px] .mastery-card-inner.hover-state {
                    transform: rotateX(2deg);
                }
                
                /* Light beams animations */
                .light-beam {
                    position: absolute;
                    width: 150%;
                    height: 100px;
                    transform-origin: center;
                }
                
                .light-beam-1 {
                    top: 20%;
                    left: -25%;
                    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
                    transform: rotate(-15deg);
                    animation: beam-move-1 20s linear infinite;
                }
                
                .light-beam-2 {
                    top: 50%;
                    left: -25%;
                    background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.05), transparent);
                    transform: rotate(5deg);
                    animation: beam-move-2 25s linear infinite;
                }
                
                .light-beam-3 {
                    top: 70%;
                    left: -25%;
                    background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.05), transparent);
                    transform: rotate(-10deg);
                    animation: beam-move-3 18s linear infinite;
                }
                
                @keyframes beam-move-1 {
                    0% { transform: translateX(-100%) rotate(-15deg); }
                    100% { transform: translateX(100%) rotate(-15deg); }
                }
                
                @keyframes beam-move-2 {
                    0% { transform: translateX(-100%) rotate(5deg); }
                    100% { transform: translateX(100%) rotate(5deg); }
                }
                
                @keyframes beam-move-3 {
                    0% { transform: translateX(-100%) rotate(-10deg); }
                    100% { transform: translateX(100%) rotate(-10deg); }
                }
                
                /* Star layers - only visible in dark mode */
                .star-layer-1, .star-layer-2, .star-layer-3 {
                    background-image: radial-gradient(circle, white 1px, transparent 1px);
                    background-size: 100px 100px;
                    opacity: 0.1;
                }
                
                .star-layer-2 {
                    background-size: 200px 200px;
                    animation: star-parallax-slow 100s linear infinite;
                }
                
                .star-layer-3 {
                    background-size: 300px 300px;
                    animation: star-parallax-slower 150s linear infinite;
                }
                
                @keyframes star-parallax-slow {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-200px); }
                }
                
                @keyframes star-parallax-slower {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-300px); }
                }
            `}</style>
        </section>
    );
};

export default MasterySection;