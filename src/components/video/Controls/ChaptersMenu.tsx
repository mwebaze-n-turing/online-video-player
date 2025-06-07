// src/components/video/Controls/ChaptersMenu.tsx
import { useState, useRef } from 'react';
import { Chapter } from '@/types/video';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ChaptersIcon } from '../Icons';
import { ControlButton } from './ControlButton';

interface ChaptersMenuProps {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  onChapterSelect: (chapter: Chapter) => void;
  currentTime: number;
}

export const ChaptersMenu = ({ 
  chapters, 
  currentChapter, 
  onChapterSelect,
  currentTime
}: ChaptersMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  
  // Format time for display (MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate the progress for each chapter
  const getChapterProgress = (chapter: Chapter): number => {
    // If we're not in this chapter, return 0
    if (!currentChapter || chapter.id !== currentChapter.id) return 0;
    
    // Calculate the end time
    let endTime = chapter.endTime;
    if (!endTime) {
      const nextChapterIndex = chapters.findIndex(c => c.id === chapter.id) + 1;
      endTime = nextChapterIndex < chapters.length 
        ? chapters[nextChapterIndex].startTime
        : Infinity;
    }
    
    // Calculate progress percentage within this chapter
    const chapterDuration = endTime - chapter.startTime;
    const chapterCurrentTime = currentTime - chapter.startTime;
    const progress = Math.min(100, Math.max(0, (chapterCurrentTime / chapterDuration) * 100));
    
    return progress;
  };
  
  if (chapters.length === 0) {
    return null;
  }
  
  return (
    <div className="relative" ref={menuRef}>
      <ControlButton
        onClick={() => setIsOpen(!isOpen)}
        tooltipText="Chapters"
      >
        <ChaptersIcon />
      </ControlButton>
      
      {isOpen && (
        <div 
          className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-md shadow-lg overflow-hidden z-50"
          style={{ width: '280px', maxHeight: '300px', overflowY: 'auto' }}
        >
          <div className="p-2 bg-gray-800 sticky top-0 left-0 right-0 border-b border-gray-700">
            <h3 className="text-white text-sm font-medium">
              Chapters
            </h3>
          </div>
          <div className="py-1">
            {chapters.map((chapter) => {
              const isCurrentlyPlaying = currentChapter?.id === chapter.id;
              const progressPercent = getChapterProgress(chapter);
              
              return (
                <button
                  key={chapter.id}
                  className={`
                    flex items-start w-full p-2 text-left hover:bg-gray-800 
                    transition-colors relative overflow-hidden
                    ${isCurrentlyPlaying ? 'bg-gray-800' : ''}
                  `}
                  onClick={() => {
                    onChapterSelect(chapter);
                    setIsOpen(false);
                  }}
                >
                  {/* Progress indicator (only visible for current chapter) */}
                  {isCurrentlyPlaying && progressPercent > 0 && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-blue-600/30" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  )}
                  
                  <div className="z-10 flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-white text-sm font-medium">
                        {chapter.title}
                      </span>
                      <span className="text-gray-400 text-xs ml-2">
                        {formatTime(chapter.startTime)}
                      </span>
                    </div>
                    {chapter.description && (
                      <p className="text-gray-300 text-xs mt-1 leading-tight">
                        {chapter.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};