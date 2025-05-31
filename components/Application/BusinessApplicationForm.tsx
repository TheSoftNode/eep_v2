"use client"

import React, { useState, useRef, useEffect } from 'react';
import {
    UploadCloud,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    FileIcon,
    X,
    User,
    Mail,
    Phone,
    Building2,
    Sparkles,
    CheckCircle,
    Globe,
    BriefcaseBusiness,
    Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import TermsAndConditions from '../utils/TermsAndConditions';
import { useSubmitBusinessApplicationMutation } from '@/Redux/apiSlices/communication/communicationApi';

interface FormData {
    companyName: string;
    fullName: string;
    email: string;
    phone: string;
    website: string;
    industry: string;
    employeeSize: string;
    aiRequirements: string;
    businessProposal: File | null;
    acceptedTerms: boolean;
    acceptedConfidentiality: boolean;
    acceptedDataPolicy: boolean;
}

export const BusinessApplicationForm: React.FC = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeField, setActiveField] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [submitBusinessApplication, { isLoading: isSubmittingProposal }] = useSubmitBusinessApplicationMutation();

    const [formData, setFormData] = useState<FormData>({
        companyName: '',
        fullName: '',
        email: '',
        phone: '',
        website: '',
        industry: '',
        employeeSize: '',
        aiRequirements: '',
        businessProposal: null,
        acceptedTerms: false,
        acceptedConfidentiality: false,
        acceptedDataPolicy: false
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const router = useRouter();

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

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Contact name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }

        if (!formData.industry.trim()) {
            newErrors.industry = 'Industry is required';
        }

        if (!formData.employeeSize.trim()) {
            newErrors.employeeSize = 'Employee size is required';
        }

        if (!formData.aiRequirements.trim()) {
            newErrors.aiRequirements = 'AI requirements are required';
        }

        if (!formData.businessProposal) {
            newErrors.businessProposal = 'Business proposal document is required';
        }

        if (!formData.acceptedTerms) {
            newErrors.acceptedTerms = 'You must accept the terms and conditions';
        }

        if (!formData.acceptedConfidentiality) {
            newErrors.acceptedConfidentiality = 'You must agree to the confidentiality terms';
        }

        if (!formData.acceptedDataPolicy) {
            newErrors.acceptedDataPolicy = 'You must agree to the data policy';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please check all required fields",
                variant: "destructive"
            });

            // Scroll to the first error
            const firstErrorField = Object.keys(errors)[0] as keyof FormData;
            const element = document.getElementById(firstErrorField);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setActiveField(firstErrorField);
            }

            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("companyName", formData.companyName);
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("website", formData.website);
        formDataToSend.append("industry", formData.industry);
        formDataToSend.append("employeeSize", formData.employeeSize);
        formDataToSend.append("aiRequirements", formData.aiRequirements);
        if (formData.businessProposal) {
            formDataToSend.append("businessProposal", formData.businessProposal);
        }
        formDataToSend.append("acceptedTerms", formData.acceptedTerms.toString());
        formDataToSend.append("acceptedConfidentiality", formData.acceptedConfidentiality.toString());
        formDataToSend.append("acceptedDataPolicy", formData.acceptedDataPolicy.toString());

        setIsSubmitting(true);
        try {
            const response = await submitBusinessApplication(formDataToSend).unwrap()

            toast({
                title: "Application Submitted",
                description: "We'll review your business proposal and contact you soon.",
            });

            router.push("/business-application-status");

            // Reset form
            setFormData({
                companyName: '',
                fullName: '',
                email: '',
                phone: '',
                website: '',
                industry: '',
                employeeSize: '',
                aiRequirements: '',
                businessProposal: null,
                acceptedTerms: false,
                acceptedConfidentiality: false,
                acceptedDataPolicy: false
            });
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "Please try again later",
                variant: "destructive"
            });
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    businessProposal: 'File size should not exceed 10MB'
                }));
                return;
            }

            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    businessProposal: 'Please upload a PDF, Word document, or PowerPoint presentation'
                }));
                return;
            }

            setFormData(prev => ({ ...prev, businessProposal: file }));
            setErrors(prev => ({ ...prev, businessProposal: undefined }));
        }
    };

    const removeFile = () => {
        setFormData(prev => ({ ...prev, businessProposal: null }));
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

    const industryOptions = [
        "Finance & Banking",
        "Healthcare & Pharmaceuticals",
        "Technology & Software",
        "Manufacturing & Logistics",
        "Retail & E-commerce",
        "Education & Research",
        "Energy & Utilities",
        "Real Estate & Construction",
        "Media & Entertainment",
        "Other"
    ];

    const employeeSizeOptions = [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "501-1000 employees",
        "1000+ employees"
    ];

    return (
        <div className="relative py-8 md:py-12">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Subtle mesh gradients */}


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

                {/* Dynamic circuit-like pattern (dark mode only) */}
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
            </div>

            <Card className="border-2 border-indigo-200 dark:border-indigo-800/60 bg-white dark:bg-slate-800/80 backdrop-blur-lg shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
                {/* Subtle background accents */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-100/80 dark:bg-indigo-900/20 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-100/80 dark:bg-purple-900/20 rounded-full opacity-50 blur-3xl"></div>
                </div>
                <motion.div
                    initial="hidden"
                    animate="visible"
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
                    <CardHeader className="pb-8 text-center space-y-4 relative z-10 border-b-2 border-indigo-100 dark:border-indigo-800/30">
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center opacity-30 blur-xl"></div>

                        <motion.div variants={fadeInUp} custom={0} className="inline-flex mt-1 items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-12 -translate-x-full animate-badge-shine"></div>
                            <div className="flex items-center">
                                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                                <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">Enterprise AI Solutions</span>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} custom={1}>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                                Business Application
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                                Partner with us to integrate AI solutions into your business operations
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-8">
                        <form ref={formRef} onSubmit={handleSubmit} className="mx-auto space-y-8">
                            {/* Company Information Section */}
                            <motion.div variants={fadeInUp} custom={2} className="space-y-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center">
                                        <Building2 className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 ml-3">Company Information</h3>
                                </div>

                                {/* Company Name Field */}
                                <div className="relative">
                                    <Label htmlFor="companyName" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                                        Company Name
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="companyName"
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, companyName: e.target.value }));
                                                setErrors(prev => ({ ...prev, companyName: undefined }));
                                            }}
                                            onFocus={() => setActiveField('companyName')}
                                            onBlur={() => setActiveField(null)}
                                            className={`pl-12 py-6 ${activeField === 'companyName'
                                                ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900'
                                                : errors.companyName
                                                    ? "border-red-500 dark:border-red-500"
                                                    : "border-indigo-200 dark:border-indigo-700/50"
                                                } transition-all duration-300 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800/60`}
                                            placeholder="Enter your company name"
                                        />
                                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full ${activeField === 'companyName'
                                            ? 'bg-indigo-500 dark:bg-indigo-400 text-white'
                                            : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300'
                                            } transition-all duration-300`}>
                                            <Building2 size={16} />
                                        </div>
                                    </div>
                                    {errors.companyName && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500 mt-1 flex items-center"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.companyName}
                                        </motion.p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contact Name Field */}
                                    <div className="relative">
                                        <Label htmlFor="contactName" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                                            Contact Name
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="contactName"
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, fullName: e.target.value }));
                                                    setErrors(prev => ({ ...prev, fullName: undefined }));
                                                }}
                                                onFocus={() => setActiveField('fullName')}
                                                onBlur={() => setActiveField(null)}
                                                className={`pl-12 py-6 ${activeField === 'fullName'
                                                    ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900'
                                                    : errors.fullName
                                                        ? "border-red-500 dark:border-red-500"
                                                        : "border-indigo-200 dark:border-indigo-700/50"
                                                    } transition-all duration-300 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800/60`}
                                                placeholder="Enter contact person's name"
                                            />
                                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full ${activeField === 'contactName'
                                                ? 'bg-indigo-500 dark:bg-indigo-400 text-white'
                                                : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300'
                                                } transition-all duration-300`}>
                                                <User size={16} />
                                            </div>
                                        </div>
                                        {errors.fullName && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-500 mt-1 flex items-center"
                                            >
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.fullName}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Website Field */}
                                    <div className="relative">
                                        <Label htmlFor="website" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                                            Website <span className="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="website"
                                                type="url"
                                                value={formData.website}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, website: e.target.value }));
                                                    setErrors(prev => ({ ...prev, website: undefined }));
                                                }}
                                                onFocus={() => setActiveField('website')}
                                                onBlur={() => setActiveField(null)}
                                                className={`pl-12 py-6 ${activeField === 'website'
                                                    ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900'
                                                    : errors.website
                                                        ? "border-red-500 dark:border-red-500"
                                                        : "border-indigo-200 dark:border-indigo-700/50"
                                                    } transition-all duration-300 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800/60`}
                                                placeholder="https://yourcompany.com"
                                            />
                                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full ${activeField === 'website'
                                                ? 'bg-indigo-500 dark:bg-indigo-400 text-white'
                                                : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300'
                                                } transition-all duration-300`}>
                                                <Globe size={16} />
                                            </div>
                                        </div>
                                        {errors.website && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-500 mt-1 flex items-center"
                                            >
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.website}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Email Address Field */}
                                    <div className="relative">
                                        <Label htmlFor="email" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, email: e.target.value }));
                                                    setErrors(prev => ({ ...prev, email: undefined }));
                                                }}
                                                onFocus={() => setActiveField('email')}
                                                onBlur={() => setActiveField(null)}
                                                className={`pl-12 py-6 ${activeField === 'email'
                                                    ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900'
                                                    : errors.email
                                                        ? "border-red-500 dark:border-red-500"
                                                        : "border-indigo-200 dark:border-indigo-700/50"
                                                    } transition-all duration-300 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800/60`}
                                                placeholder="contact@company.com" />
                                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full ${activeField === 'email'
                                                ? 'bg-indigo-500 dark:bg-indigo-400 text-white'
                                                : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300'
                                                } transition-all duration-300`}>
                                                <Mail size={16} />
                                            </div>
                                        </div>
                                        {errors.email && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-500 mt-1 flex items-center"
                                            >
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Phone Number Field */}
                                    <div className="relative">
                                        <Label htmlFor="phone" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                                            Phone Number
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                                                    setErrors(prev => ({ ...prev, phone: undefined }));
                                                }}
                                                onFocus={() => setActiveField('phone')}
                                                onBlur={() => setActiveField(null)}
                                                className={`pl-12 py-6 ${activeField === 'phone'
                                                    ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900'
                                                    : errors.phone
                                                        ? "border-red-500 dark:border-red-500"
                                                        : "border-indigo-200 dark:border-indigo-700/50"
                                                    } transition-all duration-300 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800/60`}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full ${activeField === 'phone'
                                                ? 'bg-indigo-500 dark:bg-indigo-400 text-white'
                                                : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300'
                                                } transition-all duration-300`}>
                                                <Phone size={16} />
                                            </div>
                                        </div>
                                        {errors.phone && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-500 mt-1 flex items-center"
                                            >
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.phone}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Industry Dropdown */}
                                    <div className="relative">
                                        <Label htmlFor="industry" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                                            Industry
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="industry"
                                                value={formData.industry}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, industry: e.target.value }));
                                                    setErrors(prev => ({ ...prev, industry: undefined }));
                                                }}
                                                onFocus={() => setActiveField('industry')}
                                                onBlur={() => setActiveField(null)}
                                                className={`w-full pl-12 py-6 rounded-md ${activeField === 'industry'
                                                    ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900'
                                                    : errors.industry
                                                        ? "border-red-500 dark:border-red-500"
                                                        : "border-indigo-200 dark:border-indigo-700/50"
                                                    } transition-all duration-300 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800/60 text-gray-700 dark:text-gray-300`}
                                            >
                                                <option value="" disabled>Select your industry</option>
                                                {industryOptions.map((option, index) => (
                                                    <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full ${activeField === 'industry'
                                                ? 'bg-indigo-500 dark:bg-indigo-400 text-white'
                                                : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300'
                                                } transition-all duration-300`}>
                                                <BriefcaseBusiness size={16} />
                                            </div>
                                        </div>
                                        {errors.industry && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-500 mt-1 flex items-center"
                                            >
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.industry}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Employee Size Dropdown */}
                                    <div className="relative">
                                        <Label htmlFor="employeeSize" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                                            Company Size
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="employeeSize"
                                                value={formData.employeeSize}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, employeeSize: e.target.value }));
                                                    setErrors(prev => ({ ...prev, employeeSize: undefined }));
                                                }}
                                                onFocus={() => setActiveField('employeeSize')}
                                                onBlur={() => setActiveField(null)}
                                                className={`w-full pl-12 py-6 rounded-md ${activeField === 'employeeSize'
                                                    ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900'
                                                    : errors.employeeSize
                                                        ? "border-red-500 dark:border-red-500"
                                                        : "border-indigo-200 dark:border-indigo-700/50"
                                                    } transition-all duration-300 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800/60 text-gray-700 dark:text-gray-300`}
                                            >
                                                <option value="" disabled>Select company size</option>
                                                {employeeSizeOptions.map((option, index) => (
                                                    <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full ${activeField === 'employeeSize'
                                                ? 'bg-indigo-500 dark:bg-indigo-400 text-white'
                                                : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300'
                                                } transition-all duration-300`}>
                                                <Users size={16} />
                                            </div>
                                        </div>
                                        {errors.employeeSize && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-500 mt-1 flex items-center"
                                            >
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.employeeSize}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                            {/* AI Requirements Section */}
                            <motion.div variants={fadeInUp} custom={3} className="space-y-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-indigo-600 dark:to-violet-800 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                                            <path d="M7 7h.01"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 ml-3">AI Requirements</h3>
                                </div>

                                {/* AI Requirements Textarea */}
                                <div className="relative">
                                    <Label htmlFor="aiRequirements" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                                        Please describe your AI requirements and use cases
                                    </Label>
                                    <div className="relative">
                                        <textarea
                                            id="aiRequirements"
                                            value={formData.aiRequirements}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, aiRequirements: e.target.value }));
                                                setErrors(prev => ({ ...prev, aiRequirements: undefined }));
                                            }}
                                            onFocus={() => setActiveField('aiRequirements')}
                                            onBlur={() => setActiveField(null)}
                                            className={`w-full min-h-[150px] p-4 rounded-md border ${activeField === 'aiRequirements'
                                                ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900'
                                                : errors.aiRequirements
                                                    ? "border-red-500 dark:border-red-500"
                                                    : "border-indigo-200 dark:border-indigo-700/50"
                                                } transition-all duration-300 focus:border-indigo-500 dark:focus:border-indigo-400 resize-none bg-white dark:bg-slate-800/60 text-gray-700 dark:text-gray-300`}
                                            placeholder="Explain your business needs, current challenges, and how you envision AI solutions helping your company..."
                                        />
                                    </div>
                                    {errors.aiRequirements && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500 mt-1 flex items-center"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.aiRequirements}
                                        </motion.p>
                                    )}
                                </div>
                                {/* Business Proposal Upload Section */}
                                <div className="space-y-2">
                                    <Label htmlFor="businessProposal" className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Business Proposal</Label>
                                    {!formData.businessProposal ? (
                                        <div className="flex items-center justify-center w-full">
                                            <Label
                                                htmlFor="businessProposal"
                                                className="w-full flex flex-col items-center px-4 py-8 bg-white/80 dark:bg-slate-800/50 rounded-lg shadow-sm tracking-wide border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 cursor-pointer hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 transition-colors group"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                                    <UploadCloud className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                                                </div>
                                                <span className="mt-2 text-base leading-normal text-indigo-600 dark:text-indigo-400 font-medium">Select a file</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">PDF, Word doc, or PowerPoint, max 10MB</span>
                                                <Input
                                                    id="businessProposal"
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                    onChange={handleFileChange}
                                                />
                                            </Label>
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between p-4 border-2 border-indigo-200 dark:border-indigo-700/50 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                                    <FileIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formData.businessProposal.name}</span>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(formData.businessProposal.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={removeFile}
                                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    )}
                                    {errors.businessProposal && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500 mt-1 flex items-center"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.businessProposal}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>
                            {/* Agreement Section */}
                            <motion.div variants={fadeInUp} custom={4} className="space-y-6 border-2 border-indigo-200 dark:border-indigo-800/40 rounded-lg p-6 bg-indigo-50/70 dark:bg-indigo-900/20 backdrop-blur-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300">Agreement Terms</h3>
                                </div>

                                {/* 1. Terms and Conditions Agreement */}
                                <div className="space-y-2 p-4 rounded-lg bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800/30">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-2">
                                            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">1</span>
                                        </div>
                                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">Terms and Conditions Agreement</h4>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-8">
                                        <div className="flex items-center h-5">
                                            <Checkbox
                                                id="terms"
                                                checked={formData.acceptedTerms}
                                                onCheckedChange={(checked: boolean) => {
                                                    setFormData(prev => ({ ...prev, acceptedTerms: checked }));
                                                    setErrors(prev => ({ ...prev, acceptedTerms: undefined }));
                                                }}
                                                className={`h-4 w-4 ${formData.acceptedTerms ? "bg-indigo-500 dark:bg-indigo-400 border-indigo-500 dark:border-indigo-400" : "border-2 border-indigo-300 dark:border-indigo-600"}`}
                                            />
                                        </div>
                                        <div className="flex items-baseline space-x-2">
                                            <Label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">I accept the terms and conditions of HitoAI Limited.</Label>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="link" className="p-0 h-auto font-normal text-indigo-600 dark:text-indigo-400 text-sm">
                                                        (Review Terms)
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Terms and Conditions</DialogTitle>
                                                        <DialogDescription>
                                                            Please read these terms carefully before applying
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <TermsAndConditions />
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                    {errors.acceptedTerms && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500 mt-1 ml-8 flex items-center"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.acceptedTerms}
                                        </motion.p>
                                    )}
                                </div>
                                {/* 2. Confidentiality Agreement */}
                                <div className="space-y-2 p-4 rounded-lg bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800/30">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-2">
                                            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">2</span>
                                        </div>
                                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">Confidentiality Agreement</h4>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-8">
                                        <div className="flex items-center h-5">
                                            <Checkbox
                                                id="confidentiality"
                                                checked={formData.acceptedConfidentiality}
                                                onCheckedChange={(checked: boolean) => {
                                                    setFormData(prev => ({ ...prev, acceptedConfidentiality: checked }));
                                                    setErrors(prev => ({ ...prev, acceptedConfidentiality: undefined }));
                                                }}
                                                className={`h-4 w-4 ${formData.acceptedConfidentiality ? "bg-indigo-500 dark:bg-indigo-400 border-indigo-500 dark:border-indigo-400" : "border-2 border-indigo-300 dark:border-indigo-600"}`}
                                            />
                                        </div>
                                        <Label htmlFor="confidentiality" className="text-sm text-gray-700 dark:text-gray-300">
                                            I agree that all information exchanged during the business relationship will be kept confidential, and will not be disclosed to third parties without prior written consent.
                                        </Label>
                                    </div>
                                    {errors.acceptedConfidentiality && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500 mt-1 ml-8 flex items-center"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.acceptedConfidentiality}
                                        </motion.p>
                                    )}
                                </div>

                                {/* 3. Data Policy Agreement */}
                                <div className="space-y-2 p-4 rounded-lg bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800/30">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-2">
                                            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">3</span>
                                        </div>
                                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">Data Policy Agreement</h4>
                                    </div>
                                    <div className="flex items-start space-x-2 ml-8">
                                        <div className="flex items-center h-5 mt-1">
                                            <Checkbox
                                                id="dataPolicy"
                                                checked={formData.acceptedDataPolicy}
                                                onCheckedChange={(checked: boolean) => {
                                                    setFormData(prev => ({ ...prev, acceptedDataPolicy: checked }));
                                                    setErrors(prev => ({ ...prev, acceptedDataPolicy: undefined }));
                                                }}
                                                className={`h-4 w-4 ${formData.acceptedDataPolicy ? "bg-indigo-500 dark:bg-indigo-400 border-indigo-500 dark:border-indigo-400" : "border-2 border-indigo-300 dark:border-indigo-600"}`}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dataPolicy" className="text-sm text-gray-700 dark:text-gray-300">
                                                I acknowledge that all data processed by HitoAI Limited will be handled according to GDPR regulations and our data processing policies.
                                            </Label>
                                            <ul className="mt-2 ml-6 text-sm text-gray-700 dark:text-gray-300 list-disc space-y-1">
                                                <li><span className="font-semibold text-indigo-800 dark:text-indigo-300">Data Security:</span> All data will be stored securely with enterprise-grade encryption.</li>
                                                <li><span className="font-semibold text-indigo-800 dark:text-indigo-300">Compliance:</span> Our AI systems comply with all relevant data protection regulations.</li>
                                                <li><span className="font-semibold text-indigo-800 dark:text-indigo-300">Transparency:</span> You will always maintain ownership and control of your business data.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    {errors.acceptedDataPolicy && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500 mt-1 ml-8 flex items-center"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.acceptedDataPolicy}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>
                            <motion.div variants={fadeInUp} custom={5}>
                                <Alert className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-800/50">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    <AlertTitle className="text-amber-800 dark:text-amber-300 font-semibold">Important Notice</AlertTitle>
                                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                                        After submitting your application, a business development representative will contact you within 2 business days to discuss your requirements further.
                                    </AlertDescription>
                                </Alert>
                            </motion.div>

                            <motion.div variants={fadeInUp} custom={6} className="pt-4">
                                <Button
                                    type="submit"
                                    className={`w-full ${isSubmitting || !formData.acceptedTerms || !formData.acceptedConfidentiality || !formData.acceptedDataPolicy
                                        ? "bg-indigo-400 dark:bg-indigo-600/50 hover:bg-indigo-400 dark:hover:bg-indigo-600/50 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
                                        } text-white py-6 rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden`}
                                    disabled={isSubmitting || !formData.acceptedTerms || !formData.acceptedConfidentiality || !formData.acceptedDataPolicy}
                                >
                                    {/* Shine effect on button */}
                                    {!(isSubmitting || !formData.acceptedTerms || !formData.acceptedConfidentiality || !formData.acceptedDataPolicy) && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shine"></div>
                                    )}

                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Business Application
                                            <CheckCircle2 className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                </motion.div>
            </Card>
            {/* Animation styles */}
            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
                
                .animate-shine {
                    animation: shine 3s ease-in-out infinite;
                }
                
                @keyframes badge-shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
                
                .animate-badge-shine {
                    animation: badge-shine 3s infinite;
                }

                /* Particle animations for dark mode */
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
        </div>
    );
};

export default BusinessApplicationForm;