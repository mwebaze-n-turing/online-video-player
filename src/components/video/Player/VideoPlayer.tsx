// src/components/video/Player/index.tsx (updated with theme support)
"use client";
import { forwardRef, useRef, useState, useImperativeHandle, ForwardRefRenderFunction, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import PlayerLoader from './PlayerLoader';
import { useVideoLoading } from '@/hooks/useVideoLoading';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const { resolvedTheme } = useTheme();
  const [loadingState, setLoadingState] = useState<LoadingState>('initial');
  const [videoError, setVideoError] = useState<string | null>(null);
  // Track if user has interacted with the video
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  
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
    if (onTimeUpdate && videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleCanPlayThrough = () => {
    if (onReady) onReady();
  };

  // Apply theme-based classes
  const playerContainerClasses = `
    video-player-container
    relative
    theme-transition
    ${resolvedTheme === 'dark' 
      ? 'bg-black border-gray-800' 
      : 'bg-black border-gray-200'}
    ${className}
  `;

  return (
    <div className={playerContainerClasses}>
      {/* Video element */}
      <video
        ref={videoRef}
        src={src} // Default video source, can be overridden by props
        poster={poster}
        title={title}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls} // Native controls for now, we'll replace with custom
        preload={preload}
        className="w-full h-full"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onCanPlayThrough={handleCanPlayThrough}
        onError={handleError}
        onClick={handlePlayPause}
      />
      
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
    </div>
  );
};

export const VideoPlayer = forwardRef(VideoPlayerComponent);
export default VideoPlayer;