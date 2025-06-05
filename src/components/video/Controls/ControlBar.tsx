// src/components/video/Controls/ControlBar.tsx
import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import VolumeControl from './VolumeControl';

interface ControlBarProps {
  videoDuration: number;
  currentTime: number;
  bufferedTime: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  className?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  isFullscreen?: boolean;
  fullscreenEnabled?: boolean;
}

export const ControlBar: FC<ControlBarProps> = ({
  videoDuration,
  currentTime,
  bufferedTime,
  isPlaying,
  volume,
  isMuted,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  className = '',
  videoRef,
  isFullscreen = false,
  fullscreenEnabled = true,
}) => {
  const { resolvedTheme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  // const [isControlsVisible, setIsControlsVisible] = useState(true); // Managed by parent now
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [bufferedPercent, setBufferedPercent] = useState(0);

  // Calculate the playback percentage using props from parent
  const playbackPercent = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  // Format time (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Update buffered progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleProgress = () => {
      if (video.buffered.length > 0 && videoDuration > 0) {
        setBufferedPercent((video.buffered.end(video.buffered.length - 1) / videoDuration) * 100);
      }
    };

    // Add event listener
    video.addEventListener('progress', handleProgress);

    return () => {
      // Remove event listeners on cleanup
      video.removeEventListener('progress', handleProgress);
    };
  }, [videoRef, videoDuration]);

  // Auto-hide controls is now managed by parent VideoPlayer component
  
  // Handle mouse movement (simplified)
  const handleMouseMove = useCallback(() => {
    // Controls visibility managed by parent
  }, []);

  // Handle progress bar click for seeking
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;

    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;

    // Calculate the seek time based on click position (0 to 1) and video duration
    const seekTime = clickPosition * videoDuration;

    // Seek to the calculated time
    onSeek(seekTime);
  };

  // Handle mouse movement over progress bar for hover effect
  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const hoverPercent = ((e.clientX - rect.left) / rect.width) * 100;

    setHoverPosition(hoverPercent);
  };

  const baseButtonClasses = `
  relative rounded-full bg-black/50 p-2.5 text-white 
  hover:bg-black/80 hover:scale-110 hover:text-blue-200
  active:scale-95 active:bg-blue-900/70 active:duration-75
  focus:outline-none focus:ring-2 focus:ring-blue-400 
  focus:ring-offset-1 focus:ring-offset-black/20
  disabled:opacity-50 disabled:pointer-events-none
  transition-all duration-150 ease-in-out
`;

  const primaryButtonClasses = `
  ${baseButtonClasses}
  p-3.5 
  hover:bg-blue-700/70 
  active:bg-blue-800/90
`;

  // Volume button with special hover behavior for slider
  const volumeButtonClasses = `
  ${baseButtonClasses}
  group
`;

  // Button with icon rotation (Settings)
  const rotatingButtonClasses = `
  ${baseButtonClasses}
  [&>svg]:transition-transform 
  [&>svg]:duration-300
  hover:[&>svg]:rotate-30 
  active:[&>svg]:rotate-90 
  active:[&>svg]:duration-150
`;

  // Apply theme-based styling
  const controlsClasses = `
    control-bar
    absolute bottom-0 left-0 right-0
    px-4 py-2 
    transition-opacity duration-300
    opacity-100
    ${
      resolvedTheme === 'dark'
        ? 'bg-gradient-to-t from-gray-900 to-transparent text-white'
        : 'bg-gradient-to-t from-gray-800 to-transparent text-white'
    }
    ${className}
  `;

  // Button styles based on theme
  const buttonClasses = `
    p-2 rounded-full 
    focus:outline-none focus:ring-2
    theme-transition
    ${
      resolvedTheme === 'dark' ? 'text-gray-200 hover:text-white focus:ring-blue-500' : 'text-gray-200 hover:text-white focus:ring-blue-400'
    }
  `;

  // Progress bar styles based on theme
  const progressBarClasses = `
    relative w-full h-2 my-2 rounded-full cursor-pointer
    ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-600'}
  `;

  const progressBarBackgroundClasses = `
      absolute top-0 left-0 h-full w-full rounded-full
      ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-600'}
    `;

  const progressFillClasses = `
    absolute top-0 left-0 h-full rounded-full
    ${resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}
  `;

  const bufferedFillClasses = `
    absolute top-0 left-0 h-full rounded-full
    ${resolvedTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'}
  `;

  const hoverIndicatorClasses = `
      absolute top-0 h-full w-0.5 bg-white opacity-50
      transition-opacity duration-100
    `;

  // Volume slider theme
  const volumeSliderClasses = `
    w-20 h-1 rounded-full appearance-none cursor-pointer
    ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-600'}
  `;

  return (
    <div className={controlsClasses} onMouseMove={handleMouseMove}>
      {/* Progress bar / seek bar */}
      <div
        className={progressBarClasses}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleProgressBarMouseMove}
        onClick={handleProgressBarClick}
        ref={progressBarRef}
      >
        {/* Base progress bar */}
        <div className={progressBarBackgroundClasses}></div>
        {/* Buffered progress */}
        <div className={bufferedFillClasses} style={{ width: `${bufferedPercent}%` }} />

        {/* Playback progress */}
        <div className={progressFillClasses} style={{ width: `${playbackPercent}%` }} />

        {/* Hover indicator */}
        {isHovering && <div className={hoverIndicatorClasses} style={{ left: `${hoverPosition}%` }} />}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Play/Pause button */}
          <button className={buttonClasses} onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Volume control */}
          <div className="relative flex items-center">
            <button
              className={buttonClasses}
              onClick={onToggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : volume < 0.5 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 3.75a.75.75 0 00-1.264-.546L5.46 7H2.75A1.75 1.75 0 001 8.75v2.5c0 .966.784 1.75 1.75 1.75h2.71l3.276 3.796a.75.75 0 001.264-.546V3.75zm2.004 3.459a.75.75 0 00-1.008 1.116 2.5 2.5 0 010 3.35.75.75 0 001.008 1.116 4 4 0 000-5.582z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 3.75a.75.75 0 00-1.264-.546L5.46 7H2.75A1.75 1.75 0 001 8.75v2.5c0 .966.784 1.75 1.75 1.75h2.71l3.276 3.796a.75.75 0 001.264-.546V3.75zM14.751 9.05a.75.75 0 00-1.026.273 7.532 7.532 0 010 1.354.75.75 0 101.026.274 9.032 9.032 0 000-1.9zm-2.245-.643a.75.75 0 00-1.008 1.116 2.5 2.5 0 010 3.35.75.75 0 001.008 1.116 4 4 0 000-5.582z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Volume slider (conditionally rendered) */}
            {showVolumeSlider && (
              <div
                className="absolute left-0 bottom-10 p-2 rounded theme-transition"
                style={{
                  backgroundColor: resolvedTheme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                }}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={e => onVolumeChange(parseFloat(e.target.value))}
                  className={volumeSliderClasses}
                  aria-label="Volume"
                />
              </div>
            )}
          </div>

          {/* Time display */}
          <div className="text-sm text-white">
            {formatTime(currentTime)} / {formatTime(videoDuration)}
          </div>
        </div>

        <button
          className="relative rounded-full bg-black/50 p-2.5 text-white
             hover:bg-black/80 hover:scale-110 
             active:scale-95 active:bg-black/90
             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/20
             transition-all duration-150 ease-in-out"
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 transform translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Right controls */}
        <div className="flex items-center space-x-2">
          {/* Fullscreen button */}
          <VolumeControl videoRef={videoRef} />
          <button className={buttonClasses} onClick={onToggleFullscreen} aria-label="Toggle fullscreen">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
