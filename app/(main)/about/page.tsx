"use client"

import React, { FC, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Zap, Users, Lightbulb, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutSection: FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

    // Core benefits offered by the platform
    const coreBenefits = [
        {
            title: "AI-Assisted Guidance",
            description: "Leverage cutting-edge AI to receive personalized recommendations and insights throughout your development journey.",
            icon: <Lightbulb className="h-5 w-5" />,
            gradient: "from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500"
        },
        {
            title: "Expert Mentorship",
            description: "Connect with industry leaders who provide tailored advice and support for your specific business goals.",
            icon: <Users className="h-5 w-5" />,
            gradient: "from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500"
        },
        {
            title: "Integrated Project Management",
            description: "Streamline workflows with comprehensive tools designed to enhance productivity and collaboration.",
            icon: <Zap className="h-5 w-5" />,
            gradient: "from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-500"
        },
        {
            title: "Personalized Learning Paths",
            description: "Access customized resources and learning experiences to upskill your team efficiently.",
            icon: <Rocket className="h-5 w-5" />,
            gradient: "from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500"
        }
    ];

    // Key features that make the platform special
    const keyFeatures = [
        "Real-time collaboration tools",
        "AI-powered workspace guidance",
        "Interactive milestone tracking",
        "Data-driven decision making",
        "Step-by-step development assistance",
        "Customizable workflow templates",
        "Progress analytics and insights",
        "Resource optimization tools"
    ];

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    return (
        <div
            ref={sectionRef}
            className="relative py-20 flex flex-col items-center justify-center overflow-hidden 
                bg-gradient-to-b from-slate-50 via-slate-100/50 to-white 
                dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
        >
            {/* Sophisticated background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Subtle dot pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(99, 102, 241, 0.8) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                    }}
                ></div>

                {/* Glass morphism effect */}
                <div className="absolute inset-0 backdrop-blur-[50px]"></div>

                {/* Wave patterns */}
                <div className="absolute top-0 inset-x-0 h-40 overflow-hidden">
                    <svg className="absolute top-0 w-full h-full text-indigo-50 dark:text-indigo-900/30 transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
                    </svg>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-40 overflow-hidden">
                    <svg className="absolute bottom-0 w-full h-full text-indigo-50 dark:text-indigo-900/30" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
                    </svg>
                </div>

                {/* Geometric elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10 transform rotate-45 rounded-lg blur-xl"></div>
                    <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 transform -rotate-12 rounded-full blur-xl"></div>

                    {/* Subtle animated orbs - only visible in dark mode */}
                    <div className="hidden dark:block absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-indigo-600/5 animate-orb-float opacity-60"></div>
                    <div className="hidden dark:block absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-purple-600/5 animate-orb-float-delay opacity-60"></div>

                    {/* Light beam effect - only visible in dark mode */}
                    <div className="hidden dark:block absolute inset-0 overflow-hidden opacity-10">
                        <div className="light-beam light-beam-1"></div>
                    </div>

                    {/* Glowing lines */}
                    <div className="absolute top-40 left-1/3 w-64 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent rotate-[30deg]"></div>
                    <div className="absolute bottom-40 right-1/3 w-72 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent -rotate-[20deg]"></div>
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-4 w-full max-w-6xl mx-auto">
                {/* Main Content Card */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.1
                            }
                        }
                    }}
                    className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-50 dark:border-indigo-900/30 p-6 sm:p-8 mb-8"
                >
                    {/* About Section Header */}
                    <motion.div
                        variants={fadeInUp}
                        custom={0}
                        className="text-center mb-10"
                    >
                        {/* Enhanced badge */}
                        <div className="inline-flex items-center justify-center mb-3">
                            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 border border-indigo-100 dark:border-indigo-700/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-12 -translate-x-full animate-badge-shine"></div>

                                <div className="flex items-center">
                                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                                    <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">About Us</span>
                                </div>
                            </div>
                        </div>

                        <motion.h1
                            variants={fadeInUp}
                            custom={1}
                            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
                        >
                            <span>Enterprise </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Empowerment</span>
                            <span> Platform</span>
                        </motion.h1>

                        {/* Platform Description */}
                        <motion.div
                            variants={fadeInUp}
                            custom={2}
                            className="mx-auto max-w-3xl mb-6"
                        >
                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                                The Enterprise Empowerment Platform is designed to fast-track your innovation and
                                development journey through AI-assisted guidance and expert mentorship. Whether you're
                                building a startup, launching a product, or upskilling your team, this platform provides
                                a structured ecosystem that supports every step of your growth.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            custom={3}
                            className="mx-auto max-w-3xl"
                        >
                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                                With integrated project management tools, real-time collaboration features, and
                                personalized learning paths, you can streamline workflows, enhance productivity, and
                                make smarter decisions faster. Empower your enterprise with the tools and support
                                needed to turn ideas into impactful outcomes.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Core Benefits Section */}
                    <motion.div
                        variants={fadeInUp}
                        custom={4}
                        className="mb-12"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            Core
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400"> Benefits</span>
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {coreBenefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    custom={index + 5}
                                    className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg dark:shadow-slate-900/20 border border-indigo-50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-700/60 relative group overflow-hidden"
                                >
                                    {/* Subtle background glow on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-violet-50/0 dark:from-indigo-900/0 dark:to-violet-900/0 opacity-0 group-hover:opacity-100 group-hover:from-indigo-50/50 group-hover:to-violet-50/30 dark:group-hover:from-indigo-900/30 dark:group-hover:to-violet-900/20 transition-opacity duration-500 rounded-lg"></div>

                                    <div className="relative z-10">
                                        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br ${benefit.gradient} text-white mb-4 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-700/30`}>
                                            {benefit.icon}
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Key Features Section */}
                    <motion.div
                        variants={fadeInUp}
                        custom={9}
                        className="bg-gradient-to-br from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl p-6 border border-indigo-100/40 dark:border-indigo-700/30"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            Platform
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400"> Features</span>
                        </h2>

                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {keyFeatures.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    custom={i + 10}
                                    className="flex items-start p-3 bg-white/70 dark:bg-slate-800/60 rounded-lg border border-gray-100 dark:border-slate-700/50 shadow-sm dark:shadow-slate-900/10 group transition-all duration-300 hover:shadow-md dark:hover:shadow-slate-900/20"
                                    whileHover={{
                                        scale: 1.02,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <div className="flex-shrink-0 p-0.5 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200 dark:from-indigo-600 dark:to-violet-600 mr-2 group-hover:from-indigo-300 group-hover:to-violet-300 dark:group-hover:from-indigo-500 dark:group-hover:to-violet-500 transition-all duration-300">
                                        <div className="flex items-center justify-center h-3.5 w-3.5 rounded-full text-white bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                                            <CheckCircle className="h-2.5 w-2.5" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-200">{feature}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* CTA Card */}
                <motion.div
                    variants={fadeInUp}
                    custom={19}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-700 dark:to-violet-700 rounded-2xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden group"
                >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-transform duration-1500"></div>

                    {/* Particle effects for dark mode */}
                    <div className="hidden dark:block absolute inset-0 overflow-hidden">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                        <div className="mb-6 md:mb-0">
                            <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to empower your enterprise?</h2>
                            <p className="text-indigo-100 dark:text-indigo-200 text-sm">Start your journey with our platform today.</p>
                        </div>
                        <Button
                            className="whitespace-nowrap bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg relative group overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center">
                                Get Started
                                <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                            </span>
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-indigo-50 to-white transition-transform duration-300"></div>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes badge-shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
                
                @keyframes orb-float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                
                @keyframes orb-float-delay {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(20px) scale(1.05); }
                }
                
                .animate-badge-shine {
                    animation: badge-shine 3s infinite;
                }
                
                .animate-orb-float {
                    animation: orb-float 12s ease-in-out infinite;
                }
                
                .animate-orb-float-delay {
                    animation: orb-float-delay 15s ease-in-out infinite;
                }
                
                /* Light beam effect for dark mode */
                .light-beam {
                    position: absolute;
                    width: 150%;
                    height: 80px;
                    transform-origin: center;
                }
                
                .light-beam-1 {
                    top: 40%;
                    left: -25%;
                    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
                    transform: rotate(-10deg);
                    animation: beam-move 30s linear infinite;
                }
                
                @keyframes beam-move {
                    0% { transform: translateX(-100%) rotate(-10deg); }
                    100% { transform: translateX(100%) rotate(-10deg); }
                }
                
                /* Particles for CTA */
                .particle {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    pointer-events: none;
                }
                
                .particle-1 {
                    width: 100px;
                    height: 100px;
                    top: -30px;
                    left: 10%;
                    animation: float 15s ease-in-out infinite;
                }
                
                .particle-2 {
                    width: 60px;
                    height: 60px;
                    top: 20%;
                    right: 15%;
                    animation: float 20s ease-in-out infinite 5s;
                }
                
                .particle-3 {
                    width: 40px;
                    height: 40px;
                    bottom: -10px;
                    left: 30%;
                    animation: float 12s ease-in-out infinite 2s;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-10px) translateX(10px); }
                    50% { transform: translateY(15px) translateX(-10px); }
                    75% { transform: translateY(5px) translateX(15px); }
                }
            `}</style>
        </div>
    );
};

export default AboutSection;