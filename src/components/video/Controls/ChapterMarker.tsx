// src/components/video/Controls/ChapterMarker.tsx
import { useState } from 'react';
import { Chapter } from '@/types/video';

interface ChapterMarkerProps {
  chapter: Chapter;
  duration: number;
  isCurrentChapter: boolean;
  onClick: () => void;
}

export const ChapterMarker = ({ 
  chapter, 
  duration, 
  isCurrentChapter,
  onClick 
}: ChapterMarkerProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Calculate position as percentage of video duration
  const position = (chapter.startTime / duration) * 100;
  
  // Format time for display (MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div
      className="absolute z-20"
      style={{ left: `${position}%` }}
    >
      <button
        className={`
          w-1.5 h-6 transform -translate-x-1/2 -translate-y-1/2 
          rounded-full cursor-pointer transition-all focus:outline-none
          ${isCurrentChapter ? 'bg-blue-500' : 'bg-white'}
          hover:scale-125 focus:scale-125 hover:bg-blue-400
        `}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={`Jump to chapter: ${chapter.title}`}
        style={{
          top: '50%',
          backgroundColor: isCurrentChapter ? (chapter.color || '#3b82f6') : 'white'
        }}
      />
      
      {/* Chapter tooltip */}
      {showTooltip && (
        <div 
          className="absolute bottom-full mb-2 transform -translate-x-1/2 
                     bg-gray-900 text-white text-xs px-2 py-1 rounded z-30 whitespace-nowrap"
          style={{
            left: '0',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
          }}
        >
          <div className="font-medium">{chapter.title}</div>
          <div className="text-gray-300">
            {formatTime(chapter.startTime)}
          </div>
        </div>
      )}
    </div>
  );
};