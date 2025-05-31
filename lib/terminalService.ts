import axios from 'axios';

// Base API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/eep';

// Types
export interface CommandOutput {
    id: string;
    type: 'command' | 'output' | 'error' | 'info' | 'ai-suggestion';
    content: string;
    timestamp: Date;
}

export interface HistoryItem {
    command: string;
    timestamp: Date;
}

// Mock socket event emitter interface
interface MockSocketEvents {
    [key: string]: Array<(...args: any[]) => void>;
}

// Mock socket to replace socket.io
class MockSocket {
    private events: MockSocketEvents = {};
    private connected: boolean = false;
    private mockEventHandlers: { [key: string]: (...args: any[]) => void } = {};

    constructor() {
        // Setup default mock behavior
        this.mockEventHandlers['terminal:output'] = (callback) => {
            setTimeout(() => {
                callback({
                    content: 'Mock terminal output',
                    timestamp: new Date()
                });
            }, 100);
        };

        this.mockEventHandlers['terminal:created'] = (callback) => {
            setTimeout(() => {
                callback({
                    sessionId: 'mock-session-' + Date.now(),
                    success: true
                });
            }, 50);
        };
    }

    // Simulate socket.io emit
    emit(event: string, data?: any): void {
        console.log(`[MockSocket] Emitting event: ${event}`, data);

        // Simulate responses based on emitted events
        if (event === 'create:terminal') {
            setTimeout(() => {
                this.fireEvent('terminal:created', {
                    sessionId: 'mock-session-' + Date.now(),
                    success: true
                });
            }, 100);
        }

        if (event === 'execute:command') {
            const command = data.command;
            setTimeout(() => {
                this.fireEvent('terminal:output', {
                    content: `Executed command: ${command}\nMock output for ${command}`,
                    timestamp: new Date()
                });
            }, 200);
        }
    }

    // Simulate socket.io on
    on(event: string, callback: (...args: any[]) => void): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);

        // If it's connect event and we're mocking as connected, fire immediately
        if (event === 'connect' && this.connected) {
            callback();
        }
    }

    // Simulate socket.io disconnect
    disconnect(): void {
        this.connected = false;
        this.fireEvent('disconnect', { reason: 'mock-disconnected' });
        console.log('[MockSocket] Disconnected');
    }

    // Simulate connection
    simulateConnect(): void {
        this.connected = true;
        this.fireEvent('connect');
        console.log('[MockSocket] Connected');
    }

    // Fire a specific event
    private fireEvent(event: string, ...args: any[]): void {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
    }
}

class TerminalService {
    private socket: MockSocket | null = null;
    private commandHistory: HistoryItem[] = [];

    // Verify terminal access with the backend
    async verifyAccess(): Promise<boolean> {
        try {
            // Mock a successful response
            console.log('[MockTerminalService] Verifying access');
            // Uncomment below for real API call, otherwise return mock success
            /*
            const response = await axios.get(`${API_URL}/terminal/verify`, {
                validateStatus: () => true // don't throw on 4xx/5xx
            });
            return response.status === 200 && response.data?.success;
            */
            return true;
        } catch (error) {
            console.error('Verification error:', error);
            return false;
        }
    }

    // Get the download URL for terminal agent
    getDownloadUrl(platform: string): string {
        return `${API_URL}/terminal/download/${platform}`;
    }

    downloadAgent(platform: string): void {
        try {
            console.log(`[MockTerminalService] Downloading agent for ${platform}`);
            // Show mock success alert instead of actual download
            alert(`Mock download initiated for ${platform}. In a real environment, the agent would download now.`);

            // Original implementation - keep commented for reference
            /*
            // Create a hidden form for POST request
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `${API_URL}/terminal/download/${platform}`;
            form.target = '_blank';

            document.body.appendChild(form);
            form.submit();

            // Clean up
            document.body.removeChild(form);
            */
        } catch (error) {
            console.error('Error downloading agent:', error);
            throw error;
        }
    }

