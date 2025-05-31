import React, { useState } from 'react';
import { MessageSquare, X, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/chat';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatHeaderProps {
    viewMode: ViewMode;
    onMinimize: () => void;
    onMaximize: () => void;
    onNormal: () => void;
    onFullscreen: () => void;
    onClose: () => void;
    onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    viewMode,
    onMinimize,
    onNormal,
    onFullscreen,
    onClose,
    onClearChat
}) => {
    const [showClearModal, setShowClearModal] = useState(false);

    return (
        <>
            <div className="px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white flex justify-between items-center relative">
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white opacity-10 backdrop-blur-md"></div>

                {/* Advanced glow effects */}
                <div className="absolute -top-40 -left-20 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-30 -right-10 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>

                <h3 className="font-semibold flex items-center z-10">
                    <div className="mr-2 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <span>EEP Assistant</span>
                    {/* <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">Beta</span> */}
                </h3>

                {/* Window Controls */}
                <div className="flex items-center gap-1 z-10">
                    {/* Clear Chat Button (Trash icon) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowClearModal(true)}
                        className="hover:bg-white/20 text-white h-7 w-7 rounded-full"
                        title="Clear chat"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>

                    {viewMode !== 'minimized' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMinimize}
                            className="hover:bg-white/20 text-white h-7 w-7 rounded-full"
                            title="Minimize"
                        >
                            <Minimize2 className="h-3.5 w-3.5" />
                        </Button>
                    )}

                    {viewMode === 'minimized' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onNormal}
                            className="hover:bg-white/20 text-white h-7 w-7 rounded-full"
                            title="Restore"
                        >
                            <Maximize2 className="h-3.5 w-3.5" />
                        </Button>
                    )}

                    {viewMode === 'normal' && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onFullscreen}
                                className="hover:bg-white/20 text-white h-7 w-7 rounded-full"
                                title="Fullscreen"
                            >
                                <AiOutlineFullscreen className="h-3.5 w-3.5" />
                            </Button>
                        </>
                    )}

                    {(viewMode === 'maximized' || viewMode === 'fullscreen') && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onNormal}
                            className="hover:bg-white/20 text-white h-7 w-7 rounded-full"
                            title="Exit Fullscreen"
                        >
                            <AiOutlineFullscreenExit className="h-3.5 w-3.5" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="hover:bg-white/20 text-white h-7 w-7 rounded-full"
                        title="Close"
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Custom Clear Chat Modal */}
            <AnimatePresence>
                {showClearModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="bg-white rounded-xl shadow-xl max-w-md w-[90%] overflow-hidden"
                        >
                            {/* Modal Header with gradient similar to chat header */}
                            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-6 py-4 text-white relative">
                                <div className="absolute inset-0 bg-white opacity-10"></div>
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="p-2 bg-white/20 rounded-full">
                                        <Trash2 className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Clear Chat History</h3>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to clear all chat messages? This action cannot be undone.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowClearModal(false)}
                                        className="border-gray-300 text-gray-700"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            onClearChat();
                                            setShowClearModal(false);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Clear All</span>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatHeader;