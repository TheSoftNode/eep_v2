"use client"

import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface UserFiltersProps {
    onSearch: (query: string, field: 'email' | 'fullName' | 'role') => void;
    onClearSearch: () => void;
    onCreateUser: () => void;
    searchQuery: string;
    searchField: 'email' | 'fullName' | 'role';
}

const UserFilters: React.FC<UserFiltersProps> = ({
    onSearch,
    onClearSearch,
    onCreateUser,
    searchQuery,
    searchField
}) => {
    const [query, setQuery] = useState(searchQuery);
    const [field, setField] = useState<'email' | 'fullName' | 'role'>(searchField);

    useEffect(() => {
        setQuery(searchQuery);
    }, [searchQuery]);

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query.trim(), field);
        }
    };

    const handleClear = () => {
        setQuery('');
        onClearSearch();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search Section */}
                <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-2xl">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Search users..."
                            className={cn(
                                "pl-10 pr-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
                                "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            )}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Select
                        value={field}
                        onValueChange={(value) => setField(value as 'email' | 'fullName' | 'role')}
                    >
                        <SelectTrigger className="w-full sm:w-40 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                            <div className="flex items-center">
                                <Filter className="h-3.5 w-3.5 mr-2 text-slate-500" />
                                <SelectValue placeholder="Search by" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="fullName">Name</SelectItem>
                            <SelectItem value="role">Role</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleSearch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>

                {/* Create User Button */}
                <Button
                    onClick={onCreateUser}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create User
                </Button>
            </div>
        </div>
    );
};

export default UserFilters;