    // Connect to local terminal agent (mocked)
    connectToLocalAgent(code: string, callbacks: {
        onConnect: () => void,
        onData: (data: any) => void,
        onError: (error: any) => void
    }): void {
        try {
            console.log(`[MockTerminalService] Connecting with code: ${code}`);

            // Mock pairing process
            setTimeout(() => {
                if (code === '000000') {
                    callbacks.onError('Invalid pairing code');
                    return;
                }

                // Create mock socket
                this.socket = new MockSocket();

                // Setup event handlers
                this.socket.on('connect', () => {
                    console.log('[MockTerminalService] Connected to mock agent');
                    callbacks.onConnect();

                    // Create a terminal session
                    this.socket?.emit('create:terminal');
                });

                this.socket.on('terminal:created', (data) => {
                    console.log('[MockTerminalService] Terminal session created:', data);
                });

                this.socket.on('terminal:output', (data) => {
                    callbacks.onData(data);
                });

                this.socket.on('disconnect', () => {
                    callbacks.onError('Connection lost');
                });

                this.socket.on('connect_error', (error) => {
                    callbacks.onError(`Connection error: ${error.message}`);
                });

                // Simulate connection after a delay
                setTimeout(() => {
                    this.socket?.simulateConnect();
                }, 300);

            }, 500);
        } catch (error) {
            callbacks.onError('Failed to connect to local agent');
        }
    }

    // Execute command on local agent (mocked)
    executeCommand(command: string): void {
        if (!this.socket) {
            throw new Error('Not connected to local agent');
        }

        // Add to history
        this.commandHistory.push({
            command,
            timestamp: new Date()
        });

        this.socket.emit('execute:command', { command });
    }

    // Check if agent is installed and running (mocked)
    async checkAgentStatus(): Promise<boolean> {
        console.log('[MockTerminalService] Checking agent status');
        // Always return true for mock
        return true;

        // Original implementation - keep commented for reference
        /*
        try {
            const response = await fetch('http://localhost:8000/status', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) return false;

            const data = await response.json();
            return data.status === 'running';
        } catch (error) {
            console.error('Agent status check failed:', error);
            return false;
        }
        */
    }

    // Disconnect from local agent (mocked)
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('[MockTerminalService] Disconnected from mock agent');
        }
    }

    // Get command history
    getCommandHistory(): HistoryItem[] {
        return [...this.commandHistory];
    }

    // Generate AI suggestions based on command and output
    getAISuggestion(command: string, output: string): CommandOutput | null {
        if (command === 'git status' && output.includes('Changes not staged for commit')) {
            return {
                id: Date.now().toString(),
                type: 'ai-suggestion',
                content: `
I notice you have unstaged changes. You might want to:

\`\`\`
git add .                    # Stage all changes
git commit -m "Your message" # Commit with a descriptive message
\`\`\`

Or for specific files:

\`\`\`
git add app/page.tsx         # Stage specific file
\`\`\`
                `,
                timestamp: new Date()
            };
        } else if (command.startsWith('npm install') && !command.includes('-D') && !command.includes('--save-dev')) {
            return {
                id: Date.now().toString(),
                type: 'ai-suggestion',
                content: `
Tip: For development dependencies, use:

\`\`\`
npm install <package> --save-dev  # or -D for short
\`\`\`

For example:
\`\`\`
npm install typescript @types/react --save-dev
\`\`\`
                `,
                timestamp: new Date()
            };
        } else if (command === 'ls' || command.startsWith('ls ')) {
            return {
                id: Date.now().toString(),
                type: 'ai-suggestion',
                content: `
For more detailed information with permissions and file sizes:

\`\`\`
ls -la
\`\`\`

Or to filter results:

\`\`\`
ls -la | grep ".tsx"  # Show only TypeScript files
\`\`\`
                `,
                timestamp: new Date()
            };
        }

        return null;
    }
}

// Export a singleton instance
export const terminalService = new TerminalService();
export default terminalService;