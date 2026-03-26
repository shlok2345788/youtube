"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Maximize, Volume2, Settings, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface CustomVideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
  onNextVideo?: () => void;
  onCloseVideo?: () => void;
  onShowComments?: () => void;
}

export default function CustomVideoPlayer({ 
  video, 
  onNextVideo, 
  onCloseVideo, 
  onShowComments 
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  // Gesture tracking
  const tapCount = useRef(0);
  const lastTapTime = useRef(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };
  
  // Handle seek forward/backward
  const seekVideo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(
        videoRef.current.duration, 
        videoRef.current.currentTime + seconds
      ));
    }
  };
  
  // Handle volume control
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Handle gesture controls
  const handleGesture = (location: 'left' | 'middle' | 'right', taps: number) => {
    if (taps === 1 && location === 'middle') {
      togglePlay();
    } else if (taps === 2) {
      if (location === 'left') {
        seekVideo(-10);
      } else if (location === 'right') {
        seekVideo(10);
      }
    } else if (taps === 3) {
      if (location === 'middle' && onNextVideo) {
        onNextVideo();
      } else if (location === 'right' && onCloseVideo) {
        onCloseVideo();
      } else if (location === 'left' && onShowComments) {
        onShowComments();
      }
    }
  };
  
  // Handle tap detection
  const handleTap = (location: 'left' | 'middle' | 'right') => {
    const now = Date.now();
    
    if (now - lastTapTime.current > 300) {
      tapCount.current = 1;
    } else {
      tapCount.current++;
    }
    
    lastTapTime.current = now;
    
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
    }
    
    tapTimeout.current = setTimeout(() => {
      handleGesture(location, tapCount.current);
      tapCount.current = 0;
    }, 300);
  };
  
  // Calculate tap zone
  const getTapZone = (clientX: number): 'left' | 'middle' | 'right' => {
    const container = containerRef.current;
    if (!container) return 'middle';
    
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    
    if (x < width * 0.33) return 'left';
    if (x > width * 0.67) return 'right';
    return 'middle';
  };
  
  // Event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const zone = getTapZone(e.clientX);
    handleTap(zone);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const zone = getTapZone(e.touches[0].clientX);
    handleTap(zone);
  };
  
  // Time formatting
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Progress bar handlers
  const handleProgressClick = (e: React.MouseEvent) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };
  
  // Effects
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);
  
  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      setShowControls(true);
      
      if (isPlaying) {
        timer = setTimeout(() => setShowControls(false), 3000);
      }
    };
    
    resetTimer();
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying]);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={() => setShowControls(true)}
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
      
      {/* Gesture zones visualization (hidden in production) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-0 hover:opacity-20 bg-blue-500/30 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-bold rotate-90">Left Zone</span>
        </div>
        <div className="absolute left-1/3 top-0 bottom-0 w-1/3 opacity-0 hover:opacity-20 bg-green-500/30 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-bold">Middle Zone</span>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-0 hover:opacity-20 bg-yellow-500/30 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-bold -rotate-90">Right Zone</span>
        </div>
      </div>
      
      {/* Controls overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-end">
          {/* Progress bar */}
          <div className="px-4 pb-2">
            <div className="relative h-1 bg-white/30 rounded-full cursor-pointer" onClick={handleProgressClick}>
              <div 
                className="h-full bg-red-600 rounded-full" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div className="absolute -top-1 -ml-2 w-4 h-4 bg-white rounded-full shadow-lg" 
                   style={{ left: `${(currentTime / duration) * 100}%` }} />
            </div>
            <div className="flex justify-between text-white text-xs mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button 
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button 
                onClick={() => seekVideo(-10)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <SkipBack size={20} />
              </button>
              
              <button 
                onClick={() => seekVideo(10)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <SkipForward size={20} />
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Volume2 size={20} className={isMuted ? 'opacity-50' : ''} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-gray-300 transition-colors">
                <Settings size={20} />
              </button>
              
              <button 
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
          
          {/* Video title */}
          <div className="px-4 pb-2">
            <h3 className="text-white text-sm font-medium truncate">{video.videotitle}</h3>
          </div>
        </div>
      )}
    </div>
  );
}