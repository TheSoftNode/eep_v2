"use client"

import React, { useEffect, useState } from 'react';
import { Circle, RefreshCcw } from 'lucide-react';

interface AdvancedLoaderProps {
    text?: string;
    showText?: boolean;
    color?: string;
}

const AdvancedLoader: React.FC<AdvancedLoaderProps> = ({
    text = "Loading...",
    showText = true,
    color = "indigo"
}) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Simulated progress animation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    return 0;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Size classes for default size
    const classes = {
        container: "w-24 h-24",
        outerRing: "w-24 h-24",
        middleRing: "w-16 h-16",
        innerRing: "w-10 h-10",
        icon: "h-6 w-6",
        text: "text-sm mt-3"
    };

    // Pulse effect for the component entrance
    useEffect(() => {
        const pulseTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => setIsVisible(true), 100);
        }, 300);

        return () => clearTimeout(pulseTimer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <div className={`relative ${classes.container} ${isVisible ? 'opacity-100' : 'opacity-70'} transition-opacity duration-200`}>
                {/* Outer spinning ring */}
                <div className={`absolute ${classes.outerRing} rounded-full border-4 border-${color}-100 border-t-${color}-600 animate-spin`} style={{ animationDuration: '3s' }}></div>

                {/* Middle counter-spinning ring with gradient */}
                <div className={`absolute ${classes.middleRing} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-${color}-200`} style={{
                    borderRightColor: `var(--${color}-500)`,
                    borderBottomColor: `var(--${color}-400)`,
                    animation: 'spin 2.5s linear infinite reverse'
                }}></div>

                {/* Inner pulsing ring */}
                <div className={`absolute ${classes.innerRing} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-${color}-50 border border-${color}-200 animate-pulse flex items-center justify-center`} style={{ animationDuration: '1.5s' }}>
                    {/* Center icon with custom animation */}
                    <div className="relative flex items-center justify-center">
                        <Circle className={`${classes.icon} text-${color}-200 absolute animate-ping`} style={{ animationDuration: '1.5s' }} />
                        <RefreshCcw className={`${classes.icon} text-${color}-600 animate-spin`} style={{ animationDuration: '4s' }} />
                    </div>
                </div>

                {/* Floating particles around the loader */}
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1.5 h-1.5 rounded-full bg-${color}-400 animate-pulse opacity-70`}
                            style={{
                                top: `${15 + Math.random() * 70}%`,
                                left: `${15 + Math.random() * 70}%`,
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: '1s'
                            }}
                        />
                    ))}
                </div>

                {/* Progress circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="48%"
                        stroke={`var(--${color}-100)`}
                        strokeWidth="1"
                        fill="none"
                        className="opacity-30"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r="48%"
                        stroke={`var(--${color}-500)`}
                        strokeWidth="1"
                        strokeDasharray="300"
                        strokeDashoffset={300 - (progress * 3)}
                        fill="none"
                        className="transition-all duration-300 ease-out"
                    />
                </svg>
            </div>

            {/* Loading text with shimmer effect */}
            {showText && (
                <div className={`${classes.text} font-medium text-${color}-700 relative overflow-hidden`}>
                    <span className="relative z-10">{text}</span>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"
                        style={{
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s infinite',
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Define custom animation for the shimmer effect
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Create style tag for custom animations
export const StyleTag: React.FC = () => (
    <style dangerouslySetInnerHTML={{ __html: shimmerKeyframes }} />
);

export default AdvancedLoader;