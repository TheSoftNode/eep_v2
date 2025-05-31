import React from 'react';
import { motion } from 'framer-motion';

const typingIndicatorVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
};

const ChatTypingIndicator: React.FC = () => {
    return (
        <motion.div
            className="flex justify-start"
            variants={typingIndicatorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-0" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150" style={{ animationDelay: '0.15s' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" style={{ animationDelay: '0.3s' }} />
                </div>
            </div>
        </motion.div>
    );
};

export default ChatTypingIndicator;