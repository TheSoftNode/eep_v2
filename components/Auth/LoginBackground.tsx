export const EnhancedBackgroundElements = ({ animationProgress }: { animationProgress: number }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Sophisticated gradient orbs */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-indigo-500/8 via-violet-500/6 to-pink-500/4 dark:from-indigo-500/12 dark:via-violet-500/8 dark:to-pink-500/6 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-blue-500/6 via-indigo-500/8 to-violet-500/4 dark:from-blue-500/10 dark:via-indigo-500/12 dark:to-violet-500/6 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>

            {/* Advanced geometric patterns */}
            <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="authGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.06)" className="dark:stop-color-[rgba(99,102,241,0.1)]" />
                            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.08)" className="dark:stop-color-[rgba(139,92,246,0.12)]" />
                            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.04)" className="dark:stop-color-[rgba(236,72,153,0.08)]" />
                        </linearGradient>

                        <pattern id="sophisticatedGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99, 102, 241, 0.02)" className="dark:stroke-[rgba(99,102,241,0.04)]" strokeWidth="0.5" />
                        </pattern>

                        <filter id="authGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#sophisticatedGrid)" />

                    {/* Flowing authentication paths */}
                    <path
                        d="M0,300 C200,250 400,350 600,300 C800,250 1000,350 1440,300"
                        fill="none"
                        stroke="url(#authGradient1)"
                        strokeWidth="1"
                        opacity="0.3"
                        style={{
                            transform: `translateY(${Math.sin(animationProgress / 80 * Math.PI) * 15}px)`,
                        }}
                    />
                    <path
                        d="M0,500 C300,450 600,550 900,500 C1200,450 1350,550 1440,500"
                        fill="none"
                        stroke="url(#authGradient1)"
                        strokeWidth="1"
                        opacity="0.2"
                        style={{
                            transform: `translateY(${Math.cos(animationProgress / 80 * Math.PI) * 12}px)`,
                        }}
                    />

                    {/* Sophisticated data nodes */}
                    {Array.from({ length: 20 }).map((_, i) => {
                        const x = 100 + (i % 5) * 300;
                        const y = 150 + Math.floor(i / 5) * 150;
                        const size = 1.5 + (i % 3) * 0.5;
                        const opacity = 0.3 + Math.sin((animationProgress + i * 15) / 80 * Math.PI) * 0.2;

                        return (
                            <circle
                                key={`auth-node-${i}`}
                                cx={x}
                                cy={y}
                                r={size}
                                fill={i % 4 === 0 ? "#6366F1" : i % 4 === 1 ? "#8B5CF6" : i % 4 === 2 ? "#EC4899" : "#3B82F6"}
                                opacity={opacity}
                                filter="url(#authGlow)"
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};