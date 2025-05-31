"use client"

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
    GitBranchIcon,
    CloudIcon,
    UsersIcon,
    BuildingIcon,
    GlobeIcon,
    BrainCircuitIcon,
    RocketIcon,
    DatabaseIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PlusIcon,
    MinusIcon,
    CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Benefit {
    icon: React.ElementType;
    title: string;
    description: string;
    details: string[];
}

export const BenefitsSection: React.FC = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const benefits: Benefit[] = [
        {
            icon: GitBranchIcon,
            title: "Enterprise GitHub Access",
            description: "Professional GitHub for collaborative development",
            details: [
                "Advanced code management features",
                "Real-world AI project collaboration",
                "Professional version control workflows"
            ]
        },
        {
            icon: RocketIcon,
            title: "Enterprise Render Platform",
            description: "Deploy AI applications at enterprise scale",
            details: [
                "Enterprise Render platform access",
                "Robust cloud-based deployment pipelines",
                "Scalable application infrastructure"
            ]
        },
        {
            icon: DatabaseIcon,
            title: "Enterprise PostgreSQL",
            description: "Professional database management skills",
            details: [
                "Complex query optimization",
                "Advanced database management",
                "Performance tuning expertise"
            ]
        },
        {
            icon: UsersIcon,
            title: "1:1 Expert Mentorship",
            description: "20 sessions with Deep Tech specialists",
            details: [
                "One-on-one guidance sessions",
                "Industry best practices coaching",
                "Cutting-edge AI application training"
            ]
        },
        {
            icon: BuildingIcon,
            title: "HitoAI Employment Path",
            description: "Join our team on industry-leading projects",
            details: [
                "Direct employment opportunities",
                "Work with AI industry leaders",
                "Professional project experience"
            ]
        },
        {
            icon: GlobeIcon,
            title: "Network of 5,000+ Startups",
            description: "Connect with the tech innovation ecosystem",
            details: [
                "Extensive startup network access",
                "Career opportunity connections",
                "Industry partnership possibilities"
            ]
        },
        {
            icon: CloudIcon,
            title: "Enterprise Cloud Access",
            description: "AWS, Azure, and GCP enterprise platforms",
            details: [
                "AWS Enterprise Console",
                "Microsoft Azure Enterprise resources",
                "Google Cloud Platform Enterprise Support"
            ]
        },
        {
            icon: BrainCircuitIcon,
            title: "AI R&D Support",
            description: "Resources to push AI innovation boundaries",
            details: [
                "Advanced AI development tools",
                "Research support resources",
                "Innovation mentorship"
            ]
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    };

    return (
        <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/95">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Dot matrix pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)',
                        backgroundSize: '28px 28px'
                    }}>
                </div>

                {/* Mesh gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-indigo-100/30 via-purple-100/20 to-transparent dark:from-indigo-900/10 dark:via-purple-900/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100/20 via-pink-100/20 to-transparent dark:from-blue-900/10 dark:via-pink-900/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>

                {/* Dynamic flow lines */}
                <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.05] overflow-hidden">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0">
                        <path d="M0,30 Q25,40 50,30 Q75,20 100,30" fill="none" stroke="url(#flow1)" strokeWidth="0.5" className="animate-flow-slow" />
                        <path d="M0,50 Q25,30 50,50 Q75,70 100,50" fill="none" stroke="url(#flow2)" strokeWidth="0.5" className="animate-flow-medium" />
                        <path d="M0,70 Q25,60 50,70 Q75,80 100,70" fill="none" stroke="url(#flow3)" strokeWidth="0.5" className="animate-flow-fast" />
                        <defs>
                            <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(79, 70, 229, 0)" />
                                <stop offset="50%" stopColor="rgba(79, 70, 229, 1)" />
                                <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
                            </linearGradient>
                            <linearGradient id="flow2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
                                <stop offset="50%" stopColor="rgba(236, 72, 153, 1)" />
                                <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
                            </linearGradient>
                            <linearGradient id="flow3" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                                <stop offset="50%" stopColor="rgba(59, 130, 246, 1)" />
                                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="container relative z-10 px-4 mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    {/* Title badge */}
                    <div className="inline-flex items-center justify-center px-3 py-1 mb-3 rounded-full bg-indigo-50/80 dark:bg-indigo-900/30 border border-indigo-100/80 dark:border-indigo-700/30 backdrop-blur-sm">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 mr-2"></div>
                        <span className="text-indigo-700 dark:text-indigo-300 font-medium text-xs">Program Benefits</span>
                    </div>

                    {/* Main heading */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Enterprise-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Tools & Resources</span>
                    </h2>

                    <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl mx-auto">
                        Exclusive advantages that empower both developers and businesses with professional tools and industry connections
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {benefits.map((benefit, index) => (
                        <motion.div key={index} variants={itemVariants} className="h-full">
                            <Collapsible
                                open={expandedIndex === index}
                                onOpenChange={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                className="h-full"
                            >
                                <Card className="h-full border border-slate-200 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-700/50 transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm overflow-hidden relative group">
                                    {/* Gradient highlight on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-pink-500/5 dark:from-indigo-600/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <CardHeader className="p-4 pb-2 relative">
                                        <div className="flex items-start gap-3 mb-1">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 shadow-md shadow-indigo-500/20 dark:shadow-indigo-500/10">
                                                <benefit.icon className="w-4 h-4 text-white" />
                                            </div>

                                            {/* Title */}
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {benefit.title}
                                                </CardTitle>
                                            </div>

                                            {/* Toggle button */}
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                                                >
                                                    {expandedIndex === index ? (
                                                        <MinusIcon className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                                    ) : (
                                                        <PlusIcon className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                                    )}
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>

                                        {/* Description */}
                                        <CardDescription className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                            {benefit.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CollapsibleContent>
                                        <CardContent className="pt-0 px-4 pb-4">
                                            <ul className="space-y-1.5 mt-2">
                                                {benefit.details.map((detail, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5"
                                                    >
                                                        <CheckCircle className="h-3 w-3 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                                        <span>{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="text-center mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Button
                            size="lg"
                            className="relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-400 border-0 shadow-md shadow-indigo-500/20 dark:shadow-indigo-500/10 text-white"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span>Join the Enterprise Program</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>

                            {/* Animated gradient overlay */}
                            <span className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-white/10 to-transparent group-hover:translate-y-[0%] transition-transform duration-500"></span>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes flow-slow {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes flow-medium {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes flow-fast {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-flow-slow {
                    animation: flow-slow 25s linear infinite;
                }
                
                .animate-flow-medium {
                    animation: flow-medium 20s linear infinite;
                }
                
                .animate-flow-fast {
                    animation: flow-fast 15s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default BenefitsSection;