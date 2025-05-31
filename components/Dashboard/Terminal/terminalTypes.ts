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

export interface CommandResult {
    output?: string;
    type?: 'output' | 'error' | 'info';
    aiSuggestion?: string;
    clearTerminal?: boolean;
    toggleAI?: boolean;
}

export interface CommandProcessor {
    (command: string, aiEnabled: boolean): Promise<CommandResult>;
}