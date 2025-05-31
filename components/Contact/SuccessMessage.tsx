import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessMessageProps {
    onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ onReset }) => {
    return (
        <motion.div
            className="bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-8 sm:p-10 border border-indigo-50 dark:border-slate-700/50 shadow-xl dark:shadow-slate-900/20 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Subtle background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                {/* Animated success glow */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10 opacity-0 animate-pulse-slow"></div>

                {/* Light beam effect - only visible in dark mode */}
                <div className="hidden dark:block absolute inset-0 overflow-hidden opacity-10">
                    <div className="success-beam"></div>
                </div>
            </div>

            <div className="relative z-10">
                {/* Success icon with animation */}
                <motion.div
                    className="w-16 h-16 mx-auto mb-5 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                    }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.3
                        }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
                    >
                        <CheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                </motion.div>

                {/* Success message with staggered animations */}
                <motion.h2
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    Message Sent Successfully!
                </motion.h2>

                <motion.p
                    className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Thank you for contacting us. Our team will review your message and get back to you shortly.
                </motion.p>

                {/* Back button with hover animation */}
                <motion.button
                    onClick={onReset}
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Contact Form
                </motion.button>
            </div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                
                .success-beam {
                    position: absolute;
                    top: 50%;
                    left: -50%;
                    width: 200%;
                    height: 100px;
                    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.07), transparent);
                    transform: rotate(-45deg) translateY(-50%);
                    animation: beam-move-success 5s linear infinite;
                }
                
                @keyframes beam-move-success {
                    0% { transform: rotate(-45deg) translateY(-50%) translateX(-100%); }
                    100% { transform: rotate(-45deg) translateY(-50%) translateX(100%); }
                }
            `}</style>
        </motion.div>
    );
};

export default SuccessMessage;