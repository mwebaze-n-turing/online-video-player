// src/components/video/Player/VideoPlayerContainer.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import VideoPlayer, { VideoPlayerRef } from '@/components/video/Player';
import ControlBar from '@/components/video/Controls/ControlBar';
import SettingsMenu, { VideoQuality } from '@/components/video/Controls/SettingsMenu';
import ThemeToggle from '@/components/common/ThemeToggle';
import { ResponsivePlayerWrapper } from './ResponsivePlayerWrapper';
import { useVideoLoading } from '@/hooks/useVideoLoading';

interface VideoPlayerContainerProps {
  src: string;
  poster?: string;
  title: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  autoPlay?: boolean;
  className?: string;
  qualities?: VideoQuality[];
}

export const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({
  src,
  poster,
  title,
  aspectRatio = '16:9',
  autoPlay = false,
  className = '',
  qualities = [
    { label: 'Auto', value: 'auto' },
    { label: '1080p', value: '1080p', resolution: '1920x1080', bitrate: 5000000 },
    { label: '720p', value: '720p', resolution: '1280x720', bitrate: 2500000 },
    { label: '480p', value: '480p', resolution: '854x480', bitrate: 1000000 },
    { label: '360p', value: '360p', resolution: '640x360', bitrate: 500000 },
  ],
}) => {
  const { resolvedTheme } = useTheme();
  const videoRef = useRef<VideoPlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Get loading state with our custom hook
  const { isLoading } = useVideoLoading(videoRef.current?.videoElement ? { current: videoRef.current.videoElement } : null);

  // Update buffered time
  useEffect(() => {
    const updateBuffered = () => {
      if (videoRef.current) {
        const bufferedTimeRanges = videoRef.current.getBuffered();
        if (bufferedTimeRanges && bufferedTimeRanges.length > 0) {
          setBuffered(bufferedTimeRanges.end(bufferedTimeRanges.length - 1));
        }
      }
    };
    
    const interval = setInterval(updateBuffered, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } 
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Handle seeking
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seek(time);
      setCurrentTime(time);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.setVolume(newVolume);
    }
  };
  
  // Handle mute toggle
  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.toggleMute();
      setIsMuted(!isMuted);
    }
  };
  
  // Handle time update
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };
  
  // Apply theme-based Container styles
  const containerClasses = `
    video-player-container relative theme-transition
    ${resolvedTheme === 'dark'
      ? 'bg-gray-900'
      : 'bg-white'}
    ${isFullscreen ? 'w-screen h-screen' : ''}
    ${className}
  `;
  
  // Inner container with proper theming
  const innerContainerClasses = `
    video-player-inner relative overflow-hidden rounded-lg theme-transition
    ${resolvedTheme === 'dark' 
      ? 'bg-black shadow-lg shadow-gray-900'
      : 'bg-black shadow-lg shadow-gray-200'}
    ${isFullscreen ? 'w-full h-full' : ''}
  `;

  // Apply video-specific styles
  const videoContainerClasses = `
    aspect-${aspectRatio.replace(':', '-')}
  `;

  // Theme toggle position
  const themeToggleClasses = `
    absolute top-4 right-4 z-50
    ${isPlaying ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-300' : 'opacity-100'}
  `;

  return (
    <ResponsivePlayerWrapper
      aspectRatio={aspectRatio}
      maintainAspectRatio={!isFullscreen}
      maxWidth="800px"
      className={containerClasses}
    >
      <div 
        ref={containerRef}
        className={`group ${innerContainerClasses}`}
      >
        <VideoPlayer
          ref={videoRef}
          src="/videos/featured.mp4" // Default video source, can be overridden by props
          poster={poster}
          title={title}
          autoPlay={autoPlay}
          controls={false} // We use custom controls
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onReady={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.getDuration());
            }
          }}
          className={videoContainerClasses}
        />
        
        {/* Theme toggle in the top-right corner */}
        <div className={themeToggleClasses}>
          <ThemeToggle variant="icon" />
        </div>
        
        {/* Custom control bar with theme awareness */}
        <ControlBar
          videoDuration={duration}
          currentTime={currentTime}
          bufferedTime={buffered}
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onToggleFullscreen={toggleFullscreen}
        />
        
        {/* Settings menu */}
        {showSettings && (
          <SettingsMenu
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            playbackSpeed={playbackSpeed}
            onPlaybackSpeedChange={(speed: number) => {
              setPlaybackSpeed(speed);
              if (videoRef.current?.videoElement) {
                videoRef.current.videoElement.playbackRate = speed;
              }
            }}
            qualities={qualities}
            currentQuality={currentQuality}
            onQualityChange={setCurrentQuality}
          />
        )}
        
        {/* Loading overlay is handled by the VideoPlayer component */}
      </div>
    </ResponsivePlayerWrapper>
  );
};

export default VideoPlayerContainer;