import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const ChatLoadingIndicator: React.FC = () => {
    return (
        <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
        >
            <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-md flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-indigo-500 animate-spin" />
                <span className="text-sm text-gray-600">Processing your request...</span>
            </div>
        </motion.div>
    );
};

export default ChatLoadingIndicator;