"use client";

import React from "react";

const EEPBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Abstract AI/Code/Collaboration patterns */}
            <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        {/* Refined gradients with more subtle, mature color palette */}
                        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.2" />
                        </linearGradient>

                        <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.07" />
                        </linearGradient>

                        {/* Dark mode depth gradient */}
                        <linearGradient id="depthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0A0F2C" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#0A0E1F" stopOpacity="0.9" />
                        </linearGradient>

                        {/* Light mode depth gradient */}
                        <linearGradient id="lightDepthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.95" />
                        </linearGradient>

                        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                        </linearGradient>

                        {/* Subtle glow for important nodes */}
                        <filter id="sophisticatedGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Base layer - refined depth - responsive to theme */}
                    <rect className="dark:opacity-100 opacity-0" x="0" y="0" width="100%" height="100%" fill="url(#depthGradient)" />
                    <rect className="dark:opacity-0 opacity-100" x="0" y="0" width="100%" height="100%" fill="url(#lightDepthGradient)" />

                    {/* AI Neural Network Structure */}
                    <g className="dark:opacity-30 opacity-5" transform="translate(250, 400)">
                        {/* Neural Network Layers */}
                        <line x1="-200" y1="-150" x2="-200" y2="150" stroke="#4F46E5" strokeWidth="0.3" />
                        <line x1="-100" y1="-180" x2="-100" y2="180" stroke="#4F46E5" strokeWidth="0.3" />
                        <line x1="0" y1="-200" x2="0" y2="200" stroke="#4F46E5" strokeWidth="0.3" />
                        <line x1="100" y1="-180" x2="100" y2="180" stroke="#4F46E5" strokeWidth="0.3" />
                        <line x1="200" y1="-150" x2="200" y2="150" stroke="#4F46E5" strokeWidth="0.3" />

                        {/* Neurons in each layer */}
                        <circle cx="-200" cy="-100" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="-200" cy="0" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="-200" cy="100" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />

                        <circle cx="-100" cy="-120" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="-100" cy="-40" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="-100" cy="40" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="-100" cy="120" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />

                        <circle cx="0" cy="-150" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="0" cy="-75" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="0" cy="0" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="0" cy="75" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="0" cy="150" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />

                        <circle cx="100" cy="-120" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="100" cy="-40" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="100" cy="40" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="100" cy="120" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />

                        <circle cx="200" cy="-100" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="200" cy="0" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />
                        <circle cx="200" cy="100" r="5" fill="none" stroke="#4F46E5" strokeWidth="0.4" />

                        {/* Connections between layers */}
                        <path d="M-195,-100 C-170,-120 -130,-120 -105,-120" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-195,-100 C-170,-90 -130,-50 -105,-40" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-195,-100 C-170,-60 -130,-30 -105,40" stroke="#4F46E5" strokeWidth="0.2" />

                        <path d="M-195,0 C-170,-10 -130,-30 -105,-40" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-195,0 C-170,20 -130,30 -105,40" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-195,0 C-170,40 -130,80 -105,120" stroke="#4F46E5" strokeWidth="0.2" />

                        <path d="M-195,100 C-170,80 -130,60 -105,40" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-195,100 C-170,100 -130,110 -105,120" stroke="#4F46E5" strokeWidth="0.2" />

                        {/* Continue with similar connections for remaining layers */}
                        <path d="M-95,-120 C-70,-130 -30,-140 -5,-150" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-95,-120 C-70,-100 -30,-90 -5,-75" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-95,-40 C-70,-50 -30,-60 -5,-75" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-95,-40 C-70,-20 -30,-10 -5,0" stroke="#4F46E5" strokeWidth="0.2" />

                        <path d="M-95,40 C-70,30 -30,10 -5,0" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-95,40 C-70,50 -30,60 -5,75" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-95,120 C-70,100 -30,90 -5,75" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M-95,120 C-70,130 -30,140 -5,150" stroke="#4F46E5" strokeWidth="0.2" />

                        {/* Connections from middle to right layers follow similar pattern */}
                        <path d="M5,-150 C30,-140 70,-130 95,-120" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M5,-75 C30,-90 70,-100 95,-120" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M5,-75 C30,-60 70,-50 95,-40" stroke="#4F46E5" strokeWidth="0.2" />

                        <path d="M5,0 C30,-10 70,-20 95,-40" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M5,0 C30,10 70,20 95,40" stroke="#4F46E5" strokeWidth="0.2" />

                        <path d="M5,75 C30,60 70,50 95,40" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M5,75 C30,90 70,100 95,120" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M5,150 C30,140 70,130 95,120" stroke="#4F46E5" strokeWidth="0.2" />

                        <path d="M105,-120 C130,-110 170,-105 195,-100" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M105,-40 C130,-30 170,-20 195,0" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M105,40 C130,30 170,20 195,0" stroke="#4F46E5" strokeWidth="0.2" />
                        <path d="M105,120 C130,110 170,105 195,100" stroke="#4F46E5" strokeWidth="0.2" />
                    </g>

                    {/* Code/Development Structure */}
                    <g className="dark:opacity-30 opacity-30" transform="translate(1150, 400)">
                        {/* Code brackets and symbols with cleaner presentation */}
                        <rect x="-150" y="-100" width="300" height="200" rx="5" fill="none" stroke="#6366F1" strokeWidth="0.3" />

                        {/* Code lines - stylized */}
                        <line x1="-130" y1="-70" x2="-30" y2="-70" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="-130" y1="-50" x2="110" y2="-50" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="-130" y1="-30" x2="50" y2="-30" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="-130" y1="-10" x2="130" y2="-10" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="-130" y1="10" x2="90" y2="10" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="-130" y1="30" x2="70" y2="30" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="-130" y1="50" x2="100" y2="50" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="-130" y1="70" x2="50" y2="70" stroke="#6366F1" strokeWidth="0.3" />

                        {/* Indent blocks for code structure */}
                        <line x1="-110" y1="10" x2="-110" y2="70" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="-90" y1="30" x2="-90" y2="50" stroke="#6366F1" strokeWidth="0.3" />

                        {/* Code symbols */}
                        <text x="-145" y="-80" fill="#6366F1" fontSize="8" className="dark:opacity-40 opacity-20">{"{"}</text>
                        <text x="145" y="80" fill="#6366F1" fontSize="8" className="dark:opacity-40 opacity-20">{"}"}</text>
                        <text x="-20" y="-70" fill="#6366F1" fontSize="4" className="dark:opacity-30 opacity-15">{"function()"}</text>
                        <text x="70" y="-30" fill="#6366F1" fontSize="4" className="dark:opacity-30 opacity-15">{"return"}</text>
                    </g>
                    {/* AI/ML elements */}
                    <g className="dark:opacity-30 opacity-30" transform="translate(700, 200)">
                        {/* Brain symbolic representation */}
                        <circle cx="0" cy="0" r="80" fill="none" stroke="#6366F1" strokeWidth="0.3" />
                        <ellipse cx="0" cy="0" rx="40" ry="60" fill="none" stroke="#6366F1" strokeWidth="0.3" />
                        <path
                            d="M-40,0 C-30,-30 30,-30 40,0"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="0.3"
                        />
                        <path
                            d="M-40,0 C-30,30 30,30 40,0"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="0.3"
                        />
                        <path
                            d="M0,-60 C-20,-20 -20,20 0,60"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="0.3"
                        />
                        <path
                            d="M0,-60 C20,-20 20,20 0,60"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="0.3"
                        />
                    </g>

                    {/* Collaboration representation */}
                    <g className="dark:opacity-30 opacity-30" transform="translate(900, 600)">
                        <circle cx="-50" cy="0" r="40" fill="none" stroke="#6366F1" strokeWidth="0.3" />
                        <circle cx="50" cy="0" r="40" fill="none" stroke="#8B5CF6" strokeWidth="0.3" />
                        <circle cx="0" cy="-50" r="40" fill="none" stroke="#4F46E5" strokeWidth="0.3" />

                        <line x1="-25" y1="-25" x2="25" y2="-25" stroke="#6366F1" strokeWidth="0.3" />
                        <line x1="25" y1="-25" x2="25" y2="25" stroke="#8B5CF6" strokeWidth="0.3" />
                        <line x1="25" y1="25" x2="-25" y2="25" stroke="#4F46E5" strokeWidth="0.3" />
                        <line x1="-25" y1="25" x2="-25" y2="-25" stroke="#7E22CE" strokeWidth="0.3" />

                        <circle cx="0" cy="0" r="20" fill="none" stroke="#6366F1" strokeWidth="0.3" />
                    </g>

                    {/* Data connection lines */}
                    <g className="dark:opacity-15 opacity-8">
                        {/* Connection from neural network to center */}
                        <path
                            d="M 450,400 C 550,420 650,380 750,400"
                            fill="none"
                            stroke="#4F46E5"
                            strokeWidth="0.7"
                            strokeDasharray="1,10"
                        />

                        {/* Connection from code structure to center */}
                        <path
                            d="M 1030,400 C 930,420 830,380 750,400"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="0.7"
                            strokeDasharray="1,10"
                        />

                        {/* AI connections with cleaner paths */}
                        <path
                            d="M 700,280 C 720,320 735,350 750,400"
                            fill="none"
                            stroke="#4F46E5"
                            strokeWidth="0.7"
                            strokeDasharray="1,10"
                            className="dark:opacity-15 opacity-10"
                        />

                        <path
                            d="M 900,540 C 850,500 800,450 750,400"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="0.7"
                            strokeDasharray="1,10"
                            className="dark:opacity-15 opacity-10"
                        />
                    </g>
                    {/* Data nodes with subtle glow */}
                    <g filter="url(#sophisticatedGlow)">
                        {/* Neural network nodes */}
                        <circle cx="250" cy="400" r="2" fill="#4F46E5" />
                        <circle cx="350" cy="400" r="1.5" fill="#4F46E5" />
                        <circle cx="250" cy="300" r="1.5" fill="#4F46E5" />
                        <circle cx="250" cy="500" r="1.5" fill="#4F46E5" />
                        <circle cx="150" cy="400" r="1.5" fill="#4F46E5" />
                        <circle cx="320" cy="330" r="1.5" fill="#4F46E5" />
                        <circle cx="320" cy="470" r="1.5" fill="#4F46E5" />
                        <circle cx="180" cy="330" r="1.5" fill="#4F46E5" />
                        <circle cx="180" cy="470" r="1.5" fill="#4F46E5" />

                        {/* Connection path nodes */}
                        <circle cx="450" cy="400" r="2" fill="#4F46E5" />
                        <circle cx="550" cy="410" r="1.5" fill="#4F46E5" />
                        <circle cx="650" cy="390" r="1.5" fill="#4F46E5" />
                        <circle cx="750" cy="400" r="3" fill="#6366F1" />
                        <circle cx="850" cy="390" r="1.5" fill="#6366F1" />
                        <circle cx="950" cy="410" r="1.5" fill="#6366F1" />
                        <circle cx="1030" cy="400" r="2" fill="#6366F1" />

                        {/* Code structure nodes */}
                        <circle cx="1150" cy="400" r="2" fill="#6366F1" />
                        <circle cx="1150" cy="340" r="1.5" fill="#6366F1" />
                        <circle cx="1150" cy="460" r="1.5" fill="#6366F1" />
                        <circle cx="1210" cy="370" r="1.5" fill="#6366F1" />
                        <circle cx="1210" cy="430" r="1.5" fill="#6366F1" />
                        <circle cx="1090" cy="370" r="1.5" fill="#6366F1" />
                        <circle cx="1090" cy="430" r="1.5" fill="#6366F1" />

                        {/* AI/Collaboration nodes */}
                        <circle cx="700" cy="200" r="2" fill="#4F46E5" />
                        <circle cx="700" cy="280" r="1.5" fill="#4F46E5" />
                        <circle cx="900" cy="600" r="2" fill="#6366F1" />
                        <circle cx="900" cy="540" r="1.5" fill="#6366F1" />
                    </g>

                    {/* Pulse rings (subtle animation) */}
                    <circle cx="750" cy="400" r="20" fill="none" stroke="#4F46E5" strokeWidth="0.3" className="dark:opacity-30 opacity-20 pulse-ring" />
                    <circle cx="750" cy="400" r="35" fill="none" stroke="#4F46E5" strokeWidth="0.2" className="dark:opacity-20 opacity-15 pulse-ring delay-1" />
                    <circle cx="750" cy="400" r="50" fill="none" stroke="#4F46E5" strokeWidth="0.1" className="dark:opacity-10 opacity-10 pulse-ring delay-2" />

                    {/* AI brain pulse rings */}
                    <circle cx="700" cy="200" r="12" fill="none" stroke="#4F46E5" strokeWidth="0.2" className="dark:opacity-20 opacity-15 pulse-ring delay-3" />
                    <circle cx="900" cy="600" r="12" fill="none" stroke="#6366F1" strokeWidth="0.2" className="dark:opacity-20 opacity-15 pulse-ring delay-4" />
                </svg>
            </div>

            {/* Tech wave at bottom - code/AI themed */}
            <div className="absolute bottom-0 left-0 right-0 h-64 dark:opacity-10 opacity-8">
                <svg width="100%" height="100%" viewBox="0 0 1440 200" preserveAspectRatio="none">
                    <defs>
                        {/* Enhanced gradients for waves */}
                        <linearGradient id="enhancedIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.2" />
                        </linearGradient>

                        <linearGradient id="enhancedViolet" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.18" />
                            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.09" />
                        </linearGradient>

                        {/* Light mode gradient variants */}
                        <linearGradient id="lightIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.1" />
                        </linearGradient>

                        <linearGradient id="lightViolet" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.12" />
                            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.05" />
                        </linearGradient>

                        {/* Sophisticated glow filter for data points */}
                        <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Data pattern */}
                        <pattern id="dataPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <rect width="20" height="20" fill="none" />
                            <circle cx="10" cy="10" r="1" fill="#4F46E5" opacity="0.3" className="data-point-pulse" />
                        </pattern>

                        {/* Code grid pattern */}
                        <pattern id="gridPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="none" />
                            <path d="M 0 0 L 40 40" stroke="#4F46E5" strokeWidth="0.2" opacity="0.15" />
                            <path d="M 40 0 L 0 40" stroke="#4F46E5" strokeWidth="0.2" opacity="0.15" />
                        </pattern>

                        {/* Animation paths for waves */}
                        <path id="wavePath1" d="M0,140 C320,110 640,150 960,120 C1120,105 1280,125 1440,140" fill="none" />
                        <path id="wavePath2" d="M0,100 C240,160 480,180 720,130 C960,80 1200,140 1440,160" fill="none" />
                    </defs>

                    {/* Main wave backgrounds - dark mode */}
                    <path
                        className="wave-animation-slow dark:opacity-100 opacity-0"
                        d="M0,100 C240,160 480,180 720,130 C960,80 1200,140 1440,160 L1440,200 L0,200 Z"
                        fill="url(#enhancedIndigo)"
                    />

                    <path
                        className="wave-animation-medium dark:opacity-40 opacity-0"
                        d="M0,140 C320,110 640,150 960,120 C1120,105 1280,125 1440,140 L1440,200 L0,200 Z"
                        fill="url(#enhancedViolet)"
                    />

                    {/* Main wave backgrounds - light mode */}
                    <path
                        className="wave-animation-slow dark:opacity-0 opacity-100"
                        d="M0,100 C240,160 480,180 720,130 C960,80 1200,140 1440,160 L1440,200 L0,200 Z"
                        fill="url(#lightIndigo)"
                    />

                    <path
                        className="wave-animation-medium dark:opacity-0 opacity-40"
                        d="M0,140 C320,110 640,150 960,120 C1120,105 1280,125 1440,140 L1440,200 L0,200 Z"
                        fill="url(#lightViolet)"
                    />

                    {/* Code grid overlay */}
                    <rect x="0" y="80" width="100%" height="120" fill="url(#gridPattern)" opacity="0.05" className="grid-animation" />

                    {/* Data points with animation */}
                    {Array.from({ length: 24 }).map((_, i) => (
                        <circle
                            key={`wave-dot-${i}`}
                            cx={60 + (i * 60)}
                            cy={130 + (Math.sin(i * 0.5) * 20)}
                            r={0.8 + (i % 4) * 0.4}
                            fill="#FFF"
                            className={`dark:opacity-30 opacity-20 data-point-pulse delay-${i % 7}`}
                            filter="url(#glowEffect)"
                        />
                    ))}

                    {/* Data flow paths */}
                    <path
                        d="M0,135 C240,115 480,155 720,125 C960,95 1200,130 1440,140"
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="0.3"
                        strokeDasharray="2,8"
                        className="dark:opacity-20 opacity-15 path-animation"
                    />

                    <path
                        d="M0,120 C360,140 720,110 1080,130 C1260,140 1350,135 1440,125"
                        fill="none"
                        stroke="#6366F1"
                        strokeWidth="0.3"
                        strokeDasharray="2,8"
                        className="dark:opacity-15 opacity-10 path-animation-reverse"
                    />

                    {/* Animated data particles */}
                    {Array.from({ length: 10 }).map((_, i) => (
                        <circle
                            key={`particle-1-${i}`}
                            r="1.2"
                            fill="#4F46E5"
                            className="dark:opacity-40 opacity-30 particle-animation"
                            filter="url(#glowEffect)"
                        >
                            <animateMotion
                                dur={`${8 + i * 2}s`}
                                repeatCount="indefinite"
                                path="M0,100 C240,160 480,180 720,130 C960,80 1200,140 1440,160"
                                begin={`${i * 0.8}s`}
                            />
                        </circle>
                    ))}

                    {Array.from({ length: 8 }).map((_, i) => (
                        <circle
                            key={`particle-2-${i}`}
                            r="0.9"
                            fill="#6366F1"
                            className="dark:opacity-30 opacity-20 particle-animation"
                            filter="url(#glowEffect)"
                        >
                            <animateMotion
                                dur={`${10 + i * 2}s`}
                                repeatCount="indefinite"
                                path="M0,140 C320,110 640,150 960,120 C1120,105 1280,125 1440,140"
                                begin={`${i * 1.2}s`}
                            />
                        </circle>
                    ))}

                    {/* Code bits */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <text
                            key={`code-${i}`}
                            x={100 + (i * 90)}
                            y={160 + (Math.sin(i * 0.7) * 10)}
                            fontSize="3"
                            fill="#4F46E5"
                            className={`dark:opacity-13 opacity-8 binary-fade delay-${i % 5}`}
                        >
                            {i % 3 === 0 ? "{ }" : i % 3 === 1 ? "<>" : "()"}
                        </text>
                    ))}

                    {/* Code block nodes */}
                    {Array.from({ length: 6 }).map((_, i) => (
                        <g key={`hex-${i}`} className={`hex-pulse delay-${i % 4}`}>
                            <rect
                                x={230 + (i * 200)}
                                y="140"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="0.4"
                                className="dark:opacity-15 opacity-10"
                            />
                        </g>
                    ))}
                </svg>
            </div>

            {/* Refined CSS for animations */}
            <style jsx>{`
                .pulse-ring {
                    animation: sophisticatedPulse 6s infinite;
                    transform-origin: center;
                }
                
                .delay-1 {
                    animation-delay: 1.5s;
                }
                
                .delay-2 {
                    animation-delay: 3s;
                }
                
                .delay-3 {
                    animation-delay: 0.8s;
                }
                
                .delay-4 {
                    animation-delay: 2.2s;
                }
                
                @keyframes sophisticatedPulse {
                    0% { transform: scale(0.97); opacity: 0.15; }
                    50% { transform: scale(1.03); opacity: 0.08; }
                    100% { transform: scale(0.97); opacity: 0.15; }
                }

                .wave-animation-slow {
                    animation: waveMove 25s infinite alternate ease-in-out;
                }
                
                .wave-animation-medium {
                    animation: waveMove 20s infinite alternate-reverse ease-in-out;
                }
                
                .grid-animation {
                    animation: gridDrift 40s infinite linear;
                }
                
                .data-point-pulse {
                    animation: dataPulse 4s infinite;
                    transform-origin: center;
                }
                
                .path-animation {
                    animation: pathGlow 8s infinite;
                }
                
                .path-animation-reverse {
                    animation: pathGlow 8s infinite reverse;
                }
                
                .particle-animation {
                    animation: particleBrightness 4s infinite;
                }
                
                .binary-fade {
                    animation: binaryFade 5s infinite;
                }
                
                .hex-pulse {
                    animation: hexPulse 5s infinite;
                }
                
                .delay-0 { animation-delay: 0s; }
                .delay-1 { animation-delay: 0.5s; }
                .delay-2 { animation-delay: 1s; }
                .delay-3 { animation-delay: 1.5s; }
                .delay-4 { animation-delay: 2s; }
                .delay-5 { animation-delay: 2.5s; }
                .delay-6 { animation-delay: 3s; }
                
                @keyframes waveMove {
                    0% { transform: translateX(-10px); }
                    100% { transform: translateX(10px); }
                }
                
                @keyframes gridDrift {
                    0% { transform: translateX(0) translateY(0); }
                    100% { transform: translateX(40px) translateY(40px); }
                }
                
                @keyframes dataPulse {
                    0% { transform: scale(0.7); opacity: 0.2; }
                    50% { transform: scale(1.4); opacity: 0.3; }
                    100% { transform: scale(0.7); opacity: 0.2; }
                }
                
                @keyframes pathGlow {
                    0% { opacity: 0.05; stroke-width: 0.2; }
                    50% { opacity: 0.2; stroke-width: 0.4; }
                    100% { opacity: 0.05; stroke-width: 0.2; }
                }
                
                @keyframes particleBrightness {
                    0% { opacity: 0.2; }
                    50% { opacity: 0.5; }
                    100% { opacity: 0.2; }
                }
                
                @keyframes binaryFade {
                    0% { opacity: 0.05; }
                    50% { opacity: 0.15; }
                    100% { opacity: 0.05; }
                }
                
                @keyframes hexPulse {
                    0% { transform: scale(0.95); opacity: 0.1; }
                    50% { transform: scale(1.05); opacity: 0.2; }
                    100% { transform: scale(0.95); opacity: 0.1; }
                }
            `}</style>
        </div>
    );
};

export default EEPBackground;