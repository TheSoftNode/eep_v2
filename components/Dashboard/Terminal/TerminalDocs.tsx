import React, { useRef } from 'react';

export default function TerminalDocs() {
    const docsRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={docsRef}
            className="h-full overflow-y-auto p-6"
        >
            <div className="max-w-3xl mx-auto text-gray-300">
                <h2 className="text-xl font-semibold text-white mb-4">Terminal Documentation</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">Getting Started</h3>
                    <p className="mb-2">This terminal provides a command-line interface that connects to your local machine with AI-powered assistance.</p>
                    <p>Type <code className="bg-gray-800 px-1.5 py-0.5 rounded">help</code> to see available commands.</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">How It Works</h3>
                    <p className="mb-4">The terminal connects to a local agent running on your machine. This agent executes commands in your local environment and sends the results back to the web interface.</p>

                    <h4 className="font-medium text-indigo-300 mt-3 mb-1">Security</h4>
                    <p className="text-sm">All commands run exclusively on your local machine. No command data is sent to our servers. The pairing system ensures only your browser can connect to your local agent.</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">Common Commands</h3>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-medium text-indigo-300">help</h4>
                            <p className="text-sm">Displays the help menu with available commands</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-indigo-300">clear</h4>
                            <p className="text-sm">Clears the terminal screen</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-indigo-300">ls</h4>
                            <p className="text-sm">Lists files and directories</p>
                            <p className="text-xs text-gray-400 mt-1">Example: <code className="bg-gray-800 px-1.5 py-0.5 rounded">ls -la</code></p>
                        </div>
                        <div>
                            <h4 className="font-medium text-indigo-300">cd</h4>
                            <p className="text-sm">Changes the current directory</p>
                            <p className="text-xs text-gray-400 mt-1">Example: <code className="bg-gray-800 px-1.5 py-0.5 rounded">cd project/src</code></p>
                        </div>
                        <div>
                            <h4 className="font-medium text-indigo-300">git</h4>
                            <p className="text-sm">Git version control commands</p>
                            <p className="text-xs text-gray-400 mt-1">Example: <code className="bg-gray-800 px-1.5 py-0.5 rounded">git status</code></p>
                        </div>
                        <div>
                            <h4 className="font-medium text-indigo-300">npm</h4>
                            <p className="text-sm">Node.js package manager commands</p>
                            <p className="text-xs text-gray-400 mt-1">Example: <code className="bg-gray-800 px-1.5 py-0.5 rounded">npm install react</code></p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">AI Assistant</h3>
                    <p className="mb-2">The terminal includes an AI assistant that provides suggestions based on your commands.</p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-medium text-indigo-300">ai on</h4>
                            <p className="text-sm">Enables the AI assistant</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-indigo-300">ai off</h4>
                            <p className="text-sm">Disables the AI assistant</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-white mb-2">Keyboard Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                            <div className="bg-gray-800 px-2 py-0.5 rounded text-xs">↑</div>
                            <span className="ml-2 text-sm">Previous command</span>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-gray-800 px-2 py-0.5 rounded text-xs">↓</div>
                            <span className="ml-2 text-sm">Next command</span>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-gray-800 px-2 py-0.5 rounded text-xs">Tab</div>
                            <span className="ml-2 text-sm">Command completion</span>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-gray-800 px-2 py-0.5 rounded text-xs">Ctrl+C</div>
                            <span className="ml-2 text-sm">Cancel command</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}