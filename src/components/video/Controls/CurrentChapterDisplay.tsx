// src/components/video/Controls/CurrentChapterDisplay.tsx
import { Chapter } from '@/types/video';

interface CurrentChapterDisplayProps {
  chapter: Chapter | null;
  currentTime: number;
  compact?: boolean;
}

export const CurrentChapterDisplay = ({
  chapter,
  currentTime,
  compact = false
}: CurrentChapterDisplayProps) => {
  if (!chapter) return null;
  
  // Calculate chapter progress
  let progress = 0;
  let chapterEndTime = chapter.endTime || Infinity;
  
  if (isFinite(chapterEndTime)) {
    const chapterDuration = chapterEndTime - chapter.startTime;
    const timeInChapter = currentTime - chapter.startTime;
    progress = Math.min(100, Math.max(0, (timeInChapter / chapterDuration) * 100));
  }
  
  if (compact) {
    return (
      <div className="text-white text-sm truncate max-w-xs">
        <span className="text-gray-400">Chapter: </span>
        {chapter.title}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border-l-4" style={{ borderColor: chapter.color || '#3b82f6' }}>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-white font-medium text-lg">{chapter.title}</h3>
      </div>
      {chapter.description && (
        <p className="text-gray-300 text-sm mb-3">{chapter.description}</p>
      )}
      
      {isFinite(chapterEndTime) && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300" 
            style={{ 
              width: `${progress}%`, 
              backgroundColor: chapter.color || '#3b82f6' 
            }} 
          />
        </div>
      )}
    </div>
  );
};