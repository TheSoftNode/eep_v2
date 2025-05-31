"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
    variant?: 'light' | 'dark';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
    href?: string;
    showBeta?: boolean;
    animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
    variant = 'dark',
    size = 'md',
    showText = true,
    className = '',
    href = '/',
    showBeta = false,
    animate = true
}) => {
    // Increased size dimensions for more visibility
    const dimensions = {
        xs: { height: 32, width: 44, fontSize: 'text-sm', letterSpacing: 'tracking-tight', padding: 'pl-3' },
        sm: { height: 48, width: 50, fontSize: 'text-lg', letterSpacing: 'tracking-tight', padding: 'pl-3' },
        md: { height: 48, width: 54, fontSize: 'text-xl', letterSpacing: 'tracking-tight', padding: 'pl-3' },
        lg: { height: 64, width: 70, fontSize: 'text-2xl', letterSpacing: 'tracking-tight', padding: 'pl-4' }
    };

    const { height, width, fontSize, letterSpacing, padding } = dimensions[size];

    // Determine color scheme based on variant
    const colors = {
        dark: {
            text: 'text-indigo-600 dark:text-indigo-500',
            badge: 'bg-indigo-100 border-indigo-200 text-indigo-600'
        },
        light: {
            text: 'text-indigo-600',
            badge: 'bg-white/20 border-white/30 text-white'
        }
    };

    const { text, badge } = colors[variant];

    // Use a filter for light variant to make the logo visible against dark backgrounds
    const imageFilter = variant === 'light' ? 'brightness-0 invert' : '';

    // Logo content with transparent image
    const logoContent = (
        <div className="flex items-center">
            <div className="relative">
                <Image
                    src="/logo/eep-logo2.png"
                    alt="EEP Logo"
                    width={width}
                    height={height}
                    className={`object-contain ${imageFilter}`}
                    priority
                />
            </div>

            {showText && (
                <span className={`${text} font-bold ${fontSize} ${letterSpacing} ${padding}`}>
                    EEP
                    {showBeta && (
                        <span className={`ml-1 text-xs font-medium px-1.5 py-0.5 ${badge} rounded-md border`}>
                            BETA
                        </span>
                    )}
                </span>
            )}
        </div>
    );

    if (animate) {
        return (
            <Link href={href} className={`flex-shrink-0 flex items-center group ${className}`}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    {logoContent}
                </motion.div>
            </Link>
        );
    }

    return (
        <Link href={href} className={`flex-shrink-0 flex items-center ${className}`}>
            {logoContent}
        </Link>
    );
};

export default Logo;