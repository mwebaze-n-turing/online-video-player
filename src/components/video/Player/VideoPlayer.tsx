"use client"
import React, { useRef, useState, useEffect } from 'react';
import { VideoPlayerProps } from './types';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { ControlBar } from '@/components/video/Controls/ControlBar';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  title,
  className = '',
  width = '100%',
  height = 'auto',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    playing,
    progress,
    volume,
    muted: isMuted,
    fullscreen,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    setVolume,
    setProgress,
    formatTime,
  } = useVideoPlayer(videoRef, containerRef);

  // Hide controls after 3 seconds of inactivity
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (playing) {
        setIsControlsVisible(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Handle seeking in the video
  const handleSeek = (seekTime: number) => {
    if (videoRef.current) {
      const newTime = (seekTime / 100) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <div 
      className={`video-player relative overflow-hidden bg-black rounded-lg ${className}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setIsControlsVisible(false)}
    >
      {/* Video container with proper positioning */}
      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          className="w-full h-full"
          onClick={togglePlay}
          playsInline
        />
      </div>
      
      {/* Video Title Overlay */}
      {title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
          <h2 className="text-white text-lg font-semibold">{title}</h2>
        </div>
      )}
      
      {/* Subtitle Area */}
      <div className="absolute bottom-20 left-4 right-4 text-center text-white text-lg z-10">
        {/* Subtitles will be rendered here */}
      </div>
      
      {/* Play/Pause Overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button 
            onClick={togglePlay}
            className="p-4 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            aria-label="Play video"
          >
            <svg viewBox='0 0 24 24' width='24' height='24' className='w-10 h-10 fill-current text-white'>
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Integrated Control Bar Component */}
      {controls && (
        <div className={`transition-opacity ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
          <ControlBar
            isPlaying={playing}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            isFullscreen={fullscreen}
            onPlayPause={togglePlay}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            onSeek={handleSeek}
            onFullscreen={toggleFullscreen}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;