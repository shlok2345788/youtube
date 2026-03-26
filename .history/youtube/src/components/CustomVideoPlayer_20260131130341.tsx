"use client";

import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
    video: {
        _id: string;
        videotitle: string;
        filepath: string;
    };
    onNextVideo?: () => void;
    onCloseVideo?: () => void;
    onShowComments?: () => void;
}

export default function CustomVideoPlayer({ video, onNextVideo, onCloseVideo, onShowComments }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // Gesture tracking
    const tapCount = useRef(0);
    const lastTapTime = useRef(0);
    const tapTimeout = useRef<NodeJS.Timeout | null>(null);

    // Handle single tap (pause/play)
    const handleSingleTap = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    // Handle double tap (seek forward/backward)
    const handleDoubleTap = (direction: 'forward' | 'backward') => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            if (direction === 'forward') {
                videoRef.current.currentTime = currentTime + 10; // Forward 10 seconds
            } else {
                videoRef.current.currentTime = Math.max(0, currentTime - 10); // Backward 10 seconds
            }
        }
    };

    // Handle triple tap (special actions)
    const handleTripleTap = (location: 'middle' | 'left' | 'right') => {
        if (location === 'middle' && onNextVideo) {
            onNextVideo();
        } else if (location === 'right' && onCloseVideo) {
            onCloseVideo();
        } else if (location === 'left' && onShowComments) {
            onShowComments();
        }
    };

    // Handle tap events with timing
    const handleTap = (location: 'middle' | 'left' | 'right') => {
        const now = Date.now();

        // Reset tap count if more than 300ms has passed since last tap
        if (now - lastTapTime.current > 300) {
            tapCount.current = 1;
        } else {
            tapCount.current++;
        }

        lastTapTime.current = now;

        // Clear any existing timeout
        if (tapTimeout.current) {
            clearTimeout(tapTimeout.current);
        }

        // Set a timeout to process the tap sequence
        tapTimeout.current = setTimeout(() => {
            if (tapCount.current === 1) {
                handleSingleTap();
            } else if (tapCount.current === 2) {
                handleDoubleTap(location === 'right' ? 'forward' : 'backward');
            } else if (tapCount.current >= 3) {
                handleTripleTap(location);
            }
            tapCount.current = 0;
        }, 300); // Wait 300ms to determine if it's a single, double, or triple tap
    };

    // Calculate tap position
    const calculateTapPosition = (e: React.MouseEvent | React.TouchEvent) => {
        const container = containerRef.current;
        if (!container) return 'middle';

        let clientX;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.nativeEvent.clientX;
        }

        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const width = rect.width;

        if (x < width * 0.33) {
            return 'left';
        } else if (x > width * 0.67) {
            return 'right';
        } else {
            return 'middle';
        }
    };

    // Handle mouse/touch events
    const handleMouseDown = (e: React.MouseEvent) => {
        const position = calculateTapPosition(e);
        handleTap(position);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const position = calculateTapPosition(e);
        handleTap(position);
    };

    // Toggle controls visibility
    const toggleControls = () => {
        if (showControls) {
            setShowControls(false);
        } else {
            setShowControls(true);
        }
    };

    // Hide controls after delay
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            setShowControls(true);
            timer = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                }
            }, 3000);
        };

        resetTimer();

        const video = videoRef.current;
        if (video) {
            video.addEventListener('timeupdate', resetTimer);
            video.addEventListener('play', () => setIsPlaying(true));
            video.addEventListener('pause', () => setIsPlaying(false));
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (tapTimeout.current) clearTimeout(tapTimeout.current);

            if (video) {
                video.removeEventListener('timeupdate', resetTimer);
                video.removeEventListener('play', () => setIsPlaying(true));
                video.removeEventListener('pause', () => setIsPlaying(false));
            }
        };
    }, [isPlaying]);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={toggleControls}
        >
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                preload="metadata"
                key={video._id}
            >
                <source src={video.filepath} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Custom Controls */}
            {showControls && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSingleTap();
                            }}
                            className="text-white text-lg"
                        >
                            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                        </button>
                        <div className="text-white text-sm">
                            {video.videotitle}
                        </div>
                    </div>
                </div>
            )}

            {/* Tap zones visualization */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-0 hover:opacity-20 bg-blue-500/30 transition-opacity">
                    <span className="text-white text-xs font-bold rotate-90 origin-left transform -translate-x-4">
                        Left Zone
                    </span>
                </div>
                <div className="absolute left-1/3 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-0 hover:opacity-20 bg-green-500/30 transition-opacity">
                    <span className="text-white text-xs font-bold">
                        Middle Zone
                    </span>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-0 hover:opacity-20 bg-yellow-500/30 transition-opacity">
                    <span className="text-white text-xs font-bold -rotate-90 origin-right transform translate-x-4">
                        Right Zone
                    </span>
                </div>
            </div>
        </div>
    );
}