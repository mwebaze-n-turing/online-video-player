import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  demonstration?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime = 0, duration = 100, onSeek, demonstration = true }) => {
  const initialPercentage = 30;
  const [isDemoMode, setIsDemoMode] = useState(demonstration);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);

  useEffect(() => {
    if (duration > 0 && currentTime >= 0 && currentTime <= duration) {
      setIsDemoMode(false);
    }
  }, [currentTime, duration]);

  const progressPercentage = isDemoMode ? initialPercentage : (currentTime / duration) * 100;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setHoverPosition(Math.max(0, Math.min(100, position)));
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = duration * clickPosition;
    onSeek(seekTime);
  };

  const formatTimeFromPosition = (positionPercent: number): string => {
    const estimatedTime = (positionPercent / 100) * duration;
    const minutes = Math.floor(estimatedTime / 60);
    const seconds = Math.floor(estimatedTime % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className="progress-bar-container w-full py-2 group cursor-pointer hover:opacity-90 transition-opacity"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      title="Seek"
    >
      <div className="progress-bar relative h-2 bg-gray-600 rounded-full overflow-hidden transition-all duration-200 group-hover:h-3 group-hover:bg-gray-500">
        {/* Main progress indicator */}
        <div
          className="progress-indicator absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Hover indicator */}
        {isHovering && (
          <div
            className="hover-indicator absolute top-0 h-full bg-blue-300 opacity-40 rounded-full transition-all duration-75"
            style={{ width: `${hoverPosition}%` }}
          />
        )}

        {/* Hover position marker */}
        {isHovering && (
          <div
            className="hover-marker absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 border-2 border-blue-500 z-10 transition-transform duration-100 scale-100 group-hover:scale-110"
            style={{ left: `${hoverPosition}%` }}
          />
        )}

        {/* Time tooltip on hover */}
        {isHovering && (
          <div
            className="time-tooltip absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-md transform -translate-x-1/2 opacity-90"
            style={{ left: `${hoverPosition}%` }}
          >
            {formatTimeFromPosition(hoverPosition)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
