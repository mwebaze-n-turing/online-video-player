// src/components/video/Controls/ControlBar.tsx
import { FC, useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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
}) => {
  const { resolvedTheme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  
  // Format time (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Auto-hide controls after inactivity
  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;
    
    if (isPlaying && !isDragging) {
      hideTimeout = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    }
    
    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [isPlaying, isDragging]);

  // Handle mouse movement to show controls
  const handleMouseMove = useCallback(() => {
    setIsControlsVisible(true);
  }, []);

  // Apply theme-based styling
  const controlsClasses = `
    control-bar
    absolute bottom-0 left-0 right-0
    px-4 py-2 
    transition-opacity duration-300
    ${isControlsVisible ? 'opacity-100' : 'opacity-0'}
    ${resolvedTheme === 'dark' 
      ? 'bg-gradient-to-t from-gray-900 to-transparent text-white' 
      : 'bg-gradient-to-t from-gray-800 to-transparent text-white'}
    ${className}
  `;

  // Button styles based on theme
  const buttonClasses = `
    p-2 rounded-full 
    focus:outline-none focus:ring-2
    theme-transition
    ${resolvedTheme === 'dark'
      ? 'text-gray-200 hover:text-white focus:ring-blue-500'
      : 'text-gray-200 hover:text-white focus:ring-blue-400'}
  `;

  // Progress bar styles based on theme
  const progressBarClasses = `
    relative w-full h-2 my-2 rounded-full cursor-pointer
    ${resolvedTheme === 'dark'
      ? 'bg-gray-700'
      : 'bg-gray-600'}
  `;

  const progressFillClasses = `
    absolute top-0 left-0 h-full rounded-full
    ${resolvedTheme === 'dark'
      ? 'bg-blue-500'
      : 'bg-blue-400'}
  `;

  const bufferedFillClasses = `
    absolute top-0 left-0 h-full rounded-full
    ${resolvedTheme === 'dark'
      ? 'bg-gray-600'
      : 'bg-gray-500'}
  `;

  // Volume slider theme
  const volumeSliderClasses = `
    w-20 h-1 rounded-full appearance-none cursor-pointer
    ${resolvedTheme === 'dark'
      ? 'bg-gray-700'
      : 'bg-gray-600'}
  `;

  return (
    <div 
      className={controlsClasses}
      onMouseMove={handleMouseMove}
    >
      {/* Progress bar / seek bar */}
      <div className={progressBarClasses} onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        onSeek(videoDuration * pos);
      }}>
        {/* Buffered progress */}
        <div 
          className={bufferedFillClasses} 
          style={{ width: `${(bufferedTime / videoDuration) * 100}%` }}
        />
        
        {/* Playback progress */}
        <div 
          className={progressFillClasses} 
          style={{ width: `${(currentTime / videoDuration) * 100}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Play/Pause button */}
          <button 
            className={buttonClasses}
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
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
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : volume < 0.5 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3.75a.75.75 0 00-1.264-.546L5.46 7H2.75A1.75 1.75 0 001 8.75v2.5c0 .966.784 1.75 1.75 1.75h2.71l3.276 3.796a.75.75 0 001.264-.546V3.75zm2.004 3.459a.75.75 0 00-1.008 1.116 2.5 2.5 0 010 3.35.75.75 0 001.008 1.116 4 4 0 000-5.582z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3.75a.75.75 0 00-1.264-.546L5.46 7H2.75A1.75 1.75 0 001 8.75v2.5c0 .966.784 1.75 1.75 1.75h2.71l3.276 3.796a.75.75 0 001.264-.546V3.75zM14.751 9.05a.75.75 0 00-1.026.273 7.532 7.532 0 010 1.354.75.75 0 101.026.274 9.032 9.032 0 000-1.9zm-2.245-.643a.75.75 0 00-1.008 1.116 2.5 2.5 0 010 3.35.75.75 0 001.008 1.116 4 4 0 000-5.582z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {/* Volume slider (conditionally rendered) */}
            {showVolumeSlider && (
              <div 
                className="absolute left-0 bottom-10 p-2 rounded theme-transition"
                style={{ 
                  backgroundColor: resolvedTheme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(0, 0, 0, 0.7)'
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
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
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
        
        {/* Right controls */}
        <div className="flex items-center space-x-2">
          {/* Fullscreen button */}
          <button 
            className={buttonClasses}
            onClick={onToggleFullscreen}
            aria-label="Toggle fullscreen"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;