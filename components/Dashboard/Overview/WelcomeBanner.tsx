"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    TrendingUp,
    Calendar,
    Target,
    BookOpen,
    Users,
    Activity,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Project, UnifiedTask } from '@/Redux/types/Projects';
import { cn } from '@/lib/utils';

interface ProgressStat {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
}

interface WelcomeBannerProps {
    userName: string;
    userAvatar?: string | null;
    currentProject?: Project | null;
    overallProgress?: number;
    stats: ProgressStat[];
    recentTasks?: UnifiedTask[];
    isLoading?: boolean;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

const statColorConfig = {
    blue: {
        bg: 'bg-blue-500/20 dark:bg-blue-500/30',
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
    },
    green: {
        bg: 'bg-emerald-500/20 dark:bg-emerald-500/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800'
    },
    yellow: {
        bg: 'bg-amber-500/20 dark:bg-amber-500/30',
        icon: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800'
    },
    purple: {
        bg: 'bg-purple-500/20 dark:bg-purple-500/30',
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800'
    },
    red: {
        bg: 'bg-red-500/20 dark:bg-red-500/30',
        icon: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800'
    },
    indigo: {
        bg: 'bg-indigo-500/20 dark:bg-indigo-500/30',
        icon: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800'
    }
};

const getGreeting = (timeOfDay?: 'morning' | 'afternoon' | 'evening') => {
    switch (timeOfDay) {
        case 'morning': return 'Good morning';
        case 'afternoon': return 'Good afternoon';
        case 'evening': return 'Good evening';
        default: return 'Welcome back';
    }
};

const getUserInitials = (name: string) => {
    return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export default function WelcomeBanner({
    userName,
    userAvatar,
    currentProject,
    overallProgress = 0,
    stats,
    recentTasks = [],
    isLoading = false,
    timeOfDay
}: WelcomeBannerProps) {
    const greeting = getGreeting(timeOfDay);
    const userInitials = getUserInitials(userName);

    if (isLoading) {
        return (
            <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 border-0 shadow-xl">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-48 bg-white/20" />
                            <Skeleton className="h-3 w-32 bg-white/20" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="text-white py-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center">
                                <Skeleton className="h-8 w-8 rounded-lg bg-white/20 mr-2" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-16 bg-white/20" />
                                    <Skeleton className="h-3 w-12 bg-white/20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="pt-0 pb-3">
                    <Skeleton className="h-8 w-40 bg-white/20" />
                </CardFooter>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 border-0 shadow-xl relative overflow-hidden">
                {/* Background Pattern */}
                {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="2"/%3E%3Ccircle cx="27" cy="7" r="2"/%3E%3Ccircle cx="47" cy="7" r="2"/%3E%3Ccircle cx="7" cy="27" r="2"/%3E%3Ccircle cx="27" cy="27" r="2"/%3E%3Ccircle cx="47" cy="27" r="2"/%3E%3Ccircle cx="7" cy="47" r="2"/%3E%3Ccircle cx="27" cy="47" r="2"/%3E%3Ccircle cx="47" cy="47" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" /> */}

                <CardHeader className="pb-3 relative">
                    <motion.div
                        className="flex items-start justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white/30 shadow-lg">
                                {userAvatar ? (
                                    <AvatarImage src={userAvatar} alt={userName} />
                                ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 text-white font-semibold text-base backdrop-blur-sm">
                                        {userInitials}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <CardTitle className="text-white text-lg md:text-xl font-bold">
                                    {greeting}, {userName}!
                                </CardTitle>
                                <CardDescription className="text-indigo-100 text-sm mt-0.5">
                                    {currentProject ? (
                                        <span className="flex items-center gap-2">
                                            <BookOpen className="h-3 w-3" />
                                            Currently working on: <strong>{currentProject.name}</strong>
                                        </span>
                                    ) : (
                                        "Ready to continue your learning journey?"
                                    )}
                                </CardDescription>
                            </div>
                        </div>

                        {/* Quick Action Badges */}
                        <div className="hidden md:flex flex-col gap-1">
                            {recentTasks.length > 0 && (
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                                    <Activity className="h-3 w-3 mr-1" />
                                    {recentTasks.length} active {recentTasks.length === 1 ? 'task' : 'tasks'}
                                </Badge>
                            )}
                            {currentProject && (
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                                    <Target className="h-3 w-3 mr-1" />
                                    {currentProject.level} level
                                </Badge>
                            )}
                        </div>
                    </motion.div>

                    {/* Overall Progress */}
                    {overallProgress > 0 && (
                        <motion.div
                            className="mt-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-indigo-100 text-sm font-medium">
                                    Overall Progress
                                </span>
                                <span className="text-white font-semibold text-sm">
                                    {overallProgress}%
                                </span>
                            </div>
                            <div className="relative">
                                <Progress
                                    value={overallProgress}
                                    className="h-2 bg-white/20"
                                />
                                <div
                                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                                    style={{ width: `${overallProgress}%` }}
                                />
                            </div>
                        </motion.div>
                    )}
                </CardHeader>

                <CardContent className="text-white relative py-3">
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        {stats.map((stat, index) => {
                            const colorConfig = statColorConfig[stat.color || 'blue'];

                            return (
                                <motion.div
                                    key={index}
                                    className="flex items-center p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + (index * 0.1), duration: 0.4 }}
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg mr-2.5 border",
                                        colorConfig.bg,
                                        colorConfig.border
                                    )}>
                                        <div className={colorConfig.icon}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-indigo-100 font-medium">
                                                {stat.label}
                                            </p>
                                            {stat.trend && stat.trendValue && (
                                                <div className={cn(
                                                    "flex items-center text-xs px-1.5 py-0.5 rounded-full",
                                                    stat.trend === 'up' && "bg-emerald-500/20 text-emerald-300",
                                                    stat.trend === 'down' && "bg-red-500/20 text-red-300",
                                                    stat.trend === 'neutral' && "bg-slate-500/20 text-slate-300"
                                                )}>
                                                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                                                    {stat.trend === 'down' && <TrendingUp className="h-3 w-3 rotate-180" />}
                                                    <span className="ml-1">{stat.trendValue}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-bold text-base text-white">
                                            {stat.value}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Current Project Quick Info */}
                    {currentProject && (
                        <motion.div
                            className="mt-4 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-white mb-1 text-sm">
                                        {currentProject.name}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-indigo-100">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Progress: {currentProject.progress}%
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {currentProject.memberIds?.length || 0} members
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Target className="h-3 w-3" />
                                            {currentProject.taskIds?.length || 0} tasks
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "text-xs",
                                            currentProject.status === 'active' && "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
                                            currentProject.status === 'completed' && "bg-blue-500/20 text-blue-300 border-blue-400/30",
                                            currentProject.status === 'on-hold' && "bg-amber-500/20 text-amber-300 border-amber-400/30"
                                        )}
                                    >
                                        {currentProject.status === 'active' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                        {currentProject.status === 'on-hold' && <AlertCircle className="h-3 w-3 mr-1" />}
                                        {currentProject.status}
                                    </Badge>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </CardContent>

                <CardFooter className="pt-3 pb-4 relative">
                    <motion.div
                        className="flex flex-col sm:flex-row gap-2 w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                    >
                        <Button
                            asChild
                            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 flex-1 sm:flex-none h-9"
                        >
                            <Link href="/dashboard/projects">
                                <BookOpen className="h-4 w-4 mr-2" />
                                View All Projects
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>

                        {recentTasks.length > 0 && (
                            <Button
                                asChild
                                variant="secondary"
                                className="bg-white text-indigo-600 hover:bg-white/90 flex-1 sm:flex-none h-9"
                            >
                                <Link href="/dashboard/tasks">
                                    <Target className="h-4 w-4 mr-2" />
                                    View Tasks
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        )}
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}




// "use client"

// import React from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import {
//     ChevronRight,
//     TrendingUp,
//     Calendar,
//     Target,
//     BookOpen,
//     Users,
//     Clock,
//     Award,
//     Activity,
//     CheckCircle2,
//     AlertCircle,
//     Star
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle
// } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Project, UnifiedTask } from '@/Redux/types/Projects';
// import { cn } from '@/lib/utils';

// interface ProgressStat {
//     label: string;
//     value: string | number;
//     icon: React.ReactNode;
//     trend?: 'up' | 'down' | 'neutral';
//     trendValue?: string;
//     color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
// }

// interface WelcomeBannerProps {
//     userName: string;
//     userAvatar?: string | null;
//     currentProject?: Project | null;
//     overallProgress?: number;
//     stats: ProgressStat[];
//     recentTasks?: UnifiedTask[];
//     isLoading?: boolean;
//     timeOfDay?: 'morning' | 'afternoon' | 'evening';
// }

// const statColorConfig = {
//     blue: {
//         bg: 'bg-blue-500/20 dark:bg-blue-500/30',
//         icon: 'text-blue-600 dark:text-blue-400',
//         border: 'border-blue-200 dark:border-blue-800'
//     },
//     green: {
//         bg: 'bg-emerald-500/20 dark:bg-emerald-500/30',
//         icon: 'text-emerald-600 dark:text-emerald-400',
//         border: 'border-emerald-200 dark:border-emerald-800'
//     },
//     yellow: {
//         bg: 'bg-amber-500/20 dark:bg-amber-500/30',
//         icon: 'text-amber-600 dark:text-amber-400',
//         border: 'border-amber-200 dark:border-amber-800'
//     },
//     purple: {
//         bg: 'bg-purple-500/20 dark:bg-purple-500/30',
//         icon: 'text-purple-600 dark:text-purple-400',
//         border: 'border-purple-200 dark:border-purple-800'
//     },
//     red: {
//         bg: 'bg-red-500/20 dark:bg-red-500/30',
//         icon: 'text-red-600 dark:text-red-400',
//         border: 'border-red-200 dark:border-red-800'
//     },
//     indigo: {
//         bg: 'bg-indigo-500/20 dark:bg-indigo-500/30',
//         icon: 'text-indigo-600 dark:text-indigo-400',
//         border: 'border-indigo-200 dark:border-indigo-800'
//     }
// };

// const getGreeting = (timeOfDay?: 'morning' | 'afternoon' | 'evening') => {
//     switch (timeOfDay) {
//         case 'morning': return 'Good morning';
//         case 'afternoon': return 'Good afternoon';
//         case 'evening': return 'Good evening';
//         default: return 'Welcome back';
//     }
// };

// const getUserInitials = (name: string) => {
//     return name.split(' ')
//         .map(n => n[0])
//         .join('')
//         .toUpperCase()
//         .substring(0, 2);
// };

// export default function WelcomeBanner({
//     userName,
//     userAvatar,
//     currentProject,
//     overallProgress = 0,
//     stats,
//     recentTasks = [],
//     isLoading = false,
//     timeOfDay
// }: WelcomeBannerProps) {
//     const greeting = getGreeting(timeOfDay);
//     const userInitials = getUserInitials(userName);

//     if (isLoading) {
//         return (
//             <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 border-0 shadow-xl">
//                 <CardHeader className="pb-4">
//                     <div className="flex items-center gap-3">
//                         <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
//                         <div className="space-y-2">
//                             <Skeleton className="h-6 w-48 bg-white/20" />
//                             <Skeleton className="h-4 w-32 bg-white/20" />
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="text-white">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         {[1, 2, 3].map((i) => (
//                             <div key={i} className="flex items-center">
//                                 <Skeleton className="h-10 w-10 rounded-lg bg-white/20 mr-3" />
//                                 <div className="space-y-1">
//                                     <Skeleton className="h-3 w-16 bg-white/20" />
//                                     <Skeleton className="h-4 w-12 bg-white/20" />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//                 <CardFooter className="pt-0">
//                     <Skeleton className="h-10 w-40 bg-white/20" />
//                 </CardFooter>
//             </Card>
//         );
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//         >
//             <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 border-0 shadow-xl relative overflow-hidden">
//                 {/* Background Pattern */}
//                 {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="2"/%3E%3Ccircle cx="27" cy="7" r="2"/%3E%3Ccircle cx="47" cy="7" r="2"/%3E%3Ccircle cx="7" cy="27" r="2"/%3E%3Ccircle cx="27" cy="27" r="2"/%3E%3Ccircle cx="47" cy="27" r="2"/%3E%3Ccircle cx="7" cy="47" r="2"/%3E%3Ccircle cx="27" cy="47" r="2"/%3E%3Ccircle cx="47" cy="47" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" /> */}

//                 <CardHeader className="pb-4 relative">
//                     <motion.div
//                         className="flex items-start justify-between"
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: 0.2, duration: 0.5 }}
//                     >
//                         <div className="flex items-center gap-4">
//                             <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
//                                 {userAvatar ? (
//                                     <AvatarImage src={userAvatar} alt={userName} />
//                                 ) : (
//                                     <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 text-white font-semibold text-lg backdrop-blur-sm">
//                                         {userInitials}
//                                     </AvatarFallback>
//                                 )}
//                             </Avatar>
//                             <div>
//                                 <CardTitle className="text-white text-xl md:text-2xl font-bold">
//                                     {greeting}, {userName}!
//                                 </CardTitle>
//                                 <CardDescription className="text-indigo-100 text-sm md:text-base mt-1">
//                                     {currentProject ? (
//                                         <span className="flex items-center gap-2">
//                                             <BookOpen className="h-4 w-4" />
//                                             Currently working on: <strong>{currentProject.name}</strong>
//                                         </span>
//                                     ) : (
//                                         "Ready to continue your learning journey?"
//                                     )}
//                                 </CardDescription>
//                             </div>
//                         </div>

//                         {/* Quick Action Badges */}
//                         <div className="hidden md:flex flex-col gap-2">
//                             {recentTasks.length > 0 && (
//                                 <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
//                                     <Activity className="h-3 w-3 mr-1" />
//                                     {recentTasks.length} active {recentTasks.length === 1 ? 'task' : 'tasks'}
//                                 </Badge>
//                             )}
//                             {currentProject && (
//                                 <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
//                                     <Target className="h-3 w-3 mr-1" />
//                                     {currentProject.level} level
//                                 </Badge>
//                             )}
//                         </div>
//                     </motion.div>

//                     {/* Overall Progress */}
//                     {overallProgress > 0 && (
//                         <motion.div
//                             className="mt-4"
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.4, duration: 0.5 }}
//                         >
//                             <div className="flex items-center justify-between mb-2">
//                                 <span className="text-indigo-100 text-sm font-medium">
//                                     Overall Progress
//                                 </span>
//                                 <span className="text-white font-semibold">
//                                     {overallProgress}%
//                                 </span>
//                             </div>
//                             <div className="relative">
//                                 <Progress
//                                     value={overallProgress}
//                                     className="h-2 bg-white/20"
//                                 />
//                                 <div
//                                     className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
//                                     style={{ width: `${overallProgress}%` }}
//                                 />
//                             </div>
//                         </motion.div>
//                     )}
//                 </CardHeader>

//                 <CardContent className="text-white relative">
//                     <motion.div
//                         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.6, duration: 0.5 }}
//                     >
//                         {stats.map((stat, index) => {
//                             const colorConfig = statColorConfig[stat.color || 'blue'];

//                             return (
//                                 <motion.div
//                                     key={index}
//                                     className="flex items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200"
//                                     whileHover={{ scale: 1.02 }}
//                                     initial={{ opacity: 0, x: -20 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     transition={{ delay: 0.8 + (index * 0.1), duration: 0.4 }}
//                                 >
//                                     <div className={cn(
//                                         "p-2.5 rounded-lg mr-3 border",
//                                         colorConfig.bg,
//                                         colorConfig.border
//                                     )}>
//                                         <div className={colorConfig.icon}>
//                                             {stat.icon}
//                                         </div>
//                                     </div>
//                                     <div className="flex-1">
//                                         <div className="flex items-center gap-2">
//                                             <p className="text-sm text-indigo-100 font-medium">
//                                                 {stat.label}
//                                             </p>
//                                             {stat.trend && stat.trendValue && (
//                                                 <div className={cn(
//                                                     "flex items-center text-xs px-1.5 py-0.5 rounded-full",
//                                                     stat.trend === 'up' && "bg-emerald-500/20 text-emerald-300",
//                                                     stat.trend === 'down' && "bg-red-500/20 text-red-300",
//                                                     stat.trend === 'neutral' && "bg-slate-500/20 text-slate-300"
//                                                 )}>
//                                                     {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
//                                                     {stat.trend === 'down' && <TrendingUp className="h-3 w-3 rotate-180" />}
//                                                     <span className="ml-1">{stat.trendValue}</span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <p className="font-bold text-lg text-white">
//                                             {stat.value}
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             );
//                         })}
//                     </motion.div>

//                     {/* Current Project Quick Info */}
//                     {currentProject && (
//                         <motion.div
//                             className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 1.2, duration: 0.5 }}
//                         >
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="font-semibold text-white mb-1">
//                                         {currentProject.name}
//                                     </h4>
//                                     <div className="flex items-center gap-4 text-xs text-indigo-100">
//                                         <span className="flex items-center gap-1">
//                                             <Calendar className="h-3 w-3" />
//                                             Progress: {currentProject.progress}%
//                                         </span>
//                                         <span className="flex items-center gap-1">
//                                             <Users className="h-3 w-3" />
//                                             {currentProject.memberIds?.length || 0} members
//                                         </span>
//                                         <span className="flex items-center gap-1">
//                                             <Target className="h-3 w-3" />
//                                             {currentProject.taskIds?.length || 0} tasks
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="text-right">
//                                     <Badge
//                                         variant="secondary"
//                                         className={cn(
//                                             "text-xs",
//                                             currentProject.status === 'active' && "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
//                                             currentProject.status === 'completed' && "bg-blue-500/20 text-blue-300 border-blue-400/30",
//                                             currentProject.status === 'on-hold' && "bg-amber-500/20 text-amber-300 border-amber-400/30"
//                                         )}
//                                     >
//                                         {currentProject.status === 'active' && <CheckCircle2 className="h-3 w-3 mr-1" />}
//                                         {currentProject.status === 'on-hold' && <AlertCircle className="h-3 w-3 mr-1" />}
//                                         {currentProject.status}
//                                     </Badge>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     )}
//                 </CardContent>

//                 <CardFooter className="pt-4 relative">
//                     <motion.div
//                         className="flex flex-col sm:flex-row gap-3 w-full"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 1.4, duration: 0.5 }}
//                     >
//                         <Button
//                             asChild
//                             className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 flex-1 sm:flex-none"
//                         >
//                             <Link href="/dashboard/projects">
//                                 <BookOpen className="h-4 w-4 mr-2" />
//                                 View All Projects
//                                 <ChevronRight className="h-4 w-4 ml-1" />
//                             </Link>
//                         </Button>

//                         {recentTasks.length > 0 && (
//                             <Button
//                                 asChild
//                                 variant="secondary"
//                                 className="bg-white text-indigo-600 hover:bg-white/90 flex-1 sm:flex-none"
//                             >
//                                 <Link href="/dashboard/tasks">
//                                     <Target className="h-4 w-4 mr-2" />
//                                     View Tasks
//                                     <ChevronRight className="h-4 w-4 ml-1" />
//                                 </Link>
//                             </Button>
//                         )}
//                     </motion.div>
//                 </CardFooter>
//             </Card>
//         </motion.div>
//     );
// }