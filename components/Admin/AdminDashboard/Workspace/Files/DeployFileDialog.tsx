"use client"

import { useState, useEffect } from 'react';
import {
    Check, Cloud, Server, Globe, Loader2, AlertCircle, Copy, ExternalLink
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { WorkspaceFile } from '@/Redux/types/Workspace/workspace';
import { useDeployToAwsMutation, useDeployToAzureMutation, useDeployToGcpMutation, useDeployToRenderMutation } from '../../../../../Redux/apiSlices/deployment/deploymentApi';

interface DeployFileDialogProps {
    open: boolean;
    onClose: () => void;
    file: WorkspaceFile | null;
}

interface DeploymentResult {
    url: string;
    dashboard: string;
    message: string;
}

type ProviderType = 'render' | 'aws' | 'azure' | 'gcp';

export default function DeployFileDialog({ open, onClose, file }: DeployFileDialogProps) {
    const [activeTab, setActiveTab] = useState<ProviderType>('render');
    const [deploymentName, setDeploymentName] = useState('');
    const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);

    // RTK Query hooks for deployment
    const [deployToAws, { isLoading: isLoadingAws }] = useDeployToAwsMutation();
    const [deployToAzure, { isLoading: isLoadingAzure }] = useDeployToAzureMutation();
    const [deployToGcp, { isLoading: isLoadingGcp }] = useDeployToGcpMutation();
    const [deployToRender, { isLoading: isLoadingRender }] = useDeployToRenderMutation();

    const isDeploying = isLoadingAws || isLoadingAzure || isLoadingGcp || isLoadingRender;

    // Reset state when dialog opens/closes
    const handleClose = () => {
        setDeploymentName('');
        setDeploymentResult(null);
        onClose();
    };

    // Generate deployment name from file name
    const generateDeploymentName = () => {
        if (!file) return '';

        // Remove extension and convert to kebab-case
        const baseName = file.name.split('.')[0];
        return baseName
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    };

    // Initialize deployment name when file changes
    useEffect(() => {
        if (file && open) {
            setDeploymentName(generateDeploymentName());
            setDeploymentResult(null);
        }
    }, [file, open]);

    // Handle deployment based on selected provider
    const handleDeploy = async () => {
        if (!file) return;

        if (!deploymentName.trim()) {
            toast({
                title: "Validation Error",
                description: "Please enter a deployment name",
                variant: "destructive"
            });
            return;
        }

        try {
            let result;
            const deploymentData = {
                fileId: file.id,
                name: deploymentName.trim()
            };

            switch (activeTab) {
                case 'aws':
                    result = await deployToAws(deploymentData).unwrap();
                    break;
                case 'azure':
                    result = await deployToAzure(deploymentData).unwrap();
                    break;
                case 'gcp':
                    result = await deployToGcp(deploymentData).unwrap();
                    break;
                case 'render':
                    result = await deployToRender(deploymentData).unwrap();
                    break;
            }

            if (result?.success && result?.data) {
                setDeploymentResult(result.data);
                toast({
                    title: "Deployment Successful",
                    description: `${file.name} has been deployed to ${getProviderInfo(activeTab).title}`,
                });
            }
        } catch (error: any) {
            console.error('Failed to deploy file:', error);
            toast({
                title: "Deployment Failed",
                description: error?.data?.message || "Unable to deploy file. Please try again or contact support.",
                variant: "destructive"
            });
        }
    };

    // Copy URL to clipboard
    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: "Copied!",
                description: `${label} copied to clipboard`,
            });
        } catch (error) {
            toast({
                title: "Copy Failed",
                description: "Unable to copy to clipboard",
                variant: "destructive"
            });
        }
    };

    // Provider configuration info
    const getProviderInfo = (provider: ProviderType) => {
        switch (provider) {
            case 'render':
                return {
                    title: 'Render',
                    description: 'Deploy as a static site or web service (Recommended)',
                    icon: <Globe className="h-5 w-5 text-emerald-500" />,
                    color: 'emerald'
                };
            case 'aws':
                return {
                    title: 'Amazon Web Services',
                    description: 'Deploy to AWS S3 static hosting or Lambda functions',
                    icon: <Cloud className="h-5 w-5 text-orange-500" />,
                    color: 'orange'
                };
            case 'azure':
                return {
                    title: 'Microsoft Azure',
                    description: 'Deploy to Azure Static Web Apps or Functions',
                    icon: <Cloud className="h-5 w-5 text-blue-500" />,
                    color: 'blue'
                };
            case 'gcp':
                return {
                    title: 'Google Cloud Platform',
                    description: 'Deploy to Google Cloud Storage or Cloud Functions',
                    icon: <Cloud className="h-5 w-5 text-red-500" />,
                    color: 'red'
                };
        }
    };

    if (!file) return null;

    const isDeployable = ['text', 'code', 'document'].includes(file.type) ||
        file.mimeType?.startsWith('text/') ||
        file.name.endsWith('.html') ||
        file.name.endsWith('.js') ||
        file.name.endsWith('.css');

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-2">
                            <Server className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Deploy File
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                                Deploy "{file.name}" to a cloud hosting provider
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {!isDeployable && (
                        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                This file type may not be suitable for web deployment. Consider HTML, CSS, JavaScript, or other web assets.
                            </AlertDescription>
                        </Alert>
                    )}

                    {!deploymentResult ? (
                        <>
                            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProviderType)}>
                                <TabsList className="grid grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1">
                                    {(['render', 'aws', 'azure', 'gcp'] as ProviderType[]).map((provider) => (
                                        <TabsTrigger
                                            key={provider}
                                            value={provider}
                                            className="text-slate-600 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm"
                                        >
                                            {provider === 'render' ? 'Render' :
                                                provider === 'aws' ? 'AWS' :
                                                    provider === 'azure' ? 'Azure' : 'GCP'}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {(['render', 'aws', 'azure', 'gcp'] as ProviderType[]).map((provider) => (
                                    <TabsContent key={provider} value={provider} className="mt-6">
                                        <div className="space-y-5">
                                            {/* Provider info card */}
                                            <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                                {getProviderInfo(provider).icon}
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {getProviderInfo(provider).title}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {getProviderInfo(provider).description}
                                                    </p>
                                                </div>
                                                {provider === 'render' && (
                                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-md text-xs font-medium">
                                                        Recommended
                                                    </div>
                                                )}
                                            </div>

                                            {/* Deployment name input */}
                                            <div>
                                                <Label htmlFor="deployment-name" className="text-slate-800 dark:text-slate-200 font-medium">
                                                    Deployment Name
                                                </Label>
                                                <Input
                                                    id="deployment-name"
                                                    value={deploymentName}
                                                    onChange={(e) => setDeploymentName(e.target.value)}
                                                    placeholder="my-awesome-project"
                                                    className="mt-2 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    This will be used as your deployment URL identifier (lowercase, hyphens only)
                                                </p>
                                            </div>

                                            {/* Configuration note */}
                                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    {provider === 'render'
                                                        ? "Render offers free static site hosting with automatic SSL certificates."
                                                        : `Ensure your ${getProviderInfo(provider).title} credentials are configured in your account settings.`
                                                    }
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </>
                    ) : (
                        /* Deployment success result */
                        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 overflow-hidden">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 flex items-center">
                                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-1 mr-3">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
                                        Deployment Successful!
                                    </h3>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                                        Your file is now live and accessible
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Live URL */}
                                <div>
                                    <Label className="text-slate-800 dark:text-slate-200 font-medium">
                                        Live URL
                                    </Label>
                                    <div className="flex mt-2">
                                        <Input
                                            readOnly
                                            value={deploymentResult.url}
                                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono text-sm"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(deploymentResult.url, "URL")}
                                            className="ml-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(deploymentResult.url, '_blank')}
                                            className="ml-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Dashboard URL */}
                                <div>
                                    <Label className="text-slate-800 dark:text-slate-200 font-medium">
                                        Management Dashboard
                                    </Label>
                                    <div className="flex mt-2">
                                        <Input
                                            readOnly
                                            value={deploymentResult.dashboard}
                                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono text-sm"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(deploymentResult.dashboard, '_blank')}
                                            className="ml-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Success message */}
                                <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                                    <Check className="h-4 w-4" />
                                    <AlertDescription>
                                        {deploymentResult.message}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                        {deploymentResult ? 'Close' : 'Cancel'}
                    </Button>

                    {!deploymentResult && (
                        <Button
                            type="button"
                            onClick={handleDeploy}
                            disabled={isDeploying || !deploymentName.trim()}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {isDeploying ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deploying to {getProviderInfo(activeTab).title}...
                                </>
                            ) : (
                                <>
                                    <Server className="h-4 w-4 mr-2" />
                                    Deploy to {getProviderInfo(activeTab).title.split(' ')[0]}
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}