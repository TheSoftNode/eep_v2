import React, { useRef, useEffect } from 'react';
import { Send, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HistoryItem } from './terminalTypes';

interface TerminalInputProps {
    command: string;
    setCommand: (command: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    historyIndex: number;
    setHistoryIndex: (index: number) => void;
    commandHistory: HistoryItem[];
    isProcessing: boolean;
    disabled: boolean;
    aiEnabled: boolean;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    suggestions: string[];
}

export default function TerminalInput({
    command,
    setCommand,
    onSubmit,
    historyIndex,
    setHistoryIndex,
    commandHistory,
    isProcessing,
    disabled,
    aiEnabled,
    onKeyDown,
    suggestions
}: TerminalInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input on component mount
    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [disabled]);

    return (
        <div className="p-2 bg-gray-800 relative">
            <form onSubmit={onSubmit} className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <Input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="flex-1 bg-transparent border-none text-gray-200 placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
                    placeholder={disabled ? "Terminal not connected..." : "Type your command here..."}
                    disabled={isProcessing || disabled}
                    autoComplete="off"
                    spellCheck="false"
                />
                <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    disabled={isProcessing || disabled}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>

            {/* Command suggestions */}
            {suggestions.length > 0 && aiEnabled && !disabled && (
                <div className="absolute bottom-14 left-0 right-0 p-2 bg-gray-800 border-t border-gray-700 rounded-t-md">
                    <div className="flex items-center text-xs text-gray-400 mb-1">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        <span>Suggestions:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                            <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 text-xs py-0 h-7"
                                onClick={() => setCommand(suggestion)}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}