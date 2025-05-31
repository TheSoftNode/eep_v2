import React from 'react';
import { GraduationCap, Building, CheckIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactCategoryCards: React.FC = () => {
    // List items for each category
    const learnerItems = [
        "Application process and deadlines",
        "Program curriculum and offerings",
        "Payment options and financial assistance",
        "Career placement opportunities"
    ];

    const businessItems = [
        "AI project development and implementation",
        "Technical advisory and solution architecture",
        "Project assessment and optimization",
        "Team mentoring and skill development"
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.3
            }
        })
    };

    return (
        <motion.div
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={cardVariants}
                whileHover={{
                    y: -4,
                    transition: { duration: 0.2 }
                }}
                className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl p-6 border border-indigo-100/40 dark:border-indigo-700/30 shadow-sm dark:shadow-indigo-900/20 group"
            >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 text-white mb-4 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-700/30">
                    <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">For Learners</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Questions about our learning programs</p>

                <ul className="space-y-2 mb-4">
                    {learnerItems.map((item, i) => (
                        <motion.li
                            key={i}
                            variants={itemVariants}
                            custom={i}
                            className="flex items-start text-sm text-slate-600 dark:text-slate-300"
                        >
                            <span className="mr-2 mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-800/60 flex items-center justify-center">
                                <CheckIcon className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                            </span>
                            {item}
                        </motion.li>
                    ))}
                </ul>

                <a href="/learning-support" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group">
                    <span>View Learning Programs</span>
                    <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </a>
            </motion.div>

            <motion.div
                variants={cardVariants}
                whileHover={{
                    y: -4,
                    transition: { duration: 0.2 }
                }}
                className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl p-6 border border-indigo-100/40 dark:border-indigo-700/30 shadow-sm dark:shadow-indigo-900/20 group"
            >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 text-white mb-4 shadow-lg shadow-purple-500/20 dark:shadow-purple-700/30">
                    <Building className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Business Partnership</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Expert project guidance and support</p>

                <ul className="space-y-2 mb-4">
                    {businessItems.map((item, i) => (
                        <motion.li
                            key={i}
                            variants={itemVariants}
                            custom={i}
                            className="flex items-start text-sm text-slate-600 dark:text-slate-300"
                        >
                            <span className="mr-2 mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-800/60 flex items-center justify-center">
                                <CheckIcon className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            </span>
                            {item}
                        </motion.li>
                    ))}
                </ul>

                <a href="/business-solutions" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group">
                    <span>Explore Business Solutions</span>
                    <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </a>
            </motion.div>
        </motion.div>
    );
};

export default ContactCategoryCards;