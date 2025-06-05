// src/components/video/Controls/VolumeControl.tsx
import React, { useState } from 'react';

interface VolumeControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ videoRef }) => {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isSliderVisible, setIsSliderVisible] = useState(false);

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Hardcoded SVG icons
  const VolumeUpIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.414 1 1 0 010-1.415z" clipRule="evenodd" />
    </svg>
  );

  const VolumeDownIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.828 8.172a1 1 0 011.414 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.758 2.828 1 1 0 01-1.414-1.414A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.414 1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  const VolumeMuteIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  // Determine which icon to show based on volume state
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeMuteIcon />;
    if (volume < 0.5) return <VolumeDownIcon />;
    return <VolumeUpIcon />;
  };

  const buttonClasses = `
    relative flex items-center justify-center
    rounded-full p-2 focus:outline-none
    transition-all duration-200
    hover:scale-110 active:scale-95
    focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-75
    text-white bg-black bg-opacity-0
    hover:bg-opacity-20 active:bg-opacity-30
    ${isMuted ? 'text-blue-400 hover:text-blue-300' : ''}
  `;

  return (
    <div
      className="relative flex items-center group"
      onMouseEnter={() => setIsSliderVisible(true)}
      onMouseLeave={() => setIsSliderVisible(false)}
    >
      <button
        className={buttonClasses}
        onClick={handleMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>
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
          onChange={e => handleVolumeChange(parseFloat(e.target.value))}
          className="volume-slider w-full accent-blue-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default VolumeControl;
