"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, GraduationCap, Building, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactInfoCards } from '@/components/Contact/ContactInfoCards';
import { LearnerContactForm } from '@/components/Contact/LearnerContactForm';
import { BusinessContactForm } from '@/components/Contact/BusinessContactForm';
import { SuccessMessage } from '@/components/Contact/SuccessMessage';
import { ContactCategoryCards } from '@/components/Contact/ContactCategoryCards';
import { useToast } from '@/hooks/use-toast';
import {
    useSubmitLearnerContactMutation,
    useSubmitBusinessContactMutation
} from '@/Redux/apiSlices/communication/communicationApi';

const ContactPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(pageRef, { once: true, amount: 0.1 });
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("learner");
    const { toast } = useToast();

    // RTK Query mutations
    const [submitLearnerContact, { isLoading: isLearnerSubmitting }] = useSubmitLearnerContactMutation();
    const [submitBusinessContact, { isLoading: isBusinessSubmitting }] = useSubmitBusinessContactMutation();

    // Determine if any form is submitting
    const isSubmitting = isLearnerSubmitting || isBusinessSubmitting;

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (formData: any) => {
        try {
            let result;

            if (activeTab === 'learner') {
                result = await submitLearnerContact(formData).unwrap();
            } else {
                result = await submitBusinessContact(formData).unwrap();
            }

            // Show success message
            setIsSubmitted(true);

            toast({
                title: "Message Sent Successfully!",
                description: `Thank you for contacting us. We'll get back to you soon.`,
                variant: "default",
            });

            console.log('Form submitted successfully:', result);
        } catch (error: any) {
            console.error('Error submitting form:', error);

            // Show error message
            toast({
                title: "Submission Failed",
                description: error?.data?.message || "There was an error sending your message. Please try again.",
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setIsSubmitted(false);
    };

    const contactInfo = [
        { icon: <Mail className="w-4 h-4" />, title: "Email", content: "info@hitoai.ai" },
        { icon: "Phone", title: "Phone", content: "+353 89 983 2147" },
        { icon: "MapPin", title: "Address", content: "HITOAI Limited Sandyford, Dublin 18 Dublin, Ireland" }
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
            ref={pageRef}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
        >
            {/* Enhanced Background Effects */}
            <EnhancedBackgroundEffects />

            {/* Content */}
            <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20 z-10">
                <motion.div
                    className="max-w-4xl mx-auto"
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
                        className="text-center mb-12"
                    >
                        {/* Enhanced badge */}
                        <div className="inline-flex items-center justify-center mb-4">
                            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 border border-indigo-100 dark:border-indigo-700/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-12 -translate-x-full animate-badge-shine"></div>

                                <div className="flex items-center">
                                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                                    <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">Contact Us</span>
                                </div>
                            </div>
                        </div>

                        <motion.h1
                            variants={fadeInUp}
                            custom={1}
                            className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
                        >
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Touch</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            custom={2}
                            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base"
                        >
                            Whether you're interested in our learning programs or seeking expert mentorship for your business projects,
                            our team is here to guide you every step of the way.
                        </motion.p>
                    </motion.div>

                    {/* Contact Info Cards - Using the imported component */}
                    <motion.div
                        variants={fadeInUp}
                        custom={3}
                    >
                        <ContactInfoCards contactInfo={contactInfo} />
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        variants={fadeInUp}
                        custom={4}
                        className="mt-8"
                    >
                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <SuccessMessage onReset={resetForm} />
                            </motion.div>
                        ) : (
                            <div className="bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700/50 shadow-xl dark:shadow-slate-900/20">
                                <Tabs defaultValue="learner" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                                        <TabsTrigger
                                            value="learner"
                                            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200"
                                        >
                                            <GraduationCap className="w-4 h-4" />
                                            <span>Prospective Learner</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="business"
                                            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200"
                                        >
                                            <Building className="w-4 h-4" />
                                            <span>Business Partnership</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Learner Form */}
                                    <TabsContent value="learner">
                                        <LearnerContactForm
                                            onSubmit={handleSubmit}
                                            isSubmitting={isSubmitting}
                                        />
                                    </TabsContent>

                                    {/* Business Form */}
                                    <TabsContent value="business">
                                        <BusinessContactForm
                                            onSubmit={handleSubmit}
                                            isSubmitting={isSubmitting}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </motion.div>

                    {/* Contact Category Cards - Using the imported component */}
                    <motion.div
                        variants={fadeInUp}
                        custom={5}
                        className="mt-12"
                    >
                        <ContactCategoryCards />
                    </motion.div>
                </motion.div>
            </div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes badge-shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
                
                .animate-badge-shine {
                    animation: badge-shine 3s infinite;
                }
                
                @keyframes orb-float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                
                @keyframes orb-float-delay {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(20px) scale(1.05); }
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
                    top: 30%;
                    left: -25%;
                    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
                    transform: rotate(-5deg);
                    animation: beam-move 25s linear infinite;
                }
                
                .light-beam-2 {
                    top: 60%;
                    left: -25%;
                    background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.05), transparent);
                    transform: rotate(8deg);
                    animation: beam-move 30s linear infinite;
                }
                
                @keyframes beam-move {
                    0% { transform: translateX(-100%) rotate(-5deg); }
                    100% { transform: translateX(100%) rotate(-5deg); }
                }
            `}</style>
        </div>
    );
};

// Enhanced Background Effects Component
const EnhancedBackgroundEffects = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top gradient glow */}
        <div className="absolute w-full h-72 top-0 opacity-20 dark:opacity-30"
            style={{
                backgroundImage: "radial-gradient(circle at 25% 100%, rgba(79, 70, 229, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 50%)"
            }}>
        </div>

        {/* Professional grid pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}>
        </div>

        {/* Enhanced decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10 transform rotate-45 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 transform -rotate-12 rounded-full blur-3xl"></div>

        {/* Light beams - only visible in dark mode */}
        <div className="hidden dark:block absolute inset-0 overflow-hidden opacity-10">
            <div className="light-beam light-beam-1"></div>
            <div className="light-beam light-beam-2"></div>
        </div>

        {/* Subtle animated orbs - only visible in dark mode */}
        <div className="hidden dark:block absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-indigo-600/5 animate-orb-float opacity-60"></div>
        <div className="hidden dark:block absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-purple-600/5 animate-orb-float-delay opacity-60"></div>

        {/* Elegant top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20 dark:opacity-30"></div>

        {/* Subtle wave patterns */}
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden">
            <svg className="absolute top-0 w-full h-full text-indigo-50 dark:text-indigo-900/30 transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
            </svg>
        </div>
    </div>
);

export default ContactPage;
