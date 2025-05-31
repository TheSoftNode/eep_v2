"use client"

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    ChevronLeft,
    CheckCircle,
    Clock,
    Sparkles,
    MessageCircle,
    Calendar,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

// Steps component with refined styling
const ApplicationSteps = ({ currentStep }: { currentStep: number }) => {
    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-200 via-violet-200 to-transparent"></div>

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center relative z-10"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-sm shadow-emerald-200/50">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                        <h3 className="font-medium text-gray-800 text-sm">Application Submitted</h3>
                        <p className="text-xs text-gray-500">We've received your application</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center relative z-10"
                >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm ${currentStep >= 2
                        ? 'bg-gradient-to-br from-indigo-400 to-indigo-500 text-white shadow-indigo-200/50'
                        : 'bg-gray-100 text-gray-400'
                        }`}>
                        {currentStep >= 2 ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className={`font-medium text-sm ${currentStep >= 2 ? 'text-gray-800' : 'text-gray-500'}`}>Application Review</h3>
                            {currentStep === 2 && (
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mr-1.5"></div>
                                    In progress
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Our team is reviewing your application</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex items-center relative z-10"
                >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm ${currentStep >= 3
                        ? 'bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-indigo-200/50'
                        : 'bg-gray-100 text-gray-400'
                        }`}>
                        {currentStep >= 3 ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className={`font-medium text-sm ${currentStep >= 3 ? 'text-gray-800' : 'text-gray-500'}`}>Application Decision</h3>
                            {currentStep === 3 && (
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></div>
                                    Pending
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">You'll receive our decision via email</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="flex items-center relative z-10"
                >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm ${currentStep >= 4
                        ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-violet-200/50'
                        : 'bg-gray-100 text-gray-400'
                        }`}>
                        {currentStep >= 4 ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className={`font-medium text-sm ${currentStep >= 4 ? 'text-gray-800' : 'text-gray-500'}`}>Onboarding</h3>
                            {currentStep === 4 && (
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Ready
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Welcome to the platform! Set up your workspace</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const ApplicationStatusPage = () => {
    // In a real application, we would fetch the actual status from an API
    const [applicationStatus, setApplicationStatus] = useState({
        id: 'APP-12345',
        currentStep: 2,
        submittedAt: new Date().toISOString(),
        expectedResponseBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    });

    const router = useRouter();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <>
            <Head>
                <title>Application Status | Enterprise Empowerment Platform</title>
                <meta name="description" content="Check your Enterprise Empowerment Platform application status" />
            </Head>

            <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 pt-12">
                {/* Sophisticated background elements */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Top and bottom borders */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>

                    {/* Animated glass morphism effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-indigo-500/10 to-violet-600/0 blur-3xl"></div>

                    {/* Orbital rings */}
                    <motion.div
                        className="absolute w-[1000px] h-[1000px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-indigo-500/20"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 80,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    ></motion.div>

                    <motion.div
                        className="absolute w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-violet-500/20"
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 60,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    ></motion.div>

                    {/* Network connection pattern */}
                    <div className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #a5b4fc 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}>
                    </div>

                    {/* Grid overlay */}
                    <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/[0.1] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

                </div>

                <div className="container relative z-10 mx-auto px-4 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-indigo-300 hover:text-indigo-100 transition-colors mb-6"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        <span className="text-sm">Back to Home</span>
                    </Link>

                    <div className="max-w-xl mx-auto">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="mb-8 text-center"
                        >
                            <h1 className="text-3xl font-bold mb-3 text-white">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Application</span> Status
                            </h1>
                            <p className="text-gray-300 max-w-md mx-auto text-sm">
                                Track the progress of your Enterprise Empowerment Platform application
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.div variants={itemVariants}>
                                <Card className="bg-slate-800/70 backdrop-blur-md border border-indigo-500/20 shadow-xl shadow-indigo-900/30 rounded-xl overflow-hidden">
                                    <CardHeader className="border-b border-indigo-500/10 bg-gradient-to-r from-slate-800/70 to-indigo-900/40 pb-5 pt-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-900/50 border border-indigo-700/30">
                                                    <AlertCircle className="h-4 w-4 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg text-white">
                                                        {applicationStatus.id}
                                                    </CardTitle>
                                                    <CardDescription className="text-indigo-300 text-xs">
                                                        <span className="flex items-center mt-0.5">
                                                            <Calendar className="w-3 h-3 mr-1 opacity-70" />
                                                            Submitted {new Date(applicationStatus.submittedAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse mr-1.5"></div>
                                                In Review
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-5 pb-5 space-y-5">
                                        <motion.div
                                            variants={itemVariants}
                                            className="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-3"
                                        >
                                            <div className="flex items-start">
                                                <Clock className="w-5 h-5 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h3 className="text-white text-sm font-medium mb-1">Application Timeline</h3>
                                                    <p className="text-indigo-200 text-xs mb-2">
                                                        Your application is currently being reviewed by our team. We'll notify you once a decision has been made.
                                                    </p>
                                                    <div className="flex items-center space-x-1 text-xs text-white">
                                                        <span className="px-2 py-0.5 bg-indigo-800/50 rounded-md border border-indigo-600/30">
                                                            <span className="text-indigo-300">Expected response:</span>{' '}
                                                            <span className="text-indigo-100 font-medium">
                                                                {new Date(applicationStatus.expectedResponseBy).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <Separator className="my-2 opacity-10" />

                                        <motion.div variants={itemVariants}>
                                            <ApplicationSteps currentStep={applicationStatus.currentStep} />
                                        </motion.div>
                                    </CardContent>

                                    <CardFooter className="flex items-center justify-between bg-gradient-to-r from-slate-800/80 to-indigo-900/40 border-t border-indigo-500/10 pt-4 pb-4">
                                        <Button
                                            onClick={() => router.push("/contact")}
                                            variant="outline"
                                            className="bg-indigo-900/30 hover:bg-indigo-800/50 border-indigo-500/30 text-indigo-300 hover:text-indigo-100 text-xs transition-all h-8 px-3"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                                            Contact Support
                                        </Button>

                                        <Link
                                            href="/"
                                            className="text-indigo-300 hover:text-indigo-100 text-xs flex items-center transition-colors"
                                        >
                                            Return to Homepage
                                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ApplicationStatusPage;