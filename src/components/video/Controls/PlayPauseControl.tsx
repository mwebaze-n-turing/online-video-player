// src/components/video/Controls/PlayPauseControl.tsx
import React from 'react';
import ControlButton from './ControlButton';

interface PlayPauseControlProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

const PlayPauseControl: React.FC<PlayPauseControlProps> = ({
  isPlaying,
  onPlayPause
}) => {
  return (
  <div className="flex items-center">
    <ControlButton
        // icon={}
        className="w-6 h-6 transition-opacity duration-200 ease-in-out"
        // activeIcon={}
        duration-200
        isActive={isPlaying}
        label={isPlaying ? "Pause" : "Play"}
        onClick={onPlayPause}
      />
    </div>
  );
};

export default PlayPauseControl;