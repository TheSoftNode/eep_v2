import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const RefinedButton = ({
    href,
    text,
    variant = "primary",
    icon
}: {
    href: string;
    text: string;
    variant?: "primary" | "secondary";
    icon?: React.ReactNode
}) => {
    const bgClasses = variant === "primary"
        ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:via-indigo-600 hover:to-violet-700"
        : "bg-slate-800/80 hover:bg-slate-700/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/50";

    const iconBgClasses = variant === "primary"
        ? "bg-white text-indigo-700"
        : "bg-indigo-500 text-white";

    return (
        <Link href={href} className="block">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <button className={`relative group flex items-center ${bgClasses} rounded-full pl-4 pr-1.5 py-1.5 text-white font-medium shadow-md`}>
                    <span className="text-xs md:text-sm mr-2">{text}</span>

                    {/* Circle with icon */}
                    <div className={`flex items-center justify-center ${iconBgClasses} rounded-full h-6 w-6`}>
                        <motion.div className="group-hover:translate-x-0.5 transition-transform duration-200">
                            {icon || <ArrowRight className="h-3.5 w-3.5" />}
                        </motion.div>
                    </div>

                    {/* Subtle effects combined */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-pink-500/10 to-purple-900/20 opacity-40 group-hover:opacity-60 rounded-full pointer-events-none transition-opacity duration-200"></div>
                </button>
            </motion.div>
        </Link>
    );
};

export default RefinedButton;