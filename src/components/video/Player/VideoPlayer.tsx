// src/components/video/Player/index.tsx (updated with theme support)
"use client";
import { forwardRef, useRef, useState, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import PlayerLoader from './PlayerLoader';
import { useVideoLoading } from '@/hooks/useVideoLoading';

export interface VideoPlayerProps {
  src: string;
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

const VideoPlayerComponent: ForwardRefRenderFunction<VideoPlayerRef, VideoPlayerProps> = (
  {
    src,
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

  const handleError = () => {
    const videoError = new Error('Video playback error');
    if (onError) onError(videoError);
    setLoading(false);
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
        src={src}
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
      />
      
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