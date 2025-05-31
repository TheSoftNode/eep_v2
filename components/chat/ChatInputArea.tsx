import React, { RefObject } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';

interface ChatInputAreaProps {
    input: string;
    editingMessageId: string | null;
    isLoading: boolean;
    inputRef: RefObject<HTMLTextAreaElement>;
    onChange: (value: string) => void;
    onSend: () => void;
    onCancelEdit: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
    input,
    editingMessageId,
    isLoading,
    inputRef,
    onChange,
    onSend,
    onCancelEdit,
    onKeyDown
}) => {
    // Function to auto-resize textarea based on content
    const handleAutoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        // Reset height to auto to get the correct scrollHeight
        target.style.height = 'auto';
        // Set new height based on scrollHeight (with a max height)
        target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
        onChange(target.value);
    };

    return (
        <div className="px-4 py-3 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
            <div className="relative group">
                {editingMessageId && (
                    <div className="mb-2 px-3 py-2 bg-indigo-50 rounded-lg flex items-center">
                        <span className="text-xs text-indigo-600 mr-2">Editing message</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 p-1 h-6"
                            onClick={onCancelEdit}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleAutoResize}
                    onKeyDown={onKeyDown}
                    placeholder="Ask about the EEP program..."
                    className="w-full px-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 placeholder-gray-400 transition-all resize-none overflow-hidden min-h-[50px] max-h-[150px]"
                    rows={1}
                    style={{ height: 'auto' }}
                />
                <Button
                    onClick={onSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg p-2 transition-all"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>

            {/* Input features hint */}
            <div className="mt-2 px-1 flex justify-between">
                <p className="text-xs text-gray-400">Press Enter to send</p>
                <p className="text-xs text-gray-400">
                    <span className="inline-flex items-center">
                        <span className="bg-gray-100 text-gray-500 rounded px-1 py-0.5 text-[10px] mr-1">Shift+Enter</span>
                        for new line
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ChatInputArea;