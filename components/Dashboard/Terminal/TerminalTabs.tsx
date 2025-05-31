import React from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
    id: string;
    title: string;
}

interface TerminalTabsProps {
    tabs: Tab[];
    activeTab: string;
    setActiveTab: (id: string) => void;
    onAddTab: () => void;
    onCloseTab: (id: string) => void;
}

export default function TerminalTabs({
    tabs,
    activeTab,
    setActiveTab,
    onAddTab,
    onCloseTab
}: TerminalTabsProps) {
    return (
        <div className="flex bg-gray-800 border-b border-gray-700">
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    className={cn(
                        "flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer",
                        activeTab === tab.id
                            ? "bg-gray-900 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span className="mr-2">{tab.title}</span>
                    {tabs.length > 1 && (
                        <button
                            className="text-gray-500 hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(tab.id);
                            }}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ))}

            <button
                className="flex items-center justify-center h-9 w-9 text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={onAddTab}
            >
                <Plus className="h-5 w-5" />
            </button>
        </div>
    );
}