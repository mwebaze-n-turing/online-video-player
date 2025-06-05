// src/components/video/Controls/PlaybackSpeedControl.tsx
import React, { useState, useRef, useEffect } from 'react';
import ControlButton from './ControlButton';

interface PlaybackSpeedControlProps {
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
}

const PlaybackSpeedControl: React.FC<PlaybackSpeedControlProps> = ({ playbackRate, onPlaybackRateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Available speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Format the current playback rate for display
  const formatRate = (rate: number) => {
    return rate === 1 ? 'Normal' : `${rate}x`;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <ControlButton
        icon={<span className="text-xs font-mono tabular-nums">{formatRate(playbackRate)}</span>}
        label="Playback Speed"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      />

      <div
        className={`
          absolute bottom-full right-0 mb-2 
          bg-gray-900 border border-gray-700 rounded-md shadow-lg
          overflow-hidden transition-all duration-200 ease-in-out
          ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
        style={{ minWidth: '120px' }}
      >
        <div className="py-1">
          {speedOptions.map(speed => (
            <button
              key={speed}
              className={`
                w-full px-4 py-2 text-left text-sm 
                transition-all duration-150
                hover:bg-blue-600 
                ${playbackRate === speed ? 'bg-blue-700 text-white' : 'text-gray-200'}
              `}
              onClick={() => {
                onPlaybackRateChange(speed);
                setIsOpen(false);
              }}
            >
              {formatRate(speed)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaybackSpeedControl;
