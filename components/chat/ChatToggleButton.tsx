import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatToggleButtonProps {
    onClick: () => void;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
    return (
        <div className="fixed bottom-6 right-6" style={{ zIndex: 1000 }}>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={onClick}
                    className="relative rounded-full w-14 h-14 p-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/20 group overflow-hidden"
                >
                    {/* Particle effects */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                                initial={{
                                    x: '50%',
                                    y: '50%',
                                    scale: 0
                                }}
                                animate={{
                                    x: `${50 + (Math.random() * 60 - 30)}%`,
                                    y: `${50 + (Math.random() * 60 - 30)}%`,
                                    scale: [0, 1, 0],
                                    opacity: [0, 0.7, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    delay: i * 0.4,
                                }}
                            />
                        ))}
                    </div>

                    {/* Pulse effect */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-white opacity-20"
                        initial={{ scale: 0.8 }}
                        animate={{
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Icon */}
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -5, 5, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            repeatDelay: 5,
                            duration: 1.2,
                            ease: "easeInOut"
                        }}
                        className="relative z-10"
                    >
                        <MessageSquare className="h-6 w-6 text-white" />
                    </motion.div>
                </Button>
            </motion.div>
        </div>
    );
};

export default ChatToggleButton;