"use client"

import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Shield,
    Lock,
    Eye,
    AlertCircle,
    Clock,
    FileText,
    Users,
    Check,
    ExternalLink,
    Mail,
    Sparkles
} from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// Define proper type for expanded sections
interface ExpandedSections {
    [key: string]: boolean;
}

const PrivacyPolicyPage = () => {
    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        introduction: true // Start with introduction expanded
    });
    const [scrollProgress, setScrollProgress] = useState(0);

    const pageRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(pageRef, { once: true, amount: 0.1 });

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

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const sections = [
        {
            id: 'introduction',
            title: 'Introduction',
            icon: <FileText className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p>At HitoAI Limited, we respect your privacy and are committed to protecting it through our compliance with this privacy policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website at https://hitoai.ai/ (our "Site") and use our AI-powered solutions such as Susnet, Selwel, and Secuell ("Services"), and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
                    <p>Given the nature of AI solutions, we prioritize data privacy. All data processed by our AI models complies with GDPR regulations applicable in the EU and UK.</p>
                    <p>Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, your choice is not to use our Site and Services. By accessing or using the Site and Services, you agree to this privacy policy.</p>
                </div>
            )
        },
        {
            id: 'information-collection',
            title: 'Information We Collect',
            icon: <Users className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p>We collect several types of information from and about users of our Site and Services, including:</p>
                    <ul className="list-none space-y-3">
                        {[
                            'Personal information that you provide to us, such as your name, email address, and company name when you register for an account, subscribe to our Services, or contact us.',
                            'Information about your internet connection, the equipment you use to access our Site, and usage details.',
                            'Information provided when you use our Services, including data inputs and outputs related to our AI solutions.',
                            'Any information you provide when communicating with us, such as through email, phone, or mail correspondence.'
                        ].map((item, index) => (
                            <li key={index} className="flex items-start">
                                <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p>We may also collect information automatically as you navigate through the Site, including usage details, IP addresses, browser types, and information collected through cookies and other tracking technologies.</p>
                </div>
            )
        },
        {
            id: 'information-use',
            title: 'How We Use Your Information',
            icon: <Eye className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            'To present our Site and Services and their contents to you.',
                            'To provide you with information, products, or services that you request from us.',
                            'To fulfill any other purpose for which you provide it.',
                            'To carry out our obligations and enforce our rights arising from any contracts entered into between you and us.',
                            'To notify you about changes to our Site or Services.',
                            'To improve our Site and Services, including enhancing our AI models and solutions.',
                            'In any other way we may describe when you provide the information.',
                            'For any other purpose with your consent.'
                        ].map((item, index) => (
                            <div key={index} className="bg-white/40 dark:bg-slate-800/40 p-3 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-colors duration-300 group">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-sm">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'information-sharing',
            title: 'Information Sharing and Disclosure',
            icon: <Users className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p>We may disclose aggregated information about our users, and information that does not identify any individual, without restriction.</p>
                    <p>We may disclose personal information that we collect or you provide as described in this privacy policy:</p>
                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <ul className="list-none space-y-3">
                            {[
                                'To our subsidiaries and affiliates.',
                                'To contractors, service providers, and other third parties we use to support our business.',
                                'To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of assets.',
                                'To fulfill the purpose for which you provide it.',
                                'For any other purpose disclosed by us when you provide the information.',
                                'With your consent.'
                            ].map((item, index) => (
                                <li key={index} className="flex items-start group">
                                    <div className="mr-3 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500/80 to-violet-500/80 dark:from-indigo-500/40 dark:to-violet-500/40 flex items-center justify-center group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="mt-4">We may also disclose your personal information:</p>

                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <ul className="list-none space-y-3">
                            {[
                                'To comply with any court order, law, or legal process, including to respond to any government or regulatory request.',
                                'To enforce or apply our terms of use and other agreements.',
                                'If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of HitoAI Limited, our customers, or others.'
                            ].map((item, index) => (
                                <li key={index} className="flex items-start group">
                                    <div className="mr-3 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500/80 to-violet-500/80 dark:from-indigo-500/40 dark:to-violet-500/40 flex items-center justify-center group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: 'data-security',
            title: 'Data Security',
            icon: <Lock className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <p className="text-slate-700 dark:text-slate-300">We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.</p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-stretch gap-4">
                        <div className="flex-1 p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                    <Shield className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white">Your Responsibility</h4>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Site, you are responsible for keeping this password confidential. We ask you not to share your password with anyone.</p>
                        </div>

                        <div className="flex-1 p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                    <AlertCircle className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white">Limitations</h4>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Site. Any transmission of personal information is at your own risk.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'data-retention',
            title: 'Data Retention',
            icon: <Clock className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 shadow-sm">
                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-3">
                                <div className="p-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <h3 className="font-medium ml-2">Maintenance Period</h3>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services.</p>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 shadow-sm">
                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-3">
                                <div className="p-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <h3 className="font-medium ml-2">Retention Duration</h3>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal requirements.</p>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 shadow-sm">
                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-3">
                                <div className="p-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <h3 className="font-medium ml-2">Data Responsibility</h3>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'gdpr-compliance',
            title: 'GDPR Compliance',
            icon: <Shield className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-700 dark:text-slate-300">For users in the European Economic Area (EEA), we process your personal data in accordance with the General Data Protection Regulation (GDPR). This means you have certain rights regarding your personal data, including:</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            {
                                title: 'Access & Delete',
                                description: 'The right to access, update or delete your personal information.'
                            },
                            {
                                title: 'Rectification',
                                description: 'The right to have your information altered if it is inaccurate or incomplete.'
                            },
                            {
                                title: 'Object',
                                description: 'The right to object to our processing of your personal data.'
                            },
                            {
                                title: 'Restriction',
                                description: 'The right to request that we restrict the processing of your personal information.'
                            },
                            {
                                title: 'Portability',
                                description: 'The right to receive a copy of your personal data in a structured, machine-readable format.'
                            },
                            {
                                title: 'Withdraw Consent',
                                description: 'The right to withdraw consent at any time where we relied on your consent to process your personal information.'
                            }
                        ].map((right, index) => (
                            <div
                                key={index}
                                className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-all duration-300 group"
                            >
                                <div className="flex items-center mb-2">
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 mr-2 group-hover:scale-110 transition-transform duration-300"></div>
                                    <h4 className="font-medium text-indigo-700 dark:text-indigo-300 text-sm">{right.title}</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{right.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100/60 dark:border-indigo-800/30 mt-4">
                        <p className="text-sm text-slate-700 dark:text-slate-300">Please note that we may ask you to verify your identity before responding to such requests. You have the right to complain to a Data Protection Authority about our collection and use of your personal data.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'children-privacy',
            title: 'Children\'s Privacy',
            icon: <Shield className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <div className="bg-indigo-50/80 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                                <AlertCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-2">Important Notice Regarding Children</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300">Our Services are not intended for children under 18 years of age. No one under age 18 may provide any information to or on the Site. We do not knowingly collect personal information from children under 18. If you are under 18, do not use or provide any information on this Site or through any of its features, register on the Site, or provide any information about yourself to us.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'cookies',
            title: 'Cookies and Tracking Technologies',
            icon: <Eye className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-700 dark:text-slate-300">We use cookies and similar tracking technologies to track activity on our Site and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.</p>

                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-3">Cookie Options</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.</p>

                        <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-2">We use cookies for the following purposes:</h4>
                        <ul className="list-none space-y-2">
                            {[
                                'To enable certain functions of the Service.',
                                'To provide analytics and understand how you use our Service.',
                                'To store your preferences.'
                            ].map((purpose, index) => (
                                <li key={index} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2"></div>
                                    {purpose}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: 'third-party-links',
            title: 'Links to Third-Party Sites',
            icon: <ExternalLink className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/2">
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-2 flex items-center">
                                    <ExternalLink className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    External Links
                                </h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300">Our Site may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
                            </div>

                            <div className="md:w-1/2">
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-2 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    Third-Party Responsibility
                                </h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300">We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'changes',
            title: 'Changes to Our Privacy Policy',
            icon: <Clock className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex items-center mb-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2">
                                    <Clock className="h-3 w-3 text-white" />
                                </div>
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Policy Updates</h4>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.</p>
                        </div>

                        <div className="flex-1 p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex items-center mb-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2">
                                    <Eye className="h-3 w-3 text-white" />
                                </div>
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Review Recommendation</h4>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'contact',
            title: 'Contact Us',
            icon: <Mail className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-700 dark:text-slate-300">If you have any questions about this Privacy Policy, please contact us:</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-all duration-300 group">
                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
                                <div className="p-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors duration-300">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <h3 className="font-medium ml-2">Email</h3>
                            </div>
                            <a href="mailto:info@hitoai.ai" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">info@hitoai.ai</a>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-all duration-300 group">
                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
                                <div className="p-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 02.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium ml-2">Phone</h3>
                            </div>
                            <a href="tel:+353899832147" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">+353 899832147</a>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-all duration-300 group">
                            <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
                                <div className="p-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <h3 className="font-medium ml-2">Mail</h3>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">Sandyford, Dublin 18, Dublin, Dublin County, Ireland</p>
                        </div>
                    </div>
                </div>
            )
        }
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
            className="bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/80 dark:from-[#080c1f] dark:via-[#0c1230] dark:to-[#111634] min-h-screen py-16 relative"
        >
            {/* Background Effects */}
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

                {/* Light beam effect - only visible in dark mode */}
                <div className="hidden dark:block absolute inset-0 overflow-hidden opacity-10">
                    <div className="light-beam light-beam-1"></div>
                </div>

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

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
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
                        className="bg-white/60 dark:bg-slate-800/20 backdrop-blur-md rounded-lg shadow-xl border border-indigo-100/50 dark:border-indigo-500/20 overflow-hidden"
                    >
                        {/* Decorative top gradient border */}
                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                        {/* Header */}
                        <motion.div
                            variants={fadeInUp}
                            custom={0}
                            className="bg-indigo-600 dark:bg-indigo-700/90 text-white p-6 sm:p-8 relative overflow-hidden"
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine"></div>

                            {/* Header Content */}
                            <div className="relative z-10">
                                <motion.h1
                                    variants={fadeInUp}
                                    custom={1}
                                    className="text-2xl md:text-3xl font-bold flex items-center"
                                >
                                    Privacy Policy
                                    <span className="ml-3 flex items-center bg-white/10 rounded-full px-3 py-1 text-xs font-medium">
                                        <Shield className="w-3 h-3 mr-1" />
                                        GDPR Compliant
                                    </span>
                                </motion.h1>
                                <motion.p
                                    variants={fadeInUp}
                                    custom={2}
                                    className="mt-2 text-indigo-100"
                                >
                                    Last updated November 29, 2024
                                </motion.p>
                                <motion.div
                                    variants={fadeInUp}
                                    custom={3}
                                    className="flex items-center mt-4 text-indigo-100"
                                >
                                    <Shield className="w-5 h-5 mr-2" />
                                    <span>Your privacy is important to us</span>
                                </motion.div>
                            </div>

                            {/* Background Elements */}
                            <div className="absolute right-0 bottom-0 opacity-10">
                                <svg width="180" height="180" viewBox="0 0 184 184" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M182 92C182 142.81 141.81 183 91 183C40.19 183 0 142.81 0 92C0 41.19 40.19 1 91 1C141.81 1 182 41.19 182 92Z" stroke="white" strokeWidth="2" />
                                    <path d="M169 92C169 135.63 133.63 171 90 171C46.37 171 11 135.63 11 92C11 48.37 46.37 13 90 13C133.63 13 169 48.37 169 92Z" stroke="white" strokeWidth="2" />
                                    <path d="M156 92C156 128.45 126.45 158 90 158C53.55 158 24 128.45 24 92C24 55.55 53.55 26 90 26C126.45 26 156 55.55 156 92Z" stroke="white" strokeWidth="2" />
                                    <path d="M143 92C143 121.27 119.27 145 90 145C60.73 145 37 121.27 37 92C37 62.73 60.73 39 90 39C119.27 39 143 62.73 143 92Z" stroke="white" strokeWidth="2" />
                                    <path d="M130 92C130 114.09 112.09 132 90 132C67.91 132 50 114.09 50 92C50 69.91 67.91 52 90 52C112.09 52 130 69.91 130 92Z" stroke="white" strokeWidth="2" />
                                    <path d="M117 92C117 106.91 104.91 119 90 119C75.09 119 63 106.91 63 92C63 77.09 75.09 65 90 65C104.91 65 117 77.09 117 92Z" stroke="white" strokeWidth="2" />
                                    <path d="M104 92C104 99.73 97.73 106 90 106C82.27 106 76 99.73 76 92C76 84.27 82.27 78 90 78C97.73 78 104 84.27 104 92Z" stroke="white" strokeWidth="2" />
                                    <path d="M91 2V182" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                                    <path d="M136 2V182" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                                    <path d="M46 2V182" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                                    <path d="M182 92L0 92" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                                    <path d="M182 47L0 47" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                                    <path d="M182 137L0 137" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Key Points Summary */}
                        <motion.div
                            variants={fadeInUp}
                            custom={4}
                            className="p-6 sm:p-8 border-b bg-indigo-50/80 dark:bg-indigo-900/20"
                        >
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <div className="w-1 h-4 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full mr-2"></div>
                                Key Privacy Points
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/50 transition-all duration-300 group">
                                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2 group-hover:translate-x-0.5 transition-transform duration-300">
                                        <Lock className="w-5 h-5 mr-2" />
                                        <h3 className="font-medium">Data Security</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">All data processed by our AI models complies with GDPR regulations applicable in the EU and UK.</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/50 transition-all duration-300 group">
                                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2 group-hover:translate-x-0.5 transition-transform duration-300">
                                        <Eye className="w-5 h-5 mr-2" />
                                        <h3 className="font-medium">Your Control</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">You have the right to access, update, or delete your personal information at any time.</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/50 transition-all duration-300 group">
                                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2 group-hover:translate-x-0.5 transition-transform duration-300">
                                        <AlertCircle className="w-5 h-5 mr-2" />
                                        <h3 className="font-medium">Limited Sharing</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">We only share your data with third parties when necessary and with your consent.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Policy Sections */}
                        <div className="divide-y dark:divide-slate-700/30">
                            {sections.map((section, index) => (
                                <motion.div
                                    variants={fadeInUp}
                                    custom={index + 5}
                                    key={section.id}
                                    id={section.id}
                                    className="p-6 sm:p-8"
                                >
                                    <button
                                        className="flex justify-between items-center w-full text-left group"
                                        onClick={() => toggleSection(section.id)}
                                        aria-expanded={expandedSections[section.id] ? "true" : "false"}
                                        aria-controls={`content-${section.id}`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm transition-all duration-300 ${expandedSections[section.id]
                                                ? "bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 text-white"
                                                : "bg-indigo-100/70 dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-400"
                                                }`}>
                                                {section.icon}
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                                {section.title}
                                            </h2>
                                        </div>
                                        <div className="flex items-center">
                                            {/* Animated pulse dot indicator when expanded */}
                                            {expandedSections[section.id] && (
                                                <div className="mr-3 relative">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping opacity-75"></div>
                                                </div>
                                            )}

                                            <div className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ${expandedSections[section.id]
                                                ? "bg-indigo-100/70 dark:bg-slate-700/50"
                                                : "bg-gray-100/70 dark:bg-slate-800/50"
                                                }`}>
                                                {expandedSections[section.id] ? (
                                                    <ChevronUp className={`h-5 w-5 text-indigo-600 dark:text-indigo-400`} />
                                                ) : (
                                                    <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300`} />
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {expandedSections[section.id] && (
                                            <motion.div
                                                id={`content-${section.id}`}
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="mt-4 text-gray-700 dark:text-gray-300 text-sm overflow-hidden"
                                            >
                                                {section.content}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        {/* Final Notice */}
                        <motion.div
                            variants={fadeInUp}
                            custom={20}
                            className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50/50 to-slate-50/50 dark:from-slate-800/20 dark:to-indigo-900/20 text-center relative overflow-hidden"
                        >
                            {/* Circle background element */}
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full border-2 border-indigo-200/20 dark:border-indigo-500/10 opacity-50"></div>
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full border-2 border-indigo-200/30 dark:border-indigo-500/10 opacity-50"></div>

                            <div className="relative">
                                <div className="inline-flex items-center mb-4">
                                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-indigo-50/80 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-12 -translate-x-full animate-badge-shine"></div>

                                        <div className="flex items-center">
                                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                                            <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">Committed to Your Privacy</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    By using our Site and Services, you acknowledge that you have read and understand this Privacy Policy.
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    © 2024 HitoAI Limited. All rights reserved.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
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
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shine {
          animation: shine 8s infinite;
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
        </div>
    );
};

export default PrivacyPolicyPage;