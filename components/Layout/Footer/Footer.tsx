"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import Logo from '@/components/Shared/Logo/Logo';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { useSubscribeToNewsletterMutation } from '@/Redux/apiSlices/communication/communicationApi';

const RefinedFooter: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState('');
    const { toast } = useToast();

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // RTK Query mutation
    const [subscribeToNewsletter, { isLoading: isSubmitting }] = useSubscribeToNewsletterMutation();

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

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        // Clear any existing status when user starts typing
        if (subscriptionStatus) {
            setSubscriptionStatus('');
        }
    };

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Basic validation
        if (!email.trim()) {
            setSubscriptionStatus('Please enter your email address');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSubscriptionStatus('Please enter a valid email address');
            return;
        }

        try {
            const result = await subscribeToNewsletter({ email: email.trim() }).unwrap();

            // Success
            setSubscriptionStatus('Thank you for subscribing!');
            setEmail('');

            toast({
                title: "Successfully Subscribed!",
                description: "You'll receive our latest updates and features directly in your inbox.",
                variant: "default",
            });

            console.log('Newsletter subscription successful:', result);
        } catch (error: any) {
            console.error('Newsletter subscription error:', error);

            let errorMessage = 'Failed to subscribe. Please try again later.';

            // Handle specific error cases
            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.status === 409) {
                errorMessage = 'You are already subscribed to our newsletter.';
            } else if (error?.status === 400) {
                errorMessage = 'Please check your email address and try again.';
            }

            setSubscriptionStatus(errorMessage);

            toast({
                title: "Subscription Failed",
                description: errorMessage,
                variant: "destructive",
            });
        }

        // Clear status message after 5 seconds
        setTimeout(() => {
            setSubscriptionStatus('');
        }, 5000);
    };

    const getCurrentYear = () => new Date().getFullYear();

    // Using the exact same links from the original footer
    const footerLinks = [
        {
            title: "Platform",
            links: [
                { label: "Features", href: "/#features" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Documentation", href: "/documentation" },
                { label: "API", href: "/api-reference" },
                { label: "AI Workspace", href: "/ai-workspace", isNew: true }
            ]
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" }
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms" }
            ]
        }
    ];

    return (
        <footer className="relative py-8 overflow-hidden isolate">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b dark:from-slate-900 dark:to-[#050816] from-slate-50 to-slate-100"></div>
                <div className="absolute inset-0 dark:bg-grid-slate-700/[0.03] bg-grid-slate-300/[0.08] bg-[size:20px_20px] opacity-40"></div>

                {/* Gradient Blobs */}
                <div
                    className="absolute -right-40 -top-40 w-80 h-80 rounded-full dark:bg-indigo-600/5 bg-indigo-600/3 blur-3xl"
                    style={{
                        transform: `translate(${Math.sin(scrollProgress * Math.PI) * 15}px, ${Math.cos(scrollProgress * Math.PI) * 15}px)`
                    }}
                ></div>
                <div
                    className="absolute -left-40 top-1/2 w-64 h-64 rounded-full dark:bg-pink-600/5 bg-pink-600/3 blur-3xl"
                    style={{
                        transform: `translate(${Math.cos(scrollProgress * Math.PI) * 15}px, ${Math.sin(scrollProgress * Math.PI) * 15}px)`
                    }}
                ></div>

                {/* Light Beam */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-gradient-to-r from-transparent dark:via-indigo-600/3 via-indigo-600/2 to-transparent blur-2xl"
                    style={{ transform: `rotate(${scrollProgress * 30}deg)` }}
                ></div>

                {/* Radial Gradient */}
                <div className="absolute inset-0 bg-radial-gradient"></div>
            </div>

            {/* Top Border */}
            <div className="absolute top-0 inset-x-0">
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-600/30 to-transparent"></div>
                <svg viewBox="0 0 1440 8" fill="none" preserveAspectRatio="none" className="w-full h-2">
                    <path
                        d="M0,0 L1440,0 C1296,8 144,8 0,0 Z"
                        className="dark:fill-slate-800/30 fill-slate-300/30"
                    />
                </svg>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-6 lg:gap-x-8">
                    {/* Logo and Contact Column */}
                    <div className="md:col-span-4 lg:col-span-4">
                        <div className="flex flex-col">
                            {/* Logo Section */}
                            <div className="flex items-center mb-3">
                                {isDark ? (
                                    <Logo variant='light' size="sm" showText={false} animate={false} />
                                ) : (
                                    <Logo variant="dark" size="sm" showText={false} animate={false} />
                                )}
                                <div className="ml-3">
                                    <div className="flex items-center">
                                        <span className="text-xl font-bold text-indigo-700">EEP</span>
                                    </div>
                                    <span className="text-xs text-slate-400">Enterprise Empowerment Platform</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs dark:text-slate-400 text-slate-600 max-w-xs mb-4">
                                The Enterprise Empowerment Platform elevates developer potential through
                                AI-assisted guidance, structured project workflows, and real-time expert mentorship.
                            </p>

                            {/* Contact Information - More compact */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 flex items-center justify-center rounded-md dark:bg-slate-800/70 bg-slate-200/70 dark:border-slate-700/30 border-slate-200/70 border">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 dark:text-indigo-400 text-indigo-600">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <a href="tel:+353899832147" className="dark:text-slate-300 text-slate-600 text-xs ml-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">+353 89 983 2147</a>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-7 h-7 flex items-center justify-center rounded-md dark:bg-slate-800/70 bg-slate-200/70 dark:border-slate-700/30 border-slate-200/70 border">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 dark:text-indigo-400 text-indigo-600">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <a href="mailto:info@hitoai.ai" className="dark:text-slate-300 text-slate-600 text-xs ml-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">info@hitoai.ai</a>
                                </div>
                            </div>

                            {/* Social Links - More compact */}
                            <div className="pt-3 border-t dark:border-slate-700/30 border-slate-200/70">
                                <div className="flex space-x-3">
                                    <motion.a
                                        href="https://www.linkedin.com/company/hitoai-limited/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -2 }}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                    >
                                        <Linkedin className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                    </motion.a>
                                    <motion.a
                                        href="https://www.f6s.com/company/hitoai.ai/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -2 }}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                    >
                                        <img
                                            src={"/socials/f6s-logo.png"}
                                            alt="F6S"
                                            className="h-5 w-5"
                                        />
                                    </motion.a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid - More compact */}
                    <div className="md:col-span-8 lg:col-span-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {footerLinks.map((column, idx) => (
                                <div key={idx} className="col-span-1">
                                    <h3 className="text-sm font-semibold dark:text-white text-slate-800 mb-2 flex items-center">
                                        <span className="w-1 h-3.5 bg-gradient-to-b from-indigo-600 to-pink-600/50 rounded-full mr-2"></span>
                                        {column.title}
                                    </h3>
                                    <ul className="space-y-1.5">
                                        {column.links.map((link, linkIdx) => (
                                            <li key={linkIdx}>
                                                <motion.a
                                                    href={link.href}
                                                    className={`text-xs dark:text-slate-400 text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center group ${link.isNew ? 'mt-1' : ''}`}
                                                    whileHover={{ x: 2 }}
                                                >
                                                    {link.isNew ? (
                                                        <span className="dark:text-white text-white bg-gradient-to-r from-indigo-500 to-indigo-600 px-2 py-0.5 text-xs rounded-full inline-flex items-center">
                                                            <span className="mr-1 text-[0.65rem]">New</span>
                                                            <span className="text-[0.65rem]">{link.label}</span>
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <span className="w-1 h-1 bg-indigo-500/50 rounded-full mr-1.5 group-hover:bg-indigo-400 transition-colors"></span>
                                                            {link.label}
                                                        </>
                                                    )}
                                                </motion.a>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Newsletter Section - Improved for mobile */}
                                    {column.title === "Legal" && (
                                        <div className="mt-4 pt-2 border-t dark:border-slate-700/30 border-slate-200/70">
                                            <h4 className="text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-2">Stay Updated</h4>
                                            <form onSubmit={handleSubscribe} className="relative">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex relative">
                                                        <input
                                                            type="email"
                                                            placeholder="Your email"
                                                            className="bg-white dark:bg-slate-800/50 dark:border-slate-700/50 border-slate-200/60 border rounded-lg py-1.5 pl-2.5 pr-9 text-xs dark:text-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-full"
                                                            value={email}
                                                            onChange={handleEmailChange}
                                                            disabled={isSubmitting}
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors disabled:opacity-50"
                                                            disabled={isSubmitting}
                                                            aria-label="Subscribe"
                                                        >
                                                            {isSubmitting ? (
                                                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                    {subscriptionStatus && (
                                                        <p className={`text-[0.65rem] mt-1 ${subscriptionStatus.includes('Thank you') || subscriptionStatus.includes('Successfully')
                                                                ? 'text-green-400'
                                                                : 'text-red-400'
                                                            }`}>
                                                            {subscriptionStatus}
                                                        </p>
                                                    )}
                                                    <p className="text-[0.65rem] dark:text-slate-400 text-slate-600">
                                                        Get notified about new features and updates.
                                                    </p>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-3 mt-5 mb-3 relative">
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-600/20 to-transparent"></div>
                </div>

                {/* Copyright Bar - More compact */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-1">
                    <div className="text-xs dark:text-slate-400 text-slate-600 mb-3 sm:mb-0 text-center sm:text-left">
                        &copy; {getCurrentYear()} EEP. Powered by HitoAI Limited. All rights reserved.
                    </div>

                    <div className="flex items-center flex-wrap justify-center sm:justify-end gap-3">
                        <select className="bg-white dark:bg-slate-800 dark:border-slate-700 border-slate-200 border rounded-md text-[0.65rem] dark:text-slate-300 text-slate-700 py-1 pl-2 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                        </select>

                        <div className="flex items-center text-[0.65rem] dark:text-slate-400 text-slate-600">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                            All systems operational
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-radial-gradient {
                    background-image: radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.03), transparent 60%);
                }
            `}</style>
        </footer>
    );
};

export default RefinedFooter;



// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Linkedin } from 'lucide-react';
// import Logo from '@/components/Shared/Logo/Logo';
// import { useTheme } from 'next-themes';
// import axios from 'axios';

// const RefinedFooter: React.FC = () => {
//     const [scrollProgress, setScrollProgress] = useState(0);
//     const [email, setEmail] = useState('');
//     const [subscriptionStatus, setSubscriptionStatus] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const API_URL = "https://localhost:5001/v1/eep";

//     const { theme } = useTheme();
//     const isDark = theme === 'dark';

//     // Track scroll for parallax effects
//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollY = window.scrollY;
//             const documentHeight = document.body.scrollHeight - window.innerHeight;
//             const progress = Math.min(scrollY / documentHeight, 1);
//             setScrollProgress(progress);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setEmail(e.target.value);
//     };

//     const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         // Basic validation
//         if (!email) {
//             setSubscriptionStatus('Please enter your email address');
//             return;
//         }

//         // Email format validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setSubscriptionStatus('Please enter a valid email address');
//             return;
//         }

//         try {
//             setIsSubmitting(true);
//             // Make API call to subscribe endpoint
//             const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });

//             if (response.data.status === 'success') {
//                 setSubscriptionStatus('Thank you for subscribing!');
//                 setEmail('');
//             }
//         } catch (error) {
//             console.error('Subscription error:', error);
//             setSubscriptionStatus('Failed to subscribe. Please try again later.');
//         } finally {
//             setIsSubmitting(false);

//             // Clear status message after 5 seconds
//             setTimeout(() => {
//                 setSubscriptionStatus('');
//             }, 5000);
//         }
//     };

//     const getCurrentYear = () => new Date().getFullYear();

//     // Using the exact same links from the original footer
//     const footerLinks = [
//         {
//             title: "Platform",
//             links: [
//                 { label: "Features", href: "/#features" },
//                 { label: "How It Works", href: "/#how-it-works" },
//                 { label: "Pricing", href: "/#pricing" },
//                 { label: "Documentation", href: "/documentation" },
//                 { label: "API", href: "/api-reference" },
//                 { label: "AI Workspace", href: "/ai-workspace", isNew: true }
//             ]
//         },
//         {
//             title: "Company",
//             links: [
//                 { label: "About Us", href: "/about" },
//                 { label: "Careers", href: "/careers" },
//                 { label: "Blog", href: "/blog" },
//                 { label: "Contact", href: "/contact" }
//             ]
//         },
//         {
//             title: "Legal",
//             links: [
//                 { label: "Privacy Policy", href: "/privacy-policy" },
//                 { label: "Terms of Service", href: "/terms" }
//             ]
//         }
//     ];

//     return (
//         <footer className="relative py-8 overflow-hidden isolate">
//             {/* Background Elements */}
//             <div className="absolute inset-0 -z-10">
//                 <div className="absolute inset-0 bg-gradient-to-b dark:from-slate-900 dark:to-[#050816] from-slate-50 to-slate-100"></div>
//                 <div className="absolute inset-0 dark:bg-grid-slate-700/[0.03] bg-grid-slate-300/[0.08] bg-[size:20px_20px] opacity-40"></div>

//                 {/* Gradient Blobs */}
//                 <div
//                     className="absolute -right-40 -top-40 w-80 h-80 rounded-full dark:bg-indigo-600/5 bg-indigo-600/3 blur-3xl"
//                     style={{
//                         transform: `translate(${Math.sin(scrollProgress * Math.PI) * 15}px, ${Math.cos(scrollProgress * Math.PI) * 15}px)`
//                     }}
//                 ></div>
//                 <div
//                     className="absolute -left-40 top-1/2 w-64 h-64 rounded-full dark:bg-pink-600/5 bg-pink-600/3 blur-3xl"
//                     style={{
//                         transform: `translate(${Math.cos(scrollProgress * Math.PI) * 15}px, ${Math.sin(scrollProgress * Math.PI) * 15}px)`
//                     }}
//                 ></div>

//                 {/* Light Beam */}
//                 <div
//                     className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-gradient-to-r from-transparent dark:via-indigo-600/3 via-indigo-600/2 to-transparent blur-2xl"
//                     style={{ transform: `rotate(${scrollProgress * 30}deg)` }}
//                 ></div>

//                 {/* Radial Gradient */}
//                 <div className="absolute inset-0 bg-radial-gradient"></div>
//             </div>

//             {/* Top Border */}
//             <div className="absolute top-0 inset-x-0">
//                 <div className="h-px bg-gradient-to-r from-transparent via-indigo-600/30 to-transparent"></div>
//                 <svg viewBox="0 0 1440 8" fill="none" preserveAspectRatio="none" className="w-full h-2">
//                     <path
//                         d="M0,0 L1440,0 C1296,8 144,8 0,0 Z"
//                         className="dark:fill-slate-800/30 fill-slate-300/30"
//                     />
//                 </svg>
//             </div>

//             {/* Main Content */}
//             <div className="container mx-auto px-4 sm:px-6 relative z-10">
//                 <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-6 lg:gap-x-8">
//                     {/* Logo and Contact Column */}
//                     <div className="md:col-span-4 lg:col-span-4">
//                         <div className="flex flex-col">
//                             {/* Logo Section */}
//                             <div className="flex items-center mb-3">
//                                 {isDark ? (
//                                     <Logo variant='light' size="sm" showText={false} animate={false} />
//                                 ) : (
//                                     <Logo variant="dark" size="sm" showText={false} animate={false} />
//                                 )}
//                                 <div className="ml-3">
//                                     <div className="flex items-center">
//                                         <span className="text-xl font-bold text-indigo-700">EEP</span>
//                                     </div>
//                                     <span className="text-xs text-slate-400">Enterprise Empowerment Platform</span>
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <p className="text-xs dark:text-slate-400 text-slate-600 max-w-xs mb-4">
//                                 The Enterprise Empowerment Platform elevates developer potential through
//                                 AI-assisted guidance, structured project workflows, and real-time expert mentorship.
//                             </p>

//                             {/* Contact Information - More compact */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
//                                 <div className="flex items-center">
//                                     <div className="w-7 h-7 flex items-center justify-center rounded-md dark:bg-slate-800/70 bg-slate-200/70 dark:border-slate-700/30 border-slate-200/70 border">
//                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 dark:text-indigo-400 text-indigo-600">
//                                             <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//                                         </svg>
//                                     </div>
//                                     <a href="tel:+353899832147" className="dark:text-slate-300 text-slate-600 text-xs ml-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">+353 89 983 2147</a>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <div className="w-7 h-7 flex items-center justify-center rounded-md dark:bg-slate-800/70 bg-slate-200/70 dark:border-slate-700/30 border-slate-200/70 border">
//                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 dark:text-indigo-400 text-indigo-600">
//                                             <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                                             <polyline points="22,6 12,13 2,6" />
//                                         </svg>
//                                     </div>
//                                     <a href="mailto:info@hitoai.ai" className="dark:text-slate-300 text-slate-600 text-xs ml-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">info@hitoai.ai</a>
//                                 </div>
//                             </div>

//                             {/* Social Links - More compact */}
//                             <div className="pt-3 border-t dark:border-slate-700/30 border-slate-200/70">
//                                 <div className="flex space-x-3">
//                                     <motion.a
//                                         href="https://www.linkedin.com/company/hitoai-limited/"
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         whileHover={{ y: -2 }}
//                                         className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
//                                     >
//                                         <Linkedin className="h-4 w-4 text-gray-700 dark:text-gray-300" />
//                                     </motion.a>
//                                     <motion.a
//                                         href="https://www.f6s.com/company/hitoai.ai/"
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         whileHover={{ y: -2 }}
//                                         className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
//                                     >
//                                         <img
//                                             src={"/socials/f6s-logo.png"}
//                                             alt="F6S"
//                                             className="h-5 w-5"
//                                         />
//                                     </motion.a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Links Grid - More compact */}
//                     <div className="md:col-span-8 lg:col-span-8">
//                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
//                             {footerLinks.map((column, idx) => (
//                                 <div key={idx} className="col-span-1">
//                                     <h3 className="text-sm font-semibold dark:text-white text-slate-800 mb-2 flex items-center">
//                                         <span className="w-1 h-3.5 bg-gradient-to-b from-indigo-600 to-pink-600/50 rounded-full mr-2"></span>
//                                         {column.title}
//                                     </h3>
//                                     <ul className="space-y-1.5">
//                                         {column.links.map((link, linkIdx) => (
//                                             <li key={linkIdx}>
//                                                 <motion.a
//                                                     href={link.href}
//                                                     className={`text-xs dark:text-slate-400 text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center group ${link.isNew ? 'mt-1' : ''}`}
//                                                     whileHover={{ x: 2 }}
//                                                 >
//                                                     {link.isNew ? (
//                                                         <span className="dark:text-white text-white bg-gradient-to-r from-indigo-500 to-indigo-600 px-2 py-0.5 text-xs rounded-full inline-flex items-center">
//                                                             <span className="mr-1 text-[0.65rem]">New</span>
//                                                             <span className="text-[0.65rem]">{link.label}</span>
//                                                         </span>
//                                                     ) : (
//                                                         <>
//                                                             <span className="w-1 h-1 bg-indigo-500/50 rounded-full mr-1.5 group-hover:bg-indigo-400 transition-colors"></span>
//                                                             {link.label}
//                                                         </>
//                                                     )}
//                                                 </motion.a>
//                                             </li>
//                                         ))}
//                                     </ul>

//                                     {/* Newsletter Section - Improved for mobile */}
//                                     {column.title === "Legal" && (
//                                         <div className="mt-4 pt-2 border-t dark:border-slate-700/30 border-slate-200/70">
//                                             <h4 className="text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-2">Stay Updated</h4>
//                                             <form onSubmit={handleSubscribe} className="relative">
//                                                 <div className="flex flex-col space-y-2">
//                                                     <div className="flex relative">
//                                                         <input
//                                                             type="email"
//                                                             placeholder="Your email"
//                                                             className="bg-white dark:bg-slate-800/50 dark:border-slate-700/50 border-slate-200/60 border rounded-lg py-1.5 pl-2.5 pr-9 text-xs dark:text-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
//                                                             value={email}
//                                                             onChange={handleEmailChange}
//                                                             disabled={isSubmitting}
//                                                         />
//                                                         <button
//                                                             type="submit"
//                                                             className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors disabled:opacity-50"
//                                                             disabled={isSubmitting}
//                                                             aria-label="Subscribe"
//                                                         >
//                                                             {isSubmitting ? (
//                                                                 <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                                 </svg>
//                                                             ) : (
//                                                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
//                                                                     <line x1="5" y1="12" x2="19" y2="12"></line>
//                                                                     <polyline points="12 5 19 12 12 19"></polyline>
//                                                                 </svg>
//                                                             )}
//                                                         </button>
//                                                     </div>
//                                                     {subscriptionStatus && (
//                                                         <p className={`text-[0.65rem] mt-1 ${subscriptionStatus.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
//                                                             {subscriptionStatus}
//                                                         </p>
//                                                     )}
//                                                     <p className="text-[0.65rem] dark:text-slate-400 text-slate-600">
//                                                         Get notified about new features and updates.
//                                                     </p>
//                                                 </div>
//                                             </form>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Divider */}
//                 <div className="w-full h-3 mt-5 mb-3 relative">
//                     <div className="h-px bg-gradient-to-r from-transparent via-indigo-600/20 to-transparent"></div>
//                 </div>

//                 {/* Copyright Bar - More compact */}
//                 <div className="flex flex-col sm:flex-row justify-between items-center pt-1">
//                     <div className="text-xs dark:text-slate-400 text-slate-600 mb-3 sm:mb-0 text-center sm:text-left">
//                         &copy; {getCurrentYear()} EEP. Powered by HitoAI Limited. All rights reserved.
//                     </div>

//                     <div className="flex items-center flex-wrap justify-center sm:justify-end gap-3">
//                         <select className="bg-white dark:bg-slate-800 dark:border-slate-700 border-slate-200 border rounded-md text-[0.65rem] dark:text-slate-300 text-slate-700 py-1 pl-2 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500">
//                             <option value="en">English</option>
//                             <option value="fr">Français</option>
//                             <option value="es">Español</option>
//                             <option value="de">Deutsch</option>
//                         </select>

//                         <div className="flex items-center text-[0.65rem] dark:text-slate-400 text-slate-600">
//                             <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
//                             All systems operational
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <style jsx>{`
//                 .bg-radial-gradient {
//                     background-image: radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.03), transparent 60%);
//                 }
//             `}</style>
//         </footer>
//     );
// };

// export default RefinedFooter;

