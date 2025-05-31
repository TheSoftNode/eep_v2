import {
    FileText,
    FolderOpen,
    Image,
    FileCode,
    File,
    Video,
    Music,
    MoreHorizontal,
    Download,
    Copy,
    Trash,
    ExternalLink,
    Link2,
    Eye,
    Share2,
    Loader2,
    Archive,
    Lock,
    Globe,
    Users,
    Calendar,
    HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { WorkspaceFile, FileType } from '@/Redux/types/Workspace/workspace';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface FileItem extends WorkspaceFile { }

interface FileListProps {
    files: FileItem[];
    isLoading: boolean;
    onFolderClick: (folderName: string, folderPath: string) => void;
    onDownload: (file: FileItem) => void;
    onCopyLink: (file: FileItem) => void;
    onDelete: (file: FileItem) => void;
    onOpen: (file: FileItem) => void;
    onShare?: (file: FileItem) => void;
    onDeploy?: (file: FileItem) => void;
    selectedFiles?: string[];
    onSelectFile?: (fileId: string, selected: boolean) => void;
    viewMode?: 'grid' | 'list';
}

export default function FileList({
    files,
    isLoading,
    onFolderClick,
    onDownload,
    onCopyLink,
    onDelete,
    onOpen,
    onShare,
    onDeploy,
    selectedFiles = [],
    onSelectFile,
    viewMode = 'list'
}: FileListProps) {
    const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);

    const getFileIcon = (type: FileType, mimeType?: string) => {
        switch (type) {
            case 'text':
                return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
            case 'image':
                return <Image className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
            case 'code':
                return <FileCode className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
            case 'folder':
                return <FolderOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
            case 'document':
                return <File className="h-5 w-5 text-red-600 dark:text-red-400" />;
            case 'video':
                return <Video className="h-5 w-5 text-pink-600 dark:text-pink-400" />;
            case 'audio':
                return <Music className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
            case 'pdf':
                return <File className="h-5 w-5 text-red-600 dark:text-red-400" />;
            case 'spreadsheet':
                return <File className="h-5 w-5 text-green-600 dark:text-green-400" />;
            case 'presentation':
                return <File className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
            case 'archive':
                return <Archive className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
            default:
                return <File className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
        }
    };

    const getAccessLevelBadge = (file: FileItem) => {
        if (file.isPrivate) {
            return (
                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                </Badge>
            );
        }

        switch (file.accessLevel) {
            case 'mentors_only':
                return (
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Mentors Only
                    </Badge>
                );
            case 'specific_members':
                return (
                    <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Limited Access
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        All Members
                    </Badge>
                );
        }
    };

    // Format date in a more readable format
    const formatDate = (dateString: string | any) => {
        let date;
        if (dateString?.toDate) {
            date = dateString.toDate();
        } else {
            date = new Date(dateString);
        }

        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        // Today
        if (date.toDateString() === now.toDateString()) {
            return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        }

        // Yesterday
        if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        }

        // This year
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Other years
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Select a file (if selection is enabled)
    const handleSelectFile = (fileId: string, isSelected: boolean) => {
        if (onSelectFile) {
            onSelectFile(fileId, isSelected);
        }
    };

    // Handle file/folder click
    const handleItemClick = (file: FileItem) => {
        if (file.type === 'folder') {
            onFolderClick(file.name, file.path);
        } else {
            onOpen(file);
        }
    };

    // For grid view
    if (viewMode === 'grid') {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading files...</p>
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <div className="rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-4 w-16 h-16 mx-auto mb-6">
                            <FolderOpen className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">This folder is empty</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Upload files or create a new folder to get started
                        </p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className={`group relative bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200 cursor-pointer ${selectedFiles.includes(file.id) ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 border-indigo-500 dark:border-indigo-400' : ''
                                        }`}
                                    onMouseEnter={() => setHoveredFileId(file.id)}
                                    onMouseLeave={() => setHoveredFileId(null)}
                                >
                                    {/* Selection checkbox */}
                                    {onSelectFile && (
                                        <div className="absolute top-2 left-2 z-10">
                                            <Checkbox
                                                checked={selectedFiles.includes(file.id)}
                                                onCheckedChange={(checked) => handleSelectFile(file.id, !!checked)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 bg-white dark:bg-slate-800 shadow-sm"
                                            />
                                        </div>
                                    )}

                                    {/* File content */}
                                    <div
                                        className="p-4 h-full flex flex-col"
                                        onClick={() => handleItemClick(file)}
                                    >
                                        {/* File icon and preview */}
                                        <div className="flex-1 flex flex-col items-center justify-center mb-3">
                                            <div className="rounded-lg bg-white dark:bg-slate-700 p-3 shadow-sm mb-2">
                                                {getFileIcon(file.type, file.mimeType)}
                                            </div>

                                            {/* File name */}
                                            <h3 className={`font-medium text-sm text-center line-clamp-2 ${file.type === 'folder'
                                                    ? 'text-amber-800 dark:text-amber-300'
                                                    : 'text-slate-900 dark:text-slate-100'
                                                }`}>
                                                {file.name}
                                            </h3>
                                        </div>

                                        {/* File metadata */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center">
                                                    <HardDrive className="h-3 w-3 mr-1" />
                                                    {file.sizeFormatted}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {formatDate(file.updatedAt || file.createdAt)}
                                                </span>
                                            </div>

                                            {/* Access level badge */}
                                            <div className="flex justify-center">
                                                {getAccessLevelBadge(file)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover actions */}
                                    {(hoveredFileId === file.id || selectedFiles.includes(file.id)) && (
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3">
                                            <div className="flex justify-center space-x-1">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onOpen(file);
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Open</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                {file.type !== 'folder' && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onDownload(file);
                                                                    }}
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Download</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-white hover:bg-white/20"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onOpen(file);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Open
                                                        </DropdownMenuItem>

                                                        {file.type !== 'folder' && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onDownload(file);
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Download className="h-4 w-4 mr-2" />
                                                                    Download
                                                                </DropdownMenuItem>

                                                                {file.downloadUrl && (
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onCopyLink(file);
                                                                        }}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Link2 className="h-4 w-4 mr-2" />
                                                                        Copy Link
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {onShare && (
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onShare(file);
                                                                        }}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Share2 className="h-4 w-4 mr-2" />
                                                                        Share
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {onDeploy && ['code', 'text', 'document'].includes(file.type) && (
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onDeploy(file);
                                                                        }}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Archive className="h-4 w-4 mr-2" />
                                                                        Deploy
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </>
                                                        )}

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-700 dark:focus:text-red-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(file);
                                                            }}
                                                        >
                                                            <Trash className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default list view
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        {onSelectFile && (
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={files.length > 0 && selectedFiles.length === files.length}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            // Select all files
                                            files.forEach(file => !selectedFiles.includes(file.id) && handleSelectFile(file.id, true));
                                        } else {
                                            // Deselect all files
                                            files.forEach(file => selectedFiles.includes(file.id) && handleSelectFile(file.id, false));
                                        }
                                    }}
                                    className="border-slate-300 dark:border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                />
                            </TableHead>
                        )}
                        <TableHead className={onSelectFile ? "w-[300px]" : "w-[320px]"}>Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead>Modified</TableHead>
                        <TableHead>Modified By</TableHead>
                        <TableHead className="w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={onSelectFile ? 7 : 6} className="text-center py-12">
                                <div className="flex flex-col items-center">
                                    <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading files...</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : files.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={onSelectFile ? 7 : 6} className="text-center py-16">
                                <div className="rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-4 w-16 h-16 mx-auto mb-6">
                                    <FolderOpen className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">This folder is empty</h3>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Upload files or create a new folder to get started
                                </p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        files.map((file) => (
                            <TableRow
                                key={file.id}
                                className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800"
                                onMouseEnter={() => setHoveredFileId(file.id)}
                                onMouseLeave={() => setHoveredFileId(null)}
                            >
                                {onSelectFile && (
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedFiles.includes(file.id)}
                                            onCheckedChange={(checked) => handleSelectFile(file.id, !!checked)}
                                            className="border-slate-300 dark:border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                    </TableCell>
                                )}
                                <TableCell>
                                    <div
                                        className="flex items-center cursor-pointer group"
                                        onClick={() => handleItemClick(file)}
                                    >
                                        <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 mr-3 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                            {getFileIcon(file.type, file.mimeType)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span
                                                className={`font-medium truncate block ${file.type === 'folder'
                                                        ? 'text-amber-800 dark:text-amber-300 hover:text-amber-600 dark:hover:text-amber-200'
                                                        : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                    } transition-colors`}
                                            >
                                                {file.name}
                                            </span>
                                            {file.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                    {file.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                                    {file.sizeFormatted}
                                </TableCell>
                                <TableCell>
                                    {getAccessLevelBadge(file)}
                                </TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                                    {formatDate(file.updatedAt || file.createdAt)}
                                </TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-400 text-sm truncate">
                                    {file.uploaderName || "Unknown"}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-opacity"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                                        >
                                            <DropdownMenuItem onClick={() => onOpen(file)} className="cursor-pointer">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Open
                                            </DropdownMenuItem>

                                            {file.type !== 'folder' && (
                                                <>
                                                    <DropdownMenuItem onClick={() => onDownload(file)} className="cursor-pointer">
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </DropdownMenuItem>

                                                    {file.downloadUrl && (
                                                        <DropdownMenuItem onClick={() => onCopyLink(file)} className="cursor-pointer">
                                                            <Copy className="h-4 w-4 mr-2" />
                                                            Copy Link
                                                        </DropdownMenuItem>
                                                    )}

                                                    {onShare && (
                                                        <DropdownMenuItem onClick={() => onShare(file)} className="cursor-pointer">
                                                            <Share2 className="h-4 w-4 mr-2" />
                                                            Share
                                                        </DropdownMenuItem>
                                                    )}

                                                    {onDeploy && ['code', 'text', 'document'].includes(file.type) && (
                                                        <DropdownMenuItem onClick={() => onDeploy(file)} className="cursor-pointer">
                                                            <Archive className="h-4 w-4 mr-2" />
                                                            Deploy
                                                        </DropdownMenuItem>
                                                    )}
                                                </>
                                            )}

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer"
                                                onClick={() => onDelete(file)}
                                            >
                                                <Trash className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}