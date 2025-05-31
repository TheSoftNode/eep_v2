import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DirectContactFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterStatus: 'all' | 'unread' | 'starred';
    setFilterStatus: (status: 'all' | 'unread' | 'starred') => void;
    filterPriority: 'all' | 'low' | 'normal' | 'high' | 'urgent';
    setFilterPriority: (priority: 'all' | 'low' | 'normal' | 'high' | 'urgent') => void;
    onRefresh: () => void;
}

const DirectContactFilters: React.FC<DirectContactFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    onRefresh
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
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white dark:bg-slate-800"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-32 bg-white dark:bg-slate-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Messages</SelectItem>
                                    <SelectItem value="unread">Unread</SelectItem>
                                    <SelectItem value="starred">Starred</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="w-32 bg-white dark:bg-slate-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priority</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
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
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default DirectContactFilters;