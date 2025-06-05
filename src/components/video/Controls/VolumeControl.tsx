// src/components/video/Controls/VolumeControl.tsx
import React, { useState } from 'react';
import { VolumeUp, VolumeDown, VolumeMute } from 'your-icon-library';
import ControlButton from './ControlButton';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, isMuted, onVolumeChange, onMuteToggle }) => {
  const [isSliderVisible, setIsSliderVisible] = useState(false);

  // Determine which icon to show based on volume state
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeMute className="w-5 h-5" />;
    if (volume < 0.5) return <VolumeDown className="w-5 h-5" />;
    return <VolumeUp className="w-5 h-5" />;
  };

  return (
    <div
      className="relative flex items-center group"
      onMouseEnter={() => setIsSliderVisible(true)}
      onMouseLeave={() => setIsSliderVisible(false)}
    >
      <ControlButton
        icon={getVolumeIcon()}
        label={isMuted ? 'Unmute' : 'Mute'}
        onClick={onMuteToggle}
        variant="primary"
        isActive={isMuted}
      />
      <div
        className={`ml-1 w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSliderVisible ? 'w-20 opacity-100' : 'opacity-0'
        } group-hover:w-20 group-hover:opacity-100`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={e => onVolumeChange(parseFloat(e.target.value))}
          className="volume-slider w-full accent-blue-500 cursor-pointer"
          style={
            {
              '--track-color': 'rgba(255, 255, 255, 0.3)',
              '--track-filled': `linear-gradient(90deg, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, var(--track-color) 0%)`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
};

export default VolumeControl;
