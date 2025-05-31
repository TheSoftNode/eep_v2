import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    UserCheck,
    Star,
    TrendingUp,
    Plus,
    RefreshCw,
    Download,
    Upload
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MentorSummary } from '@/Redux/types/Users/mentor';

interface MentorsData {
    data: MentorSummary[];
    totalCount: number;
    count: number;
    pagination?: {
        page: number;
        limit: number;
        hasMore: boolean;
        totalPages: number;
    };
}

interface MentorStatsHeaderProps {
    mentorsData: MentorsData | undefined;
    onRefresh: () => void;
    onCreate: () => void;
    userRole?: string;
}

interface StatItem {
    title: string;
    value: number | string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    bgColor: string;
    darkBgColor: string;
    change: string;
    changeType: 'positive' | 'negative';
}

const MentorStatsHeader: React.FC<MentorStatsHeaderProps> = ({
    mentorsData,
    onRefresh,
    onCreate,
    userRole
}) => {
    const totalMentors: number = mentorsData?.totalCount || 0;
    const mentors: MentorSummary[] = mentorsData?.data || [];

    // Calculate stats from the data
    const activeMentors: number = mentors.filter((mentor: MentorSummary) => !(mentor as any).disabled).length;
    const availableMentors: number = mentors.filter((mentor: MentorSummary) => mentor.isAvailable).length;
    const averageRating: string = mentors.length > 0
        ? (mentors.reduce((acc: number, mentor: MentorSummary) => acc + mentor.rating, 0) / mentors.length).toFixed(1)
        : '0.0';

    const stats: StatItem[] = [
        {
            title: 'Total Mentors',
            value: totalMentors,
            icon: Users,
            color: 'from-indigo-600 to-indigo-500',
            bgColor: 'from-indigo-50 to-indigo-100/50',
            darkBgColor: 'from-indigo-900/20 to-indigo-800/10',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Active Mentors',
            value: activeMentors,
            icon: UserCheck,
            color: 'from-emerald-600 to-emerald-500',
            bgColor: 'from-emerald-50 to-emerald-100/50',
            darkBgColor: 'from-emerald-900/20 to-emerald-800/10',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Available Now',
            value: availableMentors,
            icon: Users,
            color: 'from-blue-600 to-blue-500',
            bgColor: 'from-blue-50 to-blue-100/50',
            darkBgColor: 'from-blue-900/20 to-blue-800/10',
            change: '+15%',
            changeType: 'positive'
        },
        {
            title: 'Avg Rating',
            value: averageRating,
            icon: Star,
            color: 'from-amber-600 to-amber-500',
            bgColor: 'from-amber-50 to-amber-100/50',
            darkBgColor: 'from-amber-900/20 to-amber-800/10',
            change: '+0.2',
            changeType: 'positive'
        }
    ];

    // Calculate availability rate
    const availabilityRate: number = totalMentors > 0
        ? Math.round((availableMentors / totalMentors) * 100)
        : 0;

    // Get top expertise (this could be calculated from actual data in a real implementation)
    const getTopExpertise = (): string => {
        if (mentors.length === 0) return 'N/A';

        // Count expertise occurrences
        const expertiseCount: { [key: string]: number } = {};
        mentors.forEach((mentor: MentorSummary) => {
            mentor.expertise.forEach((skill: string) => {
                expertiseCount[skill] = (expertiseCount[skill] || 0) + 1;
            });
        });

        // Find most common expertise
        const topExpertise = Object.entries(expertiseCount)
            .sort(([, a], [, b]) => b - a)[0];

        return topExpertise ? topExpertise[0] : 'React';
    };

    const handleRefreshClick = (): void => {
        onRefresh();
    };

    const handleCreateClick = (): void => {
        onCreate();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
        >
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={handleRefreshClick}
                        variant="outline"
                        size="sm"
                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                    </Button>
                </div>

                {userRole === 'admin' && (
                    <Button
                        onClick={handleCreateClick}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Mentor
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat: StatItem, index: number) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    >
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br dark:from-slate-900/90 dark:to-slate-800/50 from-white to-slate-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} dark:${stat.darkBgColor} opacity-50`} />
                            <CardContent className="relative p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                            {stat.value}
                                        </p>
                                        <div className="flex items-center">
                                            <TrendingUp className={`h-3 w-3 mr-1 ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`} />
                                            <span className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {stat.change}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                                                vs last month
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="h-7 w-7 text-white" />
                                    </div>
                                </div>

                                {/* Subtle hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Insights */}
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                Quick Insights
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                        Availability Rate
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {availabilityRate}%
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                        {availableMentors} of {totalMentors} mentors
                                    </div>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                        Top Expertise
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {getTopExpertise()}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                        Most common skill
                                    </div>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                        New This Week
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        5
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                        Recent additions
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MentorStatsHeader;