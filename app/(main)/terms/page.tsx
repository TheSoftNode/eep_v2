"use client"

import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Shield,
    FileText,
    Lock,
    Eye,
    AlertCircle,
    Sparkles,
    Star,
    CheckCircle,
    BookOpen,
    Users,
    CreditCard,
    Repeat,
    RefreshCw,
    Copy,
    Clock,
    Globe,
    Scale,
    Mail,
    MessageSquare,
    Server,
    ExternalLink,
    Settings,
    Database,
    BookOpen as BookOpenIcon,
    LayoutGrid,
    HelpCircle,
    Send,
    Search
} from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const TermsAndConditionsPage: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        agreement: true // Start with agreement expanded
    });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSections, setFilteredSections] = useState<string[]>([]);

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

    const toggleSection = (sectionId: string): void => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredSections([]);
            return;
        }

        const filtered = sections.filter(section =>
            section.title.toLowerCase().includes(query) ||
            (typeof section.content === 'object' &&
                React.Children.toArray(section.content.props.children)
                    .some(child =>
                        (typeof child === 'string' && child.toLowerCase().includes(query)) ||
                        (typeof child === 'object' &&
                            child !== null &&
                            'props' in child && // Check if props exists
                            child.props &&
                            child.props.children &&
                            JSON.stringify(child.props.children).toLowerCase().includes(query))
                    ))
        ).map(section => section.id);

        setFilteredSections(filtered);
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            toggleSection(sectionId);
            setSearchQuery('');
            setFilteredSections([]);
        }
    };

    // Map icons to sections for visual enhancement
    const getSectionIcon = (sectionId: string) => {
        const iconMap: Record<string, JSX.Element> = {
            'agreement': <FileText className="w-5 h-5" />,
            'services': <Server className="w-5 h-5" />,
            'ip': <Copy className="w-5 h-5" />,
            'user-representations': <Users className="w-5 h-5" />,
            'user-registration': <BookOpen className="w-5 h-5" />,
            'products': <LayoutGrid className="w-5 h-5" />,
            'purchases': <CreditCard className="w-5 h-5" />,
            'subscriptions': <Repeat className="w-5 h-5" />,
            'refunds': <RefreshCw className="w-5 h-5" />,
            'prohibited': <AlertCircle className="w-5 h-5" />,
            'user-contributions': <MessageSquare className="w-5 h-5" />,
            'contribution-licence': <CheckCircle className="w-5 h-5" />,
            'social-media': <Globe className="w-5 h-5" />,
            'third-party-websites': <ExternalLink className="w-5 h-5" />,
            'advertisers': <Star className="w-5 h-5" />,
            'services-management': <Settings className="w-5 h-5" />,
            'privacy-policy': <Lock className="w-5 h-5" />,
            'term-termination': <Clock className="w-5 h-5" />,
            'modifications-interruptions': <RefreshCw className="w-5 h-5" />,
            'governing-law': <Scale className="w-5 h-5" />,
            'dispute-resolution': <Scale className="w-5 h-5" />,
            'corrections': <HelpCircle className="w-5 h-5" />,
            'disclaimer': <AlertCircle className="w-5 h-5" />,
            'limitations-liability': <Shield className="w-5 h-5" />,
            'indemnification': <Shield className="w-5 h-5" />,
            'user-data': <Database className="w-5 h-5" />,
            'electronic-communications': <Send className="w-5 h-5" />,
            'california-users': <Users className="w-5 h-5" />,
            'miscellaneous': <BookOpenIcon className="w-5 h-5" />,
            'contact-us': <Mail className="w-5 h-5" />,
            'nda': <Lock className="w-5 h-5" />
        };

        return iconMap[sectionId] || <FileText className="w-5 h-5" />;
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

    const sections = [
        {
            id: 'agreement',
            title: 'AGREEMENT TO OUR LEGAL TERMS',
            content: (
                <div className="space-y-4">
                    <p>We are HitoAI Limited ('Company', 'we', 'us', or 'our'), a company registered in Iceland at Sandyford, Dublin 18, Dublin, Dublin County.</p>
                    <p>We operate the website https:/hitoai.ai/ (the 'Site'), as well as any other related products and services that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Services').</p>

                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 mt-2">
                        <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Mail className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Contact Information</h4>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">You can contact us by phone at <span className="text-indigo-600 dark:text-indigo-400">+353 899832147</span>, email at <span className="text-indigo-600 dark:text-indigo-400">info@hitoai.com</span>, or by mail to Sandyford, Dublin 18, Dublin, Dublin County, Iceland.</p>
                    </div>

                    <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/70 dark:border-indigo-700/30">
                        <p className="text-slate-700 dark:text-slate-300">These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ('you'), and HitoAI Limited, concerning your access to and use of the Services. <span className="font-semibold">You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms.</span> IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
                    </div>

                    <p>We will provide you with prior notice of any scheduled changes to the Services you are using. The modified Legal Terms will become effective upon posting or notifying you by info@hitoai.com, as stated in the email message. By continuing to use the Services after the effective date of any changes, you agree to be bound by the modified terms.</p>

                    <div className="flex items-start p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100/70 dark:border-amber-700/30 mt-2">
                        <div className="flex-shrink-0 mt-0.5">
                            <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Important Notice</h4>
                            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300/80">The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.</p>
                        </div>
                    </div>

                    <p>We recommend that you print a copy of these Legal Terms for your records.</p>
                </div>
            )
        },
        {
            id: 'services',
            title: '1. OUR SERVICES',
            content: (
                <div className="space-y-4">
                    <p>The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.</p>

                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                <Globe className="h-3 w-3 text-white" />
                            </div>
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Industry</h4>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Tech industry</p>
                    </div>
                </div>
            )
        },

        {
            id: 'ip',
            title: '2. INTELLECTUAL PROPERTY RIGHTS',
            content: (
                <div className="space-y-4">
                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                <Copy className="h-3 w-3 text-white" />
                            </div>
                            Our intellectual property
                        </h4>
                        <p className="mt-2 text-slate-700 dark:text-slate-300">We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks').</p>
                        <p className="mt-2 text-slate-700 dark:text-slate-300">Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world.</p>
                        <p className="mt-2 text-slate-700 dark:text-slate-300">The Content and Marks are provided in or through the Services 'AS IS' for your personal, non-commercial use or internal business purpose only.</p>
                    </div>

                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 mt-4">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                <Users className="h-3 w-3 text-white" />
                            </div>
                            Your use of our Services
                        </h4>
                        <p className="mt-2 text-slate-700 dark:text-slate-300">Subject to your compliance with these Legal Terms, including the 'PROHIBITED ACTIVITIES' section below, we grant you a non-exclusive, non-transferable, revocable licence to:</p>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-colors duration-300 group">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-sm">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">Access the Services</p>
                                </div>
                            </div>
                            <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-colors duration-300 group">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-sm">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">Download or print a copy of any portion of the Content to which you have properly gained access</p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-3 text-slate-700 dark:text-slate-300">Solely for your personal, non-commercial use or internal business purpose.</p>

                        <div className="mt-3 p-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <p className="text-slate-700 dark:text-slate-300 text-sm">Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.</p>
                        </div>

                        <p className="mt-3 text-slate-700 dark:text-slate-300">If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: <span className="text-indigo-600 dark:text-indigo-400">info@hitoai.com</span>. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.</p>

                        <p className="mt-2 text-slate-700 dark:text-slate-300">We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.</p>

                        <div className="mt-3 flex items-start p-3 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100/70 dark:border-red-700/30">
                            <div className="flex-shrink-0 mt-0.5">
                                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 dark:text-red-300/90">Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 mt-4">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                <MessageSquare className="h-3 w-3 text-white" />
                            </div>
                            Your submissions and contributions
                        </h4>

                        <div className="mt-2 p-3 bg-amber-50/40 dark:bg-amber-900/10 rounded-lg border border-amber-100/50 dark:border-amber-700/30">
                            <p className="text-amber-800 dark:text-amber-300/90 text-sm">Please review this section and the 'PROHIBITED ACTIVITIES' section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.</p>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <h5 className="font-medium text-slate-800 dark:text-white text-sm mb-2">Submissions</h5>
                                <p className="text-xs text-slate-700 dark:text-slate-300">By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ('Submissions'), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <h5 className="font-medium text-slate-800 dark:text-white text-sm mb-2">Contributions</h5>
                                <p className="text-xs text-slate-700 dark:text-slate-300">The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality during which you may create, submit, post, display, transmit, publish, distribute, or broadcast content and materials to us or through the Services, including but not limited to text, writings, video, audio, photographs, music, graphics, comments, reviews, rating suggestions, personal information, or other material ('Contributions'). Any Submission that is publicly posted shall also be treated as a Contribution.</p>
                            </div>
                        </div>

                        <p className="mt-3 text-slate-700 dark:text-slate-300 text-sm">You understand that Contributions may be viewable by other users of the Services and possibly through third-party websites.</p>

                        <div className="mt-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                            <h5 className="font-medium text-slate-800 dark:text-white text-sm mb-2">When you post Contributions, you grant us a licence</h5>
                            <p className="text-xs text-slate-700 dark:text-slate-300">By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and licence to: use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), and exploit your Contributions (including, without limitation, your image, name, and voice) for any purpose, commercial, advertising, or otherwise, to prepare derivative works of, or incorporate into other works, your Contributions, and to sublicence the licences granted in this section.</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">Our use and distribution may occur in any media formats and through any media channels.</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">This licence includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide.</p>
                        </div>
                    </div>
                </div>
            )
        },

        {
            id: 'user-registration',
            title: '4. USER REGISTRATION',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/10 dark:to-violet-500/10 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <p className="text-slate-700 dark:text-slate-300">You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'products',
            title: '5. PRODUCTS',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <LayoutGrid className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Product Information</h4>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">We make every effort to display as accurately as possible the colours, features, specifications, and details of the products available on the Services. However, we do not guarantee that the colours, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colours and details of the products.</p>

                        <div className="mt-3 flex items-start p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex-shrink-0 mt-0.5">
                                <AlertCircle className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-indigo-700 dark:text-indigo-300/90">All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'purchases',
            title: '6. PURCHASES AND PAYMENT',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <CreditCard className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Payment Methods</h4>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 mb-3">We accept the following forms of payment:</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            {['Visa', 'Mastercard', 'American Express Discover', 'PayPal'].map((method, index) => (
                                <div key={index} className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30 hover:shadow-md transition-shadow duration-300 text-center">
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{method}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <p className="text-slate-700 dark:text-slate-300">You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in Euros.</p>

                            <p className="text-slate-700 dark:text-slate-300">You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorise us to charge your chosen payment provider for any such amounts upon placing your order. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.</p>

                            <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                                <p className="text-sm text-indigo-700 dark:text-indigo-300/90">We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our sole judgement, appear to be placed by dealers, resellers, or distributors.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },

        {
            id: 'subscriptions',
            title: '7. SUBSCRIPTIONS',
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                    <Repeat className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white">Billing and Renewal</h4>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">Your subscription will continue and automatically renew unless cancelled. You consent to our charging your payment method on a recurring basis without requiring your prior approval for each recurring charge, until such time as you cancel the applicable order. The length of your billing cycle will depend on the type of subscription plan you choose when you subscribed to the Services.</p>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                    <Star className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white">Free Trial</h4>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">We offer a 30-day free trial to new users who register with the Services. The account will not be charged and the subscription will be suspended until upgraded to a paid version at the end of the free trial.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                    <RefreshCw className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white">Cancellation</h4>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">You can cancel your subscription at any time by logging into your account. Your cancellation will take effect at the end of the current paid term. If you have any questions or are unsatisfied with our Services, please email us at <span className="text-indigo-600 dark:text-indigo-400">info@hitoai.com</span>.</p>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                    <CreditCard className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-md font-semibold text-slate-800 dark:text-white">Fee Changes</h4>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">We may, from time to time, make changes to the subscription fee and will communicate any price changes to you in accordance with applicable law.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'refunds',
            title: '8. RETURN/REFUNDS POLICY',
            content: (
                <div className="space-y-4">
                    <div className="p-5 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mb-4 shadow-md">
                                <RefreshCw className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-lg font-semibold text-slate-800 dark:text-white">All sales are final and no refund will be issued.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'prohibited',
            title: '9. PROHIBITED ACTIVITIES',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 flex items-center justify-center mr-3 shadow-md">
                                <AlertCircle className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Prohibited Activities</h4>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 mb-4">You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us.</p>

                        <p className="text-slate-700 dark:text-slate-300 mb-3">As a user of the Services, you agree not to:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                'Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.',
                                'Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.',
                                'Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.',
                                'Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.',
                                'Use any information obtained from the Services in order to harass, abuse, or harm another person.',
                                'Make improper use of our support services or submit false reports of abuse or misconduct.',
                                'Use the Services in a manner inconsistent with any applicable laws or regulations.',
                                'Engage in unauthorised framing of or linking to the Services.',
                                'Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming.',
                                'Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.',
                                'Delete the copyright or other proprietary rights notice from any Content.',
                                'Attempt to impersonate another user or person or use the username of another user.',
                                'Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism.',
                                'Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.',
                                'Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.',
                                'Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.',
                                'Copy or adapt the Services, software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.',
                                'Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.',
                                'Use a buying agent or purchasing agent to make purchases on the Services.',
                                'Make any unauthorised use of the Services including collecting usernames and/or email addresses of users by electronic or other means.',
                                'Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue­generating endeavour or commercial enterprise.',
                                'Sell or otherwise transfer your profile.',
                                'Use the Services to advertise or offer to sell goods and services.'
                            ].map((item, index) => (
                                <div key={index} className="flex items-start p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-red-100/20 dark:border-red-800/20 hover:border-red-200/30 dark:hover:border-red-700/30 transition-colors duration-300 group">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 flex items-center justify-center mr-3 shadow-sm">
                                        <AlertCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },

        {
            id: 'user-contributions',
            title: '10. USER GENERATED CONTRIBUTIONS',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <p className="text-slate-700 dark:text-slate-300 mb-4">The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, 'Contributions'). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary.</p>

                        <div className="bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 mb-4">
                            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">When you create or make available any Contribution, you thereby represent and warrant that:</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {[
                                'The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.',
                                'You are the creator and owner of or have the necessary licences, rights, consents, releases, and permissions to use and to authorise us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and these Legal Terms.',
                                'You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and these Legal Terms.',
                                'Your Contributions are not false, inaccurate, or misleading.',
                                'Your Contributions are not unsolicited or unauthorised advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.',
                                'Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libellous, slanderous, or otherwise objectionable (as determined by us).',
                                'Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.',
                                'Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.',
                                'Your Contributions do not violate any applicable law, regulation, or rule.',
                                'Your Contributions do not violate the privacy or publicity rights of any third party.',
                                'Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well­being of minors.',
                                'Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.',
                                'Your Contributions do not otherwise violate, or link to material that violates, any provision of these Legal Terms, or any applicable law or regulation.'
                            ].map((item, index) => (
                                <div key={index} className="flex items-start p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-colors duration-300 group">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-sm">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">{item}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-start p-3 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100/70 dark:border-red-700/30">
                            <div className="flex-shrink-0 mt-0.5">
                                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 dark:text-red-300/90">Any use of the Services in violation of the foregoing violates these Legal Terms and may result in, among other things, termination or suspension of your rights to use the Services.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'contribution-licence',
            title: '11. CONTRIBUTION LICENCE',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Copy className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">License Terms</h4>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 mb-4">
                            <p className="text-slate-700 dark:text-slate-300 text-sm">By posting your Contributions to any part of the Services or making Contributions accessible to the Services by linking your account from the Services to any of your social networking accounts, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and licence to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorise sublicences of the foregoing.</p>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 mb-3">This licence will apply to any form, media, or technology now known or hereafter developed, and includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you warrant that moral rights have not otherwise been asserted in your Contributions.</p>

                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex-1 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <p className="text-sm text-slate-700 dark:text-slate-300">We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.</p>
                            </div>

                            <div className="flex-1 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <p className="text-sm text-slate-700 dark:text-slate-300">We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions: (2) to re-categorise any Contributions to place them in more appropriate locations on the Services; and (3) to pre­screen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },

        {
            id: 'social-media',
            title: '12. SOCIAL MEDIA',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Globe className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Social Media Integration</h4>
                        </div>

                        <div className="space-y-3">
                            <p className="text-slate-700 dark:text-slate-300">As part of the functionality of the Services, you may link your account with online accounts you have with third-party service providers (each such account, a 'Third-Party Account') by either: (1) providing your Third-Party Account login information through the Services: or (2) allowing us to access your Third-Party Account, as is permitted under the applicable terms and conditions that govern your use of each Third-Party Account.</p>

                            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <p className="text-sm text-slate-700 dark:text-slate-300">You represent and warrant that you are entitled to disclose your Third-Party Account login information to us and/or grant us access to your Third-Party Account, without breach by you of any of the terms and conditions that govern your use of the applicable Third-Party Account, and without obligating us to pay any fees or making us subject to any usage limitations imposed by the third-party service provider of the Third-Party Account.</p>
                            </div>

                            <p className="text-slate-700 dark:text-slate-300">By granting us access to any Third-Party Accounts, you understand that (1) we may access, make available, and store (if applicable) any content that you have provided to and stored in your Third-Party Account (the 'Social Network Content') so that it is available on and through the Services via your account, including without limitation any friend lists and (2) we may submit to and receive from your Third-Party Account additional information to the extent you are notified when you link your account with the Third-Party Account.</p>

                            <div className="flex items-start p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                                <div className="flex-shrink-0 mt-0.5">
                                    <AlertCircle className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300/90">Depending on the Third-Party Accounts you choose and subject to the privacy settings that you have set in such Third-Party Accounts, personally identifiable information that you post to your Third-Party Accounts may be available on and through your account on the Services. Please note that if a Third-Party Account or associated service becomes unavailable or our access to such Third-Party Account is terminated by the third-party service provider, then Social Network Content may no longer be available on and through the Services.</p>
                                </div>
                            </div>

                            <p className="text-slate-700 dark:text-slate-300">You will have the ability to disable the connection between your account on the Services and your Third-Party Accounts at any time. PLEASE NOTE THAT YOUR RELATIONSHIP WITH THE THIRD-PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR AGREEMENT(S) WITH SUCH THIRD-PARTY SERVICE PROVIDERS.</p>

                            <p className="text-slate-700 dark:text-slate-300">We make no effort to review any Social Network Content for any purpose, including but not limited to, for accuracy, legality, or non-infringement, and we are not responsible for any Social Network Content. You acknowledge and agree that we may access your email address book associated with a Third-Party Account and your contacts list stored on your mobile device or tablet computer solely for purposes of identifying and informing you of those contacts who have also registered to use the Services.</p>

                            <p className="text-slate-700 dark:text-slate-300">You can deactivate the connection between the Services and your Third-Party Account by contacting us using the contact information below or through your account settings (if applicable). We will attempt to delete any information stored on our servers that was obtained through such Third­Party Account, except the username and profile picture that become associated with your account.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'third-party-websites',
            title: '13. THIRD-PARTY WEBSITES AND CONTENT',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <ExternalLink className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Third-Party Websites</h4>
                        </div>

                        <div className="space-y-3">
                            <p className="text-slate-700 dark:text-slate-300">The Services may contain (or you may be sent via the Site) links to other websites ('Third-Party Websites') as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ('Third-Party Content').</p>

                            <div className="flex items-start p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100/70 dark:border-amber-700/30">
                                <div className="flex-shrink-0 mt-0.5">
                                    <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-amber-700 dark:text-amber-300/90">Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third­Party Content posted on, available through, or installed from the Services, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites or the Third-Party Content.</p>
                                </div>
                            </div>

                            <p className="text-slate-700 dark:text-slate-300">Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Legal Terms no longer govern.</p>

                            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <p className="text-sm text-slate-700 dark:text-slate-300">You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Services or relating to any applications you use or install from the Services. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party.</p>
                            </div>

                            <p className="text-slate-700 dark:text-slate-300">You agree and acknowledge that we do not endorse the products or services offered on Third-Party Websites and you shall hold us blameless from any harm caused by your purchase of such products or services. Additionally, you shall hold us blameless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'advertisers',
            title: '14. ADVERTISERS',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/10 dark:to-violet-500/10 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center">
                                    <Star className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <p className="text-slate-700 dark:text-slate-300">We allow advertisers to display their advertisements and other information in certain areas of the Services, such as sidebar advertisements or banner advertisements. We simply provide the space to place such advertisements, and we have no other relationship with advertisers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'services-management',
            title: '15. SERVICES MANAGEMENT',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Settings className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Management Rights</h4>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <p className="text-slate-700 dark:text-slate-300 text-sm">We reserve the right, but not the obligation, to:</p>
                            <ul className="mt-2 space-y-2">
                                {[
                                    'Monitor the Services for violations of these Legal Terms',
                                    'Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities',
                                    'In our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof',
                                    'In our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems',
                                    'Otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
                                            <CheckCircle className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },

        {
            id: 'privacy-policy',
            title: '16. PRIVACY POLICY',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Lock className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Data Privacy</h4>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 mb-4">
                            <p className="text-slate-700 dark:text-slate-300">Given the nature of AI solutions, we prioritize data privacy. All data processed by our AI models complies with GDPR regulations applicable in the EU and UK. For further details, please review our comprehensive Privacy Policy.</p>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300">We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy posted on the Services, which is incorporated into these Legal Terms. Please be advised the Services are hosted in Ireland and UK. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in Ireland and UK, then through your continued use of the Services, you are transferring your data to Ireland and UK, and you expressly consent to have your data transferred to and processed in Ireland and UK.</p>

                        <div className="mt-4 flex justify-center">
                            <a
                                href="/privacy-policy"
                                className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-300 text-white shadow-md hover:shadow-lg flex items-center"
                            >
                                <Lock className="h-4 w-4 mr-2" />
                                <span>View Privacy Policy</span>
                            </a>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'term-termination',
            title: '17. TERM AND TERMINATION',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Duration and Termination</h4>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 mb-3">These Legal Terms shall remain in full force and effect while you use the Services.</p>

                        <div className="p-3 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100/70 dark:border-red-700/30 mb-4">
                            <p className="text-red-700 dark:text-red-300/90 text-sm font-medium uppercase tracking-wide">Important Notice</p>
                            <p className="mt-2 text-red-700 dark:text-red-300/90 text-sm">WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME WITHOUT WARNING, IN OUR SOLE DISCRETION.</p>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300">If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'modifications-interruptions',
            title: '18. MODIFICATIONS AND INTERRUPTIONS',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <RefreshCw className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Changes and Accessibility</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <h5 className="font-medium text-slate-800 dark:text-white text-sm mb-2">Content Changes</h5>
                                <p className="text-xs text-slate-700 dark:text-slate-300">We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We also reserve the right to modify or discontinue all or part of the Services without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.</p>
                            </div>

                            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <h5 className="font-medium text-slate-800 dark:text-white text-sm mb-2">Service Availability</h5>
                                <p className="text-xs text-slate-700 dark:text-slate-300">We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services.</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100/70 dark:border-amber-700/30">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                    <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-amber-700 dark:text-amber-300/90">Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'governing-law',
            title: '19. GOVERNING LAW',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Scale className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Applicable Law</h4>
                        </div>

                        <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                            <p className="text-sm text-slate-700 dark:text-slate-300">These Legal Terms are governed by and interpreted following the laws of Ireland, and use of the United Nations Convention of Contracts for the International Sales of Goods is expressly excluded. If your habitual residence is in the EU, and you are a consumer, you additionally possess the protection provided to you by obligatory provisions of the law in your country to residence. HitoAI Limited and yourself both agree to submit to the non-exclusive jurisdiction of the courts of Dublin, which means that you may make a claim to defend your consumer protection rights in regards to these Legal Terms in Ireland, or in the EU country in which you reside.</p>
                        </div>
                    </div>
                </div>
            )
        },

        {
            id: 'dispute-resolution',
            title: '20. DISPUTE RESOLUTION',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                        <MessageSquare className="h-4 w-4 text-white" />
                                    </div>
                                    <h4 className="text-md font-semibold text-slate-800 dark:text-white">Informal Negotiations</h4>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a 'Dispute' and collectively, the 'Disputes') brought by either you or us (individually, a 'Party' and collectively, the 'Parties'), the Parties agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least thirty (30) days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                        <Scale className="h-4 w-4 text-white" />
                                    </div>
                                    <h4 className="text-md font-semibold text-slate-800 dark:text-white">Binding Arbitration</h4>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">Any dispute arising from the relationships between the Parties to these Legal Terms shall be determined by one arbitrator who will be chosen in accordance with the Arbitration and Internal Rules of the European Court of Arbitration being part of the European Centre of Arbitration having its seat in Strasbourg, and which are in force at the time the application for arbitration is filed, and of which adoption of this clause constitutes acceptance. The seat of arbitration shall be Dublin, Ireland. The language of the proceedings shall be English. Applicable rules of substantive law shall be the law of Ireland.</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                        <AlertCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <h4 className="text-md font-semibold text-slate-800 dark:text-white">Restrictions</h4>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                        <Shield className="h-4 w-4 text-white" />
                                    </div>
                                    <h4 className="text-md font-semibold text-slate-800 dark:text-white">Exceptions to Arbitration</h4>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations and binding arbitration: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief. If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'corrections',
            title: '21. CORRECTIONS',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mb-4 shadow-md">
                                <HelpCircle className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'disclaimer',
            title: '22. DISCLAIMER',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 flex items-center justify-center mr-3 shadow-md">
                                <AlertCircle className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">General Disclaimer</h4>
                        </div>

                        <div className="p-4 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100/70 dark:border-red-700/30">
                            <p className="text-red-700 dark:text-red-300/90 text-sm uppercase tracking-wide font-semibold mb-2">Important Notice</p>
                            <p className="text-red-700 dark:text-red-300/90 text-sm">THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGEMENT AND EXERCISE CAUTION WHERE APPROPRIATE.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'limitations-liability',
            title: '23. LIMITATIONS OF LIABILITY',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Shield className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Liability Limitations</h4>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 mb-4">
                            <p className="text-slate-700 dark:text-slate-300 text-sm">For AI-based services, HitoAI makes every effort to provide accurate and reliable outputs. However, results may vary depending on individual use cases. Users are encouraged to validate outputs with appropriate professional advice.</p>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300">In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the services, even if we have been advised of the possibility of such damages. Notwithstanding anything to the contrary contained herein, our liability to you for any cause whatsoever and regardless of the form of the action, will at all times be limited to the amount paid, if any, by you to us during the six (6) month period prior to any cause of action arising. Certain US state laws and international laws do not allow limitations on implied warranties or the exclusion or limitation of certain damages. If these laws apply to you, some or all of the above disclaimers or limitations may not apply to you, and you may have additional rights.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'indemnification',
            title: '24. INDEMNIFICATION',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Shield className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">User Indemnification</h4>
                        </div>

                        <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                            <p className="text-sm text-slate-700 dark:text-slate-300">You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorney's fees and expenses, made by any third party due to or arising out of:</p>

                            <ul className="mt-2 space-y-2">
                                {[
                                    'Your Contributions',
                                    'Use of the Services',
                                    'Breach of these Legal Terms',
                                    'Any breach of your representations and warranties set forth in these Legal Terms',
                                    'Your violation of the rights of a third party, including but not limited to intellectual property rights',
                                    'Any overt harmful act toward any other user of the Services with whom you connected via the Services'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
                                            <CheckCircle className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.</p>
                        </div>
                    </div>
                </div>
            )
        },

        {
            id: 'user-data',
            title: '25. USER DATA',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Database className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Your Data Responsibility</h4>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <Server className="h-3 w-3 text-white" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Our Backup Process</h4>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services.</p>
                            </div>

                            <div className="flex-1 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <AlertCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Liability Limitation</h4>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">You agree that we shall have no liability to you for any loss or corruption of any such data.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'electronic-communications',
            title: '26. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Send className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Electronic Communication Consent</h4>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <p className="text-slate-700 dark:text-slate-300 text-sm">Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing.</p>

                            <p className="mt-3 text-slate-700 dark:text-slate-300 text-sm font-medium">YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES.</p>

                            <p className="mt-3 text-slate-700 dark:text-slate-300 text-sm">You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'california-users',
            title: '27. CALIFORNIA USERS AND RESIDENTS',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">California Resident Rights</h4>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300">If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'miscellaneous',
            title: '28. MISCELLANEOUS',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/10 dark:to-violet-500/10 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center">
                                    <BookOpenIcon className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <p className="text-slate-700 dark:text-slate-300">These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'contact-us',
            title: '29. CONTACT US',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Mail className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Contact Information</h4>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 mb-4">In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>

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
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    <span>HitoAI Limited</span><br />
                                    <span>Sandyford, Dublin 18</span><br />
                                    <span>Dublin, Dublin County</span><br />
                                    <span>Iceland</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },

        {
            id: 'nda',
            title: 'NON-DISCLOSURE AGREEMENT (NDA)',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-3 shadow-md">
                                <Lock className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-white">Confidentiality Agreement</h4>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 mb-4">This Non-Disclosure Agreement ("Agreement") is entered into for the purpose of preventing unauthorized disclosure of confidential and proprietary information, as defined below. The parties agree to establish a confidential relationship concerning the disclosure of certain proprietary and confidential information ("Confidential Information").</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">1</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Definition of Confidential Information</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">For the purposes of this Agreement, "Confidential Information" includes all information or material that has or could have commercial value or other utility in the business operations of HitoAI Limited. If Confidential Information is in written form, the disclosing party shall label or stamp it as "Confidential." If transmitted orally, the disclosing party shall promptly provide a written confirmation designating the information as confidential.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">2</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Exclusions from Confidential Information</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">Receiving Party's obligations under this Agreement do not apply to information that: (a) Is publicly available at the time of disclosure or becomes publicly available through no fault of the Receiving Party; (b) Was independently developed or discovered by the Receiving Party before disclosure; (c) Is lawfully obtained from a third party without breach of confidentiality; (d) Is disclosed with the prior written approval of the Disclosing Party.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">3</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Obligations of the Receiving Party</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">The Receiving Party agrees to: (a) Maintain the Confidential Information in strict confidence for the sole benefit of the Disclosing Party; (b) Restrict access to Confidential Information to employees, contractors, and third parties who require it, ensuring they sign non-disclosure agreements as protective as this Agreement; (c) Not disclose, publish, copy, or use Confidential Information for any unauthorized purposes; (d) Return all Confidential Information upon request by the Disclosing Party.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">4</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Duration of Confidentiality Obligations</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">The confidentiality obligations of the Receiving Party shall survive the termination of this Agreement until the Confidential Information no longer qualifies as a trade secret or until the Disclosing Party releases the Receiving Party from its obligations in writing.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">5</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Relationship of the Parties</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">Nothing in this Agreement shall create a partnership, joint venture, or employment relationship between the parties.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">6</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Severability</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">If any provision of this Agreement is found to be invalid or unenforceable, the remainder shall be interpreted to best reflect the intent of the parties.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">7</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Integration Clause</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">This Agreement constitutes the complete understanding between the parties and supersedes all prior agreements. Amendments must be in writing and signed by both parties.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">8</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Waiver</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">Failure to enforce any provision of this Agreement shall not constitute a waiver of rights under this Agreement.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">9</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Intellectual Property Rights</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">The Receiving Party agrees not to use, exploit, or disclose any intellectual property related to HitoAI Limited or the SusNet project. All intellectual property developed or disclosed in relation to HitoAI, including but not limited to research findings, algorithms, models, and data, shall remain the sole property of HitoAI Limited. No independent use, transfer, or distribution of intellectual property is permitted without prior written consent.</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-indigo-100/40 dark:border-indigo-700/30">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 flex items-center justify-center mr-2 shadow-sm">
                                        <span className="text-white text-xs font-semibold">10</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-800 dark:text-white">Non-Disclosure Obligation</h5>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300">The Receiving Party remains bound by the NDA indefinitely, even after their involvement in the project ends. Disclosure or utilization of any project-related information is strictly prohibited without prior written consent.</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30">
                            <p className="text-slate-700 dark:text-slate-300 text-sm">This Agreement is binding upon the representatives, assigns, and successors of both parties. Each party acknowledges their obligations by signing this Agreement.</p>
                        </div>
                    </div>
                </div>
            )
        },
    ]

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
                                    Terms and Conditions
                                    <span className="ml-3 flex items-center bg-white/10 rounded-full px-3 py-1 text-xs font-medium">
                                        <FileText className="w-3 h-3 mr-1" />
                                        Legal Agreement
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
                                    <FileText className="w-5 h-5 mr-2" />
                                    <span>Please read these terms carefully</span>
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

                        {/* Introduction */}
                        <motion.div
                            variants={fadeInUp}
                            custom={4}
                            className="p-6 sm:p-8 border-b bg-white/80 dark:bg-slate-800/30"
                        >
                            <p className="text-slate-700 dark:text-slate-300">
                                Welcome to HitoAI! These Terms and Conditions ("Terms") govern your access to and use of HitoAI Limited's services, including our website and AI-powered solutions such as Susnet, Selwel, and Secuell ("Services"). By accessing the Services, you agree to these Terms. If you do not agree, please discontinue use immediately.
                            </p>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.div
                            variants={fadeInUp}
                            custom={5}
                            className="p-6 sm:px-8 sm:pt-2 sm:pb-6 border-b bg-indigo-50/80 dark:bg-indigo-900/10"
                        >
                            <div className="relative">
                                <div className={`flex items-center border-2 ${isSearchFocused ? 'border-indigo-500 dark:border-indigo-400' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800/60 rounded-lg pl-3 pr-4 transition-all duration-300`}>
                                    <Search className={`w-5 h-5 ${isSearchFocused ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} transition-colors duration-300`} />
                                    <input
                                        type="text"
                                        placeholder="Search terms..."
                                        className="w-full py-2 px-3 focus:outline-none bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                    />
                                </div>

                                {searchQuery && filteredSections.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 max-h-64 overflow-y-auto">
                                        {filteredSections.map((sectionId) => {
                                            const section = sections.find(s => s.id === sectionId);
                                            return section ? (
                                                <button
                                                    key={sectionId}
                                                    className="w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 text-sm transition-colors"
                                                    onClick={() => scrollToSection(sectionId)}
                                                >
                                                    <div className="flex items-center">
                                                        {getSectionIcon(sectionId)}
                                                        <span className="ml-2">{section.title}</span>
                                                    </div>
                                                </button>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Table of Contents */}
                        <motion.div
                            variants={fadeInUp}
                            custom={6}
                            className="p-6 sm:p-8 border-b bg-white/80 dark:bg-slate-800/30"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <div className="w-1 h-4 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full mr-2"></div>
                                TABLE OF CONTENTS
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {sections.map((section, index) => (
                                    <motion.a
                                        key={section.id}
                                        variants={fadeInUp}
                                        custom={index + 7}
                                        href={`#${section.id}`}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-slate-800/20 px-3 py-2 rounded-md transition-all duration-300 flex items-center space-x-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const element = document.getElementById(section.id);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                                toggleSection(section.id);
                                            }
                                        }}
                                    >
                                        <span className="flex-shrink-0">{getSectionIcon(section.id)}</span>
                                        <span>{section.title}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Policy Sections */}
                        <div className="divide-y dark:divide-slate-700/30">
                            {sections.map((section, index) => (
                                <motion.div
                                    variants={fadeInUp}
                                    custom={index + 30}
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
                                                {getSectionIcon(section.id)}
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
                            custom={100}
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
                                            <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">Legal Agreement</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    By using our Site and Services, you acknowledge that you have read and understand these Terms and Conditions.
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

export default TermsAndConditionsPage;





// "use client"

// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Shield, FileText } from 'lucide-react';

// const TermsAndConditionsPage: React.FC = () => {
//     const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

//     const toggleSection = (sectionId: string): void => {
//         setExpandedSections(prev => ({
//             ...prev,
//             [sectionId]: !prev[sectionId]
//         }));
//     };

//     const sections = [
//         {
//             id: 'agreement',
//             title: 'AGREEMENT TO OUR LEGAL TERMS',
//             content: (
//                 <div className="space-y-4">
//                     <p>We are HitoAI Limited ('Company', 'we', 'us', or 'our'), a company registered in Iceland at Sandyford, Dublin 18, Dublin, Dublin County.</p>
//                     <p>We operate the website https:/hitoai.ai/ (the 'Site'), as well as any other related products and services that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Services').</p>
//                     <p>You can contact us by phone at +353 899832147, email at info@hitoai.com, or by mail to Sandyford, Dublin 18, Dublin, Dublin County, Iceland.</p>
//                     <p>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ('you'), and HitoAI Limited, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
//                     <p>We will provide you with prior notice of any scheduled changes to the Services you are using. The modified Legal Terms will become effective upon posting or notifying you by info@hitoai.com, as stated in the email message. By continuing to use the Services after the effective date of any changes, you agree to be bound by the modified terms.</p>
//                     <p>The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.</p>
//                     <p>We recommend that you print a copy of these Legal Terms for your records.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'services',
//             title: '1. OUR SERVICES',
//             content: (
//                 <div className="space-y-4">
//                     <p>The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.</p>
//                     <p>Tech industry</p>
//                 </div>
//             )
//         },
//         {
//             id: 'ip',
//             title: '2. INTELLECTUAL PROPERTY RIGHTS',
//             content: (
//                 <div className="space-y-4">
//                     <h4 className="font-semibold text-gray-800">Our intellectual property</h4>
//                     <p>We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks').</p>
//                     <p>Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world.</p>
//                     <p>The Content and Marks are provided in or through the Services 'AS IS' for your personal, non-commercial use or internal business purpose only.</p>

//                     <h4 className="font-semibold text-gray-800 mt-4">Your use of our Services</h4>
//                     <p>Subject to your compliance with these Legal Terms, including the 'PROHIBITED ACTIVITIES' section below, we grant you a non-exclusive, non-transferable, revocable licence to:</p>
//                     <ul className="list-disc list-inside pl-4">
//                         <li>Access the Services; and</li>
//                         <li>Download or print a copy of any portion of the Content to which you have properly gained access</li>
//                     </ul>
//                     <p>Solely for your personal, non-commercial use or internal business purpose.</p>
//                     <p>Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.</p>
//                     <p>If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: info@hitoai.com. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.</p>
//                     <p>We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.</p>
//                     <p>Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.</p>

//                     <h4 className="font-semibold text-gray-800 mt-4">Your submissions and contributions</h4>
//                     <p>Please review this section and the 'PROHIBITED ACTIVITIES' section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.</p>
//                     <p>Submissions: By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ('Submissions'), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.</p>
//                     <p>Contributions: The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality during which you may create, submit, post, display, transmit, publish, distribute, or broadcast content and materials to us or through the Services, including but not limited to text, writings, video, audio, photographs, music, graphics, comments, reviews, rating suggestions, personal information, or other material ('Contributions'). Any Submission that is publicly posted shall also be treated as a Contribution.</p>
//                     <p>You understand that Contributions may be viewable by other users of the Services and possibly through third-party websites.</p>
//                     <p>When you post Contributions, you grant us a licence (Including use of your name, trademarks, and logos): By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and licence to: use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), and exploit your Contributions (including, without limitation, your image, name, and voice) for any purpose, commercial, advertising, or otherwise, to prepare derivative works of, or incorporate into other works, your Contributions, and to sublicence the licences granted in this section.</p>
//                     <p>Our use and distribution may occur in any media formats and through any media channels.</p>
//                     <p>This licence includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide.</p>
//                     <p>You are responsible for what you post or upload: By sending us Submissions and/or posting Contributions through any part of the Services or making Contributions accessible through the Services by linking your account through the Services to any of your social networking accounts, you:</p>
//                     <ul className="list-disc list-inside pl-4">
//                         <li>Confirm that you have read and agree with our 'PROHIBITED ACTIVITIES' and will not post, send, publish, upload, or transmit through the Services any Submission nor post any Contribution that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;</li>
//                         <li>To the extent permissible by applicable law, waive any and all moral rights to any such Submission and/or Contribution;</li>
//                         <li>warrant that any such Submission and/or Contributions are original to you or that you have the necessary rights and licences to submit such Submissions and/or Contributions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions and/or Contributions; and</li>
//                         <li>warrant and represent that your Submissions and/or Contributions do not constitute confidential information.</li>
//                     </ul>
//                     <p>You are solely responsible for your Submissions and/or Contributions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party's intellectual property rights, or (c) applicable law.</p>
//                     <p>We may remove or edit your Content: Although we have no obligation to monitor any Contributions, we shall have the right to remove or edit any Contributions at any time without notice if in our reasonable opinion we consider such Contributions harmful or in breach of these Legal Terms. If we remove or edit any such Contributions, we may also suspend or disable your account and report you to the authorities.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'user-representations',
//             title: '3. USER REPRESENTATIONS',
//             content: (
//                 <div className="space-y-4">
//                     <p>By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside; (5) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (6) you will not use the Services for any illegal or unauthorised purpose: and (7) your use of the Services will not violate any applicable law or regulation.</p>
//                     <p>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).</p>
//                 </div>
//             )
//         },
//         {
//             id: 'user-registration',
//             title: '4. USER REGISTRATION',
//             content: (
//                 <div className="space-y-4">
//                     <p>You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'products',
//             title: '5. PRODUCTS',
//             content: (
//                 <div className="space-y-4">
//                     <p>We make every effort to display as accurately as possible the colours, features, specifications, and details of the products available on the Services. However, we do not guarantee that the colours, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colours and details of the products. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'purchases',
//             title: '6. PURCHASES AND PAYMENT',
//             content: (
//                 <div className="space-y-4">
//                     <p>We accept the following forms of payment:</p>
//                     <ul className="list-disc list-inside pl-4">
//                         <li>Visa</li>
//                         <li>Mastercard</li>
//                         <li>American Express Discover</li>
//                         <li>PayPal</li>
//                     </ul>
//                     <p>You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in Euros.</p>
//                     <p>You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorise us to charge your chosen payment provider for any such amounts upon placing your order. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.</p>
//                     <p>We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our sole judgement, appear to be placed by dealers, resellers, or distributors.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'subscriptions',
//             title: '7. SUBSCRIPTIONS',
//             content: (
//                 <div className="space-y-4">
//                     <h4 className="font-semibold text-gray-800">Billing and Renewal</h4>
//                     <p>Your subscription will continue and automatically renew unless cancelled. You consent to our charging your payment method on a recurring basis without requiring your prior approval for each recurring charge, until such time as you cancel the applicable order. The length of your billing cycle will depend on the type of subscription plan you choose when you subscribed to the Services.</p>

//                     <h4 className="font-semibold text-gray-800 mt-4">Free Trial</h4>
//                     <p>We offer a 30-day free trial to new users who register with the Services. The account will not be charged and the subscription will be suspended until upgraded to a paid version at the end of the free trial.</p>

//                     <h4 className="font-semibold text-gray-800 mt-4">Cancellation</h4>
//                     <p>You can cancel your subscription at any time by logging into your account. Your cancellation will take effect at the end of the current paid term. If you have any questions or are unsatisfied with our Services, please email us at info@hitoai.com.</p>

//                     <h4 className="font-semibold text-gray-800 mt-4">Fee Changes</h4>
//                     <p>We may, from time to time, make changes to the subscription fee and will communicate any price changes to you in accordance with applicable law.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'refunds',
//             title: '8. RETURN/REFUNDS POLICY',
//             content: (
//                 <div className="space-y-4">
//                     <p>All sales are final and no refund will be issued.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'prohibited',
//             title: '9. PROHIBITED ACTIVITIES',
//             content: (
//                 <div className="space-y-4">
//                     <p>You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us.</p>
//                     <p>As a user of the Services, you agree not to:</p>
//                     <ul className="list-disc list-inside pl-4">
//                         <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
//                         <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
//                         <li>Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</li>
//                         <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
//                         <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
//                         <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
//                         <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
//                         <li>Engage in unauthorised framing of or linking to the Services.</li>
//                         <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.</li>
//                         <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
//                         <li>Delete the copyright or other proprietary rights notice from any Content.</li>
//                         <li>Attempt to impersonate another user or person or use the username of another user.</li>
//                         <li>Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ('gifs'), 1 x 1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as 'spyware' or 'passive collection mechanisms' or 'pcms').</li>
//                         <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.</li>
//                         <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</li>
//                         <li>Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.</li>
//                         <li>Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
//                         <li>Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.</li>
//                         <li>Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system including without limitation any spider robot, cheat utility scraper, or offline reader that accesses the Services, or use or launch any unauthorised script or other software.</li>
//                         <li>Use a buying agent or purchasing agent to make purchases on the Services.</li>
//                         <li>Make any unauthorised use of the Services including collecting usernames and/or email addresses of users by electronic or other means. for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretences.</li>
//                         <li>Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue­generating endeavour or commercial enterprise.</li>
//                         <li>Use the Services to advertise or offer to sell goods and services.</li>
//                         <li>Sell or otherwise transfer your profile.</li>
//                     </ul>
//                 </div>
//             )
//         },
//         {
//             id: 'user-contributions',
//             title: '10. USER GENERATED CONTRIBUTIONS',
//             content: (
//                 <div className="space-y-4">
//                     <p>The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, 'Contributions'). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contribution, you thereby represent and warrant that:</p>
//                     <ul className="list-disc list-inside pl-4">
//                         <li>The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.</li>
//                         <li>You are the creator and owner of or have the necessary licences, rights, consents, releases, and permissions to use and to authorise us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and these Legal Terms.</li>
//                         <li>You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and these Legal Terms.</li>
//                         <li>Your Contributions are not false, inaccurate, or misleading.</li>
//                         <li>Your Contributions are not unsolicited or unauthorised advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.</li>
//                         <li>Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libellous, slanderous, or otherwise objectionable (as determined by us).</li>
//                         <li>Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.</li>
//                         <li>Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.</li>
//                         <li>Your Contributions do not violate any applicable law, regulation, or rule.</li>
//                         <li>Your Contributions do not violate the privacy or publicity rights of any third party.</li>
//                         <li>Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well­being of minors.</li>
//                         <li>Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.</li>
//                         <li>Your Contributions do not otherwise violate, or link to material that violates, any provision of these Legal Terms, or any applicable law or regulation.</li>
//                     </ul>
//                     <p>Any use of the Services in violation of the foregoing violates these Legal Terms and may result in, among other things, termination or suspension of your rights to use the Services.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'contribution-licence',
//             title: '11. CONTRIBUTION LICENCE',
//             content: (
//                 <div className="space-y-4">
//                     <p>By posting your Contributions to any part of the Services or making Contributions accessible to the Services by linking your account from the Services to any of your social networking accounts, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and licence to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorise sublicences of the foregoing.</p>
//                     <p>This licence will apply to any form, media, or technology now known or hereafter developed, and includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you warrant that moral rights have not otherwise been asserted in your Contributions.</p>
//                     <p>We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.</p>
//                     <p>We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions: (2) to re-categorise any Contributions to place them in more appropriate locations on the Services; and (3) to pre­screen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'social-media',
//             title: '12. SOCIAL MEDIA',
//             content: (
//                 <div className="space-y-4">
//                     <p>As part of the functionality of the Services, you may link your account with online accounts you have with third-party service providers (each such account, a 'Third-Party Account') by either: (1) providing your Third-Party Account login information through the Services: or (2) allowing us to access your Third-Party Account, as is permitted under the applicable terms and conditions that govern your use of each Third-Party Account.</p>
//                     <p>You represent and warrant that you are entitled to disclose your Third-Party Account login information to us and/or grant us access to your Third-Party Account, without breach by you of any of the terms and conditions that govern your use of the applicable Third-Party Account, and without obligating us to pay any fees or making us subject to any usage limitations imposed by the third-party service provider of the Third-Party Account.</p>
//                     <p>By granting us access to any Third-Party Accounts, you understand that (1) we may access, make available, and store (if applicable) any content that you have provided to and stored in your Third-Party Account (the 'Social Network Content') so that it is available on and through the Services via your account, including without limitation any friend lists and (2) we may submit to and receive from your Third-Party Account additional information to the extent you are notified when you link your account with the Third-Party Account.</p>
//                     <p>Depending on the Third-Party Accounts you choose and subject to the privacy settings that you have set in such Third-Party Accounts, personally identifiable information that you post to your Third-Party Accounts may be available on and through your account on the Services. Please note that if a Third-Party Account or associated service becomes unavailable or our access to such Third-Party Account is terminated by the third-party service provider, then Social Network Content may no longer be available on and through the Services.</p>
//                     <p>You will have the ability to disable the connection between your account on the Services and your Third-Party Accounts at any time. PLEASE NOTE THAT YOUR RELATIONSHIP WITH THE THIRD-PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR AGREEMENT(S) WITH SUCH THIRD-PARTY SERVICE PROVIDERS.</p>
//                     <p>We make no effort to review any Social Network Content for any purpose, including but not limited to, for accuracy, legality, or non-infringement, and we are not responsible for any Social Network Content. You acknowledge and agree that we may access your email address book associated with a Third-Party Account and your contacts list stored on your mobile device or tablet computer solely for purposes of identifying and informing you of those contacts who have also registered to use the Services.</p>
//                     <p>You can deactivate the connection between the Services and your Third-Party Account by contacting us using the contact information below or through your account settings (if applicable). We will attempt to delete any information stored on our servers that was obtained through such Third­Party Account, except the username and profile picture that become associated with your account.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'third-party-websites',
//             title: '13. THIRD-PARTY WEBSITES AND CONTENT',
//             content: (
//                 <div className="space-y-4">
//                     <p>The Services may contain (or you may be sent via the Site) links to other websites ('Third-Party Websites') as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ('Third-Party Content').</p>
//                     <p>Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third­Party Content posted on, available through, or installed from the Services, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites or the Third-Party Content.</p>
//                     <p>Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Legal Terms no longer govern.</p>
//                     <p>You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Services or relating to any applications you use or install from the Services. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party.</p>
//                     <p>You agree and acknowledge that we do not endorse the products or services offered on Third-Party Websites and you shall hold us blameless from any harm caused by your purchase of such products or services. Additionally, you shall hold us blameless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'advertisers',
//             title: '14. ADVERTISERS',
//             content: (
//                 <div className="space-y-4">
//                     <p>We allow advertisers to display their advertisements and other information in certain areas of the Services, such as sidebar advertisements or banner advertisements. We simply provide the space to place such advertisements, and we have no other relationship with advertisers.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'services-management',
//             title: '15. SERVICES MANAGEMENT',
//             content: (
//                 <div className="space-y-4">
//                     <p>We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.</p>
//                 </div>)
//         },
//         {
//             id: 'privacy-policy',
//             title: '16. PRIVACY POLICY',
//             content: (
//                 <div className="space-y-4">
//                     <p>Given the nature of AI solutions, we prioritize data privacy. All data processed by our AI models complies with GDPR regulations applicable in the EU and UK. For further details, please review our comprehensive Privacy Policy.</p>
//                     <p>We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy posted on the Services, which is incorporated into these Legal Terms. Please be advised the Services are hosted in Ireland and UK. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in Ireland and UK, then through your continued use of the Services, you are transferring your data to Ireland and UK, and you expressly consent to have your data transferred to and processed in Ireland and UK.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'term-termination',
//             title: '17. TERM AND TERMINATION',
//             content: (
//                 <div className="space-y-4">
//                     <p>These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME WITHOUT WARNING, IN OUR SOLE DISCRETION.</p>
//                     <p>If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'modifications-interruptions',
//             title: '18. MODIFICATIONS AND INTERRUPTIONS',
//             content: (
//                 <div className="space-y-4">
//                     <p>We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We also reserve the right to modify or discontinue all or part of the Services without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.</p>
//                     <p>We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'governing-law',
//             title: '19. GOVERNING LAW',
//             content: (
//                 <div className="space-y-4">
//                     <p>These Legal Terms are governed by and interpreted following the laws of Ireland, and use of the United Nations Convention of Contracts for the International Sales of Goods is expressly excluded. If your habitual residence is in the EU, and you are a consumer, you additionally possess the protection provided to you by obligatory provisions of the law in your country to residence. HitoAI Limited and yourself both agree to submit to the non-exclusive jurisdiction of the courts of Dublin, which means that you may make a claim to defend your consumer protection rights in regards to these Legal Terms in Ireland, or in the EU country in which you reside.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'dispute-resolution',
//             title: '20. DISPUTE RESOLUTION',
//             content: (
//                 <div className="space-y-4">
//                     <h4 className="font-semibold text-gray-800">Informal Negotiations</h4>
//                     <p>To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a 'Dispute' and collectively, the 'Disputes') brought by either you or us (individually, a 'Party' and collectively, the 'Parties'), the Parties agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least thirty (30) days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.</p>

//                     <h4 className="font-semibold text-gray-800 mt-4">Binding Arbitration</h4>
//                     <p>Any dispute arising from the relationships between the Parties to these Legal Terms shall be determined by one arbitrator who will be chosen in accordance with the Arbitration and Internal Rules of the European Court of Arbitration being part of the European Centre of Arbitration having its seat in Strasbourg, and which are in force at the time the application for arbitration is filed, and of which adoption of this clause constitutes acceptance. The seat of arbitration shall be Dublin, Ireland. The language of the proceedings shall be English. Applicable rules of substantive law shall be the law of Ireland.</p>

//                     <h4 className="font-semibold text-gray-800 mt-4">Restrictions</h4>
//                     <p>The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.</p>

//                     <h4 className="font-semibold text-gray-800 mt-4">Exceptions to Informal Negotiations and Arbitration</h4>
//                     <p>The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations and binding arbitration: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief. If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'corrections',
//             title: '21. CORRECTIONS',
//             content: (
//                 <div className="space-y-4">
//                     <p>There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'disclaimer',
//             title: '22. DISCLAIMER',
//             content: (
//                 <div className="space-y-4">
//                     <p>THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGEMENT AND EXERCISE CAUTION WHERE APPROPRIATE.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'limitations-liability',
//             title: '23. LIMITATIONS OF LIABILITY',
//             content: (
//                 <div className="space-y-4">
//                     <p>For AI-based services, HitoAI makes every effort to provide accurate and reliable outputs. However, results may vary depending on individual use cases. Users are encouraged to validate outputs with appropriate professional advice.</p>
//                     <p>In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the services, even if we have been advised of the possibility of such damages. Notwithstanding anything to the contrary contained herein, our liability to you for any cause whatsoever and regardless of the form of the action, will at all times be limited to the amount paid, if any, by you to us during the six (6) month period prior to any cause of action arising. Certain US state laws and international laws do not allow limitations on implied warranties or the exclusion or limitation of certain damages. If these laws apply to you, some or all of the above disclaimers or limitations may not apply to you, and you may have additional rights.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'indemnification',
//             title: '24. INDEMNIFICATION',
//             content: (
//                 <div className="space-y-4">
//                     <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorney's fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party, including but not limited to intellectual property rights; or (6) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'user-data',
//             title: '25. USER DATA',
//             content: (
//                 <div className="space-y-4">
//                     <p>We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'electronic-communications',
//             title: '26. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES',
//             content: (
//                 <div className="space-y-4">
//                     <p>Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'california-users',
//             title: '27. CALIFORNIA USERS AND RESIDENTS',
//             content: (
//                 <div className="space-y-4">
//                     <p>If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'miscellaneous',
//             title: '28. MISCELLANEOUS',
//             content: (
//                 <div className="space-y-4">
//                     <p>These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.</p>
//                 </div>
//             )
//         },
//         {
//             id: 'contact-us',
//             title: '29. CONTACT US',
//             content: (
//                 <div className="space-y-4">
//                     <p>In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>
//                     <p className="mt-2">
//                         <strong>HitoAI Limited</strong><br />
//                         Sandyford, Dublin 18<br />
//                         Dublin, Dublin County<br />
//                         Iceland<br />
//                         info@hitoai.ai
//                     </p>
//                 </div>
//             )
//         },
//         {
//             id: 'nda',
//             title: 'NON-DISCLOSURE AGREEMENT (NDA)',
//             content: (
//                 <div className="space-y-4">
//                     <p>This Non-Disclosure Agreement ("Agreement") is entered into for the purpose of preventing unauthorized disclosure of confidential and proprietary information, as defined below. The parties agree to establish a confidential relationship concerning the disclosure of certain proprietary and confidential information ("Confidential Information").</p>

//                     <ol className="list-decimal list-inside pl-4 space-y-2">
//                         <li><strong>Definition of Confidential Information:</strong> For the purposes of this Agreement, "Confidential Information" includes all information or material that has or could have commercial value or other utility in the business operations of HitoAI Limited. If Confidential Information is in written form, the disclosing party shall label or stamp it as "Confidential." If transmitted orally, the disclosing party shall promptly provide a written confirmation designating the information as confidential.</li>
//                         <li><strong>Exclusions from Confidential Information:</strong> Receiving Party's obligations under this Agreement do not apply to information that: (a) Is publicly available at the time of disclosure or becomes publicly available through no fault of the Receiving Party; (b) Was independently developed or discovered by the Receiving Party before disclosure; (c) Is lawfully obtained from a third party without breach of confidentiality; (d) Is disclosed with the prior written approval of the Disclosing Party.</li>
//                         <li><strong>Obligations of the Receiving Party:</strong> The Receiving Party agrees to: (a) Maintain the Confidential Information in strict confidence for the sole benefit of the Disclosing Party; (b) Restrict access to Confidential Information to employees, contractors, and third parties who require it, ensuring they sign non-disclosure agreements as protective as this Agreement; (c) Not disclose, publish, copy, or use Confidential Information for any unauthorized purposes; (d) Return all Confidential Information upon request by the Disclosing Party.</li>
//                         <li><strong>Duration of Confidentiality Obligations:</strong> The confidentiality obligations of the Receiving Party shall survive the termination of this Agreement until the Confidential Information no longer qualifies as a trade secret or until the Disclosing Party releases the Receiving Party from its obligations in writing.</li>
//                         <li><strong>Relationship of the Parties:</strong> Nothing in this Agreement shall create a partnership, joint venture, or employment relationship between the parties.</li>
//                         <li><strong>Severability:</strong> If any provision of this Agreement is found to be invalid or unenforceable, the remainder shall be interpreted to best reflect the intent of the parties.</li>
//                         <li><strong>Integration Clause:</strong> This Agreement constitutes the complete understanding between the parties and supersedes all prior agreements. Amendments must be in writing and signed by both parties.</li>
//                         <li><strong>Waiver:</strong> Failure to enforce any provision of this Agreement shall not constitute a waiver of rights under this Agreement.</li>
//                         <li><strong>Intellectual Property Rights:</strong> The Receiving Party agrees not to use, exploit, or disclose any intellectual property related to HitoAI Limited or the SusNet project. All intellectual property developed or disclosed in relation to HitoAI, including but not limited to research findings, algorithms, models, and data, shall remain the sole property of HitoAI Limited. No independent use, transfer, or distribution of intellectual property is permitted without prior written consent.</li>
//                         <li><strong>Non-Disclosure Obligation:</strong> The Receiving Party remains bound by the NDA indefinitely, even after their involvement in the project ends. Disclosure or utilization of any project-related information is strictly prohibited without prior written consent.</li>
//                         <li><strong>Confidentiality and Use of Information Agreement:</strong> The Receiving Party agrees to maintain strict confidentiality regarding all proprietary and confidential information, including trade secrets, business strategies, and technical innovations. Unauthorized disclosure to third parties, including social media and public forums, is strictly prohibited. The Company reserves the right to use the Receiving Party's name, likeness, and contributions for marketing, funding, and promotional purposes.</li>
//                         <li><strong>Intellectual Property Ownership:</strong> All intellectual property created by the Receiving Party during their engagement with HitoAI Limited remains the sole property of HitoAI. The Receiving Party agrees to disclose and assign ownership of such intellectual property to HitoAI and assist in securing legal protections.</li>
//                         <li><strong>No Employment Relationship:</strong> This Agreement does not establish an employment relationship between the Receiving Party and HitoAI Limited.</li>
//                         <li><strong>Governing Law:</strong> This Agreement shall be governed by the laws of the Republic of Ireland, without regard to conflict of law principles.</li>
//                         <li><strong>Entire Agreement:</strong> This Agreement constitutes the entire understanding between the parties regarding confidentiality and intellectual property and applies to all projects, products, and services at HitoAI Limited.</li>
//                     </ol>
//                     <p>This Agreement is binding upon the representatives, assigns, and successors of both parties. Each party acknowledges their obligations by signing this Agreement.</p>
//                 </div>
//             )
//         }
//     ];

//     return (
//         <div className="bg-gray-50 min-h-screen py-12">
//             <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                         {/* Header */}
//                         <div className="bg-indigo-600 text-white p-6">
//                             <h1 className="text-2xl md:text-3xl font-bold">Terms and Conditions</h1>
//                             <p className="mt-2 text-indigo-100">Last updated November 29, 2024</p>
//                             <div className="flex items-center mt-4 text-indigo-100">
//                                 <FileText className="w-5 h-5 mr-2" />
//                                 <span>Please read these terms carefully</span>
//                             </div>
//                         </div>

//                         {/* Introduction */}
//                         <div className="p-6 border-b">
//                             <p className="text-gray-700">
//                                 Welcome to HitoAI! These Terms and Conditions ("Terms") govern your access to and use of HitoAI Limited's services, including our website and AI-powered solutions such as Susnet, Selwel, and Secuell ("Services"). By accessing the Services, you agree to these Terms. If you do not agree, please discontinue use immediately.
//                             </p>
//                         </div>

//                         {/* Table of Contents */}
//                         <div className="p-6 border-b bg-gray-50">
//                             <h2 className="text-lg font-bold text-gray-900 mb-4">TABLE OF CONTENTS</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                 {sections.map((section) => (
//                                     <a
//                                         key={section.id}
//                                         href={`#${section.id}`}
//                                         className="text-indigo-600 hover:text-indigo-800 hover:underline"
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             const element = document.getElementById(section.id);
//                                             if (element) {
//                                                 element.scrollIntoView({ behavior: 'smooth' });
//                                                 toggleSection(section.id);
//                                             }
//                                         }}
//                                     >
//                                         {section.title}
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Policy Sections */}
//                         <div className="divide-y">
//                             {sections.map((section) => (
//                                 <div
//                                     key={section.id}
//                                     id={section.id}
//                                     className="p-6"
//                                 >
//                                     <button
//                                         className="flex justify-between items-center w-full text-left"
//                                         onClick={() => toggleSection(section.id)}
//                                     >
//                                         <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
//                                         {expandedSections[section.id] ?
//                                             <ChevronUp className="h-5 w-5 text-indigo-600" /> :
//                                             <ChevronDown className="h-5 w-5 text-indigo-600" />
//                                         }
//                                     </button>

//                                     {expandedSections[section.id] && (
//                                         <div className="mt-4 text-gray-700 text-sm">
//                                             {section.content}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Final Notice */}
//                         <div className="p-6 bg-gray-50 text-center">
//                             <p className="text-sm text-gray-600">By using our Site and Services, you acknowledge that you have read and understand these Terms and Conditions.</p>
//                             <p className="text-sm text-gray-600 mt-2">© 2024 HitoAI Limited. All rights reserved.</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TermsAndConditionsPage;