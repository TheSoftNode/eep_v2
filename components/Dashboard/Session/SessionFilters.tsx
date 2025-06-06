import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw, Users, User, Globe, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
    activeTab?: string;
    openSessionFilters?: {
        sessionType: 'all' | 'individual' | 'group';
        isPublic: boolean;
    };
    setOpenSessionFilters?: (filters: {
        sessionType: 'all' | 'individual' | 'group';
        isPublic: boolean;
    }) => void;
}

const SessionFilters: React.FC<SessionFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterTimeframe,
    setFilterTimeframe,
    onRefresh,
    totalCount,
    activeTab = 'my-sessions',
    openSessionFilters,
    setOpenSessionFilters
}) => {
    const isOpenSessionsTab = activeTab === 'open-sessions';
    const isCreatedSessionsTab = activeTab === 'created-sessions';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        {/* Search and Refresh Row */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder={
                                        isOpenSessionsTab || isCreatedSessionsTab
                                            ? "Search sessions by topic, creator, or description..."
                                            : "Search sessions by topic, mentor, or learner..."
                                    }
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white dark:bg-slate-800"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={onRefresh}
                                className="bg-white dark:bg-slate-800 flex items-center space-x-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span className="hidden sm:inline">Refresh</span>
                            </Button>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Regular Session Filters (My Sessions tab) */}
                            {!isOpenSessionsTab && !isCreatedSessionsTab && (
                                <>
                                    <div className="flex-1">
                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                            <SelectTrigger className="bg-white dark:bg-slate-800">
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
                                    </div>
                                    <div className="flex-1">
                                        <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                                            <SelectTrigger className="bg-white dark:bg-slate-800">
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
                                    </div>
                                </>
                            )}

                            {/* Open Sessions Filters */}
                            {(isOpenSessionsTab || isCreatedSessionsTab) && openSessionFilters && setOpenSessionFilters && (
                                <>
                                    {/* Session Type Filter */}
                                    <div className="flex-1">
                                        <Select
                                            value={openSessionFilters.sessionType}
                                            onValueChange={(value: 'all' | 'individual' | 'group') =>
                                                setOpenSessionFilters({
                                                    ...openSessionFilters,
                                                    sessionType: value
                                                })
                                            }
                                        >
                                            <SelectTrigger className="bg-white dark:bg-slate-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    <div className="flex items-center space-x-2">
                                                        <Filter className="h-4 w-4" />
                                                        <span>All Types</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="individual">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4" />
                                                        <span>Individual</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="group">
                                                    <div className="flex items-center space-x-2">
                                                        <Users className="h-4 w-4" />
                                                        <span>Group</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Visibility Toggle - Only for Open Sessions tab */}
                                    {isOpenSessionsTab && (
                                        <div className="flex items-center space-x-4 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800">
                                            <div className="flex items-center space-x-2">
                                                {openSessionFilters.isPublic ? (
                                                    <Globe className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Lock className="h-4 w-4 text-slate-600" />
                                                )}
                                                <Label htmlFor="visibility-toggle" className="text-sm font-medium">
                                                    {openSessionFilters.isPublic ? 'Public' : 'Private'}
                                                </Label>
                                            </div>
                                            <Switch
                                                id="visibility-toggle"
                                                checked={openSessionFilters.isPublic}
                                                onCheckedChange={(checked) =>
                                                    setOpenSessionFilters({
                                                        ...openSessionFilters,
                                                        isPublic: checked
                                                    })
                                                }
                                            />
                                        </div>
                                    )}

                                    {/* Status Filter for Created Sessions */}
                                    {isCreatedSessionsTab && (
                                        <div className="flex-1">
                                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                <SelectTrigger className="bg-white dark:bg-slate-800">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Status</SelectItem>
                                                    <SelectItem value="open">Open</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Active Filters Display */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search Term Badge */}
                            {searchTerm && (
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                    <Search className="h-3 w-3" />
                                    <span>"{searchTerm}"</span>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="ml-1 text-slate-500 hover:text-slate-700"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}

                            {/* Status Filter Badge */}
                            {filterStatus !== 'all' && (
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                    <span>Status: {filterStatus}</span>
                                    <button
                                        onClick={() => setFilterStatus('all')}
                                        className="ml-1 text-slate-500 hover:text-slate-700"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}

                            {/* Timeframe Filter Badge */}
                            {filterTimeframe !== 'all' && !isOpenSessionsTab && (
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                    <span>Time: {filterTimeframe.replace('_', ' ')}</span>
                                    <button
                                        onClick={() => setFilterTimeframe('all')}
                                        className="ml-1 text-slate-500 hover:text-slate-700"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}

                            {/* Session Type Filter Badge */}
                            {openSessionFilters && openSessionFilters.sessionType !== 'all' && (
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                    <span>Type: {openSessionFilters.sessionType}</span>
                                    <button
                                        onClick={() => setOpenSessionFilters && setOpenSessionFilters({
                                            ...openSessionFilters,
                                            sessionType: 'all'
                                        })}
                                        className="ml-1 text-slate-500 hover:text-slate-700"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}

                            {/* Visibility Filter Badge */}
                            {openSessionFilters && !openSessionFilters.isPublic && isOpenSessionsTab && (
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                    <Lock className="h-3 w-3" />
                                    <span>Private only</span>
                                    <button
                                        onClick={() => setOpenSessionFilters && setOpenSessionFilters({
                                            ...openSessionFilters,
                                            isPublic: true
                                        })}
                                        className="ml-1 text-slate-500 hover:text-slate-700"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}

                            {/* Clear All Filters */}
                            {(searchTerm || filterStatus !== 'all' || filterTimeframe !== 'all' ||
                                (openSessionFilters && (openSessionFilters.sessionType !== 'all' || !openSessionFilters.isPublic))) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterStatus('all');
                                            setFilterTimeframe('all');
                                            if (setOpenSessionFilters) {
                                                setOpenSessionFilters({
                                                    sessionType: 'all',
                                                    isPublic: true
                                                });
                                            }
                                        }}
                                        className="text-slate-500 hover:text-slate-700"
                                    >
                                        Clear all
                                    </Button>
                                )}
                        </div>

                        {/* Results Count */}
                        {totalCount > 0 && (
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Showing {totalCount} session{totalCount !== 1 ? 's' : ''}
                                {activeTab === 'my-sessions' && ' in your personal sessions'}
                                {activeTab === 'open-sessions' && ' available to join'}
                                {activeTab === 'created-sessions' && ' you created'}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SessionFilters;



// import React from 'react';
// import { motion } from 'framer-motion';
// import { Search, Filter } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// interface SessionFiltersProps {
//     searchTerm: string;
//     setSearchTerm: (term: string) => void;
//     filterStatus: 'all' | 'pending' | 'accepted' | 'completed' | 'cancelled';
//     setFilterStatus: (status: 'all' | 'pending' | 'accepted' | 'completed' | 'cancelled') => void;
//     filterTimeframe: 'all' | 'upcoming' | 'past' | 'this_week' | 'this_month';
//     setFilterTimeframe: (timeframe: 'all' | 'upcoming' | 'past' | 'this_week' | 'this_month') => void;
//     onRefresh: () => void;
//     totalCount: number;
// }

// const SessionFilters: React.FC<SessionFiltersProps> = ({
//     searchTerm,
//     setSearchTerm,
//     filterStatus,
//     setFilterStatus,
//     filterTimeframe,
//     setFilterTimeframe,
//     onRefresh,
//     totalCount
// }) => {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//         >
//             <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg">
//                 <CardContent className="p-4">
//                     <div className="flex flex-col lg:flex-row gap-4">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                             <Input
//                                 placeholder="Search sessions by topic, mentor, or learner..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 bg-white dark:bg-slate-800"
//                             />
//                         </div>
//                         <div className="flex gap-4">
//                             <Select value={filterStatus} onValueChange={setFilterStatus}>
//                                 <SelectTrigger className="w-40 bg-white dark:bg-slate-800">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">All Status</SelectItem>
//                                     <SelectItem value="pending">Pending</SelectItem>
//                                     <SelectItem value="accepted">Confirmed</SelectItem>
//                                     <SelectItem value="completed">Completed</SelectItem>
//                                     <SelectItem value="cancelled">Cancelled</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
//                                 <SelectTrigger className="w-40 bg-white dark:bg-slate-800">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">All Time</SelectItem>
//                                     <SelectItem value="upcoming">Upcoming</SelectItem>
//                                     <SelectItem value="past">Past</SelectItem>
//                                     <SelectItem value="this_week">This Week</SelectItem>
//                                     <SelectItem value="this_month">This Month</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             <Button
//                                 variant="outline"
//                                 onClick={onRefresh}
//                                 className="bg-white dark:bg-slate-800"
//                             >
//                                 <Filter className="h-4 w-4" />
//                             </Button>
//                         </div>
//                     </div>
//                     {totalCount > 0 && (
//                         <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
//                             Showing {totalCount} session{totalCount !== 1 ? 's' : ''}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </motion.div>
//     );
// };

// export default SessionFilters;