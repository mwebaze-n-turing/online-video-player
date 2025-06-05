// EnhancedVideoPlayer.tsx
import { useState, useRef, useEffect } from 'react';
import { VideoPlayerControls } from '../Controls';
import { EnhancedVolumeControl } from '../Controls';
import useFullscreen from '../../../hooks/useFullscreen';

interface EnhancedVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  initialVolume?: number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

export default function EnhancedVideoPlayer({ 
  videoUrl, 
  posterUrl, 
  initialVolume = 0.5,
  autoPlay = false,
  muted = false,
  loop = false,
  className = ''
}: EnhancedVideoPlayerProps) {
  // State for video playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(initialVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  
  // Refs
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Double-click detection
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef(0);
  
  // Use custom fullscreen hook
  const { isFullscreen, toggleFullscreen, fullscreenEnabled } = 
    useFullscreen(playerContainerRef);
  
  // Handle play/pause
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };
  
  // Handle video click with double-click detection
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    clickCount.current += 1;
    
    if (clickCount.current === 1) {
      // Single click - wait for potential double click
      clickTimeoutRef.current = setTimeout(() => {
        // If no double click after 300ms, treat as single click
        handlePlayPause();
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

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
    
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      video.muted = newVolume === 0;
    }
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    video.muted = newMutedState;
  };

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const seekPosition = (e.clientX - rect.left) / rect.width;
    
    const newTime = seekPosition * video.duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    
    // Show controls briefly after seeking
    showControls();
  };

  // Handle playback speed change
  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    setPlaybackRate(speed);
    video.playbackRate = speed;
    
    // Show controls briefly after changing speed
    showControls();
  };

  // Handle rewind
  const handleRewind = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(0, video.currentTime - 10);
    video.currentTime = newTime;
    setCurrentTime(newTime);
    
    // Show controls briefly after rewinding
    showControls();
  };

  // Handle forward
  const handleForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(video.duration, video.currentTime + 10);
    video.currentTime = newTime;
    setCurrentTime(newTime);
    
    // Show controls briefly after forwarding
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

  // Update video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Handle play state change
    const handlePlay = () => {
      setIsPlaying(true);
      showControls(); // Start the hide controls timeout
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      setControlsVisible(true); // Always show controls when paused
      
      // Clear any hide controls timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = null;
      }
    };
    
    // Handle time update
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    // Handle duration change
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    // Handle volume change
    const handleVolumeChangeEvent = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    
    // Handle progress (buffering)
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }
    };

    // Add all event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('volumechange', handleVolumeChangeEvent);
    video.addEventListener('progress', handleProgress);
    
    // Initial setup
    setDuration(video.duration || 0);
    setVolume(video.volume);
    setIsMuted(video.muted);
    
    // Clean up event listeners
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('volumechange', handleVolumeChangeEvent);
      video.removeEventListener('progress', handleProgress);
      
      // Clear any timeouts
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Effect to update document title with fullscreen state for testing
  useEffect(() => {
    if (isFullscreen) {
      document.title = 'Fullscreen Mode - Video Player';
    } else {
      document.title = 'Video Player';
    }

    // Return the title to normal on component unmount
    return () => {
      document.title = 'Video Player';
    };
  }, [isFullscreen]);

  // Effect to handle keyboard controls when in fullscreen
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
          handlePlayPause();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleRewind();
          break;
        case 'm':
          e.preventDefault();
          handleMuteToggle();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, isPlaying, toggleFullscreen]);

  return (
    <div 
      ref={playerContainerRef}
      className={`video-player-container relative overflow-hidden bg-black ${
        isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video'
      } ${className}`}
      onMouseMove={handleMouseMove}
      tabIndex={0} // Make container focusable for keyboard controls
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        className={`w-full h-full object-contain ${
          isFullscreen ? 'max-h-screen' : ''
        }`}
        onClick={handleVideoClick}
        preload="metadata"
      />
      
      {/* Large play/pause overlay button (for center of video) */}
      {!isPlaying && (
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-black/50 hover:bg-primary/80 active:bg-primary/90 transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={handlePlayPause}
          aria-label="Play video"
        >
          <svg className="w-10 h-10 mx-auto fill-white" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
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
      
      {/* Video Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/10 p-3 transition-all duration-300 ${
        controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <VideoPlayerControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          onPlayPause={handlePlayPause}
          onMuteToggle={handleMuteToggle}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          onRewind={handleRewind}
          onForward={handleForward}
          onSpeedChange={handleSpeedChange}
          onFullscreenToggle={toggleFullscreen}
        />
      </div>
    </div>
  );
}