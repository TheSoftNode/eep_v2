"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Partner {
    image: string;
    name: string;
}

export const PartnersSection: React.FC = () => {
    // Partners data based on your actual files
    const partners: Partner[] = [
        { image: "/partners/google.jpeg", name: "Google" },
        { image: "/partners/intercom.jpeg", name: "Intercom" },
        { image: "/partners/microsoft.png", name: "Microsoft" },
        { image: "/partners/mongo.jpeg", name: "MongoDB" },
        { image: "/partners/aws.jpg", name: "AWS" },
        { image: "/partners/biasadra.jpg", name: "Biasadra" },
        { image: "/partners/github.jpeg", name: "GitHub" },
    ];

    const [duplicatedPartners, setDuplicatedPartners] = useState<Partner[]>([]);

    useEffect(() => {
        // Duplicate the partners array to create a seamless loop
        setDuplicatedPartners([...partners, ...partners, ...partners]);
    }, []);

    return (
        <section className="relative py-12 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:via-indigo-950/80 dark:to-slate-900 text-slate-800 dark:text-white">
            {/* Elegant top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20 dark:opacity-30"></div>

            {/* Subtle background details */}
            <div className="absolute inset-0 z-0">
                {/* Dot pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(99, 102, 241, 0.8) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                    }}
                ></div>

                {/* Center glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-b from-indigo-300/5 via-purple-300/3 to-transparent dark:from-indigo-500/10 dark:via-purple-600/5 dark:to-transparent blur-3xl"></div>

                {/* Light beam - dark mode only */}
                <div className="hidden dark:block absolute inset-0 overflow-hidden opacity-10">
                    <div className="absolute top-1/3 left-0 w-full h-24 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -skew-y-3 animate-shine-slow"></div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container relative z-10 mx-auto px-4 max-w-5xl">
                {/* Compact Section Heading */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Section tag line */}
                    <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-2">Our Partners</span>

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-0">
                        Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Industry Leaders</span>
                    </h2>
                </motion.div>

                {/* Streamlined Carousel */}
                <div className="w-full overflow-hidden mb-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <motion.div
                            className="flex items-center"
                            animate={{
                                x: [0, -120 * partners.length],
                            }}
                            transition={{
                                x: {
                                    duration: 30,
                                    repeat: Infinity,
                                    ease: "linear",
                                },
                            }}
                        >
                            {duplicatedPartners.map((partner, index) => (
                                <motion.div
                                    key={`carousel-${index}`}
                                    className="flex-shrink-0 mx-4"
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {/* Sleek minimalist card */}
                                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/50 p-2 rounded-lg shadow-sm dark:shadow-indigo-900/10 w-[150px] h-[80px] flex items-center justify-center group transition-all duration-300">
                                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                            {/* Top edge highlight */}
                                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent"></div>

                                            {/* Hover shine effect */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden">
                                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 skew-x-12"></div>
                                            </div>

                                            {/* Partner logo */}
                                            <img
                                                src={partner.image}
                                                alt={partner.name}
                                                className="max-w-[85%] max-h-[75%] w-auto h-auto object-contain transition-all duration-300 filter saturate-75 brightness-95 group-hover:saturate-100 group-hover:brightness-110 dark:brightness-90 dark:group-hover:brightness-120"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Optional compact CTA */}
                <div className="text-center">
                    <a href="/partners" className="inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                        <span>Become a Partner</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Elegant bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20 dark:opacity-30"></div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes shine-slow {
                    0% { transform: translateX(-100%) skewY(-3deg); }
                    100% { transform: translateX(100%) skewY(-3deg); }
                }
            `}</style>
        </section>
    );
};

export default PartnersSection;