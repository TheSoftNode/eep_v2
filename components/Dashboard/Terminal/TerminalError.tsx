import React from 'react';
import { AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalErrorProps {
    error: string;
    onRetry: () => void;
    onInstall: () => void;
}

export default function TerminalError({
    error,
    onRetry,
    onInstall
}: TerminalErrorProps) {
    return (
        <div className="h-full flex items-center justify-center p-6 bg-gray-900">
            <div className="max-w-md w-full p-6 bg-red-900/20 border border-red-800 rounded-lg text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />

                <h3 className="text-xl font-bold text-white mb-2">Connection Error</h3>

                <p className="text-gray-300 mb-6">
                    {error === 'not-installed' ? (
                        'Terminal Agent is not installed or not running on your system.'
                    ) : error === 'pairing-failed' ? (
                        'Pairing failed. The code may be invalid or expired.'
                    ) : error === 'unauthorized' ? (
                        'You do not have permission to use the terminal.'
                    ) : (
                        'Could not connect to the Terminal Agent. Please check if it\'s running.'
                    )}
                </p>

                <div className="flex flex-col space-y-3">
                    {error === 'not-installed' ? (
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={onInstall}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Terminal Agent
                        </Button>
                    ) : (
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={onRetry}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    )}

                    <a
                        href="/help/terminal-agent"
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                        View troubleshooting guide
                    </a>
                </div>
            </div>
        </div>
    );
}