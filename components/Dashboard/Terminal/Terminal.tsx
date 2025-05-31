"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import TerminalHeader from './TerminalHeader';
import TerminalContent from './TerminalContent';
import TerminalInput from './TerminalInput';
import TerminalDocs from './TerminalDocs';
import TerminalSettings from './TerminalSettings';
import TerminalTabs from './TerminalTabs';
import TerminalError from './TerminalError';
import TerminalStatusBar from './TerminalStatusBar';
import { CommandOutput, HistoryItem } from './terminalTypes';
import terminalService from '@/lib/terminalService';

export default function Terminal() {
    // Terminal state
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState<CommandOutput[]>([
        {
            id: '1',
            type: 'info',
            content: 'Initializing terminal...',
            timestamp: new Date()
        }
    ]);
    const [commandHistory, setCommandHistory] = useState<HistoryItem[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [fullscreen, setFullscreen] = useState(false);
    const [aiEnabled, setAiEnabled] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('terminal');

    // Connection state
    const [connected, setConnected] = useState(false);
    const [agentInstalled, setAgentInstalled] = useState(false);
    const [showPairingInput, setShowPairingInput] = useState(false);
    const [pairingCode, setPairingCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Tabs state
    const [tabs, setTabs] = useState([{ id: '1', title: 'Terminal 1' }]);
    const [activeTerminalTab, setActiveTerminalTab] = useState('1');

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);

    // Common commands for suggestions
    const commonCommands = [
        'npm install',
        'git status',
        'git commit -m "message"',
        'ls -la',
        'cd ..',
        'mkdir new-folder',
        'python -m venv venv',
        'docker ps'
    ];

    // Verify access and check agent status
    useEffect(() => {
        const initialize = async () => {
            try {
                // Verify user has access to terminal
                const hasAccess = await terminalService.verifyAccess();
                if (!hasAccess) {
                    setError('unauthorized');
                    return;
                }

                // Check if agent is installed
                const isInstalled = await terminalService.checkAgentStatus();
                if (isInstalled) {
                    setAgentInstalled(true);
                    setShowPairingInput(true);

                    setHistory(prev => [...prev, {
                        id: Date.now().toString(),
                        type: 'info',
                        content: 'Local terminal agent detected. Please enter the pairing code from your agent.',
                        timestamp: new Date()
                    }]);
                } else {
                    setAgentInstalled(false);
                    setError('not-installed');
                }
            } catch (error) {
                console.error('Error initializing terminal:', error);
                setError('unknown');
            }
        };

        initialize();
    }, []);

    // Handle pairing code submission
    const handlePairSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pairingCode) return;

        setIsProcessing(true);

        terminalService.connectToLocalAgent(pairingCode, {
            onConnect: () => {
                setConnected(true);
                setShowPairingInput(false);
                setError(null);
                setIsProcessing(false);

                setHistory(prev => [...prev, {
                    id: Date.now().toString(),
                    type: 'info',
                    content: 'Successfully connected to local terminal. Creating session...',
                    timestamp: new Date()
                }]);
            },
            onData: (data) => {
                setHistory(prev => [...prev, {
                    id: Date.now().toString(),
                    type: data.type,
                    content: data.content,
                    timestamp: new Date()
                }]);

                // If AI is enabled, check for suggestions
                if (aiEnabled && data.type === 'output' && command) {
                    const suggestion = terminalService.getAISuggestion(command, data.content);
                    if (suggestion) {
                        setTimeout(() => {
                            setHistory(prev => [...prev, suggestion]);
                        }, 500);
                    }
                }

                setIsProcessing(false);
            },
            onError: (errorMsg) => {
                console.error('Connection error:', errorMsg);
                setError('connection-failed');
                setIsProcessing(false);

                setHistory(prev => [...prev, {
                    id: Date.now().toString(),
                    type: 'error',
                    content: `Connection error: ${errorMsg}`,
                    timestamp: new Date()
                }]);
            }
        });
    };

    // Execute command
    const executeCommand = useCallback((cmd: string) => {
        if (!cmd.trim() || !connected) return;

        // Add command to history
        setCommandHistory(prev => [...prev, { command: cmd, timestamp: new Date() }]);
        setCommand('');
        setHistoryIndex(-1);
        setIsProcessing(true);

        // Handle client-side commands
        if (cmd === 'clear') {
            setHistory([{
                id: Date.now().toString(),
                type: 'info',
                content: 'Terminal cleared.',
                timestamp: new Date()
            }]);
            setIsProcessing(false);
            return;
        } else if (cmd === 'ai on') {
            setAiEnabled(true);
            setHistory(prev => [...prev, {
                id: Date.now().toString(),
                type: 'info',
                content: 'AI assistant enabled.',
                timestamp: new Date()
            }]);
            setIsProcessing(false);
            return;
        } else if (cmd === 'ai off') {
            setAiEnabled(false);
            setHistory(prev => [...prev, {
                id: Date.now().toString(),
                type: 'info',
                content: 'AI assistant disabled.',
                timestamp: new Date()
            }]);
            setIsProcessing(false);
            return;
        } else if (cmd === 'help') {
            setHistory(prev => [...prev, {
                id: Date.now().toString(),
                type: 'info',
                content: `
Available commands:
- help: Display this help message
- clear: Clear the terminal
- ai on/off: Enable/disable AI assistant

All other commands will be executed on your local machine.
`,
                timestamp: new Date()
            }]);
            setIsProcessing(false);
            return;
        }

        try {
            // Add command to display history
            setHistory(prev => [...prev, {
                id: Date.now().toString(),
                type: 'command',
                content: cmd,
                timestamp: new Date()
            }]);

            // Execute command on local agent
            terminalService.executeCommand(cmd);
        } catch (error) {
            console.error('Error executing command:', error);
            setHistory(prev => [...prev, {
                id: Date.now().toString(),
                type: 'error',
                content: 'Failed to execute command',
                timestamp: new Date()
            }]);
            setIsProcessing(false);
        }
    }, [connected, aiEnabled]);

    // Handle command submission
    const handleCommandSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeCommand(command);
    };

    // Handle key navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle command history navigation with up/down arrows
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[commandHistory.length - 1 - newIndex].command);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[commandHistory.length - 1 - newIndex].command);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCommand('');
            }
        } else if (e.key === 'Tab') {
            // Simple tab completion
            e.preventDefault();

            if (command.trim()) {
                const matchingCommands = commonCommands.filter(cmd =>
                    cmd.startsWith(command.trim())
                );

                if (matchingCommands.length === 1) {
                    setCommand(matchingCommands[0]);
                }
            }
        }
    };

    // Suggest commands based on typing
    const getSuggestions = () => {
        if (!command.trim() || !aiEnabled) return [];

        return commonCommands
            .filter(cmd => cmd.includes(command.trim()))
            .slice(0, 3);
    };

    // Copy terminal content to clipboard
    const copyToClipboard = () => {
        const terminalContent = history
            .map(item => {
                if (item.type === 'command') {
                    return `$ ${item.content}`;
                } else {
                    return item.content;
                }
            })
            .join('\n');

        navigator.clipboard.writeText(terminalContent);
    };

    // Download terminal history
    const downloadTerminalHistory = () => {
        const terminalContent = history
            .map(item => {
                if (item.type === 'command') {
                    return `$ ${item.content}`;
                } else {
                    return item.content;
                }
            })
            .join('\n');

        const blob = new Blob([terminalContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `terminal-history-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Clear terminal history
    const clearTerminal = () => {
        setHistory([{
            id: Date.now().toString(),
            type: 'info',
            content: 'Terminal cleared.',
            timestamp: new Date()
        }]);
    };

    // Focus input when content is clicked
    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Handle install terminal agent
    const handleInstallAgent = () => {
        window.open(terminalService.getDownloadUrl('win'), '_blank');
    };

    // Clear errors and retry connection
    const handleRetry = () => {
        setError(null);
        setHistory([{
            id: Date.now().toString(),
            type: 'info',
            content: 'Reconnecting to terminal agent...',
            timestamp: new Date()
        }]);

        // Check agent status again
        terminalService.checkAgentStatus()
            .then(isInstalled => {
                if (isInstalled) {
                    setAgentInstalled(true);
                    setShowPairingInput(true);
                } else {
                    setError('not-installed');
                }
            })
            .catch(() => {
                setError('not-installed');
            });
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            terminalService.disconnect();
        };
    }, []);

    // Get current suggestions
    const suggestions = getSuggestions();

    // If there's an error, show error component
    if (error) {
        return (
            <TerminalError
                error={error}
                onRetry={handleRetry}
                onInstall={handleInstallAgent}
            />
        );
    }

    return (
        <div className={cn(
            "relative transition-all duration-300 ease-in-out",
            fullscreen ? "fixed inset-0 z-50 bg-gray-900/80 p-4" : ""
        )}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-800",
                    fullscreen ? "h-full w-full max-w-6xl" : "h-[600px]"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Terminal Tabs */}
                    <TerminalTabs
                        tabs={tabs}
                        activeTab={activeTerminalTab}
                        setActiveTab={setActiveTerminalTab}
                        onAddTab={() => {
                            const id = Date.now().toString();
                            setTabs(prev => [...prev, { id, title: `Terminal ${tabs.length + 1}` }]);
                            setActiveTerminalTab(id);
                        }}
                        onCloseTab={(id) => {
                            if (tabs.length <= 1) return;

                            const newTabs = tabs.filter(tab => tab.id !== id);
                            setTabs(newTabs);

                            if (activeTerminalTab === id) {
                                setActiveTerminalTab(newTabs[0].id);
                            }
                        }}
                    />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        {/* Terminal Header */}
                        <TerminalHeader
                            aiEnabled={aiEnabled}
                            connected={connected}
                            fullscreen={fullscreen}
                            setFullscreen={setFullscreen}
                            onClear={clearTerminal}
                            onCopy={copyToClipboard}
                            onDownload={downloadTerminalHistory}
                        />

                        {/* Terminal Content */}
                        <div className="flex-1 flex flex-col min-h-0">
                            {tabs.map(tab => (
                                <div
                                    key={tab.id}
                                    className={cn(
                                        "h-full flex flex-col flex-1",
                                        activeTerminalTab === tab.id ? "block" : "hidden"
                                    )}
                                >
                                    <TabsContent value="terminal" className="flex-1 flex flex-col h-full">
                                        <TerminalContent
                                            history={history}
                                            isProcessing={isProcessing}
                                            showPairingInput={showPairingInput}
                                            pairingCode={pairingCode}
                                            setPairingCode={setPairingCode}
                                            onPairSubmit={handlePairSubmit}
                                            onFocusClick={focusInput}
                                        />

                                        <TerminalInput
                                            command={command}
                                            setCommand={setCommand}
                                            onSubmit={handleCommandSubmit}
                                            historyIndex={historyIndex}
                                            setHistoryIndex={setHistoryIndex}
                                            commandHistory={commandHistory}
                                            isProcessing={isProcessing}
                                            disabled={!connected || showPairingInput}
                                            aiEnabled={aiEnabled}
                                            onKeyDown={handleKeyDown}
                                            suggestions={suggestions}
                                        />

                                        <TerminalStatusBar
                                            connected={connected}
                                            lastCommand={commandHistory.length > 0 ? commandHistory[commandHistory.length - 1] : null}
                                        />
                                    </TabsContent>

                                    <TabsContent value="docs" className="flex-1 h-full bg-gray-900 absolute inset-0 top-[41px]">
                                        <TerminalDocs />
                                    </TabsContent>

                                    <TabsContent value="settings" className="flex-1 h-full bg-gray-900 absolute inset-0 top-[41px]">
                                        <TerminalSettings
                                            aiEnabled={aiEnabled}
                                            setAiEnabled={setAiEnabled}
                                            onDownloadAgent={handleInstallAgent}
                                        />
                                    </TabsContent>
                                </div>
                            ))}
                        </div>
                    </Tabs>
                </div>
            </motion.div>
        </div>
    );
}