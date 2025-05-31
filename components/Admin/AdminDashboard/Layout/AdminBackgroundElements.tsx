"use client";

import React, { FC } from 'react';

interface AdminBackgroundElementsProps {
    animationProgress: number;
}

// Animated background elements for admin dashboard
export const AdminBackgroundElements: FC<AdminBackgroundElementsProps> = ({ animationProgress }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Translucent gradient blobs */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>

            {/* Dynamic shape elements */}
            <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="adminLineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.05)" />
                            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.08)" />
                            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.05)" />
                        </linearGradient>
                        <linearGradient id="adminLineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.05)" />
                            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.08)" />
                            <stop offset="100%" stopColor="rgba(79, 70, 229, 0.05)" />
                        </linearGradient>
                    </defs>

                    {/* Subtle grid pattern */}
                    <pattern id="adminGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#adminGrid)" />

                    {/* Flowing lines */}
                    <path
                        d="M0,200 C150,150 350,250 600,200 C850,150 1050,250 1440,200"
                        fill="none"
                        stroke="url(#adminLineGradient1)"
                        strokeWidth="1.5"
                        opacity="0.4"
                        style={{
                            transform: `translateY(${Math.sin(animationProgress / 100 * Math.PI) * 20}px)`,
                        }}
                    />
                    <path
                        d="M0,400 C250,350 450,450 700,400 C950,350 1150,450 1440,400"
                        fill="none"
                        stroke="url(#adminLineGradient2)"
                        strokeWidth="1.5"
                        opacity="0.4"
                        style={{
                            transform: `translateY(${Math.cos(animationProgress / 100 * Math.PI) * 20}px)`,
                        }}
                    />

                    {/* Pulsing nodes */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const x = 100 + (i % 4) * 350;
                        const y = 200 + Math.floor(i / 4) * 200;
                        const size = 2 + (i % 3);
                        const delay = i * 0.8;
                        const animDuration = 3 + (i % 2);

                        return (
                            <circle
                                key={`node-${i}`}
                                cx={x}
                                cy={y}
                                r={size}
                                fill={i % 3 === 0 ? "rgba(99, 102, 241, 0.7)" : i % 3 === 1 ? "rgba(139, 92, 246, 0.7)" : "rgba(59, 130, 246, 0.7)"}
                                opacity={0.4 + Math.sin((animationProgress + delay * 10) / 100 * Math.PI) * 0.3}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default AdminBackgroundElements;