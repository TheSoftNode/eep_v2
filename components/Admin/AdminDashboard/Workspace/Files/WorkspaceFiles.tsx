"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FileItem } from './FileList';
import FileHeader from './FileHeader';
import FileNavigation from './FileNavigation';
import FileList from './FileList';
import UploadDialog from './UploadDialog';
import NewFolderDialog from './NewFolderDialog';
import DeleteDialog from './DeleteDialog';
import ShareFileDialog from './ShareFileDialog';
import DeployFileDialog from './DeployFileDialog';
import { toast } from '@/hooks/use-toast';
import {
    FolderOpen,
    AlertCircle,
    Upload,
    RefreshCw,
    Files,
    Search,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkspaceFile } from '@/Redux/types/Workspace/workspace';
import { useCreateFolderMutation, useDeleteFileMutation, useGetWorkspaceFilesQuery, useSearchFilesQuery, useUploadWorkspaceFileMutation } from '@/Redux/apiSlices/workspaces/workspaceFilesApi';

interface WorkspaceFilesProps {
    workspaceId: string;
    workspaceName?: string;
    userPermissions?: {
        canUpload: boolean;
        canCreate: boolean;
        canDelete: boolean;
        canEdit: boolean;
        canShare: boolean;
    };
}

export default function WorkspaceFiles({
    workspaceId,
    workspaceName = 'Workspace',
    userPermissions = {
        canUpload: true,
        canCreate: true,
        canDelete: true,
        canEdit: true,
        canShare: true
    }
}: WorkspaceFilesProps) {
    // State management
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);

    // Dialog states
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);

    // Upload state
    const [uploadProgress, setUploadProgress] = useState(0);

    const { user } = useAuth();

    // Get current folder path string
    const currentFolderPath = currentPath.join('/');

    // RTK Query hooks
    const {
        data: filesResponse,
        isLoading,
        isError,
        error,
        refetch: refetchFiles
    } = useGetWorkspaceFilesQuery({
        workspaceId,
        folder: currentFolderPath || 'root'
    });

    const {
        data: searchResults,
        isLoading: isSearching,
        isError: isSearchError
    } = useSearchFilesQuery({
        query: searchQuery,
        workspaceId
    }, {
        skip: !searchQuery.trim()
    });

    const [uploadFile, { isLoading: isUploading }] = useUploadWorkspaceFileMutation();
    const [createFolder, { isLoading: isCreatingFolder }] = useCreateFolderMutation();
    const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation();

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.classList.remove('overflow-hidden');
            setIsUploadDialogOpen(false);
            setIsNewFolderDialogOpen(false);
            setIsDeleteDialogOpen(false);
            setIsShareDialogOpen(false);
            setIsDeployDialogOpen(false);
        };
    }, []);

    // Reset selection when files change
    useEffect(() => {
        setSelectedFiles([]);
    }, [filesResponse?.data]);

    // Get files data
    const files = filesResponse?.data || [];
    const filteredFiles = searchQuery.trim() ? (searchResults?.data || []) : files;

    // Select file handler
    const handleSelectFile = (fileId: string, selected: boolean) => {
        if (selected) {
            setSelectedFiles(prev => [...prev, fileId]);
        } else {
            setSelectedFiles(prev => prev.filter(id => id !== fileId));
        }
    };

    // Clear all selections
    const clearSelections = () => {
        setSelectedFiles([]);
    };

    // Navigation handlers
    const handleNavigateUp = () => {
        if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
            clearSelections();
        }
    };

    const handleNavigateTo = (index: number) => {
        if (index === -1) {
            setCurrentPath([]);
        } else {
            setCurrentPath(currentPath.slice(0, index + 1));
        }
        clearSelections();
    };

    const handleFolderClick = (folderName: string, folderPath: string) => {
        if (folderPath) {
            setCurrentPath(folderPath.split('/').filter(Boolean));
        } else {
            setCurrentPath([...currentPath, folderName]);
        }
        clearSelections();
    };

    const handleUpload = async (file: File, description: string, isPrivate: boolean): Promise<WorkspaceFile> => {
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('workspaceId', workspaceId);
        formData.append('folder', currentFolderPath || 'root');
        if (description.trim()) {
            formData.append('description', description.trim());
        }
        formData.append('isPrivate', isPrivate.toString());

        try {
            // Simulate progress for now
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            const result = await uploadFile(formData).unwrap();

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!result.data) {
                throw new Error('Upload response did not contain file data');
            }

            toast({
                title: "Upload Successful",
                description: `${file.name} has been uploaded successfully`,
            });

            return result.data;
        } catch (error: any) {
            console.error("Error uploading file:", error);
            toast({
                title: "Upload Failed",
                description: error?.data?.message || "Failed to upload file. Please try again.",
                variant: "destructive"
            });
            throw error;
        }
    };
    // Deploy after upload
    const handleDeployAfterUpload = (file: WorkspaceFile) => {
        setSelectedFile(file);
        setIsUploadDialogOpen(false);
        setIsDeployDialogOpen(true);
    };

    // New document handlers
    const handleNewTextDocument = () => {
        toast({
            title: "Feature Coming Soon",
            description: "Text document creation will be available in the next update!",
        });
    };

    const handleNewCodeFile = () => {
        toast({
            title: "Feature Coming Soon",
            description: "Code file creation will be available in the next update!",
        });
    };

    // Folder creation
    const handleCreateFolder = async (folderName: string) => {
        try {
            await createFolder({
                name: folderName.trim(),
                parentFolder: currentFolderPath || 'root',
                workspaceId
            }).unwrap();

            toast({
                title: "Folder Created",
                description: `"${folderName}" has been created successfully`,
            });

            setIsNewFolderDialogOpen(false);
        } catch (error: any) {
            console.error("Error creating folder:", error);
            toast({
                title: "Creation Failed",
                description: error?.data?.message || "Failed to create folder. Please try again.",
                variant: "destructive"
            });
            throw error;
        }
    };

    // File download
    const handleDownload = (file: WorkspaceFile) => {
        if (file.downloadUrl) {
            const link = document.createElement('a');
            link.href = file.downloadUrl;
            link.download = file.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Download Started",
                description: `Downloading ${file.name}...`,
            });
        } else {
            toast({
                title: "Download Unavailable",
                description: "This file cannot be downloaded at the moment",
                variant: "destructive"
            });
        }
    };

    // Copy link to clipboard
    const handleCopyLink = async (file: WorkspaceFile) => {
        if (file.downloadUrl) {
            try {
                await navigator.clipboard.writeText(file.downloadUrl);
                toast({
                    title: "Link Copied",
                    description: "File link has been copied to your clipboard",
                });
            } catch (error) {
                toast({
                    title: "Copy Failed",
                    description: "Unable to copy link to clipboard",
                    variant: "destructive"
                });
            }
        } else {
            toast({
                title: "Link Unavailable",
                description: "This file doesn't have a shareable link",
                variant: "destructive"
            });
        }
    };

    // File/folder delete
    const handleDelete = async () => {
        if (!selectedFile) return;

        try {
            await deleteFile(selectedFile.id).unwrap();

            toast({
                title: "Deleted Successfully",
                description: `${selectedFile.type === 'folder' ? 'Folder' : 'File'} "${selectedFile.name}" has been deleted`,
            });

            setIsDeleteDialogOpen(false);
            setSelectedFile(null);
        } catch (error: any) {
            console.error("Error deleting:", error);
            toast({
                title: "Deletion Failed",
                description: error?.data?.message || "Failed to delete. Please try again.",
                variant: "destructive"
            });
        }
    };

    // File open
    const handleOpenFile = (file: WorkspaceFile) => {
        if (file.type === 'folder') {
            handleFolderClick(file.name, file.path);
            return;
        }

        if (file.downloadUrl) {
            window.open(file.downloadUrl, '_blank');
        } else {
            toast({
                title: "Cannot Open File",
                description: "This file cannot be opened at the moment",
                variant: "destructive"
            });
        }
    };

    // Share file
    const handleShare = (file: WorkspaceFile) => {
        setSelectedFile(file);
        setIsShareDialogOpen(true);
    };

    // Deploy file
    const handleDeploy = (file: WorkspaceFile) => {
        setSelectedFile(file);
        setIsDeployDialogOpen(true);
    };

    // Bulk delete
    const handleBulkDelete = () => {
        if (selectedFiles.length === 0) return;

        if (selectedFiles.length === 1) {
            const fileToDelete = files.find(file => file.id === selectedFiles[0]);
            if (fileToDelete) {
                setSelectedFile(fileToDelete);
                setIsDeleteDialogOpen(true);
            }
            return;
        }

        toast({
            title: "Feature Coming Soon",
            description: "Bulk delete functionality will be available in the next update!",
        });
    };

    // Retry loading
    const handleRetry = () => {
        refetchFiles();
    };

    // Format error message
    const getErrorMessage = () => {
        if (typeof error === 'string') return error;
        if (error && 'data' in error && error.data && typeof error.data === 'object') {
            return (error.data as any).message || "An error occurred while loading files";
        }
        return "Failed to load files";
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-3">
                            <Files className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Files & Documents
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Manage and organize your workspace files
                            </p>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="hidden sm:flex items-center space-x-4">
                            <Badge variant="outline" className="bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-700">
                                <Files className="h-3 w-3 mr-1" />
                                {files.length} files
                            </Badge>
                            {selectedFiles.length > 0 && (
                                <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-600">
                                    {selectedFiles.length} selected
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* File Header */}
            <FileHeader
                onUploadClick={() => userPermissions.canUpload && setIsUploadDialogOpen(true)}
                onNewTextClick={() => userPermissions.canCreate && handleNewTextDocument()}
                onNewCodeClick={() => userPermissions.canCreate && handleNewCodeFile()}
                onNewFolderClick={() => userPermissions.canCreate && setIsNewFolderDialogOpen(true)}
                viewMode={viewMode}
                onViewModeChange={(mode) => setViewMode(mode)}
                fileCount={filteredFiles.length}
                currentFolder={currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined}
            />

            {/* File Navigation */}
            <FileNavigation
                currentPath={currentPath}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNavigateUp={handleNavigateUp}
                onNavigateTo={handleNavigateTo}
                totalFiles={filteredFiles.length}
                workspaceName={workspaceName}
            />

            {/* Error State */}
            {isError && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-red-800 dark:text-red-300">Error Loading Files</AlertTitle>
                    <AlertDescription className="text-red-700 dark:text-red-400">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
                            <span>{getErrorMessage()}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRetry}
                                className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Selected Files Actions */}
            {selectedFiles.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2">
                                <Files className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                                {selectedFiles.length} item{selectedFiles.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearSelections}
                                className="border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                            >
                                Clear
                            </Button>
                            {userPermissions.canDelete && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                                >
                                    Delete Selected
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* File List */}
            <FileList
                files={filteredFiles}
                isLoading={isLoading || isSearching}
                onFolderClick={handleFolderClick}
                onDownload={handleDownload}
                onCopyLink={handleCopyLink}
                onDelete={(file) => {
                    if (userPermissions.canDelete) {
                        setSelectedFile(file);
                        setIsDeleteDialogOpen(true);
                    }
                }}
                onOpen={handleOpenFile}
                onShare={userPermissions.canShare ? handleShare : undefined}
                onDeploy={userPermissions.canEdit ? handleDeploy : undefined}
                selectedFiles={selectedFiles}
                onSelectFile={handleSelectFile}
                viewMode={viewMode}
            />

            {/* Empty State */}
            {!isLoading && !isSearching && !isError && filteredFiles.length === 0 && searchQuery === '' && (
                <div className="text-center py-16">
                    <div className="rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-6 w-24 h-24 mx-auto mb-6">
                        <FolderOpen className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {currentPath.length > 0 ? 'Folder is Empty' : 'No Files Yet'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        {currentPath.length > 0
                            ? `The "${currentPath[currentPath.length - 1]}" folder doesn't contain any files yet.`
                            : "This workspace doesn't have any files yet. Start by uploading your first file or creating a folder."}
                    </p>

                    {userPermissions.canUpload && (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={() => setIsUploadDialogOpen(true)}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                size="lg"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Files
                            </Button>
                            {userPermissions.canCreate && (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsNewFolderDialogOpen(true)}
                                    className="border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                    size="lg"
                                >
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    Create Folder
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* No Search Results */}
            {!isLoading && !isSearching && !isError && filteredFiles.length === 0 && searchQuery !== '' && (
                <div className="text-center py-16">
                    <div className="rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-6 w-24 h-24 mx-auto mb-6">
                        <Search className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No Results Found</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        No files match your search for:{' '}
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{searchQuery}"</span>
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setSearchQuery('')}
                        className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        Clear Search
                    </Button>
                </div>
            )}

            {/* Dialogs */}
            <UploadDialog
                open={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onUpload={handleUpload}
                onDeploy={handleDeployAfterUpload}
                isUploading={isUploading}
                progress={uploadProgress}
                currentFolder={currentFolderPath}
                workspaceName={workspaceName}
            />

            <NewFolderDialog
                open={isNewFolderDialogOpen}
                onClose={() => setIsNewFolderDialogOpen(false)}
                onCreateFolder={handleCreateFolder}
                isCreating={isCreatingFolder}
                currentPath={currentFolderPath}
                workspaceName={workspaceName}
            />

            <DeleteDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                file={selectedFile}
            />

            <ShareFileDialog
                open={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                file={selectedFile}
            />

            <DeployFileDialog
                open={isDeployDialogOpen}
                onClose={() => setIsDeployDialogOpen(false)}
                file={selectedFile}
            />
        </div>
    );
}