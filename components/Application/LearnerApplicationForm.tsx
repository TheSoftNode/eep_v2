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
    Sparkles,
    CheckCircle
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
import { useSubmitLearnerApplicationMutation } from '@/Redux/apiSlices/communication/communicationApi';

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    interests: string;
    cv: File | null;
    acceptedTerms: boolean;
    acceptedPayment: boolean;
    acceptedHiringPolicy: boolean;
}

export const LearnerApplicationForm: React.FC = () => {
    const { toast } = useToast();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeField, setActiveField] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        interests: '',
        cv: null,
        acceptedTerms: false,
        acceptedPayment: false,
        acceptedHiringPolicy: false
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [submitLearnerApplication, { isLoading: isSubmitting }] = useSubmitLearnerApplicationMutation();

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
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
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
        if (!formData.cv) newErrors.cv = 'CV is required';
        if (!formData.acceptedTerms) newErrors.acceptedTerms = 'You must accept the terms and conditions';
        if (!formData.acceptedPayment) newErrors.acceptedPayment = 'You must acknowledge the payment terms';
        if (!formData.acceptedHiringPolicy) newErrors.acceptedHiringPolicy = 'You must acknowledge the assessment and hiring policy';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please check all required fields", variant: "destructive" });
            const firstErrorField = Object.keys(errors)[0] as keyof FormData;
            const element = document.getElementById(firstErrorField);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setActiveField(firstErrorField);
            }
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("interests", formData.interests);
        if (formData.cv) formDataToSend.append("cv", formData.cv);
        formDataToSend.append("acceptedTerms", formData.acceptedTerms.toString());
        formDataToSend.append("acceptedPayment", formData.acceptedPayment.toString());
        formDataToSend.append("acceptedHiringPolicy", formData.acceptedHiringPolicy.toString());

        console.log(formDataToSend)

        try {
            console.log('Submitting form with:', {
                fields: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    interests: formData.interests,
                    acceptedTerms: formData.acceptedTerms,
                    acceptedPayment: formData.acceptedPayment,
                    acceptedHiringPolicy: formData.acceptedHiringPolicy
                },
                file: formData.cv ? {
                    name: formData.cv.name,
                    size: formData.cv.size,
                    type: formData.cv.type
                } : null
            });
            const result = await submitLearnerApplication(formDataToSend).unwrap();

            toast({ title: "Application Submitted", description: "We'll review your application and get back to you soon." });
            router.push("/application-status");
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                interests: '',
                cv: null,
                acceptedTerms: false,
                acceptedPayment: false,
                acceptedHiringPolicy: false
            });
        } catch (error) {
            toast({ title: "Submission Failed", description: "Please try again later", variant: "destructive" });
            console.log(error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, cv: 'File size should not exceed 5MB' }));
                return;
            }
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, cv: 'Please upload a PDF or Word document' }));
                return;
            }
            setFormData(prev => ({ ...prev, cv: file }));
            setErrors(prev => ({ ...prev, cv: undefined }));
        }
    };

    const removeFile = () => {
        setFormData(prev => ({ ...prev, cv: null }));
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        })
    };

    return (
        <div className="relative py-4 md:py-6">
            {/* Refined Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]" style={{
                    backgroundImage: `radial-gradient(circle at 75% 25%, rgba(79, 70, 229, 0.08) 0%, transparent 50%), radial-gradient(circle at 25% 75%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)`,
                    backgroundSize: '100% 100%'
                }}></div>
                <div className="absolute inset-0 bg-grid-slate-100/[0.02] dark:bg-grid-slate-800/[0.03] bg-[size:30px_30px]"></div>
                <div className="absolute -left-40 top-1/4 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-indigo-200/10 dark:via-indigo-400/20 to-transparent" style={{ transform: `rotate(${5 + scrollProgress * 2}deg)` }}></div>
                <div className="absolute -right-40 bottom-1/4 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-violet-200/10 dark:via-violet-400/20 to-transparent" style={{ transform: `rotate(${-5 - scrollProgress * 2}deg)` }}></div>
                <div className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full bg-gradient-to-br from-indigo-100/10 dark:from-indigo-500/10 to-violet-100/5 dark:to-violet-500/5 blur-3xl pointer-events-none" style={{ transform: `translate(${Math.sin(scrollProgress * Math.PI) * 20}px, ${Math.cos(scrollProgress * Math.PI) * 20}px)` }}></div>
                <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-tr from-purple-100/10 dark:from-purple-500/10 to-indigo-100/5 dark:to-indigo-500/5 blur-3xl pointer-events-none" style={{ transform: `translate(${Math.cos(scrollProgress * Math.PI) * 20}px, ${Math.sin(scrollProgress * Math.PI) * 20}px)` }}></div>
            </div>

            <Card className="border border-slate-200/60 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-xl relative overflow-hidden max-w-4xl mx-auto">
                <div className="h-px w-full bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50"></div>
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-50/40 dark:bg-indigo-900/20 rounded-full opacity-30 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-50/40 dark:bg-purple-900/20 rounded-full opacity-30 blur-3xl"></div>
                </div>

                <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}>
                    <CardHeader className="pb-4 text-center space-y-2 relative z-10 border-b border-slate-100/80 dark:border-slate-800/60">
                        <motion.div variants={fadeInUp} custom={0} className="inline-flex mt-1 items-center px-3 py-1 rounded-full bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm relative overflow-hidden shadow-sm">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent skew-x-12 -translate-x-full animate-badge-shine"></div>
                            <div className="flex items-center">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mr-1.5" />
                                <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">Limited Cohort Spots</span>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} custom={1}>
                            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400 text-transparent bg-clip-text">Apply Now</CardTitle>
                            <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">Start your journey towards becoming an AI and cloud technology expert</CardDescription>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-4 px-6">
                        <form ref={formRef} onSubmit={handleSubmit} className="mx-auto space-y-4">
                            <div className="space-y-4">
                                <motion.div variants={fadeInUp} custom={2} className="relative">
                                    <Label htmlFor="fullName" className="text-sm font-medium mb-1.5 block text-indigo-800 dark:text-indigo-300">Full Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, fullName: e.target.value }));
                                                setErrors(prev => ({ ...prev, fullName: undefined }));
                                            }}
                                            onFocus={() => setActiveField('fullName')}
                                            onBlur={() => setActiveField(null)}
                                            className={`pl-10 h-10 bg-white dark:bg-slate-800 border ${activeField === 'fullName' ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/50' : errors.fullName ? "border-red-500" : "border-slate-200 dark:border-slate-700"} transition-all duration-200 focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                            placeholder="Enter your full name"
                                        />
                                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full ${activeField === 'fullName' ? 'bg-indigo-500 text-white' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'} transition-all duration-200`}>
                                            <User size={12} />
                                        </div>
                                    </div>
                                    {errors.fullName && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.fullName}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div variants={fadeInUp} custom={3} className="relative">
                                    <Label htmlFor="email" className="text-sm font-medium mb-1.5 block text-purple-800 dark:text-purple-300">Email Address</Label>
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
                                            className={`pl-10 h-10 bg-white dark:bg-slate-800 border ${activeField === 'email' ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/50' : errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"} transition-all duration-200 focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                            placeholder="Enter your email address"
                                        />
                                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full ${activeField === 'email' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} transition-all duration-200`}>
                                            <Mail size={12} />
                                        </div>
                                    </div>
                                    {errors.email && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.email}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div variants={fadeInUp} custom={4} className="relative">
                                    <Label htmlFor="phone" className="text-sm font-medium mb-1.5 block text-violet-800 dark:text-violet-300">Phone Number</Label>
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
                                            className={`pl-10 h-10 bg-white dark:bg-slate-800 border ${activeField === 'phone' ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/50' : errors.phone ? "border-red-500" : "border-slate-200 dark:border-slate-700"} transition-all duration-200 focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                            placeholder="Enter your phone number"
                                        />
                                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full ${activeField === 'phone' ? 'bg-violet-500 text-white' : 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400'} transition-all duration-200`}>
                                            <Phone size={12} />
                                        </div>
                                    </div>
                                    {errors.phone && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.phone}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div variants={fadeInUp} custom={5} className="relative">
                                    <Label htmlFor="interests" className="text-sm font-medium mb-1.5 block text-indigo-800 dark:text-indigo-300">Your Interests</Label>
                                    <div className="relative">
                                        <textarea
                                            id="interests"
                                            value={formData.interests}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, interests: e.target.value }));
                                                setErrors(prev => ({ ...prev, interests: undefined }));
                                            }}
                                            onFocus={() => setActiveField('interests')}
                                            onBlur={() => setActiveField(null)}
                                            className={`w-full min-h-[80px] p-3 rounded-md border ${activeField === 'interests' ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/50' : errors.interests ? "border-red-500" : "border-slate-200 dark:border-slate-700"} transition-all duration-200 focus:border-indigo-500 resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                            placeholder="Tell us about your interests and what you hope to achieve..."
                                        />
                                    </div>
                                    {errors.interests && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.interests}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div variants={fadeInUp} custom={6} className="space-y-2">
                                    <Label htmlFor="cv" className="text-sm font-medium text-purple-800 dark:text-purple-300">Upload CV</Label>
                                    {!formData.cv ? (
                                        <div className="flex items-center justify-center w-full">
                                            <Label htmlFor="cv" className="w-full flex flex-col items-center px-4 py-5 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm tracking-wide border-2 border-dashed border-indigo-300 dark:border-indigo-600 cursor-pointer hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 transition-colors group">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-200">
                                                    <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <span className="mt-1 text-sm leading-normal text-indigo-700 dark:text-indigo-300 font-medium">Select a file</span>
                                                <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">PDF or Word document, max 5MB</span>
                                                <Input id="cv" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                            </Label>
                                        </div>
                                    ) : (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-3 border border-indigo-200 dark:border-indigo-700 bg-indigo-50/80 dark:bg-indigo-900/30 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                                    <FileIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">{formData.cv.name}</span>
                                                    <p className="text-xs text-indigo-600 dark:text-indigo-400">{(formData.cv.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={removeFile} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    )}
                                    {errors.cv && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.cv}
                                        </motion.p>
                                    )}
                                </motion.div>
                            </div>

                            <motion.div variants={fadeInUp} custom={7} className="space-y-3 border border-indigo-200 dark:border-indigo-700 rounded-lg p-4 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-violet-50/70 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-violet-900/30 backdrop-blur-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-base font-semibold bg-gradient-to-r from-indigo-800 via-purple-800 to-violet-800 dark:from-indigo-200 dark:via-purple-200 dark:to-violet-200 text-transparent bg-clip-text">Application Agreement Form</h3>
                                </div>

                                <div className="space-y-3 p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-2">
                                            <span className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">1</span>
                                        </div>
                                        <h4 className="font-medium text-indigo-800 dark:text-indigo-200 text-sm">Terms and Conditions Agreement</h4>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-6">
                                        <div className="flex items-center h-5">
                                            <Checkbox
                                                id="terms"
                                                checked={formData.acceptedTerms}
                                                onCheckedChange={(checked: boolean) => {
                                                    setFormData(prev => ({ ...prev, acceptedTerms: checked }));
                                                    setErrors(prev => ({ ...prev, acceptedTerms: undefined }));
                                                }}
                                                className={`h-3.5 w-3.5 p-0 ${formData.acceptedTerms ? "bg-indigo-500 border-indigo-500" : "border-2 border-slate-300 dark:border-slate-600"}`}
                                            />
                                        </div>
                                        <div className="flex items-baseline space-x-2">
                                            <Label htmlFor="terms" className="text-xs text-indigo-700 dark:text-indigo-300">I accept the terms and conditions of HitoAI Limited.</Label>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="link" className="p-0 h-auto font-normal text-indigo-600 dark:text-indigo-400 text-xs">
                                                        (Review Terms)
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Terms and Conditions</DialogTitle>
                                                        <DialogDescription>Please read these terms carefully before applying</DialogDescription>
                                                    </DialogHeader>
                                                    <TermsAndConditions />
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                    {errors.acceptedTerms && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1 ml-6 flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.acceptedTerms}
                                        </motion.p>
                                    )}
                                </div>

                                <div className="space-y-3 p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-2">
                                            <span className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">2</span>
                                        </div>
                                        <h4 className="font-medium text-indigo-800 dark:text-indigo-200 text-sm">Program Cost & Payment Agreement</h4>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-6">
                                        <div className="flex items-center h-5">
                                            <Checkbox
                                                id="payment"
                                                checked={formData.acceptedPayment}
                                                onCheckedChange={(checked: boolean) => {
                                                    setFormData(prev => ({ ...prev, acceptedPayment: checked }));
                                                    setErrors(prev => ({ ...prev, acceptedPayment: undefined }));
                                                }}
                                                className={`h-3.5 w-3.5 p-0 ${formData.acceptedPayment ? "bg-indigo-500 border-indigo-500" : "border-2 border-slate-300 dark:border-slate-600"}`}
                                            />
                                        </div>
                                        <Label htmlFor="payment" className="text-xs text-indigo-700 dark:text-indigo-300">
                                            I am aware that upon acceptance of the offer, the cost of the 3-month program is €700. This fee needs to be paid before the Program starts.
                                        </Label>
                                    </div>
                                    {errors.acceptedPayment && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1 ml-6 flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.acceptedPayment}
                                        </motion.p>
                                    )}
                                </div>

                                <div className="space-y-3 p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-violet-200/50 dark:border-violet-700/50">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-2">
                                            <span className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">3</span>
                                        </div>
                                        <h4 className="font-medium text-indigo-800 dark:text-indigo-200 text-sm">Assessment and Hiring Policy</h4>
                                    </div>
                                    <div className="flex items-start space-x-2 ml-6">
                                        <div className="flex items-center h-5 mt-1">
                                            <Checkbox
                                                id="hiringPolicy"
                                                checked={formData.acceptedHiringPolicy}
                                                onCheckedChange={(checked: boolean) => {
                                                    setFormData(prev => ({ ...prev, acceptedHiringPolicy: checked }));
                                                    setErrors(prev => ({ ...prev, acceptedHiringPolicy: undefined }));
                                                }}
                                                className={`h-3.5 w-3.5 p-0 ${formData.acceptedHiringPolicy ? "bg-indigo-500 border-indigo-500" : "border-2 border-slate-300 dark:border-slate-600"}`}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="hiringPolicy" className="text-xs text-indigo-700 dark:text-indigo-300">
                                                I acknowledge that applicants will be evaluated based on their assessment scores, and the outcomes are as follows:
                                            </Label>
                                            <ul className="mt-1 ml-4 text-xs text-indigo-700 dark:text-indigo-300 list-disc space-y-0.5">
                                                <li><span className="font-medium text-indigo-800 dark:text-indigo-200">90% or higher:</span> Direct hiring by HitoAI Limited or its industry partners.</li>
                                                <li><span className="font-medium text-indigo-800 dark:text-indigo-200">80% - 90%:</span> Certificate of Achievement and job support through HitoAI's network.</li>
                                                <li><span className="font-medium text-indigo-800 dark:text-indigo-200">70% - 80%:</span> Eligible for an internship upon a written request.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    {errors.acceptedHiringPolicy && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1 ml-6 flex items-center">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {errors.acceptedHiringPolicy}
                                        </motion.p>
                                    )}
                                </div>

                                <div className="space-y-2 p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-2">
                                            <span className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">4</span>
                                        </div>
                                        <h4 className="font-medium text-indigo-800 dark:text-indigo-200 text-sm">Declaration & Signature</h4>
                                    </div>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-300 ml-6">
                                        By submitting this form, I confirm that I have read, understood, and agreed to the terms stated above.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} custom={8}>
                                <Alert className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50 p-3">
                                    <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                    <AlertTitle className="text-amber-800 dark:text-amber-200 font-medium text-sm">Program Cost</AlertTitle>
                                    <AlertDescription className="text-amber-700 dark:text-amber-300 text-xs">
                                        €700 - Please do not make any payment until your application has been approved.
                                    </AlertDescription>
                                </Alert>
                            </motion.div>

                            <motion.div variants={fadeInUp} custom={9} className="pt-2">
                                <Button
                                    type="submit"
                                    className={`w-full h-10 ${isSubmitting || !formData.acceptedTerms || !formData.acceptedPayment || !formData.acceptedHiringPolicy
                                        ? "bg-slate-400 hover:bg-slate-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:via-indigo-600 hover:to-violet-700"
                                        } text-white rounded-lg shadow-md transition-all duration-200 relative overflow-hidden text-sm font-medium`}
                                    disabled={isSubmitting || !formData.acceptedTerms || !formData.acceptedPayment || !formData.acceptedHiringPolicy}
                                >
                                    {!(isSubmitting || !formData.acceptedTerms || !formData.acceptedPayment || !formData.acceptedHiringPolicy) && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shine"></div>
                                    )}
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application
                                            <CheckCircle2 className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                </motion.div>
            </Card>

            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
                .animate-shine {
                    animation: shine 2s ease-in-out infinite;
                }
                @keyframes badge-shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(300%) skewX(-15deg); }
                }
                .animate-badge-shine {
                    animation: badge-shine 3s infinite;
                }
            `}</style>
        </div>
    );
};

export default LearnerApplicationForm;


