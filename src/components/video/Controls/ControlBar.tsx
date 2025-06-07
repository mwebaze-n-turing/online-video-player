// src/components/video/Controls/ControlBar.tsx
import React from 'react';
import { ControlButton } from './ControlButton';
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeMuteIcon, FullscreenIcon, SpeedIcon } from '../Icons';

interface ControlBarProps {
  isPlaying: boolean;
  togglePlay: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isFullscreen: boolean;
  // Other props...
}

export const ControlBar = ({
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  toggleFullscreen,
  isFullscreen,
  currentSpeed,
  onSpeedChange,
  // Other props...
}: ControlBarProps) => {
  
  const speeds = [0.5, 1, 1.25, 1.5, 2];
  
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-t from-black/80 to-transparent">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <ControlButton
          onClick={togglePlay}
          tooltipText={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </ControlButton>
        {/* Time display component could go here */}
      </div>
      
      {/* Center section */}
      <div className="flex-1 mx-4">
        {/* Progress bar component */}
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-2">
        <ControlButton
          onClick={toggleMute}
          tooltipText={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
        </ControlButton>
        {/* Volume slider */}
        
        {/* Playback speed dropdown */}
        <div className="relative">
          <ControlButton
            onClick={() => {}} // Toggle dropdown visibility
            tooltipText="Playback Speed"
          >
            <SpeedIcon />
            <span className="ml-1 text-xs">
              {currentSpeed}x
            </span>
          </ControlButton>
          {/* Speed dropdown menu would go here */}
        </div>
        
        <ControlButton
          onClick={toggleFullscreen}
          tooltipText={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          <FullscreenIcon />
        </ControlButton>
      </div>
    </div>
  );
};

export default ControlBar;
