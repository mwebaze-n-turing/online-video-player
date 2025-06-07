"use client";
// src/components/video/Controls/ProgressBar.tsx
import React, { useRef, useEffect, useState, MouseEvent, useCallback } from 'react';
import { OptimizedThumbnailPreview } from './OptimizedThumbnailPreview';
import { ChapterMarker } from './ChapterMarker';
import { Chapter } from '@/types/video';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: TimeRanges | null;
  onSeek: (time: number) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  thumbnailSprite?: {
    url: string;
    width: number;
    height: number;
    interval: number;
    columns: number;
  };
  chapters?: Chapter[];
  currentChapter?: Chapter | null;
  onChapterClick?: (chapter: Chapter) => void;
}

export const ProgressBar = ({
  currentTime,
  duration,
  buffered,
  onSeek,
  videoRef,
  thumbnailSprite,
  chapters = [],
  currentChapter,
  onChapterClick,
}: ProgressBarProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPixelPosition, setHoverPixelPosition] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setHoverPixelPosition(e.clientX - rect.left);
  }, [duration]);
  
  // Handle click on progress bar (seeking)
  const handleClick = (e: MouseEvent) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(clickPosition * duration);
  };
  
  // Handle mouse down for potential drag seeking
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    handleClick(e);
  };
  
  // Handle mouse up to end drag seeking
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add global mouse up and move listeners when dragging
  useEffect(() => {
    if (!isDragging) return;
    
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (!progressRef.current || !duration) return;
      
      const rect = progressRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverPosition(position * 100);
      setHoverTime(position * duration);
      onSeek(position * duration);
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, duration, onSeek]);
  
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
          className="absolute h-full bg-white bg-opacity-40 rounded-full"
          style={{
            left: `${startPercentage}%`,
            width: `${width}%`,
          }}
        />
      );
    }

    return ranges;
  };

  // Render chapter segments (background coloring of the progress bar)
  const renderChapterSegments = () => {
    if (!chapters.length || !duration) return null;

    return chapters.map((chapter, index) => {
      const startPercentage = (chapter.startTime / duration) * 100;
      
      // Calculate end time - either from chapter.endTime or the next chapter's start time
      let endTime = chapter.endTime;
      if (!endTime && chapters[index + 1]) {
        endTime = chapters[index + 1].startTime;
      } else if (!endTime) {
        endTime = duration;
      }
      
      const endPercentage = (endTime / duration) * 100;
      const width = endPercentage - startPercentage;
      
      const isCurrentChapterSegment = 
        currentChapter && currentChapter.id === chapter.id;
      
      return (
        <div 
          key={chapter.id}
          className={`absolute h-full ${
            isCurrentChapterSegment ? 'bg-blue-900/30' : 'bg-gray-800/30'
          } z-10`}
          style={{
            left: `${startPercentage}%`,
            width: `${width}%`,
            backgroundColor: chapter.color ? `${chapter.color}30` : undefined
          }}
        />
      );
    });
  };

  return (
    <div ref={containerRef} className="relative group w-full">
      {/* Thumbnail preview */}
      {hoverTime !== null && hoverPixelPosition !== null && (
        <div
          className="absolute bottom-full mb-2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white rounded p-2 pointer-events-none z-20"
          style={{ left: `${hoverPixelPosition}px` }}
        >
          <OptimizedThumbnailPreview 
            video={videoRef.current} 
            previewTime={hoverTime} 
            position={hoverPixelPosition}
            total={duration}
            containerRef={containerRef}
            spriteSheet={thumbnailSprite}
          />
        </div>
      )}
      
      <div 
        className="relative h-2 bg-gray-700 rounded-full cursor-pointer hover:h-4 transition-all"
        ref={progressRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseMove}
        onMouseLeave={() => {
          setHoverPosition(null);
          setHoverTime(null);
          setHoverPixelPosition(null);
        }}
      >
        {/* Chapter segments in background */}
        {renderChapterSegments()}
        
        {/* Buffer progress bars (potentially multiple) */}
        {renderBufferRanges()}
        
        {/* Playback progress bar */}
        <div
          className="absolute h-full bg-blue-500 rounded-full z-20"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* Chapter markers */}
        {chapters.map((chapter) => (
          <ChapterMarker 
            key={chapter.id}
            chapter={chapter}
            duration={duration}
            isCurrentChapter={currentChapter?.id === chapter.id}
            onClick={() => onChapterClick?.(chapter)}
          />
        ))}
        
        {/* Hover indicator */}
        {hoverPosition !== null && (
          <div className="absolute h-full w-1 bg-white opacity-70 transform -translate-x-1/2 z-30 pointer-events-none" style={{ left: `${hoverPosition}%` }} />
        )}
        
        {/* Progress handle */}
        <div className="absolute h-4 w-4 rounded-full bg-white -mt-1 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-30" style={{ left: `${progressPercentage}%`, top: '50%' }} />
      </div>
    </div>
  );
};