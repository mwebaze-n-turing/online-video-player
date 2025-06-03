import React from 'react';

interface ControlBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSeek: (time: number) => void;
  onFullscreen: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  currentTime = 0,
  duration = 0,
  volume = 1,
  isMuted = false,
  isFullscreen = false,
  onPlayPause,
  onVolumeChange,
  onToggleMute,
  onSeek,
  onFullscreen,
}) => {
  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    if (!timeInSeconds) return '0:00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-sm text-white p-4 flex items-center justify-between">
      {/* Left side controls - Play/Pause and time */}
      <div className="flex items-center space-x-3">
        {/* Play/Pause Button */}
        <button onClick={onPlayPause} className="p-2 rounded hover:bg-white/10 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6 fill-current">
            {isPlaying ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>

        {/* Time display */}
        <div className="text-sm font-medium">
          <span>{formatTime(currentTime)}</span>
          <span className="mx-1">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex-grow mx-4 h-1 bg-gray-600 rounded overflow-hidden">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>

      {/* Right side controls - Volume and Fullscreen */}
      <div className="flex items-center space-x-3">
        {/* Volume Button */}
        <button onClick={onToggleMute} className="p-2 rounded hover:bg-white/10 transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6 fill-current">
            {isMuted ? (
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            )}
          </svg>
        </button>

        {/* Volume Slider (can be implemented as needed) */}
        <div className="hidden sm:block w-20">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            className="w-full"
            onChange={e => onVolumeChange(parseFloat(e.target.value))}
            aria-label="Volume level"
          />
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={onFullscreen}
          className="p-2 rounded hover:bg-white/10 transition-colors"
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6 fill-current">
            {isFullscreen ? (
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            ) : (
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
