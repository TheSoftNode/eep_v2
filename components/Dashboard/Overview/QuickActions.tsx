"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Users, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ViewMode } from '@/types/chat';
import ChatPanel from '@/components/chat/ChatPanel';

interface ActionItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    isLink: boolean;
    onClick?: () => void;
}

interface ChatPanelWithStateProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

export default function QuickActions({ className }: { className?: string }) {
    // State to control chat panel visibility
    const [chatViewMode, setChatViewMode] = useState<ViewMode>('closed');

    // Actions configuration
    const actions: ActionItem[] = [
        {
            name: "Terminal",
            href: "/Learner/dashboard/terminal",
            icon: <Terminal className="h-4 w-4 mb-0.5" />,
            isLink: true
        },

        {
            name: "Team Chat",
            href: "/Learner/dashboard/messages",
            icon: <Users className="h-4 w-4 mb-0.5" />,
            isLink: true
        },
        {
            name: "AI Assistant",
            href: "#",
            icon: <Brain className="h-4 w-4 mb-0.5" />,
            isLink: false,
            onClick: () => setChatViewMode('normal')
        }
    ];

    return (
        <>
            <Card className={`h-full flex flex-col ${className}`}>
                <CardHeader className="pb-1">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-1.5 flex-1 py-2">
                    {actions.map((action) => (
                        action.isLink ? (
                            <Button
                                key={action.name}
                                asChild
                                className="h-full py-2 justify-start flex-col"
                                variant="outline"
                            >
                                <Link href={action.href} className="flex flex-col items-center h-full justify-center">
                                    {action.icon}
                                    <span className="text-xs">{action.name}</span>
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                key={action.name}
                                className="h-full py-2 justify-start flex-col"
                                variant="outline"
                                onClick={action.onClick}
                            >
                                <div className="flex flex-col items-center h-full justify-center">
                                    {action.icon}
                                    <span className="text-xs">{action.name}</span>
                                </div>
                            </Button>
                        )
                    ))}
                </CardContent>
            </Card>

            {/* Include the ChatPanel component with the view mode state */}
            <ChatPanelWithState viewMode={chatViewMode} setViewMode={setChatViewMode} />
        </>
    );
}

// Wrapper component to pass state to ChatPanel
const ChatPanelWithState: React.FC<ChatPanelWithStateProps> = ({ viewMode, setViewMode }) => {
    // If chat is closed, no need to render the panel
    if (viewMode === 'closed') {
        return null;
    }

    // Pass the viewMode and setViewMode to the ChatPanel component
    return <ChatPanel initialViewMode={viewMode} onViewModeChange={setViewMode} />;
};