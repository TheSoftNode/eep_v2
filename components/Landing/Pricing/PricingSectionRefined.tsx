"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    Award,
    Mail,
    GraduationCap,
    ArrowRight,
    Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const PricingSectionProfessional: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Animation for cards on entry
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

        const cardElements = document.querySelectorAll('.pricing-card');
        cardElements.forEach(el => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, []);

    const plans = [
        {
            name: "Developer Program",
            price: "Custom",
            period: "for 3 months",
            description: "For developers looking to accelerate their skills",
            features: [
                "Complete application review within 2 weeks",
                "AI-powered workspace & project guidance",
                "Interactive milestone tracking",
                "Real-time mentor interaction",
                "Step-by-step development assistance",
                "EEP assistant bot for code acceleration"
            ],
            href: "/application",
            cta: "Apply Now",
            color: "basic" // white/light
        },
        {
            name: "Enterprise Solutions",
            price: "Custom",
            period: "pricing",
            description: "For businesses seeking tailored AI partnerships",
            features: [
                "Custom AI solution development",
                "Dedicated account manager",
                "Priority support channels",
                "Enterprise-grade security",
                "Customized implementation",
                "Ongoing maintenance & support"
            ],
            href: "/contact",
            cta: "Contact Sales",
            color: "premium" // purple
        }
    ];

    return (
        <section
            id="pricing"
            ref={sectionRef}
            className="relative py-10 bg-white dark:bg-slate-900 overflow-hidden"
        >
            {/* Professional background with subtle pattern */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"></div>
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white inline-flex items-center">
                                Choose Your Development Path
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">
                                Advanced AI-powered tools and mentorship to accelerate your journey
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                Applications reviewed within 2 weeks
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            key={index}
                            className={`pricing-card md:col-span-6 relative z-0 ${index === 1 ? 'md:z-10' : ''}`}
                        >
                            {/* Main Card */}
                            <div className={`h-full flex flex-col rounded-3xl overflow-hidden shadow-lg ${plan.color === 'premium'
                                ? 'bg-gradient-to-b from-indigo-600 via-purple-600 to-purple-700 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                                }`}
                                style={{
                                    boxShadow: plan.color === 'premium'
                                        ? '0 10px 25px -5px rgba(99, 102, 241, 0.5)'
                                        : '0 10px 25px -5px rgba(15, 23, 42, 0.1)'
                                }}
                            >
                                {/* Card Header with distinctive curve */}
                                <div className={`relative px-6 pt-8 pb-16 ${plan.color === 'premium' ? '' : 'border-b border-slate-200 dark:border-slate-700'}`}>
                                    {/* Curved shape at bottom */}
                                    <div className="absolute bottom-0 inset-x-0 h-12">
                                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
                                            <path
                                                d="M0,40 L100,40 L100,0 C60,40 40,0 0,40 Z"
                                                fill="currentColor"
                                                className={plan.color === 'premium' ? 'fill-white dark:fill-slate-800' : 'fill-white dark:fill-slate-800'}
                                            />
                                        </svg>
                                    </div>

                                    {/* Plan name */}
                                    <h3 className={`text-lg font-bold uppercase ${plan.color === 'premium' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`}>
                                        {plan.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="mt-2 flex items-baseline">
                                        <span className="text-5xl font-bold">{plan?.price}</span>
                                        <span className="ml-1 text-sm opacity-80">{plan.period}</span>
                                    </div>

                                    {/* Description */}
                                    <p className={`mt-1 text-sm ${plan.color === 'premium' ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Features List */}
                                <div className="flex-grow px-6 py-6">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-sm">
                                                <Check className={`h-4 w-4 mr-2 flex-shrink-0 ${plan.color === 'premium'
                                                    ? 'text-pink-300'
                                                    : 'text-purple-600 dark:text-purple-400'
                                                    }`} />
                                                <span className={
                                                    plan.color === 'premium'
                                                        ? 'text-white/90'
                                                        : 'text-slate-700 dark:text-slate-300'
                                                }>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <div className="px-6 pb-8">
                                    <Button
                                        onClick={() => router.push(plan.href)}
                                        className={`w-full py-5 rounded-full text-sm ${plan.color === 'premium'
                                            ? 'bg-white hover:bg-slate-100 dark:bg-white dark:hover:bg-slate-100 text-purple-600'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-md'
                                            }`}
                                    >
                                        <span className="flex items-center justify-center">
                                            {plan.cta}
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Assessment Section - More compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-5xl mx-auto mt-10 bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white mr-3">
                                    <Award className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Assessment & Hiring Policy
                                </h3>
                            </div>
                            <p className="mt-2 sm:mt-0 text-sm text-slate-600 dark:text-slate-400">
                                Participants are evaluated based on assessment scores
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                {
                                    score: "90%+",
                                    benefit: "Direct hiring by HitoAI Limited or industry partners",
                                },
                                {
                                    score: "80-90%",
                                    benefit: "Certificate of Achievement and job support through our network",
                                },
                                {
                                    score: "70-80%",
                                    benefit: "Eligible for an internship upon written request",
                                }
                            ].map((tier, index) => (
                                <div key={index} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                                        {tier.score}
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                        {tier.benefit}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Button
                                onClick={() => router.push("/application")}
                                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full text-sm shadow-md"
                            >
                                <span className="flex items-center">
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    Apply Now
                                </span>
                            </Button>
                            <Button
                                onClick={() => router.push("/contact")}
                                className="px-5 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-sm"
                                variant="outline"
                            >
                                <span className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contact Support
                                </span>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSectionProfessional;