// VideoPlayerControls.tsx
import { useState } from 'react';
import EnhancedVolumeControl from './EnhancedVolumeControl';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onRewind: () => void;
  onForward: () => void;
  onSpeedChange: (speed: number) => void;
  onFullscreenToggle: () => void;
}

// Time formatter helper function
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default function VideoPlayerControls({ 
  isPlaying, 
  isMuted, 
  volume,
  currentTime,
  duration,
  playbackRate,
  isFullscreen,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onSeek,
  onRewind,
  onForward,
  onSpeedChange,
  onFullscreenToggle
}: VideoPlayerControlsProps) {
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  
  return (
    <div className="control-bar absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300">
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-2 items-center">
        {/* Left controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPause}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-primary/80 active:bg-primary/90 transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-white group-hover:fill-white" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-white group-hover:fill-white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </button>
          
          <button
            onClick={onRewind}
            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-black/50 hover:bg-gray-800/80 active:bg-gray-700/90 transition-all duration-150 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Rewind 10 seconds"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-1.1 11H10v-3.3L9 13v-.7l1.8-.6h.1V16z" />
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              -10s
            </span>
          </button>
          
          <button
            onClick={onForward}
            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-black/50 hover:bg-gray-800/80 active:bg-gray-700/90 transition-all duration-150 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Forward 10 seconds"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z" />
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              +10s
            </span>
          </button>
        </div>

        {/* Center controls - Progress bar */}
        <div className="group relative h-9 flex items-center">
          <div 
            className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer transition-all group-hover:h-2.5"
            onClick={onSeek}
          >
            <div 
              className="h-full bg-primary transition-all group-hover:bg-primary-bright"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/60 px-2 py-0.5 rounded-full font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center justify-end space-x-2">
          {/* Enhanced Volume control */}
          <EnhancedVolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onMuteToggle={onMuteToggle}
          />

          {/* Playback speed */}
          <div className="relative">
            <button
              onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
              className="group flex items-center justify-center w-9 h-9 rounded-full bg-black/50 hover:bg-gray-800/80 active:bg-gray-700/90 transition-all duration-150 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Playback speed"
              aria-expanded={speedMenuOpen}
              aria-controls="speed-menu"
            >
              <span className="text-white text-xs font-mono">{playbackRate}x</span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Speed
              </span>
            </button>
            
            {speedMenuOpen && (
              <div 
                id="speed-menu"
                className="absolute bottom-12 right-0 bg-black/90 rounded-md shadow-lg overflow-hidden w-24 origin-bottom-right animate-scale-in z-50 border border-gray-700"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      onSpeedChange(speed);
                      setSpeedMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-all duration-150 hover:bg-primary/70 active:bg-primary/90 ${
                      playbackRate === speed
                        ? 'bg-primary/80 text-white font-medium'
                        : 'text-white/90 hover:translate-x-1'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings button */}
          <button
            onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-black/50 hover:bg-gray-800/80 active:bg-gray-700/90 transition-all duration-150 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Settings"
            aria-expanded={settingsMenuOpen}
          >
            <svg 
              className={`w-5 h-5 fill-white transition-transform duration-300 ${
                settingsMenuOpen ? 'rotate-90' : ''
              } group-hover:rotate-30`} 
              viewBox="0 0 24 24"
            >
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Settings
            </span>
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={onFullscreenToggle}
            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-black/50 hover:bg-gray-800/80 active:bg-gray-700/90 transition-all duration-150 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}