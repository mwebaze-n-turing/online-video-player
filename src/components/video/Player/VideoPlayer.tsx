"use client"
// src/components/video/Player/VideoPlayer.tsx
import { useRef, useState, useEffect } from 'react';
import { ControlBar } from '../Controls/ControlBar';
import { usePlayerPreferences } from '@/hooks/usePlayerPreferences';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export const VideoPlayer = ({ src, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { preferences, isLoaded, updateVolume, updatePlaybackSpeed, updateMuted } = usePlayerPreferences();
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Apply saved preferences when they are loaded
  useEffect(() => {
    if (!isLoaded || !videoRef.current) return;
    
    const video = videoRef.current;
    
    // Apply volume
    video.volume = preferences.volume;
    setVolume(preferences.volume);
    
    // Apply muted state
    video.muted = preferences.isMuted;
    setIsMuted(preferences.isMuted);
    
    // Apply playback speed
    video.playbackRate = preferences.playbackSpeed;
    setCurrentSpeed(preferences.playbackSpeed);
    
  }, [isLoaded, preferences, videoRef]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
    updateMuted(newMutedState);
  };
  
  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    video.volume = clampedVolume;
    setVolume(clampedVolume);
    updateVolume(clampedVolume);
    
    // Handle muting behavior when volume changes
    if (clampedVolume === 0 && !video.muted) {
      video.muted = true;
      setIsMuted(true);
      updateMuted(true);
    } else if (clampedVolume > 0 && video.muted) {
      video.muted = false;
      setIsMuted(false); 
      updateMuted(false);
    }
  };

  const toggleFullscreen = () => {
    const player = document.getElementById('video-player-container');
    if (!player) return;

    if (!document.fullscreenElement) {
      player.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = speed;
    setCurrentSpeed(speed);
    updatePlaybackSpeed(speed);
  };
  
  // Auto-hide controls logic
  useEffect(() => {
    const handleMouseMove = () => {
      showControls();
      
      // Only set timeout to hide controls if video is playing
      if (isPlaying) {
        startHideTimeout();
      }
    };
    
    const showControls = () => {
      setControlsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
    
    const startHideTimeout = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      hideTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    };
    
    // Handle pause/play events to manage control visibility
    const handlePause = () => {
      showControls(); // Always show controls when paused
    };
    
    const handlePlay = () => {
      startHideTimeout(); // Start timer to hide controls when playing
    };
    
    const player = document.getElementById('video-player-container');
    const video = videoRef.current;
    
    if (player && video) {
      player.addEventListener('mousemove', handleMouseMove);
      video.addEventListener('pause', handlePause);
      video.addEventListener('play', handlePlay);
      
      // Update fullscreen state
      document.addEventListener('fullscreenchange', () => {
        setIsFullscreen(!!document.fullscreenElement);
      });
    }
    
    return () => {
      if (player && video) {
        player.removeEventListener('mousemove', handleMouseMove);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('play', handlePlay);
      }
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      document.removeEventListener('fullscreenchange', () => {
        setIsFullscreen(!!document.fullscreenElement);
      });
    };
  }, [isPlaying]);

  return (
    <div
      id="video-player-container"
      className="relative w-full aspect-video bg-black"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={src}
        poster={poster}
        onClick={togglePlay}
        playsInline
      />
      
      {/* Controls container with animation */}
      <div 
        className={`
          absolute bottom-0 left-0 right-0
          transition-opacity duration-300 ease-in-out
          ${controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <ControlBar
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          isMuted={isMuted}
          toggleMute={toggleMute}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          currentSpeed={currentSpeed}
          onSpeedChange={handleSpeedChange}
        />
      </div>
    </div>
  );
};