import React from 'react';
import {
    Maximize2,
    Minimize2,
    Copy,
    Download,
    Trash2,
    Terminal as TerminalIcon,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TerminalHeaderProps {
    aiEnabled: boolean;
    connected: boolean;
    fullscreen: boolean;
    setFullscreen: (value: boolean) => void;
    onClear: () => void;
    onCopy: () => void;
    onDownload: () => void;
}

export default function TerminalHeader({
    aiEnabled,
    connected,
    fullscreen,
    setFullscreen,
    onClear,
    onCopy,
    onDownload
}: TerminalHeaderProps) {
    return (
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
                <div className="flex space-x-2 mr-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center">
                    <TerminalIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-200 font-medium text-sm">Terminal</span>

                    {connected && (
                        <Badge variant="outline" className="ml-2 bg-green-900/50 text-green-300 border-green-700">
                            Connected
                        </Badge>
                    )}

                    {aiEnabled && (
                        <Badge variant="outline" className="ml-2 bg-indigo-900/50 text-indigo-300 border-indigo-700">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Enabled
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-1">
                <TabsList className="bg-gray-700">
                    <TabsTrigger value="terminal" className="text-xs data-[state=active]:bg-gray-800">
                        Terminal
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="text-xs data-[state=active]:bg-gray-800">
                        Documentation
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs data-[state=active]:bg-gray-800">
                        Settings
                    </TabsTrigger>
                </TabsList>

                <div className="flex ml-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                                    onClick={onClear}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Clear Terminal</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                                    onClick={onCopy}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Copy Output</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                                    onClick={onDownload}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Download History</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                                    onClick={() => setFullscreen(!fullscreen)}
                                >
                                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{fullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
}