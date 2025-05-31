"use client"

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { testimonials } from '@/data/eep-data';

export const TestimonialsSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [displayCount, setDisplayCount] = useState(3); // Default to desktop view
    const [isHovered, setIsHovered] = useState(false);

    // The threshold for swipe detection
    const minSwipeDistance = 50;

    // Animation variants for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        }),
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const testimonialElements = document.querySelectorAll('.testimonial-card');
        testimonialElements.forEach(el => observer.observe(el));

        // Use disconnect() instead for safer cleanup
        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        // This code only runs in the browser after component mounts
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setDisplayCount(1); // Mobile: show 1
            } else if (window.innerWidth < 1024) {
                setDisplayCount(2); // Tablet: show 2
            } else {
                setDisplayCount(3); // Desktop: show 3
            }
        };

        // Set initial value
        handleResize();

        // Add event listener for window resizing
        window.addEventListener('resize', handleResize);

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Touch event handlers for swipe functionality
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        }
        if (isRightSwipe) {
            goToPrevious();
        }

        // Reset values
        setTouchStart(0);
        setTouchEnd(0);
    };

    // Calculate displayed testimonials
    const displayedTestimonials = [];
    for (let i = 0; i < displayCount; i++) {
        const index = (currentIndex + i) % testimonials.length;
        displayedTestimonials.push(testimonials[index]);
    }

    return (
        <section
            id="testimonials"
            ref={sectionRef}
            className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/50 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Sophisticated background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Subtle patterns */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23667eea' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                ></div>

                {/* Soft gradient blobs */}
                <div className="absolute -right-40 top-20 w-1/2 h-1/2 bg-gradient-to-br from-indigo-100/10 via-purple-100/5 to-transparent dark:from-indigo-600/5 dark:via-purple-500/5 dark:to-transparent rounded-full blur-3xl"></div>
                <div className="absolute -left-40 bottom-20 w-1/2 h-1/2 bg-gradient-to-tr from-violet-100/10 via-pink-100/5 to-transparent dark:from-violet-600/5 dark:via-pink-500/5 dark:to-transparent rounded-full blur-3xl"></div>

                {/* Advanced wave patterns */}
                <div className="absolute inset-x-0 top-0 h-40 overflow-hidden">
                    <svg className="absolute top-0 w-full h-full text-indigo-50 dark:text-indigo-900/30 transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
                    </svg>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-40 overflow-hidden">
                    <svg className="absolute bottom-0 w-full h-full text-indigo-50 dark:text-indigo-900/30" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
                    </svg>
                </div>

                {/* Elegant floating quote marks */}
                <div className="absolute top-20 left-10 text-indigo-100 dark:text-indigo-900/30 animate-float-slow opacity-50">
                    <Quote size={120} strokeWidth={1.5} />
                </div>
                <div className="absolute bottom-20 right-10 text-indigo-100 dark:text-indigo-900/30 animate-float-slow-reverse opacity-50 transform rotate-180">
                    <Quote size={120} strokeWidth={1.5} />
                </div>

                {/* Light effect beams - visible in dark mode */}
                <div className="hidden dark:block absolute inset-0 opacity-10">
                    <div className="light-beam light-beam-1"></div>
                    <div className="light-beam light-beam-2"></div>
                </div>


            </div>

            <div className="container px-4 lg:px-8 mx-auto relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
                    {/* Enhanced section title with badge */}
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 border border-indigo-100 dark:border-indigo-700/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-12 -translate-x-full animate-badge-shine"></div>

                            <div className="flex items-center">
                                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                                <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">User Testimonials</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4 tracking-tight">
                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Users Say</span>
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Don't just take our word for it — hear from developers and businesses who have transformed their work with EEP.
                    </p>
                </div>

                {/* Enhanced slider container */}
                <div
                    className="slider-container max-w-6xl mx-auto mb-12 relative"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Improved navigation buttons */}
                    <button
                        onClick={goToPrevious}
                        className={`slider-navigation absolute z-20 left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-full p-2 md:p-3 shadow-lg dark:shadow-slate-800/50 border border-slate-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 focus:ring-offset-2 transform transition-all duration-300 ${isHovered ? 'opacity-100 scale-100 md:-translate-x-2' : 'opacity-70 md:opacity-50 scale-90 md:-translate-x-0'}`}
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={goToNext}
                        className={`slider-navigation absolute z-20 right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-full p-2 md:p-3 shadow-lg dark:shadow-slate-800/50 border border-slate-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 focus:ring-offset-2 transform transition-all duration-300 ${isHovered ? 'opacity-100 scale-100 md:translate-x-2' : 'opacity-70 md:opacity-50 scale-90 md:translate-x-0'}`}
                        aria-label="Next testimonial"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Testimonials with improved styling */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`testimonials-page-${currentIndex}`}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {displayedTestimonials.map((testimonial, index) => (
                                <motion.div
                                    key={`testimonial-card-${currentIndex}-${index}`}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className={`testimonial-card rounded-xl overflow-hidden transform transition-all duration-500 bg-white dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-xl dark:hover:shadow-slate-700/10 group`}
                                    style={{
                                        boxShadow: '0 10px 40px -15px rgba(99, 102, 241, 0.1)'
                                    }}
                                >
                                    {/* Elegant gradient border at top */}
                                    <div className={`h-1.5 bg-gradient-to-r ${testimonial.gradient}`}></div>

                                    <div className="p-6 md:p-7 pb-4">
                                        {/* Author information with avatar */}
                                        <div className="flex justify-between items-center mb-5">
                                            <div className="flex items-center">
                                                <div className="relative mr-3">
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 dark:from-indigo-500 dark:to-violet-600 opacity-70 blur-[2px] -m-0.5"></div>
                                                    <img
                                                        src={testimonial.avatar}
                                                        alt={testimonial.author}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 relative z-10"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 z-10">
                                                        <div className={`quote-icon rounded-full p-1 ${testimonial.iconColor} dark:bg-opacity-90`}>
                                                            <Quote size={10} className="text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{testimonial.author}</h4>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs">{testimonial.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={13} className="text-amber-400 dark:text-amber-300 fill-amber-400 dark:fill-amber-300" />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Testimonial content with styled quotes */}
                                        <div className="relative">
                                            <Quote size={50} className="absolute -top-2 -left-2 text-indigo-100 dark:text-slate-700 opacity-40" />
                                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed relative z-10 pl-3 md:pl-4">
                                                {testimonial.content}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Subtle card footer with company info if available */}
                                    {/* {testimonial.company && (
                                        <div className="px-6 md:px-7 py-3 border-t border-slate-100 dark:border-slate-700/30 mt-2">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                                                Verified {testimonial.company} customer
                                            </p>
                                        </div>
                                    )} */}
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Enhanced pagination dots */}
                <div className="flex justify-center items-center space-x-2 mb-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`pagination-dot ${index === currentIndex
                                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 active dark:from-indigo-500 dark:to-violet-600'
                                : 'bg-indigo-200 dark:bg-slate-700'}`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>

                {/* View all testimonials link */}
                <div className="text-center">
                    <a
                        href="#all-testimonials"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                        View all testimonials
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </a>
                </div>
            </div>

            {/* Add animation for badge shine */}
            <style jsx>{`
                @keyframes badge-shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
                .animate-badge-shine {
                    animation: badge-shine 3s infinite;
                }
            `}</style>
        </section>
    );
};


{/* Animation keyframes */ }
<style jsx>{`
    @keyframes float-slow {
        0%, 100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-15px) rotate(3deg); }
    }
    
    @keyframes float-slow-reverse {
        0%, 100% { transform: translateY(0) rotate(180deg); }
        50% { transform: translateY(15px) rotate(183deg); }
    }
    
    @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.8; }
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-150%); }
        100% { transform: translateX(150%); }
    }
    
    .testimonial-card {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out, box-shadow 0.3s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .float-slow {
        animation: float-slow 6s ease-in-out infinite;
    }
    
    .float-slow-reverse {
        animation: float-slow-reverse 7s ease-in-out infinite;
    }
    
    .quote-icon {
        position: relative;
        overflow: hidden;
    }
    
    .quote-icon::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 100%;
        background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
        transform: translateX(-150%);
    }
    
    .testimonial-card:hover .quote-icon::before {
        animation: shimmer 2.5s forwards;
    }
    
    /* Light beam effect for dark mode */
    .light-beam {
        position: absolute;
        width: 150%;
        height: 100px;
        transform-origin: center;
    }
    
    .light-beam-1 {
        top: 25%;
        left: -25%;
        background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
        transform: rotate(-15deg);
        animation: beam-move-1 20s linear infinite;
    }
    
    .light-beam-2 {
        top: 65%;
        left: -25%;
        background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.05), transparent);
        transform: rotate(10deg);
        animation: beam-move-2 25s linear infinite;
    }
    
    @keyframes beam-move-1 {
        0% { transform: translateX(-100%) rotate(-15deg); }
        100% { transform: translateX(100%) rotate(-15deg); }
    }
    
    @keyframes beam-move-2 {
        0% { transform: translateX(-100%) rotate(10deg); }
        100% { transform: translateX(100%) rotate(10deg); }
    }
    
    .slider-container {
        position: relative;
        overflow: visible;
    }
    
    .slider-navigation {
        transition: all 0.3s ease;
    }
    
    .pagination-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .pagination-dot.active {
        width: 24px;
        border-radius: 4px;
    }
`}</style>