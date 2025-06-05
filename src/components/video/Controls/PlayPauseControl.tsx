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
    <button 
      className="control-button primary play-pause" 
      onClick={onPlayPause}
      data-state={isPlaying ? 'pause' : 'play'}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      <svg className="play-icon" viewBox="0 0 24 24" width="24" height="24">
        <path d="M8 5v14l11-7z" fill="#ffffff"/>
      </svg>
      <svg className="pause-icon" viewBox="0 0 24 24" width="24" height="24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="#ffffff"/>
      </svg>
    </button>
  );
};

export default PlayPauseControl;