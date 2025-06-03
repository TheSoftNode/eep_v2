"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    CheckCircle,
    Clock,
    Download,
    ExternalLink,
    Filter,
    GraduationCap,
    LinkedinIcon,
    Lock,
    Search,
    Share2,
    Sparkles,
    Star,
    Trophy,
    Grid,
    List,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';

// Types
interface Certificate {
    id: number;
    name: string;
    issuedBy: string;
    issuerLogo?: string;
    issuerInitials: string;
    dateIssued?: string;
    expiryDate?: string;
    credentialId: string;
    status: 'completed' | 'in-progress' | 'not-started';
    progress: number;
    description: string;
    skills: string[];
    type: 'certificate' | 'badge' | 'credential';
    featured?: boolean;
    imageUrl?: string;
}

interface Requirement {
    id: number;
    certificateId: number;
    title: string;
    description: string;
    completed: boolean;
    date?: string;
}

export default function CertificatesPage() {
    // State
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showShared, setShowShared] = useState<boolean>(true);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

    // Mock data for certificates
    const certificates: Certificate[] = [
        {
            id: 1,
            name: "AI Development Certification",
            issuedBy: "EEP Learning Platform",
            issuerLogo: "/logos/eep-logo.svg",
            issuerInitials: "EEP",
            dateIssued: undefined,
            expiryDate: undefined,
            credentialId: "EEP-AI-DEV-2025",
            status: 'in-progress',
            progress: 42,
            description: "Comprehensive certification for AI development covering theoretical foundations, practical implementation, and ethical considerations.",
            skills: ["Machine Learning", "Python", "Neural Networks", "Data Processing", "AI Ethics"],
            type: 'certificate',
            featured: true,
            imageUrl: "/certificates/ai-dev-cert.png"
        },
        {
            id: 2,
            name: "Frontend Development Badge",
            issuedBy: "EEP Learning Platform",
            issuerLogo: "/logos/eep-logo.svg",
            issuerInitials: "EEP",
            dateIssued: undefined,
            expiryDate: undefined,
            credentialId: "EEP-FRONTEND-2025",
            status: 'in-progress',
            progress: 80,
            description: "Badge recognizing proficiency in frontend development with React and modern web technologies.",
            skills: ["React", "JavaScript", "TypeScript", "CSS", "Responsive Design"],
            type: 'badge',
            imageUrl: "/certificates/frontend-badge.png"
        },
        {
            id: 3,
            name: "Database Design Badge",
            issuedBy: "EEP Learning Platform",
            issuerLogo: "/logos/eep-logo.svg",
            issuerInitials: "EEP",
            dateIssued: undefined,
            expiryDate: undefined,
            credentialId: "EEP-DB-DESIGN-2025",
            status: 'in-progress',
            progress: 75,
            description: "Badge recognizing proficiency in database design, modeling, and implementation.",
            skills: ["MongoDB", "SQL", "Database Modeling", "Indexing", "Query Optimization"],
            type: 'badge',
            imageUrl: "/certificates/database-badge.png"
        },
        {
            id: 4,
            name: "JavaScript Fundamentals",
            issuedBy: "EEP Learning Platform",
            issuerLogo: "/logos/eep-logo.svg",
            issuerInitials: "EEP",
            dateIssued: "2025-01-15",
            expiryDate: undefined,
            credentialId: "EEP-JS-FUN-2025-001",
            status: 'completed',
            progress: 100,
            description: "Certificate validating comprehensive knowledge of JavaScript fundamentals, including ES6+ features, asynchronous programming, and functional concepts.",
            skills: ["JavaScript", "ES6+", "Async/Await", "Functional Programming", "DOM Manipulation"],
            type: 'certificate',
            imageUrl: "/certificates/js-fundamentals.png"
        },
        {
            id: 5,
            name: "Environment Setup Completion",
            issuedBy: "EEP Learning Platform",
            issuerLogo: "/logos/eep-logo.svg",
            issuerInitials: "EEP",
            dateIssued: "2025-01-05",
            expiryDate: undefined,
            credentialId: "EEP-ENV-2025-001",
            status: 'completed',
            progress: 100,
            description: "Badge recognizing successful setup of development environment and version control workflow.",
            skills: ["Git", "Node.js", "Docker", "Development Environments", "CLI"],
            type: 'badge',
            imageUrl: "/certificates/env-setup-badge.png"
        },
        {
            id: 6,
            name: "Ethical AI Credential",
            issuedBy: "Ethics in AI Institute",
            issuerInitials: "EAI",
            dateIssued: undefined,
            expiryDate: undefined,
            credentialId: "EAI-ETH-AI-2025",
            status: 'not-started',
            progress: 0,
            description: "Credential demonstrating understanding of ethical principles and responsible AI development practices.",
            skills: ["AI Ethics", "Responsible AI", "Bias Mitigation", "Privacy", "Fairness"],
            type: 'credential'
        },
    ];

    // Mock data for certificate requirements
    const requirements: Requirement[] = [
        {
            id: 1,
            certificateId: 1,
            title: "Complete all 12 weekly tasks",
            description: "Complete all assigned weekly coding tasks and projects.",
            completed: false
        },
        {
            id: 2,
            certificateId: 1,
            title: "Score at least 80% on all assessments",
            description: "Achieve a minimum score of 80% on all quizzes and assessments.",
            completed: true,
            date: "2025-02-28"
        },
        {
            id: 3,
            certificateId: 1,
            title: "Submit final project",
            description: "Develop and submit a complete AI application as your final project.",
            completed: false
        },
        {
            id: 4,
            certificateId: 1,
            title: "Present final project",
            description: "Present your final project to mentors and peers in a live session.",
            completed: false
        },
        {
            id: 5,
            certificateId: 2,
            title: "Complete frontend tasks (Weeks 3 & 5)",
            description: "Successfully complete the frontend development tasks in weeks 3 and 5.",
            completed: true,
            date: "2025-02-12"
        },
        {
            id: 6,
            certificateId: 2,
            title: "Score at least 85% on frontend assessment",
            description: "Achieve a minimum score of 85% on the frontend skills assessment.",
            completed: true,
            date: "2025-02-15"
        },
        {
            id: 7,
            certificateId: 2,
            title: "Create at least 5 reusable components",
            description: "Develop at least 5 reusable React components following best practices.",
            completed: true,
            date: "2025-02-20"
        },
        {
            id: 8,
            certificateId: 2,
            title: "Implement responsive design",
            description: "Ensure all components and pages are fully responsive and mobile-friendly.",
            completed: false
        },
    ];

    // Filter certificates based on active tab and search query
    const filteredCertificates = certificates.filter(certificate => {
        // Filter by status (tab)
        if (activeTab === 'in-progress' && certificate.status !== 'in-progress') return false;
        if (activeTab === 'completed' && certificate.status !== 'completed') return false;
        if (activeTab === 'not-started' && certificate.status !== 'not-started') return false;

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return certificate.name.toLowerCase().includes(query) ||
                certificate.description.toLowerCase().includes(query) ||
                certificate.skills.some(skill => skill.toLowerCase().includes(query));
        }

        return true;
    });

    // Get requirements for a specific certificate
    const getCertificateRequirements = (certificateId: number) => {
        return requirements.filter(req => req.certificateId === certificateId);
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not issued yet';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    };

    // Certificate status badge
    const renderStatusBadge = (status: Certificate['status']) => {
        if (status === 'completed') {
            return (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                </Badge>
            );
        } else if (status === 'in-progress') {
            return (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50">
                    <Clock className="h-3 w-3 mr-1" />
                    In Progress
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50">
                    <Lock className="h-3 w-3 mr-1" />
                    Not Started
                </Badge>
            );
        }
    };

    // Calculate total progress across all certificates
    const calculateOverallProgress = () => {
        const total = certificates.length;
        const completed = certificates.filter(cert => cert.status === 'completed').length;
        const inProgress = certificates.filter(cert => cert.status === 'in-progress')
            .reduce((sum, cert) => sum + cert.progress, 0) / 100;

        return Math.round((completed + inProgress) / total * 100);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-[#0A0F2C] dark:to-[#0A0E1F] transition-colors duration-300">
            {/* Background Effects */}
            <div className="fixed inset-0 dark:bg-grid-slate-900/[0.01] bg-grid-slate-700/[0.01] bg-[size:60px_60px] pointer-events-none opacity-20"></div>
            <div className="fixed top-0 right-0 w-full h-full z-0 opacity-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] right-[15%] w-[55%] h-[65%] rounded-full dark:bg-gradient-to-br dark:from-indigo-600/8 dark:via-pink-500/4 dark:to-violet-600/4 bg-gradient-to-br from-indigo-600/6 via-pink-500/3 to-violet-600/3 blur-3xl" />
            </div>

            <div className="relative z-10 space-y-6 p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
                                Certificates & Badges
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Track your certifications and showcase your achievements
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <DropdownMenuItem className="dark:hover:bg-slate-700/50 dark:text-slate-300">
                                        <LinkedinIcon className="h-4 w-4 mr-2" />
                                        Share on LinkedIn
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="dark:hover:bg-slate-700/50 dark:text-slate-300">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Share portfolio URL
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="dark:border-slate-700/50" />
                                    <DropdownMenuItem className="dark:hover:bg-slate-700/50 dark:text-slate-300">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download as PDF
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-0">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Browse Certifications
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Progress Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="bg-gradient-to-br from-indigo-600 to-violet-600 border-0 shadow-xl shadow-indigo-500/20 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <h2 className="text-white text-lg font-semibold mb-2">Your Certification Progress</h2>
                                    <p className="text-indigo-100 mb-4">
                                        You've completed {certificates.filter(c => c.status === 'completed').length} out of {certificates.length} certificates and badges
                                    </p>

                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-indigo-100">Overall Completion</span>
                                            <span className="text-white font-medium">{calculateOverallProgress()}%</span>
                                        </div>
                                        <Progress value={calculateOverallProgress()} className="h-2 bg-white/20 [--progress-foreground:white]" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                            <div className="text-2xl font-bold text-white">{certificates.filter(c => c.status === 'completed').length}</div>
                                            <div className="text-xs text-indigo-100">Completed</div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                            <div className="text-2xl font-bold text-white">{certificates.filter(c => c.status === 'in-progress').length}</div>
                                            <div className="text-xs text-indigo-100">In Progress</div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                            <div className="text-2xl font-bold text-white">{certificates.filter(c => c.status === 'not-started').length}</div>
                                            <div className="text-xs text-indigo-100">Not Started</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                                    <Award className="h-10 w-10 text-white mb-3" />
                                    <h3 className="text-white font-medium text-center mb-1">Featured Certificate</h3>
                                    <p className="text-indigo-100 text-sm text-center mb-3">
                                        {certificates.find(c => c.featured)?.name || "No featured certificate"}
                                    </p>
                                    <Button className="bg-white/20 hover:bg-white/30 text-white w-full border border-white/20 backdrop-blur-sm">
                                        <Sparkles className="h-4 w-4 mr-1" />
                                        Set Featured
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Filters & Search */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex">
                            <Tabs
                                defaultValue="all"
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid grid-cols-4 w-full max-w-md dark:bg-slate-800/50 dark:border-slate-700/50 backdrop-blur-sm">
                                    <TabsTrigger value="all" className="text-xs dark:data-[state=active]:bg-slate-700/70 dark:data-[state=active]:text-slate-100">All</TabsTrigger>
                                    <TabsTrigger value="in-progress" className="text-xs dark:data-[state=active]:bg-slate-700/70 dark:data-[state=active]:text-slate-100">In Progress</TabsTrigger>
                                    <TabsTrigger value="completed" className="text-xs dark:data-[state=active]:bg-slate-700/70 dark:data-[state=active]:text-slate-100">Completed</TabsTrigger>
                                    <TabsTrigger value="not-started" className="text-xs dark:data-[state=active]:bg-slate-700/70 dark:data-[state=active]:text-slate-100">Not Started</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Search certificates..."
                                    className="w-64 pl-9 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-100 dark:placeholder-slate-400 backdrop-blur-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50 backdrop-blur-sm">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                                    <DropdownMenuItem className="dark:hover:bg-slate-700/50 dark:text-slate-300">
                                        <div className="flex items-center justify-between w-full">
                                            <span>Show Shared</span>
                                            <Switch checked={showShared} onCheckedChange={setShowShared} className="ml-2" />
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="dark:border-slate-700/50" />
                                    <DropdownMenuItem className="dark:hover:bg-slate-700/50 dark:text-slate-300">Filter by Date</DropdownMenuItem>
                                    <DropdownMenuItem className="dark:hover:bg-slate-700/50 dark:text-slate-300">Filter by Type</DropdownMenuItem>
                                    <DropdownMenuItem className="dark:hover:bg-slate-700/50 dark:text-slate-300">Filter by Issuer</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex border rounded-md dark:border-slate-700/50 overflow-hidden backdrop-blur-sm">
                                <Button
                                    variant={view === 'grid' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    onClick={() => setView('grid')}
                                    className="rounded-none dark:hover:bg-slate-700/50 dark:data-[state=active]:bg-slate-700/70"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Separator orientation="vertical" className="dark:bg-slate-700/50" />
                                <Button
                                    variant={view === 'list' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    onClick={() => setView('list')}
                                    className="rounded-none dark:hover:bg-slate-700/50 dark:data-[state=active]:bg-slate-700/70"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Certificates Grid/List */}
                    {filteredCertificates.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4 backdrop-blur-sm">
                                <Award className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2 dark:text-white text-slate-900">No Certificates Found</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                {searchQuery
                                    ? `No certificates matching "${searchQuery}" were found.`
                                    : activeTab !== 'all'
                                        ? `You don't have any ${activeTab.replace('-', ' ')} certificates.`
                                        : "You haven't earned any certificates yet. Start your learning journey to earn certificates and badges."}
                            </p>
                        </div>
                    ) : (
                        view === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCertificates.map((certificate) => (
                                    <motion.div
                                        key={certificate.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="overflow-hidden h-full flex flex-col dark:bg-slate-800/50 dark:border-slate-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 dark:hover:shadow-indigo-500/10">
                                            <div className={cn(
                                                "h-40 flex items-center justify-center p-6 relative",
                                                certificate.status === 'completed'
                                                    ? "bg-emerald-50 dark:bg-emerald-900/20"
                                                    : certificate.status === 'in-progress'
                                                        ? "bg-blue-50 dark:bg-blue-900/20"
                                                        : "bg-slate-50 dark:bg-slate-800/30"
                                            )}>
                                                {certificate.imageUrl ? (
                                                    <img
                                                        src={certificate.imageUrl}
                                                        alt={certificate.name}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                ) : (
                                                    <div className={cn(
                                                        "h-24 w-24 rounded-full flex items-center justify-center",
                                                        certificate.status === 'completed'
                                                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                                                            : certificate.status === 'in-progress'
                                                                ? "bg-blue-100 dark:bg-blue-900/30"
                                                                : "bg-slate-100 dark:bg-slate-700/50"
                                                    )}>
                                                        {certificate.type === 'certificate' && (
                                                            <Award className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                                                        )}
                                                        {certificate.type === 'badge' && (
                                                            <Star className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                                                        )}
                                                        {certificate.type === 'credential' && (
                                                            <Trophy className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                                                        )}
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    {renderStatusBadge(certificate.status)}
                                                </div>
                                                {certificate.featured && (
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50">
                                                            <Sparkles className="h-3 w-3 mr-1" />
                                                            Featured
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-base dark:text-white">{certificate.name}</CardTitle>
                                                        <CardDescription className="flex items-center dark:text-slate-400">
                                                            <Avatar className="h-5 w-5 mr-1">
                                                                <AvatarImage src={certificate.issuerLogo} />
                                                                <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{certificate.issuerInitials}</AvatarFallback>
                                                            </Avatar>
                                                            {certificate.issuedBy}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge variant="outline" className={cn(
                                                        "capitalize",
                                                        certificate.type === 'certificate' && "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50",
                                                        certificate.type === 'badge' && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50",
                                                        certificate.type === 'credential' && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50"
                                                    )}>
                                                        {certificate.type}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="py-2 flex-1">
                                                {certificate.status === 'in-progress' && (
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center text-xs mb-1">
                                                            <span className="text-slate-500 dark:text-slate-400">Progress</span>
                                                            <span className="font-medium dark:text-slate-300">{certificate.progress}%</span>
                                                        </div>
                                                        <Progress value={certificate.progress} className="h-1 dark:bg-slate-700/50" />
                                                    </div>
                                                )}

                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                                    {certificate.description}
                                                </p>

                                                <div className="flex flex-wrap gap-1">
                                                    {certificate.skills.slice(0, 3).map((skill, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600/50">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {certificate.skills.length > 3 && (
                                                        <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600/50">
                                                            +{certificate.skills.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="border-t dark:border-slate-700/50 pt-3 flex justify-between">
                                                {certificate.status === 'completed' ? (
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Issued: {formatDate(certificate.dateIssued)}
                                                    </div>
                                                ) : certificate.status === 'in-progress' ? (
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        <CheckCircle className="h-3 w-3 text-emerald-500 inline-block mr-1" />
                                                        {getCertificateRequirements(certificate.id).filter(r => r.completed).length} of {getCertificateRequirements(certificate.id).length} requirements completed
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        <AlertCircle className="h-3 w-3 text-amber-500 inline-block mr-1" />
                                                        Not started yet
                                                    </div>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-0 h-auto text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    onClick={() => setSelectedCertificate(certificate)}
                                                >
                                                    View
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCertificates.map((certificate) => (
                                    <motion.div
                                        key={certificate.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="dark:bg-slate-800/50 dark:border-slate-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 dark:hover:shadow-indigo-500/10">
                                            <div className="p-4 flex items-start gap-4">
                                                <div className={cn(
                                                    "h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0",
                                                    certificate.status === 'completed'
                                                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                                                        : certificate.status === 'in-progress'
                                                            ? "bg-blue-50 dark:bg-blue-900/20"
                                                            : "bg-slate-50 dark:bg-slate-800/30"
                                                )}>
                                                    {certificate.imageUrl ? (
                                                        <img
                                                            src={certificate.imageUrl}
                                                            alt={certificate.name}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    ) : (
                                                        <>
                                                            {certificate.type === 'certificate' && (
                                                                <Award className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                                            )}
                                                            {certificate.type === 'badge' && (
                                                                <Star className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                                            )}
                                                            {certificate.type === 'credential' && (
                                                                <Trophy className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <div>
                                                            <div className="flex items-center">
                                                                <h3 className="font-medium dark:text-white text-slate-900">{certificate.name}</h3>
                                                                {certificate.featured && (
                                                                    <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50">
                                                                        <Sparkles className="h-3 w-3 mr-1" />
                                                                        Featured
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                                <Avatar className="h-4 w-4 mr-1">
                                                                    <AvatarImage src={certificate.issuerLogo} />
                                                                    <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{certificate.issuerInitials}</AvatarFallback>
                                                                </Avatar>
                                                                {certificate.issuedBy}
                                                                <span className="mx-1">•</span>
                                                                <Badge variant="outline" className={cn(
                                                                    "capitalize text-xs",
                                                                    certificate.type === 'certificate' && "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50",
                                                                    certificate.type === 'badge' && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50",
                                                                    certificate.type === 'credential' && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50"
                                                                )}>
                                                                    {certificate.type}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center">
                                                            {renderStatusBadge(certificate.status)}
                                                        </div>
                                                    </div>

                                                    {certificate.status === 'in-progress' && (
                                                        <div className="mt-3 mb-2 max-w-md">
                                                            <div className="flex justify-between items-center text-xs mb-1">
                                                                <span className="text-slate-500 dark:text-slate-400">Progress</span>
                                                                <span className="font-medium dark:text-slate-300">{certificate.progress}%</span>
                                                            </div>
                                                            <Progress value={certificate.progress} className="h-1 dark:bg-slate-700/50" />
                                                        </div>
                                                    )}

                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                                                        {certificate.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {certificate.skills.map((skill, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600/50">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end justify-between h-full gap-4">
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                                                        {certificate.status === 'completed' ? (
                                                            <>Issued: {formatDate(certificate.dateIssued)}</>
                                                        ) : certificate.status === 'in-progress' ? (
                                                            <>
                                                                <CheckCircle className="h-3 w-3 text-emerald-500 inline-block mr-1" />
                                                                {getCertificateRequirements(certificate.id).filter(r => r.completed).length} of {getCertificateRequirements(certificate.id).length} requirements
                                                            </>
                                                        ) : (
                                                            <>
                                                                <AlertCircle className="h-3 w-3 text-amber-500 inline-block mr-1" />
                                                                Not started
                                                            </>
                                                        )}
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        onClick={() => setSelectedCertificate(certificate)}
                                                        className="dark:bg-slate-700/50 dark:hover:bg-slate-600/50 dark:text-slate-200 backdrop-blur-sm"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Certificate Detail Dialog */}
                {selectedCertificate && (
                    <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
                        <DialogContent className="sm:max-w-[700px] dark:bg-slate-800/90 dark:border-slate-700/50 backdrop-blur-md">
                            <DialogHeader>
                                <DialogTitle className="dark:text-white">Certificate Details</DialogTitle>
                                <DialogDescription className="dark:text-slate-400">
                                    Information about your {selectedCertificate.type}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3">
                                        <div className={cn(
                                            "h-48 rounded-lg flex items-center justify-center p-4",
                                            selectedCertificate.status === 'completed'
                                                ? "bg-emerald-50 dark:bg-emerald-900/20"
                                                : selectedCertificate.status === 'in-progress'
                                                    ? "bg-blue-50 dark:bg-blue-900/20"
                                                    : "bg-slate-50 dark:bg-slate-800/30"
                                        )}>
                                            {selectedCertificate.imageUrl ? (
                                                <img
                                                    src={selectedCertificate.imageUrl}
                                                    alt={selectedCertificate.name}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <div className={cn(
                                                    "h-24 w-24 rounded-full flex items-center justify-center",
                                                    selectedCertificate.status === 'completed'
                                                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                                                        : selectedCertificate.status === 'in-progress'
                                                            ? "bg-blue-100 dark:bg-blue-900/30"
                                                            : "bg-slate-100 dark:bg-slate-700/50"
                                                )}>
                                                    {selectedCertificate.type === 'certificate' && (
                                                        <Award className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                                                    )}
                                                    {selectedCertificate.type === 'badge' && (
                                                        <Star className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                                                    )}
                                                    {selectedCertificate.type === 'credential' && (
                                                        <Trophy className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Issued By</div>
                                                <div className="flex items-center mt-1">
                                                    <Avatar className="h-5 w-5 mr-2">
                                                        <AvatarImage src={selectedCertificate.issuerLogo} />
                                                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{selectedCertificate.issuerInitials}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="dark:text-slate-300">{selectedCertificate.issuedBy}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Date Issued</div>
                                                <div className="dark:text-slate-300">{formatDate(selectedCertificate.dateIssued)}</div>
                                            </div>

                                            {selectedCertificate.expiryDate && (
                                                <div>
                                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Expiry Date</div>
                                                    <div className="dark:text-slate-300">{formatDate(selectedCertificate.expiryDate)}</div>
                                                </div>
                                            )}

                                            <div>
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Credential ID</div>
                                                <div className="font-mono text-sm dark:text-slate-300">{selectedCertificate.credentialId}</div>
                                            </div>

                                            {selectedCertificate.featured && (
                                                <div className="pt-2">
                                                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50">
                                                        <Sparkles className="h-3 w-3 mr-1" />
                                                        Featured in Portfolio
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="md:w-2/3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold dark:text-white">{selectedCertificate.name}</h3>
                                            {renderStatusBadge(selectedCertificate.status)}
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400 mt-2 mb-4">
                                            {selectedCertificate.description}
                                        </p>

                                        {selectedCertificate.status === 'in-progress' && (
                                            <div className="mb-4">
                                                <div className="flex justify-between items-center text-sm mb-1">
                                                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                                                    <span className="font-medium dark:text-slate-300">{selectedCertificate.progress}%</span>
                                                </div>
                                                <Progress value={selectedCertificate.progress} className="h-2 dark:bg-slate-700/50" />
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Skills</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedCertificate.skills.map((skill, idx) => (
                                                    <Badge key={idx} variant="outline" className="bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600/50">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {getCertificateRequirements(selectedCertificate.id).length > 0 && (
                                            <div className="mt-6">
                                                <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Requirements</h4>
                                                <div className="space-y-2">
                                                    {getCertificateRequirements(selectedCertificate.id).map((req) => (
                                                        <div key={req.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
                                                            <div className="flex items-start">
                                                                <div className={cn(
                                                                    "h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5",
                                                                    req.completed ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-slate-200 dark:bg-slate-700/50"
                                                                )}>
                                                                    {req.completed ? (
                                                                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                                    ) : (
                                                                        <Clock className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium dark:text-slate-200">{req.title}</div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{req.description}</div>
                                                                    {req.completed && req.date && (
                                                                        <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Completed on {formatDate(req.date)}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="gap-2 flex-wrap dark:border-slate-700/50">
                                <div className="flex-1 flex justify-start">
                                    {!selectedCertificate.featured && selectedCertificate.status === 'completed' && (
                                        <Button variant="outline" className="dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                                            <Sparkles className="h-4 w-4 mr-1" />
                                            Set as Featured
                                        </Button>
                                    )}
                                </div>
                                <Button variant="outline" className="dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                                    <Share2 className="h-4 w-4 mr-1" />
                                    Share
                                </Button>
                                {selectedCertificate.status === 'completed' && (
                                    <Button variant="outline" className="dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                                        <Download className="h-4 w-4 mr-1" />
                                        Download
                                    </Button>
                                )}
                                <DialogClose asChild>
                                    <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white">Close</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}