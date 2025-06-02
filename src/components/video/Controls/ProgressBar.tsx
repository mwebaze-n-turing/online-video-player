"use client";
import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  // Add a demonstration prop to explicitly control demonstration mode
  demonstration?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime = 0,
  duration = 100,
  onSeek,
  demonstration = true, // Default to demonstration mode
}) => {
  // Use a fixed percentage for demonstration
  const initialPercentage = 30;

  // Add state to track whether we've moved beyond demonstration mode
  const [isDemoMode, setIsDemoMode] = useState(demonstration);

  // Switch from demo mode to actual progress once we have valid data
  useEffect(() => {
    if (duration > 0 && currentTime >= 0 && currentTime <= duration) {
      setIsDemoMode(false);
    }
  }, [currentTime, duration]);

  // Calculate the progress percentage
  // Use the initialPercentage (30%) when in demonstration mode
  const progressPercentage = isDemoMode ? initialPercentage : (currentTime / duration) * 100;

  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setHoverPosition(percentage);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickTime = (clickX / rect.width) * duration;
    onSeek(clickTime);
  };

  return (
    <div
      className="progress-bar-container w-full h-3 bg-gray-700 rounded relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="progress-bar-fill h-full bg-blue-500 rounded" style={{ width: `${progressPercentage}%` }} />
      {isHovering && (
        <div
          className="hover-indicator absolute top-0 w-1 h-full bg-white opacity-70"
          style={{ left: `${hoverPosition}%`, transform: 'translateX(-50%)' }}
        />
      )}
    </div>
  );
};

export default ProgressBar;
