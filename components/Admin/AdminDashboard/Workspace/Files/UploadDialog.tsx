"use client"

import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
    Upload,
    FileText,
    FileCode,
    Image,
    File,
    Video,
    Music,
    Archive,
    Loader2,
    X,
    AlertTriangle,
    Lock,
    Unlock,
    Info,
    Server,
    CheckCircle,
    FolderOpen
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WorkspaceFile } from '@/Redux/types/Workspace/workspace';

interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
    onUpload: (file: File, description: string, isPrivate: boolean) => Promise<WorkspaceFile>;
    onDeploy?: (file: WorkspaceFile) => void;
    isUploading: boolean;
    progress: number;
    currentFolder?: string;
    maxFileSize?: number; // in bytes
    workspaceName?: string;
}

export default function UploadDialog({
    open,
    onClose,
    onUpload,
    onDeploy,
    isUploading,
    progress,
    currentFolder = '',
    maxFileSize = 50 * 1024 * 1024, // 50MB default
    workspaceName = 'Workspace'
}: UploadDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [uploadedFileData, setUploadedFileData] = useState<WorkspaceFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            // Check file size
            if (file.size > maxFileSize) {
                setError(`File is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
                return;
            }

            setSelectedFile(file);
        }
    }, [maxFileSize]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: maxFileSize,
        onDropRejected: (rejections) => {
            if (rejections.length > 0) {
                const rejection = rejections[0];
                if (rejection.errors[0].code === 'file-too-large') {
                    setError(`File is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
                } else if (rejection.errors[0].code === 'file-invalid-type') {
                    setError('File type not supported');
                } else {
                    setError(`Upload error: ${rejection.errors[0].message}`);
                }
            }
        }
    });

    const handleSelectFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Check file size
            if (file.size > maxFileSize) {
                setError(`File is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            setError(null);
            try {
                const fileData = await onUpload(selectedFile, description.trim(), isPrivate);
                setUploadComplete(true);
                setUploadedFileData(fileData);
            } catch (err: any) {
                console.error('Error during upload:', err);
                setError(err?.message || 'An error occurred during upload. Please try again.');
            }
        }
    };

    const handleClose = () => {
        if (!isUploading) {
            setSelectedFile(null);
            setDescription('');
            setIsPrivate(false);
            setError(null);
            setUploadComplete(false);
            setUploadedFileData(null);
            onClose();
        }
    };

    // Handle deploy action
    const handleDeploy = () => {
        if (onDeploy && uploadedFileData) {
            onDeploy(uploadedFileData);
            handleClose();
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (filename: string) => {
        const extension = filename.split('.').pop()?.toLowerCase();

        // Images
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(extension!)) {
            return <Image className="h-6 w-6 text-purple-600 dark:text-purple-400" />;
        }
        // Documents
        else if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension!)) {
            return <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />;
        }
        // Code files
        else if (['js', 'ts', 'html', 'css', 'json', 'py', 'java', 'php', 'c', 'cpp', 'jsx', 'tsx', 'vue', 'go', 'rs', 'rb'].includes(extension!)) {
            return <FileCode className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />;
        }
        // Video files
        else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension!)) {
            return <Video className="h-6 w-6 text-pink-600 dark:text-pink-400" />;
        }
        // Audio files
        else if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(extension!)) {
            return <Music className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />;
        }
        // Archive files
        else if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension!)) {
            return <Archive className="h-6 w-6 text-amber-600 dark:text-amber-400" />;
        }
        // Default
        return <File className="h-6 w-6 text-slate-600 dark:text-slate-400" />;
    };

    const isDeployable = selectedFile && (
        ['js', 'ts', 'html', 'css', 'json', 'jsx', 'tsx', 'vue'].includes(selectedFile.name.split('.').pop()?.toLowerCase() || '') ||
        selectedFile.type.startsWith('text/')
    );

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`rounded-full p-2 ${uploadComplete
                            ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30'
                            : 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30'
                            }`}>
                            {uploadComplete ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <Upload className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {uploadComplete ? "Upload Complete" : "Upload File"}
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                                {uploadComplete
                                    ? "Your file has been uploaded successfully"
                                    : currentFolder
                                        ? `Upload to ${workspaceName} / ${currentFolder}`
                                        : `Upload to ${workspaceName}`
                                }
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* Current location indicator */}
                    <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <FolderOpen className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            Uploading to: <span className="font-medium text-slate-900 dark:text-slate-100">
                                {currentFolder ? `${workspaceName} → ${currentFolder}` : workspaceName}
                            </span>
                        </span>
                    </div>

                    {uploadComplete ? (
                        /* Upload success view */
                        <div className="text-center py-6">
                            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-3 mr-4">
                                        {selectedFile && getFileIcon(selectedFile.name)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                                            {selectedFile?.name}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {selectedFile && formatFileSize(selectedFile.size)} • Uploaded successfully
                                        </p>
                                    </div>
                                </div>

                                <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Your file is now available in the workspace and can be accessed by team members.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </div>
                    ) : !selectedFile ? (
                        /* File selection dropzone */
                        <div
                            {...getRootProps()}
                            className={`
                                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                                transition-all duration-200
                                ${isDragActive
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105'
                                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }
                            `}
                        >
                            <input {...getInputProps()} />
                            <div className="space-y-4">
                                <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 w-16 h-16 mx-auto">
                                    <Upload className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        {isDragActive ? 'Drop your file here' : 'Upload a file'}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                                        Drag and drop or{' '}
                                        <span className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">
                                            browse to select
                                        </span>
                                    </p>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                                    <p>Supported: Images, Documents, Code, Videos, Audio files</p>
                                    <p>Maximum file size: <span className="font-medium">{formatFileSize(maxFileSize)}</span></p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Selected file preview */
                        <div className="space-y-4">
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center">
                                    <div className="rounded-lg bg-white dark:bg-slate-700 p-3 mr-4 shadow-sm">
                                        {getFileIcon(selectedFile.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                                        </p>
                                        {isDeployable && (
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                                ✓ This file can be deployed after upload
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                                        onClick={() => setSelectedFile(null)}
                                        disabled={isUploading}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 w-full border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                    onClick={handleSelectFile}
                                    disabled={isUploading}
                                >
                                    Choose Different File
                                </Button>
                            </div>

                            {/* File Description */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="description" className="text-slate-800 dark:text-slate-200 font-medium">
                                        Description
                                    </Label>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Optional</span>
                                </div>
                                <Textarea
                                    id="description"
                                    placeholder="Add a description to help others understand this file..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isUploading}
                                    rows={3}
                                    className="resize-none border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Privacy Settings */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center space-x-3">
                                    <div className={`rounded-full p-2 ${isPrivate
                                        ? 'bg-red-100 dark:bg-red-900/30'
                                        : 'bg-emerald-100 dark:bg-emerald-900/30'
                                        }`}>
                                        {isPrivate ? (
                                            <Lock className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        ) : (
                                            <Unlock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="private-switch" className="text-slate-900 dark:text-slate-100 font-medium cursor-pointer">
                                            {isPrivate ? 'Private File' : 'Shared File'}
                                        </Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {isPrivate
                                                ? 'Only you can access this file'
                                                : 'All workspace members can access this file'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="private-switch"
                                    checked={isPrivate}
                                    onCheckedChange={setIsPrivate}
                                    disabled={isUploading}
                                    className="data-[state=checked]:bg-red-600"
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                        Uploading...
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                    {progress}%
                                </span>
                            </div>
                            <Progress value={progress} className="h-2">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </Progress>
                        </div>
                    )}

                    {/* Info Notice */}
                    {!uploadComplete && (
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                Files are stored securely and can be shared with your team. All uploads are scanned for security.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {uploadComplete ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                                Close
                            </Button>

                            {onDeploy && isDeployable && uploadedFileData && (
                                <Button
                                    type="button"
                                    onClick={handleDeploy}
                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <Server className="mr-2 h-4 w-4" />
                                    Deploy Now
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isUploading}
                                className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload File
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}