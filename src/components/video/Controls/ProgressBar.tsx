"use client";
// src/components/video/Controls/ProgressBar.tsx
import React, { useRef, useEffect, useState, MouseEvent, useCallback } from 'react';
import { Tooltip } from '../../common/Tooltip';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: TimeRanges | null;
  onSeek: (time: number) => void;
}

export const ProgressBar = ({
  currentTime,
  duration,
  buffered,
  onSeek,
}: ProgressBarProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate percentage for current playback position
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  
  // Convert seconds to MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle mouse movement over progress bar
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(position * 100);
    setHoverTime(position * duration);
  }, [duration]);
  
  // Handle click on progress bar (seeking)
  const handleClick = (e: MouseEvent) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(clickPosition * duration);
  };
  
  // Render buffer ranges
  const renderBufferRanges = () => {
    if (!buffered || !duration) return null;
    
    const ranges = [];
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i);
      const end = buffered.end(i);
      
      // Calculate start and end percentages based on video duration
      const startPercentage = (start / duration) * 100;
      const endPercentage = (end / duration) * 100;
      const width = endPercentage - startPercentage;
      
      ranges.push(
        <div
          key={i}
          className="absolute h-full bg-gray-500 rounded-full"
          style={{
            left: `${startPercentage}%`,
            width: `${width}%`,
          }}
        />
      );
    }

    return ranges;
  };

  return (
    <div
      className="group relative h-2 bg-gray-700 rounded-full cursor-pointer"
      ref={progressRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoverPosition(null);
        setHoverTime(null);
      }}
    >
      {/* Buffer progress bars (potentially multiple) */}
      {renderBufferRanges()}

      {/* Playback progress bar */}
      <div
        className="absolute h-full bg-blue-500 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      />
      
      {/* Hover time indicator */}
      {hoverPosition !== null && hoverTime !== null && (
        <div 
          className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded transform -translate-x-1/2 pointer-events-none"
          style={{ left: `${hoverPosition}%` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
      
      {/* Progress handle (appears on hover) */}
      <div
        className="absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${progressPercentage}%` }}
      />
    </div>
  );
};