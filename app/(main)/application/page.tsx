"use client"

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Clock, BrainCircuit, RocketIcon, ArrowRight } from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import LearnerApplicationForm from '@/components/Application/LearnerApplicationForm';
import { Button } from "@/components/ui/button";

export default function LearnerApplicationPage() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const { scrollYProgress } = useScroll();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const documentHeight = document.body.scrollHeight - window.innerHeight;
            const progress = Math.min(scrollY / documentHeight, 1);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 15 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-indigo-950 dark:via-slate-900 dark:to-indigo-950 pt-16">
            <Head>
                <title>Learner Application - HitoAI Enterprise Empowerment Platform</title>
                <meta name="description" content="Apply as a learner to join our Enterprise Empowerment Platform and accelerate your AI development journey." />
            </Head>

            {/* Compact Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-500 to-transparent opacity-20 dark:opacity-30"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-500 to-transparent opacity-20 dark:opacity-30"></div>

                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-indigo-200/20 dark:from-indigo-500/8 to-violet-300/0 dark:to-violet-600/0 blur-3xl"
                    style={{ transform: `translate(-50%, -50%) rotate(${scrollProgress * 3}deg)` }}
                ></div>

                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-blue-200/15 dark:from-blue-500/4 to-purple-300/0 dark:to-purple-600/0 blur-3xl"
                    style={{ transform: `translate(-50%, -50%) rotate(${-scrollProgress * 5}deg)` }}
                ></div>

                {/* Compact floating particles */}
                <motion.div
                    className="absolute w-1.5 h-1.5 top-1/3 left-1/2 rounded-full bg-blue-500 dark:bg-blue-400 blur-sm opacity-30 dark:opacity-50"
                    animate={{ x: [0, 200, 0], y: [0, 60, 0], rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))' }}
                ></motion.div>

                <motion.div
                    className="absolute w-1 h-1 top-2/3 left-1/3 rounded-full bg-indigo-500 dark:bg-indigo-400 blur-sm opacity-30 dark:opacity-50"
                    animate={{ x: [0, -150, 0], y: [0, -80, 0], rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))' }}
                ></motion.div>

                <motion.div
                    className="absolute w-1 h-1 top-1/4 left-2/3 rounded-full bg-violet-500 dark:bg-violet-400 blur-sm opacity-30 dark:opacity-50"
                    animate={{ x: [0, 120, 0], y: [0, -60, 0], rotate: 180 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))' }}
                ></motion.div>

                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}>
                </div>

                <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/[0.04] dark:bg-grid-slate-800/[0.08] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-15" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        d="M0,150 Q100,80 200,250 Q300,420 400,320 T600,420"
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        fill="none"
                        animate={{ strokeDashoffset: [800, 0] }}
                        style={{ strokeDasharray: 800 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
                            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 3.5L32.5 11.3v15.4L20 34.5 7.5 26.7V11.3L20 3.5z\' stroke=\'%236366f1\' fill=\'none\' stroke-width=\'1\'/%3E%3C/svg%3E")',
                        backgroundSize: '40px 40px'
                    }}>
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100 transition-colors mb-6 group"
                >
                    <div className="flex items-center justify-center w-7 h-7 mr-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-500/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/60 transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm">Back to Home</span>
                </Link>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="mb-8 text-center"
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center px-3 py-1 mb-3 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/70 dark:to-blue-900/70 border border-indigo-200 dark:border-indigo-500/30 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/8 to-transparent -translate-x-full animate-[shine_3s_infinite]"></div>
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mr-1.5" />
                            <span className="text-indigo-700 dark:text-indigo-300 font-medium text-xs">Limited AI Training Spots</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-400">AI Track</span> Application
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Join our Enterprise Empowerment Platform and accelerate your AI development journey with cutting-edge tools and expert mentorship
                        </p>
                    </motion.div>

                    <motion.div
                        className="mb-8"
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-5 border border-indigo-200 dark:border-indigo-500/20 shadow-[0_0_15px_rgba(59,130,246,0.04)] dark:shadow-[0_0_15px_rgba(59,130,246,0.08)]">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-300/30 dark:shadow-indigo-900/30">
                                    <RocketIcon className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white ml-2.5">Application Journey</h2>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start relative">
                                <div className="hidden md:block absolute top-5 left-0 right-0 h-0.5">
                                    <div className="relative w-full h-full">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/30 via-blue-200/30 to-indigo-200/30 dark:from-indigo-500/15 dark:via-blue-500/15 dark:to-indigo-500/15"></div>
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                                        ></motion.div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center text-center mb-6 md:mb-0 w-full md:w-1/3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 dark:from-indigo-900 dark:to-indigo-700 flex items-center justify-center mb-3 border border-indigo-300 dark:border-indigo-500/30 shadow-lg shadow-indigo-200/30 dark:shadow-indigo-900/15 relative z-10">
                                        <div className="absolute inset-0 rounded-full bg-indigo-300/30 dark:bg-indigo-600/15 animate-ping opacity-75 duration-1000"></div>
                                        <Sparkles className="w-4 h-4 text-indigo-700 dark:text-indigo-300" />
                                    </div>
                                    <h3 className="text-indigo-700 dark:text-indigo-300 font-semibold text-base">Application Submission</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 max-w-[180px] mx-auto">Complete the form with your professional details and CV</p>
                                </div>

                                <div className="flex flex-col items-center text-center mb-6 md:mb-0 w-full md:w-1/3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-900 dark:to-blue-700 flex items-center justify-center mb-3 border border-blue-300 dark:border-blue-500/30 shadow-lg shadow-blue-200/30 dark:shadow-blue-900/15 relative z-10">
                                        <Clock className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                                    </div>
                                    <h3 className="text-blue-700 dark:text-blue-300 font-semibold text-base">Expert Review</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 max-w-[180px] mx-auto">2-week assessment of your application by our AI specialists</p>
                                </div>

                                <div className="flex flex-col items-center text-center w-full md:w-1/3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 dark:from-indigo-900 dark:to-indigo-700 flex items-center justify-center mb-3 border border-indigo-300 dark:border-indigo-500/30 shadow-lg shadow-indigo-200/30 dark:shadow-indigo-900/15 relative z-10">
                                        <BrainCircuit className="w-4 h-4 text-indigo-700 dark:text-indigo-300" />
                                    </div>
                                    <h3 className="text-indigo-700 dark:text-indigo-300 font-semibold text-base">AI Program Access</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 max-w-[180px] mx-auto">Begin your journey with our enterprise-grade AI tools and mentorship</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="relative z-20 mb-8"
                    >
                        <LearnerApplicationForm />
                    </motion.div>

                    <motion.div
                        className="text-center"
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <div className="p-5 rounded-xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-indigo-200 dark:border-indigo-500/20 inline-block">
                            <h3 className="text-base font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Have questions?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Our team is ready to assist you with the application process</p>
                            <Button
                                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm h-9"
                                asChild
                            >
                                <a href="mailto:info@hitoai.ai" className="inline-flex items-center">
                                    Contact Us
                                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
            `}</style>
        </main>
    );
}