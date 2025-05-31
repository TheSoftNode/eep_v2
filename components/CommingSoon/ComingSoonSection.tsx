"use client"

import React, { useEffect, useState, FC, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, CheckCircle, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/config';

interface ComingSoonSectionProps {
    title?: string;
    description?: string;
    launchDateString?: string;
    features?: string[];
    showCountdown?: boolean;
    showSubscribe?: boolean;
    badgeText?: string;
}

const ComingSoonSection: FC<ComingSoonSectionProps> = ({
    title = "Coming Soon",
    description = "We're working hard to bring you this feature. Our team is developing something amazing that will transform your development experience.",
    launchDateString = "2025-04-30T00:00:00",
    features = [
        "AI-powered workspace & project guidance",
        "Interactive milestone tracking",
        "Real-time mentor interaction",
        "Step-by-step development assistance"
    ],
    showCountdown = true,
    showSubscribe = true,
    badgeText = "Under Development"
}) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
    const [email, setEmail] = useState<string>('');
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [scrollProgress, setScrollProgress] = useState(0);

    // Parse the launch date from the string
    const launchDateValue = new Date(launchDateString).getTime();

    // Track scroll for parallax effects
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

    useEffect(() => {
        const calculateTimeLeft = (): void => {
            const now = new Date().getTime();
            const difference = launchDateValue - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        // Initial calculation
        calculateTimeLeft();

        // Update every second
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [launchDateValue]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        // Basic validation
        if (!email) {
            setSubscriptionError('Please enter your email address');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSubscriptionError('Please enter a valid email address');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubscriptionError(null);

            // Make API call to subscribe endpoint
            const response = await axios.post(`${API_URL}/newsletter/subscribe`, {
                email
            });

            if (response.data.status === 'success') {
                setIsSubscribed(true);
                setEmail('');
            } else {
                setSubscriptionError('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);

            // Check if it's an axios error with a response
            if (axios.isAxiosError(error) && error.response) {
                // Use error message from server if available
                setSubscriptionError(error.response.data?.message || 'Failed to subscribe. Please try again later.');
            } else {
                setSubscriptionError('Failed to subscribe. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
        <section
            ref={sectionRef}
            className="relative py-16 md:py-20 lg:py-24  flex flex-col items-center justify-center min-h-[90vh] overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/80 dark:from-[#080c1f] dark:via-[#0c1230] dark:to-[#111634]"
        >
            {/* Unique Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Subtle mesh gradients */}
                <div
                    className="absolute inset-0 opacity-10 dark:opacity-20"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 75% 25%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 25% 75%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)
                        `,
                        backgroundSize: '100% 100%'
                    }}
                ></div>

                {/* Blueprint-style grid */}
                <div className="absolute inset-0 bg-grid-indigo-100/[0.03] dark:bg-grid-indigo-700/[0.02] bg-[size:30px_30px]"></div>

                {/* Accent lines */}
                <div
                    className="absolute -left-40 top-1/4 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-indigo-300/20 dark:via-indigo-500/10 to-transparent"
                    style={{
                        transform: `rotate(${10 + scrollProgress * 5}deg)`
                    }}
                ></div>
                <div
                    className="absolute -right-40 bottom-1/4 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-violet-300/20 dark:via-violet-500/10 to-transparent"
                    style={{
                        transform: `rotate(${-10 - scrollProgress * 5}deg)`
                    }}
                ></div>

                {/* Floating orbs with blur */}
                <div
                    className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full bg-gradient-to-br from-indigo-200/20 to-violet-200/10 dark:from-indigo-700/10 dark:to-violet-700/5 blur-3xl pointer-events-none"
                    style={{
                        transform: `translate(${Math.sin(scrollProgress * Math.PI) * 40}px, ${Math.cos(scrollProgress * Math.PI) * 40}px)`
                    }}
                ></div>
                <div
                    className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-tr from-purple-200/20 to-indigo-200/10 dark:from-purple-700/10 dark:to-indigo-700/5 blur-3xl pointer-events-none"
                    style={{
                        transform: `translate(${Math.cos(scrollProgress * Math.PI) * 40}px, ${Math.sin(scrollProgress * Math.PI) * 40}px)`
                    }}
                ></div>

                {/* Dynamic circuit-like pattern (light mode only) */}
                <div className="hidden dark:block absolute inset-0 overflow-hidden opacity-20">
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                            d="M0,0 L100,0 L100,100 L0,100 Z"
                            fill="none"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,4"
                        />
                        {/* Horizontal lines */}
                        <path
                            d="M0,25 L100,25"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,8"
                        />
                        <path
                            d="M0,50 L100,50"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,6"
                        />
                        <path
                            d="M0,75 L100,75"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,8"
                        />

                        {/* Vertical lines */}
                        <path
                            d="M25,0 L25,100"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,8"
                        />
                        <path
                            d="M50,0 L50,100"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,6"
                        />
                        <path
                            d="M75,0 L75,100"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,8"
                        />

                        {/* Diagonal accents */}
                        <path
                            d="M0,0 L100,100"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,10"
                        />
                        <path
                            d="M100,0 L0,100"
                            stroke="url(#circuit-gradient)"
                            strokeWidth="0.1"
                            strokeDasharray="1,10"
                        />

                        <defs>
                            <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Light beam effect - only visible in dark mode */}
                <div className="hidden dark:block absolute inset-0 overflow-hidden opacity-10">
                    <div className="light-beam light-beam-1"></div>
                </div>

                {/* Unique borders */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-600 to-transparent opacity-20"></div>

                {/* Wave top element */}
                <div className="absolute top-0 inset-x-0 h-24 overflow-hidden">
                    <svg
                        className="absolute w-full"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0 L1200,0 C1050,90 750,120 0,60 Z"
                            className="fill-white/50 dark:fill-[#111634]/50"
                        ></path>
                    </svg>
                </div>

                {/* Animated particles (dark mode only) */}
                <div className="hidden dark:block">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                </div>
            </div>

            {/* Main Content */}
            <motion.div
                className="relative z-10 px-4 w-full max-w-3xl mx-auto"
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
            >
                <motion.div
                    variants={fadeInUp}
                    custom={0}
                    className="bg-white/60 dark:bg-slate-800/20 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100/50 dark:border-indigo-500/20 overflow-hidden"
                >
                    {/* Decorative top gradient border */}
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    <div className="p-8 sm:p-10">
                        {/* Heading with status badge */}
                        <motion.div
                            variants={fadeInUp}
                            custom={1}
                            className="text-center mb-8"
                        >
                            {/* Unique badge design */}
                            <div className="inline-flex items-center mb-4">
                                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-indigo-50/80 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-12 -translate-x-full animate-badge-shine"></div>

                                    <div className="flex items-center">
                                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                                        <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">{badgeText}</span>
                                    </div>
                                </div>
                            </div>

                            <motion.h1
                                variants={fadeInUp}
                                custom={2}
                                className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3"
                            >
                                {title.split(' ').map((word, i, arr) =>
                                    i === arr.length - 1 ?
                                        <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">{word}</span> :
                                        <span key={i}>{word + ' '}</span>
                                )}
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                custom={3}
                                className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto text-sm sm:text-base"
                            >
                                {description}
                            </motion.p>
                        </motion.div>

                        {/* Countdown Timer */}
                        {showCountdown && (
                            <motion.div
                                variants={fadeInUp}
                                custom={4}
                                className="grid grid-cols-4 gap-2 sm:gap-3 mb-10"
                            >
                                {[
                                    { label: 'Days', value: timeLeft.days },
                                    { label: 'Hours', value: timeLeft.hours },
                                    { label: 'Minutes', value: timeLeft.minutes },
                                    { label: 'Seconds', value: timeLeft.seconds }
                                ].map((item, index) => (
                                    <div key={index} className="bg-white/80 dark:bg-slate-800/50 rounded-lg p-3 text-center border border-indigo-100/40 dark:border-indigo-700/30 relative overflow-hidden group">
                                        {/* Subtle hover glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 via-violet-400/0 to-transparent group-hover:from-indigo-400/5 group-hover:via-violet-400/5 transition-colors duration-300"></div>

                                        {/* Only in dark mode: animated pulse ring */}
                                        <div className="absolute inset-0 -z-10 hidden dark:block">
                                            <div className="absolute inset-0 scale-0 rounded-lg bg-indigo-500/10 animate-ping-slow opacity-0 group-hover:opacity-100"></div>
                                        </div>

                                        <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                                            {String(item.value).padStart(2, '0')}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">
                                            {item.label}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Feature Highlights */}
                        {features.length > 0 && (
                            <motion.div
                                variants={fadeInUp}
                                custom={5}
                                className="mb-10"
                            >
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center mb-4">
                                    <span className="w-6 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 mr-2"></span>
                                    What to expect
                                    <span className="w-6 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 ml-2"></span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            variants={fadeInUp}
                                            custom={i + 6}
                                            className="flex items-start p-3 bg-white/80 dark:bg-slate-800/40 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-colors duration-300 group"
                                        >
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-sm shadow-indigo-500/20 dark:shadow-indigo-500/10">
                                                <CheckCircle className="h-3 w-3 text-white" />
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{feature}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Notification Form */}
                        {showSubscribe && !isSubscribed ? (
                            <motion.div
                                variants={fadeInUp}
                                custom={10}
                                className="bg-white dark:bg-slate-800/60 rounded-xl p-5 border border-indigo-100/40 dark:border-indigo-700/30 shadow-sm relative overflow-hidden"
                            >
                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/5 dark:via-white/10 to-transparent skew-x-12 transition-transform duration-1500"></div>

                                <form onSubmit={handleSubmit}>
                                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                                        <Bell className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                                        Get notified when we launch
                                    </h3>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-grow group">
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="flex-grow text-sm border-indigo-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-700/30 focus:border-indigo-300 dark:focus:border-indigo-600 pr-9 transition-all duration-300"
                                                required
                                                disabled={isSubmitting}
                                            />
                                            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-focus-within:w-full transition-all duration-300 rounded-b-lg"></div>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="whitespace-nowrap text-white text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 hover:from-indigo-700 hover:to-violet-700 dark:hover:from-indigo-600 dark:hover:to-violet-600 transition-all duration-300 relative overflow-hidden group"
                                            disabled={isSubmitting}
                                        >
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000"></div>

                                            <span className="relative z-10 flex items-center">
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="mr-2">Subscribing</span>
                                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    </>
                                                ) : (
                                                    <>
                                                        Notify Me
                                                        <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </div>
                                    {subscriptionError && (
                                        <div className="mt-2 flex items-start text-xs text-red-500 dark:text-red-400">
                                            <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0 mt-0.5" />
                                            <span>{subscriptionError}</span>
                                        </div>
                                    )}
                                </form>
                            </motion.div>
                        ) : showSubscribe && isSubscribed ? (
                            <motion.div
                                variants={fadeInUp}
                                custom={10}
                                className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-100 dark:border-green-700/30 text-center"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-base font-semibold text-green-800 dark:text-green-300 mb-1">Thanks for subscribing!</h3>
                                    <p className="text-sm text-green-600 dark:text-green-400">We'll notify you as soon as we launch.</p>
                                </div>
                            </motion.div>
                        ) : null}
                    </div>
                </motion.div>
            </motion.div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes badge-shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
                
                .animate-badge-shine {
                    animation: badge-shine 3s infinite;
                }
                
                @keyframes ping-slow {
                    0%, 100% { transform: scale(1); opacity: 0; }
                    25% { opacity: 0.1; }
                    50% { transform: scale(1.8); opacity: 0; }
                }
                
                .animate-ping-slow {
                    animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                /* Particle animations */
                .particle {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.2);
                    pointer-events: none;
                }
                
                .particle-1 {
                    width: 2px;
                    height: 2px;
                    top: 20%;
                    left: 20%;
                    animation: float-particle 20s linear infinite;
                }
                
                .particle-2 {
                    width: 3px;
                    height: 3px;
                    top: 40%;
                    left: 70%;
                    animation: float-particle 25s linear infinite;
                }
                
                .particle-3 {
                    width: 2px;
                    height: 2px;
                    top: 70%;
                    left: 30%;
                    animation: float-particle 22s linear infinite;
                }
                
                .particle-4 {
                    width: 2px;
                    height: 2px;
                    top: 80%;
                    left: 80%;
                    animation: float-particle 28s linear infinite;
                }
                
                @keyframes float-particle {
                    0% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-50px) translateX(50px); }
                    50% { transform: translateY(0) translateX(100px); }
                    75% { transform: translateY(50px) translateX(50px); }
                    100% { transform: translateY(0) translateX(0); }
                }
                
                /* Light beam effect for dark mode */
                .light-beam {
                    position: absolute;
                    width: 150%;
                    height: 100px;
                    transform-origin: center;
                }
                
                .light-beam-1 {
                    top: 40%;
                    left: -25%;
                    background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.05), transparent);
                    transform: rotate(-10deg);
                    animation: beam-move 30s linear infinite;
                }
                
                @keyframes beam-move {
                    0% { transform: translateX(-100%) rotate(-10deg); }
                    100% { transform: translateX(100%) rotate(-10deg); }
                }
            `}</style>
        </section>
    );
};

export default ComingSoonSection;