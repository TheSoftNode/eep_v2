import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface TerminalSettingsProps {
    aiEnabled: boolean;
    setAiEnabled: (enabled: boolean) => void;
    onDownloadAgent: () => void;
}

export default function TerminalSettings({
    aiEnabled,
    setAiEnabled,
    onDownloadAgent
}: TerminalSettingsProps) {
    const settingsRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(14);
    const [saveHistory, setSaveHistory] = useState(true);
    const [darkTheme, setDarkTheme] = useState(true);

    return (
        <div
            ref={settingsRef}
            className="h-full overflow-y-auto p-6"
        >
            <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold text-white mb-4">Terminal Settings</h2>

                <div className="space-y-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">AI Assistant</h3>
                                <p className="text-sm text-gray-400">Enable AI-powered suggestions as you work</p>
                            </div>
                            <Switch
                                checked={aiEnabled}
                                onCheckedChange={setAiEnabled}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">Command History</h3>
                                <p className="text-sm text-gray-400">Save command history between sessions</p>
                            </div>
                            <Switch
                                checked={saveHistory}
                                onCheckedChange={setSaveHistory}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">Dark Theme</h3>
                                <p className="text-sm text-gray-400">Use dark theme for terminal</p>
                            </div>
                            <Switch
                                checked={darkTheme}
                                onCheckedChange={setDarkTheme}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-medium text-white">Font Size</h3>
                                <p className="text-sm text-gray-400">Adjust terminal font size</p>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-300 bg-gray-700 border-gray-600"
                                    onClick={() => setFontSize(prev => Math.max(10, prev - 1))}
                                >
                                    -
                                </Button>
                                <span className="mx-2 text-white">{fontSize}px</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-300 bg-gray-700 border-gray-600"
                                    onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <div>
                            <h3 className="font-medium text-white mb-2">Terminal Agent</h3>
                            <p className="text-sm text-gray-400 mb-3">
                                Download the terminal agent to connect the terminal to your local machine
                            </p>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={onDownloadAgent}
                            >
                                Download Terminal Agent
                            </Button>
                        </div>
                    </div>

                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                        Apply Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}