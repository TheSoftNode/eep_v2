"use client"

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VoiceMessagePlayerProps {
    url: string;
    filename?: string;
    duration?: number;
    className?: string;
}

export default function VoiceMessagePlayer({
    url,
    filename = 'Voice message',
    duration = 0,
    className = ''
}: VoiceMessagePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [audioDuration, setAudioDuration] = useState(duration);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize audio
    useEffect(() => {
        const audio = new Audio(url);
        audioRef.current = audio;

        // Event listeners
        audio.addEventListener('loadedmetadata', () => {
            setAudioLoaded(true);
            setAudioDuration(audio.duration || duration);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        });

        audio.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
            setAudioLoaded(false);
        });

        // Set initial volume
        audio.volume = volume;

        // Cleanup
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
                audio.removeEventListener('loadedmetadata', () => { });
                audio.removeEventListener('ended', () => { });
                audio.removeEventListener('error', () => { });
            }

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [url, duration]);

    // Handle play/pause
    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } else {
            audioRef.current.play();
            // Update current time every 100ms for smooth slider movement
            intervalRef.current = setInterval(() => {
                if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                }
            }, 100);
        }

        setIsPlaying(!isPlaying);
    };

    // Handle mute toggle
    const toggleMute = () => {
        if (!audioRef.current) return;

        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Handle volume change
    const handleVolumeChange = (value: number[]) => {
        if (!audioRef.current) return;

        const newVolume = value[0];
        audioRef.current.volume = newVolume;
        setVolume(newVolume);

        // If volume is set to 0, mute; otherwise, unmute
        if (newVolume === 0) {
            audioRef.current.muted = true;
            setIsMuted(true);
        } else if (isMuted) {
            audioRef.current.muted = false;
            setIsMuted(false);
        }
    };

    // Handle seek
    const handleSeek = (value: number[]) => {
        if (!audioRef.current) return;

        const seekTime = value[0];
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    // Format time (seconds to MM:SS)
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className={`flex flex-col p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}>
            <div className="flex items-center space-x-3">
                {/* Play/Pause button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    disabled={!audioLoaded}
                    className={`h-8 w-8 rounded-full ${isPlaying
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'text-gray-700 dark:text-gray-300'
                        } hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300`}
                >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                {/* Time display and progress bar */}
                <div className="flex-1 flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                        {formatTime(currentTime)}
                    </span>

                    <div className="flex-1">
                        <Slider
                            value={[currentTime]}
                            min={0}
                            max={audioDuration || 1}
                            step={0.1}
                            onValueChange={handleSeek}
                            disabled={!audioLoaded}
                            className="cursor-pointer"
                        />
                    </div>

                    <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                        {formatTime(audioDuration)}
                    </span>
                </div>

                {/* Volume control */}
                <div className="relative group">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    {/* Volume slider (shows on hover) */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
                            <div className="h-20 flex flex-col items-center">
                                <Slider
                                    value={[isMuted ? 0 : volume]}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    onValueChange={handleVolumeChange}
                                    orientation="vertical"
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href={url}
                                download={filename}
                                className="h-8 w-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                            >
                                <DownloadCloud className="h-4 w-4" />
                            </a>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Download voice message</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}