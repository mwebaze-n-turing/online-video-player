import React from 'react';
// src/components/video/Controls/TimeDisplay.tsx
interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

export const TimeDisplay = ({ currentTime, duration }: TimeDisplayProps) => {
  // Format time from seconds to MM:SS or HH:MM:SS format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="text-white text-sm font-mono">
      <span className="text-blue-400">
        {formatTime(currentTime)}
      </span>
      <span className="text-gray-400 mx-1">
        /
      </span>
      <span className="text-gray-300">
        {formatTime(duration)}
      </span>
    </div>
  );
};