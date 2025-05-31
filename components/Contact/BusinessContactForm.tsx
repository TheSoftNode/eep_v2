import React, { useState } from 'react';
import { User, Mail, Building2, Code, Compass, Lightbulb, Send, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface BusinessContactFormProps {
    onSubmit: (formData: any) => Promise<void>;
    isSubmitting: boolean;
}

export const BusinessContactForm: React.FC<BusinessContactFormProps> = ({ onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        company: '',
        projectType: '',
        projectStatus: '',
        projectDetails: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    // Animation variants for form elements
    const formItemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1
                    }
                }
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <motion.div
                    className="space-y-1.5"
                    variants={formItemVariants}
                    custom={0}
                >
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent dark:focus:border-transparent focus:bg-white dark:focus:bg-slate-800 text-sm transition-all duration-200"
                            placeholder="Jane Smith"
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-focus-within:w-full transition-all duration-300 rounded-b-lg"></div>
                    </div>
                </motion.div>

                {/* Email */}
                <motion.div
                    className="space-y-1.5"
                    variants={formItemVariants}
                    custom={1}
                >
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent dark:focus:border-transparent focus:bg-white dark:focus:bg-slate-800 text-sm transition-all duration-200"
                            placeholder="jane@company.com"
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-focus-within:w-full transition-all duration-300 rounded-b-lg"></div>
                    </div>
                </motion.div>

                {/* Company */}
                <motion.div
                    className="space-y-1.5"
                    variants={formItemVariants}
                    custom={2}
                >
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company/Organization</label>
                    <div className="relative group">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent dark:focus:border-transparent focus:bg-white dark:focus:bg-slate-800 text-sm transition-all duration-200"
                            placeholder="Company Inc."
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-focus-within:w-full transition-all duration-300 rounded-b-lg"></div>
                    </div>
                </motion.div>

                {/* Project Type */}
                <motion.div
                    className="space-y-1.5"
                    variants={formItemVariants}
                    custom={3}
                >
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Type</label>
                    <div className="relative group">
                        <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        <select
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-9 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent dark:focus:border-transparent focus:bg-white dark:focus:bg-slate-800 text-sm transition-all duration-200"
                        >
                            <option value="">Select project type</option>
                            <option value="ai-implementation">AI Implementation</option>
                            <option value="cloud-migration">Cloud Migration</option>
                            <option value="data-analytics">Data Analytics Solution</option>
                            <option value="software-development">Software Development</option>
                            <option value="process-automation">Process Automation</option>
                            <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-focus-within:w-full transition-all duration-300 rounded-b-lg"></div>
                    </div>
                </motion.div>
            </div>

            {/* Current Project Status */}
            <motion.div
                className="space-y-1.5"
                variants={formItemVariants}
                custom={4}
            >
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Project Status</label>
                <div className="relative group">
                    <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                    <select
                        name="projectStatus"
                        value={formData.projectStatus}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-9 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent dark:focus:border-transparent focus:bg-white dark:focus:bg-slate-800 text-sm transition-all duration-200"
                    >
                        <option value="">Select current status</option>
                        <option value="concept">Concept/Idea Stage</option>
                        <option value="planning">Planning Phase</option>
                        <option value="early-development">Early Development</option>
                        <option value="ongoing">Ongoing Project with Challenges</option>
                        <option value="scaling">Scaling Existing Solution</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-focus-within:w-full transition-all duration-300 rounded-b-lg"></div>
                </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
                className="space-y-1.5"
                variants={formItemVariants}
                custom={5}
            >
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Details & Mentorship Needs</label>
                <div className="relative group">
                    <Lightbulb className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                    <textarea
                        name="projectDetails"
                        value={formData.projectDetails}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent dark:focus:border-transparent focus:bg-white dark:focus:bg-slate-800 text-sm transition-all duration-200"
                        placeholder="Describe your project, current challenges, and how our mentorship could benefit your development process..."
                    ></textarea>
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-focus-within:w-full transition-all duration-300 rounded-b-lg"></div>
                </div>
            </motion.div>

            <motion.button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 rounded-lg text-white font-medium hover:from-indigo-700 hover:to-violet-700 dark:hover:from-indigo-600 dark:hover:to-violet-600 transition-all flex items-center justify-center text-sm overflow-hidden group"
                variants={formItemVariants}
                custom={6}
                whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Animated shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1200"></div>

                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="relative">Processing...</span>
                    </>
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        <span className="relative">Request Mentorship</span>
                    </>
                )}
            </motion.button>
        </motion.form>
    );
};

export default BusinessContactForm;