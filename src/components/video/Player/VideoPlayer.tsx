// src/components/video/Player/index.tsx (updated with theme support)
"use client";
import React, { forwardRef, useRef, useState, useImperativeHandle, ForwardRefRenderFunction, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import PlayerLoader from './PlayerLoader';
import { useVideoLoading } from '@/hooks/useVideoLoading';
import { ControlBar } from '@/components/video/Controls/ControlBar';
import useFullscreen from '@/hooks/useFullscreen';

export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  className?: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onError?: (error: Error) => void;
}

export interface VideoPlayerRef {
  videoElement: HTMLVideoElement | null;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getBuffered: () => TimeRanges | null;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

// Define possible loading states
type LoadingState =
  | 'initial' // Before any loading has started
  | 'loading-metadata' // When basic metadata is being loaded
  | 'loading-data' // When video data is being loaded
  | 'buffering' // When playback has started but more data is needed
  | 'ready' // When video is ready to play without interruption
  | 'error'; // When an error has occurred

const VideoPlayerComponent: ForwardRefRenderFunction<VideoPlayerRef, VideoPlayerProps> = (
  {
    src = "/videos/featured.mp4",
    poster,
    title,
    autoPlay = false,
    muted = false,
    loop = false,
    controls = true, // We'll use custom controls later that are theme-aware
    preload = 'metadata',
    className = '',
    onReady,
    onPlay,
    onPause,
    onEnd,
    onTimeUpdate,
    onError
  },
  ref
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { resolvedTheme } = useTheme();
  const [loadingState, setLoadingState] = useState<LoadingState>('initial');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  
  // Additional states for animations
  const [hoverPosition, setHoverPosition] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Double-click detection
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use custom fullscreen hook
  const { isFullscreen, toggleFullscreen, fullscreenEnabled } = useFullscreen(playerContainerRef);
  
  // Use our custom hook to track loading states
  const {
    isLoading,
    isMetadataLoaded,
    isPlaybackReady,
    progress,
    error,
    setLoading
  } = useVideoLoading(videoRef, {
    autoReset: true,
    resetTimeout: 2000
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Set up all event listeners for tracking loading state
    const handleLoadStart = () => {
      setLoadingState('loading-metadata');
    };
    
    const handleLoadedMetadata = () => {
      setLoadingState('loading-data');
    };
    
    const handleLoadedData = () => {
      setLoadingState('ready');
    };
    
    const handleWaiting = () => {
      // Only show buffering if playback has actually started
      if (userInteracted || isPlaying) {
        setLoadingState('buffering');
      }
    };
    
    const handleCanPlay = () => {
      // Don't immediately set to ready if we're buffering and not enough data
      if (loadingState !== 'buffering') {
        setLoadingState('ready');
      }
    };
    
    const handlePlaying = () => {
      setIsPlaying(true);
      setLoadingState('ready');
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    const handleStalled = () => {
      if (isPlaying) {
        setLoadingState('buffering');
      }
    };
    
    const handleError = () => {
      setLoadingState('error');
      setVideoError(`Error loading video: ${videoElement.error?.message || 'Unknown error'}`);
    };
    
    // Progress event helps us know when more data has loaded
    const handleProgress = () => {
      // If we were buffering, check if we have enough data now
      if (loadingState === 'buffering') {
        // Get the current time and the end of the buffered range
        const currentTime = videoElement.currentTime;
        
        // Check all buffered ranges
        for (let i = 0; i < videoElement.buffered.length; i++) {
          const bufferedStart = videoElement.buffered.start(i);
          const bufferedEnd = videoElement.buffered.end(i);
          
          // If current time is in this range and we have sufficient buffer ahead (3 seconds)
          if (currentTime >= bufferedStart && 
              currentTime <= bufferedEnd && 
              (bufferedEnd - currentTime) > 3) {
            setLoadingState('ready');
            break;
          }
        }
      }
    };
    
    // Add all event listeners
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('stalled', handleStalled);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('progress', handleProgress);
    
    // Clean up all event listeners
    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('stalled', handleStalled);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('progress', handleProgress);
    };
  }, [loadingState, isPlaying, userInteracted]);

  // Handle play/pause to track user interaction
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    setUserInteracted(true);
    
    if (videoRef.current.paused) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
        setVideoError(`Playback error: ${error.message}`);
      });
    } else {
      videoRef.current.pause();
    }
  };

  // Expose video element methods through ref
  useImperativeHandle(ref, () => ({
    videoElement: videoRef.current,
    play: async () => {
      try {
        await videoRef.current?.play();
      } catch (error) {
        console.error('Error playing video:', error);
        if (onError) onError(error as Error);
      }
    },
    pause: () => {
      videoRef.current?.pause();
    },
    togglePlay: () => {
      if (videoRef.current?.paused) {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
          if (onError) onError(error as Error);
        });
      } else {
        videoRef.current?.pause();
      }
    },
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    getCurrentTime: () => videoRef.current?.currentTime || 0,
    getDuration: () => videoRef.current?.duration || 0,
    getBuffered: () => videoRef.current?.buffered || null,
    toggleMute: () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
      }
    },
    setVolume: (volume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = Math.min(1, Math.max(0, volume));
      }
    }
  }));

  // Event handlers (unchanged)
  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (onPause) onPause();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onEnd) onEnd();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(videoRef.current.currentTime);
      }
    }
  };

  const handleCanPlayThrough = () => {
    if (onReady) onReady();
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      setBufferedTime(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }
  };

  // Control handlers
  const handlePlayPauseControl = () => {
    if (!videoRef.current) return;
    
    setUserInteracted(true);
    
    if (videoRef.current.paused) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
        setVideoError(`Playback error: ${error.message}`);
      });
    } else {
      videoRef.current.pause();
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Handle progress bar hover position
  const handleProgressHover = (e: React.MouseEvent) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Clamp position between 0 and 100
    const clampedPosition = Math.max(0, Math.min(position, 100));
    setHoverPosition(clampedPosition);
    
    // Calculate time based on position
    const hoverTimeValue = duration * (clampedPosition / 100);
    setHoverTime(hoverTimeValue);
  };

  // Clear hover position when mouse leaves progress bar
  const handleProgressLeave = () => {
    setHoverPosition(0);
    setHoverTime(0);
  };

  // Handle rewind with animation
  const handleRewind = () => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Rewind 10 seconds
      const newTime = Math.max(0, videoElement.currentTime - 10);
      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Animate the button
      const button = document.querySelector('.control-button.rewind');
      if (button) {
        button.classList.add('animating');
        setTimeout(() => {
          button.classList.remove('animating');
        }, 300);
      }
      
      showControls();
    }
  };

  // Handle forward with animation
  const handleForward = () => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Forward 10 seconds
      const newTime = Math.min(
        videoElement.duration, 
        videoElement.currentTime + 10
      );
      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Animate the button
      const button = document.querySelector('.control-button.forward');
      if (button) {
        button.classList.add('animating');
        setTimeout(() => {
          button.classList.remove('animating');
        }, 300);
      }
      
      showControls();
    }
  };

  // Toggle speed menu
  const handleSpeedMenuToggle = () => {
    setSpeedMenuOpen(prev => !prev);
    setSettingsMenuOpen(false); // Close other menu
    
    // Reset hide timeout since user is interacting with controls
    showControls();
  };

  // Set playback speed
  const handleSpeedChange = (speed: number) => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      videoElement.playbackRate = speed;
      setPlaybackRate(speed);
      setSpeedMenuOpen(false);
      
      // Animate the speed button
      const button = document.querySelector('.control-button.speed');
      if (button) {
        button.classList.add('pulse');
        setTimeout(() => {
          button.classList.remove('pulse');
        }, 300);
      }
    }
  };

  // Toggle settings menu
  const handleSettingsToggle = () => {
    setSettingsMenuOpen(prev => !prev);
    setSpeedMenuOpen(false); // Close other menu
    
    // Reset hide timeout since user is interacting with controls
    showControls();
  };

  // Show controls and set hide timeout
  const showControls = () => {
    setControlsVisible(true);
    
    // Clear existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    // Set new timeout to hide controls after 3 seconds if video is playing
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  };

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    showControls();
  };

  // Handle video click with double-click detection
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    clickCount.current += 1;
    
    if (clickCount.current === 1) {
      // Single click - wait for potential double click
      clickTimeoutRef.current = setTimeout(() => {
        // If no double click after 300ms, treat as single click
        handlePlayPauseControl();
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current === 2) {
      // Double click - handle fullscreen
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      toggleFullscreen();
      clickCount.current = 0;
    }
  };

  const handleToggleFullscreen = () => {
    toggleFullscreen();
  };

  // Effect to handle pause state and controls visibility
  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      // Clear any hide controls timeout when paused
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = null;
      }
    } else {
      // Start hide controls timeout when playing
      showControls();
    }
  }, [isPlaying]);

  // Effect to handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events in fullscreen or when player is focused
      if (!isFullscreen && !document.activeElement?.closest('.video-player-container')) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPauseControl();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'ArrowRight':
          e.preventDefault();
          // Forward 10 seconds
          if (videoRef.current) {
            const newTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            showControls();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          // Rewind 10 seconds
          if (videoRef.current) {
            const newTime = Math.max(0, videoRef.current.currentTime - 10);
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            showControls();
          }
          break;
        case 'm':
          e.preventDefault();
          handleToggleMute();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, isPlaying]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Apply theme-based classes
  const playerContainerClasses = `
    video-player-container
    relative
    theme-transition
    overflow-hidden
    ${isFullscreen 
      ? 'fixed inset-0 z-50 w-screen h-screen' 
      : 'w-full aspect-video min-h-[400px]'}
    ${resolvedTheme === 'dark' 
      ? 'bg-black border-gray-800' 
      : 'bg-black border-gray-200'}
    ${className}
  `;

  return (
    <div 
      ref={playerContainerRef}
      className={playerContainerClasses}
      onMouseMove={handleMouseMove}
      tabIndex={0}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        title={title}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={false}
        preload={preload}
        className={`w-full h-full object-contain ${isFullscreen ? 'max-h-screen' : ''}`}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onCanPlayThrough={handleCanPlayThrough}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        onClick={handleVideoClick}
      />
      
      {/* Large play/pause overlay button (for center of video) */}
      {!isPlaying && (
        <button 
          className="large-play-button"
          onClick={handlePlayPauseControl}
          aria-label="Play video"
        >
          <svg className="play-icon-large" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" fill="#ffffff"/>
          </svg>
        </button>
      )}
      
      {/* Fullscreen indicator overlay */}
      {isFullscreen && (
        <div className="absolute top-0 left-0 p-4 transition-opacity duration-300 opacity-0 hover:opacity-100">
          <span className="bg-black/70 text-white py-1 px-3 rounded-full text-sm font-medium">
            Press ESC to exit fullscreen
          </span>
        </div>
      )}
      
      {/* Loading overlay - now theme aware */}
      {(loadingState === 'loading-metadata' || 
        loadingState === 'loading-data' || 
        loadingState === 'buffering') && (
        <div className={`
          absolute inset-0 flex items-center justify-center 
          ${resolvedTheme === 'dark' 
            ? 'bg-black bg-opacity-70' 
            : 'bg-black bg-opacity-50'}
           z-10`}>
          <div className="loading-spinner">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            
            {/* Loading state message */}
            <div className="loading-text mt-4 text-white text-center">
              {loadingState === 'loading-metadata' && 'Loading video...'}
              {loadingState === 'loading-data' && 'Preparing playback...'}
              {loadingState === 'buffering' && 'Buffering...'}
            </div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {loadingState === 'error' && (
        <div className={`
          absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center 
          ${resolvedTheme === 'dark' 
            ? 'bg-gray-900 bg-opacity-90 text-white' 
            : 'bg-black bg-opacity-80 text-white'} z-10 p-4`}>
          <div className="error-icon mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="error-title text-xl font-bold mb-2">Video Error</h3>
          <p className="error-message text-center">{videoError || 'Could not load the video.'}</p>
          <button 
            className="retry-button mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            onClick={() => {
              if (!videoRef.current) return;
              // Reset error state
              setVideoError(null);
              setLoadingState('loading-metadata');
              // Reload the video
              videoRef.current.load();
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Loading overlay - now theme aware */}
      <PlayerLoader 
        isLoading={isLoading} 
        showThumb={true}
        thumbnail={poster}
        // Pass theme for loader styling
        className={resolvedTheme === 'dark' ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50'}
      />
      
      {/* Accessibility info */}
      {title && (
        <span className="sr-only">
          {isPlaying ? `Now playing: ${title}` : `Video paused: ${title}`}
        </span>
      )}
      
      {/* Loading progress info for screen readers */}
      {isLoading && (
        <span className="sr-only">
          {isMetadataLoaded 
            ? `Loading video: ${Math.round(progress)}% complete` 
            : 'Preparing video player...'}
        </span>
      )}
      
      {/* Error message - now theme aware */}
      {error && (
        <div className={`
          absolute inset-0 flex items-center justify-center 
          ${resolvedTheme === 'dark' 
            ? 'bg-gray-900 bg-opacity-90 text-white' 
            : 'bg-black bg-opacity-75 text-white'}
        `}>
          <div className="text-center p-4">
            <p className="text-xl mb-2">Error loading video</p>
            <p>{error.message}</p>
          </div>
        </div>
      )}

      {/* Animated Controls */}
      <div className={`control-bar ${controlsVisible ? 'visible' : 'hidden'}`}>
        <div className="controls-left">
          <button 
            className="control-button primary play-pause" 
            onClick={handlePlayPauseControl}
            data-state={isPlaying ? 'pause' : 'play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <svg className="play-icon" viewBox="0 0 24 24" width="24" height="24">
              <path d="M8 5v14l11-7z" fill="#ffffff"/>
            </svg>
            <svg className="pause-icon" viewBox="0 0 24 24" width="24" height="24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="#ffffff"/>
            </svg>
          </button>
          
          <button 
            className="control-button rewind"
            onClick={handleRewind}
            aria-label="Rewind 10 seconds"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-1.1 11H10v-3.3L9 13v-.7l1.8-.6h.1V16zm4.3-1.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1.4 0 .6.1c.2.1.3.2.5.3s.2.3.3.6.1.5.1.8v.7zm-.9-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            className="control-button forward"
            onClick={handleForward}
            aria-label="Forward 10 seconds"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8zm6.8 3H12v-3.3l-1-.7V11l1.8-.6h.1V16zm4.3-1.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1.4 0 .6.1.3.2.5.3.2.3.3.6.1.5.1.8v.7zm-.8-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <div className="controls-center">
          <div 
            className="progress-bar-container" 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              const time = pos * duration;
              handleSeek(time);
            }}
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
          >
            <div 
              className="progress-indicator" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            <div 
              className="buffered-indicator" 
              style={{ width: `${duration > 0 ? (bufferedTime / duration) * 100 : 0}%` }}
            />
            <div 
              className="hover-position-indicator"
              style={{ left: `${hoverPosition}%` }}
            />
            
            {hoverPosition > 0 && (
              <div 
                className="time-tooltip"
                style={{ left: `${hoverPosition}%` }}
              >
                {Math.floor(hoverTime / 60)}:{Math.floor(hoverTime % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
          
          <div className="time-display">
            <span className="current-time">{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
            <span className="time-separator"> / </span>
            <span className="duration">{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        <div className="controls-right">
          <button 
            className="control-button volume"
            onClick={handleToggleMute}
            data-state={isMuted ? 'muted' : volume > 0.5 ? 'high' : 'low'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <svg className="volume-high-icon" viewBox="0 0 24 24" width="20" height="20">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-.9 7-4.5 7-8.8s-3-7.9-7-8.8z" fill="currentColor"/>
            </svg>
            <svg className="volume-muted-icon" viewBox="0 0 24 24" width="20" height="20">
              <path d="M16.5 12c0-1.8-1-3.3-2.5-4v2.2l2.5 2.4c0-.2 0-.4 0-.6zm2.5 0c0 .9-.2 1.8-.5 2.6l1.5 1.5c.5-1.3.8-2.6.8-4.1 0-4.3-3-7.9-7-8.8v2.1c2.9.9 5 3.5 5 6.7zM4.3 3L3 4.3 7.7 9H3v6h4l5 5v-6.7l4.2 4.2c-.7.6-1.6 1-2.5 1.2v2.1c1.4-.3 2.6-.9 3.7-1.8l2 2 1.3-1.3-13-13c.1 0 .1 0 0 0zM12 4l-1.6 1.6L12 7.3V4z" fill="currentColor"/>
            </svg>
            
            <div className="volume-slider-container">
              <input 
                type="range" 
                className="volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume"
              />
            </div>
          </button>
          
          <button 
            className="control-button speed"
            onClick={handleSpeedMenuToggle}
            aria-label="Playback speed"
            aria-haspopup="true"
            aria-expanded={speedMenuOpen ? "true" : "false"}
          >
            <span>{playbackRate}x</span>
          </button>
          
          {speedMenuOpen && (
            <div className="speed-menu">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  className={`speed-option ${playbackRate === speed ? 'selected' : ''}`}
                  onClick={() => handleSpeedChange(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
          
          <button 
            className="control-button settings"
            onClick={handleSettingsToggle}
            aria-label="Settings"
            aria-haspopup="true"
            aria-expanded={settingsMenuOpen ? "true" : "false"}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            className="control-button fullscreen"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const VideoPlayer = forwardRef(VideoPlayerComponent);
export default VideoPlayer;