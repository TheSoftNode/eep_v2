"use client"

import {
    Upload,
    Plus,
    FileText,
    FileCode,
    FolderPlus,
    LayoutGrid,
    List,
    Filter,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FileHeaderProps {
    onUploadClick: () => void;
    onNewTextClick: () => void;
    onNewCodeClick: () => void;
    onNewFolderClick: () => void;
    viewMode?: 'grid' | 'list';
    onViewModeChange?: (mode: 'grid' | 'list') => void;
    fileCount?: number;
    currentFolder?: string;
}

export default function FileHeader({
    onUploadClick,
    onNewTextClick,
    onNewCodeClick,
    onNewFolderClick,
    viewMode = 'list',
    onViewModeChange,
    fileCount = 0,
    currentFolder = 'root'
}: FileHeaderProps) {
    return (
        <div className="flex flex-col space-y-4">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Files & Documents
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <p className="text-slate-600 dark:text-slate-400">
                            {currentFolder === 'root' ? 'Workspace files' : `Files in ${currentFolder}`}
                        </p>
                        <span className="text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {fileCount} {fileCount === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </div>

                {/* View mode toggle */}
                {onViewModeChange && (
                    <div className="hidden sm:block">
                        <ToggleGroup
                            type="single"
                            value={viewMode}
                            onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}
                            className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg"
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="grid"
                                            size="sm"
                                            className="px-3 text-slate-700 dark:text-slate-300 data-[state=on]:bg-white dark:data-[state=on]:bg-slate-700 data-[state=on]:text-indigo-600 dark:data-[state=on]:text-indigo-400 data-[state=on]:shadow-sm"
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Grid view</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="list"
                                            size="sm"
                                            className="px-3 text-slate-700 dark:text-slate-300 data-[state=on]:bg-white dark:data-[state=on]:bg-slate-700 data-[state=on]:text-indigo-600 dark:data-[state=on]:text-indigo-400 data-[state=on]:shadow-sm"
                                        >
                                            <List className="h-4 w-4" />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>List view</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </ToggleGroup>
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div className="flex flex-wrap gap-2">
                    {/* Upload button */}
                    <Button
                        onClick={onUploadClick}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                    </Button>

                    {/* Create new dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create New
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg w-48"
                        >
                            <DropdownMenuItem
                                onClick={onNewTextClick}
                                className="cursor-pointer group hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20"
                            >
                                <div className="flex items-center w-full">
                                    <div className="rounded-md bg-blue-100 dark:bg-blue-900/30 p-1.5 mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">Text Document</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Create a new text file</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={onNewCodeClick}
                                className="cursor-pointer group hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus:bg-emerald-50 dark:focus:bg-emerald-900/20"
                            >
                                <div className="flex items-center w-full">
                                    <div className="rounded-md bg-emerald-100 dark:bg-emerald-900/30 p-1.5 mr-3 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                                        <FileCode className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">Code File</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Create a new code file</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

                            <DropdownMenuItem
                                onClick={onNewFolderClick}
                                className="cursor-pointer group hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20"
                            >
                                <div className="flex items-center w-full">
                                    <div className="rounded-md bg-amber-100 dark:bg-amber-900/30 p-1.5 mr-3 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                                        <FolderPlus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">New Folder</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Organize your files</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile view toggle */}
                {onViewModeChange && (
                    <div className="sm:hidden">
                        <ToggleGroup
                            type="single"
                            value={viewMode}
                            onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}
                            className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg"
                        >
                            <ToggleGroupItem
                                value="grid"
                                size="sm"
                                className="px-3 text-slate-700 dark:text-slate-300 data-[state=on]:bg-white dark:data-[state=on]:bg-slate-700 data-[state=on]:text-indigo-600 dark:data-[state=on]:text-indigo-400"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="list"
                                size="sm"
                                className="px-3 text-slate-700 dark:text-slate-300 data-[state=on]:bg-white dark:data-[state=on]:bg-slate-700 data-[state=on]:text-indigo-600 dark:data-[state=on]:text-indigo-400"
                            >
                                <List className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                )}
            </div>
        </div>
    );
}