'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
    message?: string;
    showBranding?: boolean;
    brandingText?: string;
    theme?: 'light' | 'dark' | 'system';
    style?: 'minimal' | 'elaborate';
    logoSrc?: string;
    timeout?: number; // In milliseconds, show timeout message after this duration
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = 'Loading your experience',
    showBranding = true,
    brandingText = 'Mentorship Platform',
    theme = 'system',
    style = 'elaborate',
    logoSrc = '/logo.svg', // Replace with your actual logo path
    timeout = 10000 // 10 seconds default
}) => {
    const [loadingPhase, setLoadingPhase] = useState(0);
    const [showTimeout, setShowTimeout] = useState(false);
    const [progress, setProgress] = useState(0);

    // Detect system preference for dark mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Detect system preference if theme is set to 'system'
        if (theme === 'system') {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(darkModeMediaQuery.matches);

            const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
            darkModeMediaQuery.addEventListener('change', handler);
            return () => darkModeMediaQuery.removeEventListener('change', handler);
        } else {
            setIsDarkMode(theme === 'dark');
        }
    }, [theme]);

    useEffect(() => {
        // Simulate loading phases
        const interval = setInterval(() => {
            setLoadingPhase(prev => (prev < 3 ? prev + 1 : prev));
        }, 800);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                // Gradually slow down progress as it approaches 90%
                const increment = Math.max(1, 10 * (1 - prev / 90));
                return Math.min(prev + increment, 95); // Cap at 95% until actual load completes
            });
        }, 300);

        // Show timeout message after specified duration
        const timeoutId = setTimeout(() => {
            setShowTimeout(true);
        }, timeout);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
            clearTimeout(timeoutId);
        };
    }, [timeout]);

    // Loading messages that change based on the phase
    const loadingMessages = [
        message,
        'Preparing your data',
        'Almost ready',
        'Finalizing'
    ];

    // Get appropriate color classes based on theme
    const getThemeClasses = () => {
        if (isDarkMode) {
            return {
                background: 'bg-gray-900',
                text: 'text-white',
                mutedText: 'text-gray-400',
                spinner: 'border-gray-700 border-t-indigo-500',
                progress: 'bg-indigo-500',
                progressBg: 'bg-gray-800'
            };
        } else {
            return {
                background: 'bg-white',
                text: 'text-gray-900',
                mutedText: 'text-gray-500',
                spinner: 'border-gray-200 border-t-indigo-600',
                progress: 'bg-indigo-600',
                progressBg: 'bg-gray-200'
            };
        }
    };

    const colors = getThemeClasses();

    return (
        <div
            className={`fixed inset-0 flex flex-col items-center justify-center ${colors.background} transition-colors duration-300`}
            role="alert"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="flex flex-col items-center justify-center max-w-md px-4 py-8">
                {/* Logo */}
                {showBranding && (
                    <div className="mb-8 relative">
                        <div className="transform transition-transform duration-700 hover:scale-105">
                            <Image
                                src={logoSrc}
                                alt="Company Logo"
                                width={120}
                                height={120}
                                className="animate-pulse"
                                priority
                            />
                        </div>
                        <h1 className={`mt-4 text-2xl font-bold ${colors.text}`}>{brandingText}</h1>
                    </div>
                )}

                {/* Loading animation */}
                {style === 'minimal' ? (
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 border-4 rounded-full animate-spin ${colors.spinner}`}></div>
                        <p className={`mt-4 ${colors.text} text-center`}>{loadingMessages[loadingPhase]}</p>
                    </div>
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center">
                        {/* Elaborate spinner with dots */}
                        <div className="flex justify-center items-center space-x-2 mb-6">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${colors.text} bg-opacity-80`}
                                    style={{
                                        animation: `bounce 1.4s infinite ease-in-out both`,
                                        animationDelay: `${i * 0.16}s`
                                    }}
                                ></div>
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full mb-4">
                            <div className={`w-full h-2 ${colors.progressBg} rounded-full overflow-hidden`}>
                                <div
                                    className={`h-full ${colors.progress} transition-all duration-300 ease-out`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className={`text-xs ${colors.mutedText}`}>Initiating</span>
                                <span className={`text-xs ${colors.mutedText}`}>{`${Math.round(progress)}%`}</span>
                            </div>
                        </div>

                        {/* Current action message */}
                        <p className={`mt-2 text-center ${colors.text} font-medium`}>
                            {loadingMessages[loadingPhase]}
                        </p>

                        {/* Loading steps */}
                        <div className="mt-6 w-full">
                            {['Connecting', 'Preparing data', 'Loading resources', 'Finalizing'].map((step, i) => (
                                <div key={step} className="flex items-center mb-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-3 
                    ${i <= loadingPhase ? `${colors.progress}` : `${colors.progressBg}`} 
                    transition-colors duration-500`}
                                    >
                                        {i < loadingPhase && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`text-sm ${i <= loadingPhase ? colors.text : colors.mutedText}`}>{step}</span>
                                </div>
                            ))}
                        </div>

                        {/* Timeout message */}
                        {showTimeout && (
                            <div className="mt-8 text-center">
                                <p className={`${colors.mutedText} text-sm`}>
                                    Taking longer than expected. Please be patient or try refreshing the page.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className={`mt-10 text-xs ${colors.mutedText} text-center`}>
                    © {new Date().getFullYear()} {brandingText}
                </div>
            </div>

            {/* Add CSS animation keyframes */}
            <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.7;
          }
          40% { 
            transform: scale(1.0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default LoadingScreen;