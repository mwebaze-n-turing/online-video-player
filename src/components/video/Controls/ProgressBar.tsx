import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  demonstration?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime = 0,
  duration = 100,
  onSeek,
  demonstration = true
}) => {
  const initialPercentage = 30;
  const [isDemoMode, setIsDemoMode] = useState(demonstration);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);

  useEffect(() => {
    if (duration > 0 && currentTime >= 0 && currentTime <= duration) {
      setIsDemoMode(false);
    }
  }, [currentTime, duration]);

  const progressPercentage = isDemoMode
    ? initialPercentage
    : (currentTime / duration) * 100;

  // Handle mouse movement over the progress bar
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBarContainer = e.currentTarget;
    const rect = progressBarContainer.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setHoverPosition(Math.max(0, Math.min(100, position)));
  };

  // Handle click on the progress bar
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const progressBarContainer = e.currentTarget;
    const rect = progressBarContainer.getBoundingClientRect();
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
      className="progress-bar-container w-full py-2 group cursor-pointer hover:bg-gray-900/10 rounded-lg transition-colors"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div 
        className="progress-bar relative h-2 bg-gray-600 rounded-full overflow-hidden transition-all group-hover:h-3"
      >
        {/* Main progress indicator */}
        <div 
          className="progress-indicator absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Full-width hover feedback line */}
        {isHovering && (
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 bottom-0 w-px bg-white opacity-50" style={{ left: `${hoverPosition}%` }} />
          </div>
        )}
        
        {/* Hover indicator */}
        {isHovering && (
          <div 
            className="hover-indicator absolute top-0 h-full bg-blue-300 opacity-30 rounded-full"
            style={{ width: `${hoverPosition}%` }}
          />
        )}
        
        {/* Hover position marker */}
        {isHovering && (
          <div 
            className="hover-marker absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 border-2 border-blue-500"
            style={{ left: `${hoverPosition}%` }}
          />
        )}

        {/* Time tooltip */}
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
