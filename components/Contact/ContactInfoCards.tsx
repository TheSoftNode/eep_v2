import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactInfoItem {
    icon: React.ReactNode | string;
    title: string;
    content: string;
    gradient?: string;
}

interface ContactInfoCardsProps {
    contactInfo: ContactInfoItem[];
}

export const ContactInfoCards: React.FC<ContactInfoCardsProps> = ({ contactInfo }) => {
    // Get the appropriate icon component
    const getIcon = (icon: React.ReactNode | string) => {
        if (typeof icon === 'string') {
            switch (icon) {
                case 'Phone':
                    return <Phone className="w-4 h-4" />;
                case 'MapPin':
                    return <MapPin className="w-4 h-4" />;
                default:
                    return <Mail className="w-4 h-4" />;
            }
        }
        return icon;
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
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

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {contactInfo.map((item, index) => (
                <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                        y: -4,
                        transition: { duration: 0.2 }
                    }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg dark:shadow-slate-900/20 border border-indigo-50 dark:border-slate-700/50 transition-all duration-300 flex group"
                >
                    <div className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br ${item.gradient || 'from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500'} text-white mr-4 shadow-md shadow-indigo-500/20 dark:shadow-indigo-700/30`}>
                        {getIcon(item.icon)}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">{item.content}</p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ContactInfoCards;

