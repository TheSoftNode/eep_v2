import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SessionFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterStatus: 'all' | 'pending' | 'accepted' | 'completed' | 'cancelled';
    setFilterStatus: (status: 'all' | 'pending' | 'accepted' | 'completed' | 'cancelled') => void;
    filterTimeframe: 'all' | 'upcoming' | 'past' | 'this_week' | 'this_month';
    setFilterTimeframe: (timeframe: 'all' | 'upcoming' | 'past' | 'this_week' | 'this_month') => void;
    onRefresh: () => void;
    totalCount: number;
}

const SessionFilters: React.FC<SessionFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterTimeframe,
    setFilterTimeframe,
    onRefresh,
    totalCount
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search sessions by topic, mentor, or learner..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white dark:bg-slate-800"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="past">Past</SelectItem>
                                    <SelectItem value="this_week">This Week</SelectItem>
                                    <SelectItem value="this_month">This Month</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                onClick={onRefresh}
                                className="bg-white dark:bg-slate-800"
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {totalCount > 0 && (
                        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                            Showing {totalCount} session{totalCount !== 1 ? 's' : ''}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SessionFilters;